//const ClientError = require('../../exceptions/ClientError');

const AuthenticationError = require('../../exceptions/AuthenticationError');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class UsersHandler {
  constructor(service, validator){
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const userId = await this._service.addUser({ username, password, fullname });
      const response = h.response({
        status: 'success',
        message: 'Users berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error(error);
      let statusCode = 500;
      if (error instanceof ClientError) {
        statusCode = 400;
      } else if (error instanceof NotFoundError) {
        statusCode = 404;
      } else if (error instanceof AuthenticationError) {
        statusCode = 403;
      } else if (error instanceof InvariantError) { statusCode = 400;
      }
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(statusCode);
      return response;
    }
  }

  async getUserByIdHandler(request){
    const { id } = request.params;
    const user = await this._service.getUserById(id);

    return {
      status: 'success',
      data: {
        user,
      },
    };
  }
}

module.exports = UsersHandler;