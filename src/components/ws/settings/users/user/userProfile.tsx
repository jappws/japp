"use client";

import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Layout, Space, theme, Button, Modal, Avatar, Drawer, Tag } from "antd";
import { useState, Dispatch, SetStateAction } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSession } from "next-auth/react";

import { EditUserForm } from "../forms/editUserForm";
import { UserType } from "@/lib/types/index.d";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { cn, getHSLColor } from "@/lib/utils";
import dayjs from "dayjs";
import { EditPasswordForm } from "../forms/editPassword";

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
  const [openEditPasswordForm, setOpenEditPasswordForm] =
    useState<boolean>(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return (
    <Drawer
      title={
        <div className="flex">
          <Space>
            <Avatar
              style={{
                backgroundColor: getHSLColor(
                  `${user?.firstName} ${user?.lastName} ${user?.surname}`
                ),
              }}
              size="small"
            >
              {user?.firstName?.charAt(0).toUpperCase()}
              {user?.lastName?.charAt(0).toUpperCase()}
            </Avatar>
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
            title="Profile"
            collapsible
            bordered
            extra={[
              <Button
                key="1"
                icon={<EditOutlined />}
                className={cn(
                  "shadow-none",
                  session?.user.role === "ADMIN" ? "block" : "hidden"
                )}
                onClick={() => setOpenEditProfileForm(true)}
                disabled={session?.user?.role !== "ADMIN"}
                shape="circle"
                type="link"
              />,
            ]}
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item ellipsis label="Nom" valueType="text">
                {user?.firstName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Postnom" valueType="text">
                {user?.lastName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Prénom" valueType="text">
                {user?.surname}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Sexe" valueType="text">
                {user?.sex}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Email">
                {user?.email}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Téléphone">
                {user?.phone}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="Rôle"
                render={() => (
                  <Tag color="success" className="mr-0" bordered={false}>
                    {user?.role}
                  </Tag>
                )}
              >
                {user?.role}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <ProCard
            className=" ml"
            title="Sécurité du compte"
            collapsible
            bordered
            extra={[
              <Button
                key="1"
                icon={<EditOutlined />}
                className={cn(
                  "shadow-none",
                  session?.user.role === "ADMIN" ? "block" : "hidden"
                )}
                onClick={() => setOpenEditPasswordForm(true)}
                disabled={session?.user?.role !== "ADMIN"}
                shape="circle"
                type="link"
              />,
            ]}
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item
                label="Mot de passe"
                // valueType="avatar"
              >
                {""}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <ProCard
            className=" ml"
            title="Autres informations"
            collapsible
            bordered
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item
                title="Date de création"
                render={() => dayjs(user?.createdAt).format("DD/MM/YYYY")}
              >
                {`${user?.createdAt}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                title="Dernière modification"
                render={() => dayjs(user?.updatedAt).format("DD/MM/YYYY")}
              >
                {`${user?.updatedAt}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item valueType="text" title="Opérateur créateur">
                {`${user?.createdBy?.firstName ?? ""} ${
                  user?.createdBy?.lastName ?? ""
                } (${user?.createdBy?.username ?? ""})`}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </Layout.Content>
      </Layout>
      <EditUserForm
        open={openEditProfileForm}
        toggle={setOpenEditProfileForm}
        initialData={user}
      />
      <EditPasswordForm
        open={openEditPasswordForm}
        toggle={setOpenEditPasswordForm}
        user={user}
      />
    </Drawer>
  );
};
