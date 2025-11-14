<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1u_FB_Fq67neyJLAmoX7-zaKlBzxzfdQ2

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Code Formatting

Проект использует Prettier для автоматического форматирования кода.

### Доступные команды:

- `npm run format` - отформатировать все файлы проекта
- `npm run format:check` - проверить форматирование без изменений

### Pre-commit хук

При каждом коммите автоматически запускается форматирование измененных файлов через husky + lint-staged. Для поддержания единого стиля кода.

### AI Chef

ИИ-Шеф — MVP интеллектуального ассистента по питанию, входящего в экосистему «Виртуального холодильника».

ИИ-Шеф использует искусственный интеллект для генерации персонализированных рецептов на основе введённых пользователем ингредиентов, предпочтений и времени на готовку. Он не просто предлагает рецепты — он анализирует состав, оценивает примерную стоимость порции и рассчитывает КБЖУ.

Проект задуман как первый шаг к полноценному «умному холодильнику», который автоматически отслеживает запасы, сроки годности и предлагает меню на неделю, экономя время, деньги и продукты.

* Презентация: https://drive.google.com/file/d/13dEc53Ja4_Rzgx8im6nPeCeuhmf9etlq/view?usp=sharing
* Видео: https://drive.google.com/file/d/1V5UxmEXk7JzzRsqdrxPfbSvVuCEuzkyZ/view?usp=sharing

