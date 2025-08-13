import React from 'react';
import './SelectFileType.css'

function SelectFileType ({setFileType,...props}) {

    const [fileTypes,setFileTypes]=React.useState([])

    React.useEffect(() => {
    fetch("http://localhost:8000/types")
    .then(response => response.json())
    .then(data => {
        setFileTypes(data.types);
        setFileType(data.types[0]);
    })
}, []);


    return (<>
    <select className="file-type-select" onChange={(e) => {setFileType(e.target.value);
    }}>
        {
        fileTypes.map((f,i)=><option key={i}>{f}</option>)
        }
    </select>
    </>)
};

export default SelectFileType;