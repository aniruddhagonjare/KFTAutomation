//ts-check
import {test} from '@playwright/test';


test.beforeAll(async({}) => {

    console.log('This will run BEFORE ALL tests in the file');

});
    
test.beforeEach(async({}) => {

    console.log('This will run BEFORE EACH test in the file');

});

test.afterAll(async({}) => {

    console.log('This will run AFTER ALL tests in the file');

});

test.afterEach(async({}) => {

    console.log('This will run AFTER EACH test in the file');
});                  


test ('This is my first test ', async() => {

    console.log('This is my first test');   
});

test ('This is my Second test ', async() => {

    console.log('This is my Second test');   
});