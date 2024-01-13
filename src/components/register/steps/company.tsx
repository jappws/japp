"use client";

import { Col, Form, Input, Row, Button, StepProps, theme, Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";
import { CheckOutlined } from "@ant-design/icons";
import { IsoCodeCurrencyType } from "@/lib/types/index.d";
import { ProCard } from "@ant-design/pro-components";

export type CompanyFormDataType = {
  name?: string;
  shortName?: string;
  description?: string;
  motto?: string;
  logo?: string;
  webSiteUrl?: string;
  icon?: string;
  country?: string;
  province?: string;
  city?: string;
  address?: string;
  phone1?: {
    countryCode: number;
    areaCode: number;
    phoneNumber: string;
    isoCode: string;
    valid: boolean;
  };
  phone2?: {
    countryCode: number;
    areaCode: number;
    phoneNumber: string;
    isoCode: string;
    valid: boolean;
  };
  email?: string;
  currency?: IsoCodeCurrencyType;
};

type Props = {
  currentStep: number;
  stepsItems: StepProps[];
  nextStep?: () => void;
  prevStep?: () => void;
  initialStepFormData?: CompanyFormDataType;
  setData?: Dispatch<SetStateAction<CompanyFormDataType | undefined>>;
};

export const StepCompanyForm: React.FC<Props> = ({
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

  const goForward = (data: CompanyFormDataType) => {
    setData && setData(data);
    nextStep && nextStep();
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      requiredMark="optional"
      initialValues={initialStepFormData}
      onFinish={goForward}
    >
      <div
        style={{
          maxWidth: "460px",
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: 8,
        }}
        className="pt-4"
      >
        <ProCard
          title="Informations financières"
          bordered
          collapsible
          style={{ marginBlockEnd: 16, maxWidth: "100%" }}
        >
          <Form.Item
            name="currency"
            label="Monnaie"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              disabled
              showSearch
              placeholder="Sélectioner une devise"
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
              menuItemSelectedIcon={<CheckOutlined />}
              options={[
                {
                  value: "USD",
                  label: "USD (Dollar américain)",
                },
                { value: "CDF", label: "CDF (Franc congolais)" },
              ]}
            />
          </Form.Item>
        </ProCard>
        <ProCard
          title="Identité de l'entreprise"
          bordered
          collapsible
          style={{ minWidth: 300, marginBlockEnd: 16, maxWidth: "100%" }}
        >
          <Row gutter={{ md: 24 }}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Nom de l'entreprise"
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
                <Input
                  className="bg-white "
                  placeholder="Nom designant votre entreprise"
                  // disabled
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="shortName"
                label="Abréviation"
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
                <Input
                  className="bg-white"
                  placeholder="Nom court"
                  //  disabled
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
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
                <Input.TextArea
                  rows={3}
                  className="bg-white"
                  placeholder="Brève description de l'entreprise"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="motto"
                label="Devise"
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
                <Input
                  className="bg-white"
                  placeholder="Devise de l'entreprise"
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="logo"
                label="Logo"
                rules={[
                  {
                    required: false,
                  },
                  {
                    type: "url",
                    message: "Votre URL n'est pas valide pour un logo",
                  },
                ]}
              >
                <Input className="bg-white" placeholder="URL du logo" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="icon"
                label="Icon"
                rules={[
                  {
                    required: false,
                  },
                  {
                    type: "url",
                    message: "Votre URL n'est pas valide pour une icon",
                  },
                ]}
              >
                <Input className="bg-white" placeholder="URL de l'icon" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="webSiteUrl"
                label="Site web"
                rules={[
                  {
                    required: false,
                  },
                  {
                    type: "url",
                    message: "Votre URL n'est pas valide pour un site web",
                  },
                ]}
              >
                <Input className="bg-white" placeholder="URL du site web" />
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
          title="Contacts de l'entreprise"
          bordered
          collapsible
          style={{ minWidth: 300, marginBlockEnd: 16, maxWidth: "100%" }}
        >
          <Row gutter={{ md: 24 }} className="">
            <Col span={24}>
              <Form.Item
                name="phone1"
                label="Téléphone 1"
                rules={[{ validator: phoneValidator }]}
              >
                <PhoneInput
                  placeholder="Numéro de téléphone 1"
                  searchPlaceholder="Rechercher un pays"
                  enableSearch={true}
                  country="cd"
                  preferredCountries={["cd"]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="phone2"
                label="Téléphone 2"
                rules={[{ validator: phoneValidator }]}
              >
                <PhoneInput
                  placeholder="Numéro de téléphone 2"
                  country="cd"
                  searchPlaceholder="Rechercher un pays"
                  enableSearch={true}
                  preferredCountries={["cd"]}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "L'Email n'est pas valide!",
                  },
                ]}
              >
                <Input className="bg-white" />
              </Form.Item>
            </Col>
          </Row>
        </ProCard>

        {/* Fooooter */}
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
