
import React from 'react';
import TableRow from './TableRow';
import './EditableTable.css';

function EditableTable(
    {rows,setRows,handleAddRow,handleRemoveRow,...props}
) {
    function handleAddRow() {
        setRows(prev => [
            ...prev,
            {
                id: Date.now(),
                name: '',
                min: '',
                max: '',
                unit: ''
            }
        ]);
    }

    function handleRemoveRow(idToRemove) {
        setRows(prev => prev.filter(row => row.id !== idToRemove));
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Unit</th>
                        <th>Edit/Save</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <TableRow
                        key={row.id}
                        rowData={row}
                        setRowData={setRows}
                        handleRemoveRow={() => handleRemoveRow(row.id)}
                        />
                    ))}
                </tbody>
            </table>

            <button onClick={handleAddRow}>Add record</button>
        </>
    );
}

export default EditableTable;
