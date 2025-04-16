"use client";
import Button from "@/components/FormUI/button";
import Checkbox from "@/components/FormUI/Checkbox";
import Input from "@/components/FormUI/input";
import Select from "@/components/FormUI/select";
import Textarea from "@/components/FormUI/textarea";
import Title from "@/components/Title";
import { languages } from "@/lib/translate";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "sonner";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.user);
  const [enableEdit, setEnableEdit] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      nativeLanguage: user?.nativeLanguage || "",
      learningLanguage: user?.learningLanguage || "",
      interests: user?.interests.join(", ") || "",
      difficulty: user?.difficulty || "",
      isImgEnabled: user?.isImgEnabled || false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      console.log(data);
      const response = await axios.put(`/api/user/${user?.id}`, data);
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      return response.data; // Changed from response.json() to response.data
    },
    onSuccess: (data) => {
      toast.success("Profile updated successfully!");
      setEnableEdit(false);
      // Update user data in the store

      dispatch(setUser(data));
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    },
    mutationKey: ["updateUser"],
  });

  const onSubmit = async (data: Record<string, any>) => {
    await mutate(data);
  };

  return (
    <div className="card mb-20 w-full">
      <div className="flex items-center gap-5 w-full justify-center">
        <Title>Dashboard</Title>
        {!enableEdit && (
          <div className="dropdown dropdown-end lg:dropdown-right">
            <div tabIndex={0} role="button" className="btn m-1">
              <BsThreeDotsVertical className="text-xl" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <button
                  onClick={() => setEnableEdit(true)}
                  className="btn btn-neutral"
                >
                  Edit
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="card-body">
        <fieldset className="fieldset space-y-3">
          <Input
            {...register("name", { required: true })}
            errors={errors.name}
            disabled={!enableEdit}
            label="Name"
          />

          <Select
            label="Native Language"
            options={Object.keys(languages).map((lan) => ({
              label: lan,
              value: lan,
            }))}
            disabled={!enableEdit}
            {...register("nativeLanguage", { required: true })}
            errors={errors.nativeLanguage}
          />
          <Select
            label="Learning Language"
            options={Object.keys(languages).map((lan) => ({
              label: lan,
              value: lan,
            }))}
            disabled={!enableEdit}
            {...register("learningLanguage", { required: true })}
            errors={errors.learningLanguage}
          />
          <Textarea
            label="Interest"
            placeholder="e.g. English, Gaming, Dancing, etc."
            {...register("interests", { required: true })}
            errors={errors.interests}
            disabled={!enableEdit}
          />
          <Select
            label="Difficulty"
            options={[
              { label: "Beginner", value: "easy" },
              { label: "Intermediate", value: "medium" },
              { label: "Advanced", value: "hard" },
            ]}
            disabled={!enableEdit}
            {...register("difficulty", { required: true })}
            errors={errors.difficulty}
          />

          <Checkbox
            label="Enable Word Image"
            isCheck={user?.isImgEnabled}
            errors={errors.isImgEnabled}
            disabled={!enableEdit}
            {...register("isImgEnabled")}
          />
          {enableEdit && (
            <div className="flex justify-between">
              <Button isLoading={isPending} onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
              <Button
                isLoading={isPending}
                onClick={() => setEnableEdit(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </fieldset>
      </div>
    </div>
  );
}
