"use client";

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";
import {
  CheckOutlined,
  DollarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { TransactionTypeType } from "@/lib/types";
import { useParams } from "next/navigation";
import { getTransactionTitle } from "@/lib/utils";

type DebitFormData = {
  type: TransactionTypeType;
  amount: string;
  message?: string;
  date: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
};

export const NewOutOrDebitForm: React.FC<Props> = ({ open, toggle }) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { accountId } = useParams();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/api/v1/ws/finance/cash-transaction`, data),
  });

  const submit = (formData: DebitFormData) => {
    const data = {
      title: getTransactionTitle(formData.type),
      amount: -parseFloat(formData.amount),
      type: formData.type,
      message: formData.message,
      date: formData.date,
      accountId: accountId,
      operatorId: session?.user.id,
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Enregistré",
            icon: <CheckOutlined />,
          });
          form.resetFields();
          toggleForm();
        }
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: ["cash-transactions"] }),
          queryClient.invalidateQueries({ queryKey: ["balance"] }),
          queryClient.invalidateQueries({ queryKey: ["cash-accounts"] }),
        ]);
      },
      onError: () => {
        message.error({
          content: "Oops! Une erreur s'est produite, Veuillez réessayer!",
        });
      },
    });
  };

  return (
    <Modal
      centered
      title={<div className="">Sortie (Décaissement)</div>}
      open={open}
      footer={null}
      onCancel={toggleForm}
      closable={!isPending}
      maskClosable={!isPending}
    >
      <Form
        form={form}
        layout="horizontal"
        // requiredMark="optional"
        className=" pt-3 w-full"
        onReset={toggleForm}
        initialValues={{ date: dayjs() }}
        onFinish={submit}
        disabled={isPending}
      >
        <Layout className="bg-white">
          <Layout.Content>
            <Form.Item
              name="type"
              label="Type de sortie"
              rules={[{ required: true }]}
            >
              <Select
                showSearch
                placeholder="Sélectionner un type"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  `${option?.label}`.toLowerCase().includes(input.toLowerCase())
                }
                menuItemSelectedIcon={<CheckOutlined />}
                options={[
                  {
                    value: "WITHDRAWAL",
                    label: "Retrait d'argent sur le compte",
                  },
                  {
                    value: "LOAN_DISBURSEMENT",
                    label: "Décaissement de crédit",
                  },
                ]}
              />
            </Form.Item>
            <div className="flex items-end">
              <Form.Item
                name="amount"
                label="Montant"
                rules={[{ required: true }]}
              >
                <InputNumber
                  className=" bg-white w-40"
                  min={0.01}
                  step={0.01}
                  controls={true}
                  stringMode={true}
                  suffix={<DollarOutlined />}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="date"
              label="Date de décaissement"
              rules={[{ required: true }]}
            >
              <DatePicker
                className=" bg-white"
                placeholder="sélectionner une date"
                format="DD/MM/YYYY"
              />
            </Form.Item>

            <Form.Item
              name="message"
              label="Mémo (Observation)"
              rules={[
                { required: false },
                {
                  whitespace: true,
                  message: "Pas uniquement des espaces vide svp!",
                },
              ]}
            >
              <Input.TextArea className=" bg-white" />
            </Form.Item>
          </Layout.Content>
          <Layout.Footer
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
                htmlType="submit"
                className="shadow-none"
                icon={isPending ? <LoadingOutlined /> : undefined}
              >
                Enregistrer
              </Button>
            </Space>
          </Layout.Footer>
        </Layout>
      </Form>
    </Modal>
  );
};
