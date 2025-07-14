const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

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

    // Launch browser with required settings
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

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