import type { DemoMenuItem } from '../demoData';
import type { FoodAddon, FoodChoiceGroup, FoodItemConfiguration } from './types';

const sides: FoodChoiceGroup = {
  id: 'side',
  title: 'Choose your side',
  subtitle: 'Select 1',
  required: true,
  options: [
    { id: 'fries', label: 'Seasoned fries', priceDelta: 0 },
    { id: 'salad', label: 'Fresh side salad', priceDelta: 1500 },
    { id: 'sweet-potato', label: 'Sweet potato fries', priceDelta: 2500 },
  ],
};

const standardAddons: FoodAddon[] = [
  { id: 'cheese', label: 'Extra cheese', price: 2500 },
  { id: 'avocado', label: 'Avocado', price: 3000 },
  { id: 'sauce', label: 'Extra house sauce', price: 1500 },
];

function pizzaConfiguration(): FoodItemConfiguration {
  return {
    maxQuantity: 12,
    choiceGroups: [
      {
        id: 'size',
        title: 'Choose a size',
        subtitle: 'Required',
        required: true,
        options: [
          { id: 'small', label: 'Small', priceDelta: 0 },
          { id: 'medium', label: 'Medium', priceDelta: 6000 },
          { id: 'large', label: 'Large', priceDelta: 11000 },
        ],
      },
      {
        id: 'crust',
        title: 'Choose your crust',
        subtitle: 'Required',
        required: true,
        options: [
          { id: 'classic', label: 'Classic crust', priceDelta: 0 },
          { id: 'thin', label: 'Thin crust', priceDelta: 0 },
          { id: 'stuffed', label: 'Stuffed crust', priceDelta: 4500 },
        ],
      },
    ],
    addons: [
      { id: 'extra-cheese', label: 'Extra mozzarella', price: 3000 },
      { id: 'pepperoni', label: 'Pepperoni', price: 4500 },
      { id: 'jalapenos', label: 'Jalapeños', price: 2000 },
    ],
  };
}

function chickenConfiguration(): FoodItemConfiguration {
  return {
    maxQuantity: 12,
    choiceGroups: [
      {
        id: 'sauce',
        title: 'Choose your sauce',
        subtitle: 'Select 1',
        required: true,
        options: [
          { id: 'mild', label: 'Mild', priceDelta: 0 },
          { id: 'hot', label: 'Hot chilli', priceDelta: 0 },
          { id: 'bbq', label: 'Smoky BBQ', priceDelta: 0 },
        ],
      },
      sides,
    ],
    addons: [
      { id: 'coleslaw', label: 'Extra coleslaw', price: 2000 },
      { id: 'roll', label: 'Extra roll', price: 1500 },
      { id: 'avocado', label: 'Avocado', price: 3000 },
    ],
  };
}

function burgerConfiguration(): FoodItemConfiguration {
  return {
    maxQuantity: 10,
    choiceGroups: [
      {
        id: 'cook',
        title: 'How would you like it?',
        subtitle: 'Select 1',
        required: true,
        options: [
          { id: 'standard', label: 'Restaurant standard', priceDelta: 0 },
          { id: 'well-done', label: 'Well done', priceDelta: 0 },
        ],
      },
      sides,
    ],
    addons: standardAddons,
  };
}

function breakfastConfiguration(): FoodItemConfiguration {
  return {
    maxQuantity: 8,
    choiceGroups: [
      {
        id: 'eggs',
        title: 'Egg preference',
        subtitle: 'Required',
        required: true,
        options: [
          { id: 'fried', label: 'Fried', priceDelta: 0 },
          { id: 'scrambled', label: 'Scrambled', priceDelta: 0 },
          { id: 'omelette', label: 'Omelette', priceDelta: 1500 },
        ],
      },
    ],
    addons: [
      { id: 'sausage', label: 'Extra sausage', price: 3000 },
      { id: 'toast', label: 'Extra toast', price: 1500 },
      { id: 'avocado', label: 'Avocado', price: 3000 },
    ],
  };
}

function drinkConfiguration(): FoodItemConfiguration {
  return {
    maxQuantity: 12,
    choiceGroups: [
      {
        id: 'size',
        title: 'Choose a size',
        subtitle: 'Required',
        required: true,
        options: [
          { id: 'regular', label: 'Regular', priceDelta: 0 },
          { id: 'large', label: 'Large', priceDelta: 2500 },
        ],
      },
    ],
    addons: [],
  };
}

function defaultConfiguration(): FoodItemConfiguration {
  return {
    maxQuantity: 10,
    choiceGroups: [
      {
        id: 'portion',
        title: 'Choose a portion',
        subtitle: 'Required',
        required: true,
        options: [
          { id: 'regular', label: 'Regular', priceDelta: 0 },
          { id: 'large', label: 'Large', priceDelta: 4000 },
        ],
      },
    ],
    addons: standardAddons,
  };
}

export function foodConfigurationFor(item: DemoMenuItem): FoodItemConfiguration {
  const category = item.category.toLowerCase();
  const name = item.name.toLowerCase();
  if (category.includes('pizza') || name.includes('pizza')) return pizzaConfiguration();
  if (category.includes('chicken') || category.includes('grill') || name.includes('chicken') || name.includes('tilapia')) return chickenConfiguration();
  if (category.includes('burger') || name.includes('burger') || name.includes('sandwich') || name.includes('wrap')) return burgerConfiguration();
  if (category.includes('breakfast') || name.includes('breakfast')) return breakfastConfiguration();
  if (category.includes('drink') || name.includes('juice') || name.includes('latte') || name.includes('soda')) return drinkConfiguration();
  return defaultConfiguration();
}

export function defaultSelectionsFor(item: DemoMenuItem): Record<string, string> {
  const config = foodConfigurationFor(item);
  return Object.fromEntries(config.choiceGroups.filter((group) => group.required).map((group) => [group.id, group.options[0]?.id ?? '']));
}
