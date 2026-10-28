import { test as base, expect } from '@playwright/test';
import { loginPage } from '../pages/losService/loginPage.js';
import { selectPool } from '../pages/losService/selectpool.js';
import { uploadPoolFile } from '../pages/losService/uploadPoolFile.js';
import { afterPoolUploadPopupWindow } from '../pages/losService/afterPoolUploadPopupWindow.js';
import { poolQueue } from '../pages/losService/poolQueue.js';
import { l3PoolQueue } from '../pages/lmsService/l3PoolQueue.js';
import { l1PoolQueue } from '../pages/lmsService/l1PoolQueue.js';
import { applicationQueue } from '../pages/lmsService/applicationQueueL1.js';
import { applicationQueueL3 } from '../pages/lmsService/applicationQueueL3.js';
import { applicationQueueL0 } from '../pages/lmsService/applicationQueueL0.js';
import { CommonFunctions } from '../pages/commonFunctions.js';
import { excelUtils } from '../src/config/excelUtils.js';
import { searchCustomer } from '../pages/lmsService/superadmin/searchCustomer.js';
import { Ledgers } from '../pages/lmsService/superadmin/ledgers.js';
import { backFill, supportMaker } from '../pages/lmsService/superadmin/supportMaker/backFill.js';
import { backFillRequestSupportChecker } from '../pages/lmsService/superadmin/supportChecker/backFillRequestSupportChecker.js';
import { RPS } from '../pages/lmsService/superadmin/RPS.js';
import { SOA } from '../pages/lmsService/superadmin/SOA.js';
import { activeProcessDetails } from '../pages/lmsService/superadmin/supportMaker/activeProcessDetails.js';
import { sideBarMenu } from '../pages/lmsService/superadmin/sideBarMenu.js';
import { collectionUpload } from '../pages/lmsService/superadmin/collectionUpload.js';
import { BrowserUtils } from '../src/utils/losServiceUtils/BrowserUtlis.js';
import { loginPageScreenJourney } from '../pages/screenJourney/loginPageScreenJourney.js';
import { createApplication } from '../pages/screenJourney/createApplication.js'
import { EodProcess } from '../pages/lmsService/superadmin/EodProcess.js';
import { dataCleanUp } from '../pages/lmsService/superadmin/supportMaker/dataCleanUp.js';
import { changeAccountStatus } from '../pages/lmsService/superadmin/supportMaker/changeAccountStatus.js';

let batchName, applicationBatchName, customerId, firstDateRPS, lastDateRPS, backFillFileName, disbursementDate;

export const setBatchName = (name) => { batchName = name; };
export const getBatchName = () => batchName;
export const setApplicationBatchName = (name) => { applicationBatchName = name; };
export const getApplicationBatchName = () => applicationBatchName;
export const setCustomerId = (id) => { customerId = id; };
export const getCustomerId = () => customerId;

export const setPartnerName = (name) => { process.env.partnername = name; };
export const getPartnerName = () => { return process.env.partnername || ''; };
export const setProductName = (name) => { process.env.productname = name; };
export const getProductName = () => { return process.env.productname || ''; };

export const setRPSAllEmiDates = (no) => { process.env.rpsallemiDates = no; };
export const getRPSAllEmiDates = () => { return process.env.rpsallemiDates || ''; };

export const setApplicationId = (id) => { process.env.GLOBAL_APPLICATION_ID = id; };
export const getApplicationId = () => { return process.env.GLOBAL_APPLICATION_ID || ''; };

export const setDemandDate = (id) => { process.env.demanddate = id; };
export const getDemandDate = () => { return process.env.demanddate || ''; };

export const setDemandDateFormatted = (id) => { process.env.formattedDemandDate = id; };
export const getDemandDateFormatted = () => { return process.env.formattedDemandDate || ''; };

export const setDisbursementDate = (id) => { disbursementDate = id; };
export const getDisbursementDate = () => disbursementDate;

export const setFirstDateRPS = (name) => { firstDateRPS = name; };
export const getFirstDateRPS = () => firstDateRPS;

export const setLastDateRPS = (name) => { lastDateRPS = name; };
export const getLastDateRPS = () => lastDateRPS;

export const setbackFillFileName = (name) => { backFillFileName = name; };
export const getbackFillFileName = () => backFillFileName;

export const setModeName = (id) => {  process.env.ModeName= id; };
export const getModeName = () => { return process.env.ModeName || ''; };

export const setApplicationIdGlobal = (id) => {  process.env.application_id_global= id; };
export const getApplicationIdGlobal = () => { return process.env.application_id_global || ''; };

export const setCollectionAmountConsolidate = (amount) => { process.env.GLOBAL_collectionConsolidate_amount = amount; };
export const getCollectionAmountConsolidate = () => { return process.env.GLOBAL_collectionConsolidate_amount || ''; };

export const setCollectionAmountBank = (amount) => { process.env.GLOBAL_collectionBank_amount = amount; };
export const getCollectionAmountBank = () => { return process.env.GLOBAL_collectionBank_amount || ''; }

