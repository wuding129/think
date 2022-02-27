import { IUser, IWiki, ITemplate, IDocument, IAuthority } from "../models";

export type ICreateDocumentDto = {
  /**
   * 所属知识库 id
   */
  wikiId: IWiki["id"];

  /**
   * 父文档 id
   */
  parentDocumentId?: IDocument["id"] | null;

  /**
   * 文档标题
   */
  title?: string;

  /**
   * 模板 id
   */
  templateId?: ITemplate["id"];
};

export type IUpdateDocumentDto = {
  /**
   * json 格式内容
   */
  content: string;

  /**
   * 对应内容的 yjs uni8array 数据
   */
  state: Uint8Array;
} & Pick<ICreateDocumentDto, "title">;

export type IShareDocumentDto = {
  // 文档的访问密码
  sharePassword?: string;
};

export type IDocumentAuthorityDto = {
  /**
   * 文档 id
   */
  documentId: IDocument["id"];

  /**
   * 用户名
   */
  userName: IUser["name"];

  /**
   * 可读权限
   */
  readable: boolean;

  /**
   * 可写权限
   */
  editable: boolean;
};

export abstract class IDocumentService {
  /**
   * 新建文档
   */
  createLoading = false;
  createError = null;

  /**
   * 文档详情
   */
  documentsDetail = new Map();
  getDocumentDetailLoading = false;
  getDocumentDetailError = null;

  /**
   * 更新文档
   */
  updateDocumentLoading = false;
  updateDocumentError = null;

  /**
   * 删除文档
   */
  deleteDocumentLoading = false;
  deleteDocumentError = null;

  /**
   * 文档子文档
   */
  documentsChildren = new Map();
  getDocumentChildrenLoading = false;
  getDocumentChildrenError = null;

  /**
   *  公开文档的子文档
   */
  publicDocumentsChildren = new Map();
  getPublicDocumentChildrenLoading = false;
  getPublicDocumentChildrenError = null;

  /**
   * 公开（或私有）文档
   */
  shareLoading = false;
  shareError = null;

  /**
   * 文档成员
   */
  documentsUsers = new Map();
  getDocumentUsersLoading = false;
  getDocumentUsersError = null;

  /**
   * 添加文档成员
   */
  addDocumentUserLoading = false;
  addDocumentUserError = null;

  /**
   * 更新文档成员
   */
  updateDocumentUserLoading = false;
  updateDocumentUserError = null;

  /**
   * 删除文档成员
   */
  deleteDocumentUserLoading = false;
  deleteDocumentUserError = null;

  /**
   * 最近浏览过的文档
   */
  recentlyViewedDocuments = [];
  getRecentlyViewedDocumentsLoading = false;
  getRecentlyViewedDocumentsError = null;

  /**
   * 公开文档详情
   */
  publicDocumentsDetail = new Map();
  getPublicDocumentDetailLoading = false;
  getPublicDocumentDetailError = null;

  /**
   * 新建文档
   * @param data
   * @param user
   */
  abstract createDocument(
    data: ICreateDocumentDto,
    user?: IUser
  ): Promise<IDocument>;

  /**
   * 获取文档详情
   * @param id
   * @param user
   */
  abstract getDocumentDetail(
    id: IDocument["id"],
    user: IUser
  ): Promise<IDocument>;

  /**
   * 更新文档
   * @param id
   * @param data
   * @param user
   */
  abstract updateDocument(
    id: IDocument["id"],
    data: IUpdateDocumentDto,
    user?: IUser
  ): Promise<IDocument>;

  /**
   * 删除文档
   * @param id
   * @param user
   */
  abstract deleteDocument(id: IDocument["id"], user?: IUser): Promise<void>;

  /**
   * 获取文档的子文档
   * @param wikiId
   * @param documentId
   * @param user
   */
  abstract getDocumentChidren(
    wikiId: IWiki["id"],
    documentId: IDocument["id"],
    user?: IUser
  ): Promise<IDocument[]>;

  /**
   * 公开（或私有）文档
   * @param id
   * @param data
   * @param user
   */
  abstract shareDocument(
    id: IDocument["id"],
    data: IShareDocumentDto,
    user?: IUser
  ): Promise<IDocument>;

  /**
   * 获取文档成员
   * @param id
   * @param user
   */
  abstract getDocumentUsers(
    id: IDocument["id"],
    user?: IUser
  ): Promise<Array<{ user: IUser; authority: IAuthority }>>;

  /**
   * 添加文档成员
   * @param data
   * @param user
   */
  abstract addDocumentUser(
    data: IDocumentAuthorityDto,
    user?: IUser
  ): Promise<IAuthority>;

  /**
   * 更新文档成员权限
   * @param data
   * @param user
   */
  abstract updateDocumentUser(
    data: IDocumentAuthorityDto,
    user?: IUser
  ): Promise<IAuthority>;

  /**
   * 删除文档成员
   * @param data
   * @param user
   */
  abstract deleteDocumentUser(
    data: IDocumentAuthorityDto,
    user?: IUser
  ): Promise<void>;

  /**
   * 获取用户最近浏览的文档
   * @param user
   */
  abstract getRecentlyViewedDocuments(user?: IUser): Promise<IDocument[]>;

  /**
   * 获取公开文档详情
   * @param id
   * @param data
   * @param userAgent
   */
  abstract getPublicDocumentDetail(
    id: IDocument["id"],
    data?: IShareDocumentDto,
    userAgent?: string
  );

  /**
   * 获取公开文档的子文档
   * @param wikiId
   * @param documentId
   */
  abstract getPublicDocumentChildren(
    wikiId: IWiki["id"],
    documentId: IDocument["id"]
  ): Promise<IDocument[]>;
}
