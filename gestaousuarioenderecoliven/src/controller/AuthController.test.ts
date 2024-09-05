import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthController } from './AuthController'; // Ajuste o caminho conforme necessário

jest.mock('jsonwebtoken'); // Mock do módulo jsonwebtoken

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });


  it('should return 500 if token is invalid', async () => {
    // Define o comportamento do mock
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const req = {
      headers: {
        authorization: 'Bearer invalidtoken'
      }
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await authController.verificarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: "Token não válido."
    });
  });

  it('should call next if token is valid', async () => {
    // Define o comportamento do mock
    (jwt.verify as jest.Mock).mockImplementation(() => {});

    const req = {
      headers: {
        authorization: 'Bearer validtoken'
      }
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    await authController.verificarToken(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
