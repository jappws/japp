"use client";

import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  BankOutlined,
  BorderOutlined,
  DashboardOutlined,
  LineOutlined,
  TeamOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Row, Statistic, theme } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export const DashboardClient = () => {
  const { token } = theme.useToken();
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
              totalBanck: number | null;
              totalCredit: number | null;
            };
            transferAndCredits: number | null;
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
        // tabList={[
        //   {
        //     key: "/ws",
        //     tab: "",
        //   },
        // ]}
        extra={[<DashboardOutlined key="1" />]}
      >
        <div className="md:pt-4">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-y-4 md:gap-y-0 md:gap-x-4"
            style={{ marginBlockEnd: 16 }}
          >
            <div className="col-span-1">
              <ProCard
                title="Comptes"
                extra={[
                  <Button
                    key="1"
                    type="text"
                    onClick={() => push("/ws/bank_and_credits")}
                    icon={<TeamOutlined />}
                  />,
                ]}
              >
                <Statistic
                  title="Clients"
                  className=" uppercase "
                  value={data?.banckAndCredits.numberOfAccounts}
                  loading={isLoading}
                  // prefix={<ArrowRightOutlined key="1" />}
                  valueStyle={{ color: token.colorPrimary }}
                />
              </ProCard>
            </div>
            <div className="col-span-3">
              <ProCard
                title="Banque et crédits"
                extra={[
                  <Button
                    key="1"
                    type="text"
                    icon={<BankOutlined />}
                    onClick={() => push("/ws/bank_and_credits")}
                  />,
                ]}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Banque"
                      className=" uppercase "
                      value={Number(data?.banckAndCredits.totalBanck)}
                      prefix={<ArrowUpOutlined />}
                      suffix="$US"
                      precision={2}
                      loading={isLoading}
                      valueStyle={{ color: token.colorSuccess }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Crédits"
                      className=" uppercase "
                      value={Number(data?.banckAndCredits.totalCredit)}
                      prefix={<ArrowDownOutlined />}
                      suffix="$US"
                      loading={isLoading}
                      precision={2}
                      valueStyle={{ color: token.colorWarning }}
                    />
                  </Col>
                </Row>
              </ProCard>
            </div>
          </div>
          <ProCard
            title="Transferts et expéditions"
            style={{ marginBlockEnd: 16 }}
            extra={[
              <Button
                key="1"
                type="text"
                onClick={() => push("/ws/transfers_and_credits")}
                icon={<TransactionOutlined />}
              />,
            ]}
          >
            <Statistic
              title="Balance"
              className=" uppercase "
              value={Number(data?.transferAndCredits)}
              loading={isLoading}
              precision={2}
              suffix="$US"
              valueStyle={{ color: token.colorInfo }}
            />
          </ProCard>
        </div>
      </PageContainer>
    </div>
  );
};
