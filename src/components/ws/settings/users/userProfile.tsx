"use client";

import { CloseOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import {
  Layout,
  Space,
  Typography,
  theme,
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
import dayjs from "dayjs";

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
          <ProCard
            className=" ml"
            title="Identifiants"
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
                label="Email"
                // valueType="avatar"
              >
                {user?.email}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="Téléphone"
                // valueType="avatar"
              >
                {user?.phone}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>


          <ProCard
            className=" ml"
            title="Sécurité"
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
                label="Mot de passe"
                // valueType="avatar"
              >
                {""}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="Rôle"
                render={()=><Tag color="success" className="mr-0">{user?.role}</Tag>}
              >
                {user?.role}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <ProCard
            className=" ml"
            title="Autres informations"
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={{ sm: 1, md: 1 }} emptyText="">
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
              <ProDescriptions.Item
                valueType="text"
                title="Créateur de l'utilisateur (Opérateur)"
              >
                {`${user?.createdBy.firstName} ${user?.createdBy.lastName} (${user?.createdBy?.username})`}
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
    </Drawer>
  );
};
