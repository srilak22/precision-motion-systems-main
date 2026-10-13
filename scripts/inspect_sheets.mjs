async function inspect() {
  const s2 = "1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48";
  const url = `https://docs.google.com/spreadsheets/d/${s2}/edit?usp=sharing`;
  const res = await fetch(url);
  const text = await res.text();
  
  // Look for sheet tab names inside Google Sheets bootstrap data
  const sheetNames = [];
  const re = /\[\d+,\d+,"([^"]+)",/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1] && m[1].length < 30 && !sheetNames.includes(m[1])) {
      sheetNames.push(m[1]);
    }
  }
  console.log("Candidate tab names in S2:", sheetNames);

  // Check CSV for each tab if known
  const tabs = ["Website Enquiries", "Leads", "Posts", "Interactions", "Page Analytics", "Appointment Bookings", "Sync Logs"];
  for (const tab of tabs) {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${s2}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
    const r = await fetch(csvUrl);
    if (r.ok) {
      const c = await r.text();
      const lines = c.trim().split("\n");
      console.log(`Tab: "${tab}" => lines: ${lines.length}, header: ${lines[0]?.slice(0, 80)}`);
      if (lines.length > 1) {
        console.log(`   Latest row in ${tab}:`, lines[lines.length - 1]?.slice(0, 100));
      }
    } else {
      console.log(`Tab: "${tab}" => status ${r.status}`);
    }
  }
}
inspect();
