//ts-check
import { test, expect } from '@playwright/test';

test('Rest API With PUT Method', async ({ request }) => {

    const url = "https://jsonplaceholder.typicode.com/posts/1";
    const requestBody = {
        title: 'This is Patched titled',
        body: 'This is the Patched body',
    };
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };
    
    const response = await request.patch(url, {
        data: JSON.stringify(requestBody),
        headers: headers
    });

    const responseBody = await response.json();

    console.log(`API Response :-`, responseBody);
    expect(response.status()).toBe(200);
    expect(responseBody).toMatchObject(requestBody);
    expect(responseBody.title).toBe('This is Patched titled');

});
