import React, {useState, useEffect} from 'react';
const API_KEY = '0ce5b7cc67ee05cd71a0b41eabcd9a9a';

const CreatorInfo = ({comicId}) => {//use the comic id to get all the other comic info
    const [creators, setCreators] = useState(null);
    const [comicImage, setComicImage] = useState(null);
    const [comicPrice, setComicPrice] = useState(null);
    //add page count & description


    useEffect(() => {
        const fetchComicData = async () => {
            try{
                const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics/${comicId}?apikey=${API_KEY}`)
                if (response.ok){
                    const json = await response.json();
                    console.log("Comic API Response:", json);

                    // if(json.data && Array.isArray(json.data.results)){
                    //     setCreators(json.data.results);
                    if(json.data && json.data.results && json.data.results.length > 0){
                        const comic = json.data.results[0];
                        setCreators(comic.creators.items);
                        setComicImage(`${comic.thumbnail.path}.${comic.thumbnail.extension}`);
                        setComicPrice(comic.prices[0].price);
                    } else {
                        console.error("Expected an array but got:", json);
                    }
                } else{
                    const text = await response.text();
                    console.error("expected JSON but got:", text);
                } 
            }   catch (error) {
                console.error("error fetching comic data:", error);
            }
        };

        fetchComicData();
    }, [comicId]);//useEffect doesn't run on every render, runs only when the comicId we pass in changes

    return (
        <div>
            {comicImage && <img src={comicImage} alt="Comic Thumbnail" />}
            {comicPrice != null && <p>Price: ${comicPrice}</p>}
            {creators ? (
                creators.map((creator) => (
                    // <p key={creator.id}>{creator.fullName}</p>
                    <p key={creator.resourceURI}>{creator.name}</p>
                ))
            ) : (
                <p>Loading creators...</p>
            )}
        </div>
    );
};




export default CreatorInfo;