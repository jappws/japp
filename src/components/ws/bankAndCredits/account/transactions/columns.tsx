"use client";

import { TransactionType } from "@/lib/types/index.d";
import { cn } from "@/lib/utils";
import { TableColumnsType } from "antd";
import dayjs from "dayjs";

export const transactionsColumns: TableColumnsType<TransactionType> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, record) => `${dayjs(record.date).format("DD-MM-YYYY")}`,
    ellipsis: true,
  },
  {
    title: "Intitulé",
    dataIndex: "title",
    key: "title",
    responsive: ["md"],
    ellipsis: true,
    render: (_, record) => `${record.title}`,
  },
  {
    title: "Entrée",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (_, record) =>
      record.type === "DEPOSIT" ||
      record.type === "LOAN_PAYMENT" ||
      record.type === "RECEIPT_OF_TRANSFER" ? (
        <span className="text-blue-500">{`${new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "USD",
        }).format(record.amount)}`}</span>
      ) : (
        ""
      ),
  },
  {
    title: "Sortie",
    dataIndex: "amount",
    key: "account",
    align: "right",
    render: (_, record) =>
      record.type === "WITHDRAWAL" ||
      record.type === "LOAN_DISBURSEMENT" ||
      record.type ==="TRANSFER" ? (
        <span className="text-yellow-500">{`${new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "USD",
        }).format(record.amount)}`}</span>
      ) : (
        ""
      ),
  },
  {
    title: "Solde",
    dataIndex: "balanceAfter",
    key: "balanceAfter",
    align: "right",
    render: (_, record) => (
      <span
        className={cn(record.balanceAfter < 0 ? "text-red-500" : "text-green-500")}
      >{`${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(record.balanceAfter)}`}</span>
    ),
  },
  {
    title: "Note",
    dataIndex: "message",
    key: "message",
    responsive: ["md"],
    ellipsis: true,
  },
  // {
  //   title: "Statut",
  //   dataIndex: "status",
  //   key: "status",
  //   responsive: ["md"],
  //   ellipsis: true,
  // },
];
