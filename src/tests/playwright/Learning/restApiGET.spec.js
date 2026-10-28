//ts-check

import { test, expect } from '@playwright/test';


test.skip('Rest API With GET Method', async ({ request }) => {

    const url="https://jsonplaceholder.typicode.com/posts/1";

    const response = await request.get(url);
    expect(response.status()).toBe(200);   
    
    const responseBody = await response.json();
    expect(responseBody.userId).toBe(1);
    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBe("sunt aut facere repellat provident occaecati excepturi optio reprehenderit");
    expect(responseBody.body).toBe("quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto");

});

test('Handling complex JSON response', async ({ page }) => {

    const url="https://jsonplaceholder.typicode.com/posts";   

    const response = await page.request.get(url);
    expect(response.status()).toBe(200);

    const users= await response.json();
    console.log(`API Response :-` ,users);

    await expect(users.length).toBeGreaterThan(0);
    await expect(users[0].id).toBe(1);

});
