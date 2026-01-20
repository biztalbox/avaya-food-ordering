import { MenuCategory } from '@/types/menu';
import heroCoffee from '@/assets/hero-coffee.jpg';
import heroBreakfast from '@/assets/hero-breakfast.jpg';
import heroPizza from '@/assets/hero-pizza.jpg';
import heroSalad from '@/assets/hero-salad.jpg';
import heroRolls from '@/assets/hero-rolls.jpg';

export const menuCategories: MenuCategory[] = [
  {
    id: 'coffee',
    name: 'COFFEE',
    tagline: 'Freshly brewed. Perfectly balanced.',
    heroImage: heroCoffee,
    layout: 'right',
    bgVariant: 'default',
    items: [
      { id: 'espresso', name: 'Espresso', price: 3.50, description: 'Pure & bold' },
      { id: 'americano', name: 'Americano', price: 4.00, description: 'Smooth & rich' },
      { id: 'latte', name: 'Caffè Latte', price: 4.50, description: 'Creamy classic' },
      { id: 'cappuccino', name: 'Cappuccino', price: 4.50, description: 'Frothy delight' },
      { id: 'mocha', name: 'Mocha', price: 5.00, description: 'Chocolate bliss' },
      { id: 'macchiato', name: 'Macchiato', price: 4.00, description: 'Espresso marked' },
      { id: 'flatwhite', name: 'Flat White', price: 4.50, description: 'Velvety smooth' },
      { id: 'coldBrew', name: 'Cold Brew', price: 5.00, description: 'Slow steeped' },
    ]
  },
  {
    id: 'breakfast',
    name: 'BREAKFAST',
    tagline: 'Start your day the Avaya way.',
    heroImage: heroBreakfast,
    layout: 'left',
    bgVariant: 'default',
    items: [
      { id: 'english', name: 'English Breakfast', price: 14.00, description: 'Full traditional' },
      { id: 'avocado', name: 'Avocado Toast', price: 11.00, description: 'Fresh & healthy' },
      { id: 'pancakes', name: 'Fluffy Pancakes', price: 12.00, description: 'Maple & berries' },
      { id: 'omelette', name: 'Garden Omelette', price: 10.00, description: 'Farm fresh eggs' },
      { id: 'croissant', name: 'Butter Croissant', price: 5.00, description: 'Flaky & golden' },
      { id: 'granola', name: 'Granola Bowl', price: 9.00, description: 'Crunchy & sweet' },
    ]
  },
  {
    id: 'pizza',
    name: 'PIZZA',
    tagline: 'Baked fresh, served hot.',
    heroImage: heroPizza,
    layout: 'right',
    bgVariant: 'dark',
    items: [
      { id: 'margherita', name: 'Margherita', price: 15.00, description: 'Classic italiano', isVeg: true },
      { id: 'pepperoni', name: 'Pepperoni', price: 17.00, description: 'Spicy & savory', isVeg: false },
      { id: 'quattro', name: 'Quattro Formaggi', price: 18.00, description: 'Four cheese blend', isVeg: true },
      { id: 'bbqChicken', name: 'BBQ Chicken', price: 18.00, description: 'Smoky & tender', isVeg: false },
      { id: 'veggie', name: 'Garden Veggie', price: 16.00, description: 'Fresh vegetables', isVeg: true },
      { id: 'truffle', name: 'Truffle Mushroom', price: 20.00, description: 'Earthy luxury', isVeg: true },
    ]
  },
  {
    id: 'salad',
    name: 'SALADS',
    tagline: 'Fresh. Vibrant. Wholesome.',
    heroImage: heroSalad,
    layout: 'left',
    bgVariant: 'light',
    items: [
      { id: 'caesar', name: 'Classic Caesar', price: 12.00, description: 'Crisp romaine' },
      { id: 'greek', name: 'Greek Salad', price: 11.00, description: 'Mediterranean fresh' },
      { id: 'quinoa', name: 'Quinoa Power', price: 13.00, description: 'Protein packed' },
      { id: 'garden', name: 'Garden Mix', price: 10.00, description: 'Seasonal greens' },
      { id: 'asian', name: 'Asian Sesame', price: 13.00, description: 'Tangy & crunchy' },
    ]
  },
  {
    id: 'rolls',
    name: 'ROLLS',
    tagline: 'Wrapped to perfection.',
    heroImage: heroRolls,
    layout: 'right',
    bgVariant: 'default',
    items: [
      { id: 'chickenWrap', name: 'Grilled Chicken', price: 11.00, description: 'Herb marinated', isVeg: false },
      { id: 'falafel', name: 'Falafel Wrap', price: 10.00, description: 'Crispy & fresh', isVeg: true },
      { id: 'paneer', name: 'Paneer Tikka', price: 10.00, description: 'Spiced cottage cheese', isVeg: true },
      { id: 'turkeyClub', name: 'Turkey Club', price: 12.00, description: 'Classic combo', isVeg: false },
      { id: 'vegMex', name: 'Veggie Mexican', price: 10.00, description: 'Beans & salsa', isVeg: true },
      { id: 'shrimpAvocado', name: 'Shrimp Avocado', price: 14.00, description: 'Coastal delight', isVeg: false },
    ]
  }
];
