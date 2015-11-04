/*
    styling borrowed from:
    https://github.com/kristoferjoseph/flexboxgrid/blob/master/src/css/flexboxgrid.css
    https://philipwalton.github.io/solved-by-flexbox/demos/grids/
    http://foundation.zurb.com/apps/docs/#!/grid
    https://css-tricks.com/snippets/css/a-guide-to-flexbox/
    https://css-tricks.com/useful-flexbox-technique-alignment-shifting-wrapping/
    https://css-tricks.com/box-sizing/
    http://learnlayout.com/box-sizing.html
    https://css-tricks.com/the-lengths-of-css/
    http://stackoverflow.com/a/1655398/1941513

    NB: if children of a flexbox also have 'display: flex', then those
    children will have the same height by default.
*/

import BaseFlex from 'jsxstyle/Flex';
import curry from 'jsxstyle/curry';


export const Flex = curry(BaseFlex, {
    backfaceVisibility: 'hidden',
    boxSizing:          'border-box',
    flex:               '1 1 auto',
    height:             'auto',
    justifyContent:     'flex-start',
    order:              0,
    position:           'relative',
});


export const ColumnWise = curry(Flex, {
    flexDirection: 'column',
});


export const RowWise = curry(Flex, {
    flexDirection: 'row',
});


export const Container = curry(Flex, {
    alignItems:    'stretch',
    flexDirection: 'row',
    flexWrap:      'nowrap',
    overflow:      'hidden',
    padding:       '1rem',
});


/*
    Fits width and height of the viewport.  Use as the root flexbox
    container in the app.  Default: it arranges children in a
    column-wise orientation.
*/
export const WindowFrame = curry(Flex, {
    alignItems:    'stretch',
    flexDirection: 'column',
    flexWrap:      'nowrap',
    height:        '100vh',
    overflow:      'hidden',
});


export const Frame = curry(Container, {
    height:         '100%',
    justifyContent: 'center',
});


/*
    Default: when `flexDirection` is `row`, it's just tall enough
    to accommodate children.
    Alternative: when `flexDirection` is overridden and set to
    `column`, it's just wide enough to accommodate children.
    Optionally add padding to give some space between the border
    of ShrinkWrap and its children.
    This container is useful for menu bars.
    NB: if you include drop-down menus, make sure to not set
    `overflow` to `hidden` and make sure to keep `position` as
    `relative` and the `position` of the drop-down menu as
    `absolute`.
*/
export const ShrinkWrap = curry(Flex, {
    alignItems:    'stretch',
    flex:          '0 0 auto',
    flexDirection: 'row',
    flexWrap:      'wrap',
});
