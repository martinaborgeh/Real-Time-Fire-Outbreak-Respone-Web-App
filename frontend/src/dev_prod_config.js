

function backendBaseurl(server_mode){
    
    if (server_mode ==="development"){
        const backend_url = process.env.REACT_APP_BACKEND_DEV_APP_API_URL
        console.log("dev environment",backend_url)
        return backend_url
    }else if(server_mode ==="production"){
        console.log(server_mode)
        const backend_url = process.env.REACT_APP_BACKEND_PROD_APP_API_URL
        console.log("prod environment",backend_url)
        return backend_url
    }
}
export default backendBaseurl





