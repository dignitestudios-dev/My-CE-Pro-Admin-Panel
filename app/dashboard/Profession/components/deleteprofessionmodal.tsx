"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API } from "@/lib/api/axios";
import { toast, Toaster } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  profession: any;
  onSuccess?: () => void;
}

export default function DeleteProfessionModal({
  open,
  onClose,
  profession,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!profession?._id) return;

    try {
      setLoading(true); // 🔥 disable UI immediately

      await API.delete(`/admin/professions/${profession._id}`);

      toast.success("Profession deleted successfully");

      // small delay for UX smoothness
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Delete failed"
      );
    } finally {
      setLoading(false); // 🔥 always reset
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        
        <h2 className="text-lg font-semibold mb-2">
          Delete Profession
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {profession?.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-2">
          
          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading} // 🔥 disable during request
          >
            Cancel
          </Button>

          {/* Delete Button */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading} // 🔥 prevent double click
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </Button>

        </div>
      </div>
    </div>
  );
}