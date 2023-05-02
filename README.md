<h1>Project Description</h1>
This project allows for web scraping of various e-commerce websites, including AliExpress, eBay, Wish, and other generic e-commerce and web-commerce websites.

You can retrieve product information by sending a POST request to the /getProductInfo endpoint with the linkUrl parameter containing the URL of the product you want to retrieve information for.

Please see the example request payload below:


POST /getProductInfo

{
  "linkUrl": "https://www.wish.com/product/5a619c03f718e05ea3e1094f"
}
By using this endpoint, you can obtain detailed product information from supported e-commerce websites.
