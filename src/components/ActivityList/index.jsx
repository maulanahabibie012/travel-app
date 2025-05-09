import React from "react";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import useActivity from "../../hooks/useActivity";

const ActivityList = () => {
  const { activities, loading, error } = useActivity();

  if (loading) {
    // Menampilkan pesan loading saat data sedang diambil
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="animate-pulse text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    // Menampilkan pesan error jika terjadi kesalahan saat mengambil data
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Filter activities dari ID yang spesifik
  const specificIds = [
    "6f6a450d-c417-4417-9243-c5c81964cd5b",
    "b3cd3802-3ecc-4bf8-b67f-daba55b86ec4",
    "1490d07e-b12a-40ab-a732-716597a3d331",
  ];

  const selectedActivities = activities.filter((activity) =>
    specificIds.includes(activity.id)
  );

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Popular <span className="text-teal-600">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600">
          Temukan destinasi luar biasa yang akan membuat Anda takjub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedActivities.map((activity) => (
            <div
              key={activity.id}
              className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border border-gray-200"
            >
              <div className="relative">
                <img
                  src={activity.imageUrls[0]}
                  alt={activity.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center shadow-md">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold">
                    {activity.rating}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between">
                <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">
                  {activity.description}
                </h3>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-teal-600">
                    IDR {activity.price.toLocaleString()}
                  </span>

                  <Link to={`/activity`}>
                    <button className="group flex items-center text-teal-600 hover:text-red-800 transition-colors">
                      Explore Now
                      <ArrowRight className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 via-green-500 to-lime-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityList;
