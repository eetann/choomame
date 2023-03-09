[![test and lint](https://github.com/eetann/choomame/actions/workflows/test.yaml/badge.svg)](https://github.com/eetann/choomame/actions/workflows/test.yaml)
[![Release](https://github.com/eetann/choomame/actions/workflows/release.yaml/badge.svg)](https://github.com/eetann/choomame/actions/workflows/release.yaml)

<p align="center">
  <img src="./public/icons/icon-128x128.png" height="120">
</p>

# Choomame

Choomame (チューマメ) is a browser extension that add amazing information to search results and Popup.

**You can install at [Chrome Web Store](https://chrome.google.com/webstore/detail/lecnbgonlcmmpkpnngbofggjiccbnokn)!**

This extension is an improved versioin of my previous extension Amazing Searcher([Chrome Web Store](https://chrome.google.com/webstore/detail/amazing-searcher/poheekmlppakdboaalpmhfpbmnefeokj),

[GitHub](https://github.com/eetann/amazing-searcher))

![Content Script and popup](./docs/assets/content-script-1280x800.png)

Choomame shows the following link to Popup and the Google search results.

- `Time`: restrict results to a specific time period
  - example: 3 years, 1 month, 1 week ...
- `Language`: restrict results to a specific language
  - example: English, Japanese, Spanish ...
- `Custom Link`: easy access to frequently viewed pages, site searches, official documents
  - Check [choomame-custom-link-collection](https://github.com/eetann/choomame-custom-link-collection#readme) for details.

These can be freely customized on the option page.

![Option Page](./docs/assets/option-1280x800.png)

## Shortcut key

If you want to use a shortcut key to open a popup, type `Ctrl(Command) + q`. This shortcut key can be assigned freely at `chrome://extensions/shortcuts'.

In Vivaldi, it is not available, so I have added `Alt+Q` to open a tab instead of popup. It might be useful to register it as a web panel.
