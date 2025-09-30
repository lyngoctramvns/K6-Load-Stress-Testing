import {faker} from "@faker-js/faker";

export function searchProductParam(){
    const productList = ['Top','Men','T-shirt','Women','Jeans']
    return {
        search_product: faker.helpers.arrayElement(productList)
    }
}

export function createUser(){
    const sex = faker.helpers.arrayElement(["male","female"])
    const userName = faker.person.firstName(sex)
    return {
        name: userName,
        email: faker.internet.email({firstName: userName}),
        password: faker.internet.password({length: 8, memorable: true}),
        title: faker.person.prefix(sex),
        birth_date: faker.number.int({min:1, max:31}),
        birth_month: faker.date.month(),
        birth_year: faker.date.birthdate({ mode: 'age', min: 18, max: 65 }).getFullYear(),
        firstname: userName,
        lastname: faker.person.lastName(),
        company: faker.company.name(),
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        country: faker.location.country(),
        zipcode: faker.location.zipCode(),
        state: faker.location.state(),
        city: faker.location.city(),
        mobile_number: faker.phone.number()
    }
}

export function verifyLogin(userEmail: string, userPassword:string){
    return {
        email: userEmail,
        password: userPassword
    }
}