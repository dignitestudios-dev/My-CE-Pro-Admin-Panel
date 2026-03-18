"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { API } from "@/lib/api/axios";

interface ProfessionFormInputs {
  name: string;
  ceHours: number;
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
      await API.post("/admin/professions", {
        name: data.name,
        ceHours: data.ceHours,
      });
      reset();
      setShowCreateModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Profession error:", error);
    }
  };

  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
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
            <label htmlFor="ceHours" className="text-sm font-medium text-gray-700">
              CE Hours
            </label>
            <Input
              id="ceHours"
              
              
              {...register("ceHours", {
                required: "CE Hours is required",
              })}
              placeholder="Enter CE hours"
            />
            {errors.ceHours && (
              <p className="text-red-500 text-sm">{errors.ceHours.message}</p>
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