import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Save } from "lucide-react";
import useForm from "../../hooks/useForm";
import useAuthentication from "../../hooks/useAuthentication";


const UpdateProfile = () => {
  // Inisialisasi hooks dan state untuk manajemen profil
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  // Inisialisasi form dengan custom hook useForm
  const { values, handleChange, setValues } = useForm({
    name: "",         // Nama lengkap pengguna
    email: "",        // Email pengguna
    phoneNumber: "",  // Nomor telepon pengguna
  });

  // Mengambil fungsi dan state dari hook autentikasi
  const { updateProfile, error, loading } = useAuthentication();

  // Effect untuk mengambil data user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);
      // Mengisi form dengan data user yang ada
      setValues({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phoneNumber: parsedUser.phoneNumber || "",
      });
    } else {
      // Redirect ke login jika tidak ada data
      navigate("/login");
    }
  }, [navigate, setValues]);

  // Handler untuk submit form update profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name || !values.email || !values.phoneNumber) {
      alert("Semua field harus diisi");
      return;
    }
    await updateProfile(values);
  };

  // Tampilan loading saat mengambil data
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-700 to-red-300 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Form */}
        <div className="bg-red-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Update Profil Kamu</h1>
        </div>

        {/* Form Update Profil */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Pesan Error jika ada */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Input Fields dengan Icons */}
          {/* Field Nama */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={values.name}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-3 w-full border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            />
          </div>

          {/* Field Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Alamat Email"
              value={values.email}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-3 w-full border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-300"
            />
          </div>

          {/* Field Nomor Telepon */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Nomor Telepon"
              value={values.phoneNumber}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-3 w-full border border-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 transition duration-300"
            />
          </div>

          {/* Tombol Submit dengan Loading State */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                <span>Memperbarui...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
          {/* Tombol Kembali ke Profil */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-red-600 hover:text-red-800 font-semibold transition-colors duration-300 hover:underline"
            >
              Kembali ke Profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;