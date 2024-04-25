const express = require('express');
const fs = require('fs');
const multer = require('multer');
const con = require('./db');

const router = express.Router();

// Multer konfiguráció a fájlfeltöltéshez
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'views/pictures/'); // Mappa, ahova a képeket menteni szeretnéd
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Egyedi fájlnév generálása
  }
});
const upload = multer({ storage: storage });

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/pictures', express.static(__dirname + '/views/pictures'));

router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.get('/post', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});



// Fájlfeltöltési útvonal
router.post('/upload', upload.single('file'), (req, res) => {
  // A fájl elérési útvonala
  const file = req.file;

  // Olvasd be a fájlt bináris formában
  const data = fs.readFileSync(file.path);

  // Mentsd el a képet az adatbázisba
  con.query('INSERT INTO auto (szin, marka, kep) VALUES (?, ?, ?)', [req.body.szin, req.body.marka, data], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Hiba történt az adatok mentésekor.');
    } else {
      console.log("Sikeresen hozzáadva az adatbázishoz.");
      res.redirect('/post');
    }
  });
});

router.get('/fetch', (req, res) => {
  con.query("SELECT id, szin, marka, kep FROM auto", (err, result, fields) => {
    if (err) {
      console.log(err);
      res.status(500).send('Hiba történt az adatok lekérdezésekor.');
    } else {
      // Az autók képeit alakítsd át base64 kódolásra
      result.forEach(auto => {
        auto.kep = Buffer.from(auto.kep, 'binary').toString('base64');
      });
      res.render('table', { autok: result }); // Táblázat megjelenítése az EJS fájlon keresztül
    }
  });
});



module.exports = router;
