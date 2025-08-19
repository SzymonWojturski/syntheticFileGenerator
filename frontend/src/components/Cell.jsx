import "./Cell.css"

function Cell({ dataType, dataValue, isActive, dataPlaceholder ,onChange}) {
    return (
        <>
            {isActive ? (
                <input
                    className="cell-input"
                    type= "number" 
                    value={dataValue}
                    placeholder={dataPlaceholder}
                    onChange={e => onChange(dataType === "int"?parseInt(e.target.value)  :parseFloat(e.target.value))}
                />
            ) : (
                // <div className="cell-data">{dataValue}</div>
                <></>
            )}
        </>
    );
}

export default Cell;
