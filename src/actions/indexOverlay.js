import * as Types from '../constants/OverlayActionType';

export const actUpdateOverlay = (overlay) => {
    return {
        type: Types.UPDATE_OVERLAY,
        overlay
    }
}