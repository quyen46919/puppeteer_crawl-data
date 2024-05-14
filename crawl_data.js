const puppeteer = require("puppeteer");
const fs = require('fs');


(async () => {
  let dataList = []
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for (let i = 1; i <= 8; i++) {
    await page.goto(`https://moho.com.vn/collections/uu-dai?page=${i}`);

    const links = await page.evaluate(() => {
      let items = document.querySelectorAll(".single-product");
      let links = [];
      items.forEach(item => {
        const productName = item.querySelector('.pro-name a')?.innerText
        const category = productName?.split(" ")?.[0]
        const thumbnail = item.querySelector('.product-img picture img')?.src
        const price = parseInt(item.querySelector('.pro-price.highlight span')?.innerText?.replace(/,|₫/g, ''), 10)
        const rating = Number(item.querySelector('.anhnoi-rating-summary').getAttribute('data-rating'))
        const reviewCount = Number(item.querySelector('.anhnoi-rating-summary').getAttribute('data-num-reviews'))
        const boughtCount = parseInt(item.querySelector('.box-pro-detail .cmpText')?.innerText?.replace(/Đã bán /, ''), 10)
        const discount = parseInt(item.querySelector('.product-sale span')?.innerText?.replace(/-|%/g, ''), 10)
        links.push({
          category: category || 'Chưa xác định',
          productName,
          thumbnail,
          price,
          rating,
          reviewCount,
          boughtCount,
          discount,
        });
      });
      return links;
    });

    Array.prototype.push.apply(dataList, links);
  }
  console.log('dataList', dataList, dataList.length);
  await browser.close().then(() => {
    fs.writeFile("data.txt", JSON.stringify(dataList), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    }); 
  });
})();

