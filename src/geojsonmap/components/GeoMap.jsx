import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import CovidMap from "./CovidMap";
import LoadCountriesTask from "../tasks/LoadCountriesTask";
import Legend from "./Legend";
import legendItems from "../entities/LegendItems";

const GeoMap = ( { mapCountries , selectedCountry , casesType } ) => {

  const [countries, setCountries] = useState([]);
  const legendItemsReverse = [...legendItems].reverse();
  const load = () => {
   // console.log("load");
    const loadCountriesTask = new LoadCountriesTask();
    loadCountriesTask.load((countries) => setCountries(countries));
   
  };

  useEffect(load, []);

  
  return (
    <div>
      {countries.length === 0 ? (
        <Loading />
      ) : (
        <div>
          <CovidMap countries={countries}  selectedCountry={selectedCountry}  mapCountries={mapCountries} casesType={casesType} />
         
        </div>
      )}
    </div>
  );
};

export default GeoMap;

/*
class Covid19 extends Component {
  state = {
    countries: [],
  };

  loadCountryTask = new LoadCountryTask();

  componentDidMount() {
    this.loadCountryTask.load((countries) => this.setState({ countries }));
  }

  render() {
    const { countries } = this.state;
    return (
      <div>
        {countries.length === 0 ? (
          <Loading />
        ) : (
          <div>
            <CovidMap countries={countries} />
            <Legend legendItems={legendItems} />
          </div>
        )}
      </div>
    );
  }
}

export default Covid19;
*/