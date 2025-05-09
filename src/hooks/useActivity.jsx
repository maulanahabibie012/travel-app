import { useState, useEffect } from "react";
import axios from "axios";

// Hook kustom untuk mengelola aktivitas
const useActivity = (activityId = null) => {
  // Variabel state untuk menyimpan daftar aktivitas, satu aktivitas, status loading, dan pesan error
  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil semua aktivitas
  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      setActivities(response.data.data); // Simpan aktivitas yang diambil ke dalam state
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
    } finally {
      setLoading(false); // Set loading menjadi false setelah permintaan selesai
    }
  };

  // Fungsi untuk mengambil detail satu aktivitas berdasarkan ID
  const fetchActivityDetail = async (id) => {
    try {
      const response = await axios.get(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activity/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setActivity(response.data.data); // Simpan detail aktivitas yang diambil ke dalam state
    } catch (err) {
      setError(err.message); // Simpan pesan error ke dalam state
    } finally {
      setLoading(false); // Set loading menjadi false setelah permintaan selesai
    }
  };

  // Fungsi untuk membuat aktivitas baru
  const createActivity = async (activityData) => {
    try {
      // Validasi field wajib
      if (!activityData.categoryId || !activityData.title) {
        throw new Error("Category dan Title wajib diisi!");
      }

      // Kirim request dengan field snake_case
      const response = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity",
        {
          categoryId: activityData.categoryId,
          title: activityData.title,
          description: activityData.description,
          imageUrls: activityData.imageUrls || [],
          price: Number(activityData.price),
          price_discount: Number(activityData.price_discount),
          rating: Number(activityData.rating),
          total_reviews: Number(activityData.total_reviews),
          facilities: activityData.facilities,
          address: activityData.address,
          province: activityData.province,
          city: activityData.city,
          location_maps: activityData.location_maps,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) throw new Error(response.data.message);
      await fetchActivities(); // Refresh daftar aktivitas setelah pembuatan
      return { success: true };
    } catch (err) {
      console.error("Detail error:", err.response?.data, err.message); // Log detail error
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    }
  };

  // Fungsi untuk memperbarui aktivitas yang ada berdasarkan ID
  const updateActivity = async (id, activityData) => {
    try {
      const response = await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${id}`,
        {
          categoryId: activityData.categoryId,
          title: activityData.title,
          description: activityData.description,
          imageUrls: activityData.imageUrls || [],
          price: Number(activityData.price),
          price_discount: Number(activityData.price_discount),
          rating: Number(activityData.rating),
          total_reviews: Number(activityData.total_reviews),
          facilities: activityData.facilities,
          address: activityData.address,
          province: activityData.province,
          city: activityData.city,
          location_maps: activityData.location_maps,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status !== 200) throw new Error(response.data.message);
      await fetchActivities(); // Refresh daftar aktivitas setelah pembaruan
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Fungsi untuk menghapus aktivitas berdasarkan ID
  const deleteActivity = async (id) => {
    try {
      const response = await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`,
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) throw new Error(response.data.message);
      await fetchActivities(); // Refresh daftar aktivitas setelah penghapusan
      return { success: true };
    } catch (err) {
      console.error("Detail error:", err.response?.data);
      return { success: false, error: err.message };
    }
  };

  // Ambil aktivitas atau detail aktivitas berdasarkan activityId
  useEffect(() => {
    if (activityId) {
      fetchActivityDetail(activityId);
    } else {
      fetchActivities();
    }
  }, [activityId]);

  // Kembalikan variabel state dan fungsi untuk digunakan dalam komponen
  return {
    activities,
    activity,
    loading,
    error,
    createActivity,
    updateActivity,
    deleteActivity,
    refreshActivities: fetchActivities,
  };
};

export default useActivity;
