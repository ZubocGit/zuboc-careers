const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.pdf';
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({ storage });

app.post('/candidate-application', upload.single('cv'), (req, res) => {
  const { roleId, role, name, email, location, link, notes, timestamp, source } = req.body;

  console.log('Received application:', {
    roleId,
    role,
    name,
    email,
    location,
    link,
    notes,
    timestamp,
    source
  });

  if (req.file) {
    console.log('Saved file to:', req.file.path);
  } else {
    console.log('No file uploaded');
  }

  return res.status(200).json({ ok: true, message: 'Application received', file: req.file?.filename });
});

app.get('/', (_req, res) => {
  res.send('Zuboc local test server is running');
});

app.listen(PORT, () => {
  console.log(`Local server listening on http://localhost:${PORT}`);
});


