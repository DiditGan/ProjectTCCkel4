import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiEye, HiEyeOff } from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";
import logoImage from "../assets/logo.png";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      if (isLogin) {
        // Process login
        console.log("Logging in with:", data.email);
        await login(data.email, data.password);
        navigate('/home');
      } else {
        // Process registration
        if (data.password !== data.confirmPassword) {
          throw new Error("Konfirmasi password tidak sesuai");
        }
        
        const registerData = {
          name: data.name,
          email: data.email,
          password: data.password,
          phone_number: data.phone || ""
        };
        
        console.log("Registering with data:", { ...registerData, password: "[REDACTED]" });
        await register(registerData);
        setSuccess("Registrasi berhasil! Silakan login.");
        setIsLogin(true);
        
        // Clear form
        e.target.reset();
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Brand Panel */}
      <div className="relative hidden lg:flex flex-col w-1/2 bg-green-600 text-white p-12 justify-center">
        <div className="max-w-md mx-auto">
          <img src={logoImage} alt="GiveTzy Logo" className="h-16 mb-8" />
          <h1 className="text-4xl font-bold mb-6">Temukan Barang Bekas Berkualitas</h1>
          <p className="text-lg mb-8 text-green-100">
            Platform marketplace terpercaya untuk jual beli barang bekas dengan harga terjangkau dan kualitas terjamin.
          </p>
          
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Produk Berkualitas</h3>
                <p className="text-green-100">Semua barang yang tersedia sudah diverifikasi dan dijamin kualitasnya.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Transaksi Aman</h3>
                <p className="text-green-100">Proses pembayaran dan pengiriman yang aman dan terpercaya.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 rounded-full p-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl">Dukungan 24/7</h3>
                <p className="text-green-100">Tim dukungan kami siap membantu Anda kapan saja.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-green-500 rounded-full opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-green-500 rounded-full opacity-50"></div>
      </div>
      
      {/* Right side - Form Panel */}
      <div className="flex flex-col w-full lg:w-1/2 p-8 md:p-12 justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Masuk ke Akun Anda" : "Buat Akun Baru"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? "Akses semua fitur GiveTzy" : "Bergabunglah dengan komunitas GiveTzy"}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-500">
                    <HiOutlineUser />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-500">
                  <HiOutlineMail />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Masukkan email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon (Opsional)
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-500">
                    <HiOutlinePhone />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Masukkan nomor telepon"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-500">
                  <HiOutlineLockClosed />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
                <button 
                  type="button"
                  className="absolute right-0 top-0 bottom-0 flex items-center pr-3 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 flex items-center pl-3 text-gray-500">
                    <HiOutlineLockClosed />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Konfirmasi password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-0 top-0 bottom-0 flex items-center pr-3 text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </button>
                </div>
              </div>
            )}
            
            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
                  Lupa password?
                </Link>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? "Masuk..." : "Daftar..."}
                  </>
                ) : (
                  <>{isLogin ? "Masuk" : "Daftar"}</>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
              </span>
              <button
                type="button"
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
              >
                {isLogin ? "Daftar" : "Masuk"}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-sm text-gray-600 hover:text-green-600">
                Kembali ke beranda
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
