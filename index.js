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

    const url = 'https://www.ebay.com/b/Egypt-Stamps/127419/bn_2309475?LH_Auction=1&mag=1&rt=nc'; //
    await page.goto(url);
    const container = await page.$$('.brwrvr__item-card');

    console.log(container)
    const htmlContent = await page.content();


    const products = [];
    const links = [];
    const relatedproducts = [];
    let counter = 0;
    let counter2 = 0;
    for (let productHandle of container) {
        counter++;
        console.log(counter);
        try {
            const title = await productHandle.$eval('.bsig__title__wrapper h3', el => el.textContent.trim());

            let price = null;
            let link = null;
            try {
                price = await productHandle.$eval('.textual-display.bsig__price.bsig__price--displayprice', el => el.textContent.trim());

            } catch (error) {
                console.log("Price not found");
            }

            try {
                link = await productHandle.$eval('.brwrvr__item-card__image-wrapper a', el => el.getAttribute('href'))
                links.push(link)

            } catch (error) {
                console.log("link not found");
            }

            products.push({
                title: title,
                price: price,
                link: link
            });

        } catch (error) {
            console.error('Error extracting data for a product:', error);
        }
    }

    
    for (let i in links) {
        await page.goto(links[i])
        const relateditem = await page.$$('.carousel__list .HqcP .S5l7');
        for(let j of relateditem)
        try {
            counter2++;
            const title2 = await j.$eval('.hpQb h3', el => el.textContent.trim());
            //console.log(title)

            let price2 = null;
            //let link = null;
            try {
                price2 = await j.$eval('.KK6J', el => el.textContent.trim());

            } catch (error) {
                console.log("Price not found");
            }

            relatedproducts.push({
                title: title2,
                price: price2,
            });
        }
        catch (error) {
            console.error('Error extracting data for a product:', error);
        }

    }

    // Write product data to a JSON file after the loop
    fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data successfully written to products.json');
        }
    });

    fs.writeFile('related.json', JSON.stringify(relatedproducts, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Data successfully written to products.json');
        }
    });
    console.log(counter2);
    await browser.close();
})()
