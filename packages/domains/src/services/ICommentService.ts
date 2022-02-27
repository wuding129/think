import { IUser, IComment, IDocument, IPagination } from "../models";

export type ICreateCommentDto = {
  /**
   * 父评论 id
   */
  parentCommentId?: IComment["id"];

  /**
   * 评论文档 id
   */
  documentId: IDocument["id"];

  /**
   * html 格式内容
   * @TODO: 是否转为 json 格式
   */
  html: string;

  /**
   * 回复用户 id
   */
  replyUserId?: IUser["id"];
};

export type IUpdateCommentDto = {
  /**
   * 评论 id
   */
  id: IComment["id"];

  html?: string;
};

export abstract class ICommentService {
  /**
   * 创建评论
   * @param data
   * @param user
   * @param userAgent
   */
  abstract createComment(
    data: ICreateCommentDto,
    user?: IUser,
    userAgent?: string
  ): Promise<IComment>;

  /**
   * 更新评论
   * @param data
   * @param user
   */
  abstract updateComment(
    data: IUpdateCommentDto,
    user?: IUser
  ): Promise<IComment>;

  /**
   * 删除评论
   * @param id
   * @param user
   */
  abstract deleteComment(id: IComment["id"], user?: IUser): Promise<void>;

  /**
   * 获取文档评论
   * @param documentId
   * @param pagination
   */
  abstract getDocumentComments(
    documentId: IDocument["id"],
    pagination: IPagination
  ): Promise<IComment[]>;
}
