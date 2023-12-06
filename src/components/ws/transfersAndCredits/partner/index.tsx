"use client";

import { GoldOutlined, SendOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { Button, Dropdown, Space, Statistic } from "antd";
import { TransfersList } from "../transactions/list";
import { GoldTransferForm } from "../forms/goldTransferForm";
import { MoneyTransferForm } from "../forms/moneyTransferForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TransferType } from "@/lib/types/index.d";

export const PartnerClientPage = () => {
  const [openMoneyTransferForm, setOpenMoneyTransferForm] =
    useState<boolean>(false);
  const [openGoldTransferForm, setOpenGoldTransferForm] =
    useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["transfers"],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/transfers`)
        .then(
          (res) => res.data as { balance: number; trans: TransferType[] }
        ),
  });

  return (
    <div>
      <PageContainer
        fixedHeader
        breadcrumbRender={false}
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        extra={[
          <Statistic
            loading={isLoading}
            key="1"
            title="Solde"
            value={`${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "USD",
            }).format(Number(data?.balance ?? 0))}`}
          />,
        ]}
        tabBarExtraContent={
          <Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "MONEY_TRANSFER",
                    label: "Transfert d'argent",
                    icon: <SendOutlined />,
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "GOLD_TRANSFER",
                    label: "Expédition de l'or",
                    icon: <GoldOutlined />,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "GOLD_TRANSFER") {
                    setOpenGoldTransferForm(true);
                  } else if (key === "MONEY_TRANSFER") {
                    setOpenMoneyTransferForm(true);
                  }
                },
              }}
              trigger={["hover"]}
              destroyPopupOnHide={true}
              // placement="bottomRight"
            >
              <Button
                type="primary"
                onClick={() => {}}
                className="shadow-none uppercase"
              >
                Nouvelle opération
              </Button>
            </Dropdown>
          </Space>
        }
        tabList={[
          {
            key: "/ws/transfers_and_credits",
            tab: "Transactions",
          },
        ]}
        //   subTitle="Dashboard"
      >
        <div className="md:pt-4">
          <TransfersList data={data?.trans} isLoading={isLoading} />
          <GoldTransferForm
            open={openGoldTransferForm}
            toggle={setOpenGoldTransferForm}
          />
          <MoneyTransferForm
            open={openMoneyTransferForm}
            toggle={setOpenMoneyTransferForm}
          />
        </div>
      </PageContainer>
    </div>
  );
};
