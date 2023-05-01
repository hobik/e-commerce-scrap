const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

// sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// global variables to store data
// const productURL = 'https://www.wish.com/product/5a619c03f718e05ea3e1094f';
const productInfo = {
  price: null,
  title: null,
  description: null,
  imageURLs: [],
  stars: null,
  reviews: null,
  ordersPlaced: null,
  sizes: [],
  colors: {
    colorName: [],
    source: []
  }
};

// price
async function getPrice(page) {
  try {
    const rawPrice = await page.waitForSelector('div.PurchaseContainer__ActualPrice-sc-15kmsqg-9',{ timeout: 10000 });
    const textContent = await rawPrice.getProperty('textContent');
    const price = await textContent.jsonValue();
    return price;
  } catch (err) {
    console.error(err);
    return null;
  }
  
};


//title
async function getTitle(page) {
  try {
    const h1 = await page.waitForSelector('h1.PurchaseContainer__Name-sc-15kmsqg-3', { timeout: 10000 });
    const textContent = await h1.getProperty('textContent');
    const title = await textContent.jsonValue();
    return title;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// description
async function getDescription(page) {
  try {
    const rawDesc = await page.waitForSelector('.ProductDescriptionContainer__ProductDescriptionWrapper-m8ay5d-5 div', { timeout: 10000 });
    const textContent = await rawDesc.getProperty('textContent');
    const description = await textContent.jsonValue();
    return description;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// image urls
async function getImageUrls(page) {
  try {
    const imageUrls = [];
    const imagesViewItem = await page.$$('.cQKtHX');
    for (const imagesView of imagesViewItem){
      const image = await imagesView.$eval('img', elem => elem.getAttribute('src'));
      if (image) imageUrls.push(image);
    };
    return imageUrls;
  } catch (err) {
    console.error(err);
    return [];
  }
};


// reviews
async function getReviews(page) {
  try {
    const rawReviews = await page.waitForSelector('div.PurchaseContainer__RatingCount-sc-15kmsqg-5', { timeout: 10000 });
    const textContent = await rawReviews.getProperty('textContent');
    const reviews = await textContent.jsonValue();
    return reviews;
  } catch (err) {
    console.error(err);
    return null;
  }
};

async function scrape(productURL) {
  try {
    const startTime = performance.now();

    // initialization
    const browser = await puppeteer.launch({ headless: true }); // change false -> true to reduce time but it might cause some error. check once if it works then continue. 
    const page = await browser.newPage();
    await page.setUserAgent(userAgent.random().toString());
    await page.goto(productURL);
    // await sleep(5000);
    const endTime = performance.now();
    console.log("TIME",endTime-startTime)
    productInfo.price = await getPrice(page);
    productInfo.title = await getTitle(page);
    productInfo.description = await getDescription(page);
    productInfo.imageURLs = await getImageUrls(page);
    productInfo.reviews = await getReviews(page);

    console.log(productInfo)
    await browser.close();
    return productInfo
  } catch (err) {
    console.error(err);
    console.log(productInfo);
  }
} 

exports.wish = scrape