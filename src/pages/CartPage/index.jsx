import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, CreditCard, Wallet } from "lucide-react";
import { useCartContext } from "../../context/CartContext";
import useTransaction from "../../hooks/useTransaction";
import useCart from "../../hooks/useCart";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal/index.jsx";
import Navbar from "../../components/Navbar";

const CartPage = () => {
  // Inisialisasi hooks dan state
  const navigate = useNavigate();
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });
  
  // Mengambil fungsi dan state dari custom hooks
  const {
    cartItems,            // Data item dalam keranjang
    loading,             // Status loading
    updateQuantity,      // Fungsi update jumlah item
    deleteCartItem,      // Fungsi hapus item
    selectedItems,       // Item yang dipilih
    toggleItemSelection, // Toggle pilihan item
    toggleAllItems,      // Toggle semua item
    getSelectedItemsTotal, // Hitung total harga
  } = useCart();

  // State untuk manajemen pembayaran dan hapus item
  const { paymentMethods, createTransaction, loading: creatingTransaction } = useTransaction();
  const [deleteItem, setDeleteItem] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const { updateCartCount } = useCartContext();

  // Tampilan loading
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handler untuk mengubah jumlah item
  const handleQuantityChange = async (cartId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      const success = await updateQuantity(cartId, newQuantity);

      if (!success) {
        setToast({
          show: true,
          message: "Failed to update quantity",
          type: "error",
        });
      }
    }
  };

  // Handler untuk menghapus item
  const handleDelete = async (cartId, itemName) => {
    setDeleteItem({ id: cartId, name: itemName });
  };

  // Konfirmasi penghapusan item
  const confirmDelete = async () => {
    if (!deleteItem) return;

    const success = await deleteCartItem(deleteItem.id);
    if (success) {
      await updateCartCount(); // Update cart count after successful delete
    }
    setToast({
      show: true,
      message: success
        ? `Successfully removed ${deleteItem.name}`
        : "Failed to remove item",
      type: success ? "success" : "error",
    });
    setDeleteItem(null);
  };

  // Handler untuk membuat transaksi
  const handleCreateTransaction = async () => {
    // Validasi item yang dipilih
    if (!selectedItems || !selectedItems.length) {
      setToast({
        show: true,
        message: "Please select items to checkout",
        type: "error",
      });
      return;
    }

    // Validasi metode pembayaran
    if (!selectedPayment) {
      setToast({
        show: true,
        message: "Please select a payment method",
        type: "error",
      });
      return;
    }

    // Proses pembuatan transaksi
    try {
      console.log("Selected items:", selectedItems);
      const selectedItemIds = selectedItems.map((item) => item);
      console.log("Selected item IDs:", selectedItemIds);
      console.log("Selected payment method:", selectedPayment);
      const createResult = await createTransaction(
        selectedItemIds,
        selectedPayment
      );
      console.log("Create transaction result:", createResult);
      if (createResult.success) {
        console.log("Navigating to payments page with transaction ID:", createResult.transactionId);
        navigate(`/payments/${createResult.transactionId}`);
      } else {
        setToast({
          show: true,
          message: createResult.error || "Transaction creation failed",
          type: "error",
        });
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Komponen Toast untuk notifikasi */}
      {/* <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      /> */}
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header dengan pilihan Select All */}
        <div className="flex flex-col justify-between items-star gap-4 mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-0">
            Keranjang Belanja
          </h1>
          {cartItems && cartItems.length > 0 && (
            <div className="flex items-center gap-2 ml-6">
              <input
                type="checkbox"
                checked={
                  selectedItems && selectedItems.length === cartItems.length
                }
                onChange={(e) => toggleAllItems(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          )}
        </div>

        {/* Tampilan keranjang kosong atau daftar item */}
        {cartItems && cartItems.length === 0 ? (
          // Tampilan keranjang kosong
          <div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 "
          >
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 mb-4">Keranjang Anda kosong</p>
              <button
                onClick={() => navigate("/activity")}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Jelajahi Aktivitas
              </button>
            </div>
          </div>
        ) : (
          // Tampilan daftar item dan ringkasan
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Daftar item dalam keranjang */}
            <div className="flex-1 space-y-4 lg:w-2/3">
                {cartItems &&
                  cartItems.map((item) => (
                    <div className="py-4 bg-white shadow-sm rounded-lg border border-red-700 px-4 flex items-center justify-between"
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      
                    >
                      <div className="flex gap-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={
                              selectedItems && selectedItems.includes(item.id)
                            }
                            onChange={() => toggleItemSelection(item.id)}
                            className="mt-2 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                        </div>
                        <img
                          src={item.activity.imageUrls[0]}
                          alt={item.activity.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.activity.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {item.activity.city}, {item.activity.province}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity,
                                    -1
                                  )
                                }
                                className="p-2 rounded-full hover:bg-gray-100"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span
                                key={item.quantity}
                                initial={{ scale: 1.2 }}
                                animate={{ scale: 1 }}
                                className="font-medium w-8 text-center"
                              >
                                {item.quantity}
                              </span>
                              <button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity,
                                    1
                                  )
                                }
                                className="p-2 rounded-full hover:bg-gray-100"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                              <button
                                whileHover={{ scale: 1.1, color: "#ef4444" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleDelete(item.id, item.activity.title)
                                }
                                className="p-2 rounded-full hover:bg-red-50 text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-900">
                                IDR{" "}
                                {(
                                  item.activity.price * item.quantity
                                ).toLocaleString("id-ID")}
                              </div>
                              {item.activity.price_discount && (
                                <div className="text-sm text-gray-500 line-through">
                                  IDR{" "}
                                  {(
                                    item.activity.price_discount * item.quantity
                                  ).toLocaleString("id-ID")}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
             
            </div>

            {/* Panel ringkasan dan pembayaran */}
            <div className="w-full lg:w-1/3 space-y-4">
              {/* Pilihan metode pembayaran */}
              <div className="bg-white rounded-xl border border-red-700  shadow-sm p-6">
                {/* Ringkasan harga */}
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Selected</span>
                    <span>{selectedItems && selectedItems.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Price</span>
                    <span>
                      IDR {getSelectedItemsTotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <h2 className="text-lg font-semibold mb-4 mt-4">Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer ${
                        selectedPayment === method.id
                          ? "border-red-700 bg-red-100"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center">
                        {method.type === "CREDIT_CARD" ? (
                          <CreditCard className="w-6 h-6 text-white" />
                        ) : (
                          <Wallet className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{method.name}</h3>
                        <p className="text-sm text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Tombol checkout */}
              <button
                onClick={handleCreateTransaction}
                className="mt-4 w-full px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:text-white transition-colors duration-300 font-semibold"
                disabled={creatingTransaction}
              >
                {creatingTransaction ? "Processing..." : "Create Transaction"}
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Modal konfirmasi hapus item */}
      <DeleteConfirmationModal
        title="Delete Item"
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem?.name}
      />
    </div>
  );
};

export default CartPage;
