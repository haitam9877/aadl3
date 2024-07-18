const { Builder, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const { Select } = require("selenium-webdriver/lib/select");
require("chromedriver");

const people = [
  {
    state: "5",
    n_one: "109880093008900002",
    n_tow: "880890000940",
    n_threy: "0770314455",
  },
  {
    state: "5",
    n_one: "119930887021250009",
    n_tow: "932125002258",
    n_threy: "0658107237",
  },
  {
    state: "5",
    n_one: "119971388003170000",
    n_tow: "970317006842",
    n_threy: "0664827520",
  },
  // أضف بيانات باقي الأشخاص هنا
];

async function openTabAndRegister(driver, person) {
  try {
    // إزالة الحماية من اللصق في الحقول
    await driver.executeScript(
      `document.getElementById('A22').removeAttribute('onpaste');`
    );
    await driver.executeScript(
      `document.getElementById('A27').removeAttribute('onpaste');`
    );
    await driver.executeScript(
      `document.getElementById('A13').removeAttribute('onpaste');`
    );

    // تعبئة الحقول
    await driver.findElement(By.id("A22")).sendKeys(person.n_one);
    await driver.findElement(By.id("A27")).sendKeys(person.n_tow);
    await driver.findElement(By.id("A13")).sendKeys(person.n_threy);

    // اختيار الحالة
    let selectElement = await driver.findElement(By.id("A17"));
    let select = new Select(selectElement);
    await select.selectByValue(person.state);

    // النقر على المربع المحدد
    let label = await driver.findElement(By.css("label[for='A91_1']"));
    if (label) {
      console.log("Label found, clicking on it");
      await label.click();
    } else {
      console.error("Label not found");
    }

    // انقر على الزر "A55"
    let a55Button = await driver.findElement(By.id("A55"));
    await a55Button.click();

    // الانتظار حتى يظهر الزر "A138" في الـ dialog
    await driver.wait(until.elementLocated(By.id("A138")), 10000);

    // النقر على الزر "A138"
    let a138Button = await driver.findElement(By.id("A138"));
    await a138Button.click();
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

async function checkSiteStatus(driver, url) {
  while (true) {
    try {
      await driver.get(url);
      // محاولة العثور على أي عنصر على الصفحة للتأكد من أنها فتحت بنجاح
      await driver.wait(until.elementLocated(By.id("A14")), 5000);
      return true; // إذا تم العثور على الزر "A14" بنجاح، نخرج من الحلقة
    } catch (error) {
      console.log("Page did not load, refreshing...");
      await driver.sleep(4000); // الانتظار لمدة 4 ثوانٍ قبل محاولة إعادة تحميل الصفحة
    }
  }
}

(async function example() {
  let options = new firefox.Options();
  let driver = await new Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(options)
    .build();

  const url = "https://aadl3inscription2024.dz/";

  let pageLoaded = await checkSiteStatus(driver, url);
  if (pageLoaded) {
    for (let person of people) {
      try {
        await openTabAndRegister(driver, person);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    }
  }

  await driver.quit();
})();
