import React from 'react';
import { useTokenContext } from '../TokenContext/TokenContext.jsx';

const MiniItem = ({item}) => {
    const { meiSprite } = useTokenContext()
    const [, setAssistantSprite] = meiSprite

    const onEquip = (itemTitle, itemType) => {
        switch (itemType) {
            case "Assistant Outfit":
                // setAssistantSprite(itemTitle)
                break
            
            case "Profile Icon":
                break
        }
        return
    }

    return (
        <div className="miniItem">
            <h2 className="miniItemType">{item.type}</h2>
            <img src={item.imageURL} alt={item.title} className="miniItemImage"/>
            <button className="equipButton" onClick={() => onEquip(item.title, item.type)}>
                Equip
            </button>
        </div>
    );
}

export default MiniItem;