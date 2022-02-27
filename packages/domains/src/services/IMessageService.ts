import { IUser, IMessage, IPagination } from "../models";

export abstract class IMessageService {
  /**
   * 获取未读消息
   * @param pagination
   * @param user
   */
  abstract getUnreadMessage(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: IMessage[]; total: number }>;

  /**
   * 获取已读消息
   * @param pagination
   * @param user
   */
  abstract getReadMessage(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: IMessage[]; total: number }>;

  /**
   * 获取所有消息
   * @param pagination
   * @param user
   */
  abstract getAllMessage(
    pagination: IPagination,
    user?: IUser
  ): Promise<{ data: IMessage[]; total: number }>;

  /**
   * 将消息置为已读
   * @param id
   * @param user
   */
  abstract readMessage(id: IMessage["id"], user?: IUser): Promise<void>;
}
