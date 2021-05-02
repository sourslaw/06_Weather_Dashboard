// keys
const apiKey = 'db044841b99b5dea3d2c6a13780e9746'; //config.API_KEY
// const psApiKey =  'd4d12e0db92bd7554789a217e8cda89b'; //config.PS_API_KEY

// form 
const searchForm = document.getElementById('searchField');
let searchInput = document.getElementById('searchText');
const dropDown = document.getElementById('previousSearches');
const selection = document.getElementById('searchSelection');
// mainForecast card
const mainF = document.getElementById('mainForecast');
// five day forecast LIs
const secondF = document.getElementById('secondaryForecast');

// get Apis, making four calls
function getApi(requestUrl, requestUrlDos, requestUrlTres) {
	Promise.all([
		fetch(requestUrl),
		fetch(requestUrlDos),
		fetch(requestUrlTres)
	]).then(function (responses) {
			return Promise.all(responses.map(function (response) {
				return response.json();
			}));
		}).then(function (data) {
			// console.log(data)
			const lat = `${data[2].results[0].geometry.lat}`;
			const long = `${data[2].results[0].geometry.lng}`;

			mainCard(data);
			forecastCards(data);

			return fetch (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`);
		
		}).then(function(response) {
			return response.json();

		}).then(function(newData) {
			console.log(`uv index: ${newData.current.uvi}`)

			addMain(newData);
		}).catch(function (error) {

			console.log(`oh oh, ${error}`);

			displayTryAgain();
		});
};

// form
function handleForm(event) {
	event.preventDefault();
	console.log(`form submitted, search value: ${searchInput.value}`);

	const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&units=imperial&appid=${apiKey}`;
	const requestUrlDos = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=imperial&appid=${apiKey}`;
	// const requestUrlTres = `http://api.positionstack.com/v1/forward?access_key=${psApiKey}&country=us&query=${searchInput.value}`;

	// opencage. tempt since positionstatck is down (2021-04-29), 2/3
	const requestUrlTres = `https://api.opencagedata.com/geocode/v1/json?q=${searchInput.value}&key=eef111c608734d9790eb662afb2657c8`;
	
	getApi(requestUrl, requestUrlDos, requestUrlTres);

	// save recent search to drop down menu
	const pastSearch = document.createElement('option');
	pastSearch.setAttribute('value', `${searchInput.value}`);
	pastSearch.innerText = `${searchInput.value}`;

	selection.append(pastSearch);

	// save last search to localStorage
	localStorage.setItem('main', JSON.stringify(`${searchInput.value}`));

	clear();

	searchInput.value = "";
};

// dropdown form handler (maybe refactor and combine with main form via shared input.value)
function handleOtherForm(event) {
	event.preventDefault();

	console.log(`OTHER form submitted, search value: ${searchInput.value}`);

	const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selection.value}&units=imperial&appid=${apiKey}`;
	const requestUrlDos = `https://api.openweathermap.org/data/2.5/weather?q=${selection.value}&units=imperial&appid=${apiKey}`
	// const requestUrlTres = `http://api.positionstack.com/v1/forward?access_key=${psApiKey}&country=us&query=${selection.value}`;

	// opencage. tempt since positionstatck is down (2021-04-29), 3/3
	const requestUrlTres = `https://api.opencagedata.com/geocode/v1/json?q=${selection.value}&key=eef111c608734d9790eb662afb2657c8`;
	
	getApi(requestUrl, requestUrlDos, requestUrlTres);

	clear();
};

// removes child nodes upon new search
function clear() {
	const byeMain = document.getElementById('mainForecast');

	while (byeMain.firstChild) {
		byeMain.removeChild(byeMain.firstChild);
	};

	const byeForecast = document.getElementById('secondaryForecast');

	while (byeForecast.firstChild) {
		byeForecast.removeChild(byeForecast.firstChild);
	};
};

// search field
searchForm.addEventListener('submit', handleForm);
// dropdown
selection.addEventListener('change', handleOtherForm);
// faker mainCard (needs to be a global for now . . . refactor at later date)
const pFour = document.createElement('p');

function addMain(newData){

	pFour.innerText = `uv index: ${newData.current.uvi}`;
	if ( parseInt(`${newData.current.uvi}`) <= 2 ) {
		pFour.setAttribute('id', 'uv12')
	} else if ( parseInt(`${newData.current.uvi}`) >= 3  &&  parseInt(`${newData.current.uvi}`) <= 5 ) {
		pFour.setAttribute('id', 'uv35')
	} else if ( parseInt(`${newData.current.uvi}`) >= 6 && parseInt(`${newData.current.uvi}`) <= 7 ) {
		pFour.setAttribute('id', 'uv67') 
	} else if ( parseInt(`${newData.current.uvi}`) >= 8 && parseInt(`${newData.current.uvi}`) <= 10 ) {
		pFour.setAttribute('id', 'uv810')
	} else {
		pFour.setAttribute('id', 'uv11')
	};

}; 

// five day forecast function
function forecastCards(data) {
	
	for (i = 0; i < (data[0].list).length; i +=8) {

		const cardContainer = document.createElement('div');
		cardContainer.className = 'card text-center';
		cardContainer.setAttribute('style', 'width: 18.5%;');
		
		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		const hFiver = document.createElement('h5');

		const locDate = (`${data[0].list[i].dt_txt}`);
		hFiver.innerText = locDate.slice(0,10);

		const hSix = document.createElement('img');
		hSix.setAttribute('src', icons[`${data[1].weather[0].icon}`]);
		const pOne = document.createElement('p');
		pOne.innerText = 'TEM: ' + Math.round(`${data[0].list[i].main.temp}`) + 'F';
		const pTwo = document.createElement('p');
		pTwo.innerText = `Hm: ${data[0].list[0].main.humidity}` + '%';
		cardBody.append(hFiver)
		cardBody.append(hSix)
		cardBody.append(pOne)
		cardBody.append(pTwo)
	
		cardContainer.append(cardBody)
	
		secondF.append(cardContainer);
	}
};

// day function for mainforecast
function todayIs() {
	const d = new Date();
	const weekday = ['sun', 'mon', 'tues', 'weds', 'thurs', 'fri', 'sat'];
	let today = weekday[d.getDay()];
	// console.log(today)
	return today;
};

// main (today) forecast function
function mainCard(data) {
	
	const cardContainer = document.createElement('div');
	cardContainer.className = 'card';
	// cardContainer.setAttribute('style', 'width: 35%;');
	cardContainer.setAttribute('id', 'mainForeCard');
	
	const cardBody = document.createElement('div');
	cardBody.className = 'card-body';
	const hFourer = document.createElement('h4');
	hFourer.innerText = `${data[0].city.name}`.toLowerCase();
	const hFiver = document.createElement('h5');
	hFiver.innerText = ('today, ' + todayIs());

	// weather icons (https://openweathermap.org/weather-conditions)
	const hSix = document.createElement('img');
	hSix.setAttribute('src', icons[`${data[1].weather[0].icon}`]);

	const hSixTwo = document.createElement('h6');
	hSixTwo.setAttribute('id', 'temperatureToday');
	hSixTwo.innerText = 'temperature: ' + `${data[1].main.temp}`

	const pOne = document.createElement('p');
	pOne.setAttribute('id', 'feelsLike');
	pOne.innerText = 'feels like: ' + Math.round(`${data[1].main.feels_like}`) + 'F';
	cardBody.append(hFourer)
	cardBody.append(hFiver)
	cardBody.append(hSix)
	cardBody.append(hSixTwo)
	cardBody.append(pOne)
	const pTwo = document.createElement('p');
	pTwo.setAttribute('id', 'humidity');
	pTwo.innerText = 'humidity: ' + `${data[1].main.humidity}` + '%';
	cardBody.append(pTwo)
	const pThree = document.createElement('p');
	pThree.setAttribute('id', 'windSpeed');
	pThree.innerText = 'windspeed: ' + `${data[1].wind.speed}` + 'mph';
	cardBody.append(pThree)
	// pFour gets appened here, creation happens as global 
	cardBody.append(pFour);

	cardContainer.append(cardBody)

	mainForecast.append(cardContainer);
};

// icons array
const icons = {
	'01d': 'Assets/Images/01d.svg',
	'02d': 'Assets/Images/02d.svg',
	'03d': 'Assets/Images/03d.svg',
	'04d': 'Assets/Images/04d.svg',
	'09d': 'Assets/Images/09d.svg',
	'10d': 'Assets/Images/10d.svg',
	'11d': 'Assets/Images/11d.svg',
	'13d': 'Assets/Images/13d.svg',
	'50d': 'Assets/Images/50d.svg',
	'01n': 'Assets/Images/01d.svg',
	'02n': 'Assets/Images/02d.svg',
	'03n': 'Assets/Images/03d.svg',
	'04n': 'Assets/Images/04d.svg',
	'09n': 'Assets/Images/09d.svg',
	'10n': 'Assets/Images/10d.svg',
	'11n': 'Assets/Images/11d.svg',
	'13n': 'Assets/Images/13d.svg',
	'50n': 'Assets/Images/50d.svg'
};

// displays message for error handling 
function displayTryAgain() {
	const pOne = document.createElement('p');
	pOne.innerText = 'please enter a city or try again . . .'

	mainForecast.append(pOne)
};

// when page reloads, getItem from localStorage, handleform 
function onReload() {
	searchInput.value = JSON.parse(localStorage.getItem('main'))
	window.addEventListener('load', handleForm)
};

onReload();