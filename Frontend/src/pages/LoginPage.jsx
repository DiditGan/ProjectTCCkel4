import { useState } from "react";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <section id="login" className="py-16 px-4 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
              {isLogin ? "Login to Your Account" : "Create an Account"}
            </h2>
            
            <form className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
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
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
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
