import * as Types from '../constants/OverlayActionType';
import {none} from '../constants/LoadingType';

const overlay = (state, action) => {
    switch (action.type) {
        case Types.UPDATE_OVERLAY:
            return action.overlay;
        default: return none;
    }
};

export default overlay;