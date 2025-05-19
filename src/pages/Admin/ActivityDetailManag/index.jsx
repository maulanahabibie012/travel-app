/* ===== IMPORT DEPENDENCIES ===== */
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useActivity from "../../../hooks/useActivity";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { ArrowLeft } from "lucide-react";

const ActivityDetailManag = () => {
  const navigate = useNavigate();
  const { activityId } = useParams();

  const { activity, loading } = useActivity(activityId);

  const [isExpanded, setIsExpanded] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-red-600 flex">
      {/* Sidebar dengan kontrol lebar */}
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      {/* Main content area */}
      <div className={`flex-1 p-8 ${isExpanded ? "ml-64" : "ml-20"}`}>
        {/* Header section */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white">Detail Aktivitas</h1>
          <p className="text-white">Informasi detail tentang aktivitas.</p>
        </div>

        {/* Tombol Kembali */}
        <button
          onClick={() => navigate(-1)}
          className="flex py-2 items-center gap-2 text-white hover:text-white hover:bg-red-700 px-4 rounded mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        {/* Detail card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Basic info */}
          <h2 className="text-2xl font-bold text-black">{activity.title}</h2>
          <p className="text-black">{activity.description}</p>

          {/* Image gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {activity.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Activity Image ${index + 1}`}
                className="rounded-lg"
              />
            ))}
          </div>

          {/* Detailed information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-black mt-2">
                <span className="font-bold">Kategori:</span>{" "}
                {activity.category.name}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Harga:</span> {activity.price}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Harga Diskon:</span>{" "}
                {activity.price_discount}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Rating:</span> {activity.rating}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Total Ulasan:</span>{" "}
                {activity.total_reviews}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Alamat:</span> {activity.address}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Provinsi:</span> {activity.province}
              </p>
              <p className="text-black mt-2">
                <span className="font-bold">Kota:</span> {activity.city}
              </p>
              <h3 className="text-xl font-bold text-black mt-4">Fasilitas</h3>
              <div
                className="text-black mt-2"
                dangerouslySetInnerHTML={{ __html: activity.facilities }}
              />
              <h3 className="text-xl font-bold text-black mt-4">Peta Lokasi</h3>
              <div
                className="text-black mt-2"
                dangerouslySetInnerHTML={{ __html: activity.location_maps }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailManag;
