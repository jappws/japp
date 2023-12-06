"use client";

import { PlusOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Space } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { NewPartnerForm } from "./forms/newPartnerForm";

export const PartnersClientPage = () => {
  const [openNewPartnerForm, setOpenNewPartnerForm] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: () => axios.get(`/api/v1/ws/partners`).then((res) => res.data),
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
        tabBarExtraContent={
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpenNewPartnerForm(true);
              }}
              className="shadow-none uppercase"
              icon={<PlusOutlined />}
            />
          </Space>
        }
        tabList={[
          {
            key: "/ws/transfers_and_credits",
            tab: "Partenaires",
          },
        ]}
        //   subTitle="Dashboard"
      >
        <div className="md:pt-4">
          <NewPartnerForm
            open={openNewPartnerForm}
            toggle={setOpenNewPartnerForm}
          />
        </div>
      </PageContainer>
    </div>
  );
};
