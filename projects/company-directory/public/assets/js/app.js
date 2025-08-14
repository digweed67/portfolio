// ============== Data loaders ==============


// Fetch (or search) personnel and render into the table
function loadPersonnel(searchTerm = '', departmentID = '', locationID = '') {
  const isSearch    = Boolean(searchTerm);
  const ajaxUrl     = isSearch ? '../php/searchAll.php' : '../php/getAll.php';
  const ajaxData    = isSearch ? { txt: searchTerm }   : { departmentID, locationID };

  $.ajax({
    url:      ajaxUrl,
    method:   'GET',
    data:     ajaxData,
    dataType: 'json',
    success: function(response) {
      // If we searched, the data lives under response.data.found
      const list = isSearch ? response.data.found : (response.data || []);

      
      const tbody = document.getElementById('personnelTableBody');
      tbody.innerHTML = ''; 
      const frag = document.createDocumentFragment();

      if (!list.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'text-center text-muted py-3';
        cell.textContent = 'No personnel found. Try a different search or reset filters.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
        }
            
        list.forEach(function(p) {
            const row = document.createElement('tr');
            // Add name cell
            const nameCell = document.createElement('td');
            nameCell.className = 'align-middle text-nowrap';
            nameCell.textContent = `${p.lastName}, ${p.firstName}`;
            row.appendChild(nameCell);

            // Add job title 
            const jobCell = document.createElement('td');
            jobCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            jobCell.textContent = `${p.jobTitle}`;
            row.appendChild(jobCell);
            
            // Add department 
            const departmentCell = document.createElement('td');
            departmentCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            departmentCell.textContent = `${p.department  || p.departmentName}`;
            row.appendChild(departmentCell);

            // Add location
            const locationCell = document.createElement('td');
            locationCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            locationCell.textContent = `${p.location    || p.locationName}`;
            row.appendChild(locationCell);

            // Add email
            const emailCell = document.createElement('td');
            emailCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
            emailCell.textContent = `${p.email}`;
            row.appendChild(emailCell);

            // Add action buttons
            const actionsCell = document.createElement('td');
            actionsCell.className = 'text-end text-nowrap';

            // --- Edit Button ---
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-primary btn-sm me-1';
            editBtn.setAttribute('aria-label', 'Edit personnel');
            editBtn.setAttribute('data-bs-toggle', 'modal');
            editBtn.setAttribute('data-bs-target', '#editPersonnelModal');
            editBtn.setAttribute('data-id', p.id);

            // Icon inside Edit Button
            const editIcon = document.createElement('i');
            editIcon.className = 'fa-solid fa-pencil fa-fw';
            editBtn.appendChild(editIcon);

            // --- Delete Button ---
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-primary btn-sm deletePersonnelBtn';
            deleteBtn.setAttribute('aria-label', 'Delete personnel');
            deleteBtn.setAttribute('data-id', p.id);

            // Icon inside Delete Button
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'fa-solid fa-trash fa-fw';
            deleteBtn.appendChild(deleteIcon);

            // Append buttons to cell
            actionsCell.appendChild(editBtn);
            actionsCell.appendChild(deleteBtn);

            // Append cell to row
            row.appendChild(actionsCell);

            // Append row to frag 
            frag.appendChild(row);
                
        
            });

      
      tbody.appendChild(frag);


    },
    error: function(xhr, status, err) {
      showToast('Could not load personnel.', 'danger');
    }
  });
}


 // Fetch all departments and render into the departments table
