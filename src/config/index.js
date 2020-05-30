/*
Create overrides.js within this folder 
It should already be on gitIgnore, so please don't ever commit your overrides.js file
Overrides stores key / value pairs for data that can't be put on the public repo
You can also use it to adjust settings for your local devleopment environment
Adding a key / value pair to overrides.js will literally override the same key / value in this file
*/
const overrides = require("./overrides");

const apiUrl = overrides.apiUrl || `http://localhost:3231/api/dev`;
const socketUrl = overrides.socketUrl || `ws://localhost:3231`;

const defaults = {
  //Behavior
  defaultRate: 1000, //Message rate limit for most people
  minRate: 250, //Message rate limit for admins / server owners etc..
  slowMo: 30000, //Message rate limit for when we need to slow things down!
  chatCharMax: 300, //Maximum amount of characters a user can type in the chat box
  buttonRate: 100, //Pulse rate for holding down a button
  breakPoint: 768, //mobile layout resolution
  mobileMessageFadeOut: 5000, //how long do mobile messages display in chat before they fade out
  // updateInterfaceInterval: 250, //update frequency for robot interface UI

  //URL Management:
  urlPrefix: "https://remo.tv/",
  socketUrl: socketUrl,
  apiUrl: apiUrl,
  recoveryPage: overrides.recoveryPage || "https://remo.tv/recovery",
  ws: overrides.ws || "ws://",
  imageStore: "https://remo-image-store.sfo2.digitaloceanspaces.com/user/",

  //User Signup / Login:
  reCaptchaSiteKey: "6Lfg_KYUAAAAAH1hvQdp-qDOUToVn6FQWFOvbySo",
  apiAuth: `${apiUrl}/auth`,
  apiSignup: `${apiUrl}/signup`,
  apiLogin: `${apiUrl}/login`,
  requestEmailValidation: `${apiUrl}/user/validate-email`,
  validateEmailWithKey: `${apiUrl}/user/validate-email-with-key`,

  //Support:
  supportEmail: "jill@remo.tv",

  //General API
  listRobotServers: `${apiUrl}/robot-server/list`,
  addRobot: `${apiUrl}/robot/setup`,
  deleteRobot: `${apiUrl}/robot/delete`,
  robotAPIKey: `${apiUrl}/robot/key`,
  getInvites: `${apiUrl}/robot-server/invites`,
  getStats: `${apiUrl}/stats`,
  listFollowedServers: `${apiUrl}/user/followed`,
  makeButtons: `${apiUrl}/controls/make`,
  getButtons: `${apiUrl}/controls/button-input`,
  requestPasswordReset: `${apiUrl}/user/request-password-reset`, //No Auth
  validateResetKey: `${apiUrl}/user/validate-key`,
  passwordReset: `${apiUrl}/user/password-reset`, //execute reset w/ valid key
  getControls: `${apiUrl}/controls/get-controls`,
  userProfile: `${apiUrl}/user/profile`,
  updateEmail: `${apiUrl}/user/update-email`,
  kickMember: `${apiUrl}/moderation/kick`,
  welcome: `${apiUrl}/user/welcome`,
  updateUserSettings: `${apiUrl}/user/update-settings`,

  //Servers
  findServer: `${apiUrl}/robot-server/get-server`,
  addServer: `${apiUrl}/robot-server/create`,
  joinServer: `${apiUrl}/robot-server/join`,
  leaveServer: `${apiUrl}/robot-server/leave`,
  getMembers: `${apiUrl}/robot-server/get-members`,
  membershipSettings: `${apiUrl}/robot-server/membership/update-settings`,
  setServerListing: `${apiUrl}/robot-server/settings/listing`,
  setServerPrivate: `${apiUrl}/robot-server/settings/private`,
  updateSettings: `${apiUrl}/robot-server/settings/update`,
  uploadServerImage: `${apiUrl}/:id/upload`,
  //Server Invites
  validateInviteKey: `${apiUrl}/robot-server/validate-invite`,
  disableInvite: `${apiUrl}/robot-server/deactivate-invite`,
  invite: `${apiUrl}/robot-server/invite`,

  //Channels:
  addChannel: `${apiUrl}/channels/create`,
  deleteChannel: `${apiUrl}/channels/delete`,
  setDefaultChannel: `${apiUrl}/channels/set-default`,
  renameChannel: `${apiUrl}/channels/rename`,

  //Patreon
  patreonUrl: "https://www.patreon.com/letsjill",
  patreonClientID:
    "qzqYm-sCfZsMr-Va7LoFGRsNPBPO_bNb_TpLbxCOLSRVod_4t7sI2ezCVu3VMQ7o",
  linkPatreon: `${apiUrl}/integrations/patreon`,
  removePatreon: `${apiUrl}/integrations/patreon-remove`,

  //External Links:
  discordUrl: `https://discord.gg/7cAgWKV`,
  githubUrl: `https://github.com/remotv/controller`,

  //JSMpeg
  jsmpegDisabled: false,
};

module.exports = Object.assign({}, defaults, overrides);
