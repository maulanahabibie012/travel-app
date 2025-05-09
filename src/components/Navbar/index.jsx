import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, X, ChevronDown, CircleUser } from "lucide-react";
import { useCartContext } from "../../context/CartContext";
import useCategories from "../../hooks/useCategory";
import MobileView from "./MobileView";
import useAuthentication from "../../hooks/useAuthentication";
import LOGO from "../../assets/image/logo_red.png"; // Ganti dengan path logo yang sesuai

const Navbar = () => {
  // State untuk mengelola status menu mobile, login, dropdown, dan dropdown destinasi
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mengambil data kategori dan status loading dari hook useCategories
  const { categories, loading: categoriesLoading } = useCategories();
  // Mengambil jumlah item di keranjang dari context
  const { cartCount } = useCartContext();
  // Mengambil fungsi logout dari hook useAuth
  const { logout } = useAuthentication();

  const location = useLocation();
  const navigate = useNavigate();

  // Mengatur status login berdasarkan token di localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Menutup semua menu saat lokasi berubah
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    
  }, [location]);

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    await logout();
  };

  // Fungsi untuk toggle menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fungsi untuk toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow-md shadow-red-300">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={LOGO}
              alt="Logo"
              className="w-18 h-18 p-2 object-cover"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link
                to="/promo"
                className="flex items-center space-x-1 py-2 text-gray-600 hover:text-red-700 transition-colors duration-300"
              >
                Promo
              </Link>

              
              <Link to="/activity" className="flex items-center space-x-1 py-2 text-gray-600 hover:text-red-700 transition-colors duration-300 relative">
                Destinations
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/cart"
                className="p-2 rounded-full text-gray-600 hover:bg-red-100 transition-colors duration-300 relative"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Buttons */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
                  >
                    <CircleUser className="w-6 h-6" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-red-700 hover:text-white rounded-t-xl"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-red-700 rounded-b-xl hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="border border-red-600 px-5 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-red-700 hover:text-white transition-colors duration-300"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileView
            isMobileMenuOpen={isMobileMenuOpen}
            isLoggedIn={isLoggedIn}
            categories={categories}
            categoriesLoading={categoriesLoading}
            onMobileMenuToggle={toggleMobileMenu}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          onClick={toggleMobileMenu}
        >
          <div
            className="absolute right-0 top-0 w-3/4 h-full bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="py-4">
              <div className="space-y-1">
                <Link
                  to="/promo"
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
                >
                  Promo
                </Link>

                <div>
                  <Link
                    to="/activity"
                    className="flex justify-between items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                  >
                    Destinations
                  </Link>
                </div>

                <Link
                  to="/cart"
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <ShoppingCart className="size-5 inline-block mr-3" />
                    Cart
                  </div>
                </Link>
              </div>

              {/* Mobile Actions */}
              <div className="p-4 mt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      className="block w-full px-5 py-2.5 text-center text-sm font-medium bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-5 py-2.5 text-center text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="border border-red-600 block w-full px-5 py-2.5 text-center text-sm font-medium text-gray-700 rounded-xl hover:bg-red-700 hover:text-white"
                    >
                      Masuk
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-5 py-2.5 text-center text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700"
                    >
                      Daftar
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;