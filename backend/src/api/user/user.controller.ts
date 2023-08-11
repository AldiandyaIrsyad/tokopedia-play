import { IUserService } from './user.service';
import { Request, Response } from 'express';

import { getErrorMessage } from '../../helpers/getErrorMessage';

export interface IUserController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  getAllUsers(req: Request, res: Response): Promise<void>;
  getUserById(req: Request, res: Response): Promise<void>;
}

export class UserController implements IUserController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;

    // bind methods
    this.getAllUsers = this.getAllUsers.bind(this);

    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getUserById = this.getUserById.bind(this);
  }

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password } = req.body;
      await this.userService.register(username, email, password);
      await this.login(req, res);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.userService.login(email, password);

      res.cookie('token', token, { httpOnly: true }).sendStatus(200);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: getErrorMessage(error) });
    }
  }
}
