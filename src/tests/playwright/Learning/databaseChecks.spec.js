import { test, expect } from '@playwright/test';
import * as db from '../../../utils/sqlQueryProduct'; 

test('LMS flow', async ({ page }) => {


    const product = await db.ProductsMaster();
    if (product) {
        console.log('Fetched Product Name:>>>>>>>>>>>>>>> ', product.MasterName);
    }

    const testData = await db.TestingQuery();
    if (testData) {
        console.log('Fetched Product key:>>>>>>>>>>>>>>> ', testData.MasterKey); 
    }

});

