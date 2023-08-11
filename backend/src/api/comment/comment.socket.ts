import { Server } from 'socket.io';
import { EventEmitter } from 'events';
import { IComment } from './comment.model';
import http from 'http';

export interface ICommentSocket {
  addComment(comment: IComment): void;
}

export class CommentSocket implements ICommentSocket {
  private io: Server;
  private eventEmitter: EventEmitter;

  constructor(server: http.Server) {
    this.eventEmitter = new EventEmitter();
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    this.io.on('connection', (socket) => {
      console.log('New client connected');
      this.eventEmitter.on('newComment', (comment) => {
        // send new comment to client
        socket.emit('newComment', comment);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    // bind
    this.addComment = this.addComment.bind(this);
  }

  public addComment(comment: IComment): void {
    this.eventEmitter.emit('newComment', comment);
  }
}
