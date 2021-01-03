import axios from 'axios';




axios.interceptors.response.use(null, error => {
    const exprecteddError = error.response && error.response.status >= 400 && error.response.status < 500;
    if (!exprecteddError) {
        console.log("logging error" + error);

    }

    return Promise.reject(error);


});


export default {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
    request: axios.request,
}
