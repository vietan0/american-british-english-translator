const americanOnly = require('./american-only.js');
const ameToBritSpelling = require('./american-to-british-spelling.js');
const ameToBritTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
  getWords(str) {
    let split = str
      .split(' ') // split into words
      .map((word, index, array) => {
        if (word.match(/,$/) || (word.match(/\.$/) && index === array.length - 1)) {
          // if word has comma or period at the end
          const letters = word.substring(0, word.length - 1);
          const commaOrPeriod = word.substring(word.length - 1);

          return [letters, commaOrPeriod];
        } else return word;
      });
    return split;
  }

  toBrit(str, highlight = true) {
    // word: 'Mr.', 'die.', 'Bond,'
    // pureWord: no punctuation whatsoever
    const words = this.getWords(str);
    const detectTime = /\d{1,2}:\d{2}/g;

    function findBritEquiv(pureWord, nextPureWord) {
      const compound = pureWord + ' ' + nextPureWord;

      if (americanOnly[compound]) return { equiv: americanOnly[compound], isCompound: true };
      if (americanOnly[pureWord]) return { equiv: americanOnly[pureWord], isCompound: false };

      // pureword = Mr.
      if (ameToBritTitles[pureWord.toLowerCase()]) {
        return {
          equiv: pureWord.replace('.', ''),
          isCompound: false,
        };
      }
      if (ameToBritSpelling[pureWord])
        return { equiv: ameToBritSpelling[pureWord], isCompound: false };
      else return { equiv: undefined, isCompound: false };
    }

    // translate round 1
    let translated = words.map(
      function (word, i, a) {
        const nextWord = a[i + 1];

        if (typeof word === 'string') {
          if (word.match(detectTime)) return word.replace(':', '.');
          if (this.prevLoopIsCompound === true) {
            this.prevLoopIsCompound = false;
            return '';
          }
          const { equiv, isCompound } = findBritEquiv(word, nextWord);
          this.prevLoopIsCompound = isCompound;
          return equiv || word;
        } else {
          // word is Array: ['Bond', ',']
          const { equiv } = findBritEquiv(word[0]);
          return equiv ? equiv + word[1] : word.join('');
        }
      },
      { prevLoopIsCompound: false },
    );

    const strArr = str.split(' ');
    translated = translated
      .join(' ')
      .replaceAll('  ', ' ')
      .replaceAll(/rube goldberg machine/gi, 'Heath Robinson device')
      .split(' ')
      .map((word) => {
        if (!strArr.includes(word) && highlight) return `<span class="highlight">${word}</span>`;
        else return word;
      })
      .join(' ');

    return translated;
  }

  toAme(str, highlight = true) {
    const words = this.getWords(str);
    const detectTime = /\d{1,2}\.\d{2}/g;

    function findAmeEquiv(pureWord, nextPureWord) {
      const compound = pureWord + ' ' + nextPureWord;

      if (britishOnly[compound]) return { equiv: britishOnly[compound], isCompound: true };
      if (britishOnly[pureWord]) return { equiv: britishOnly[pureWord], isCompound: false };

      const ameToBritTitlesArray = Object.entries(ameToBritTitles);
      const titlesPair = ameToBritTitlesArray.find((pair) => pair.includes(pureWord.toLowerCase()));
      if (titlesPair) {
        return {
          equiv: pureWord + '.',
          isCompound: false,
        };
      }

      const ameToBritSpellingArray = Object.entries(ameToBritSpelling);
      const spellingPair = ameToBritSpellingArray.find((pair) => pair.includes(pureWord));
      if (spellingPair) {
        return { equiv: spellingPair[0], isCompound: false };
      } else return { equiv: undefined, isCompound: false };
    }

    // translate round 1
    let translated = words.map(
      function (word, i, a) {
        const nextWord = a[i + 1];

        if (typeof word === 'string') {
          if (word.match(detectTime)) return word.replace('.', ':');
          if (this.prevLoopIsCompound === true) {
            this.prevLoopIsCompound = false;
            return '';
          }
          const { equiv, isCompound } = findAmeEquiv(word, nextWord);
          this.prevLoopIsCompound = isCompound;
          return equiv || word;
        } else {
          // word is Array: ['Bond', ',']
          if (word[0].match(detectTime)) {
            word[0] = word[0].replace('.', ':');
          }
          const { equiv } = findAmeEquiv(word[0]);
          return equiv ? equiv + word[1] : word.join('');
        }
      },
      { prevLoopIsCompound: false },
    );

    const strArr = str.split(' ');
    translated = translated
      .join(' ')
      .replaceAll('  ', ' ')
      .replaceAll(/trunk sale/gi, 'swap meet')
      .split(' ')
      .map((word) => {
        if (!strArr.includes(word) && highlight) return `<span class="highlight">${word}</span>`;
        else return word;
      })
      .join(' ');

    return translated;
  }
}

module.exports = Translator;
