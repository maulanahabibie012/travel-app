import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, User, Phone } from "lucide-react";
import useAuth from "../../hooks/useAuthentication";
import useForm from "../../hooks/useForm";
import useBanner from "../../hooks/useBanner";
import BGAUTH from "../../assets/image/bg-Auth.jpg";


const RegisterPage = () => {
  // Inisialisasi form dengan nilai awal menggunakan custom hook
  const { values, handleChange } = useForm({
    name: "", // Nama lengkap user
    email: "", // Alamat email user
    password: "", // Password user
    phoneNumber: "", // Nomor telepon user
  });

  // Mengambil fungsi dan state yang diperlukan dari hooks
  const { register, error, loading } = useAuth(); // Hook autentikasi
  const [successMessage, setSuccessMessage] = useState(""); // State pesan sukses
  const location = useLocation();
  const navigate = useNavigate();

  // Handler untuk menangani proses pendaftaran
  const handleSignUp = async (e) => {
    e.preventDefault();
    const success = await register(values);
    if (success) {
      setSuccessMessage("Pendaftaran berhasil! Mengalihkan...");
    }
  };

  // Effect untuk redirect setelah pendaftaran berhasil
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        const prevPath =
          new URLSearchParams(location.search).get("prev") || "/";
        setSuccessMessage("");
        navigate(prevPath);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Background Image dengan overlay */}
      {BGAUTH.length > 0 && (
        <img
          src={BGAUTH}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Form Container */}
      <div className="relative w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header Form */}
        <div className="bg-red-700 p-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <h1 className="text-3xl font-bold text-white">Travel Bro!</h1>
          </div>
        {/* untuk travel */}
          <p className="text-white/80">Selamat Datang di Travel Bro, buat akunmu sekarang</p>
        </div>

        <div className="p-8">
          {/* Pesan Error dan Sukses */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4 text-center">
              {successMessage}
            </div>
          )}

          {/* Form Pendaftaran */}
          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Input Nama dengan Icon */}
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
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            {/* Input Email dengan Icon */}
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
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            {/* Input Nomor Telepon dengan Icon */}
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
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            {/* Input Password dengan Icon */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Kata Sandi"
                value={values.password}
                onChange={handleChange}
                required
                minLength={8}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            {/* Tombol Submit dengan Loading State */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? "Sedang Mendaftar..." : "Daftar"}
            </button>
          </form>

          {/* Link ke Halaman Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Sudah punya akun?{" "}
              <Link
                to={`/login?prev=${location.pathname}${location.search}`}
                className="text-red-600 hover:text-blue-800 font-semibold"
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
