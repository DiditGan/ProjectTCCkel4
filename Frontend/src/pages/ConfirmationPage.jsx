import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiCheck, HiClock, HiShoppingBag, HiHome } from "react-icons/hi";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    // Get transaction data from navigation state
    const transactionData = location.state?.transaction;
    
    if (!transactionData) {
      // If no transaction data, redirect to home
      navigate('/home');
      return;
    }

    setTransaction(transactionData);

    // Simulate API call to confirm transaction
    const confirmTransaction = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Update transaction status if needed
      } catch (error) {
        console.error("Error confirming transaction:", error);
      }
    };

    confirmTransaction();
  }, [location.state, navigate]);

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat konfirmasi...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <HiClock className="text-yellow-500" />;
      case 'confirmed':
        return <HiCheck className="text-green-500" />;
      default:
        return <HiCheck className="text-green-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Konfirmasi';
      case 'confirmed':
        return 'Pesanan Dikonfirmasi';
      default:
        return 'Pesanan Berhasil';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="h-16"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiCheck className="text-3xl text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil Dibuat!</h1>
            <p className="text-gray-600">
              Terima kasih! Pesanan Anda telah berhasil dibuat dengan ID: <strong>{transaction.id}</strong>
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Detail Pesanan</h2>
            
            {/* Product Info */}
            <div className="flex items-center pb-4 border-b mb-4">
              <img
                src={transaction.product.imageUrl}
                alt={transaction.product.name}
                className="w-20 h-20 object-cover rounded-md mr-4"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{transaction.product.name}</h3>
                <p className="text-sm text-gray-600">Penjual: {transaction.product.seller}</p>
                <p className="text-green-600 font-semibold">{transaction.product.price}</p>
                <p className="text-sm text-gray-600">Jumlah: {transaction.quantity}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Informasi Pembeli</h4>
                <p className="text-sm text-gray-600">{transaction.customerInfo.name}</p>
                <p className="text-sm text-gray-600">{transaction.customerInfo.email}</p>
                <p className="text-sm text-gray-600">{transaction.customerInfo.phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Alamat Pengiriman</h4>
                <p className="text-sm text-gray-600">{transaction.customerInfo.address}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-800 mb-2">Informasi Pembayaran</h4>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Metode Pembayaran:</span>
                <span className="text-sm font-medium">{transaction.paymentMethod.name}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="flex items-center">
                  {getStatusIcon(transaction.status)}
                  <span className="text-sm font-medium ml-2">{getStatusText(transaction.status)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-medium">Total Pembayaran:</span>
                <span className="text-lg font-bold text-green-600">
                  Rp {transaction.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Langkah Selanjutnya:</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Seller akan menghubungi Anda dalam 1x24 jam</li>
              <li>• Lakukan pembayaran sesuai metode yang dipilih</li>
              <li>• Tunggu konfirmasi dari seller untuk pengiriman</li>
              <li>• Anda dapat memantau status pesanan di halaman profil</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/profile"
              className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium text-center transition flex items-center justify-center"
            >
              <HiShoppingBag className="mr-2" />
              Lihat Pesanan
            </Link>
            <Link 
              to="/home"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium text-center transition flex items-center justify-center"
            >
              <HiHome className="mr-2" />
              Belanja Lagi
            </Link>
            <button 
              onClick={() => navigate('/messages')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition flex items-center justify-center"
            >
              💬 Chat Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
