// JavaScript to enhance responsiveness and clean up functionality

// Global variables
let allData = [];
let selectedManufacturer = 'All';
let selectedPlatform = 'All';

// Manufacturer to Platform mapping
const manufacturerPlatforms = {
  'NINTENDO': ['NES', 'SNES', 'N64', 'GC', 'Wii', 'WiiU', 'Switch', 'GAMEBOY', 'GAMEBOY COLOR', 'GAMEBOY ADVANCE', 'DS', '3DS'],
  'MICROSOFT': ['XBOX', 'XBOX 360', 'XONE', 'XBOX S'],
  'PLAYSTATION': ['PSX', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PS Vita'],
  'SEGA': ['MASTER SYSTEM', 'MEGA DRIVE', 'MEGA-CD','SATURN', 'DC'],
  'SNK': ['NEO・GEO AES', 'NEO・GEO MVS', 'NEO・GEO CD'],
  'OTHER': ['MSX', 'PC ENGINE', 'PC']
};

// Flatten the platforms for easy lookup
const allPlatforms = [].concat(...Object.values(manufacturerPlatforms));

// Fetch data from the JSON file
document.addEventListener('DOMContentLoaded', function() {
  fetch('games.json')
    .then(response => response.json())
    .then(data => {
      allData = data.map(item => {
        let category = (item['CONSOLE'] || '').trim();
        let manufacturer = '';
        let platform = '';

        if (allPlatforms.map(p => p.toLowerCase()).includes(category.toLowerCase())) {
          // It's a videogame platform
          for (const [manu, platforms] of Object.entries(manufacturerPlatforms)) {
            if (platforms.map(p => p.toLowerCase()).includes(category.toLowerCase())) {
              manufacturer = manu;
              platform = category;
              break;
            }
          }
        }

        return {
          ...item,
          MANUFACTURER: manufacturer,
          PLATFORM: platform
        };
      });

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
  table.id = 'data-table';

  // Define headers, adding '#' as the first column
  const headers = ['#', 'NAME', 'REGION', 'CONSOLE', 'BOX', 'MAN', 'TEST', 'END', '/10', 'PRICE', 'SOURCE', 'NOTES'];

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
        // Add dynamic count
        cell.textContent = index + 1;
      } else if (['BOX', 'MAN', 'TEST', 'END'].includes(header)) {
        cell.classList.add('icon-cell');
        if ((item[header] || '').toLowerCase() === 'x') {
          cell.style.backgroundColor = '#d6eaf8'; // Soft pastel blue for yes
        } else {
          cell.style.backgroundColor = '#f5eef8'; // Very light pastel grey-pink for no
        }
      } else if (header === '/10') {
        cell.classList.add('icon-cell');
        const condition = parseInt(item[header]);
        if (isNaN(condition)) {
          cell.textContent = '-';
        } else {
          cell.textContent = condition;
          if (condition <= 3) {
            cell.style.backgroundColor = '#f5eef8'; // Soft pastel lavender for low condition
          } else if (condition <= 5) {
            cell.style.backgroundColor = '#fdebd3'; // Soft pastel peach for medium-low condition
          } else if (condition <= 7) {
            cell.style.backgroundColor = '#d6eaf8'; // Soft pastel blue for medium-high condition
          } else {
            cell.style.backgroundColor = '#d5f5e3'; // Light mint green for high condition
          }
        }
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

// Function to initialize DataTable
function initializeDataTable() {
  $('#data-table').DataTable({
    paging: true,
    searching: true,
    ordering: true,
    info: false,
    autoWidth: false,
    pageLength: 25, // Default number of rows per page
    lengthMenu: [[25, 50, 100, 200], [25, 50, 100, 200]], // Options for "Show entries"
    columnDefs: [
      { targets: [4, 5, 6, 7, 8, 9, 10, 11], orderable: false }, // Adjust indices based on your columns
    ],
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Search..."
    }
  });
}

// Event listener for manufacturer tabs
document.querySelectorAll('.manufacturer-tab').forEach(tab => {
  tab.addEventListener('click', function(e) {
    e.preventDefault();
    // Remove active class from all tabs
    document.querySelectorAll('.manufacturer-tab').forEach(tb => tb.classList.remove('active'));
    // Add active class to clicked tab
    this.classList.add('active');

    selectedManufacturer = this.getAttribute('data-manufacturer');
    selectedPlatform = 'All';

    // Hide platform tabs initially
    const platformTabs = document.getElementById('platform-tabs');
    platformTabs.classList.add('d-none');
    platformTabs.innerHTML = ''; // Clear previous platforms

    if (selectedManufacturer !== 'All') {
      // Show platform tabs
      platformTabs.classList.remove('d-none');

      // Create 'All' platform tab
      const allPlatTab = document.createElement('li');
      allPlatTab.className = 'nav-item';
      allPlatTab.innerHTML = '<a class="nav-link active platform-tab" href="#" data-platform="All">All</a>';
      platformTabs.appendChild(allPlatTab);

      // Create platform tabs
      manufacturerPlatforms[selectedManufacturer].forEach(platform => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link platform-tab" href="#" data-platform="${platform}">${platform}</a>`;
        platformTabs.appendChild(li);
      });

      // Add event listeners to platform tabs
      document.querySelectorAll('.platform-tab').forEach(platTab => {
        platTab.addEventListener('click', function(e) {
          e.preventDefault();
          // Remove active class from all platform tabs
          document.querySelectorAll('.platform-tab').forEach(pt => pt.classList.remove('active'));
          // Add active class to clicked platform tab
          this.classList.add('active');

          selectedPlatform = this.getAttribute('data-platform');

          filterData();
        });
      });
    }

    filterData();
  });
});

function filterData() {
  let filteredData = [];

  if (selectedManufacturer === 'All') {
    filteredData = allData;
  } else {
    filteredData = allData.filter(item => (item['MANUFACTURER'] || '').trim().toLowerCase() === selectedManufacturer.toLowerCase());
  }

  if (selectedPlatform !== 'All') {
    filteredData = filteredData.filter(item => (item['PLATFORM'] || '').trim().toLowerCase() === selectedPlatform.toLowerCase());
  }

  // Destroy existing DataTable
  if ($.fn.DataTable.isDataTable('#data-table')) {
    $('#data-table').DataTable().destroy();
  }

  // Recreate table with filtered data
  createTable(filteredData);
  initializeDataTable();
}

document.addEventListener('DOMContentLoaded', () => {
  // Set "All" tab as the active tab initially without triggering click events
  const allTab = document.querySelector('.manufacturer-tab[data-manufacturer="All"]');
  if (allTab) {
    allTab.classList.add('active');
    filterData(); // Manually filter data to display all initially
  }
});