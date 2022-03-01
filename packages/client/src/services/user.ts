import { inject, injectable } from "inversify";
import { makeAutoObservable } from "mobx";
import {
  ICreateUserDto,
  ILoginUser,
  ILoginUserDto,
  IRequestService,
  IUpdateUserDto,
  IUser,
  IUserService,
} from "@think/domains";
import Router from "next/router";
import {
  isBrowser,
  setStorage,
  getStorage,
  clearStorage,
  safeJSONParse,
  safeJSONStringify,
} from "@helpers/index";

const PERSIST_KEY = "THINK_USER";

@injectable()
export class UserService implements IUserService {
  @inject(IRequestService)
  private requestService: IRequestService;

  user: ILoginUser | null = null;
  token: string | null = null;

  registerLoading = false;
  registerError = null;

  loginLoading = false;
  loginError = null;

  updateLoading = false;
  updateError = null;

  constructor() {
    makeAutoObservable(this);
    this.syncDataInBrowser();
  }

  storetDataInBrowser(): void {
    setStorage(PERSIST_KEY, safeJSONStringify(this.user));
  }

  syncDataInBrowser(): void {
    if (!isBrowser) return;
    const userStr = getStorage(PERSIST_KEY);
    const user = safeJSONParse(userStr, null);
    if (user) {
      this.user = user;
      this.token = user.token;
    }
  }

  async register(createUser: ICreateUserDto) {
    this.registerLoading = true;
    this.registerError = null;
    try {
      const ret = await this.requestService.post<IUser>(
        "/user/register",
        createUser
      );
      return ret;
    } catch (e) {
      this.registerError = e;
      throw e;
    } finally {
      this.registerLoading = false;
    }
  }

  async login(loginUser: ILoginUserDto) {
    this.loginLoading = true;
    this.loginError = null;
    try {
      const res = await this.requestService.post<ILoginUser>(
        "/user/login",
        loginUser
      );
      this.user = res;
      this.token = res.token;
      this.storetDataInBrowser();
      const next = Router.query?.redirect || "/";
      Router.replace(next as string);

      setStorage("token", res.token);
      setStorage("user", JSON.stringify(res));

      return res;
    } catch (e) {
      this.loginError = e;
      throw e;
    } finally {
      this.loginLoading = false;
    }
  }

  async updateUser(updateUser: IUpdateUserDto) {
    this.updateLoading = true;
    try {
      const res = await this.requestService.patch<IUser>(
        "/user/update",
        updateUser
      );
      this.user = {
        ...this.user,
        ...res,
        token: this.token,
      };
      this.storetDataInBrowser();
      return res;
    } catch (e) {
      this.updateError = e;
      throw e;
    } finally {
      this.updateLoading = false;
    }
  }

  logout() {
    clearStorage(PERSIST_KEY);
    Router.replace("/login");
  }
}
