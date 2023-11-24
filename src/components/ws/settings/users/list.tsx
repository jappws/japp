"use client";

import { TransactionType, UserType } from "@/lib/types";
import { Table } from "antd";
import { usersColumns } from "./columns";
import React from "react";

type Props = {
  data?: UserType[];
};

export const UsersList: React.FC<Props> = ({ data }) => {
  const onRowClick = (record: UserType) => {};

  return (
    <Table
      // loading={isLoading}
      rowClassName={(rowData) => "bg-[#f5f5f5] odd:bg-white"}
      columns={usersColumns}
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
