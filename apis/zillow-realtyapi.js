const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();


const url = "https://zillow.realtyapi.io/search/byaddress";

const getResults = async (location, listingstatus, min, max, tourOpenHouse, tour3D) => {
	try {
		const tours = [];
		if (tourOpenHouse) {
			tourOpenHouse = "Must have open house";
			tours.push("Must have open house");
		}
		if (tour3D) {
			tour3D = "Must have 3D Tour";
			tours.push("Must have 3D Tour");
		}

		const config = {
			method: "get",
			headers: {
				"x-realtyapi-key": process.env.REALTY_API_KEY,
			},
			params: {
				location: location,
				page: "1",
				sortOrder: "Price_Low_to_High",
				listingStatus: listingstatus,
				bed_min: "No_Min",
				bed_max: "No_Max",
				bathrooms: "Any",
				homeType: "Houses, Townhomes, Multi-family, Condos/Co-ops, Apartments, Manufactured",
				maxHOA: "Any",
				listingType: "Any",
				parkingSpots: "Any",
				mustHaveBasement: "No",
				daysOnZillow: "Any",
				soldInLast: "Any",
				listPriceRange: `min:${min}, max:${max}`,
				tours: tours.length > 0 ? tours.join(", ") : ""
			}
		};

		return axios(url, config)
			.then((response) => {
				return response.data;
			})
			.catch((error) => console.error(error));
	} catch (error) {
		console.error('getResults() error:', error);
	}	
};

module.exports = {
	getResults
};