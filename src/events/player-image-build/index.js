// learn more about event functions here: https://arc.codes/primitives/events
exports.handler = async function subscribe(event) {
  // extract
  const message = JSON.parse(event.Records[0].Sns.Message);
  console.log('event:', message.name, 'data:', !!message.data);

  // build image
  const image = await buildImage({
    width: data.width,
    height: data.height,
    player: data.player,
  });

  // save image to S3
  return;
};
