import Url from '../models/url';

export default class UrlCtrl {

  model = Url;

  // Get all
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  };

  // Insert
  insert = (req, res) => {
    this.model.findOneAndUpdate({'email': req.body.email, 'url': req.body.url}, req.body, {upsert: true},
      (err, doc) => { // callback
        if (err) {
          return console.error(err);
        } else {
          console.error(doc);
          res.sendStatus(200);
        }
      });
  };

  // Delete all
  deleteAll = (req, res) => {
    this.model.removeMany({}, (err) => {
      if (err) { return console.error(err); }
      res.sendStatus(200);
    });
  }
}
