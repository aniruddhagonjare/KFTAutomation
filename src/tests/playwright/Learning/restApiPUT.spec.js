//ts-check
import { test, expect } from '@playwright/test';

test('Rest API With PUT Method', async ({ request }) => {

    const url = "https://jsonplaceholder.typicode.com/posts/1";
    const requestBody = {
        id: 1,
        title: 'This is updated titled ',
        body: 'This is the updated body',
        userId: 1,
    };
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    
    const response = await request.put(url, {
        data: JSON.stringify(requestBody),
        headers: headers
    });


    console.log(`API Response :-`, await response.json());
    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject(requestBody);

});
