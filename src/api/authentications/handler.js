const AuthenticationError = require('../../exceptions/AuthenticationError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator){
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      const id = await this._usersService.verifyUserCredential(username, password);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditemukan',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error(error);
      let statusCode = 500;
      if (error instanceof AuthenticationError) {
        statusCode = 401;
      } else if (error instanceof NotFoundError) {
        statusCode = 404;
      } else if (error instanceof AuthorizationError) {
        statusCode = 403;
      } else if (error instanceof ClientError) {
        statusCode = 400;
      }
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(statusCode);
      return response;
    }
  }

  async putAuthenticationHandler(request, h) {
    try {
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
      const response = h.response({
        status: 'success',
        message: 'Access Token Berhasil diperbarui',
        data: {
          accessToken,
        },
      });
      response.code(200);
      return response;

    } catch (error) {
      console.error(error);
      let statusCode = 500;
      if (error instanceof ClientError) {
        statusCode = 400;
      } else if (error instanceof NotFoundError) {
        statusCode = 404;
      } else if (error instanceof AuthorizationError) {
        statusCode = 403;
      } else if (error instanceof AuthenticationError) {
        statusCode = 401;
      }
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(statusCode);
      return response;
    }
  }

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
      return response;
    } catch (error) {
      console.error(error);
      let statusCode = 500;
      if (error instanceof ClientError) {
        statusCode = 400;
      } else if (error instanceof NotFoundError) {
        statusCode = 404;
      } else if (error instanceof AuthorizationError) {
        statusCode = 403;
      } else if (error instanceof AuthenticationError) {
        statusCode = 401;
      }
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(statusCode);
      return response;
    }
  }
}
module.exports = AuthenticationsHandler;