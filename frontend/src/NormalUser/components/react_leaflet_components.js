import React, { memo,useState,useEffect, useRef,useCallback,useMemo} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import retrieveOptimalPath from './osm_overpass_road_data';


import {
 
    Marker, 
    Popup,
    useMapEvents,
    useMap
   } from 'react-leaflet'

   import MarkerClusterGroup from 'react-leaflet-cluster';

  import "leaflet-control-geocoder/dist/Control.Geocoder.js";
  import L, { bounds } from "leaflet";

  // const yellowIcon = new L.Icon({
  //   iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  //   iconRetinaUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  //   iconSize: [25, 41],
  //   iconAnchor: [12, 41],
  //   popupAnchor: [1, -34],
  //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  //   shadowSize: [41, 41]
  // });

  function CustomColor(color) {
    return new L.Icon({
      iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      iconRetinaUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41]
    });
  }





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
     
        const current_location = [9.399497, -0.866736]; // Manually set current location
        const [latitude, longitude] = current_location;
        const userLocation = L.latLng(latitude, longitude);

        // Add marker at user's location
        const marker = L.marker(userLocation).addTo(map);

        // Define the buffer distances
        // const initialBufferDistance = 5000; // 5 km in meters
        const maxBufferDistance = 5000; // 8 km in meters

        // Function to calculate bounding box
        const calculateBounds = (bufferDistance) => {
            return [
                [latitude - (bufferDistance / 111320), longitude - (bufferDistance / (111320 * Math.cos(latitude * Math.PI / 180)))],
                [latitude + (bufferDistance / 111320), longitude + (bufferDistance / (111320 * Math.cos(latitude * Math.PI / 180)))]
            ];
        };

        // Initial buffer bounds
        // const initialBounds = calculateBounds(initialBufferDistance);
        const maxBounds = calculateBounds(maxBufferDistance);

        // Create a rectangle for the initial buffer
        // const initialRectangle = L.rectangle(initialBounds, { color: 'blue', fill: null, weight: 1 }).addTo(map);

        // Zoom to fit the initial buffer rectangle
        // map.fitBounds(initialRectangle.getBounds());

        // Create a max buffer rectangle for reference
        const maxRectangle = L.rectangle(maxBounds, { color: '#dfa674', fill: null, weight: 1 }).addTo(map);
        map.fitBounds(maxRectangle.getBounds())
      
        // Update the max bounds state
        setMaxBounds(maxRectangle.getBounds());
        setCurrentPosition(current_location)

    }, [map, setMaxBounds,setCurrentPosition]);

    return null;
};





