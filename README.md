# Amaia Artola – Portfolio Website

A single-page portfolio to showcase projects, skills, and experience. Built with Bootstrap 5 and a lightweight set of vendor libraries, plus two embedded demo projects hosted under `/projects`.

> Live URL: www.amaiaartola.com

---

## Features

- **Single-page layout** with sections: Hero, About, Skills, CV, Portfolio, Contact
- **Project modals** with “Launch App” and GitHub links
- **Internal project hosting** at `/projects/gazetteer/` and `/projects/company-directory/public/`
- **Download CV** button (uses `assets/cv/Amaia-Artola-CV.pdf`)
- **AOS** scroll animations & **Typed.js** hero subtitle
- **Responsive** Bootstrap layout, **Bootstrap Icons**, smooth scroll, preloader & scroll-top button
- **Contact form** (PHP + PHPMailer) with loading/success/error states

---

## Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript
- Bootstrap 5, Bootstrap Icons
- AOS (Animate on Scroll)
- Typed.js
- jQuery (small modal focus fix)

**Backend (contact + project)** 
- PHP 8+
- PHPMailer (SMTP)
- _Company Directory project_: PHP (MySQLi), AJAX

---

## 📁 Folder Structure

```
.
├── README.md
├── assets
│   ├── css
│   │   └── main.css
│   ├── cv
│   │   └── Amaia-Artola-CV.pdf
│   ├── img
│   │   ├── favicon.png
│   │   ├── hero-bg.jpg
│   │   ├── portfolio
│   │   │   ├── project1.jpg
│   │   │   └── project2.jpg
│   │   ├── profile-img.jpg
│   │   └── skills
│   │       ├── bootstrap.png
│   │       ├── bootstrap.svg
│   │       ├── css.png
│   │       ├── css.svg
│   │       ├── git.png
│   │       ├── git.svg
│   │       ├── github.png
│   │       ├── html.png
│   │       ├── html.svg
│   │       ├── javascript.png
│   │       ├── javascript.svg
│   │       ├── jquery.png
│   │       ├── jquery.svg
│   │       ├── mysql.png
│   │       ├── mysql.svg
│   │       ├── php.png
│   │       └── php.svg
│   ├── jquery
│   │   └── jquery.min.js
│   ├── js
│   │   └── main.js
│   ├── scss
│   │   └── Readme.txt
│   └── vendor
│       ├── aos
│       │   ├── aos.cjs.js
│       │   ├── aos.css
│       │   ├── aos.esm.js
│       │   ├── aos.js
│       │   └── aos.js.map
│       ├── bootstrap
│       │   ├── css
│       │   │   ├── bootstrap-grid.css
│       │   │   ├── bootstrap-grid.css.map
│       │   │   ├── bootstrap-grid.min.css
│       │   │   ├── bootstrap-grid.min.css.map
│       │   │   ├── bootstrap-grid.rtl.css
│       │   │   ├── bootstrap-grid.rtl.css.map
│       │   │   ├── bootstrap-grid.rtl.min.css
│       │   │   ├── bootstrap-grid.rtl.min.css.map
│       │   │   ├── bootstrap-reboot.css
│       │   │   ├── bootstrap-reboot.css.map
│       │   │   ├── bootstrap-reboot.min.css
│       │   │   ├── bootstrap-reboot.min.css.map
│       │   │   ├── bootstrap-reboot.rtl.css
│       │   │   ├── bootstrap-reboot.rtl.css.map
│       │   │   ├── bootstrap-reboot.rtl.min.css
│       │   │   ├── bootstrap-reboot.rtl.min.css.map
│       │   │   ├── bootstrap-utilities.css
│       │   │   ├── bootstrap-utilities.css.map
│       │   │   ├── bootstrap-utilities.min.css
│       │   │   ├── bootstrap-utilities.min.css.map
│       │   │   ├── bootstrap-utilities.rtl.css
│       │   │   ├── bootstrap-utilities.rtl.css.map
│       │   │   ├── bootstrap-utilities.rtl.min.css
│       │   │   ├── bootstrap-utilities.rtl.min.css.map
│       │   │   ├── bootstrap.css
│       │   │   ├── bootstrap.css.map
│       │   │   ├── bootstrap.min.css
│       │   │   ├── bootstrap.min.css.map
│       │   │   ├── bootstrap.rtl.css
│       │   │   ├── bootstrap.rtl.css.map
│       │   │   ├── bootstrap.rtl.min.css
│       │   │   └── bootstrap.rtl.min.css.map
│       │   └── js
│       │       ├── bootstrap.bundle.js
│       │       ├── bootstrap.bundle.js.map
│       │       ├── bootstrap.bundle.min.js
│       │       ├── bootstrap.bundle.min.js.map
│       │       ├── bootstrap.esm.js
│       │       ├── bootstrap.esm.js.map
│       │       ├── bootstrap.esm.min.js
│       │       ├── bootstrap.esm.min.js.map
│       │       ├── bootstrap.js
│       │       ├── bootstrap.js.map
│       │       ├── bootstrap.min.js
│       │       └── bootstrap.min.js.map
│       ├── bootstrap-icons
│       │   ├── bootstrap-icons.css
│       │   ├── bootstrap-icons.json
│       │   ├── bootstrap-icons.min.css
│       │   ├── bootstrap-icons.scss
│       │   └── fonts
│       │       ├── bootstrap-icons.woff
│       │       └── bootstrap-icons.woff2
│       └── typed.js
│           ├── typed.cjs
│           ├── typed.cjs.map
│           ├── typed.module.js
│           ├── typed.module.js.map
│           ├── typed.umd.js
│           └── typed.umd.js.map
├── forms
│   ├── PHPMailer
│   │   ├── DSNConfigurator.php
│   │   ├── Exception.php
│   │   ├── OAuth.php
│   │   ├── OAuthTokenProvider.php
│   │   ├── PHPMailer.php
│   │   ├── POP3.php
│   │   └── SMTP.php
│   ├── Readme.txt
│   ├── config.php
│   └── contact.php
├── index.html
└── projects
    ├── company-directory
    │   ├── README.md
    │   ├── php
    │   │   ├── config.php
    │   │   ├── checkDepartmentDependencies.php
    │   │   ├── checkLocationDependencies.php
    │   │   ├── deleteDepartmentByID.php
    │   │   ├── deleteLocationByID.php
    │   │   ├── deletePersonnelByID.php
    │   │   ├── getAll.php
    │   │   ├── getAllDepartments.php
    │   │   ├── getAllLocations.php
    │   │   ├── getDepartmentByID.php
    │   │   ├── getLocationByID.php
    │   │   ├── getPersonnelByID.php
    │   │   ├── insertDepartment.php
    │   │   ├── insertLocation.php
    │   │   ├── insertPersonnel.php
    │   │   ├── searchAll.php
    │   │   ├── searchAllDepartments.php
    │   │   ├── updateDepartmentByID.php
    │   │   ├── updateLocationByID.php
    │   │   └── updatePersonnel.php
    │   ├── public
    │   │   ├── assets
    │   │   │   ├── css
    │   │   │   │   ├── fontawesome.min.css
    │   │   │   │   └── styles.css
    │   │   │   ├── img
    │   │   │   │   └── favicon.png
    │   │   │   ├── js
    │   │   │   │   └── app.js
    │   │   │   └── webfonts
    │   │   │       ├── fa-brands-400.woff2
    │   │   │       ├── fa-regular-400.woff2
    │   │   │       ├── fa-solid-900.woff2
    │   │   │       └── fa-v4compatibility.woff2
    │   │   ├── index.html
    │   │   └── libs
    │   │       ├── bootstrap
    │   │       │   ├── css
    │   │       │   │   └── bootstrap.min.css
    │   │       │   └── js
    │   │       │       └── bootstrap.bundle.min.js
    │   │       └── jquery
    │   │           └── jquery.min.js
    │   └── sql
    │       └── companydirectory.sql
    └── gazetter
        ├── README.md
        ├── data
        │   └── countryBorders.geo.json
        ├── img
        │   └── favicon.png
        ├── index.html
        ├── js
        │   ├── date.js
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

---

## Getting Started

### 1) Requirements
- Any static server for the portfolio pages
- **PHP 8+** (for the contact form and Company Directory project)
- Optional: MySQL for the Company Directory project

### 2) Run locally (PHP built-in server)
From the project root:
```bash
php -S localhost:8000 -t .
