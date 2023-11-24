import { TransactionType } from "@/lib/types"
import { TableColumnsType } from "antd"
import dayjs from 'dayjs'

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
      responsive:["md"],
      ellipsis: true,
      render: (_, record) => `${record.title}`,
    },
    {
      title: "Entrée",
      dataIndex: "account",
      key: "account",
      align: "right",
    //   render: (_, record) =><span></span>,
    //   ellipsis: true,
    },
    {
        title: "Sortie",
        dataIndex: "account",
        key: "account",
        align: "right",
      //   render: (_, record) =><span></span>,
      //   ellipsis: true,
      },
    {
      title: "Solde",
      dataIndex: "amount",
      key: "amount",
      ellipsis: true,
      align: "right",
    //   render: (_, record) => (<> </>),
        //   {record.type === "debit" && (
        //     <span className=" text-red-500">{`${new Intl.NumberFormat("fr-FR", {
        //       style: "currency",
        //       currency: record.cashAccount.currency.isoCode,
        //     }).format(record.amount)}`}</span>
        //   )}
        //   {record.type === "credit" && (
        //     <span className=" text-green-500">
        //       {`${new Intl.NumberFormat("fr-FR", {
        //         style: "currency",
        //         currency: record.cashAccount.currency.isoCode,
        //       }).format(record.amount)}`}
        //     </span>
        //   )}
        
      
    },
    {
        title: "Note",
        dataIndex: "message",
        key: "message",
        responsive:["md"],
        ellipsis: true,
      },
      {
        title: "Statut",
        dataIndex: "status",
        key: "status",
        responsive:["md"],
        ellipsis: true,
      },
  ];