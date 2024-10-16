import { React, useEffect, useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_API_KEY;

function App() {
  const [list, setList] = useState(null)

  useEffect(() => {
    const fetchAllRestaurantData = async () => {
      const response = await fetch(
        `https://api.spoonacular.com/food/restaurants/search?apiKey=${API_KEY}`
        // "https://api.spoonacular.com/food/restaurants/search?cuisine=italian&lat=34.7786357&lng=-122.3918135"
      );
      const json = await response.json();
      setList(json);
    };
    /**call etchAllRestaurantData & handle any errors that may come with it */
    fetchAllRestaurantData().catch(console.error);
  }, []);

  return (
    <div className="whole-page">
      <h1>North America Fusion</h1>
      <ul>{/*unordered list to display each restaurant */}
        {/*conditional rendering to display list of restaurants if list exists or display "Loading..." if list has not been returned from API call */}
        {list ? (
          <ul>
            {/*maps through each item in the list array. item: current item in list. index: index of current item. */}
            {list.map((item, index) => (
            /*for each item in list array, create a list item with a unique key(index) and display the item's name*/
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
  );
}

export default App
