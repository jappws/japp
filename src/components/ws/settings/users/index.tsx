"use client";

import { useQuery } from "@tanstack/react-query";
import { UsersList } from "./list";
import axios from "axios";
import { UserType } from "@/lib/types/index.d";

export const UsersClient = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get(`/api/v1/ws/users`).then((res) => res.data as UserType[]),
  });
  return (
    <div>
      <UsersList data={data} isLoading={isLoading} />
    </div>
  );
};
