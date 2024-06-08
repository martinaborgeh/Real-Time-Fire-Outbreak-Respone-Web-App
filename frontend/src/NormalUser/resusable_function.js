export const refreshAccessToken = (refreshToken) => {
    const serverbaseurl = "http://localhost:8000";
    fetch(serverbaseurl + "/accounts/login/refresh/", {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
    })
    .then(response => {
        if (response.ok) {
            console.log(response.status)
            return response.json();
        } else {
            console.log("Failed to refresh access token.");
            throw new Error("Failed to refresh access token");
        }
    })
    .then(data => {
        return data.access;
    })
    .catch(error => {
        console.error('Refresh Token Error:', error.message);
        return null;
    });
};

export const useAuthorization = (serverurl,navigationobject) => {
    const serverbaseurl = "http://localhost:8000";

    fetch(serverbaseurl + serverurl, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("is authenticated")
            return true; // User is authenticated
        } else if (!response.ok) {
            if(response.status ===401){
                const refreshtoken = localStorage.getItem("refresh")
                console.log("refreshtoken1",refreshtoken)
                const refreshaccesstoken = refreshAccessToken(refreshtoken)
                console.log("refreshed",refreshaccesstoken)
                console.log("refreshing token")
                if (refreshaccesstoken){
                    console.log("token refreshed")
                    return true
                }else{
                    console.log("invalid refresh token")
                   
                    return false
                }
            }else if (response.status ===400){
                console.log("bad error")
               return false
            }
           
        }
    })
    .catch(error => {
        console.error('Authorization Error:', error.message);
        return false;
    });
};