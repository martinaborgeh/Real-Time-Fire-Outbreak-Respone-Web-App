import React, { useState,useEffect, useRef,useCallback,useMemo} from 'react';


import {
 
    Marker, 
    Popup,
    useMapEvents,
    useMap
   } from 'react-leaflet'

  import "leaflet-control-geocoder/dist/Control.Geocoder.js";
  import L from "leaflet";

  
  


export function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }


export function DraggableMarker() {
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState({
        lat: 51.505,
        lng: -0.09,
      })
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current
          if (marker != null) {
            setPosition(marker.getLatLng())
          }
        },
      }),
      [],
    )
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d)
    }, [])
  
    return (
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlers}
        position={position}
        ref={markerRef}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? 'Marker is draggable'
              : 'Click here to make marker draggable'}
          </span>
        </Popup>
      </Marker>
    )
  }
  

  export function LeafletControlGeocoder() {
    const map = useMap();
  
    useEffect(() => {
      var geocoder = L.Control.Geocoder.nominatim();
      if (typeof URLSearchParams !== "undefined" && window.location.search) {
        // parse /?geocoder=nominatim from URL
        var params = new URLSearchParams(window.location.search);
        var geocoderString = params.get("geocoder");
        if (geocoderString && L.Control.Geocoder[geocoderString]) {
          geocoder = L.Control.Geocoder[geocoderString]();
        } else if (geocoderString) {
          console.warn("Unsupported geocoder", geocoderString);
        }
      }
  
      const control = L.Control.geocoder({
        query: "",
        placeholder: "Search here...",
        defaultMarkGeocode: false,
        geocoder
      })
        .on("markgeocode", function (e) {
          var latlng = e.geocode.center;
          L.marker(latlng)
            .addTo(map)
            .bindPopup(e.geocode.name)
            .openPopup();
          map.fitBounds(e.geocode.bbox);
        })
        .addTo(map);

         return () => {
      if (control) {
        map.removeControl(control);
      }
    };
    }, []);
  
    return null;
  }


  // export const LocateCenterMarkerComponent = ({ setMaxBounds }) => {
  //   const map = useMap();
  //   const current_location = [9.379438,-0.866736]
  
  //   //I will swich back to current location i have required data around
  //   useEffect(() => {
  //     //navigator.geolocation swictch the current_location when using ur current location
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         position => {
  //           const { latitude, longitude } = position.coords;
  //           const userLocation = L.latLng(latitude, longitude);
  
  //           // Add marker at user's location
  //           const marker = L.marker(userLocation).addTo(map);
  
  //           // Define the buffer distances
  //           const initialBufferDistance = 5000; // 5 km in meters
  //           const maxBufferDistance = 8000; // 8 km in meters
  
  //           // Function to calculate bounding box
  //           const calculateBounds = (bufferDistance) => {
  //             return [
  //               [latitude - (bufferDistance / 111320), longitude - (bufferDistance / (111320 * Math.cos(latitude * Math.PI / 180)))],
  //               [latitude + (bufferDistance / 111320), longitude + (bufferDistance / (111320 * Math.cos(latitude * Math.PI / 180)))]
  //             ];
  //           };
  
  //           // Initial buffer bounds
  //           const initialBounds = calculateBounds(initialBufferDistance);
  //           const maxBounds = calculateBounds(maxBufferDistance);
  
  //           // Create a rectangle for the initial buffer
  //           const initialRectangle = L.rectangle(initialBounds, { color: 'blue', fill: null, weight: 1 }).addTo(map);
  
  //           // Zoom to fit the initial buffer rectangle
  //           map.fitBounds(initialRectangle.getBounds());
  
  //           // Create a max buffer rectangle for reference
  //           const maxRectangle = L.rectangle(maxBounds, { color: 'red', fill: null, weight: 1 }).addTo(map);
  
  //           // Update the max bounds state
  //           setMaxBounds(maxRectangle.getBounds());
  
  
  //           // Handle zoom level change to update zoom percentage
        
  //         },
  //         error => {
  //           console.error('Error obtaining geolocation:', error);
  //         }
  //       );
  //     } else {
  //       console.error('Geolocation is not supported by this browser.');
  //     }
  //   }, [map]);
  
  //   return null;
  // };


  export const LocateCenterMarkerComponent = ({ setMaxBounds,setCurrentPosition}) => {
    const map = useMap();

    useEffect(() => {
     
        const current_location = [9.379438, -0.866736]; // Manually set current location
        const [latitude, longitude] = current_location;
        const userLocation = L.latLng(latitude, longitude);

        // Add marker at user's location
        const marker = L.marker(userLocation).addTo(map);

        // Define the buffer distances
        const initialBufferDistance = 5000; // 5 km in meters
        const maxBufferDistance = 8000; // 8 km in meters

        // Function to calculate bounding box
        const calculateBounds = (bufferDistance) => {
            return [
                [latitude - (bufferDistance / 111320), longitude - (bufferDistance / (111320 * Math.cos(latitude * Math.PI / 180)))],
                [latitude + (bufferDistance / 111320), longitude + (bufferDistance / (111320 * Math.cos(latitude * Math.PI / 180)))]
            ];
        };

        // Initial buffer bounds
        const initialBounds = calculateBounds(initialBufferDistance);
        const maxBounds = calculateBounds(maxBufferDistance);

        // Create a rectangle for the initial buffer
        const initialRectangle = L.rectangle(initialBounds, { color: 'blue', fill: null, weight: 1 }).addTo(map);

        // Zoom to fit the initial buffer rectangle
        map.fitBounds(initialRectangle.getBounds());

        // Create a max buffer rectangle for reference
        const maxRectangle = L.rectangle(maxBounds, { color: 'red', fill: null, weight: 1 }).addTo(map);

        // Update the max bounds state
        setMaxBounds(maxRectangle.getBounds());
        setCurrentPosition(current_location)

    }, [map, setMaxBounds,setCurrentPosition]);

    return null;
};

