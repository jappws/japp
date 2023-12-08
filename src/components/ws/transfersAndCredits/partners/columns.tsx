'use client'

import { PartnerType } from "@/lib/types/index.d";
import { cn, getHSLColor } from "@/lib/utils";
import { TableColumnsType, Avatar } from "antd";

export const partnersColumns: TableColumnsType<PartnerType> = [
  {
    title: "Photo",
    dataIndex: "code",
    key: "code",
    render: (value, record) => (
      <Avatar
        shape="square"
        style={{
          backgroundColor: getHSLColor(
            `${record.code}`
          ),
        }}
      >
        {record.code?.charAt(0).toUpperCase()}
      
      </Avatar>
    ),
    width: 58,
    align: "center",
  },
  {
    title: "Identifiant",
    dataIndex: "code",
    key: "code"
  },
  {
    title: "Solde",
    dataIndex: "balance",
    key: "balance",
    align: "right",
    render: (_, record) => (
      <span
        className={cn(record.balance >= 0 ? "text-green-500" : " text-red-500")}
      >{`${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(record.balance)}`}</span>
    ),
  }, 
];
