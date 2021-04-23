const apiKey = 'db044841b99b5dea3d2c6a13780e9746';

const searchForm = document.getElementById('searchField');
let searchInput = document.getElementById('searchText');



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



		});
};

function handleForm(event) {
	event.preventDefault();
	console.log(`form submitted, search value: ${searchInput.value}`);
	// const requestUrl = `api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}`
	const requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&units=imperial&appid=${apiKey}`;

	getApi(requestUrl);
};

searchForm.addEventListener('submit', handleForm);