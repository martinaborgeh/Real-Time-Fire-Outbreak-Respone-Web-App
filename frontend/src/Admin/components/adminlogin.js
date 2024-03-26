// import third party modules
import { Link,  useNavigate  } from 'react-router-dom'

// import react modules
import React, {useState} from 'react'


// import custom defined modules


export function AdminUserLogin(){

    const [password, setpassword] = useState('')
    const [email, setemail] = useState('')
    const [role,setrole] = useState()

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

    const LoginData ={
        password,
        email
   }
        
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/login/",

                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(LoginData),

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===401){
                                console.log("Not Authorized, Enter Valid Inout")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        navigate("/welcome-normal-user"); 
                       return response_data.json()
                    }
                })
                .catch(err=>{
                    console.log("Ooops, We are sorry, system under maintenance")}
                )
    }

    return(
        <div>
            <form onSubmit={handleSubmit}>
                    <div className = "sellerformcontainer">
                        <input value={password} placeholder='password' onChange={e=>setpassword(e.target.value)} type ="text" name = "name"></input>
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <input value={role} placeholder='role' onChange={e=>setrole(e.target.value)} type ="text" name = "name"></input>
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>
      
    )
}
