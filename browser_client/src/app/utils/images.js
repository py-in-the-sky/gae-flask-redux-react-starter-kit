import { WindowSizes } from './styles'
import { SHIRE } from 'app/utils/Routes'


const { SMALL, MEDIUM, LARGE } = WindowSizes


const baseImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/'


const ImageUrls = {
    [SHIRE]: {
        [SMALL]:  `${baseImageUrl}4/4c/Hobbiton%2C_New_Zealand.jpg/800px-Hobbiton%2C_New_Zealand.jpg`,
        [MEDIUM]: `${baseImageUrl}4/4c/Hobbiton%2C_New_Zealand.jpg/1024px-Hobbiton%2C_New_Zealand.jpg`,
        [LARGE]:  `${baseImageUrl}8/89/Hobbit_holes_reflected_in_water.jpg/1280px-Hobbit_holes_reflected_in_water.jpg`,
    },
}


export const imageMarkup = (collectionKey, windowSize = SMALL) => {
    if (__TEST__) {
        return ''
    }

    const imageCollection = ImageUrls[collectionKey]
    return imageCollection
        ? `url(${imageCollection[windowSize]})`
        : null
}
