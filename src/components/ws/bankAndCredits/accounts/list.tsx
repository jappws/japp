"use client";

import { AccountType } from "@/lib/types";
import { Table } from "antd";
import { transactionsColumns } from "./columns";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  // data?: AccountType[];
  // isLoading: boolean;
};

export const AccountsList: React.FC<Props> = ({
  //  data, isLoading
   }) => {
  const { push } = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios.get(`/api/v1/ws/accounts`).then((res) => res.data as AccountType[]),
  });

  const onRowClick = (record: AccountType) => {
    push(`/ws/bank_and_credits/${record.id}`);
  };

  return (
    <Table
      loading={isLoading}
      rowClassName={(rowData) =>
        "bg-[#f5f5f5] odd:bg-white hover:cursor-pointer"
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
  );
};
