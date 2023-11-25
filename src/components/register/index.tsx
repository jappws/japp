"use client";

import {
  CheckOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Space,
  Steps,
  Typography,
  message,
  theme,
} from "antd";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation
} from "@tanstack/react-query";
import axios from "axios";
import { stepsItems } from "./steps/items";
import { CompanyFormDataType, StepCompanyForm } from "./steps/company";
import { StepUserForm, UserFormDataType } from "./steps/user";
import { StepFormOverview } from "./steps/overview";
import { IsoCodeCurrencyType } from "@/lib/types";

export const RegisterPageClientSider: React.FC = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const { push } = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [companyData, setCompanyData] = useState<CompanyFormDataType | undefined>({currency:IsoCodeCurrencyType.USD, name:"Japp", shortName:"Japp"});
  const [userData, setUserData] = useState<UserFormDataType | undefined>();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.post("/api/v1/register", data),
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const submit = () => {
    const data = {
      company: {},
      user: {},
    };

    mutate(data, {
      onSuccess: (res) => {
        if (res.data) {
          resetForm();
          message.success({
            content: "L'application a été bien configuré",
            icon: <CheckOutlined />,
          });
          push("/ws");
        }
      },
      onError: () => {
        message.error({
          content: "Oops! Une erreur s'est produite, Veuillez réessayer!",
        });
      },
    });
  };

  const resetForm = () => {
    setCurrentStep(0);
    setCompanyData(undefined);
    setUserData(undefined);
  };

  const contents: ReactNode[] = [
    <StepCompanyForm
      key={0}
      currentStep={currentStep}
      stepsItems={stepsItems}
      nextStep={nextStep}
      prevStep={prevStep}
      initialStepFormData={companyData}
      setData={setCompanyData}
    />,
    <StepUserForm
      key={1}
      currentStep={currentStep}
      stepsItems={stepsItems}
      nextStep={nextStep}
      prevStep={prevStep}
      initialStepFormData={userData}
      setData={setUserData}
    />,
    <StepFormOverview
      key={2}
      currentStep={currentStep}
      prevStep={prevStep}
      isLoading={isPending}
      company={companyData}
      user={userData}
      submit={submit}
    />,
  ];

  return (
    <Layout className="bg-white">
      <Layout.Header className="flex px-4 md:px-8">
        <Space className="text-white uppercase font-bold">Configurations</Space>
        <div className="flex-1" />
        <Space>
          <Typography.Text className=" text-4xl font-bold text-white">
            Japp
          </Typography.Text>
          <SettingOutlined style={{ color: "#fff" }} />
        </Space>
      </Layout.Header>
      <Layout.Content className="px-4 md:px-8 pt-4">
        <Steps current={currentStep} items={stepsItems} />
        {contents[currentStep]}
      </Layout.Content>
    </Layout>
  );
};
