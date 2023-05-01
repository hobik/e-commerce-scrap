const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

// sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// global variables to store data
// const productURL = 'https://www.ebay.com/itm/295166895736';
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

function filterSelect(arrSelect) {
  try {
    return arrSelect.filter(row => row.toLowerCase() != '- select -');
  } catch (err) {
    return arrSelect;
  }
}

function filterNonNumber(value) {
  try {
    const regex = /[\d\.]+/;
    const match = value.match(regex);
    return match[0];
  } catch (err) {
    return value;
  }
}

// available colors
async function getColorImages(page) {
  try {
    const rawColorSources = await page.$$eval(
      'li.sku-property-item > div.sku-property-image > img', 
      elems => {
        return elems.map(elem => elem.getAttribute('src'));
      }
    );
    return rawColorSources;
  } catch (err) {
    console.error(err);
    return [];
  }
};

// colors
async function getColors(page) {
  try {
    const rawColors = await page.$$eval(
      '#x-msku__select-box-1000 option',
      elems => {
        return elems.map(elem => {
          return elem.textContent;
        });
      }
    );
    return rawColors;
  } catch (err) {
    console.error(err);
    return [];
  }
  
};

async function getColorsV2(page) {
  try {
    const colors = [];
    const rawColors = await page.$$("#x-msku__select-box-1000 option"); 
    for (const rawColor of rawColors){
      const textContent = await rawColor.getProperty('textContent');
      const color = await textContent.jsonValue();
      colors.push(color);
    }
    return filterSelect(colors);
  } catch (err) {
    console.error(err);
    return [];
  }
};


// price
async function getPrice(page) {
  try {
    const rawPrice = await page.$("[itemprop='price'] span");
    const textContent = await rawPrice.getProperty('textContent');
    const price = await textContent.jsonValue();
    return filterNonNumber(price);
  } catch (err) {
    console.error(err);
    return null;
  }
  
};


//title
async function getTitle(page) {
  try {
    const h1 = await page.$('h1.x-item-title__mainTitle > span');
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
    const description = await page.$eval(
      'div.tab-content-m span.ux-textspans',
      el => el.textContent.trim()
    );
    return description;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// image urls
async function getImageUrls(page) {
  try {
    const imageSources = await page.$$eval(
      '#vi_main_img_fs img', 
      images => images.map(img => img.getAttribute('src'))
    );
    return imageSources;
  } catch (err) {
    console.error(err);
    return [];
  }
};


// stars
async function getStars(page) {
  try {
    const rawStars = await page.$('.ux-seller-section__item > span');
    const textContent = await rawStars.getProperty('textContent');
    const stars = textContent.jsonValue();
    return stars;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// reviews
async function getReviews(page) {
  try {
    const rawReviews = await page.$('#STORE_INFORMATION0-0-51-43-10-tabs-0 span span');
    const textContent = await rawReviews.getProperty('textContent');
    const reviews = await textContent.jsonValue();
    return reviews;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// total orders placed
async function getTotalOrders(page) {
  try {
    const orders = await page.$('.d-quantity__availability');
    const textContent = await orders.getProperty('textContent');
    const ordersPlaced = await textContent.jsonValue();
    return ordersPlaced;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// sizes
async function getSizes(page) {
  try {
    const sizes = [];
    const rawSizes = await page.$$("#x-msku__select-box-1001 option"); 
    for (const rawSize of rawSizes){
      const textContent = await rawSize.getProperty('textContent');
      const size = await textContent.jsonValue();
      sizes.push(size);
    }
    return filterSelect(sizes);
  } catch (err) {
    console.error(err);
    return [];
  }
};

async function scrape(productURL) {
  // initialization
  const browser = await puppeteer.launch({ headless: true }); // change false -> true to reduce time but it might cause some error. check once if it works then continue. 
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  await page.goto(productURL);
  // await sleep(5000);

  productInfo.price = await getPrice(page);
  productInfo.title = await getTitle(page);
  productInfo.description = await getDescription(page);
  productInfo.imageURLs = await getImageUrls(page);
  productInfo.stars = await getStars(page);
  productInfo.reviews = await getReviews(page);
  productInfo.ordersPlaced = await getTotalOrders(page);
  productInfo.colors.colorName = await getColorsV2(page);
  productInfo.sizes = await getSizes(page);

  // console.log(productInfo)
  await browser.close();
  return productInfo
}
exports.ebay = scrape

