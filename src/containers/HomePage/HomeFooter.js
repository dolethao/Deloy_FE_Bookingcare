import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import HomeHeader from './HomeHeader';



class HomeFooter extends Component {
    render() {

        return (
            <div className='home-footer'>
                <p> &copy; 2022 by Đỗ Lê Thao. More information, please visit my github.
                    <a target='_blank' href='https://github.com/dolethao'>Click here</a>

                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
