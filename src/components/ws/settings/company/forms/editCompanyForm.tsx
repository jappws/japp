"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
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
import { CompanyType, SexType } from "@/lib/types";
import { ProCard } from "@ant-design/pro-components";
import PhoneInput from "antd-phone-input";
import { phoneValidator } from "@/lib/validators/phone";
import { CompanyFormDataType } from "@/components/register/steps/company";



type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  initialData?:CompanyType,
};

export const EditCompanyForm: React.FC<Props> = ({ open, toggle, initialData }) => {
  const [form] = Form.useForm();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };
  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put(`/api/v1/ws/company`, data),
  });

  const submit = (formData: CompanyFormDataType) => {
    const data = {
        name: formData?.name,
        shortName: formData?.shortName,
        description: formData?.description,
        logo: formData?.logo,
        icon: formData?.icon,
        currency: formData?.currency,
        country: formData?.country,
        province: formData?.province,
        city: formData?.city,
        address: formData?.address,
        webSiteUrl: formData?.webSiteUrl,
        motto: formData?.motto,
        phone1: `${formData?.phone1?.countryCode ?? ""}${
          formData?.phone1?.areaCode ?? ""
        }${formData?.phone1?.phoneNumber ?? ""}`,
        phone2: `${formData?.phone2?.countryCode ?? ""}${
          formData?.phone2?.areaCode ?? ""
        }${formData?.phone2?.phoneNumber ?? ""}`,
        email: formData?.email,
    };
    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          message.success({
            content: "Modifications enregistrées",
            icon: <CheckOutlined />,
          });
          queryClient.invalidateQueries({ queryKey: ["company"] });
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
        <Space className="">
          Entreprise
          <Tag className="mr-0 font-bold" color="purple" bordered={false}>
            Modification
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
        initialValues={{...initialData}}
        onFinish={submit}
        disabled={isPending}
      >
        <div className="bg-white">
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
                    disabled
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
                    disabled
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
