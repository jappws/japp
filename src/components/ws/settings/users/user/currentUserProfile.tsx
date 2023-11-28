"use client";

import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Layout, Space, theme, Button, Modal, Avatar, Drawer, Tag } from "antd";
import { useState, Dispatch, SetStateAction } from "react";
import { signOut, useSession } from "next-auth/react";

import { EditUserForm } from "../forms/editUserForm";
import { UserType } from "@/lib/types";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { getHSLColor } from "@/lib/utils";
import { EditPasswordForm } from "../forms/editPassword";

const { confirm } = Modal;

type Props = {
  open: boolean;
  trigger?: Dispatch<SetStateAction<boolean>>;
  user?: UserType;
};

export const CurrentUserRightSider: React.FC<Props> = ({ open, trigger }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [openEditProfileForm, setOpenEditProfileForm] =
    useState<boolean>(false);
  const [openEditPasswordForm, setOpenEditPasswordForm] =
    useState<boolean>(false);

  const { data: session } = useSession();

  return (
    <Drawer
      title={
        <div className="flex">
          <Space>
            <Avatar
              style={{
                backgroundColor: getHSLColor(
                  `${session?.user?.firstName} ${session?.user?.surname}`
                ),
              }}
              size="small"
            >
              {session?.user?.firstName?.charAt(0).toUpperCase()}
              {session?.user?.lastName?.charAt(0).toUpperCase()}
            </Avatar>
            Mon profile
            <Tag className="mr-0" color="purple" bordered={false}>
              {session?.user?.username}
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
            // extra={[
            //   <Button
            //     key="1"
            //     icon={<EditOutlined />}
            //     className="shadow-none"
            //     onClick={() => setOpenEditProfileForm(true)}
            //     disabled={session?.user?.role !== "ADMIN"}
            //     shape="circle"
            //     type="link"
            //   />,
            // ]}
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item ellipsis label="Nom" valueType="text">
                {session?.user?.firstName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Postnom" valueType="text">
                {session?.user?.lastName}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Prénom" valueType="text">
                {session?.user?.surname}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Sexe" valueType="text">
                {session?.user?.sex}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Email">
                {session?.user?.email}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Téléphone">
                {session?.user?.phone}
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label="Rôle"
                render={() => (
                  <Tag color="success" className="mr-0" bordered={false}>
                    {session?.user?.role}
                  </Tag>
                )}
              >
                {session?.user?.role}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          {/* <ProCard
            className=" ml"
            title="Sécurité du compte"
            collapsible
            bordered
            extra={[
              <Button
                key="1"
                icon={<EditOutlined />}
                className="shadow-none"
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
          </ProCard> */}
          <ProCard
            className=" ml"
            style={{ marginBlockEnd: 16 }}
          >
            <Button
              block
              className="shadow-none"
              onClick={() => {
                signOut({ redirect: true, callbackUrl: "/" });
              }}
            >
              Déconnexion
            </Button>
          </ProCard>
        </Layout.Content>
      </Layout>
      {/* <EditUserForm
        open={openEditProfileForm}
        toggle={setOpenEditProfileForm}
        initialData={session?.user}
      />
      <EditPasswordForm
        open={openEditPasswordForm}
        toggle={setOpenEditPasswordForm}
        user={session?.user}
      /> */}
    </Drawer>
  );
};
