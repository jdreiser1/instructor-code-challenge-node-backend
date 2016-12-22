document.addEventListener("DOMContentLoaded", function(evt){//Waits for the HTML DOM to be loaded			
	
	//attaches an event listener to the 'form' and 'favorites' elements
	let form = document.getElementById("form")
	let favorites = document.getElementById("favorites")
	form.addEventListener("submit", retrieveMovies)
	favorites.addEventListener("click", displayFavorites);


	function retrieveMovies(evt){  
		evt.preventDefault();
		let movieList = document.getElementById("movieList")
		movieList.innerHTML = ""
		let movieSubmission = evt.target.elements[0].value //Grabs the movie submitted in the input box
		
		//A "GET" request is sent to the omdbapi and recieved again as a response
		Request('GET', `http://www.omdbapi.com/?s=${movieSubmission}&type=movie&r=json`, (response) => {
					//the response is iterated through and used to create HTML elements
					response.Search.forEach(function(movie){  

						//an h4 element is created, and text-content and event listener is added
						let h4 = document.createElement("h4")
						h4.textContent = movie.Title
						h4.addEventListener("click", showDescription)

						//a button element is created, an attribute and event listener is added
						let button = document.createElement("button") 
						button.setAttribute("data-movie", movie.Title)
						button.textContent =  "Add to Favorites"
						button.addEventListener("click", addToFavorites)

						//the button and h4 element is appended to the movie list
						movieList.appendChild(h4)
						movieList.appendChild(button)
					})	

				})											
	}


	function displayFavorites(){
		//The EventListener on the favorites heading is removed
		favorites.removeEventListener("click", displayFavorites)

		//a "GET" request is sent to the backend and recieved as a response
		Request('GET', '/api/favorites', (response) =>

				//the response is iterated through
				response.forEach(function(movie){
					//an h4 element is created, innerHTML and eventListener is which alters display
					let h4 = document.createElement("h4")
					h4.innerHTML = `${movie.name}`
					favorites.addEventListener("click", () => {
						h4.style.display = h4.style.display === "" ? "none" : "";
					})

					//an h4 element is appended to the Favorites element
					favorites.appendChild(h4);
				})
				)
	};


	function addToFavorites(){
		//An EventListener is removed to the addToFavorites button
		this.removeEventListener("click", addToFavorites)
		//A "POST" request is sent to the backend with the JSON data as an object
		Request('POST', '/api/favorites', (response) => {
		}, JSON.stringify({"name": this.getAttribute("data-movie")}))
		displayFavorites();

	};

	function showDescription(){ 
		//The event listener on the movie that was clicked on is removed
		let self = this
		self.removeEventListener("click", showDescription)

		//A "GET" request is sent to the omdbapi and recieved as a response
		Request('GET', `http://www.omdbapi.com/?t=${self.textContent}&plot=full&r=json`, (response) => {

				//a p element is created, innerHTML and eventListener is added which alters display 
				let p = document.createElement("p")
				p.innerHTML = `<img src="${response.Poster}"><h4>Released:</h4>${response.Released}<h4>Runtime:</h4>${response.Runtime}<h4>Genre</h4>${response.Genre}<h4>Director(s):</h4>${response.Director}<h4>Actors:</h4>${response.Actors}<h4>Plot:</h4>${response.Plot}`
				self.addEventListener("click", () => {
					p.style.display = p.style.display === "" ? "none" : "";
				})
				//the p element is added after the movieELement that is selected
				self.parentNode.insertBefore(p, self.nextSibling);
			})
	}


	function Request(type, url, callback, data = null){
		//Sends an XMLHttpRequest with data to the url and type 
		let xhr = new XMLHttpRequest();
		xhr.open(type, url);
		//Sends data, if available to the backend
		if (type === "POST"){
			xhr.setRequestHeader("Content-type", "application/json")
		};
		xhr.send(data);
		//adds an event listener to the xhr object 
		xhr.addEventListener("readystatechange", () => {
			//when an xhr object is in a ready state and recieved, executes callback function on response
			if (xhr.readyState == 4 && xhr.status == 200){
				if (xhr.responseText !== "Error"){
					let response = JSON.parse(xhr.responseText);
					callback(response);
				}
			}
		})
	}
})
