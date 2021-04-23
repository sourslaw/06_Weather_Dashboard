const apiKey = config.API_KEY;

// form 
const searchForm = document.getElementById('searchField');
let searchInput = document.getElementById('searchText');
// li
const mainF = document.getElementById('mainForecast');

const secondF = document.getElementById('secondaryForecast');


function getApi(requestUrl) {
	let headers = new Headers();
	fetch(requestUrl)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			console.log(data);

			console.log(data.list[0].main);

			console.log(`weather city: ${data.city.name}`);

			console.log(`date: ${data.list[0].dt_txt}`);

			console.log(`temp: ${data.list[0].main.temp}`);
			console.log(`feels like: ${data.list[0].main.feels_like}`);
			console.log(`humidity: ${data.list[0].main.humidity}`);

			console.log(`wind speed: ${data.list[0].wind.speed}`);

			console.log(`weather id: ${data.list[0].weather[0].id}`);
			console.log(`weather main: ${data.list[0].weather[0].main}`);
			console.log(`weather description: ${data.list[0].weather[0].description}`);
			console.log(`weather icon: ${data.list[0].weather[0].icon}`);

			mainCard(data);
		});
};

// form
function handleForm(event) {
	event.preventDefault();
	console.log(`form submitted, search value: ${searchInput.value}`);
	// const requestUrl = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
	const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&units=imperial&appid=${apiKey}`;

	getApi(requestUrl);
};

searchForm.addEventListener('submit', handleForm);

function mainCard(data) {
	
	for (i = 0; i < (data.list).length; i +=8) {

		const cardContainer = document.createElement('div');
		cardContainer.className = 'card';
		cardContainer.setAttribute('style', 'width: 15rem;');

		
		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		const hFiver = document.createElement('h5');

		const locDate = (`${data.list[i].dt_txt}`);
		hFiver.innerText = locDate.slice(0,10);

		const hSix = document.createElement('h6');
		hSix.innerText = 'icon here'
		const p = document.createElement('p');
		p.innerText = Math.round(`${data.list[i].main.temp}`) + 'F';
		cardBody.append(hFiver)
		cardBody.append(hSix)
		cardBody.append(p)
	
		cardContainer.append(cardBody)
	
		secondF.append(cardContainer);
	}

	// console.log(`IN THE FUNC weather city: ${data.city.name}`);

};