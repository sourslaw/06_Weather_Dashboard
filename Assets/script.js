const apiKey = config.API_KEY;

// form 
const searchForm = document.getElementById('searchField');
let searchInput = document.getElementById('searchText');
// li
const mainF = document.getElementById('mainForecast');

const secondF = document.getElementById('secondaryForecast');

// P all (https://gomakethings.com/waiting-for-multiple-all-api-responses-to-complete-with-the-vanilla-js-promise.all-method/)
function getApi(requestUrl, requestUrlDos) {
	Promise.all([
		fetch(requestUrl),
		fetch(requestUrlDos)
	]).then(function (responses) {
			// console.log(responses);
			return Promise.all(responses.map(function (response) {
				return response.json();
				console.log(response);
			}));
		}).then(function (data) {
			console.log(data);

			console.log(`temperature: ${data[1].main.temp}`)
			console.log(`temperature (feels like): ${data[1].main.feels_like}`)
			console.log(`humidity: ${data[1].main.humidity}`)

			console.log(`weather id: ${data[1].weather[0].id}`)
			console.log(`weather main: ${data[1].weather[0].main}`)
			console.log(`weather description: ${data[1].weather[0].description}`)
			console.log(`weather icon: ${data[1].weather[0].icon}`)

			// five day, three hour forcast map
			// console.log(data[0].list[1].main);
			// console.log(`weather city: ${data[0].city.name}`);

			// console.log(`date: ${data[0].list[0].dt_txt}`);

			// console.log(`temp: ${data[0].list[0].main.temp}`);
			// console.log(`feels like: ${data[0].list[0].main.feels_like}`);
			// console.log(`humidity: ${data[0].list[0].main.humidity}`);

			// console.log(`wind speed: ${data[0].list[0].wind.speed}`);

			// console.log(`weather id: ${data[0].list[0].weather[0].id}`);
			// console.log(`weather main: ${data[0].list[0].weather[0].main}`);
			// console.log(`weather description: ${data[0].list[0].weather[0].description}`);
			// console.log(`weather icon: ${data[0].list[0].weather[0].icon}`);

			mainCard(data);
			forecastCards(data);
		});
};
// form
function handleForm(event) {
	event.preventDefault();
	console.log(`form submitted, search value: ${searchInput.value}`);
	// const requestUrl = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
	const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&units=imperial&appid=${apiKey}`;

	const requestUrlDos = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=imperial&appid=${apiKey}`;

	getApi(requestUrl, requestUrlDos);
};

searchForm.addEventListener('submit', handleForm);

function forecastCards(data) {
	
	for (i = 0; i < (data[0].list).length; i +=8) {

		const cardContainer = document.createElement('div');
		cardContainer.className = 'card';
		cardContainer.setAttribute('style', 'width: 15rem;');

		
		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		const hFiver = document.createElement('h5');

		const locDate = (`${data[0].list[i].dt_txt}`);
		hFiver.innerText = locDate.slice(0,10);

		const hSix = document.createElement('h6');
		hSix.innerText = `${data[0].list[0].weather[0].icon}`;
		const p = document.createElement('p');
		p.innerText = Math.round(`${data[0].list[i].main.temp}`) + 'F';
		cardBody.append(hFiver)
		cardBody.append(hSix)
		cardBody.append(p)
	
		cardContainer.append(cardBody)
	
		secondF.append(cardContainer);
	}
};

function todayIs() {
	const d = new Date();
	const weekday = ['sun', 'mon', 'tues', 'weds', 'thurs', 'fri', 'sat'];
	let today = weekday[d.getDay()];
	console.log(today)
	return today;
}

function mainCard(data) {
	
	const cardContainer = document.createElement('div');
	cardContainer.className = 'card';
	cardContainer.setAttribute('style', 'width: 15rem;');

	
	const cardBody = document.createElement('div');
	cardBody.className = 'card-body';
	const hFiver = document.createElement('h5');

	// const locDate = (`${data[0].list[i].dt_txt}`);
	// hFiver.innerText = locDate.slice(0,10);
	hFiver.innerText = (todayIs());

	const hSix = document.createElement('h6');
	hSix.setAttribute('id', 'icon');
	hSix.innerText = `${data[1].weather[0].icon}`;
	const hSixTwo = document.createElement('h6');
	hSixTwo.setAttribute('id', 'temperatureToday');
	hSixTwo.innerText = 'temperature: ' + `${data[1].main.temp}`

	const pOne = document.createElement('p');
	pOne.setAttribute('id', 'feelsLike');
	pOne.innerText = 'feels like: ' + Math.round(`${data[1].main.feels_like}`) + 'F';
	cardBody.append(hFiver)
	cardBody.append(hSix)
	cardBody.append(hSixTwo)
	cardBody.append(pOne)
	const pTwo= document.createElement('p');
	pTwo.setAttribute('id', 'humidity');
	pTwo.innerText = 'humidity: ' + `${data[1].main.humidity}` + '%';
	cardBody.append(pTwo)

	cardContainer.append(cardBody)

	mainForecast.append(cardContainer);
};

const icons = {
	01d: 'Assets/Images/01d.svg',
	02d: 'Assets/Images/02d.svg',
	03d: 'Assets/Images/03d.svg',
	04d: 'Assets/Images/04d.svg',
	09d: 'Assets/Images/09d.svg',
	10d: 'Assets/Images/10d.svg',
	11d: 'Assets/Images/11d.svg',
	13d: 'Assets/Images/13d.svg',
	50d: 'Assets/Images/50d.svg'
}