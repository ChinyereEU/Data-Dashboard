// SearchComponent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import CreatorInfo from './CreatorInfo';

const SearchComponent = ({ list }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState(list);

  const handleSearch = useCallback(
    debounce((input) => {
      if (input) {
        const filteredData = list.filter((item) =>
          item.title.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredResults(filteredData);
      } else {
        setFilteredResults(list);
      }
    }, 300),
    [list]
  );

  useEffect(() => {
    handleSearch(searchInput);
  }, [searchInput, handleSearch]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div className="dashboard">
        {filteredResults.length > 0 ? (
          filteredResults.map((comic) => (
            <div className="card" key={comic.id}>
              <h2>{comic.title}</h2>
              <img src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`} alt={comic.title} className="card-image" />
              <CreatorInfo comicId={comic.id} />
            </div>
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};


SearchComponent.propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        thumbnail: PropTypes.shape({
          path: PropTypes.string.isRequired,
          extension: PropTypes.string.isRequired,
        }).isRequired,
      })
    ).isRequired,
  };

export default SearchComponent;