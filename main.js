const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// قائمة الأشخاص
const people = [
  {
    state: "04",
    n_one: "109810109001010006",
    n_tow: "810101005070",
    n_threy: "0697902172",
  },

  // أضف بيانات باقي الأشخاص هنا
];

async function openTabAndRegister(driver, person) {
  await driver.executeScript(
    'window.open("https://aadl3inscription2024.dz/", "_blank");'
  );
  let tabs = await driver.getAllWindowHandles();
  await driver.switchTo().window(tabs[tabs.length - 1]);

  let isSiteAvailable = false;

  while (!isSiteAvailable) {
    try {
      // تحقق من وجود الزر أو الحقل
      let isRegisterButtonPresent = await driver
        .findElements(By.id("registerButtonID"))
        .then((elements) => elements.length > 0);

      let isA22FieldPresent = await driver
        .findElements(By.id("A22"))
        .then((elements) => elements.length > 0);

      if (isRegisterButtonPresent) {
        // إذا كان زر التسجيل موجودًا، انقر عليه
        let registerButton = await driver.findElement(
          By.id("registerButtonID")
        );
        await registerButton.click();

        // الانتظار حتى يظهر حقل "A22"
        await driver.wait(until.elementLocated(By.id("A22")), 10000);
        isSiteAvailable = true; // الموقع متاح الآن، يمكن التوقف عن التحديث
      } else {
        // أعد تحميل الصفحة بعد 5 ثوانٍ في حالة عدم وجود الزر أو الحقل
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await driver.navigate().refresh();
      }
    } catch (err) {
      console.error(err);
      // أعد تحميل الصفحة بعد 5 ثوانٍ في حالة وجود خطأ
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await driver.navigate().refresh();
    }
  }

  // إزالة حماية عدم اللصق من الحقول النصية "A22" و "A27" و "A13"
  await driver.executeScript(
    `document.getElementById('A22').removeAttribute('onpaste');`
  );
  await driver.executeScript(
    `document.getElementById('A27').removeAttribute('onpaste');`
  );
  await driver.executeScript(
    `document.getElementById('A13').removeAttribute('onpaste');`
  );

  // تعبئة الحقل "A22"
  await driver.findElement(By.id("A22")).sendKeys(person.n_one);

  // تعبئة الحقل الجديد "A27"
  await driver.findElement(By.id("A27")).sendKeys(person.n_tow);

  // تعبئة الحقل "A13"
  await driver.findElement(By.id("A13")).sendKeys(person.n_threy);

  // تحديد الخيار المطلوب من القائمة المنسدلة "A17"
  let selectElement = await driver.findElement(By.id("A17"));
  await selectElement.sendKeys(person.state);

  // تحديد checkbox "A91_1"
  let checkbox = await driver.findElement(By.id("A91_1"));
  if (!(await checkbox.isSelected())) {
    await checkbox.click();
  }

  // انقر على الزر "A55"
  let a55Button = await driver.findElement(By.id("A55"));
  await a55Button.click();

  // الانتظار حتى يظهر الزر "A138"
  await driver.wait(until.elementLocated(By.id("A138")), 10000);

  // النقر على الزر "A138"
  let a138Button = await driver.findElement(By.id("A138"));
  await a138Button.click();
}

(async function example() {
  let options = new chrome.Options();
  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  for (let person of people) {
    await openTabAndRegister(driver, person);
  }

  // الآن جميع التبويبات مفتوحة ومعبأة
})();
