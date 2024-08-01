import axios from 'axios';
import { bounds } from 'leaflet';
// import osmtogeojson from 'osmtogeojson';

// async function fetchRoadDataOverpass(bounds) {
//   const query = `
//     [out:json];
//     (
//       way(${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
//     );
//     (._;>;);
//     out body;
//   `;
//   try {
//     const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     });
//     console.log("overpass data",osmtogeojson(response.data))
//     return osmtogeojson(response.data);
//   } catch (error) {
//     if (error.response && error.response.status === 429) {
//       console.error('Rate limit exceeded, falling back to local datastore.');
//     } else {
//       console.error('Error fetching road data from Overpass API:', error);
//     }
//     throw error;
//   }
// }

// this  function retrieves optimal path, along with close fire stations and fire hydrants 


async function retrieveOptimalPath(map_bounds,current_location) {
  const serverbaseurl = "http://16.171.57.5:8000";


  try {
    const bounds = {south:map_bounds.getSouth(),east:map_bounds.getEast(),north:map_bounds.getNorth(),west:map_bounds.getWest()},
    starting_point={lat:current_location[0],lon: current_location[1]}
    console.log("bounds",bounds)
    console.log("starting point",starting_point)
    const response = await axios.post(
      serverbaseurl+"/fire-outbreak/search-best-optimal-path/", 
      {bounds,starting_point},
       
      

    );
    console.log("Optimal Path",response.data)
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error Message:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Config:', error.config);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  
  }
}




export default retrieveOptimalPath




