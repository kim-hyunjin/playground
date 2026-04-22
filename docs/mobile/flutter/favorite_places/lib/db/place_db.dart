import 'dart:io';

import 'package:favorite_places/models/place.dart';
import 'package:sqflite/sqflite.dart' as sql;
import 'package:sqflite/sqlite_api.dart';
import 'package:path/path.dart' as path;

const String tablePlace = 'user_places';
const String columnId = 'id';
const String columnTitle = 'title';
const String columnImage = 'image';
const String columnLat = 'lat';
const String columnLng = 'lng';
const String columnAddress = 'address';

Future<Database> _getDatabase() async {
  final dbPath = await sql.getDatabasesPath();
  final db = await sql.openDatabase(
    path.join(dbPath, 'places.db'),
    version: 1,
    onCreate: (db, version) async {
      await db.execute(
          'CREATE TABLE $tablePlace ($columnId TEXT PRIMARY KEY, $columnTitle TEXT, $columnImage TEXT, $columnLat REAL, $columnLng REAL, $columnAddress TEXT)');
    },
  );

  return db;
}

class PlaceDB {
  Future<List<Place>> selectAll() async {
    final db = await _getDatabase();
    final data = await db.query(tablePlace);

    return data
        .map(
          (row) => _fromMap(row),
        )
        .toList();
  }

  Future<Place> insert(Place place) async {
    final db = await _getDatabase();
    await db.insert('user_places', _toMap(place));
    return place;
  }

  Place _fromMap(Map<String, Object?> map) {
    return Place(
      id: map[columnId] as String,
      name: map[columnTitle] as String,
      image: File(map[columnImage] as String),
      location: PlaceLocation(
        latitude: map[columnLat] as double,
        longitude: map[columnLng] as double,
        address: map[columnAddress] as String,
      ),
    );
  }

  Map<String, Object?> _toMap(Place place) {
    return {
      columnId: place.id,
      columnTitle: place.name,
      columnImage: place.image.path,
      columnLat: place.location.latitude,
      columnLng: place.location.longitude,
      columnAddress: place.location.address,
    };
  }
}
