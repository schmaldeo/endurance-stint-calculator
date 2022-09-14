import { createRef, useEffect, useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";

function App() {
    const [raceTimeH, setRaceTimeH] = useState("");
    const [raceTime, setRaceTime] = useState("");
    const [stintTime, setStintTime] = useState("");
    const [pitTime, setPitTime] = useState("");
    const [laptimeM, setLaptimeM] = useState("");
    const [laptimeS, setLaptimeS] = useState("");
    const [fuelLap, setFuelLap] = useState("");
    const [stints, setStints] = useState([]);
    const [errors, setErrors] = useState(null);
    const realRaceStart = createRef();
    const gameRaceStart = createRef();
    
    useEffect(() => {}, [stints, errors]);

    return (
        <div className="App">
            <Form raceTimeH={raceTimeH} raceTime={raceTime} stintTime={stintTime} pitTime={pitTime} laptimeM={laptimeM} laptimeS={laptimeS} fuelLap={fuelLap} realRaceStart={realRaceStart} gameRaceStart={gameRaceStart} setRaceTimeH={setRaceTimeH} setRaceTime={setRaceTime} setStintTime={setStintTime} setPitTime={setPitTime} setLaptimeM={setLaptimeM} setLaptimeS={setLaptimeS} setFuelLap={setFuelLap} setStints={setStints} setErrors={setErrors} />
            <Table stints={stints} setStints={setStints} errors={errors} />
        </div>
    );
}

export default App;