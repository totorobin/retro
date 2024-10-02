import { createBdd } from 'playwright-bdd';
import {BrowserContext, expect, Page} from "@playwright/test";

const { Given, When, Then } = createBdd();

const contexts : Record<string,BrowserContext> = {}
const pages : Record<string, Page> = {}

Given('A new user {string}', async ({ browser }, user: string) => {
    contexts[user] = await browser.newContext({locale: 'en'});
});


When('{string} connect to the home', async ({}, user: string) => {
    pages[user] = await contexts[user].newPage();
    await pages[user].goto('/');
});

When('{string} set his name as {string}', async ({}, user: string, name: string) => {
    await pages[user].getByTestId('loginform-username-input').fill(name)
    await pages[user].getByTestId('loginform-validate').click()
});


Then('{string} is now named {string}', async ({}, user: string, name: string) => {
    await expect(pages[user].getByTestId('user-card')).toContainText(name);
});

Then('{string} is not logged',  async ({}, user: string) => {
    await expect(pages[user].getByTestId('user-card')).not.toContainText(/.+/);
});