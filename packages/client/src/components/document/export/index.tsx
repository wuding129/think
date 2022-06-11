import { Button, Dropdown, Modal, Space, Typography } from '@douyinfe/semi-ui';
import { IDocument } from '@think/domains';
import { IconJSON, IconMarkdown, IconWord } from 'components/icons';
import download from 'downloadjs';
import { safeJSONParse, safeJSONStringify } from 'helpers/json';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useMemo } from 'react';
import { useEditor } from 'tiptap/core';
import { prosemirrorToDocx } from 'tiptap/docx';
import { CollaborationKit } from 'tiptap/editor';
import { prosemirrorToMarkdown } from 'tiptap/markdown/prosemirror-to-markdown';

import styles from './index.module.scss';

const { Text, Title } = Typography;

interface IProps {
  document: IDocument;
  render?: (arg: { toggleVisible: (arg: boolean) => void }) => React.ReactNode;
}

export const DocumentExporter: React.FC<IProps> = ({ document, render }) => {
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);

  const json = useMemo(() => {
    const c = safeJSONParse(document && document.content);
    const json = c.default || c;
    return json;
  }, [document]);
  const editor = useEditor(
    {
      editable: false,
      extensions: CollaborationKit,
      content: json,
    },
    [json]
  );

  const exportMarkdown = useCallback(() => {
    const md = prosemirrorToMarkdown({ content: editor.state.doc.slice(0).content });
    download(md, `${document.title}.md`, 'text/plain');
  }, [document, editor]);

  const exportJSON = useCallback(() => {
    download(safeJSONStringify(editor.getJSON()), `${document.title}.json`, 'text/plain');
  }, [document, editor]);

  const exportWord = useCallback(() => {
    prosemirrorToDocx(editor.view, editor.state).then((buffer) => {
      download(buffer, `${document.title}.docx`);
    });
  }, [document, editor]);

  const content = useMemo(
    () => (
      <div
        style={{
          maxWidth: '96vw',
          overflow: 'auto',
          padding: '16px 0',
        }}
      >
        <Space>
          <div className={styles.templateItem} onClick={exportMarkdown}>
            <header>
              <IconMarkdown style={{ fontSize: 40 }} />
            </header>
            <main>
              <Text>Markdown</Text>
            </main>
            <footer>
              <Text type="tertiary">.md</Text>
            </footer>
          </div>

          <div className={styles.templateItem} onClick={exportJSON}>
            <header>
              <IconJSON style={{ fontSize: 40 }} />
            </header>
            <main>
              <Text>JSON</Text>
            </main>
            <footer>
              <Text type="tertiary">.json</Text>
            </footer>
          </div>

          <div className={styles.templateItem} onClick={exportWord}>
            <header>
              <IconWord style={{ fontSize: 40 }} />
            </header>
            <main>
              <Text>Word</Text>
            </main>
            <footer>
              <Text type="tertiary">.docx</Text>
            </footer>
          </div>
        </Space>
      </div>
    ),
    [exportMarkdown, exportJSON, exportWord]
  );

  const btn = useMemo(
    () =>
      render ? (
        render({ toggleVisible })
      ) : (
        <Button type="primary" theme="light" onClick={toggleVisible}>
          导出
        </Button>
      ),
    [render, toggleVisible]
  );

  return (
    <>
      {isMobile ? (
        <>
          <Modal
            centered
            title="文档导出"
            visible={visible}
            footer={null}
            onCancel={toggleVisible}
            style={{ maxWidth: '96vw' }}
          >
            {content}
          </Modal>
          {btn}
        </>
      ) : (
        <Dropdown
          visible={visible}
          onVisibleChange={toggleVisible}
          trigger="click"
          position="bottomRight"
          content={<div style={{ padding: '0 16px' }}>{content}</div>}
        >
          {btn}
        </Dropdown>
      )}
    </>
  );
};