function loadDepartments(searchTerm = '') {
  const isSearch = Boolean(searchTerm);
  const ajaxUrl = isSearch ? '../php/searchAllDepartments.php' : '../php/getAllDepartments.php';
  const ajaxData = isSearch ? { txt: searchTerm } : {};


  $.ajax({
    url: ajaxUrl, 
    method: 'GET',  
    data: ajaxData,                      
    dataType: 'json',                     
    success: function(response) {
        const tbody = document.getElementById('departmentTableBody');
        tbody.innerHTML = '';
        const frag = document.createDocumentFragment();

      const list = response.data || [];
        if (!list.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.className = 'text-center text-muted py-3';
        cell.textContent = 'No departments found.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
      }

      list.forEach(function(d) {
        const row = document.createElement('tr');

        // Department name cell
        const nameCell = document.createElement('td');
        nameCell.className = 'align-middle text-nowrap';
        nameCell.textContent = d.departmentName;
        row.appendChild(nameCell);

        // Location cell
        const locCell = document.createElement('td');
        locCell.className = 'align-middle text-nowrap d-none d-md-table-cell';
        locCell.textContent = d.locationName;
        row.appendChild(locCell);

        // Action buttons cell
        const actionCell = document.createElement('td');
        actionCell.className = 'text-end text-nowrap';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary btn-sm me-1';
        editBtn.setAttribute('aria-label', 'Edit department');
        editBtn.setAttribute('data-bs-toggle', 'modal');
        editBtn.setAttribute('data-bs-target', '#editDepartmentModal');
        editBtn.setAttribute('data-id', d.id);
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pencil fa-fw';
        editBtn.appendChild(editIcon);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-primary btn-sm deleteDepartmentBtn';
        deleteBtn.setAttribute('aria-label', 'Delete department');
        deleteBtn.setAttribute('data-id', d.id);
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash fa-fw';
        deleteBtn.appendChild(deleteIcon);

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        frag.appendChild(row);
      });
      tbody.appendChild(frag);
    },

    error: function(xhr, status, error) {
      showToast('Could not load departments.', 'danger');
    }
  });
}


// Fetch all locations and render into the locations table
function loadLocations() {
  $.ajax({
    url: '../php/getAllLocations.php',  
    method: 'GET',                       
    dataType: 'json',                    
    success: function(response) {
      const tbody = document.getElementById('locationTableBody');
      tbody.innerHTML = '';
      const frag = document.createDocumentFragment();

      if (!response.data.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 2;
        cell.className = 'text-center text-muted py-3';
        cell.textContent = 'No locations found.';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
      }

      response.data.forEach(function(loc) {
        const row = document.createElement('tr');

        // Location name
        const nameCell = document.createElement('td');
        nameCell.className = 'align-middle text-nowrap';
        nameCell.textContent = loc.name;
        row.appendChild(nameCell);

        // Action buttons
        const actionCell = document.createElement('td');
        actionCell.className = 'text-end text-nowrap';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-primary btn-sm me-1';
        editBtn.setAttribute('aria-label', 'Edit location');
        editBtn.setAttribute('data-bs-toggle', 'modal');
        editBtn.setAttribute('data-bs-target', '#editLocationModal');
        editBtn.setAttribute('data-id', loc.id);

        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pencil fa-fw';
        editBtn.appendChild(editIcon);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-primary btn-sm deleteLocationBtn';
        deleteBtn.setAttribute('aria-label', 'Delete location');
        deleteBtn.setAttribute('data-id', loc.id);

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-trash fa-fw';
        deleteBtn.appendChild(deleteIcon);

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);

        frag.appendChild(row);
      });

      tbody.appendChild(frag);
    },
    error: function(xhr, status, error) {
      showToast('Could not load locations.', 'danger');
    }
  });
}


// ============== Helper functions  ==============
function showToast(message, variant = 'success', delay = 2000) {
  const container = document.createElement('div');
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';

  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-bg-${variant} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('data-bs-delay', delay);

  const dFlex = document.createElement('div');
  dFlex.className = 'd-flex';

  const body = document.createElement('div');
  body.className = 'toast-body';
  body.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn-close btn-close-white me-2 m-auto';
  closeBtn.setAttribute('data-bs-dismiss', 'toast');
  closeBtn.setAttribute('aria-label', 'Close');

  dFlex.appendChild(body);
  dFlex.appendChild(closeBtn);
  toast.appendChild(dFlex);
  container.appendChild(toast);
  document.body.appendChild(container);

  new bootstrap.Toast(toast).show();
}


function capitalizeFirst(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}



// ============== Global scope variables ==============


let pendingDeleteDepartmentID  = null;
let pendingDeleteDepartmentRow = null;

let pendingDeleteLocationID  = null;
let pendingDeleteLocationRow = null;

