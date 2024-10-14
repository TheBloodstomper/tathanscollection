let allData = [];
let selectedType = 'All'; // Default type filter

// Fetch data from the JSON file
document.addEventListener('DOMContentLoaded', function() {
  fetch('shop.json') // Fetch from 'shop.json'
    .then(response => response.json())
    .then(data => {
      allData = data.map(item => ({
        NAME: item.NAME || '',
        TYPE: item.TYPE || '', // Ensure TYPE is mapped correctly
        LINKS: generateLinks(item), // Combine all links into one column
      }));

      createTable(allData); // Display all data initially
      initializeDataTable();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// Function to generate the Links column content
function generateLinks(item) {
  const links = [];

  if (item.EBAY) links.push(`<a href="${item.EBAY}" target="_blank">EBAY</a>`);
  if (item.VINTED) links.push(`<a href="${item.VINTED}" target="_blank">VINTED</a>`);
  if (item.FACEBOOK) links.push(`<a href="${item.FACEBOOK}" target="_blank">FACEBOOK</a>`);
  if (item['2DEHANDS']) links.push(`<a href="${item['2DEHANDS']}" target="_blank">2DEHANDS</a>`);
  if (item.WALLAPOP) links.push(`<a href="${item.WALLAPOP}" target="_blank">WALLAPOP</a>`);

  return links.join(' | '); // Join the links with a separator (e.g., " | ")
}

// Function to create the table for items
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
  table.id = 'shop-data-table'; // Updated ID to shop-data-table

  // Define headers
  const headers = ['#', 'NAME', 'TYPE', 'LINKS'];

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
      } else if (header === 'NAME') {
        cell.textContent = item[header]; // Add name text
      } else if (header === 'TYPE') {
        cell.textContent = item.TYPE; // Show type field
      } else if (header === 'LINKS') {
        cell.innerHTML = item.LINKS; // Show combined links in one cell
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
  $('#shop-data-table').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    info: false,
    autoWidth: false,
    pageLength: 25,
    lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]],
    columnDefs: [{ targets: [3], orderable: false }],
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
  if ($.fn.DataTable.isDataTable('#shop-data-table')) {
    $('#shop-data-table').DataTable().destroy();
  }

  // Recreate table with filtered data
  createTable(filteredData);
  initializeDataTable();
}
