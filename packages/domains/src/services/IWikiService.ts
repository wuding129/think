import {
  IUser,
  IWiki,
  IWikiUser,
  WikiUserRole,
  WikiStatus,
  IDocument,
  IPagination,
} from "../models";

export type ICreateWikiDto = {
  /**
   * 知识库名称
   */
  name: string;

  /**
   * 知识库描述
   */
  description: string;

  /**
   * 知识库封面 URL
   */
  cover: string;
};

export type IUpdateWikiDto = Partial<ICreateWikiDto>;

export type IWikiUserDto = {
  /**
   * 用户名
   */
  userName: string;

  /**
   * 用户角色
   */
  userRole: WikiUserRole;
};

export type IShareWikiDto = {
  /**
   * 文档状态
   */
  nextStatus: WikiStatus;

  /**
   * 要公开的文档 ids
   */
  publicDocumentIds?: IDocument["id"][];

  /**
   * 要私有的文档 ids
   */
  privateDocumentIds?: IDocument["id"][];
};

export type IWikiTocRelation = {
  /**
   * 文档 id
   */
  id: IDocument["id"];

  /**
   * 文档的父文档 id
   */
  parentDocumentId: IDocument["id"] | null;
};

export abstract class IWikiService {
  /**
   * 新建知识库
   */
  createLoading = false;
  createError = null;

  /**
   * 用户所有的知识库
   */
  allWikis = [];
  allWikisTotal = 0;
  getAllWikisLoading = false;
  getAllWikisError = null;

  /**
   * 用户参与的知识库
   */
  joinWikis = [];
  joinWikisTotal = 0;
  getJoinWikisLoading = false;
  getJoinWikisError = null;

  /**
   * 用户创建的知识库
   */
  ownWikis = [];
  ownWikisTotal = 0;
  getOwnWikisLoading = false;
  getOwnWikisError = null;

  /**
   * 获取知识库详情
   */
  wikisDetail = new Map();
  getWikiLoading = false;
  getWikiError = null;

  /**
   * 更新知识库
   */
  updateWikiLoading = false;
  updateWikiError = null;

  /**
   * 删除知识库
   */
  deleteWikiLoading = false;
  deleteWikiError = null;

  /**
   * 获取知识库首页文档
   */
  wikisHomeDocument = new Map();
  getWikisHomeDocumentLoading = false;
  getWikisHomeDocumentError = null;

  /**
   * 获取知识库成员
   */
  wikiUsers = new Map();
  getWikiUsersLoading = false;
  getWikiUsersError = null;

  /**
   * 添加知识库成员
   */
  addWikiUserLoading = false;
  addWikiUserError = null;

  /**
   * 更新知识库成员
   */
  updateWikiUserLoading = false;
  updateWikiUserError = null;

  /**
   * 删除知识库成员
   */
  deleteWikiUserLoading = false;
  deleteWikiUserError = null;

  /**
   * 获取知识库文档列表
   */
  wikisDocuments = new Map();
  getWikisDocumentsLoading = false;
  getWikisDocumentsError = null;

  /**
   * 获取知识库文档目录
   */
  wikisTocs = new Map();
  getWikisTocsLoading = false;
  getWikisTocsError = null;
  updateWikisTocsLoading = false;
  updateWikisTocsError = null;

  /**
   *  公开（或私有）知识库
   */
  shareWikiLoading = false;
  shareWikiError = null;

  /**
   * 获取公开知识库首页文档
   */
  publicWikisHomeDocuments = new Map();
  getPublictWikisHomeDocumentLoading = false;
  getPublicWikisHomeDocumentError = null;

  /**
   * 获取公开知识库文档目录
   */
  publicWikisTocs = new Map();
  getPublicWikisTocsLoading = false;
  getPublicWikisTocsError = null;

  /**
   * 获取公开知识库详情
   */
  publicWikisDetail = new Map();
  getPublicWikiLoading = false;
  getPublicWikiError = null;

  /**
   * 为当前用户创建知识库
   * @param data
   * @param user 当前用户
   */
  abstract createWiki(data: ICreateWikiDto, user?: IUser): Promise<IWiki>;

  /**
   * 获取当前用户所有知识库（包含用户创建的、用户参与的）
   * @param pagination 分页信息
   * @param user 当前用户
   */
  abstract getUserAllWikis(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: IWiki[]; total: number }>;