// ============== Initialization on DOM ready ==============
$(document).ready(function() {

    $('#personnelBtn').on('click', function () {
      $('#filterBtn').prop('disabled', false);
      loadPersonnel();
    });

    $('#departmentsBtn').on('click', function () {
      $('#filterBtn').prop('disabled', true);
      loadDepartments();
    });

    $('#locationsBtn').on('click', function () {
      $('#filterBtn').prop('disabled', true);
      loadLocations();
    });


// ============== Delete Handlers ==============
  // Delete personnel button click
  $(document).on('click', '.deletePersonnelBtn', function () {
  const id = $(this).attr('data-id');

  $.ajax({
    url: '../php/getPersonnelByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        const person = res.data.personnel[0];
        $('#areYouSurePersonnelName').text(`${person.firstName} ${person.lastName}`);
        $('#areYouSurePersonnelID').val(person.id);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        modal.show();
      } else {
        showToast('Error retrieving personnel data.', 'danger');
      }
    },
    error: function () {
      showToast('Could not load personnel data.', 'danger');
    }
  });
});


  // Delete personnel confirm click
  $(document).on('submit', '#areYouSurePersonnelForm', function (e) {
  e.preventDefault();

  const id = $('#areYouSurePersonnelID').val();

  $.ajax({
    url: '../php/deletePersonnelByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        // Replace modal body content
        const $modal = $('#confirmDeleteModal');
        $modal.find('.modal-body').html(`<div class="text-success">Entry deleted successfully.</div>`);
        $modal.find('.modal-footer').hide();
 

        // Delay then close modal and refresh table
        setTimeout(() => {
          const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
          modal.hide();
          loadPersonnel(); 
        }, 1500);

      } else {
        $('.modal-body').append(`<div class="text-danger mt-2">Failed to delete entry.</div>`);
      }
    },
    error: function () {
      $('.modal-body').append(`<div class="text-danger mt-2">Server error. Please try again.</div>`);
    }
  });
  });

  // reset delete personnel modal 
  $('#confirmDeleteModal').on('hidden.bs.modal', function () {
  const $modal = $(this);

  // Reset modal body
  $modal.find('.modal-body').html(`
    <form id="areYouSurePersonnelForm">
      <input type="hidden" id="areYouSurePersonnelID">
      <p>Are you sure that you want to remove the entry for <span id="areYouSurePersonnelName" class="fw-bold"></span>?</p>
    </form>
  `);

  // Reset modal footer
  $modal.find('.modal-footer').show();
});


  // Delete department button click
  $(document).on('click', '.deleteDepartmentBtn', function () {
  const $btn = $(this);
  const deptID = $btn.attr('data-id');
  const $row = $btn.closest('tr');
  const rowName = $row.find('td:first').text().trim();

  // Store in pending vars
  pendingDeleteDepartmentID = deptID;
  pendingDeleteDepartmentRow = $row;
  
  console.log('Sending deptID:', deptID, typeof deptID);

  // Make AJAX call to check dependencies
  $.ajax({
    url: '../php/checkDepartmentDependencies.php',
    method: 'POST',
    dataType: 'json',
    data: { id: deptID },
    success: function (res) {
      if (res.status.code === "200") {
        const count = parseInt(res.data.personnelCount);

        if (count > 0) {
          // Fill the warning modal with name + count
          $('#cantDeleteDeptName').text(res.data.departmentName);
          $('#personnelCount').text(count);

          const modal = new bootstrap.Modal(document.getElementById('cantDeleteDeptModal'));
          modal.show();

        } else {
          // Show confirmation modal
          $('#areYouSureDeptName').text(rowName);         // span in the modal
          $('#deleteDepartmentID').val(deptID);           // hidden input

          const modal = new bootstrap.Modal(document.getElementById('confirmDeleteDepartmentModal'));
          modal.show();
        }

      } else {
        showToast('Could not check department dependencies.', 'danger');
      }
    },
    error: function () {
      showToast('Server error while checking dependencies.', 'danger');
    }
  });
  });


  // Delete department confirm click
  $(document).on('submit', '#deleteDepartmentForm', function (e) {
  e.preventDefault();

  const id = $('#deleteDepartmentID').val();
  const name = $('#areYouSureDeptName').text();
  const $modal = $('#confirmDeleteDepartmentModal');

  $.ajax({
    url: '../php/deleteDepartmentByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        // Replace modal content
        $modal.find('.modal-body').html(`<div class="text-success">Entry deleted successfully.</div>`);
        $modal.find('.modal-footer').hide();

        // Remove the row from DOM
        if (pendingDeleteDepartmentRow) {
          pendingDeleteDepartmentRow.remove();
        }

        // Delay and close modal + refresh table
        setTimeout(() => {
          bootstrap.Modal.getInstance(document.getElementById('confirmDeleteDepartmentModal')).hide();
          loadDepartments(); // refresh table
        }, 1500);

      } else {
        $modal.find('.modal-body').append(`<div class="text-danger mt-2">Failed to delete entry.</div>`);
      }
    },
    error: function () {
      $modal.find('.modal-body').append(`<div class="text-danger mt-2">Server error. Please try again.</div>`);
    },
    complete: function () {
      // Reset vars
      pendingDeleteDepartmentID = null;
      pendingDeleteDepartmentRow = null;
    }
  });
  });

  // reset delete department modal
  $('#confirmDeleteDepartmentModal').on('hidden.bs.modal', function () {
    const $modal = $(this);

    // Reset modal body
    $modal.find('.modal-body').html(`
      <form id="deleteDepartmentForm">
        <input type="hidden" id="deleteDepartmentID">
        <p>Are you sure that you want to remove the entry for <span id="areYouSureDeptName" class="fw-bold"></span>?</p>
      </form>
    `);

    // Reset modal footer
    $modal.find('.modal-footer').show();
  });


   // Delete location button click
  $(document).on('click', '.deleteLocationBtn', function () {
  const $btn = $(this);
  const locID = $btn.attr('data-id');
  const $row = $btn.closest('tr');
  const rowName = $row.find('td:first').text().trim();

  // Store globally
  pendingDeleteLocationID = locID;
  pendingDeleteLocationRow = $row;

  // Check if location has departments assigned
  $.ajax({
    url: '../php/checkLocationDependencies.php',
    method: 'POST',
    dataType: 'json',
    data: { id: locID },
    success: function (res) {
      if (res.status.code === "200") {
        const count = parseInt(res.data.departmentCount);

        if (count > 0) {
          // Cannot delete 
          $('#cantDeleteLocationName').text(res.data.locationName);
          $('#departmentCount').text(count);

          new bootstrap.Modal(document.getElementById('cantDeleteLocationModal')).show();

        } else {
          // Can delete modal
          $('#areYouSureLocationName').text(rowName);
          $('#deleteLocationID').val(locID);

          new bootstrap.Modal(document.getElementById('confirmDeleteLocationModal')).show();
        }

      } else {
        showToast('Could not check location dependencies.', 'danger');
      }
    },
    error: function () {
      showToast('Server error while checking dependencies.', 'danger');
    }
  });
});


  // Delete location confirm click
  $(document).on('submit', '#deleteLocationForm', function (e) {
  e.preventDefault();

  const id = $('#deleteLocationID').val();
  const name = $('#areYouSureLocationName').text();
  const $modal = $('#confirmDeleteLocationModal');

  $.ajax({
    url: '../php/deleteLocationByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id },
    success: function (res) {
      if (res.status.code === "200") {
        $modal.find('.modal-body').html(`<div class="text-success">Entry deleted successfully.</div>`);
        $modal.find('.modal-footer').hide();

        if (pendingDeleteLocationRow) {
          pendingDeleteLocationRow.remove();
        }

        setTimeout(() => {
          bootstrap.Modal.getInstance(document.getElementById('confirmDeleteLocationModal')).hide();
          loadLocations();
        }, 1500);
      } else {
        $modal.find('.modal-body').append(`<div class="text-danger mt-2">Failed to delete entry.</div>`);
      }
    },
    error: function () {
      $modal.find('.modal-body').append(`<div class="text-danger mt-2">Server error. Please try again.</div>`);
    },
    complete: function () {
      pendingDeleteLocationID = null;
      pendingDeleteLocationRow = null;
    }
  });
  });

  // reset delete location modal
  $('#confirmDeleteLocationModal').on('hidden.bs.modal', function () {
    const $modal = $(this);
    $modal.find('.modal-body').html(`
      <form id="deleteLocationForm">
        <input type="hidden" id="deleteLocationID">
        <p>Are you sure that you want to remove the entry for <span id="areYouSureLocationName" class="fw-bold"></span>?</p>
      </form>
    `);
    $modal.find('.modal-footer').show();
  });



