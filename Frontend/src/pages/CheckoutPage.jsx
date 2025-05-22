import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { HiCreditCard, HiCash, HiArrowLeft, HiCheck } from "react-icons/hi";

// Dummy payment methods
const PAYMENT_METHODS = [
  { id: 1, name: "Transfer Bank", type: "bank", fee: 0, icon: HiCreditCard },
  { id: 2, name: "E-Wallet (OVO)", type: "ewallet", fee: 2500, icon: HiCreditCard },
  { id: 3, name: "E-Wallet (GoPay)", type: "ewallet", fee: 2500, icon: HiCreditCard },
  { id: 4, name: "E-Wallet (DANA)", type: "ewallet", fee: 2500, icon: HiCreditCard },
  { id: 5, name: "COD (Cash on Delivery)", type: "cod", fee: 5000, icon: HiCash }
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get product data from navigation state
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching product data and user info from API
    const fetchData = async () => {
      try {
        // In real app, get product ID from URL params or state
        const productId = location.state?.productId || 1;
        
        // Simulate API call to get product details
        const productResponse = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              id: productId,
              name: "Vintage Wooden Chair",
              price: "Rp 250.000",
              priceNumeric: 250000,
              seller: "Budi Santoso",
              location: "Jakarta Selatan",
              imageUrl: "https://images.unsplash.com/photo-1503602642458-232111445657?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=934&q=80"
            });
          }, 500);
        });

        // Simulate API call to get user profile
        const userResponse = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              name: "John Doe",
              email: "john.doe@email.com",
              phone: "08123456789",
              address: "Jl. Sudirman No. 123, Jakarta Pusat"
            });
          }, 300);
        });

        setProduct(productResponse);
        setCustomerInfo(userResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const subtotal = product.priceNumeric * quantity;
    const paymentFee = selectedPayment ? selectedPayment.fee : 0;
    return subtotal + paymentFee;
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!selectedPayment) {
      alert("Silakan pilih metode pembayaran");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create transaction
      const transactionData = {
        productId: product.id,
        quantity,
        paymentMethod: selectedPayment.name,
        customerInfo,
        totalAmount: calculateTotal()
      };

      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: "TRX" + Date.now(),
            message: "Pesanan berhasil dibuat"
          });
        }, 2000);
      });

      if (response.success) {
        // Navigate to confirmation page with transaction data
        navigate("/confirmation", {
          state: {
            transaction: {
              id: response.transactionId,
              product,
              quantity,
              paymentMethod: selectedPayment,
              customerInfo,
              total: calculateTotal(),
              status: "pending"
            }
          }
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Terjadi kesalahan saat memproses pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-200 rounded-full transition"
          >
            <HiArrowLeft className="text-xl text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pembeli</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Metode Pembayaran</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map(method => {
                  const IconComponent = method.icon;
                  return (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        selectedPayment?.id === method.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPayment(method)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            selectedPayment?.id === method.id
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedPayment?.id === method.id && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <IconComponent className="text-gray-600 mr-3" />
                          <span className="font-medium text-gray-800">{method.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.fee > 0 ? `+Rp ${method.fee.toLocaleString('id-ID')}` : 'Gratis'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Pesanan</h2>
              
              {/* Product Info */}
              <div className="flex items-center mb-4 pb-4 border-b">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">Penjual: {product.seller}</p>
                  <p className="text-green-600 font-semibold">{product.price}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700">Jumlah:</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300 bg-gray-50">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({quantity} item):</span>
                  <span>Rp {(product.priceNumeric * quantity).toLocaleString('id-ID')}</span>
                </div>
                {selectedPayment && selectedPayment.fee > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Biaya Admin:</span>
                    <span>Rp {selectedPayment.fee.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">Rp {calculateTotal().toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isLoading || !selectedPayment}
                className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                  isLoading || !selectedPayment
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  'Buat Pesanan'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;