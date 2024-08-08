

function backendBaseurl(server_mode){
    
    if (server_mode ==="development"){
        const backend_url = process.env.REACT_APP_BACKEND_DEV_APP_API_URL
        return backend_url
    }else if(server_mode ==="production"){
        console.log(server_mode)
        const backend_url = process.env.REACT_APP_BACKEND_PROD_APP_API_URL
        return backend_url
    }else{
        return "http://127.0.0.1:8000"
    }

}
export default backendBaseurl





