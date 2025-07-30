const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }
  async addCollaboration(albumId, songId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations (id, album_id, song_id, user_id) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, albumId, songId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration(albumId, songId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE album_id = $1, song_id = $2 AND user_id = $3 RETURNING id',
      values: [albumId, songId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(albumId, songId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE album_id = $1, song_id = $2 AND user_id = $3',
      values: [albumId, songId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;