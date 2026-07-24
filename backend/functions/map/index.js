const express = require('express');
const { executeQuery, escapeString, checkRole, redactPII, getCacheValue, setCacheValue, sendSuccess, sendError } = require('../shared');

const app = express();
app.use(express.json());

const handleHotspots = async (req, res) => {
  const { district, category, dateFrom, dateTo, clusterSize = '0.01' } = req.query;
  const userRole = req.user.role;
  
  // Create cache key based on filters
  const cacheKey = `map_hotspots_${district || 'all'}_${category || 'all'}_${dateFrom || 'all'}_${dateTo || 'all'}_${clusterSize}`;
  
  const cachedData = await getCacheValue(req, cacheKey);
  if (cachedData) {
    return sendSuccess(res, cachedData, { source: 'cache' });
  }

  try {
    let sql = `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.latitude, CaseMaster.longitude, CaseMaster.crime_registered_date, District.district_name, Unit.unit_name, CaseCategory.category_name 
               FROM CaseMaster 
               LEFT JOIN District ON CaseMaster.district_id = District.ROWID 
               LEFT JOIN Unit ON CaseMaster.unit_id = Unit.ROWID 
               LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID`;
               
    const whereClauses = [];
    if (district) {
      whereClauses.push(`District.district_name = '${escapeString(district)}'`);
    }
    if (category) {
      whereClauses.push(`CaseCategory.category_name = '${escapeString(category)}'`);
    }
    if (dateFrom) {
      whereClauses.push(`CaseMaster.crime_registered_date >= '${escapeString(dateFrom)}'`);
    }
    if (dateTo) {
      whereClauses.push(`CaseMaster.crime_registered_date <= '${escapeString(dateTo)}'`);
    }
    
    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }
    
    const rawRows = await executeQuery(req, sql);
    
    const clusters = {};
    const fallbackDistrictAggregates = {};
    const hasCoordinates = [];
    const missingCoordinates = [];
    
    const districtCenters = {
      'bengaluru': { lat: 12.9716, lng: 77.5946 },
      'mysuru': { lat: 12.2958, lng: 76.6394 },
      'belagavi': { lat: 15.8497, lng: 74.4977 },
      'mangauru': { lat: 12.9141, lng: 74.8560 },
      'hubballi-dharwad': { lat: 15.3647, lng: 75.1240 },
      'kalaburagi': { lat: 17.3297, lng: 76.8343 },
      'davanagere': { lat: 14.4644, lng: 75.9218 },
      'shivamogga': { lat: 13.9299, lng: 75.5681 },
      'ballari': { lat: 15.1394, lng: 76.9214 },
      'vijayapura': { lat: 16.8302, lng: 75.7100 },
      'tumakuru': { lat: 13.3392, lng: 77.1015 },
      'mandya': { lat: 12.5218, lng: 76.8951 },
      'hassan': { lat: 13.0068, lng: 76.1027 },
      'bidar': { lat: 17.9120, lng: 77.5028 },
      'kolar': { lat: 13.1367, lng: 78.1292 },
      'chikkamagaluru': { lat: 13.3161, lng: 75.7720 },
      'udupi': { lat: 13.3409, lng: 74.7421 }
    };
    
    const size = parseFloat(clusterSize) || 0.01;
    
    rawRows.forEach(row => {
      const data = {
        rowId: row.CaseMaster?.ROWID,
        fir_number: row.CaseMaster?.fir_number,
        latitude: parseFloat(row.CaseMaster?.latitude),
        longitude: parseFloat(row.CaseMaster?.longitude),
        crime_registered_date: row.CaseMaster?.crime_registered_date,
        district_name: row.District?.district_name,
        unit_name: row.Unit?.unit_name,
        category_name: row.CaseCategory?.category_name
      };
      
      if (!isNaN(data.latitude) && !isNaN(data.longitude)) {
        hasCoordinates.push(data);
        
        const latGrid = Math.round(data.latitude / size) * size;
        const lngGrid = Math.round(data.longitude / size) * size;
        const key = `${latGrid.toFixed(4)},${lngGrid.toFixed(4)}`;
        
        if (!clusters[key]) {
          clusters[key] = {
            lat: latGrid,
            lng: lngGrid,
            count: 0,
            cases: []
          };
        }
        clusters[key].count++;
        if (clusters[key].cases.length < 10) {
          clusters[key].cases.push({
            rowId: data.rowId,
            fir_number: data.fir_number,
            category_name: data.category_name,
            district_name: data.district_name,
            unit_name: data.unit_name
          });
        }
      } else {
        missingCoordinates.push(data);
        const distKey = (data.district_name || 'Unknown').toLowerCase().trim();
        if (!fallbackDistrictAggregates[distKey]) {
          const center = districtCenters[distKey] || { lat: 12.9716, lng: 77.5946 };
          fallbackDistrictAggregates[distKey] = {
            district_name: data.district_name || 'Unknown',
            lat: center.lat,
            lng: center.lng,
            count: 0,
            cases: []
          };
        }
        fallbackDistrictAggregates[distKey].count++;
        if (fallbackDistrictAggregates[distKey].cases.length < 10) {
          fallbackDistrictAggregates[distKey].cases.push({
            rowId: data.rowId,
            fir_number: data.fir_number,
            category_name: data.category_name,
            district_name: data.district_name,
            unit_name: data.unit_name
          });
        }
      }
    });
    
    const responsePayload = {
      clusters: Object.values(clusters),
      districtFallbacks: Object.values(fallbackDistrictAggregates),
      metadata: {
        totalRows: rawRows.length,
        hasCoordinatesCount: hasCoordinates.length,
        missingCoordinatesCount: missingCoordinates.length,
        generatedAt: new Date().toISOString()
      }
    };
    
    await setCacheValue(req, cacheKey, responsePayload, 1);
    
    return sendSuccess(res, responsePayload);
  } catch (err) {
    console.error('Error fetching map hotspots:', err.message || err);
    return sendError(res, 'DB_ERROR', 'Failed to retrieve map hotspot data.');
  }
};

app.get('/map/hotspots', checkRole(['admin', 'investigator', 'analyst']), handleHotspots);
app.get('/hotspots', checkRole(['admin', 'investigator', 'analyst']), handleHotspots);
app.get('/', checkRole(['admin', 'investigator', 'analyst']), handleHotspots);

module.exports = app;
