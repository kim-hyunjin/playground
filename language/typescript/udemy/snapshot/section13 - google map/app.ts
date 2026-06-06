import axios from "axios";

// declare var google: any;

const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "APIKEY";

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number; lng: number } } }[];
    status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const address = addressInput.value;

    //send this to Google's API;
    axios
        .get<GoogleGeocodingResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
                address
            )}&region=kr&key=${GOOGLE_API_KEY}`
        )
        .then((res) => {
            console.log(res.data.status);
            if (res.data.status !== "OK") {
                throw new Error("Could not fetch location!");
            }
            const coordinates = res.data.results[0].geometry.location;
            let map = new google.maps.Map(document.getElementById("map")!, {
                center: { lat: coordinates.lat, lng: coordinates.lng },
                zoom: 16,
            });

            new google.maps.Marker({ position: coordinates, map: map });
        })
        .catch((err) => {
            alert(err.message);
            console.log(err);
        });
}

form.addEventListener("submit", searchAddressHandler);
