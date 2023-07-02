require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const songs = require('./api/songs');
const AlbumsService = require('./services/albums/AlbumsService');
const AlbumValidator = require('./validator/albums');
const SongsService = require('./services/songs/SongsService');
const SongsValidator = require('./validator/songs');
const ClientError = require('./exceptions/clientError');

const start = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // penangan client error secara internal
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // penangan client error dari native hapi seperti 404
      if (!response.isServer) {
        return h.continue;
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: response.message,
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error maka lanjut
    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

start();
