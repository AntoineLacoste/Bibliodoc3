# Install the tools

- Install NPM, `npm` command should be available `sudo apt-get install npm`

- Install required NPM dependencies:
```
npm install -g gulp@3.6.2
npm install -g cordova@3.4.1-0.1.0
npm install -g phonegap@3.5.0-0.20.4
npm install -g ripple-emulator@0.9.22
```

- Install local NPM dependencies: `npm install`

- Install Android SDK, `android` command should be available:
Download android SDK: `http://developer.android.com/sdk/index.html?hl=sk`
Note that the phonegap versions above work fine with SDK 19 but it seems to have problems with version 20.

Update your bashrc:
```
export ANDROID_HOME=<YOUR_PATH>/adt-bundle-linux-x86_64-20140321/sdk
export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
```

- Install the Android platform to the project:
```
cordova platform add android
```
If you have troubles doing so, it may be because you did not install the Android SDK (19) or Git did not create the `platforms`, `.cordova` or `plugins` folder.
Also, you should run `gulp` at least once or create the phonegap `www` folder manually.


- If you want to use iOS: I can't help you, I don't have OSX but I guess installing the iOS SDK + `cordova platform add ios` should be fine.


# START

- Build the project

```
gulp
```

This will create the appropriate Phonegap content in `www` based on your source files.

- Launch Ripple Emulator

```
ripple emulate
```