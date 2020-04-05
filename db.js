import mongoose from 'mongoose';

console.log('connecting db...');

mongoose.connect(
  'mongodb://localhost/word-game-otk',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) {
      return console.error(
        'Mongoose - connection error:',
        err,
      );
    }

    console.log('db connected');
  },
);

export default mongoose;
