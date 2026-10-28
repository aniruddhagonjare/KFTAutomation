// journey.spec.js
const { test } = require('@playwright/test');
const { JourneyPage } = require('../../../../pages/JourneyPage.js');
const path = require('path');

test('Run dynamic automation based on browser UI selection', async ({ page }) => {
    // Open the local webpage file path (Adjust path to where you saved your HTML file)
    const localFilePath = `file://${path.resolve(__dirname, 'journey-selector.html')}`;
    await page.goto(localFilePath);

    const journeyPage = new JourneyPage(page);

    // TEST SCENARIO 1: Let's explicitly change the selection to Journey B
    await journeyPage.dropdown.selectOption('journeyB');

    // Execute the runner method—it will automatically detect 'journeyB' and run that specific code branch
    await journeyPage.executeSelectedJourney();
});
