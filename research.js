let allData = [];

// Fetch data from the JSON file
document.addEventListener('DOMContentLoaded', function() {
  fetch('research.json') // Fetch from 'research.json'
    .then(response => response.json())
    .then(data => {
      allData = data.map(item => ({
        NAME: item.NAME || '',
        TYPE: item.TYPE || '',
        PRICE: item.PRICE || 'N/A', // Default to 'N/A' if PRICE is empty
        LINK: item["Link?"] || '', // Map the link
      }));

      createTable(allData); // Display all data initially
      initializeDataTable();
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});

// Function to extract the domain from a URL
function extractDomain(url) {
  let domain;

  // Remove protocol (http, https)
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }

  // Remove www if it exists
  domain = domain.replace('www.', '');

  return domain;
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
  table.id = 'research-table'; // Updated ID to research-table

  // Define headers
  const headers = ['#', 'NAME', 'TYPE', 'PRICE', 'LINK'];

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
      } else if (header === 'LINK') {
        if (item.LINK) {
          const domain = extractDomain(item.LINK);
          const link = document.createElement('a');
          link.href = item.LINK;
          link.textContent = domain; // Show the shortened link (domain only)
          link.target = '_blank'; // Open link in a new tab
          cell.appendChild(link);
        } else {
          cell.textContent = '-'; // If no link is available
        }
      } else {
        cell.textContent = item[header]; // Add other values
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
  $('#research-table').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    info: false,
    autoWidth: false,
    pageLength: 25,
    lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]],
    columnDefs: [{ targets: [4], orderable: false }],
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Search..."
    }
  });
}
