"use client";

import { ProCard } from "@ant-design/pro-components";
import { TransactionsList } from "./list";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { TransactionType } from "@/lib/types";
import { useParams } from "next/navigation";

export const AccountTransactions = () => {
  const { data: session } = useSession();
  const { accountId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}/transactions`)
        .then((res) => res.data as TransactionType[]),
    enabled: !!session?.user && !!accountId,
  });
  return (
    <div>
      {/* <ProCard className="min-h-[800px]"> */}
      <TransactionsList data={data} isLoading={isLoading} />
      {/* </ProCard> */}
    </div>
  );
};
