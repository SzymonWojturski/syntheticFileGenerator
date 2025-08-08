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
                className="cell-text">
                <EditableCell
                    dataPlaceholder={"name"}
                    dataKey="name"
                    dataType="string"
                    dataValue={rowData.name}
                    mode={rowState}
                    onChange={val => handleChange("name", val)}
                />
            </td>
            <td
                className="cell-number">
                <EditableCell
                    dataPlaceholder={"min"}
                    dataKey="min"
                    dataType="number"
                    dataValue={rowData.min}
                    mode={rowState}
                    onChange={val => handleChange("min", val)}
                />
            </td>
            <td
                className="cell-number">
                <EditableCell
                    dataPlaceholder={"max"}
                    dataKey="max"
                    dataType="number"
                    dataValue={rowData.max}
                    mode={rowState}
                    onChange={val => handleChange("max", val)}
                />
            </td>
            <td
                className="cell-text">
                <EditableCell
                    dataPlaceholder={"unit"}
                    dataKey="unit"
                    dataType="string"
                    dataValue={rowData.unit}
                    mode={rowState}
                    onChange={val => handleChange("unit", val)}
                />
            </td>
            <td className="button-toggle-row-state">
                <button onClick={toggleRowState}>
                    {rowState === "inactive" ? "Edit" : "Save"}
                </button>
            </td>
            <td className="button-remove-row">
                <button onClick={handleRemoveRow}>Remove</button>
            </td>
        </tr>
    );
}

export default TableRow;
