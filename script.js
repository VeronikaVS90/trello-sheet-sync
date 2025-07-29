require('dotenv').config();

const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TOKEN;
const BOARD_ID = process.env.BOARD_ID;
const SHEET_ID = process.env.SHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME;

function getCardCreationDate(cardId) {
    const timestampHex = cardId.substring(0, 8);
    const timestamp = parseInt(timestampHex, 16);
    return new Date(timestamp * 1000);
};

function importNewTrelloCards() {
  const url = `https://api.trello.com/1/boards/${BOARD_ID}/cards?key=${API_KEY}&token=${TOKEN}`;
  const response = UrlFetchApp.fetch(url);
    const cards = JSON.parse(response.getContentText());

    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    let data = sheet.getDataRange().getValues();
    
}