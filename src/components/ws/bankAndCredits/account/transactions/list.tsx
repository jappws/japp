"use client";

import { AccountType, TransactionType } from "@/lib/types";
import { Table } from "antd";
import { transactionsColumns } from "./columns";
import React, { useState } from "react";
import { SelectedTransRightSider } from "./transRightSider";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import axios from "axios";

type Props = {
  data?: TransactionType[];
  isLoading: boolean;
};

export const TransactionsList: React.FC<Props> = ({ data, isLoading }) => {
  const [selectedTrans, setSelectedTrans] = useState<TransactionType>();
  const [openSelectedTransSider, setOpenSelectedTransSider] =
    useState<boolean>(false);

  const { data: session } = useSession();
  const { accountId } = useParams();

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}`)
        .then((res) => res.data as AccountType),
    enabled: !!session?.user && !!accountId,
  });

  const onRowClick = (record: TransactionType) => {
    setOpenSelectedTransSider(true);
    setSelectedTrans(record);
  };

  return (
    <>
      <Table
        loading={isLoading}
        rowClassName={(rowData) =>
          cn(
            "bg-[#f5f5f5] odd:bg-white hover:cursor-pointer",
            selectedTrans?.id === rowData.id && "bg-primary bg-opacity-25"
          )
        }
        columns={transactionsColumns}
        dataSource={data}
        size="small"
        pagination={{ defaultPageSize: 50, pageSizeOptions: [25, 50, 75, 100] }}
        tableLayout="fixed"
        bordered={true}
        onRow={(record) => {
          return {
            onClick: onRowClick.bind(this, record), // click row
          };
        }}
      />
      <SelectedTransRightSider
        open={openSelectedTransSider}
        trigger={setOpenSelectedTransSider}
        data={selectedTrans}
        account={account}
      />
    </>
  );
};
