import 'package:favorite_places/models/place.dart';
import 'package:flutter/material.dart';

class PlaceList extends StatelessWidget {
  const PlaceList({
    super.key,
    required this.places,
    required this.onSelectPlace,
  });

  final List<Place> places;
  final void Function(BuildContext context, Place place) onSelectPlace;

  @override
  Widget build(BuildContext context) {
    final textStyle = Theme.of(context)
        .textTheme
        .titleMedium!
        .copyWith(color: Theme.of(context).colorScheme.onBackground);

    Widget content = Center(
      child: Text(
        'No items, please add your favorite places',
        style: textStyle,
      ),
    );

    if (places.isNotEmpty) {
      content = ListView.builder(
        itemCount: places.length,
        itemBuilder: (ctx, index) => ListTile(
          leading: CircleAvatar(
            radius: 26,
            backgroundImage: FileImage(places[index].image),
          ),
          title: Text(
            places[index].name,
            style: textStyle,
          ),
          subtitle: Text(
            places[index].location.address,
            style: Theme.of(context)
                .textTheme
                .bodySmall!
                .copyWith(color: Theme.of(context).colorScheme.onBackground),
          ),
          onTap: () {
            onSelectPlace(context, places[index]);
          },
        ),
      );
    }

    return content;
  }
}
