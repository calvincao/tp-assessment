const columns = [
  'Client Name',
  'Client ID',
  'Pull Total',
  'Pull Successful Count',
  'Pull Amount',
  'Pull Successful Amount',
  'Push Total',
  'Push Amount',
  'Push Successful Amount',
];
const impliedDecimal = new Set([
  'Pull Successful Amount',
  'Pull Amount',
  'Push Amount',
  'Push Successful Amount',
]);
const convertToUSD = (num) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};
const fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) return Error(res.status);
    const text = await res.text();
    return text;
  } catch (err) {
    return err;
  }
};
const createTable = async () => {
  const requests = [
    fetchData('https://publictest.sandbox.tabapay.net/data1'),
    fetchData('https://publictest.sandbox.tabapay.net/data2'),
  ];
  const allRequestsData = await Promise.all(requests);
  if (allRequestsData.some((data) => data instanceof Error)) {
    document.querySelector('h1').innerText = 'Error fetching data';
    document.querySelector('div').remove();
    return;
  }
  const identity = allRequestsData[0].split('\n').map((entry) => {
    const splitEntry = entry.split(',');
    return {
      'Client Name': splitEntry[0],
      'Client ID': Number(splitEntry[1]),
    };
  });
  const accountData = allRequestsData[1].split('\n').map((entry) => {
    const splitEntry = entry.split(',');
    return {
      'Client ID': Number(splitEntry[0]),
      'Pull Total': Number(splitEntry[1]),
      'Pull Successful Count': Number(splitEntry[2]),
      'Pull Amount': Number(splitEntry[3]),
      'Pull Successful Amount': Number(splitEntry[4]),
      'Push Total': Number(splitEntry[5]),
      'Push Successful Count': Number(splitEntry[6]),
      'Push Amount': Number(splitEntry[7]),
      'Push Successful Amount': Number(splitEntry[8]),
    };
  });
  const accountsSummary = [];
  // merge the two arrays together and remove any lines of invalid data
  for (let i = 0; i < identity.length; i++) {
    if (
      Object.values(identity[i]).some((el) => el.length === 0) ||
      Object.values(accountData[i]).some((el) => isNaN(el))
    ) {
      continue;
    } else accountsSummary.push(Object.assign(identity[i], accountData[i]));
  }
  let ascending = false;
  // render column headers
  for (const column of columns) {
    const th = document.createElement('th');
    th.innerText = column;
    th.addEventListener('click', () => {
      if (!ascending) renderTableBody(accountsSummary.sort((a, b) => b[column] - a[column]));
      else renderTableBody(accountsSummary.sort((a, b) => a[column] - b[column]));
      ascending = !ascending;
    });
    document.querySelector('thead').append(th);
  }
  const renderTableBody = (tableData) => {
    document.querySelector('tbody').innerHTML = '';
    for (const customer of tableData) {
      const tr = document.createElement('tr');
      for (let c = 0; c < columns.length; c++) {
        const td = document.createElement('td');
        if (impliedDecimal.has(columns[c])) td.innerText = convertToUSD(customer[columns[c]]);
        else td.innerText = customer[columns[c]];
        tr.append(td);
      }
      document.querySelector('tbody').append(tr);
    }
  };
  renderTableBody(accountsSummary);
};

createTable();
