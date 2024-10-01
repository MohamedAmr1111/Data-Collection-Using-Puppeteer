const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        userDataDir: "./tmp"
    });

    const page = await browser.newPage();

    const headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:118.0) Gecko/20100101 Firefox/118.0',
        'Accept-Language': 'en-US,en;q=0.9'
    };

    await page.setExtraHTTPHeaders(headers);

    const url = 'https://www.ebay.com/itm/395717902686?itmmeta=01J91E8N0R805VG9T89G3EVCZC&hash=item5c22a0015e:g:PvMAAOSw5qlm8WKn&itmprp=enc%3AAQAJAAAA4Mxmj%2BiGvOveHXEBClPb29iPNTm3vngbfXv%2Fqa1efcBe6rQ775%2B9p0TJtgANkdT5N%2BP7k3FYfJlIaMUnJmjb7BIDvdfPxKxeR3BQX0czMxukoG5aZdO0W3UwbhrKGwLp6ZErq7Q6mFO46Ye%2Bc7xOq1zVGnQqC8zQtewdAW8LVoiXZqwYvRQOqHTzrxh6%2BGibxhU81yYN4HpMvGuncRH96thBq5pbhTkPtxAl2zrjMtIoGN9tEMUVw%2F79S2l%2B4yBFwvX%2FFbc6tRuyalUzPSnsIG1FhPI2cBLgbo8%2Fs55hedEQ%7Ctkp%3ABk9SR7rQoq7IZA'; //
    await page.goto(url);  // carousel__viewport
    const container = await page.$$('.HqcP'); // '.carousel__list .HqcP .S5l7

    console.log(container)
    //const htmlContent = await page.content();


    const products = [];
    const links = [];
    let counter = 0;
    for (let productHandle of container) {
        counter++;
        console.log(counter);
        try {
            const title = await productHandle.$eval('.hpQb h3', el => el.textContent.trim());
            //console.log(title)
            
            let price = null;
            let link = null;
            try {
                price = await productHandle.$eval('.KK6J', el => el.textContent.trim());

            } catch (error) {
                console.log("Price not found");
            }

            products.push({
                title: title,
                price: price,
            });

        } catch (error) {
            console.error('Error extracting data for a product:', error);
        }
    }

    // Write product data to a JSON file after the loop
    fs.writeFile('products2.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data successfully written to product.json');
        }
    });

    await browser.close();
})()
