const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
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
  {
    state: "5",
    n_one: "109981388011260008",
    n_tow: "201703029959",
    n_threy: "0655669941",
  },
  {
    state: "5",
    n_one: "109930093005480008",
    n_tow: "201503014157",
    n_threy: "0659713072",
  },
  {
    state: "5",
    n_one: "109870887004250003",
    n_tow: "870425021158",
    n_threy: "0775835497",
  },
  {
    state: "26",
    n_one: "109930887074030002",
    n_tow: "937403000453",
    n_threy: "0668711747",
  },
  {
    state: "37",
    n_one: "109971245004390006",
    n_tow: "201703013983",
    n_threy: "0697011878",
  },
  {
    state: "39",
    n_one: "109911258002390004",
    n_tow: "214748",
    n_threy: "0660395388",
  },
  {
    state: "39",
    n_one: "109881256020070109",
    n_tow: "479640",
    n_threy: "0779129870",
  },
  {
    state: "39",
    n_one: "109911258002390004",
    n_tow: "214748",
    n_threy: "0660395388",
  },
  {
    state: "39",
    n_one: "109931256006420104",
    n_tow: "376169",
    n_threy: "0699791876",
  },
  {
    state: "39",
    n_one: "109841256005090105",
    n_tow: "286839",
    n_threy: "0671721711",
  },
  {
    state: "23",
    n_one: "109910840000270006",
    n_tow: "40077",
    n_threy: "0658247451",
  },
  {
    state: "39",
    n_one: "109961270000620000",
    n_tow: "201503011709",
    n_threy: "0670203194",
  },
  {
    state: "05",
    n_one: "109950093025980008",
    n_tow: "952598001237",
    n_threy: "0662001770",
  },
  {
    state: "05",
    n_one: "1099600900252100004",
    n_tow: "201503006204",
    n_threy: "0699524609",
  },
  {
    state: "44",
    n_one: "109711403003940009",
    n_tow: "710394023546",
    n_threy: "0656086424",
  },
  {
    state: "47",
    n_one: "100001486009090000",
    n_tow: "202103048057",
    n_threy: "0664391472",
  },
  {
    state: "17",
    n_one: "109830850066460003",
    n_tow: "836646000642",
    n_threy: "0551775154",
  },
  {
    state: "17",
    n_one: "109830850066460003",
    n_tow: "836646000642",
    n_threy: "0551775154",
  },

  // أضف بيانات باقي الأشخاص هنا
];

async function openTabAndRegister(driver, person) {
  await driver.switchTo().newWindow("tab");

  let pageLoaded = false;
  while (!pageLoaded) {
    await driver.get("https://aadl3inscription2024.dz/");

    try {
      // تحقق من وجود الزر "A14"
      let newAccountButton = await driver.findElement(By.id("A14"));
      if (newAccountButton) {
        await newAccountButton.click();

        // الانتظار حتى يظهر حقل الإدخال بعد التحويل إلى صفحة التسجيل
        await driver.wait(until.elementLocated(By.id("A22")), 10000);
        pageLoaded = true;
      } else {
        // تحقق من وجود الحقل "A22"
        await driver.findElement(By.id("A22"));
        pageLoaded = true;
      }
    } catch (error) {
      console.log("Element not found, refreshing page in 4 seconds...");
      await driver.sleep(4000);
    }
  }

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
}

(async function example() {
  let options = new chrome.Options();

  let driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  for (let person of people) {
    try {
      await openTabAndRegister(driver, person);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
})();
