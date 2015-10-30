import React, { PropTypes, Children } from 'react';
import PureComponent from 'react-pure-render/component';
import { on, off } from 'material-ui/lib/utils/events';
import { debounce } from '../utils/lodash';
import { getWindowWidth } from '../utils/dom';
import { windowSize } from '../utils/styles';


export default class WindowSizeProvider extends PureComponent {
    constructor(props) {
        super(props);

        this.updateWindowData = this.updateWindowData.bind(this);

        this.debouncedUpdateWindowData = debounce(
            this.updateWindowData,
            this.props.debounceTime,
            { leading: false, trailing: true, maxWait: this.props.debounceTime * 2 }
        );
    }

    updateWindowData () {
        const windowWidth = getWindowWidth();
        this.setState({ windowWidth, windowSize: windowSize(windowWidth) });
    }

    componentWillMount () {
        on(window, 'resize', this.debouncedUpdateWindowData);
        // now that we're listening to the window-resize event,
        // for correctness, we set the current window
        // width to give the app the correct baseline
        this.updateWindowData();
    }

    componentWillUnmount () {
        off(window, 'resize', this.debouncedUpdateWindowData);
    }

    getChildContext () {
        return {
            windowWidth: this.state.windowWidth,
            windowSize:  this.state.windowSize,
        };
    }

    render () {
        return Children.only(this.props.children);
    }
}


WindowSizeProvider.childContextTypes = {
    windowWidth: PropTypes.number.isRequired,
    windowSize:  PropTypes.number.isRequired,
};


WindowSizeProvider.propTypes = {
    children: PropTypes.element.isRequired,
};


WindowSizeProvider.defaultProps = {
    debounceTime: 350,
};
