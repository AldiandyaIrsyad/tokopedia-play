import mongoose, { ConnectOptions } from 'mongoose';

mongoose.connect(
  process.env.mongodbURI ?? `mongodb://localhost:27017/tokopediaDev`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions
);

export default mongoose;

export async function disconnect() {
  await mongoose.disconnect();
}
