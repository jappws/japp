  "use client";

  import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
  import { PageContainer } from "@ant-design/pro-components";
  import { Button, Input, Space, theme } from "antd";
  import { ChangeEvent, useEffect, useState } from "react";
  import { useQuery } from "@tanstack/react-query";
  import axios from "axios";
  import { NewPartnerForm } from "./forms/newPartnerForm";
  import { PartnerType } from "@/lib/types";
  import { PartnersList } from "./list";

  export const PartnersClientPage = () => {
    const { token } = theme.useToken();
    const [openNewPartnerForm, setOpenNewPartnerForm] = useState<boolean>(false);
    const [selectedCurrentData, setSelectedCurrentData] = useState<
      PartnerType[] | undefined
    >();

    const { data, isLoading } = useQuery({
      queryKey: ["partners"],
      queryFn: () =>
        axios.get(`/api/v1/ws/partners`).then((res) => res.data as PartnerType[]),
    });

    const search = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const items = data?.filter((item) =>
        item.code.toLowerCase().includes(value.toLowerCase())
      );
      setSelectedCurrentData(items);
    };

    useEffect(() => {
      setSelectedCurrentData(data);
    }, [data]);

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
              <Input
                style={{
                  borderRadius: 4,
                  marginInlineEnd: 12,
                  backgroundColor: token.colorBgTextHover,
                }}
                prefix={
                  <SearchOutlined
                    style={{
                      color: token.colorTextLightSolid,
                    }}
                  />
                }
                placeholder="Rechercher ici"
                bordered={false}
                onChange={search}
              />
              <Button
              className="shadow-none uppercase"
              icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                  setOpenNewPartnerForm(true);
                }}
                
              />
            </Space>
          }
          tabList={[
            {
              key: "/ws/transfers_and_credits",
              tab: "Partenaires",
            },
          ]}
        >
          <div className="md:pt-4">
            <PartnersList data={selectedCurrentData} isLoading={isLoading} />
            <NewPartnerForm
              open={openNewPartnerForm}
              toggle={setOpenNewPartnerForm}
            />
          </div>
        </PageContainer>
      </div>
    );
  };
