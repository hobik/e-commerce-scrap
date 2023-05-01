// const puppeteer = require('puppeteer');
// const userAgent = require('user-agents');
// const scrapePorterYork = require('./porteryork');
// const aliExpress = require("./aliexpress_");
// const bodyBliss  = require('./bodybliss');
// const ebay = require('./ebay')
// const cupcake = require('./cupcake')
// const bonbon = require('./bonbonbon')
// const skullcandy = require('./skullcandy')
const wish = require('./wish')
const express = require('express');
const aliExpress = require("./aliexpress");
const ebay = require("./ebay")
const commerce = require("./commerce")

const bodyParser = require('body-parser')
require('dotenv').config();


const app = express()
app.use(express.json()); //Using for the request body parsing

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",(req,res)=>{
    res.json({message:"Root Page"});
})

app.post("/getProductInfo",async (req,res)=>{
    var linkUrl =  req.body.linkUrl
    if(!linkUrl) res.status(500).json({message:"link_url_not_found"})
    var domain = linkUrl.split('//')[1].split('.')[0];
    if (domain === 'www') {
    domain = linkUrl.split('//')[1].split('.')[1];
    }

    console.log(domain);
        switch (domain) {
        case 'aliexpress':
          // Run code for aliexpress
          returnValue = await aliExpress.aliexpress(linkUrl)
          break;
        case 'ebay':
            returnValue = await ebay.ebay(linkUrl)
            break;
        case 'wish':
            returnValue = await wish.wish(linkUrl)
            break

        default:
            returnValue = await commerce.commerce(linkUrl)
            break



        }
        if(!returnValue) return res.status(400).json({message:`${domain}_scrapping_fail`})
        return res.status(200).json(returnValue)

   

})



const server = app.listen(process.env.PORT || 3000 ,(err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("Port Started. Port number %d: ", server.address().port);
    }
})