// CSV Parsing & Validation Utility for Student Bulk Import

/**
 * Parses raw CSV string into rows and objects
 */
export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') {
    return { headers: [], rows: [] };
  }

  const lines = [];
  let currentLine = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentField.trim());
      if (currentLine.some((field) => field.length > 0)) {
        lines.push(currentLine);
      }
      currentLine = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField || currentLine.length > 0) {
    currentLine.push(currentField.trim());
    if (currentLine.some((field) => field.length > 0)) {
      lines.push(currentLine);
    }
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const rawHeaders = lines[0];
  const headers = rawHeaders.map((h) => normalizeHeaderKey(h));

  const rows = lines.slice(1).map((line, rowIndex) => {
    const rowObj = { _rowIndex: rowIndex + 2 };
    headers.forEach((h, colIndex) => {
      rowObj[h] = line[colIndex] !== undefined ? line[colIndex] : '';
    });
    return rowObj;
  });

  return { headers, rawHeaders, rows };
}

/**
 * Normalizes header keys (e.g. "Total Fee (₹)" -> "totalFee", "Parent's Name" -> "parentName")
 */
export function normalizeHeaderKey(header) {
  const clean = header.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (clean.includes('uid') || clean === 'id' || clean === 'studentid') return 'uid';
  if (clean.includes('parent') || clean.includes('father')) return 'parentName';
  if (clean.includes('name') || clean.includes('student')) return 'name';
  if (clean.includes('phone') || clean.includes('mobile') || clean.includes('contact')) return 'phone';
  if (clean.includes('email')) return 'email';
  if (clean.includes('class') || clean.includes('grade')) return 'class';
  if (clean.includes('section')) return 'section';
  if (clean.includes('paid')) return 'paidFee';
  if (clean.includes('total') || clean.includes('fee')) return 'totalFee';
  if (clean.includes('transport') || clean.includes('bus')) return 'transport';
  if (clean.includes('address') || clean.includes('city')) return 'address';

  return clean || header;
}

/**
 * Validates parsed student rows against required columns and checks duplicates
 */
export function validateStudentRows(rows, existingUids = new Set()) {
  const validRows = [];
  const invalidRows = [];
  const duplicateRows = [];
  const seenUidsInFile = new Set();

  rows.forEach((row) => {
    const uid = (row.uid || '').trim();
    const name = (row.name || '').trim();
    const studentClass = (row.class || '').trim();
    const totalFee = parseFloat(row.totalFee) || 0;
    const paidFee = parseFloat(row.paidFee) || 0;

    const errors = [];

    if (!uid) errors.push('Missing Student UID');
    if (!name) errors.push('Missing Student Name');
    if (!studentClass) errors.push('Missing Class');

    if (uid && (existingUids.has(uid) || seenUidsInFile.has(uid))) {
      duplicateRows.push({
        ...row,
        _errors: ['Duplicate Student UID already exists'],
      });
      return;
    }

    if (uid) seenUidsInFile.add(uid);

    if (errors.length > 0) {
      invalidRows.push({
        ...row,
        _errors: errors,
      });
    } else {
      validRows.push({
        uid,
        name,
        parentName: (row.parentName || '').trim(),
        phone: (row.phone || '').trim(),
        email: (row.email || '').trim().toLowerCase(),
        class: studentClass,
        section: (row.section || 'A').trim().toUpperCase(),
        totalFee,
        paidFee,
        pendingFee: Math.max(0, totalFee - paidFee),
        transportRequired: (row.transport || '').toLowerCase().includes('yes'),
        transportRoute: row.transportRoute || '',
        address: (row.address || '').trim(),
        status: 'active',
      });
    }
  });

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    duplicateRows,
  };
}

export default {
  parseCSV,
  normalizeHeaderKey,
  validateStudentRows,
};
