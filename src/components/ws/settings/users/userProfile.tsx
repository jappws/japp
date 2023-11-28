"use client";

import {
  CloseOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Space,
  Typography,
  theme,
  Tooltip,
  Button,
  Modal,
  Avatar,
  Drawer,
  Tag,
} from "antd";
import { useState, Dispatch, SetStateAction } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

import { EditUserForm } from "./forms/editUserForm";
import { UserType } from "@/lib/types";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { getHSLColor } from "@/lib/utils";

const { confirm } = Modal;

type Props = {
  open: boolean;
  trigger?: Dispatch<SetStateAction<boolean>>;
  user?: UserType;
};

export const UserRightSider: React.FC<Props> = ({ open, trigger, user }) => {
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
          <Space>
            Utilisateur{" "}
            <Tag className="mr-0" color="purple" bordered={false}>
              {user?.username}
            </Tag>
          </Space>
          <div className="flex-1" />
          <Space>
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
          <ProCard
            className=" ml"
            title="Identité"
            extra={[
              <Button
                key="1"
                icon={<EditOutlined />}
                className="shadow-none"
                onClick={() => setOpenEditProfileForm(true)}
                disabled={session?.user?.role !== "ADMIN"}
              >
                Editer
              </Button>,
            ]}
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={{ sm: 1, md: 1 }} emptyText="">
              <ProDescriptions.Item
                label=""
                // valueType="avatar"
                render={() => (
                  <Avatar
                    style={{
                      backgroundColor: getHSLColor(
                        `${user?.firstName} ${user?.surname}`
                      ),
                    }}
                    size="large"
                  >
                    {user?.firstName?.charAt(0).toUpperCase()}
                    {user?.lastName?.charAt(0).toUpperCase()}
                  </Avatar>
                )}
              >
                {user?.firstName}
              </ProDescriptions.Item>
              <ProDescriptions.Item ellipsis label="Nom" valueType="text">
                {user?.firstName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Postnom" valueType="text">
                {user?.lastName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Prénom" valueType="text">
                {user?.surname}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
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
                  {`${user?.createdBy?.firstName ?? ""} ${
                    user?.createdBy?.firstName ?? ""
                  }`}
                </Typography.Text>
                <Typography.Text className="m-0 text-[12px]">
                  {user?.createdBy?.username ?? ""}
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
