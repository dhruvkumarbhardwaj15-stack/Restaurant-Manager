
import { FoodItem, Category, RestaurantProfile } from './types';

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Truffle Mushroom Risotto',
    description: 'Arborio rice slowly cooked with wild mushrooms, finished with white truffle oil and parmesan.',
    price: 18.50,
    category: Category.MainCourse,
    image: 'https://picsum.photos/id/42/800/600'
  },
  {
    id: '2',
    name: 'Seared Scallops',
    description: 'Fresh Atlantic scallops seared to perfection with pea purée and crispy pancetta.',
    price: 14.00,
    category: Category.Starters,
    image: 'https://picsum.photos/id/102/800/600'
  },
  {
    id: '3',
    name: 'Lava Chocolate Cake',
    description: 'Rich dark chocolate cake with a molten center, served with Madagascan vanilla gelato.',
    price: 9.50,
    category: Category.Desserts,
    image: 'https://picsum.photos/id/106/800/600'
  },
  {
    id: '4',
    name: 'Signature Old Fashioned',
    description: 'Burbon aged in oak barrels, hints of orange peel and house-made aromatic bitters.',
    price: 12.00,
    category: Category.Beverages,
    image: 'https://picsum.photos/id/163/800/600'
  },
  {
    id: '5',
    name: 'Garden Harvest Salad',
    description: 'Organic greens, heirloom tomatoes, cucumber, goat cheese, and balsamic glaze.',
    price: 11.50,
    category: Category.Starters,
    image: 'https://picsum.photos/id/493/800/600'
  },
  {
    id: '6',
    name: 'Wagyu Beef Burger',
    description: 'Premium wagyu patty, caramelized onions, aged cheddar, and truffle aioli on brioche.',
    price: 22.00,
    category: Category.MainCourse,
    image: 'https://picsum.photos/id/488/800/600'
  }
];

export const APP_THEME_COLOR = 'indigo-600';

export const DEFAULT_RESTAURANT_PROFILE: RestaurantProfile = {
  name: "Dhruv Restaurants",
  address: "123 Culinary Avenue, Food City, FC 90210",
  contact: "9876543210",
  logo: "",
  ownerName: "Dhruv",
  receiptHeader: "Thank you for ordering from Dhruv Restaurants! 🥗\nWe serve the best food in town.",
  receiptFooter: "We hope you enjoy your meal! ✨\nPlease leave us a review on Google.",
  themeColor: 'indigo',
  fontPair: 'modern'
};
