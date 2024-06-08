import React, { useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';

export function AdminEndCallView() {
    const [welcomemessage, setwelcomemessage] = useState('');
    const serverbaseurl = "http://localhost:8000";

    const navigate =  useNavigate ()

    // useEffect(() => {
    //     const handleAuthorization = async (accessToken, refreshToken) => {
    //         try {
    //             const response = await fetch(serverbaseurl + "/patient-doctor-matching/end-call/", {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': `Bearer ${accessToken}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({ "meeting_id": 'jgghg' }),
    //             });

    //             if (!response.ok) {
    //                 if (response.status === 401) {
    //                     const newAccessToken = await refreshAccessToken(refreshToken);
    //                     if (newAccessToken) {
    //                         return await handleAuthorization(newAccessToken, refreshToken);
    //                     } else {
    //                         console.log("No refresh token available. Redirecting to login.");
    //                         navigate("/login-normal-user")
    //                         throw new Error('Not authorized');
    //                     }
    //                 } else if (response.status === 400) {
    //                     console.log("Bad request error. Ignoring.");
    //                     return response.json();
    //                 }
    //             } else {
    //                 return response.json();
    //             }
    //         } catch (error) {
    //             console.error('Authorization Error:', error.message);
    //         }
    //     };

    //     const refreshAccessToken = async (refreshToken) => {
    //         // Implement token refresh logic
    //     };

    //     if (access) {
    //         // If access token exists, initiate authorization
    //         handleAuthorization(access, refreshToken);
    //     } else {
    //         // Redirect to login page or handle not logged in state
    //     }
    // }, [navigate]); // Empty dependency array ensures this effect runs only once on mount

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     // Handle form submission
    // };

    return (
        <div>
            <form >
                <div className="adminpage">
                    <input value={welcomemessage} placeholder='Welcome Message' onChange={e => setwelcomemessage(e.target.value)} type="text" name="hello"></input>
                    <Link to="/login">EndCall</Link>
                </div>
            </form>
        </div>
    );
}