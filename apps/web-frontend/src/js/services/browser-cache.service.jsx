// This works on all devices/browsers, and uses IndexedDBShim as a final fallback

class BrowserCacheService {
  indexedDB;
  connection;
  succeded = false;
  constructor() {
    this.onInit();
  }
  onInit() {
    this.setIndexedDb();
    this.openConnection();
  }
  setIndexedDb() {
    this.indexedDB =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB ||
      window.shimIndexedDB;
  }
  openConnection() {
    this.connection = this.indexedDB.open("photo-garden", 1);
    this.connection.onupgradeneeded = this.buildDb.bind(this);
    this.connection.onsuccess = this.openSuccess.bind(this);
  }
  buildDb() {
    const db = this.connection.result;
    db.createObjectStore("thumbnails", { keyPath: "id" });
    db.createObjectStore("photos", { keyPath: "id" });
  }
  openSuccess() {
    this.succeded = true;
  }
  async insert(type, id, object) {
    try {
      let db = this.connection.result;
      let tx = db.transaction(type, "readwrite");
      let store = tx.objectStore(type);

      store.put({ id: id, image: object });
    } catch (error) {}
  }
  async get(type, id) {
    let db = this.connection.result;
    let tx = db.transaction(type, "readwrite");
    let store = tx.objectStore(type);
    let item = store.get(id);
    return new Promise((resolve, reject) => {
      item.onsuccess = () => {
        if (item.result) {
          resolve(item.result);
        } else {
          resolve();
        }
      };
      item.onerror = () => {
        resolve();
      };
    });
  }
  async imageSrcCache(cacheType, elementRef, id, url) {
    let cached = await this.get(cacheType, id);
    if (cached && elementRef.current) {
      elementRef.current.src = URL.createObjectURL(cached.image.blob);
    } else {
      const imageResponse = await fetch(url);
      const imageBlob = await imageResponse.blob();
      await this.insert(cacheType, id, { blob: imageBlob });
      elementRef.current.src = URL.createObjectURL(imageBlob);
    }
  }
}
const browserCacheService = new BrowserCacheService();
export default browserCacheService;
