import sampleIcon from "../AppImages/Profile Icons/Sample.png"

/**
 * The list of items, each having a unique itemId, title, imageURL, and name.
 * The nameInFolder of the item must be the same as it is in the AppImages folder.
 * @type {Array<Object>}
 */
export const Items = [
{
    itemId: 1,
    title: "Sample Icon",
    imageURL: sampleIcon,
    points: 30,
    type: "Profile Icon",
    nameInFolder: "Sample",
}, 
]

/**
 * Checks if the icon is owned by the user.
 * @param {string} icon The icon to search.
 * @param {Array<Object>} items The list of items owned by the user.
 * @returns {boolean} true or false.
 */
export const isIconOwned = (icon, items) => {
    for (var item of items) {
        if (item.type == "Profile Icon" && item.nameInFolder == icon) {
            return true
        }
    }
    return false
}

/**
 * Checks if the outfit is owned by the user.
 * @param {string} outfit The outfit to search.
 * @param {Array<Object>} items The list of items owned by the user.
 * @returns {boolean} true or false.
 */
export const isOutfitOwned = (outfit, items) => {
    for (var item of items) {
        if (item.type == "Assistant Outfit" && item.nameInFolder == outfit) {
            return true
        }
    }
    return false
}