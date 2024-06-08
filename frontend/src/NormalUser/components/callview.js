import React, { useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';

export function NormalUserCallView() {
    const [welcomemessage, setwelcomemessage] = useState('');
    const serverbaseurl = "http://localhost:8000";

    const navigate =  useNavigate ()

    useEffect(() => {
        const handleAuthorization = async () => {
            try {
                const response = await fetch(serverbaseurl + "/accounts/check-if-user-is-authenticated/", {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        const refreshToken= response.refresh
                        const newAccessToken = await refreshAccessToken(refreshToken);
                        if (newAccessToken) {
                            return await handleAuthorization();
                        } else {
                            console.log("No refresh token available. Redirecting to login.");
                            navigate("/not-logged-in-message")
                            throw new Error('Not authorized');
                        }
                    } else if (response.status === 400) {
                        console.log("Bad request error. Ignoring.");
                        return response.json();
                    }
                } else {
                    return response.json();
                }
            } catch (error) {
                console.error('Authorization Error:', error.message);
            }
        };

        const refreshAccessToken = async (refreshToken) => {
            // Implement token refresh logic
        };

    
            // If access token exists, initiate authorization
        handleAuthorization();
        
    }, [navigate]); // Empty dependency array ensures this effect runs only once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="checkifuserisauthorized">
                    <input value={welcomemessage} placeholder='Welcome Message' onChange={e => setwelcomemessage(e.target.value)} type="text" name="hello"></input>
                    <Link to="/login">End Call</Link>
                </div>
            </form>
        </div>
    );
}