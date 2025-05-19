import { useState, useEffect } from "react";
import DashboardSidebar from "../../../components/DashboardSidebar";
import {
  PencilIcon,
  SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useUserProfile from "../../../hooks/useUserProfile";

const UserManagement = () => {
  /* ===== STATE MANAGEMENT ===== */
  // State untuk pencarian pengguna
  const [searchTerm, setSearchTerm] = useState("");

  // Mengambil data dan fungsi user dari custom hook
  const {
    users: initialUsers, // Data awal dari API
    updateUserRole, // Fungsi untuk update role
    loading, // Status loading
    error, // Pesan error
  } = useUserProfile();

  // State untuk data pengguna
  const [users, setUsers] = useState([]); // List pengguna aktif
  const [selectedUser, setSelectedUser] = useState(null); // User yang dipilih
  const [showEditModal, setShowEditModal] = useState(false); // Toggle modal edit
  const [isExpanded, setIsExpanded] = useState(true); // Kontrol sidebar

  /* ===== EFFECTS ===== */
  // Effect untuk inisialisasi data pengguna
  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = users?.filter((user) => {
    return (
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers?.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  /* ===== EVENT HANDLERS ===== */
  // Handler untuk update role pengguna
  const handleRoleUpdate = async () => {
    if (selectedUser) {
      console.log(
        `Updating role for user ${selectedUser.id} to ${selectedUser.role}`
      );
      const success = await updateUserRole(selectedUser.id, selectedUser.role);
      if (success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id
              ? { ...user, role: selectedUser.role }
              : user
          )
        );
        setShowEditModal(false);
        setSelectedUser(null);
      }
    }
  };

  /* ===== RENDER CONDITIONS ===== */
  // Tampilkan loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Tampilkan pesan error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h3 className="text-xl">Error: {error}</h3>
        </div>
      </div>
    );
  }

  /* ===== MAIN RENDER ===== */
  return (
    <div className="min-h-screen w-full bg-red-600 flex">
      {/* Sidebar */}
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Konten Utama */}
      <div className={`w-full p-4 ${isExpanded ? "ml-64" : "pl-14"}`}>
        {/* Header dan Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Manajemen Pengguna</h1>
          <p className="text-white mt-4">Kelola data pengguna aplikasi</p>
        </div>

        {/* Filter and Search Section */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-6 mr-12 lg:mr-0">
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ex: John Doe"
                className="bg-white text-black px-4 py-2 pl-10 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-black" />
            </div>
          </div>
        </div>

        {/* Tabel Pengguna */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-black text-white text-left text-xs font-medium uppercase tracking-wider">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentUsers?.map((user) => (
                  <tr key={user.id} className="text-black hover:bg-red-600 hover:text-white">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
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
                ? "bg-gray-700 text-white cursor-not-allowed"
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
                ? "bg-gray-700 text-white cursor-not-allowed"
                : "bg-white hover:bg-red-600"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Edit Role */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-red-600 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96 border border-red-700 shadow-lg">
              <h2 className="text-xl font-bold text-black mb-4">
                Edit User Role
              </h2>
              <select
                className="p-2 rounded bg-white text-black w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      required
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-white text-red-600 rounded-lg border border-red-600 hover:bg-red-600 hover:text-white transition-colors duration-200"
                  onClick={() => setShowEditModal(false)}
                >
                  Batal
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg border border-red-600 hover:bg-white hover:text-red-600 transition-colors duration-200"
                  onClick={handleRoleUpdate}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;