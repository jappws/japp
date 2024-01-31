"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import axios from "axios";
import React, { Dispatch, SetStateAction } from "react";
import {
  CheckOutlined,
  LoadingOutlined,
  WarningFilled,
} from "@ant-design/icons";
import { AccountType } from "@/lib/types/index.d";
import { ProCard } from "@ant-design/pro-components";

type DeleteAccountFormData = {
  inputConfimation: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  accountData?: AccountType;
};

export const DeleteAccountForm: React.FC<Props> = ({
  open,
  toggle,
  accountData,
}) => {
  const [form] = Form.useForm();
  const [textToConfirm] = React.useState(`${accountData?.accountNumber}`);

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.delete(`/api/v1/ws/account/${accountData?.id}`, data),
  });

  const submit = (formData: DeleteAccountFormData) => {
    if (formData.inputConfimation === textToConfirm) {
      mutate(
        {},
        {
          onSuccess: (res) => {
            if (res.data.message !== "account_not_found") {
              message.success({
                content: "Compte supprimé avec succès",
                icon: <CheckOutlined />,
              });

              toggleForm();

              queryClient.invalidateQueries({
                queryKey: ["accounts"],
              });
            } else {
              message.error({
                content: "Ce compte n'existe pas",
              });
            }
          },
          onError: () => {
            message.error({
              content: "Oops! Une erreur s'est produite, Veuillez réessayer!",
            });
          },
        }
      );
    } else {
      message.error({
        content: "Oops! Mauvais texte de confirmation",
      });
    }
  };

  return (
    <Modal
      title={
        <Space className="">
          Suppression du compte
          <Tag className="mr-0 font-bold" color="purple" bordered={false}>
            {accountData?.accountNumber}
          </Tag>{" "}
          {accountData?.owner?.firstName} {accountData?.owner?.lastName}{" "}
          {accountData?.owner.surname}
        </Space>
      }
      open={open}
      footer={null}
      onCancel={toggleForm}
      closable={!isPending}
      maskClosable={!isPending}
    >
      <Form
        form={form}
        layout="horizontal"
        className=" pt-3 w-full"
        onReset={toggleForm}
        initialValues={{}}
        onFinish={submit}
        disabled={isPending}
      >
        <div className="bg-white">
          <div className="flex space-x-3 p-3 bg-red-50 mb-5 rounded-md">
            <WarningFilled className="text-red-500 text-6xl" />
            <div className="flex-1">
              Le compte sera définitivement supprimé, y compris ses mouvements
              et opérations associées. Cette action est irréversible et ne peut
              pas être annulée une fois effectuée.
            </div>
          </div>
          <Typography.Text>
            Veuillez saisir{" "}
            <Tag color="error" className="mr-0" bordered={false}>
              {textToConfirm}
            </Tag>{" "}
            pour confirmer la suppression.
          </Typography.Text>
          <ProCard
            title=""
            bordered
            style={{ marginBlockEnd: 16, maxWidth: "100%" }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="inputConfimation"
                  label="Confirmation"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces svp!",
                    },
                  ]}
                >
                  <Input
                    className="bg-white"
                    placeholder={`${textToConfirm}`}
                  />
                </Form.Item>
              </Col>
            </Row>
          </ProCard>

          <div
            style={{
              display: "flex",
              justifyContent: "end",
              borderTop: "1px solid #f0f0f0",
              borderRadius: "0 0 10px 10px",
              backgroundColor: "#fff",
              padding: "14px 0 0 0",
            }}
          >
            <Space>
              <Button htmlType="reset">Annuler</Button>
              <Button
                type="primary"
                danger={true}
                htmlType="submit"
                className="shadow-none"
                icon={isPending ? <LoadingOutlined /> : undefined}
              >
                Confirmer
              </Button>
            </Space>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
