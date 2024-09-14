import React, { useState, useEffect } from 'react';
import { Link,useNavigate} from 'react-router-dom';

import  backendBaseurl from "../../dev_prod_config"
const backend_server_url = backendBaseurl(window._env_.REACT_APP_SERVER_MODE)

export function NormalUserEndCallView() {
    const [welcomemessage, setwelcomemessage] = useState('');
    const serverbaseurl = backend_server_url ;

    const navigate =  useNavigate ()


    return (
        <div>
            <form >
                <div >
                    <input value="Call Ended" placeholder='Welcome Message' onChange={e => setwelcomemessage(e.target.value)} type="text" name="hello"></input>
                    {/* <Link to="/login">End Call</Link> */}
                </div>
            </form>
        </div>
    );
}