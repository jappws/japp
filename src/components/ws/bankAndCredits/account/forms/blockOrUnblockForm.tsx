"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Switch,
  message,
} from "antd";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import {
  CheckOutlined,
  LoadingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { UserType } from "@/lib/types";
import { useParams } from "next/navigation";

type NewUserFormData = {
  password: string;
  passwordConfirmed: string;
};

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  user?: UserType;
};

export const BlockOrUnblockForm: React.FC<Props> = ({ open, toggle, user }) => {
  const [form] = Form.useForm();
  const { accountId } = useParams();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
    form.resetFields();
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put(`/api/v1/ws/user/${user?.id}`, data),
  });

  return (
    <Modal
      title={
        <div className="">
          <LockOutlined />
          Etat du compte
        </div>
      }
      open={open}
      footer={null}
      onCancel={toggleForm}
      closable={!isPending}
      maskClosable={!isPending}
    >
      <ProCard bordered style={{ marginBlockEnd: 16, maxWidth: "100%" }}>
        <Switch
          loading={isPending}
          checkedChildren="Éligible au crédit"
          checked={user?.blocked ? false : true}
          unCheckedChildren="Non autorisé"
          onChange={(value) => {
            const data = {
              blocked: value ? false : true,
            };
            mutate(data, {
              onSuccess: (res) => {
                if (res.data) {
                  message.success({
                    content: "Modification enregistrée",
                    icon: <CheckOutlined />,
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["account", accountId],
                  });
                  form.resetFields();
                  toggleForm();
                }
              },
              onError: () => {
                message.error({
                  content:
                    "Oops! Une erreur s'est produite, Veuillez réessayer!",
                });
              },
            });
          }}
        />
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
          <Button>Fermer</Button>
        </Space>
      </div>
    </Modal>
  );
};
