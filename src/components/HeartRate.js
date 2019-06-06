import React, {Component} from 'react';
import { FaHeartbeat } from 'react-icons/fa';
import LineChart from 'react-linechart';
import '../../node_modules/react-linechart/dist/styles.css';
import firebase from './firebase';

class HeartRate extends Component {
    constructor(){
        super();
        this.state = {
            items: [],
            bpm: 0,
            connect: false
        }
    }

    componentDidMount(){
        const info = firebase.database().ref('info');
        const ecg = firebase.database().ref('data/ecg');
        const bpm = firebase.database().ref('data/bpm')
        ecg.on('value', (snapshot) => {
            let items = snapshot.val();
            let newState = [];
            for (let item in items) {
                let date = new Date();
                newState.push({
                    key: item,
                    data: items[item].value,
                    time: date.getDate()
                });
            }

            this.setState({
                items: newState
            });
        });

        bpm.on('value', (snapshot) => {
            let item = snapshot.val();
            this.setState({
                bpm: item
            })
        })

        info.on('value', (snapshot) => {
            let items = snapshot.val();
            for(let item in items){
                this.setState({
                    connect: items[item].connect
                })
            }
        })

    }

    render(){
        const {connect, items, bpm} = this.state;
        const {isOpen} = this.props;
        const data = [
            {
                color: "#2ecc71",
                points: [{}]
            }
        ];

        items.map((item, i)=>{
            return data[0].points[i] = {x: i, y: item.data}
        });

        return(
            <div className={isOpen ? "heart-monitor open" : "heart-monitor"}>
                <div className="bpm">
                    <FaHeartbeat className="heart"  />
                    {bpm}
                 </div>
                {!connect ? "" : <p className="not-connect">Lose connection</p>}
                <LineChart
                    className="ecg"
                    height={400}
                    data={data}
                    hideXLabel={true}
                    hideYLabel={true}
                    // hideXAxis={true}
                    // hideYAxis={true}
                    hidePoints={true}
                    interpolate={"Linear"}
                />
            </div>
        );
    }
}

export default HeartRate;