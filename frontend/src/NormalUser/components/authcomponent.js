

// import third party modules
import { Link,  useNavigate  } from 'react-router-dom'

// import react modules
import React, {useState,useEffect} from 'react'


// import custom defined modules
import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(process.env.REACT_APP_SERVER_MODE)


export function SubmitNewNormalUserDetails(){
    
    const [full_name, setfull_name] = useState('')
    const [password, setpassword] = useState('')
    const [password2, setpassword2] = useState('')
    const [email, setemail] = useState('')

    const navigate =  useNavigate ()
    
    const serverbaseurl = backend_server_url

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
                                // navigate("/error-message"); 
                            }
                    }else if (response_data.ok) {
                        email?localStorage.setItem("Email",email):localStorage.setItem("Email","No Email")
                        console.log(localStorage.getItem("Email"))
                       
                        console.log("Email sent successfully")
                        navigate("/verify-new-normal-user-details");
                    //    return response_data.json()
                    }
                })
                .catch(err=>{
                    
                    console.log("Ooops, We are sorry, system under maintenance")}
                )
        }

    
  


    return(
    //     <div className=" bg-red-200 p-4 sm:bg-green-200 md:bg-green-200 lg:bg-pink-200 xl:bg-purple-200 2xl:bg-yellow-200" >
        
    //             <div class="flex flex-row-reverse bg-black-200">

    //                <div class = "bg-pink-600 sm:bg-red-600 md:bg-yellow-500" >
    //                     <p >image goes here</p>
    //                 </div>

    //                 <div>
    //                     <form onSubmit={handleSubmit}>
    //                         <div class="flex flex-col gap-10">
    //                             <input class="border-green-500 border-2 rounded-md w-50 h-19" value={full_name} placeholder='full name' onChange={e=>setfull_name(e.target.value)} type ="text" name = "hello"></input>
    //                             <input class="border-green-500 border-2 rounded-md h-19" value={password} placeholder='password' onChange={e=>setpassword(e.target.value)} type ="text" name = "name"></input>
    //                             <input class="border-green-500 border-2 rounded-md h-19" value={password2} placeholder='password2' onChange={e=>setpassword2(e.target.value)} type ="text" name = "name"></input>
    //                             <input class="border-green-500 border-2 rounded-md h-19" value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
    //                         </div>
    //                     </form>

    //                     <div class ="flex flex-col items-center">
    //                             <button className='submit' type ="submit" name = "submit">Submit</button> 
    //                             <Link to="/login-normal-user">Already have an account</Link>
    //                     </div>
    //                 </div>

    //             </div>
    //   </div>

    <section class="bg-gray-100 min-h-screen flex box-border justify-center items-center">
    <div class="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
        <div class="md:w-1/2 px-8">
            <h2 class="font-bold text-3xl text-[#002D74]">Sign Up</h2>
            <p class="text-sm mt-4 text-[#002D74]">If dont have an acount, easily sign up now.</p>

            <form action="" onSubmit={handleSubmit} class="flex flex-col gap-4">
                
                <input class="p-2 mt-8 rounded-xl border" value={full_name} placeholder='Full Name' onChange={e=>setfull_name(e.target.value)} type ="text" name = "hello"/>
                <input class="p-2  rounded-xl border" value={email} placeholder='Email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"/>
            
                <div class="relative">
                    <input class="p-2 rounded-xl border w-full" type="password" value={password} name="password" id="password" onChange={e=>setpassword(e.target.value)} placeholder="Password"/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" id="togglePassword"
                        class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
                        viewBox="0 0 16 16">
                        <path
                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z">
                        </path>
                        <path
                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z">
                        </path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-eye-slash-fill absolute top-1/2 right-3 -z-1 -translate-y-1/2 cursor-pointer hidden"
                        id="mama" viewBox="0 0 16 16">
                        <path
                            d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z">
                        </path>
                        <path
                            d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z">
                        </path>
                    </svg>
                </div>
                 
                <div class="relative">
                    <input class="p-2 rounded-xl border w-full" type="password" value={password2} name="password2" id="password" onChange={e=>setpassword2(e.target.value)} placeholder="Password"/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" id="togglePassword"
                        class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
                        viewBox="0 0 16 16">
                        <path
                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z">
                        </path>
                        <path
                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z">
                        </path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-eye-slash-fill absolute top-1/2 right-3 -z-1 -translate-y-1/2 cursor-pointer hidden"
                        id="mama" viewBox="0 0 16 16">
                        <path
                            d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z">
                        </path>
                        <path
                            d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z">
                        </path>
                    </svg>
                </div>

                <button class="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium" type="submit">Submit</button>
            </form>
            <div class="mt-6  items-center text-gray-100">
                <hr class="border-gray-300"/>
                <p class="text-center text-sm">OR</p>
                <hr class="border-gray-300"/>
            </div>
            <button class="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#60a8bc4f] font-medium">
                    <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>

                    Continue with Google
                </button>
            <div class="mt-4 text-sm border-b border-gray-500 py-5 playfair tooltip">Forget password?</div>

            <div class="mt-4 text-sm flex justify-between items-center container-mr">
                <p class="mr-3 md:mr-0 ">If you already have an account..</p>
                <button class="hover:border register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">Login</button>
            </div>
        </div>
        <div class="md:block hidden w-1/2">
            <img class="rounded-2xl  max-h-[1600px]" src="https://images.unsplash.com/photo-1638401607229-31dbd79b5b37?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8" alt="signup form form image"/>
        </div>
    </div>
</section>
      
    )
}



