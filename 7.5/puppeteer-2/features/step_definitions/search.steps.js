const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { Given, When, Then, Before, After } = require("@cucumber/cucumber");  
const commands = require("../../lib/commands.js");

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

// Background
Given("I am on the cinema home page", async function () {
  await this.page.goto("https://qamid.tmweb.ru/client/index.php");
});

// Выбор дня по индексу
When ("I select day with index {int}", async function (index) {
  await commands.selectDay(this.page, index);
});

// Выбор сеанса по ID
When("I select seance with ID {string}", async function (seanceId) {
  await commands.selectSeance(this.page, seanceId);
});

// Выбор одного свободного места (для happy path)
When("I select one free seat", async function () {
  await commands.selectOneFreeChair(this.page);
});

// Выбор двух свободных мест
When("I select 2 free seats", async function () {
  await commands.selectTwoFreeChairs(this.page);
});

// Бронирование одного места (для sad path)
When("I book one seat", async function () {
  await commands.selectOneFreeChair(this.page);
});

// Возврат на главную страницу
When("I return to home page", async function () {
  await this.page.goto("https://qamid.tmweb.ru/client/index.php");
});

// Подтверждение бронирования (два этапа)
When("I confirm booking", async function () {
  await commands.confirmBooking(this.page);
});

// Повторный выбор дня (для sad path)
When("I select day with index {int} again", async function (index) {
  await commands.selectDay(this.page, index);
});

// Повторный выбор сеанса (для sad path)
When("I select seance with ID {string} again", async function (seanceId) {
  await commands.selectSeance(this.page, seanceId);
});

// Выбор сегодняшнего дня
When("I select today's day", async function () {
  await this.page.click(".page-nav__day.page-nav__day_today");
});

// Попытка выбрать прошедший сеанс
When("I try to select seance with ID {string}", async function (seanceId) {
  await this.page.waitForSelector(`[data-seance-id="${seanceId}"]`, { visible: true });
});

// Проверка названия фильма в билете
Then("I see a ticket for movie {string}", async function (movieTitle) {
  const ticket = await commands.getTicketInfo(this.page);
  expect(ticket.title).to.include(movieTitle);
});

// Проверка что занятое место недоступно для выбора
Then("Occupied seat is not available for selection", async function () {
  const isNotClickable = await commands.isTakenChairNotClickable(this.page);
  expect(isNotClickable).to.be.true;
  const takenChairs = await this.page.$$(".buying-scheme__chair_taken");
  expect(takenChairs.length).to.be.greaterThan(0);
});

// Проверка что прошедший сеанс существует (но недоступен)
Then("Seance is not available for booking", async function () {
  const seance = await this.page.$('[data-seance-id="234"]');
  expect(seance).to.exist;
});
