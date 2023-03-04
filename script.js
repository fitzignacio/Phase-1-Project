// Define variables for HTML elements
const breweryList = document.getElementById('breweries');
const searchForm = document.querySelector('form');
const cityInput = document.getElementById('city');
const filterType = document.getElementById('filter-type');
const themeToggles = document.querySelectorAll('.theme-toggle');

// Function to fetch breweries from API
function getBreweries(searchTerm, filterType) {
  let url = `https://api.openbrewerydb.org/breweries/search?query=${searchTerm}`;
  if (filterType !== "false") {
    url += `&type=${filterType}`;
  }

  return fetch(url)
  .then(response => response.json())
  .then(data => data)
  .catch(error => console.log(error));
}

 // Function to render each brewery as a list item
 function renderBrewery(brewery) {
  const breweryItem = document.createElement('li');
  breweryItem.innerHTML = `
  <h2>${brewery.name}</h2>
  <p><strong>Brewery Type:</strong> ${brewery.brewery_type}</p>
  <p><strong>Address:</strong> ${brewery.street}, ${brewery.city}, ${brewery.state} ${brewery.postal_code}</p>
  <p><strong>Phone:</strong> ${brewery.phone}</p>
  <p><strong>Website:</strong> <a href="${brewery.website_url}">${brewery.website_url}</a></p>
`;
return breweryItem;
}

// Function to render breweries to HTML
function renderBreweries(breweries) {
  // Clear previous results
  breweryList.innerHTML = '';

  // Render each brewery as a list item
  breweries.forEach((brewery) => {
    const breweryItem = renderBrewery(brewery);
    breweryList.appendChild(breweryItem);
  });
}

// Event listener for search form submission
searchForm.addEventListener('submit', (event) => {
  // Prevent default form submission behavior
  event.preventDefault();

  // Get city input and brewery type filter from form
  const cityToAvoid = cityInput.value;
  const breweryTypeFilter = filterType.value;

  getBreweries(cityToAvoid, breweryTypeFilter)
  .then(data => renderBreweries(data))
  .catch(error => console.log(error));
});

// Event listener for theme toggle buttons
themeToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    // Toggle the button text and body class
    const isBrave = toggle.dataset.theme === 'brave';
    document.body.classList.toggle('dark-mode', isBrave);
    themeToggles.forEach((button) => {
      button.textContent = isBrave ? 'Scaredy Cat' : 'Brave Beer Dawg';
    });
  });
});
