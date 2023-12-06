"use client";

import { PartnerType } from "@/lib/types/index.d";
import { Table } from "antd";
import React from "react";
import { useRouter } from "next/navigation";
import { partnersColumns } from "./columns";

type Props = {
  data?: PartnerType[];
  isLoading: boolean;
};

export const PartnersList: React.FC<Props> = ({
   data, isLoading
   }) => {
  const { push } = useRouter();

  const onRowClick = (record: PartnerType) => {
    push(`/ws/transfers_and_credits/${record.id}`);
  };

  return (
    <Table
      loading={isLoading}
      rowClassName={(rowData) =>
        "bg-[#f5f5f5] odd:bg-white hover:cursor-pointer"
      }
      columns={partnersColumns}
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
