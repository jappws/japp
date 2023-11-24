"use client";

import { Avatar, Button, Divider, Form, Layout, Space, theme } from "antd";
import { UserFormDataType } from "./user";
// import { LabelValueItem } from "@/components/ui/descriptionItem";
import { EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { CompanyFormDataType } from "./company";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";

type Props = {
  currentStep: number;
  prevStep?: () => void;
  company?: CompanyFormDataType;
  user?: UserFormDataType;
  isLoading: boolean;
  submit?: () => void;
};

export const StepFormOverview: React.FC<Props> = ({
  currentStep,
  prevStep,
  company,
  user,
  isLoading,
  submit,
}) => {
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  return (
    <div className="">
      <div
        // style={{
        //   paddingTop: 8,
        // }}
        className=" max-w-4xl mx-auto pt-3"
      >
        <ProCard
          title="Résumé de l'entreprise"
          bordered
          collapsible
          style={{ minWidth: 300, marginBlockEnd: 16, maxWidth: "100%" }}
        >
          <ProDescriptions
            column={{ sm: 1, md: 2 }}
            // title="Résumé de configurations"
            emptyText=""
          >
            <ProDescriptions.Item valueType="text" label="Monnaie">
              {company?.currency}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              valueType="text"
              ellipsis
              label="Nom de l'entreprise"
            >
              {company?.name}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Abréviation" valueType="text">
              {company?.shortName}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Devise" valueType="text">
              {company?.motto}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Description" valueType="text">
              {company?.description}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Logo" valueType="image">
              {company?.logo}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Icon" valueType="image">
              {company?.icon}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Site web" valueType="text">
              {company?.webSiteUrl}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="Pays" valueType="text">
              {company?.country}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Province" valueType="text">
              {company?.province}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Ville ou territoire" valueType="text">
              {company?.city}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Adresse" valueType="text">
              {company?.address}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Téléphone 1" valueType="text">
              {`${company?.phone1?.countryCode ?? ""}${
                company?.phone1?.areaCode ?? ""
              }${company?.phone1?.phoneNumber ?? ""}`}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Téléphone 2" valueType="text">
              {`${company?.phone2?.countryCode ?? ""}${
                company?.phone2?.areaCode ?? ""
              }${company?.phone2?.phoneNumber ?? ""}`}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Email" valueType="text">
              {company?.email}
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>

        <ProCard
          title="Résumé de l'utilisateur (owner)"
          bordered
          collapsible
          style={{ minWidth: 300, marginBlockEnd: 16, maxWidth: "100%" }}
        >
          <ProDescriptions column={{ sm: 1, md: 2 }} emptyText="">
            <ProDescriptions.Item valueType="text" ellipsis label="Nom">
              {user?.firstName}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Postnom" valueType="text">
              {user?.lastName}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Prénom" valueType="text">
              {user?.surname}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Sexe" valueType="text">
              {user?.sex}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Email" valueType="text">
              {user?.email}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Téléphone" valueType="text">
              {`${user?.phone.countryCode}${user?.phone.areaCode}${user?.phone.phoneNumber}`}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="Mot de passe" valueType="text">
              {user?.password}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="Rôle" valueType="text">
              Administrateur (owner)
            </ProDescriptions.Item>
          </ProDescriptions>
        </ProCard>

        {/* Foooooter */}
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
              disabled={isLoading}
            >
              Précédent
            </Button>
          )}

          <Button
            type="primary"
            className="shadow-none"
            onClick={submit}
            disabled={isLoading}
            icon={isLoading ? <LoadingOutlined /> : undefined}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  );
};
