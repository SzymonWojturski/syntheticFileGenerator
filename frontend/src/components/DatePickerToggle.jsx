import DatePicker from "react-datepicker";
import './DatePickerToggle.css'
import "react-datepicker/dist/react-datepicker.css";

function DatePickerToggle({ dataValue, isActive ,onChange}) {
    return (
        <>
            {isActive ? (
                <DatePicker 

                selected={dataValue}
                 onChange={(date) => onChange(date)} 
                />
            ) : (
                  <div className="placeholder-div"
                  />
            )}
        </>
    );
}

export default DatePickerToggle;
