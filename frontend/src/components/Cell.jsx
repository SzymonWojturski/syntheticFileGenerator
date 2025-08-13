import "./Cell.css"

function Cell({ dataKey, dataType, dataValue, mode, dataPlaceholder ,onChange }) {
    return (
        <>
            {mode === "active" ? (
                <input
                    className="cell-input"
                    type={dataType === "number" ? "number" : "text"}
                    value={dataValue}
                    placeholder={dataPlaceholder}
                    onChange={e => onChange(dataType === "number"?parseInt(e.target.value)  :e.target.value)}
                />
            ) : (
                <div className="cell-data">{dataValue}</div>
            )}
        </>
    );
}

export default Cell;
