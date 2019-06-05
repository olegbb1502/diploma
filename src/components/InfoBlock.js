import React, {Component} from 'react';
import firebase from './firebase';
import UpdatePatient from './UpdatePatient';
import ResetBoard from './ResetBoard';

class InfoBlock extends Component{
    constructor(props){
        super(props);

        this.state = {
            name: '',
            age: '',
            sex: '',
            smoke: false,
            bp: '',
            modalWindow: false,
            updateInfoWindow: false
        }

        this.resetBoard = this.resetBoard.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount(){
        const info = firebase.database().ref("info");
        info.on('value', (snapshot)=>{
           let item = snapshot.val();
           this.setState({
               name: item.patient.name,
               age: item.patient.age,
               sex: item.patient.sex,
               smoke: item.patient.smoke,
               bp: item.patient.bp,
               reset: item.board.reset
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
    userUpdate = (newData) => {
        console.log(newData)
        this.setState({
            updateInfoWindow: false
        })
    }
    handlerState=(key, value)=>{
        this.setState({
            key:value
        })
        console.log(this.state)
    }

    render(){
        const {name, age, sex, smoke, bp, modalWindow, updateInfoWindow} = this.state;
        const {isOpen} = this.props;
        return(
            <div className={isOpen?"info open":"info"}>
                <div className="top">
                    <h2>{name}</h2>
                    <div className="data">
                        <p>Age: {age}</p>
                        <p>Sex: {sex}</p>
                        <p>Smoking: {smoke? "smokes" : "doesn't smoke"}</p>
                        <p>Blood pressure: {bp}</p>
                    </div>
                </div>
                <div className="bottom">
                    <button className="settings" onClick={()=>{this.setState({updateInfoWindow: true})}}>Settings</button>
                    <button className="reset" onClick={()=>{this.setState({modalWindow: true})}}>Reset</button>
                </div>
                <UpdatePatient
                    handler={this.handlerState}
                    updateInfoWindow={updateInfoWindow}
                    handleClose = {this.handleToUpdate}
                    updateInfo={this.userUpdate}
                    name={name}
                    age={age}
                    sex={sex}
                    smoke={smoke}
                    bp={bp}
                />
                <ResetBoard modalWindow={modalWindow} handleToClose={this.handleClose} handleToReset={this.resetBoard}/>
            </div>
        );
    }
}

export default InfoBlock;