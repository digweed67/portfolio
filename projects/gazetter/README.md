# World Map Explorer

A full-screen interactive web map that lets users discover countries and cities with data overlays and modals.

## Features

- **Auto-geolocation**: Centers map on user’s location (via browser geolocation).
- **Country detection**: Reverse-geocodes coords to country code and highlights its border.
- **Manual country selection**: Dropdown list of all countries sorted alphabetically.
- **Basemap switcher**: Toggle between **Streets** and **Satellite** tile layers.
- **Data overlays**:
  - **City clustering**: Displays major cities with custom ExtraMarkers icons and clustering.  
  - **Airport clustering**: Displays airports with custom ExtraMarkers icons and clustering.
- **Info modals**:
  - **Demographics**: capital, population, area, languages, region, subregion.
  - **Wikipedia summary**: brief overview with link to full article.
  - **Weather**: 3 day weather forecast.
  - **Country images**: carousel of photos fetched via Pexels API.
  - **Holidays**: list of upcoming holidays in the selected country.
- **Zoom controls**: Custom zoom-in button and double-click both zoom in by 2 levels.

## Tech Stack

- **Frontend**:
  - JavaScript (ES6) in a single `js/script.js` file
  - jQuery for AJAX
  - Leaflet for interactive map
  - Plugins: MarkerCluster, ExtraMarkers, EasyButton
  - Bootstrap 5 for UI components and modals
- **Backend**:
  - PHP endpoints for country, city, demographics, weather, images, holidays
  - APIs: OpenCage Geocoding, GeoNames, REST Countries, OpenWeatherMap, Wikipedia, Pexels

## Folder Structure

```
.
├── README.md
├── data
│   └── countryBorders.geo.json
├── img
│   └── favicon.png
├── index.html
├── js
│   └── script.js
├── lib
│   ├── bootstrap
│   │   ├── bootstrap.bundle.min.js
│   │   └── bootstrap.min.css
│   ├── easybutton
│   │   ├── easy-button.css
│   │   └── easy-button.js
│   ├── extramarkers
│   │   ├── css
│   │   │   └── leaflet.extra-markers.min.css
│   │   ├── img
│   │   │   ├── markers_default.png
│   │   │   ├── markers_default@2x.png
│   │   │   ├── markers_shadow.png
│   │   │   └── markers_shadow@2x.png
│   │   └── js
│   │       └── leaflet.extra-markers.min.js
│   ├── jquery
│   │   └── jquery.min.js
│   ├── leaflet
│   │   ├── images
│   │   │   ├── layers-2x.png
│   │   │   ├── layers.png
│   │   │   ├── marker-icon-2x.png
│   │   │   ├── marker-icon.png
│   │   │   └── marker-shadow.png
│   │   ├── leaflet.css
│   │   └── leaflet.js
│   └── markercluster
│       ├── MarkerCluster.Default.css
│       ├── MarkerCluster.css
│       └── leaflet.markercluster.js
├── php
│   ├── config.php
│   ├── getAirports.php
│   ├── getCities.php
│   ├── getCountryBorder.php
│   ├── getCountryFromCoords.php
│   ├── getCountryHolidays.php
│   ├── getCountryImages.php
│   ├── getCountryList.php
│   ├── getCountryWeather.php
│   ├── getCountryWikipedia.php
│   └── getDemographics.php
└── style.css

```

## Setup & Run Locally

1. **Clone the repo** and navigate into the folder.
2. **Install a local PHP server** (e.g. XAMPP, MAMP, or PHP’s built-in server).
3. **Configure API keys**:
   - Copy `php/config.php.example` to `php/config.php`.
   - Add your keys:
     ```php
     <?php
     define('OPENCAGE_API_KEY', 'YOUR_OPENCAGE_KEY');
     define('OPENWEATHER_API_KEY', 'YOUR_OPENWEATHER_KEY');
     define('PEXELS_API_KEY', 'YOUR_PEXELS_KEY');
     ```
4. **Serve** with `php -S localhost:8000` (or via XAMPP/MAMP).
5. **Open** `http://localhost:8000` in your browser.

## Notes

- The map covers the full viewport; modals scroll internally if content is long.
- Zoom-in button and double-click both zoom in by two levels for a snappier experience.


## Author

Amaia Artola - 
Built as part of a portfolio/full-stack learning project.
