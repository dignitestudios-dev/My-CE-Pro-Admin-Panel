"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { API } from "@/lib/api/axios";
import { toast, Toaster } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  profession: any;
  onSuccess?: () => void;
}

export default function EditProfessionModal({
  open,
  onClose,
  profession,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  // ✅ Prefill data
  useEffect(() => {
    if (profession) {
      setValue("name", profession.name);

      // split "10hr - 20hr"
      const parts = profession.ceHours?.split("-");
      if (parts) {
        setValue("startHours", parseInt(parts[0]));
        setValue("endHours", parseInt(parts[1]));
      }
    }
  }, [profession, setValue]);

  const onSubmit = async (data: any) => {
    try {
      await API.put(`/admin/professions/${profession._id}`, {
        name: data.name,
        ceHours: `${data.startHours}hr - ${data.endHours}hr`,
      });

      toast.success("Profession updated");

      setTimeout(() => {
        reset();
        onClose();
        onSuccess?.();
      }, 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/25 flex justify-center items-center z-50">
      <Toaster position="top-right" />

      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-4">
          Edit Profession
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <Input
            {...register("name", { required: "Required" })}
            placeholder="Profession name"
          />
          {errors.name && <p className="text-red-500 text-sm">{`${errors.name.message}`}</p>}

          <div className="flex gap-2">
            <Input
              type="number"
              {...register("startHours", { required: true })}
              placeholder="Start"
            />
            <Input
              type="number"
              {...register("endHours", { required: true })}
              placeholder="End"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}