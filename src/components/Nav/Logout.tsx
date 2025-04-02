"use client";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { clearUser } from "@/store/slices/userSlice";
import axios from "axios";
import { toast } from "sonner";

export default function Logout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      dispatch(clearUser());
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline btn-sm font-bold uppercase"
    >
      Logout
    </button>
  );
}
