import supertest from "supertest";

export function urlFlow(baseUrl) {
    return supertest(baseUrl);
}

export function createClient(baseUrl) {
    return urlFlow(baseUrl);
}