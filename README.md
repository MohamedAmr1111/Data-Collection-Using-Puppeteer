eBay Data Scraper
Overview

This project utilizes Puppeteer to scrape data from eBay listings. The goal is to gather comprehensive information about products, including related data from individual product image links, and save the collected data in a structured format.
Tools Used

    Puppeteer: A Node.js library for controlling headless Chrome or Chromium for web scraping.
    Node.js: JavaScript runtime for executing the scraping script.
    npm: Package manager for managing project dependencies.
    JSON or CSV: Format for storing the collected data.

Features

    Navigate to eBay: Access eBay and perform search queries to retrieve product listings.
    Data Extraction: Collect relevant data such as:
        Product title
        Price
        
    Image Link Navigation: Go to each image link to gather additional related data (e.g., product specifications, descriptions).
    Data Storage: Save the scraped data in a structured format (JSON or CSV) for further analysis.
