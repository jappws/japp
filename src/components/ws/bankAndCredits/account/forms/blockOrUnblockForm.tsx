"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, Space, Switch, message } from "antd";
import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { UserType } from "@/lib/types";
import { useParams } from "next/navigation";

type Props = {
  open: boolean;
  toggle?: Dispatch<SetStateAction<boolean>>;
  user?: UserType;
};

export const BlockOrUnblockForm: React.FC<Props> = ({ open, toggle, user }) => {
  const { accountId } = useParams();

  const toggleForm = () => {
    toggle && toggle((prev) => !prev);
  };

  const queryClient = useQueryClient();

  const { mutate: mutate, isPending } = useMutation({
    mutationFn: (data: any) => axios.put(`/api/v1/ws/user/${user?.id}`, data),
  });

  return (
    <Modal
      title={<div className="">Etat du compte</div>}
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
          unCheckedChildren="Non éligible au crédit"
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
          <Button
            disabled={isPending}
            onClick={toggleForm}
            className="shadow-none"
          >
            Fermer
          </Button>
        </Space>
      </div>
    </Modal>
  );
};
