import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  IRequestService,
  IMessageService,
  IMessage,
  IPagination,
} from "@think/domains";

@injectable()
export class MessageService implements IMessageService {
  @inject(IRequestService)
  private requestService: IRequestService;

  /**
   * 所有消息
   */
  allMessages = { data: [], total: 0 };
  getAllMessagesLoading = false;
  getAllMessagesError = null;

  /**
   * 已读消息
   */
  readMessages = { data: [], total: 0 };
  getReadMessagesLoading = false;
  getReadMessagesError = null;

  /**
   * 未读消息
   */
  unreadMessages = { data: [], total: 0 };
  getUnreadMessagesLoading = false;
  getUnreadMessagesError = null;

  /**
   * 将消息已读
   */
  setMessageReadLoading = false;
  setMessageReadError = null;

  constructor() {
    makeAutoObservable(this);
  }

  async getUnreadMessage(pagination: IPagination) {
    this.getUnreadMessagesLoading = true;
    this.getUnreadMessagesError = null;

    try {
      const res = await this.requestService.post<{
        data: IMessage[];
        total: number;
      }>(`/message/unread`, pagination);
      this.unreadMessages = res;
      return res;
    } catch (e) {
      this.getUnreadMessagesError = e;
    } finally {
      this.getUnreadMessagesLoading = false;
    }
  }

  async getReadMessage(pagination: IPagination) {
    this.getReadMessagesLoading = true;
    this.getReadMessagesError = null;

    try {
      const res = await this.requestService.post<{
        data: IMessage[];
        total: number;
      }>(`/message/read`, pagination);
      this.readMessages = res;
      return res;
    } catch (e) {
      this.getReadMessagesError = e;
    } finally {
      this.getReadMessagesLoading = false;
    }
  }

  async getAllMessage(pagination: IPagination) {
    this.getAllMessagesLoading = true;
    this.getAllMessagesError = null;

    try {
      const res = await this.requestService.post<{
        data: IMessage[];
        total: number;
      }>(`/message/all`, pagination);
      this.allMessages = res;
      return res;
    } catch (e) {
      this.getAllMessagesError = e;
    } finally {
      this.getAllMessagesLoading = false;
    }
  }

  /**
   * 将消息设置为已读
   * @param id
   */
  async readMessage(id) {
    this.getAllMessagesLoading = true;
    this.getAllMessagesError = null;

    try {
      await this.requestService.post(`/message/read/${id}`);
    } catch (e) {
      this.getAllMessagesError = e;
    } finally {
      this.getAllMessagesLoading = false;
    }
  }
}
