"use client";

import { TransferType } from "@/lib/types/index.d";
import { Table } from "antd";
import { transfersColumns } from "./columns";
import React, { useState } from "react";
import { SelectedTransferRightSider } from "./transferRightSider";
import { cn } from "@/lib/utils";

type Props = {
  data?: TransferType[];
  isLoading: boolean;
};

export const TransfersList: React.FC<Props> = ({ data, isLoading }) => {
  const [selectedTransfer, setSelectedTransfer] = useState<TransferType>();
  const [openSelectedTransferSider, setOpenSelectedTransferSider] =
    useState<boolean>(false);

  const onRowClick = (record: TransferType) => {
    setOpenSelectedTransferSider(true);
    setSelectedTransfer(record);
  };

  return (
    <>
      <Table
        loading={isLoading}
        rowClassName={(rowData) =>
          cn("bg-[#f5f5f5] odd:bg-white hover:cursor-pointer", selectedTransfer?.id===rowData.id && "bg-primary bg-opacity-25")
        }
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
      <SelectedTransferRightSider
        open={openSelectedTransferSider}
        trigger={setOpenSelectedTransferSider}
        data={selectedTransfer}
      />
    </>
  );
};
