"use client";

import { DashboardOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { TransferBalance } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import axios from "axios";

export const DashboardClient = () => {
  const { data: account, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      axios.get(`/api/v1/ws/dashboard`).then(
        (res) =>
          res.data as {
            banckAndCredits: {
              numberOfAccounts: number;
              maxBalance: number | null;
              minBalance: number | null;
              totalBalance: number | null;
            };
            transferAndCredits: {
              balance: TransferBalance | null;
            };
          }
      ),
  });
  return (
    <div>
      <PageContainer
        fixedHeader
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        tabList={[
          {
            key: "/ws",
            tab: "",
          },
        ]}
        extra={[<DashboardOutlined key="1" />]}
      >
        <div className="md:pt-4">
          <ProCard
            title="Banque et crédits"
            style={{ marginBlockEnd: 16 }}
            extra={[<Button key="1">Voir plus</Button>]}
          ></ProCard>
          <ProCard
            title="Transferts et expéditions"
            style={{ marginBlockEnd: 16 }}
            extra={[<Button key="1">Voir plus</Button>]}
          ></ProCard>
        </div>
      </PageContainer>
    </div>
  );
};
