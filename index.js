// index.js
import express from "express";
import puppeteer from "puppeteer";
import chromium from "chrome-aws-lambda";

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware (optional)
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is a JSON response' });
});

app.get('/api/external', async (req, res) => {
try {
  // const response = await fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=26497', {
  //   method: 'GET',
  //   headers: {
  //     'X-CMC_PRO_API_KEY': 'efec1dcd54c742c7990a74f063487ad6',
  //     'Accept': 'application/json'
  //   }
  // });
const response = await fetch('https://www.hashrate.no/GPUcalculator?selected=3080ti-1',{
  method: 'GET',
  headers: {
    'Cookie': 'powerCost=0.00'
  }
});
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const html = await response.text(); // get the full HTML as a string
  // res.cookie('powerCost', '0.00');
  res.send(html); // send it directly as response
  // const data = await response.json();
  // res.json(data); // send the JSON response back to the browser
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Failed to fetch data' });
}
});

app.get('/algo-set', async (req, res) => {
  try {
    const executablePath = await chromium.executablePath;
    const url = "https://herominers.com";
    const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
    const page = await browser.newPage();

    await page.goto(url, {
  waitUntil: 'domcontentloaded', // or 'load'
  timeout: 60000                 // 60 seconds
});
    await page.waitForSelector("#hashrate_randomx", { timeout: 10000 });

    await page.evaluate(() => {
      const el = document.querySelector("#hashrate_randomx");
      if (el) {
        el.value = 16;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    const stored = await page.evaluate(() => localStorage.getItem("hashrate_randomx_input"));
    
    
await page.waitForSelector('#pool_info_monero [data-original-title="Earnings (USD)"]');

// Extract its text content
const usdEarnings = await page.$eval(
  '#pool_info_monero [data-original-title="Earnings (USD)"]',
  el => el.textContent.trim()
);

console.log('USD earnings:', usdEarnings);


    await browser.close();
    res.send(`Stored RandomX hashrate: ${stored}`);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});

const safeCoins = [
  "aeternity",
  "beam",
  "conflux",
  "clore",
  "cortex",
  "dero",
  "epic cash",
  "firo",
  "grin",
  "karlsen",
  "meowcoin",
  "ravencoin",
  "xelis",
  "zano",
  "evermore"
]



const algorithms = [
  "Autolykos2",
  "BeamHashV3",
  "CuckooCortex",
  "DynexSolve",
  "Etchash",
  "FishHash",
  "HeavyHash",
  "KarlsenHash",
  "Kawpow",
  "Octopus",
  "ProgPowZ",
  "XelisHashv2"
];




app.get('/parse-algos', async (req, res) => {
  try {
    const executablePath = await chromium.executablePath;
    const url1 = "https://www.hashrate.no/GPUcalculator?selected=3080ti-1";
    const browser1 = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
const context = browser1.defaultBrowserContext();
await context.setCookie({
  name: 'powerCost',
  value: '0.00',
  domain: 'www.hashrate.no',
  path: '/',
});
    const page1 = await context.newPage();
    await page1.goto(url1, {
  waitUntil: 'networkidle2', // or 'load'
  timeout: 60000                 // 60 seconds
});

let passAlgos = await page1.evaluate((algorithms) => {
    const items = [];
    document.querySelectorAll("#summary .w3-col").forEach(div => {
      const nameEl = div.querySelector(".optionHeader");
      const hashEl = div.querySelector(".optionSelectContainer .w3-rest div div:first-child");
      if (!nameEl || !hashEl) return;

      const name = nameEl.textContent.trim();
      const hashrate = hashEl.textContent.trim();
      if (algorithms.includes(name)) {
        items.push({ name, hashrate });
        if(name == 'ProgPowZ') items.push({ name: 'ProgPow', hashrate });
      }
    });
    return items;
  }, algorithms);

  

 // 🔁 Change KarlsenHash hashrate to match FishHash
  const fishHash = passAlgos.find(r => r.name === "FishHash");
  const karlsenHash = passAlgos.find(r => r.name === "KarlsenHash");
  const cortexName = passAlgos.find(r => r.name === "CuckooCortex");
  const autolikosName = passAlgos.find(r => r.name === "Autolykos2");
  const beamHashName = passAlgos.find(r => r.name === "BeamHashV3");
  const etchashName = passAlgos.find(r => r.name === "Etchash");
  const heavyHashName = passAlgos.find(r => r.name === "HeavyHash"); 
  const karlsenHashName = passAlgos.find(r => r.name === "KarlsenHash"); 
  const octopusName = passAlgos.find(r => r.name === "Octopus"); 
  const kawpowName = passAlgos.find(r => r.name === "Kawpow"); 
  if(cortexName){
    cortexName.name = "cuckaroo30"
  }
  
  if(autolikosName){
    autolikosName.name = "autolykosv2"
  }
  
  if(beamHashName){
    beamHashName.name = "BeamIII"
  }
  
  if(etchashName){
    etchashName.name = "et(c)hash"
  }
  
  if(heavyHashName){
    heavyHashName.name = "kheavyhash"
  }
  
  if(karlsenHashName){
    karlsenHashName.name = "karlsenhashv2"
  }
  
  if(heavyHashName){
    heavyHashName.name = "kheavyhash"
  }
  
  if(octopusName){
    octopusName.name = octopusName.name.toLowerCase()
  }
  
  if(kawpowName){
    kawpowName.name = kawpowName.name.toLowerCase()
  }
  if (fishHash && karlsenHash) {
    karlsenHash.hashrate = fishHash.hashrate;
  }

  passAlgos = passAlgos.map(obj => ({
  ...obj,
  hashrate: obj.hashrate.match(/[\d.]+/)[0]  // extract only numbers + decimal
}));
  console.log(passAlgos);


  





 let coins = await page1.evaluate((safeCoins) => {
    const items = [...document.querySelectorAll("#myUL li")];
    const arr = [];

    for (const li of items) {
        if (arr.length >= 3) break; // take only first 3 matches

        const nameDiv = li.querySelector(".name");
        if (!nameDiv) continue;

        // Extract coin SYMBOL (inside <span> FIRO </span>)
        const span = nameDiv.querySelector("span");
        if (!span) continue;

        const symbol = span.textContent.trim();

        // Only keep coins found in safeCoins
        if (!safeCoins.includes(symbol)) continue;

        // Extract Profit (last ".estimates" under estimatesCurrent)
        const profitEl = li.querySelector(
            '.estimatesCurrent .estimatesDescription span[style], ' + 
            '.estimatesCurrent .estimatesDescription span'
        );

        const profitValueEl = profitEl
            ? profitEl.parentElement.nextElementSibling
            : null;

        if (!profitValueEl) continue;

        let profit = parseFloat(profitValueEl.textContent.replace("$", "").trim());
        if (isNaN(profit)) profit = 0;

        // Push object
        arr.push({
            coin: symbol,
            profit: profit
        });
    }

    return arr;
}, safeCoins);


  console.log(coins);
    await browser1.close();
  // res.send(coins);

 const url = "https://herominers.com";
    const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath,
  headless: chromium.headless,
});
    const page = await browser.newPage();

    await page.goto(url, {
  waitUntil: 'domcontentloaded', // or 'load'
  timeout: 60000                 // 60 seconds
});
    await page.waitForSelector("#hashrate_randomx", { timeout: 10000 });

    await page.evaluate(() => {
      const el = document.querySelector("#hashrate_randomx");
      if (el) {
        el.value = 16;
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    const stored = await page.evaluate(() => localStorage.getItem("hashrate_randomx_input"));
    
    
await page.waitForSelector('#pool_info_monero [data-original-title="Earnings (USD)"]');

// Extract its text content
const usdEarnings = await page.$eval(
  '#pool_info_monero [data-original-title="Earnings (USD)"]',
  el => el.textContent.trim()
);

console.log('USD earnings:', usdEarnings);


    await browser.close();
    res.send(`Stored RandomX hashrate: ${stored}`);



  } catch (err) {
    console.error(err);
    res.status(500).send(err.toString());
  }
});












// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


// app.get('/fetch-page', async (req, res) => {
//   try {
//     const targetUrl = 'https://www.hashrate.no/GPUcalculator?selected=3080ti-1';
//     await jar.setCookie('powerCost=0.00; Path=/', targetUrl);
//     const cookieHeader = await jar.getCookieString(targetUrl);

//     const response = await fetch(targetUrl, {
//       headers: { 'Cookie': cookieHeader },
//     });

//     const setCookieHeaders = response.headers.raw()['set-cookie'];
//     if (setCookieHeaders) {
//       for (const c of setCookieHeaders) {
//         await jar.setCookie(c, targetUrl);
//       }
//     }

//     const html = await response.text();
//     res.send(html);

//   } catch (err) {
//     console.error('Fetch error:', err);
//     res.status(500).send(`Error fetching page: ${err.message}`);
//   }
// });
