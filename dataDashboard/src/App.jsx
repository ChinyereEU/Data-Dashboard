import { useState, useEffect } from 'react'

/**
 * Main application component for displaying North America Fusion Restaurants.
 * @component
 */
export default function App() {
  /**
   * @type {Array<Object>}
   * @description List of restaurants fetched from the API.
   */
  const [restaurants, setRestaurants] = useState([])

  /**
   * @type {Object|null}
   * @property {number} latitude - Latitude of the user's location.
   * @property {number} longitude - Longitude of the user's location.
   * @description User's current location.
   */
  const [userLocation, setUserLocation] = useState(null)

  /**
   * @type {boolean}
   * @description Loading state for fetching restaurants.
   */
  const [isLoading, setIsLoading] = useState(false)

  /**
   * @type {string|null}
   * @description Error message if any error occurs.
   */
  const [error, setError] = useState(null)

  /**
   * @type {string}
   * @description API key for accessing the Spoonacular API.
   */
  const API_KEY = import.meta.env.VITE_APP_API_KEY

  useEffect(() => {
    getUserLocation()
  }, [])

  useEffect(() => {
    if (userLocation) {
      fetchRestaurants()
    }
  }, [userLocation])

  /**
   * Get the user's current location using the Geolocation API.
   * Sets the userLocation state with the latitude and longitude.
   * Sets the error state if geolocation is not supported or if there is an error.
   */
  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting user location:", error)
          setError("Failed to get your location. Please try again.")
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  /**
   * Fetch restaurants based on the user's location using the Spoonacular API.
   * Sets the restaurants state with the fetched data.
   * Sets the error state if there is an error or if the data format is unexpected.
   * Sets the isLoading state to indicate loading status.
   */
  const fetchRestaurants = async () => {
    if (!API_KEY) {
      setError("API key is missing. Please check your environment variables.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/restaurants/search?apiKey=${API_KEY}&lat=${userLocation?.latitude}&lng=${userLocation?.longitude}`
      )
      const data = await response.json()

      if (response.ok) {
        if (data.restaurants && Array.isArray(data.restaurants)) {
          setRestaurants(data.restaurants)
        } else {
          setError("Unexpected data format received from the API.")
        }
      } else {
        setError(data.message || "Failed to fetch restaurants. Please try again.")
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error)
      setError("An error occurred while fetching restaurants. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>North America Fusion Restaurants</h1>

      {error && (
        <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #F87171', borderRadius: '0.375rem', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ color: '#DC2626', fontWeight: 'bold' }}>Error</p>
          <p style={{ color: '#DC2626' }}>{error}</p>
        </div>
      )}

      {!userLocation && !error && (
        <button
          onClick={getUserLocation}
          style={{
            backgroundColor: '#3B82F6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Get My Location
        </button>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg
            style={{ animation: 'spin 1s linear infinite', marginRight: '0.5rem' }}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span>Loading restaurants...</span>
        </div>
      ) : restaurants.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {restaurants.map((restaurant, index) => (
            <div key={index} style={{ border: '1px solid #E5E7EB', borderRadius: '0.375rem', overflow: 'hidden' }}>
              <div style={{ padding: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{restaurant.name}</h2>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  {restaurant.address.street_addr}, {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipcode}
                </p>
              </div>
              <div style={{ padding: '1rem' }}>
                {restaurant.food_photos && restaurant.food_photos.length > 0 && (
                  <img
                    src={restaurant.food_photos[0]}
                    alt={`Food from ${restaurant.name}`}
                    style={{ width: '100%', height: '12rem', objectFit: 'cover', borderRadius: '0.375rem' }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No restaurants found. Try adjusting your location or search criteria.</p>
      )}
    </div>
  )
}
