// === global scope variables ===
let demographicsModal, wikipediaModal, weatherModal, imagesModal, holidaysModal, map;

// === BASEMAP LAYERS ===
const streets   = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});
const satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
);
const basemaps = {
  'Streets':   streets,
  'Satellite': satellite
};

// === OVERLAY LAYERS ===
const airports = L.markerClusterGroup();
let cityClusterLayer = L.markerClusterGroup();
const overlays = {
  'Airports': airports,
  'Cities':   cityClusterLayer
};



// === 1. API fetch functions ===

function fetchCountry(lat, lng) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCountryFromCoords.php',
      method: 'POST',
      data: { lat, lng },
      dataType: 'json',
      success: resolve,
      error: reject
    });
  });
}

function fetchCountryList() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCountryList.php',
      method: 'GET',
      dataType: 'json',
      success: resolve,
      error: reject
    });
  });
}

function fetchCountryBorder(code) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCountryBorder.php',
      method: 'POST',
      data: { code },
      dataType: 'json',
      success: resolve,
      error: reject
    });
  });
}

function fetchCities(countryCode) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCities.php',
      method: 'POST',
      data: { countryCode },
      dataType: 'json',
      success: resolve,
      error: reject
    });
  });
}

function fetchAirports(countryCode) {
    return new Promise((resolve, reject) => {
      $.ajax({
      url: 'php/getAirports.php',
      method: 'POST',
      data: { countryCode },
      dataType: 'json',
      success: resolve,
      error: reject
    });
  });
}


function fetchDemographics(code) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getDemographics.php',
      method: 'POST',
      data: { code },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'success') {
          resolve(response.data);
        } else {
          reject(response.message || 'Failed to load demographic data');
        }
      },
      error: function () {
        reject('AJAX error while fetching demographics');
      }
    });
  });
}

function fetchCountryWikipedia(code) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCountryWikipedia.php',
      method: 'POST',
      data: { code },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'ok') {
          resolve(response.summary);
        } else {
          reject(response.message || 'No summary found.');
        }
      },
      error: function () {
        reject('Failed to fetch Wikipedia summary.');
      }
    });
  });
}

function fetchWeather(code) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'php/getCountryWeather.php',
      method: 'POST',
      data: { code },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'ok') {
          resolve(response);
        } else {
          reject(response.message || 'Failed to load weather data');
        }
      },
      error: function () {
        reject('AJAX error while fetching weather');
      }
    });
  });
}

function fetchCountryImages(code) {
  return new Promise((resolve, reject) => {
    const countryName = $('#countryDropdown option:selected').text();

    $.ajax({
      url: 'php/getCountryImages.php',
      method: 'GET',
      data: {
        code,
        name: countryName
      },
      dataType: 'json',
      success: function (response) {
        if (response.status === 'ok') {
          resolve(response.photos);
        } else {
          reject(response.message || 'No images found.');
        }
      },
      error: function () {
        reject('AJAX error while fetching country images.');
      }
    });
  });
}

function fetchHolidays(code) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `php/getCountryHolidays.php?country=${encodeURIComponent(code)}`,
      method: 'GET',
      dataType: 'json',
      success: data => {
        if (Array.isArray(data)) resolve(data);
        else reject('Unexpected response format');
      },
      error: (_, status, err) => {
        reject(`${status}: ${err}`);
      }
    });
  });
}

// === 2. Modal show functions ===

