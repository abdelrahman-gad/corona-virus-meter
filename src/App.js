import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Grid 
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import { Bar } from 'react-chartjs-2';
import Table from "./Table";
import { sortData , prettyPrintStat ,casesTypeColors } from "./util";
import numeral from "numeral";
import Map from "./Map";
import './Map.css';
import "leaflet/dist/leaflet.css";
import GeoMap from './geojsonmap/components/GeoMap';


const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [sortBy, setSortBy] = useState('cases');
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

 
  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            cases:country.cases,
            reacovered:country.recovered,
            deaths:country.deaths
          }));
           //console.log(countries);

          let sortedData = sortData(data,sortBy);

          setCountries(countries);
          setMapCountries(sortedData);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, [sortBy]);

 // console.log(casesType);

const changeByCountry = async ( countryCode ) => {
  //console.log(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
}

  const onCountryChange = async ( e ) => {
    const countryCode = e.target.value;
    changeByCountry(countryCode);
  };

  
  const handleSelectCountry = ( countryCode ) => {
    //console.log(countryCode);
    changeByCountry(countryCode);
  }

  const handleSelectSortType = async ( e ) => {
      //  console.log(e.target.value);
        setCasesType(e.target.value);
        setSortBy(e.target.value);
  } 
    const showGeoMap = () => {
         console.log(casesType);
                  return ( <Map
                    countries={mapCountries}
                    casesType={casesType}
                    center={mapCenter}
                    zoom={mapZoom}
                    selectedCountry={countryInfo}
                  />);
    }

  const countryBarChart = (  ) => {

    if(countryInfo.country){
     // console.log(countryInfo);
      return (
        <Grid item xs={12} spacing={4}>
         <Card>
          <h3> Covid-19 Stats of  {countryInfo.country} </h3>
          <Bar
            data={{
              labels: ['Cases', 'Recovered', 'Deaths'],
              datasets: [
                {
                  label: 'People',
                  backgroundColor: [casesTypeColors.cases.rgb ,casesTypeColors.recovered.rgb , casesTypeColors.deaths.rgb],
                 data: [countryInfo.cases , countryInfo.recovered, countryInfo.deaths],
                },
              ],
            }}
            options={{
              legend: { display: false },
             
            }}
          />
        </Card>
      </Grid> 
      )     
    }else{
      return null;
    }
  }


  return (
    <div className="app" >
      <Grid container  spacing={4}>
       
        <Grid item xs={12} md={9}>
              <Grid container   spacing={4}>

               <Grid item xs={12}  border={1} >
                <Grid 
                  container 
                  direction="row"
                  justify="space-between"
                  alignItems="center"
                  
                >
             
                <h1>COVID-19 Tracker</h1>
                
                 
                  <FormControl className="app__dropdown ">
                    <Select
                      variant="outlined"
                      value={country}
                      onChange={onCountryChange}
                    >
                      <MenuItem value="worldwide" >Worldwide</MenuItem>
                        {countries.map((country) => (
                          <MenuItem value={country.value}  key={country.value} >{country.name}</MenuItem>
                        ))}
                    </Select>
                  </FormControl>  

              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoBox
                onClick={(e) => setCasesType("cases")}
                title="Coronavirus Cases"
                isRed
                active={casesType === "cases"}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={numeral(countryInfo.cases).format("0.0a")}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoBox
                  onClick={(e) => setCasesType("recovered")}
                  title="Recovered"
                  active={casesType === "recovered"}
                  cases={prettyPrintStat(countryInfo.todayRecovered)}
                  total={numeral(countryInfo.recovered).format("0.0a")}
                />
            </Grid>
            <Grid item xs={12} md={4}>
              <InfoBox
                  onClick={(e) => setCasesType("deaths")}
                  title="Deaths"
                  isRed
                  active={casesType === "deaths"}
                  cases={prettyPrintStat(countryInfo.todayDeaths)}
                  total={numeral(countryInfo.deaths).format("0.0a")}
                />
            </Grid>
            
            {countryBarChart()}  
            <Grid item xs={12}  spacing={4}>
              <Card >
                <CardContent>    
                       
                <h3>Corona virus timeline graph  of infected people  through worldwide   </h3>        
                     <LineGraph casesType={"cases"} />
                </CardContent>
              </Card>
           </Grid>
           <Grid item xs={12}  spacing={4}>
              <Card >
                <CardContent>  
                    <h3>Corona virus timeline graph of recovered people  through worldwide   </h3>        
                    <LineGraph casesType={"recovered"} />              
                </CardContent>
              </Card>
           </Grid>
           <Grid item xs={12}>
              <Card >
                <CardContent> 
                    <h3>Corona virus timeline graph of deaths through worldwide   </h3>        
                    <LineGraph casesType={"deaths"} />              
                </CardContent>
              </Card>
           </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}  spacing={4} >
         <Card>
          <CardContent>
           <div className="app__information">
            <h3>Live Sorted by Country Based On Top </h3>
            <FormControl className="app__dropdown">
              <Select
                variant="outlined"
                value={sortBy}
                onChange={handleSelectSortType}
              >
                <MenuItem value="cases"> Infected Cases </MenuItem>      
                <MenuItem value='recovered' > Recovered Cases </MenuItem>
                <MenuItem value='deaths' > Deaths Cases  </MenuItem>
              </Select>
            </FormControl>
            <h3>Worldwide new {casesType}</h3>
            <Table countries={tableData} selectedCountry={country} handleSelectCountry={handleSelectCountry}  />
          </div>
         </CardContent>
        </Card>           
       </Grid>
      </Grid> 
 

      <Grid container  spacing={4}>
         <Grid item xs={12}>
              <Card >
                <CardContent> 
                    <Grid  
                      container 
                      direction="row"
                      justify="space-between"
                      alignItems="center" 
                     >
                     <h3> Map of world corona {casesType} "Circle diameter expresses number"  </h3> 
                     <FormControl className="app__dropdown">
                        <Select
                          variant="outlined"
                          value={sortBy}
                          onChange={handleSelectSortType}
                        >
                          <MenuItem value="cases"> Infected Cases </MenuItem>      
                          <MenuItem value='recovered' > Recovered Cases </MenuItem>
                          <MenuItem value='deaths' > Deaths Cases  </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>               
                   { showGeoMap()}
                </CardContent>
              </Card>
           </Grid>
      </Grid>

      <Grid container  spacing={4}>  
         <Grid item xs={12}  >
              <Card >
                <CardContent>             
                  <h3> Overview Map  of world corona virus infected "the more color is saturated the bigger numbers" </h3> 
                  <GeoMap 
                     className="map" 
                     selectedCountry={countryInfo}  
                     mapCountries={mapCountries}
                     casesType={"cases"}
                  />
                </CardContent>
              </Card>
           </Grid>
       </Grid>
       
      <Grid container  spacing={4}>  
         <Grid item xs={12}>
              <Card >
                <CardContent>             
                  <h3> Overview Map  of world corona virus recovered number of people "the more color is saturated the bigger numbers" </h3> 
                  <GeoMap 
                     className="map" 
                     selectedCountry={countryInfo}  
                     mapCountries={mapCountries}
                     casesType={"recovered"}
                  />
                </CardContent>
              </Card>
           </Grid>
       </Grid>
       
      <Grid container  spacing={4}>  
         <Grid item xs={12}>
              <Card >
                <CardContent>             
                  <h3> Overview Map  of world corona virus deaths number of people "the more color is saturated the bigger numbers"  </h3> 
                  <GeoMap 
                     className="map" 
                     selectedCountry={countryInfo}  
                     mapCountries={mapCountries}
                     casesType={"deaths"}
                  />
                </CardContent>
              </Card>
           </Grid>
       </Grid>  
    </div>
  );
};

export default App;
