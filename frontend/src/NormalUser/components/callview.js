import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NormalUserCallVideoRoom from './VideoRoom'

import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE)

export function NormalUserCallView() {
  const serverbaseurl = backend_server_url;
  const navigate = useNavigate();
  

  useEffect(() => {
    // Check authentication on component mount
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
          // return response_data.json();
          
        }
      })
      .catch(error => {
        console.error('Authorization Error:', error.message);
      });

    // Cleanup function to close WebSocket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [navigate]);

  const admin_id = localStorage.getItem("admin_id")

  return (
    <div>
      <div>
      <NormalUserCallVideoRoom navigate = {navigate}  admin_id = {admin_id} />
      </div>
    </div>
  );
}
