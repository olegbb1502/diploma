import React, {Component} from 'react';
import firebase from './firebase';
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

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        const {name, age, sex, smoke, bp} = this.props;
        this.setState({
            newData: {
                name: name,
                age: age,
                sex: sex,
                smoke: smoke,
                bp: bp
            }
        })
    }

    handleChange = event => {
        const {newData} = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const newItem = {
            ...newData,
            [name]: value
        };
        this.setState({
            newData: newItem
        })
    }

    render(){
        const {updateInfoWindow} = this.props;
        const {newData} = this.state;
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
                        value={newData.name}
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        onChange={this.handleChange}
                        name="name"
                    />
                    <TextField
                        value={newData.age}
                        margin="dense"
                        id="age"
                        label="Age"
                        fullWidth
                        onChange={this.handleChange}
                        name="age"
                    />
                    <Select
                        value={newData.sex}
                        onChange={this.handleChange}
                        inputProps={{
                            name: 'sex',
                            id: 'sex',
                        }}
                    >
                        <MenuItem value={"male"}>Male</MenuItem>
                        <MenuItem value={"female"}>Female</MenuItem>
                    </Select>
                    <Switch
                        checked={newData.smoke}
                        onChange={this.handleChange}
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        type="checkbox"
                        name="smoke"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={()=>updateInfo(newData)} variant="contained" color="secondary">
                        Update data
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default UpdatePatient;
