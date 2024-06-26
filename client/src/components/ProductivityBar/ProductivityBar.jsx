import React from 'react';

const ProductivityBar = ({percentage}) => {
    return (
        <div className="productivityBar">
            <div className="productivity" style={{ width: `${percentage}%` }}>
                <span className="productivityPercent">{`${percentage}%`}</span>
            </div>
        </div>
    );
}

export default ProductivityBar;