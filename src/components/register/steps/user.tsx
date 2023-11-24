"use client";

import {
  Button,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  Layout,
  Row,
  Select,
  StepProps,
  theme,
} from "antd";
import { CheckOutlined} from "@ant-design/icons";
import { Dispatch, SetStateAction } from "react";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";
import { SexType } from "@/lib/types";
import { ProCard } from "@ant-design/pro-components";

export type UserFormDataType = {
  firstName: string;
  lastName: string;
  surname: string;
  sex: SexType
  phone: {
    countryCode: number;
    areaCode: number;
    phoneNumber: string;
    isoCode: string;
    valid: boolean;
  };
  email: string;
  password: string;
  passwordConfirmed: string;
};

type Props = {
  currentStep: number;
  stepsItems: StepProps[];
  nextStep?: () => void;
  prevStep?: () => void;
  initialStepFormData?: UserFormDataType;
  setData?: Dispatch<SetStateAction<UserFormDataType | undefined>>;
};

export const StepUserForm: React.FC<Props> = ({
  currentStep,
  stepsItems,
  nextStep,
  prevStep,
  initialStepFormData,
  setData,
}) => {
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();

  const goForward = (data: UserFormDataType) => {
    setData && setData(data);
    nextStep && nextStep();
  };

  return (
    <Form
      form={form}
      requiredMark="optional"
      layout="horizontal"
      initialValues={initialStepFormData}
      onFinish={goForward}
    >
      {/* <Layout
        style={{
          backgroundColor: colorBgContainer,
        }}
      >
        <Layout.Content style={{ padding: 16, overflowY: "auto" }}> */}
          <div
            style={{
              maxWidth: "460px",
              marginLeft: "auto",
              marginRight: "auto",
              paddingTop: 8,
            }}
          >
            
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
            {/* Fooooter*/}
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            borderTop: "1px solid #f0f0f0",
            borderRadius: "0 0 10px 10px",
            backgroundColor: "#fff",
            padding: "14px 16px",
          }}
        >
          {currentStep > 0 && (
            <Button
              style={{ margin: "0 8px" }}
              onClick={prevStep}
              className="shadow-none"
              type="text"
            >
              Précédent
            </Button>
          )}
          {currentStep < stepsItems.length - 1 && (
            <Button
              htmlType="submit"
              type="primary"
              className="shadow-none"
              slot="end"
            >
              Suivant
            </Button>
          )}
        </div>
          </div>
    </Form>
  );
};
