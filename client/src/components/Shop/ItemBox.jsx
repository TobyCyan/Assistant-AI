import React from 'react';

const ItemBox = ({item, isObtained, onExchange}) => {
    return (
        <div className="itemBox">
            <h3 className="itemTitle">{item.title}</h3>
            <img src={item.imageURL} alt={item.title} className="itemImage" />
            <div className="pointsAndExchangeBox">
                <p className="itemPoints">{item.points} points</p>
                <button disabled={isObtained} className="exchangeButton" style={{
                    cursor: isObtained ? 'not-allowed' : 'pointer',
                }} onClick={() => onExchange(item)}>
                    {isObtained ? 'Obtained' : 'Exchange'}
                </button>
            </div>
        </div>
    );
};

export default ItemBox;