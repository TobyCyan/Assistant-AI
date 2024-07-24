import React from 'react';
import MiniItem from "./MiniItem.jsx";
import {Items} from "../../utilities/utilities.js";

function ItemCollectionBox({items}) {
    const sortedItems = [...items].sort((a, b) => a.itemId - b.itemId).map(each => Items[each.itemId-1])

    return (
        <div className="itemCollectionBox">
            <h4>Item Collection</h4>
            <div className="miniItemGrid">
                {sortedItems?.map((item, index) => (
                    <MiniItem key={index} item={item}/>
                ))}
            </div>
        </div>
    );
}

export default ItemCollectionBox;