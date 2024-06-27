import React from 'react';

const ProductivityBar = ({percentage}) => {
    return (
        <div className="productivityBar">
            <div className="productivity" style={{ width: `${percentage}%` }}>
            </div>
        </div>
    );
}

export default ProductivityBar;