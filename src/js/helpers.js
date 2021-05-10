import { TIMEOUT_SECONDS } from './config'

// In case of low speed connections returns a rejected promise;
const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

export const AJAX = async (url, uploadData = undefined) => {
    try {
        let fetchPro;

        if(uploadData) {
            fetchPro =  fetch(url, {
                method: `POST`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadData),
            });
        } else {
            fetchPro = fetch(url);
        }

        const res = await Promise.race([timeout(TIMEOUT_SECONDS), fetchPro]) ;
        const data = await res.json();
        
        if(!res.ok) throw new Error(`${data.message}, ${res.status}`);

        return data;
    } catch (err) {
        throw err;
    }
}