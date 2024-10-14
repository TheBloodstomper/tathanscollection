// JavaScript for simplified filtering by type

let allData = [];
let selectedType = 'All';

// Fetch data from the JSON file
document.addEventListener('DOMContentLoaded', function() {
  fetch('books.json')
    .then(response => response.json())
    .then(data => {
      allData = data.map(item => ({
        NAME: item.NAME || '',
        AUTHOR: item.AUTHOR || '',
        EDITOR: item.EDITOR || '',
        REGION: item.REGION || '',
        TYPE: item.TYPE || '',
        SOURCE: item.SOURCE || '',
        NOTES: item.NOTES || ''
      }));

      createTable(allData); // Display all data initially
      initializeDataTable();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// Function to create the table for books
function createTable(data) {
    const dataList = document.getElementById('data-list');
    dataList.innerHTML = ''; // Clear previous data
  
    if (data.length === 0) {
      dataList.innerHTML = '<p>No data available.</p>';
      return;
    }
  
    // Create table element
    const table = document.createElement('table');
    table.className = 'table table-bordered table-hover';
    table.id = 'book-data-table'; // Updated ID to book-data-table
  
    // Define headers
    const headers = ['#', 'NAME', 'AUTHOR', 'EDITOR', 'REGION', 'TYPE', 'SOURCE', 'NOTES'];
  
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
  
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
  
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    // Create table body
    const tbody = document.createElement('tbody');
  
    data.forEach((item, index) => {
      const row = document.createElement('tr');
  
      headers.forEach(header => {
        const cell = document.createElement('td');
  
        if (header === '#') {
          cell.textContent = index + 1; // Add row number
        } else {
          cell.textContent = item[header] || '-';
          cell.setAttribute('data-label', header);
        }
  
        row.appendChild(cell);
      });
  
      tbody.appendChild(row);
    });
  
    table.appendChild(tbody);
    dataList.appendChild(table);
  }
  
  // Adjust DataTable initialization
  function initializeDataTable() {
    $('#book-data-table').DataTable({
      paging: true,
      searching: true,
      ordering: true,
      info: false,
      autoWidth: false,
      pageLength: 25,
      lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]],
      columnDefs: [{ targets: [6, 7], orderable: false }],
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search..."
      }
    });
  }
  

// Event listener for type tabs
document.querySelectorAll('.type-tab').forEach(tab => {
  tab.addEventListener('click', function(e) {
    e.preventDefault();
    // Remove active class from all tabs
    document.querySelectorAll('.type-tab').forEach(tb => tb.classList.remove('active'));
    // Add active class to clicked tab
    this.classList.add('active');

    selectedType = this.getAttribute('data-type');
    filterData();
  });
});

function filterData() {
  let filteredData = [];

  if (selectedType === 'All') {
    filteredData = allData;
  } else {
    filteredData = allData.filter(item => (item.TYPE || '').trim().toLowerCase() === selectedType.toLowerCase());
  }

  // Destroy existing DataTable
  if ($.fn.DataTable.isDataTable('#data-table')) {
    $('#data-table').DataTable().destroy();
  }

  // Recreate table with filtered data
  createTable(filteredData);
  initializeDataTable();
}
