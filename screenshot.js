const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const os = require('os');
const path = require('path');

// Use stealth plugin to bypass bot detection
puppeteer.use(StealthPlugin());

const TARGET_URL = process.env.IDEABROWSER_TARGET_URL || 'https://www.ideabrowser.com/';
const LOGIN_URL = process.env.IDEABROWSER_LOGIN_URL || 'https://www.ideabrowser.com/login';
const LOGIN_EMAIL_SELECTOR = process.env.IDEABROWSER_EMAIL_SELECTOR;
const LOGIN_PASSWORD_SELECTOR = process.env.IDEABROWSER_PASSWORD_SELECTOR;
const LOGIN_SUBMIT_SELECTOR = process.env.IDEABROWSER_SUBMIT_SELECTOR;
const LOGIN_TRIGGER_SELECTOR = process.env.IDEABROWSER_LOGIN_TRIGGER_SELECTOR;
const POST_LOGIN_SELECTOR = process.env.IDEABROWSER_POST_LOGIN_SELECTOR;
const IDEA_SELECTOR = process.env.IDEABROWSER_IDEA_SELECTOR;
const USER_DATA_DIR = process.env.IDEABROWSER_USER_DATA_DIR || path.join(os.tmpdir(), 'ideabrowser-profile');

const DEFAULT_EMAIL_SELECTORS = [
  'input[type="email"]',
  'input[name="email"]',
  'input[name="username"]',
  'input[id*="email"]'
];
const DEFAULT_PASSWORD_SELECTORS = [
  'input[type="password"]',
  'input[name="password"]',
  'input[id*="password"]'
];
const DEFAULT_SUBMIT_SELECTORS = [
  'button[type="submit"]',
  'button[name="submit"]',
  'button:has-text("Sign in")',
  'button:has-text("Log in")'
];

async function resolveSelector(page, explicitSelector, fallbackSelectors, label) {
  const selectors = explicitSelector ? [explicitSelector] : fallbackSelectors;
  for (const selector of selectors) {
    try {
      await page.waitForSelector(selector, { timeout: 3000 });
      return selector;
    } catch (error) {
      // Try the next selector.
    }
  }
  throw new Error(
    `Could not find ${label} selector. Set IDEABROWSER_${label.toUpperCase()}_SELECTOR.`
  );
}

async function clickElement(page, selector, label) {
  await page.waitForSelector(selector, { timeout: 15000, visible: true });
  const handle = await page.$(selector);
  if (!handle) {
    throw new Error(`Could not resolve ${label} element for selector: ${selector}`);
  }

  await handle.evaluate(node => node.scrollIntoView({ block: 'center' }));

  try {
    await handle.click({ delay: 20 });
  } catch (error) {
    await page.evaluate(sel => {
      const target = document.querySelector(sel);
      if (target) {
        target.click();
      }
    }, selector);
  }
}

async function loginIfNeeded(page) {
  const email = process.env.IDEABROWSER_EMAIL;
  const password = process.env.IDEABROWSER_PASSWORD;

  if (!email || !password) {
    console.log('Login skipped: IDEABROWSER_EMAIL or IDEABROWSER_PASSWORD not set.');
    return;
  }

  console.log('Navigating to login page...');
  await page.goto(LOGIN_URL, {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  if (LOGIN_TRIGGER_SELECTOR) {
    console.log('Triggering login form...');
    await clickElement(page, LOGIN_TRIGGER_SELECTOR, 'login trigger');
  }

  const emailSelector = await resolveSelector(
    page,
    LOGIN_EMAIL_SELECTOR,
    DEFAULT_EMAIL_SELECTORS,
    'email'
  );
  const passwordSelector = await resolveSelector(
    page,
    LOGIN_PASSWORD_SELECTOR,
    DEFAULT_PASSWORD_SELECTORS,
    'password'
  );

  console.log('Filling login form...');
  await page.type(emailSelector, email, { delay: 20 });
  await page.type(passwordSelector, password, { delay: 20 });

  console.log('Submitting login form...');
  const submitSelector = LOGIN_SUBMIT_SELECTOR
    ? LOGIN_SUBMIT_SELECTOR
    : await resolveSelector(
        page,
        LOGIN_SUBMIT_SELECTOR,
        DEFAULT_SUBMIT_SELECTORS,
        'submit'
      );

  try {
    await Promise.all([
      clickElement(page, submitSelector, 'submit'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })
    ]);
  } catch (error) {
    await Promise.all([
      page.keyboard.press('Enter'),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })
    ]);
  }

  if (POST_LOGIN_SELECTOR) {
    console.log('Waiting for post-login element...');
    await page.waitForSelector(POST_LOGIN_SELECTOR, { timeout: 20000 });
  }
}

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
      // Use a stable profile directory to avoid Windows temp cleanup locks.
      userDataDir: USER_DATA_DIR,
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

    await loginIfNeeded(page);

    // Navigate to target page
    console.log(`Navigating to ${TARGET_URL}...`);
    await page.goto(TARGET_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    if (IDEA_SELECTOR) {
      console.log('Waiting for idea section...');
      await page.waitForSelector(IDEA_SELECTOR, { timeout: 20000 });
    }

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