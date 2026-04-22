import 'package:favorite_places/add_place_screen.dart';
import 'package:favorite_places/models/place.dart';
import 'package:favorite_places/place_detail_screen.dart';
import 'package:favorite_places/providers/places_provider.dart';
import 'package:favorite_places/widgets/place_list.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PlacesScreen extends ConsumerStatefulWidget {
  const PlacesScreen({super.key});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() {
    return _PlacesScreenState();
  }
}

class _PlacesScreenState extends ConsumerState<PlacesScreen> {
  late Future<void> _placesFuture;

  @override
  void initState() {
    super.initState();
    _placesFuture = ref.read(placesProvider.notifier).loadPlaces();
  }

  void _selectPlace(BuildContext context, Place place) {
    Navigator.of(context).push(
        MaterialPageRoute(builder: (ctx) => PlaceDetailScreen(place: place)));
  }

  void _addPlace(BuildContext context) {
    Navigator.of(context)
        .push(MaterialPageRoute(builder: (ctx) => const AddPlaceScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final places = ref.watch(placesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Your Favorites Places'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              _addPlace(context);
            },
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: FutureBuilder(
          future: _placesFuture,
          builder: (ctx, snapshot) =>
              snapshot.connectionState == ConnectionState.waiting
                  ? const Center(
                      child: CircularProgressIndicator(),
                    )
                  : PlaceList(places: places, onSelectPlace: _selectPlace),
        ),
      ),
    );
  }
}
