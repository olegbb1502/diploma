import React, {Component} from 'react';
import firebase from './firebase';
import {FaBatteryThreeQuarters} from 'react-icons/fa';
import UpdatePatient from './UpdatePatient';
import ResetBoard from './ResetBoard';

class InfoBlock extends Component{
    constructor(props){
        super(props);

        this.state = {
            data: {
                name: '',
                age: '',
                sex: '',
                smoke: false,
                bp: '',
                battery: 0,
            },
            modalWindow: false,
            updateInfoWindow: false,
        }

        this.resetBoard = this.resetBoard.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleInputFunction = this.handleInputFunction.bind(this);
    }

    componentDidMount(){
        const {data} = this.state;
        const info = firebase.database().ref("info");
        info.on('value', (snapshot)=>{
           let item = snapshot.val();
           const dataFromBd = {
               ...data,
               name: item.patient.name,
               age: item.patient.age,
               sex: item.patient.sex,
               smoke: item.patient.smoke,
               bp: item.patient.bp,
               reset: item.board.reset,
               battery: item.board.battery
           }
           this.setState({
               data: dataFromBd
           })
        });
    }

    handleClose(val) {
        this.setState({
            modalWindow: false
        })
    }

    resetBoard(val){
        firebase.database().ref("info/board").set({
            reset: true
        });
        this.handleClose();
    }

    handleToUpdate = (val) => {
        this.setState({
            updateInfoWindow: false
        })
    }
    userUpdate = () => {
        this.setState({
            updateInfoWindow: false
        })
        firebase.database().ref("info/patient").set(this.state.data);
    }
    handleInputFunction(e) {
        let target = e.target;
        const {data} = this.state;
        const newData = {
            ...data,
            [target.name]: target.type === "checkbox" ? target.checked : target.value
        }
        this.setState({
            data: newData
        });
        console.log(this.state)
    }

    render(){
        const {data, modalWindow, updateInfoWindow} = this.state;
        const {isOpen} = this.props;
        return(
            <div className={isOpen?"info open":"info"}>
                <div className="top">
                    <h2>{data.name}</h2>
                    <div className="data">
                        <p>Age: {data.age}</p>
                        <p>Sex: {data.sex}</p>
                        <p>Smoking: {data.smoke? "smokes" : "doesn't smoke"}</p>
                        <p>Blood pressure: {data.bp}</p>
                        <div>
                            <p>Battery level</p>
                            <div className="battery">
                                <FaBatteryThreeQuarters/>
                                <p>{data.battery}%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <button className="settings" onClick={()=>{this.setState({updateInfoWindow: true})}}>Settings</button>
                    <button className="reset" onClick={()=>{this.setState({modalWindow: true})}}>Reset</button>
                </div>
                <UpdatePatient
                    ourInputFunction={this.handleInputFunction}
                    updateInfoWindow={updateInfoWindow}
                    handleClose = {this.handleToUpdate}
                    updateInfo={this.userUpdate}
                    name={data.name}
                    age={data.age}
                    sex={data.sex}
                    smoke={data.smoke}
                    bp={data.bp}
                />
                <ResetBoard modalWindow={modalWindow} handleToClose={this.handleClose} handleToReset={this.resetBoard}/>
            </div>
        );
    }
}

export default InfoBlock;