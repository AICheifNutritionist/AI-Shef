import React from 'react';

interface BudgetInputProps {
  willingToShop: boolean;
  setWillingToShop: (value: boolean) => void;
  shoppingBudget: number;
  setShoppingBudget: (value: number) => void;
}

export const BudgetInput: React.FC<BudgetInputProps> = props => {
  const { willingToShop, setWillingToShop, shoppingBudget, setShoppingBudget } = props;

  return (
    <div className="bg-gray-100 p-4 md:p-6 rounded-lg space-y-4 border border-gray-200 overflow-hidden">
      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="willing-to-shop"
            className="text-sm md:text-base lg:text-lg font-semibold text-gray-700"
          >
            Готовы заказать недостающие продукты?
          </label>

          <div
            onClick={() => setWillingToShop(!willingToShop)}
            className={`relative inline-flex items-center h-7 md:h-8 rounded-full w-12 md:w-14 cursor-pointer transition-colors flex-shrink-0 ${willingToShop ? 'bg-green-600' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={willingToShop}
          >
            <span
              className={`inline-block w-5 md:w-6 h-5 md:h-6 transform bg-white rounded-full transition-transform ${willingToShop ? 'translate-x-6 md:translate-x-7' : 'translate-x-1'}`}
            />
          </div>

          <input
            id="willing-to-shop"
            type="checkbox"
            className="sr-only"
            checked={willingToShop}
            onChange={() => setWillingToShop(!willingToShop)}
          />
        </div>

        <p className="text-xs md:text-sm text-gray-500 mt-2">
          AI-шеф сможет предложить более интересные рецепты, если ему можно добавить 1-2 новых
          ингредиента.
        </p>
      </div>

      {willingToShop && (
        <div className="animate-fade-in pr-1">
          <label
            htmlFor="shopping-budget"
            className="block text-sm md:text-base lg:text-lg font-semibold text-gray-700 mb-3"
          >
            Макс. бюджет на докупку:{' '}
            <span className="text-green-600 font-bold">{shoppingBudget} руб.</span>
          </label>

          <div className="px-1">
            <input
              id="shopping-budget"
              type="range"
              min="100"
              max="2000"
              step="50"
              value={shoppingBudget}
              onChange={e => setShoppingBudget(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>
        </div>
      )}
    </div>
  );
};
