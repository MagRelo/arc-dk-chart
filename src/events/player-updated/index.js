// player-updated

exports.handler = async function subscribe(event) {
  const message = JSON.parse(event.Records[0].Sns.Message);
  console.log('event:', message.name, 'data:', !!message.data);

  // trigger other events(?)

  // Event: buildPlayerImage({size: large, med, small, data: {} })

  return;
};
