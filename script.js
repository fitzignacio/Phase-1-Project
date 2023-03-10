// Add an event listener for the "DOMContentLoaded" event
document.addEventListener('DOMContentLoaded', () => {
  
  // Selecting DOM elements
  const breweryList = document.querySelector('#breweries');
  const searchForm = document.querySelector('form');
  const cityInput = document.querySelector('#city');
  const filterType = document.querySelector('#filter-type');
  const themeToggleButtons = Array.from(document.querySelectorAll('.theme-toggle'));
  const searchButton = document.querySelector('button[type="submit"]');

  // Get breweries from API
  async function getBreweries(cityToAvoid, breweryTypeFilter) {
    let url = `https://api.openbrewerydb.org/breweries?by_city=${cityToAvoid}`;
    if (breweryTypeFilter !== "false") {
      url += `&by_type=${breweryTypeFilter}`;
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }  

  // Escape HTML characters function
  function escapeHtml(text) {
    if (text == null) {
      return "";
    }
    return text.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
  }

  // Render a single brewery item
  function renderBrewery(brewery) {
    const breweryItem = document.createElement('li');
    breweryItem.innerHTML = `
      <h2>${escapeHtml(brewery.name)}</h2>
      <p><strong>Brewery Type:</strong> ${escapeHtml(brewery.brewery_type)}</p>
      <p><strong>Address:</strong> ${escapeHtml(`${brewery.street}, ${brewery.city}, ${brewery.state} ${brewery.postal_code}`)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(brewery.phone)}</p>
      <p><strong>Website:</strong> <a href="${escapeHtml(brewery.website_url)}">${escapeHtml(brewery.website_url)}</a></p>
    `;
    return breweryItem;
  }

  // Render a list of breweries
  function renderBreweries(breweries) {
    breweryList.innerHTML = ''; // Clears the brewery list

    if (!Array.isArray(breweries)) {
      // If there are no breweries, render a message
      const noBreweriesItem = document.createElement('li');
      noBreweriesItem.textContent = 'No breweries found. Try a different city or brewery type.';
      breweryList.appendChild(noBreweriesItem);
    } else {
      // If there are breweries, render each brewery as a list item
      breweries.forEach((brewery) => {
        const breweryItem = renderBrewery(brewery);
        breweryList.appendChild(breweryItem);
      });
    }
  }

  // Handle form submit event
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the user's input from the form
    const cityToAvoid = cityInput.value;
    const breweryTypeFilter = filterType.value;

    // Call the API to get breweries
    try {
      const data = await getBreweries(cityToAvoid, breweryTypeFilter);
      renderBreweries(data);
    } catch (error) {
      console.log(error);
      alert('Oops! Something went wrong. Please try again later.');
    }
  });

  // Add event listeners to theme toggle buttons
  themeToggleButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const isScaredyCat = button.dataset.theme === 'scaredy';
      
      // Toggle the body class for dark mode
      document.body.classList.toggle('dark-mode', !isScaredyCat);

      // Change the text of the search button based on the current theme
      if (isScaredyCat) {
        searchButton.textContent = 'Search *Eyes Closed*';
      } else {
        searchButton.textContent = 'Search *Eyes Open*';
      }

      // Update the text of the other theme toggle button
      themeToggleButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          otherButton.textContent = isScaredyCat ? 'Brave Beer Dawg' : 'Scaredy Cat';
        } else {
          button.textContent = isScaredyCat ? 'Scaredy Cat' : 'Brave Beer Dawg';
        }
      });
    });
  });
});