let { tables, http } = require('@architect/functions');

async function handler(request) {
  // Input Validation
  let position = request.pathParameters.position;

  // Get Data
  let data = await tables();
  // let results = await data.playerweek.scan({});
  let results = await data.playerweek.scan({
    FilterExpression: 'playerPosition = :position',
    ExpressionAttributeValues: {
      ':position': position,
    },
  });

  // return
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(results.Items),
  };
}

exports.handler = http.async(handler);
