"use client";

import { UserType } from "@/lib/types";
import { Table } from "antd";
import { usersColumns } from "./columns";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { UserRightSider } from "./userProfile";

type Props = {};

export const UsersList: React.FC<Props> = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(
    undefined
  );
  const [openRigtSider, setOpenRightSider] = useState<boolean>(false);
  const onRowClick = (record: UserType) => {
    setSelectedUser(record);
    setOpenRightSider(true);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      axios.get(`/api/v1/ws/users`).then((res) => res.data as UserType[]),
  });

  return (
    <>
      <Table
        loading={isLoading}
        rowClassName={(rowData) => "bg-[#f5f5f5] odd:bg-white"}
        columns={usersColumns}
        dataSource={data}
        size="small"
        pagination={{ defaultPageSize: 50, pageSizeOptions: [25, 50, 75, 100] }}
        tableLayout="fixed"
        bordered={true}
        onRow={(record) => {
          return {
            onClick: onRowClick.bind(this, record), // click row
          };
        }}
      />
      <UserRightSider
        open={openRigtSider}
        trigger={setOpenRightSider}
        user={selectedUser}
      />
    </>
  );
};
