"use client";

import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  MailOutlined,
  MoreOutlined,
  PrinterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Space,
  Typography,
  theme,
  Tooltip,
  Button,
  Dropdown,
  Modal,
  Avatar,
  Drawer,
} from "antd";
import { useState, Dispatch, SetStateAction } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

import { EditUserForm } from "./forms/editUserForm";
import { UserType } from "@/lib/types";

const { confirm } = Modal;

type Props = {
  open: boolean;
  trigger?: Dispatch<SetStateAction<boolean>>;
  user?: UserType;
};

export const UserRightSider: React.FC<Props> = ({
  open,
  trigger,
  user,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [openEditProfileForm, setOpenEditProfileForm] =
    useState<boolean>(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return (
    <Drawer
      title={
        <div className="flex">
          <Space>{}</Space>
          <div className="flex-1" />
          <Space>
            <Tooltip title="Modifier" placement="bottomRight">
              <Button
                icon={<EditOutlined />}
                type="text"
                shape="circle"
                onClick={() => setOpenEditProfileForm(true)}
                disabled={session?.user.role !== "ADMIN"}
              />
            </Tooltip>
            <Button
              icon={<CloseOutlined />}
              type="text"
              shape="circle"
              onClick={() => {
                trigger?.(false);
              }}
            />
          </Space>
        </div>
      }
      open={open}
      destroyOnClose={true}
      closable={false}
      onClose={() => {
        trigger?.(false);
      }}
    >
      <Layout className="">
        <Layout.Content className="bg-white">
          {/* <BillingInfo billing={billing} /> */}
        </Layout.Content>
        <Layout.Footer
          style={{
            display: "flex",
            backgroundColor: "#fff",
          }}
          className="px-0"
        >
          <div className="flex flex-col">
            <div className="flex">
              <Typography.Text className="flex-1 font-semibold text-[#dedede] ">
                Opérateur créateur
              </Typography.Text>
            </div>
            <Space align="center" className="">
              <Avatar icon={<UserOutlined />} />
              <div className="">
                <Typography.Text
                  className="m-0 w-full text-[12px]"
                  style={{ fontSize: 12 }}
                  ellipsis={true}
                >
                  {`${user?.createdBy.firstName} ${user?.createdBy.firstName}`}
                </Typography.Text>
                <Typography.Text className="m-0 text-[12px]">
                  {user?.createdBy.username}
                </Typography.Text>
              </div>
            </Space>
          </div>
        </Layout.Footer>
      </Layout>
      <EditUserForm
        open={openEditProfileForm}
        toggle={setOpenEditProfileForm}
        initialData={user}
      />
    </Drawer>
  );
};
