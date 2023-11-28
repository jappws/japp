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
  message,
} from "antd";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { AccountType, SexType } from "@/lib/types";
import { ProCard } from "@ant-design/pro-components";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";

type EditAccountFormData = {
  firstName: string;
  lastName: string;
  surname: string;
  nickname: string;
  phone?: {
    countryCode?: number;
    areaCode?: number;
    phoneNumber?: string;
    isoCode?: string;
    valid?: boolean;
  };
  otherPhone?: {
    countryCode?: number;
    areaCode?: number;
    phoneNumber?: string;
    isoCode?: string;
    valid?: boolean;
  };
  sex: SexType;
  country: string;
  province: string;
  city: string;
  address: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  initialData?: AccountType;
};

export const EditAccountForm: React.FC<Props> = ({
  open,
  toggle,
  initialData,
}) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) =>
      axios.put(`/api/v1/ws/account/${initialData?.id}`, data),
  });

  const submit = (formData: EditAccountFormData) => {
    const data = {
      ownerId: initialData?.ownerId,
      owner: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        surname: formData.surname,
        nickname: formData.nickname,
        phone: `+${formData?.phone?.countryCode}${formData?.phone?.areaCode}${formData?.phone?.phoneNumber}`,
        otherPhone: formData?.otherPhone?.valid
          ? `+${formData?.otherPhone?.countryCode ?? ""}${
              formData?.otherPhone?.areaCode ?? ""
            }${formData?.otherPhone?.phoneNumber ?? ""}`
          : "",
        sex: formData.sex,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        address: formData.address,
      },
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Modifications enregistrées",
            icon: <CheckOutlined />,
          });
          form.resetFields();
          toggleForm();

          queryClient.invalidateQueries({
            queryKey: ["account", initialData?.accountNumber],
          });
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
          Modification compte
          <Tag className="mr-0 font-bold" color="purple" bordered={false}>
            {initialData?.accountNumber}
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
        initialValues={{ ...initialData?.owner }}
        onFinish={submit}
        disabled={isPending}
      >
        <div className="bg-white">
          <ProCard
            title="Identité"
            bordered
            collapsible
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
                  name="nickname"
                  label="Surnom"
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

          <ProCard
            title="Localisation"
            bordered
            collapsible
            style={{ minWidth: 300, marginBlockEnd: 16, maxWidth: "100%" }}
          >
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name="country"
                  label="Pays"
                  rules={[
                    {
                      required: false,
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces vide svp!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="province"
                  label="Province"
                  rules={[
                    {
                      required: false,
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces vide svp!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="city"
                  label="Ville ou territoire"
                  rules={[
                    {
                      required: false,
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces vide svp!",
                    },
                  ]}
                >
                  <Input className="bg-white" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="address"
                  label="Adresse"
                  rules={[
                    {
                      required: false,
                    },
                    {
                      whitespace: true,
                      message: "Pas uniquement des espaces vide svp!",
                    },
                  ]}
                >
                  <Input.TextArea rows={3} className="bg-white" />
                </Form.Item>
              </Col>
            </Row>
          </ProCard>

          <ProCard
            title="Contacts"
            bordered
            collapsible
            style={{ marginBlockEnd: 16, maxWidth: "100%" }}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: false,
                    },
                    {
                      type: "email",
                      message: "Le format de l'Email n'est pas valide!",
                    },
                  ]}
                >
                  <Input
                    className="bg-white"
                    placeholder="Adresse mail"
                    disabled
                  />
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
                  name="otherPhone"
                  label="Téléphone 2"
                  rules={[
                    {
                      required: false,
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
