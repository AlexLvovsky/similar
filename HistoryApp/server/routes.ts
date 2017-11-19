import * as express from 'express';

import UrlCtrl from './controllers/url';

export default function setRoutes(app) {

  const router = express.Router();

  const urlCtrl = new UrlCtrl();

  // Urls
  router.route('/urls').get(urlCtrl.getAll);
  router.route('/urls').delete(urlCtrl.deleteAll);
  router.route('/url').post(urlCtrl.insert);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
