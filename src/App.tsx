import React from 'react';

import './App.css';
import EmployeeList from './components/EmployeeList';

function App() {
  return (
    <div className='flex justify-center p-2'>
      <div className=' flex flex-col container items-center '>
        <div className='prose header-info flex flex-col items-center mb-4'>
          <h1>HRM:1C Tool</h1>
        </div>

        <EmployeeList />
      </div>
    </div>
  );
}

export default App;
