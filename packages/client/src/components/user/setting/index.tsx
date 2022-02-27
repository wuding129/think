import { Dispatch, SetStateAction, useRef, useState, useEffect } from "react";
import { Avatar, Form, Modal, Space, Banner } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { observer } from "mobx-react";
import { useService } from "@hooks/useService";
import { IUserService } from "@think/domains";
import { Upload } from "components/upload";

interface IProps {
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
}

export const UserSetting: React.FC<IProps> = observer(
  ({ visible, toggleVisible }) => {
    const $form = useRef<FormApi>();
    const userService = useService<IUserService>(IUserService);
    const { updateError, updateLoading, user } = userService;
    const [currentAvatar, setCurrentAvatar] = useState(user && user.avatar);

    const setAvatar = (url) => {
      $form.current.setValue("avatar", url);
      setCurrentAvatar(url);
    };

    const handleOk = () => {
      $form.current.validate().then((values) => {
        if (!values.email) {
          delete values.email;
        }
        userService.updateUser(values);
        toggleVisible(false);
      });
    };

    const handleCancel = () => {
      toggleVisible(false);
    };

    useEffect(() => {
      if (!user || !$form.current) return;
      $form.current.setValues(user);
      setCurrentAvatar(user.avatar);
    }, [user]);

    if (!user) return null;

    return (
      <Modal
        title="更新用户信息"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ maxWidth: "96vw" }}
        okButtonProps={{ loading: updateLoading }}
      >
        <Form
          initValues={{
            avatar: user.avatar,
            name: user.name,
            email: user.email,
          }}
          getFormApi={(formApi) => ($form.current = formApi)}
          labelPosition="left"
        >
          {updateError && (
            <Banner type="danger" description={updateError.message} />
          )}
          <Form.Slot label="头像">
            <Space align="end">
              <Avatar src={currentAvatar} shape="square" />
              <Upload onOK={setAvatar} />
            </Space>
          </Form.Slot>
          <Form.Input
            label="账户"
            field="name"
            style={{ width: "100%" }}
            disabled
            placeholder="请输入账户名称"
          ></Form.Input>
          <Form.Input
            label="邮箱"
            field="email"
            style={{ width: "100%" }}
            placeholder="请输入账户邮箱"
          ></Form.Input>
        </Form>
      </Modal>
    );
  }
);
