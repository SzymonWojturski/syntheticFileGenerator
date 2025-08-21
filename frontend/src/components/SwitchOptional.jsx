import Switch from "@mui/material/Switch";

function SwitchOptional({ value, setValue, state, setState }) {
  const handleToggle = (e) => {
    const checked = e.target.checked;
    setState(checked);
    if (!checked) {
      setValue(null);
    }
  };

  return (
    <Switch
      color="default"
      checked={state}
      onChange={handleToggle}
    />
  );
}

export default SwitchOptional;
