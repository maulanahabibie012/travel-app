import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import LOGO from "../../assets/image/logo_red.png"; // Ganti dengan path logo Anda

// Komponen footer
function Footer() {
  const currentYear = new Date().getFullYear(); // Mendapatkan tahun saat ini

  const socialLinks = [
    { icon: Facebook, url: "#" },
    { icon: Twitter, url: "#" },
    { icon: Instagram, url: "#" },
    { icon: Linkedin, url: "#" },
  ];

  const quickLinks = [
    "Home",
    "Destinations",
    "Activities",
    "About Us",
    "Contact",
  ];

  return (
    <footer className="bg-red-600 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kolom Brand */}
          <div className="flex flex-col items-center md:items-start">
            <img src={LOGO} alt="" 
            className="item-center w-28 mb-4 rounded-full"/>
            <p className="text-white mb-4">
              Discover the world, create memories that last a lifetime.
            </p>

            {/* Tautan Sosial */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="text-white hover:text-white transition-colors"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Kolom Tautan Cepat */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-white hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom Kontak */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center text-white">
                <MapPin className="w-5 h-5 mr-3 text-white" />
                <span>123 Travel Street, City, Country</span>
              </div>
              <div className="flex items-center text-white">
                <Mail className="w-5 h-5 mr-3 text-white" />
                <span>support@travelbook.com</span>
              </div>
              <div className="flex items-center text-white">
                <Phone className="w-5 h-5 mr-3 text-white" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Kolom Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-white mb-4">
              Subscribe to get special offers and travel updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-lg border border-gray-300 bg-white-800 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button className="bg-white text-red-600 px-4 py-2 rounded-r-lg hover:bg-red-700 hover:text-white transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Hak Cipta */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-white">
            &copy; {currentYear} Travel Bro!. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
