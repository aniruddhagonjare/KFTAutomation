//import { partnerCustomerId } from "supertest/lib/test"
// import { partnerCustomerId } from "../../payloads/userData.js"
// import { file } from "k6/http"

export const getTokenApiBody = {

    "UserName": "L0user@ugro.com",
    "Password": "8IuSF/1mew/MmGdlXzawN75F8Pbqkskep/UkhTnUaCo=",
    "ClientIp": ""
}

export const createLeadpiBody = {

    "LeadName": "Ani", // randomName
    "LeadEmail":  "enaa@gmail.com",//randomEmail,
    "LeadPAN":  "HUIPS2922D", //randomPAN,
    "LeadPhone":  8282828282, // randomMobileNumber,
    "LeadEntityType": " CloselyHeldCompanies",
    "RegistrationNo": "U22110CT1989PLC005037",
    "CustomerTaxResidentType": "Resident",
    "Incorporation_Country": "IN",
    "FatherName": "test", //randomName,
    "MotherName":  "testmother", //randomName,
    "CityOfBirth": "11999",
    "Community": "Hindu",
    "PlaceOfBirth": "IN",
    "LeadCaste": "General",
    "LeadMaritalStatus": "Single",
    "LeadDOB": "23/10/2000",
    "Prefix": "Mrs",
    "LeadGender": "Female"

}

export const setLeadProductApiBody = {

    "LeadId": 2,
    "IsColending": true,
    "ColendingMode": "Mode1",
    "IsBalanceTransfer": "Yes",
    "ProductCode": "AUSF Unsec BL"
}

export const addLeadAddressApiBody =
    [
        {
            "LeadId": 5,
            "ApplicationId": 0,
            "AddressType": "Mailing",
            "AddressLine1": "123 sector 6",
            "AddressLine2": "belapur mumbai",
            "PostalCode": "400014",
            "City": "11219",
            "State": "MH",
            "Country": "IN",
            "ResidingSinceDate": "01/01/2000",
            "PreferredFlag": "Y"
        },
        {
            "LeadId": 5,
            "ApplicationId": 0,
            "AddressType": "Registered",
            "AddressLine1": "123 sector 6",
            "AddressLine2": "belapur mumbai",
            "PostalCode": "400014",
            "City": "11219",
            "State": "MH",
            "Country": "IN",
            "ResidingSinceDate": "01/01/2000",
            "PreferredFlag": "N"
        }
    ]

export const addBusinessInformationApiBody = {
    "LeadId": 5,
    "Promoter_Director_Name": "test",
    "IncorporationDate_CommencementDate": "02/02/1990",
    "BusinessSector": "Manufacturing",
    "BusinessSubSector": "Medium",
    "ModeOfOperation": "1",
    "IncorporationCity": "11219",
    "BranchLocations": "11219"
}

export const addGSTDetailsApiBody =
    [
        {
            "LeadId": 5,
            "GSTNumber": "27AAPFG7943R1ZA",
            "GSTUserName": "Prachi123"
        }
    ]

export const saveUdyamDetailsApiBody = {

    "LeadId": 5,
    "UdyamIssueDate": "2022-10-06",
    "UdyamIssuePlace": "11219",
    "UdyamNICCode": "12345",
    "UdyamNICSubCode": "string",
    "UdyamIncorporationDate": "2022-10-06",
    "UdyamCommencementDate": "2022-10-06"
}

export const addLeadAdditionalDetailsApiBody = {
    "LeadId": 5,
    "Ckyc_Number": "12345678901234",
    "Risk": "Low",
    "InternalRating": 2,
    "PoliticallyExposed": "No",
    "BeneficiaryType": "Promotor"
}

export const application_SaveLoanAskDetailsApiBody = {

    "LeadId": 5,
    "LoanAmount": 300000,
    "AskRate": 12,
    "AskTenure": 24,
    "PurposeOfLoan": "Private",
    "leadguid": "272",
    "superadmin": "",
    "partnerId": 0,
    "isCrossInstance": true,
    "userId": "22"
}

