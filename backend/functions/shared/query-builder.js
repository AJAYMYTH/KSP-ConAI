/**
 * query-builder.js
 *
 * A parameterized-like query builder for ZCQL (Zoho Catalyst Query Language).
 * Since Catalyst ZCQL only accepts strings, this builder performs strict input sanitization,
 * value escaping, and table/column whitelisting to guarantee protection against SQL injection.
 * Supports Select, Joins, Where clauses (including logical OR/AND), Order By, Limit, and Offset.
 * NodeJS 20 compatible.
 */

const { ALLOWED_TABLES, ALLOWED_VIEWS, ALLOWED_COLUMNS } = require('./constants');

/**
 * Escapes values for safe insertion into raw SQL queries.
 *
 * @param {any} val - Value to escape (string, number, boolean, date, array, or null)
 * @returns {string} Safe SQL-escaped string representation
 */
const escapeValue = (val) => {
  if (val === null || val === undefined) {
    return 'NULL';
  }
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) {
      throw new Error('Invalid numeric value: Infinite or NaN is not supported.');
    }
    return String(val);
  }
  if (typeof val === 'boolean') {
    return val ? 'true' : 'false';
  }
  if (val instanceof Date) {
    return `'${formatDate(val)}'`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) {
      throw new Error('Empty arrays cannot be escaped for SQL IN clauses.');
    }
    return val.map(escapeValue).join(', ');
  }
  if (typeof val === 'string') {
    // SQL standard escaping of single quotes by doubling them
    return `'${val.replace(/'/g, "''")}'`;
  }
  throw new Error(`Unsupported value type for SQL escaping: ${typeof val}`);
};

/**
 * Helper to format date into standard SQL datetime format (YYYY-MM-DD HH:mm:ss)
 */
