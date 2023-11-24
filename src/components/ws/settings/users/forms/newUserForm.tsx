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
import { TransactionTypeType } from "@/lib/types";
import { useParams } from "next/navigation";
import { getTransactionTitle } from "@/lib/utils";
import { ProCard } from "@ant-design/pro-components";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";

type CreditFormData = {
  type: TransactionTypeType;
  amount: string;
  goldQuantity: string;
  date: string;
  message?: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
};

export const NewUserForm: React.FC<Props> = ({ open, toggle }) => {
  const [form] = Form.useForm();
  const { accountId } = useParams();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.post(`/api/v1/ws/finance/cash-transaction`, data),
  });

  const submit = (formData: CreditFormData) => {
    const data = {
      title: getTransactionTitle(formData.type),
      amount: parseFloat(formData.amount),
      type: formData.type,
      goldQuantity: formData.goldQuantity,
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
      title={<div className="">Nouveau (Opérateur)</div>}
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
        initialValues={{ date: dayjs() }}
        onFinish={submit}
        disabled={isPending}
      >
        <div className="bg-white">
        <ProCard title="Identité" bordered collapsible style={{ marginBlockEnd: 16, maxWidth: '100%'}}>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="firstName"
                  label="Nom"
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
              <Col span={24}>
                <Form.Item
                  name="lastName"
                  label="Postnom"
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
              <Col span={24}>
                <Form.Item
                  name="surname"
                  label="Prénom"
                  rules={[
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces svp!",
                    },
                  ]}
                >
                  <Input className="bg-white" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="sex"
                  label="Sexe"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    className=""
                    style={{ width: "100%" }}
                    placeholder="Sélectionner un sexe"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    notFoundContent={
                      <Empty
                        description="Aucune donnée"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    }
                    menuItemSelectedIcon={<CheckOutlined />}
                    options={[
                      {
                        value: "F",
                        label: "Féminin",
                      },
                      {
                        value: "M",
                        label: "Masculin",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              </Row>
              </ProCard>
              <ProCard title="Identifiants" bordered collapsible style={{ marginBlockEnd: 16, maxWidth: '100%'}}>
              <Row>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      type: "email",
                      message: "Le format de l'Email n'est pas valide!",
                    },
                  ]}
                >
                  <Input className="bg-white" placeholder="Adresse mail" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="phone"
                  label="Téléphone"
                  rules={[
                    {
                      required: true,
                      message:"Le numéro de téléphone est obligatoire"
                    },
                    { validator: phoneValidator },
                  ]}
                >
                  <PhoneInput
                    placeholder="Numéro de téléphone"
                    searchPlaceholder="Rechercher un pays"
                    country="cd"
                    enableSearch={true}
                    preferredCountries={["cd"]}
                    
                  />
                </Form.Item>
              </Col>
              </Row>
              </ProCard>
              <ProCard title="Sécurité" bordered collapsible style={{ marginBlockEnd: 16, maxWidth: '100%'}}>
                <Row>
              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Mot de passe"
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
