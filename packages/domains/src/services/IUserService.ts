import { IUser, ILoginUser } from "../models";

export type ICreateUserDto = {
  /**
   * 用户名
   */
  name: string;

  /**
   * 密码
   */
  password: string;

  /**
   * 二次确认密码
   */
  confirmPassword: string;
  /**
   * 头像
   */
  avatar?: string;

  /**
   * 邮箱地址
   */
  email?: string;
};

export type ILoginUserDto = Pick<ICreateUserDto, "name" | "password">;

export type IUpdateUserDto = Pick<ICreateUserDto, "avatar" | "email">;

export abstract class IUserService {
  user: ILoginUser | null = null;
  token: string | null = null;
  registerLoading = false;
  registerError = null;
  loginLoading = false;
  loginError = null;
  updateLoading = false;
  updateError = null;

  /**
   * 注册用户
   * @param createUser
   */
  abstract register(createUser: ICreateUserDto): Promise<IUser>;

  /**
   * 登录用户
   * @param loginUser
   */
  abstract login(loginUser: ILoginUserDto): Promise<ILoginUser>;

  /**
   * 更新用户
   * @param updateUser
   */
  abstract updateUser(updateUser: IUpdateUserDto): Promise<IUser>;

  /**
   * 退出登录
   */
  abstract logout(): void;

  /**
   * 将数据存储到浏览器
   */
  abstract storetDataInBrowser(): void;

  /**
   * 从浏览器恢复数据
   */
  abstract syncDataInBrowser(): void;
}
