"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/Loading";
import { usePathname } from "next/navigation";
import { storePreviousRoute } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading, setError } from "@/store/slices/userSlice";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/auth/jwt");
      return res.data;
    },
    retry: 0,
  });

  useEffect(() => {
    dispatch(setLoading(isLoading));
    if (data) {
      dispatch(setUser(data));
    } else if (isError) {
      dispatch(setError("Authentication failed"));
      storePreviousRoute(pathname);
    }
  }, [data, isLoading, isError, pathname, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default UserProvider;