export const setExcessAmountConsole = (amount) => { process.env.excessAmountConsole = amount; };
export const getExcessAmountConsole = () => { return process.env.excessAmountConsole || ''; };

export const setExcessAmountBank = (amount) => { process.env.excessAmountbank; };
export const getExcessAmountBank = () => { return process.env.excessAmountbank || ''; }

export const setOverdueAmountConsole = (amount) => { process.env.overdueAmountConsole = amount; };
export const getOverdueAmountConsole = () => { return process.env.overdueAmountConsole || ''; };

export const setOverdueAmountBank = (amount) => { process.env.overdueAmountBank = amount; };
export const getOverdueAmountBank = () => { return process.env.overdueAmountBank || ''; };

export const setEMIAmount = (amount) => { process.env.EMIDate = amount; };
export const getEMIAmount = () => { return process.env.EMIDate || ''; };

export const setConsoleDueAmount = (amount) => { process.env.DueconsoleAmount = amount; };
export const getConsoleDueAmount = () => { return process.env.DueconsoleAmount || ''; };

export const setbankDueAmount = (amount) => { process.env.DuebankAmount = amount; };
export const getbankDueAmount = () => { return process.env.DuebankAmount || ''; };

export const setConsoleModifiedAmount = (amount) => { process.env.ConsoleModifiedamount = amount; };
export const getConsoleModifiedAmount = () => { return process.env.ConsoleModifiedamount || ''; };

export const setBankModifiedAmount = (amount) => { process.env.bankModifiedamount = amount; };
export const getBankModifiedAmount = () => { return process.env.bankModifiedamount || ''; };

export const setOSPrinicipleAmoluntConsole = (amount) => { process.env.consoleoutstandingPrincipalAmount = amount; };
export const getOSPrinicipleAmoluntConsole = () => { return process.env.consoleoutstandingPrincipalAmount || ''; };

export const setOSPrinicipleAmoluntBank = (amount) => { process.env.bankoutstandingPrincipalAmount = amount; };
export const getOSPrinicipleAmoluntBank = () => { return process.env.bankoutstandingPrincipalAmount || ''; };

export const setConsoleLoanStatus = (status) => { process.env.consoleloanstatus = status; };
export const getConsoleLoanStatus = () => { return process.env.consoleloanstatus || ''; };

export const setBankLoanStatus = (status) => { process.env.bankloanstatus = status; };
export const getBankLoanStatus = () => { return process.env.bankloanstatus || ''; };

export { expect };

export class BaseTest {
  constructor() {
    this.page = null;
    this.searchCustomer = null;
    this.loginPage = null;
    this.applicationqueueL3 = null;
    this.applicationqueue = null;
    this.l3poolqueue = null;
    this.l1poolqueue = null;
    this.poolqueue = null;
    this.managePoupwindow = null;
    this.upload = null;
    this.selectPools = null;
    this.commonfunction = null;
    this.Ledgers = null;
    this.backFill = null;
    this.rps = null;
    this.soa = null;
    this.sidebarMenu = null;
    this.activeprocessdetails = null;
    this.backFillRequestSupportChecker = null;
    this.collectionUpload = null;
    this.eodprocess = null;

    this.loginpagescreenjourney = null;
    this.createapplication = null;
    this.excelutils = excelUtils;
    this.BrowserUtils = null;
  }

  async init(page) {
    this.page = page;
    this.searchCustomer = new searchCustomer(page);
    this.loginPage = new loginPage(page)
    this.applicationqueueL3 = new applicationQueueL3(page);
    this.applicationqueue = new applicationQueue(page);
    this.applicationQueueL0 = new applicationQueueL0(page);
    this.l3poolqueue = new l3PoolQueue(page);
    this.l1poolqueue = new l1PoolQueue(page);
    this.poolqueue = new poolQueue(page);
    this.managePoupwindow = new afterPoolUploadPopupWindow(page);
    this.upload = new uploadPoolFile(page);
    this.selectPools = new selectPool(page);
    this.commonfunction = new CommonFunctions(page);
    this.Ledgers = new Ledgers(page);
    this.backFill = new backFill(page);
    this.activeprocessdetails = new activeProcessDetails(page);
    this.backFillRequestSupportChecker = new backFillRequestSupportChecker(page);
    this.sidebarMenu = new sideBarMenu(page);
    this.BrowserUtils = new BrowserUtils(page);
    this.rps = new RPS(page);
    this.soa = new SOA(page);
    this.collectionUpload = new collectionUpload(page);
    this.eodprocess = new EodProcess(page);
    this.dataCleanUp = new dataCleanUp(page);
    this.changeAccountStatus = new changeAccountStatus(page);

    //Screen Journy
    this.loginpagescreenjourney = new loginPageScreenJourney(page);
    this.createapplication = new createApplication(page);

    


// ----------------------------------- Handling the application Id's form here -----------------------------------

  // //setApplicationIdGlobal('481347801');
  //   const applicationIds = [''];
  //   module.exports = { applicationIds };    

  }
};
