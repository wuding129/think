import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { observer } from "mobx-react";
import { useService } from "@hooks/useService";
import { ICreateWikiDto, IWikiService } from "@think/domains";
import Router from "next/router";
import { Form, Modal, Banner } from "@douyinfe/semi-ui";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";

interface IProps {
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
}

export const WikiCreator: React.FC<IProps> = observer(
  ({ visible, toggleVisible }) => {
    const $form = useRef<FormApi>();
    const wikiService = useService<IWikiService>(IWikiService);
    const { createLoading, createError } = wikiService;

    const handleOk = useCallback(() => {
      $form.current.validate().then((values) => {
        wikiService.createWiki(values as ICreateWikiDto).then((res) => {
          toggleVisible(false);
          Router.push({
            pathname: `/wiki/${res.id}`,
          });
        });
      });
    }, []);

    const handleCancel = useCallback(() => {
      toggleVisible(false);
    }, []);

    return (
      <Modal
        title="创建知识库"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        style={{ maxWidth: "96vw" }}
        okButtonProps={{ loading: createLoading }}
      >
        {createError && (
          <Banner type="danger" description={createError.message} />
        )}
        <Form
          initValues={{ name: "", description: "" }}
          getFormApi={(formApi) => ($form.current = formApi)}
        >
          <Form.Input
            noLabel
            autofocus
            field="name"
            style={{ width: "100%" }}
            placeholder="请输入知识库名称"
            maxLength={20}
            rules={[{ required: true, message: "请输入知识库名称" }]}
          ></Form.Input>
          <Form.TextArea
            noLabel
            field="description"
            style={{ width: "100%" }}
            placeholder="请输入知识库简介"
            autosize
            rules={[{ message: "请输入知识库简介" }]}
          ></Form.TextArea>
        </Form>
      </Modal>
    );
  }
);
