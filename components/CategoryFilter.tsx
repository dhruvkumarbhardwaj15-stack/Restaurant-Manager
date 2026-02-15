
import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = Object.values(Category);

  return (
    <div className="flex overflow-x-auto py-4 gap-2 no-scrollbar scroll-smooth">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeCategory === category
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
