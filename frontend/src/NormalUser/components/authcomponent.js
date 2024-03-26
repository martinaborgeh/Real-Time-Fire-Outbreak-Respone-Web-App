

// import third party modules
import { Link,  useNavigate  } from 'react-router-dom'

// import react modules
import React, {useState} from 'react'


// import custom defined modules

export function SubmitNewNormalUserDetails(){
    
    const [full_name, setfull_name] = useState('')
    const [password, setpassword] = useState('')
    const [password2, setpassword2] = useState('')
    const [email, setemail] = useState('')

    const navigate =  useNavigate ()
    
    const serverbaseurl = "http://localhost:8000"

    const SignUpData ={
        full_name,
        password,
        password2,
        email
   }
             
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/send-new-user-verification-code/",
                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(SignUpData),
                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Invalid Input, try again with valid input")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message"); 
                            }
                    }else if (response_data.ok) {
                        navigate("/verify-new-normal-user-details");
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
                    <div className = "SubmitNewUSerDetails">    
                        <input value={full_name} placeholder='full name' onChange={e=>setfull_name(e.target.value)} type ="text" name = "hello"></input>
                        <input value={password} placeholder='password' onChange={e=>setpassword(e.target.value)} type ="text" name = "name"></input>
                        <input value={password2} placeholder='password2' onChange={e=>setpassword2(e.target.value)} type ="text" name = "name"></input>
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/login-normal-user">Already have an account</Link>
                    </div>
            </form>

      </div>
      
    )
}



export function VerifyNewNormalUser(){

    const [code, setcode] = useState('')

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

    const Code ={
       code
   }
            
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/verify-new-user-and-create-account/",
                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(Code),
                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Not Processed, try again with valid input")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message"); 
                            }else if (response_data.status === 404){
                                console.log("The Code is not equal")
                            }
                    }else if (response_data.ok) {
                        navigate("/login-normal-user"); 
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
                <div className = "VerifyNewNormalUser">    
                    <input value={code} placeholder='Code' onChange={e=>setcode(e.target.value)} type ="text" name = "hello"></input>
                    <Link to="/login-normal-user">Already have an account</Link>
                    <button className='submit' type ="submit" name = "submit">Submit</button> 
                </div>
            </form>

         </div>
      
    )
}



export function NormalUserLogin(){

    const [password, setpassword] = useState('')
    const [email, setemail] = useState('')

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
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>
      
    )
}
