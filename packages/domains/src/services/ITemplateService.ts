import { IUser, ITemplate, IPagination } from "../models";

export type ICreateTemplateDto = {
  /**
   * 模板标题
   */
  title: string;

  /**
   * 模板 json 格式内容
   */
  content?: string;

  /**
   * 对应内容的 yjs uni8array 数据
   */
  state?: Uint8Array;

  /**
   * 是否为公开模板
   */
  isPublic?: boolean;
};

export abstract class ITemplateService {
  /**
   * 新建模板
   * @param data
   * @param user
   */
  abstract createTemplate(
    data: ICreateTemplateDto,
    user?: IUser
  ): Promise<ITemplate>;

  /**
   * 更新模板
   * @param id
   * @param data
   */
  abstract updateTemplate(
    id: ITemplate["id"],
    data: ICreateTemplateDto
  ): Promise<ITemplate>;

  /**
   * 删除模板
   * @param id
   * @param data
   */
  abstract deleteTemplate(
    id: ITemplate["id"],
    data: ICreateTemplateDto
  ): Promise<void>;

  /**
   * 获取模板详情
   * @param id
   */
  abstract getTemplateDetail(id: ITemplate["id"]): Promise<ITemplate>;

  /**
   * 获取私有模板
   * @param pagination
   * @param user
   */
  abstract getPrivateTemplates(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: ITemplate[]; total: number }>;

  /**
   * 获取公开模板
   * @param pagination
   */
  abstract getPublicTemplates(
    pagination: IPagination
  ): Promise<{ data: ITemplate[]; total: number }>;
}
