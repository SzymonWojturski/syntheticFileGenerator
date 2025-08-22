import { useState } from "react";
import Switch from '@mui/material/Switch';
import Cell from './Cell.jsx'
import DatePickerToggle from './DatePickerToggle.jsx'
import SwitchOptional from "./SwitchOptional.jsx";
import './OptionalSettings.css'

function OptionalSettings({
    seed, setSeed,
    dateMin, setDateMin,
    dateMax, setDateMax
  }){
    const [seedState,setSeedState]= useState(false);
    const [minDateState,setMinDateState]= useState(false);
    const [maxDateState,setMaxDateState]= useState(false);

    const dateProps = [
        { label: "Starting date", value: dateMin, setValue: setDateMin, state: minDateState, setState: setMinDateState },
        { label: "End date", value: dateMax, setValue: setDateMax, state: maxDateState, setState: setMaxDateState }
    ];

    return (
        <table className="optional-settings-table">
            <tbody>
                <tr>
                    <th>Seed:</th>
                    <td>
                        <Switch 
                            color="default"
                            checked={seedState}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setSeedState(checked);
                                if (!checked) {
                                setSeedState(null);
                        }}}
                        />
                    </td>
                    <td>
                        <Cell
                            dataType="int"
                            dataValue={seed}
                            isActive={seedState}
                            onChange={setSeed}
                        />
                    </td>
                </tr>

                {dateProps.map(({ label, value, setValue, state, setState }) => (
                    <tr key={label}>
                        <th>{label}:</th>
                        <td>
                            <SwitchOptional 
                                value={value}
                                setValue={setValue}
                                state={state}
                                setState={setState}
                            />
                        </td>
                        <td>
                            <DatePickerToggle
                                dataValue={value}
                                isActive={state}
                                onChange={setValue}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default OptionalSettings;
