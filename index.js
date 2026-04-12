import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const url = "https://zillow.realtyapi.io/search/byaddress";

const config = {
  method: "get",
  headers: {
    "x-realtyapi-key": process.env.REALTY_API_KEY
  },
  params: {
    location: "San Francisco",
    page: "1",
    sortOrder: "Price_Low_to_High",
    listingStatus: "For_Sale",  //For_Rent
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
    listPriceRange: "min:400000, max:700000",
    tours: "Must have open house" //Must have 3D Tour
  }
}

axios(url, config)
  .then(response => {
    console.log(response.data.pagesInfo)
    console.log(response.data.resultsCount.totalMatchingCount)

    response.data.searchResults.forEach(result => {
        console.log("-----")
        console.log(result.property.price.value)
        console.log(result.property.location)
        console.log(result.property.address.streetAddress + " | " + result.property.propertyType + " | " + result.property.livingArea + " sqft ")
        console.log(`https://www.zillow.com/homedetails/${result.property.zpid}_zpid/`)
    })
  })
  .catch(error => console.error(error))