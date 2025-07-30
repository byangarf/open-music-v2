const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
class PlaylistService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }){
    if (!name) {
      throw new InvariantError('Gagal menambahkan playlist. Mohon isi nama playlist');
    }
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist (id, name, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    try {
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new InvariantError('Playlist gagal ditambahkan');
      }
      return result.rows[0].id;
    } catch (Error) {
      throw new Error('Gagal menambahkan playlist. Terjadi kesalahan pada database');
    }

  }

  async addPlaylistSong({ playlistId, songId }){
    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_song (id, playlist_id, song_id) VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;

  }

  async getPlaylist(owner) {
    const query = {
      text: `
        SELECT p.id, p.name, u.username
        FROM playlist p
        JOIN users u ON u.id = p.owner
        WHERE p.owner = $1
      `,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getPlaylistSong(playlistId){
    const playlistQuery = {
      text: `
        SELECT playlist.id, playlist.name, users.username
        FROM playlist
        JOIN users ON playlist.owner = users.id
        WHERE playlist.id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);
    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songQuery = {
      text: `
        SELECT song.id, song.title, song.performer
        FROM playlist_song
        JOIN song ON song.id = playlist_song.song_id
        WHERE playlist_song.playlist_id = $1
      `,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songQuery);

    return {
      ...playlistResult.rows[0],
      songs: songsResult.rows,
    };
  }

  async deletePlaylistById(id){
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      const query = {
        text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
      }
      return result.rows[0].id;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  async deletePlaylistSong(id, songId) {
    try {
      if (!id) throw new Error('Playlist ID diperlukan');
      if (!songId) throw new Error('Lagu ID diperlukan');
      const query = {
        text: `DELETE FROM playlist_song 
              WHERE playlist_id = $1 AND song_id = $2 
              RETURNING id`,
        values: [id, songId],
      };
      const result = await this._pool.query(query);
      if (result.rowCount === 0) {
        throw new Error('Lagu tidak ditemukan dalam playlist ini');
      }
      return result.rows[0].id;
    } catch (error) {
      throw new InvariantError(error.message);
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const Playlist = result.rows[0];
    if (Playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
  async verifySongOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    const song = result.rows[0];
    if (song.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

}

module.exports = PlaylistService;