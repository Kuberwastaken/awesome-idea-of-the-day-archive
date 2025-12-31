const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Use stealth plugin to bypass bot detection
puppeteer.use(StealthPlugin());

(async () => {
  let browser;
  try {
    // Create date-based folder structure (year/month only)
    const now = new Date();
    const year = now.getFullYear();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[now.getMonth()];
    const day = now.getDate();
    
    const archiveDir = path.join('archives', String(year), monthName);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    
    // Generate filename in format "14 July 2025.png"
    const filename = `${day} ${monthName} ${year}.png`;
    const filePath = path.join(archiveDir, filename);

    console.log(`Capturing Idea of the Day to: ${filePath}`);

    // Launch browser with required settings and stealth mode
    browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    const page = await browser.newPage();

    // Set realistic user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    );

    // Set extra HTTP headers to appear more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document'
    });

    // Configure viewport settings
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });

    // Navigate to ideabrowser.com
    console.log('Navigating to ideabrowser.com...');
    await page.goto('https://www.ideabrowser.com/', { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a moment for everything to load
    console.log('Waiting for page to fully load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Take a simple full page screenshot
    console.log('Taking screenshot...');
    await page.screenshot({ 
      path: filePath,
      fullPage: true,
      type: 'png'
    });

    console.log(`✅ Screenshot saved successfully to: ${filePath}`);

  } catch (error) {
    console.error('❌ An error occurred:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});