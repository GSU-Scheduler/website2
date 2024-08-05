import React, { useState } from 'react';

export type ClassInfo = {
  name: string;
  startTime: string;
  endTime: string;
  days: string[];
};

type AddClassFormProps = {
  onAddClass: (newClass: ClassInfo) => void;
};

const AddClassForm: React.FC<AddClassFormProps> = ({ onAddClass }) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [days, setDays] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClass({ name, startTime, endTime, days });
    setName('');
    setStartTime('');
    setEndTime('');
    setDays([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        placeholder="Class Name" 
        required 
      />
      <input 
        type="text" 
        value={startTime} 
        onChange={(e) => setStartTime(e.target.value)} 
        placeholder="Start Time (e.g., 8am)" 
        required 
      />
      <input 
        type="text" 
        value={endTime} 
        onChange={(e) => setEndTime(e.target.value)} 
        placeholder="End Time (e.g., 9:15am)" 
        required 
      />
      <input 
        type="text" 
        value={days.join(', ')} 
        onChange={(e) => setDays(e.target.value.split(',').map(day => day.trim()))} 
        placeholder="Days (e.g., M, W)" 
        required 
      />
      <button type="submit">Add Class</button>
    </form>
  );
};

export default AddClassForm;
