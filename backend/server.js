const express = require('express');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const app = express();
const PORT = 3000;

app.get('/download-svg', async (req, res) => {
    try {
        const dom = await JSDOM.fromFile("index.html", {
            runScripts: "dangerously",
            resources: "usable"
        });

        const config = {
            width: 400,
            projection: "stereographic",
            geopos: [51, 0],
            orientationfixed: true,
            follow: "center",
            interactive: false,
            center: [0, 0, 0],
            advanced: false,
            form: false,
            formFields: {},
            location: true,
            datapath: "public/data/",
            planets: { show: true },
            stars: {
                show: true,
                limit: 3.5,
                colors: false,
                style: { fill: "#000000", opacity: 1 },
                designation: false,
                propername: false,
            },
            constellations: { names: false, lines: true },
            dsos: { show: false },
            mw: { show: true }
        };

        const { window } = dom;

        window.onModulesLoaded = function () {
            console.log("Modules Loaded");

            if (window.Celestial) {
                window.Celestial.display(config);
                console.log('received config');
                window.Celestial.exportSVG((svg) => {
                    console.log('sending svg');
                    res.setHeader('Content-Type', 'image/svg+xml');
                    res.setHeader('Content-Disposition', 'attachment; filename="celestial.svg"');
                    res.send(svg);
                });
            } else {
                console.error("Celestial.js is not available in JSDOM");
                res.status(500).send("Error: Celestial.js not loaded");
            }
        };

    } catch (error) {
        console.error(error);
        res.status(500).send("Error generating SVG");
    }
});

// Start Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
