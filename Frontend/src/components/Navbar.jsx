import { useState, useEffect } from "react";
import logoImage from "../assets/logo.png";
import { HiOutlineMenu, HiOutlineX, HiOutlineChatAlt2 } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    if (currentUser) {
      navigate('/profile');
    } else {
      navigate('/'); // Or to a specific login section/page
    }
    if (isOpen) setIsOpen(false);
  };
  
  const defaultProfileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";


  return (
    <nav className="bg-white shadow-md px-6 py-3 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex items-center">
          <img src={logoImage} alt="GiveTzy Logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/home"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
          >
            Home
          </Link>
          <a // Changed to <a> for smooth scroll on landing page
            href="/#about"
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
          >
            About Us
          </a>
          {currentUser && (
            <Link 
              to="/manage-products"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
            >
              Kelola Barang
            </Link>
          )}
          {currentUser && (
            <Link
              to="/messages"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 flex items-center"
              title="Messages"
            >
              <HiOutlineChatAlt2 className="w-5 h-5 mr-1" />
              Pesan
            </Link>
          )}
          <div className="flex items-center">
            <button 
              onClick={handleProfileClick}
              className="flex items-center space-x-2 bg-green-100 rounded-full pr-4 pl-1 py-1 hover:bg-green-200 transition-colors duration-300"
            >
              <img 
                src={currentUser?.avatar || defaultProfileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-green-500 object-cover"
              />
              <span className="capitalize text-green-800 font-medium">
                {currentUser ? currentUser.name || 'Profile' : 'Login'}
              </span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex items-center">
          {currentUser && (
            <Link to="/messages" className="text-gray-700 hover:text-green-600 mr-4">
              <HiOutlineChatAlt2 className="w-6 h-6" />
            </Link>
          )}
          <button
            onClick={toggleMenu}
            className="text-gray-700 hover:text-green-600 focus:outline-none"
          >
            {isOpen ? (
              <HiOutlineX className="w-6 h-6" />
            ) : (
              <HiOutlineMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white py-4">
          <div className="flex flex-col space-y-4 px-6">
            <Link
              to="/home"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <a // Changed to <a> for smooth scroll on landing page
              href="/#about"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </a>
            {currentUser && (
              <Link
                to="/manage-products"
                className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Kelola Barang
              </Link>
            )}
            <div className="flex items-center">
              <button
                onClick={handleProfileClick}
                className="flex items-center space-x-2 bg-green-100 rounded-full pr-4 pl-1 py-1 hover:bg-green-200 transition-colors duration-300"
              >
                <img 
                  src={currentUser?.avatar || defaultProfileImage} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-green-500 object-cover"
                />
                <span className="capitalize text-green-800 font-medium">
                  {currentUser ? currentUser.name || 'Profile' : 'Login'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
