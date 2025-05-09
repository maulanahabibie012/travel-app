import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Calendar, ChevronRight } from "lucide-react";
import useTransactions from "../../hooks/useTransaction";
import Navbar from "../../components/Navbar";

const TransactionsPage = () => {
  // Inisialisasi hooks dan state untuk manajemen transaksi
  const navigate = useNavigate();
  const {
    transactions = [],    // Data transaksi dari API
    loading,             // Status loading
    error,              // Pesan error jika ada
    fetchMyTransactions, // Fungsi untuk mengambil data transaksi
  } = useTransactions();

  // State untuk paginasi
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5; // Jumlah transaksi per halaman

  // Mengambil data transaksi saat komponen dimount
  useEffect(() => {
    fetchMyTransactions();
  }, []);

  // Tampilan loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 p-8 rounded-2xl text-center">
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mengurutkan transaksi berdasarkan tanggal terbaru
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
  );

  // Logika paginasi
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

  // Handler untuk navigasi halaman
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Transaksi Kamu</h1>

        {/* Daftar Transaksi */}
        <div className="space-y-4">
          {currentTransactions.map((transaction) => (
            // Item transaksi dengan detail lengkap
            <div
              key={transaction.id}
              onClick={() => navigate(`/transactions/${transaction.id}`)}
              className="flex items-center gap-4 p-8 border border-red-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="p-3 bg-red-700 rounded-xl">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {transaction.invoiceId}
                </h3>
                <div className="flex flex-col md:flex-row items-start gap-1 mt-1">
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(transaction.orderDate).toLocaleString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    {transaction.transaction_items.length} items
                  </span>
                </div>
                {transaction.proofPaymentUrl && (
                  <div className="mt-2">
                    <a
                      href={transaction.proofPaymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline text-sm"
                    >
                      Lihat bukti pembayaran
                    </a>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  IDR {(transaction.totalAmount || 0).toLocaleString("id-ID")}
                </p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs ${
                    transaction.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : transaction.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.status || "PENDING"}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>

        {/* Kontrol Paginasi */}
        <div className="flex justify-end gap-6 items-center mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
