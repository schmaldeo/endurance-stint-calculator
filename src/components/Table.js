import { useState } from "react";
import { CSVLink } from "react-csv";

const Table = props => {
    const [stintsCSV, setStintsCSV] = useState([]);
    const handleSubmit = () => {
        const inputs = document.querySelectorAll(".driverList");
        const stints = [...props.stints];
        inputs.forEach((e, index) => {
            stints[index].driver = e.value;
        });
        stints.forEach(e => {
            delete e.timeLeftOverUnparsed;
            delete e.stintLengthUnparsed;
        });
        setStintsCSV(stints);
    };

    return (
        <div className="tableComponent">
            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th colSpan={11}>Stints</th>
                        </tr>
                        <tr>
                            <th rowSpan={2}>Stint #</th>
                            <th rowSpan={2}>Stint time</th>
                            <th colSpan={3}>Game time</th>
                            <th colSpan={3}>Real life time</th>
                            <th rowSpan={2}>Amount of laps</th>
                            <th rowSpan={2}>Time left at the end</th>
                            <th rowSpan={2}>Fuel required</th>
                            <th rowSpan={2}>Driver</th>
                        </tr>
                        <tr>
                            <th>Start time</th>
                            <th>In</th>
                            <th>Out</th>
                            <th>Start time</th>
                            <th>In</th>
                            <th>Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.stints.map((x) => {
                            return <tr key={Math.random()}>
                                <td>{x.stintNumber}</td>
                                <td>{x.stintLength}</td>
                                <td>{x.gameStartTime}</td>
                                <td>{x.gameComingIn}</td>
                                <td>{x.gameComingOut}</td>
                                <td>{x.rlStartTime}</td>
                                <td>{x.rlComingIn}</td>
                                <td>{x.rlComingOut}</td>
                                <td>{x.amountOfLapsInStint}</td>
                                <td>{x.timeLeftOver}</td>
                                <td>{`${x.fuelRequired}L`}</td>
                                <td><input 
                                    type="input"
                                    className="driverList"
                                ></input></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="errors">
                {props.errors}
            </div>
            <div className="csvButton">
                <CSVLink
                    data={stintsCSV}
                    filename={"stints.csv"}
                    target="_blank"
                    onClick={handleSubmit}
                >
                    Export to CSV
                </CSVLink>
            </div>
        </div>
    )
}

export default Table;