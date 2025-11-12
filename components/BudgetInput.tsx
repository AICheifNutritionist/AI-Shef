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
    <div className="bg-gray-100 p-6 rounded-lg space-y-4 border border-gray-200">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="willing-to-shop" className="text-lg font-semibold text-gray-700">
            Готовы заказать недостающие продукты?
          </label>

          <div
            onClick={() => setWillingToShop(!willingToShop)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${willingToShop ? 'bg-green-600' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={willingToShop}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${willingToShop ? 'translate-x-6' : 'translate-x-1'}`}
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

        <p className="text-sm text-gray-500 mt-1">
          AI-шеф сможет предложить более интересные рецепты, если ему можно добавить 1-2 новых
          ингредиента.
        </p>
      </div>

      {willingToShop && (
        <div className="animate-fade-in">
          <label
            htmlFor="shopping-budget"
            className="block text-lg font-semibold text-gray-700 mb-2"
          >
            Макс. бюджет на докупку:{' '}
            <span className="text-green-600 font-bold">{shoppingBudget} руб.</span>
          </label>

          <input
            id="shopping-budget"
            type="range"
            min="100"
            max="2000"
            step="50"
            value={shoppingBudget}
            onChange={e => setShoppingBudget(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
        </div>
      )}
    </div>
  );
};
