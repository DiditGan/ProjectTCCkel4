import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiOutlineShoppingCart, HiOutlinePhone, HiArrowLeft, HiOutlineLocationMarker } from "react-icons/hi";

// Dummy product data
const DUMMY_PRODUCT_DETAILS = {
  1: {
    id: 1,
    name: "Vintage Wooden Chair",
    category: "Furniture",
    price: "Rp 250.000",
    priceNumeric: 250000,
    condition: "Good",
    description: "This beautiful vintage wooden chair is handcrafted with attention to detail. Made from solid oak, it features intricate carvings and a comfortable seat. Perfect for adding a touch of elegance to any living space or office. Minor scratches on the legs, but otherwise in excellent condition.",
    quantity: 1,
    location: "Jakarta Selatan",
    sellerName: "Budi Santoso",
    sellerContact: "628123456789",
    datePosted: "2023-05-15",
    images: [
      "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
      "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
    ]
  },
  2: {
    id: 2,
    name: "LED Desk Lamp",
    category: "Electronics",
    price: "Rp 120.000",
    priceNumeric: 120000,
    condition: "Like New",
    description: "Modern LED desk lamp with adjustable brightness and color temperature. Includes USB charging port. Barely used, still in original packaging.",
    quantity: 3,
    location: "Bandung",
    sellerName: "Anita Wijaya",
    sellerContact: "628234567890",
    datePosted: "2023-05-20",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
    ]
  }
};

const DetailPage = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  
  // In a real app, you'd fetch this data from an API
  // For now, we're using our dummy data
  const product = DUMMY_PRODUCT_DETAILS[id || 1];
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <Link to="/home" className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center">
            <HiArrowLeft className="mr-2" /> Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  const contactSeller = () => {
    window.open(`https://wa.me/${product.sellerContact}?text=Hi! I'm interested in your ${product.name} listing.`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-16"></div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link to="/home" className="inline-flex items-center text-green-600 hover:text-green-800 font-medium mb-6">
          <HiArrowLeft className="mr-2" /> Back to all items
        </Link>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-6">
              <div className="h-80 md:h-96 overflow-hidden rounded-lg mb-4">
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 mt-4">
                  {product.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
                        activeImage === index ? 'border-green-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="md:w-1/2 p-6">
              <div className="mb-8">
                <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
                <p className="text-2xl text-green-700 font-bold mt-2">{product.price}</p>
                
                <div className="flex items-center mt-4">
                  <span className="text-gray-600 mr-4">Condition:</span>
                  <span className="font-medium text-gray-800">{product.condition}</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <HiOutlineLocationMarker className="text-gray-500 mr-2" />
                  <span className="text-gray-600">{product.location}</span>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                
                <div className="mt-8 pt-6">
                  <p className="text-sm text-gray-500 mb-1">Listed by {product.sellerName}</p>
                  <p className="text-sm text-gray-500">Posted on {product.datePosted}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                  >
                    <HiOutlineShoppingCart className="mr-2" />
                    Beli
                  </button>
                  <button 
                    onClick={contactSeller}
                    className="bg-green-100 text-green-800 py-3 px-6 rounded-lg font-medium hover:bg-green-200 transition flex items-center justify-center"
                  >
                    <HiOutlinePhone className="mr-2" />
                    Contact Seller
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
