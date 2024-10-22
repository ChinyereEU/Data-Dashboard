// import React, { useEffect, useState } from 'react';
// // import dotenv from 'dotenv';
// import './App.css'
// import {toast} from 'react-toastify'

// // dotenv.config();

// const API_KEY = import.meta.env.VITE_APP_API_KEY;
// console.log("API Key:", API_KEY); // Check if the API key is being logged correctly

// function App() {

//   const [list, setList] = useState(null)
//   useEffect(() => {
//     const fetchAllCreatorData = async () => {
//     //   const API_KEY = import.meta.env.VITE_APP_API_KEY;
//     //   console.log("API Key:", API_KEY); // Check if the API key is being logged correctly

//         try{
//             const response = await fetch(
//             //MARVEL
//             // `https://gateway.marvel.com:443/v1/public/creators?firstName=brian&middleName=michael&lastName=bendis&apikey=${API_KEY}`
//             `https://gateway.marvel.com:443/v1/public/creators?apikey=${API_KEY}`

//             );
//             if (response.ok) {
//                 const json = await response.json();
//                 console.log("API Response:", json);

//                 if (json.data && Array.isArray(json.data.results)){
//                     setList(json.data.results);
//                     console.log(json.data.results);
//                 }
//                 else {
//                     console.error("Expected an array but got:", json);
//                 }
//             }
//                 else {
//                     const text = await response.text();
//                     console.error("Expected JSON but got:", text);
//                 }
//             }
//             catch(error){
//                 console.error("Error fetching data:", error);
//             }
//         };

//         /**call fetchAllCreatorData & handle any errors that may come with it */
//             fetchAllCreatorData().catch(console.error);
//     }, []);

//   return (
//     <div className="whole-page">
//       <h1>Marvel Comics</h1>
//       <ul>{/*unordered list to display each creator */}
//         {/*conditional rendering to display list of creators if list exists or display "Loading..." if list has not been returned from API call */}
//         {list ? (
//           <ul>
//             {/*maps through each item in the list array. item: current item in list. index: index of current item. */}
//             {list.map((item, index) => (
//             /*for each item in list array, create a list item with a unique key(index) and display the item's name*/
//               <li key={index}>{item.name}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </ul>
//     </div>
//   );
// }

// export default App;




////////////////////
import React, { useState, useEffect } from 'react';

const App = () => {
  const [list, setList] = useState(null);
  const API_KEY = '0ce5b7cc67ee05cd71a0b41eabcd9a9a';

  useEffect(() => {
    const fetchAllCreatorData = async (retries = 3) => {
      try {
        const response = await fetch(`https://gateway.marvel.com:443/v1/public/creators?apikey=${API_KEY}`);
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
          fetchAllCreatorData(retries - 1);
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchAllCreatorData().catch(console.error);
  }, []);

  return (
    <div className="whole-page">
      <h1>Marvel Comics Creators</h1>
      <ul>
        {list ? (
          list.map((creator, index) => (
            <li key={index}>{creator.fullName}</li>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </div>
  );
};

export default App;