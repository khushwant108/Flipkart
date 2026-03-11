import React from 'react';

function FilterSidebar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <aside className="filter-sidebar">
      <h3 className="filter-title">Filters</h3>

      <div className="filter-section">
        <h4 className="filter-section-title">CATEGORY</h4>
        <ul className="filter-list">
          <li
            className={`filter-item ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onSelectCategory('')}
          >
            All
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`filter-item ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.slug)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default FilterSidebar;
