/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/invariantError');
const { mapDBToModel } = require('../../utils');
const NotFoundError = require('../../exceptions/notFoundError');

class AlbumsService {
  constructor() {
    this._albumPool = new Pool();
  }

  addAlbum = async ({ name, year }) => {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'insert into albums values ($1, $2, $3) returning id',
      values: [id, name, year],
    };
    const result = await this._albumPool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan.');
    }
    return result.rows[0].id;
  };

  getAlbumById = async (id) => {
    const albumQuery = {
      text: 'select * from albums where id = $1',
      values: [id],
    };
    const resultAlbum = await this._albumPool.query(albumQuery);

    if (!resultAlbum) {
      throw new NotFoundError('Album tidak ditemukan.');
    }
    const { name, year } = resultAlbum.rows[0];
    const songQuery = {
      text: 'select id, title, performer from songs where album_id = $1',
      values: [id],
    };
    const resultSong = await this._albumPool.query(songQuery);
    const songs = resultSong.rows.map(mapDBToModel);

    const result = {
      id, name, year, songs,
    };
    return result;
  };

  editAlbumById = async (id, { name, year }) => {
    const query = {
      text: 'update albums set name = $1, year = $2 where id = $3 returning id',
      values: [name, year, id],
    };
    const result = await this._albumPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal ditemukan.');
    }
  };

  deleteAlbumById = async (id) => {
    const query = {
      text: 'delete from albums where id = $1',
      values: [id],
    };
    const result = await this._albumPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Catatan gagal dihapus. Album tidak ditemukan.');
    }
  };
}

module.exports = AlbumsService;
