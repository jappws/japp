'use client'

import { AccountType } from "@/lib/types";
import { cn, getHSLColor } from "@/lib/utils";
import { TableColumnsType, Avatar, Switch } from "antd";

export const transactionsColumns: TableColumnsType<AccountType> = [
  {
    title: "No",
    dataIndex: "accountNumber",
    key: "accountNumber",
    width: 80,
  },
  {
    title: "Photo",
    dataIndex: "owner",
    key: "owner",
    responsive: ["md"],
    render: (value, record) => (
      <Avatar
        style={{
          backgroundColor: getHSLColor(
            `${record.owner.firstName} ${record.owner.lastName} ${record.owner.surname}`
          ),
        }}
      >
        {record.owner.firstName?.charAt(0).toUpperCase()}
        {record.owner.lastName?.charAt(0).toUpperCase()}
      </Avatar>
    ),
    width: 58,
    align: "center",
  },
  {
    title: "Exploitant",
    dataIndex: "owner",
    key: "owner",
    ellipsis: true,
    render: (_, record) =>
      `${record.owner.firstName} ${record.owner.lastName} ${record.owner.surname}`,
  },
  {
    title: "Sexe",
    dataIndex: "sex",
    key: "sex",
    width: 52,
    render: (_, record) => `${record.owner.sex}`,
    align:"center"
  },
  {
    title: "Solde",
    dataIndex: "amount",
    key: "amount",
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
  {
    title: "Compte",
    dataIndex: "owner",
    key: "owner",
    responsive: ["md"],
    render: (_,record) => (
      <Switch
        checkedChildren="Éligible au crédit"
        checked={record?false:true}
        unCheckedChildren="Non éligible au crédit"
        disabled
      />
    ),
  },
];
