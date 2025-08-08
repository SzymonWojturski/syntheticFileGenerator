
function EditableCell({ dataKey, dataType, dataValue, mode, onChange }) {
    return (
        <div className="editable-cell">
            {mode === "active" ? (
                <input
                    type={dataType === "number" ? "number" : "text"}
                    value={dataValue}
                    onChange={e => onChange(dataType === "number"?parseInt(e.target.value)  :e.target.value)}
                />
            ) : (
                dataValue
            )}
        </div>
    );
}

export default EditableCell;
