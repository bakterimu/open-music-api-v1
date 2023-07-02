/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/invariantError');
const NotFoundError = require('../../exceptions/notFoundError');
const { mapDBToModel } = require('../../utils');

class SongsService {
  constructor() {
    this._songPool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const query = {
      text: 'insert into songs values($1, $2, $3, $4, $5, $6, $7) returning id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._songPool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    const query = {
      text: 'select id, title, performer from songs',
    };
    if ((title && !performer) || (!title && performer)) {
      if (title) {
        query.text += ' where lower(title) like $1';
        query.values = [`${title.toLowerCase()}%`];
      }
      if (performer) {
        query.text += ' where lower(performer) like $1';
        query.values = [`${performer.toLowerCase()}%`];
      }
    } else if (title && performer) {
      query.text += ' where lower(title) like $1 and lower(performer) like $2';
      query.values = [`${title.toLowerCase()}%`, `${performer.toLowerCase()}%`];
    }
    const result = await this._songPool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan.');
    }

    return result.rows.map(mapDBToModel);
  }

  async getSongById({ id }) {
    const query = {
      text: 'select * from songs where id = $1',
      values: [id],
    };
    const result = await this._songPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan.');
    }
    return result.rows.map(mapDBToModel)[0];
  }

  async editSongById({ id }, {
    title, year, genre, performer, duration, albumId,
  }) {
    const query = {
      text: 'update songs set title=$1, year=$2, genre=$3, performer=$4, duration=$5, album_id=$6 where id=$7 returning id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._songPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal ditemukan');
    }
  }

  async deleteSongById({ id }) {
    const query = {
      text: 'delete from songs where id = $1 returning id',
      values: [id],
    };
    const result = await this._songPool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan.');
    }
  }
}

module.exports = SongsService;
