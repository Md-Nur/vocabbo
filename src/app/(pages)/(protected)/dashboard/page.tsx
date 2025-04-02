"use client";

import { useAppSelector } from "@/store/hooks";

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.user);
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500">Welcome {user?.name}</p>
      <p className="text-gray-500">
        Your email is {user?.email} and your id is {user?.id}
      </p>
      <p className="text-gray-500">
        Your interests are {user?.interests.join(", ")} and your difficulty
        is&nbsp;
        {user?.difficulty}
      </p>
    </div>
  );
}
