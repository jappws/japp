"use client";

import { DashboardOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { TransferBalance } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Row, Statistic } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DashboardClient = () => {
  const { push } = useRouter();

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
            extra={[
              <Button
                key="1"
                type="link"
                onClick={() => push("/ws/bank_and_credits")}
              >
                Voir plus
              </Button>,
            ]}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="Active Users" value={112893} />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Account Balance (CNY)"
                  value={112893}
                  precision={2}
                />
                <Button style={{ marginTop: 16 }} type="primary">
                  Recharge
                </Button>
              </Col>
              <Col span={12}>
                <Statistic title="Active Users" value={112893} loading />
              </Col>
            </Row>
          </ProCard>
          <ProCard
            title="Transferts et expéditions"
            style={{ marginBlockEnd: 16 }}
            extra={[
              <Button
                key="1"
                type="link"
                onClick={() => push("/ws/transfers_and_credits")}
              >
                Voir plus
              </Button>,
            ]}
          ></ProCard>
        </div>
      </PageContainer>
    </div>
  );
};
