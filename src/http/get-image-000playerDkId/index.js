// const fs = require('fs/promises');
let { tables, http, static } = require('@architect/functions');
let { buildImage } = require('./buildPlayerImage');

async function handler(request) {
  try {
    // Input validation
    let playerDkId = parseInt(request.pathParameters.playerDkId);

    // check for file
    // const file = await readFile(playerDkId);
    // if (file) {
    //   console.log('image found');

    //   // send file
    //   return {
    //     statusCode: 200,
    //     headers: { 'content-type': 'image/png' },
    //     body: file,
    //   };
    // }

    // Get data
    const data = await tables();
    const player = await data.playerweek.get({ playerDkId });
    if (!player) {
      console.log('no player');
      return {
        statusCode: 404,
        headers: { 'content-type': 'text/html' },
        body: 'Not Found',
      };
    }

    // Build image
    const image = await buildImage({
      width: 1200,
      height: 630,
      player: player,
    });

    // save file
    // const result = writeFile('');

    return {
      statusCode: 200,
      headers: { 'content-type': 'image/png' },
      body: image,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers: { 'content-type': 'application/json' },
      body: error,
    };
  }
}

exports.handler = http.async(handler);

// function readFile() {
//   // write local
//   if (NODE_ENV === 'testing') {
//     const filePath = '' + playerDkId;
//     return fs.readFile(filePath);
//   }

//   // write to S3
//   if (NODE_ENV === 'staging' || NODE_ENV === 'production') {
//   }

//   throw Error('readFile: no env');
// }

// function writeFile() {
//   // write local
//   if (NODE_ENV === 'testing') {
//   }

//   // write to S3
//   if (NODE_ENV === 'staging' || NODE_ENV === 'production') {
//   }

//   throw Error('writeFile: no env');
// }
