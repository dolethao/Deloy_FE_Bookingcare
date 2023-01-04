import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomeHeader';
import Slider from 'react-slick';
import { getAllSpecialtyService } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import { withRouter } from 'react-router';//chuyển trang detail specialty

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: []
        }
    }
    async componentDidMount() {
        let res = await getAllSpecialtyService();// Đợi data từ Sv all chuyên khoa
        if (res && res.errCode === 0) {
            this.setState({// Gán data nhận từ sv vào state
                dataSpecialty: res.data ? res.data : []
            })
        }
    }
    handleViewDetailSpecialty = (item) => {// Xem thông tin chi tiết chuyên khoa
        if (this.props.history) {// Dẫn tới trang detail doctor
            this.props.history.push(`/detail-specialty/${item.id}`)//url react-router
        }
        console.log('Check clikc', item)
    }
    render() {
        let { dataSpecialty } = this.state
        let { language } = this.props
        return (
            <div className='section-homepage specialty'>
                <div className='homepage-container'>
                    <div className='homepage-header'>
                        <span className='title-section '><FormattedMessage id="homepage.specialist" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.more-info" /></button>
                    </div>
                    <div className='homepage-body'>
                        <Slider {...this.props.settings}>
                            {dataSpecialty && dataSpecialty.length > 0 &&
                                dataSpecialty.map((item, index) => {
                                    let nameVi = `${item.nameVi} `
                                    let nameEn = `${item.nameEn}`
                                    return (
                                        <div className='homepage-customize' key={index}
                                            onClick={() => this.handleViewDetailSpecialty(item)}>
                                            <div className='bg-image specialty'
                                                style={{ backgroundImage: `url(${item.image})` }}></div>
                                            <h3>{language === LANGUAGES.VI ? nameVi : nameEn}</h3>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Specialty));
