// Code.gs (Server-side)
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index');
}

function getFiles() {
  const query = "mimeType = 'video/mp4' and trashed = false"; // Modify the query to filter MP4 files
  const files = DriveApp.searchFiles(query);
  const fileList = [];
  
  while (files.hasNext()) {
    const file = files.next();
    fileList.push({ id: file.getId(), name: file.getName(), mimeType: file.getMimeType() });
    Logger.log(`File found: ${file.getName()} (ID: ${file.getId()})`); // Log each file found
  }
  
  Logger.log(`Total files found: ${fileList.length}`); // Log the total number of files found
  return fileList;
}