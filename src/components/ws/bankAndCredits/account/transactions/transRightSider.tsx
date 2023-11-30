"use client";

import { CloseOutlined, PrinterOutlined } from "@ant-design/icons";
import { Layout, Space, theme, Button, Modal, Drawer, Tooltip } from "antd";
import { Dispatch, SetStateAction, useRef } from "react";
import { AccountType, TransactionType } from "@/lib/types";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import dayjs from "dayjs";
import ReactToPrint from "react-to-print";

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
            <div ref={refComponentToPrint}>
              <ProCard
                title="Détails mouvement"
                bordered
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
                </ProDescriptions>
              </ProCard>
              <ProCard
                title="Propriétaire du compte"
                bordered
                style={{ marginBlockEnd: 16 }}
              >
                <ProDescriptions column={1} emptyText="">
                  <ProDescriptions.Item ellipsis label="Nom" valueType="text">
                    {account?.owner?.firstName}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Postnom" valueType="text">
                    {account?.owner?.lastName}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label="Prénom" valueType="text">
                    {account?.owner?.surname}
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
