import { useEffect, useState } from 'react';

import { useAxios } from '../hooks';

import { io } from 'socket.io-client';

export interface IComment extends Document {
  _id?: string;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  user?: any;
  video?: any;
}

export default function test() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  const axios = useAxios();

  // // send comment to /api/comment
  // const sendComment = async (text: string) => {
  //   const { data } = await axios.post('/api/comment', { text });
  //   setComments((prev) => [data, ...prev]);
  // };

  // get comments from /api/comment
  const getComments = async () => {
    const { data } = await axios.get('/api/comment');
    setComments(data);
  };

  // post comment to /api/comment/

  useEffect(() => {
    getComments();

    // connect to socket
    const connectSocket = () => {
      const socket = io('http://localhost:5000/');
      socket.on('connect', () => {
        console.log('connected');
        setSocket(socket);
        setSocketId(socket.id);
      });

      socket.on('newComment', (comment: IComment) => {
        console.log(comment);
        setComments((prev) => [comment, ...prev]);

        // it's duplicating the comments
      });
    };

    connectSocket();
  }, []);

  const postComment = async (text: string) => {
    const { data } = await axios.post('/api/comment', {
      text,
      videoId: '64d58a1874f42b18f11d53d6',
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postComment(commentText);
    setCommentText('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Comment:
          <input
            type="text"
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {comments.map((comment) => (
        <div key={comment._id}>{comment.text}</div>
      ))}
    </div>
  );
}
