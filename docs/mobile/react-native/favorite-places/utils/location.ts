import { LatLng } from "../models/place";

const GOOGLE_API_KEY = "";

const STATIC_MAP_API_URL = "https://maps.googleapis.com/maps/api/staticmap";
export function getMapPreview({ lat, lng }: LatLng) {
  const imagePreview = `${STATIC_MAP_API_URL}?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap
  &markers=color:red%7Clabel:S%7C${lat},${lng}
  &key=${GOOGLE_API_KEY}`;

  return imagePreview;
}

const GEOCODE_API_URL = "https://maps.googleapis.com/maps/api/geocode/json";
export async function getAddress({ lat, lng }: LatLng) {
  const url = `${GEOCODE_API_URL}?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("failed to fetch address");
  }

  const data = await res.json();
  const address = String(data.results[0].formatted_address);

  return address;
}
