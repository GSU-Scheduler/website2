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
            className="w-12 outline-none bg-transparent text-zinc-50 p-1.5 rounded border shadow mr-2 placeholder-zinc-500"
            required
          />
          <span>:</span>
          <input
            type="text"
            value={time.minute}
            onChange={handleMinuteChange}
            maxLength="2"
            placeholder="MM"
            className="w-12 outline-none bg-transparent text-zinc-50 p-1.5 rounded border shadow mx-2 placeholder-zinc-500"
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
                backgroundColor: '',
                color: '#e2e8f0',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                '&:hover': {
                  backgroundColor: '#d4d4d8',
                },
              }),
            }}
          />
        </div>
      </div>
    );
  };
  

export default TimeInput;
