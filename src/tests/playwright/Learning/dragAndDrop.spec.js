// ts-check
import { test, expect } from '@playwright/test';

test('Drag and Drop Test' , async({page}) => {

    await page.goto('https://drag-and-drop-tricks.webflow.io/');

    const sourceElement = page.locator('//*[@class="draggable correct ui-draggable ui-draggable-handle"]');
    const targetElement = page.locator('//*[@class="quiz-option is-drop"]');

    await sourceElement.dragTo(targetElement);


    await page.waitForTimeout(10000);

});

test('Drag and Drop Test second way' , async({page}) => {

    await page.goto('https://drag-and-drop-tricks.webflow.io/');

    await page.locator('//*[@class="draggable correct ui-draggable ui-draggable-handle"]').hover();
    await page.mouse.down();
    await page.locator('//*[@class="quiz-option is-drop"]').hover();
    await page.mouse.up();

    await page.waitForTimeout(10000);

});

// test.use({
//         browserName: 'chromium',
//         viewport: { width: 1920, height: 1080 },  // allows full screen
//         headless: false,
//         launchOptions: {
//         args: ['--start-maximized'],
//   },
// });