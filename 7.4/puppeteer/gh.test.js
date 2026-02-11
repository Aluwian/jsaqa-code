const puppeteer = require("puppeteer");
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

afterAll(async () => {
  await browser.close();
});

describe("Github page tests", () => {

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://github.com/team");
  });

  afterEach(async () => {
    await page.close();
  })

  test("The h1 header content", async () => {
    const firstLink = await page.$("header div div a");
    await firstLink.click();
    await page.waitForSelector('h1');
    const title2 = await page.title();
    expect(title2).toEqual('GitHub · Change is constant. GitHub keeps you ahead. · GitHub');
  }, 20000);

  test("The first link attribute", async () => {
    const actual = await page.$eval("a", link => link.getAttribute('href') );
    expect(actual).toEqual("#start-of-content");
  }, 10000);

  test("The page contains Sign in button", async () => {
    const btnSelector = ".btn-large-mktg.btn-mktg";
    await page.waitForSelector(btnSelector, {
      visible: true,
    });
    const actual = await page.$eval(btnSelector, link => link.textContent);
    expect(actual).toContain("Get started with Team")
  }, 10000);

  test("Subscribe button has correct link", async () => {
    const btnSelector = ".btn-mktg.mb-4.btn-muted-mktg";
    await page.waitForSelector(btnSelector, { visible: true });
    const href = await page.$eval(btnSelector, el => el.href);
    expect(href).toContain('https://github.com/newsletter');
  }, 10000);
});

describe("Actions page tests", () => {

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto("https://github.com/features/actions");   
  });

  afterEach(async () => {
    await page.close();
  });

  test("The h1 header content", async () => {
    await page.waitForSelector('#hero-section-brand-heading');
    const h1Text = await page.$eval('#hero-section-brand-heading', el => el.textContent.trim());
    expect(h1Text).toContain("Automate your workflow from idea to production");
  }, 10000);

  test("The page title contains GitHub Actions", async () => {
    const title = await page.title();
    expect(title).toContain("GitHub Actions");
  }, 10000);

  test("The page conteins Get started with actions button", async () => {
    const btnSelector = 'a[href="https://docs.github.com/actions"]';
    await page.waitForSelector(btnSelector);
    const actual = await page.$eval(btnSelector, link => link.textContent);
    expect(actual).toContain("Get started with actions");
  }, 10000);
});
