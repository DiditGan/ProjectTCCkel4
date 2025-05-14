import { useState } from "react";
import Navbar from "../components/Navbar";
import { HiOutlinePlus, HiPencil, HiTrash, HiPhotograph, HiX } from "react-icons/hi";

// Dummy user's products data
const DUMMY_USER_PRODUCTS = [
  {
    id: 101,
    name: "Vintage Wooden Chair",
    category: "Furniture",
    price: "Rp 250.000",
    priceNumeric: 250000,
    condition: "Good",
    description: "This beautiful vintage wooden chair is handcrafted with attention to detail.",
    status: "available", // available, sold
    datePosted: "2023-05-15",
    imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
    views: 24,
    interested: 3,
  },
  {
    id: 102,
    name: "LED Desk Lamp",
    category: "Electronics",
    price: "Rp 120.000",
    priceNumeric: 120000,
    condition: "Like New",
    description: "Modern LED desk lamp with adjustable brightness and color temperature.",
    status: "sold",
    datePosted: "2023-05-20",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
    views: 42,
    interested: 5,
  },
  {
    id: 103,
    name: "Casual Denim Jacket",
    category: "Clothing",
    price: "Rp 175.000",
    priceNumeric: 175000,
    condition: "Good",
    description: "Lightly used denim jacket, perfect for casual outings.",
    status: "available",
    datePosted: "2023-06-05",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
    views: 18,
    interested: 2,
  },
];

// Product categories
const PRODUCT_CATEGORIES = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Kitchenware",
  "Toys",
  "Sports",
  "Other"
];

// Product conditions
const PRODUCT_CONDITIONS = [
  "Like New",
  "Good",
  "Fair",
  "Poor"
];

