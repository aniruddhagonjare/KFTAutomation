//ts-checks

import { test, expect } from '@playwright/test';

test('Rest API With DELETE Method', async ({ request }) => {

    const url = "https://jsonplaceholder.typicode.com/posts/1";
    const headers = {
        'Content-type': 'application/json; charset=UTF-8',
    };

    const response = await request.delete(url, { headers: headers });

    const responseBody = await response.json();

    console.log(`API Response :-`, responseBody);
    expect(response.status()).toBe(200);
    expect(responseBody).toMatchObject({});

});
