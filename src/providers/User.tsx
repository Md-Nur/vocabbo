"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode, useEffect } from "react";
import Loading from "@/components/Loading";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setLoading, setError } from "@/store/slices/userSlice";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();

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
    }
  }, [data, isLoading, isError, dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default UserProvider;
