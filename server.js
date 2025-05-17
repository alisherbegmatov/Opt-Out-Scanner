// Import necessary modules
const express = require('express');      // Web framework for handling HTTP routes
const puppeteer = require('puppeteer');  // Headless browser for web scraping
const cors = require('cors');            // Middleware to enable Cross-Origin Resource Sharing

// Create an instance of an Express app
const app = express();

// Enable CORS so frontend apps on different origins (e.g., localhost:5500) can communicate
app.use(cors());

// Enable parsing of JSON request bodies
app.use(express.json());

// Define a POST route for scanning a website
app.post('/scan', async (req, res) => {
  const { url } = req.body;  // Extract URL from the request body

  // Validate the URL: must start with http:// or https://
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  let browser;  // Variable to hold the browser instance

  try {
    // Launch Puppeteer in headless mode (no browser window)
    browser = await puppeteer.launch({ headless: 'new' });

    // Open a new browser tab
    const page = await browser.newPage();

    // Navigate to the specified URL and wait for the page to fully load
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

    // Extract all anchor tags from the page and map them to objects with href and text
    const links = await page.$$eval('a', as =>
      as.map(a => ({
        href: a.href,
        text: a.innerText.trim()
      }))
    );

    // Filter links that mention privacy, opt-out, cookie, or sell-related keywords
    const relevantLinks = links.filter(link =>
      /privacy|data|opt.?out|cookie|sell/i.test(link.text)
    );

    // Prepare the result object
    const result = {
      // Find the first link that looks like a privacy policy
      privacyPolicy: relevantLinks.find(l => /privacy/i.test(l.text))?.href || null,

      // Find the first link related to opting out or "Do Not Sell"
      optOut: relevantLinks.find(l => /opt.?out|do not sell/i.test(l.text))?.href || null,

      // Include all other relevant links
      otherRelevantLinks: relevantLinks
    };

    // Send the result back as JSON
    res.json(result);
  } catch (err) {
    // If any error occurs during scanning, log it and return an error response
    console.error('Error during scan:', err.message);
    res.status(500).json({ error: 'Failed to scan website. ' + err.message });
  } finally {
    // Always close the browser, even if an error occurs
    if (browser) await browser.close();
  }
});

// Start the server on port 3000 and log a message
app.listen(3000, () => {
  console.log('Privacy Scanner backend running at http://localhost:3000');
});
