import { Model, createServer } from 'miragejs';

import mockData from './mockData';

export default function createMockServer() {
  createServer({
    models: {
      musics: Model,
    },

    seeds(server) {
      server.db.loadData({ ...mockData });
    },

    routes() {
      this.urlPrefix = 'http://localhost:8000';
      this.namespace = 'musics';
      this.get('', ({ db }) => {
        return {
          total: db.musics.length,
          items: db.musics.map((data) => ({
            id: data.id,
            title: data.title,
            moods: data.moods,
            genre: data.genre,
            public_date: data.public_date,
          })),
        };
      });
      this.get(
        '/:musicId',
        ({ db }, request) => {
          const id = request.params.musicId;
          return {
            url: db.musics.findBy({ id }).url,
          };
        },
        { timing: 2000 },
      );
    },
  });
}
