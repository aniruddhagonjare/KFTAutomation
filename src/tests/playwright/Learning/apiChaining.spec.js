//ts-checks

import { test, expect } from '@playwright/test';

test('API Chaining', async ({ request }) => {

    const url = "https://jsonplaceholder.typicode.com/posts";       

    const postResponse = await request.get(url);
    expect (postResponse.status()).toBe(200);

    const posts = await postResponse.json();

    const firstPost= posts[0];

    const commentResponse = await request.get(`https://jsonplaceholder.typicode.com/posts/${firstPost.id}/comments`);
    expect(commentResponse.status()).toBe(200);

    const comments = await commentResponse.json();
    expect(comments.length).toBeGreaterThan(0);
    expect(comments[0].postId).toBe(firstPost.id);

});