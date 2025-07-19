const { nanoid } = require('nanoid');
class MusicService {
  constructor(){
    this._albums = [];
    this._songs = [];
  }

  addAlbum({ name, year }){
    const id = `album-${nanoid(16)}`;

    const newAlbums = {
      id, name, year,
    };

    this._albums.push(newAlbums);

    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Album gagal ditambahkan');
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

    return id;
  }

  addSong({ title, year, performer, genre, duration }){

    const id = `song-${nanoid(16)}`;
    const albumId = `album-${nanoid(16)}`;
    const newSongs = {
      id, title, year, performer, genre, duration, albumId
    };

    this._songs.push(newSongs);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new Error('Song gagal ditambahkan');
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

    return id;
  }

  getSong(){
    return this._songs;
  }

  getAlbumById(id){
    const album = this._albums.filter((a) => a.id === id)[0];

    if (!album){
      throw new Error('Album tidak ditemukan');
    }

    return album;
  }

  getSongById(id){
    const song = this._songs.filter((s) => s.id === id)[0];

    if (!song){
      throw new Error('Album tidak ditemukan');
    }

    return song;
  }

  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1){
      throw new Error('Gagal memperbarui Album, Id tidak ditemukan');
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

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
    };
  }

  editSongById(id, { title, year, performer, genre, duration }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1){
      throw new Error('Gagal memperbarui Lagu, Id tidak ditemukan');
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

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      performer,
      genre,
      duration,
    };
  }

  deleteAlbumByIdHandler(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new Error('Album gagal dihapus, id tidak ditemukan ');
    }

    this._albums.splice(index, 1);
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new Error('Lagu gagal dihapus, id tidak ditemukan ');
    }

    this._songs.splice(index, 1);
  }
}

module.exports = MusicService;