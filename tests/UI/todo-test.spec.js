const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
   await page.goto('https://todomvc.com/examples/react/dist/');
});

test('SCENARIO: User should be able to add a new todo', async ({ page }) => {

        await test.step('GIVEN: user has opened the todomvc todos page', async () => {
      });

        await test.step('WHEN: user writes a new todo and submits it', async () => {

          await page.getByTestId("text-input").fill("buy milk");  
          // other ways to name the search field:
          // const todoField1 = await page.getByTestId("text-input");
          // const todoField2= await page.getByPlaceholder("What needs to be done?");
          // const todoField3= await page.getByLabel("New Todo Input"); //<label class="visually-hidden" for="todo-input">New Todo Input</label>
          // const todoField4= await page.locator("[class='new-todo']");
          // const todoField5= await page.locator("#todo-input"); //by id
          // const todoField6= await page.locator("input"); 
          // const todoField7= await page.locator("xpath=/html/body/section/header/div/input");  //by Xpath

          await page.getByTestId("text-input").press('Enter');   // await page.keyboard.press("Enter");
          await page.getByTestId("todo-item-label");  //working with created list:
      });

        await test.step('THEN: user should see the new todo got added', async () => {
        
          await expect(page.getByTestId("todo-item-label")).toContainText("milk");  //contain part text
          await expect(page.getByTestId("todo-item-label")).toBeVisible();
          await expect(page.getByTestId("todo-item-label")).toHaveText("buy milk");
          //await page.locator("xpath=//*[contains(@data-testid, 'todo-item-label')]"); //by Xpath
          //await page.locator("class= 'toggle']");
      });
});
 
test('SCENARIO: User should be able to see the completed tasks when “Completed” filter is selected', async ({ page }) => {

  await test.step('GIVEN: User is on the todo page and has entered one todo that has been completed', async () => {
    await page.getByTestId("text-input").fill("buy milk");  
    await page.getByTestId("text-input").press('Enter');
    await page.getByTestId('todo-item-toggle').click();

    await expect( page.getByTestId('todo-item-toggle')).toBeChecked();
  });

  await test.step('WHEN: User selects the “Completed” filter from the menu', async () => {
    await page.getByRole('link', { name: 'Completed' }).click();
    await page.waitForURL(/.*completed/);
  });

  await test.step('THEN: User is able to see the completed todo task', async () => {

    await expect(page).toHaveURL(/.*completed/);
    await expect(page.getByTestId("todo-item-label")).toBeVisible();
    });
});

test('SCENARIO: #1 User should be able to filter between \'All\', \'Active\' and \'Completed\' filters with desired results', async ({ page }) => {
  await test.step('GIVEN: User is on the todo page with multiple tasks', async () => {

    const tasks = ["Buy milk", "Write tests", "Read book"];   // Add 3 tasks
    for (const task of tasks) {
      await page.getByTestId("text-input").fill(task);
      await page.getByTestId("text-input").press('Enter');
    }

    await page.locator('div').filter({ hasText: 'Write tests' }).getByTestId('todo-item-toggle').click(); // Complete "Write tests"
    await page.locator('div').filter({ hasText: 'Read book' }).getByTestId('todo-item-toggle').click(); // Complete "Read book"
   });

  await test.step('WHEN: User selects the "All" filter', async () => {
    await page.getByRole('link', { name: 'All' }).click();  //click All button   -  getByRole('link', { name: 'All' })
  });
   await test.step('THEN: User sees all tasks', async () => {
    const allTasks = await page.getByTestId('todo-item-label').allTextContents(); 
    expect(allTasks).toEqual(["Buy milk", "Write tests", "Read book"]);
  });

  await test.step('WHEN: User selects the "Active" filter', async () => {
    await page.getByRole('link', { name: 'Active' }).click();   // click Active button - getByRole('link', { name: 'Active' })
  });
  await test.step('THEN: User sees only active tasks', async () => {
    expect( await page.getByTestId('todo-item-label').allTextContents()).toEqual(["Buy milk"]); // Only "Buy milk" is active
  });

  await test.step('WHEN: User selects the "Completed" filter', async () => {
    await page.getByRole('link', { name: 'Completed' }).click();
  });
  await test.step('THEN: User sees only completed tasks', async () => {
    expect(await page.getByTestId('todo-item-label').allTextContents()).toEqual(["Write tests", "Read book"]); // These tasks are completed
  });
});

