import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiSearch, HiFilter } from "react-icons/hi";

const PRODUCT_CATEGORIES = [
  "All Items",
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Kitchenware",
  "Toys",
  "Sports"
];

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Vintage Wooden Chair",
    category: "Furniture",
    price: "Rp 250.000",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
  },
  {
    id: 2,
    name: "LED Desk Lamp",
    category: "Electronics",
    price: "Rp 120.000",
    condition: "Like New",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
  },
  {
    id: 3,
    name: "Casual Denim Jacket",
    category: "Clothing",
    price: "Rp 175.000",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
  },
  {
    id: 4,
    name: "Novel Collection (Set of 5)",
    category: "Books",
    price: "Rp 200.000",
    condition: "Good",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
  }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Here you would typically fetch data or filter results
  };

  // Filter products based on search query and selected category
  const filteredProducts = DUMMY_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Items" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Banner with Search */}
      <div className="h-16"></div>

      <div className="bg-gradient-to-r from-green-600 to-green-800 pb-16 pt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">
            Find Pre-loved Items at Affordable Prices
          </h1>
          <p className="text-green-100 text-center max-w-xl mx-auto mb-8">
            Browse through a wide selection of second-hand items and contribute to sustainable living
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  className="w-full px-5 py-3 pl-12 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-0 bg-white"
                />
                <HiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
              </div>
              <button
                type="submit"
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-r-lg font-medium transition duration-300"
              >
                Search
              </button>
              <button 
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="ml-2 bg-green-700 hover:bg-green-800 text-white p-3 rounded-lg transition duration-300 flex items-center"
                aria-label="Filter"
              >
                <HiFilter className="text-xl" />
              </button>
            </div>
            
            {/* Filter dropdown */}
            {isFilterOpen && (
              <div className="absolute mt-2 p-4 bg-white rounded-lg shadow-lg w-full z-10">
                <h3 className="font-medium text-gray-700 mb-2">Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PRODUCT_CATEGORIES.map(category => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-2 text-sm rounded-md transition ${
                        selectedCategory === category
                          ? 'bg-green-100 text-green-800 font-medium'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
      
      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedCategory === "All Items" ? "Available Items" : selectedCategory}
          </h2>
          <div className="text-sm text-gray-500">
            Showing {filteredProducts.length} items
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h3 className="text-lg font-medium text-gray-800 mt-2">{product.name}</h3>
                  <p className="text-green-700 font-bold mt-1">{product.price}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">Condition: {product.condition}</span>
                    <Link 
                      to={`/details/${product.id}`} 
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-gray-600">No items found matching your search.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Items");
                }}
                className="mt-4 text-green-600 hover:text-green-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
