export const importSprites = async (path1, path2, setSprite1, setSprite2) => {
    try {
        const sprite1 = await import("../AppImages/Mei Chibi Icons" + path1)
        const sprite2 = await import("../AppImages/Mei Chibi Icons" + path2)
        setSprite1(sprite1.default)
        setSprite2(sprite2.default)
    } catch (err) {
        console.error("Failed to Import Sprites: ", err.message)
    }
}