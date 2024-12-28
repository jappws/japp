"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
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
import { TransactionType } from "@/lib/types/index.d";
import { ProCard } from "@ant-design/pro-components";
import { useParams } from "next/navigation";

type DeleteTransFormData = {
  inputConfimation: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  transData?: TransactionType;
  triggerRightSider?: Dispatch<SetStateAction<boolean>>;
};

export const DeleteTransactionForm: React.FC<Props> = ({
  open,
  toggle,
  transData,
  triggerRightSider
}) => {
  const [form] = Form.useForm();
  const [textToConfirm] = React.useState<number | undefined>(transData?.amount);

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();
  const { accountId } = useParams();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.delete(
        `/api/v1/ws/account/${transData?.accountId}/transaction/${transData?.id}`,
        data
      ),
  });

  const submit = (formData: DeleteTransFormData) => {
    if (Number(formData.inputConfimation) === textToConfirm) {
      mutate(
        {},
        {
          onSuccess: (res) => {
            if (res.data.message !== "transaction_not_found") {
              message.success({
                content: "Transaction supprimée avec succès",
                icon: <CheckOutlined />,
              });

              toggleForm();
              triggerRightSider?.(false)
              queryClient.invalidateQueries({
                queryKey: ["transactions", accountId],
              });
              queryClient.invalidateQueries({
                queryKey: ["account", accountId],
              });
            } else {
              message.error({
                content: "Cette transaction n'existe pas.",
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
      title={<Space className="">Suppression de la transaction</Space>}
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
          <div className="flex space-x-3 p-3 bg-red-50 my-5 rounded-md">
            <WarningFilled className="text-red-500 text-6xl" />
            <div className="flex-1">
              Cette action est irréversible et ne peut pas être annulée une fois
              effectuée.
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
                  <InputNumber
                    className=" bg-white w-40"
                    min={0.0}
                    step={0.01}
                    controls={true}
                    stringMode={true}
                  />
                  {/* <Input
                    className="bg-white"
                    placeholder={`${textToConfirm}`}
                  /> */}
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
