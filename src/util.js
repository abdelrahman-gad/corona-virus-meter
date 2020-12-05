import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";



export const generateCountryLayer = ( countryStats , maxOfCountriesStats , casesType) => {
   
  let rgba = ``;
  let opacity = ``;
 // console.log(casesType);
   switch(casesType){
      case "recovered":
        opacity= countryStats.recovered/maxOfCountriesStats.recovered;
        rgba =`RGBA(125,215,29,${opacity})`; 
        break;
      case "deaths":
        opacity= countryStats.deaths/maxOfCountriesStats.death;
        rgba =`RGBA(251,68,67,${opacity})`; 
        break;        
     case "cases":
         opacity= countryStats.cases/maxOfCountriesStats.cases;
         rgba =`RGBA(204,16,52,${opacity})`; 
   }
    return rgba;
 }


export const geoCasesTypeColors = {
  cases:{
      one:"RGBA(204,16,52,1)",
      two:"RGBA(204,16,52,0.85)",
      three:"RGBA(204,16,52,0.65)",
      four:"RGBA(204,16,52,0.4)",
      five:"RGBA(204,16,52,0.2)",
      six:"RGBA(204,16,52,0)"
  },
  recovered:{
    one:"RGBA(125,215,29,1)",
    two:"RGBA(125,215,29,0.85)",
    three:"RGBA(125,215,29,0.65)",
    four:"RGBA(125,215,29,0.4)",
    five:"RGBA(125,215,29,0.2)",
    six:"RGBA(125,215,29,0)"
  },
  deaths:{
    one:"RGBA(251,68,67,1)",
    two:"RGBA(251,68,67,0.85)",
    three:"RGBA(251,68,67,0.65)",
    four:"RGBA(251,68,67,0.4)",
    five:"RGBA(251,68,67,0.2)",
    six:"RGBA(251,68,67,0)"
  }
}


export const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204, 16, 52)",
    half_op: "rgba(204, 16, 52, 0.5)",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125, 215, 29)",
    half_op: "rgba(125, 215, 29, 0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251, 68, 67)",
    half_op: "rgba(251, 68, 67, 0.5)",
    multiplier: 2000,
  },
};








export const sortData = ( countries , sortBy) => {
  let sortedCountries = [...countries];
   
  sortedCountries.sort((a, b) => {
    if (a[sortBy] > b[sortBy]) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedCountries;
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases" , selectedCountry = null ) => {
console.log(selectedCountry);
 return <>

{  data.map((country) => {
    return (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        fillOpacity={0.4}
        onclick={(e)=> console.log('nice map')}
        key={country.countryInfo.iso3}
         
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup
           key={country.countryInfo.iso3}
          >
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div className="info-name">{country.country}</div>
            <div className="info-confirmed">
              Cases: {numeral(country.cases).format("0,0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    )
  }
 )}

{
  
selectedCountry.countryInfo ?
    <Circle
        center={[selectedCountry.countryInfo.lat, selectedCountry.countryInfo.long]}
        color='#fff'
        fillColor={casesTypeColors[casesType].hex}
        fillOpacity={0.4}
        onclick={(e)=> console.log('nice map')}
        key={selectedCountry.countryInfo.iso3}
          
        radius={
          Math.sqrt(selectedCountry[casesType]) * casesTypeColors[casesType].multiplier
        }
        >
        <Popup>
          <div className="info-container">
            <div
              className="info-flag"
              style={{ backgroundImage: `url(${selectedCountry.countryInfo.flag})` }}
            ></div>
            <div className="info-name">{selectedCountry.country}</div>
            <div className="info-confirmed">
              Cases: {numeral(selectedCountry.cases).format("0,0")}
            </div>
            <div className="info-recovered">
              Recovered: {numeral(selectedCountry.recovered).format("0,0")}
            </div>
            <div className="info-deaths">
              Deaths: {numeral(selectedCountry.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
        </Circle>:null

}
 
 </>
  

}
