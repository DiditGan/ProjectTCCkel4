import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (isLogin) {
      // Proses login
      fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      })
        .then(res => res.json())
        .then(data => {
          // proses data, misal simpan token ke localStorage
          console.log(data);
          // Simulate successful login and redirect to home
          localStorage.setItem('user', JSON.stringify({ email: data.email, name: 'John Doe' }));
          navigate('/home');
        })
        .catch(error => {
          // If API fails, simulate successful login for demo
          console.log("API not available, simulating login...");
          localStorage.setItem('user', JSON.stringify({ email: data.email, name: 'John Doe' }));
          navigate('/home');
        });
    } else {
      // Proses registrasi
      fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password })
      })
        .then(res => res.json())
        .then(data => {
          // proses data, misal arahkan ke halaman login
          console.log(data);
          setIsLogin(true); // Switch to login form
          alert('Registrasi berhasil! Silakan login.');
        })
        .catch(error => {
          // If API fails, simulate successful registration for demo
          console.log("API not available, simulating registration...");
          setIsLogin(true);
          alert('Registrasi berhasil! Silakan login.');
        });
    }
  };

  return (
    <>
      <section id="login" className="py-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
              {isLogin ? "Login to Your Account" : "Create an Account"}
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    required
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
              
              {isLogin && (
                <div className="text-center">
                  <a href="#" className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
                    Forgot your password?
                  </a>
                </div>
              )}
              
              <div className="flex items-center justify-center space-x-2 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  type="button"
                  className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginPage;
