module.exports = {
  // Кликнуть по элементу с определенным селектором
  clickElement: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      await page.click(selector);
    } catch (error) {
      throw new Error(`Selector is not clickable: ${selector}`);
    }
  },
  // Получить тест их элемента
  getText: async function (page, selector) {
    try {
      await page.waitForSelector(selector);
      return await page.$eval(selector, (link) => link.textContent);
    } catch (error) {
      throw new Error(`Text is not available for selector: ${selector}`);
    }
  },

  //Выбрать день по индексу
  selectDay: async function (page, dayIndex) {
    const days = await page.$$('.page-nav__day');
    await days[dayIndex].click();
  },

  //Выбрать сеанс по ID
  selectSeance: async function (page, seanceId) {
    await page.waitForSelector(`[data-seance-id="${seanceId}"]`, { visible: true });
    await page.click(`[data-seance-id="${seanceId}"]`);
  },

  //Выбрать одно свободное место
  selectOneFreeChair: async function (page) {
    const selector = '.buying-scheme__chair_standart:not(.buying-scheme__chair_selected):not(.buying-scheme__chair_taken)';
    await page.waitForSelector(selector, { visible: true });
    const chairs = await page.$$(selector);
    await chairs[0].click();
  },

  //Выбрать два свободных места
  selectTwoFreeChairs: async function (page) {
    const selector = '.buying-scheme__chair_standart:not(.buying-scheme__chair_selected):not(.buying-scheme__chair_taken)';
    await page.waitForSelector(selector, { visible: true });
    const chairs = await page.$$(selector);
    await chairs[0].click();
    await chairs[1].click();
  },

  //Подтвердить бронирование (два этапа)
  confirmBooking: async function (page) {
    await page.waitForSelector('.acceptin-button', { visible: true });
    await page.click('.acceptin-button');

    await page.waitForSelector('.acceptin-button', { visible: true });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('.acceptin-button')
    ]);
    
    // Даём время на загрузку билета
    await page.waitForTimeout(2000);
  },

  // Получить информацию о билете

  getTicketInfo: async function (page) {
    await page.waitForSelector('.ticket__title', { visible: true, timeout: 10000 });
    const title = await page.$eval('.ticket__title', el => el.textContent.trim());
    
    return { title };
  },


  // Проверить наличие занятых мест
  hasTakenChairs: async function (page) {
    const takenChairs = await page.$$('.buying-scheme__chair_taken');
    return takenChairs.length > 0;
  },

  // Проверить что занятое место не кликабельно
  isTakenChairNotClickable: async function (page) {
    const takenChair = await page.$('.buying-scheme__chair_taken');
    if (!takenChair) return false;
    const isSelected = await page.$('.buying-scheme__chair_taken.buying-scheme__chair_selected');
    return isSelected === null;
  },
};
