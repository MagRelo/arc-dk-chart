const fetch = require('node-fetch');

module.exports = async function getData(week) {
  const url = `https://live.draftkings.com/api/v2/leaderboards/players/seasons/2020/weeks/${week}/`;
  const dkResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sport: 'nfl', embed: 'stats' }),
  });
  if (dkResponse.status !== 200) {
    throw new Error(
      'failed to fetch from DK: (' + dkResponse.status + '). ' + url
    );
  }
  const jsonData = await dkResponse.json();

  // console.log(week, jsonData.data.length);
  return jsonData.data;
};
