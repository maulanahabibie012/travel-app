
// Import hooks dan komponen yang dibutuhkan
import { useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import usePromos from "../../../hooks/usePromo";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { useNavigate } from "react-router-dom";

const PromoManagement = () => {
  /* ===== STATE MANAGEMENT ===== */
  // Mengambil data dan fungsi promo dari custom hook
  const {
    promos, // Data promo dari API
    loading: promosLoading, // Change this line to match the variable name used below
    createPromo, // Fungsi untuk membuat promo baru
    updatePromo, // Fungsi untuk update promo
    deletePromo, // Fungsi untuk hapus promo
    refreshPromos, // Fungsi untuk refresh data
  } = usePromos();

  // State untuk kontrol UI
  const [isExpanded, setIsExpanded] = useState(true); // Kontrol sidebar
  const [searchTerm, setSearchTerm] = useState(""); // Input pencarian
  const [filteredPromos, setFilteredPromos] = useState([]); // Hasil filter
  const [showForm, setShowForm] = useState(false); // Toggle form modal

  // State untuk form dengan nilai default
  const [formData, setFormData] = useState({
    id: "", // ID promo (kosong untuk promo baru)
    title: "", // Judul promo
    description: "", // Deskripsi promo
    imageUrl: "", // URL gambar promo
    terms_condition: "", // Syarat dan ketentuan
    promo_code: "", // Kode promo
    promo_discount_price: "", // Besaran diskon
    minimum_claim_price: "", // Minimal pembelian
  });

  /* ===== PAGINATION STATE ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ===== EFFECT HOOKS ===== */
  // Effect untuk filter promo berdasarkan pencarian
  useEffect(() => {
    setFilteredPromos(
      promos.filter((promo) =>
        promo.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, promos]);

  /* ===== EVENT HANDLERS ===== */
  // Handler untuk perubahan input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler untuk submit form (create/update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.promo_code) {
      alert("Title and Promo Code are required!");
      return;
    }
    const success = formData.id
      ? await updatePromo(formData.id, formData)
      : await createPromo(formData);
    if (success) {
      setShowForm(false);
      await refreshPromos();
    }
  };

  // Handler untuk edit promo
  const handleEdit = (promo) => {
    setFormData({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      imageUrl: promo.imageUrl,
      terms_condition: promo.terms_condition,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
    });
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleAddPromo = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      terms_condition: "",
      promo_code: "",
      promo_discount_price: "",
      minimum_claim_price: "",
    });
    setShowForm(true);
  };

  const totalPages = Math.ceil(filteredPromos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromos = filteredPromos.slice(startIndex, endIndex);

  if (promosLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /* ===== RENDER KOMPONEN ===== */
  return (
    <div className="min-h-screen w-full bg-red-600 flex">
      {/* Sidebar */}
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Konten Utama */}
      <div className={`w-full p-4 ${isExpanded ? "ml-64" : "pl-14"}`}>
        {/* Header dan Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manajemen Promo</h1>
          <p className="text-white mt-2">Kelola semua promo di sini.</p>
        </div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6 mr-12 lg:mr-0">
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari promo..."
                className="bg-white text-black px-4 py-2 pl-10 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-black" />
            </div>
          </div>
          <button
            onClick={handleAddPromo}
            className="bg-white text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 hover:text-white transition duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Promo
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-red-600 bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[90%] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">
                {formData.id ? "Edit Promo" : "Tambah Promo"}
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="text-white">Judul</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Judul"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                  <div className="col-span-2 mb-4">
                    <label className="text-white">Deskripsi</label>
                    <textarea
                      name="description"
                      placeholder="Deskripsi"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-white">URL Gambar</label>
                    <input
                      type="text"
                      name="imageUrl"
                      placeholder="URL Gambar"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                  <div className="col-span-2 mb-4">
                    <label className="text-white">Syarat dan Ketentuan</label>
                    <textarea
                      name="terms_condition"
                      placeholder="Syarat dan Ketentuan"
                      value={formData.terms_condition}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-white">Kode Promo</label>
                    <input
                      type="text"
                      name="promo_code"
                      placeholder="Kode Promo"
                      value={formData.promo_code}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-white">Diskon Promo</label>
                    <input
                      type="number"
                      name="promo_discount_price"
                      placeholder="Diskon Promo"
                      value={formData.promo_discount_price}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="text-white">Minimal Klaim</label>
                    <input
                      type="number"
                      name="minimum_claim_price"
                      placeholder="Minimal Klaim"
                      value={formData.minimum_claim_price}
                      onChange={handleInputChange}
                      className="p-2 rounded w-full"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-white text-red-600 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabel Promo */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Kode Promo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Diskon Promo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Minimal Klaim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentPromos.map((promo) => (
                  <tr key={promo.id} className="text-black hover:bg-red-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promo.title.length > 20
                        ? `${promo.title.substring(0, 20)}...`
                        : promo.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promo.promo_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promo.promo_discount_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {promo.minimum_claim_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                      <button
                        onClick={() =>
                          navigate(`/promo-management/${promo.id}`)
                        }
                        className="text-green-400 hover:text-green-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(promo)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deletePromo(promo.id)}
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

export default PromoManagement;