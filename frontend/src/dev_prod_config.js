function backendBaseurl(server_mode){
    if (server_mode ==="development"){
        const backend_url = process.env.BACKEND_DEV_APP_API_URL
        return backend_url
    }else if(server_mode ==="production"){
        const backend_url = process.env.BACKEND_PROD_APP_API_URL
        return backend_url
    }

}

export default backendBaseurl



