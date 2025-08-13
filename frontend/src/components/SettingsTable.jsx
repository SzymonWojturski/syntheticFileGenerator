import SelectFileType from "./SelectFileType"
import './SettingsTable.css'
import Switch from "@mui/material/Switch"
import Cell from "./Cell"
import React from "react"

function SettingsTable({seed,setSeed,setDataSize,setFileType}){
    const [seedState, setSeedState] = React.useState("inactive");
    return(<>
        <table>
            <tbody>
                <tr>
                    <th>Number of rows:</th>
                    <td>
                        <input 
                            className='number-of-rows'
                            type="number" 
                            onChange={(e) => {setDataSize(parseInt(e.target.value))}}
                            />
                    </td>
                </tr>
                <tr>
                    <th>
                        Seed:
                        <Switch
                            className="seed-switch"
                            color="default"
                            onChange={e => setSeedState(prev => (prev === "inactive" ? "active" : "inactive"))}
                        />
                    </th>
                    <td>
                        <Cell
                            dataKey={"seed"}
                            dataType={"number"}
                            dataValue={seed}
                            mode={seedState}
                            dataPlaceholder={"42"}
                            onChange={setSeed}
                        />
                    </td>
                </tr>
            <tr>
                <th>Output file type:</th>
                <td>
                    <SelectFileType setFileType={setFileType}/>
                </td>
            </tr>
        </tbody>
      </table>
      </>
    )
}

export default SettingsTable