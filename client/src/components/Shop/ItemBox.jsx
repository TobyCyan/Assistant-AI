import React from "react";

const ItemBox = ({item, isObtained, onExchange, userPoints}) => {
    const enoughPoints = userPoints >= item?.points

    return (
        <div className="itemBox">
            <h2 className="itemTitle">{item.title}</h2>
            <h3 className="itemType">{item.type}</h3>
            <img src={item.imageURL} alt={item.title} className="itemImage" />
            <div className="pointsAndExchangeBox">
                <p className="itemPoints">{item.points} points</p>
                <button disabled={isObtained || !enoughPoints} className="exchangeButton" style={{
                    cursor: isObtained ? "not-allowed" : "pointer",
                }} onClick={() => onExchange(item)}>
                    {isObtained ? "Obtained" : userPoints < item.points ? "Insufficient Points"  : "Exchange"}
                </button>
            </div>
        </div>
    )
}

export default ItemBox