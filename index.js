const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const PV_DIR = '/krishna_PV_dir'; // Adjust if your first name differs

app.post('/store-file', async (req, res) => {
    const { file, data } = req.body;

    if (!file || !data) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join(PV_DIR, file);
    const newData = data.replace(", ", ",").replace("\n ", "\n");

    console.log('Writing to:', filePath);
    console.log('Data being written:', newData);

    try {
        await fs.writeFile(filePath, newData, 'utf8');
        console.log('File written successfully');
        return res.status(200).json({ file, message: 'Success.' });
    } catch (error) {
        console.error('Error storing file:', error.message);
        return res.status(500).json({ file, error: 'Error while storing the file to the storage.' });
    }
});

// POST /calculate
app.post('/calculate', async (req, res) => {
    const { file, product } = req.body;

    if (!file) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    const filePath = path.join(PV_DIR, file);

    if (!await fs.access(filePath).then(() => true).catch(() => false)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }

    try {
        const response = await axios.post('http://app2:5000/calculate', { file, product });
        return res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error forwarding request:', error.message);
        return res.status(500).json({ file, error: 'Input file not in CSV format.' });
    }
});

app.listen(6000, () => {
    console.log('Container 1 is running on port 6000');
});