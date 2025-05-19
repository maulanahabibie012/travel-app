import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, ArrowLeft, X } from "lucide-react";
import useTransaction from "../../hooks/useTransaction.jsx";
import Navbar from "../../components/Navbar/index.jsx";


const TransactionDetailPage = () => {
  // Inisialisasi state dan hooks untuk manajemen transaksi
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { uploadProofOfPayment, updateProofPayment, fetchTransaction } =
    useTransaction();

  // State untuk manajemen UI dan data
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

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
      setLoading(false);
    };

    getTransaction();
  }, [transactionId]);

  // Handler untuk perubahan file bukti pembayaran
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofImage(file);
      // Membuat preview URL untuk gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler untuk menghapus gambar yang dipilih
  const handleRemoveImage = () => {
    setProofImage(null);
    setPreviewUrl(null);
  };

  // Handler untuk mengupload bukti pembayaran
  const handleUploadProof = async () => {
    if (proofImage) {
      const uploadResult = await uploadProofOfPayment(proofImage);
      if (uploadResult.success) {
        const updateResult = await updateProofPayment(
          transactionId,
          uploadResult.imageUrl
        );
        if (updateResult.success) {
          setToast({
            show: true,
            message: "Payment proof uploaded successfully",
            type: "success",
          });
          setUploadedImageUrl(uploadResult.imageUrl);
          // Refresh transaction details
          window.location.reload();
        } else {
          setToast({
            show: true,
            message: updateResult.error,
            type: "error",
          });
        }
      }
    }
  };

  // Tampilan loading
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan error
  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-red-500">
            {error === "Transaction not found"
              ? "Transaction not found."
              : "Failed to load transaction details."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Tombol Kembali */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h1 className="text-3xl font-bold mb-8 text-gray-900">
            Transaction Detail
          </h1>

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
                  IDR{" "}
                  {transaction?.totalAmount?.toLocaleString("id-ID") ?? "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2">Status</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${transaction?.status === "pending"
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
                  <div
                    key={item.id}
                    className="flex gap-6 p-4 rounded-xl"
                  >
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

            {/* Form Upload Bukti Pembayaran */}
            
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Update Bukti Pembayaran
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-700 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="proof-upload"
                  accept="image/*"
                />
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <img
                        src={previewUrl}
                        alt="Payment proof preview"
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                    Klik “Ubah Gambar” untuk mengunggah bukti pembayaran ini
                    </p>
                  </div>
                ) : (
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <Upload className="w-10 h-10 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Drop file disini atau {" "}
                      <span className="text-blue-600">browse</span>
                    </span>
                    <p className="text-xs text-gray-400">
                      Format File: JPG, PNG, JPEG
                    </p>
                  </label>
                )}
              </div>
              {proofImage && (
                <button
                  onClick={handleUploadProof}
                  className="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 hover:text-white transition-colors"
                >
                  Ganti Bukti Pembayaran
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailPage;
