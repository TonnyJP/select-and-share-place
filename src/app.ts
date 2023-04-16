import axios from 'axios';
import { Loader } from "@googlemaps/js-api-loader";
import { google } from "google-maps";

declare var google : google;

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;
const GOOGLE_API_KEY = ""// value in config;

type GoogleGeocodingResponse = {
    results: {geometry: {location: {lat: number, lng: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
}

const loader = new Loader({
    apiKey: GOOGLE_API_KEY,
    version: "weekly"
});

const searchAddressHandler = (event: Event) => {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`)
    .then(res => {
        if(res.data.status !== 'OK'){
            console.log(res.data.status)
            throw new Error('Could not fetch location!');
        }
        const coordinates = res.data.results[0].geometry.location;
        loader.load().then(() => {
            const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: coordinates,
              zoom: 16,
            });
            
            new google.maps.Marker({position: coordinates, map: map})
        });
    })
    .catch(err => {
        console.log(err)
    });
}

form.addEventListener('submit', searchAddressHandler)