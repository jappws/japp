"use client";

import { AccountType } from "@/lib/types";
import { getHSLColor } from "@/lib/utils";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Switch, Tag } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export const AccountOwner = () => {
  const { data: session } = useSession();
  const { accountId } = useParams();

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
        className=""
        title="Profile"
        extra={[
          <Button key="1" icon={<EditOutlined />} className="shadow-none">
            Editer
          </Button>,
        ]}
      >
        <ProDescriptions column={{ sm: 1, md: 2 }} emptyText="">
          <ProDescriptions.Item
            label=""
            // valueType="avatar"
            render={() => (
              <Avatar
                style={{
                  backgroundColor: getHSLColor(
                    `${account?.owner.firstName} ${account?.owner.surname}`
                  ),
                }}
                size="large"
                icon={<UserOutlined />}
              />
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
              <Tag className="mr-0 uppercase" bordered={false} color="success">
                {account?.owner.role}
              </Tag>
            )}
          >
            {account?.owner?.role}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label="Compte"
            valueType="switch"
            render={() => (
              <Switch
                checkedChildren="Éligible au crédit"
                checked={account?.owner?.blocked ? false : true}
                unCheckedChildren="Non autorisé"
                disabled
              />
            )}
          ></ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
      <ProCard
        className=""
        title="Informations de Création"
      ></ProCard>
    </div>
  );
};
