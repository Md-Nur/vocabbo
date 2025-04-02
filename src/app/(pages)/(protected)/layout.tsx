"use client";
import { useAppSelector } from "@/store/hooks";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/components/Loading";
import { storePreviousRoute } from "@/lib/utils";

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAppSelector((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      storePreviousRoute(pathname);
      if (!loading && !user?.id) {
        router.push("/auth/login");
      }
    }
  }, [isMounted, loading, user, router, pathname]);

  if (loading) {
    return <Loading />;
  }

  if (user?.id) {
    return <>{children}</>;
  }
};

export default ProtectedLayout;
