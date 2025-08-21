import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import MandatorySettings from '../../components/MandatorySettings.jsx';
import OptionalSettings from '../../components/OptionalSettings.jsx';


function FormPage() {
  const navigate = useNavigate();
  const [apiResponse,setAPIResponse]=useState({})
  // Mandatory
  const [rows, setRows] = useState(10)
  const [wallets, setWallets] = useState(10)
  const [usdMin, setUsdMin] = useState(10)
  const [usdMax, setUsdMax] = useState(100)
  const [fileExtention, setFileExtention] = useState('')
  // Optional
  const [seed,setSeed]=useState('')
  const [dateMin,setDateMin]=useState(null)
  const [dateMax,setDateMax]=useState(null)

  const mandatoryProps = {
    rows, setRows,
    wallets, setWallets,
    usdMin, setUsdMin,
    usdMax, setUsdMax,
    fileExtention, setFileExtention
  };
  const optionalProps = {
    seed, setSeed,
    dateMin, setDateMin,
    dateMax, setDateMax
  };
          
function parseInput() {
    const result = {
        rows: rows,
        extention: fileExtention,
        wallets:wallets,
        usd_min:usdMin,
        usd_max:usdMax,
    };

    if (seed) {
        result.seed = parseInt(seed);
    }
    if (dateMin) {
      result.date_min = new Date(dateMin).toISOString();
    }
    if (dateMax) {
      result.date_max = new Date(dateMax).toISOString();
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
        await window.files.saveFile(arrayBuffer, fileExtention);
    } catch (e) {
      
        console.error(e);
    }
};

  return (
    <>
      <MandatorySettings
      {...mandatoryProps}
      />
      <OptionalSettings
      {...optionalProps}
      />
      <button
       onClick={handleDownload}
       className="download-button">
        Download
      </button>
    </>
  );
};

export default FormPage;