export function VerifyNewNormalUser(){

    const [code, setcode] = useState(['', '', '', ''])
    const [verify_email, set_verify_email] = useState("No Email")

    const serverbaseurl = backend_server_url

    const navigate =  useNavigate ()

    const handleChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setcode(newCode);

            // Move focus to the next input
            if (index < 3) {
                document.getElementById(`code-input-${index + 1}`).focus();
            }
        } else if (value === '') {
            const newCode = [...code];
            newCode[index] = '';
            setcode(newCode);
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-input-${index - 1}`).focus();
        }
    };
            
     const handleSubmit = function(event){
        event.preventDefault()
        console.log("button clicked")
     
        const codeValue = code.join('');
        const Code = codeValue;
        console.log(Code)

        if(!Code){
            console.log("Your input is empty")
        }else if (Code && Code.length<4){
            console.log("Your input cannot be less than four")
        }else if (Code && Code.length ===4 &&  verify_email==="No Email"){
            console.log("You do not have account or your code has expired")
        }else if (Code && Code.length ===4 &&  verify_email!=="No Email"){
            console.log("everything is okays")

                fetch(serverbaseurl+"/accounts/verify-new-user-and-create-account/",
                        {
                            method: 'POST',
                            credentials:'include',
                            headers: {
                            "Content-Type": "application/json",
                            },
                            body: JSON.stringify({Code,verify_email}),
                        })
                        .then(response_data => {

                            if (!response_data.ok){
                                    if(response_data.status ===422){
                                        console.log("Not Processed, try again with valid input")
                                    }else if (response_data.status === 400){
                                        console.log(response_data.message)
                                        navigate("/error-message"); 
                                    }else if (response_data.status === 404){
                                        console.log("not found")
                                        console.log(response_data)
                                        console.log(response_data.message)
                                    }
                            }else if (response_data.ok) {
                                    if (response_data.status ===200){
                                    console.log(response_data.message)
                                    localStorage.clear()
                                    navigate("/submit-new-normal-user-details");

                                    // return response_data.json()
                                    }else if (response_data.status ===250){
                                        console.log('m',response_data.message)
                                    const is_email = localStorage.getItem("Email")
                                        is_email?set_verify_email(is_email):console.log("no email")
                                    }
                            }
                        })
                        .catch(err=>{
                            console.log("Ooops, We are sorry, system under maintenance")}
                        )
        }
    }

    useEffect(() => {

        fetch(serverbaseurl+"/accounts/check-if-user-session-expired/",
            {
                method: 'POST',
                credentials:'include',
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({verify_email}),
                
            })
            .then(response_data => {

                if (!response_data.ok){
                        if (response_data.status === 400){
                            console.log("Something Bad Happened, We would resolve it soon")
                            navigate("/error-message"); 
                        }
                }else if (response_data.ok) {
                    if (response_data.status ===200){
                        const is_email = localStorage.getItem("Email")
                        is_email?localStorage.clear():console.log("No email stored")
                        set_verify_email(verify_email) // set No Mail
                        navigate()

                        console.log("Code verificatio has expired")
                    }else if (response_data.status ===250){
                        const set_email = localStorage.getItem("Email")
                        set_email?set_verify_email(set_email):set_verify_email(verify_email)
                        
                        console.log("Time has not elapsed yet")
                    }
                    

                    return response_data.json()
                }
            })
            .catch(err=>{
                console.log("Ooops, We are sorry, system under maintenance")}
            )
    
    });

    return(
        // // <div>
        //     {/* <form onSubmit={handleSubmit}>
        //         <div className = "VerifyNewNormalUser">    
        //             <input value={code} placeholder='Code' onChange={e=>setcode(e.target.value)} type ="text" name = "hello"></input>
        //             <Link to="/login-normal-user">Already have an account</Link>
        //             <button className='submit' type ="submit" name = "submit">Submit</button> 
        //         </div>
        //     </form> */}
        //     // <PinInput  /> 

        //  {/* </div> */}

      
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
            <div className="relative bg-[#dfa674] px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
                    <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="font-semibold text-[#002D74] text-3xl">
                            <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-[#002D74]">
                            <p>We have sent a code to your <span className="text-white">{verify_email}</span></p>
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-16">
                                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                                    {code.map((value, index) => (
                                        <div className="w-16 h-16" key={index}>
                                            <input
                                                id={`code-input-${index}`}
                                                className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                                                type="text"
                                                maxLength="1"
                                                value={value}
                                                onChange={(e) => handleChange(e, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col space-y-5">
                                    <div>
                                        <button
                                            className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                                            type="submit"
                                        >
                                            Verify Account
                                        </button>
                                    </div>

                                    <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-[#002D74]">
                                        <p>Didn't receive code?</p> <a className="flex flex-row items-center text-blue-600" href="http://" target="_blank" rel="noopener noreferrer">Resend</a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      
    )
}



export function NormalUserLogin(){

    const [password, setpassword] = useState('')
    const [email, setemail] = useState('')

    const serverbaseurl = backend_server_url

    const navigate =  useNavigate ()

    const LoginData ={
        password,
        email
   }
        
     const handleSubmit = function(event){
        console.log(serverbaseurl)
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
                                // navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        localStorage.setItem("access",response_data.access)
                        localStorage.setItem("refresh",response_data.refresh)
                        // console.log("refresh",response_data.refresh)
                        navigate("/welcome-normal-user"); 
                    //    return response_data.json()
                    }
                })
                .catch(err=>{
                    console.log("Ooops, We are sorry, system under maintenance")}
                )
    }

    return(
        // <div>
        //     <form onSubmit={handleSubmit}>
        //             <div >
        //                 <input value={password} placeholder='password' onChange={e=>setpassword(e.target.value)} type ="text" name = "name"></input>
        //                 <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
        //                 <button className='submit' type ="submit" name = "submit">Submit</button> 
        //                 {/* <Link to="/submit-new-normal-user-details">Don't have an account</Link> */}
        //             </div>
        //     </form>

        // </div>
      
        <div class="bg-gray-100 min-h-screen flex box-border justify-center items-center">
    <div class="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
        <div class="md:w-1/2 px-8">
            <h2 class="font-bold text-3xl text-[#002D74]">Login</h2>
            <p class="text-sm mt-4 text-[#002D74]">If you already a member, easily log in now.</p>

            <form action="" onSubmit={handleSubmit} class="flex flex-col gap-4">
                <input class="p-2 mt-8 rounded-xl border" type="email" value={email} onChange={e=>setemail(e.target.value)} name="email" placeholder="Email"/>
                <div class="relative">
                    <input class="p-2 rounded-xl border w-full" type="password" value={password} onChange={e=>setpassword(e.target.value)} name="password" id="password" placeholder="Password"/>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" id="togglePassword"
                        class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
                        viewBox="0 0 16 16">
                        <path
                            d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z">
                        </path>
                        <path
                            d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z">
                        </path>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-eye-slash-fill absolute top-1/2 right-3 -z-1 -translate-y-1/2 cursor-pointer hidden"
                        id="mama" viewBox="0 0 16 16">
                        <path
                            d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z">
                        </path>
                        <path
                            d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z">
                        </path>
                    </svg>
                </div>
                <button class="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium" type="submit">Login</button>
            </form>
            <div class="mt-6  items-center text-gray-100">
                <hr class="border-gray-300"/>
                <p class="text-center text-sm">OR</p>
                <hr class="border-gray-300"/>
            </div>
            <button class="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#60a8bc4f] font-medium">
                    <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>

                    Login with Google
                </button>
            <div class="mt-10 text-sm border-b border-gray-500 py-5 playfair tooltip">Forget password?</div>

            <div class="mt-4 text-sm flex justify-between items-center container-mr">
                <p class="mr-3 md:mr-0 ">If you don't have an account..</p>
                <button class="hover:border register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">Register</button>
            </div>
        </div>
        <div class="md:block hidden w-1/2">
            <img class="rounded-2xl max-h-[1600px]" src="https://images.unsplash.com/photo-1638401607229-31dbd79b5b37?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8" alt="login form image"/>
        </div>
    </div>
</div>
    )
}


// export function UpdateNormalUser(){

//     const [email, setemail] = useState('')
    

//     const serverbaseurl = "http://localhost:8000"

//     const navigate =  useNavigate ()

//     const userdata ={
//         email
//    }
        
//      const handleSubmit = function(event){
//         event.preventDefault()
//         fetch(serverbaseurl+"/accounts/register-admin/",

//                 {
//                     method: 'POST',
//                     credentials:'include',
//                     headers: {
//                     "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(userdata),

//                 })
//                 .then(response_data => {

//                     if (!response_data.ok){
//                             if(response_data.status ===422){
//                                 console.log("Couldnt edit user")
//                             }else if (response_data.status === 400){
//                                 console.log("Something Bad Happened, We would resolve it soon")
//                                 navigate("/error-message");
//                             }
//                     }else if (response_data.ok) {
//                         console.log(response_data.status)
//                         //navigate("/admin-homepage"); 
//                        return response_data.json()
//                     }
//                 })
//                 .catch(err=>{
//                     console.log("Ooops, We are sorry, system under maintenance")}
//                 )
//     }

//     return(
//         <div>
//             <form onSubmit={handleSubmit}>
//                     <div className = "sellerformcontainer">
//                         <input value={email} placeholder='email' onChange={e=>setemail(e.target.value)} type ="text" name = "name"></input>
//                         <button className='submit' type ="submit" name = "submit">Submit</button> 
//                         <Link to="/submit-new-normal-user-details">Don't have an account</Link>
//                     </div>
//             </form>

//         </div>

//     )
// }
