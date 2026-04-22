import 'dart:io';

import 'package:favorite_places/env/env.dart';
import 'package:uuid/uuid.dart';

const uuid = Uuid();

class Place {
  final String id;
  final String name;
  final File image;
  final PlaceLocation location;

  Place({
    required this.name,
    required this.image,
    required this.location,
    id
  }) : id = id ?? uuid.v4();

  Place copyWith({String? id, String? name, File? image, PlaceLocation? location}) => Place(
    id: id ?? this.id,
    name: name ?? this.name,
    image: image ?? this.image,
    location: location ?? this.location
  );
}

class PlaceLocation {
  const PlaceLocation({
    required this.latitude,
    required this.longitude,
    required this.address,
  });

  final double latitude;
  final double longitude;
  final String address;

  String get locationImage {
    return 'https://maps.googleapis.com/maps/api/staticmap?center=$latitude,$longitude&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7Clabel:A%7C$latitude,$longitude&key=${Env.googleApiKey}';
  }
}
