export const addGardenPhoto = photo => ({
  type: "ADD_GARDENPHOTO",
  photo: photo
});
export const selectGardenPhoto = photo => ({
  type: "SELECT_GARDENPHOTO",
  photo: photo
});
export const photoClosed = () => ({
  type: "PHOTO_CLOSED"
});
export const openMenu = () => ({
  type: "MENU_OPEN"
});
export const closeMenu = () => ({
  type: "MENU_CLOSE"
});
export const setApplicationState = (appState) => ({
  type: "SET_STATE",
  appState:appState
});
