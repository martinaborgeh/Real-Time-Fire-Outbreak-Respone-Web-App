

//import third party modules
import { Route, Routes } from "react-router-dom";

//import react modules
import React from 'react'; 

// import custom defined component modules
import {SubmitNewNormalUserDetails, VerifyNewNormalUser,NormalUserLogin} from './NormalUser/components/authcomponent'
import {SearchFireServicePage} from "./NormalUser/components/searchfireservicepage"
import {NormalUserCallView} from "./NormalUser/components/callview"
import {NormalUserEndCallView} from "./NormalUser/components/endcallview"

import {AdminUserLogin} from "./Admin/components/adminlogin"
import {AdminHomepage} from "./Admin/components/adminhomepage"
import {AdminIncomingCallVIew} from "./Admin/components/fireincidentsincomingcalls"
import {AdminCallView} from "./Admin/components/admincallview"
import {AdminEndCallView} from "./Admin/components/adminendcallview"

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
            <Route path="/search-for-fireservice" element={<SearchFireServicePage/>} />
            <Route path="/call-view" element={<NormalUserCallView/>} />
            <Route path="/end-call-view" element={<NormalUserEndCallView/>} />

            <Route path="/login-admin-user" element={<AdminUserLogin/>} />
            <Route path="/admin-homepage" element={<AdminHomepage/>} />
            <Route path="/admin-incoming-calls-view" element={<AdminIncomingCallVIew/>} />
            <Route path="/admin-call-view" element={<AdminCallView/>} />
            <Route path="/admin-end-call-view" element={<AdminEndCallView/>} />

            
            <Route path="/error-message" element={<ErrorMessage/>} />
            <Route path="/not-logged-in-message" element={<NotLoggedIn/>} />
        </Routes>
    </div>
  );
}

export default App;
