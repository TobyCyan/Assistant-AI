/**
 * @async
 * Gets the user's current location's weather and returns it as a promise.
 * @returns {Promise<string>} A promise that returns a weather response.
 */
export const getCurrentPositionWeather = async (APIKey) => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude
    
                let fetchLink = 'https://api.openweathermap.org/data/2.5/weather?'
                fetchLink += 'lat=' + lat + '&lon=' + lon + '&appid=' + APIKey
    
                try {
                    const response = await fetch(fetchLink)
                    if (response.ok) {
                        const weather = await response.json()
                        const weatherInfo = weather.weather[0]
                        const weatherDescription = weatherInfo.description
                        const weatherResponse = " Today's weather is " + weatherDescription + "!"
                        resolve(weatherResponse)
                    }
                } catch (err) {
                    console.error('Error Fetching Weather Info! ', err)
                    reject(err)
                }
                
            });
        }
    })
}

export default getCurrentPositionWeather