// ============== Edit Modals & Forms ==============

$("#editPersonnelModal").on("show.bs.modal", function (e) {
    const employeeID = $(e.relatedTarget).data("id");
  
  $.ajax({
    url: '../php/getPersonnelByID.php',
    type: "POST",
    dataType: "json",
    data: { id: employeeID },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        
        // Pre-populate with the personnel data 

        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name
            })
          );
        });

        $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
        
      } else {
        $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
    }
  });
});


$("#editPersonnelForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behavior
  e.preventDefault();

  // Read form inputs 
  const id         = $("#editPersonnelEmployeeID").val().trim();
  const firstName  = capitalizeFirst($("#editPersonnelFirstName").val().trim());
  const lastName   = capitalizeFirst($("#editPersonnelLastName").val().trim());
  const jobTitle   = capitalizeFirst($("#editPersonnelJobTitle").val().trim());
  const email      = $("#editPersonnelEmailAddress").val().trim();
  const deptId     = $("#editPersonnelDepartment").val();

  // AJAX call to save form data
  $.ajax({
  url: '../php/updatePersonnel.php',
  method: 'POST',
  dataType: 'json',
  data: { 
    id,
    firstName,
    lastName,
    jobTitle,
    email,
    departmentID: deptId 
    },
  success: function(res) {
    if (res.status.code === "200") {
        // 1) Hide any previous error message
        $('#editPersonnelErrorMsg').addClass('d-none').text('');

        // 2) Close the modal
        bootstrap.Modal
        .getInstance(document.getElementById('editPersonnelModal'))
        .hide();

        // 3) Reload the personnel table to show changes
        loadPersonnel();

        // 4) Show toast 
        showToast(`Updated ${lastName}, ${firstName}.`);

    } else {
      // Show the server‐returned message in the modal
      $('#editPersonnelErrorMsg')
        .removeClass('d-none')
        .text('Update failed: ' + res.status.description);
    }
  },
  error: function() {
    $('#editPersonnelErrorMsg')
      .removeClass('d-none')
      .text('Error updating personnel. Please try again.');
  }
    });

});

