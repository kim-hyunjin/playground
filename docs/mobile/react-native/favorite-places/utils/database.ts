import * as SQLite from 'expo-sqlite';
import { Place } from '../models/place';

const database = SQLite.openDatabase('places.db');

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS places (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          imageUri TEXT NOT NULL,
          address TEXT NOT NULL,
          lat REAL NOT NULL,
          lng REAL NOT NULL
        )
      `,
        [],
        (tx, resultSet) => {
          resolve(true);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

  return promise;
}

export function insertPlace(place: Place) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)
      `,
        [place.title, place.imageUri, place.address, place.location.lat, place.location.lng],
        (_, resultSet) => {
          console.log(resultSet);
          resolve(resultSet);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

  return promise;
}

export function fetchPlaces() {
  const promise = new Promise<Place[]>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        SELECT * FROM places
      `,
        [],
        (_, result) => {
          const places = result.rows._array.map(
            (data) =>
              new Place(
                String(data.title),
                String(data.imageUri),
                String(data.address),
                {
                  lat: Number(data.lat),
                  lng: Number(data.lng),
                },
                String(data.id)
              )
          );
          resolve(places);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

  return promise;
}

export function fetchPlaceDetails(id: string) {
  const promise = new Promise<Place>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `
        SELECT * FROM places WHERE id = ?
      `,
        [id],
        (_, result) => {
          console.log({ result });
          const raw = result.rows._array[0];
          const place = new Place(
            String(raw.title),
            String(raw.imageUri),
            String(raw.address),
            { lat: Number(raw.lat), lng: Number(raw.lng) },
            String(raw.id)
          );
          resolve(place);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });

  return promise;
}
