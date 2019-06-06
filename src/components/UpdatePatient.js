import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Select from '@material-ui/core/Select';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';

class UpdatePatient extends Component{
    constructor(props){
        super(props);

        this.state = {
            newData: {
                name: 'Oleg',
                age: '20',
                sex: 'male',
                smoke: false,
                bp: 0,
            }
        }
    }

    render(){
        const {updateInfoWindow, ourInputFunction, name, age, sex, smoke, bp} = this.props;
        var handleClose  =   this.props.handleClose;
        var updateInfo  =   this.props.updateInfo;
        // console.log(this.state.newData)
        return(
            <Dialog
                open={updateInfoWindow}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Update patient information`}</DialogTitle>
                <DialogContent>
                    <TextField
                        value={name}
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        name="name"
                        onChange={ourInputFunction}
                    />
                    <TextField
                        value={age}
                        margin="dense"
                        id="age"
                        label="Age"
                        fullWidth
                        onChange={ourInputFunction}
                        name="age"
                    />
                    <Select
                        value={sex}
                        onChange={ourInputFunction}
                        inputProps={{
                            name: 'sex'
                        }}
                    >
                        <MenuItem value={"male"}>Male</MenuItem>
                        <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                    <Switch
                        checked={smoke}
                        onChange={ourInputFunction}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        type="checkbox"
                        name="smoke"
                    />
                    <TextField
                        value={bp}
                        margin="dense"
                        id="name"
                        label="Blood pressure"
                        name="bp"
                        onChange={ourInputFunction}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>updateInfo()} variant="contained" color="secondary">
                        Update data
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default UpdatePatient;
