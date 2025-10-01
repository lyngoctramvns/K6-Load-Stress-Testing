import { sleep } from 'k6';
import { Options } from 'k6/options';
import { ProductComponent } from './classes/products';
import { UserComponent } from './classes/users';

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

// Initialize classes
const productAPIComponent = new ProductComponent(BASEURL, headers);
const userAPIComponent = new UserComponent(BASEURL, headers);

export default function (): void {
  //GET & POST all products test
  productAPIComponent.allProducts();
  //GET & PUT all brands test
  productAPIComponent.allBrands();
  // Search products
  productAPIComponent.searchProducts();
  // Register and verify user
  const generatedUser = userAPIComponent.generateVerifyUser();
  // Update and Delete users
  userAPIComponent.processUsersIncrementally(generatedUser);
  sleep(1);
}