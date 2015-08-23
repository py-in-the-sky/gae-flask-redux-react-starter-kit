import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RootComponent from '../components';
import * as Actions from '../actions';


// construct the 'smart' App 'container' around the 'dumb' RootComponent


function mapStateToProps (state) {
    const { names } = state;
    return { names };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


function createApp () {
    return connect(mapStateToProps, mapDispatchToProps)(RootComponent);
}


export default createApp();
