require('dotenv').config();
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('./src/utils');
const InvariantError = require('./src/exceptions/invariantError');

const pool = new Pool();
const getAlbumById = async (id) => {
  const albumQuery = {
    text: 'select * from albums where id = $1',
    values: [id],
  };
  const resultAlbum = await pool.query(albumQuery);
  const { name, year } = resultAlbum.rows[0];
  const songQuery = {
    text: 'select * from songs where album_id = $1',
    values: [id],
  };
  const resultSong = await pool.query(songQuery);
  const songs = resultSong.rows.map(mapDBToModel);

  const result = {
    id, name, year, songs,
  };
  await console.log(result);
  return result.rows;
};

const addAlbum = async (name, year) => {
  const id = `album-${nanoid(16)}`;
  const query = {
    text: 'insert into albums values($1, $2, $3) returning id',
    values: [id, name, year],
  };
  const result = await pool.query(query);
  console.log(result);

  if (!result.rows[0].id) {
    throw new InvariantError('Album gagal ditambahkan.');
  }
  return result.rows[0].id;
};

addAlbum('viva', 2005);
