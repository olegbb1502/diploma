import React, {Component} from 'react';
import firebase from './firebase';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class InfoBlock extends Component{
    constructor(){
        super();

        this.state = {
            name: '',
            reset: false,
            modalWindow: false
        }

        this.resetBoard = this.resetBoard.bind(this);
        this.handleClose = this.handleClose.bind(this);
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

    handleClose() {
        this.setState({
            modalWindow: false
        })
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
                {/*<div className={modalWindow ? "modal open" : "modal"}>*/}
                    {/*<div className="box">*/}
                        {/*<h3>Restart system</h3>*/}
                        {/*<p>After restarting system all data will deleted from database. When system launch it connects to WiFi automatically.</p>*/}
                        {/*<div className="buttons">*/}
                            {/*<button onClick={()=>{this.setState({modalWindow: false})}}>Cancel</button>*/}
                            {/*<button onClick={this.resetBoard}>Reload board</button>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
                <Dialog
                    open={modalWindow}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Restart system"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            After restarting system all data will deleted from database. When system launch it connects to WiFi automatically.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.resetBoard} variant="contained" color="secondary">
                            Reload Board
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default InfoBlock;