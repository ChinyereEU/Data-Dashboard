import React, {useState, useEffect} from 'react';
const API_KEY = '0ce5b7cc67ee05cd71a0b41eabcd9a9a';

const CreatorInfo = ({creatorName, comicName, comicId}) => {
    const [creators, setCreators] = useState(null);

    useEffect(() => {
        const fetchCreatorData = async () => {
            try{
                const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics/${comicId}/creators?apikey=${API_KEY}`)
                // console.log("comicId:", response);
                if (response.ok){
                    const json = await response.json();
                    // console.log("comicId in response.ok:", json);
                    console.log("Creator API Response:", json);

                    if(json.data && Array.isArray(json.data.results)){
                        setCreators(json.data.results);
                    } else{
                        console.error("Expected an array but got:", json);
                    }
                } else{
                    const text = await response.text();
                    console.error("expected JSON but got:", text);
                } 
            }   catch (error) {
                console.error("error fetching creator data:", error);
            }
        };

        fetchCreatorData();
        // const getComicCharacters = async () => {
        //     const response = await fetch(

        //     )
        // }
    }, [comicId]);//useEffect doesn't run on every render, runs only when the comic name we pass in changes

    return (
        <div>
            {creators ? (
                creators.map((creator) => (
                    <p key={creator.id}>{creator.fullName}</p>
                ))
            ) : (
                <p>Loading creators...</p>
            )}
        </div>
    );
};




export default CreatorInfo;