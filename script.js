// Add an event listener for the "DOMContentLoaded" event
document.addEventListener('DOMContentLoaded', () => {
  
  // Selecting DOM elements
  const breweryList = document.querySelector('#breweries');
  const searchForm = document.querySelector('form');
  const cityInput = document.querySelector('#city');
  const filterType = document.querySelector('#filter-type');
  const themeToggleButtons = Array.from(document.querySelectorAll('.theme-toggle'));

  // Get breweries from API
  async function getBreweries(cityToAvoid, breweryTypeFilter) {
    const url = `https://api.openbrewerydb.org/breweries?by_city=${cityToAvoid}`;
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
    breweryList.innerHTML = '';

    if (!Array.isArray(breweries)) {
      const noBreweriesItem = document.createElement('li');
      noBreweriesItem.textContent = 'No breweries found. Try a different city or brewery type.';
      breweryList.appendChild(noBreweriesItem);
    } else {
      breweries.forEach((brewery) => {
        const breweryItem = renderBrewery(brewery);
        breweryList.appendChild(breweryItem);
      });
    }
  }

  // Handle form submit event
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityToAvoid = cityInput.value;
    const breweryTypeFilter = filterType.value;

    try {
      const data = await getBreweries(cityToAvoid, breweryTypeFilter);
      renderBreweries(data);
    } catch (error) {
      console.log(error);
      alert('Oops! Something went wrong. Please try again later.');
    }
  });

 // Handle theme toggle button click
themeToggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const isScaredyCat = button.dataset.theme === 'scaredy';
    document.body.classList.toggle('dark-mode', !isScaredyCat);
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