$('#editPersonnelModal').on('hidden.bs.modal', function () {
  $('#editPersonnelForm')[0].reset();
  $('#editPersonnelErrorMsg').addClass('d-none').text('');
  $('#editPersonnelDepartment').empty(); // clear dropdown too
});


$('#editDepartmentModal').on('show.bs.modal', function(e) {
  const deptID = $(e.relatedTarget).data('id');
  $('#editDepartmentErrorMsg').addClass('d-none').text('');
  $('#editDepartmentID').val(deptID);

  // Call your existing PHP to get the current row
  $.ajax({
    url: '../php/getDepartmentByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id: deptID },
    success(res) {
      if (res.status.code !== "200") {
        $('#editDepartmentErrorMsg')
          .removeClass('d-none')
          .text('Could not load department data.');
        return;
      }
      // res.data is an array of rows
      const dept = res.data[0];
      $('#editDepartmentName').val(dept.name);

      $.ajax({
        url: '../php/getAllLocations.php',
        method: 'GET',
        dataType: 'json',
        success(locRes) {
          const select = $('#editDepartmentLocation');
          select.empty();

          locRes.data.forEach(loc => {
            const selected = loc.id == dept.locationID ? 'selected' : '';
            select.append(`<option value="${loc.id}" ${selected}>${loc.name}</option>`);
          });
        },
        error() {
          $('#editDepartmentErrorMsg')
            .removeClass('d-none')
            .text('Could not load locations. Please try again.');
        }
      });

    },
    error() {
      $('#editDepartmentErrorMsg')
        .removeClass('d-none')
        .text('Error fetching data.');
    }
  });
});

