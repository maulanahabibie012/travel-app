import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Edit,
  LogOut,
  ShieldEllipsis,
  MapPin,
  Calendar,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import useTransactions from "../../hooks/useTransaction";
import useUserProfile from "../../hooks/useUserProfile";
import Navbar from "../../components/Navbar";

const ProfileUserPage = () => {
  // Inisialisasi hooks dan state untuk profil pengguna
  const navigate = useNavigate();
  const { userData, loading, error } = useUserProfile();
  const {
    transactions = [],
    loading: transactionsLoading,
    fetchMyTransactions,
  } = useTransactions();

  // Mengambil data transaksi saat komponen dimount
  useEffect(() => {
    fetchMyTransactions();
  }, []);

  // Handler untuk proses logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

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
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Back to Login
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Profil - Menampilkan info utama pengguna */}
        <div className="bg-red-600  rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-40 rounded-xl border-4 border-white/30 overflow-hidden">
              <img
                src="https://demo-source.imgix.net/bucket_hat.jpg"
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">
                {userData.name}
              </h1>
              <p className="text-white flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4" />
                Jakarta, Indonesia
              </p>
            </div>
            <div className="md:ml-auto flex gap-4">
              <button
                onClick={() => navigate("/edit-profile")}
                className="px-6 py-3 hover:bg-red-700 text-white rounded-xl flex items-center gap-2 transition"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri - Informasi Personal */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit border border-red-700">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-700 rounded-xl">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{userData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-700 rounded-xl">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-700 rounded-xl">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">
                    {userData.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-700 rounded-xl">
                  <ShieldEllipsis className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{userData.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Riwayat Transaksi */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-700">
              {/* Header Transaksi */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-red-600 hover:underline hover:text-red-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>

              {/* Daftar Transaksi */}
              {transactionsLoading ? (
                // Loading skeleton untuk transaksi
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-24 bg-gray-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : sortedTransactions.length === 0 ? (
                // Tampilan saat tidak ada transaksi
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions yet</p>
                  <button
                    onClick={() => navigate("/activity")}
                    className="mt-4 px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Explore Activities
                  </button>
                </div>
              ) : (
                // Daftar transaksi terakhir (maksimal 3)
                <div className="space-y-4">
                  {sortedTransactions.slice(0, 3).map((transaction) => (
                    // Item transaksi dengan detail lengkap
                    <div
                      key={transaction.id}
                      onClick={() =>
                        navigate(`/transactions/${transaction.id}`)
                      }
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-red-700 hover:text-white transition cursor-pointer"
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
                            {new Date(transaction.orderDate).toLocaleString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            {transaction.transaction_items.length} items
                          </span>
                        </div>
                        {transaction.proofPaymentUrl && (
                          <div className="mt-2 hover:text-white">
                            <a
                              href={transaction.proofPaymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-600 underline hover:text-white text-sm"
                            >
                              View Proof of Payment
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          IDR{" "}
                          {(transaction.totalAmount || 0).toLocaleString(
                            "id-ID"
                          )}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUserPage;