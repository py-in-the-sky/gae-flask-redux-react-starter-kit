/*
    NB: if children of a flexbox also have 'display: flex', then those
    children will have the same height by default.

    NB: for parent-child spacing, prefer padding on the parent.

    Concept: Think of parent components as composing rectangles, one
    for each child.  Each child itself will decide what colors and
    shapes to present within its given rectangle.  (And then animations
    will be responsible for making relative changes to the rectangles
    as well as to the children within the rectangles.)  So the concerns
    of styling are separated such that parents are responsible for layout
    (rectangles) and spacing (margin/padding on the rectangles) and
    children are responsible for other styles, given their layout container
    (i.e., rectangle).

    Layout/container/flex system:
        - at the highest level, the root layout component will be a Flex
          component (WindowFrame) that spans the height and width of the
          viewport

        - the root layout component can  have a minHeight

        - some parent components will react to window-size data from the
          store and make relevant layout decisions (similar to media queries)

        - parent/container component is coded to declare styles on itself
          and children rectangles in order to establish the following properties
          of children:

          * size: their sizes will be a fraction of the parent's width/height
            and possibly further refined with sizes relative to each other via
            flex attributes
          * layout: which children are present and in which order; which children
            appear in the same column or row and which in different ones; whether
            children are distributed vertically and horizontally
          * spacing: the minimum amount of space on all four sides a child requires
            between itself and peers; the minimum space required between the border
            of the parent itself and its children rectangles; for any intermediate
            containers (rows, columns, etc.), the minimum required space between
            the container's border and its immediate children rectangles.
          * z-index/z-height (think material design)

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
    minHeight:     '400px',
    overflowX:     'hidden',
    overflowY:     'auto',
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
