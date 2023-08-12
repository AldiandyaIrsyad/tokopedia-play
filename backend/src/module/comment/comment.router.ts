import express from 'express';
import { ICommentController } from './comment.controller';

export class CommentRouter {
  private router: express.Router;

  constructor(private commentController: ICommentController) {
    this.router = express.Router();
    this.initRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initRoutes() {
    this.router.post('/', this.commentController.createComment);
    this.router.get('/', this.commentController.getAllComments);
    this.router.get('/:id', this.commentController.getCommentById);
    this.router.get('/user/:id', this.commentController.getCommentsByUserId);
    this.router.get('/video/:id', this.commentController.getCommentsByVideoId);
  }
}
