"use client";

import { EditOutlined } from "@ant-design/icons";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import {  Button } from "antd";

export const CompanyClient = () => {
  return (
    <div>
      <ProCard
        className=""
        title="Profile entreprise"
        extra={[
          <Button key="1" icon={<EditOutlined />} className="shadow-none">
            Editer
          </Button>,
        ]}
      >
        <ProDescriptions
          column={{ sm: 1, md: 2 }}
          // title="Résumé de configurations"
          emptyText=""
        >
          <ProDescriptions.Item
            valueType="text"
            label="Monnaie"
          >
            {/* {company?.currency} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            valueType="text"
            ellipsis
            label="Nom de l'entreprise"
          >
            {/* {company?.name} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Abréviation" valueType="text">
            {/* {company?.shortName} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Devise" valueType="text">
            {/* {company?.motto} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Description" valueType="text">
            {/* {company?.description} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Logo" valueType="image">
            {/* {company?.logo} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Icon" valueType="image">
            {/* {company?.icon} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Site web" valueType="text">
            {/* {company?.webSiteUrl} */}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="Pays" valueType="text">
            {/* {company?.country} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Province" valueType="text">
            {/* {company?.province} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Ville ou territoire" valueType="text">
            {/* {company?.city} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Adresse" valueType="text">
            {/* {company?.address} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Téléphone 1" valueType="text">
            {/* {`${company?.phone1.countryCode??""}${company?.phone1.areaCode??""}${company?.phone1.phoneNumber??""}`} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Téléphone 2" valueType="text">
            {/* {`${company?.phone2.countryCode??""}${company?.phone2.areaCode??""}${company?.phone2.phoneNumber??""}`} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Email" valueType="text">
            {/* {company?.email} */}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
    </div>
  );
};
