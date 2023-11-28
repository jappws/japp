'use client'

import { TransactionType } from "@/lib/types";
import { Table } from "antd";
import { transactionsColumns } from "./columns";
import React from "react";

type Props={
    data?:TransactionType[]
    isLoading:boolean
}

export const TransactionsList:React.FC<Props> =({data, isLoading})=>{

    const onRowClick = (record: TransactionType) => {};

    return <Table
    loading={isLoading}
    rowClassName={(rowData) => "bg-[#f5f5f5] odd:bg-white hover:cursor-pointer"}
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
}