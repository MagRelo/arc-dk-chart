const { CanvasRenderService } = require('chartjs-node-canvas');
const { createCanvas, loadImage } = require('canvas');

const gradientColor1 = 'rgba(34,126,34,1)';
const gradientColor2 = 'rgba(168,251,60,1)';
const black = '#1e1e1e';
const gray = '#333333';
const green = '#61b510';
const white = '#e2e2e2';

const gutter = 40;
const avatarWidth = 180;

exports.buildImage = async function ({ width, height, player }) {
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // build background
  var blackGradient = context.createLinearGradient(300, 0, width, height);
  blackGradient.addColorStop(0.029, black);
  blackGradient.addColorStop(0.903, gray);
  context.fillStyle = blackGradient;
  context.fillRect(0, 0, width, height);

  if (player) {
    // build Player

    // avatar bg
    var greenGradient = context.createLinearGradient(
      0,
      0,
      avatarWidth,
      avatarWidth
    );
    greenGradient.addColorStop(0.029, gradientColor2);
    greenGradient.addColorStop(0.903, gradientColor1);
    context.fillStyle = greenGradient;
    context.fillRect(gutter, gutter, avatarWidth, avatarWidth);

    // player avatar
    const image = await loadImage(player.imageUrl);
    context.drawImage(image, gutter, gutter, avatarWidth, avatarWidth);

    // player name
    context.textBaseline = 'top';
    context.font = 'bold 60pt Ariel';
    context.fillStyle = white;
    const name = player.firstName + ' ' + player.lastName;
    const nameMetrics = context.measureText(name);
    const textHeight =
      nameMetrics.actualBoundingBoxAscent +
      nameMetrics.actualBoundingBoxDescent;
    context.fillText(name, gutter + avatarWidth + gutter, gutter);

    // player details
    const tag =
      player.position + ' • ' + player.teamCity + ' ' + player.teamName;
    context.font = '24pt Ariel';
    context.fillText(
      tag,
      gutter + avatarWidth + gutter,
      gutter + textHeight + 14
    );

    // player salary
    const salary = '$' + player.salary;
    context.font = 'bold 28pt Ariel';
    context.fillStyle = green;
    context.fillText(
      salary,
      gutter + avatarWidth + gutter,
      gutter + textHeight + 60
    );

    // chart
    const chartX = avatarWidth * 2 + gutter * 3;
    const chartY = gutter + avatarWidth + gutter;
    const chartWidth = width - gutter - gutter - chartX;
    const chartHeight = 300;

    const svgChartUrl = await renderChart(chartWidth, chartHeight, player);
    const chart = await loadImage(svgChartUrl);
    context.drawImage(chart, chartX, chartY, chartWidth, chartHeight);
  }

  // Footer
  context.fillStyle = green;
  context.font = '20pt Monospace';
  const url = 'dk.mattlovan.com';
  const urlMetrics = context.measureText(url);
  const urlHeight =
    urlMetrics.actualBoundingBoxAscent + urlMetrics.actualBoundingBoxDescent;
  context.fillText(url, gutter, height - gutter - urlHeight);

  // graph bg
  // context.fillStyle = '#61b51010';
  // context.fillRect(
  //   gutter,
  //   gutter + avatarWidth + gutter,
  //   width - gutter - gutter,
  //   300
  // );

  return canvas.toBuffer('image/png');
};

async function renderChart(width, height, player) {
  const canvasRenderService = new CanvasRenderService(width, height);
  return canvasRenderService.renderToDataURL(formatPlayer(player));
}

function formatPlayer(player) {
  // labels
  const labels = player.opponent
    ? player.opponent.map((opponent) => opponent.label)
    : [];

  // datasets
  // const dataSets = [];

  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Points',
          data: player.points,
          lineTension: 0.1,
          fill: false,
          backgroundColor: '#00A7F5',
          borderColor: '#00A7F5',
          borderWidth: 2,
        },
        {
          label: '2.5x',
          data: player.projected,
          fill: false,
          backgroundColor: 'gray',
          borderColor: 'gray',
          borderWidth: 5,
          borderDash: [10],
          pointRadius: 0,
        },
        {
          label: '3.5x',
          data: player.projectedWin,
          fill: false,
          backgroundColor: 'green',
          borderColor: 'green',
          borderWidth: 5,
          borderDash: [10],
          pointRadius: 0,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (value, index, values) {
                return Math.round(value / 1000);
              },
              beginAtZero: true,
              fontColor: 'white',
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontColor: '#999',
              fontStyle: 'bold',
            },
          },
        ],
      },
    },
  };
}
