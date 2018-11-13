// const API_URL = '/example.json?domain=';
const API_URL = 'https://apis.is/isnic?domain=';

/**
 * Leit að lénum á Íslandi gegnum apis.is
 */
const program = (() => {
	let domains;

	function addToDescriptionList(descriptionList, term, description) {
		if(description === "") return;
		const termElement = document.createElement("dt");
		const descriptionElement = document.createElement("dd");
		
		termElement.innerHTML = term;
		descriptionElement.innerHTML = description;

		descriptionList.appendChild(termElement);
		descriptionList.appendChild(descriptionElement);
	}

	function clearElement(element) {
		while(element.firstChild) {
			element.removeChild(element.firstChild);
		}
	}

	function onSubmit(e) {
		e.preventDefault();

		const input_text = e.target.querySelector("input").value;

		let result_display = domains.querySelector(".results");
		clearElement(result_display);

		const loading_element = document.createElement("div");
		loading_element.classList.add("loading");

		const loading_image = document.createElement("img");
		loading_image.src = "loading.gif";

		loading_element.appendChild(document.createTextNode("Leita að léni..."));
		loading_element.appendChild(loading_image);

		if(input_text !== "") {
			fetch(API_URL + input_text)
				.then(function(response) {
					if(response.ok) {
						result_display.appendChild(loading_element);
						return response.json();
					}

					throw new Error("villa að sækja gögn");
				})
				.then(function(data) {
					clearElement(result_display);
					if(data.results.length === 0) {
						result_display.appendChild(document.createTextNode("síða fannst ekki!"));
					}else {
						let result = data.results[0];
						let descriptionList = document.createElement("dl");

						console.log(result);

						addToDescriptionList(descriptionList, "Lén", result.domain);
						addToDescriptionList(descriptionList, "Skráð", result.registered);
						addToDescriptionList(descriptionList, "Seinast breytt", result.lastChange);
						addToDescriptionList(descriptionList, "Rennur út", result.expires);
						addToDescriptionList(descriptionList, "Skráningaraðili", result.registrantname);
						addToDescriptionList(descriptionList, "Netfang", result.email);
						addToDescriptionList(descriptionList, "Heimilisfang", result.address);
						addToDescriptionList(descriptionList, "Land", result.country);

						result_display.appendChild(descriptionList);
					}
				})
				.catch(function(error) {
					result_display.appendChild(document.createTextNode("villa kom upp við að sækja gögn"));
				});
		}else {
			result_display.appendChild(document.createTextNode("leitarstrengur er tómur"));
		}
	}

	function init(_domains) {
		domains = _domains;

		const form = domains.querySelector("form");
		form.addEventListener("submit", onSubmit);
	}

	return {
		init,
	};
})();

document.addEventListener('DOMContentLoaded', () => {
	const domains = document.querySelector(".domains");
	program.init(domains);
});
