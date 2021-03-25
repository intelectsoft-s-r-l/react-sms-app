import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { LockOutlined, MailOutlined, WarningOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Tooltip, Radio, Select } from "antd";
import {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  hideLoading,
} from "../../../redux/actions/Auth";
import { motion } from "framer-motion";
import IntlMessage from "components/util-components/IntlMessage";
import { IState } from "redux/reducers";
import { IAuth } from "redux/reducers/Auth";
import { ITheme } from "redux/reducers/Theme";
import { RouteComponentProps } from "react-router-dom";

const rules = {
  email: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertEmail"} />,
    },
    {
      type: "email",
      message: <IntlMessage id={"auth.MessageInsertValidEmail"} />,
    },
  ],
  password: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertPassword"} />,
    },
    {
      required: true,
      pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\\/;':"-]).{8,}$/,
      message: <IntlMessage id={"auth.PasswordValidation"} />,
    },
  ],
  confirm: [
    {
      required: true,
      message: <IntlMessage id={"auth.MessageInsertConfirmPassword"} />,
    },
    ({ getFieldValue }: any) => ({
      validator(rule: any, value: any) {
        if (!value || getFieldValue("password") === value) {
          return Promise.resolve();
        }
        return Promise.reject(
          <IntlMessage id={"auth.MessagePasswordsMatch"} />
        );
      },
    }),
  ],
} as { [key: string]: any };

interface IRegisterFormProps extends ITheme, RouteComponentProps, IAuth {
  showLoading: () => void;
  hideAuthMessage: () => void;
  hideLoading: () => void;
}
export const RegisterForm = (props: IRegisterFormProps) => {
  const {
    showLoading,
    loading,
    showMessage,
    hideAuthMessage,
    hideLoading,
    locale,
    history,
  } = props;
  const [form] = Form.useForm();

  const [isCapsLock, setIsCapsLock] = useState<boolean>(false);
  const [isVATPayer, setIsVATPayer] = useState<boolean>(false);

  const onSignUp = () => {
    form
      .validateFields()
      .then((values) => {
        // Do something
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  useEffect(() => {
    if (showMessage) {
      setTimeout(() => {
        hideAuthMessage();
      }, 3000);
    }
  }, [showMessage]);

  const { Option } = Select;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, marginBottom: 0 }}
        animate={{
          opacity: showMessage ? 1 : 0,
          marginBottom: showMessage ? 20 : 0,
        }}
      >
        <Alert type="error" showIcon message={props.message} />
      </motion.div>
      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onSignUp}
      >
        <Form.Item
          name="email"
          label={<IntlMessage id={"auth.Email"} />}
          rules={rules.email}
          hasFeedback
        >
          <Input prefix={<MailOutlined className={"text-primary"} />} />
        </Form.Item>
        <Form.Item
          name="password"
          label={<IntlMessage id={"auth.Password"} />}
          rules={rules.password}
          hasFeedback
        >
          <Input.Password
            {...{
              mode: "multiple",
              prefix: [
                <LockOutlined className={"text-primary"} />,
                isCapsLock && (
                  <Tooltip title={"CapsLock is on"}>
                    <WarningOutlined className={"text-danger ml-1"} />
                  </Tooltip>
                ),
              ],
              type: "password",
            }}
          />
        </Form.Item>
        <Form.Item
          name="confirm"
          label={<IntlMessage id={"auth.ConfirmPassword"} />}
          rules={rules.confirm}
          hasFeedback
        >
          <Input
            {...{
              prefix: [
                <LockOutlined className={"text-primary"} />,
                isCapsLock && (
                  <Tooltip title={"CapsLock is on"}>
                    <WarningOutlined className={"text-danger ml-1"} />
                  </Tooltip>
                ),
              ],
              type: "password",
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {" "}
            {<IntlMessage id={"auth.SignUp"} />}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const mapStateToProps = ({ auth, theme }: IState) => {
  const { loading, message, showMessage } = auth as IAuth;
  const { locale } = theme as ITheme;
  return { loading, message, showMessage, locale };
};

const mapDispatchToProps = {
  showAuthMessage,
  hideAuthMessage,
  showLoading,
  hideLoading,
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