export const UpdateDataComponent = memo(({maxBounds, currentPosition}) => {
  const fireStationOptimalPathGeoJsonLayer1  = useRef(null);
  const fireStationOptimalPathGeoJsonLayer2 = useRef(null);
  const fireStationOptimalPathGeoJsonLayer3 = useRef(null);
  const fireHydrantOptimalPathGeoJsonLayer1  = useRef(null);
  const fireHydrantOptimalPathGeoJsonLayer2 = useRef(null);
  const fireHydrantOptimalPathGeoJsonLayer3  = useRef(null);
  const fireHydrantStationsGeoJsonLayer = useRef(null);
  const fireStationsGeoJsonLayer = useRef(null)

  const navigate =  useNavigate ()

  const map = useMap()
  
  function handleStartVideo(Admin_id){
    localStorage.setItem("admin_id",Admin_id)
    navigate("/call-view")
  }

  const generateCacheKey = (bounds, currentPosition) => {
    return JSON.stringify({ bounds, currentPosition });
  };


  const addGeoJonToMap=useCallback(async(data)=>{
    if (fireStationOptimalPathGeoJsonLayer1.current!==null && map.hasLayer(fireStationOptimalPathGeoJsonLayer1.current)) {
      
     
    }else{
    const new_firehystations_optimalpath_GeoJsonLayer1 = L.geoJson(data.optimal_fire_station_paths[0], {

      style: { color: 'red' },
    }).addTo(map);
    const fire_station_popupContent1 = `
    <div >
      <strong>Optimal Path Length:</strong> ${data.optimal_fire_station_paths[0].properties.path_length.toFixed(2)} km
    </div>`;
    new_firehystations_optimalpath_GeoJsonLayer1.bindPopup(fire_station_popupContent1);
    fireStationOptimalPathGeoJsonLayer1.current=new_firehystations_optimalpath_GeoJsonLayer1;
  }

    if (fireStationOptimalPathGeoJsonLayer2.current!==null && map.hasLayer(fireStationOptimalPathGeoJsonLayer2.current)) {
   
      // map.removeLayer(fireStationOptimalPathGeoJsonLayer2);
    }else{
    const new_firehystations_optimalpath_GeoJsonLayer2 = L.geoJson(data.optimal_fire_station_paths[1], {
      style: { color: 'red' },
    }).addTo(map);
    const fire_station_popupContent2= `
    <div>
      <strong>Optimal Path Length:</strong> ${data.optimal_fire_station_paths[1].properties.path_length.toFixed(2)} km
    </div>`;
    new_firehystations_optimalpath_GeoJsonLayer2.bindPopup(fire_station_popupContent2);
    fireStationOptimalPathGeoJsonLayer2.current=new_firehystations_optimalpath_GeoJsonLayer2
    }


    if (fireStationOptimalPathGeoJsonLayer3.current!==null && map.hasLayer(fireStationOptimalPathGeoJsonLayer3.current)) {
    
      // map.removeLayer(fireStationOptimalPathGeoJsonLayer3);
    }else{
    const new_firehystations_optimalpath_GeoJsonLayer3 = L.geoJson(data.optimal_fire_station_paths[2], {
      style: { color: 'red' },
    }).addTo(map);
    const fire_station_popupContent3= `
    <div>
      <strong>Optimal Path Length:</strong> ${data.optimal_fire_station_paths[2].properties.path_length.toFixed(2)} km
    </div>`;
    new_firehystations_optimalpath_GeoJsonLayer3.bindPopup(fire_station_popupContent3);
    fireStationOptimalPathGeoJsonLayer3.current=new_firehystations_optimalpath_GeoJsonLayer3
  }
    
    if (fireHydrantOptimalPathGeoJsonLayer1.current!==null && map.hasLayer(fireHydrantOptimalPathGeoJsonLayer1.current)) {
     
      // map.removeLayer(fireHydrantOptimalPathGeoJsonLayer1);
    }else{
    const new_firehydrants_optimalpath_GeoJsonLayer1 = L.geoJson(data.optimal_hydrant_paths[0], {
      style: { color: 'yellow' },
    }).addTo(map);
    const fire_hydrant_popupContent1= `
    <div>
      <strong>Optimal Path Length:</strong> ${data.optimal_hydrant_paths[0].properties.path_length.toFixed(2)} km
    </div>`;
    new_firehydrants_optimalpath_GeoJsonLayer1.bindPopup(fire_hydrant_popupContent1);
    fireHydrantOptimalPathGeoJsonLayer1.current=new_firehydrants_optimalpath_GeoJsonLayer1;
  }

    if (fireHydrantOptimalPathGeoJsonLayer2.current!==null && map.hasLayer(fireHydrantOptimalPathGeoJsonLayer2.current)) {
      
      // map.removeLayer(fireHydrantOptimalPathGeoJsonLayer2);
    }else{
    const new_firehydrants_optimalpath_GeoJsonLayer2 = L.geoJson(data.optimal_hydrant_paths[1], {
      style: { color: 'yellow' },
    }).addTo(map);
    const fire_hydrant_popupContent2= `
    <div>
      <strong>Optimal Path Length:</strong> ${data.optimal_hydrant_paths[1].properties.path_length.toFixed(2)} km
    </div>`;
    new_firehydrants_optimalpath_GeoJsonLayer2.bindPopup(fire_hydrant_popupContent2);
    fireHydrantOptimalPathGeoJsonLayer2.current=new_firehydrants_optimalpath_GeoJsonLayer2;
  }

    if (fireHydrantOptimalPathGeoJsonLayer3.current!==null && map.hasLayer(fireHydrantOptimalPathGeoJsonLayer3.current)) {
      
      // map.removeLayer(fireHydrantOptimalPathGeoJsonLayer3);
    }else{
    const new_firehydrants_optimalpath_GeoJsonLayer3 = L.geoJson(data.optimal_hydrant_paths[2], {
      style: { color: 'yellow' },
    }).addTo(map);
  
    const fire_hydrant_popupContent3= `
    <div>
      <strong>Optimal Path Length:</strong> ${data.optimal_hydrant_paths[2].properties.path_length.toFixed(2)} km
    </div>`;
    new_firehydrants_optimalpath_GeoJsonLayer3.bindPopup(fire_hydrant_popupContent3);
    fireHydrantOptimalPathGeoJsonLayer3.current=new_firehydrants_optimalpath_GeoJsonLayer3;
  }

    
    if (fireHydrantStationsGeoJsonLayer.current!==null && map.hasLayer(fireHydrantStationsGeoJsonLayer.current)) {
    
      // map.removeLayer(fireHydrantStationsGeoJsonLayer);
    }else{
    const new_firehydrants_stations_GeoJsonLayer = L.geoJson(data.fire_hydrants, {
      pointToLayer: (feature, latlng) => {
        const marker = L.marker(latlng, { icon: CustomColor('yellow') });
        marker.bindPopup(`
          <div>
            <strong>Hydrant Station ID:</strong> ${feature.properties.station_id}<br/>
            <strong>Location:</strong> ${feature.properties.location}<br/>
            <strong>Condition:</strong> ${feature.properties.condition}<br/>
            <strong>Type of Hydrant:</strong> ${feature.properties.type_of_hydrant}
          </div>
        `);
        return marker;
      }
    }).addTo(map);
    fireHydrantStationsGeoJsonLayer.current=new_firehydrants_stations_GeoJsonLayer;
  }

    if (fireStationsGeoJsonLayer.current!==null && map.hasLayer(fireStationsGeoJsonLayer.current)) {
        
      // map.removeLayer(fireStationsGeoJsonLayer);

     
    }else{
    const new_firestations_GeoJsonLayer = L.geoJson(data.fire_stations, {
      pointToLayer: (feature, latlng) => {
        const marker = L.marker(latlng, { icon: CustomColor('red') });
        marker.bindPopup(`
          <div>
            <strong>Fire Station ID:</strong> ${feature.properties.station_id}<br/>
            <strong>Location:</strong> ${feature.properties.location}<br/>
            <strong>Number of Staff:</strong> ${feature.properties.number_of_staff}<br/>
            <strong>Number of Fire Tenders:</strong> ${feature.properties.number_of_fire_tender}<br/>
            <strong>Number of Portable Pumps:</strong> ${feature.properties.number_of_portable_pumb}<br/>
            <strong>Number of Recovery Tracks:</strong> ${feature.properties.number_of_recovery_track}<br/>
            <strong>Number of Water Tankers:</strong> ${feature.properties.number_of_water_tanker}<br/>
            <button onclick  = "handleStartVideo('${feature.properties.user_id}')" style = "margin-left:40px;margin-top:10px;font-weight: 300;color:white;width:120px;padding-top: 0.4rem;border-radius: 0.75rem;padding-left:0.3rem;padding-right:0.3rem;padding-bottom: 0.4rem;background-color:#002D74">Start Video Call</button>
          </div>
        `);
        return marker;
      }
    }).addTo(map);
    fireStationsGeoJsonLayer.current=new_firestations_GeoJsonLayer;
  }
})




  const updateData = useCallback(async () => {

    if (map && maxBounds && currentPosition) {
      const bounds = maxBounds;
      const cacheKey = generateCacheKey(bounds, currentPosition);

      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData && cachedData !== "undefined") {
        // console.log(cachedData)
        const data = JSON.parse(cachedData);
       
        await addGeoJonToMap(data)
      } else {
        const data = await retrieveOptimalPath(bounds, currentPosition);
        localStorage.setItem(cacheKey, JSON.stringify(data)); // Store data in localStorage
        data!==undefined? await addGeoJonToMap(data):console.log("data is ",data)
      }
    }
  },[maxBounds,currentPosition]);

  // useEffect(() =>{



  // },)

  useEffect(() => {
    updateData()

  //   if (map) {
      
  //     map.on('reload', updateData);
  //     map.on('moveend', updateData);
  //   }
  //   return () => {
  //     if (map) {
  //       map.off('reload', updateData);
  //       map.off('moveend', updateData);
  //     }
  //   };
  },[map,maxBounds,currentPosition]);

  return null; // UpdateDataComponent doesn't render anything directly
});



