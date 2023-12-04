"use client";

import { ArrowUpOutlined, DashboardOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { TransferBalance } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Row, Statistic } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DashboardClient = () => {
  const { push } = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      axios.get(`/api/v1/ws/dashboard`).then(
        (res) =>
          res.data as {
            banckAndCredits: {
              numberOfAccounts: number;
              maxBalance: number | null;
              avgBalance: number | null;
              minBalance: number | null;
              totalBalance: number | null;
            };
            transferAndCredits: TransferBalance | null;
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
              <Col md={6}>
                <Statistic
                  title="Comptes"
                  value={data?.banckAndCredits.numberOfAccounts}
                  loading={isLoading}
                />
              </Col>
              <Col md={6}>
                <Statistic
                  title="Balance e"
                  value={Number(data?.banckAndCredits.maxBalance)}
                  prefix={<ArrowUpOutlined />}
                  precision={2}
                  loading={isLoading}
                />
              </Col>
              <Col md={6}>
                <Statistic
                  title="Balance moyenne"
                  value={Number(data?.banckAndCredits.avgBalance)}
                  loading
                />
              </Col>
              <Col md={6}>
                <Statistic
                  title="Balance Inferieur"
                  value={Number(data?.banckAndCredits.avgBalance)}
                  loading
                />
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
          >
            <Statistic
              title="Balance"
              value={Number(data?.transferAndCredits?.balance)}
            />
          </ProCard>
        </div>
      </PageContainer>
    </div>
  );
};
