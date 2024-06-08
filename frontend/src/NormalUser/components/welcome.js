import React, { useState, useEffect,useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { MapContainer, TileLayer, useMap } from 'react-leaflet'

// Importing user defined modules
// import { useAuthorization } from "../resusable_function"

export function WelcomeMessage() {
    const [welcomemessage, setwelcomemessage] = useState('');

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

            if (!response_data.ok){
                    if(response_data.status ===401){
                        console.log("Not Authorized, Enter V")
                    }else if (response_data.status === 400){
                        console.log("Something Bad Happened, We would resolve it soon")
                        navigate("/error-message");
                    }
            }else if (response_data.ok) {
                console.log(response_data.status)
                
                // console.log("refresh",response_data.refresh)
            //    return response_data.json()
            }
        
        })
        .catch(error => {
            console.error('Authorization Error:', error.message);
            return false;
        });
    
        
    }, []); // Empty dependency array ensures this effect runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="checkifuserisauthorized">
                    <input value={welcomemessage} placeholder='Welcome Message' onChange={e => setwelcomemessage(e.target.value)} type="text" name="hello"></input>
                    <Link to="/search-for-fireservice">Search For Nearest Fire Station and Call</Link>
                </div>
            </form>
        </div>
    );
}