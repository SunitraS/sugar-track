import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { google } from "googleapis";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// โหลด Service Account
const KEYFILE = "./line-liff-register-470917-a732482cbd70.json"; // เปลี่ยนเป็นไฟล์ JSON ของคุณ
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILE,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: "v4", auth });

// Google Sheet ID
const SPREADSHEET_ID = "12n9WzxXMZPF7a0Dpb2c10LprXNQqkqojKFQGhVN-QcU"; // เปลี่ยนเป็นของคุณ
const RANGE = "Users!A:E";

app.post("/register", async (req, res) => {
  const { userId, firstName, lastName, gender, age } = req.body;

  if (!userId || !firstName || !lastName || !gender || !age) {
    return res.json({ success: false, message: "ข้อมูลไม่ครบ" });
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: { values: [[userId, firstName, lastName, gender, age]] },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
