const puppeteer = require('puppeteer');
const userAgent = require('user-agents');

// sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// const productURL = 'https://tr.aliexpress.com/item/1005004725342413.html';


// global variables to store data
let productInfo = {'price': '', 'details': '','title': '', 'imageURLs': [], 'stars': '', 'reviews': '', 'ordersPlaced': '', 'sizes': [], 'colors': {'colorName': [], 'source': []}}

function filterNonNumber(value) {
  try {
    const regex = /[\d\.,]+/;
    const match = value.match(regex);
    return match[0];
  } catch (err) {
    return value;
  }
}

async function aliexpress(productURL) {
    // initialization
    const browser = await puppeteer.launch({headless: true}); // change false -> true to reduce time but it might cause some error. check once if it works then continue. 
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto(productURL)
    await sleep(10000)

    // uncomment this snippet and tell if it runs or not
    // available colors
    let rawColorSources = await page.$$eval('li.sku-property-item > div.sku-property-image > img', elems => {return elems.map(elem => elem.getAttribute('src'))});
    productInfo.colors.source = rawColorSources

    // colors
    let rawColors = await page.$$eval('li.sku-property-item > div.sku-property-image > img', elems => {return elems.map(elem => elem.getAttribute('title'))});
    productInfo.colors.colorName = rawColors

    // price
    let rawPrice = await page.$('div.product-price');
    let price = await (await rawPrice.getProperty('textContent')).jsonValue();
    // checks if the price is in a box wrapper or is open in the form of text
    // console.log("Price",price)
    await page.evaluate('window.scrollTo(0, 1000)');
    const detailSelector = await page.waitForSelector('div.product-overview > div.product-description', { timeout: 10000 });
    const detailTextContent = await detailSelector.getProperty('textContent');
    const detail = await detailTextContent.jsonValue();
    // console.debug(detail);
    productInfo.details = detail
    if (price === ''){
        const priceSelector = await page.$('span.uniform-banner-box-price');
        const priceTextContent = await priceSelector.getProperty('textContent');
        const priceValue = await priceTextContent.jsonValue();
        // productInfo.price = ''
        // productInfo.price += price
        productInfo.price = filterNonNumber(priceValue);
    }
    else{
        productInfo.price = ''
        productInfo.price += price
    }
    
    //title
    let h1 = await page.$('h1.product-title-text');
    let title = await (await h1.getProperty('textContent')).jsonValue();
    productInfo.title = ''
    productInfo.title += title

    // image urls
    let img = await page.$eval('#root > div > div.product-main > div > div.img-view-wrap > div > div > div.image-view-magnifier-wrap > img', elem => elem.getAttribute('src'));
    productInfo.imageURLs.push(img)
    let imagesViewItem = await page.$$('div.images-view-item')
    for(imagesView of imagesViewItem){
      let image = await imagesView.$eval('img', elem => elem.getAttribute('src'))
      image = image.replace(/(\.jpg.*?)\..*?(\.webp)$/, '$1$2');
      image = image.replace(/_\d+x\d+(\.webp)$/, '$1');
      image = image.replace(/\.jpg.*$/, '.jpg_.webp'); 

      productInfo.imageURLs.push(image)
    }

    // stars
    let rawStars = await page.$('span.overview-rating-average');
    let stars = await (await rawStars.getProperty('textContent')).jsonValue();
    productInfo.stars = ''
    productInfo.stars += stars

    // reviews
    let rawReviews = await page.$('#root > div > div.product-main > div > div.product-info > div.product-reviewer > span.product-reviewer-reviews.black-link');
    let reviews = await (await rawReviews.getProperty('textContent')).jsonValue();
    productInfo.reviews = ''
    productInfo.reviews += reviews

    // total orders placed
    let orders = await page.$('span.product-reviewer-sold');
    let ordersplaced = await (await orders.getProperty('textContent')).jsonValue();
    productInfo.ordersPlaced = ''
    productInfo.ordersPlaced += ordersplaced

    // sizes
    let rawSizes = await page.$$("div.sku-property-text > span"); 
    for(sizes of rawSizes){
        let Sizes = await (await sizes.getProperty('textContent')).jsonValue();
        productInfo.sizes.push(Sizes);
    }
    await browser.close();
    return productInfo
}
exports.aliexpress = aliexpress
// aliexpress();
