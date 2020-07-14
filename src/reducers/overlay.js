import * as Types from '../constants/OverlayActionType';

const overlay = (state = false, action) => {
    debugger
    switch (action.type) {
        case Types.UPDATE_OVERLAY:
            return !state;
        default: return false;
    }
};

export default overlay;