/**
 * cache-helper.js
 *
 * A helper utility wrapping Zoho Catalyst Cache component.
 * Implements the standard Cache-Aside pattern (check cache -> fetch on miss -> populate cache).
 * Handles automatic JSON serialization and provides fail-safe executions.
 * NodeJS 20 compatible.
 */

const SEGMENT_NAME = process.env.CATALYST_CACHE_SEGMENT || 'Default';

/**
 * Resolves the Catalyst cache segment.
 *
 * @param {object} app - Catalyst app instance
 * @param {string} segmentName - Segment name/ID
 * @returns {object} Catalyst cache segment instance
 */
const getCacheSegment = (app, segmentName = SEGMENT_NAME) => {
  return app.cache().segment(segmentName);
};

/**
 * Gets and parses a JSON value from the cache.
 * Returns null if key is not found or cache is unavailable.
 *
 * @param {object} app - Catalyst app instance
 * @param {string} key - Cache key
 * @param {string} [segmentName] - Cache segment name override
 * @returns {Promise<any|null>} Parsed cache value or null
 */
const get = async (app, key, segmentName = SEGMENT_NAME) => {
  try {
    const segment = getCacheSegment(app, segmentName);
    const value = await segment.getValue(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`[Cache GET Error] Key: "${key}" in segment: "${segmentName}". Details:`, error.message || error);
    return null;
  }
};

/**
 * Stringifies and stores a value in the cache with an expiration window.
 *
 * @param {object} app - Catalyst app instance
 * @param {string} key - Cache key
 * @param {any} value - Value to cache (will be JSON stringified)
 * @param {number} [expiryInHours=1] - Expiry in hours (Catalyst default unit)
 * @param {string} [segmentName] - Cache segment name override
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
const put = async (app, key, value, expiryInHours = 1, segmentName = SEGMENT_NAME) => {
  try {
    const segment = getCacheSegment(app, segmentName);
    const serializedValue = JSON.stringify(value);
    await segment.put(key, serializedValue, expiryInHours);
    return true;
  } catch (error) {
    console.error(`[Cache PUT Error] Key: "${key}" in segment: "${segmentName}". Details:`, error.message || error);
    return false;
  }
};

/**
 * Evicts a value from the cache.
 *
 * @param {object} app - Catalyst app instance
 * @param {string} key - Cache key
 * @param {string} [segmentName] - Cache segment name override
 * @returns {Promise<boolean>} True if successfully deleted, false otherwise
 */
const del = async (app, key, segmentName = SEGMENT_NAME) => {
  try {
    const segment = getCacheSegment(app, segmentName);
    await segment.delete(key);
    return true;
  } catch (error) {
    console.error(`[Cache DELETE Error] Key: "${key}" in segment: "${segmentName}". Details:`, error.message || error);
    return false;
  }
};

/**
 * Standard Cache-Aside implementation wrapper.
 * Reads from the cache first; on a miss, calls fetchFn, caches result, and returns.
 * Fail-safe: if cache read/write fails, executes fetchFn and returns data normally.
 *
 * @param {object} app - Catalyst app instance
 * @param {string} key - Cache key
 * @param {function} fetchFn - Async function to retrieve fresh data on cache miss
 * @param {number} [expiryInHours=1] - Expiry in hours if cached
 * @param {string} [segmentName] - Cache segment name override
 * @returns {Promise<any>} The cached or freshly-fetched data
 */
const getOrSet = async (app, key, fetchFn, expiryInHours = 1, segmentName = SEGMENT_NAME) => {
  // 1. Attempt to fetch from cache
  const cachedData = await get(app, key, segmentName);
  if (cachedData !== null) {
    return cachedData;
  }

  // 2. Cache miss: retrieve fresh data
  const freshData = await fetchFn();

  // 3. Populate cache in background (do not block execution)
  if (freshData !== undefined && freshData !== null) {
    put(app, key, freshData, expiryInHours, segmentName).catch(err => {
      console.error(`[Cache Background Populate Error] Key: "${key}". Details:`, err.message || err);
    });
  }

  return freshData;
};

module.exports = {
  get,
  put,
  delete: del,
  getOrSet,
  getCacheSegment
};
