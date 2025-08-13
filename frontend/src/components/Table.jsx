import React from 'react';
import Row from '../components/Row';
import './Table.css';

function Table(
    {rows,setRows,handleAddRow,handleRemoveRow,...props}
) {
    function handleAddRow() {
        setRows(prev => [
            ...prev,
            {
                id: Date.now(),
                name: '',
                min: '',
                is_int:false,
                max: '',
                unit: ''
            }
        ]);
    }

    function handleRemoveRow(idToRemove) {
        if (rows.length>1){
            setRows(prev => prev.filter(row => row.id !== idToRemove));
        }
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
                        <th>Float/Integer</th>
                        <th>Edit/Save</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <Row
                        key={row.id}
                        rowData={row}
                        setRowData={setRows}
                        handleRemoveRow={() => handleRemoveRow(row.id)}
                        />
                    ))}
                </tbody>
            </table>
            <button className="button-add-record" onClick={handleAddRow}>Add record</button>

        </>
    );
}

export default Table;
