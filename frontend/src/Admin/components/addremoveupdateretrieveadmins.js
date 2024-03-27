// import third party modules
import { Link,  useNavigate  } from 'react-router-dom'

// import react modules
import React, {useState} from 'react'


// import custom defined modules


export function AddAdmin(){

    const [full_name, setfull_name] = useState('')
    const [password, setpassword] = useState('')
    const [password2, setpassword2] = useState('')
    const [email, setemail] = useState('')
    const [role,setrole] = useState('')

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

    const adddata ={
        full_name,
        password,
        password2,
        email,
        role
   }
        
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/register-admin/",

                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(adddata),

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Invalid Input. Make Sure you make correct input")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        //navigate("/admin-homepage"); 
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
                        <input value={full_name} placeholder='full name' onChange={e=>setfull_name(e.target.value)} type ="text" name = "hello"></input>
                        <input value={password} placeholder='password' onChange={e=>setpassword(e.target.value)} type ="text" name = "name"></input>
                        <input value={password2} placeholder='password2' onChange={e=>setpassword2(e.target.value)} type ="text" name = "name"></input>
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <input value={role} placeholder='role' onChange={e=>setrole(e.target.value)} type ="text" name = "name"></input>
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>

    )
}


export function RemoveAdmin(){

    const [email, setemail] = useState('')
    

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

    const userdata ={
        email
   }
        
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/register-admin/",

                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userdata),

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Couldnt remove user")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        //navigate("/admin-homepage"); 
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
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>

    )
}

export function UpdateAdmin(){

    const [email, setemail] = useState('')
    

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

    const userdata ={
        email
   }
        
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/register-admin/",

                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userdata),

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Couldnt edit user")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        //navigate("/admin-homepage"); 
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
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>

    )
}


export function GetOneAdmin(){

    const [email, setemail] = useState('')
    

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

    const userdata ={
        email
   }
        
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/register-admin/",

                {
                    method: 'POST',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userdata),

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Couldnt edit user")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        //navigate("/admin-homepage"); 
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
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <button className='submit' type ="submit" name = "submit">Submit</button> 
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>

    )
}


export function GetAllAdmin(){

    const [full_name, setfull_name] = useState('')
    const [password, setpassword] = useState('')
    const [password2, setpassword2] = useState('')
    const [email, setemail] = useState('')
    const [role,setrole] = useState('')

    const serverbaseurl = "http://localhost:8000"

    const navigate =  useNavigate ()

  
     const handleSubmit = function(event){
        event.preventDefault()
        fetch(serverbaseurl+"/accounts/register-admin/",

                {
                    method: 'GET',
                    credentials:'include',
                    headers: {
                    "Content-Type": "application/json",
                    },

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===422){
                                console.log("Couldnt load all users")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        //navigate("/admin-homepage"); 
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
                        <input value={full_name} placeholder='full name' onChange={e=>setfull_name(e.target.value)} type ="text" name = "hello"></input>
                        <input value={password} placeholder='password' onChange={e=>setpassword(e.target.value)} type ="text" name = "name"></input>
                        <input value={password2} placeholder='password2' onChange={e=>setpassword2(e.target.value)} type ="text" name = "name"></input>
                        <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
                        <input value={role} placeholder='role' onChange={e=>setrole(e.target.value)} type ="text" name = "name"></input>
                        <Link to="/submit-new-normal-user-details">Don't have an account</Link>
                    </div>
            </form>

        </div>

    )
}