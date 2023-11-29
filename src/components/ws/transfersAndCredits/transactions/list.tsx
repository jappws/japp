"use client";

import { TransferType } from "@/lib/types";
import { Table } from "antd";
import { transfersColumns } from "./columns";
import React from "react";

type Props = {
  data?: TransferType[];
  isLoading:boolean
};

export const TransfersList: React.FC<Props> = ({ data,isLoading }) => {
  const onRowClick = (record: TransferType) => {};

  return (
    <Table
      loading={isLoading}
      rowClassName={(rowData) => "bg-[#f5f5f5] odd:bg-white hover:cursor-pointer"}
      columns={transfersColumns}
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
