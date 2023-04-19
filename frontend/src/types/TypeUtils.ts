import {
  ConversationArea,
  Interactable,
  ViewingArea,
  ArcadeArea,
  KartDashArea,
} from './CoveyTownSocket';

/**
 * Test to see if an interactable is a conversation area
 */
export function isConversationArea(interactable: Interactable): interactable is ConversationArea {
  return 'occupantsByID' in interactable;
}

/**
 * Test to see if an interactable is a viewing area
 */
export function isViewingArea(interactable: Interactable): interactable is ViewingArea {
  return 'isPlaying' in interactable;
}

/**
 * Test to see if an interactable is an arcade area
 */
export function isArcadeArea(interactable: Interactable): interactable is ArcadeArea {
  return 'inSession' in interactable;
}

/**
 * Test to see if an interactable is a kart dash area
 */
export function isKartDashArea(interactable: Interactable): interactable is KartDashArea {
  return 'trackOne' in interactable;
}
