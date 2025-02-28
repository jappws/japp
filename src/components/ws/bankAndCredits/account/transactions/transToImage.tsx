"use client";

import { Avatar, Button, Image, Modal, Space, Tag, Typography } from "antd";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { toJpeg } from "html-to-image";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { AccountType, CompanyType, TransactionType } from "@/lib/types";
import { getInOrOutType } from "@/lib/utils";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  data?: TransactionType;
  account?: AccountType;
  company?: CompanyType;
};

export const TransToImage: React.FC<Props> = ({
  open,
  toggle,
  data,
  account,
  company,
}) => {
  const refComponentToPrint = useRef(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
  };

  const handleDownloadJPG = async () => {
    if (!refComponentToPrint.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toJpeg(refComponentToPrint.current, {
        quality: 0.95,
        backgroundColor: "white",
      });

      const link = document.createElement("a");
      link.download = `MOV${data?.id}-${account?.accountNumber}.jpg`;
      link.href = dataUrl;
      link.click();
      toggleForm();
      setIsExporting(false);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  return (
    <Modal
      centered
      title={<div className="">Exporter la transaction en image</div>}
      open={open}
      onOk={handleDownloadJPG}
      onCancel={toggleForm}
      closable={!isExporting}
      maskClosable={!isExporting}
    >
      <div>
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
      </div>
    </Modal>
  );
};
