/* ===== IMPORT DAN DEPENDENCIES ===== */
// Import komponen dan hooks yang dibutuhkan
import { useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
} from "lucide-react";
import useTransaction from "../../../hooks/useTransaction";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { useNavigate } from "react-router-dom";


const TransactionManagement = () => {
  /* ===== STATE MANAGEMENT ===== */
  // Mengambil data dan fungsi transaksi dari custom hook
  const {
    transactions, // Data transaksi dari API
    loading: transactionsLoading, // Transaksi loading status
    updateTransactionStatus, // Fungsi untuk update status
    deleteTransaction, // Fungsi untuk hapus transaksi
    refreshTransactions, // Fungsi untuk refresh data
  } = useTransaction();

  // State untuk UI
  const [isExpanded, setIsExpanded] = useState(true); // Kontrol sidebar
  const [searchTerm, setSearchTerm] = useState(""); // Input pencarian
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Hasil filter
  const [showForm, setShowForm] = useState(false); // Toggle form modal
  const [toastMessage, setToastMessage] = useState(""); // Pesan notifikasi
  const [showToast, setShowToast] = useState(false); // Toggle notifikasi

  // State untuk form edit status
  const [formData, setFormData] = useState({
    id: "", // ID transaksi
    status: "", // Status baru
  });

  /* ===== PAGINATION SETUP ===== */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Add this line to define itemsPerPage constant

  /* ===== EFFECTS & FILTERS ===== */
  // Effect untuk filter transaksi berdasarkan pencarian
  useEffect(() => {
    setFilteredTransactions(
      transactions.filter(
        (transaction) =>
          transaction.invoiceId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.totalAmount.toString().includes(searchTerm) ||
          transaction.payment_method?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, transactions]);

  /* ===== EVENT HANDLERS ===== */
  // Handler untuk update status transaksi
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.status) {
      setToastMessage("Status is required!");
      setShowToast(true);
      return;
    }
    const { success, error } = await updateTransactionStatus(
      formData.id,
      formData.status
    );
    if (success) {
      setShowForm(false);
      await refreshTransactions();
      setToastMessage("Status updated successfully");
    } else {
      setToastMessage(error || "Failed to update status");
    }
    setShowToast(true);
  };

  // Handler untuk edit status
  const handleEdit = (transaction) => {
    if (transaction.status !== "pending") {
      setToastMessage(
        "Failed to update status, only 'pending' status are allowed"
      );
      setShowToast(true);
      return;
    }
    setFormData({
      id: transaction.id,
      status: transaction.status,
    });
    setShowForm(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  if (transactionsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /* ===== RENDER KOMPONEN ===== */
  return (
    <div className="min-h-screen w-full bg-red-600 flex">
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <div
        className={`w-full p-4 transition-all duration-300 ${
          isExpanded ? "ml-64" : "pl-14"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manajemen Transaksi</h1>
          <p className="text-white mt-2">Kelola semua transaksi di sini.</p>
        </div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6 mr-12 lg:mr-0">
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="bg-white text-black px-4 py-2 pl-10 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-black" />
            </div>
          </div>
        </div>
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg max-h-[90%] overflow-y-auto">
              <h2 className="text-xl font-bold text-white mb-4">
                Edit Status Transaksi
              </h2>
              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4">
                    <label className="text-white">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="p-2 rounded bg-gray-700 text-white w-full"
                    >
                      <option value="">Pilih Status</option>
                      <option value="pending">Pending</option>
                      <option value="success">Success</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Total Harga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Metode Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="text-black hover:bg-red-600">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.invoiceId}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.payment_method?.name || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        transaction.status === "success"
                          ? "text-green-400"
                          : transaction.status === "pending"
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {transaction.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                      <button
                        onClick={() =>
                          navigate(`/transaction-management/${transaction.id}`)
                        }
                        className="text-green-400 hover:text-green-300"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(transaction.id)}
                        className="text-red-400 hover:text-red-300"
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
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600"
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
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
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
                : "bg-white-700 hover:bg-red-600"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      {/* {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
          show={showToast}
        />
      )} */}
    </div>
  );
};

export default TransactionManagement;