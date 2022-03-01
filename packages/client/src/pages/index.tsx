import type { NextPage } from "next";
import type { IDocument } from "@think/share";
import Link from "next/link";
import React, { useCallback } from "react";
import { Typography, Button, Table, Spin, List } from "@douyinfe/semi-ui";
import { observer } from "mobx-react";
import { useService } from "@hooks/useService";
import { ICollectorService, IDocumentService } from "@think/domains";
import { useToggle } from "hooks/useToggle";
import { useOnMount } from "hooks/useOnMount";
import { Seo } from "components/seo";
import { DataRender } from "components/data-render";
import { SingleColumnLayout } from "layouts/single-column";
import { WikiCreator } from "components/wiki/create";
import { LocaleTime } from "components/locale-time";
import { DocumentActions } from "components/document/actions";
import { WikiPinCardPlaceholder, WikiPinCard } from "components/wiki/pin-card";
import { Empty } from "components/empty";
import styles from "./index.module.scss";

const { Title } = Typography;
const { Column } = Table;

const grid = {
  gutter: 16,
  xs: 24,
  sm: 12,
  md: 12,
  lg: 8,
  xl: 8,
};

const RecentDocs = observer(() => {
  const documentService = useService<IDocumentService>(IDocumentService);
  const {
    recentlyViewedDocuments,
    getRecentlyViewedDocumentsLoading,
    getRecentlyViewedDocumentsError,
  } = documentService;

  const getRecentlyViewedDocuments = useCallback(() => {
    documentService.getRecentlyViewedDocuments();
  }, []);

  useOnMount(getRecentlyViewedDocuments);

  return (
    <>
      <Title heading={3} style={{ margin: "24px 0 0" }}>
        最近访问
      </Title>
      <DataRender
        loading={getRecentlyViewedDocumentsLoading}
        loadingContent={<Spin />}
        error={getRecentlyViewedDocumentsError}
        empty={!recentlyViewedDocuments.length}
        emptyContent={<Empty message="最近访问的文档会出现在此处" />}
        normalContent={() => (
          <Table
            dataSource={recentlyViewedDocuments}
            loading={getRecentlyViewedDocumentsLoading}
            pagination={false}
            size="small"
            style={{ marginTop: 16 }}
          >
            <Column
              title="标题"
              dataIndex="title"
              key="title"
              render={(_, document: IDocument) => {
                return (
                  <Link
                    href={"/wiki/[wikiId]/document/[docId]"}
                    as={`/wiki/${document.wikiId}/document/${document.id}`}
                  >
                    <a style={{ color: "inherit", textDecoration: "none" }}>
                      {document.title}
                    </a>
                  </Link>
                );
              }}
            />
            <Column title="阅读量" dataIndex="views" key="views" />
            <Column
              title="更新时间"
              dataIndex="updatedAt"
              key="updatedAt"
              render={(date) => <LocaleTime date={date} timeago />}
            />
            <Column
              title="操作"
              dataIndex="operate"
              key="operate"
              render={(_, document) => (
                <DocumentActions
                  wikiId={document.wikiId}
                  documentId={document.id}
                  onStar={getRecentlyViewedDocuments}
                  onDelete={getRecentlyViewedDocuments}
                  showCreateDocument
                />
              )}
            />
          </Table>
        )}
      />
    </>
  );
});

const Page: NextPage = observer(() => {
  const [visible, toggleVisible] = useToggle(false);
  const collectService = useService<ICollectorService>(ICollectorService);
  const { wikis, getWikisLoading, getWikisError } = collectService;

  useOnMount(() => {
    collectService.getCollectWikis();
  });

  return (
    <SingleColumnLayout>
      <Seo title="主页" />
      <div className="container">
        <div className={styles.titleWrap}>
          <Title heading={3} style={{ margin: "8px 0" }}>
            快捷访问
          </Title>
          <>
            <Button onClick={toggleVisible} type="tertiary">
              创建知识库
            </Button>
            <WikiCreator visible={visible} toggleVisible={toggleVisible} />
          </>
        </div>
        <DataRender
          loading={getWikisLoading}
          loadingContent={() => (
            <List
              grid={grid}
              dataSource={[1, 2, 3]}
              renderItem={() => (
                <List.Item>
                  <WikiPinCardPlaceholder />
                </List.Item>
              )}
            />
          )}
          error={getWikisError}
          normalContent={() => (
            <List
              grid={grid}
              dataSource={wikis}
              renderItem={(wiki) => (
                <List.Item>
                  <WikiPinCard wiki={wiki} />
                </List.Item>
              )}
              emptyContent={<Empty message="收藏的知识库会出现在此处" />}
            />
          )}
        />
        <RecentDocs />
      </div>
    </SingleColumnLayout>
  );
});

export default Page;
