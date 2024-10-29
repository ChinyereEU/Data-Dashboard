import React, {useEffect, useState} from 'react';
import SearchComponent from './SearchComponent';

// const API_KEY = '3836214ff1d994d646be301da7c7af3';


const SearchPage = () => {
    const [list, setList] = useState([]);

    useEffect(() => {
        const fetchComics = async () => {
            const cachedData  = localStorage.getItem('comicsData');
            if(cachedData) {
                const data = JSON.parse(cachedData);
                setList(data);
                return;
            }

            try {
                const response = await fetch(`https://gateway.marvel.com:443/v1/public/comics?formatType=comic&noVariants=false&hasDigitalIssue=true&orderBy=onsaleDate&apikey=${API_KEY}`)
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data.results;
                    localStorage.setItem('comicsData', JSON.stringify(data));
                    setList(data);
                }
            } catch (error) {
                console.error("Error fetching comics:", error);
            }
        };

        fetchComics();
    }, []);

    return <SearchComponent list={list} />;
};

export default SearchPage;