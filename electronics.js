let allData = [];

// Fetch data from the JSON file
document.addEventListener('DOMContentLoaded', function() {
  fetch('electronics.json')
    .then(response => response.json())
    .then(data => {
      allData = data.map(item => ({
        '#': '', // We will fill this in the table
        'NAME': item.NAME || '',
        'TYPE': item.TYPE || '',
        '+': item['+'] || '',
        'SOURCE': item.SOURCE || '',
        'NOTE': item.NOTE || '',
      }));

      createTable(allData); // Display all data initially
      initializeDataTable();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// Function to create the table
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
  table.id = 'electronics-data-table';

  // Define headers
  const headers = ['#', 'NAME', 'TYPE', '+', 'SOURCE', 'NOTE'];

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
        cell.textContent = item[header];
      }

      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  dataList.appendChild(table);
}

// Function to initialize DataTable
function initializeDataTable() {
  $('#electronics-data-table').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    info: false,
    autoWidth: false,
    pageLength: 25,
    lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]],
    columnDefs: [],
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Search..."
    }
  });
}
