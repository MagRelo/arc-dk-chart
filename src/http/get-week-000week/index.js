let { tables } = require('@architect/functions');
let getData = require('@architect/shared/getWeek');

async function handler(request) {
  // Input Validation
  let week = parseInt(request.pathParameters.week);
  const response = await getData(week);

  // return
  return {
    statusCode: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(response),
  };
}

exports.handler = arc.http.async(handler);
