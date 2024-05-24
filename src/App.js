import './App.css';
import React, {useState, useEffect, useCallback} from 'react';


function App() {
  const [welcomeMsg, setWelcomeMsg] = useState('Welcome!!')
  useEffect(() => { 
    fetch('/api')
    .then(res => res.json())
    .then(msg => {
      setWelcomeMsg(msg)}
    )
  }, [])

  return (
    <>
    <h1>{welcomeMsg}</h1>
    </>
  );
}

export default App;