function showDemographicsModal(code) {
  fetchDemographics(code)
    .then(data => {
      const name = data.name || 'Unknown';
      const population = data.population?.toLocaleString() || 'N/A';
      const capital = data.capital || 'N/A';
      const area = data.area ? `${data.area.toLocaleString()} km²` : 'N/A';
      const languages = data.languages || 'N/A';
      const region = data.region || 'N/A';
      const subregion = data.subregion || 'N/A';

      $('#demographicsModalLabel').text(`${name}`);
      $('#demographicsModalBody').html(`
        <ul class="list-group list-group-flush">
          
          <li class="list-group-item d-flex align-items-center">
            <i class="fa-solid fa-landmark-flag fa-lg text-primary me-4"></i>
            <div>
              <div class="fw-semibold">Capital</div>
              <div>${capital}</div>
            </div>
          </li>

          
          <li class="list-group-item d-flex align-items-center">
            <i class="fa-solid fa-users fa-lg text-primary me-4"></i>
            <div>
              <div class="fw-semibold">Population</div>
              <div>${population}</div>
            </div>
          </li>

          
          <li class="list-group-item d-flex align-items-center">
            <i class="fa-solid fa-ruler-combined fa-lg text-primary me-4"></i>
            <div>
              <div class="fw-semibold">Area</div>
              <div>${area}</div>
            </div>
          </li>

          
          <li class="list-group-item d-flex align-items-center">
            <i class="fa-solid fa-language fa-lg text-primary me-4"></i>
            <div>
              <div class="fw-semibold">Languages</div>
              <div>${languages}</div>
            </div>
          </li>

          
          <li class="list-group-item d-flex align-items-center">
            <i class="fa-solid fa-globe fa-lg text-primary me-4"></i>
            <div>
              <div class="fw-semibold">Region</div>
              <div>${region}</div>
            </div>
          </li>

          
          <li class="list-group-item d-flex align-items-center">
            <i class="fa-solid fa-map-marked-alt fa-lg text-primary me-4"></i>
            <div>
              <div class="fw-semibold">Subregion</div>
              <div>${subregion}</div>
            </div>
          </li>
        </ul>
        `);

      demographicsModal.show();
    })
    .catch(err => {
      $('#demographicsModalLabel').text('Demographics');
      $('#demographicsModalBody').html(`<p class="text-danger">${err}</p>`);
      demographicsModal.show();
    });
}


function showWikipediaModal(code) {
  fetchCountryWikipedia(code)
    .then(summary => {
      const countryName = $('#countryDropdown option:selected').text();
      $('#wikipediaModalLabel').text(countryName);
      $('#wikipediaModalBody').html(`
        <p>${summary}</p>
        <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(countryName)}" target="_blank">Read more on Wikipedia</a>
      `);
      wikipediaModal.show();
    })
    .catch(err => {
      $('#wikipediaModalLabel').text('Wikipedia');
      $('#wikipediaModalBody').html(`<p class="text-danger">${err}</p>`);
      wikipediaModal.show();
    });
}


function showWeatherModal(code) {
  fetchWeather(code)
    .then(data => {
      const countryName = $('#countryDropdown option:selected').text();
      $('#weatherModalLabel').text(`${data.capital}, ${countryName}`);
      $('#weatherModalBody').html(`
      <div class="card">
        <div class="card-header bg-light fw-bold">TODAY</div>
        <div class="card-body py-2">
              <div class="row align-items-center">
            <div class="col-4 text-center">
              <img
                src="https://openweathermap.org/img/wn/${data.today.icon}@2x.png"
                class="img-fluid w-100"
                alt="Weather icon"
              />
            </div>
            <div class="col-8 text-center">
              <div class="display-6 mb-0">${Math.round(data.today.temp)}°C</div>
              <div class="small text-muted">
                ${Math.round(data.forecast3[0].low)}°C
              </div>
            </div>
          </div>
        </div>
        <hr class="my-0">
        <div class="card-body py-2">
          <div class="row text-center">
            ${data.forecast3.slice(1)
            .map(d => {
              const dt = Date.parse(d.date);
              const dayFormatted = dt.toString("ddd dS");
              return `
                <div class="col">
                  <div class="fw-semibold">${dayFormatted}</div>
                  <img
                    src="https://openweathermap.org/img/wn/${d.icon}@2x.png"
                    class="my-1"
                    alt="${dayFormatted}"
                  />
                  <div><span class="fw-bold">${Math.round(d.high)}°</span> / ${Math.round(d.low)}°</div>
                </div>
              `;
            })
            .join('')}
          </div>
        </div>
      </div>
    `);
      weatherModal.show();
    })
    .catch(err => {
      $('#weatherModalLabel').text('Weather');
      $('#weatherModalBody').html(`<p class="text-danger">${err}</p>`);
      weatherModal.show();
    });
}


function showImagesModal(code) {
  const countryName = $('#countryDropdown option:selected').text();

  fetchCountryImages(code)
    .then(photos => {
      if (!photos || photos.length === 0) {
        $('#imagesModalLabel').text('Country Photos');
        $('#imagesModalBody').html('<p>No images found.</p>');
        imagesModal.show();
        return;
      }

      const imageHTML = `
        <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${photos.map((photo, index) => `
              <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <div class="carousel-img-wrapper">
                  <img src="${photo.src.portrait}" class="carousel-img" alt="${photo.alt || countryName}">
                </div>
              </div>
            `).join('')}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      `;

      $('#imagesModalLabel').text(`${countryName}`);
      $('#imagesModalBody').html(imageHTML);
      imagesModal.show();
    })
    .catch(err => {
      $('#imagesModalLabel').text('Country Photos');
      $('#imagesModalBody').html(`<p class="text-danger">${err}</p>`);
      imagesModal.show();
    });
}


function showHolidaysModal(code) {
  const countryName = $('#countryDropdown option:selected').text();
  $('#holidaysModalLabel').text(`Holidays in ${countryName}`);
  const $list = $('#holidaysList')
    .empty()
    .append(`<li class="list-group-item"><em>Loading holidays…</em></li>`);

  fetchHolidays(code)
    .then(holidays => {
      $list.empty();
      if (!holidays.length) {
        $list.append('<li class="list-group-item">No holidays found.</li>');
      } else {
        holidays.forEach(h => {
          const formatted = Date.parse(h.date).toString("dS MMMM");     
          $list.append(`
            <li class="list-group-item">
              <div class="d-flex">
                <div class="w-25 fw-semibold">${formatted}</div>
                <div class="flex-grow-1">${h.name}</div>
              </div>
            </li>
          `);
        });
      }
      holidaysModal.show();
    })
    .catch(err => {
      $list.html(
        `<li class="list-group-item text-danger">
            Error loading holidays: ${err}
          </li>`
      );
      holidaysModal.show();
    });
}

document.addEventListener('DOMContentLoaded', () => {

// === 3. UI element initialization ===

  // Demographics modal setup
  demographicsModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('demographicsModal'));

  // Wikipedia modal setup
  wikipediaModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('wikipediaModal'));

  // Weather modal 
  weatherModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('weatherModal'));

  // Images modal 
  imagesModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('imagesModal'));

  // Holidays modal setup
  holidaysModal = bootstrap.Modal.getOrCreateInstance(
  document.getElementById('holidaysModal'));

  // Populate dropdown 
  
  const dropdown = document.getElementById('countryDropdown');

  fetchCountryList()
    .then(function (list) {
      list
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(function ({ code, name }) {
          const option = document.createElement('option');
          option.value = code;
          option.textContent = name;
          $('#countryDropdown').append(option);
        });
    })

    .catch(err => console.error('Could not load countries:', err));

// === 4. Map init & events ===

  // Create the map and keep in variable
  map = L.map('map', { layers: [streets] });

  L.control.layers(basemaps, overlays).addTo(map);

  // + button: zoom in +2 levels
  const zoomInBtn = document.querySelector('.leaflet-control-zoom-in');
  zoomInBtn.addEventListener('click', e => {
    e.preventDefault();
    map.zoomIn(2);
  });

  // Double‐click on the map: zoom in +2 levels
  map.off('dblclick');                    
  map.on('dblclick', () => map.zoomIn(2));

  // Get current position of user and fallback if no location access
  navigator.geolocation.getCurrentPosition(
  function (position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;


    // Zoom the map 
    map.setView([lat, lng], 6);

    fetchCountry(lat, lng)
      .then(function (response) {
        if (response.status === 'success' && response.countryCode) {
          const countryCode = response.countryCode;
          $('#countryDropdown').val(countryCode).trigger('change');
        } else {
          console.warn('Country not detected. Please select a country.');
          map.setView([20, -30], 2);
          $('#countryDropdown').val('').trigger('change');
        }
      })
      .catch(function (err) {
        console.error('Error getting country:', err);
        map.setView([20, -30], 2);
        $('#countryDropdown').val('').trigger('change');
      });
  },
  function (error) {
    console.warn('Geolocation error:', error);

    
    map.setView([20, -30], 2);

    // Clear dropdown selection
    $('#countryDropdown').val('').trigger('change');
  }
  );

