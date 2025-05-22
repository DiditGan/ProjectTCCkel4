import React from 'react';
import ProductCard from '../components/ProductCard';

// Dummy data for products (replace with actual data source)
const dummyProducts = [
  { id: 1, name: 'Vintage Denim Jacket', description: 'A cool vintage denim jacket from the 90s.', price: 45.00, image: 'https://via.placeholder.com/300x200/AACCFF/000000?text=Denim+Jacket' },
  { id: 2, name: 'Retro Graphic T-Shirt', description: 'Comfortable cotton t-shirt with a retro design.', price: 18.50, image: 'https://via.placeholder.com/300x200/FFDDAA/000000?text=Graphic+T-Shirt' },
  { id: 3, name: 'Classic Leather Boots', description: 'Durable leather boots, gently used.', price: 70.00, image: 'https://via.placeholder.com/300x200/BBAAFF/000000?text=Leather+Boots' },
  { id: 4, name: 'Old School Sneakers', description: 'Stylish sneakers with a lot of life left.', price: 35.00, image: 'https://via.placeholder.com/300x200/AAFFAA/000000?text=Sneakers' },
  { id: 5, name: 'Antique Table Lamp', description: 'A beautiful antique lamp to add character to your room.', price: 60.00, image: 'https://via.placeholder.com/300x200/CCCCCC/000000?text=Table+Lamp' },
  { id: 6, name: 'Used Novel Collection', description: 'A set of popular novels in good condition.', price: 22.00, image: 'https://via.placeholder.com/300x200/FFAACC/000000?text=Book+Collection' },
];

const Products = () => {
  return (
    <div className="page-wrapper">
      <h1 className="page-title">Our Products</h1>
      <div className="product-grid"> {/* Use the grid class from App.css */}
        {dummyProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
