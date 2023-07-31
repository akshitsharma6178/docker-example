const fs = require('fs')
const https = require('https')
const express = require('express')
const multer = require('multer')
const { spawn } = require('child_process')
const cors = require("cors");
const app = express()
const port = 3000
const upload = multer();

var corsOptions = {
  origin: '*'
}

app.use(cors(corsOptions));

//default api

app.get('/', (req, res) => {
  res.send('Object-Detection API')
})

//upload
//image handling and processing
//expects fieldName 'file' of the file that is to be uploaded

app.post('/upload', upload.single('file'), (req, res) => {
  let imageBuffer = req.file.buffer;
  const python = spawn('python', ['./scripts/main.py']); //spawns a python script
  
  python.stdin.write(imageBuffer);
  python.stdin.end();

  let dataChunks = []

  python.stdout.on('data', (data) => { //python script output
    dataChunks.push(data)
  })

  python.stderr.on('data', (data) => { //python script error
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => { //python script exit
      console.log(`child process exited with code ${code}`);
      if(code !== 0) {
        if(!res.headersSent) {
          res.status(500).send({error: 'Internal Server Error: Script Failed to execute'})
          console.error('index.js: main.py Script faliure')
        }
      } else {
        if(dataChunks.length > 0) {
          let data = Buffer.concat(dataChunks);
          res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': data.length
          });
          res.end(data);
        } else {
          if(!res.headersSent) {
            res.status(500).send({error: 'Internal Server Error: No data to send'})
          }
        }
      }
  });
});

// https credentials

const privateKey = fs.readFileSync('./privatekey.pem', 'utf8');
const certificate = fs.readFileSync('./certificate.pem', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const httpsServer = https.createServer(credentials, app);

// end https credentials

httpsServer.listen(port, () => {
  console.log(`App listening on port ${port}`)
})