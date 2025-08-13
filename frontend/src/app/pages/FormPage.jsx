import Table from '../../components/Table.jsx';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsTable from '../../components/SettingsTable.jsx';
import Buffer from 'buffer'

function FormPage() {
  const navigate = useNavigate();
  const [dataSize,setDataSize]=React.useState(0)
  const [fileType,setFileType]=React.useState('')
  const [seed,setSeed]=React.useState('')
  const [apiResponse,setAPIResponse]=React.useState({})
  const [dataRows, setDataRows] = React.useState([{
                id: Date.now(),
                name: 'example name',
                min: 0,
                is_int:false,
                max: 100,
                unit: "-"
            }]);
function parseInput() {
    const result = {
        rows: dataSize,
        type: fileType,
        columns: dataRows.map((r) => ({
            name: r.name,
            min: r.min,
            max: r.max,
            is_int: r.is_int,
            unit: r.unit,
        })),
    };

    if (seed !== "") {
        result.seed = parseInt(seed);
    }

    return result;
}

const handleDownload = async (e) => {
    e.preventDefault();
    const json = parseInput();
    console.log(JSON.stringify(json))
    try {
        const response = await fetch(`http://localhost:8000/file`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });

        const arrayBuffer = await response.arrayBuffer();
        await window.files.saveFile(arrayBuffer, fileType); // <- tylko 2 argumenty
    } catch (e) {
      
        console.error(e);
    }
};



// w React
// async function handleSave() {
//     const res = await fetch('http://localhost:8000/file', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ type: 'xlsx' })
//     });

//     const buffer = Buffer.from(await res.arrayBuffer());
//     window.files.saveFile(null, buffer, 'xlsx'); // null jeśli nie masz browserWindow ref
// }


// const handleDemo = async (e) => {
//   e.preventDefault();

//     const json = parseInput();
//     console.log(JSON.stringify(json))

//     try {
//         const response = await fetch(`http://localhost:8000/demo`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(json),
//         });

//         const data = await response.json();
//         setAPIResponse(data);

//         navigate('/demo', { state: { apiData: data } });
//     } catch (e) {
//         console.error(e);
//     }
//     };

  
  return (
    <>
      <Table 
          rows={dataRows} 
          setRows={setDataRows}
      />
      <br/>
      <SettingsTable
      seed={seed}
      setSeed={setSeed}
      setDataSize={setDataSize}
      setFileType={setFileType}
        />
      {/* <button
       onClick={handleDemo}
       className="demo-button">
        View demo
      </button> */}
      <button
       onClick={handleDownload}
       className="download-button">
        Download
      </button>
    </>
  );
};

export default FormPage;