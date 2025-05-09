import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

const MobileNavigation = ({ onMobileMenuToggle }) => (
  <>
    {/* Tombol Menu Mobile */}
    <div className="lg:hidden flex items-center space-x-4">
      {/* Link ke halaman keranjang */}
      <Link
        to="/cart"
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors duration-300"
      >
        {/* Anda bisa menambahkan ikon cart di sini jika diperlukan */}
      </Link>
      {/* Tombol untuk membuka menu mobile */}
      <button
        onClick={onMobileMenuToggle}
        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  </>
);

export default MobileNavigation;
