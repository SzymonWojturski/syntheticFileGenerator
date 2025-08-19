import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ToggleDatePicker ({date, setDate}){

      return (
        <>
            {mode === "active" ? (
                  <DatePicker 
                    selected={date} 
                    onChange={(date) => setDate(date)} 
                  />):(<></>)}
              </>)
};
export default ToggleDatePicker