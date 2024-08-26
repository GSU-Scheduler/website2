import React from 'react';
import Select from 'react-select';

const TimeInput = ({ label, time, setTime }) => {
    const handleHourChange = (e) => {
      const hour = e.target.value.replace(/\D/g, '');
      if (hour === '' || (Number(hour) >= 1 && Number(hour) <= 12)) {
        setTime({ ...time, hour });
      }
    };
  
    const handleMinuteChange = (e) => {
      const minute = e.target.value.replace(/\D/g, '');
      if (minute === '' || (Number(minute) >= 0 && Number(minute) <= 59)) {
        setTime({ ...time, minute });
      }
    };
  
    const handlePeriodChange = (selectedOption) => {
      setTime({ ...time, period: selectedOption.value });
    };
  
    const periodOptions = [
      { value: 'AM', label: 'AM' },
      { value: 'PM', label: 'PM' },
    ];
  
    return (
      <div className="mb-4">
        <label className="block mb-2">{label}</label>
        <div className="flex items-center">
          <input
            type="text"
            value={time.hour}
            onChange={handleHourChange}
            maxLength="2"
            placeholder="HH"
            className="w-12 bg-gray-700 text-white p-2 rounded mr-2"
            required
          />
          <span>:</span>
          <input
            type="text"
            value={time.minute}
            onChange={handleMinuteChange}
            maxLength="2"
            placeholder="MM"
            className="w-12 bg-gray-700 text-white p-2 rounded mx-2"
            required
          />
          <Select
            value={periodOptions.find((option) => option.value === time.period)}
            onChange={handlePeriodChange}
            options={periodOptions}
            className="basic-single"
            classNamePrefix="select"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: '#4A4A4A',
                borderColor: '#4A4A4A',
                color: '#fff',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#6B7280' : '#4A4A4A',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#6B7280',
                },
              }),
            }}
          />
        </div>
      </div>
    );
  };
  

export default TimeInput;
