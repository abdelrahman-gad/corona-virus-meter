import React from "react";
import "./Table.css";
import numeral from "numeral";

function Table({ countries , selectedCountry , handleSelectCountry }) {
   //console.log(countries);
  return (
    <div className="table">
      {countries.map((country) => {
        
        
        return (
          <tr onClick={ ( e ) =>
             {
              
              handleSelectCountry(country.countryInfo.iso2);
              }} className={country.countryInfo.iso2 === selectedCountry ? "active":''}
             key={country.countryInfo.iso2}  
            >
            <td key={country.country}>{country.country}</td>
            <td kety={country.cases}>
              <strong>{numeral(country.cases).format("0,0")}</strong>
            </td>
          </tr>
        )
      }

      )
      
      }
    </div>
  );
}

export default Table;
