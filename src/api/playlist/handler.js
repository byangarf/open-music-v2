const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistHandler{
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }
  _notFoundResponse(h, message) {
    const response = h.response({
      status: 'fail',
      message: message || 'Resource not found',
    });
    response.code(404);
    return response;
  }
  _errorResponse(h, message) {
    const response = h.response({
      status: 'error',
      message: message || 'Internal server error',
    });
    response.code(500);
    return response;
  }
  async postPlaylistHandler(request, h){
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

      const response = h.response({
        status: 'success',
        message: 'PLaylist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }

  async postPlaylistSongHandler(request, h){
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(playlistId, owner);
      await this._service.addPlaylistSong({ playlistId, songId });

      const response = h.response({
        status: 'success',
        message: 'PLaylist berhasil ditambahkan',
      });
      response.code(201);
      return response;
    } catch (error) {
      console.error(error);
      if (error.message.includes('insert')) {
        const response = h.response({
          status: 'fail',
          message: 'Song tidak ditemukan. Pastikan song_id valid.',
        });
        response.code(404);
        return response;
      }
      if (error instanceof AuthorizationError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(403);
      }
      else {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);
        return response;
      }
    }
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylist(credentialId);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }
  async getPlaylistSongHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: owner } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(playlistId, owner);
      const playlist = await this._service.getPlaylistSong(playlistId);
      return h.response({
        status: 'success',
        data: { playlist }
      });
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(403);
      }

      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(404);
      }
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan server'
      }).code(500);
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof AuthorizationError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(403);
      }
      if (error instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(400);
      }
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
  async deletePlaylistSongHandler(request, h) {
    try {
      const { songId } = request.payload;
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistSong(id, songId);

      return h.response({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist'
      });

    } catch (error) {
      console.error(error);
      if (error instanceof AuthorizationError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(403);
      }
      if (error instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: error.message
        }).code(400);
      }
      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan server'
      }).code(500);
    }

  }

}

module.exports = PlaylistHandler;