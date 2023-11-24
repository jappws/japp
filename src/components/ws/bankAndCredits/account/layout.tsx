"use client";

import { MinusOutlined, MinusSquareOutlined, PlusOutlined, PlusSquareOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Breadcrumb, Button, Dropdown, Space, Statistic } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { NewInOrCreditForm } from "./forms/inOrCreditForm";
import { NewOutOrDebitForm } from "./forms/outOrDebitForm";

export default function AccountClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accountId } = useParams();
  const { push } = useRouter();
  const pathname = usePathname();
  const [openNewInOrCreditForm, setOpenNewInOrCreditForm] =
    useState<boolean>(false);
  const [openNewOutOrDebitForm, setOpenNewOutOrDebitForm] =
    useState<boolean>(false);

  return (
    <div className="">
      <PageContainer
        title="Kahindo Lwanzo Alfred"
        fixedHeader
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        breadcrumbRender={() => (
          <Breadcrumb items={[{ title: "Compte" }, { title: "56347" }]} />
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
                    key: "OutOrDebit",
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
            title="Solde"
            value={`${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "USD",
            }).format(150000000)}`}
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
          />
        </div>
      </PageContainer>
    </div>
  );
}
