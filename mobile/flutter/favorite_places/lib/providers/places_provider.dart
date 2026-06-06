import 'package:favorite_places/db/place_db.dart';
import 'package:favorite_places/models/place.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart' as syspaths;
import 'package:path/path.dart' as path;

final placesProvider = StateNotifierProvider<PlacesNotifier, List<Place>>(
    (ref) => PlacesNotifier());

class PlacesNotifier extends StateNotifier<List<Place>> {
  PlacesNotifier() : super([]);

  PlaceDB db = PlaceDB();

  Future<void> loadPlaces() async {
    state = await db.selectAll();
  }

  void addFavPlace(Place newPlace) async {
    final appDir = await syspaths.getApplicationDocumentsDirectory();
    final filename = path.basename(newPlace.image.path);
    final copiedImage = await newPlace.image.copy('${appDir.path}/$filename');
    final place = newPlace.copyWith(image: copiedImage);

    db.insert(place);
    state = [place, ...state];
  }
}
