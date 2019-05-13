import React, {Component} from 'react';
import { FaGripLines, FaTimes } from 'react-icons/fa';
import HeartRate from './components/HeartRate';
import InfoBlock from './components/InfoBlock';
import './App.css';


class App extends Component{
  constructor(){
    super();
    this.state={
        open: false
    }
  }
  render(){
      const {open} = this.state;
      return (
          <div className="App">
              {open?<FaTimes onClick={()=>this.setState({open:false})} className="nav open"/>:<FaGripLines onClick={()=>this.setState({open:true})} className="nav"/>}
              <InfoBlock isOpen={open}/>
              <HeartRate isOpen={open}/>
          </div>
      );
  }
}

export default App;
