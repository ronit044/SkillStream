import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL;

axios.interceptors.request.use( (req) => {
    const user = localStorage.getItem("user");

    if (user) {
        const { token } = JSON.parse(localStorage.getItem("user"));
        req.headers.authorization = `Bearer ${token}`;
    }
    return req;
});
