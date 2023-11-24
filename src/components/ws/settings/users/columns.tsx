import { TransactionType, UserType } from "@/lib/types";
import { getHSLColor } from "@/lib/utils";
import { Avatar, TableColumnsType } from "antd";
import dayjs from "dayjs";

export const usersColumns: TableColumnsType<UserType> = [
  {
    title: "Photo",
    dataIndex: "owner",
    key: "owner",
    responsive: ["md"],
    render: (value, record) => (
      <Avatar
        style={{
          backgroundColor: getHSLColor(
            `${record.firstName} ${record.lastName} ${record.surname}`
          ),
        }}
      >
        {record.firstName?.charAt(0).toUpperCase()}
        {record.lastName?.charAt(0).toUpperCase()}
      </Avatar>
    ),
    width: 58,
    align: "center",
  },
  {
    title: "Noms",
    dataIndex: "owner",
    key: "owner",
    ellipsis: true,
    render: (_, record) =>
      `${record.firstName} ${record.lastName} ${record.surname}`,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    ellipsis: true,
  },
  {
    title: "Téléphone",
    dataIndex: "phone",
    key: "phone",
    ellipsis: true,
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    ellipsis: true,
  },

  {
    title: "Statut",
    dataIndex: "status",
    key: "status",
    responsive: ["md"],
    ellipsis: true,
  },
];
