import item1Image from "../../../images/testitem1.jpeg"
import item2Image from "../../../images/testitem2.jpeg"
import item3Image from "../../../images/testitem3.jpeg"
import item4Image from "../../../images/testitem4.jpeg"
import item5Image from "../../../images/testitem5.jpeg"
import item6Image from "../../../images/testitem6.jpeg"
import item7Image from "../../../images/testitem7.jpeg"
import sampleIcon from "../AppImages/Profile Icons/Sample.png"

/**
 * The list of items, each having a unique itemId, title, imageURL, and name.
 * The nameInFolder of the item must be the same as it is in the AppImages folder.
 * @type {Array<Object>}
 */
export const Items = [{
    itemId: 1,
    title: "Item 1",
    imageURL: item1Image,
    points: 12,
    type: "Assistant Outfit",
    nameInFolder: "",
}, {
    itemId: 2,
    title: "Item 2",
    imageURL: item2Image,
    points: 154,
    type: "Assistant Outfit",
    nameInFolder: "",
}, {
    itemId: 3,
    title: "Sample Icon",
    imageURL: sampleIcon,
    points: 30,
    type: "Profile Icon",
    nameInFolder: "Sample",
}, 
]