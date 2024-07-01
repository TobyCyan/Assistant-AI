const behaviorBox = document.getElementById('behaviorarray')
const chatBox = document.getElementById('chatbox')
const responseBox = document.getElementById('responsebox')
const errorBox = document.getElementById('errorbox')
const retrainButton = document.getElementById('retrain')
// const behaviorTypeInput = document.getElementById('behaviortype')
// const patternInput = document.getElementById('pattern')
// const responseInput = document.getElementById('response')
import { getCurrentPositionWeather } from "../API Calls/weather.js"

retrainButton.addEventListener('click', () => {
    fetch('./retrain')
    .then(res => {
        if (res.ok) {
            return res.json()
        } else {
            console.log('error!')
        }
    })
    .then(msg => {
        document.getElementById('retrain_success').innerText = msg.message
    })
    .catch(err => console.error('Error Retraining Model: ', err.message))
})

fetch('/behaviorarray')
.then(res => {
    if (res.ok) {
        return res.json()
    } else {
        console.log(res.statusText)
    }
})
.then(arr => {
    behaviorBox.innerHTML = JSON.stringify(arr.dataArray['behavior'])
})
.catch(err => {
    console.error('Error Fetching Behavior Array: ', err.message)
})

chatBox.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        errorBox.innerHTML = ''
        const chatText = chatBox.value

        if (chatText.replace(/\s+/g, '') != '') {
            const model = 'model.tflearn'
            const dataToPost = {
                method: "POST",
                // Or use const user_url = {{ url_for("./startchat", model=model)|tojson }}
                // if post url in main.py is /startchat/<model>
                body: JSON.stringify({chatText, model}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            fetch('./startchat', dataToPost)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log(res.statusText)
                }
            })
            .then(response => {
                responseBox.innerHTML = response.response
                chatBox.value = ''
                if (response.code_name) {
                    handleCodeName(response.code_name)
                }
            })
            .catch(err => {
                console.error('Error Getting a Response: ', err.message)
            })
        } else {
            errorBox.innerHTML = 'Please Enter an Input!'
            chatBox.value = ''
        }
    
    }
})

function handleCodeName(code_name) {
    if (code_name == 'Weather') {
        getCurrentPositionWeather()
        return
    }
}
