require('dotenv').config();
const { Pool } = require('pg');
const { mapDBToModel } = require('./src/utils');

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

getAlbumById('haha');