const formatDate = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${m}-${d} ${h}:${mi}:${s}`;
};

/**
 * Validates that a table/view name is whitelisted.
 */
const validateTable = (tableName) => {
  if (!ALLOWED_TABLES[tableName] && !ALLOWED_VIEWS[tableName]) {
    throw new Error(`Unauthorized table or view access: "${tableName}"`);
  }
};

/**
 * Validates a table alias.
 */
const validateAlias = (alias) => {
  if (alias && !/^[a-zA-Z0-9_]+$/.test(alias)) {
    throw new Error(`Invalid table alias name: "${alias}". Only alphanumeric characters and underscores are allowed.`);
  }
};

/**
 * Validates a column reference, supporting table prefixes (e.g. TableName.column_name).
 */
const validateColumnReference = (colRef, mainTable, tableAliases = {}) => {
  const cleaned = colRef.trim();
  const parts = cleaned.split('.');
  
  if (parts.length > 2) {
    throw new Error(`Invalid column reference format: "${colRef}"`);
  }

  if (parts.length === 2) {
    const tableOrAlias = parts[0].trim();
    const colName = parts[1].trim();
    
    // Resolve alias to actual table
    const actualTable = tableAliases[tableOrAlias] || tableOrAlias;
    validateTable(actualTable);
    
    if (colName !== '*') {
      const whitelist = ALLOWED_COLUMNS[actualTable] || [];
      if (!whitelist.includes(colName)) {
        throw new Error(`Unauthorized column "${colName}" for table/view "${actualTable}" (referenced as "${tableOrAlias}.${colName}")`);
      }
    }
  } else {
    // Single column name. Must check against the main table
    const colName = parts[0].trim();
    if (colName !== '*') {
      if (!mainTable) {
        throw new Error(`Cannot validate column reference "${colName}" without a main table context.`);
      }
      const whitelist = ALLOWED_COLUMNS[mainTable] || [];
      if (!whitelist.includes(colName)) {
        throw new Error(`Unauthorized column "${colName}" for main table/view "${mainTable}"`);
      }
    }
  }
};

/**
 * Validates a complete column expression (handling functions like COUNT, SUM and aliases).
 */
const validateExpression = (expr, mainTable, tableAliases = {}) => {
  const cleaned = expr.trim();
  
  // Check for alias: "expression AS alias_name"
  const aliasMatch = cleaned.match(/^(.+)\s+AS\s+([a-zA-Z0-9_]+)$/i);
  let baseExpr = cleaned;
  if (aliasMatch) {
    baseExpr = aliasMatch[1].trim();
  }
  
  // Check for aggregate functions: COUNT(col), SUM(col), AVG(col), MIN(col), MAX(col)
  const funcMatch = baseExpr.match(/^(COUNT|SUM|AVG|MIN|MAX)\(\s*([a-zA-Z0-9_\.\*]+)\s*\)$/i);
  if (funcMatch) {
    const innerColRef = funcMatch[2].trim();
    validateColumnReference(innerColRef, mainTable, tableAliases);
  } else {
    validateColumnReference(baseExpr, mainTable, tableAliases);
  }
};

/**
 * Compiles a structured WHERE object into a SQL string.
 */
const compileWhere = (whereObj, mainTable, tableAliases = {}) => {
  if (!whereObj || typeof whereObj !== 'object' || Object.keys(whereObj).length === 0) {
    return '';
  }
  
  const conditions = [];
  
  for (const [key, cond] of Object.entries(whereObj)) {
    // Handle logical OR
    if (key === '_or' || key === '$or') {
      if (!Array.isArray(cond)) {
        throw new Error('OR conditions must be supplied in an array of filter objects.');
      }
      const subConditions = cond
        .map(subWhere => {
          const compiledSub = compileWhere(subWhere, mainTable, tableAliases);
          return compiledSub ? `(${compiledSub})` : '';
        })
        .filter(Boolean);
      
      if (subConditions.length > 0) {
        conditions.push(`(${subConditions.join(' OR ')})`);
      }
      continue;
    }
    
    // Validate the column key (field name)
    validateColumnReference(key, mainTable, tableAliases);
    
    if (cond === null || cond === undefined) {
      conditions.push(`${key} IS NULL`);
    } else if (typeof cond === 'object' && !Array.isArray(cond) && !(cond instanceof Date)) {
      // Descriptor with operator: e.g. { operator: '>=', value: 10 }
      const op = String(cond.operator).toUpperCase().trim();
      const val = cond.value;
      
      const allowedOperators = ['=', '!=', '<>', '>', '>=', '<', '<=', 'LIKE', 'IN', 'NOT IN', 'BETWEEN', 'IS NULL', 'IS NOT NULL'];
      if (!allowedOperators.includes(op)) {
        throw new Error(`Unsupported SQL operator: "${op}" in query builders.`);
      }
      
      if (op === 'IS NULL') {
        conditions.push(`${key} IS NULL`);
      } else if (op === 'IS NOT NULL') {
        conditions.push(`${key} IS NOT NULL`);
      } else if (op === 'BETWEEN') {
        if (!Array.isArray(val) || val.length !== 2) {
          throw new Error(`BETWEEN operator requires a 2-element array for column "${key}".`);
        }
        conditions.push(`${key} BETWEEN ${escapeValue(val[0])} AND ${escapeValue(val[1])}`);
      } else if (op === 'IN' || op === 'NOT IN') {
        if (!Array.isArray(val)) {
          throw new Error(`${op} operator requires an array of values for column "${key}".`);
        }
        if (val.length === 0) {
          conditions.push(op === 'IN' ? '1 = 0' : '1 = 1');
        } else {
          conditions.push(`${key} ${op} (${escapeValue(val)})`);
        }
      } else {
        conditions.push(`${key} ${op} ${escapeValue(val)}`);
      }
    } else if (Array.isArray(cond)) {
      // Default array behavior is IN
      if (cond.length === 0) {
        conditions.push('1 = 0');
      } else {
        conditions.push(`${key} IN (${escapeValue(cond)})`);
      }
    } else {
      // Simple equality
      conditions.push(`${key} = ${escapeValue(cond)}`);
    }
  }
  
  return conditions.join(' AND ');
};

class QueryBuilder {
  constructor() {
    this._selectColumns = [];
    this._fromTable = '';
    this._fromAlias = '';
    this._joins = [];
    this._whereObj = {};
    this._orderByCol = '';
    this._orderByDir = 'ASC';
    this._limit = null;
    this._offset = null;
    
    // Track aliases to resolve columns in JOINs
    this._tableAliases = {};
  }

  /**
   * Sets SELECT columns.
   *
   * @param {string[]|string} cols - Array of columns, or comma-separated column string
   */
  select(cols) {
    if (Array.isArray(cols)) {
      this._selectColumns = cols.map(c => c.trim());
    } else if (typeof cols === 'string') {
      this._selectColumns = cols.split(',').map(c => c.trim());
    } else {
      throw new Error('SELECT columns must be an array of strings or a comma-separated string.');
    }
    return this;
  }

  /**
   * Sets the target table for FROM.
   */
  from(tableName, alias = '') {
    validateTable(tableName);
    this._fromTable = tableName;
    
    if (alias) {
      validateAlias(alias);
      this._fromAlias = alias;
      this._tableAliases[alias] = tableName;
    }
    return this;
  }

  /**
   * Adds a JOIN to the query.
   *
   * @param {string} tableName - Joined table name
   * @param {string} alias - Alias for joined table
   * @param {string} condition - Join condition (e.g. "ON ComplainantDetails.case_id = CaseMaster.ROWID")
   */
  join(tableName, alias, condition) {
    validateTable(tableName);
    validateAlias(alias);
    
    const conditionClean = condition.trim();
    // Validate join condition syntax: ON Table1.col1 = Table2.col2
    const match = conditionClean.match(/^\s*ON\s+([a-zA-Z0-9_\.]+)\s*=\s*([a-zA-Z0-9_\.]+)\s*$/i);
    if (!match) {
      throw new Error(`Invalid join condition: "${condition}". Only "ON TableOrAlias.column = TableOrAlias.column" is supported.`);
    }

    // Register alias before validation
    this._tableAliases[alias] = tableName;

    // Validate both columns in the ON condition
    validateColumnReference(match[1], this._fromTable, this._tableAliases);
    validateColumnReference(match[2], this._fromTable, this._tableAliases);

    this._joins.push({ tableName, alias, condition: conditionClean });
    return this;
  }

  /**
   * Sets WHERE conditions.
   *
   * @param {object} whereObj - Structured condition mapping
   */
  where(whereObj) {
    if (whereObj && typeof whereObj === 'object') {
      this._whereObj = { ...this._whereObj, ...whereObj };
    }
    return this;
  }

  /**
   * Sets ORDER BY clause.
   */
  orderBy(column, direction = 'ASC') {
    this._orderByCol = column;
    const dir = String(direction).toUpperCase().trim();
    if (dir !== 'ASC' && dir !== 'DESC') {
      throw new Error('ORDER BY direction must be ASC or DESC.');
    }
    this._orderByDir = dir;
    return this;
  }

  /**
   * Sets LIMIT.
   */
  limit(limitVal) {
    const val = parseInt(limitVal, 10);
    if (isNaN(val) || val < 0) {
      throw new Error('LIMIT must be a non-negative integer.');
    }
    this._limit = val;
    return this;
  }

  /**
   * Sets OFFSET.
   */
  offset(offsetVal) {
    const val = parseInt(offsetVal, 10);
    if (isNaN(val) || val < 0) {
      throw new Error('OFFSET must be a non-negative integer.');
    }
    this._offset = val;
    return this;
  }

  /**
   * Compiles and validates the query into a safe ZCQL string.
   */
  build() {
    if (!this._fromTable) {
      throw new Error('FROM table is required to build a query.');
    }
    
    // Default to * if no columns specified
    if (this._selectColumns.length === 0) {
      this._selectColumns = ['*'];
    }

    // 1. Validate all SELECT expressions
    this._selectColumns.forEach(expr => {
      validateExpression(expr, this._fromTable, this._tableAliases);
    });

    // 2. Validate ORDER BY column
    if (this._orderByCol) {
      validateColumnReference(this._orderByCol, this._fromTable, this._tableAliases);
    }

    // Construct SQL parts
    const columnsStr = this._selectColumns.join(', ');
    const fromStr = this._fromAlias ? `${this._fromTable} ${this._fromAlias}` : this._fromTable;
    
    let sql = `SELECT ${columnsStr} FROM ${fromStr}`;

    // Append Joins
    if (this._joins.length > 0) {
      const joinsStr = this._joins.map(j => `JOIN ${j.tableName} ${j.alias} ${j.condition}`).join(' ');
      sql += ` ${joinsStr}`;
    }

    // Append Where
    const whereStr = compileWhere(this._whereObj, this._fromTable, this._tableAliases);
    if (whereStr) {
      sql += ` WHERE ${whereStr}`;
    }

    // Append Order By
    if (this._orderByCol) {
      sql += ` ORDER BY ${this._orderByCol} ${this._orderByDir}`;
    }

    // Append Limit
    if (this._limit !== null) {
      sql += ` LIMIT ${this._limit}`;
    }

    // Append Offset
    if (this._offset !== null) {
      sql += ` OFFSET ${this._offset}`;
    }

    return sql;
  }
}

module.exports = {
  QueryBuilder,
  escapeValue,
  validateTable,
  validateColumnReference,
  validateExpression,
  compileWhere
};
