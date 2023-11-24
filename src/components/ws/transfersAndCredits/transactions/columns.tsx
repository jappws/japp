import { TransferType } from "@/lib/types";
import { TableColumnsType } from "antd";

export const transfersColumns: TableColumnsType<TransferType> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Expéditeur",
    dataIndex: "sender",
    key: "sender",
    ellipsis: true,
  },
  {
    title: "Montant",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (_, record) =>
      `${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(record.amount)}`,
  },
  {
    title: "Qté Or",
    dataIndex: "goldQuantity",
    key: "goldQuantity",
  },
  {
    title: "Type de transfer",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Solde Après",
    dataIndex: "balanceAfter",
    key: "balanceAfter",
  },
  {
    title: "Note",
    dataIndex: "message",
    key: "message",
  },
];
