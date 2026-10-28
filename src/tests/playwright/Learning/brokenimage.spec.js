import { test, expect } from '@playwright/test';


test('Broken Image Test', async({page}) => {

    await page.goto('https://the-internet.herokuapp.com/broken_images');

    await page.route('**/*', (route) => {
        route.continue().catch(() => {});
    });

    const brokenImage = await page.evaluate(async () => {

        const images = Array.from(document.querySelectorAll('img'));
        const brokenImagesList = [];

        for (const image of images) {

            const response = await fetch(image.src, { method: 'HEAD' }).catch(() => null);
            if (response || response.status !=200){
                brokenImagesList.push(image.src);
            }

        }
        return brokenImagesList;
    });

    console.log(`Broken Images: ${brokenImage.length}`);
    console.log(`Broken Images Names : ''`);

    for (const src of brokenImage){
        console.log(src);
    }

    await page.waitForTimeout(10000);
});

