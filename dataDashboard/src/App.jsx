import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/SideBar';
import DashboardHome  from './components/DashBoardHome';
import SearchPage from './components/SearchPage';
import AboutPage from './components/About';
import debounce from 'lodash.debounce';
import './App.css';
import CreatorInfo from './components/CreatorInfo';

const API_KEY = '3836214ff1d994d646b2e301da7c7af3';
// const API_KEY = process.env.VITE_APP_API_KEY;

/**DEBOUNCING:  to limit the number of API calls made during user interactions, such as typing in a search bar*/
  /**debounced search function defined outside the component */
  // const debounce = (func, delay) => {
  //   let debounceTimer;
  //   return function (...args) {
  //     const context = this;
  //     clearTimeout(debounceTimer);
  //     debounceTimer = setTimeout(() => func.apply(context, args), delay);
  //   };
  // };

const App = () => {
  const [list, setList] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchInput, setSearchInput] = useState("");


  /**CACHING: to reduce the number of API calls by storing the fetched data locally */
  /**function to fetch comics from the API */
  const fetchComics = async () => {
    const cachedData = localStorage.getItem('comicsData');
    if(cachedData){
      const data = JSON.parse(cachedData);
      setList(data);
      setFilteredResults(data);
      return;
    }

    try {
      const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics?formatType=comic&noVariants=true&hasDigitalIssue=true&orderBy=onsaleDate&apikey=${API_KEY}`);
      if(response.ok){
        const json = await response.json();
        console.log("API Response:", json);

        if(json.data && Array.isArray(json.data.results)){
          setList(json.data.results);
          setFilteredResults(json.data.results);
          localStorage.setItem('comicsData', JSON.stringify(json.data.results));
        } else {
          console.error("Expected an array but got:", json);
        }
      } else {
        const text = await response.text();
        console.error("Expected JSON but got:", text);
      }
    } catch (error){
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchComics();
  }, []);


  /**function to take inputString from search bar & use it to filter through the results of the API call */
  const searchItems = useCallback((searchValue) => {
    setSearchInput(searchValue);//updates the state with the current search input value
    if(searchValue !== ""){//checks if the search value is not empty
      /**Object.keys(list.Data): retrieves the keys of the list.Data object
       * .filter((item) => ...): filters the keys based on the search value
       */
      const filteredData = list.filter((item) =>
        Object.values(item) //retrieves the values of the current item
          .join("") //joins the values into a single string
          .toLowerCase()
          .includes(searchValue.toLowerCase())//check if the joined string includes the search value(also converted to lower case)
      );
      setFilteredResults(filteredData);//updates the state with the filteres results
    } else {//handles empty search value
      setFilteredResults(list);
    }
}, [list]);

// const debouncedSearchItems = useCallback(debounce(searchItems, 300), [list]);
const debouncedSearchItems = useCallback(
  debounce((searchValue) => {
    searchItems(searchValue);
  }, 300),
  [searchItems]
);

  // useEffect(() => {
  //   const fetchComics = async (retries = 3) => {
  //     try {
  //       const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics?formatType=comic&noVariants=true&hasDigitalIssue=true&orderBy=onsaleDate&apikey=${API_KEY}`);
  //       if (response.ok) {
  //         const json = await response.json();
  //         console.log("API Response:", json);

  //         if (json.data && Array.isArray(json.data.results)) {
  //           setList(json.data.results);
  //           console.log(json.data.results);
  //         } else {
  //           console.error("Expected an array but got:", json);
  //         }
  //       } else {
  //         const text = await response.text();
  //         console.error("Expected JSON but got:", text);
  //       }
  //     } catch (error) {
  //       if (retries > 0) {
  //         console.warn(`Retrying... (${retries} attempts left)`);
  //         fetchComics(retries - 1);
  //       } else {
  //         console.error("Error fetching data:", error);
  //       }
  //     }
  //   };

  //   fetchComics().catch(console.error);
  // }, []);

//   return (
//     <div className="whole-page">
//       <h1 className="title">Marvel Comics</h1>
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="search comics..."
//           value={searchInput}
//           onChange={(e) => debouncedSearchItems(e.target.value)}
//         />
//       </div>
//       <div className="dashboard">
//         {filteredResults.length > 0 ? (
//             filteredResults.map((comic) => (
//               <div className="card" key={comic.id}>
//                 <h2>{comic.title}</h2>
//                 <CreatorInfo comicId={comic.id} />
//               </div>
//             ))
//           ) : (
//             <p>Loading...</p>
//           )}
//         {/* <ul className="centered-list">
//           {searchInput.length > 0 ? (
//             filteredResults.length > 0 ? (
//               filteredResults.map((comic) => (
//                 <li key={comic.id}>
//                   {comic.title}
//                   <CreatorInfo comicId={comic.id} />
//                 </li>
//               ))
//             ) : (//if filteredResults < 0
//               <li>Loading...</li>
//             )
//           ) : (//if there is no searchInput
//             list.map((comic) => (
//               <li key={comic.id}>
//                 {comic.title}
//                 <CreatorInfo comicId={comic.id} />
//               </li>
//             ))
//           )}
//         </ul> */}
//       </div>
//     </div>
//   );
// };

return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={
              <div className="dashboard">
                {filteredResults.length > 0 ? (
                  filteredResults.map((comic) => (
                    <div className="card" key={comic.id}>
                      <h2>{comic.title}</h2>
                      <CreatorInfo comicId={comic.id} />
                    </div>
                  ))
                ) : (
                  <p>loading...</p>
                )}
              </div>
            } />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};


export default App;