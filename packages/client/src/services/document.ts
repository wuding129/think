import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  IRequestService,
  IDocumentService,
  IAuthority,
  ICreateDocumentDto,
  IDocument,
  IDocumentAuthorityDto,
  IShareDocumentDto,
  IUpdateDocumentDto,
  IUser,
} from "@think/domains";

@injectable()
export class DocumentService implements IDocumentService {
  @inject(IRequestService)
  private requestService: IRequestService;

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

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 新建文档
   * @param data
   * @returns
   */
  async createDocument(data: ICreateDocumentDto): Promise<IDocument> {
    this.createLoading = true;
    this.createError = null;

    try {
      const res = await this.requestService.post<IDocument>(
        `/document/create`,
        data
      );
      return res;
    } catch (e) {
      this.createError = e;
    } finally {
      this.createLoading = false;
    }
  }

  /**
   * 获取文档详情
   * @param id
   * @returns
   */
  async getDocumentDetail(id: string): Promise<IDocument> {
    this.getDocumentDetailLoading = true;
    this.getDocumentDetailError = null;

    try {
      const res = await this.requestService.get<IDocument>(
        `/document/detail/${id}`
      );
      this.documentsDetail.set(id, res);
      return res;
    } catch (e) {
      this.getDocumentDetailError = e;
    } finally {
      this.getDocumentDetailLoading = false;
    }
  }

  /**
   * 更新文档
   * @param id
   * @param data
   * @returns
   */
  async updateDocument(id: string, data: IUpdateDocumentDto) {
    this.updateDocumentLoading = true;
    this.updateDocumentError = null;

    try {
      const res = await this.requestService.post<IDocument>(
        `/document/update/${id}`,
        data
      );
      return res;
    } catch (e) {
      this.updateDocumentError = e;
    } finally {
      this.updateDocumentLoading = false;
    }
  }

  /**
   * 删除文档
   * @param id
   */
  async deleteDocument(id: string) {
    this.deleteDocumentLoading = true;
    this.deleteDocumentError = null;

    try {
      await this.requestService.delete(`/document/delete/${id}`);
    } catch (e) {
      this.deleteDocumentError = e;
    } finally {
      this.deleteDocumentLoading = false;
    }
  }

  /**
   * 获取文档子文档
   * @param wikiId
   * @param documentId
   * @returns
   */
  async getDocumentChidren(wikiId: string, documentId: string) {
    this.getDocumentChildrenLoading = true;
    this.getDocumentChildrenError = null;

    try {
      const res = await this.requestService.post<IDocument[]>(
        `/document/children`,
        { wikiId, documentId }
      );
      this.documentsChildren.set(documentId, res);
      return res;
    } catch (e) {
      this.getDocumentChildrenError = e;
    } finally {
      this.getDocumentChildrenLoading = false;
    }
  }

  /**
   * 公开或私有文档
   * @param id
   * @param data
   * @returns
   */
  async shareDocument(id: string, data: IShareDocumentDto) {
    this.shareLoading = true;
    this.shareError = null;

    try {
      const res = await this.requestService.post<IDocument>(
        `/document/share/${id}`,
        data
      );
      return res;
    } catch (e) {
      this.shareError = e;
    } finally {
      this.shareLoading = false;
    }
  }

  /**
   * 获取文档协作成员
   * @param id
   * @returns
   */
  async getDocumentUsers(id: string) {
    this.getDocumentUsersLoading = true;
    this.getDocumentUsersError = null;

    try {
      const res = await this.requestService.get<
        { user: IUser; authority: IAuthority }[]
      >(`/document/user/${id}`);
      this.documentsUsers.set(id, res);
      return res;
    } catch (e) {
      this.getDocumentUsersError = e;
    } finally {
      this.getDocumentUsersLoading = false;
    }
  }

  /**
   * 添加文档成员
   * @param data
   * @returns
   */
  async addDocumentUser(data: IDocumentAuthorityDto): Promise<IAuthority> {
    this.addDocumentUserLoading = true;
    this.addDocumentUserError = null;

    try {
      const res = await this.requestService.post<IAuthority>(
        `/document/user/${data.documentId}/add`,
        data
      );
      this.getDocumentUsers(data.documentId);
      return res;
    } catch (e) {
      this.addDocumentUserError = e;
    } finally {
      this.addDocumentUserLoading = false;
    }
  }

  /**
   * 更新文档成员
   * @param data
   * @returns
   */
  async updateDocumentUser(data: IDocumentAuthorityDto) {
    this.updateDocumentUserLoading = true;
    this.updateDocumentUserError = null;

    try {
      const res = await this.requestService.post<IAuthority>(
        `/document/user/${data.documentId}/update`,
        data
      );
      this.getDocumentUsers(data.documentId);
      return res;
    } catch (e) {
      this.updateDocumentUserError = e;
    } finally {
      this.updateDocumentUserLoading = false;
    }
  }

  /**
   * 删除文档成员
   * @param data
   */
  async deleteDocumentUser(data: IDocumentAuthorityDto) {
    this.deleteDocumentUserLoading = true;
    this.deleteDocumentUserError = null;

    try {
      await this.requestService.delete(
        `/document/user/${data.documentId}/delete`,
        data
      );
      this.getDocumentUsers(data.documentId);
    } catch (e) {
      this.deleteDocumentUserError = e;
    } finally {
      this.deleteDocumentUserLoading = false;
    }
  }

  /**
   * 获取最近浏览的文档
   * @returns
   */
  async getRecentlyViewedDocuments() {
    this.getRecentlyViewedDocumentsLoading = true;
    this.getRecentlyViewedDocumentsError = null;

    try {
      const res = await this.requestService.get<IDocument[]>(
        `/document/recent`
      );
      this.recentlyViewedDocuments = res;
      return res;
    } catch (e) {
      this.getRecentlyViewedDocumentsError = e;
    } finally {
      this.getRecentlyViewedDocumentsLoading = false;
    }
  }

  async getPublicDocumentDetail(id: string, data) {
    this.getPublicDocumentDetailLoading = true;
    this.getPublicDocumentDetailError = null;

    try {
      const res = await this.requestService.post<IDocument>(
        `/document/public/detail/${id}`,
        data
      );
      this.publicDocumentsDetail.set(id, res);
      return res;
    } catch (e) {
      this.getPublicDocumentDetailError = e;
    } finally {
      this.getPublicDocumentDetailLoading = false;
    }
  }

  /**
   * 获取公开文档的子文档
   * @param wikiId
   * @param documentId
   * @returns
   */
  async getPublicDocumentChildren(wikiId: string, documentId: string) {
    this.getPublicDocumentChildrenLoading = true;
    this.getPublicDocumentChildrenError = null;

    try {
      const res = await this.requestService.post<IDocument[]>(
        `/document/public/children`,
        { wikiId, documentId }
      );
      this.publicDocumentsChildren.set(documentId, res);
      return res;
    } catch (e) {
      this.getPublicDocumentChildrenError = e;
    } finally {
      this.getPublicDocumentChildrenLoading = false;
    }
  }
}
