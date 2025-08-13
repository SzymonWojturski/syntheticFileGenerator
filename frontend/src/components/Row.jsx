import Cell from "./Cell";
import React from "react";
import './Row.css'
import LockableSwitch from "./LockableSwitch.jsx";
import Switch from '@mui/material/Switch';

function Row({ rowData, setRowData, handleRemoveRow }) {
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

      const columns = [
    { key: "name", placeholder: "name", type: "string", className: "cell-text", component: Cell },
    { key: "min", placeholder: "min", type: "number", className: "cell-number", component: Cell },
    { key: "max", placeholder: "max", type: "number", className: "cell-number", component: Cell },
    { key: "unit", placeholder: "unit", type: "string", className: "cell-text", component: Cell },
    { key: "is_int", type: "bool", className: "toggle-switch", component: LockableSwitch },
  ];

  return (
    <tr className="table-row">
      {columns.map(({ key, placeholder, type, className, component: Component }) => (
        <td key={key} className={className}>
          <Component
            dataPlaceholder={placeholder}
            dataKey={key}
            dataType={type}
            dataValue={rowData[key]}
            mode={rowState}
            onChange={val => handleChange(key, val)}
          />
        </td>
      ))}

        <td className="toggle-switch">
            <Switch
            onChange={toggleRowState}
            color="default"
            />
        </td>
        <td className="button-remove-row">
            <button onClick={handleRemoveRow}>Remove</button>
        </td>
    </tr>
    );
}

export default Row;
