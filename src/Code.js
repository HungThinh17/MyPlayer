// Global variable for the media folder ID
const mediaFolderId = '1LHWb61xJqv56PS6O2Nk7rH5cyaoEx_X-';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('My Music')
    .addItem('Launch Music', 'launchMusicDialog')
    .addItem('Create New Music List', 'createMusicList')
    .addToUi();
}

function convMediaToDataUri(filename) {
  filename = filename || "LyCayBong.mp3";
  const folder = DriveApp.getFolderById(mediaFolderId);
  const files = folder.getFilesByName(filename);
  
  if (!files.hasNext()) {
    throw new Error("File not found.");
  }
  
  const file = files.next();
  const blob = file.getBlob();
  const b64DataUri = 'data:' + blob.getContentType() + ';base64,' + Utilities.base64Encode(blob.getBytes());
  
  Logger.log(b64DataUri);
  return { filename: file.getName(), uri: b64DataUri };
}

function launchMusicDialog() {
  const userInterface = HtmlService.createHtmlOutputFromFile('index');
  SpreadsheetApp.getUi().showModelessDialog(userInterface, 'Music');
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('index').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function createMusicList() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName("MusicList");
  const folder = DriveApp.getFolderById(mediaFolderId);
  const files = folder.getFiles();
  
  const mA = [['Item', 'File Name', 'File Type', 'File Id', 'Play List']];
  sh.clearContents();
  
  let n = 1;
  while (files.hasNext()) {
    const file = files.next();
    mA.push([n++, file.getName(), file.getMimeType(), file.getId(), '']);
  }
  
  sh.getRange(1, 1, mA.length, mA[0].length).setValues(mA);
  sh.getRange(2, 2, sh.getLastRow() - 1, sh.getLastColumn() - 1).sort({ column: 2, ascending: true });
  sh.getRange(2, 5, sh.getLastRow() - 1, 1).insertCheckboxes();
}

function getPlaylist() {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName('MusicList');
  const rg = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn());
  const vA = rg.getValues();
  
  const pl = [];
  let html = '<style>th,td{border:1px solid black;}</style><table><tr><th>Index</th><th>FileName</th></tr>';
  
  for (let i = 0; i < vA.length; i++) {
    if (vA[i][4]) {
      pl.push(vA[i][1]);
      html += Utilities.formatString('<tr><td>%s</td><td>%s</td></tr>', vA[i][0], vA[i][1]);
    }
  }
  
  html += '</table>';
  return { playlist: pl, html: html };
}

function getFiles() {
  const query = `('${mediaFolderId}' in parents) and (mimeType = 'audio/mpeg') and trashed = false`;
  const files = DriveApp.searchFiles(query);
  
  const fileList = [];
  while (files.hasNext()) {
    const file = files.next();
    fileList.push({
      id: file.getId(),
      name: file.getName(),
      url: "https://drive.google.com/uc?export=download&id=" + file.getId(),
      mimeType: file.getMimeType()
    });
  }
  
  return fileList; // Return the list of files found
}