export const application_SaveCustomerOfferApiBody = {

    "LeadId": 5,
    "LoanAmountWithInsurance": 4500000,
    "LoanAmountWithOutInsurance": 4000000,
    "Tenure": 12,
    "LoanROI": 14,
    "NBFCROI": 15,
    "BankROI": 14,
    "BaseRateType": "Fixed",
    "NBFCBaseRate": 15,
    "EMIMoratorium": 2,
    "PrincipleMoratorium": 0,
    "AdvanceEMI": 15000,
    "EMI": 0,
    "OriginatorLoanShare": 50,
    "LTV": 2,
    "ProcessingFee": 0,
    "SecurityDeposit": 10000,
    "NetDisbursalAmount": 4000000,
    "NBFCLANumber": "AIBIRS04413",
    "NbfcShareAmt": "800000",
    "BankShareAmt": "3200000"
}

export const application_SaveCoBorrowerDetailsApiBody = {

    "LeadId": 5,
    "CoBorrower_Name": "test", //randomName,
    "CoBorrower_DOB": "1990-08-28T09:19:15.059Z",
    "CoBorrower_PAN":  "GYHPS8282j" ,//randomPAN,
    "CoBorrower_NW": "10000000",
    "CoBorrower_NAI": "10000000",
    "CoBorrower_EntityType": "string",
    "ApplicantType": "Co-Borrower",
    "Relationship": "Signatory",
    "Landmark": "ok",
    "City": "Delhi",
    "Pincode": "110002",
    "Address": "ok",
    "EmailId":  "hsishjk@gmial.com", //randomEmail,
    "MobileNo":  "7291918181", // randomMobileNumber,
    "FinancialCoApplicantFlg": "Yes",
    "NRI_OCIFlag": "Yes",
    "CKYC_Number": "2354684",
    "Chief_Promoter_Shareholding": "55",
    "CoBorrower_InCorporationDate": "2000-08-28",
    "MotherName": "Anjali",
    "TitleOfCoBorrower": "Mr",
    "Gender": "Male",
    "MaritalStatus": "NA",
    "Caste": "General",
    "Community": "Christian"
}

export const application_SaveAdditionalLoanDetailsCLM2ApiBody = {

    "LeadId": 5,
    "SanctionLoanAmountWithInsurance": 2200000,
    "SanctionLoanAmountWithoutInsurance": 2000000,
    "SanctionDate": "2025-02-25",
    "POSWithoutInsurance": 2000000,
    "POSWithInsurance": 2200000,
    "EMIAmount": 20000,
    "DisbursementDate": "10/05/2024",
    "DisbursalAmount": "5000000",
    "NetDisbursalAmount": "5000000",
    "ProcessingFee": 0,
    "SanctionTenure": "26",
    "ResidualTenure": "26",
    "Moratorium": 0,
    "InterestRateType": "Fixed",
    "NBFCROI": 10,
    "CustomerROI": 10,
    "EMIDate": "10",
    "NBFCLANumber": "SIIAAH677O1779",
    "BankROI": "11.25",
    "NbfcShareAmt": "200000",
    "BankShareAmt": "1800000",
    "NbfcSharePercent": "20",
    "BankSharePercent": "80",
    "NBFCFirstEMIDate": "10/06/2024"
}


export const application_SubmitLoanApplicationApiBody = {

    "LeadId": 5,
}

export const bank_SaveBankDetailsApiBody = {

    "LeadId": 5,
    "BankCode": 530,
    "AccountHolderName":  "sjksjs",//randomName,
    "AccountType": "Current",
    "IFSC": "ICIC0006298",
    "AccountNumber": "00011020001772"
}

export const bank_SaveInsuranceDetailsApiBody = {

    "LeadId": 5,
    "InsuranceType": "No",
    "CustomerPANNo": " shhs", // randomPAN,
    "UTRCodePremiumTransfer": "string",
    "PartnerBankCode": "28281",
    "DeathBenefit": "100000",
    "PartnerAccNo": "17199101818",
    "ApointeeDOB": "2026-04-13T05:20:26.605Z",
    "NomineeRelation": "Spouse",
    "InsurerName": "Yes",
    "InsuredAmount": 200000,
    "NameOfInsured": "Ani",
    "Tenure": 12,
    "InsurancePremium": 200000,
    "PolicyTerm": "string",
    "MarriageStatus": "Married",
    "Weight": 55,
    "Height": 167,
    "SumAssured": 300000,
    "NomineeFirstName": "Test",
    "NomineeLastName": "Nmae",
    "NomineeGender": "Male",
    "NomineeDOB": "2026-04-13T05:20:26.605Z",
    "ApointeeName": "hsh",
    "PartnerIFSC": "IDFB0040112",
    "Insurance": 1,
    "PremiumPaidBy": "Company"

}

