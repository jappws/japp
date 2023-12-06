"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  message,
} from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction } from "react";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { SexType } from "@/lib/types/index.d";
import { ProCard } from "@ant-design/pro-components";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";

type NewBossAccountFormData = {
  code: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
};

export const NewPartnerForm: React.FC<Props> = ({ open, toggle }) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post(`/api/v1/ws/b-account`, data),
  });

  const submit = (formData: NewBossAccountFormData) => {
    const data = {
      code: formData.code,
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
          queryClient.invalidateQueries({ queryKey: ["BAccounts"] });
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
      title={
        <Space className="">
          Nouveau compte
          <Tag className="mr-0 font-bold uppercase" color="purple" bordered={false}>
            B-Partner
          </Tag>
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
          <ProCard
            bordered
            style={{ marginBlockEnd: 16, maxWidth: "100%" }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="code"
                  label="Code d'identification"
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
                  <Input className="bg-white" />
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
                htmlType="submit"
                className="shadow-none"
                icon={isPending ? <LoadingOutlined /> : undefined}
              >
                Enregistrer
              </Button>
            </Space>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
