import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiUser, HiShoppingBag, HiClipboardList, HiCog, HiLogout, HiEye } from "react-icons/hi";

// Dummy user data
const DUMMY_USER = {
  id: 1,
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "08123456789",
  address: "Jl. Sudirman No. 123, Jakarta Pusat",
  joinDate: "2023-01-15",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=240&q=80"
};

// Dummy transaction history
const DUMMY_TRANSACTIONS = [
  {
    id: "TRX001",
    type: "purchase",
    product: {
      name: "Vintage Wooden Chair",
      imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
      seller: "Budi Santoso"
    },
    quantity: 1,
    total: 250000,
    status: "completed",
    date: "2023-06-15",
    paymentMethod: "Transfer Bank"
  },
  {
    id: "TRX002",
    type: "purchase", 
    product: {
      name: "LED Desk Lamp",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80",
      seller: "Anita Wijaya"
    },
    quantity: 1,
    total: 122500,
    status: "pending",
    date: "2023-06-20",
    paymentMethod: "E-Wallet (OVO)"
  }
];

// Dummy sales history 
const DUMMY_SALES = [
  {
    id: "SALE001",
    product: {
      name: "Novel Collection (Set of 5)",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
    },
    buyer: "Sarah Johnson",
    quantity: 1,
    total: 200000,
    status: "sold",
    date: "2023-06-10"
  }
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [sales, setSales] = useState([]);
  const [activeTab, setActiveTab] = useState("purchases");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(DUMMY_USER);
        setTransactions(DUMMY_TRANSACTIONS);
        setSales(DUMMY_SALES);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user session
    navigate('/'); // Redirect to landing page
    // Optionally, you might want to refresh the window or trigger a state update in App.jsx
    // to ensure Navbar updates immediately if it relies on App-level state for user info.
    // For now, localStorage change should be picked up by Navbar on next render or useEffect.
    window.location.reload(); // Force reload to update Navbar state
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      sold: "bg-blue-100 text-blue-800"
    };

    const labels = {
      completed: "Selesai",
      pending: "Menunggu",
      cancelled: "Dibatalkan", 
      sold: "Terjual"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-16"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* User Info */}
              <div className="p-6 text-center border-b">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                />
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Bergabung sejak {new Date(user.joinDate).toLocaleDateString('id-ID')}
                </p>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab("purchases")}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-left transition ${
                        activeTab === "purchases"
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <HiShoppingBag className="mr-3" />
                      Riwayat Pembelian
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("sales")}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-left transition ${
                        activeTab === "sales"
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <HiClipboardList className="mr-3" />
                      Riwayat Penjualan
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/manage-products"
                      className="w-full flex items-center px-3 py-2 rounded-md text-left text-gray-700 hover:bg-gray-100 transition"
                    >
                      <HiCog className="mr-3" />
                      Kelola Barang
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center px-3 py-2 rounded-md text-left transition ${
                        activeTab === "settings"
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <HiUser className="mr-3" />
                      Pengaturan Profil
                    </button>
                  </li>
                  <li className="border-t pt-2 mt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 rounded-md text-left text-red-600 hover:bg-red-50 transition"
                    >
                      <HiLogout className="mr-3" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Purchase History */}
            {activeTab === "purchases" && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Riwayat Pembelian</h2>
                </div>
                <div className="p-6">
                  {transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map(transaction => (
                        <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-800">#{transaction.id}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{transaction.date}</span>
                            </div>
                            {getStatusBadge(transaction.status)}
                          </div>
                          
                          <div className="flex items-center">
                            <img
                              src={transaction.product.imageUrl}
                              alt={transaction.product.name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{transaction.product.name}</h4>
                              <p className="text-sm text-gray-600">Penjual: {transaction.product.seller}</p>
                              <p className="text-sm text-gray-600">Jumlah: {transaction.quantity}</p>
                              <p className="text-sm text-gray-600">Pembayaran: {transaction.paymentMethod}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                Rp {transaction.total.toLocaleString('id-ID')}
                              </p>
                              <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <HiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Belum ada riwayat pembelian</p>
                      <Link to="/home" className="text-green-600 hover:text-green-800 font-medium mt-2 inline-block">
                        Mulai Belanja
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sales History */}
            {activeTab === "sales" && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Riwayat Penjualan</h2>
                </div>
                <div className="p-6">
                  {sales.length > 0 ? (
                    <div className="space-y-4">
                      {sales.map(sale => (
                        <div key={sale.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-800">#{sale.id}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{sale.date}</span>
                            </div>
                            {getStatusBadge(sale.status)}
                          </div>
                          
                          <div className="flex items-center">
                            <img
                              src={sale.product.imageUrl}
                              alt={sale.product.name}
                              className="w-16 h-16 object-cover rounded-md mr-4"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800">{sale.product.name}</h4>
                              <p className="text-sm text-gray-600">Pembeli: {sale.buyer}</p>
                              <p className="text-sm text-gray-600">Jumlah: {sale.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-green-600">
                                Rp {sale.total.toLocaleString('id-ID')}
                              </p>
                              <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                                Lihat Detail
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <HiClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Belum ada penjualan</p>
                      <Link to="/manage-products" className="text-green-600 hover:text-green-800 font-medium mt-2 inline-block">
                        Jual Barang Pertama
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Settings */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800">Pengaturan Profil</h2>
                </div>
                <div className="p-6">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        defaultValue={user.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alamat
                      </label>
                      <textarea
                        defaultValue={user.address}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 transition">
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
