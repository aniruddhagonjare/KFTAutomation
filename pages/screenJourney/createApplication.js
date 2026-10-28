
export class createApplication {
    constructor(page) {
        this.attach(page);
    }

    attach(page) {
        this.page = page;

        this.createSidebar = page.locator('xpath=//a[@href="/Create"]//span[contains(text(),"Create")]');
        this.loanapplication = page.locator('xpath=//a[@href="/LoanApplication/Create"]//h5[contains(text(),"Loan Application")]');

        //dedupe page
        this.pannumberfield = page.locator('xpath=//input[@type="text" and @id="txtDedupePan" and @placeholder="Enter PAN Number"]');
        this.mobilenumberfield = page.locator('xpath=//input[@type="text" and @id="txtDedupeMobile" and @placeholder="Enter Mobile Number"]');
        this.checkbutton = page.locator('xpath=//button[@id="btnDedupeCheck" and contains(., "Check")]');
        this.createnewleadbutton = page.locator('xpath=//button[@id="btnCreateNewLead" and contains(., "Create New Lead")]')

        //selectLoanType
        this.selectloantypegold = page.locator('xpath=//div[@data-loantypename="Gold" and contains(.,"Gold")]');
        this.nextbutton = page.locator('xpath=//button[@id="btnCreateNext" and contains(text(),"Next")]');

        //product Selection
        this.pnggoldproduct = page.locator('xpath=//div[@class="col-md-4" and contains(.,"PNG GOLD")]');
        this.productselectionNEXTbutton = page.locator('xpath=//div[@data-step-key="product_select"]//button[contains(text(),"Next")]');

        //enitity Type
        this.entitytypeIndividual = page.locator('xpath=//div[@class="col-md-4" and contains(.,"Individual")]//div[@data-value="Individual"]');
        this.entitytypeNEXTbutton = page.locator('xpath=//div[@data-step-key="entity_type"]//button[contains(text(),"Next")]');

        // Primary Information
        this.namefield = page.locator('xpath=//input[@type="text" and @id="field_leads_leadname"]');
        this.emailfield = page.locator('xpath=//input[@type="email" and @id="field_leads_leademail"]');
        this.maritalstatusdropdown = page.locator('xpath=//span[@aria-labelledby="select2-field_leads_leadmaritalstatus-container" and contains(.,"Select...")]');
        this.maritalstatusselectionmarried = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"Married")]');
        //addresDetails
        this.addresstypedropdown = page.locator('xpath=//span[@aria-labelledby="select2-field_register_companyadddress_addresstype-container" and contains(.,"Select...")]');
        this.addresstypeselectionPermanent = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"Permanent")]')
        this.addresspincodedropdown = page.locator('xpath=//span[@id="select2-field_register_companyadddress_pincode-container" and contains(.,"Select...")]');
        this.addresspincodeselection110005 = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"110005")]');
        this.primaryinfoNEXTbutton = page.locator('xpath=//div[@data-step-key="primary_info"]//button[contains(text(),"Next")]');

        // Co-Borrower Details
        this.skipthisstepbutton = page.locator('xpath=//div[@data-step-key="Coborrower"]//button[contains(text(),"Skip This Step")]');

        //Loan details
        this.loanAskrate = page.locator('xpath=//input[@id="field_loanask_askrate" and @type="number" and @placeholder="Customer ROI"]');
        this.loanAsktenure = page.locator('xpath=//input[@id="field_loanask_asktenure" and @type="number" and @data-field-key="loanask_asktenure"]');
        this.loanamount = page.locator('xpath=//input[@id="field_loanask_loanamount" and @type="number" and @data-field-key="loanask_loanamount"]');
        this.loanpurposedropdown = page.locator('xpath=//div[@data-field-key="loanask_loanpurpose"]//span[@aria-labelledby="select2-field_loanask_loanpurpose-container" and contains(.,"Select...")]');
        this.loanpurposeselection = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"Business Expansion")]');
        this.loanJrlenderROI = page.locator('xpath=//input[@type="number" and @id="field_loandetailsinfo_nbfcroi" and @data-field-key="loandetailsinfo_nbfcroi"]');
        this.loanroi = page.locator('xpath=//input[@type="number" and @id="field_loandetailsinfo_loanroi" and @data-field-key="loandetailsinfo_loanroi"]');
        this.loandetailsNextButton = page.locator('xpath=//div[@data-step-key="Loan Details"]//button[contains(text(),"Next")]');

        //Business Details
        this.businessnamefield = page.locator('xpath=//input[@type="text" and @id="field_businessinformation_businessname" and @data-field-key="businessinformation_businessname"]');
        this.businessdetailsNextButton = page.locator('xpath=//div[@data-step-key="Business Details"]//button[contains(text(),"Next")]');

        //Collateral Details
        this.assetvaluefield = page.locator('xpath=//input[@type="number" and @id="field_jewelcollateraldetails_assetvalue" and @data-field-key="jewelcollateraldetails_assetvalue"]');
        this.caratdropdown = page.locator('xpath=//span[@id="select2-field_jewelcollateraldetails_carat-container" and contains(.,"Select...")]');
        this.caratselection = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"22")]');
        this.jeweltypedropdown = page.locator('xpath=//span[@id="select2-field_jewelcollateraldetails_jeweltype-container" and contains(.,"Select...")]');
        this.jeweltypeselection = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"Chain")]');
        this.netweightinGramfield = page.locator('xpath=//input[@type="number" and @id="field_jewelcollateraldetails_netweight" and @data-field-key="jewelcollateraldetails_netweight"]');
        this.grossweightinGramfield = page.locator('xpath=//input[@type="number" and @id="field_jewelcollateraldetails_grossweight" and @data-field-key="jewelcollateraldetails_grossweight"]');
        this.hallmarkyesradiobtn = page.locator('xpath=//input[@type="radio" and @id="field_jewelcollateraldetails_hallmark_1" and @data-field-key="jewelcollateraldetails_hallmark" and @value="Yes"]');
        this.jewelcardnumberfield = page.locator('xpath=//input[@type="number" and @id="field_jewelcollateraldetails_jewelcardno" and @data-field-key="jewelcollateraldetails_jewelcardno"]');
        this.totalitemsfield = page.locator('xpath=//input[@type="number" and @id="field_jewelcollateraldetails_totalitems" and @data-field-key="jewelcollateraldetails_totalitems"]');
        this.jewelvaluefield = page.locator('xpath=//input[@type="number" and @id="field_jewelcollateraldetails_jwelvalue" and @data-field-key="jewelcollateraldetails_jwelvalue"]');
        this.collateraldetailsNextButton = page.locator('xpath=//div[@data-step-key="Collateral_Gold"]//button[contains(text(),"Next")]');

        //Bank details
        this.aplicanttypedropdwon = page.locator('xpath=//span[@id="select2-field_bankdetails_applicanttype-container" and contains(.,"Select...")]');
        this.applicanttypeselection = page.locator('xpath=//span[@class="select2-results"]//li[1][contains(.,"Applicant")]');
        this.acountholdernamefield = page.locator('xpath=//input[@type="text" and @id="field_bankdetails_accountholdername" and @data-field-key="bankdetails_accountholdername"]');
        this.banknamedropdown = page.locator('xpath=//span[@id="select2-field_bankdetails_bankname-container" and contains(.,"Select...")]');
        this.banknameselection = page.locator('xpath=//span[@class="select2-results"]//ul[@id="select2-field_bankdetails_bankname-results"]//li[4]');
        this.accountypedropdown = page.locator('xpath=//span[@id="select2-field_bankdetails_accounttype-container" and contains(.,"Select...")]');
        this.accountypeselection = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"Saving")]');
        this.accountnumberfield = page.locator('xpath=//input[@type="number" and @id="field_bankdetails_accountnumber" and @data-field-key="bankdetails_accountnumber"]');
        this.ifsccodefield = page.locator('xpath=//input[@type="text" and @id="field_bankdetails_ifsc" and @data-field-key="bankdetails_ifsc"]');
        this.bankdetailsNextButton = page.locator('xpath=//div[@data-step-key="Bank Details"]//button[contains(text(),"Next")]');
        // bandhan bank :- IFSC code = BDBL0001584

        //Financial Details
        // this.grossincomefield = page.locator('xpath=//input[@type="text" and @id="field_bre_los_master_gross_income" and @data-field-key="bre_los_master_gross_income"]');
        this.grossincomefield = page.locator('xpath=//input[@type="number" and @id="field_businessinformation_companyturnover" and @data-field-key="businessinformation_companyturnover"]');
        this.netincomefield = page.locator('xpath=//input[@type="number" and @id="field_bre_los_master_netincome" and @data-field-key="bre_los_master_netincome"]');
        this.existingemifield = page.locator('xpath=//input[@type="number" and @id="field_bre_los_master_existingemi" and @data-field-key="bre_los_master_existingemi"]');
        this.bureautypedropdown = page.locator('xpath=//span[@id="select2-field_bre_los_master_bureautype-container" and contains(.,"Select...")]');
        this.bureautypselection = page.locator('xpath=//span[@class="select2-results"]//li[contains(.,"CIBIL")]');
        this.financialdetailsNextButton = page.locator('xpath=//div[@data-step-key="Financial Details"]//button[contains(text(),"Next")]');

        //Document page
        this.documentNextButton = page.locator('xpath=//div[@data-step-key="doc"]//button[contains(text(),"Next")]');

        // Blended ROI
        this.acceptandupdateroibutton = page.locator('xpath=//button[@type="button" and contains(.,"Accept & Update ROI")]');
        this.blendedroiNextButton = page.locator('xpath=//div[@data-step-key="blendedROI"]//button[contains(text(),"Next")]');

        // Preview And SUbmit
        this.submitbutton = page.locator('xpath=//button[@type="button" and @class="btn btn-send my-3 btn-submit-form" and contains(.,"Submit")]');

        //application submitted window
        this.getleadnumbertext = page.locator('xpath=//p[contains(@class, "text-success") and contains(.,"Your Lead Number is")]');
    }

    async clikonCreateSideBar() {
        await this.createSidebar.waitFor({ state: 'visible' });
        await this.createSidebar.click();
    }

    async clickOnLoanApplication() {
        await this.clikonCreateSideBar();

        await this.loanapplication.waitFor({ state: 'visible' });
        await this.loanapplication.click();
    }

    async EnterPanNumberField() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const digits = "0123456789";

        let randomPan = "";
        for (let i = 0; i < 3; i++) randomPan += letters.charAt(Math.random() * 26);
        randomPan += "P";
        randomPan += letters.charAt(Math.random() * 26);
        for (let i = 0; i < 4; i++) randomPan += digits.charAt(Math.random() * 10);
        randomPan += letters.charAt(Math.random() * 26);


        await this.pannumberfield.waitFor({ state: 'visible' });
        await this.pannumberfield.fill(randomPan);
    }

    async enterMobileNumberField() {

        const startingDigits = ["6", "7", "8", "9"];
        const firstDigit = startingDigits[Math.floor(Math.random() * startingDigits.length)];
        let remainingDigits = "";
        for (let i = 0; i < 9; i++) {
            remainingDigits += Math.floor(Math.random() * 10);
        }
        const randomMobile = firstDigit + remainingDigits;

        await this.mobilenumberfield.waitFor({ state: 'visible' });
        await this.mobilenumberfield.fill(randomMobile);
    }

    async ClickOnCheckButton() {
        await this.checkbutton.waitFor({ state: 'visible' });
        await this.checkbutton.click();
    }

    async DedupPage() {

        await this.EnterPanNumberField();
        await this.enterMobileNumberField();
        await this.ClickOnCheckButton();
    }

    async CreateNewLeadButton() {

        await this.createnewleadbutton.waitFor({ state: 'visible' });
        await this.createnewleadbutton.click();
    }

    async SelectLoanTypeGold() {
        await this.selectloantypegold.waitFor({ state: 'visible' });
        await this.selectloantypegold.click();

        await this.nextbutton.waitFor({ state: 'visible' });
        await this.nextbutton.click();
    }

    async ProductSelectionPNGGold() {

        await this.pnggoldproduct.waitFor({ state: 'visible' });
        await this.pnggoldproduct.click();

        await this.productselectionNEXTbutton.waitFor({ state: 'visible' });
        await this.productselectionNEXTbutton.click();
    }

    async EntityTypeSelectionIndividual() {

        await this.entitytypeIndividual.waitFor({ state: 'visible' });
        await this.entitytypeIndividual.click();

        await this.entitytypeNEXTbutton.waitFor({ state: 'visible' });
        await this.entitytypeNEXTbutton.click();
    }

    async PrimaryInformation() {
        const firstNames = ['Aarav', 'Ananya', 'Rohan', 'Priya', 'Arjun', 'Diya', 'Rahul', 'Aditi', 'Vihaan', 'Kavya'];
        const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Mehra', 'Joshi', 'Reddy', 'Nair'];

        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomName = `${randomFirstName} ${randomLastName}`;

        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}${randomNumber}@gmail.com`;

        await this.namefield.waitFor({ state: 'visible' });
        await this.namefield.fill(randomName);

        await this.emailfield.waitFor({ state: 'visible' });
        await this.emailfield.fill(randomEmail);


        await this.maritalstatusdropdown.waitFor({ state: 'visible' });
        await this.maritalstatusdropdown.click();

        await this.maritalstatusselectionmarried.waitFor({ state: 'visible' });
        await this.maritalstatusselectionmarried.click();

        //addresDetails
        await this.addresstypedropdown.waitFor({ state: 'visible' });
        await this.addresstypedropdown.click();

        await this.addresstypeselectionPermanent.waitFor({ state: 'visible' });
        await this.addresstypeselectionPermanent.click();

        await this.addresspincodedropdown.waitFor({ state: 'visible' });
        await this.addresspincodedropdown.click();

        await this.addresspincodeselection110005.waitFor({ state: 'visible' });
        await this.addresspincodeselection110005.click();

        await this.primaryinfoNEXTbutton.waitFor({ state: 'visible' });
        await this.primaryinfoNEXTbutton.click();
    }

    async Co_BorrowerDetails() {
        await this.skipthisstepbutton.waitFor({ state: 'visible' })
        await this.skipthisstepbutton.click();
    }

    async LoanDetails() {
        await this.loanAskrate.waitFor({ state: 'visible' })
        await this.loanAskrate.fill('9');

        await this.loanAsktenure.waitFor({ state: 'visible' });
        await this.loanAsktenure.fill('36');

        await this.loanamount.waitFor({ state: 'visible' });
        await this.loanamount.fill('400000');

        await this.loanpurposedropdown.waitFor({ state: 'visible' });
        await this.loanpurposedropdown.click();

        await new Promise(resolve => setTimeout(resolve, 4000));
        await this.loanpurposeselection.waitFor({ state: 'visible' });
        await this.loanpurposeselection.click();

        await this.loanJrlenderROI.waitFor({ state: 'visible' });
        await this.loanJrlenderROI.fill('8');

        await this.loanroi.waitFor({ state: 'visible' });
        await this.loanroi.fill('8.4');

        await this.loandetailsNextButton.waitFor({ state: 'visible' });
        await this.loandetailsNextButton.click();
    }

    async BusinessDetails() {
        const prefixes = ['Apex', 'Nexus', 'Quantum', 'Horizon', 'Summit', 'Vanguard', 'Beacon'];
        const types = ['Tech', 'Solutions', 'Logistics', 'Ventures', 'Consulting', 'Innovations'];
        const suffixes = ['Pvt Ltd', 'Ltd', 'Corporation', 'Private Limited Company'];

        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

        const properBusinessName = `${randomPrefix} ${randomType} ${randomSuffix}`;

        await this.businessnamefield.waitFor({ State: 'visible' });
        await this.businessnamefield.fill(properBusinessName);

        await this.businessdetailsNextButton.waitFor({ State: 'visible' });
        await this.businessdetailsNextButton.click();
    }

    async CollateralDetails() {

        await this.assetvaluefield.waitFor({ state: 'visible' });
        await this.assetvaluefield.fill('350000');

        await this.caratdropdown.waitFor({ state: 'visible' });
        await this.caratdropdown.click();

        await this.caratselection.waitFor({ state: 'visible' });
        await this.caratselection.click();

        await this.jeweltypedropdown.waitFor({ state: 'visible' });
        await this.jeweltypedropdown.click();

        await this.jeweltypeselection.waitFor({ state: 'visible' });
        await this.jeweltypeselection.click();

        await this.netweightinGramfield.waitFor({ state: 'visible' });
        await this.netweightinGramfield.fill('3');

        await this.grossweightinGramfield.waitFor({ state: 'visible' });
        await this.grossweightinGramfield.fill('3.5');

        await this.hallmarkyesradiobtn.waitFor({ state: 'visible' });
        await this.hallmarkyesradiobtn.click();

        await this.jewelcardnumberfield.waitFor({ state: 'visible' });
        await this.jewelcardnumberfield.fill('619282');

        await this.totalitemsfield.waitFor({ state: 'visible' });
        await this.totalitemsfield.fill('3');

        await this.jewelvaluefield.waitFor({ state: 'visible' });
        await this.jewelvaluefield.fill('500000');

        await this.collateraldetailsNextButton.waitFor({ state: 'visible' });
        await this.collateraldetailsNextButton.click();
    }

    async BankDetails() {

        await this.aplicanttypedropdwon.waitFor({ state: 'visible' });
        await this.aplicanttypedropdwon.click();

        await this.applicanttypeselection.waitFor({ state: 'visible' });
        await this.applicanttypeselection.click();

        const firstNames = ['Aarav', 'Ananya', 'Rohan', 'Priya', 'Arjun', 'Diya', 'Rahul', 'Aditi', 'Vihaan', 'Kavya'];
        const lastNames = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Mehra', 'Joshi', 'Reddy', 'Nair'];
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomName = `${randomFirstName} ${randomLastName}`;

        await this.acountholdernamefield.waitFor({ state: 'visible' });
        await this.acountholdernamefield.fill(randomName);

        await this.banknamedropdown.waitFor({ state: 'visible' });
        await this.banknamedropdown.click();

        await this.banknameselection.waitFor({ state: 'visible' });
        await this.banknameselection.click();

        await this.accountypedropdown.waitFor({ state: 'visible' });
        await this.accountypedropdown.click();

        await this.accountypeselection.waitFor({ state: 'visible' });
        await this.accountypeselection.click();

        const accountnumber = ['20200054861176', '20200054861177', '20200054861178', '20200054861179', '20200054861180', '20200054861181', '20200054861182'];
        const bankaccountnumber = accountnumber[Math.floor(Math.random() * accountnumber.length)];
        const validaccountnumber = `${bankaccountnumber}`;
        await this.accountnumberfield.waitFor({ state: 'visible' });
        await this.accountnumberfield.fill(validaccountnumber);

        await this.ifsccodefield.waitFor({ state: 'visible' });
        await this.ifsccodefield.fill('BDBL0001584');

        await this.bankdetailsNextButton.waitFor({ state: 'visible' });
        await this.bankdetailsNextButton.click();
    }

    async FinancialDetails() {

        await this.grossincomefield.waitFor({ state: 'visible' });
        await this.grossincomefield.fill('1100000');

        await this.netincomefield.waitFor({ state: 'visible' });
        await this.netincomefield.fill('65000');

        await this.existingemifield.waitFor({ state: 'visible' });
        await this.existingemifield.fill('24500');

        await this.bureautypedropdown.waitFor({ state: 'visible' });
        await this.bureautypedropdown.click();

        await this.bureautypselection.waitFor({ state: 'visible' });
        await this.bureautypselection.click();

        await this.financialdetailsNextButton.waitFor({ state: 'visible' });
        await this.financialdetailsNextButton.click();

        //documnet page next button
        await this.documentNextButton.waitFor({ state: 'visible' });
        await this.documentNextButton.click();

    }

    async BlendedROI() {

        // try {
        //     if (this.acceptandupdateroibutton) {
        //         await this.acceptandupdateroibutton.waitFor({ state: 'visible' });
        //         await this.acceptandupdateroibutton.click();

        //         await this.blendedroiNextButton.waitFor({ state: 'visible' });
        //         await this.blendedroiNextButton.click();
        //     } else {
        await this.blendedroiNextButton.waitFor({ state: 'visible' });
        await this.blendedroiNextButton.click();
        //     }
        // } catch(e) {
        //     console.log(e);
        // }
    }

    async PreviewAndSubmit() {
        await this.submitbutton.waitFor({ state: 'visible' });
        await this.submitbutton.click();
        // await this.submitbutton.click();
    }

    async getApplicationNumber() {
        await this.getleadnumbertext.waitFor({ state: 'visible' });
        const lead = await this.getleadnumbertext.textContent();
        console.log(`Lead number: ${lead}`);
    }

}
