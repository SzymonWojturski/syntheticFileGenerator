import EditableCell from "./EditableCell";
import React from "react";
import './TableRow.css'

function TableRow({ rowData, setRowData, handleRemoveRow }) {
    const [rowState, setRowState] = React.useState("active");

    function handleChange(field, value) {
        setRowData(prevRows =>
            prevRows.map(row =>
                row.id === rowData.id ? { ...row, [field]: value } : row
            )
        );
    }

    function toggleRowState() {
        setRowState(prev => (prev === "inactive" ? "active" : "inactive"));
    }

    return (
        <tr className="table-row">
            <td
                    className="name">
                <EditableCell
                    dataKey="name"
                    dataType="string"
                    dataValue={rowData.name}
                    mode={rowState}
                    onChange={val => handleChange("name", val)}
                />
            </td>
            <td
                    className="min">
                <EditableCell
                    dataKey="min"
                    dataType="number"
                    dataValue={rowData.min}
                    mode={rowState}
                    onChange={val => handleChange("min", val)}
                />
            </td>
            <td
                    className="max">
                <EditableCell
                    dataKey="max"
                    dataType="number"
                    dataValue={rowData.max}
                    mode={rowState}
                    onChange={val => handleChange("max", val)}
                />
            </td>
            <td
                    className="unit">
                <EditableCell
                    dataKey="unit"
                    dataType="string"
                    dataValue={rowData.unit}
                    mode={rowState}
                    onChange={val => handleChange("unit", val)}
                />
            </td>
            <td>
                <button onClick={toggleRowState}>
                    {rowState === "inactive" ? "EDIT" : "SAVE"}
                </button>
            </td>
            <td>
                <button onClick={handleRemoveRow}>Remove</button>
            </td>
        </tr>
    );
}

export default TableRow;
