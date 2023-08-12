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
      console.log('text:', text);
      console.log('videoId:', videoId);

      const comment = await this.commentService.create(text, token, videoId);

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  async getCommentsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const comments = await this.commentService.getCommentsByUserId(
        req.params.id
      );
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }

  async getCommentsByVideoId(req: Request, res: Response): Promise<void> {
    try {
      const comments = await this.commentService.getCommentsByVideoId(
        req.params.id
      );
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json(getErrorMessage(error));
    }
  }
}
