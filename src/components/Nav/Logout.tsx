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
    const inputNav = document.getElementById("my-drawer-3");
    if (inputNav) {
      (inputNav as HTMLInputElement).checked = false;
    }
    try {
      await axios.get("/api/auth/logout");
      dispatch(clearUser());
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to logout");
      }
    }
  };

  return (
    <li onClick={handleLogout} className="btn btn-sm font-bold uppercase">
      Logout
    </li>
  );
}
