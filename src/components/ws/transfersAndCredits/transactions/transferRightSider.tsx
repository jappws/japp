"use client";

import { CheckOutlined, CloseOutlined, PrinterOutlined, TransactionOutlined } from "@ant-design/icons";
import { Layout, Space, theme, Button, Modal, Drawer, Tooltip, Avatar } from "antd";
import { Dispatch, SetStateAction, useRef } from "react";
import {  TransferType } from "@/lib/types";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { getTransferTitle } from "@/lib/utils";
import ReactToPrint from "react-to-print";

const { confirm } = Modal;

type Props = {
  open: boolean;
  trigger?: Dispatch<SetStateAction<boolean>>;
  data?: TransferType;
};

export const SelectedTransferRightSider: React.FC<Props> = ({
  open,
  trigger,
  data,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const refComponentToPrint = useRef(null);

  return (
    <Drawer
      title={
        <div className="flex">
          <Space>Transfer</Space>
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
                documentTitle={`T${data?.id}-${dayjs().year}`}
              />,
            ]}
            style={{ marginBlockEnd: 16 }}
          >
            <ProDescriptions column={1} emptyText="">
              <ProDescriptions.Item ellipsis label="Date" valueType="text">
                {dayjs(data?.date).format("DD-MM-YYYY")}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Type" valueType="text">
                {getTransferTitle(data?.type)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Expéditeur" valueType="text">
                {data?.sender}
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
              documentTitle={`T${data?.id}-${dayjs().year}`}
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
                title={`Transfert`}
                bordered
                style={{ marginBlockEnd: 16 }}
                // extra={[
                //   <Tag key="1" className="mr-0 uppercase" bordered={false}>
                //     {getInOrOutType(data?.type)}
                //   </Tag>,
                // ]}
              >
                <ProDescriptions emptyText="">
                  <ProDescriptions.Item
                    label=""
                    render={() => (
                      <Space>
                        <Avatar icon={<TransactionOutlined/>}/>
                        {/* {`${account?.owner?.firstName.toUpperCase()} ${account?.owner?.lastName.toUpperCase()} ${account?.owner?.surname.toUpperCase()}`} */}
                      </Space>
                    )}
                  >
                    {/* {account?.owner?.firstName} */}
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
              <ProDescriptions.Item label="Type" valueType="text">
                {getTransferTitle(data?.type)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Expéditeur" valueType="text">
                {data?.sender}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Montant" valueType="text">
                {`${new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "USD",
                }).format(data?.amount ?? 0)}`}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Note">
                {data?.message}
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
