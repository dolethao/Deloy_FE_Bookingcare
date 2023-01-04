import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss';
import { getDetailInforDoctorService } from '../../../services/userService'
import { LANGUAGES } from '../../../utils';
import DoctorSchedule from './DoctorSchedule';
import DoctorExtralinfor from './DoctorExtralinfor';
import HomeFooter from '../../HomePage/HomeFooter';
class DetailDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deatailDoctor: {},
            currentDoctorId: -1
        }
    }
    async componentDidMount() {
        // Lấy id doctor trên thanh URL 
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id
            this.setState({// Set id truyền sang DoctorSchedule
                currentDoctorId: id
            })
            // Truyền xuống id doctor cần lấy thông tin và hứng vào res
            let res = await getDetailInforDoctorService(id);
            if (res && res.errCode === 0) {
                this.setState({
                    deatailDoctor: res.data
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    render() {
        let { deatailDoctor } = this.state
        let { language } = this.props
        let nameVi = '', nameEn = '';
        if (deatailDoctor && deatailDoctor.positionData) {
            nameVi = `${deatailDoctor.positionData.valueVi}, ${deatailDoctor.lastName} ${deatailDoctor.firstName}`
            nameEn = `${deatailDoctor.positionData.valueEn}, ${deatailDoctor.firstName} ${deatailDoctor.lastName}`
        }

        return (
            <>
                <HomeHeader isShowBanner={false} />
                <div className='doctor-detail-container'>
                    <div className='intro-doctor'>
                        <div className='content-left' style={{ backgroundImage: `url(${deatailDoctor && deatailDoctor.image ? deatailDoctor.image : ''})` }}>
                        </div>
                        <div className='content-right'>
                            <div className='up'>{language === LANGUAGES.VI ? nameVi : nameEn}</div>
                            <div className='down'>{deatailDoctor && deatailDoctor.Markdown && deatailDoctor.Markdown.description &&
                                <div>
                                    {deatailDoctor.Markdown.description}<br />
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className='schedule-doctor'>
                        <div className='content-left'>
                            <DoctorSchedule // Truyền sang con id doctor
                                doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                        <div className='content-right'>
                            <DoctorExtralinfor
                                doctorIdFromParent={this.state.currentDoctorId} />
                        </div>
                    </div>
                    <div className='detail-infor-doctor'>{deatailDoctor && deatailDoctor.Markdown && deatailDoctor.Markdown.contentHTML &&
                        <div dangerouslySetInnerHTML={{ __html: deatailDoctor.Markdown.contentHTML }}></div>}</div>
                    <div className='comment-doctor'></div>
                </div>
                <HomeFooter />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
