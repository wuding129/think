import React from "react";
import { Spin, Typography } from "@douyinfe/semi-ui";

type RenderProps = React.ReactNode | (() => React.ReactNode);

interface IProps {
  loading: boolean;
  error: Error | null;
  empty?: boolean;
  loadingContent?: RenderProps;
  errorContent?: RenderProps;
  normalContent: RenderProps;
  emptyContent?: RenderProps;
}

const { Text } = Typography;

const defaultLoading = () => {
  return <Spin />;
};

const defaultRenderError = (error) => {
  return <Text>{(error && error.message) || "未知错误"}</Text>;
};

const runRender = (fn, ...args) =>
  typeof fn === "function" ? fn.apply(null, args) : fn;

export const DataRender: React.FC<IProps> = ({
  loading,
  error,
  loadingContent = defaultLoading,
  errorContent = defaultRenderError,
  normalContent,
  empty,
  emptyContent,
}) => {
  if (loading) {
    return runRender(loadingContent);
  }

  if (error) {
    return runRender(errorContent, error);
  }

  if (empty) {
    return runRender(emptyContent);
  }

  return runRender(normalContent);
};
