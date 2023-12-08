"use client";

import { EditOutlined, GoldOutlined, SendOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Breadcrumb, Button, Dropdown, Space, Statistic } from "antd";
import { TransfersList } from "./transactions/list";
import { GoldTransferForm } from "./forms/goldTransferForm";
import { MoneyTransferForm } from "./forms/moneyTransferForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PartnerType, TransferType } from "@/lib/types/index.d";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { EditPartnerForm } from "../partners/forms/editPartnerForm";

export const PartnerClientPage = () => {
  const [openMoneyTransferForm, setOpenMoneyTransferForm] =
    useState<boolean>(false);
  const [openGoldTransferForm, setOpenGoldTransferForm] =
    useState<boolean>(false);
  const [openEditParterForm, setOpenEditPartnerForm] = useState<boolean>(false);

  const { data: session } = useSession();
  const { partnerId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/partner/${partnerId}/transfers`)
        .then(
          (res) =>
            res.data as { partner: PartnerType; transfers: TransferType[] }
        ),
    enabled: !!session?.user && !!partnerId,
  });

  return (
    <div>
      <PageContainer
        loading={isLoading}
        title={`${data?.partner?.code ?? ""}`.toUpperCase()}
        subTitle={
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setOpenEditPartnerForm(true);
            }}
          />
        }
        fixedHeader
        breadcrumbRender={() => (
          <Breadcrumb
            items={[
              { title: "Partenaire" },
              { title: data?.partner.code.toLowerCase() ?? "" },
            ]}
          />
        )}
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
            }).format(Number(data?.partner.balance ?? 0))}`}
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
            key: `/ws/transfers_and_credits/${data?.partner.id}`,
            tab: "Transactions",
          },
        ]}
      >
        <div className="md:pt-4">
          <TransfersList data={data?.transfers} isLoading={isLoading} />
          <GoldTransferForm
            open={openGoldTransferForm}
            toggle={setOpenGoldTransferForm}
          />
          <MoneyTransferForm
            open={openMoneyTransferForm}
            toggle={setOpenMoneyTransferForm}
          />
          <EditPartnerForm
            open={openEditParterForm}
            toggle={setOpenEditPartnerForm}
            partner={data?.partner}
          />
        </div>
      </PageContainer>
    </div>
  );
};
