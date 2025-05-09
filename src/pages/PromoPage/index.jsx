import usePromos from "../../hooks/usePromo";
import Navbar from "../../components/Navbar";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Komponen untuk menampilkan halaman promo
const PromoPage = () => {
    // Mengambil data promo menggunakan custom hook
    const { promos, loading, error } = usePromos();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPromos, setFilteredPromos] = useState(promos);

    // Filter data promo berdasarkan kata kunci pencarian
    useEffect(() => {
        const filtered = promos.filter((promo) =>
            promo.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPromos(filtered);
    }, [searchTerm, promos]);

    // Menampilkan animasi loading saat data sedang diambil
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    // Menampilkan pesan error jika terjadi kesalahan
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2 text-center">Promo Liburan Untuk Kamu</h1>
                <p className="text-gray-600 text-sm text-center sm:text-base mb-16 leading-relaxed">
                Ingin bersantai di Bali yang eksotis atau menjelajahi destinasi luar negeri yang memukau?      

{" "}
                    <span className="font-semibold text-fuchsia-600">Travel Bro!</span> hadir dengan berbagai{" "}
                    <span className="font-semibold text-orange-500">promo liburan menarik</span>.
                    untuk mewujudkan liburan impianmu! Dengan lebih dari<strong>100+ destinasi</strong> yang siap dieksplorasi, petualangan seru menantimu. 🌍✈️
                </p>

                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Cari promo..."
                        className="bg-white text-black px-4 py-2 pl-10 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoComplete="off"
                    />
                    <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-black" />
                </div>


                {/* Menampilkan pesan jika tidak ada promo atau daftar promo yang tersedia */}
                {promos.length === 0 ? (
                    // Pesan saat tidak ada promo
                    <div className="text-center text-gray-500 py-8">
                        Tidak ada promo saat ini.
                    </div>
                ) : (
                    // Grid layout untuk menampilkan kartu promo
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredPromos.map((promo) => (
                            // Kartu promo individual
                            <div
                                key={promo.id}
                                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
                            >
                                {/* Gambar banner promo */}
                                <img
                                    src={promo.imageUrl}
                                    alt={promo.title}
                                    className="w-full h-48 object-cover"
                                />

                                {/* Informasi detail promo */}
                                <div className="p-4">
                                    {/* Judul promo */}
                                    <h2 className="text-xl font-semibold mb-2">{promo.title}</h2>

                                    {/* Deskripsi promo */}
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {promo.description}
                                    </p>

                                    {/* Syarat dan ketentuan */}
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {promo.terms_condition.replace(/<\/?p>/g, "")}
                                    </p>

                                    {/* Kode promo */}
                                    <h2 className="text-xl font-semibold my-2">
                                        Promo Code : {promo.promo_code}
                                    </h2>

                                    {/* Informasi diskon dan minimum pembelian */}
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-green-600 font-bold text-lg">
                                            Diskon Rp.{promo.promo_discount_price}
                                        </span>
                                        <span className="text-green-600 font-bold text-lg">
                                            Minimum Claim Rp.{promo.minimum_claim_price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PromoPage;
