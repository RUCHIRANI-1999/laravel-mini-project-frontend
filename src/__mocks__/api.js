const api = {
    interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
};

export default api;
