import axios from 'axios';
export async function generateAuthToken(baseUrl, body) {
    return await axios.post(`${baseUrl}/api/generate_token`, body, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
}

export async function generateUtmCode(baseUrl, body) {
    return await axios.post(`${baseUrl}/api/utm_generation`, body, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
}

