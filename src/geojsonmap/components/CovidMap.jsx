import React  , { useEffect , useState } from "react";
import { Map, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./CovidMap.css";
import "./../../Map.css";
import numeral from 'numeral';
import { generateCountryLayer } from './../../util';

const CovidMap = ({ countries ,  selectedCountry  , mapCountries , casesType }) => {
  
   
   let combinedCountries = [];
   for( let i=0 ; i < countries.length; i++){
       for(let j=0; j < mapCountries.length; j++  ){
         if(countries[i].properties.ADMIN === mapCountries[j].country){
           combinedCountries.push({ ...countries[i] , ...mapCountries[j] } );
         }
       }
   }
 


  let maxCasesCountry = Math.max.apply(Math, mapCountries.map(function(country) { return country.cases; }))
  let maxRecoveredCountry = Math.max.apply(Math, mapCountries.map(function(country) { return country.recovered; }))
  let maxDeathsCountry = Math.max.apply(Math, mapCountries.map(function(country) { return country.deaths;}))
  let mapStyle = {
    fillColor: "white",
    weight: 1,
    color: "black",
    fillOpacity: 1,
  };

  const onCountryClick = e => {
    console.log('country clicked');
    let country = e.target;
    // console.log(layer);
    mapStyle={...mapStyle,color:"black"};
    country.setStyle({
        color:'blue',
        weight:2
    });
  }

 

  
  //  console.log(cogenerateCountryLayer()) ; 


  const onEachCountry = (country, layer  ) => {
    
      let countryStats = {  
         cases:country.cases, 
         recovered:country.recovered , 
         deaths: country.deaths
       }
       let maxOfCountriesStats ={
         recovered:maxRecoveredCountry,
         death:maxDeathsCountry,
         cases:maxCasesCountry
       } 
     // console.log(casesType);
     layer.options.fillColor = generateCountryLayer( countryStats , maxOfCountriesStats, casesType );
     
    
    

     const name = country.properties.ADMIN;
     const confirmedText = country.properties.confirmedText;
     layer.bindPopup(
       ` <div className="info-container">
            <div
              class="info-flag"
              style="background-image: url(${country.countryInfo.flag})"
            ></div>
            <div class="info-name">${country.country}</div>
            <div class="info-confirmed">
              Cases: ${numeral(country.cases).format("0,0")}
            </div>
            <div class="info-recovered">
              Recovered: ${numeral(country.recovered).format("0,0")}
            </div>
            <div class="info-deaths">
              Deaths: ${numeral(country.deaths).format("0,0")}
            </div>
        </div>
     `
     );
  };

  
  if(combinedCountries.length){
    return (
       <>
        
       
        <Map style={{ height: "90vh" }} zoom={2} center={[20, 60]}>
         
          <GeoJSON
            style={mapStyle}
            data={combinedCountries}
            onEachFeature={onEachCountry}
          />
        </Map>   
       </>
    
    );
  }else{
    return (<p> loading </p>);
  }
 
};

export default CovidMap;
