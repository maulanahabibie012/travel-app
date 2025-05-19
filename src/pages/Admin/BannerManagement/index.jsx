/* ===== IMPORT DAN DEPENDENCIES ===== */
// Import komponen dan hooks yang dibutuhkan
import { useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useBanner from "../../../hooks/useBanner";
import DashboardSidebar from "../../../components/DashboardSidebar";

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Halaman manajemen banner yang menampilkan daftar banner, search, tombol tambah, dan form modal untuk tambah/edit.
 * Komponen ini menggunakan custom hook `useBanner` untuk mengambil data dan fungsi banner.

/*******  6f4757d9-91d3-4125-8fac-0c991ed8a1ca  *******/const BannerManagement = () => {
  /* ===== PENGATURAN STATE DAN HOOKS ===== */
  // Mengambil data dan fungsi banner dari custom hook
  const {
    banners, // Data banner dari API
    loading: bannersLoading, // Status loading data
    createBanner, // Fungsi untuk membuat banner baru
    updateBanner, // Fungsi untuk update banner
    deleteBanner, // Fungsi untuk hapus banner
    refreshBanners, // Fungsi untuk refresh data
  } = useBanner();

  // State untuk kontrol UI
  const [isExpanded, setIsExpanded] = useState(true); // Kontrol lebar sidebar
  const [searchTerm, setSearchTerm] = useState(""); // Input pencarian
  const [filteredBanners, setFilteredBanners] = useState([]); // Hasil pencarian
  const [showForm, setShowForm] = useState(false); // Toggle form modal

  // State untuk form dengan nilai default
  const [formData, setFormData] = useState({
    id: "", // ID banner (kosong untuk banner baru)
    name: "", // Nama banner
    imageUrl: "", // URL gambar banner
  });

  /* ===== PAGINATION STATE ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ===== EFFECT HOOKS ===== */
  // Effect untuk filter banner berdasarkan pencarian
  useEffect(() => {
    setFilteredBanners(
      banners.filter((banner) =>
        banner.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, banners]);

  /* ===== EVENT HANDLERS ===== */
  // Handler untuk input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk submit form (create/update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.imageUrl) {
      alert("Name and Image URL are required!");
      return;
    }
    const success = formData.id
      ? await updateBanner(formData.id, formData)
      : await createBanner(formData);
    if (success) {
      setShowForm(false);
      await refreshBanners();
    }
  };

  // Handler untuk edit banner
  const handleEdit = (banner) => {
    setFormData({
      id: banner.id,
      name: banner.name,
      imageUrl: banner.imageUrl,
    });
    setShowForm(true);
  };

  // Handler untuk navigasi halaman
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddBanner = () => {
    setFormData({
      id: "",
      name: "",
      imageUrl: "",
    });
    setShowForm(true);
  };

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBanners = filteredBanners.slice(startIndex, endIndex);

  if (bannersLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /* ===== RENDER KOMPONEN ===== */
  // Layout utama dengan sidebar dan konten
  return (
    <div className="min-h-screen w-full bg-red-600 flex">
      {/* Sidebar dengan toggle ekspansi */}
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Area konten utama */}
      <div className={`w-full p-4 ${isExpanded ? "ml-64" : "pl-14"}`}>
        {/* Header halaman */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manajemen Banner</h1>
          <p className="text-white mt-2">Kelola semua banner di sini.</p>
        </div>

        {/* Search dan tombol tambah */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6 mr-12 lg:mr-0">
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari banner..."
                className="bg-white text-black px-4 py-2 pl-10 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-black" />
            </div>
          </div>
          <button
            onClick={handleAddBanner}
            className="bg-white text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 hover:text-white"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Banner
          </button>
        </div>

        {/* Form modal untuk tambah/edit */}
        {showForm && (
          <div className="fixed inset-0 bg-red-700 bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90%] overflow-y-auto">
              <h2 className="text-xl font-bold text-black mb-4">
                {formData.id ? "Edit Banner" : "Tambah Banner"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="text-black">Nama</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nama"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="p-2 rounded bg-white text-black w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-black">URL Gambar</label>
                    <input
                      type="text"
                      name="imageUrl"
                      placeholder="URL Gambar"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="p-2 rounded bg-white text-black w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-red-600 rounded-lg border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-white  border border-red-600 hover:text-red-600 transition-colors duration-200"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabel daftar banner */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black text-wite">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    URL Gambar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentBanners.map((banner) => (
                  <tr key={banner.id} className="text-black hover:bg-red-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.name.length > 20
                        ? `${banner.name.substring(0, 20)}...`
                        : banner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.imageUrl.length > 20
                        ? `${banner.imageUrl.substring(0, 20)}...`
                        : banner.imageUrl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="text-black hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-red-600"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[...Array(totalPages)]
            .map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-red-600"
                    : "bg-white hover:bg-red-600"
                }`}
              >
                {index + 1}
              </button>
            ))
            .slice(
              Math.max(0, currentPage - 2),
              Math.min(totalPages, currentPage + 1)
            )}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-red-600"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerManagement;