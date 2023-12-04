import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Table, TableColumnsType } from "antd";
import dayjs from "dayjs";

const columns: TableColumnsType<TransactionType> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    render: (_, record) => `${dayjs(record.date).format("DD-MM-YYYY")}`,
  },
  {
    title: "Intitulé",
    dataIndex: "title",
    key: "title",
    responsive: ["md"],

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
        <span className="text-green-500">{`${new Intl.NumberFormat("fr-FR", {
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
      record.type === "TRANSFER" ? (
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
    responsive: ["md"],
  },
];

type Props = {
  data?: TransactionType[];
};

export const TransactionsListToPrint: React.FC<Props> = ({ data }) => {
  return (
    <>
      <Table
        rowClassName="bg-[#f5f5f5] odd:bg-white"
        columns={columns}
        dataSource={data}
        size="small"
        pagination={false}
        bordered={true}
      />
    </>
  );
};
