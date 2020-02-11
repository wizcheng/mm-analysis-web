import React from 'react';
import { connect } from 'react-redux';

const Counter = ({ count, handleIncrementClick, handleDecrementClick }) => (
    <div>
        <h1>Helloworld React & Redux! {count}</h1>
        <button onClick={handleDecrementClick}>Decrement</button>
        <button onClick={handleIncrementClick}>Increment</button>
    </div>
);

const mapStateToProps = state => {
    return {
        count: state.counter.number
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleIncrementClick: () => dispatch({ type: 'INCREMENT' }),
        handleDecrementClick: () => dispatch({ type: 'DECREMENT' })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
