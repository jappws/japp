import { TransferType } from "@/lib/types";
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
    title: "Montant",
    dataIndex: "amount",
    key: "amount",
    align: "right",
    render: (_, record) => (
      <span
        className={cn(
          record.type === "MONEY_TRANSFER" ? "text-red-500" : "text-green-500"
        )}
      >{`${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(record.amount)}`}</span>
    ),
  },
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
      <span>{`${new Intl.NumberFormat("fr-FR", {
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