  /**
   * 获取用户创建的知识库
   * @param pagination 分页信息
   * @param user 当前用户
   */
  abstract getUserOwnWikis(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: IWiki[]; total: number }>;

  /**
   * 获取用户参与的知识库
   * @param pagination 分页信息
   * @param user 当前用户
   */
  abstract getUserJoinWikis(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: IWiki[]; total: number }>;

  /**
   * 获取知识库详情
   * @param wikiId
   * @param user
   */
  abstract getWikiDetail(wikiId: IWiki["id"], user?: IUser): Promise<IWiki>;

  /**
   * 更新知识库信息
   * @param wikiId
   * @param data
   * @param user
   */
  abstract updateWiki(
    wikiId: IWiki["id"],
    data: IUpdateWikiDto,
    user?: IUser
  ): Promise<IWiki>;

  /**
   * 删除知识库
   * 只允许创建者删除（非创建者知识库管理员不可删除）
   * @param wikiId
   * @param user
   */
  abstract deleteWiki(wikiId: IWiki["id"], user?: IUser): Promise<void>;

  /**
   * 获取知识库首页文档
   * 知识库首页文档应由服务端自动创建，且不可删除
   * 当删除知识库时，该文档应关联删除
   * @param wikiId
   * @param user
   */
  abstract getWikiHomeDocument(
    wikiId: IWiki["id"],
    user?: IUser
  ): Promise<IDocument>;

  /**
   * 获取知识库成员
   * 仅知识库管理员可查看
   * @param wikiId
   * @param user
   */
  abstract getWikiUsers(
    wikiId: IWiki["id"],
    user?: IUser
  ): Promise<IWikiUser[]>;

  /**
   * 添加知识库成员
   * 仅知识库管理员可操作
   * @param wikiId
   * @param data
   * @param user
   */
  abstract addWikiUser(
    wikiId: IWiki["id"],
    data: IWikiUserDto,
    user?: IUser
  ): Promise<IWikiUser>;

  /**
   * 更新知识库成员
   * 仅知识库管理员可操作
   * @param wikiId
   * @param data
   * @param user
   */
  abstract updateWikiUser(
    wikiId: IWiki["id"],
    data: IWikiUserDto,
    user?: IUser
  ): Promise<IWikiUser>;

  /**
   * 删除知识库成员
   * 仅知识库管理员可操作
   * @param wikiId
   * @param data
   * @param user
   */
  abstract deleteWikiUser(
    wikiId: IWiki["id"],
    data: IWikiUserDto,
    user?: IUser
  ): Promise<void>;

  /**
   * 获取知识库文档
   * @param wikiId
   * @param user
   */
  abstract getWikiDocuments(
    wikiId: IWiki["id"],
    user?: IUser
  ): Promise<IDocument[]>;

  /**
   * 获取知识库文档目录
   * @param wikiId
   * @param user
   */
  abstract getWikiTocs(wikiId: IWiki["id"], user?: IUser): Promise<IDocument[]>;

  /**
   * 更新知识库文档目录结构
   * @param wikiId
   * @param relations
   * @param user
   */
  abstract updateWikiTocs(
    wikiId: IWiki["id"],
    relations: IWikiTocRelation[],
    user?: IUser
  ): Promise<IDocument[]>;

  /**
   * 公开（或私有）知识库
   * @param wikiId
   * @param data
   * @param user
   */
  abstract shareWiki(
    wikiId: IWiki["id"],
    data: IShareWikiDto,
    user?: IUser
  ): Promise<IWiki>;

  /**
   * 获取公开知识库首页文档
   * 知识库首页文档应由服务端自动创建，且不可删除
   * 当删除知识库时，该文档应关联删除
   * @param wikiId
   */
  abstract getPublicWikiHomeDocument(wikiId: IWiki["id"]): Promise<IDocument>;

  /**
   * 获取公开知识库文档目录
   * @param wikiId
   */
  abstract getPublicWikiTocs(wikiId: IWiki["id"]): Promise<IDocument[]>;

  /**
   * 获取公开知识库详情
   * @param wikiId
   */
  abstract getPublicWikiDetail(wikiId: IWiki["id"]): Promise<IWiki>;
}
