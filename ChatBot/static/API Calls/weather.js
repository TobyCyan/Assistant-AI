/**
 * @async
 * Gets the user's current location's weather and returns it as a promise.
 * @returns {Promise<string>} A promise that returns a weather response.
 */
export const getCurrentPositionWeather = async () => {
    return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude
                const APIKey = '2a5b61cf6927801f7998fddb3a5c477f'
    
                let fetchLink = 'https://api.openweathermap.org/data/2.5/weather?'
                fetchLink += 'lat=' + lat + '&lon=' + lon + '&appid=' + APIKey
    
                try {
                    const response = await fetch(fetchLink)
                    if (response.ok) {
                        const weather = await response.json()
                        const weather_info = weather.weather[0]
                        const weather_description = weather_info.description
                        const weatherResponse = " Today's weather is " + weather_description + "!"
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