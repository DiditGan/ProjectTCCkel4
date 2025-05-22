import React from 'react';
import '../styles/ProductCard.css'; // Import the new CSS

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image || 'https://via.placeholder.com/300x200.png?text=No+Image'} alt={product.name} className="product-card-image" />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <div> {/* Wrapper for price and button to ensure they are grouped */}
          <p className="product-card-price">${product.price.toFixed(2)}</p>
          <button className="product-card-button">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
