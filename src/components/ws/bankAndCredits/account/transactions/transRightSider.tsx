"use client";

import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PrinterOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Space,
  theme,
  Button,
  Modal,
  Drawer,
  Tooltip,
  Avatar,
  Tag,
  Image,
  Typography,
  Dropdown,
} from "antd";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { AccountType, CompanyType, TransactionType } from "@/lib/types/index.d";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";
import { getInOrOutType } from "@/lib/utils";
import { Share } from "@capacitor/share";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DeleteTransactionForm } from "../forms/deleteTransaction";
import { EditInOrCreditForm } from "../forms/editInOrCreditForm";
import { EditOutOrDebitForm } from "../forms/editOutOrDebitForm";

const { confirm } = Modal;

type Props = {
  open: boolean;
  trigger?: Dispatch<SetStateAction<boolean>>;
  data?: TransactionType;
  account?: AccountType;
};

export const SelectedTransRightSider: React.FC<Props> = ({
  open,
  trigger,
  data,
  account,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const refComponentToPrint = useRef(null);

  const [openDeleteForm, setOpenDeleteForm] = React.useState<boolean>(false);
  const [openEditInOrCreditForm, setOpenEditInOrCreditForm] =
    useState<boolean>(false);
  const [openEditOutOrDebitForm, setOpenEditOutOrDebitForm] =
    useState<boolean>(false);

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company"],
    queryFn: () =>
      axios.get(`/api/v1/ws/company`).then((res) => res.data as CompanyType),
  });
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: () =>
      axios.get(`/api/v1/ws/accounts`).then((res) => res.data as AccountType[]),
  });

  // const handleDownloadPdf = async () => {
  //   const element = refComponentToPrint.current;
  //   if (!isNull(element)) {
  //     const canvas = await html2canvas(element);
  //     const imgData = canvas.toDataURL("image/png");

  //     const pdf = new jsPDF();
  //     const imgProperties = pdf.getImageProperties(imgData);
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

  //     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  //     pdf.save(`PDFM${data?.id}${account?.accountNumber}.pdf`);

  //   }
  // };

  const handleDownloadAndShare = async () => {
    await Share.share({
      title: `Mouvement M${data?.id}${account?.accountNumber}`,
      text: `*Détails*\n\n
      Date: *${dayjs(data?.date).format("DD-MM-YYYY")}*\n
      Intitulé: *${data?.title}*\n
      Montant: *${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(data?.amount ?? 0)}*\n
      Solde: *${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "USD",
      }).format(data?.balanceAfter ?? 0)}*\n
      Note: *${data?.message}*\n
      Compte: *${account?.owner?.firstName.toUpperCase()} ${account?.owner?.lastName.toUpperCase()} ${account?.owner?.surname.toUpperCase()} (${
        account?.accountNumber
      })*\n\n\n\n
      *${company?.name}*`,
      dialogTitle: "Partager avec",
    });

    // const element = refComponentToPrint.current;
    // if (!isNull(element)) {

    //   const canvas = await html2canvas(element);

    //   const imgData =  canvas.toDataURL("image/jpg");
    //   const link = document.createElement("a");

    //   if (typeof link.download === "string") {
    //     link.href = imgData;
    //     link.download = `M${data?.id}${account?.accountNumber}.jpg`;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);

    //   } else {
    //     window.open(imgData);
    //   }
    // }
  };

  return (
    <Drawer
      title={
        <div className="flex">
          <Space>Mouvement</Space>
          <div className="flex-1" />
          <Space>
            <Button
              icon={<CloseOutlined />}
              type="text"
              shape="circle"
              onClick={() => {
                trigger?.(false);
              }}
            />
          </Space>
        </div>
      }
      open={open}
      destroyOnClose={true}
      closable={false}
      onClose={() => {
        trigger?.(false);
      }}
    >
      <Layout className="">
        <Layout.Content className="bg-white">
          <ProCard
            className=" ml"
            title="Détails"
            // collapsible
            bordered
            extra={[
              <ReactToPrint
                key="1"
                trigger={() => (
                  <Tooltip title="Imprimer" placement="bottom">
                    <Button
                      className="shadow-none"
                      icon={<PrinterOutlined />}
                      shape="circle"
                      type="text"
                    />
                  </Tooltip>
                )}
                content={() => refComponentToPrint.current}
                documentTitle={`M${data?.id}-${account?.accountNumber}`}
              />,
              <Tooltip key="2" title="Partager" placement="bottom">
                <Button
                  icon={<ShareAltOutlined />}
                  onClick={handleDownloadAndShare}
                  type="text"
                  className="shadow-none"
                  shape="circle"
                />
              </Tooltip>,
              <Dropdown
                key="3"
                menu={{
                  items: [
                    {
                      key: "edit",
                      label: "Modifier",
                      icon: <EditOutlined />,
                    },
                    {
                      type: "divider",
                    },
                    {
                      key: "delete",
                      label: "Supprimer",
                      icon: <DeleteOutlined />,
                      danger: true,
                    },
                  ],
                  onClick: ({ key }) => {
                    if (key === "edit") {
                      if (
                        data?.type === "DEPOSIT" ||
                        data?.type === "LOAN_PAYMENT"
                      ) {
                        setOpenEditInOrCreditForm(true);
                      } else if (
                        data?.type === "WITHDRAWAL" ||
                        data?.type === "LOAN_DISBURSEMENT"
                      ) {
                        setOpenEditOutOrDebitForm(true);
                      }
                    } else if (key === "delete") {
                      setOpenDeleteForm(true);
                    }
                  },
                }}
                trigger={["hover"]}
                destroyPopupOnHide={true}
                // placement="bottomRight"
              >
                <Button
                  type="text"
                  onClick={() => {}}
                  shape="circle"
                  icon={<MoreOutlined />}
                />
              </Dropdown>,
            ]}
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item ellipsis label="Date" valueType="text">
                {dayjs(data?.date).format("DD-MM-YYYY")}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Intitulé" valueType="text">
                {data?.title}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Montant" valueType="text">
                {`${new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "USD",
                }).format(data?.amount ?? 0)}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Solde" valueType="text">
                {`${new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "USD",
                }).format(data?.balanceAfter ?? 0)}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Note">
                {data?.message}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="No compte">
                {`${data?.account?.accountNumber}`}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>

          <ProCard bordered className=" ml" style={{ marginBlockEnd: 16 }}>
            <ReactToPrint
              trigger={() => (
                <Button
                  block
                  className="shadow-none"
                  onClick={() => {}}
                  type="primary"
                  icon={<PrinterOutlined />}
                >
                  Imprimer
                </Button>
              )}
              content={() => refComponentToPrint.current}
              documentTitle={`M${data?.id}-${account?.accountNumber}`}
            />
          </ProCard>

          <ProCard
            className=" ml"
            title="Autres informations"
            bordered
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item
                label="Opérateur"
                // valueType="avatar"
              >
                {`${data?.operator.firstName} ${data?.operator.lastName} (${data?.operator.username})`}
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>

          {/* To print */}
          <div className="hidden">
            <div ref={refComponentToPrint} className="">
              <div className="flex items-end">
                <Image
                  src={company?.logo}
                  alt=""
                  height={64}
                  width={64}
                  preview={false}
                />{" "}
                <div className="flex-1" />
                <Typography.Text className="uppercase">
                  {company?.name}
                </Typography.Text>
              </div>
              <ProCard
                title={`Mouvement`}
                bordered
                style={{ marginBlockEnd: 16, marginBlockStart: 32 }}
                extra={[
                  <Tag key="1" className="mr-0 uppercase" bordered={false}>
                    {getInOrOutType(data?.type)}
                  </Tag>,
                ]}
              >
                <ProDescriptions emptyText="">
                  <ProDescriptions.Item
                    label=""
                    render={() => (
                      <Space>
                        <Avatar>
                          {account?.owner.firstName?.charAt(0).toUpperCase()}
                          {account?.owner.lastName?.charAt(0).toUpperCase()}
                        </Avatar>
                        {`${account?.owner?.firstName.toUpperCase()} ${account?.owner?.lastName.toUpperCase()} ${account?.owner?.surname.toUpperCase()}`}
                      </Space>
                    )}
                  >
                    {account?.owner?.firstName}
                  </ProDescriptions.Item>
                </ProDescriptions>
              </ProCard>
              <ProCard
                title={`Détails`}
                bordered
                style={{ marginBlockEnd: 16 }}
                extra={[<CheckOutlined key="1" />, <CheckOutlined key="2" />]}
              >
                <ProDescriptions column={1} title="" emptyText="">
                  <ProDescriptions.Item ellipsis label="Date" valueType="text">
                    {dayjs(data?.date).format("DD-MM-YYYY")}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Intitulé" valueType="text">
                    {data?.title}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Montant" valueType="text">
                    {`${new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "USD",
                    }).format(data?.amount ?? 0)}`}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Solde" valueType="text">
                    {`${new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "USD",
                    }).format(data?.balanceAfter ?? 0)}`}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Note">
                    {data?.message}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Compte">
                    {`${account?.owner?.firstName.toUpperCase()} ${account?.owner?.lastName.toUpperCase()} ${account?.owner?.surname.toUpperCase()} (${
                      account?.accountNumber
                    })`}
                  </ProDescriptions.Item>
                </ProDescriptions>
              </ProCard>
            </div>
            <DeleteTransactionForm
              open={openDeleteForm}
              toggle={setOpenDeleteForm}
              transData={data}
            />
            <EditInOrCreditForm
              open={openEditInOrCreditForm}
              toggle={setOpenEditInOrCreditForm}
              transactionData={data}
            />
            <EditOutOrDebitForm
              open={openEditOutOrDebitForm}
              toggle={setOpenEditOutOrDebitForm}
              transactionData={data}
              accounts={accounts}
              isLoadingAccounts={isLoadingAccounts}
              currentAccountId={account?.id}
            />
          </div>
        </Layout.Content>
      </Layout>
    </Drawer>
  );
};
