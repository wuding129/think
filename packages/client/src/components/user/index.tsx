import React, { useEffect } from "react";
import { Dropdown, Typography, Avatar, Button } from "@douyinfe/semi-ui";
import { observer } from "mobx-react";
import { useService } from "@hooks/useService";
import { IUserService } from "@think/domains";
import { useToggle } from "hooks/useToggle";
import { UserSetting } from "./setting";

const { Text } = Typography;

export const User: React.FC = observer(() => {
  const userService = useService<IUserService>(IUserService);
  const { loginError, user, logout } = userService;
  const needLogin = loginError || !user;
  const [visible, toggleVisible] = useToggle(false);

  useEffect(() => {
    userService.syncDataInBrowser();
  }, []);

  return (
    <>
      {needLogin ? (
        <Button
          key="need-login"
          theme="solid"
          type="primary"
          size="small"
          onClick={logout}
        >
          登录
        </Button>
      ) : (
        <>
          <Dropdown
            key="has-login"
            trigger="click"
            position="bottomLeft"
            render={
              <Dropdown.Menu style={{ width: 160 }}>
                <Dropdown.Item onClick={() => toggleVisible(true)}>
                  <Text>账户设置</Text>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>
                  <Text>退出登录</Text>
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          >
            <Button
              key="has-login"
              theme={needLogin ? "solid" : "borderless"}
              type={needLogin ? "primary" : "tertiary"}
            >
              {user.avatar ? (
                <Avatar size="extra-extra-small" src={user.avatar}></Avatar>
              ) : (
                <Avatar size="extra-extra-small" color="orange">
                  {user && user.name[0]}
                </Avatar>
              )}
            </Button>
          </Dropdown>
          <UserSetting visible={visible} toggleVisible={toggleVisible} />
        </>
      )}
    </>
  );
});
