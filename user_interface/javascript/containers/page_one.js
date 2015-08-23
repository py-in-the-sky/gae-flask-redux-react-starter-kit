import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PageOne from '../components/page_one';
import * as Actions from '../actions';


// Construct a 'smart container' around a 'dumb' component.
// The construction for PageOne and PageTwo are the same.
// However, they could differ and probably would in any
// real-world app.


function mapStateToProps (state) {
    let { names, pendingRequests } = state;
    const requestsPending = pendingRequests.size > 0;
    return { names, requestsPending };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}


function createApp () {
    return connect(mapStateToProps, mapDispatchToProps)(PageOne);
}


export default createApp();
