"use client";

import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  BorderOutlined,
  DashboardOutlined,
  LineOutlined,
  TeamOutlined,
} from "@ant-design/icons";
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-y-0 md:gap-x-4">
            <div className="col-span-1">
            <ProCard title="Comptes"   style={{ marginBlockEnd: 16 }}>
              <Statistic
                title="Clients"
                value={data?.banckAndCredits.numberOfAccounts}
                loading={isLoading}
                prefix={<TeamOutlined />}
                style={{ marginBlockEnd: 16 }}
              />
            </ProCard>
            </div>
            <div className=" col-span-3">
            <ProCard
              title="Banque et crédits"
              style={{ marginBlockEnd: 16 }}
              // extra={[
              //   <Button
              //     key="1"
              //     type="link"
              //     onClick={() => push("/ws/bank_and_credits")}
              //   >
              //     Voir plus
              //   </Button>,
              // ]}
            >
              <Row gutter={16}>
                <Col md={8}>
                  <Statistic
                    title="Supérieur"
                    value={Number(data?.banckAndCredits.maxBalance)}
                    prefix={<ArrowUpOutlined />}
                    suffix="$US"
                    precision={2}
                    loading={isLoading}
                  />
                </Col>
                <Col md={8}>
                  <Statistic
                    title="Moyenne"
                    value={Number(data?.banckAndCredits.avgBalance)}
                    prefix={<BorderOutlined />}
                    suffix="$US"
                    loading={isLoading}
                    precision={2}
                  />
                </Col>
                <Col md={8}>
                  <Statistic
                    title="Inférieur"
                    value={Number(data?.banckAndCredits.minBalance)}
                    prefix={<ArrowDownOutlined />}
                    suffix="$US"
                    loading={isLoading}
                    precision={2}
                  />
                </Col>
              </Row>
            </ProCard>
            </div>
          </div>
          <ProCard
            title="Expéditions"
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
              loading={isLoading}
              precision={2}
              suffix="$US"
            />
          </ProCard>
        </div>
      </PageContainer>
    </div>
  );
};
