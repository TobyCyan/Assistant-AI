import React from "react";

/**
 * A React component that displays the user's productivity bar.
 * @component
 * @param {number} percentage The percentage of the user's productivity.
 * @returns {ReactNode} A React element that renders the productivity bar of the user.
 */
const ProductivityBar = ({percentage}) => {
    return (
        <div className="productivityBar" data-testid="productivity-bar">
            <div className="productivity" data-testid="productivity" style={{ width: `${percentage > 100 ? 100 : percentage < 0 ? 0 : percentage}%` }}>
            </div>
        </div>
    );
}

export default ProductivityBar
