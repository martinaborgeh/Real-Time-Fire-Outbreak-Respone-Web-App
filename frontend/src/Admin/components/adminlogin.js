
// import third party modules
import { Link,  useNavigate  } from 'react-router-dom'

// import react modules
import React, {useState,useEffect} from 'react'


// import custom defined modules
import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE)

export function AdminUserLogin(){

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
                    "ngrok-skip-browser-warning":true,
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(LoginData),

                })
                .then(response_data => {

                    if (!response_data.ok){
                            if(response_data.status ===401){
                              console.log("The eror",response_data.error)
                                console.log("Not Authorized, Enter Valid Inout")
                            }else if (response_data.status === 400){
                                console.log("Something Bad Happened, We would resolve it soon")
                                // navigate("/error-message");
                            }
                    }else if (response_data.ok) {
                        console.log(response_data.status)
                        // console.log("refresh",response_data.refresh)
                        navigate("/admin-call-view"); 
                    //    return response_data.json()
                    }
                })
                .catch(err=>{
                    console.log("Ooops, We are sorry, system under maintenance")}
                )
    }

    return(


<div class="bg-yellow-400 dark:bg-gray-800 h-screen overflow-hidden flex items-center justify-center">
  <div class="bg-white lg:w-6/12 md:7/12 w-8/12 shadow-3xl rounded-xl">
    <div class="bg-gray-800 shadow shadow-gray-200 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFF">
        <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z"/>
      </svg>
    </div>
    <form  onSubmit={handleSubmit} class="p-12 md:p-24">
      <div class="flex items-center text-lg mb-6 md:mb-8">
        <svg class="absolute ml-3" width="24" viewBox="0 0 24 24">
          <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z"/>
        </svg>
        <input type="text" id="username" class="bg-gray-200 rounded pl-12 py-2 md:py-4 focus:outline-none w-full"  value={email} onChange={e=>setemail(e.target.value)} name="email" placeholder="Email" />
      </div>
      <div class="flex items-center text-lg mb-6 md:mb-8">
        <svg class="absolute ml-3" viewBox="0 0 24 24" width="24">
          <path d="m18.75 9h-.75v-3c0-3.309-2.691-6-6-6s-6 2.691-6 6v3h-.75c-1.24 0-2.25 1.009-2.25 2.25v10.5c0 1.241 1.01 2.25 2.25 2.25h13.5c1.24 0 2.25-1.009 2.25-2.25v-10.5c0-1.241-1.01-2.25-2.25-2.25zm-10.75-3c0-2.206 1.794-4 4-4s4 1.794 4 4v3h-8zm5 10.722v2.278c0 .552-.447 1-1 1s-1-.448-1-1v-2.278c-.595-.347-1-.985-1-1.722 0-1.103.897-2 2-2s2 .897 2 2c0 .737-.405 1.375-1 1.722z"/>
        </svg>
        <input type="password" id="password" class="bg-gray-200 rounded pl-12 py-2 md:py-4 focus:outline-none w-full"  value={password} onChange={e=>setpassword(e.target.value)} name="password" id="password" placeholder="Password" />
      </div>
      <button class="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full rounded">Login</button>
    </form>
  </div>
 </div>
       
      
//         <div class="bg-gray-100 min-h-screen flex box-border justify-center items-center">
//     <div class="bg-[#dfa674] rounded-2xl flex max-w-3xl p-5 items-center">
//         <div class="md:w-1/2 px-8">
//             <h2 class="font-bold text-3xl text-[#002D74]">Login</h2>
//             <p class="text-sm mt-4 text-[#002D74]">If you already a member, easily log in now.</p>

//             <form action="" onSubmit={handleSubmit} class="flex flex-col gap-4">
//                 <input class="p-2 mt-8 rounded-xl border" type="email" value={email} onChange={e=>setemail(e.target.value)} name="email" placeholder="Email"/>
//                 <div class="relative">
//                     <input class="p-2 rounded-xl border w-full" type="password" value={password} onChange={e=>setpassword(e.target.value)} name="password" id="password" placeholder="Password"/>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" id="togglePassword"
//                         class="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer z-20 opacity-100"
//                         viewBox="0 0 16 16">
//                         <path
//                             d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z">
//                         </path>
//                         <path
//                             d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z">
//                         </path>
//                     </svg>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
//                         class="bi bi-eye-slash-fill absolute top-1/2 right-3 -z-1 -translate-y-1/2 cursor-pointer hidden"
//                         id="mama" viewBox="0 0 16 16">
//                         <path
//                             d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z">
//                         </path>
//                         <path
//                             d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z">
//                         </path>
//                     </svg>
//                 </div>
//                 <button class="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 hover:bg-[#206ab1] font-medium" type="submit">Login</button>
//             </form>
//             <div class="mt-6  items-center text-gray-100">
//                 <hr class="border-gray-300"/>
//                 <p class="text-center text-sm">OR</p>
//                 <hr class="border-gray-300"/>
//             </div>
//             <button class="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 hover:bg-[#60a8bc4f] font-medium">
//                     <svg class="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
//                         <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
//                         <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
//                         <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
//                         <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
//                     </svg>

//                     Login with Google
//                 </button>
//             <div class="mt-10 text-sm border-b border-gray-500 py-5 playfair tooltip">Forget password?</div>

//             <div class="mt-4 text-sm flex justify-between items-center container-mr">
//                 <p class="mr-3 md:mr-0 ">If you don't have an account..</p>
//                 <button class="hover:border register text-white bg-[#002D74] hover:border-gray-400 rounded-xl py-2 px-5 hover:scale-110 hover:bg-[#002c7424] font-semibold duration-300">Register</button>
//             </div>
//         </div>
//         <div class="md:block hidden w-1/2">
//             <img class="rounded-2xl max-h-[1600px]" src="https://images.unsplash.com/photo-1638401607229-31dbd79b5b37?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEwfHx8ZW58MHx8fHx8" alt="login form image"/>
//         </div>
//     </div>
// </div>
    )
}
