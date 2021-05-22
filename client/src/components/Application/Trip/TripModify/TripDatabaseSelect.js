import React, {Component} from 'react';
import {Input} from 'reactstrap'

export default class TripDatabaseSelect extends Component {


    constructor(props) {
        super(props);

        this.onSelect = this.onSelect.bind(this);
    }


    render(){
        if(this.props.values.length > 0) {
            return (
                <Input type="select" placeHolder = {this.props.active}
                       name="selectMulti"
                       id={"active" + `${this.props.type}`}
                       onChange={this.onSelect}
                       defaultValue={this.props.active}>
                    {this.buildSelection()}
                </Input>
            );
        }

    }

    onSelect(e){
            return this.props.updateOption(e.target.id, e.target.value)
    }

    buildSelection(){
        let items = [];
        for (let index = 0; index < this.props.values.length; index++) {
            items.push(<option key = {`${this.props.values[index]}${index}`}>{this.props.values[index]}</option>);
        }
        return items;
    }
}