// Hide loader after map is fully ready 
  map.whenReady(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 500); // removes it smoothly after fading out
    }
  });



// Change map when the selected country changes 

  let borderLayer;  

  $('#countryDropdown').on('change', function () {
    const code = $(this).val();    
    if (!code) return;


    fetchCountryBorder(code)
      .then(function (feature) {
        // remove previous border if it exists
        if (borderLayer) map.removeLayer(borderLayer);

        // draw new border
        borderLayer = L.geoJSON(feature, {
          style: { color: 'red', weight: 2 }
        }).addTo(map);

        // zoom so the whole country fits
        map.fitBounds(borderLayer.getBounds());
        getCities(code);
        getAirports(code);
      })

      .catch(err => console.error('Could not load border for', code, err));
  });


// Get cities and show them when toggled on 
  function getCities(countryCode) {
  fetchCities(countryCode)
    .then(function (response) {
      
      cityClusterLayer.clearLayers();

      response.geonames.forEach(city => {
        const lat = parseFloat(city.lat);
        const lng = parseFloat(city.lng);
        const cityName = city.toponymName || city.name;

        
        const cityIcon = L.ExtraMarkers.icon({
          icon: '',
          prefix: '',               
          markerColor: 'blue',
          shape: 'square',
          innerHTML: `
            <i class="fas fa-city extra-marker-city-icon"></i>`
        });

        
        L.marker([lat, lng], { icon: cityIcon })
          .bindPopup(`<strong>${cityName}</strong>`)
          .addTo(cityClusterLayer);

      });

      if (map.hasLayer(cityClusterLayer)) {
        map.fitBounds(cityClusterLayer.getBounds());
      }

    })
    .catch(err => console.error('Could not load cities:', err));
}

// Get airports and show them when toggled on
function getAirports(countryCode) {
  fetchAirports(countryCode)
    .then(function(response) {
      
      airports.clearLayers();
      
      response.data.forEach(a => {

        const airportIcon = L.ExtraMarkers.icon({
          prefix:      '',     
          icon:        '',   
          markerColor: 'green',
          shape:       'square',
          innerHTML: `<i class="fas fa-plane extra-marker-city-icon"></i>`
        });

        L.marker([parseFloat(a.lat), parseFloat(a.lng)], { icon: airportIcon })
        .bindTooltip(a.name, { direction: 'top', sticky: true })
        .addTo(airports);
      });
      
      if (map.hasLayer(airports)) {
        map.fitBounds(airports.getBounds());
      }
    })
    .catch(err => console.error('Airports error:', err));
}



// === 5. EasyButtons ===

 
  L.easyButton('fa-users', function(btn, map) {
    const code = $('#countryDropdown').val();
    if (code) {
      showDemographicsModal(code);
    } else {
      alert('Please select a country first.');
    }
  }, 'Show Demographics').addTo(map);

  L.easyButton('fa-book', function(btn, map) {
  const code = $('#countryDropdown').val();
  if (code) {
    showWikipediaModal(code);
  } else {
    alert('Please select a country first.');
  }
  }, 'Wikipedia Summary').addTo(map);

  L.easyButton('fa-cloud', function () {
  const selectedCode = $('#countryDropdown').val();

  if (!selectedCode) {
    $('#weatherModalLabel').text('Weather');
    $('#weatherModalBody').html('<p>Please select a country first.</p>');
    weatherModal.show();
    return;
  }

  showWeatherModal(selectedCode);
  }).addTo(map);

  L.easyButton('fa-image', function () {
    const code = $('#countryDropdown').val();

    if (code) {
      showImagesModal(code);
    } else {
      $('#imagesModalLabel').text('Country Photos');
      $('#imagesModalBody').html('<p>Please select a country first.</p>');
      imagesModal.show();
    }
  }, 'Show Country Images').addTo(map);

  L.easyButton('fa-calendar', function(btn, map) {
    const code = $('#countryDropdown').val();
    if (!code) {
      alert('Please select a country first.');
      return;
    }
    showHolidaysModal(code);
  }, 'Show Holidays').addTo(map);




}); //DOM closing tags 
