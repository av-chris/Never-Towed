// Module-level singleton for slide direction — set before navigate, read in screen options
let _direction = 'slide_from_right';
export const setSlideDirection = (d) => { _direction = d; };
export const getSlideDirection = () => _direction;
