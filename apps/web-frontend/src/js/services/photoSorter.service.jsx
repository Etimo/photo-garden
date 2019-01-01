function compareByKey(key) {
  return (obj1, obj2) => {
    let obj1value = obj1.photo[key];
    let obj2value = obj2.photo[key];
    if (obj1value < obj2value) {
      return -1;
    } else if (obj1value > obj2value) {
      return 1;
    } else {
      return 0;
    }
  };
}

function combineComparersOfSorters(sorters) {
  return (obj1, obj2) => {
    for (let sorter of sorters) {
      let cmp = sorter.comparePhotos(obj1, obj2);
      if (cmp != 0) {
        return cmp;
      }
    }
    return 0;
  };
}

const IdSorter = {
  label: "ID",
  comparePhotos: compareByKey("id"),
  filterPhotos: () => true
};
const colorSorter = {
  label: "Color",
  comparePhotos: () => 0,
  filterPhotos: () => true
};
const calendar = {
  label: "Calendar",
  comparePhotos: compareByKey("shootDate")
};
const edited = {
  label: "Edited",
  comparePhotos: () => 0
};
const NoopSorter = {
  label: "None",
  comparePhotos: () => 0
};

export const sorters = {
  id: IdSorter,
  calendar: calendar,
  color: colorSorter,
  edit: edited
};

export const sortOrder = {
  ASCENDING: "ASCENDING",
  DESCENDING: "DESCENDING"
};

export function sortPhotos(selectedSorters, photos, order) {
  // Never mutate external objects in-place
  let photosClone = [...photos];
  photosClone.sort(
    combineComparersOfSorters(selectedSorters.map(sorter => sorters[sorter]))
  );

  return order === sortOrder.DESCENDING ? photosClone.reverse() : photosClone;
}