$('#editDepartmentForm').on('submit', function(e) {
  e.preventDefault();

  const id   = $('#editDepartmentID').val();
  const name = capitalizeFirst($('#editDepartmentName').val().trim());
  const locationID = $('#editDepartmentLocation').val();

  $.ajax({
    url: '../php/updateDepartmentByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id, name, locationID },
    success(res) {
      if (res.status.code === "200") {
        // Close modal, refresh table, toast
        bootstrap.Modal.getInstance($('#editDepartmentModal')[0]).hide();
        loadDepartments();
        showToast(`Renamed department to “${name}”.`);
      } else {
        $('#editDepartmentErrorMsg')
          .removeClass('d-none')
          .text('Update failed: ' + res.status.description);
      }
    },
    error() {
      $('#editDepartmentErrorMsg')
        $('#editDepartmentErrorMsg')
        .removeClass('d-none')
        .text('Error updating department.');
    }
  });
});

$('#editDepartmentModal').on('hidden.bs.modal', function () {
  $('#editDepartmentForm')[0].reset();
  $('#editDepartmentErrorMsg').addClass('d-none').text('');
  $('#editDepartmentLocation').empty(); // reset dropdown
});


$('#editLocationModal').on('show.bs.modal', function(e) {
  const locationID = $(e.relatedTarget).data('id');
  $('#editLocationErrorMsg').addClass('d-none').text('');
  $('#editLocationID').val(locationID);

  // Call your existing PHP to get the current row
  $.ajax({
    url: '../php/getLocationByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id: locationID },
    success(res) {
      if (res.status.code !== "200") {
        $('#editLocationErrorMsg')
          .removeClass('d-none')
          .text('Could not load location data.');
        return;
      }
      const loc = res.data[0];
      $('#editLocationName').val(loc.name);
    },
    error() {
      $('#editLocationErrorMsg')
        .removeClass('d-none')
        .text('Error fetching data.');
    }
  });
});

$('#editLocationForm').on('submit', function(e) {
  e.preventDefault();

  const id = $('#editLocationID').val();
  const name = capitalizeFirst($('#editLocationName').val().trim());

  $.ajax({
    url: '../php/updateLocationByID.php',
    method: 'POST',
    dataType: 'json',
    data: { id, name },
    success(res) {
      if (res.status.code === "200") {
        // Close modal, refresh table, toast
        bootstrap.Modal.getInstance($('#editLocationModal')[0]).hide();
        loadLocations();
        showToast(`Renamed location to “${name}”.`);
      } else {
        $('#editLocationErrorMsg')
          .removeClass('d-none')
          .text('Update failed: ' + res.status.description);
      }
    },
    error() {
      $('#editLocationErrorMsg')
        .removeClass('d-none')
        .text('Error updating location.');
    }
  });
});

$('#editLocationModal').on('hidden.bs.modal', function () {
  $('#editLocationForm')[0].reset();
  $('#editLocationErrorMsg').addClass('d-none').text('');
});




// ============== Live Search ==============


let searchTimer = null;

$('#searchInp').on('keyup', function(e) {
  const q = this.value.trim();

  // If Enter is pressed, trigger search immediately
  if (e.key === 'Enter') {
    e.preventDefault();
    if (q.length >= 2) {
      $('#personnelBtn').tab('show');
      loadPersonnel(q);
      $(this).val('');
    }
    return;
  }
  // if too short, cancel pending search and hide
  if (q.length < 2) {
    clearTimeout(searchTimer);
    if ($("#personnelBtn").hasClass("active")) {
      loadPersonnel();
    } else if ($("#departmentsBtn").hasClass("active")) {
      loadDepartments();
    }
  }

  // cancel the previous timer
  clearTimeout(searchTimer);

  // schedule a new one
  searchTimer = setTimeout(function() {
    if ($("#personnelBtn").hasClass("active")) {
    loadPersonnel(q);
  } else if ($("#departmentsBtn").hasClass("active")) {
    loadDepartments(q);
  }
  }, 200);
});


// ============== Refresh button  ==============

$("#refreshBtn").click(function () {
    const $btn = $(this);
    const originalHTML = $btn.html();

    $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
    $btn.prop('disabled', true); 

    setTimeout(() => {
      $btn.html(originalHTML);
      $btn.prop('disabled', false);
    }, 600); 
  
  if ($("#personnelBtn").hasClass("active")) {
    $('#filterPersonnelByDepartment').val('');
    $('#filterPersonnelByLocation').val('');
    // Refresh personnel table
    loadPersonnel();
  } else {
    
    if ($("#departmentsBtn").hasClass("active")) {
      
      // Refresh department table
      loadDepartments();
    } else {
      
      // Refresh location table
      loadLocations();
    }
    
  }
  
});

