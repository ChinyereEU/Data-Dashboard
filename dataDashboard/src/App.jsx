import React, { useState, useEffect } from 'react';
import './App.css'
import CreatorInfo from './components/CreatorInfo';
const API_KEY = '0ce5b7cc67ee05cd71a0b41eabcd9a9a';

const App = () => {
  const [list, setList] = useState(null);
  // const API_KEY = '0ce5b7cc67ee05cd71a0b41eabcd9a9a';

  useEffect(() => {
    const fetchComics = async (retries = 3) => {
      try {
        const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics?format=digital%20comic&formatType=comic&noVariants=true&hasDigitalIssue=true&orderBy=onsaleDate&apikey=${API_KEY}`);
        if (response.ok) {
          const json = await response.json();
          console.log("API Response:", json);

          if (json.data && Array.isArray(json.data.results)) {
            setList(json.data.results);
            console.log(json.data.results);
          } else {
            console.error("Expected an array but got:", json);
          }
        } else {
          const text = await response.text();
          console.error("Expected JSON but got:", text);
        }
      } catch (error) {
        if (retries > 0) {
          console.warn(`Retrying... (${retries} attempts left)`);
          fetchComics(retries - 1);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchComics().catch(console.error);
  }, []);

  return (
    <div className="whole-page">
      <h1>Marvel Comic Titles</h1>
      <ul className="centered-list">
        {list ? (
          list.map((comic) => (
            <li key={comic.id}>
              {comic.title}
              <CreatorInfo comicId={comic.id} />
            </li>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </div>
  );
};

export default App;