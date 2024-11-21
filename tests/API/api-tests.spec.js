const { test, expect } = require('@playwright/test');
const exp = require('constants');

test.describe('two tests', () => {
   const baseURL = "https://simple-grocery-store-api.glitch.me";

    test('Validate endpoint response status is successful', async ({ request }) => {
             
        const response = await request.get(baseURL + "/status");
        expect(response.status()).toBe(200);
        console.log(response.status());
     });
  
    test('Validate endpoint is invalid', async ({ request }) => {
             
        const response = await request.get(baseURL + "/status1");
        expect(response.status()).toBe(404);
     });

    test('Validate the response body', async ({ request }) => {
             
        const response = await request.get(baseURL + "/status");
        expect(response.status()).toBe(200);

                // first approach:
       //  const responseBody = JSON.parse(await response.text());
       //  console.log(responseBody);

                 // short alternative:
       const responseBody2 = await response.json();
       
       //validation:
       expect(responseBody2.status).toContain("UP");
       expect(responseBody2.status).toBe("UP");
       //my assertions:
       expect(responseBody2.status).toMatch("UP");
    //fall:   expect(responseBody2.status).stringContaining("UP");

        // console.log(responseBody2);
     });

     test('Validate the single product response body', async ({ request }) => {
             
        const response = await request.get(baseURL + "/products/4643");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
       
        console.log(responseBody); 
        
        //assertions:
        expect(responseBody.id).toBe(4643);
        expect(responseBody.category).toBe('coffee');
        expect(responseBody.name).toContain("Starbucks");
        expect(responseBody.manufacturer).toBeTruthy();
        expect(responseBody.price).toBeGreaterThan(40);
        expect(responseBody["current-stock"]).not.toBeNull();
        expect(responseBody.inStock).toBe(true);

     });
     test('Validate card', async ({ request }) => {
             
        const response = await request.get(baseURL + "/products/4643");
        expect(response.status()).toBe(200);

        const responseBody = await response.json();
       
        console.log(responseBody); 
        
        //assertions:
        expect(responseBody.id).toBe(4643);
        expect(responseBody.category).toBe('coffee');
        expect(responseBody.name).toContain("Starbucks");
        expect(responseBody.manufacturer).toBeTruthy();
        expect(responseBody.price).toBeGreaterThan(40);
        expect(responseBody["current-stock"]).not.toBeNull();
        expect(responseBody.inStock).toBe(true);

     });

     test('POST - add new item to cart', async ({ request }) => {
             
        const response = await request.post(baseURL + "/carts/eyf97-iHIo7XP1biA_5yz/items", { 
            data: {
                "productId": 4643
                }

     });
     expect(response.status()).toBe(201);

        const responseBody = await response.json();
               console.log(responseBody); 
     });

     test('POST - add new item to cart and delete it', async ({ request }) => {
             
                const response2 = await request.post(baseURL + "/carts/eyf97-iHIo7XP1biA_5yz/items", { 
                    data: {
                        "productId": 4643
                        }
                 });

             expect(response2.status()).toBe(201);
        
                const responseBody = await response2.json();
                       
                console.log(responseBody); 
                    
            });

});