let { tables, http } = require('@architect/functions');

async function handler(request) {
  // Input Validation
  let playerDkId = parseInt(request.pathParameters.playerDkId);

  let data = await tables();
  let player = await data.playerweek.get({ playerDkId });

  // return
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(player),
  };
}

exports.handler = http.async(handler);
