// Importing user defined modules
import {DraggableMarker,LocationMarker,LeafletControlGeocoder,LocateCenterMarkerComponent} from './react_leaflet_components'
import retrieveOptimalPath from './osm_overpass_road_data'
import React, { useState, useEffect,useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
     MapContainer, 
     TileLayer, 
     LayersControl
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




export function WelcomeMessage() {
  const [welcomemessage, setwelcomemessage] = useState('');
  const [geoJsonLayer, setGeoJsonLayer] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [maxBounds, setMaxBounds] = useState(null);
  const mapRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const serverbaseurl = "http://localhost:8000";
  const navigate = useNavigate();

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

  const generateCacheKey = (bounds, currentPosition) => {
    return JSON.stringify({ bounds, currentPosition });
  };

  const updateData = async () => {
    const map = mapRef.current;
    if (map && maxBounds && currentPosition) {
      const bounds = maxBounds;
      const cacheKey = generateCacheKey(bounds, currentPosition);

      const cachedData = localStorage.getItem(cacheKey);
      console.log(typeof(cachedData))
      if (cachedData && cachedData!=="undefined") {
        console.log("Using cached data",cachedData);
        const data = JSON.parse(cachedData);
        console.log("Using cached data",data)
        console.log("Optimal Path",data.optimal_fire_station_path)
        if (geoJsonLayer) {
          map.removeLayer(geoJsonLayer);
        }
        const newGeoJsonLayer = L.geoJson(data.optimal_fire_station_path,{
          style: function (feature) {
            return {
              color: 'red'
            };
          }
      }).addTo(map);
        setGeoJsonLayer(newGeoJsonLayer);
      } else {
        const data = await retrieveOptimalPath(bounds, currentPosition);
        localStorage.setItem(cacheKey, JSON.stringify(data)); // Store data in localStorage
        console.log("retrieving data from backend",cachedData)
        // if (geoJsonLayer) {
        //   map.removeLayer(geoJsonLayer);
        // }
        // const newGeoJsonLayer = L.geoJson(data).addTo(map);
        // setGeoJsonLayer(newGeoJsonLayer);
      }
    }
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.on('moveend', updateData);
    }
    return () => {
      if (map) {
        map.off('moveend', updateData);
      }
    };
  },[currentPosition,maxBounds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMapReady(true);
    updateData();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="checkifuserisauthorized">
          <input value={welcomemessage} placeholder='Welcome Message' onChange={e => setwelcomemessage(e.target.value)} type="text" name="hello"></input>
          <Link to="/search-for-fireservice">Search For Nearest Fire Station and Call</Link>
        </div>
        <button type="submit">Get Overpass_data</button>
      </form>

      <MapContainer ref={mapRef} style={{ height: "100vh", width: "100vw" }} scrollWheelZoom={true}>
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
      </MapContainer>
    </div>
  );
}
