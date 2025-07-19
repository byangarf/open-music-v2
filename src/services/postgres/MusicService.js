const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
class MusicService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }){
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album (id, name, year) VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    if (isNaN(year) || typeof year === 'boolean') {
      throw new Error('Gagal menambahkan album. Tahun harus berupa angka');
    }

    if (!year) {
      throw new Error('Gagal menambahkan album. Mohon isi tahun album');
    }

    if (!name) {
      throw new Error('Gagal menambahkan album. Mohon isi nama album');
    }

    return result.rows[0].id;

  }

  async addSong({ title, year, performer, genre, duration }){
    const id = `song-${nanoid(16)}`;
    const albumId = `album-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO song (id, album_id, title, year, performer, genre, duration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, albumId, title, year, performer, genre, duration],
    };

    try {
      console.log('Executing query:', query);
      const result = await this._pool.query(query);
      if (!result.rows[0].id) {
        throw new InvariantError('Lagu gagal ditambahkan');
      }
      if (isNaN(year) || typeof year === 'boolean') {
        throw new Error('Gagal menambahkan lagu. Tahun harus berupa angka');
      }

      if (isNaN(duration) || typeof duration === 'boolean') {
        throw new Error('Gagal menambahkan lagu. Duration harus berupa angka');
      }

      if (!year) {
        throw new Error('Gagal menambahkan lagu. Mohon isi tahun lagu');
      }

      if (!title) {
        throw new Error('Gagal menambahkan lagu. Mohon isi title lagu');
      }
      if (!genre) {
        throw new Error('Gagal menambahkan lagu. Mohon isi genre lagu');
      }
      if (!performer) {
        throw new Error('Gagal menambahkan lagu. Mohon isi performer lagu');
      }
      return result.rows[0].id;
    } catch (error) {
      console.error('Error adding song:', error);
      throw new InvariantError('Gagal menambahkan lagu ke database');
    }
  }

  async getSong() {
    const result = await this._pool.query('SELECT id, title, performer FROM song');
    if (!result.rows){
      throw new InvariantError('Lagu tidak ada');
    }
    return result.rows;
  }

  async getAlbumById(id){
    const query = {
      text: 'SELECT * FROM album WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
    return result.rows[0];
  }

  async getSongById(id){
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows[0];
  }

  async editAlbumById(id, { name, year }){
    const query = {
      text: 'UPDATE album SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
    if (isNaN(year) || typeof year === 'boolean') {
      throw new Error('Gagal menambahkan album. Tahun harus berupa angka');
    }

    if (!year) {
      throw new Error('Gagal menambahkan album. Mohon isi tahun album');
    }

    if (!name) {
      throw new Error('Gagal menambahkan album. Mohon isi nama album');
    }
  }

  async editSongById(id, { title, year, performer, genre, duration }){
    const query = {
      text: 'UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
      values: [title, year, performer, genre, duration, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
    if (isNaN(year) || typeof year === 'boolean') {
      throw new Error('Gagal menambahkan lagu. Tahun harus berupa angka');
    }

    if (isNaN(duration) || typeof duration === 'boolean') {
      throw new Error('Gagal menambahkan lagu. Duration harus berupa angka');
    }

    if (!year) {
      throw new Error('Gagal menambahkan lagu. Mohon isi tahun lagu');
    }

    if (!title) {
      throw new Error('Gagal menambahkan lagu. Mohon isi title lagu');
    }
    if (!genre) {
      throw new Error('Gagal menambahkan lagu. Mohon isi genre lagu');
    }
    if (!performer) {
      throw new Error('Gagal menambahkan lagu. Mohon isi performer lagu');
    }
  }

  async deleteAlbumById(id){
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      const query = {
        text: 'DELETE FROM album WHERE id = $1 RETURNING id',
        values: [id],
      };
      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
      }
      return result.rows[0].id;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }

  async deleteSongById(id){
    const query = {
      text: 'DELETE FROM song WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = MusicService;