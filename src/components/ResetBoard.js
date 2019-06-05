import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ResetBoard extends Component{
    render(){
        const {modalWindow} = this.props;
        var handleToReset  =   this.props.handleToReset;
        var handleToClose  =   this.props.handleToClose;
        return(
            <Dialog
                open={modalWindow}
                onClose={()=>this.handleToClose()}
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
                    <Button onClick={()=>handleToClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>handleToReset()} variant="contained" color="secondary">
                        Reload Board
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ResetBoard;
