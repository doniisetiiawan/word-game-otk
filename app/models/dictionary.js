import fs from 'fs';

const dictionary = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../test/fixtures/dictionary.json`,
  ),
);

const Dictionary = {
  isWord(word) {
    return !!dictionary[word];
  },
};

export default Dictionary;
