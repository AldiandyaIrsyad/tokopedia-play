import jwt from 'jsonwebtoken';

import { IUser, IUserModel } from './user.model';
export interface IUserService {
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<IUser>;
  login: (username: string, password: string) => Promise<string>;
  getAll: () => Promise<IUser[]>;
  getById: (id: string) => Promise<IUser>;
}

export class UserService implements IUserService {
  private readonly userModel: IUserModel;

  constructor(userModel: IUserModel) {
    this.userModel = userModel;

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getAll = this.getAll.bind(this);
    this.getById = this.getById.bind(this);
  }

  public async register(
    username: string,
    email: string,
    password: string
  ): Promise<IUser> {
    const user = await this.userModel.create({
      username,
      email,
      password,
    } as IUser);
    return user;
  }

  public async login(email: string, password: string): Promise<string> {
    const user = await this.userModel.login(email, password);

    if (!user) {
      throw new Error('User not found');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });

    return token;
  }

  public async getAll(): Promise<IUser[]> {
    const users = await this.userModel.getAll();
    return users;
  }

  public async getById(id: string): Promise<IUser> {
    const user = await this.userModel.getById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
