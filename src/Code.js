function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME); // Optional for added security
}