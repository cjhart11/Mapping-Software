import React, {Component} from 'react';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonGroup} from 'reactstrap'

export default class TripOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tripDropdownOpen: false
        };
        this.toggleOptions = this.toggleOptions.bind(this);
        this.createOptimizationButtons = this.createOptimizationButtons.bind(this);
    }

    render() {
        return (this.renderTripOptions());
    }

    toggleOptions() {
        this.setState(prevState => ({
            tripDropdownOpen: !prevState.tripDropdownOpen
        }));
    }

    renderTripOptions() {
        if (this.props.file !== null) {
            return (
                <Dropdown isOpen={this.state.tripDropdownOpen} toggle={this.toggleOptions}>
                    <DropdownToggle className='btn-csu w-35 text-left'>
                        Trip options
                    </DropdownToggle>
                    <DropdownMenu className='csu-text-header w-40 text-center'>
                        <DropdownItem header>Optimizations</DropdownItem>
                        {this.renderOptimizationButtons()}
                    </DropdownMenu>
                </Dropdown>
            );
        } else {
            return null;
        }
    }

    renderOptimizationButtons() {
        return (
            <ButtonGroup horizontal className='w100'>
                {this.createOptimizationButtons(this.props.planOptions.optimizations)}
            </ButtonGroup>
        );
    }

    createOptimizationButtons(names) {
        return names.sort().map((unit) =>
            <Button
                className='btn-csu w-100 text-center'
                key={"button_" + unit}
                active={this.props.planOptions.activeOptimization === unit}
                value={unit}
                onClick={(event) => this.props.updateOption('activeOptimization', event.target.value)}
            >
                {unit.toString().charAt(0).toUpperCase() + unit.toString().slice(1)}
            </Button>
        );
    }
}

