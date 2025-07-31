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
  
  // If the first row is not headers or the table is empty
  if (data.length === 0 || data[0][0] !== 'Назва') {
    sheet.clear();
    sheet.appendRow(['Назва', 'Опис', 'Дата створення', 'URL']);
    data = [['Назва', 'Опис', 'Дата створення', 'URL']]; //update locally
  }
    
  // Build a map of existing cards by URL
  const urlToRowIndex = {};
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const url = row[3]; //URL column
    if (url) {
      urlToRowIndex[url] = i + 1; // +1 for getRange (because row's count starts from 1)
    }
  }

  // Sort cards by creation date
  const sortedCards = cards.sort((a, b) => getCardCreationDate(a.id) - getCardCreationDate(b.id));

  sortedCards.forEach(card => {
    const createdDate = getCardCreationDate(card.id);
    const url = card.shortUrl;
    const name = "" + card.name;
    const desc = card.desc;

    if (urlToRowIndex[url]) {
      // Update an existing row
      const row = urlToRowIndex[url];
      sheet.getRange(row, 1).setValue(name);
      sheet.getRange(row, 2).setValue(desc);
      // Creation date is not updated
    } else {
      // Add a new row
      sheet.appendRow([name, desc, createdDate, url]);
    }
  });
}