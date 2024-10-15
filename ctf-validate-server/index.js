const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3200;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const CORRECT_KEY = '1234';
const SUBMISSION_FILE_PATH = './submissions.json';
const FAILED_SUBMISSION_FILE_PATH = './failed_submissions.json';

app.post('/answer', async (req, res) => {
    const { key, email } = req.body;

    if (!key || !email) {
        return res.sendStatus(400); // Bad Request if key or email is missing
    }

    if (key === CORRECT_KEY) {
        const submission = {
            email: email,
            timestamp: new Date().toISOString(),
            providedKey: key,
        };

        // Read the existing file, append the new submission, and save it back
        fs.readFile(SUBMISSION_FILE_PATH, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error reading file:', err);
                return res.sendStatus(500);
            }

            let submissions = [];

            // If the file exists and has data, parse it as JSON
            if (data) {
                try {
                    submissions = JSON.parse(data);
                } catch (parseErr) {
                    console.error('Error parsing JSON:', parseErr);
                    return res.sendStatus(500);
                }
            }

            // Add the new submission
            submissions.push(submission);

            // Write the updated array back to the file
            fs.writeFile(SUBMISSION_FILE_PATH, JSON.stringify(submissions, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing to file:', writeErr);
                    return res.sendStatus(500);
                }

                return res.send({ correct: true });
            });
        });
    } else {
        const failedSubmission = {
            email: email,
            timestamp: new Date().toISOString(),
            providedKey: key,
        };

        // Log failed attempts
        fs.readFile(FAILED_SUBMISSION_FILE_PATH, 'utf8', (err, data) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error reading failed submissions file:', err);
                return res.sendStatus(500);
            }

            let failedSubmissions = [];

            // If the file exists and has data, parse it as JSON
            if (data) {
                try {
                    failedSubmissions = JSON.parse(data);
                } catch (parseErr) {
                    console.error('Error parsing failed submissions JSON:', parseErr);
                    return res.sendStatus(500);
                }
            }

            // Add the new failed submission
            failedSubmissions.push(failedSubmission);

            // Write the updated failed attempts to the file
            fs.writeFile(FAILED_SUBMISSION_FILE_PATH, JSON.stringify(failedSubmissions, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Error writing failed submission:', writeErr);
                    return res.sendStatus(500);
                }

                return res.send({ correct: false });
            });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