// ============== Filter Modal ==============

$('#filterPersonnelModal').on('show.bs.modal', function () {
  $('#filterErrorMsg').addClass('d-none').text('');

  var currentfilterDepartmentSelect = $('#filterPersonnelByDepartment').val();
  var currentfilterLocationSelect   = $('#filterPersonnelByLocation').val(); 
    // Load departments
  $.ajax({
    url: '../php/getAllDepartments.php',
    method: 'GET',
    dataType: 'json',
    success: function(res) {
      const $dept = $('#filterPersonnelByDepartment').empty();
      $dept.append(`<option value="">All</option>`);
      res.data.forEach(function(d) {
        $dept.append(`<option value="${d.id}">${d.departmentName}</option>`);
      });

      $dept.val(currentfilterDepartmentSelect);
    }
  });


  // Load locations
  $.ajax({
    url: '../php/getAllLocations.php',
    method: 'GET',
    dataType: 'json',
    success: function(res) {
      const $loc = $('#filterPersonnelByLocation').empty();
      $loc.append(`<option value="">All</option>`);
      res.data.forEach(function(l) {
        $loc.append(`<option value="${l.id}">${l.name}</option>`);
      });

      $loc.val(currentfilterLocationSelect);

    }
  });

});


$('#filterPersonnelByDepartment').on('change', function () {
  const deptID = $(this).val();

  if (deptID !== '') {
    $('#filterPersonnelByLocation').val('');
  }

  loadPersonnel('', deptID, '');
});

$('#filterPersonnelByLocation').on('change', function () {
  const locID = $(this).val();

  if (locID !== '') {
    $('#filterPersonnelByDepartment').val('');
  }

  loadPersonnel('', '', locID);
});


// ============== Add Modals & Forms ==============

$("#addBtn").click(function () {
  if ($('#personnelBtn').hasClass('active')) {
    // Reset form & clear errors
    const $form = $('#addPersonnelForm');
    if ($form.length) $form[0].reset();
    $('#addPersonnelErrorMsg').addClass('d-none').text('');

    // Populate Department dropdown via AJAX
    $.ajax({
      url: '../php/getAllDepartments.php',
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        const $dept = $('#addPersonnelDepartment').empty();
        $dept.append(`<option value="" disabled selected hidden></option>`);
        res.data.forEach(function(d) {
          $dept.append(`<option value="${d.id}">${d.departmentName}</option>`);
        });
      },
      error: function() {
        $('#addPersonnelErrorMsg')
          .removeClass('d-none')
          .text('Could not load departments. Please try again.');
      }
    });

    // Show the Add Personnel modal
    new bootstrap.Modal($('#addPersonnelModal')[0]).show();
  }

  if ($('#departmentsBtn').hasClass('active')) {
    // 1) Reset form & clear errors
    $('#addDepartmentForm')[0].reset();
    $('#addDepartmentErrorMsg').addClass('d-none').text('');

    // 2) Populate Location dropdown via AJAX
    $.ajax({
      url: '../php/getAllLocations.php',
      method: 'GET',
      dataType: 'json',
      success: function(res) {
        const $loc = $('#addDepartmentLocation').empty();
        $loc.append(`<option value="" disabled selected></option>`);
        res.data.forEach(function(loc) {
          $loc.append(`<option value="${loc.id}">${loc.name}</option>`);
        });
      },
      error: function() {
        $('#addDepartmentErrorMsg')
          .removeClass('d-none')
          .text('Could not load locations. Please try again.');
      }
    });

    // 3) Show the Add Department modal
    new bootstrap.Modal($('#addDepartmentModal')[0]).show();
  }

  if ($('#locationsBtn').hasClass('active')) {
        // 1) Reset form & clear errors
        $('#addLocationForm')[0].reset();
        $('#addLocationErrorMsg').addClass('d-none').text('');

        // 2) Show the Add Location modal
        new bootstrap.Modal($('#addLocationModal')[0]).show();
  }
  
});


