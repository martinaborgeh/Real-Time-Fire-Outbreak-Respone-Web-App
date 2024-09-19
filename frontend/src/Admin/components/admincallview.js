import React, { useRef,useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';


import AdminVideoRoom from './VideoRoom'

import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE)

export function AdminCallView() {
    const [userDetails,setUserDetails] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
 
    const serverbaseurl = backend_server_url;

    const navigate =  useNavigate ()

    useEffect(() => {
        fetch(serverbaseurl + "/fire-outbreak/call-view/", {
          method: 'GET',
          credentials: 'include',
          headers: {
            "ngrok-skip-browser-warning":true,
            "Content-Type": "application/json",
          },
        })
          .then(response_data => {
            console.log("ok",response_data.status)
            if (!response_data.ok) {
              if (response_data.status === 401) {
                console.log("Not Authorized, Enter V");
              } else if (response_data.status === 400) {
                console.log("Something Bad Happened, We would resolve it soon");
                // navigate("/error-message");
              }
            } else if (response_data.ok ) {
                if(response_data.status ===210){
                  setUserDetails({
                    userID : response_data.user_id,
                    full_name : response_data.full_name
                  })
                  setIsLoading(false)
                }else{
                  console.log("Try again with valid logins")
                  navigate("/login-admin-user")
                }
                
                
             
              // return response_data.json();
            }
          })
          .catch(error => {
            console.error('Authorization Error:', error.message);
          });
      }, [navigate]);; // Empty dependency array ensures this effect runs only once on mount



    return (
        <div>
            
            <div>
             
           {isLoading? <p>Loading...</p>: <AdminVideoRoom navigate = {navigate} userDetails = {userDetails} /> } 
            </div>
        </div>
    );
}

export default AdminCallView;