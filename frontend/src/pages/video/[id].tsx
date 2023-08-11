import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { useAxios } from '../../hooks';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function video() {
  interface IVideo extends Document {
    title: string;
    thumbnail: string;
    url: string;
    views?: number;
    createdAt?: Date;
    user?: any;
    comments?: any;
    products?: any;
  }

  interface IComment extends Document {
    _id?: string;
    text: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: number;
    user?: any;
    video?: any;
  }
  const { id } = useParams();

  const axios = useAxios();

  const [video, setVideo] = useState<IVideo>({
    title: '',
    thumbnail: '',
    url: '',
    views: 0,
    createdAt: new Date(),
    user: {},
    comments: [],
    products: [],
  } as IVideo);

  const getVideo = async () => {
    const { data } = await axios.get(`/api/video/${id}`);

    // regex to get youtube video id
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;

    // get youtube video id typescript
    const youtubeId = data.url.match(regex)[0].split('=')[1];

    // add https://www.youtube.com/embed/
    data.url = `https://www.youtube.com/embed/${youtubeId}`;

    console.log(data);

    setVideo(data);
  };

  useEffect(() => {
    getVideo();
  }, []);

  const [comments, setComments] = useState<IComment[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  // // send comment to /api/comment
  // const sendComment = async (text: string) => {
  //   const { data } = await axios.post('/api/comment', { text });
  //   setComments((prev) => [data, ...prev]);
  // };

  // get comments from /api/comment
  const getComments = async () => {
    const { data } = await axios.get('/api/comment/video/' + id);
    setComments(data.slice(-5));
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
        // set ..prev comment, max 10

        setComments((prev) => [...prev, comment].slice(-5));

        // it's duplicating the comments
      });
    };

    connectSocket();
  }, []);

  const postComment = async (text: string) => {
    const { data } = await axios.post('/api/comment', {
      text,
      videoId: id,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postComment(commentText);
    setCommentText('');
  };

  return (
    <div>
      <div>
        <Header />
      </div>

      <div className="flex flex-row  h-screen  ">
        <div className=" w-96">
          {/* loop over products */}
          {video.products?.map((product: any) => (
            <Product product={product} />
          ))}
        </div>
        <div className=" flex-1">
          <div className="flex justify-center">
            <iframe
              width="720"
              height="480"
              src={video.url}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="block "
            ></iframe>
          </div>
        </div>
        <div className="w-96 flex flex-col">
          {/* loop over comments */}
          <div className="flex-1">
            {comments?.map((comment: any) => (
              <Comment comment={comment} key={comment._id} />
            ))}
          </div>
          <div className="h-48 border text-black">
            {/* form to post comment */}
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <textarea
                className="border p-4 rounded"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
              />
              <button className="bg-primary-500 text-white rounded p-4">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      <div>
        <code>
          <pre>{JSON.stringify(video, null, 2)}</pre>
        </code>
      </div>
    </div>
  );
}

function Product({ product }: any) {
  return (
    <a href={product.url}>
      <div className="flex flex-col">
        <div className="flex justify-center">
          <img src={product.thumbnail_url} alt="" />
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">{product.title}</div>
        </div>
      </div>
    </a>
  );
}

function Comment({ comment }: any) {
  return (
    <div className="flex flex-col bg-neutral-500 mb-4 p-4 rounded">
      <div className="flex">{comment.user.username}</div>
      <div className="flex">{comment.text}</div>
    </div>
  );
}
