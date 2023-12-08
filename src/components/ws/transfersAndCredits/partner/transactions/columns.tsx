'use client'

import { TransferType } from "@/lib/types/index.d";
import { cn, getTransferTitle } from "@/lib/utils";
import { TableColumnsType } from "antd";
import dayjs from "dayjs";

export const transfersColumns: TableColumnsType<TransferType> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, record) => dayjs(record.date).format("DD-MM-YYYY"),
  },
  {
    title: "Expéditeur",
    dataIndex: "sender",
    key: "sender",
    ellipsis: true,
  },
  {
    title: "Entrée",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (_, record) =>
      record.type === "GOLD_TRANSFER" ? (
        <span className="text-green-500">{`${new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "USD",
        }).format(record.amount)}`}</span>
      ) : (
        ""
      ),
    ellipsis: true,
  },
  {
    title: "Sortie",
    dataIndex: "amount",
    key: "account",
    align: "right",
    render: (_, record) =>
      record.type === "MONEY_TRANSFER" ? (
        <span className="text-yellow-500">{`${new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "USD",
        }).format(record.amount)}`}</span>
      ) : (
        ""
      ),
    ellipsis: true,
  },
  // {
  //   title: "Montant",
  //   dataIndex: "amount",
  //   key: "amount",
  //   align: "right",
  //   render: (_, record) => (
  //     <span
  //       className={cn(
  //         record.type === "MONEY_TRANSFER"
  //           ? "text-yellow-500"
  //           : "text-green-500"
  //       )}
  //     >{`${new Intl.NumberFormat("fr-FR", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(record.amount)}`}</span>
  //   ),
  // },
  {
    title: "Qté Or",
    dataIndex: "goldQuantity",
    key: "goldQuantity",
    ellipsis: true,
  },
  {
    title: "Type de transfer",
    dataIndex: "type",
    key: "type",
    ellipsis: true,
    render: (_, record) => getTransferTitle(record.type),
  },
  {
    title: "Solde",
    dataIndex: "balanceAfter",
    key: "balanceAfter",
    align: "right",
    render: (_, record) => (
      <span
        className={cn(record.balanceAfter < 0 ? "text-red-500" : "")}
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
    ellipsis: true,
  },
];