const ManageProductsPage = () => {
  const [products, setProducts] = useState(DUMMY_USER_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // all, available, sold
  const [editingProduct, setEditingProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    condition: "",
    description: "",
    images: []
  });

  // Filter products based on status
  const filteredProducts = products.filter(product => {
    if (filterStatus === "all") return true;
    return product.status === filterStatus;
  });

  // Handle input change for new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imagePreviews => {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...imagePreviews]
      }));
    });
  };

  // Remove uploaded image
  const removeImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Submit new product
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.condition) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format the price
    let priceNumeric = Number(newProduct.price);
    let formattedPrice = `Rp ${priceNumeric.toLocaleString('id-ID')}`;

    // Create new product
    const createdProduct = {
      id: Date.now(), // generate unique ID
      ...newProduct,
      price: formattedPrice,
      priceNumeric,
      status: "available",
      datePosted: new Date().toISOString().split('T')[0],
      imageUrl: newProduct.images[0] || "https://via.placeholder.com/300x200?text=No+Image",
      views: 0,
      interested: 0
    };

    // Add to products list
    setProducts([createdProduct, ...products]);

    // Reset form and close modal
    setNewProduct({
      name: "",
      category: "",
      price: "",
      condition: "",
      description: "",
      images: []
    });
    setShowAddModal(false);
  };

  // Handle product status change
  const toggleProductStatus = (id) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newStatus = product.status === "available" ? "sold" : "available";
        return { ...product, status: newStatus };
      }
      return product;
    }));
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    setShowDeleteConfirm(null);
  };

  // Handle edit product button click
  const handleEditClick = (product) => {
    const priceValue = product.priceNumeric.toString();

    setEditingProduct({
      ...product,
      price: priceValue,
      images: product.imageUrl ? [product.imageUrl] : []
    });
    setShowEditModal(true);
  };

  // Handle input change for edit product form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload for edit form
  const handleEditImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(imagePreviews => {
      setEditingProduct(prev => ({
        ...prev,
        images: [...prev.images, ...imagePreviews]
      }));
    });
  };

  // Remove uploaded image from edit form
  const removeEditImage = (index) => {
    setEditingProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Submit edited product
  const handleEditSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!editingProduct.name || !editingProduct.category || !editingProduct.price || !editingProduct.condition) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format the price
    let priceNumeric = Number(editingProduct.price);
    let formattedPrice = `Rp ${priceNumeric.toLocaleString('id-ID')}`;

    // Update the product in the state
    const updatedProducts = products.map(product => {
      if (product.id === editingProduct.id) {
        return {
          ...editingProduct,
          price: formattedPrice,
          priceNumeric,
          imageUrl: editingProduct.images[0] || product.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"
        };
      }
      return product;
    });

    // Update state and close modal
    setProducts(updatedProducts);
    setShowEditModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="h-16"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Kelola Barang</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center"
          >
            <HiOutlinePlus className="mr-2" /> Tambah Barang Baru
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              filterStatus === "all" 
                ? "border-b-2 border-green-600 text-green-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFilterStatus("all")}
          >
            Semua
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              filterStatus === "available" 
                ? "border-b-2 border-green-600 text-green-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFilterStatus("available")}
          >
            Tersedia
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              filterStatus === "sold" 
                ? "border-b-2 border-green-600 text-green-600" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setFilterStatus("sold")}
          >
            Terjual
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produk
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statistik
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <img className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{product.price}</div>
                        <div className="text-sm text-gray-500">{product.condition}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.status === "available" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {product.status === "available" ? "Tersedia" : "Terjual"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Dilihat: {product.views}</div>
                        <div>Tertarik: {product.interested}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.datePosted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => toggleProductStatus(product.id)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          {product.status === "available" ? "Tandai Terjual" : "Tandai Tersedia"}
                        </button>
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Edit"
                        >
                          <HiPencil />
                        </button>
                        <button 
                          onClick={() => setShowDeleteConfirm(product.id)}
                          className="text-red-600 hover:text-red-900" 
                          title="Delete"
                        >
                          <HiTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                      Tidak ada barang yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Tambah Barang Baru</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Kursi Kayu Antik"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {PRODUCT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="Contoh: 250000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={newProduct.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Pilih Kondisi</option>
                  {PRODUCT_CONDITIONS.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Barang
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Deskripsikan barang anda secara detail..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Barang
                </label>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {newProduct.images.map((image, index) => (
                    <div key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        title="Remove image"
                      >
                        <HiX />
                      </button>
                    </div>
                  ))}
                  
                  {newProduct.images.length < 5 && (
                    <label className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <HiPhotograph className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 text-center mt-1">
                          Tambah Foto
                        </span>
                      </div>
                    </label>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">
                  Anda dapat mengunggah hingga 5 foto. Format: JPG, PNG. Ukuran maksimum: 5MB per foto.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Tambah Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Edit Barang</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingProduct(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <HiX className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="mb-4">
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Barang <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                  placeholder="Contoh: Kursi Kayu Antik"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="edit-category"
                    name="category"
                    value={editingProduct.category}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {PRODUCT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="edit-price"
                    name="price"
                    value={editingProduct.price}
                    onChange={handleEditInputChange}
                    placeholder="Contoh: 250000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Kondisi <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-condition"
                  name="condition"
                  value={editingProduct.condition}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Pilih Kondisi</option>
                  {PRODUCT_CONDITIONS.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Barang
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditInputChange}
                  placeholder="Deskripsikan barang anda secara detail..."
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status Barang
                </label>
                <select
                  id="edit-status"
                  name="status"
                  value={editingProduct.status}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="available">Tersedia</option>
                  <option value="sold">Terjual</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Barang
                </label>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {editingProduct.images.map((image, index) => (
                    <div key={index} className="relative h-24 bg-gray-100 rounded-md overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`} 
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeEditImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        title="Remove image"
                      >
                        <HiX />
                      </button>
                    </div>
                  ))}
                  
                  {editingProduct.images.length < 5 && (
                    <label className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleEditImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center">
                        <HiPhotograph className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 text-center mt-1">
                          Tambah Foto
                        </span>
                      </div>
                    </label>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">
                  Anda dapat mengunggah hingga 5 foto. Format: JPG, PNG. Ukuran maksimum: 5MB per foto.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                  }}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Hapus</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin menghapus barang ini? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteProduct(showDeleteConfirm)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
