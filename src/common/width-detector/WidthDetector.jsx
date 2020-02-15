import React, {Component} from 'react';
import { connect } from 'react-redux';
import ReactResizeDetector from 'react-resize-detector';

class WidthDetector extends Component {

    render() {
        const {handleResize, item} = this.props;
        return <div style={{border: 'solid 1px red'}}><ReactResizeDetector onResize={handleResize.bind(this, item)}/></div>;
    }
}

const mapStateToProps = state => {
    return {
    };
};


const mapDispatchToProps = (dispatch) => {

    const updateVariables = (variables) => {
        dispatch({
            type: 'UPDATE_WIDTH_AND_HEIGHT',
            variables: variables
        })
    };

    return {
        handleResize: (item, event) => {
            console.log('item', item);
            console.log('handleResize', event);
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(WidthDetector);
