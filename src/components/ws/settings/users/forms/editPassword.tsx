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
  message,
} from "antd";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
  CheckOutlined,
  LoadingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { UserType } from "@/lib/types";

type NewUserFormData = {
  password: string;
  passwordConfirmed: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  user?: UserType;
};

export const EditPasswordForm: React.FC<Props> = ({ open, toggle, user }) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/api/v1/ws/user/${user?.id}/password`, data),
  });

  const submit = (formData: NewUserFormData) => {
    const data = {
      password: formData?.password,
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Modification enregistrée",
            icon: <CheckOutlined />,
          });
          queryClient.invalidateQueries({ queryKey: ["users"] });
          form.resetFields();
          toggleForm();
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
        <div className="">
          <LockOutlined /> Modification du mot de passe
        </div>
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
        onFinish={submit}
        disabled={isPending}
      >
        <div className="bg-white">
          <ProCard bordered style={{ marginBlockEnd: 16, maxWidth: "100%" }}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Nouveau mot de passe"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      min: 6,
                      message:
                        "Le mot de passe doit être entre 6 et 14 caractères",
                    },
                    {
                      max: 14,
                      message:
                        "Le mot de passe doit être entre 6 et 14 caractères",
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces vide svp!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password style={{ backgroundColor: "#fff" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="passwordConfirmed"
                  label="Confirmé le mot de passe"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                    },
                    {
                      min: 6,
                      message:
                        "Le mot de passe doit être entre 6 et 14 caractères",
                    },
                    {
                      max: 14,
                      message:
                        "Le mot de passe doit être entre 6 et 14 caractères",
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces vide svp!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Les deux mots de passe que vous avez saisis ne correspondent pas!"
                          )
                        );
                      },
                    }),
                  ]}
                  hasFeedback
                >
                  <Input.Password style={{ backgroundColor: "#fff" }} />
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
