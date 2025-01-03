"use client";

import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PrinterOutlined,
  SendOutlined,
  TransactionOutlined,
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
  Dropdown,
} from "antd";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { TransferType } from "@/lib/types/index.d";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { getTransferTitle } from "@/lib/utils";
import ReactToPrint from "react-to-print";
import { DeleteTransferForm } from "../forms/deleteTransferForm";
import { EditGoldTransferForm } from "../forms/editGoldTransferForm";
import { EditMoneyTransferForm } from "../forms/editMoneyTransferForm";

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
  const [openDeleteForm, setOpenDeleteForm] = React.useState<boolean>(false);

  const [openEditGoldTransferForm, setOpenEditGoldTransferForm] =
    React.useState<boolean>(false);
  const [openEditMoneyTransferForm, setOpenEditMoneyTransferForm] =
    React.useState<boolean>(false);

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
                      type="text"
                    />
                  </Tooltip>
                )}
                content={() => refComponentToPrint.current}
                documentTitle={`T${data?.id}-${dayjs().year()}`}
              />,
              <Dropdown
                key="2"
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
                      if (data?.type === "GOLD_TRANSFER") {
                        setOpenEditGoldTransferForm(true);
                      } else if (data?.type === "MONEY_TRANSFER") {
                        setOpenEditMoneyTransferForm(true);
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
              <ProDescriptions.Item label="Type" valueType="text">
                {getTransferTitle(data?.type)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Expéditeur" valueType="text">
                {data?.sender}
              </ProDescriptions.Item>
              {data?.type === "GOLD_TRANSFER" && (
                <ProDescriptions.Item label="Quantité en Or" valueType="text">
                  {data?.goldQuantity}
                </ProDescriptions.Item>
              )}
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
              documentTitle={`T${data?.id}-${dayjs().year()}`}
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
                title={
                  data?.type === "GOLD_TRANSFER" ? "Expédition" : "Transfert"
                }
                bordered
                style={{ marginBlockEnd: 16 }}
                extra={[<SendOutlined key="1" />]}
              >
                <ProDescriptions emptyText="">
                  {data?.type === "MONEY_TRANSFER" && (
                    <ProDescriptions.Item
                      label=""
                      render={() => (
                        <Space>
                          <Avatar icon={<TransactionOutlined />} />
                          {`${data?.sender.toUpperCase()}`}
                        </Space>
                      )}
                    ></ProDescriptions.Item>
                  )}
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
                  <ProDescriptions.Item
                    label="Type de transfert"
                    valueType="text"
                  >
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
                  {data?.type === "GOLD_TRANSFER" && (
                    <ProDescriptions.Item label="Solde" valueType="text">
                      {data?.balanceAfter}
                    </ProDescriptions.Item>
                  )}
                  <ProDescriptions.Item label="Note">
                    {data?.message}
                  </ProDescriptions.Item>
                </ProDescriptions>
              </ProCard>
            </div>
            <DeleteTransferForm
              open={openDeleteForm}
              toggle={setOpenDeleteForm}
              transferData={data}
              triggerRightSider={trigger}
            />
            <EditGoldTransferForm
              open={openEditGoldTransferForm}
              toggle={setOpenEditGoldTransferForm}
              transferData={data}
              triggerRightSider={trigger}
            />
            <EditMoneyTransferForm
              open={openEditMoneyTransferForm}
              toggle={setOpenEditMoneyTransferForm}
              transferData={data}
              triggerRightSider={trigger}
            />
          </div>
        </Layout.Content>
      </Layout>
    </Drawer>
  );
};
