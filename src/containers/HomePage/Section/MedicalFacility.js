import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomeHeader';
import Slider from 'react-slick';
import { getAllClinicService } from '../../../services/userService'
import { withRouter } from 'react-router';// chuyển trang detail clinic


class MedicalFacility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinic: []
        }
    }
    async componentDidMount() {
        let res = await getAllClinicService();// Đợi data từ Sv all phòng khám
        if (res && res.errCode === 0) {
            this.setState({// Gán data nhận từ sv vào state
                dataClinic: res.data ? res.data : []
            })
        }
    }
    handleViewDetailClinic = (item) => {// Xem thông tin chi tiết phòng khám
        if (this.props.history) {// Dẫn tới trang detail doctor
            this.props.history.push(`/detail-clinic/${item.id}`)//url react-router
        }
    }
    render() {
        let { dataClinic } = this.state
        return (
            <div className='section-homepage medical-facility'>
                <div className='homepage-container'>
                    <div className='homepage-header'>
                        <span className='title-section'><FormattedMessage id="homepage.health-facilities" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.search" /></button>
                    </div>
                    <div className='homepage-body'>
                        <Slider {...this.props.settings}>
                            {dataClinic && dataClinic.length > 0 &&
                                dataClinic.map((item, index) => {
                                    return (
                                        <div className='homepage-customize' key={index}
                                            onClick={() => this.handleViewDetailClinic(item)}>
                                            <div className='bg-image specialty'
                                                style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <h3>{item.name}</h3>
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
