"use client";

import { BankOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Input, Space, Tooltip, theme } from "antd";
import { AccountsList } from "./list";
import { NewAccountForm } from "./forms/newAccountForm";
import { useState, ChangeEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountType } from "@/lib/types";

export const AccountsClient = () => {
  const { token } = theme.useToken();
  const [openNewAccountForm, setOpenNewAccountform] = useState<boolean>(false);

  const [selectedCurrentData, setSelectedCurrentData] = useState<
    AccountType[] | undefined
  >();

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios.get(`/api/v1/ws/accounts`).then((res) => res.data as AccountType[]),
  });

  const search = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const items = data?.filter(
      (item) =>
        item.accountNumber.toLowerCase().includes(value.toLowerCase()) ||
        `${item.owner.firstName.toLowerCase()} ${item.owner.lastName.toLowerCase()} ${item.owner.surname?.toLowerCase()} ${item.owner.nickname?.toLowerCase()}`.includes(
          value.toLowerCase()
        )
    );
    setSelectedCurrentData(items);
  };

  useEffect(() => {
    setSelectedCurrentData(data);
  }, [data]);

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
              onChange={search}
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
            children: (
              <div className="md:pt-4">
                <AccountsList
                  // data={selectedCurrentData}
                  // isLoading={isLoading}
                />
                <NewAccountForm
                  open={openNewAccountForm}
                  toggle={setOpenNewAccountform}
                />
              </div>
            ),
          },
        ]}
        extra={[<BankOutlined key="2" />]}
      ></PageContainer>
    </div>
  );
};
