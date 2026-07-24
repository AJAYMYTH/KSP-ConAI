/**
 * validators.js
 *
 * Generic validators for types, ranges, enums, dates, coordinates, and email addresses.
 * Includes a schema validator that parses inputs and aggregates validation errors.
 * NodeJS 20 compatible.
 */

/**
 * Validates a string value and applies length constraints.
 * Returns the trimmed string or null if empty and not required.
 */
const validateString = (val, name, options = {}) => {
  const { required = false, minLength = 0, maxLength = Infinity } = options;
  if (val === undefined || val === null || val === '') {
    if (required) {
      throw new Error(`"${name}" is required.`);
    }
    return null;
  }
  if (typeof val !== 'string') {
    throw new Error(`"${name}" must be a string.`);
  }
  const trimmed = val.trim();
  if (trimmed.length < minLength) {
    throw new Error(`"${name}" must be at least ${minLength} characters.`);
  }
  if (trimmed.length > maxLength) {
    throw new Error(`"${name}" must be at most ${maxLength} characters.`);
  }
  return trimmed;
};

/**
 * Validates a number, parsing from string if necessary.
 * Returns the parsed number or null if empty and not required.
 */
const validateNumber = (val, name, options = {}) => {
  const { required = false, min = -Infinity, max = Infinity, integer = false } = options;
  if (val === undefined || val === null || val === '') {
    if (required) {
      throw new Error(`"${name}" is required.`);
    }
    return null;
  }
  const parsed = Number(val);
  if (isNaN(parsed)) {
    throw new Error(`"${name}" must be a valid number.`);
  }
  if (integer && !Number.isInteger(parsed)) {
    throw new Error(`"${name}" must be an integer.`);
  }
  if (parsed < min) {
    throw new Error(`"${name}" must be at least ${min}.`);
  }
  if (parsed > max) {
    throw new Error(`"${name}" must be at most ${max}.`);
  }
  return parsed;
};

/**
 * Validates a boolean, parsing from string or number if necessary.
 * Returns the parsed boolean or null if empty and not required.
 */
const validateBoolean = (val, name, options = {}) => {
  const { required = false } = options;
  if (val === undefined || val === null || val === '') {
    if (required) {
      throw new Error(`"${name}" is required.`);
    }
    return null;
  }
  if (typeof val === 'boolean') {
    return val;
  }
  const str = String(val).trim().toLowerCase();
  if (str === 'true' || str === '1' || str === 'yes') {
    return true;
  }
  if (str === 'false' || str === '0' || str === 'no') {
    return false;
  }
  throw new Error(`"${name}" must be a valid boolean.`);
};

/**
 * Validates if a value is contained in a whitelisted enum array.
 */
const validateEnum = (val, name, allowedValues, options = {}) => {
  const { required = false } = options;
  if (val === undefined || val === null || val === '') {
    if (required) {
      throw new Error(`"${name}" is required.`);
    }
    return null;
  }
  if (!Array.isArray(allowedValues)) {
    throw new Error('Allowed enum values must be provided in an array.');
  }
  if (!allowedValues.includes(val)) {
    throw new Error(`"${name}" must be one of: ${allowedValues.join(', ')}.`);
  }
  return val;
};

/**
 * Validates if a value is a parseable date.
 * Returns a Date object or null if empty and not required.
 */
const validateDate = (val, name, options = {}) => {
  const { required = false } = options;
  if (val === undefined || val === null || val === '') {
    if (required) {
      throw new Error(`"${name}" is required.`);
    }
    return null;
  }
  const timestamp = Date.parse(val);
  if (isNaN(timestamp)) {
    throw new Error(`"${name}" must be a valid date or datetime string.`);
  }
  return new Date(timestamp);
};

/**
 * Validates geospatial coordinates (latitude and longitude).
 * Returns parsed object or null if empty and not required.
 */
const validateCoordinates = (latitude, longitude, name = 'Coordinates', options = {}) => {
  const { required = false } = options;
  const latVal = latitude === undefined || latitude === null || latitude === '' ? null : Number(latitude);
  const lngVal = longitude === undefined || longitude === null || longitude === '' ? null : Number(longitude);
  
  if (latVal === null || lngVal === null) {
    if (required) {
      throw new Error(`"${name}" (both latitude and longitude) are required.`);
    }
    return null;
  }
  
  if (isNaN(latVal) || latVal < -90 || latVal > 90) {
    throw new Error(`Latitude must be a valid number between -90 and 90.`);
  }
  
  if (isNaN(lngVal) || lngVal < -180 || lngVal > 180) {
    throw new Error(`Longitude must be a valid number between -180 and 180.`);
  }
  
  return { latitude: latVal, longitude: lngVal };
};

/**
 * Validates standard email address syntax.
 */
const validateEmail = (val, name = 'Email', options = {}) => {
  const { required = false } = options;
  if (val === undefined || val === null || val === '') {
    if (required) {
      throw new Error(`"${name}" is required.`);
    }
    return null;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmed = String(val).trim().toLowerCase();
  if (!emailRegex.test(trimmed)) {
    throw new Error(`"${name}" must be a valid email address.`);
  }
  return trimmed;
};

/**
 * Validates an entire object schema against structured rules.
 * Accumulates all validation errors and handles type conversions.
 *
 * @param {object} data - Input payload (req.query or req.body)
 * @param {object} schema - Validation schema rules mapping
 * @returns {object} Object with { isValid, errors, value }
 */
const validateSchema = (data, schema) => {
  const errors = [];
  const value = {};
  
  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: [{ field: '_root', message: 'Data must be a non-null object.' }],
      value: {}
    };
  }
  
  for (const [field, rule] of Object.entries(schema)) {
    const inputVal = data[field];
    try {
      let parsedVal;
      const type = rule.type;
      
      const opts = {
        required: rule.required,
        min: rule.min,
        max: rule.max,
        minLength: rule.minLength,
        maxLength: rule.maxLength,
        integer: rule.integer
      };
      
      if (type === 'string') {
        parsedVal = validateString(inputVal, field, opts);
        if (rule.pattern && parsedVal !== null) {
          if (!rule.pattern.test(parsedVal)) {
            throw new Error(`"${field}" format is invalid.`);
          }
        }
      } else if (type === 'number') {
        parsedVal = validateNumber(inputVal, field, opts);
      } else if (type === 'boolean') {
        parsedVal = validateBoolean(inputVal, field, opts);
      } else if (type === 'enum') {
        parsedVal = validateEnum(inputVal, field, rule.allowed || [], opts);
      } else if (type === 'date') {
        parsedVal = validateDate(inputVal, field, opts);
      } else if (type === 'email') {
        parsedVal = validateEmail(inputVal, field, opts);
      } else {
        // Fallback for custom or direct validation
        parsedVal = inputVal;
        if (rule.required && (parsedVal === undefined || parsedVal === null)) {
          throw new Error(`"${field}" is required.`);
        }
      }
      
      if (parsedVal !== undefined && parsedVal !== null) {
        value[field] = parsedVal;
      }
    } catch (err) {
      errors.push({
        field: field,
        message: err.message
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    value: value
  };
};

module.exports = {
  validateString,
  validateNumber,
  validateBoolean,
  validateEnum,
  validateDate,
  validateCoordinates,
  validateEmail,
  validateSchema
};
