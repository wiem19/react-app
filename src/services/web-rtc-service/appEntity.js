// import WebRTCService form "./webRtcService.interface.ts";
import JanusService from "./janus/janus.service.ts";
import JitsiService from "./jitsi/jitsi.service.ts";

const defaultJitsiOptions = {
  roomName: "sastec",
  width: 1400,
  height: 700,
  configOverwrite: { openBridgeChannel: "datachannel" },
};

const defaultJanusOptions = {
  displayName: "ghassen",
  roomNumber: 1234,
  //ps:this is the only room avaible for the demo website. any other room's name won't work
};

export default class AppEntity {
  webRTCService;

  constructor(framework, options) {
    if (framework === "jitsi") {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      document.body.appendChild(script);
      this.webRTCService = new JitsiService({
        ...defaultJitsiOptions,
        ...options,
      });
    } else if (framework === "janus")
      this.webRTCService = new JanusService({
        ...defaultJanusOptions,
        ...options,
      });
  }

  sendMessage(message) {
    this.webRTCService.sendMessage(message);
  }

  ///use only in jitsi
  changePicture(avatarURL) {
    this.webRTCService.changeAvatar(avatarURL);
  }
}
