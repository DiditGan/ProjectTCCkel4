import { useState } from "react";
import logoImage from "../assets/logo.png";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const username = "rahel"; // Eventually this should come from auth context or props

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-3 fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src={logoImage} 
            alt="GiveTzy Logo" 
            className="h-10 w-auto"
          />
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#home" 
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
          >
            Home
          </a>
          <a 
            href="#about" 
            className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
          >
            About Us
          </a>
          <div className="flex items-center">
            <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
              Welcome, {username}
            </span>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu} 
            className="text-gray-700 hover:text-green-600 focus:outline-none"
          >
            {isOpen ? 
              <HiOutlineX className="w-6 h-6" /> : 
              <HiOutlineMenu className="w-6 h-6" />
            }
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white py-4">
          <div className="flex flex-col space-y-4 px-6">
            <a 
              href="#home" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a 
              href="#about" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </a>
            <div className="flex items-center">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                Welcome, {username}
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
