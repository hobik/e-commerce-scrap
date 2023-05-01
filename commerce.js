const puppeteer = require('puppeteer');

// sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// global variables to store data
const productURL = 'https://pickybars.com/products/40-bar-mix-pack-energy-bars';
// const productURL = 'https://www.longines.com/watch-longines-ultra-chron-l2-836-4-52-6';
const productInfo = {
  price: null,
  title: null,
  imageURLs: [],
};

function filterNonNumber(value) {
  try {
    const regex = /[\d\.]+/;
    const match = value.match(regex);
    return match[0];
  } catch (err) {
    return value;
  }
}

// price
async function getPriceSpanBdi(page) {
  try {
    const price = await page.$eval(
      'span.product-card__price span.woocommerce-Price-amount bdi',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceMoney(page) {
  try {
    const price = await page.$eval('div.prices > span.price > span.money', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceAddCart(page) {
  try {
    const price = await page.$eval('input#product-add-to-cart', el => el.value.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceViewTax(page) {
  try {
    const price = await page.$eval(
      'div.productView-price > div.price-section > span.price--withoutTax',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceCurrentMoney(page) {
  try {
    const price = await page.$eval('span.current_price > span.money', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceClass(page) {
  try {
    const price = await page.$eval('.price', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceAmount(page) {
  try {
    const price = await page.$eval('span.woocommerce-Price-amount bdi', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceMoney(page) {
  try {
    const price = await page.$eval('span.product__price', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceSubscribe(page) {
  try {
    const price = await page.$eval('span.subscrb_price', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceProduct(page) {
  try {
    const price = await page.$eval('h2.product-price ', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceCustomCSS(page) {
  try {
    const price = await page.$eval('div.css-sl4h2x > div.e1wqsuxf3 ', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceDynamic(page) {
  try {
    const price = await page.$eval('div.jococups-dynamic-price ', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceProportional(page) {
  try {
    const price = await page.$eval('span.proportional-nums', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceIndividual(page) {
  try {
    const price = await page.$eval('div.individual-details', el => el.textContent.trim());
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceReg(page) {
  try {
    const price = await page.$eval(
      'div.header-container > div.shop-bar-price-area > span > span.reg > span.regPrice',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPricePdpSection(page) {
  try {
    const price = await page.$eval(
      'div.PdpMasterProductDetails__price-section > p',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceHeadlineWrapper(page) {
  try {
    const price = await page.$eval(
      'div.headline-5 > div.product-price__wrapper > div.product-price',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceProductInfo(page) {
  try {
    const price = await page.$eval(
      'div.product-info-price > div.product-price > span.product-price-inner > span',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceProductPrice(page) {
  try {
    const price = await page.$eval(
      'div.Product-price',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceHiddenSpan(page) {
  try {
    const price = await page.$eval(
      '.hidden span',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPriceTd2(page) {
  try {
    const price = await page.$eval(
      'td:nth-of-type(2)',
      el => el.textContent.trim()
    );
    return price;
  } catch (err) {
    return null;
  }
};

async function getPrice(page) {
  try {
    const promiseArr = await Promise.all([
      getPriceSpanBdi(page),
      getPriceMoney(page),
      getPriceAddCart(page),
      getPriceViewTax(page),
      getPriceCurrentMoney(page),
      getPriceClass(page),
      getPriceAmount(page),
      getPriceMoney(page),
      getPriceProduct(page),
      getPriceSubscribe(page),
      getPriceCustomCSS(page),
      getPriceDynamic(page),
      getPriceProportional(page),
      getPriceIndividual(page),
      getPriceReg(page),
      getPricePdpSection(page),
      getPriceHeadlineWrapper(page),
      getPriceProductInfo(page),
      getPriceProductPrice(page),
      getPriceHiddenSpan(page),
      getPriceTd2(page),
    ]);
    const price = promiseArr.filter(price => price);
    if (price.length < 1) return null;
    return filterNonNumber(price[0]);
  } catch (err) {
    console.error(err);
    return null;
  }
};

//title
async function getTitleProduct(page) {
  try {
    const title = await page.$eval('h1.product_title', el => el.textContent);
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitleProductDash(page) {
  try {
    const title = await page.$eval('h1.product-title', el => el.textContent);
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitleProductDouble(page) {
  try {
    const title = await page.$eval('h1.product__title', el => el.textContent);
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitleCollection(page) {
  try {
    const title = await page.$eval(
      'h1.lg-product__title > span.lg-product__title-collection',
      el => el.textContent.trim()
    );
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitleContentH3(page) {
  try {
    const title = await page.$$eval(
      'div.Product-textContent > h3',
      texts => texts.map(h3 => h3.textContent.trim()),
    );
    return title.join(' ');
  } catch (err) {
    return null;
  }
};

async function getTitleH1Desktop(page) {
  try {
    const title = await page.$eval('h1 > span.desktop-title', el => el.textContent.trim());
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitleH1(page) {
  try {
    const title = await page.$eval('h1', el => el.textContent.trim());
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitleH2(page) {
  try {
    const title = await page.$eval('h2', el => el.textContent);
    return title;
  } catch (err) {
    return null;
  }
};

async function getTitle(page) {
  try {
    const promiseArr = await Promise.all([
      getTitleProduct(page),
      getTitleProductDash(page),
      getTitleProductDouble(page),
      getTitleCollection(page),
      getTitleContentH3(page),
      getTitleH1Desktop(page),
      getTitleH1(page),
      getTitleH2(page),
    ]);
    const title = promiseArr.filter(title => title).map(title => title.trim());
    if (title.length < 1) return null;
    return title[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

async function getImageProduct(page) {
  try {
    const imageSources = await page.$$eval(
      'div.product img', 
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageProductThumbSrcset(page) {
  try {
    const imageSources = await page.$$eval(
      'a.product__thumb > img',
      images => images.map(img => img.getAttribute('srcset')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageAviaSlide(page) {
  try {
    const imageSources = await page.$$eval(
      'div.avia-slide-wrap > img', 
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageLazyLoaded(page) {
  try {
    const imageSources = await page.$$eval(
      'div.slick-slide > img.lazyloaded', 
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageGalleryThumb(page) {
  try {
    const imageSources = await page.$$eval(
      'img.lg-gallery__thumbs-img', 
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageGalleryThumbnail(page) {
  try {
    const imageSources = await page.$$eval(
      'div.product-gallery__thumbnail > img', 
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageHero(page) {
  try {
    const imageSources = await page.$$eval(
      `img.hero-image`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
}

async function getImageSlider(page) {
  try {
    const imageSources = await page.$$eval(
      `div.slide > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageRotator(page) {
  try {
    const imageSources = await page.$$eval(
      `div.rotator__list > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageCustomCSS(page) {
  try {
    const imageSources = await page.$$eval(
      `div.css-o5sn20 > div > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageRslides(page) {
  try {
    const imageSources = await page.$$eval(
      `ul.rslides > li > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageRslides(page) {
  try {
    const imageSources = await page.$$eval(
      `div.mcs-items-container > div.mcs-item > a > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageCarouselThumbnail(page) {
  try {
    const imageSources = await page.$$eval(
      `div.product-carousel-thumbnail > div > button > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImagePdpGrid(page) {
  try {
    const imageSources = await page.$$eval(
      `div.PdpZoomableImageGrid > div > div > div > button > div > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageGridPicture(page) {
  try {
    const imageSources = await page.$$eval(
      `button.grid-image > div > picture > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageSlickDots(page) {
  try {
    const imageSources = await page.$$eval(
      `ul.slick-dots > li > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageProductThumbnail(page) {
  try {
    const imageSources = await page.$$eval(
      `ul.product-images-thumbnails > li > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImagePlaceholderSource(page) {
  try {
    const imageSources = await page.$$eval(
      `div.ProductGallery-imagePlaceholder > picture > source`,
      images => images.map(img => img.getAttribute('data-srcset')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageProductImg(page) {
  try {
    const imageSources = await page.$$eval(
      `div.product-images img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageViewDefault(page) {
  try {
    const imageSources = await page.$$eval(
      `img.productView-image--default`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageSlickTrack(page) {
  try {
    const imageSources = await page.$$eval(
      `div.slick-track > div > img`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

async function getImageAttachmentThumbnail(page) {
  try {
    const imageSources = await page.$$eval(
      `img.attachment-post-thumbnail`,
      images => images.map(img => img.getAttribute('src')).filter(img => img)
    );
    return imageSources;
  } catch (err) {
    return [];
  }
};

// image urls
async function getImageUrls(page) {
  try {
    const promiseArr = await Promise.all([
      getImageProduct(page),
      getImageProductThumbSrcset(page),
      getImageAviaSlide(page),
      getImageLazyLoaded(page),
      getImageGalleryThumb(page),
      getImageGalleryThumbnail(page),
      getImageHero(page),
      getImageSlider(page),
      getImageRotator(page),
      getImageCustomCSS(page),
      getImageRslides(page),
      getImageCarouselThumbnail(page),
      getImagePdpGrid(page),
      getImageGridPicture(page),
      getImageSlickDots(page),
      getImageProductThumbnail(page),
      getImagePlaceholderSource(page),
      getImageProductImg(page),
      getImageViewDefault(page),
      getImageSlickTrack(page),
      getImageAttachmentThumbnail(page),
    ]);
    const imageSources = promiseArr.filter(images => images.length > 0);
    if (imageSources.length < 1) return [];
    return imageSources[0];
  } catch (err) {
    console.error(err);
    return [];
  }
};

async function scrape(url) {
  // initialization
  const browser = await puppeteer.launch({ headless: true }); // change false -> true to reduce time but it might cause some error. check once if it works then continue. 
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  await page.goto(url);

  productInfo.title = await getTitle(page);
  productInfo.price = await getPrice(page);
  productInfo.imageURLs = await getImageUrls(page);
  console.log(productInfo)
  await browser.close();
  return productInfo

}

exports.commerce = scrape
