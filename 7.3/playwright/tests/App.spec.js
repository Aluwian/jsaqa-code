const { test, expect } = require('@playwright/test');
const { email, password } = require('../user');

test.describe('Netology authorization tests', () => {
  
  test('Успешная авторизация', async ({ page }) => {
    await page.goto('https://netology.ru/?modal=sign_in');
    await page.click('text=Войти по почте');

    // Заполнение поля Email
    await page.click('[placeholder="Email"]');
    await page.fill('[placeholder="Email"]', email);

      // Заполнение поля пароль
    await page.click('[placeholder="Пароль"]', {
      modifiers: ['Meta']
    });
    await page.fill('[placeholder="Пароль"]', password);

      // Click [data-testid="login-submit-btn"]
    await page.click('[data-testid="login-submit-btn"]');

    // ПАУЗА для ручного прохождения капчи (60 секунд)
    console.log('Необходимо пройти капчу и вручную запустить тест дальше');
    await page.pause();
    
    await page.waitForURL('https://netology.ru/profile/**');
    await expect(page.getByTestId('profile-programs-content')).toContainText('Здравствуйте,');
  });

  test('Неудачная авторизация', async ({ page }) => { 
    await page.goto('https://netology.ru/?modal=sign_in');
    await page.click('text=Войти по почте');
    
    // Заполнение поля Email
    await page.click('[placeholder="Email"]');
    await page.fill('[placeholder="Email"]', 'uncorrect@example.com');

    // Заполнение поля пароль
    await page.click('[placeholder="Пароль"]', {
      modifiers: ['Meta']
    });
    await page.fill('[placeholder="Пароль"]', 'uncorrectpassword123');

    // Click [data-testid="login-submit-btn"]
    await page.click('[data-testid="login-submit-btn"]');

    // ПАУЗА для ручного прохождения капчи (60 секунд)
    console.log('Необходимо пройти капчу и вручную запустить тест дальше');
    await page.pause();

    await expect(page.getByTestId('login-error-hint')).toContainText('Вы ввели неправильно логин или пароль.');
  });
});
