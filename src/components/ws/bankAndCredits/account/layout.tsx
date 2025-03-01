"use client";

import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Breadcrumb, Button, Dropdown, Space, Statistic } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NewInOrCreditForm } from "./forms/inOrCreditForm";
import { NewOutOrDebitForm } from "./forms/outOrDebitForm";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AccountType } from "@/lib/types/index.d";
import { useSession } from "next-auth/react";

export default function AccountClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const { accountId } = useParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const [openNewInOrCreditForm, setOpenNewInOrCreditForm] =
    useState<boolean>(false);
  const [openNewOutOrDebitForm, setOpenNewOutOrDebitForm] =
    useState<boolean>(false);

  const { data: account, isLoading } = useQuery({
    queryKey: ["account", accountId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/account/${accountId}`)
        .then((res) => res.data as AccountType),
    enabled: !!session?.user && !!accountId,
  });

  const { data:accounts, isLoading:isLoadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios.get(`/api/v1/ws/accounts`).then((res) => res.data as AccountType[]),
  });

  return (
    <div className="">
      <PageContainer
        loading={isLoading}
        title={`${account?.owner.firstName ?? ""} ${
          account?.owner.lastName ?? ""
        } ${account?.owner.surname ?? ""}`.toUpperCase()}
        fixedHeader
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        breadcrumbRender={() => (
          <Breadcrumb
            items={[
              { title: "Compte" },
              { title: account?.accountNumber ?? "" },
            ]}
          />
        )}
        tabBarExtraContent={
          <Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "inOrCredit",
                    label: "Entrée (Encaissement)",
                    icon: <PlusOutlined />,
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "outOrDebit",
                    label: "Sortie (Décaissement)",
                    icon: <MinusOutlined />,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "outOrDebit") {
                    setOpenNewOutOrDebitForm(true);
                  } else if (key === "inOrCredit") {
                    setOpenNewInOrCreditForm(true);
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
        tabProps={{
          onChange: (activeKey) => {
            push(activeKey);
          },
        }}
        tabActiveKey={pathname}
        tabList={[
          {
            key: `/ws/bank_and_credits/${accountId}`,
            tab: "Mouvements",
          },
          {
            key: `/ws/bank_and_credits/${accountId}/owner`,
            tab: "Exploitant",
          },
        ]}
        extra={[
          <Statistic
            key="1"
            loading={isLoading}
            title="Solde"
            value={`${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "USD",
            }).format(account?.balance ? Number(account?.balance) : 0)}`}
          />,
        ]}
      >
        <div className="md:pt-4">
          {children}
          <NewInOrCreditForm
            open={openNewInOrCreditForm}
            toggle={setOpenNewInOrCreditForm}
          />
          <NewOutOrDebitForm
            open={openNewOutOrDebitForm}
            toggle={setOpenNewOutOrDebitForm}
            accounts={accounts}
            isLoadingAccounts={isLoadingAccounts}
            currentAccount={account}
          />
        </div>
      </PageContainer>
    </div>
  );
}
