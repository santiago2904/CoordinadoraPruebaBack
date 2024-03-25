const axios = require('axios');

/**
 * Function to geocode an address using the Mapbox API.
 * @param {string} address - The address to geocode.
 * @returns {Object} - Object containing latitude and longitude of the address.
 */
const geocodeAddress = async (address) => {
    try {
        const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json', {
            params: {
                access_token: process.env.MAPBOX_TOKEN,
                limit: 1 // Limiting the response to a single location
            }
        });
        const features = response.data.features;
        if (features && features.length > 0) {
            // Returning the coordinates of the first found location
            return {
                latitude: features[0].center[1],
                longitude: features[0].center[0]
            };
        } else {
            throw new Error('No results found for the provided address.');
        }
    } catch (error) {
        throw new Error('Error geocoding the address: ' + error.message);
    }
}

/**
 * Function to search for nearby places of interest using coordinates.
 * @param {number} latitude - The latitude coordinate.
 * @param {number} longitude - The longitude coordinate.
 * @param {number} radius - The search radius in meters.
 * @param {number} limit - The maximum number of results to return.
 * @returns {Object[]} - Array of formatted nearby places.
 */
const searchNearbyPlaces = async (latitude, longitude, radius, limit) => {
    try {
        const response = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/' + longitude + ',' + latitude + '.json', {
            params: {
                access_token: process.env.MAPBOX_TOKEN,
                types: 'poi', // Specifying that only places of interest are wanted
                limit: limit, // Limiting the response to the specified number of places
                radius: radius, // Search radius in meters
                language: 'es' // Language of the response
            }
        });
        const result = response.data.features;
        if (result && result.length > 0) {
            return formatPlaces(result);
        } else {
            throw new Error('No places found near the provided location.');
        }
    } catch (error) {
        throw new Error('Error searching nearby places: ' + error.message);
    }
}

/**
 * Function to format the retrieved places.
 * @param {Object[]} places - Array of places to format.
 * @returns {Object[]} - Formatted array of places.
 */
const formatPlaces = (places) => {
    return places.map(place => {
        return {
            name: place.text_es,
            category: place.properties.category,
            address: place.properties.address,
        };
    });
}

module.exports = { geocodeAddress, searchNearbyPlaces }
