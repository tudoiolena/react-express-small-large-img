import './App.css';
import {useEffect} from 'react';

function App() {
  const date = "2021-02-25T04:00:00+0000";
  const [LAT, LON] = [36.525321, -121.815916];
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

   useEffect(() => {
    Celestial.display(config);
    Celestial.skyview({ date: date });
  }, [date]);


  const handleDownload = () => {
    Celestial.exportSVG((svgString) => {
      // Create a Blob from the SVG string
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      // Generate a URL for the Blob
      const url = URL.createObjectURL(blob);
      // Create an anchor and trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = "celestial.svg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div>
    <button onClick={handleDownload}>Download SVG</button>
      <div id="map-container">
        <div id="map"></div>
      </div>
    </div>
  )
}

export default App;