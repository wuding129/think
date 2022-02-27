import Link from "next/link";
import {
  Form,
  Button,
  Layout,
  Space,
  Typography,
  Banner,
} from "@douyinfe/semi-ui";
import { useCallback } from "react";
import { observer } from "mobx-react";
import { useService } from "@hooks/useService";
import { IUserService } from "@think/domains";
import { Seo } from "components/seo";
import { LogoImage, LogoText } from "components/logo";
import { Author } from "components/author";
import { Theme } from "components/theme";
import styles from "./index.module.scss";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Page = observer(() => {
  const userService = useService<IUserService>(IUserService);
  const { loginLoading, loginError } = userService;

  const login = useCallback((values) => {
    userService.login(values);
  }, []);

  return (
    <Layout className={styles.wrap}>
      <Seo title="登录" />
      <Content className={styles.content}>
        <Title heading={4} style={{ marginBottom: 16, textAlign: "center" }}>
          <Space>
            <LogoImage></LogoImage>
            <LogoText></LogoText>
          </Space>
        </Title>
        <Form
          className={styles.form}
          initValues={{ name: "", password: "" }}
          onSubmit={login}
        >
          <Title
            type="tertiary"
            heading={5}
            style={{ marginBottom: 16, textAlign: "center" }}
          >
            账户登录
          </Title>
          {loginError && (
            <Banner type="danger" description={loginError.message} />
          )}
          <Form.Input
            noLabel
            field="name"
            label="账户"
            style={{ width: "100%" }}
            placeholder="输入账户名称"
            rules={[{ required: true, message: "请输入账户" }]}
          ></Form.Input>
          <Form.Input
            noLabel
            mode="password"
            field="password"
            label="密码"
            style={{ width: "100%" }}
            placeholder="输入用户密码"
            rules={[{ required: true, message: "请输入密码" }]}
          ></Form.Input>
          <Button
            loading={loginLoading}
            htmlType="submit"
            type="primary"
            theme="solid"
            block
            style={{ margin: "16px 0" }}
          >
            登录
          </Button>
          <footer>
            <Text link style={{ textAlign: "center" }}>
              <Link href="/register">
                <a>注册用户以登录</a>
              </Link>
            </Text>
          </footer>
        </Form>
      </Content>
      <Footer className={styles.footerWrap}>
        <Author />
        <Theme />
      </Footer>
    </Layout>
  );
});

export default Page;
