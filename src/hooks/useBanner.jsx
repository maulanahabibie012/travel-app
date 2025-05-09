import { useState, useEffect } from "react";
import axios from "axios";

// Hook kustom untuk mengelola banner
const useBanner = () => {
  // Variabel state untuk menyimpan daftar banner, status loading, dan pesan error
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil semua banner
  const fetchBanners = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/banners",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setBanners(response.data.data); // Simpan banner yang diambil ke dalam state
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
    } finally {
      setLoading(false); // Set loading menjadi false setelah permintaan selesai
    }
  };

  // Fungsi untuk membuat banner baru
  const createBanner = async (bannerData) => {
    try {
      // Validasi field wajib
      if (!bannerData.name || !bannerData.imageUrl) {
        throw new Error("Name dan Image URL wajib diisi!");
      }

      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-banner",
        bannerData,
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchBanners(); // Refresh daftar banner setelah pembuatan
      return { success: true };
    } catch (err) {
      console.error("Detail error:", err.response?.data, err.message); // Log detail error
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  // Fungsi untuk memperbarui banner yang ada berdasarkan ID
  const updateBanner = async (id, bannerData) => {
    try {
      // Validasi field wajib
      if (!bannerData.name || !bannerData.imageUrl) {
        throw new Error("Name dan Image URL wajib diisi!");
      }

      const response = await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-banner/${id}`,
        bannerData,
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchBanners(); // Refresh daftar banner setelah pembaruan
      return { success: true };
    } catch (err) {
      console.error("Detail error:", err.response?.data, err.message); // Log detail error
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  // Fungsi untuk menghapus banner berdasarkan ID
  const deleteBanner = async (id) => {
    try {
      const response = await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-banner/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchBanners(); // Refresh daftar banner setelah penghapusan
      return { success: true };
    } catch (err) {
      console.error("Detail error:", err.response?.data, err.message); // Log detail error
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  // Ambil semua banner saat komponen pertama kali dirender
  useEffect(() => {
    fetchBanners();
  }, []);

  // Kembalikan variabel state dan fungsi untuk digunakan dalam komponen
  return {
    banners,
    loading,
    error,
    createBanner,
    updateBanner,
    deleteBanner,
    refreshBanners: fetchBanners,
  };
};

export default useBanner;
