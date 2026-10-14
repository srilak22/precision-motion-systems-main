async function testGasPost() {
  const url = 'https://script.google.com/macros/s/AKfycbw8NhfkPJGeYu4NAaisxN3FHaWmAVlZTmEO2x1CsBirRPvt5pQjI5zNv3qVXqEA2W1a/exec';
  const payload = {
    spreadsheetId: '1S-ApP83X9Y1-nXwim0tDNGn72wuhVn4PSbaWkcXlH48',
    sheet: 'Leads',
    leadId: 'test_verify_gas_' + Date.now(),
    fullName: 'Test Lead Verification',
    emailAddress: 'test-verify@indus-robotics.com',
    companyName: 'Test Indus Verification',
    jobTitle: 'VP Engineering',
    formName: 'LinkedIn Lead Gen Form',
    campaignName: 'Test Campaign LIT',
    leadStatus: 'Test Verified',
    jiraTicketKey: 'LIT-1',
    jiraIssueKey: 'LIT-1',
    jiraIssueUrl: 'https://srilakshanaint2027g3-1790324760192.atlassian.net/browse/LIT-1',
    jiraSyncStatus: 'SUCCESS',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  console.log('Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Response text:', text);
}

testGasPost().catch(console.error);
