import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  IRequestService,
  ICommentService,
  IComment,
  ICreateCommentDto,
  IPagination,
  IUpdateCommentDto,
} from "@think/domains";

@injectable()
export class CommentService implements ICommentService {
  @inject(IRequestService)
  private requestService: IRequestService;

  /**
   * 新建评论
   */
  createCommentLoading = false;
  createCommentError = null;

  /**
   * 更新评论
   */
  updateCommentLoading = false;
  updateCommentError = null;

  /**
   * 删除评论
   */
  deleteCommentLoading = false;
  deleteCommentError = null;

  /**
   * 获取评论
   */
  comments = new Map();
  getCommentsLoading = false;
  getCommentsError = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 新建评论
   * @param data
   * @returns
   */
  async createComment(data: ICreateCommentDto) {
    this.createCommentLoading = true;
    this.createCommentError = null;

    try {
      const res = await this.requestService.post<IComment>(
        `/comment/add`,
        data
      );
      return res;
    } catch (e) {
      this.createCommentError = e;
    } finally {
      this.createCommentLoading = false;
    }
  }

  /**
   * 更新评论
   * @param data
   * @returns
   */
  async updateComment(data: IUpdateCommentDto) {
    this.updateCommentLoading = true;
    this.updateCommentError = null;

    try {
      const res = await this.requestService.post<IComment>(
        `/comment/update`,
        data
      );
      return res;
    } catch (e) {
      this.updateCommentError = e;
    } finally {
      this.updateCommentLoading = false;
    }
  }

  /**
   * 删除评论
   * @param id
   */
  async deleteComment(id: string) {
    this.deleteCommentLoading = true;
    this.deleteCommentError = null;

    try {
      await this.requestService.post<IComment>(`/comment/delete/${id}`);
    } catch (e) {
      this.deleteCommentError = e;
    } finally {
      this.deleteCommentLoading = false;
    }
  }

  /**
   * 获取文档评论
   * @param documentId
   * @param pagination
   * @returns
   */
  async getDocumentComments(documentId: string, pagination: IPagination) {
    this.getCommentsLoading = true;
    this.getCommentsError = null;

    try {
      const res = await this.requestService.post<IComment[]>(
        `/comment/document/${documentId}`,
        pagination
      );
      this.comments.set(documentId, res);
      return res;
    } catch (e) {
      this.getCommentsError = e;
    } finally {
      this.getCommentsLoading = false;
    }
  }
}