$('#addPersonnelForm').on('submit', function(e) {
  e.preventDefault();

  const payload = {
    firstName:    capitalizeFirst($('#addPersonnelFirstName').val().trim()),
    lastName:     capitalizeFirst($('#addPersonnelLastName').val().trim()),
    jobTitle:     capitalizeFirst($('#addPersonnelJobTitle').val().trim()),
    email:        $('#addPersonnelEmailAddress').val().trim(),
    departmentID: $('#addPersonnelDepartment').val()
  };

  $.ajax({
    url: '../php/insertPersonnel.php',
    method: 'POST',
    dataType: 'json',
    data: payload,
    success: function(res) {
      if (res.status.code === "200") {
        // close modal
        bootstrap.Modal
          .getInstance($('#addPersonnelModal')[0])
          .hide();

        // refresh table
        loadPersonnel();

        // toast
        showToast(`Added ${payload.lastName}, ${payload.firstName}.`);
      } else {
        $('#addPersonnelErrorMsg')
          .removeClass('d-none')
          .text('Add failed: ' + res.status.description);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
    console.error('insertPersonnel error:', textStatus, errorThrown, jqXHR.responseText);
      $('#addPersonnelErrorMsg')
        .removeClass('d-none')
        .text('Error adding personnel. Please try again.');
    }
  });
});

$('#addPersonnelModal').on('hidden.bs.modal', function () {
  $('#addPersonnelForm')[0].reset();
  $('#addPersonnelErrorMsg').addClass('d-none').text('');
  $('#addPersonnelDepartment').empty(); // reset dropdown
});


$('#addDepartmentForm').on('submit', function(e) {
  e.preventDefault();

  const payload = {
    name:       capitalizeFirst($('#addDepartmentName').val().trim()),
    locationID: $('#addDepartmentLocation').val()
  };

  $.ajax({
    url: '../php/insertDepartment.php',
    method: 'POST',
    dataType: 'json',
    data: payload,
    success: function(res) {
      if (res.status.code === "200") {
        // close modal
        bootstrap.Modal
          .getInstance($('#addDepartmentModal')[0])
          .hide();

        // refresh table
        loadDepartments();

        // toast
        showToast(`Added department: ${payload.name}.`);
      } else {
        $('#addDepartmentErrorMsg')
          .removeClass('d-none')
          .text('Add failed: ' + res.status.description);
      }
    },
    error: function() {
      
      $('#addDepartmentErrorMsg')
        .removeClass('d-none')
        .text('Error adding department. Please try again.');
    }
  });
});

$('#addDepartmentModal').on('hidden.bs.modal', function () {
  $('#addDepartmentForm')[0].reset();
  $('#addDepartmentErrorMsg').addClass('d-none').text('');
  $('#addDepartmentLocation').empty(); // reset dropdown
});

$('#addLocationForm').on('submit', function(e) {
  e.preventDefault();

  const payload = {
    name:    capitalizeFirst($('#addLocationName').val().trim()),
  };

  $.ajax({
    url: '../php/insertLocation.php',
    method: 'POST',
    dataType: 'json',
    data: payload,
    success: function(res) {
      if (res.status.code === "200") {
        // close modal
        bootstrap.Modal
          .getInstance($('#addLocationModal')[0])
          .hide();

        // refresh table
        loadLocations();

        // toast
        showToast(`Added location: ${payload.name}.`);
      } else {
        $('#addLocationErrorMsg')
          .removeClass('d-none')
          .text('Add failed: ' + res.status.description);
      }
    },
    error: function() {
      $('#addLocationErrorMsg')
        .removeClass('d-none')
        .text('Error adding location. Please try again.');
    }
  });
});

$('#addLocationModal').on('hidden.bs.modal', function () {
  $('#addLocationForm')[0].reset();
  $('#addLocationErrorMsg').addClass('d-none').text('');
});


// Fix ARIA issue: blur focused elements before modal is hidden
$('.modal').on('hide.bs.modal', function () {
  if (document.activeElement && this.contains(document.activeElement)) {
    document.activeElement.blur();
  }
});


loadPersonnel();
}); // DOM closing tags 


