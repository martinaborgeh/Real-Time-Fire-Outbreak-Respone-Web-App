import React, { useState, useEffect} from "react"
import { Link } from 'react-router-dom'



export function ErrorMessage(){

    
    const [errormessage, seterrormessage] = useState('')

  
    useEffect(() => {
        // Function to fetch data
        seterrormessage("Something Bad Happened, retry again")
},[errormessage])       
    return(
        <div>
           
            <div className = "sellerformcontainer">
                <input value={errormessage} placeholder='Error Message' onChange={e=>seterrormessage(e.target.value)} type ="text" name = "hello"></input>
                <Link to="/login-normal-user">Go Back to Login Page</Link>
            </div>
                

      </div>
      
    )
}

