let { tables, http, events } = require('@architect/functions');
let getWeek = require('./getWeek');

async function handler(request) {
  // Input Validation
  let playerDkId = request.pathParameters.playerDkId;

  // get all
  const thisWeek = await getWeek(parseInt(process.env.WEEK));

  // Extract player
  const player = thisWeek.find((player) => player.playerDkId == playerDkId);
  player.playerPosition = player.position;

  // Save
  let savedPlayer;
  if (player) {
    let db = await tables();
    savedPlayer = await db.playerweek.put(player);

    // Publish Update event
    await events.publish({
      name: 'player-updated',
      payload: { name: 'player-updated', data: savedPlayer },
    });
  }

  // return
  return {
    statusCode: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
    body: `<div>${playerDkId}</div> <div>${JSON.stringify(savedPlayer)}</div>`,
  };
}

exports.handler = http.async(handler);
