"use client";

import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { Avatar, Button, Switch } from "antd";

export const AccountOwner = () => {
  return (
    <div>
      <ProCard
        className=""
        title="Profile"
        extra={[
          <Button key="1" icon={<EditOutlined />} className="shadow-none">
            Editer
          </Button>,
        ]}
      >
        <ProDescriptions column={{ sm: 1, md: 2 }} emptyText="">
        <ProDescriptions.Item  label="" valueType="avatar" render={()=><Avatar size="large" icon={<UserOutlined/>}/>}>
            {/* {user?.firstName} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item ellipsis label="Nom" valueType="text">
            {/* {user?.firstName} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Postnom" valueType="text">
            {/* {user?.lastName} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Prénom" valueType="text">
            {/* {user?.surname} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Surnom" valueType="text">
            {/* {user?.nickname} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Sexe" valueType="text">
            {/* {user?.sex} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Email" valueType="text">
            {/* {user?.email} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Téléphone" valueType="text">
            {/* {`${user?.phone.countryCode}${user?.phone.areaCode}${user?.phone.phoneNumber}`} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Autre téléphone" valueType="text">
            {/* {`${user?.phone.countryCode}${user?.phone.areaCode}${user?.phone.phoneNumber}`} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Pays" valueType="text">
            {/* {user?.password} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Province" valueType="text">
            {/* {user?.password} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Ville ou Territoire" valueType="text">
            {/* {user?.password} */}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Adresse" valueType="text">
            {/* {user?.password} */}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="Rôle" valueType="text">
            client
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label="Compte"
            valueType="switch"
            render={() => (
              <Switch checkedChildren="Éligible au crédit" checked unCheckedChildren="Non autorisé" disabled />
            )}
          ></ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
    </div>
  );
};
