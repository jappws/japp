"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Tag,
  message,
} from "antd";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { useParams } from "next/navigation";
import { PartnerType } from "@/lib/types";

type NewBossAccountFormData = {
  code: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  partner?:PartnerType
};

export const EditPartnerForm: React.FC<Props> = ({ open, toggle,partner }) => {
  const [form] = Form.useForm();
  const { partnerId } = useParams();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/api/v1/ws/partner/${partnerId}`, data),
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
      title={
        <Space className="">
          Modification {partner?.code??""}
          <Tag
            className="mr-0 font-bold uppercase"
            color="purple"
            bordered={false}
          >
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
        initialValues={{code:partner?.code}}
        onFinish={submit}
        disabled={isPending}
      >
        <div className="bg-white">
          <ProCard bordered style={{ marginBlockEnd: 16, maxWidth: "100%" }}>
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
