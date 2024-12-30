"use client";

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
import { useParams } from "next/navigation";
import { TransferType } from "@/lib/types";

type GoldTransferFormData = {
  date: string;
  amount: string;
  goldQuantity: string;
  message: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  transferData?: TransferType;
  triggerRightSider?: Dispatch<SetStateAction<boolean>>;
};

export const EditGoldTransferForm: React.FC<Props> = ({
  open,
  toggle,
  transferData,
  triggerRightSider
}) => {
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
      axios.post(
        `/api/v1/ws/partner/${partnerId}/transfer/${transferData?.id}`,
        data
      ),
  });

  const submit = (formData: GoldTransferFormData) => {
    const data = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      goldQuantity: formData.goldQuantity,
      sender: "",
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
          triggerRightSider?.(false)
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
      title={<div className="">Modification de l&apos;éxpédition</div>}
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
        initialValues={{
          date: dayjs(transferData?.date),
          amount: transferData?.amount,
          goldQuantity: transferData?.goldQuantity,
          message: transferData?.message,
        }}
        onFinish={submit}
        disabled={isPending}
      >
        <Layout className="bg-white">
          <Layout.Content>
            <Form.Item
              name="goldQuantity"
              label="Quantité en Or"
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
              label="Date d'expédition"
              rules={[{ required: true }]}
            >
              <DatePicker
                showTime
                className=" bg-white w-full"
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
