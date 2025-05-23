import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiOutlineShoppingCart, HiOutlinePhone, HiArrowLeft, HiOutlineLocationMarker } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";

// API URL
const API_BASE_URL = "http://localhost:5000";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/barang/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        
        const data = await response.json();
        
        // Helper function to get full image URL
        const getImageUrl = (imagePath) => {
          if (!imagePath) return null;
          if (imagePath.startsWith('http')) return imagePath;
          return `${API_BASE_URL}${imagePath}`;
        };
        
        // Format data for component use
        const productData = {
          ...data,
          images: data.image_url ? [getImageUrl(data.image_url)] : []
        };
        
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);
  
  // Format price to Rupiah
  const formatPrice = (price) => {
    return `Rp ${parseInt(price).toLocaleString('id-ID')}`;
  };

  const handleContactSeller = () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/details/${id}` } });
      return;
    }
    
    // Navigate to messages page with seller and product info
    navigate('/messages', { 
      state: { 
        recipientId: product.user?.user_id, 
        recipientName: product.user?.name,
        productId: product.item_id,
        productName: product.item_name
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product not found</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/home" className="text-green-600 hover:text-green-800 font-medium flex items-center justify-center">
            <HiArrowLeft className="mr-2" /> Back to homepage
          </Link>
        </div>
      </div>
    );
  }

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
                  src={product.images[activeImage] || "https://via.placeholder.com/600x400?text=No+Image"} 
                  alt={product.item_name} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                  }}
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
                      <img 
                        src={img} 
                        alt={`${product.item_name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">{product.item_name}</h1>
                <p className="text-2xl text-green-700 font-bold mt-2">{formatPrice(product.price)}</p>
                
                <div className="flex items-center mt-4">
                  <span className="text-gray-600 mr-4">Condition:</span>
                  <span className="font-medium text-gray-800">{product.condition}</span>
                </div>
                
                <div className="flex items-center mt-2">
                  <HiOutlineLocationMarker className="text-gray-500 mr-2" />
                  <span className="text-gray-600">{product.location || "Location not specified"}</span>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
                
                <div className="mt-8 pt-6">
                  <p className="text-sm text-gray-500 mb-1">Listed by {product.user?.name}</p>
                  <p className="text-sm text-gray-500">Posted on {new Date(product.date_posted).toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => navigate('/checkout', { state: { productId: product.item_id } })}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
                  >
                    <HiOutlineShoppingCart className="mr-2" />
                    Beli
                  </button>
                  <button 
                    onClick={handleContactSeller}
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
