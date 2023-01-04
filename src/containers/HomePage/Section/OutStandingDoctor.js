import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomeHeader';
import Slider from 'react-slick';
import * as actions from '../../../store/actions'
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: [] //Luu state Redux vao day
        }

    }
    async componentDidMount() {
        this.props.loadTopDocTors();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        //Nếu có sự thay đổi thì gán vào
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }
    handleViewDetail = (doctor) => {// Xem thông tin chi tiết chuyên khoa
        if (this.props.history) {// Dẫn tới trang detail specialty
            this.props.history.push(`/detail-doctor/${doctor.id}`)//url react-router
        }
    }
    render() {
        let arrDoctors = this.state.arrDoctors
        let { language } = this.props
        console.log('Check state', this.state)
        return (
            <div className='section-homepage doctor'>
                <div className='homepage-container'>
                    <div className='homepage-header'>
                        <span className='title-section'><FormattedMessage id="homepage.outstanding-doctor" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.search" /></button>
                    </div>
                    <div className='homepage-body'>
                        <Slider {...this.props.settings}>
                            {arrDoctors && arrDoctors.length > 0 &&
                                arrDoctors.map((item, index) => {
                                    let nameVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`
                                    let nameEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`
                                    let imageBase64 = '';
                                    if (item.image) {
                                        imageBase64 = Buffer.from(item.image, 'base64').toString('binary')
                                    }
                                    return (
                                        <div
                                            className='homepage-customize doctor'
                                            key={index}
                                            onClick={() => this.handleViewDetail(item)}>
                                            <div className='bg-image doctor'
                                                style={{ backgroundImage: `url(${imageBase64})` }}
                                            >
                                            </div>
                                            <div className='text doctor'>
                                                <span className='name'>{language === LANGUAGES.VI ? nameVi : nameEn}</span>
                                            </div>

                                        </div>
                                    )
                                })}

                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {//State Redux
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        topDoctorsRedux: state.admin.topDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        //top doctors home fire action
        loadTopDocTors: () => dispatch(actions.fetchTopDoctor())

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
