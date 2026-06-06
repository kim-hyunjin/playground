export type LatLng = { lat: number; lng: number };

export class Place {
  id: string = '';
  title: string = '';
  imageUri: string = '';
  address: string = '';
  location: LatLng = { lat: 0, lng: 0 };

  constructor(title: string, imageUri: string, address: string, location: LatLng, id?: string) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = address;
    this.location = location;
    this.id = id ?? new Date().toString() + Math.random().toString();
  }
}
