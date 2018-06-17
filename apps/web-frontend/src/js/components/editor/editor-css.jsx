const createStyle = (edit) => {
    return {
        filter: `contrast(${edit.contrast}%) brightness(${edit.brightness}%) saturate(${edit.saturate}%) grayscale(${edit.grayscale}%) sepia(${edit.sepia}%) invert(${edit.invert}%) hue-rotate(${edit.hueRotate}deg) blur(${edit.blur}px)`,
        WebKitfilter: `contrast(${edit.contrast}%) brightness(${edit.brightness}%) saturate(${edit.saturate}%) grayscale(${edit.grayscale}%) sepia(${edit.sepia}%) invert(${edit.invert}%) hue-rotate(${edit.hueRotate}deg) blur(${edit.blur}px)`,
    }
}
export default createStyle;