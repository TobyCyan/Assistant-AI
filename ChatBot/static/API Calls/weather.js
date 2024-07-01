const chatBox = document.getElementById('chatbox')
const responseBox = document.getElementById('responsebox')

export const getCurrentPositionWeather = async () => {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            getWeather(lat, lon)
        });
    }
}

const getWeather = (lat, lon) => {
    const APIKey = '2a5b61cf6927801f7998fddb3a5c477f'
    let fetchLink = 'https://api.openweathermap.org/data/2.5/weather?'
    fetchLink += 'lat=' + lat + '&lon=' + lon + '&appid=' + APIKey
    fetch(fetchLink)
    .then(res => {
        if (res.ok) {
            return res.json()
        }
    })
    .then(weather => {
        const weather_info = weather.weather[0]
        const weather_description = weather_info.description
        responseBox.innerHTML += " Today's weather is " + weather_description + "!"
    })
}

export default getCurrentPositionWeather