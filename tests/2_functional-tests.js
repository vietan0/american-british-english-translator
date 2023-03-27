const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  const url = '/api/translate';
  test('text and locale fields', (done) => {
    chai
      .request(server)
      .post(url)
      .send({
        text: 'Mangoes are my favorite fruit.',
        locale: 'american-to-british',
      })
      .end((err, res) => {
        assert.equal(
          res.body.translation,
          'Mangoes are my <span class="highlight">favourite</span> fruit.',
        );
        done();
      });
  });
  test('text and invalid locale field', (done) => {
    chai
      .request(server)
      .post(url)
      .send({
        text: 'Mangoes are my favorite fruit.',
        locale: 'french-to-british',
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Invalid value for locale field' });
        done();
      });
  });
  test('missing text field', (done) => {
    chai
      .request(server)
      .post(url)
      .send({
        locale: 'american-to-british',
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });
  test('missing local field', (done) => {
    chai
      .request(server)
      .post(url)
      .send({
        text: "Mangoes are my favorite fruit.",
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'Required field(s) missing' });
        done();
      });
  });
  test('empty text', (done) => {
    chai
      .request(server)
      .post(url)
      .send({
        text: "",
        locale: 'american-to-british',
      })
      .end((err, res) => {
        assert.deepEqual(res.body, { error: 'No text to translate' });
        done();
      });
  });
  test('text that needs no translation', (done) => {
    chai
      .request(server)
      .post(url)
      .send({
        text: 'Mangoes are my favorite fruit.',
        locale: 'british-to-american',
      })
      .end((err, res) => {
        assert.equal(res.body.translation, 'Everything looks good to me!');
        done();
      });
  });
});
