import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  ICreateTemplateDto,
  IPagination,
  IRequestService,
  ITemplate,
  ITemplateService,
  IUser,
} from "@think/domains";

@injectable()
export class TemplateService implements ITemplateService {
  @inject(IRequestService)
  private requestService: IRequestService;

  /**
   * 新建模板
   */
  createLoading = false;
  createError = null;

  /**
   * 更新模板
   */
  updateLoading = false;
  updateError = null;

  /**
   * 删除模板
   */
  deleteLoading = false;
  deleteError = null;

  /**
   * 获取模板详情
   */
  getTemplateDetailLoading = false;
  getTemplateDetailError = null;

  /**
   * 获取公开模板
   */
  pubicTemplates = { data: [], total: 0 };
  getPublicTemplatesLoading = false;
  getPublicTemplatesError = null;

  /**
   * 获取私有模板
   */
  privateTemplates = { data: [], total: 0 };
  getPrivateTemplatesLoading = false;
  getPrivateTemplatesError = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * 新建模板
   * @param data
   * @returns
   */
  async createTemplate(data: ICreateTemplateDto) {
    this.createLoading = true;
    this.createError = null;

    try {
      const res = await this.requestService.post<ITemplate>(
        `/template/add`,
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
   * 更新模板
   * @param id
   * @param data
   * @returns
   */
  async updateTemplate(id: string, data: ICreateTemplateDto) {
    this.updateLoading = true;
    this.updateError = null;

    try {
      const res = await this.requestService.post<ITemplate>(
        `/template/update`,
        {
          id,
          ...data,
        }
      );
      return res;
    } catch (e) {
      this.updateError = e;
    } finally {
      this.updateLoading = false;
    }
  }

  /**
   * 删除模板
   * @param id
   * @param data
   */
  async deleteTemplate(id: string) {
    this.deleteLoading = true;
    this.deleteError = null;

    try {
      await this.requestService.post(`/template/delete/${id}`);
    } catch (e) {
      this.deleteError = e;
    } finally {
      this.deleteLoading = false;
    }
  }

  /**
   * 获取模板详情
   * @param id
   * @returns
   */
  async getTemplateDetail(id: string): Promise<ITemplate> {
    this.getTemplateDetailLoading = true;
    this.getTemplateDetailError = null;

    try {
      const res = await this.requestService.get<ITemplate>(
        `/template/detail/${id}`
      );
      return res;
    } catch (e) {
      this.getTemplateDetailError = e;
    } finally {
      this.getTemplateDetailLoading = false;
    }
  }

  /**
   * 获取私有模板
   * @param pagination
   * @returns
   */
  async getPrivateTemplates(pagination: IPagination) {
    this.getPrivateTemplatesLoading = true;
    this.getPrivateTemplatesError = null;

    try {
      const res = await this.requestService.post<{
        data: ITemplate[];
        total: number;
      }>(`/message/read`, pagination);
      this.privateTemplates = res;
      return res;
    } catch (e) {
      this.getPrivateTemplatesError = e;
    } finally {
      this.getPrivateTemplatesLoading = false;
    }
  }

  /**
   * 获取公开模板
   * @param pagination
   * @returns
   */
  async getPublicTemplates(pagination: IPagination) {
    this.getPublicTemplatesLoading = true;
    this.getPublicTemplatesError = null;

    try {
      const res = await this.requestService.post<{
        data: ITemplate[];
        total: number;
      }>(`/message/read`, pagination);
      this.pubicTemplates = res;
      return res;
    } catch (e) {
      this.getPublicTemplatesError = e;
    } finally {
      this.getPublicTemplatesLoading = false;
    }
  }
}
