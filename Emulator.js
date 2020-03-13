const express = require('express');
const router = express.Router();
const fs = require('fs');
const puppeteer = require('puppeteer');
const ffmpeg = require('fluent-ffmpeg');
const tmp = require('tmp');
const rateLimit = require("express-rate-limit");
const Progress = require('./Progress');

ffmpeg.setFfmpegPath('/usr/bin/ffmpeg');
//ffmpeg.setFfmpegPath('/usr/local/bin/ffmpeg');

// Limit requests
/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
router.use(limiter);*/


// Parse body up to 10mb
const bodyParser = require('body-parser');
router.use(bodyParser.json({
  limit: '10mb'
}));

// Launch Chromium browser
const browserPromise = puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  ignoreHTTPSErrors: true,
	dumpio: false
});

// Living Toolpic instance whose global scope offers the methods we will execute to render the image
const instanceRoot = 'https://gegen-den-virus.de/Toolpic/__render_api.html';
//const instanceRoot = 'http://localhost:443/__render_api.html';

// Handle /emulate/format request
router.post('/:format?', async function(req, res) {

  // Get format and fall back to PNG
  const format = req.params.format || 'png';

  console.log(format);

  const requestId = req.query.timestamp;
  const progressify = new Progress(["handling", "rendering", "processing"], requestId);

  // Get requested JSON body
  const bodyJSON = req.body;

  console.log(bodyJSON);

  // Get document description object by using the given document index from the JSON body
  const docDescriptor = bodyJSON.template.documents[bodyJSON.doc];

  // Get loaded browser instance from promise to variable
  const browser = await browserPromise;
  // Create a new page and wait for success
  const page = await browser.newPage();
  // Make background transparent (important for alpha transparency)
  page._emulationManager._client.send('Emulation.setDefaultBackgroundColorOverride', {
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 0
    }
  });

  // Set viewport to boundings of the requested document
  await page.setViewport({
    width: docDescriptor.width,
    height: docDescriptor.height
  });

  /*page.on('pageerror', error => {
    console.error(error.message);
  });*/

  progressify.handling = 1 / 5;


  // Go to living Toolpic instance for rendering process
  await page.goto(instanceRoot);

  progressify.handling = 2 / 5;

  //console.log("Loaded page!");

  // Apply start() function of living Toolpic instance that does the magic and initializes the given template with the given data and properties
  const result = await page.evaluate(async function(template, docIndex, data, renderings) {

    return await start(template, docIndex, data, renderings);

  }, bodyJSON.template, bodyJSON.doc, bodyJSON.data, bodyJSON.renderings);


  //console.log(result);

  // How many times the data needs to be updated to ensure that all sizes and values will be calculated correctly
  const dataUpdatesCount = 1;

  // Repeat update() function of living toolpic instance often as needed to ensure that the rendering process knows all calculated sizes and fonts
  for (var i = 0; i < dataUpdatesCount; i++) {
    // Always wait 100ms before the next update() applies
    await new Promise(function(resolve, reject) {
      setTimeout(async function() {
        await page.evaluate(async function(data) {
          return update(data);
        }, bodyJSON.data);
        resolve(true);
      }, 100);
    });
  }

  progressify.handling = 3 / 5;

  //console.log("Delay: " + bodyJSON.delay);

  // Wait 0ms (async) to continue
  await new Promise(function(resolve, reject) {
    setTimeout(async function() {
      //console.log("Delay timeout");
      resolve(true);
    }, bodyJSON.delay || 0);
  });

  progressify.handling = 4 / 5;



  console.log(format);

  if (format == "svg") {
    // Get SVG content
    const svg = await page.evaluate(function() {
      return document.getElementsByTagName("svg")[0].outerHTML;
    });

    await page.close();


    // Send 'Content-Length' header
    res.header('Content-Length', svg.length);
    res.header('Content-Type', 'image/svg+xml');
    // Send buffer back
    res.send(svg);
  }
  else if (format == "jpg") {

    const jpgBuffer = await page.screenshot({
      type: 'jpeg'
    });
    progressify.handling = 5 / 5;
    await page.close();


    // Send 'Content-Length' header
    res.header('Content-Length', jpgBuffer.length);
    res.header('Content-Type', 'image/jpeg');
    // Send buffer back
    res.write(jpgBuffer, 'binary');
    // End request
    res.end(null, 'binary');
  }
  else if (format == "pdf") {
    const pdfBuffer = await page.pdf({
      format: 'A4'
    });
    progressify.handling = 5 / 5;
    await page.close();


    // Send 'Content-Length' header
    res.header('Content-Length', pdfBuffer.length);
    res.header('Content-Type', 'application/pdf');
    // Send buffer back
    res.write(pdfBuffer, 'binary');
    // End request
    res.end(null, 'binary');
  }
  else if (format == "video") {

    console.log("Request ID: " + requestId);


    const frameRate = bodyJSON.template.video.frameRate || 24;
    const duration = bodyJSON.template.video.duration;
    const vcodec = bodyJSON.template.video.vcodec;
    const extension = bodyJSON.template.video.extension;
    const pix_fmt = bodyJSON.template.video.pix_fmt;

    const extMimes = {
      "mov": "video/quicktime",
      "mp4": "video/mp4"
    };

    res.header('Content-Type', extMimes[extension]);

    const theoreticallyFrameLength = 1000 / frameRate;

    console.log("FPS: " + frameRate + ", Duration: " + duration + ", VCodec: " + vcodec + ", Ext: " + extension);


    const frameTimeIndexes = new Array(Math.ceil((duration / 1000) * frameRate)).fill(true).map((val, index) => {
      return Math.round(theoreticallyFrameLength * index);
    });


    tmp.dir(async function _tempDirCreated(err, dirPath, cleanupCallback) {
      if (err) throw err;

      progressify.handling = 5 / 5;

      for (let timestamp of frameTimeIndexes) {
        let i = frameTimeIndexes.indexOf(timestamp);

        await page.evaluate(function(timestamp) {
          render.seekAnimations(timestamp);
        }, timestamp);

        const tmpFilePath = dirPath + "/frame" + String(i).padStart(4, "0") + ".png";
        //console.log(tmpFilePath);

        await page.screenshot({
          path: tmpFilePath,
          type: 'png'
        });

        const indexNatural = i + 1;

        console.log(indexNatural, frameTimeIndexes.length);

        progressify.rendering = indexNatural / frameTimeIndexes.length;

      }

      const framesPath = dirPath + "/frame%04d.png";
      const command = ffmpeg(framesPath);
      command.inputOptions([
        '-r ' + frameRate,
        '-f image2'
      ]);
      command.outputOptions([
        '-movflags isml+frag_keyframe',
        //'-c:v libvpx',
        //'-c:v libvpx-vp9',
        '-vcodec ' + vcodec, // libx264 libvpx qtrle ffvhuff huffyuv png
        //'-filter_complex [0:v][1:v]alphamerge',
        '-crf 25',
        '-pix_fmt ' + pix_fmt // argb yuv420p
        //`-vf "movie='image',alphaextract[a];[in][a]alphamerge"`,
        //'-c:v qtrle'

      ]);

      //res.header('Content-Length', pngBuffer.length);




      command.fps(frameRate);
  		command.size(docDescriptor.width + "x" + docDescriptor.height);
      command.toFormat(extension);
      command.on("progress", function(progress) {
        progressify.processing = progress.percent / 100;
      });
  		command.on("end", function() {
  			console.log("<ffmpeg> Done");
        cleanupCallback();
  			command.kill();
  		});
  		command.on("error", function(err) {
        console.error(err);
  			command.kill();
  		});
  		command.pipe(res, {
  			end: true
  		});

      await page.close();

    });

  }
  else {
    const pngBuffer = await page.screenshot();
    await page.close();


    // Send 'Content-Length' header
    res.header('Content-Length', pngBuffer.length);
    res.header('Content-Type', 'image/png');
    // Send buffer back
    res.write(pngBuffer, 'binary');
    // End request
    res.end(null, 'binary');
  }

  const time = Date.now();

  fs.appendFile(__dirname + '/log/log.txt', time + "\n", function (err) {
    if (err) {
      //console.error(err);
    }
  });
  //console.log(time);


});


module.exports = router;
