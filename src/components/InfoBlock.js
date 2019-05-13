import React, {Component} from 'react';
import firebase from './firebase';

class InfoBlock extends Component{
    constructor(){
        super();

        this.state = {
            name: '',
            reset: false,
            modalWindow: false
        }

        this.resetBoard = this.resetBoard.bind(this);
    }

    componentDidMount(){
        const info = firebase.database().ref("info");
        info.on('value', (snapshot)=>{
           let item = snapshot.val();
           this.setState({
               name: item.name,
               reset: item.reset
           })
        });
    }

    resetBoard(){
        firebase.database().ref("info").set({
            reset: true
        });

        this.setState({
            reset: true
        })
    }

    render(){
        const {name, reset, modalWindow} = this.state;
        const {isOpen} = this.props;
        return(
            <div className={isOpen?"info open":"info"}>
                <h2>{name}</h2>
                <div className="bottom">
                    <button className="settings">Settings</button>
                    <button className="reset" onClick={()=>{this.setState({modalWindow: true})}}>Reset</button>
                </div>
                <div className={modalWindow ? "modal open" : "modal"}>
                    <div className="box">
                        <h3>Restart system</h3>
                        <p>After restarting system all data will deleted from database. When system launch it connects to WiFi automatically.</p>
                        <div className="buttons">
                            <button onClick={()=>{this.setState({modalWindow: false})}}>Cancel</button>
                            <button onClick={this.resetBoard}>Reload board</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoBlock;