"use client";

import { CompanyType } from "@/lib/types/index.d";
import { EditOutlined } from "@ant-design/icons";
import { ProCard, ProDescriptions } from "@ant-design/pro-components";
import { useQuery } from "@tanstack/react-query";
import { Button } from "antd";
import axios from "axios";
import { EditCompanyForm } from "./forms/editCompanyForm";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export const CompanyClient = () => {
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const { data: session } = useSession();

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company"],
    queryFn: () =>
      axios.get(`/api/v1/ws/company`).then((res) => res.data as CompanyType),
  });
  return (
    <div>
      <ProCard
        className=""
        title="Profile entreprise"
        extra={[
          <Button
            key="1"
            icon={<EditOutlined />}
            className={cn(
              "shadow-none",
              session?.user.role === "ADMIN" ? "block" : "hidden"
            )}
            onClick={() => setOpenEditForm(true)}
          >
            Editer
          </Button>,
        ]}
      >
        <ProDescriptions
          column={{ sm: 1, md: 2 }}
          // title="Résumé de configurations"
          emptyText=""
          loading={isLoadingCompany}
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
            {company?.phone1}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Téléphone 2" valueType="text">
            {company?.phone2}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="Email" valueType="text">
            {company?.email}
          </ProDescriptions.Item>
        </ProDescriptions>
      </ProCard>
      <EditCompanyForm
        open={openEditForm}
        toggle={setOpenEditForm}
        initialData={company}
      />
    </div>
  );
};
