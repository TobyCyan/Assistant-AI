import React, { ReactNode } from 'react';
import MiniItem from "./MiniItem.jsx";
import { Items } from "../../utilities/ShopItemUtilities.js";

/**
 * A React component that displays the Item Collection Box in the Profile page.
 * @component
 * @param {Array<Object>} items The list of items to be displayed in the Item Collection Box.
 * @returns {ReactNode} A React element that renders the item collection box.
 */
const ItemCollectionBox = ({items}) => {

    /**
     * The list of items owned by the user sorted in ascending order based on the itemId.
     * @type {Array<Object>}
     */
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
    )
}

export default ItemCollectionBox