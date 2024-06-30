import React, { ReactNode } from 'react';

/**
 * A React component that displays the user's productivity bar.
 * @component
 * @param {number} percentage The percentage of the user's productivity.
 * @returns {ReactNode} A React element that renders the productivity bar of the user.
 */
const ProductivityBar = ({percentage}) => {
    return (
        <div className="productivityBar">
            <div className="productivity" style={{ width: `${percentage}%` }}>
            </div>
        </div>
    );
}

export default ProductivityBar;