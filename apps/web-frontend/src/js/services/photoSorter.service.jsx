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

export const ProviderIdSorter = {
  label: "Provider ID",
  comparePhotos: compareByKey("providerId")
};

export const sorters = [ProviderIdSorter];

export function sortPhotos(sorters, photos) {
  return [...photos].sort(combineComparersOfSorters(sorters));
}
