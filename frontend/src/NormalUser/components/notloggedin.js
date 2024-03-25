import React, { useState, useEffect} from "react"
import { Link,useNavigate } from 'react-router-dom'



export function NotLoggedIn(){

    
    const [message, setmessage] = useState('')
 
    const navigate = useNavigate()
  
    useEffect(() => {
        setmessage("Not Logged In, Redirecting to Login Page")
        const timer = setTimeout(() => {
          // Redirect user to a specific route after 5 seconds
          navigate('/new-route');
        }, 5000);
    
        // Clean-up function to clear the timeout
        return () => clearTimeout(timer);
      }, [navigate]);


    return(
        <div>
            <div className = "sellerformcontainer">
                <input value={message} placeholder='Message' onChange={e=>setmessage(e.target.value)} type ="text" name = "hello"></input>
                <Link to="/login-normal-user">Go Back to Login Page</Link>
            </div>
      </div>
      
    )
}

