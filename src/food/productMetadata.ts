import type { DemoMenuItem, DemoRestaurant } from '../demoData';
import type { ProductMetadata } from '../catalog/types';

function nutritionFor(item: DemoMenuItem) {
  const text = `${item.name} ${item.description} ${item.category}`.toLowerCase();
  if (text.includes('salad') || text.includes('vegetable') || text.includes('fruit')) return [
    {label:'Energy',value:'Varies by portion'},
    {label:'Fibre',value:'Source of fibre'},
    {label:'Serving',value:'1 prepared portion'},
  ];
  if (text.includes('juice') || text.includes('soda') || text.includes('latte')) return [
    {label:'Serving',value:'1 drink'},
    {label:'Energy',value:'Varies by size'},
    {label:'Sugar',value:'See preparation / drink label'},
  ];
  return [
    {label:'Serving',value:'1 prepared portion'},
    {label:'Energy',value:'Varies by selected options'},
    {label:'Protein',value:'Varies by recipe'},
    {label:'Carbohydrate',value:'Varies by recipe'},
  ];
}

function allergensFor(item: DemoMenuItem) {
  const text = `${item.name} ${item.description}`.toLowerCase();
  const values: string[] = [];
  if (/bread|bun|toast|chapati|pancake|cake|pizza|wrap|brownie|sandwich/.test(text)) values.push('Wheat / gluten');
  if (/cheese|milk|cream|latte|mozzarella|mayo|sauce|cheesecake/.test(text)) values.push('Milk / dairy');
  if (/egg|mayo|pancake/.test(text)) values.push('Egg');
  return values.length ? values : ['Ask the restaurant about allergens before ordering if you have a food allergy.'];
}

function ingredientsFor(item: DemoMenuItem) {
  return item.description
    .replace(/\.$/,'')
    .split(/,|\band\b/i)
    .map((value) => value.trim())
    .filter((value) => value.length > 2)
    .slice(0,8);
}

export function foodProductMetadataFor(item: DemoMenuItem, restaurant: DemoRestaurant): ProductMetadata {
  const vegetarian = !/chicken|beef|goat|tilapia|sausage|pepperoni|wings|bacon|meat/i.test(`${item.name} ${item.description}`);
  return {
    brand:{ id:restaurant.id, name:restaurant.name },
    manufacturer:`Prepared by ${restaurant.name}`,
    sku:`FOOD-${item.id.toUpperCase()}`,
    unitValue:'1',
    unitType:'prepared serving',
    maximumCartQuantity:12,
    averageRating:restaurant.rating,
    ratingCount:Number.parseInt(restaurant.reviews.replace(/[^0-9]/g,''),10) || undefined,
    vegetarian,
    halal:false,
    verifiedSeller:true,
    nutritionFacts:nutritionFor(item),
    nutritionSummary:['Nutrition is indicative until the live restaurant catalogue provides recipe-level values.'],
    ingredients:ingredientsFor(item),
    allergens:allergensFor(item),
    storageInstructions:'Prepared for immediate consumption. Follow restaurant guidance for leftovers.',
    returnPolicy:'Prepared food is generally non-returnable; contact support for quality or order issues.',
  };
}
