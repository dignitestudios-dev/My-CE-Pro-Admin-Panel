"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { API } from "@/lib/api/axios";
import { toast, Toaster } from "sonner";

interface ProfessionFormInputs {
  name: string;
  
  startHours: number;
  endHours: number;
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
  } = useForm<ProfessionFormInputs>();

 const onSubmit: SubmitHandler<ProfessionFormInputs> = async (data) => {
  try {
    const res = await API.post("/admin/professions", {
      name: data.name,
      ceHours: data.startHours+"hr" + " - " + data.endHours+"hr",
    });

    const message = res?.data?.message || "Profession created successfully";

    toast.success(message);

    setTimeout(() => {
      reset();
      setShowCreateModal(false);
      onSuccess?.();
    }, 3000);

  } catch (err: any) {
    const message =
      err?.response?.data?.message || "Something went wrong";

    toast.error(message);
  }
};
  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowCreateModal(false)}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Create Profession</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Profession Name
            </label>
            <Input
              id="name"
              {...register("name", { required: "Profession name is required" })}
              placeholder="Enter profession name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
  <label className="text-sm font-medium text-gray-700">
    CE Hours
  </label>

  <div className="flex items-center gap-2">
    
    {/* Start Hours */}
    <Input
      type="number"
      min={1}
      max={24}
      {...register("startHours", {
        required: "Start hour is required",
        valueAsNumber: true,
        min: { value: 1, message: "Min 1 hour" },
        max: { value: 24, message: "Max 24 hours" },
      })}
      placeholder="Start"
    />

    <span>-</span>

    {/* End Hours */}
    <Input
      type="number"
      min={1}
      max={24}
      {...register("endHours", {
        required: "End hour is required",
        valueAsNumber: true,
        min: { value: 1, message: "Min 1 hour" },
        max: { value: 24, message: "Max 24 hours" },
        validate: (value, formValues) =>
          value > formValues.startHours || "End must be greater than start",
      })}
      placeholder="End"
    />
  </div>

  {/* Errors */}
  {errors.startHours && (
    <p className="text-red-500 text-sm">{errors.startHours.message}</p>
  )}
  {errors.endHours && (
    <p className="text-red-500 text-sm">{errors.endHours.message}</p>
  )}
</div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => { reset(); setShowCreateModal(false); }}
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