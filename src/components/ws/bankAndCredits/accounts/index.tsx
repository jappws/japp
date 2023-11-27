"use client";

import { BankOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Button, Input, Space, Tooltip, theme } from "antd";
import { AccountsList } from "./list";
import { NewAccountForm } from "./forms/newAccountForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountType } from "@/lib/types";

export const AccountsClient = () => {
  const { token } = theme.useToken();
  const [openNewAccountForm, setOpenNewAccountform] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios.get(`/api/v1/ws/accounts`).then((res) => res.data as AccountType[]),
  });

  return (
    <div>
      <PageContainer
        loading={isLoading}
        fixedHeader
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        breadcrumbRender={false}
        tabBarExtraContent={
          <Space>
            <Input
              style={{
                borderRadius: 4,
                marginInlineEnd: 12,
                backgroundColor: token.colorBgTextHover,
              }}
              prefix={
                <SearchOutlined
                  style={{
                    color: token.colorTextLightSolid,
                  }}
                />
              }
              placeholder="Rechercher ici"
              bordered={false}
            />
            <Tooltip key="1" title="Créer un compte">
              <Button
                type="primary"
                onClick={() => {
                  setOpenNewAccountform(true);
                }}
                className="shadow-none uppercase"
                icon={<PlusOutlined />}
              />
            </Tooltip>
          </Space>
        }
        tabList={[
          {
            key: "/ws/bank_and_credits",
            tab: "Comptes",
          },
        ]}
        extra={[<BankOutlined key="2" />]}
      >
        <div className="md:pt-4">
          <AccountsList data={[]} />
          <NewAccountForm
            open={openNewAccountForm}
            toggle={setOpenNewAccountform}
          />
        </div>
      </PageContainer>
    </div>
  );
};
