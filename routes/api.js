'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  const trans = new Translator();

  app.route('/api/translate').post((req, res) => {
    const { text, locale } = req.body;
    if (text === '') return res.json({ error: 'No text to translate' });
    if (text === undefined || locale === undefined)
      return res.json({ error: 'Required field(s) missing' });

    if (locale === 'american-to-british') {
      res.json({
        text,
        translation:
          trans.toBrit(text) !== text ? trans.toBrit(text) : 'Everything looks good to me!',
      });
    }
    if (locale === 'british-to-american') {
      res.json({
        text,
        translation:
          trans.toAme(text) !== text ? trans.toAme(text) : 'Everything looks good to me!',
      });
    } else return res.json({ error: 'Invalid value for locale field' });

    p;
  });
};
