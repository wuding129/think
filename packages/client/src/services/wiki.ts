import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  IWikiService,
  IRequestService,
  ICreateWikiDto,
  IWiki,
  IDocument,
  IPagination,
  IShareWikiDto,
  IWikiTocRelation,
  IWikiUser,
  IWikiUserDto,
} from "@think/domains";

@injectable()
export class WikiService implements IWikiService {
  @inject(IRequestService)
  private requestService: IRequestService;

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

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 新建知识库
   * @param data
   * @returns
   */
  async createWiki(data: ICreateWikiDto) {
    this.createLoading = true;
    this.createError = null;
    try {
      const res = await this.requestService.post<IWiki>("/wiki/create", data);
      return res;
    } catch (e) {
      this.createError = e;
    } finally {
      this.createLoading = false;
    }
  }

  /**
   * 获取用户所有的知识库
   * @returns
   */
  async getUserAllWikis(pagination: IPagination) {
    this.getAllWikisLoading = true;
    this.getAllWikisError = null;
    try {
      const res = await this.requestService.get<{
        data: IWiki[];
        total: number;
      }>("/wiki/list/all", pagination);
      this.allWikis = res.data;
      this.allWikisTotal = res.total;
      return res;
    } catch (e) {
      this.getAllWikisError = e;
    } finally {
      this.getAllWikisLoading = false;
    }
  }

  /**
   * 获取用户创建的知识库
   * @param pagination
   * @returns
   */
  async getUserOwnWikis(pagination: IPagination) {
    this.getOwnWikisLoading = true;
    this.getOwnWikisError = null;
    try {
      const res = await this.requestService.get<{
        data: IWiki[];
        total: number;
      }>("/wiki/list/own", pagination);
      this.ownWikis = res.data;
      this.ownWikisTotal = res.total;
      return res;
    } catch (e) {
      this.getOwnWikisError = e;
    } finally {
      this.getOwnWikisLoading = false;
    }
  }

  /**
   * 获取用户参与的知识库
   * @param pagination
   * @returns
   */
  async getUserJoinWikis(pagination: IPagination) {
    this.getJoinWikisLoading = true;
    this.getJoinWikisError = null;
    try {
      const res = await this.requestService.get<{
        data: IWiki[];
        total: number;
      }>("/wiki/list/join", pagination);
      this.joinWikis = res.data;
      this.joinWikisTotal = res.total;
      return res;
    } catch (e) {
      this.getJoinWikisError = e;
    } finally {
      this.getJoinWikisLoading = false;
    }
  }

  /**
   * 获取知识库详情
   * @param wikiId
   */
  async getWikiDetail(wikiId: string) {
    this.getWikiLoading = true;
    this.getWikiError = null;
    try {
      const res = await this.requestService.get<IWiki>(
        `/wiki/detail/${wikiId}`
      );
      this.wikisDetail.set(wikiId, res);
      return res;
    } catch (e) {
      this.getWikiError = e;
    } finally {
      this.getWikiLoading = false;
    }
  }

  /**
   * 更新知识库
   * @param wikiId
   * @param data
   * @returns
   */
  async updateWiki(wikiId: string, data: Partial<ICreateWikiDto>) {
    this.updateWikiLoading = true;
    this.updateWikiError = null;
    try {
      const res = await this.requestService.patch<IWiki>(
        `/wiki/update/${wikiId}`,
        data
      );
      return res;
    } catch (e) {
      this.updateWikiError = e;
    } finally {
      this.updateWikiLoading = false;
    }
  }

  /**
   * 删除知识库
   * @param wikiId
   */
  async deleteWiki(wikiId: string) {
    this.deleteWikiLoading = true;
    this.deleteWikiError = null;
    try {
      await this.requestService.delete<IWiki>(`/wiki/delete/${wikiId}`);
    } catch (e) {
      this.deleteWikiError = e;
    } finally {
      this.deleteWikiLoading = false;
    }
  }

  /**
   * 获取知识库首页文档
   * @param wikiId
   * @returns
   */
  async getWikiHomeDocument(wikiId: string) {
    // TODO: 该缓存是否会造成内容更新不及时
    // if (this.wikisHomeDocument.has(wikiId)) {
    //   return this.wikisHomeDocument.get(wikiId);
    // }

    this.getWikisHomeDocumentLoading = true;
    this.getWikisHomeDocumentError = null;

    try {
      const res = await this.requestService.get<IDocument>(
        `/wiki/delete/${wikiId}`
      );
      this.wikisHomeDocument.set(wikiId, res);
      return res;
    } catch (e) {
      this.getWikisHomeDocumentError = e;
    } finally {
      this.getWikisHomeDocumentLoading = false;
    }
  }

  /**
   * 获取知识库成员
   * @param wikiId
   * @returns
   */
  async getWikiUsers(wikiId: string) {
    this.getWikiUsersLoading = true;
    this.getWikiUsersError = null;
    try {
      const res = await this.requestService.get<IWikiUser[]>(
        `/wiki/user/${wikiId}`
      );
      this.wikiUsers.set(wikiId, res);
      return res;
    } catch (e) {
      this.getWikiUsersError = e;
    } finally {
      this.getWikiUsersLoading = false;
    }
  }

