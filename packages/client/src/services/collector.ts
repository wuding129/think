import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  IRequestService,
  ICollectorService,
  ICollectDto,
  IDocument,
  IWiki,
} from "@think/domains";

@injectable()
export class CollectorService implements ICollectorService {
  @inject(IRequestService)
  private requestService: IRequestService;

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

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 收藏（或取消收藏）
   * @param data
   * @returns
   */
  async toggleCollect(data: ICollectDto) {
    this.checkLoading = true;
    this.checkError = null;

    try {
      await this.requestService.post<boolean>(`/collector/toggle`, data);
    } catch (e) {
      this.checkError = e;
    } finally {
      this.checkLoading = false;
    }
  }

  /**
   * 检查目标是否被收藏
   * @param data
   * @returns
   */
  async checkCollect(data: ICollectDto): Promise<boolean> {
    this.checkLoading = true;
    this.checkError = null;

    try {
      const res = await this.requestService.post<boolean>(
        `/collector/check`,
        data
      );
      return res;
    } catch (e) {
      this.checkError = e;
    } finally {
      this.checkLoading = false;
    }
  }

  /**
   * 获取收藏的知识库
   * @returns
   */
  async getCollectWikis() {
    this.getWikisLoading = true;
    this.getWikisError = null;

    try {
      const res = await this.requestService.post<IWiki[]>(`/collector/wikis`);
      this.wikis = res;
      return res;
    } catch (e) {
      this.getWikisError = e;
    } finally {
      this.getWikisLoading = false;
    }
  }

  /**
   * 获取收藏的文档
   * @returns
   */
  async getCollectDocuments() {
    this.getDocumentsLoading = true;
    this.getDocumentsError = null;

    try {
      const res = await this.requestService.post<IDocument[]>(
        `/collector/documents`
      );
      this.documents = res;
      return res;
    } catch (e) {
      this.getDocumentsError = e;
    } finally {
      this.getDocumentsLoading = false;
    }
  }
}
