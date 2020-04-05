import chai from 'chai';
import Promise from 'bluebird';
import mocha from 'mocha';

// eslint-disable-next-line no-unused-vars
import config from '../config.test';
import User from '../../app/models/user';
import Stat from '../../app/models/stat';
import Game from '../../app/controllers/game';

const { expect } = chai;
const { describe, it, before } = mocha;

before(() => Promise.all([
  User.deleteMany(),
  Stat.newGame(),
]));

describe('Game', () => {
  describe('when game starts', () => {
    it('should have no user', () => Game.state()
      .then((state) => {
        expect(state.users.length).to.equal(0);
        expect(state.stat.word).to.equal('what');
        expect(state.stat.used.length).to.equal(1);
        expect(state.stat.used[0].word).to.equal('what');
      }));
  });

  describe('when leo joins', () => {
    it('should return leo', () => Game.join('leo')
      .then((users) => {
        expect(users.join(',')).to.equal('leo');
      }));
  });

  describe('when another leo joins', () => {
    it('should be rejected', () => Game.join('leo')
      .then(() => {
        throw new Error('should return Error');
      })
      .catch((err) => {
        expect(err.code).to.equal(11000);
        return true;
      }));
  });

  describe('when geoffrey joins', () => {
    it('should return leo,geoffrey', () => Game.join('geoffrey')
      .then((users) => {
        expect(users.join(',')).to.equal('leo,geoffrey');
      }));
  });

  describe('when leo leaves', () => {
    it('should return geoffrey', () => Game.leave('leo')
      .then((users) => {
        expect(users.join(',')).to.equal('geoffrey');
      }));
  });

  describe('when marc joins', () => {
    it('should return marc', () => Game.join('marc')
      .then((users) => {
        expect(users.join(',')).to.equal('geoffrey,marc');
      }));
  });

  describe('when send invalid word,', () => {
    it('should be ignored', () => Game.chain('geoffrey', 'asdf')
      .then(() => {
        throw new Error('should return Error');
      })
      .catch((err) => {
        expect(err.status).to.equal(400);
        return true;
      }));
  });

  describe('when send word can\'t chain the current word', () => {
    it('should be ignored', () => Game.chain('marc', 'good')
      .then(() => {
        throw new Error('should return Error');
      })
      .catch((err) => {
        expect(err.status).to.equal(400);
        return true;
      }));
  });

  describe('when send valid word', () => {
    it('should be accepted', () => Game.chain('marc', 'tomorrow')
      .then((state) => {
        expect(state.used.length).equal(2);
        expect(state.used[1].word).equal('tomorrow');
        expect(state.used[1].user).equal('marc');

        expect(state.word).to.equal('tomorrow');
      }));
  });

  describe('when send repeated word', () => {
    it('should be ignored', () => Game.chain('marc', 'what')
      .then(() => {
        throw new Error('should return Error');
      })
      .catch((err) => {
        expect(err.status).to.equal(400);
        return true;
      }));
  });


  describe('when player1 and player2 send valid word together', () => {
    it('should accpet player1\'s word, and reject player2\'s word', (done) => {
      Game.chain('geoffrey', 'watch')
        .then((state) => {
          expect(state.used.length).to.equal(3);
          expect(state.used[2].word).to.equal('watch');
          expect(state.used[2].user).to.equal('geoffrey');

          expect(state.word).to.equal('watch');
        });

      Game.chain('marc', 'watch')
        // eslint-disable-next-line no-unused-vars
        .then((state) => {
          done(new Error('should return Error'));
        })
        .catch((err) => {
          expect(err.status).to.equal(400);
          done();
        });
    });
  });

  describe('when player1 and player2 send different valid word together', () => {
    it('should accpet player1\'s word, and reject player2\'s word', (done) => {
      Game.chain('geoffrey', 'hello')
        .then((state) => {
          expect(state.used.length).to.equal(4);
          expect(state.used[3].word).to.equal('hello');
          expect(state.used[3].user).to.equal('geoffrey');

          expect(state.word).to.equal('hello');
        });

      Game.chain('marc', 'helium')
        // eslint-disable-next-line no-unused-vars
        .then((state) => {
          done(new Error('should return Error'));
        })
        .catch((err) => {
          expect(err.status).to.equal(400);
          done();
        });
    });
  });
});
