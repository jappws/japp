"use client";

import { AccountType } from "@/lib/types/index.d";
import { cn, getHSLColor } from "@/lib/utils";
import {
  CloseOutlined,
  EditOutlined,
  WarningFilled,
  WarningOutlined,
} from "@ant-design/icons";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Space, Switch, Tag } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { EditAccountForm } from "../../accounts/forms/editAccountForm";
import { useState } from "react";
import { BlockOrUnblockForm } from "../forms/blockOrUnblockForm";
import { DeleteAccountForm } from "../../accounts/forms/deleteAccountForm";

export const AccountOwner = () => {
  const { data: session } = useSession();
  const { accountId } = useParams();

  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const [openBlockOrUnBlockForm, setOpenBlockOrUnBlockForm] =
    useState<boolean>(false);
  const [openDeleteForm, setOpenDeleteForm] = useState<boolean>(false);

  const { data: account, isLoading } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}`)
        .then((res) => res.data as AccountType),
    enabled: !!session?.user && !!accountId,
  });
  return (
    <div>
      <ProCard
        loading={isLoading}
        className=" ml"
        title="Profile"
        extra={[
          <Button
            key="1"
            icon={<EditOutlined />}
            className="shadow-none"
            onClick={() => setOpenEditForm(true)}
            ghost
            type="primary"
          >
            Editer
          </Button>,
        ]}
        style={{ marginBlockEnd: 16 }}
      >
        <ProDescriptions column={{ sm: 1, md: 2 }} emptyText="">
          <ProDescriptions.Item
            label=""
            // valueType="avatar"
            render={() => (
              <Avatar
                style={{
                  backgroundColor: getHSLColor(
                    `${account?.owner.firstName} ${account?.owner.lastName} ${account?.owner.surname}`
                  ),
                }}
                size="large"
              >
                {account?.owner.firstName?.charAt(0).toUpperCase()}
                {account?.owner.lastName?.charAt(0).toUpperCase()}
              </Avatar>
            )}
          >
            {account?.owner?.firstName}
          </ProDescriptions.Item>
          <ProDescriptions.Item ellipsis label="Nom" valueType="text">
            {account?.owner?.firstName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Postnom" valueType="text">
            {account?.owner?.lastName}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Prénom" valueType="text">
            {account?.owner?.surname}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Surnom" valueType="text">
            {account?.owner?.nickname}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Sexe" valueType="text">
            {account?.owner?.sex}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Email" valueType="text">
            {/* {user?.email} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Téléphone" valueType="text">
            {account?.owner?.phone}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Autre téléphone" valueType="text">
            {account?.owner?.otherPhone}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Pays" valueType="text">
            {account?.owner?.country}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Province" valueType="text">
            {account?.owner?.province}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Ville ou Territoire" valueType="text">
            {account?.owner?.city}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Adresse" valueType="text">
            {account?.owner?.address}
          </ProDescriptions.Item>

          <ProDescriptions.Item
            label="Rôle"
            valueType="text"
            render={() => (
              <Tag className="mr-0 lowercase" bordered={false} color="success">
                {account?.owner.role}
              </Tag>
            )}
          >
            {account?.owner?.role}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label="Compte"
            render={() => (
              <Space>
                <Switch
                  checkedChildren="Éligible au crédit"
                  checked={account?.owner?.blocked ? false : true}
                  unCheckedChildren="Non autorisé"
                  disabled
                />
                <Button
                  type="link"
                  onClick={() => setOpenBlockOrUnBlockForm(true)}
                >
                  Gérer
                </Button>
              </Space>
            )}
          ></ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
      <ProCard
        loading={isLoading}
        title="Autres informations"
        style={{ marginBlockEnd: 16 }}
      >
        <ProDescriptions column={{ sm: 1, md: 2 }} emptyText="">
          <ProDescriptions.Item
            title="Date de création"
            render={() => dayjs(account?.owner.createdAt).format("DD/MM/YYYY")}
          >
            {`${account?.owner?.createdAt}`}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            title="Dernière modification"
            render={() => dayjs(account?.owner.updatedAt).format("DD/MM/YYYY")}
          >
            {`${account?.owner?.updatedAt}`}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            valueType="text"
            title="Créateur du compte (Opérateur)"
          >
            {`${account?.owner?.createdBy.firstName} ${account?.owner?.createdBy.lastName} (${account?.owner.createdBy.username})`}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
      {session?.user.role === "ADMIN" && (
        <ProCard
          loading={isLoading}
          title="Suppression du compte"
          style={{ marginBlockEnd: 16 }}
          extra={[
            <Button
              key="1"
              icon={<CloseOutlined />}
              className="shadow-none"
              onClick={() => {
                setOpenDeleteForm(true);
              }}
              danger
              type="primary"
            >
              Supprimer
            </Button>
          ]}
          className={cn("bg-red-50")}
        >
          <ProDescriptions column={{ sm: 1, md: 2 }} emptyText="">
            <ProDescriptions.Item
              valueType="text"
              title={<WarningFilled className="text-red-500" />}
            >
              Le compte sera définitivement supprimé, y compris ses mouvements
              et opérations associées. Cette action est irréversible et ne peut
              pas être annulée une fois effectuée.
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>
      )}
      <EditAccountForm
        open={openEditForm}
        toggle={setOpenEditForm}
        initialData={account}
      />
      <BlockOrUnblockForm
        open={openBlockOrUnBlockForm}
        toggle={setOpenBlockOrUnBlockForm}
        user={account?.owner}
      />
      <DeleteAccountForm
        open={openDeleteForm}
        toggle={setOpenDeleteForm}
        accountData={account}
      />
    </div>
  );
};
