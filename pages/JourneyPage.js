

class JourneyPage {
    constructor(page) {
        this.page = page;
        this.dropdown = page.locator('#journeyDropdown');
        this.startButton = page.locator('#startBtn');
        this.statusText = page.locator('#status');
    }

    // Dynamic action executor based on what was selected on screen
    async executeSelectedJourney() {
        // 1. Read the currently selected value from the webpage dropdown
        const selectedJourney = await this.dropdown.inputValue();
        console.log(`\n Detected Journey Selection: ${selectedJourney}`);

        // 2. Click the start button on the UI
        await this.startButton.click();
        await this.statusText.waitFor({ state: 'visible' });

        // 3. Conditional execution branch ("If/Else" or "Switch" loop)
        switch (selectedJourney) {
            case 'journeyA':
                console.log("Running Debt Pool Journey...");
                
                break;

            case 'journeyB':
                console.log("Running Application Pool Journey...");
    
                break;

            case 'journeyC':
                console.log("Running API journey...");
            
                break;

            default:
                throw new Error(`Unknown journey option selected: ${selectedJourney}`);
        }
    }
}

module.exports = { JourneyPage };
