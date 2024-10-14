$(document).ready(function() {
    // Fetch data from arcade.json
    fetch('arcade.json')
      .then(response => response.json())
      .then(data => {
        // Only display items if the data is not empty
        if (data && data.length > 0) {
          displayArcadeItems(data);
        }
      })
      .catch(error => {
        console.error('Error fetching arcade data:', error);
      });
  });
  
  // Function to display arcade items
  function displayArcadeItems(items) {
    const arcadeList = $('#arcade-list');
    
    items.forEach(item => {
      const arcadeItem = $(`
        <div class="col-md-4 arcade-item">
          <div class="card h-100">
            <img src="${item.Image}" class="card-img-top" alt="${item.NAME}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.NAME}</h5>
              <p class="card-text">${item.EXTRA}</p>
              <p class="card-text">${item.SOURCE}</p>
              <p class="card-text">${item.PRIX}</p>
            </div>
          </div>
        </div>
      `);
      arcadeList.append(arcadeItem);
    });
  }
  