test('SCENARIO: #2 User should be able to remove the completed todos', async ({ page }) => {
  await test.step('GIVEN: User is on the todo page with multiple tasks', async () => {

    const tasks = ["Write tests", "Read book"];   // Add 2 tasks
    for (const task of tasks) {
      await page.getByTestId("text-input").fill(task);
      await page.getByTestId("text-input").press('Enter');
    }

    await page.locator('div').filter({ hasText: 'Write tests' }).getByTestId('todo-item-toggle').click(); // Complete "Write tests"
    await page.locator('div').filter({ hasText: 'Read book' }).getByTestId('todo-item-toggle').click(); // Complete "Read book"
   });
    await test.step('WHEN: User selects the "Completed" filter', async () => {
    await page.getByRole('link', { name: 'Completed' }).click();
  });
  
  await test.step('AND: Delete two completed tasks', async () => {
  
      await page.getByText('Write tests').hover();  
      await page.waitForTimeout(1500);
      await page.getByRole('button', { name: '×' }).click();  // delete "write tests" task by clicking x button
   
      await page.getByText('Read book').hover(); 
      await page.waitForTimeout(1500);
      await page.getByRole('button', { name: '×' }).click();  // delete "read books" task by clicking x button
  });
  
  await test.step('THEN: User sees there is no tasks todo', async () => {
      await expect(page.getByTestId("todo-list")).toBeEmpty();
  });
});

test('SCENARIO: #3 User should be able to toggle multiple tasks as completed from complete all toggle', async ({ page }) => {
  await test.step('GIVEN: User is on the todo page with multiple tasks', async () => {

    const tasks = ["Write tests", "Read book", "Work out", "Go home"];   // Add 4 tasks
    for (const task of tasks) {
      await page.getByTestId("text-input").fill(task);
      await page.getByTestId("text-input").press('Enter');
      }
    });

    await test.step('WHEN: User press Select All Tasks button', async () => {
    await page.getByTestId('toggle-all').click();
  });
   
  await test.step('THEN: User sees all tasks are choosen', async () => {
    //<input class="toggle-all" type="checkbox" data-testid="toggle-all">
  const toggles = page.locator('[data-testid="todo-item-toggle"]');  // Ensure that all individual toggles are checked
  const count = await toggles.count(); // Get the number of tasks
  
  for (let i = 0; i < count; i++) {
    await expect(toggles.nth(i)).toBeChecked(); // Check each toggle is marked as completed
  }
  });
});
 
test('SCENARIO: #4 User should be able to remove an added todo with x icon', async ({ page }) => {
  
  const tasks = ["Write tests", "Read book"];   // Add 2 tasks
  for (const task of tasks) {
    await page.getByTestId("text-input").fill(task);
    await page.getByTestId("text-input").press('Enter');
  }

  await page.locator('div').filter({ hasText: 'Write tests' }).getByTestId('todo-item-toggle').click(); // Complete "Write tests"
  await page.locator('div').filter({ hasText: 'Read book' }).getByTestId('todo-item-toggle').click(); // Complete "Read book"

  await test.step('WHEN: User selects the "Completed" filter', async () => {
  await page.getByRole('link', { name: 'Completed' }).click();
});

await test.step('AND: Delete two completed tasks', async () => {

    await page.getByText('Write tests').hover();  
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: '×' }).click();  // delete "write tests" task by clicking x button
 
    await page.getByText('Read book').hover(); 
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: '×' }).click();  // delete "read books" task by clicking x button
});

await test.step('THEN: User sees there is no tasks todo', async () => {
    await expect(page.getByTestId("todo-list")).toBeEmpty();
});
});

test("SCENARIO: #5 User should be able to uncheck a completed todo item from todo list that has multiple items", async ({ page }) => {
  await test.step("GIVEN: User added 4 things on the list and selected 3 as completed", async () => {
    await page.getByTestId("text-input").fill("Item 1");
    await page.getByTestId("text-input").press("Enter");
    await page.getByTestId("text-input").fill("Item 2 - completed");
    await page.getByTestId("text-input").press("Enter");
    await expect(page.locator('[data-testid="todo-item-toggle"]').nth(0)).not.toBeChecked();
    await page.locator('[data-testid="todo-item-toggle"]').nth(1).click();
    await expect(page.locator('[data-testid="todo-item-toggle"]').nth(1)).toBeChecked();
  });

  await test.step("WHEN: User unchecks the completed tasks", async () => {
    await page.locator('[data-testid="todo-item-toggle"]').nth(1).click();
  });

  await test.step("THEN: User can see all tasks are not checked", async () => {
    await expect(page.locator('[data-testid="todo-item-toggle"]').nth(0)).not.toBeChecked();
    await expect(page.locator('[data-testid="todo-item-toggle"]').nth(1)).not.toBeChecked();
  });
});

test("SCENARIO:  #6 User should be able to edit an existing todo item and change the name to a new one", async ({ page }) => {
  await test.step("GIVEN: User has created a todo task", async () => {
   
    await page.getByTestId("text-input").fill("First item");
    await page.getByTestId("text-input").press("Enter");
    
    // Verify the task is created with correct text
    await expect(page.getByTestId("todo-item-label").first()).toHaveText("First item");
  });

  await test.step("WHEN: User double-clicks on the created task", async () => {
    await page.getByTestId("todo-item-label").first().dblclick();
  });

  await test.step("THEN: User can modify the text of the created todo task", async () => {
    await page.getByTestId("todo-item").getByTestId('text-input').fill("First item UPDATED");
    await page.getByTestId("todo-item").getByTestId('text-input').press("Enter");

    await expect(page.getByTestId("todo-item-label").first()).toHaveText("First item UPDATED");
  });
});