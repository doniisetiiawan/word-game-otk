import mongoose from 'mongoose';
import Promise from 'bluebird';

import build400Error from '../utils/helper';

const schema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  used: {
    type: Array,
  },
});

schema.statics.newGame = () => {
  const Stat = mongoose.model('stat');

  Promise.resolve(Stat.deleteMany()).then(() => Stat.create({
    word: 'what',
    used: [
      {
        word: 'what',
        user: 'admin',
      },
    ],
  }));
};

schema.statics.chain = (word, user) => {
  const Stat = mongoose.model('stat');
  const first = word.substr(0, 1);

  const fetching = Stat.findOne({}).exec();

  return Promise.resolve(fetching)
    .then((stat) => {
      const currentWord = stat.word;

      if (
        currentWord.substr(-1).toLowerCase()
        !== first.toLowerCase()
      ) {
        throw build400Error('not match');
      }

      return currentWord;
    })
    .then((currentWord) => Stat.findOneAndUpdate(
      {
        word: currentWord,
        'used.word': { $ne: word },
      },
      {
        word,
        $push: {
          used: { word, user },
        },
      },
      {
        upsert: false,
      },
    ).exec())
    .then((result) => {
      if (!result) {
        throw build400Error('not found');
      }

      return result;
    });
};

const Stat = mongoose.model('stat', schema);
export default Stat;
