import { useRef } from 'react';
import EditableTable from './EditableTable.jsx';
import FileTypeSelect from './FileTypeSelect.jsx';
import "./App.css"
import React from 'react';

function App() {
  const [dataSize,setDataSize]=React.useState(0)
  const [fileType,setFileType]=React.useState('')
  const [dataRows, setDataRows] = React.useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const json = {
    rows: dataSize,
    type: fileType,
    columns: dataRows.map((r)=>({
                name: r.name,
                min: r.min,
                max: r.max,
                unit: r.unit,
    })),
    }
    try {
      const response = await fetch(`http://localhost:8000/params`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });
      console.log(JSON.stringify(json))
    }catch(e){
      console.log(e)
    }
      
  };
  return (
    <>
      <EditableTable 
          rows={dataRows} 
          setRows={setDataRows}
      />
      <br/>
      <div>
        Number of rows: 
        <input 
          className='number-of-rows'
          onChange={(e) => {setDataSize(parseInt(e.target.value))}}
        />
        Output file type:
        <FileTypeSelect setFileType={setFileType}/>
      </div>
      <p />
      <button onClick={handleSubmit}>Submit</button>
    </>
  );
}

export default App;
