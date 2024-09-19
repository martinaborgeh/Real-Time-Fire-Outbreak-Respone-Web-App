import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NormalUserCallVideoRoom from './VideoRoom'

import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE)

export function NormalUserCallView() {
  const [userDetails,setUserDetails] = useState(null)
  const [isLoading,setIsLoading] = useState(true)
  const serverbaseurl = backend_server_url;
  const navigate = useNavigate();
  

  useEffect(() => {
    // Check authentication on component mount
    fetch(serverbaseurl + "/fire-outbreak/call-view/", {
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
          if(response_data.status ===220){
            setUserDetails({
              userID : response_data.user_id,
              full_name : response_data.full_name
            })
            setIsLoading(false)
          }else{
            console.log("Try again with valid logins")
            navigate("/login-normal-user")
          }
          
        
          
        }
      })
      .catch(error => {
        console.error('Authorization Error:', error.message);
      });

    // Cleanup function to close WebSocket connection on unmount

  }, [navigate]);

  const admin_id = localStorage.getItem("admin_id")

  return (
    <div>
      <div>
      {isLoading ? <p>Loading...</p>: <NormalUserCallVideoRoom navigate = {navigate}  admin_id = {admin_id} userDetails = {userDetails} />}
      </div>
    </div>
  )
  }