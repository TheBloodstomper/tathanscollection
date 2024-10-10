// Global variables
let allData = [];
let selectedCategory = 'All';
let selectedManufacturer = 'All';
let selectedPlatform = 'All';
let selectedSubcategory = 'All';

// Manufacturer to Platform mapping
const manufacturerPlatforms = {
  'NINTENDO': ['NES', 'SNES', 'N64', 'GC', 'Wii', 'WiiU', 'Switch', 'GAMEBOY', 'GAMEBOY COLOR', 'GAMEBOY ADVANCE', 'DS', '3DS'],
  'MICROSOFT': ['XBOX', 'XBOX 360', 'XBOX ONE', 'XBOX S'],
  'PLAYSTATION': ['PSX', 'PS2', 'PS3', 'PS4', 'PS5', 'PSP', 'PS Vita'],
  'SEGA': ['MASTER SYSTEM', 'MEGA DRIVE', 'SATURN', 'DREAMCAST'],
  'SNK': ['NEO GEO AES', 'NEO GEO MVS', 'NEO GEO CD'],
  'OTHERS': ['MSX', 'PC ENGINE', 'PC']
};

// Subcategories for Books and Others
const booksSubcategories = ['Magazines', 'Artbooks', 'Manga', 'Comics'];
const othersSubcategories = ['Electronics', 'Figures'];

// Flatten the platforms for easy lookup
const allPlatforms = [].concat(...Object.values(manufacturerPlatforms));

// Fetch data from the JSON file
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    allData = data.map(item => {
      let category = (item['CATEGORY'] || '').trim();
      let mainCategory = '';
      let subcategory = '';
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
        mainCategory = 'Videogames';
      } else if (booksSubcategories.map(sc => sc.toLowerCase()).includes(category.toLowerCase())) {
        // It's a Books subcategory
        mainCategory = 'Books';
        subcategory = category;
      } else if (othersSubcategories.map(sc => sc.toLowerCase()).includes(category.toLowerCase())) {
        // It's an Others subcategory
        mainCategory = 'Others';
        subcategory = category;
      } else {
        // Category is main category (Books, Others, etc.)
        mainCategory = category;
      }

      return {
        ...item,
        MAIN_CATEGORY: mainCategory,
        SUBCATEGORY: subcategory,
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
  const headers = ['#', ...Object.keys(data[0]).filter(header => !['#', 'MAIN_CATEGORY', 'SUBCATEGORY', 'MANUFACTURER', 'PLATFORM'].includes(header))];

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
      } else if (['BOX', 'MANUAL', 'TESTED', 'FINISHED'].includes(header)) {
        cell.classList.add('icon-cell');
        const icon = document.createElement('i');
        if (item[header] && item[header].toLowerCase() === 'x') {
          icon.className = 'fas fa-check icon-true';
          icon.setAttribute('title', 'Yes');
        } else {
          icon.className = 'fas fa-times icon-false';
          icon.setAttribute('title', 'No');
        }
        cell.appendChild(icon);
      } else if (header === 'CONDITION') {
        cell.classList.add('icon-cell');
        const condition = parseInt(item[header]) || 0;
        for (let i = 0; i < 10; i++) {
          const star = document.createElement('i');
          star.className = i < condition ? 'fas fa-star icon-true' : 'far fa-star icon-false';
          cell.appendChild(star);
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
        { targets: [5,6,7,8], orderable: false }, // Adjust indices based on your columns
      ],
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Search..."
      }
    });
  }

