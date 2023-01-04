import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from '../HomeHeader';



class About extends Component {
    render() {

        return (
            <div className='section-homepage about'>
                Xin chao with About
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
