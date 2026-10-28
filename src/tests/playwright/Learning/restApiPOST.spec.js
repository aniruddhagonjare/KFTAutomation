//ts-check

import { test, expect } from '@playwright/test';

test('Rest API With POST Method', async ({ request }) => {

    const url="https://jsonplaceholder.typicode.com/posts";

    const requestBody = {
        title: 'The is new POST',
        body: 'This is the body of the new POST',
        userId: 1
    };

    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };

    const response = await request.post(url, {      
        data: JSON.stringify(requestBody),
        headers: headers
    });


    console.log(`API Response :-` ,await response.json());
    expect(response.status()).toBe(201);
    expect(await response.json()).toMatchObject(requestBody);

});
