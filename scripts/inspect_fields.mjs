import fs from 'node:fs';

async function inspectLiveFields() {
  const s2 = '1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${s2}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Website Enquiries')}`;
  const res = await fetch(csvUrl);
  const text = await res.text();
  
  // Parse CSV
  const parseCSVLine = (line) => {
    const result = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  };

  const lines = text.trim().split('\n');
  const rows = lines.map(parseCSVLine);
  const header = rows[0] || [];
  console.log('=== WEBSITE ENQUIRIES COLUMN STATS ===');
  console.log('Total Columns:', header.length, 'Total Data Rows:', rows.length - 1);
  header.forEach((h, i) => {
    const filledCount = rows.slice(1).filter(r => r[i] && r[i].length > 0 && r[i] !== '""').length;
    console.log(`${i + 1}. [${h}]: ${filledCount}/${rows.length - 1} populated (${Math.round((filledCount / (rows.length - 1)) * 100)}%)`);
  });

  // Let's also check Appointment Bookings
  const appUrl = `https://docs.google.com/spreadsheets/d/${s2}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Appointment Bookings')}`;
  const appRes = await fetch(appUrl);
  const appText = await appRes.text();
  const appLines = appText.trim().split('\n');
  const appRows = appLines.map(parseCSVLine);
  const appHeader = appRows[0] || [];
  console.log('\n=== APPOINTMENT BOOKINGS COLUMN STATS ===');
  console.log('Total Columns:', appHeader.length, 'Total Data Rows:', appRows.length - 1);
  appHeader.forEach((h, i) => {
    const filledCount = appRows.slice(1).filter(r => r[i] && r[i].length > 0 && r[i] !== '""').length;
    console.log(`${i + 1}. [${h}]: ${filledCount}/${appRows.length - 1} populated (${Math.round((filledCount / (appRows.length - 1)) * 100)}%)`);
  });
}

inspectLiveFields().catch(console.error);
