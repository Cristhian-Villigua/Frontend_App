import axios from 'axios';

export class Api {
    static baseUrl = `${import.meta.env.BASE_URL}/api`;

    static async get(url, options = {}) {
        try {
            const response = await axios.get(`${Api.baseUrl}${url}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            });
            return {
                statusCode: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    }

    static async post(url, data, options = {}) {
        try {
            const response = await axios.post(`${Api.baseUrl}${url}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            });
            return {
                statusCode: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    }

    static async put(url, data, options = {}) {
        try {
            const response = await axios.put(`${Api.baseUrl}${url}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            });
            return {
                statusCode: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    }

    static async patch(url, data, options = {}) {
        try {
            const response = await axios.patch(`${Api.baseUrl}${url}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            });
            return {
                statusCode: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    }

    static async delete(url, options = {}) {
        try {
            const response = await axios.delete(`${Api.baseUrl}${url}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {}),
                },
                ...options,
            });
            return {
                statusCode: response.status,
                data: response.data,
            };
        } catch (error) {
            throw error;
        }
    }
}
