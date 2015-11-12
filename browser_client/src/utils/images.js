import { WindowSizes } from './styles';
import { memoize } from './lodash';


const { SMALL, MEDIUM, LARGE } = WindowSizes;


const baseImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';


export const ImageUrls = {
    SHIRE_BACKGROUND: {
        [SMALL]:  `${baseImageUrl}4/4c/Hobbiton%2C_New_Zealand.jpg/800px-Hobbiton%2C_New_Zealand.jpg`,
        [MEDIUM]: `${baseImageUrl}4/4c/Hobbiton%2C_New_Zealand.jpg/1024px-Hobbiton%2C_New_Zealand.jpg`,
        [LARGE]:  `${baseImageUrl}8/89/Hobbit_holes_reflected_in_water.jpg/1280px-Hobbit_holes_reflected_in_water.jpg`,
    },
};


const imageMarkup = (imageKey, windowSize = SMALL) => {
    if (__TEST__)
        return '';

    return `url(${ImageUrls[imageKey][windowSize]})`;
}


export const shireBackgroundImageMarkup = memoize( windowSize =>
    imageMarkup('SHIRE_BACKGROUND', windowSize) );
