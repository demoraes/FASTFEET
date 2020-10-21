import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';
import NotificationsController from './app/controllers/NotificationsController';
import ViewDeliverymanController from './app/controllers/ViewDeliverymanController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/**
 * Middleware de autenticação usando token
 */
routes.use(authMiddlewares);

/**
 * Rotas do usuário
 */

routes.put('/users', UserController.update);

/**
 * Rotas recipients
 */
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

/**
 * Rotas do deliveryman
 */
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.get('/deliveryman', DeliverymanController.index);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

/**
 * Rotas do ViewDeliveryman
 */
routes.get('/deliveryman/:id/deliveries', ViewDeliverymanController.index);
routes.get('/deliveryman/:id/handed', ViewDeliverymanController.show);
routes.post('/deliveryman/:id/startDelivered', ViewDeliverymanController.store);
routes.put('/deliveryman/:id/delivered', ViewDeliverymanController.update);

/**
 * Rotas DeliveryProblem
 */
routes.get('/deliveryProblem', DeliveryProblemController.index);
routes.get('/deliveryProblem/:id/problems', DeliveryProblemController.show);
routes.post('/deliveryProblem', DeliveryProblemController.store);
routes.put('/deliveryProblem/:id/problem', DeliveryProblemController.update);
routes.delete(
  '/deliveryProblem/:id/cancel_delivery',
  DeliveryProblemController.delete
);

/**
 * Order Controller
 */
routes.get('/order', OrderController.index);
routes.post('/order', OrderController.store);
routes.put('/order/:id', OrderController.update);
routes.delete('/order/:id', OrderController.delete);

routes.get('/notifications', NotificationsController.index);
routes.put('/notifications/:id', NotificationsController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
