// index.js
import express from "express";
import puppeteer from "puppeteer";

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
const response = await fetch('https://www.hashrate.no/gpus/3080ti',{
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


app.get('/algo-set',async(req,res)=>{
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the page that includes 3.js
  await page.goto('https://herominers.com/', { waitUntil: "networkidle0" });

  // Wait for the hashrate input for RandomX to appear
  await page.waitForSelector("#hashrate_randomx", { timeout: 10000 });

  // Change the value to 16
  await page.evaluate(() => {
    const el = document.querySelector("#hashrate_randomx");
    if (el) {
      el.value = 16;
      // Trigger the 'change' event so 3.js stores it in localStorage
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });

  // Optional: verify it was stored in localStorage
  const stored = await page.evaluate(() => localStorage.getItem("hashrate_randomx_input"));
  res.send("Stored RandomX hashrate: "+ stored)
  // console.log("Stored RandomX hashrate:", stored);

  await browser.close();
})

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