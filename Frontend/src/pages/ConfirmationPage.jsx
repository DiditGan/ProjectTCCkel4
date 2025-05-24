import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiCheckCircle, HiHome, HiShoppingBag, HiExclamationCircle } from "react-icons/hi";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // Get transaction from location state
    const transactionData = location.state?.transaction;
    
    if (!transactionData) {
      // Redirect if no transaction data
      console.error("No transaction data found in navigation state");
      // Wait a moment before navigating away to allow for debugging
      setTimeout(() => navigate('/'), 500);
      return;
    }
    
    console.log("Received transaction data:", transactionData);
    setTransaction(transactionData);
  }, [location.state, navigate]);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-16"></div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <HiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil Dibuat!</h1>
          <p className="text-gray-600 mb-6">Terima kasih telah membeli di GiveTzy</p>
          
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border text-left">
            <div className="mb-4">
              <span className="text-sm text-gray-500">ID Transaksi:</span>
              <p className="font-medium text-gray-800">{transaction.id}</p>
            </div>
            
            <div className="flex items-center mb-4 pb-4 border-b">
              {transaction.product.imageUrl ? (
                <img
                  src={transaction.product.imageUrl}
                  alt={transaction.product.name}
                  className="w-16 h-16 object-cover rounded-md mr-4 bg-gray-100"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.parentNode.classList.add("bg-gray-300");
                    e.target.classList.add("opacity-0");
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-md mr-4 flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-800">{transaction.product.name}</h3>
                <p className="text-sm text-gray-600">Jumlah: {transaction.quantity}</p>
                <p className="text-green-600 font-semibold">
                  Rp {(transaction.product.priceNumeric * transaction.quantity).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Status Pesanan:</span>
                <p className="font-medium text-yellow-600 capitalize">{transaction.status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Metode Pembayaran:</span>
                <p className="font-medium text-gray-800">{transaction.paymentMethod.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Alamat Pengiriman:</span>
                <p className="font-medium text-gray-800">{transaction.customerInfo.address}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Total Pembayaran:</span>
                <p className="font-medium text-green-600">Rp {transaction.total.toLocaleString('id-ID')}</p>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded border border-yellow-200 flex items-start">
              <HiExclamationCircle className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Silakan lakukan pembayaran sesuai metode yang dipilih. Pesanan akan diproses setelah pembayaran berhasil dikonfirmasi.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md flex items-center justify-center hover:bg-gray-50 transition"
            >
              <HiHome className="mr-2" />
              Kembali ke Beranda
            </Link>
            <Link
              to="/profile"
              className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center justify-center hover:bg-green-700 transition"
            >
              <HiShoppingBag className="mr-2" />
              Lihat Riwayat Pembelian
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
