// Importing user defined modules
import {DraggableMarker,LocationMarker,UpdateDataComponent,LeafletControlGeocoder,LocateCenterMarkerComponent} from './react_leaflet_components'
import React, { useState, useEffect,useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
     MapContainer, 
     TileLayer, 
     LayersControl,
     Marker
    } from 'react-leaflet'

import L from 'leaflet';

const { BaseLayer } = LayersControl;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
      iconUrl: require('leaflet/dist/images/marker-icon.png'),
      shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });

  

// import { useAuthorization } from "../resusable_function"




export function MapViewOptimalPathStationsHydrants(){
  const [maxBounds, setMaxBounds] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);

  const serverbaseurl = "http://localhost:8000";
  const navigate = useNavigate()

  useEffect(() => {
    fetch(serverbaseurl + "/accounts/check-if-user-is-authenticated/", {
      method: 'GET',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response_data => {
        if (!response_data.ok) {
          if (response_data.status === 401) {
            console.log("Not Authorized, Enter V");
          } else if (response_data.status === 400) {
            console.log("Something Bad Happened, We would resolve it soon");
            navigate("/error-message");
          }
        } else {
          return response_data.json();
        }
      })
      .catch(error => {
        console.error('Authorization Error:', error.message);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setMapReady(true);
    // updateData();
  };

  return (
    <div class ="bg-[#dfa674]">
      <h1 class="font-bold text-3xl text-[#002D74]">Real Time Fire Outreak Response</h1>
      <p class="sm:text-lg md:text-lg text-sm lg:text-lg mt-4 text-white">Choose the closest Station and start a Video Call</p>

      <MapContainer    style={{ height: "100vh", width: "100vw" }} scrollWheelZoom={true}>
        <LayersControl position="topright">
          <BaseLayer checked name="Google Satellite">
            <TileLayer
              url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.cn/copyright">Google Satellite</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </BaseLayer>
          <BaseLayer name="Google Satellite Hybrid" checked>
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              attribution='&copy; <a href="https://www.google.com/copyright">Google Satellite Hybrid</a> contributors'
            />
          </BaseLayer>
        </LayersControl>
        <LeafletControlGeocoder />
        <LocateCenterMarkerComponent setMaxBounds={setMaxBounds} setCurrentPosition={setCurrentPosition} />

        {/* Render UpdateDataComponent */}
        <UpdateDataComponent
          maxBounds={maxBounds}
          currentPosition={currentPosition}
   
          
        />
      
      </MapContainer>
    </div>
  );
};

