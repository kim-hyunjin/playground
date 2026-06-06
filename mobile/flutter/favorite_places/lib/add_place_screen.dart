import 'dart:io';

import 'package:favorite_places/models/place.dart';
import 'package:favorite_places/providers/places_provider.dart';
import 'package:favorite_places/widgets/image_input.dart';
import 'package:favorite_places/widgets/location_input.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AddPlaceScreen extends ConsumerStatefulWidget {
  const AddPlaceScreen({super.key});

  @override
  AddPlaceScreenState createState() {
    return AddPlaceScreenState();
  }
}

class AddPlaceScreenState extends ConsumerState<AddPlaceScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  File? _pickedImage;
  PlaceLocation? _location;

  void _addPlace() {
    final isValid = _formKey.currentState!.validate();
    if (!isValid || _pickedImage == null || _location == null) {
      // print('isValid $isValid');
      // print('_pickedImage == null ${_pickedImage == null}');
      // print('_location == null ${_location == null}');
      return;
    }
    ref.read(placesProvider.notifier).addFavPlace(Place(
        name: _nameController.text,
        image: _pickedImage!,
        location: _location!));

    Navigator.of(context).pop();
  }

  void _onPickImage(File image) {
    _pickedImage = image;
  }

  void _onSetLocation(PlaceLocation location) {
    _location = location;
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add favorite places'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _nameController,
                    decoration: const InputDecoration(
                      labelText: 'place name',
                    ),
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onBackground,
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please type your favorite place name.';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(
                    height: 16,
                  ),
                  ImageInput(
                    onPickImage: _onPickImage,
                  ),
                  const SizedBox(
                    height: 16,
                  ),
                  LocationInput(
                    onSetLocation: _onSetLocation,
                  ),
                  const SizedBox(
                    height: 16,
                  ),
                  ElevatedButton.icon(
                    onPressed: _addPlace,
                    icon: const Icon(Icons.add),
                    label: const Text('Add Place'),
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
