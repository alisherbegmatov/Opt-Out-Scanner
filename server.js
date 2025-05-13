const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/scan', async (req, res) => {
  const { url } = req.body;
  if (!url || !/^https?:\/\/.+/.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

    const links = await page.$$eval('a', as =>
      as.map(a => ({ href: a.href, text: a.innerText.trim() }))
    );

    const relevantLinks = links.filter(link =>
      /privacy|data|opt.?out|cookie|sell/i.test(link.text)
    );

    const result = {
      privacyPolicy: relevantLinks.find(l => /privacy/i.test(l.text))?.href || null,
      optOut: relevantLinks.find(l => /opt.?out|do not sell/i.test(l.text))?.href || null,
      otherRelevantLinks: relevantLinks
    };

    res.json(result);
  } catch (err) {
    console.error('Error during scan:', err.message);
    res.status(500).json({ error: 'Failed to scan website. ' + err.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(3000, () => {
  console.log('Privacy Scanner backend running at http://localhost:3000');
});
