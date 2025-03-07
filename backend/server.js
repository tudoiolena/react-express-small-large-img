const express = require('express');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const app = express();
const PORT = 3000;

const [LAT, LON] = [36.525321, -121.815916];
const date = "2021-02-25T04:00:00+0000";
const FONT = "Raleway";

app.get('/download-svg', async (req, res) => {
    try {
        const dom = await JSDOM.fromFile("index.html", {
            runScripts: "dangerously",
            resources: "usable"
        });

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
            // projection: "mercator", //for rectangle
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

        const { window } = dom;

        window.onModulesLoaded = function () {
            console.log("Modules Loaded");

            if (window.Celestial) {
                window.Celestial.display(config);
                window.Celestial.skyview({ date: date });
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
