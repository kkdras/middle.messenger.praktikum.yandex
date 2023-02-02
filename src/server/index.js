import express  from 'express';
import { readFile } from 'node:fs';
import path from 'node:path';
const app = express();
const PORT = 3000;

const ROOT = process.cwd();

const readFilePromisify = (path, encoding = 'utf-8') => new Promise((res, rej) => {
   readFile(path, { encoding }, (err, data) => {
      if (err) rej(err)
      else res(data)
   });
});

app.use(express.static(path.resolve(ROOT, 'build/client')));

app.get('/*', async (req, res) => {
   try {
      if (req.url.includes('#') || req.url === '/') {
         const page = await readFilePromisify(path.resolve(ROOT, 'build/client/index.html'));
         res.status(200).send(page);
      } else{
         res.redirect(`/#${req.url.slice(1)}`);
      }
   } catch (e) {
      res.status(500).send(e.message);
   }
});

app.get('*', (res, req) => {
   res.status(404).send('The page not found');
});

app.listen(PORT, () => {
   console.log(`start listening server on ${PORT} port`);
});