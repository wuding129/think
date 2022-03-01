import { IUser, IWiki, IDocument, CollectType, IPagination } from "../models";

export type ICollectDto = {
  /**
   * 收藏目标 id
   */
  targetId: IWiki["id"] | IDocument["id"];

  /**
   * 收藏类型
   */
  type: CollectType;
};

export abstract class ICollectorService {
  /**
   * 知识库
   */
  wikis = [];
  getWikisLoading = false;
  getWikisError = null;

  /**
   * 文档
   */
  documents = [];
  getDocumentsLoading = false;
  getDocumentsError = null;

  /**
   * 收藏（或取消收藏）
   */
  toggleLoading = false;
  toggleError = null;

  /**
   * 检查是否收藏
   */
  checkLoading = false;
  checkError = null;

  /**
   * 收藏（或取消收藏）
   * @param data
   * @param user
   */
  abstract toggleCollect(data: ICollectDto, user?: IUser): Promise<void>;

  /**
   * 检查目标是否被收藏
   * @param data
   */
  abstract checkCollect(data: ICollectDto): Promise<boolean>;

  /**
   * 获取收藏的知识库
   * @param user
   */
  abstract getCollectWikis(user?: IUser): Promise<IWiki[]>;

  /**
   * 获取收藏的文档
   * @param user
   */
  abstract getCollectDocuments(user?: IUser): Promise<IDocument[]>;
}
