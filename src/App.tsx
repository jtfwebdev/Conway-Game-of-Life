import './App.css'
import ConwayBoard from './ConwayBoard'
import Description from './Description';
import { useEffect, useState, createContext } from 'react';

export const screenWidthContext = createContext(window.innerWidth);

function App() {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const listener = () => {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, [])

  return (
    <screenWidthContext.Provider value={screenWidth}>
      <div className="app">
        <h1 id="title">Conway's Game of Life</h1>
        <p id="intro">is a cellular automaton designed by the British mathemetician John Conway. </p>
        <div className="appContainer">
          <Description />
          <ConwayBoard />
        </div>
      </div>
    </screenWidthContext.Provider>
  )
}

export default App
