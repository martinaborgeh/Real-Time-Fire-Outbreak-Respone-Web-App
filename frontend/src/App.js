

//import third party modules
import { Route, Routes } from "react-router-dom";

//import react modules
import React from 'react'; 

// import custom defined component modules
import {SubmitNewNormalUserDetails, VerifyNewNormalUser,NormalUserLogin} from './NormalUser/components/authcomponent'

import {WelcomeMessage} from "./NormalUser/components/welcome"

import {ErrorMessage} from "./NormalUser/components/errorpage"

import {NotLoggedIn} from "./NormalUser/components/notloggedin"



function App() {
  return (
    <div className="App">
      <Routes >
            <Route path="/submit-new-normal-user-details" element={<SubmitNewNormalUserDetails/>} />
            <Route path="/verify-new-normal-user-details" element={<VerifyNewNormalUser/>} />
            <Route path="/login-normal-user" element={<NormalUserLogin/>} />

            <Route path="/welcome-normal-user" element={<WelcomeMessage/>} />

            <Route path="/error-message" element={<ErrorMessage/>} />

            <Route path="/not-logged-in-message" element={<NotLoggedIn/>} />
        </Routes>
    </div>
  );
}

export default App;
