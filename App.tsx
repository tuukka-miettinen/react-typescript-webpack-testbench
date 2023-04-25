import React, { Component } from 'react';
import BarChart from './BarChart';

class App extends Component {
   render() {
      return (
         <div>
            <h1>Hello World</h1>
            <BarChart
               data={[
                  { name: "Overdue", value: 1 },
                  { name: "Due this week", value: 1 },
                  { name: "Due next week", value: 1 },
                  { name: "Due this month", value: 0 },
                  { name: "Other", value: 2 },
               ]}
               width={500}
               height={250}
            />
         </div>
      );
   }
}
export default App;  