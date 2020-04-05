import Promise from 'bluebird';

import build400Error from '../utils/helper';
import Dictionary from '../models/dictionary';
import User from '../models/user';
import Stat from '../models/stat';

const Game = {
  state() {
    return Promise.props({
      users: User.findAllUsers(),
      stat: Stat.findOne({}).exec(),
    });
  },

  join(user) {
    return User.join(user).then(User.findAllUsers);
  },

  leave(user) {
    return User.leave(user).then(User.findAllUsers);
  },

  chain(user, word) {
    if (!Dictionary.isWord(word)) {
      return Promise.reject(
        build400Error('invalid word'),
      );
    }

    return Stat.chain(word, user);
  },

  reset() {
    return Stat.newGame();
  },
};

export default Game;
