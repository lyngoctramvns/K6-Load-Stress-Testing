import http, { Response } from 'k6/http';
import { check } from 'k6';
import { verifyLogin } from "../payload";
import { faker } from '@faker-js/faker';

export class UserComponent {
    public url: string;
    public headers: any;
    constructor(url: string, headers: any) {
        this.url = url;
        this.headers = headers;
    }

    toFormUrlEncoded(obj: any) {
        return Object.entries(obj)
            .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v == null ? '' : String(v)))
            .join('&');
    }

    generateVerifyUser(user: any){
        //POST to register new user
        const generateUser: any = user
        const registerUserRes: Response = http.post(
            `${this.url}api/createAccount`,
            generateUser,
            this.headers
        );
        const registerUserResTrue = check(registerUserRes, {
            'status is 200': (r: Response) => r.status === 200,
            'verify responseCode is 201': (r: Response) => r.json('responseCode') === 201,
            'verify message is User created!': (r: Response) => r.json('message') === 'User created!'
        });
        if (!registerUserResTrue) {
            console.log(`POST to register new user request FAILED: ${registerUserRes.body}`);
        }

        //POST to verify login with valid details
        const userVerify = generateUser
        const verifyLoginRes: Response = http.post(
            `${this.url}api/verifyLogin`,
            JSON.stringify(verifyLogin(
                userVerify.email,
                userVerify.password
            )),
            this.headers
        );
        const verifyLoginResTrue = check(verifyLoginRes, {
            'status is 200': (r: Response) => r.status === 200
        });
        if (!verifyLoginResTrue) {
            console.log(`POST to verify login with valid details request FAILED: ${verifyLoginRes.body}`);
        }
    }

    processUsersIncrementally(user: any) {
        const userUpdate = user
        userUpdate.company = faker.company.name();
        // Update user
        const updateRes: Response = http.put(
            `${this.url}api/updateAccount`,
            JSON.stringify(userUpdate),
            this.headers
        );
        const updateResTrue = check(updateRes, {
            'status is 200': (r: Response) => r.status === 200
        });
        if (!updateResTrue) {
            console.log(`Update user failed for ${userUpdate.email}: ${updateRes.body}`);
        }
        // Delete user
        const deleteRes: Response = http.del(
            `${this.url}api/deleteAccount`,
            JSON.stringify({
                email: user.email,
                password: user.password
            }),
            this.headers
        );
        const deleteResTrue = check(deleteRes, {
            'status is 200': (r: Response) => r.status === 200
        });
        if (!deleteResTrue) {
            console.log(`Delete user failed for ${user.email}: ${deleteRes.body}`);
        }
    }

}