// Event listener for category tabs
document.querySelectorAll('.category-tab').forEach(tab => {
  tab.addEventListener('click', function(e) {
    e.preventDefault();
    // Remove active class from all tabs
    document.querySelectorAll('.category-tab').forEach(tb => tb.classList.remove('active'));
    // Add active class to clicked tab
    this.classList.add('active');

    selectedCategory = this.getAttribute('data-category');
    selectedManufacturer = 'All';
    selectedPlatform = 'All';
    selectedSubcategory = 'All';

    // Hide all subcategory tabs initially
    const manufacturerTabs = document.getElementById('manufacturer-tabs');
    manufacturerTabs.classList.add('d-none');
    manufacturerTabs.innerHTML = ''; // Clear previous manufacturers

    const platformTabs = document.getElementById('platform-tabs');
    platformTabs.classList.add('d-none');
    platformTabs.innerHTML = ''; // Clear previous platforms

    const subcategoryTabs = document.getElementById('subcategory-tabs');
    subcategoryTabs.classList.add('d-none');
    subcategoryTabs.innerHTML = ''; // Clear previous subcategories

    if (selectedCategory === 'Videogames') {
      // Show manufacturer tabs
      manufacturerTabs.classList.remove('d-none');

      // Create 'All' manufacturer tab
      const allManuTab = document.createElement('li');
      allManuTab.className = 'nav-item';
      allManuTab.innerHTML = '<a class="nav-link active manufacturer-tab" href="#" data-manufacturer="All">All</a>';
      manufacturerTabs.appendChild(allManuTab);

      // Create manufacturer tabs
      Object.keys(manufacturerPlatforms).forEach(manufacturer => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link manufacturer-tab" href="#" data-manufacturer="${manufacturer}">${manufacturer}</a>`;
        manufacturerTabs.appendChild(li);
      });

      // Add event listeners to manufacturer tabs
      document.querySelectorAll('.manufacturer-tab').forEach(manTab => {
        manTab.addEventListener('click', function(e) {
          e.preventDefault();
          // Remove active class from all manufacturer tabs
          document.querySelectorAll('.manufacturer-tab').forEach(mt => mt.classList.remove('active'));
          // Add active class to clicked manufacturer tab
          this.classList.add('active');

          selectedManufacturer = this.getAttribute('data-manufacturer');
          selectedPlatform = 'All';

          // Hide platform tabs initially
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
    } else if (selectedCategory === 'Books' || selectedCategory === 'Others') {
      // Show subcategory tabs for Books and Others
      subcategoryTabs.classList.remove('d-none');

      // Create 'All' subcategory tab
      const allSubTab = document.createElement('li');
      allSubTab.className = 'nav-item';
      allSubTab.innerHTML = '<a class="nav-link active subcategory-tab" href="#" data-subcategory="All">All</a>';
      subcategoryTabs.appendChild(allSubTab);

      // Get the subcategories based on the selected category
      const subcategories = selectedCategory === 'Books' ? booksSubcategories : othersSubcategories;

      // Create subcategory tabs
      subcategories.forEach(subcat => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<a class="nav-link subcategory-tab" href="#" data-subcategory="${subcat}">${subcat}</a>`;
        subcategoryTabs.appendChild(li);
      });

      // Add event listeners to subcategory tabs
      document.querySelectorAll('.subcategory-tab').forEach(subTab => {
        subTab.addEventListener('click', function(e) {
          e.preventDefault();
          // Remove active class from all subcategory tabs
          document.querySelectorAll('.subcategory-tab').forEach(st => st.classList.remove('active'));
          // Add active class to clicked subcategory tab
          this.classList.add('active');

          selectedSubcategory = this.getAttribute('data-subcategory');

          filterData();
        });
      });
    }

    filterData();
  });
});

function filterData() {
  let filteredData = [];

  if (selectedCategory === 'All') {
    filteredData = allData;
  } else {
    filteredData = allData.filter(item => (item['MAIN_CATEGORY'] || '').trim().toLowerCase() === selectedCategory.toLowerCase());
  }

  if (selectedCategory === 'Videogames') {
    if (selectedManufacturer !== 'All') {
      filteredData = filteredData.filter(item => (item['MANUFACTURER'] || '').trim().toLowerCase() === selectedManufacturer.toLowerCase());
    }
    if (selectedManufacturer !== 'All' && selectedPlatform !== 'All') {
      filteredData = filteredData.filter(item => (item['PLATFORM'] || '').trim().toLowerCase() === selectedPlatform.toLowerCase());
    }
  } else if ((selectedCategory === 'Books' || selectedCategory === 'Others') && selectedSubcategory !== 'All') {
    filteredData = filteredData.filter(item => (item['SUBCATEGORY'] || '').trim().toLowerCase() === selectedSubcategory.toLowerCase());
  }

  // Destroy existing DataTable
  if ($.fn.DataTable.isDataTable('#data-table')) {
    $('#data-table').DataTable().destroy();
  }

  // Recreate table with filtered data
  createTable(filteredData);
  initializeDataTable();
}