export const bank_SavePostSanctionsApiBody = {

    "TDSApplicable": "No",
    "TDS": "Net",
    "LeadId": 5,
    "CycleDay": 3

}

export const upload_filesApiBody = ({ file, leadId, docCode }) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("leadId", leadId);
    formData.append("doccode", docCode);
    formData.append("ApplicantType", "Applicant");
    return formData;
};

export const upload_bankStatementsApiBody = {


}

export const bre_SaveBreBureauDataSplitApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "SMAOverduesUptoThirtyDays": "Yes"
}

export const bre_SaveBreBureauDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "FirstTimeBorrower": "No",
    "HasCreditHistory": "Yes",
    "CIBILScore": "850",
    "CRIFScore": "800",
    "CMRRANK": "CMR 6",
    "AnyDaysPastDue": "Yes",
    "AnySMA": "Yes",
    "AnyWrittenOff": "Yes",
    "AnyWrittenOffLoanAmount": "100000",
    "AnyWrittenOffCreditCardAmount": "25000",
    "IsApplicantWilfullDefaulterOrFraud": "No",
    "CoApplicantCIBILScore": "725",
    "CoApplicantCRIFScore": "750",
    "Chargaff": "645",
    "IsSuitFiled": "Yes",
    "IsChargeOff": "Yes",
    "IsNPA": "Yes",
    "FacilityTypeForSuitNPAChargeOff": "string",
    "DefaultAmount": "value",
    "LastDefaultDate": "02/03/2022",
    "BureauType": "CIBIL",
    "BureauScore": "5",
    "OverdueInLoansAgainstBank": "20000",
    "AnypreviousWriteOff": "Yes"
}

export const bre_SaveBreProductDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "GrossExposure": "10000",
    "PeriodMoratorium": "3",
    "ApplicantsLocation": "11219",
    "IsPropertyLegalVettingDoneByTwoDifferentLawers": "Yes"
}

export const bre_SaveBreBankingDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "TotalEmiBounce": "0",
    "TotalChequeReturn": "1",
    "TotalChequeReturnMax": "1",
    "TotalBankTransaction": "50",
    "IsCC_OD_Over_Utilized": "50",
    "MaxEMIVsActualEMI": "001",
    "RoutingSaleProceed": "004",
    "SumABB": "600",
    "UnutilisedCCOD": "546",
    "TotalCreditSummation": "49876",
    "TotalLoanAmtCr": "10000000",
    "MoreThanFourChqReturnedForFinancialReasons": "Yes",
    "NoOfBanksDealingWith": "45",
    "NetIncome": "10100000",
    "TotalBankingCredit": "56533",
    "TotalBankingDebit": "345546",
    "TTM_Adj_ABB": "650",
    "BankStatementStartDate": "05/10/2015",
    "BankStatementEndDate": "05/10/2016",
    "TotalBankingStatementPeriodInMonths": "12",
    "IsNonTechnicalEMIBounce": "Yes",
    "MaxDPDInCaseOfTechChequeBounces": "0",
    "NoOfMonthsWithZeroCreditTTM": "0",
    "NoOfMonthsWithZeroDebitTTM": "0",
    "RelationshipWithBank": "104",
    "CreditTransaction": "0",
    "DebitTransaction": "0",
    "Return": "3",
    "GstTObyBTO": "2",
    "ChequeReturnInLast12Months": "3",
    "EmiToABBRatio": "5",
    "RepaymentfromSavingsAccount": "No"

}

export const bre_SaveBreFinancialsDataApiBody = {


    "LeadId": 5,
    "ApplicationId": 0,
    "MachineryInvestment": "854",
    "EquipmentInvestment": "6852",
    "SalesTurnover": "85",
    "GrossIncome": "55000",
    "BalanceSheetDate1": "01/01/2020",
    "BalanceSheetTurnover1": "85",
    "BalanceSheetDate2": "01/01/2021",
    "BalanceSheetTurnover2": "78",
    "BalanceSheetDate3": "01/01/2022",
    "BalanceSheetTurnover3": "89",
    "ITR_EBITDA": "85",
    "CompanyProfitMargin": "52",
    "NetMonthlyIncome": "50000",
    "HouseholdExpenses": "85",
    "Foir": "52",
    "NetWorth": "852",
    "StabilityOfIncome": "101",
    "ProofOfIncomeOfBorrower": "No proof",
    "IsCollateralized": "Yes",
    "YoYGrowth": "865",
    "Family_or_Group_ExposureLimit": "22000",
    "TurnoverByFinancial": "5500000",
    "OperatingExpenses": "500",
    "ExistingEMI": "1000",
    "ProposedEMI": "1000",
    "TurnoverByGst": "50"
}


export const bre_SaveBreDemographyGeneralDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "ApplicantsAge": "28",
    "BusinessType": "Trading",
    "ApplicantsCaste": "General",
    "isCoApplicantDataProvided": "Yes",
    "ApplicantsGender": "Female",
    "BusinessIndustryType": "238",
    "HospitalitySector": "No",
    "BusinessSubIndustryType": "102",
    "UdyamAadharNo": "UDYAM-KR-03-0075932",
    "GuarantorAge": "001",
    "BusinessPlaceOwnership": "002",
    "ExistingRelationWithBank": "Yes",
    "IndustryCode": "101",
    "IndustryMargin": "5.5",
    "StayInSince": "20/07/1999",
    "WorkExperiance": "22",
    "MobilityOfLocation": "101",
    "OwnerShipDetails": "The factory/ office to be in the name of Company",
    "UdyamRequired": "Applied",
    "CKYC": "Yes",
    "ChequeHandover": "Fully Realise",
    "DisbursementStatus": "Partial",
    "TopUpCase": "No",
    "BalanceTransfer": "BT",
    "SuccessionPlansAvailable": "Yes",
    "RequiredTradeLicenseAvailable": "Some of the licenses and permissions are yet to be obtained",
    "PurposeOfLoan": "Purchase of P and M/Equipment",
    "OwningBusinessPremises": "Owned Business or Residence",
    "CGTMSE": "Yes",
    "TwoPositiveTradeReferences": "Yes",
    "AnyDeviation": "Yes"
}

export const bre_SaveBreGSTDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "GstMaxConcentration": "12",
    "GSTR_Receipt_Operative_Bank": "50",
    "GSTTurnoverCurrentYear": "20",
    "GSTTurnoverPreviousYear": "50",
    "TTMGSTBasedTurnover": "5",
    "TTMGSTGrowthRate": "5.5",
    "GSTReturnsStartDate": "02/11/2000",
    "GSTReturnsEndDate": "13/12/2020",
    "TotalGstReturnPeriodInMonths": "06",
    "GSTTurnoverPreviousTTMYear": "20",
    "GSTBasedTurnover": "5",
    "GSTYOYTurnover": "5"
}

export const bre_SaveBreGuarantorDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "GuarantorType": "120",
    "GuarantorNetWorth": "4"
}

export const bre_SaveBreTriangulationDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "AnnualizedTurnOverBasedOnBanking": "1700000",
    "AnnualizedTurnOverBasedOnGST": "2000000",
    "AnnualizedTurnOverBasedOnBalancesheet": "150000",
    "ValueBankingBasedGst": "60"
}

export const bre_SaveBreAssessmentDataApiBody = {

    "LeadId": 5,
    "ApplicationId": 0,
    "AssessmentMethod": 103,
    "LTV": "90",
    "DSCRPostFunding": ""
}


const randomName = function getRandomName() {
    const firstNames = ['Aniruddha', 'Rahul', 'Priya', 'Sneha', 'Arjun', 'Neha', 'Vikram', 'Pooja', 'AniruAmitddha'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Mehta', 'Reddy', 'Nair', 'Iyer'];

    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${first} ${last}`;
}

const randomString = function getRandomString(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

const randomEmail = function getRandomEmail(domain = "example.com") {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';

    for (let i = 0; i < 8; i++) {
        name += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${name}@${domain}`;
}

let randomPAN = function getRandomPAN() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let pan = '';

    // First 5 letters
    for (let i = 0; i < 5; i++) {
        pan += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Next 4 digits
    for (let i = 0; i < 4; i++) {
        pan += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    // Last letter
    pan += letters.charAt(Math.floor(Math.random() * letters.length));

    return pan;
}

let randomMobileNumber = function getRandomMobileNumber() {
    const firstDigits = ['6', '7', '8', '9'];
    let number = '';

    // First digit (valid Indian mobile start)
    number += firstDigits[Math.floor(Math.random() * firstDigits.length)];

    // Remaining 9 digits
    for (let i = 0; i < 9; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}