import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Clock, Users, Star } from "lucide-react";
import { useAuthentication } from "../../context/AuthenticationContext";
import { useCartContext } from "../../context/CartContext";
import useActivityDetails from "../../hooks/useActivity";
import useCart from "../../hooks/useCart";
import Navbar from "../../components/Navbar";

import { useLocation } from "react-router-dom";


const DestinationDetailPage = () => {
  // State dan hooks initialization
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { activity, loading: activityLoading, error: activityError } = useActivityDetails(activityId);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, loading: isBooking } = useCart();
  const { isAuthenticated } = useAuthentication();
//   const [toast, setToast] = useState({
//     show: false,
//     message: "",
//     type: "success",
//   });
  const { updateCartCount } = useCartContext();

  // Loading state handler
  if (activityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state handler
  if (activityError || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{activityError || "Activity not found"}</div>
        </div>
      </div>
    );
  }

  // Booking handler
  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate(`/signin?prev=${location.pathname}${location.search}`);
      return;
    }

    try {
      const result = await addToCart(activityId);
      if (result.success) {
        await updateCartCount();
        setToast({
          show: true,
          message: "Successfully added to cart!",
          type: "success",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message || "Failed to add to cart",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Notification Toast */}
      {/* <Toast
        show={toast.show}
        message={toast.message || "An error occurred"}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      /> */}
      
      {/* Main Content */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Galeri Gambar */}
          <div className="relative">
            <div className="aspect-[21/9] w-full overflow-hidden">
              <img
                src={activity.imageUrls[selectedImage]}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto py-2">
              {activity.imageUrls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all
                    ${
                      selectedImage === index
                        ? "border-red-600 scale-105"
                        : "border-white/50 hover:border-white"
                    }`}
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {/* Judul dan Lokasi */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activity.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {activity.city}, {activity.province}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-yellow-100 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">{activity.rating}</span>
                  <span className="text-gray-500 ml-1">
                    ({activity.total_reviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Kartu Harga */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Price per person</p>
                  <div className="text-3xl font-bold text-green-700">
                    IDR {activity.price.toLocaleString("id-ID")}
                  </div>
                  {activity.price_discount && (
                    <div className="text-sm line-through text-gray-400">
                      IDR {activity.price_discount.toLocaleString("id-ID")}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className={`bg-red-600 text-white px-8 py-3 rounded-xl 
                  transition-colors font-semibold shadow-lg hover:shadow-red-200
                  ${
                    isBooking
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:bg-red-700"
                  }`}
                >
                  {isBooking ? "Processing..." : "Book Now"}
                </button>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="prose prose-lg max-w-none mb-8">
              <h3 className="text-xl font-semibold mb-4">
                About This Activity
              </h3>
              <p className="text-gray-600">{activity.description}</p>
            </div>

            {/* Fasilitas */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Facilities</h3>
              <div
                className="prose prose-blue max-w-none bg-gray-50 rounded-xl p-6"
                dangerouslySetInnerHTML={{ __html: activity.facilities }}
              />
            </div>

            {/* Lokasi dan Peta */}
            <div className="bg-white">
              <h3 className="text-xl font-semibold mb-6 flex items-center">
                <MapPin className="w-6 h-6 text-red-600 mr-2" />
                Location
              </h3>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Detail Lokasi */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Address
                    </h4>
                    <p className="text-gray-600">{activity.address}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Getting There
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <Users className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            By Public Transport
                          </h5>
                          <p className="text-gray-600 text-sm">
                            Nearest bus stop: Central Station (500m)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-lg mr-4">
                          <Clock className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Travel Time
                          </h5>
                          <p className="text-gray-600 text-sm">
                            ~30 minutes from city center
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Peta */}
                <div className="h-full min-h-[400px]">
                  <div className="bg-gray-50 rounded-xl overflow-hidden h-full">
                    <div
                      className="h-full w-full"
                      dangerouslySetInnerHTML={{
                        __html: activity.location_maps,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* End of location section */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;