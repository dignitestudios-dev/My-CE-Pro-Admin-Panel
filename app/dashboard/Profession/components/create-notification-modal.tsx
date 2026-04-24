"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { API } from "@/lib/api/axios";
import { toast, Toaster } from "sonner";

interface ProfessionFormInputs {
  name: string;
  ceHours: string; // "10 - 20"
}

interface CreateProfessionModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (value: boolean) => void;
  onSuccess?: () => void;
}

const CreateProfessionModal: React.FC<CreateProfessionModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProfessionFormInputs>();

  const onSubmit: SubmitHandler<ProfessionFormInputs> = async (data) => {
    try {
      const res = await API.post("/admin/professions", {
        name: data.name,
        ceHours: data.ceHours, // 👈 single field sent
      });

      toast.success(res?.data?.message || "Profession created successfully");

      setTimeout(() => {
        reset();
        setShowCreateModal(false);
        onSuccess?.();
      }, 1500);

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  if (!showCreateModal) return null;
const name = watch("name");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <Toaster position="top-right" />

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">

        <button
          className="absolute top-3 right-3"
          onClick={() => setShowCreateModal(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Create Profession
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          {/* NAME */}
          <div>
            <label className="text-sm font-medium">Profession Name</label>

            <Input
              maxLength={100}
              placeholder="Enter profession name"
              {...register("name", {
                required: "Profession name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
            <span className="flex justify-end text-xs text-gray-500">{name?.length || 0}/100</span>
          </div>

          {/* CE HOURS SINGLE INPUT */}
          <div>
            <label className="text-sm font-medium">
              CE Hours (e.g. 10 - 20)
            </label>

           <Input
  placeholder="e.g. 20 or 20 - 29"
  {...register("ceHours", {
    required: "CE hours is required",
    validate: (value) => {
      const regex = /^\d+(\s*-\s*\d+)?$/;
      return regex.test(value) || "Only numbers or range allowed (e.g. 20 or 20 - 29)";
    },
  })}
/>

            {errors.ceHours && (
              <p className="text-red-500 text-sm">
                {errors.ceHours.message}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setShowCreateModal(false);
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProfessionModal;