'use client'

import { DashboardOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components";

export const DashboardClient = () => {
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
            style={{
              height: "200vh",
              minHeight: 800,
            }}
          ></ProCard>
        </div>
      </PageContainer>
    </div>
  );
};
