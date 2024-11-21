const { test, expect } = require('@playwright/test');
const exp = require('constants');

test.describe('Individual API testcase exercise', () => {
   const baseURL = "https://simple-grocery-store-api.glitch.me";

   test('#1 Create a new cart and validate its creation', async ({ request }) => {
             
        const response = await request.post(`${baseURL}/carts`);
        expect(response.status()).toBe(201);

        const responseBody = await response.json();
        console.log(responseBody);

        expect(responseBody.created).toBe(true); //a card is created 
        expect(responseBody.cartId).toBeDefined(); //id of a card is created 
                });

    test('#2 Add a new product to the cart - validate it got added', async ({ request }) => {
             
            const response = await request.post(`${baseURL}/carts`);
            expect(response.status()).toBe(201);
    
            const responseBody = await response.json();
            console.log(responseBody);

            //assertions of creating a cart
            expect(responseBody.created).toBe(true); //a card is created 
            expect(responseBody.cartId).toBeDefined(); //id of a card is created 

            //here is second task - adding an item to a new card:
            const responseAddItemToCart = await request.post(`${baseURL}/carts/${responseBody.cartId}/items`, { 
                data: {
                    "productId": 4643,
                },
                });
            expect(responseAddItemToCart.status()).toBe(201);

            const responseAddItemToCartBody = await responseAddItemToCart.json();
            console.log(`responseAddItemToCartBody:  ${JSON.stringify(responseAddItemToCartBody)}`);
            console.log('Item added to cart response:', responseAddItemToCartBody);

            //assertions of adding to this card choosen items:
            expect(responseAddItemToCartBody).toBeDefined();  //body exist
            expect(responseAddItemToCartBody.created).toBe(true); //item successfully added
            expect(responseAddItemToCartBody.itemId).toBeTruthy(); // verify we added exact product # 4643
            });

     test('#3 Delete the added product - validate it got deleted', async ({ request }) => {
             
                const responseCreatingACart = await request.post(`${baseURL}/carts`);
                expect(responseCreatingACart.status()).toBe(201);
        
                const responseBody = await responseCreatingACart.json();
                console.log('created a cart : ' , responseBody);
    
                //assertions of creating a cart
                expect(responseBody.created).toBe(true); //a cart is created 
                expect(responseBody.cartId).toBeDefined(); //id of a cart is created 
    
                // adding an item to a new card:
                const responseAddItemToCart = await request.post(`${baseURL}/carts/${responseBody.cartId}/items`, { 
                    data: {
                        "productId": 4643,
                        quantity: 1,
                    },
                    });
                expect(responseAddItemToCart.status()).toBe(201);//assertions of adding an item to the cart
    
                const responseAddItemToCartBody = await responseAddItemToCart.json();
                console.log(`responseAddItemToCartBody:  ${JSON.stringify(responseAddItemToCartBody)}`);
                console.log('Item added to cart response:', responseAddItemToCartBody);
    
                //assertions of adding to this card choosen item:
                expect(responseAddItemToCartBody).toBeDefined();  //body exist
                expect(responseAddItemToCartBody.created).toBe(true); //item successfully added
                const itemId = responseAddItemToCartBody.itemId;  //we have id of an item added to cart!!!!!!
                console.log(`responseAddItemToCartBody.itemId:    ${itemId}`);  
                
                //DELETE /carts/:cartId/items/:itemId
                const responseDeleteItemFromCart = await request.delete(`${baseURL}/carts/${responseBody.cartId}/items/${itemId}`);
                expect(responseDeleteItemFromCart.status()).toBe(204);  //verify we deleted an item from cart
                
                //check if we really deleted:
                const responseGetCart = await request.delete(`${baseURL}/carts/${responseBody.cartId}/items/${itemId}`);
                const cartItems = await responseGetCart.json();
                console.log('Cart after deletion:', cartItems);

        // GET call to receive contents of cart and validate that it is empty
        const getCartItems = await request.get(`${baseURL}/carts/${responseBody.cartId}`);
        expect(getCartItems.status()).toBe(200);
        const getCartItemsBody = await getCartItems.json();
        expect(getCartItemsBody.items).toStrictEqual([]);
        });

    test('Creating a new cart, adding a 2 products in it and then replacing one of them, validating it got replaced and other one stayed.', async ({ request }) => {

            // Creates a new cart
            const createCart = await request.post(baseURL + "/carts");
            expect(createCart.status()).toBe(201);
        
            const createCartBody = await createCart.json();
            expect(createCartBody.created).toBe(true);
    
            // Saves the unique cart id as a new constant from the previous response body
            const cartID = createCartBody.cartId;
            console.log(cartID);
        
            // Makes the POST call to add 1st product to the cart, validates it got added
            const addProduct = await request.post(baseURL + "/carts/" + cartID + "/items", {
       
                data: {
                    productId: 4643
                }
            });
            expect(addProduct.status()).toBe(201);
            const addProductBody = await addProduct.json();
            expect(addProductBody.created).toBe(true);
            console.log(addProductBody);
        
            // Extracts the first added product item ID from the response body as a new constant
            const itemID = addProductBody.itemId;
            console.log(itemID);
        
            // Makes the POST call to add 2nd product to the cart, validates it got added
            const addProduct2 = await request.post(baseURL + "/carts/" + cartID + "/items", {
       
                data: {
                    productId: 5477
                }
            });
            expect(addProduct2.status()).toBe(201);
            const addProductBody2 = await addProduct2.json();
            expect(addProductBody2.created).toBe(true);
            console.log(addProductBody2);
    
            // Extracts the first added product item ID from the response body as a new constant
            const itemID2 = addProductBody2.itemId;
            console.log(itemID2);
    
            // GET call to see the entire cart and validate it now contains our 2 products
            const getCartItems = await request.get(baseURL + "/carts/" + cartID);
            expect(getCartItems.status()).toBe(200);
            const getCartItemsBody = await getCartItems.json();
            console.log(getCartItemsBody);
            expect(getCartItemsBody.items[0].productId,).toBe(4643);
            expect(getCartItemsBody.items[1].productId,).toBe(5477);
    
            // PUT call - replaces the 1st item 4643 (coffee) with 5774 (milk chocolate)
            const replaceProduct = await request.put(baseURL + "/carts/" + cartID + "/items/" + itemID, {
        
                data: {
                    productId: 6483
                }
                });
            expect(replaceProduct.status()).toBe(204);
    
            // GET call to see the updated cart and validate new product got added and original one is still there.
            const getCartItems2 = await request.get(baseURL + "/carts/" + cartID);
            expect(getCartItems2.status()).toBe(200);
            const getCartItemsBody2 = await getCartItems2.json();
            console.log(getCartItemsBody2);
            expect(getCartItemsBody2.items[0].productId,).toBe(6483);
            expect(getCartItemsBody2.items[1].productId,).toBe(5477);
            });
       
        test.skip('Creating an user account and extracting token', async ({ request }) => {
            var response = await request.post(baseURL + "/api-clients", {
                data: {
                    "clientName": "Nat Sam",
                    "clientEmail": "natSam@example.com"
                }
            });
                    
            console.log('Response status:', response.status()); // Log the status and full response body for debugging
            var responseBody = await response.json();
            console.log('Response Body:', responseBody);
        
            // Check if the status code is 201 and accessToken exists
            expect(response.status()).toBe(201);
            expect(responseBody.accessToken).not.toBeNull();
        
            // If everything is fine, store the token
            token = responseBody.accessToken;
            console.log("✅ TOKEN:", token);
        });
});