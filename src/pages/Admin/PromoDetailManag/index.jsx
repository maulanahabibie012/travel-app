import { useNavigate } from "react-router-dom";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import usePromos from "../../../hooks/usePromo";
import {  useParams } from "react-router-dom";

const PromoDetailManag = () => {
    const navigate = useNavigate();
const { promoId } = useParams();

  // Mengambil data promo dari custom hook
  const { promos, loading: promoLoading } = usePromos();

  // State untuk menyimpan detail promo yang dipilih
  const [promo, setPromo] = useState(null);

  // State untuk kontrol sidebar
  const [isExpanded, setIsExpanded] = useState(true);

  /* ===== EFFECT HOOKS ===== */
  // Effect untuk mencari promo berdasarkan ID
  useEffect(() => {
    if (promos && promoId) {
      const selectedPromo = promos.find((p) => p.id === promoId);
      setPromo(selectedPromo);
    }
  }, [promos, promoId]);

  /* ===== RENDER CONDITIONS ===== */
  // Tampilan loading saat mengambil data
  if (promoLoading || !promo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  /* ===== MAIN RENDER ===== */
  return (
    <div className="min-h-screen bg-red-600 flex">
      {/* Sidebar */}
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Area Konten */}
      <div className={`flex-1 p-8 ${isExpanded ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white">Detail Promo</h1>
          <p className="text-white">Informasi detail tentang promo.</p>
        </div>

        {/* Tombol Kembali */}
        <button
            onClick={() => navigate(-1)}
            className="flex py-2 items-center gap-2 text-white hover:text-white hover:bg-red-700 px-4 rounded mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        {/* Detail Promo */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Informasi Dasar */}
          <h2 className="text-2xl font-bold text-black">{promo.title}</h2>
          <p className="text-black mt-2">{promo.description}</p>

          {/* Gambar Promo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <img
              src={promo.imageUrl}
              alt={`Promo Image`}
              className="rounded-lg"
            />
          </div>

          {/* Detail Informasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-black mt-2">
                <span className="font-bold">Kode Promo:</span>{" "}
                {promo.promo_code}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Diskon Promo:</span>{" "}
                {promo.promo_discount_price}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Minimal Klaim:</span>{" "}
                {promo.minimum_claim_price}
              </p>
              <h3 className="text-xl font-bold text-black mt-4">
                Syarat dan Ketentuan
              </h3>
              <div
                className="text-black mt-2"
                dangerouslySetInnerHTML={{ __html: promo.terms_condition }}
              />
            </div>
          </div>
          </div>
        </div>
      </div>
    
  );
};

export default PromoDetailManag;