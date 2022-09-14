import { addSeconds, parse } from "date-fns";

const Form = props => {
    const handleInput = (input, val) => {
        switch(input) {
            case "raceHours":
                props.setRaceTimeH(val.replace(/[^0-9]/g, ""));
                break;
            case "raceMinutes":
                props.setRaceTime(val.replace(/[^0-9]/g, ""));
                break;
            case "stint":
                props.setStintTime(val.replace(/[^0-9]/g, ""));
                break;
            case "pit":
                props.setPitTime(val.replace(/[^0-9]/g, ""));
                break;
            case "laptimeM":
                props.setLaptimeM(val.replace(/[^0-9]/g, ""));
                break;
            case "laptimeS":
                props.setLaptimeS(val.replace(/[^0-9]/g, ""));
                break;
            case "fuel":
                props.setFuelLap(val.replace(/[^0-9.]/g, ""))
                break;
            default:
                console.error("wrong arg");
        };
    };

    const handleSubmit = e => {
        e.preventDefault();
        props.setStints([]);
        if (props.raceTimeH && props.stintTime && props.pitTime && props.laptimeM && props.fuelLap && props.realRaceStart.current.value && props.gameRaceStart.current.value) {
            props.setErrors("");
            let raceTimeInSeconds;
            let laptimeInS;
            if (props.raceTime) {
                raceTimeInSeconds = (parseInt(props.raceTimeH) * 60 + parseInt(props.raceTime)) * 60;
            } else {
                raceTimeInSeconds = parseInt(props.raceTimeH) * 3600;
            };
            if (props.laptimeS) {
                laptimeInS = parseInt(props.laptimeM) * 60 + parseInt(props.laptimeS);
            } else {
                laptimeInS = parseInt(props.laptimeM) * 60;
            };
            const timeInPits = parseInt(props.pitTime);
            const stintTimeInS = parseInt(props.stintTime) * 60;
            calculateStints(stintTimeInS, timeInPits, props.fuelLap, raceTimeInSeconds, laptimeInS);
        } else {
            props.setErrors("Fields missing");
        }
    };

    const calculateStints = (stintTimeInS, timeInPits, fuelConsumption, raceTime, laptime) => {
        const amountOfLapsOnFullStint = Math.floor(stintTimeInS/laptime);
        const normalStintLength = amountOfLapsOnFullStint * laptime;
        const fullNormalStintLength = normalStintLength + timeInPits;
        const amountOfStints = Math.ceil(raceTime / fullNormalStintLength);
        const lastStintDuration = raceTime - fullNormalStintLength * (amountOfStints - 1);
        const amountOfLapsOnLastStint = lastStintDuration / laptime;

        class Stint {
            constructor (rlStartTime, gameStartTime, last, amountOfLapsInStint, fuelRequired, stintNumber) {
                this.stintNumber = stintNumber;
                this.amountOfLapsInStint = Math.ceil(amountOfLapsInStint);
                this.stintLengthUnparsed = this.amountOfLapsInStint * laptime;
                this.stintLength = `${Math.floor(this.stintLengthUnparsed/60)}min ${this.stintLengthUnparsed%60}s`;
                this.rlStartTime = rlStartTime.toLocaleTimeString("en-gb");
                this.rlComingIn = addSeconds(rlStartTime, this.stintLengthUnparsed).toLocaleTimeString("en-gb");
                this.rlComingOut = last ? "" : addSeconds(parse(this.rlComingIn, "H:m:s", new Date()), timeInPits).toLocaleTimeString("en-gb");
                this.gameStartTime = gameStartTime.toLocaleTimeString("en-gb");
                this.gameComingIn = addSeconds(gameStartTime, this.stintLengthUnparsed).toLocaleTimeString("en-gb");
                this.gameComingOut = last ? "" : addSeconds(parse(this.gameComingIn, "H:m:s", new Date()), timeInPits).toLocaleTimeString("en-gb");
                this.timeLeftOverUnparsed = stintTimeInS - (this.amountOfLapsInStint * laptime);
                this.timeLeftOver = `${Math.floor(this.timeLeftOverUnparsed/60)}min ${this.timeLeftOverUnparsed%60}s`;
                this.fuelRequired = Math.ceil(fuelRequired);
            };
        };

        let nextStintRL = parse(props.realRaceStart.current.value, "H:m", new Date());
        let nextStintIG = parse(props.gameRaceStart.current.value, "H:m", new Date());
        const stintStarts = [];
        class StintStart {
            constructor (rlStart, gameStart) {
                this.rlStart = rlStart;
                this.gameStart = gameStart;
            };
        };
        stintStarts.push(new StintStart(nextStintRL, nextStintIG));

        for (let i = 0; i < amountOfStints; i++) {
            if (i < amountOfStints - 1) {
                props.setStints(x => [...x, new Stint(stintStarts[i].rlStart, stintStarts[i].gameStart, false, amountOfLapsOnFullStint, amountOfLapsOnFullStint * fuelConsumption, i+1)]);
                nextStintRL = addSeconds(nextStintRL, fullNormalStintLength);
                nextStintIG = addSeconds(nextStintIG, fullNormalStintLength);
                stintStarts.push(new StintStart(nextStintRL, nextStintIG));
            } else {
                props.setStints(x => [...x, new Stint(stintStarts[i].rlStart, stintStarts[i].gameStart, true, amountOfLapsOnLastStint, amountOfLapsOnLastStint * fuelConsumption, i+1)]);
            }
        };
    };

    return (
        <div className="form">
            <form>
                <label htmlFor="raceTimeH">
                    Race time:
                </label><br />
                <input
                    type="number"
                    id="raceTimeH"
                    placeholder="Hours"
                    value={props.raceTimeH}
                    onChange={(e) => handleInput("raceHours", e.target.value)}
                /> 
                <input 
                    type="number"
                    placeholder="Minutes"
                    value={props.raceTime}
                    onChange={(e) => handleInput("raceMinutes", e.target.value)}
                /><br />
                <label htmlFor="stintTime">
                    Stint time:
                </label><br />
                <input
                    type="number"
                    id="stintTime"
                    placeholder="Minutes"
                    value={props.stintTime}
                    onChange={(e) => handleInput("stint", e.target.value)}
                /><br />
                <label htmlFor="pitTime">
                    Time spent in pits:
                </label>(<a href="https://i.imgur.com/fzvWRAE.png">Time loss sheet</a>)<br />
                <input
                    type="number"
                    id="pitTime"
                    placeholder="Seconds"
                    value={props.pitTime}
                    onChange={(e) => handleInput("pit", e.target.value)}
                />
                <br />
                <label htmlFor="rRaceStart">
                    Real race start time:
                </label><br />
                <input
                    type="time"
                    id="rRaceStart"
                    ref={props.realRaceStart}
                /><br />
                <label htmlFor="gRaceStart">
                    In-game race start time:
                </label><br />
                <input
                    type="time"
                    id="gRaceStart"
                    ref={props.gameRaceStart}
                /><br />
                <label htmlFor="laptime">
                    Laptime
                </label><br />
                <input
                    type="number"
                    id="laptime"
                    placeholder="Minutes"
                    value={props.laptimeM}
                    onChange={e => handleInput("laptimeM", e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Seconds"
                    value={props.laptimeS}
                    onChange={e => handleInput("laptimeS", e.target.value)}
                /><br />
                <label htmlFor="fuelCons">
                    Fuel consumption
                </label><br />
                <input
                    type="number"
                    id="fuelCons"
                    placeholder="L/lap"
                    value={props.fuelLap}
                    onChange={e => handleInput("fuel", e.target.value)}
                /><br />
                <button onClick={(e) => handleSubmit(e)}>Calculate</button>
            </form>
        </div>
    )
}

export default Form;