import express from 'express';

import PointsController from '../controllers/PointsController';
import ItemsController from '../controllers/ItemsController';

const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);
routes.get('/items/:id', itemsController.show);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.store);

export default routes;