import Cell from './Cell.jsx';
import SelectFileType from './SelectFileType.jsx';

function MandatorySettings({
  rows, setRows,
  wallets, setWallets, 
  usdMin, setUsdMin, 
  usdMax, setUsdMax, 
  fileExtention, setFileExtention 
}) {

  const numericProps = [
    { type:"int", label: "Number of rows", value: rows, setter: setRows },
    { type:"int", label: "Wallets", value: wallets, setter: setWallets },
    { type:"float", label: "USD min", value: usdMin, setter: setUsdMin },
    { type:"float", label: "USD max", value: usdMax, setter: setUsdMax },
  ];

  return (
    <table className="mandatory-settings-table">
      <tbody>
        {numericProps.map(({ type,label, value, setter }) => (
          <tr key={label}>
            <th>{label}:</th>
            <td>
              <Cell
                dataType={type}
                dataValue={value}
                isActive={true}
                onChange={setter}
              />
            </td>
          </tr>
        ))}
        <tr>
            <th>
                File type:
            </th>
            <td>
                <SelectFileType setFileType={setFileExtention} />
            </td>
        </tr>
      </tbody>
    </table>
  );
}

export default MandatorySettings;
