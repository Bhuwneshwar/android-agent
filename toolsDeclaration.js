import { Type } from "@google/genai";

const toolsDeclaration = [
  // only for macrodroid can be used in android agent

  {
    name: "flashlightOn",
    description: "turn on flash light ",
  },
  {
    name: "getWeatherInfo",
    description: "get weather info",
  },
  {
    name: "flashlightOff",
    description: "turn off flash light ",
  },
  {
    name: "getAllContacts",
    description: "get all contacts from device",
  },
  {
    name: "getCurrentTime",
    description: "get current date and time in readable format in string ",
  },
  {
    name: "msToIndianTime",
    description: "convert milliseconds time to Indian format time",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ms: {
          type: Type.STRING,
          description: "milliseconds to convert",
        },
      },
      required: ["ms"],
    },
  },
  {
    name: "setTimerForTask",
    description:
      "set time for tasks after given seconds with message e.g. 2 minutes bad light off kar do",
    parameters: {
      type: Type.OBJECT,
      properties: {
        second: {
          type: Type.NUMBER,
          description:
            "seconds to set for call me e.g 2 minutes = 120 seconds or 1 hour = 3600 seconds",
        },
        message: {
          type: Type.STRING,
          description: "message to send when time is up e.g. light off kar do",
        },
      },
      required: ["second", "message"],
    },
  },
  {
    name: "takeSelfie",
    description: "take selfie. ",
  },
  {
    name: "openLastPhoto",
    description: "Open last taken photo",
  },
  {
    name: "soundRecorderStart",
    description: "Start sound recorder ",
  },
  {
    name: "soundRecorderStop",
    description: "Stop sound recorder ",
  },
  {
    name: "sendWhatsAppMessage",
    description: "send WhatsApp message to given number with message ",
    parameters: {
      type: Type.OBJECT,
      description: "send WhatsApp message to given number with message ",

      properties: {
        number: {
          type: Type.STRING,
          description: "number to send",
        },
        message: {
          type: Type.STRING,
          description: "Message to send",
        },
      },
      required: ["number", "message"],
    },
  },
  {
    name: "phoneCall",
    description: "call to given number ",
    parameters: {
      type: Type.OBJECT,
      properties: {
        number: {
          type: Type.STRING,
          description: "number to call",
        },
      },
      required: ["number"],
    },
  },
  {
    name: "sendSMS",
    description: "send SMS to given number with message ",
    parameters: {
      type: Type.OBJECT,
      properties: {
        number: {
          type: Type.STRING,
          description: "number to send SMS",
        },
        message: {
          type: Type.STRING,
          description: "Message to send",
        },
      },
      required: ["number", "message"],
    },
  },

  {
    name: "getLocation",
    description: "get current location of device",
  },

  {
    name: "getCallLogs",
    description: "get call logs from device",
  },
  {
    name: "getSMSLogs",
    description: "get SMS logs from device",
  },
  {
    name: "openApp",
    description: "open app with given package name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        packageName: {
          type: Type.STRING,
          description: "package name of app to open",
        },
      },
      required: ["packageName"],
    },
  },
  {
    name: "getClipboardText",
    description: "get text from clipboard",
  },
  {
    name: "setClipboardText",
    description: "set text to clipboard",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "text to set to clipboard",
        },
      },
      required: ["text"],
    },
  },
  {
    name: "getCurrentApp",
    description: "get current app in foreground",
  },
  {
    name: "openURL",
    description: "open URL in browser",
    parameters: {
      type: Type.OBJECT,
      properties: {
        url: {
          type: Type.STRING,
          description: "URL to open",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "getClipboardImage",
    description: "get image from clipboard",
  },
  {
    name: "setClipboardImage",
    description: "set image to clipboard",
    parameters: {
      type: Type.OBJECT,
      properties: {
        base64Image: {
          type: Type.STRING,
          description: "base64 encoded image to set to clipboard",
        },
      },
      required: ["base64Image"],
    },
  },
  {
    name: "getDeviceStorageInfo",
    description: "get device storage info",
  },

  {
    name: "getDeviceBatteryLevel",
    description: "get device battery level",
  },
  // enable/disable app for package name
  {
    name: "enableApp",
    description: "enable app for given package name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        packageName: {
          type: Type.STRING,
          description: "package name of app to enable",
        },
      },
      required: ["packageName"],
    },
  },
  {
    name: "disableApp",
    description: "disable app for given package name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        packageName: {
          type: Type.STRING,
          description: "package name of app to disable",
        },
      },
      required: ["packageName"],
    },
  },

  {
    name: "getInstalledApps",
    description: "get list of installed apps on device",
  },
  //clear app data for package name

  {
    name: "clearAppData",
    description: "clear app data for given package name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        packageName: {
          type: Type.STRING,
          description: "package name of app to clear data",
        },
      },
      required: ["packageName"],
    },
  },
  //kill app for package name
  {
    name: "killApp",
    description: "kill app for given package name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        packageName: {
          type: Type.STRING,
          description: "package name of app to kill",
        },
      },
      required: ["packageName"],
    },
  },
  //run shell script
  {
    name: "runShellScript",
    description: "run shell script",
    parameters: {
      type: Type.OBJECT,
      properties: {
        script: {
          type: Type.STRING,
          description: "shell script to run",
        },
      },
      required: ["script"],
    },
  },
  // generate qr code for given text
  {
    name: "generateQRCode",
    description: "generate QR code for given text",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "text to generate QR code for",
        },
      },
      required: ["text"],
    },
  },
  //scan qr code from camera
  {
    name: "scanQRCode",
    description: "scan QR code from camera",
  },
  // share last photo
  {
    name: "shareLastPhoto",
    description: "share last taken photo",
  },
  // take photo with camera
  {
    name: "takePhoto",
    description: "take photo with camera with back camera",
  },
  // take screenshot
  {
    name: "takeScreenshot",
    description: "take screenshot",
  },
  // get device info like model, brand, etc.
  {
    name: "getDeviceInfo",
    description: "get device info like model, brand, etc.",
  },
  //airplane mode on
  {
    name: "airplaneModeOn",
    description: "turn on airplane mode",
  },
  //airplane mode off
  {
    name: "airplaneModeOff",
    description: "turn off airplane mode",
  },
  //auto sync on
  {
    name: "autoSyncOn",
    description: "turn on auto sync",
  },
  //auto sync off
  {
    name: "autoSyncOff",
    description: "turn off auto sync",
  },
  // bluetooth on
  {
    name: "bluetoothOn",
    description: "turn on bluetooth",
  },
  // bluetooth off
  {
    name: "bluetoothOff",
    description: "turn off bluetooth",
  },
  //hotspot on
  {
    name: "hotspotOn",
    description: "turn on hotspot",
  },
  //hotspot off
  {
    name: "hotspotOff",
    description: "turn off hotspot",
  },
  //wifi on
  {
    name: "wifiOn",
    description: "turn on wifi",
  },
  //wifi off
  {
    name: "wifiOff",
    description: "turn off wifi",
  },
  //toggle bluetooth
  {
    name: "toggleBluetooth",
    description: "toggle bluetooth on/off",
  },
  //toggle wifi
  {
    name: "toggleWifi",
    description: "toggle wifi on/off",
  },
  //toggle hotspot
  {
    name: "toggleHotspot",
    description: "toggle hotspot on/off",
  },
  //toggle airplane mode
  {
    name: "toggleAirplaneMode",
    description: "toggle airplane mode on/off",
  },
  //toggle auto sync
  {
    name: "toggleAutoSync",
    description: "toggle auto sync on/off",
  },
  //toggle do not disturb
  {
    name: "toggleDoNotDisturb",
    description: "toggle do not disturb on/off",
  },
  // internet data on
  {
    name: "internetDataOn",
    description: "turn on internet data",
  },
  // internet data off
  {
    name: "internetDataOff",
    description: "turn off internet data",
  },
  // toggle internet data
  {
    name: "toggleInternetData",
    description: "toggle internet data on/off",
  },

  // nfc on
  {
    name: "nfcOn",
    description: "turn on nfc",
  },

  // nfc off
  {
    name: "nfcOff",
    description: "turn off nfc",
  },
  // toggle nfc
  {
    name: "toggleNfc",
    description: "toggle nfc on/off",
  },
  // usb tethering on
  {
    name: "usbTetheringOn",
    description: "turn on usb tethering",
  },
  // usb tethering off
  {
    name: "usbTetheringOff",
    description: "turn off usb tethering",
  },
  // toggle usb tethering
  {
    name: "toggleUsbTethering",
    description: "toggle usb tethering on/off",
  },

  // scan wifi return available wifi
  {
    name: "scanWifi",
    description: "scan wifi and return available wifi",
  },
  // connect to wifi with given ssid and password
  {
    name: "connectToWifi",
    description: "connect to wifi with given ssid and password",
    parameters: {
      type: Type.OBJECT,
      properties: {
        ssid: {
          type: Type.STRING,
          description: "SSID of wifi to connect",
        },
        password: {
          type: Type.STRING,
          description: "Password of wifi to connect",
        },
      },
      required: ["ssid"],
    },
  },
  // set alarm accept parameters relativeTime,name example now time is 9:30 + relativeTime = 20 = 9:50, name=test
  {
    name: "setAlarm",
    description: "set alarm with relative time and name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        relativeTime: {
          type: Type.NUMBER,
          description: "relative time in minutes to set alarm",
        },
        name: {
          type: Type.STRING,
          description: "name of the alarm",
        },
      },
      required: ["relativeTime", "name"],
    },
  },
  // disable alarm accept name
  {
    name: "disableAlarm",
    description: "disable alarm with name",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: "name of the alarm to disable",
        },
      },
      required: ["name"],
    },
  },
  // dismiss active alarm
  {
    name: "dismissActiveAlarm",
    description: "dismiss active alarm",
  },

  // expand quick settings tiles
  {
    name: "expandQuickSettings",
    description: "expand quick settings tiles",
  },

  // expand status bar
  {
    name: "expandStatusBar",
    description: "expand status bar",
  },

  // collapse status bar
  {
    name: "collapseStatusBar",
    description: "collapse status bar",
  },
  //show power option
  {
    name: "showPowerOption",
    description: "show power option",
  },
  //show notification panel
  {
    name: "showNotificationPanel",
    description: "show notification panel",
  },
  //show recent apps
  {
    name: "showRecentApps",
    description: "show recent apps",
  },

  // show all apps
  {
    name: "showAllApps",
    description: "show all apps",
  },
  //talkback toggle
  {
    name: "talkbackToggle",
    description: "toggle talkback",
  },

  //get light level in numeral
  {
    name: "getLightLevel",
    description: "get light level in numeral",
  },

  // launch home screen
  {
    name: "launchHomeScreen",
    description: "launch home screen",
  },

  //press back btn
  {
    name: "pressBackBtn",
    description: "press back btn",
  },
  //reboot
  {
    name: "reboot",
    description: "reboot",
  },
  //power off
  {
    name: "powerOff",
    description: "power off",
  },
  // send intent
  {
    name: "sendIntent",
    description: "send intent with action and extras",
    parameters: {
      type: Type.OBJECT,
      properties: {
        action: {
          type: Type.STRING,
          description: "action of the intent to send",
        },
        extras: {
          type: Type.OBJECT,
          description: "extras to send with the intent",
        },
      },
      required: ["action"],
    },
  },
  //share text content
  {
    name: "shareTextContent",
    description: "share text content",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "text content to share",
        },
      },
      required: ["text"],
    },
  },
  // speak text
  {
    name: "speakText",
    description: "speak text",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "text to speak",
        },
      },
      required: ["text"],
    },
  },
  // brightness up
  {
    name: "brightnessUp",
    description: "increase brightness",
  },
  // brightness down
  {
    name: "brightnessDown",
    description: "decrease brightness",
  },
  // set brightness
  {
    name: "setBrightness",
    description: "set brightness to given value",
    parameters: {
      type: Type.OBJECT,
      properties: {
        value: {
          type: Type.NUMBER,
          description: "brightness value to set (0-100)",
        },
      },
      required: ["value"],
    },
  },
  // vibrate device
  {
    name: "vibrateDevice",
    description: "vibrate device",
  },
  // voice search
  {
    name: "voiceSearch",
    description: "start voice search",
  },
  // auto rotate on
  {
    name: "autoRotateOn",
    description: "turn on auto rotate",
  },
  // auto rotate off
  {
    name: "autoRotateOff",
    description: "turn off auto rotate",
  },
  // toggle auto rotate
  {
    name: "toggleAutoRotate",
    description: "toggle auto rotate on/off",
  },
  // battery saver on
  {
    name: "batterySaverOn",
    description: "turn on battery saver",
  },
  // battery saver off
  {
    name: "batterySaverOff",
    description: "turn off battery saver",
  },
  // toggle battery saver
  {
    name: "toggleBatterySaver",
    description: "toggle battery saver on/off",
  },
  // car mode on
  {
    name: "carModeOn",
    description: "turn on car mode",
  },
  // car mode off
  {
    name: "carModeOff",
    description: "turn off car mode",
  },
  // toggle car mode
  {
    name: "toggleCarMode",
    description: "toggle car mode on/off",
  },
  // do not disturb on
  {
    name: "doNotDisturbOn",
    description: "turn on do not disturb",
  },
  // do not disturb off
  {
    name: "doNotDisturbOff",
    description: "turn off do not disturb",
  },
  // toggle do not disturb
  {
    name: "toggleDoNotDisturb",
    description: "toggle do not disturb on/off",
  },
  // dark mode on
  {
    name: "darkModeOn",
    description: "turn on dark mode",
  },
  // dark mode off
  {
    name: "darkModeOff",
    description: "turn off dark mode",
  },
  // toggle dark mode
  {
    name: "toggleDarkMode",
    description: "toggle dark mode on/off",
  },
  // font scale param size 50-250
  {
    name: "setFontScale",
    description: "set font scale to given size",
    parameters: {
      type: Type.OBJECT,
      properties: {
        size: {
          type: Type.NUMBER,
          description: "font scale size (50-250)",
        },
      },
      required: ["size"],
    },
  },
  // set screen timeout in seconds
  {
    name: "setScreenTimeout",
    description: "set screen timeout in seconds",
    parameters: {
      type: Type.OBJECT,
      properties: {
        seconds: {
          type: Type.NUMBER,
          description: "screen timeout in seconds",
        },
      },
      required: ["seconds"],
    },
  },
  // choose keyboard
  {
    name: "chooseKeyboard",
    description: "choose keyboard",
  },
  //location on
  {
    name: "locationOn",
    description: "turn on location",
  },
  //location off
  {
    name: "locationOff",
    description: "turn off location",
  },
  //toggle location
  {
    name: "toggleLocation",
    description: "toggle location on/off",
  },
  // share location
  {
    name: "shareLocation",
    description: "share location",
  },
  // get current location address
  {
    name: "getCurrentLocationAddress",
    description: "get current location address",
  },
  // disable macroDroid
  {
    name: "disableMacroDroid",
    description: "disable macroDroid",
  },
  // macroDroid drawer open, close, toggle, enable, disable
  {
    name: "macroDroidDrawerOpen",
    description: "open macroDroid drawer",
  },
  {
    name: "macroDroidDrawerClose",
    description: "close macroDroid drawer",
  },
  {
    name: "macroDroidDrawerToggle",
    description: "toggle macroDroid drawer",
  },
  {
    name: "macroDroidDrawerEnable",
    description: "enable macroDroid drawer",
  },
  {
    name: "macroDroidDrawerDisable",
    description: "disable macroDroid drawer",
  },
  // media play, pause, next, previous
  {
    name: "mediaPlay",
    description: "play media",
  },
  {
    name: "mediaPause",
    description: "pause media",
  },
  {
    name: "mediaNext",
    description: "next media",
  },
  {
    name: "mediaPrevious",
    description: "previous media",
  },
  // media volume up, down, mute, unmute
  {
    name: "mediaVolumeUp",
    description: "increase media volume",
  },
  {
    name: "mediaVolumeDown",
    description: "decrease media volume",
  },
  {
    name: "mediaMute",
    description: "mute media volume",
  },
  {
    name: "mediaUnmute",
    description: "unmute media volume",
  },
  // set media volume
  {
    name: "setMediaVolume",
    description: "set media volume to given level",
    parameters: {
      type: Type.OBJECT,
      properties: {
        level: {
          type: Type.NUMBER,
          description: "media volume level (0-100)",
        },
      },
      required: ["level"],
    },
  },
  // get media volume
  {
    name: "getMediaVolume",
    description: "get current media volume level",
  },
  // toggle media playback
  {
    name: "toggleMediaPlayback",
    description: "toggle media playback (play/pause)",
  },
  //answer incoming call
  {
    name: "answerIncomingCall",
    description: "answer incoming call",
  },
  //hang up incoming call
  {
    name: "hangUpIncomingCall",
    description: "hang up incoming call",
  },
  // reject incoming call
  {
    name: "rejectIncomingCall",
    description: "reject incoming call",
  },
  // clear incoming call notification and log
  {
    name: "clearIncomingCallNotificationAndLog",
    description: "clear incoming call notification and log",
  },
  // open call logs
  {
    name: "openCallLogs",
    description: "open call logs",
  },
  // block screen touch
  {
    name: "blockScreenTouch",
    description: "block screen touch",
  },
  // unblock screen touch
  {
    name: "unblockScreenTouch",
    description: "unblock screen touch",
  },
  // force current orientation
  {
    name: "forceCurrentOrientation",
    description: "force current orientation",
  },
  // get text from view id
  {
    name: "getTextFromViewId",
    description: "get text from view id",
    parameters: {
      type: Type.OBJECT,
      properties: {
        viewId: {
          type: Type.STRING,
          description: "view id to get text from",
        },
      },
      required: ["viewId"],
    },
  },
  // enable keep awake
  {
    name: "enableKeepAwake",
    description: "enable keep awake",
  },
  // disable keep awake
  {
    name: "disableKeepAwake",
    description: "disable keep awake",
  },
  // check text in screenshot
  {
    name: "checkTextInScreenshot",
    description: "check if text is present in screenshot",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "text to check in screenshot",
        },
      },
      required: ["text"],
    },
  },
  // check text in screen
  {
    name: "checkTextInScreen",
    description: "check if text is present in screen",
    parameters: {
      type: Type.OBJECT,
      properties: {
        text: {
          type: Type.STRING,
          description: "text to check in screen",
        },
      },
      required: ["text"],
    },
  },
  // read screen content
  {
    name: "readScreenContent",
    description: "read content of the screen",
  },
  // read screenshot content
  {
    name: "readScreenshotContent",
    description: "read content of the screenshot",
  },
  // screen on
  {
    name: "screenOn",
    description: "turn on screen",
  },
  // screen off
  {
    name: "screenOff",
    description: "turn off screen",
  },

  {
    name: "toggleScreenOnOff",
    description: "toggle screen on/off",
  },
  // set screen timeout
  {
    name: "setScreenTimeout",
    description: "set screen timeout in seconds",
    parameters: {
      type: Type.OBJECT,
      properties: {
        seconds: {
          type: Type.NUMBER,
          description: "screen timeout in seconds",
        },
      },
      required: ["seconds"],
    },
  },
  // get text from image (OCR)
  {
    name: "getTextFromImage",
    description: "get text from image using OCR",
    parameters: {
      type: Type.OBJECT,
      properties: {
        base64Image: {
          type: Type.STRING,
          description: "base64 encoded image to extract text from",
        },
      },
      required: ["base64Image"],
    },
  },
  // show volume panel
  {
    name: "showVolumePanel",
    description: "show volume panel",
  },
  // silent mode on
  {
    name: "silentModeOn",
    description: "turn on silent mode",
  },
  // silent mode off
  {
    name: "silentModeOff",
    description: "turn off silent mode",
  },
  // toggle silent mode
  {
    name: "toggleSilentMode",
    description: "toggle silent mode on/off",
  },

  // set volume for params alarm, media, ringer, notification, system, accessibility, voice_call, bluetooth_voice in integer 0-100
  {
    name: "setVolume",
    description: "set volume for params",
    parameters: {
      type: Type.OBJECT,
      properties: {
        alarm: {
          type: Type.NUMBER,
          description: "alarm volume (0-100)",
        },
        media: {
          type: Type.NUMBER,
          description: "media volume (0-100)",
        },
        ringer: {
          type: Type.NUMBER,
          description: "ringer volume (0-100)",
        },
        notification: {
          type: Type.NUMBER,
          description: "notification volume (0-100)",
        },
        system: {
          type: Type.NUMBER,
          description: "system volume (0-100)",
        },
        accessibility: {
          type: Type.NUMBER,
          description: "accessibility volume (0-100)",
        },
        voice_call: {
          type: Type.NUMBER,
          description: "voice call volume (0-100)",
        },
        bluetooth_voice: {
          type: Type.NUMBER,
          description: "bluetooth voice volume (0-100)",
        },
      },
      required: [],
    },
  },
  // start screen recording
  {
    name: "startScreenRecording",
    description: "start screen recording",
  },
  // stop screen recording
  {
    name: "stopScreenRecording",
    description: "stop screen recording",
  },
  // kids mode
  {
    name: "kidsModeOn",
    description: "turn on kids mode",
  },
  {
    name: "kidsModeOff",
    description: "turn off kids mode",
  },
];
export default toolsDeclaration;
