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
import { Dispatch, SetStateAction } from "react";
import { CheckOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";
import { RoleType, SexType, UserType } from "@/lib/types/index.d";

type NewUserFormData = {
  firstName: string;
  lastName: string;
  surname: string;
  sex: SexType;
  phone: {
    countryCode: number;
    areaCode: number;
    phoneNumber: string;
    isoCode: string;
    valid: boolean;
  };
  email: string;
  role: RoleType;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  initialData?:UserType;
};

export const EditUserForm: React.FC<Props> = ({ open, toggle, initialData }) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put(`/api/v1/ws/user/${initialData?.id}`, data),
  });

  const submit = (formData: NewUserFormData) => {
    const data = {
      firstName: formData?.firstName,
      lastName: formData?.lastName,
      surname: formData?.surname,
      email: formData?.email,
      phone: `+${formData?.phone.countryCode}${formData?.phone.areaCode}${formData?.phone.phoneNumber}`,
      sex: formData?.sex,
      role:formData.role,
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Modification enregistrées",
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
      title={<div className=""><EditOutlined/> Modification utilisateur</div>}
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
        initialValues={{ ...initialData}}
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
                      message: "Le numéro de téléphone est obligatoire",
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
              <Col span={24}>
                <Form.Item
                  name="role"
                  label="Rôle"
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
                    placeholder="Sélectionner un rôle"
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
                        value: "AGENT",
                        label: "Opérateur agent",
                      },
                      {
                        value: "ADMIN",
                        label: "Administrateur",
                      },
                      {
                        value: "CLIENT",
                        label: "Client partenaire",
                        disabled: true,
                      },
                    ]}
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
