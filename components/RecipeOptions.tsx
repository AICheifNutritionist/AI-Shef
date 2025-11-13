import React from 'react';

interface RecipeOptionsProps {
  mealType: string;
  setMealType: (value: string) => void;
  cookingTime: number;
  setCookingTime: (value: number) => void;
  preferences: string[];
  setPreferences: (value: string[]) => void;
  dietaryNeeds: string[];
  setDietaryNeeds: (value: string[]) => void;
}

const mealTypes = ['Завтрак', 'Обед', 'Ужин', 'Перекус', 'Десерт'];
const allPreferences = [
  'Острое',
  'Сладкое',
  'Соленое',
  'Здоровое',
  'Домашняя еда',
  'Быстро и просто',
];
const allDietaryNeeds = ['Вегетарианское', 'Веганское', 'Без глютена', 'Без лактозы', 'Без орехов'];

const ToggleChip: React.FC<{ label: string; isSelected: boolean; onToggle: () => void }> = ({
  label,
  isSelected,
  onToggle,
}) => (
  <button
    onClick={onToggle}
    className={`px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-medium rounded-full border transition-all duration-200 min-h-[40px] ${
      isSelected
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);

export const RecipeOptions: React.FC<RecipeOptionsProps> = props => {
  const {
    mealType,
    setMealType,
    cookingTime,
    setCookingTime,
    preferences,
    setPreferences,
    dietaryNeeds,
    setDietaryNeeds,
  } = props;

  const toggleItem = <T,>(list: T[], setList: (list: T[]) => void, item: T) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="space-y-5 md:space-y-6 overflow-hidden">
      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">Тип блюда</h3>
        <div className="flex flex-wrap gap-2 -mr-1">
          {mealTypes.map(type => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-semibold rounded-lg transition-colors min-h-[40px] ${
                mealType === type
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="pr-1">
        <label
          htmlFor="cooking-time"
          className="block text-base md:text-lg font-semibold text-gray-700 mb-3"
        >
          Макс. время готовки: <span className="text-green-600 font-bold">{cookingTime} мин</span>
        </label>
        <div className="px-1">
          <input
            id="cooking-time"
            type="range"
            min="10"
            max="120"
            step="5"
            value={cookingTime}
            onChange={e => setCookingTime(Number(e.target.value))}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>
      </div>

      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">Предпочтения</h3>
        <div className="flex flex-wrap gap-2 -mr-1">
          {allPreferences.map(pref => (
            <ToggleChip
              key={pref}
              label={pref}
              isSelected={preferences.includes(pref)}
              onToggle={() => toggleItem(preferences, setPreferences, pref)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">
          Диетические особенности
        </h3>
        <div className="flex flex-wrap gap-2 -mr-1">
          {allDietaryNeeds.map(diet => (
            <ToggleChip
              key={diet}
              label={diet}
              isSelected={dietaryNeeds.includes(diet)}
              onToggle={() => toggleItem(dietaryNeeds, setDietaryNeeds, diet)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
