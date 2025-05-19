import  { useEffect, useState } from "react";
import useTransaction from "../../../hooks/useTransaction";
import { useNavigate, useParams } from "react-router-dom";
import DashboardSidebar from "../../../components/DashboardSidebar";
import { ArrowLeft } from "lucide-react";

const TransactionDetailManag = () => {

  const { transactionId } = useParams();
  const { fetchTransaction } = useTransaction();

  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Effect untuk mengambil detail transaksi saat komponen dimount
  useEffect(() => {
    const getTransaction = async () => {
      setLoading(true);
      const result = await fetchTransaction(transactionId);
      if (result.success) {
        setTransaction(result.transaction);
        setUploadedImageUrl(result.transaction.proofPaymentUrl); // Set the proofPaymentUrl
      } else {
        setError(result.error);
      }
    }

    getTransaction();
  }, [transactionId]);


  return (
    <div className="min-h-screen w-full bg-red-600 flex">
      <DashboardSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <h1>test transaksi</h1>
      <div
        className={`w-full p-4 transition-all duration-300 ${
          isExpanded ? "ml-64" : "pl-14"
        }`}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Detail Transaksi</h1>
        </div>
        <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-white hover:bg-red-700 px-4 py-2 rounded mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        {/* Informasi Transaksi */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transition-all">
          {/* Detail Invoice dan Status */}
          
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm text-gray-500 mb-1">Invoice ID</p>
              <p className="font-medium text-gray-900 mb-4">
                {transaction?.invoiceId}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                IDR {transaction?.totalAmount?.toLocaleString("id-ID") ?? "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                  transaction?.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : transaction?.status === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {transaction?.status}
              </span>
            </div>
          </div>

          {/* Metode Pembayaran */}
          <div className="mb-8 p-6  rounded-xl">
            <p className="text-sm text-gray-500 mb-4">Payment Method</p>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-sm">
                <img
                  src={transaction?.payment_method?.imageUrl}
                  alt={transaction?.payment_method?.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {transaction?.payment_method?.name}
                </p>
                <p className="text-gray-500">
                  {transaction?.payment_method?.virtual_account_number}
                </p>
                <p className="text-sm text-gray-400">
                  VA Name: {transaction?.payment_method?.virtual_account_name}
                </p>
              </div>
            </div>
            {/* Bukti Pembayaran yang Sudah Ada */}
            {uploadedImageUrl && (
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-4">Proof of Payment</p>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={uploadedImageUrl}
                    alt="Proof of Payment"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}

            {/* Informasi Tanggal */}
            <div className="grid grid-cols-2 gap-8 mb-8 p-6  rounded-xl">
              <div>
                <p className="text-sm text-gray-500 mb-2">Order Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(transaction?.orderDate).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created: {new Date(transaction?.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Expiration Date</p>
                <p className="font-medium text-gray-900">
                  {new Date(transaction?.expiredDate).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Last Updated:{" "}
                  {new Date(transaction?.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Daftar Item */}
            <div className="space-y-6">
              <p className="text-sm text-gray-500 mb-4">Items</p>
              {transaction?.transaction_items?.map((item) => (
                <div key={item.id} className="flex gap-6 p-4 rounded-xl">
                  <img
                    src={item.imageUrls[0]}
                    alt={item.title}
                    className="w-24 h-24 rounded-lg object-cover shadow-sm"
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      {item.quantity} x IDR {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailManag;
