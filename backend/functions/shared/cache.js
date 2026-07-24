const { getCatalystApp } = require('./db');

async function getCacheValue(req, key) {
  try {
    const app = getCatalystApp(req);
    const segment = app.cache().segment(); // Default root cache segment
    const val = await segment.getValue(key);
    if (!val) return null;
    
    // Attempt to parse JSON if it is serialized
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  } catch (err) {
    console.error(`Cache Read Error for key '${key}':`, err.message);
    return null;
  }
}

async function setCacheValue(req, key, value, expiryInHours = 1) {
  try {
    const app = getCatalystApp(req);
    const segment = app.cache().segment();
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await segment.put(key, stringValue, expiryInHours);
    return true;
  } catch (err) {
    console.error(`Cache Write Error for key '${key}':`, err.message);
    return false;
  }
}

async function deleteCacheValue(req, key) {
  try {
    const app = getCatalystApp(req);
    const segment = app.cache().segment();
    await segment.delete(key);
    return true;
  } catch (err) {
    console.error(`Cache Delete Error for key '${key}':`, err.message);
    return false;
  }
}

module.exports = {
  getCacheValue,
  setCacheValue,
  deleteCacheValue
};
