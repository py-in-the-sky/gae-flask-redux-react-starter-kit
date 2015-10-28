// thanks to https://github.com/cesarandreu/react-window-resize-listener
import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { on, off } from 'material-ui/lib/utils/events';
import { debounce } from '../utils/lodash';
import { getWindowWidth } from '../utils/dom';
import { windowWidth } from '../actions';


export class WindowResizeListener extends PureComponent {
    constructor(props) {
        super(props);

        const { debounceTime, windowWidth } = this.props;

        this.debouncedWindowWidth = debounce(
            () => windowWidth(getWindowWidth()),
            debounceTime,
            { leading: false, trailing: true, maxWait: debounceTime * 2 }
        );
    }

    componentDidMount () {
        on(window, 'resize', this.debouncedWindowWidth);
        // now that we're listening to the window-resize event,
        // for correctness, we propagate the current window
        // width to give the app the correct baseline
        this.debouncedWindowWidth();
    }

    componentWillUnmount () {
        off(window, 'resize', this.debouncedWindowWidth);
    }

    render () {
        return null;
    }
}


WindowResizeListener.propTypes = {
    debounceTime: PropTypes.number.isRequired,
    windowWidth:  PropTypes.func.isRequired,
};


WindowResizeListener.defaultProps = {
    debounceTime: 350,
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ windowWidth }, dispatch);
}


export default connect(undefined, mapDispatchToProps)(WindowResizeListener);
