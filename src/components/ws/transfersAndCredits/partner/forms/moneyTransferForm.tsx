"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Space,
  message,
} from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";
import {
  CheckOutlined,
  DollarOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useParams } from "next/navigation";

type MoneyTransferFormData = {
  amount: string;
  sender: string;
  date: string;
  message?: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
};

export const MoneyTransferForm: React.FC<Props> = ({ open, toggle }) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };
  const { partnerId } = useParams();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/api/v1/ws/partner/${partnerId}/transfer`, data),
  });

  const submit = (formData: MoneyTransferFormData) => {
    const data = {
      date: formData.date,
      type: "MONEY_TRANSFER",
      amount: parseFloat(formData.amount),
      goldQuantity: "",
      sender: formData.sender,
      message: formData.message,
      operatorId: session?.user.id,
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Opération effectuée",
            icon: <CheckOutlined />,
          });
          form.resetFields();
          toggleForm();
          queryClient.invalidateQueries({ queryKey: ["partner", partnerId] });
        }
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
      title={<div className="">Transfert d&apos;argent</div>}
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
        initialValues={{  }}
        onFinish={submit}
        disabled={isPending}
      >
        <Layout className="bg-white">
          <Layout.Content>
            <Form.Item
              name="sender"
              label="Expéditeur"
              rules={[
                {
                  required: true,
                },
                {
                  whitespace: true,
                  message: "Pas uniquement des espaces vide svp!",
                },
              ]}
            >
              <Input />
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
              label="Date de transfert"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                className=" bg-white"
                placeholder="sélectionner une date"
                format="DD/MM/YYYY HH:mm:ss"
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
