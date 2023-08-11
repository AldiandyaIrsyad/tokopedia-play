import { ICommentService } from './comment.service';
import { Request, Response } from 'express';
import { getErrorMessage } from '../../helpers/getErrorMessage';

export interface ICommentController {
  getAllComments: (req: Request, res: Response) => Promise<void>;
  getCommentById: (req: Request, res: Response) => Promise<void>;
  createComment: (req: Request, res: Response) => Promise<void>;
  getCommentsByUserId: (req: Request, res: Response) => Promise<void>;
  getCommentsByVideoId: (req: Request, res: Response) => Promise<void>;
}

export class CommentController implements ICommentController {
  private readonly commentService: ICommentService;

  constructor(commentService: ICommentService) {
    this.commentService = commentService;

    // bind
    this.getAllComments = this.getAllComments.bind(this);
    this.getCommentById = this.getCommentById.bind(this);
    this.createComment = this.createComment.bind(this);
    this.getCommentsByUserId = this.getCommentsByUserId.bind(this);
    this.getCommentsByVideoId = this.getCommentsByVideoId.bind(this);
  }

  async getAllComments(req: Request, res: Response): Promise<void> {
    try {
      const comments = await this.commentService.getAll();
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  async getCommentById(req: Request, res: Response): Promise<void> {
    try {
      const comment = await this.commentService.getById(req.params.id);
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.cookies;

      const { text, videoId } = req.body;
      const comment = await this.commentService.create(text, videoId, token);

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  async getCommentsByUserId(req: Request, res: Response): Promise<void> {
    try {

      const { token } = req.cookies;
      const comments = await this.commentService.getByUserId(req.params.id);
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }
}
