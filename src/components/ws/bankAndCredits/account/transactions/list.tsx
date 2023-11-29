"use client";

import { TransactionType } from "@/lib/types";
import { Table } from "antd";
import { transactionsColumns } from "./columns";
import React, { useState } from "react";
import { SelectedTransRightSider } from "./transRightSider";
import { cn } from "@/lib/utils";

type Props = {
  data?: TransactionType[];
  isLoading: boolean;
};

export const TransactionsList: React.FC<Props> = ({ data, isLoading }) => {
  const [selectedTrans, setSelectedTrans] = useState<TransactionType>();
  const [openSelectedTransSider, setOpenSelectedTransSider] =
    useState<boolean>(false);

  const onRowClick = (record: TransactionType) => {
    setOpenSelectedTransSider(true);
    setSelectedTrans(record);
  };

  return (
    <>
      <Table
        loading={isLoading}
        rowClassName={(rowData) =>
          cn("bg-[#f5f5f5] odd:bg-white hover:cursor-pointer", selectedTrans?.id===rowData.id && "bg-primary bg-opacity-50" )
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
      />
    </>
  );
};
