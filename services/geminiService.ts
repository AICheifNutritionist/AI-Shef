import { GoogleGenAI, Type } from '@google/genai';
import type { Recipe, RecipeRequest, Ingredient } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error('API_KEY environment variable not set');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipes: {
      type: Type.ARRAY,
      description: 'Массив из 3 разных вариантов рецептов.',
      items: {
        type: Type.OBJECT,
        properties: {
          recipeName: { type: Type.STRING, description: 'Название рецепта' },
          description: { type: Type.STRING, description: 'Краткое, но аппетитное описание блюда' },
          cookingTime: {
            type: Type.STRING,
            description: "Время приготовления (например, '30 минут')",
          },
          estimatedCost: {
            type: Type.STRING,
            description: "Примерная стоимость блюда (например, '300 руб.')",
          },
          nutrition: {
            type: Type.OBJECT,
            properties: {
              calories: { type: Type.STRING, description: "Калорийность (например, '450 ккал')" },
              protein: { type: Type.STRING, description: "Белки (например, '30 г')" },
              fat: { type: Type.STRING, description: "Жиры (например, '15 г')" },
              carbs: { type: Type.STRING, description: "Углеводы (например, '50 г')" },
            },
            required: ['calories', 'protein', 'fat', 'carbs'],
          },
          ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: 'Название ингредиента' },
                amount: {
                  type: Type.STRING,
                  description: "Количество (например, '200 г' или '1 шт.')",
                },
              },
              required: ['name', 'amount'],
            },
          },
          instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING, description: 'Шаг инструкции по приготовлению' },
          },
          kitchenware: {
            type: Type.ARRAY,
            items: { type: Type.STRING, description: 'Необходимая посуда и утварь' },
          },
        },
        required: [
          'recipeName',
          'description',
          'cookingTime',
          'estimatedCost',
          'nutrition',
          'ingredients',
          'instructions',
          'kitchenware',
        ],
      },
    },
  },
  required: ['recipes'],
};

export async function generateRecipeAndImage(request: RecipeRequest): Promise<Recipe[]> {
  try {
    const prompt = `
            Ты — AI-шеф, эксперт в создании вкусных и уникальных рецептов. 
            Твоя цель — сгенерировать 3 (три) РАЗНЫХ и креативных варианта рецепта на русском языке на основе имеющихся у пользователя ингредиентов и его предпочтений.
            Каждый рецепт должен быть полноценным и отличаться от других (например, по способу приготовления, дополнительным ингредиентам, кухне мира).
            
            Имеющиеся ингредиенты пользователя: ${request.ingredients.join(', ')}.
            Желаемый тип блюда: ${request.mealType}.
            Максимальное время приготовления: ${request.cookingTime} минут.
            Вкусовые предпочтения: ${request.preferences.join(', ') || 'нет'}.
            Диетические ограничения: ${request.dietaryNeeds.join(', ') || 'нет'}.

            Информация о покупках:
            - Готовность докупить продукты: ${request.willingToShop ? 'Да' : 'Нет'}.
            - Бюджет на недостающие ингредиенты: ${request.willingToShop ? `${request.shoppingBudget} руб.` : 'N/A'}.

            Важные инструкции:
            1. Если пользователь готов докупить продукты, ты можешь предлагать рецепты, где не хватает 1-3 ключевых ингредиентов, но старайся, чтобы их стоимость укладывалась в указанный бюджет. 
            2. Если пользователь не готов докупать продукты, используй ТОЛЬКО имеющиеся у него ингредиенты и самые базовые (соль, перец, масло, вода).
            3. Для каждого рецепта создай подробное описание.
            
            Отвечай ТОЛЬКО валидным JSON-объектом, который соответствует предоставленной схеме. Объект должен содержать ключ "recipes" с массивом из трех рецептов. Не включай никакого markdown-форматирования, такого как \`\`\`json.
        `;

    const recipeResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: recipeSchema,
        thinkingConfig: { thinkingBudget: 24576 },
      },
    });

    let recipeDataArray;
    try {
      recipeDataArray = JSON.parse(recipeResponse.text).recipes;
    } catch (e) {
      console.error('Failed to parse JSON response from Gemini:', recipeResponse.text);
      throw new Error('AI-шеф вернул неожиданный ответ. Попробуйте сгенерировать рецепты еще раз.');
    }

    if (!recipeDataArray || !Array.isArray(recipeDataArray) || recipeDataArray.length === 0) {
      throw new Error(
        'AI не смог придумать рецепты из этих ингредиентов. Попробуйте изменить состав или параметры.'
      );
    }

    const fullRecipes = await Promise.all(
      recipeDataArray.map(
        async (
          recipeData: Omit<Recipe, 'imageUrl' | 'ingredients'> & {
            ingredients: { name: string; amount: string }[];
          }
        ) => {
          const availableIngredientsLower = request.ingredients.map(i => i.toLowerCase());
          const processedIngredients: Ingredient[] = recipeData.ingredients.map(
            (ing: { name: string; amount: string }) => {
              const hasIngredient = availableIngredientsLower.some(
                availIng =>
                  ing.name.toLowerCase().includes(availIng) ||
                  availIng.includes(ing.name.toLowerCase())
              );
              return { ...ing, status: hasIngredient ? 'have' : 'need' };
            }
          );

          const imagePrompt = `Фотореалистичное, аппетитное изображение готового блюда "${recipeData.recipeName}", профессиональная фуд-фотография, яркое освещение, крупный план, на красивой тарелке, студийный свет.`;

          const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              aspectRatio: '16:9',
              outputMimeType: 'image/jpeg',
            },
          });

          if (!imageResponse.generatedImages?.[0]?.image?.imageBytes) {
            console.error(`Image generation failed for recipe: ${recipeData.recipeName}`);
            throw new Error(`Не удалось создать изображение для "${recipeData.recipeName}".`);
          }

          const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
          const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

          return {
            ...recipeData,
            ingredients: processedIngredients,
            imageUrl: imageUrl,
          };
        }
      )
    );

    return fullRecipes;
  } catch (error) {
    console.error('Error in generateRecipeAndImage:', error);

    if (error instanceof Error) {
      if (
        error.message.startsWith('AI не смог') ||
        error.message.startsWith('AI-шеф вернул') ||
        error.message.startsWith('Не удалось создать изображение')
      ) {
        throw error;
      }
    }

    throw new Error(
      'Не удалось создать рецепты. AI-шеф может быть занят. Пожалуйста, попробуйте позже.'
    );
  }
}
