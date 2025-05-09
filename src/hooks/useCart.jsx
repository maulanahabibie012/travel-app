import { useState, useEffect } from "react";
import axios from "axios";
import { useCartContext } from "../context/CartContext"; // Import konteks keranjang belanja

// Hook kustom untuk mengelola keranjang belanja
const useCart = () => {
  // Variabel state untuk menyimpan item keranjang, status loading, pesan error, dan item yang dipilih
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { updateCartCount } = useCartContext();

  // Fungsi untuk mengambil semua item keranjang
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setCartItems(response.data.data); // Simpan item keranjang yang diambil ke dalam state
      updateCartCount(); // Perbarui jumlah item keranjang
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
    } finally {
      setLoading(false); // Set loading menjadi false setelah permintaan selesai
    }
  };

  // Fungsi untuk menambahkan item ke keranjang
  const addToCart = async (activityId) => {
    try {
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        { activityId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchCartItems(); // Refresh daftar item keranjang setelah penambahan
      return true;
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
      return false;
    }
  };

  // Fungsi untuk memperbarui jumlah item di keranjang
  const updateQuantity = async (cartId, quantity) => {
    try {
      const response = await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${cartId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchCartItems(); // Refresh daftar item keranjang setelah pembaruan
      return true;
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
      return false;
    }
  };

  // Fungsi untuk menghapus item dari keranjang
  const deleteCartItem = async (cartId) => {
    try {
      const response = await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchCartItems(); // Refresh daftar item keranjang setelah penghapusan
      return true;
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
      return false;
    }
  };

  // Fungsi untuk menghitung total harga item yang dipilih
  const getSelectedItemsTotal = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = cartItems.find((item) => item.id === itemId);
      return total + (item ? item.activity.price * item.quantity : 0);
    }, 0);
  };

  // Fungsi untuk mengubah status pemilihan item
  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(itemId)
        ? prevSelectedItems.filter((id) => id !== itemId)
        : [...prevSelectedItems, itemId]
    );
  };

  // Fungsi untuk memilih atau membatalkan pemilihan semua item
  const toggleAllItems = (selectAll) => {
    if (selectAll) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Ambil semua item keranjang saat komponen pertama kali dirender
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Kembalikan variabel state dan fungsi untuk digunakan dalam komponen
  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateQuantity,
    deleteCartItem,
    refreshCartItems: fetchCartItems,
    getSelectedItemsTotal,
    selectedItems,
    toggleItemSelection,
    toggleAllItems,
  };
};

export default useCart;