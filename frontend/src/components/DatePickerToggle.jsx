import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function DatePickerToggle({ dataValue, isActive ,onChange}) {
    return (
        <>
            {isActive ? (
                <DatePicker 

                showIcon
                selected={dataValue}
                 onChange={(date) => onChange(date)} 
                />
            ) : (
                <></>
            )}
        </>
    );
}

export default DatePickerToggle;
