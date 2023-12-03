"use client";

import {
  CheckOutlined,
  CloseOutlined,
  FilePdfOutlined,
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
  message,
} from "antd";
import { Dispatch, SetStateAction, useRef } from "react";
import { AccountType, TransactionType } from "@/lib/types";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";
import { getInOrOutType } from "@/lib/utils";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { isNull } from "lodash";

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

  const handleDownloadPdf = async () => {
    const element = refComponentToPrint.current;
    if (!isNull(element)) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const imgProperties = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`PDFM${data?.id}${account?.accountNumber}.pdf`);
    }else{
      message.error({content:"Erreur"})
    }
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
                      type="link"
                    />
                  </Tooltip>
                )}
                content={() => refComponentToPrint.current}
                documentTitle={`M${data?.id}-${account?.accountNumber}`}
              />,
              <Button
                key="2"
                icon={<FilePdfOutlined />}
                onClick={handleDownloadPdf}
                type="text"
                className="shadow-none"
              />,
              <Button
              key="3"
              icon={<ShareAltOutlined />}
              onClick={handleDownloadPdf}
              type="text"
              className="shadow-none"
            />,
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
            collapsible
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
              <ProCard
                title={`Mouvement`}
                bordered
                style={{ marginBlockEnd: 16 }}
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
                title={`Détails `}
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
          </div>
        </Layout.Content>
      </Layout>
    </Drawer>
  );
};