  /**
   * 添加知识库成员
   * @param wikiId
   * @param data
   * @returns
   */
  async addWikiUser(wikiId: string, data: IWikiUserDto) {
    this.addWikiUserLoading = true;
    this.addWikiUserError = null;
    try {
      const res = await this.requestService.post<IWikiUser>(
        `/wiki/user/${wikiId}/add`,
        data
      );
      this.getWikiUsers(wikiId);
      return res;
    } catch (e) {
      this.addWikiUserError = e;
    } finally {
      this.addWikiUserLoading = false;
    }
  }

  /**
   * 更新知识库成员
   * @param wikiId
   * @param data
   * @returns
   */
  async updateWikiUser(wikiId: string, data: IWikiUserDto) {
    this.updateWikiUserLoading = true;
    this.updateWikiUserError = null;
    try {
      const res = await this.requestService.post<IWikiUser>(
        `/wiki/user/${wikiId}/update`,
        data
      );
      this.getWikiUsers(wikiId);
      return res;
    } catch (e) {
      this.updateWikiUserError = e;
    } finally {
      this.updateWikiUserLoading = false;
    }
  }

  /**
   * 删除知识库成员
   * @param wikiId
   * @param data
   */
  async deleteWikiUser(wikiId: string, data: IWikiUserDto) {
    this.deleteWikiUserLoading = true;
    this.deleteWikiUserError = null;

    try {
      await this.requestService.delete<IWikiUser>(
        `/wiki/user/${wikiId}/add`,
        data
      );
      this.getWikiUsers(wikiId);
    } catch (e) {
      this.deleteWikiUserError = e;
    } finally {
      this.deleteWikiUserLoading = false;
    }
  }

  /**
   * 获取知识库文档列表
   * @param wikiId
   * @returns
   */
  async getWikiDocuments(wikiId: string) {
    this.getWikisDocumentsLoading = true;
    this.getWikisDocumentsError = null;

    try {
      const res = await this.requestService.get<IDocument[]>(
        `/wiki/docs/${wikiId}`
      );
      this.wikisDocuments.set(wikiId, res);
      return res;
    } catch (e) {
      this.getWikisDocumentsError = e;
    } finally {
      this.getWikisDocumentsLoading = false;
    }
  }

  /**
   * 获取知识库文档目录
   * @param wikiId
   * @returns
   */
  async getWikiTocs(wikiId: string) {
    this.getWikisTocsLoading = true;
    this.getWikisTocsError = null;

    try {
      const res = await this.requestService.get<IDocument[]>(
        `/wiki/tocs/${wikiId}`
      );
      this.wikisTocs.set(wikiId, res);
      return res;
    } catch (e) {
      this.getWikisTocsError = e;
    } finally {
      this.getWikisTocsLoading = false;
    }
  }

  /**
   * 更新知识库目录关系
   * @param wikiId
   * @param relations
   * @returns
   */
  async updateWikiTocs(wikiId: string, relations: IWikiTocRelation[]) {
    this.updateWikisTocsLoading = true;
    this.updateWikisTocsError = null;

    try {
      const res = await this.requestService.post<IDocument[]>(
        `/wiki/tocs/${wikiId}/update`,
        relations
      );
      this.getWikiTocs(wikiId);
      return res;
    } catch (e) {
      this.updateWikisTocsError = e;
    } finally {
      this.updateWikisTocsLoading = false;
    }
  }

  /**
   * 公开（或私有）知识库
   * @param wikiId
   * @param data
   */
  async shareWiki(wikiId: string, data: IShareWikiDto) {
    this.shareWikiLoading = true;
    this.shareWikiError = null;

    try {
      const res = await this.requestService.post<IWiki>(
        `/wiki/share/${wikiId}`,
        data
      );
      return res;
    } catch (e) {
      this.shareWikiError = e;
    } finally {
      this.shareWikiLoading = false;
    }
  }

  /**
   * 获取公开知识库首页文档
   * @param wikiId
   * @returns
   */
  async getPublicWikiHomeDocument(wikiId: string): Promise<IDocument> {
    this.getPublictWikisHomeDocumentLoading = true;
    this.getPublicWikisHomeDocumentError = null;

    try {
      const res = await this.requestService.get<IDocument>(
        `/wiki/public/homedoc/${wikiId}`
      );
      this.publicWikisHomeDocuments.set(wikiId, res);
      return res;
    } catch (e) {
      this.getPublicWikisHomeDocumentError = e;
    } finally {
      this.getPublictWikisHomeDocumentLoading = false;
    }
  }

  /**
   * 获取公开知识库文档目录
   * @param wikiId
   * @returns
   */
  async getPublicWikiTocs(wikiId: string) {
    this.getPublicWikisTocsLoading = true;
    this.getPublicWikisTocsError = null;
    try {
      const res = await this.requestService.get<IDocument[]>(
        `/wiki/public/tocs/${wikiId}`
      );
      this.publicWikisTocs.set(wikiId, res);
      return res;
    } catch (e) {
      this.getPublicWikisTocsError = e;
    } finally {
      this.getPublicWikisTocsLoading = false;
    }
  }

  /**
   * 获取公开知识库详情
   * @param wikiId
   * @returns
   */
  async getPublicWikiDetail(wikiId: string) {
    this.getPublicWikiLoading = true;
    this.getPublicWikiError = null;

    try {
      const res = await this.requestService.get<IWiki>(
        `/wiki/public/detail/${wikiId}`
      );
      this.publicWikisDetail.set(wikiId, res);
      return res;
    } catch (e) {
      this.getPublicWikiError = e;
    } finally {
      this.getPublicWikiLoading = false;
    }
  }
}
