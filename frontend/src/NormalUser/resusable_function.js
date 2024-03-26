
export const refreshAccessToken = async (refreshToken) => {
     
    const response = await fetch(serverbaseurl + "/refresh-token/", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${refreshToken}`,
            "Content-Type": "application/json",
        },
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access', data.access);
        return data.access;
    } else {
        console.log("Failed to refresh access token.");
        return null;
    }
};