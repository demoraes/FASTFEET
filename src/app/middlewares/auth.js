import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  /**
   * Token do usuário que é pego pelo header
   */
  const authHeader = req.headers.authorization;

  /**
   * Token invalido retorna error
   */
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  /**
   * authHeader retorna um vetor -> [bearer,token]
   * quando colocamos a virgula sem nada no primeiro índice
   * ele omiti o valor que está no respectivo indice.
   */
  const [, token] = authHeader.split(' ');

  try {
    /**
     * decodifica o token e coloca o valor do id em req.userId
     */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
