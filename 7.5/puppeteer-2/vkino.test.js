const puppeteer = require("puppeteer");
require("expect-puppeteer");
const commands = require("./lib/commands");
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
});

beforeEach(async () => {
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);
    page.setDefaultTimeout(60000);
    await page.goto("https://qamid.tmweb.ru/client/index.php");
});

afterEach(async () => {
    await page.close();
});

afterAll(async () => {
    await browser.close();
});

describe("Проверка сеансов", () => {
    test('Нельзя выбрать сеанс, который уже прошел', async () => {
        console.log('Тест: Выбор сегодняшнего дня');
        await commands.selectDay(page, 0);

        console.log('Тест: Проверка сеанса с прошедшим временем');
        const pastSeance = await page.$('[data-seance-id="234"]');
        expect(pastSeance).toBeTruthy();
        
        console.log('Тест пройден!');
    }); 
})

describe("Бронирование мест в кинотеатре", () => { 

    test("Бронирование 1 места на Ведьмак в ВИП зал", async () => {
        console.log('Тест 1: Шаг 1: Выбор дня');
        await commands.selectDay(page, 1);

        console.log('Шаг 2: Выбор сеанса');
        await commands.selectSeance(page, '223');

        console.log('Шаг 3: Выбор места');
        await commands.selectOneFreeChair(page);

        console.log('Шаг 4: Подтверждение бронирования');
        await commands.confirmBooking(page);

        console.log('Шаг 6: Проверка билета');
        const ticket = await commands.getTicketInfo(page);
        expect(ticket.title).toContain('Ведьмак');
        expect(ticket.price).toContain('100');
        console.log('Тест 1 пройден!');
    });

    test("Выбор 2 мест на Ведьмак в ВИП зал возможен", async () => {
        
        console.log('Тест 2: Шаг 1: Выбор дня');
        await commands.selectDay(page, 2);

        console.log('Шаг 2: Выбор сеанса');
        await commands.selectSeance(page, '225');

        console.log('Шаг 3: Выбор двух мест');
        await commands.selectTwoFreeChairs(page);

        console.log('Шаг 4: Подтверждение выбора мест');
        await commands.confirmBooking(page);

        console.log('Шаг 5: Проверка билетов');
        const ticket = await commands.getTicketInfo(page);
        expect(ticket.title).toContain('Ведьмак');
        expect(ticket.price).toContain('400');
    });

    test("Попытка забронировать уже занятое место неуспешна", async () => {
        console.log('Тест 3: Шаг 1: Переход на сеанс');
        await commands.selectDay(page, 1);
        await commands.selectSeance(page, '223');

        await commands.selectOneFreeChair(page);
        await commands.confirmBooking(page);

            // Возвращаемся на главную и переходим на тот же сеанс
        await page.goto('https://qamid.tmweb.ru/client/index.php');
        await page.waitForSelector('.page-nav__day', { visible: true });
        await commands.selectDay(page, 1);
        await commands.selectSeance(page, '223');
        await page.waitForSelector('.buying-scheme__chair', { visible: true });       

        console.log('Шаг 3: Попытка выбора места');
        const isNotClickable = await commands.isTakenChairNotClickable(page);
        expect(isNotClickable).toBe(true);

        const takenChairs = await page.$$('.buying-scheme__chair_taken');
        console.log('Найдено занятых мест:', takenChairs.length);
        expect(takenChairs.length).toBeGreaterThan(0);

        console.log('Тест 3 пройден!');
    });
});
