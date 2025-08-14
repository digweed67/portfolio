## Company Directory 

An internal web app to **browse, add, edit, and delete** personnel, departments, and locations within an organization.

---

### Features

* Live search with auto-suggestions
* Add/edit/delete/filter/search personnel
* Add/edit/delete departments (with location)
* Add/edit/delete office locations
* Filter personnel by department or location
* Accessible with ARIA labels
* Fully responsive (mobile → desktop)
* Inline form validation + error messages
* AJAX-driven: No page reloads

---

### Tech Stack

* **Frontend**: HTML5, CSS3, Bootstrap 5, jQuery
* **Backend**: PHP (MySQLi)
* **Database**: MySQL
* **Libraries**: Font Awesome, Bootstrap Icons

---

### Folder Structure

```
.
├── README.md
├── php
│   ├── SearchAll.php
│   ├── config.php
│   ├── deleteDepartmentByID.php
│   ├── deleteLocationByID.php
│   ├── deletePersonnelByID.php
│   ├── getAll.php
│   ├── getAllDepartments.php
│   ├── getAllLocations.php
│   ├── getDepartmentByID.php
│   ├── getLocationByID.php
│   ├── getPersonnelByID.php
│   ├── insertDepartment.php
│   ├── insertLocation.php
│   ├── insertPersonnel.php
│   ├── updateDepartmentByID.php
│   ├── updateLocationByID.php
│   └── updatePersonnel.php
├── public
│   ├── assets
│   │   ├── css
│   │   │   └── styles.css
│   │   └── js
│   │       └── app.js
│   ├── index.html
│   └── libs
│       ├── bootstrap
│       │   ├── css
│       │   │   └── bootstrap.min.css
│       │   └── js
│       │       └── bootstrap.bundle.min.js
│       └── jquery
│           └── jquery.min.js
└── sql
    └── companydirectory.sql
```

---

### How to Run

1. Clone or download the repo.
2. In phpMyAdmin, create a new database and import the provided `.sql` file.
3. Configure `/php/config.php` with your DB credentials.
4. Run the project on a local server (e.g. XAMPP).
5. Open `index.html` in your browser via `http://localhost/<folder-name>`.

---

### Author

Amaia Artola   
Developed as part of an educational portfolio project. 




