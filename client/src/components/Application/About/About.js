import React, {Component} from 'react'
import {Container, Row, Col} from 'reactstrap'
import {sendServerRequestWithBody} from '../../../api/restfulAPI'
import Pane from '../Pane';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import image1 from '../../../../../images/bio/benny.jpg'
import image2 from '../../../../../images/bio/sknowhite.jpg'
import image3 from '../../../../../images/bio/conor.png'
import image4 from '../../../../../images/bio/Kongleochi.png'
export default class About extends Component {
    constructor(props) {
        super(props);


        this.state = {
            origin: {latitude: '', longitude: ''},
            destination: {latitude: '', longitude: ''},
            distance: 0,
            errorMessage: null
        };
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardImg top width="100%" src={image1} alt= "Image Caption" />
                            <CardBody>
                                <CardTitle>Benny Roesler</CardTitle>
                                <CardSubtitle>BS Applied Computing Technology</CardSubtitle>
                                <CardText>A student passionate for cyber security and <b>food</b></CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardImg top width="100%" src={image2} alt= "Image Caption" />
                            <CardBody>
                                <CardTitle>Hunter Sullivan</CardTitle>
                                <CardSubtitle>BS Computer Science</CardSubtitle>
                                <CardText>A student who loves software development and gaming</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardImg top width="100%" src={image3} alt= "Image Caption" />
                            <CardBody>
                                <CardTitle>Conor Hart</CardTitle>
                                <CardSubtitle>BS Computer Science</CardSubtitle>
                                <CardText>A student who likes video games, weight lifting, and cooking.</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs={12} sm={6} md={4} lg={3}>
                        <Card>
                            <CardImg top width="100%" src={image4} alt= "Image Caption" />
                            <CardBody>
                                <CardTitle>Jonathan Quirk</CardTitle>
                                <CardSubtitle>BS Computer Science</CardSubtitle>
                                <CardText>A person who enjoys movies, television, and video games.</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };

    createHeader() {
        return (
            <Pane header={'About'}
                  bodyJSX={<div>Welcome to the Trinity+ about page! Semester: Fall 2019.</div>}/>
        );
    }
}
