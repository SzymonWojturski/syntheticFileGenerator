import Switch from '@mui/material/Switch';

function LockableSwitch({mode,onChange,...params}){
    return(<>
    {mode === "active" ? (
    <Switch 
        color="default"
        onChange={e => onChange(e.target.checked)}
    />):(
    <Switch
        disabled
        color="default" 
    />)
    }
    </>)
}
export default LockableSwitch
                