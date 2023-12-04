'use client'

import { TransactionType, UserType } from "@/lib/types/index.d";
import { getHSLColor } from "@/lib/utils";
import { Avatar, TableColumnsType, Tag } from "antd";
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
    title: "Sexe",
    dataIndex: "sex",
    key: "sex",
    width:52,
    align:"center"
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
    title: "Rôle",
    dataIndex: "role",
    key: "role",
    render: (value, record) => (
      <Tag color={value==="ADMIN"?"success":"purple"} className="mr-0" bordered={false}>
        {value}
      </Tag>
    ),
  },
  {
    title: "Statut",
    dataIndex: "blocked",
    key: "blocked",
    responsive: ["md"],
    render: (value, record) =>
      record.blocked ? (
        <Tag color="warning" className="mr-0" bordered={false}>
          Bloqué
        </Tag>
      ) : (
        <Tag color="success" className="mr-0" bordered={false}>
          Actif
        </Tag>
      ),
  },
];
