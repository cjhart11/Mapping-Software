import React, {Component} from 'react';
import {Table, Pagination, PaginationItem, PaginationLink} from "reactstrap";
import ItineraryToggle from "./ItineraryToggle";



/* Renders the application.
 * Holds the destinations and options state shared with the trip.
 */
export default class Application extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page : 0
        };
        this.setPage=this.setPage.bind(this);
    }

    render(){
        return (this.renderItinerary());
    }

    renderItinerary(){
        return(
          <div>
              {this.createPlacesPages()}
          </div>
        );
    }

    createPlacesPages(){
        let placesBook = [];
        let placesPage = [];
        let count = 0;
        for(let i = 0; i < this.props.places.length; i++){
            if(count === 9 || i === this.props.places.length-1){
                placesPage.push(this.props.places[i]);
                placesBook.push(placesPage);
                placesPage = [];
                count = 0;

            }
            else{
                placesPage.push(this.props.places[i]);
                count++;
            }
        }
        return(this.renderPagedTable(placesBook));
    }

    renderPagedTable(placesBook){
        return(
              <div>
                  <Table striped responsive hover>
                      <thead>
                      <tr>
                          <td colSpan = "2" align = "left">Total Distance</td>
                          {this.renderTripTotal()}
                      </tr>
                      <tr>
                          <th>Index</th>
                          <th>Location</th>
                          <th>Distance to next location ({this.props.activeUnit})</th>
                          <th>Cumulative distance ({this.props.activeUnit})</th>
                          <th>Additional info</th>
                      </tr>
                      </thead>
                      {this.renderPlaces(placesBook)}
                  </Table>
                  {this.renderPageSelection()}
              </div>);
    }

    renderPlaces(placesBook){
        if(placesBook.length === 0){
            return null;
        }
        return (<tbody>
        {placesBook[this.state.page].map((place, index) =>
            this.renderItineraryDistance(place,index+(this.state.page *10)))}
        </tbody>);
    }

    renderTripTotal(){
        let tripTotal = this.props.calculateTripTotal()[this.props.places.length-1];
        if(tripTotal !== undefined){
            return(
                <td colSpan = "4" align = "left">
                    {this.commaSetNumber(tripTotal)} {this.props.activeUnit}
                </td>
            )
        }
        return null;
    }

    commaSetNumber(value){
        /*
        Utilizes comma implementation from user Elias Zamaria on stackoverflow
        https://stackoverflow.com/a/2901298
        */
        if(value !== null){
            return(value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
    }

    renderPageSelection(){
        let pageCount = Math.ceil(this.props.places.length / 10);
        let pages = [];
        for(let i = 0; i < pageCount; i++){
            pages.push(i);
        }
        return(this.renderPrevNextPage(pages, pageCount));

    }

    renderPrevNextPage(pages,pageCount){
        let nextState = false;
        let previousState = false;
        if(this.state.page === pageCount-1){
            nextState = true;
        }
        if(this.state.page === 0){
            previousState = true;
        }
        if(pageCount === 0){
            return null;
        }
        return(
            <Pagination>
                <PaginationItem disabled={previousState}>
                    <PaginationLink onClick={e => this.setPage("previous", e)} previous href="#" />
                </PaginationItem>
                {pages.map((value) => this.pageNumbers(value))}
                <PaginationItem disabled={nextState}>
                    <PaginationLink next href="#" onClick={e => this.setPage("next", e)}/>
                </PaginationItem>
            </Pagination>);
    }

    setPage(value, e){
        e.preventDefault();
        if (value === 'next') {
            this.setState(prev => ({page: prev.page+1}));
        }
        else if(value === 'previous') {
            this.setState(prev => ({page: prev.page-1}))
        }
        else{
            this.setState({page: value})
        }

    }

    pageNumbers(value){
        if (value === 8){
            return(
                <PaginationItem key={"pageNumber_"+value}>
                    <PaginationLink disabled={true} key={"pageReference_"+value}>
                        ...
                    </PaginationLink>
                </PaginationItem>)
        }
        if (value > 8){
            return null;
        }
        return(
            <PaginationItem key={"pageNumber_"+value}>
                <PaginationLink key={"pageReference_"+value} href="#" onClick={e =>this.setPage(value, e)}>
                    {value+1}
                </PaginationLink>
            </PaginationItem>)
    }

    renderItineraryDistance(place, index){
        let totalDistance = "";
        let currentDistance = "";
        if(this.props.distances[index] === undefined) {
            totalDistance = "Not calculated";
            currentDistance = "Not calculated";
        }
        else{
            totalDistance = this.props.calculateTripTotal()[index];
            currentDistance = this.props.distances[index];
        }
        return(
            <tr key = {index.toString()}>
                <td>{index}</td>
                <td>{this.props.getName(place)}</td>
                <td>{this.commaSetNumber(currentDistance)}</td>
                <td>{this.commaSetNumber(totalDistance)}</td>
                <ItineraryToggle places={this.props.places} index = {index} movePlaces={this.props.movePlaces}
                                 updateClientMapOptions={this.props.updateClientMapOptions}/>
            </tr>
        );
    }
}