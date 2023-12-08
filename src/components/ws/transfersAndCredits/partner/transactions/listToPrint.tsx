import { TransactionType, TransferType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Table, TableColumnsType } from "antd";
import dayjs from "dayjs";

const columns: TableColumnsType<TransferType> = [
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
  },
  {
    title: "Sortie",
    dataIndex: "amount",
    key: "amount",
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
  },
  {
    title: "Qté Or",
    dataIndex: "goldQuantity",
    key: "goldQuantity",
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
  },
];

type Props = {
  data?: TransferType[];
};

export const TransfersListToPrint: React.FC<Props> = ({ data }) => {
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
