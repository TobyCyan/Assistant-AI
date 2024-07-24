import React from 'react';

function MiniItem({item}) {
    return (
        <div className="miniItem">
            <img src={item.imageURL} alt={item.title} className="miniItemImage"/>
        </div>
    );
}

export default MiniItem;