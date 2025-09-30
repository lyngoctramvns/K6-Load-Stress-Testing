import http, { Response, RequestBody } from 'k6/http';
import { check, sleep } from 'k6';
import { Options } from 'k6/options';
import { searchProductParam, createUser, verifyLogin } from './payload';
import { faker } from '@faker-js/faker';

const BASEURL = __ENV.BASE_URL;

const headers = { headers: {
  "Content-Type": "application/x-www-form-urlencoded",
  'Accept': 'application/json'
}}

const userLimit = 50;
const userRampUpTime = 30; // seconds
const userHoldTime = 15; // seconds
const userRampDownTime = 30; // seconds
const userMinimum = 0;

export const options: Options = {
  stages: [
    { duration: `${userRampUpTime}s`, target: userLimit }, // Ramp-up to 50 users over 30s
    { duration: `${userHoldTime}s`, target: userLimit }, // Stay at 50 users for 15s
    { duration: `${userRampDownTime}s`, target: userMinimum },  // Ramp-down to 0 users in 30s
  ],
};

export default function (): void {
  // Example GET request
  const res: Response = http.get(`${BASEURL}api/productsList`);
  check(res, {
    'status is 200': (r: Response) => r.status === 200,
  });

  // POST All Products request
  const postAllProductRes: Response = http.post(
    `${BASEURL}api/productsList`,
    "",
    headers
  );
  const postAllProductResTrue = check(postAllProductRes, {
    'status is 405': (r: Response) => r.status === 405,
  })
  if(!postAllProductResTrue){
    console.log(`POST All Products request FAILED: ${postAllProductRes.body}`);
  }

  //GET all brand list
  const allBrandListRes: Response = http.get(
    `${BASEURL}api/brandsList`
  )
  const allBrandListResTrue = check(allBrandListRes, {
    'status is 200': (r: Response) => r.status === 200,
  })
  if(!allBrandListResTrue){
    console.log(`GET all brand list request FAILED: ${allBrandListRes.body}`);
  }
  //PUT to all brand list
  const allBrandListPutRes: Response = http.put(
    `${BASEURL}api/brandsList`
  )
  const allBrandPutResTrue = check(allBrandListPutRes, {
    'Status is 405': (r: Response) => r.status === 405,
  })
  if(!allBrandPutResTrue){
    console.log(`PUT to all brand list request FAILED: ${allBrandListPutRes.body}`);
  }
  // POST Search Product request
  const formSearchProductData = JSON.stringify(searchProductParam())
  const searchProductRes: Response = http.post(
    `${BASEURL}api/searchProduct`,
    formSearchProductData,
    headers
  )
  const searchProductResTrue = check(searchProductRes, {
    'status is 200': (r: Response) =>r.status === 200
  });
  if(!searchProductResTrue){
    console.log(`POST Search Product request FAILED: ${searchProductRes.body}`);
  }

  //POST to register new user
  let userList = [];
  const generateUser: any = createUser();
  userList.push(generateUser);
  const registerUserRes: Response = http.post(
    `${BASEURL}api/createAccount`,
    JSON.stringify(generateUser),
    headers
  )
  const registerUserResTrue = check(registerUserRes, {
    'status is 201': (r: Response) => r.status === 201
  });
  if(!registerUserResTrue){
    console.log(`POST to register new user request FAILED: ${registerUserRes.body}`);
  }

  //POST to verify login with valid details
  const userVeify = faker.helpers.arrayElement(userList);
  const verifyLoginRes: Response = http.post(
    `${BASEURL}api/verifyLogin`,
    JSON.stringify(verifyLogin(
      userVeify.email, 
      userVeify.password
    )),
    headers
  )
  const verifyLoginResTrue = check(verifyLoginRes, {
    'status is 200': (r: Response) => r.status === 200
  });
  if(!verifyLoginResTrue){
    console.log(`POST to verify login with valid details request FAILED: ${verifyLoginRes.body}`);
  }
  sleep(1);
} 