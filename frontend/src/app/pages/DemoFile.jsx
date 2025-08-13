import { Link ,useLocation} from "react-router-dom"
import './DemoFile.css'

function DemoFile (){
    const location = useLocation();
    const apiData = location.state?.apiData["demo"];

    
    return(
    <div className="div-demo">

        <Link to="/" className="link-back">
            <button >
                Back
            </button>
        </Link>
        
        <table className="table-demo-file">
            <thead>
                <tr>
                    <th>Row</th>
                    {apiData.map((item, idx) => (
                        <th key={idx}>{item.name} &#91;{item.unit}&#93;</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[...Array(apiData[0]?.data.length || 0)].map((_, rowIdx) => (
                <tr key={rowIdx}>
                    <td>{rowIdx + 1}</td>
                    {apiData.map((item, colIdx) => (
                    <td key={colIdx}>{item.data[rowIdx]}</td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
    </div>)
}
export default DemoFile