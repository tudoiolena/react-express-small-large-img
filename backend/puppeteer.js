const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (e.g. index.html, public assets)
app.use(express.static(path.join(__dirname)));

const [LAT, LON] = [36.525321, -121.815916];
const date = "2021-02-25T04:00:00+0000";
const FONT = "Raleway";

const config = {
  container: "map",
  width: 700,

  form: false,
  advanced: false,
  interactive: false,
  disableAnimations: true,

  zoomlevel: null,
  zoomextend: 1,

  projection: "airy",
  // projection: "mercator", // for rectangle
  transform: "equatorial",

  follow: "zenith",
  geopos: [LAT, LON],

  lines: {
    graticule: { show: false },
    equatorial: { show: false },
    ecliptic: { show: false },
    galactic: { show: false },
    supergalactic: { show: false }
  },
  datapath: "https://ofrohn.github.io/data/",
  planets: {
    show: true,
    which: ["mer", "ven", "ter", "lun", "mar", "jup", "sat"],
    symbolType: "disk",
    names: true,
    nameStyle: {
      fill: "#00ccff",
      font: `14px ${FONT}`,
      align: "center",
      baseline: "top"
    },
    namesType: "en"
  },

  dsos: {
    show: false,
    names: false
  },

  constellations: {
    names: true,
    namesType: "iau",
    nameStyle: {
      fill: "#ffffff",
      align: "center",
      baseline: "middle",
      font: [`14px ${FONT}`, `8px ${FONT}`, `0px ${FONT}`]
    },
    lines: true,
    lineStyle: { stroke: "#cccccc", width: 1, opacity: 0.4 }
  },

  mw: {
    show: true,
    style: { fill: "#ffffff", opacity: 0.02 }
  },

  background: {
    fill: "#0b1a26",
    stroke: "#ffffff",
    opacity: 1,
    width: 2
  },

  stars: {
    colors: true,
    size: 4,
    limit: 6,
    exponent: -0.28,
    designation: false,
    propername: true,
    propernameType: "name",
    propernameStyle: {
      fill: "#ddddbb",
      font: `8px ${FONT}`,
      align: "right",
      baseline: "center"
    },
    propernameLimit: 2.0
  }
};

app.get('/download-svg', async (req, res) => {
  try {
    // Launch Puppeteer; add args for environments like Docker or servers if needed.
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Navigate to the local index.html page that loads Celestial and its dependencies.
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2' });

    // Use page.evaluate to set the configuration and skyview date
    await page.evaluate((config, date) => {
      // Render the celestial map
      window.Celestial.display(config);
      window.Celestial.skyview({ date: date });
    }, config, date);

    // Wait for a short period to allow rendering to complete.
    // await page.waitForTimeout(1000);

    // Export the SVG using Celestial.exportSVG, wrapped in a Promise.
    const svg = await page.evaluate(() => {
      return new Promise(resolve => {
        window.Celestial.exportSVG(resolve);
      });
    });

    await browser.close();

    // Send the SVG as a downloadable file.
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Content-Disposition', 'attachment; filename="celestial.svg"');
    res.send(svg);
  } catch (error) {
    console.error('Error generating SVG:', error);
    res.status(500).send('Error generating SVG');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
