var config = {
  readFromMock: false, //read from file
  neverConnectToServer: false, //force read from file or die!
  cacheFiles: false, //cache to file
  target: {
      server: "https://kateb.saadev.ir/Kateb",
      clientDirectory: "",
      staticFileDirectory: "",
  }
};
module.exports = config;
