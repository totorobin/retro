/** Generated from: tests/features/userParams.feature */
import {test} from "playwright-bdd";

test.describe("Login Functionality", () => {

    test("First connection", async ({Given, browser, When, Then}) => {
        await Given("A new user 'userRandom'", null, {browser});
        await When("'userRandom' connect to the home");
        await Then("'userRandom' is not logged");
        await When("'userRandom' set his name as 'Toto'");
        await Then("'userRandom' is now named 'Toto'");
    });

});

// == technical section ==

test.use({
    $test: ({}, use) => use(test),
    $uri: ({}, use) => use("tests/features/userParams.feature"),
    $bddFileMeta: ({}, use) => use(bddFileMeta),
});

const bddFileMeta = {
    "First connection": {"pickleLocation": "4:5"},
};