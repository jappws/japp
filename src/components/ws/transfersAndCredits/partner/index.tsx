"use client";

import {
  DeleteOutlined,
  EditOutlined,
  GoldOutlined,
  PrinterOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  PageContainer,
  ProCard,
  ProDescriptions,
} from "@ant-design/pro-components";
import {
  Breadcrumb,
  Button,
  Dropdown,
  Space,
  Statistic,
  Image,
  Typography,
  Avatar,
} from "antd";
import { TransfersList } from "./transactions/list";
import { GoldTransferForm } from "./forms/goldTransferForm";
import { MoneyTransferForm } from "./forms/moneyTransferForm";
import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CompanyType, PartnerType, TransferType } from "@/lib/types/index.d";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { EditPartnerForm } from "../partners/forms/editPartnerForm";
import ReactToPrint from "react-to-print";
import dayjs from "dayjs";
import { getHSLColor } from "@/lib/utils";
import { TransfersListToPrint } from "./transactions/listToPrint";

export const PartnerClientPage = () => {
  const [openMoneyTransferForm, setOpenMoneyTransferForm] =
    useState<boolean>(false);
  const [openGoldTransferForm, setOpenGoldTransferForm] =
    useState<boolean>(false);
  const [openEditParterForm, setOpenEditPartnerForm] = useState<boolean>(false);

  const { data: session } = useSession();
  const { partnerId } = useParams();

  const refComponentToPrint = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () =>
      axios
        .get(`/api/v1/ws/partner/${partnerId}/transfers`)
        .then(
          (res) =>
            res.data as { partner: PartnerType; transfers: TransferType[] }
        ),
    enabled: !!session?.user && !!partnerId,
  });

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company"],
    queryFn: () =>
      axios.get(`/api/v1/ws/company`).then((res) => res.data as CompanyType),
  });

  return (
    <div>
      <PageContainer
        loading={isLoading}
        title={`${data?.partner?.code ?? ""}`.toUpperCase()}
        subTitle={
          <Space>
          <Button
            type="text"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setOpenEditPartnerForm(true);
            }}
          />
          <Button type="text" shape="circle" icon={<DeleteOutlined/>} onClick={()=>{}}/>
          </Space>
        }
        fixedHeader
        breadcrumbRender={() => (
          <Breadcrumb
            items={[
              { title: "Partenaire" },
              { title: data?.partner.code.toLowerCase() ?? "" },
            ]}
          />
        )}
        token={{
          paddingInlinePageContainerContent: 16,
          paddingBlockPageContainerContent: 16,
        }}
        extra={[
          <Statistic
            loading={isLoading}
            key="1"
            title="Solde"
            value={`${new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "USD",
            }).format(Number(data?.partner.balance ?? 0))}`}
          />,
        ]}
        tabBarExtraContent={
          <Space>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "MONEY_TRANSFER",
                    label: "Transfert d'argent",
                    icon: <SendOutlined />,
                  },
                  {
                    type: "divider",
                  },
                  {
                    key: "GOLD_TRANSFER",
                    label: "Expédition de l'or",
                    icon: <GoldOutlined />,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "GOLD_TRANSFER") {
                    setOpenGoldTransferForm(true);
                  } else if (key === "MONEY_TRANSFER") {
                    setOpenMoneyTransferForm(true);
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
            <ReactToPrint
              key="1"
              trigger={() => <Button icon={<PrinterOutlined />} />}
              content={() => refComponentToPrint.current}
              documentTitle={`P${data?.partner.id}${dayjs().format(
                "DDMMYYYYHHmmss"
              )}`}
            />
          </Space>
        }
        tabList={[
          {
            key: `/ws/transfers_and_credits/${data?.partner.id}`,
            tab: "Transactions",
          },
        ]}
      >
        <div className="md:pt-4">
          <TransfersList data={data?.transfers} isLoading={isLoading} />
          <GoldTransferForm
            open={openGoldTransferForm}
            toggle={setOpenGoldTransferForm}
          />
          <MoneyTransferForm
            open={openMoneyTransferForm}
            toggle={setOpenMoneyTransferForm}
          />
          <EditPartnerForm
            open={openEditParterForm}
            toggle={setOpenEditPartnerForm}
            partner={data?.partner}
          />

          {/* To print */}
          <div className=" hidden">
            <div ref={refComponentToPrint}>
              <div className="flex items-end ">
                <Image
                  src={company?.logo}
                  alt=""
                  height={58}
                  width={58}
                  preview={false}
                />
                <div className="flex-1" />
                <Typography.Text className="uppercase">
                  {company?.name}
                </Typography.Text>
              </div>
              <ProCard
                title={`FICHE PARTENAIRE`}
                bordered
                style={{ marginBlockEnd: 16, marginBlockStart: 32 }}
                // extra={[
                //   <Tag key="1" className="mr-0 uppercase" bordered={false}>
                //     {getInOrOutType(data?.type)}
                //   </Tag>,
                // ]}
              >
                <ProDescriptions emptyText="" column={1}>
                  <ProDescriptions.Item
                    label=""
                    render={() => (
                      <Space>
                        <Avatar
                          shape="square"
                          style={{
                            backgroundColor: getHSLColor(
                              `${data?.partner.code}`
                            ),
                          }}
                        >
                          {data?.partner.code?.charAt(0).toUpperCase()}
                        </Avatar>
                        {`${data?.partner.code.toUpperCase()}`}
                      </Space>
                    )}
                  >
                    {""}
                  </ProDescriptions.Item>
                </ProDescriptions>
              </ProCard>
              <div>
                <TransfersListToPrint data={data?.transfers} />
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
