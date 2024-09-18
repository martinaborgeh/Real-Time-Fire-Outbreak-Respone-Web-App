import React, { useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';

import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE)

export function HomepageView() {
    const serverbaseurl = backend_server_url;
    console.log("serverurl",serverbaseurl)

    const navigate =  useNavigate ()

    useEffect(() => {
        fetch(serverbaseurl + "/accounts/check-if-user-is-authenticated/", {
          method: 'GET',
          credentials: 'include',
          headers: {
            "ngrok-skip-browser-warning":true,
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
            } else if (response_data.ok) {
              console.log(response_data.full_name)
              
              return response_data.json();
            }
          })
          .catch(error => {
            console.error('Authorization Error:', error.message);
          });
      }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="checkifuserisauthorized">
                    <h1>Welcome To homepage View</h1>
                   
                    {/* <Link to="/login">End Call</Link> */}
                </div>
            </form>
        </div>
    );
}