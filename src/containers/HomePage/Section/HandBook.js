import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomeHeader';
import Slider from 'react-slick';



class HandBook extends Component {
    render() {

        return (
            <div className='section-homepage hand-book'>
                <div className='homepage-container'>
                    <div className='homepage-header'>
                        <span className='title-section'><FormattedMessage id="homepage.hand-book" /></span>
                        <button className='btn-section'><FormattedMessage id="homepage.all" /></button>
                    </div>
                    <div className='homepage-body'>
                        <Slider {...this.props.settings}>
                            <div className='homepage-customize '>
                                <div className='bg-image hand-book'></div>
                            </div>
                            <div className='homepage-customize '>
                                <h3 className='hand-book'>Giá xét nhiệm cúm bao nhiêu? Bảng giá chi tiết tại một số địa chỉ ở Hà Nội</h3>
                            </div>
                            <div className='homepage-customize '>
                                <div className='bg-image hand-book'></div>
                            </div>
                            <div className='homepage-customize '>
                                <h3 className='hand-book'>Giá xét nhiệm cúm bao nhiêu? Bảng giá chi tiết tại một số địa chỉ ở Hà Nội</h3>
                            </div>
                            <div className='homepage-customize '>
                                <div className='bg-image hand-book'></div>
                            </div>
                            <div className='homepage-customize '>
                                <h3 className='hand-book'>Giá xét nhiệm cúm bao nhiêu? Bảng giá chi tiết tại một số địa chỉ ở Hà Nội</h3>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
