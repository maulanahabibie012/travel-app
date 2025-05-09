import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Komponen modal konfirmasi penghapusan
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  // Jika modal tidak terbuka, tidak menampilkan apapun
  if (!isOpen) return null;

  return (
    <>
      {/* Latar belakang gelap untuk modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
        >
          {/* Ikon peringatan dan judul modal */}
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Remove Item</h3>
          </div>
          
          {/* Pesan konfirmasi */}
          <p className="text-gray-600 mb-6">
            Are you sure you want to remove "{itemName}" from your cart?
          </p>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      </>
  );
};

export default DeleteConfirmationModal;
