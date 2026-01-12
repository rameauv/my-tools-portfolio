export interface GithubRepo {
  id: string;
  name: string;
  description: string | null;
  language: string | null;
  updatedAt: string;
  readmeContent: string;
}

export const githubRepos: GithubRepo[] = [
  {
    id: "665393433",
    name: "morphman_korean_mecab.git",
    description: null,
    language: "Python",
    updatedAt: "2025-10-20",
    readmeContent: `This project adds support for the Korean language to the Anki plugin Morphman.
`
  },
  {
    id: "643827394",
    name: "spotify-flutter.git",
    description: null,
    language: "Dart",
    updatedAt: "2025-10-20",
    readmeContent: `# A clone a spotify made with flutter

preview: https://rameauv.github.io/spotify-flutter-website/
`
  },
  {
    id: "786133128",
    name: "game-of-life-psvita.git",
    description: null,
    language: "C",
    updatedAt: "2025-10-20",
    readmeContent: `# Conway's Game of Life for the PlayStation Vita

An implementation of the famous Conway's Game of Life for the PSVITA

![gameoflife (2)](https://github.com/rameauv/game-of-life-psvita/assets/26255593/34bb44cf-3ef5-4a20-9d01-18fc25550193)


Libraries:
  - libvita2d for graphics (https://github.com/xerpi/libvita2d)
  - debugnet for debugging (https://github.com/psxdev/debugnet)

## Build steps:
- setup vdpm (https://github.com/vitasdk/vdpm)
- build libvita2d:
\`\`\`shell
# from the root of the repo
cd libvita2d/
make
\`\`\`
- build project
\`\`\`shell
# from the root of the repo
cmake .
make
\`\`\`

## Static Analysis with clang-tidy

This project uses clang-tidy for static code analysis to catch bugs early and enforce best practices.

### Prerequisites
- clang-tidy installed (part of LLVM/Clang toolchain)
- The project generates \`compile_commands.json\` automatically via CMake

### Running clang-tidy

Check all source files:
\`\`\`shell
clang-tidy src/*.c
\`\`\`

Check a specific file:
\`\`\`shell
clang-tidy src/main.c
\`\`\`

Auto-fix issues (use with caution):
\`\`\`shell
clang-tidy -fix src/*.c
\`\`\`

View available checks:
\`\`\`shell
clang-tidy --list-checks
\`\`\`

### IDE Integration
- **VSCode**: Install the "clang-tidy" extension
- **CLion**: Built-in support (enable in Settings → Editor → Inspections → C/C++ → Clang-Tidy)
- **Vim/Neovim**: Use ALE or coc-clangd


## Further Performance Improvements
- Reduce the number of function calls inside the main loop
- Use SIMD instructions

[![Watch the video](https://github.com/rameauv/game-of-life-psvita/assets/26255593/33b5a942-e807-4f2b-854e-ad4ffd878bb9)](https://youtu.be/drDHGHlTBqY)


[![Build](https://github.com/rameauv/game-of-life-psvita/actions/workflows/build.yml/badge.svg)](https://github.com/rameauv/game-of-life-psvita/actions/workflows/build.yml)
`
  },
  {
    id: "580800349",
    name: "spotify-clone-backend-asp.net.git",
    description: null,
    language: "C#",
    updatedAt: "2025-04-15",
    readmeContent: `
# Back-end for a clone of Spotify made with Asp.net Core

  

>

  

## About

  

This project is a back-end for a clone of Spotify made with Asp.net Core

  

## Getting Started

  

Getting up and running is as easy as 1, 2, 3.

  

1. Make sure you have [Dotnet core](https://dotnet.microsoft.com/en-us/download) installed and a [PostgreSQL](https://www.postgresql.org/) database running.

2. Install your dependencies

  

\`\`\`

cd path/to/repo; yarn or npm install

\`\`\`

  

3. Start your app

  

\`\`\`

cd path/to/repo; cd API; dotnet run

\`\`\`

  

## Testing

  

Simply run \`dotnet test at the racine of the repo\`.


## Configuration

  
The configuration must be set in a \`appsettings.json\` file in the \`API\` folder.
An exemple configuration file, \`appsettings.json.exemple\` is provided in the \`API\` folder.


\`\`\`

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Jwt": {
    "Issuer": "https:/issuer/",
    "Audience": "https://audience/",
    "AccessTokenKey": "This is a sample secret key - please don't use in production environment.'",
    "RefreshTokenKey": "This is a sample secret key - please don't use in production environment.'",
    "AccessTokenExpiryInMinutes": 5,
    "RefreshTokenExpiryInMinutes": 7
  },
  "ConnectionStrings": {
    "DBContext": "Host=localhost;Database=MyDbName;Username=postgres;Password=myPassword"
  },
  "Spotify": {
    "ClientId": "client Id",
    "ClientSecret": "client secret"
  }
}

\`\`\`

Launch settings are available in the file \`repo/API/Properties/launchSettings.json


## Routes

A playground is available at the path \`swagger/index.html\`


## Doc

The documentation is available in the \`doc\` folder.

## Todo

- More Unit tests
- UAT tests
- E2e tests
- Better documentation
- More code comments
- Use an authentication service like Auth0
`
  },
  {
    id: "576883039",
    name: "MorphMan.git",
    description: "Anki plugin that reorders language cards based on the words you know",
    language: "Python",
    updatedAt: "2024-09-09",
    readmeContent: `# MorphMan

<a title="Rate on AnkiWeb" href="https://ankiweb.net/shared/info/900801631"><img src="https://glutanimate.com/logos/ankiweb-rate.svg"></a>
<br>
MorphMan is an Anki addon that tracks what words you know, and utilizes that information to optimally reorder language cards. This
**greatly** optimizes your learning queue, as you will only see sentences with exactly one unknown word (see
[i+1 principle](https://massimmersionapproach.com/table-of-contents/anki/morphman/#glossary) for a more detailed explanation).

# Installation (Anki 2.1)

Install MorphMan via [AnkiWeb](https://ankiweb.net/shared/info/900801631)

# Installation (Anki 2.0)

To install MorphMan, download the latest .zip archive from [here](https://github.com/kaegi/MorphMan/releases)
and extract the files to your Anki2/addons\\_ (To find your Anki folder on Windows, enter "%appdata%" in the file explorer).
Your folder structure should look like this:

- _Anki2/addons/morphman.py_
- _Anki2/addons/morph/\\*allFilesAndDirectories\\*_

After restarting Anki, you should see an entry called _morphman_ under _Tools -> Add-ons_.
You can find information and troubleshooting tips [here](https://github.com/kaegi/MorphMan/wiki/Installation).

# Usage

MorphMan supports the following languages:

- languages with spaces: **English**, **Russian**, **Spanish**, **Korean**, **Hindi**, **etc.**
- **Japanese**: You must additionally install the _[Japanese Support](https://ankiweb.net/shared/info/3918629684)_ Anki addon
- **Chinese**: For Anki 2.0, please use [Jieba-Morph](https://github.com/NinKenDo64/Jieba-Morph). Chinese is included in Morphman for Anki 2.1
- **CJK Characters**: Morphemizer that splits sentence into characters and filters for Chinese-Japanese-Korean logographic/idiographic characters.
- more languages can be added on request if morpheme-splitting-tools are available for it

See Matt VS Japan's [video tutorial](https://www.youtube.com/watch?v=dVReg8_XnyA)
and accompanying [blog post](https://massimmersionapproach.com/table-of-contents/anki/morphman).
See the [MorphMan wiki](https://github.com/kaegi/MorphMan/wiki) for more information.

# Development
- Set up local environment:
  - The best is to use a Python virtual environment and install prebuilt Anki wheels:
    \`\`\`
    python -m virtualenv pyenv
    source pyenv/bin/activate
    python -m pip install aqt==2.1.54 anki==2.1.54 pyqtwebengine pylint
    export PYTHONPATH=./
    \`\`\`
- Run tests: \`python test.py\`
- Build Qt Developer UI with \`python scripts/build_ui.py\`
- Install git commit hook to run tests and pylint
  \` scripts/setup_dev.sh\`
`
  },
  {
    id: "187827182",
    name: "try_psvita-sdk.git",
    description: null,
    language: "C++",
    updatedAt: "2024-04-14",
    readmeContent: `# try-cpp-psvita
a try with unofficial vitasdk
`
  },
  {
    id: "752546819",
    name: "spotify-flutter-website.git",
    description: null,
    language: "JavaScript",
    updatedAt: "2024-02-04",
    readmeContent: ``
  },
  {
    id: "702926419",
    name: "breezy-weather.git",
    description: "A Material Design Weather Application",
    language: "Kotlin",
    updatedAt: "2023-12-13",
    readmeContent: `<div align="center">
<br />
<img src="app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.webp" />
</div>

<h1 align="center">Breezy Weather</h1>

<br />

<div align="center">
  <img alt="API 21+" src="https://img.shields.io/badge/Api%2021+-50f270?logo=android&logoColor=black&style=for-the-badge"/>
  <img alt="Kotlin" src="https://img.shields.io/badge/Kotlin-a503fc?logo=kotlin&logoColor=white&style=for-the-badge"/>
  <img alt="Jetpack Compose" src="https://img.shields.io/static/v1?style=for-the-badge&message=Jetpack+Compose&color=4285F4&logo=Jetpack+Compose&logoColor=FFFFFF&label="/>
  <img alt="Material You" src="https://custom-icon-badges.demolab.com/badge/material%20you-lightblue?style=for-the-badge&logoColor=333&logo=material-you"/>
  <br />
  <img src="https://img.shields.io/github/license/breezy-weather/breezy-weather?style=for-the-badge" alt="License LGPL-3.0" />
  <img src="https://img.shields.io/github/languages/code-size/breezy-weather/breezy-weather?style=for-the-badge" alt="GitHub code size in bytes" />
  <br /><br />
  <a href="https://github.com/breezy-weather/breezy-weather/releases/latest">
      <img src="https://img.shields.io/github/v/release/breezy-weather/breezy-weather?color=purple&include_prereleases&logo=github&style=for-the-badge" alt="Download from GitHub" />
  </a>
  <a href="https://apt.izzysoft.de/fdroid/index/apk/org.breezyweather/">
      <img src="https://img.shields.io/endpoint?url=https://apt.izzysoft.de/fdroid/api/v1/shield/org.breezyweather?color=purple&include_prereleases&logo=FDROID&style=for-the-badge" alt="Download from IzzyOnDroid repo" />
  </a>
</div>


<h4 align="center">Breezy Weather is a weather app with a strong focus on design, with a simple, clean UX, smooth animations, and Material Design all over, plus lots of customizability.</h4>

<hr />

<div align="center">
    <img src="fastlane/metadata/android/en-US/images/phoneScreenshots/01.png" alt="" style="width: 300px" />
</div>


<div align="center">

# Download

<a href="https://github.com/breezy-weather/fdroid-repo/blob/main/README.md">
<img src="https://f-droid.org/badge/get-it-on.png"
alt="Get it from Breezy Weather F-Droid repository" align="center" height="80" /></a>

<a href="https://apt.izzysoft.de/fdroid/index/apk/org.breezyweather/">
<img src="https://gitlab.com/IzzyOnDroid/repo/-/raw/master/assets/IzzyOnDroid.png"
alt="Get it on IzzyOnDroid" align="center" height="80" /></a>

<a href="https://github.com/breezy-weather/breezy-weather/releases">
<img src="https://user-images.githubusercontent.com/69304392/148696068-0cfea65d-b18f-4685-82b5-329a330b1c0d.png"
alt="Get it on GitHub" align="center" height="80" />
</a>
</div>

# Features

- Weather data
    - Daily and hourly forecasts up to 16 days
      - Temperature
      - Air quality
      - Wind
      - UV index
      - Precipitation
    - Precipitation in the next hour
    - Air quality
    - Pollen & Mold
    - Ephemeris (Sun & Moon)
    - Severe weather and precipitation alerts
    - Real-time weather conditions
      - Temperature
      - Feels like
      - Wind
      - UV index
      - Humidity
      - Dew point
      - Atmospheric pressure
      - Visibility
      - Cloud cover
      - Ceiling

- <details><summary>Multiple weather sources (<a href="docs/SOURCES.md">comparison</a>)</summary>

  - Open-Meteo
  - AccuWeather
  - MET Norway
  - OpenWeatherMap (often rate-limited)
  - Pirate Weather (no API key provided)
  - HERE (no API key provided)
  - Météo France
  - Mixed China sources
</details>

- Large selection of home screen widgets for at-a-glance information
- Live wallpaper
- Custom icon packs
  - [Geometric Weather icon packs](https://github.com/breezy-weather/breezy-weather-icon-packs/blob/main/README.md)
  - Chronus Weather icon packs
- Automatic dark mode

- <details><summary>Free and Open Source</summary>

  - No proprietary blobs/dependencies
  - Releases generated by GitHub actions, guaranteeing it matches the source code
  - Fully works with Open-Meteo (FOSS source)
</details>

- <details><summary>Privacy-friendly</summary>

  - No personal data collected by the app ([link to app privacy policy](https://github.com/breezy-weather/breezy-weather/blob/main/PRIVACY.md))
  - Multiple sources are available, with links to their privacy policies for transparency
  - Current location is optional and not added by default
  - If using current location, an IP location service can be used instead of GPS to send less accurate coordinates to weather source
  - No trackers/automatic crash reporters
</details>


# Help

* [Frequently Asked Questions / Help](HELP.md)
* [Homepage explanations](docs/HOMEPAGE.md)
* [Weather sources comparison](docs/SOURCES.md)


# Contribute

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

* [Contribution guide (includes a guide to create a new weather source)](CONTRIBUTE.md)


# Translations

Translation is done externally [on Weblate](https://hosted.weblate.org/projects/breezy-weather/breezy-weather-android/#information). Please read carefully project instructions if you want to help.

[![Translation progress report](https://camo.githubusercontent.com/c651422c22fc5743a6bf2003b86ed171e1852a8b90030c2e3bae322e32b9f778/68747470733a2f2f686f737465642e7765626c6174652e6f72672f776964676574732f627265657a792d776561746865722f2d2f627265657a792d776561746865722d616e64726f69642f686f72697a6f6e74616c2d6175746f2e737667)](https://hosted.weblate.org/projects/breezy-weather/breezy-weather-android/#information)

* English regional variants must be updated on GitHub if they differ from the original English file
* French translation is maintained by repo maintainers


# Contact us

* If you’d like to report a bug or suggest a new feature, GitHub discussions or issues are best for organization.
* We’ve also created a Matrix/Element space with a number of different channels for more general discussion: [\`#breezy-weather-space:matrix.org\`](https://matrix.to/#/#breezy-weather-space:matrix.org).
  * If you are not comfortable writing a GitHub discussion/issue in English, you can ask on the channel if someone can help you in your language.
    * We also have a dedicated help channel in French: [\`#breezy-weather-francais:matrix.org\`](https://matrix.to/#/#breezy-weather-francais:matrix.org)
  * If you’d prefer a direct channel link instead of a space link, here’s the main Breezy Weather Matrix channel: [\`#breezy-weather:matrix.org\`](https://matrix.to/#/#breezy-weather:matrix.org)


# Status of main requested features

| ID                                                                                                                                     | Feature                            | Status                | Note                                                                                                                                     |
|----------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| [#336](https://github.com/breezy-weather/breezy-weather/issues/336)                                                                    | Better precipitation notifications | Work in progress      |                                                                                                                                          |
| [#14](https://github.com/breezy-weather/breezy-weather/issues/14), [#252](https://github.com/breezy-weather/breezy-weather/issues/252) | New 24-hour fitting charts         | Work in progress      | Precipitation chart worked on with new chart lib on \`dev\` branch                                                                         |
| [#15](https://github.com/breezy-weather/breezy-weather/issues/15)                                                                      | Humidity/Dew point chart           | Depends on new charts |                                                                                                                                          |
| [#10](https://github.com/breezy-weather/breezy-weather/issues/10)                                                                      | Add location from a map            | Mockups to do         | “Add location” page needs a new design, in the spirit of Google Maps where you can select location points on the map, or search manually |
|                                                                                                                                        | Widgets redesign                   | Mockups in progress   | No widgets improvements will be done until completed                                                                                     |
| [#23](https://github.com/breezy-weather/breezy-weather/issues/23)                                                                      | Radar                              | Survey to do          | To better understand expectations                                                                                                        |
| [#147](https://github.com/breezy-weather/breezy-weather/issues/147)                                                                    | Black theme                        | Not being worked on   | We already have a dark mode                                                                                                              |


# Build variant

A variant called \`gplay\` is available and may be distributed on Google Play Store in the future.
It enables Instant App and bundles Google Network Location Provider (proprietary).


# License

* [GNU Lesser General Public License v3.0](/LICENSE)
* [Additional license terms](/LICENSE_ADDITIONAL)
* [Guidelines regarding Breezy Weather identity and forks](/IDENTITY.md)
* [Built on Geometric Weather Android app (GNU Lesser General Public License v3.0)](https://github.com/WangDaYeeeeee/GeometricWeather). Breezy Weather is not officially associated with Geometric Weather or its products.

`
  },
  {
    id: "655472379",
    name: "dotfiles_config.git",
    description: null,
    language: "Lua",
    updatedAt: "2023-06-19",
    readmeContent: ``
  },
  {
    id: "648603137",
    name: "swiper.git",
    description: "Most modern mobile touch slider with hardware accelerated transitions",
    language: "JavaScript",
    updatedAt: "2023-06-04",
    readmeContent: `<p align="center">
  <img src="https://swiperjs.com/images/share-banner-3.png"/>
</p>

<p align="center">
  <a href="https://swiperjs.com/get-started">Get Started</a> |
  <a href="https://swiperjs.com/swiper-api">Documentation</a> |
  <a href="https://swiperjs.com/demos">Demos</a>
</p>

<p align="center">
  <a href="https://opencollective.com/swiper">
    <img src="https://opencollective.com/swiper/all/badge.svg?label=financial+contributors" alt="Financial Contributors on Open Collective"/>
  </a>
  <a href="https://github.com/nolimits4web/swiper/actions?query=workflow%3ABuild">
    <img src="https://github.com/nolimits4web/swiper/workflows/Build/badge.svg" alt="Build status"/>
  </a>
  <a href="https://www.jsdelivr.com/package/npm/swiper">
    <img src="https://data.jsdelivr.com/v1/package/npm/swiper/badge?style=rounded" alt="jsDelivr Hits"/>
  </a>
  <a href="https://bundlephobia.com/result?p=swiper">
    <img alt="tree-shakeable" src="https://badgen.net/bundlephobia/tree-shaking/swiper" />
  </a>
  <a href="https://npmjs.org/package/swiper">
    <img alt="types included" src="https://badgen.net/npm/types/swiper" />
  </a>
</p>

<p align="center">
<a href="https://opencollective.com/swiper/" target="_blank">
  <img src="https://opencollective.com/swiper/donate/button@2x.png?color=blue" width=300 />
</a>
</p>

# Swiper

Swiper - is the free and most modern mobile touch slider with hardware accelerated transitions and amazing native behavior. It is intended to be used in mobile websites, mobile web apps, and mobile native/hybrid apps.

Swiper is not compatible with all platforms, it is a modern touch slider which is focused only on modern apps/platforms to bring the best experience and simplicity.

## Sponsors

<!-- SPONSORS_TABLE_WRAP -->
<table>
  <tr>
    <td align="center" valign="middle">
      <a href="https://awisee.co.uk/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/awiseecouk.png" alt="SEO Agency UK - International SEO and Link Building Services" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://linkbuildingsweden.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/lbsweden.png" alt="Linkbuilding Sweden - Link Building Agency Sweden" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.vedonlyontibonukset.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/vedonlyontibonukset.png" alt="Vedonlyöntibonukset 2023 | Ilmaiset vihjeet | Koutsi hoitaa" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://bitcoinist.com/10-most-reputable-non-gamstop-casinos-uk-in-2023-%E2%9C%94%EF%B8%8F/amp/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/btcgaming.png" alt="10 Most Reputable Non-GamStop Casinos UK in 2023 ✔️ | Bitcoinist.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://writersperhour.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/writersperhour.png" alt="Hire Professional Paper Writers for Custom Writing Services" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://starwarscasinos.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/starwarscasinos.png" alt="Casino utan Svensk Licens 2023" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://automatenspielex.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/automatenspielexcom.png" alt="automatenspielex online" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://automatenspieler.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/automatenspieler.png" alt="Automatenspieler - Das Casino-Portal von Spielern für Spieler" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://buyyoutubviews.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/buyyoutubviews.png" alt="Buy Youtube Views" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.gambleonlineaustralia.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/gambleonlineaustralia.png" alt="Gamble Online Australia | Best Online Gambling Sites List 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nettikasinot.org/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nettikasinot.png" alt="Nettikasinot | Tässä parhaat nettikasinot 2022 - Katso lista" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.kasinohai.com/nettikasinot" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/kasinohai.png" alt="Nettikasinot 2022 | Löydä Luotettava & Turvallinen Nettikasino!" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://bluechip.io/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/bluechip.png" alt="indian casino Bluechip" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nongamstopodds.com/casinos-not-on-gamstop/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nongamstopodds.png" alt="NonGamStopOdds casino sites" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.casinotest.de" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinotest.png" alt="Online Casino Test 2022 » 90+ Casinos von Experten geprüft!" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.kasinot.fi" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/kasinot-fi.png" alt="Kasinot | Löydä parhaat nettikasinot (2022)" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.pelisivut.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/pelisivut.png" alt="Rahapelit netissä - Löydä parhaat pelisivut rahapeleihin" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.paraskasino.fi" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/paraskasino.png" alt="Paras nettikasino (2021) - Löydä listalta parhaat nettikasinot" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://parimatch.in/en/football/live" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/parimatch.png" alt="Online sports betting and casino at Parimatch India" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casino-wise.com/casinos-not-on-gamstop/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casino-wise-com.png" alt="Casinos not on GamStop | Casino-Wise.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nongamstopwager.com/casinos-not-on-gamstop/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nongamstopwager-com.png" alt="Casinos not on GamStop UK 🏆 NonGamStopWager.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoutankonto.net/casino-utan-svensk-licens/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoutankonto.png" alt="Casino utan spelpaus" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.casinot.net" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinot-net.png" alt="Casinot | Tässä parhaat netticasinot 2021 - Katso lista" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoauditor.com/online-casinos-cyprus/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoauditor.png" alt="Online Casinos Cyprus - CasinoAuditor" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://casinoshunter.com/online-casinos/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinos-hunter.png" alt="Best Online Casinos in Canada" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://papersowl.com/pay-for-research-paper" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/papersowl.png" alt="Pay Someone to Write My Research Paper" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://wmd.hosting/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/wmd-logo.png" alt="Hosting Europe – Super fast support better than AI" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casino-zonder-cruks.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casino-zonder-cruks.png" alt="Casino Zonder Cruks" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://menaseo.ae/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/mena-seo.png" alt="mena seo agency - supercharge your growth in the MENA region" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://igamingmi.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/igamingmi.png" alt="iGamingMI: Your Trusted Online Gambling Guide In Michigan" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://tranio.com/spain/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/tranio.png" alt="Property for sale in Spain" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://ratemycasino.ca/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/alexliam.png" alt="Top 10 online casinos list for Canadians" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.minimumdepositcasinos.org/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/minimumdepositcasinosorg.png" alt="Minimum Deposit Casinos 2023 - Get more bang for your buck with our low deposit casinos" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://apacseo.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/apac-seo.png" alt="apac seo agency - supercharge your growth in the APAC region" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nyecasino.me/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nyecasino.png" alt="Nye casino 2023 >> Finn et helt nytt norsk nettcasino nå!" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://idealecasinos.nl/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/niel-heijnsbergen.png" alt="Beste iDeal Casino's 2023 - Veilige NL Online Casino met iDeal" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://myfootballbets.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/myfootballbets.png" alt="My Football Bets: Compare Betting Odds and Sites" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://scrapcartorontoshop.ca/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/scrap-car-removal-toronto.png" alt="Scrap Car Removal Toronto | Best Cash For Scrap Cars up to $5,000" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.vedonlyontibonukset.com/pitkavetovihjeet" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/pitkavetovihjeet.png" alt="Pitkävetovihjeet | Joka päivä uusia kohteita | Lue lisää" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://socialboss.org/buy-instagram-likes/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/socialboss.png" alt="buy Instagram likes" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://linkbuildingitaly.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/link-building-italy.png" alt="Linkbuilding Italy - Link Building Italy" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://uusi-pikakasino.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/uusi-pikakasinocom.png" alt="Pikakasinot 2023 | Löydä paras uusi pikakasino suomessa!" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://kasinokolikkopelit.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/kasinokolikkopelitcom.png" alt="Rahapelit Netissä Toukokuu 2023 - Paras Rahapeli Valikoima" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.newsbtc.com/news/company/real-money-online-casino-best-casinos-that-pay-real-money/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/playrealmoneyslots.png" alt="Real Money Online Casino - Best Casinos That Pay Real Money" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://buycheapestfollowers.com/buy-instagram-reels-views" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/thebestsolution.png" alt="Buy Instagram Reels Views" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinocrawlers.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinocrawlerscom.png" alt="Best Online Casino NZ in 2023 - Online Gambling NZ" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.frichert.se/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/frichert.png" alt="SEO Skribent & Copywriter - Filippa Richert" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.casinot.biz/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinotbiz.png" alt="Casinot: Katso mitkä ovat parhaat casinot netissä 2023" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://no-verification.casino/uk/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/noverificationcasino.png" alt="no id verification withdrawal casino uk" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.ghotala.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/ghotala-com.png" alt="सर्वोत्तम गैम्बलिंग साइट भारत : 100% सुरक्षित ऑनलाइन जुआ" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://mobipast.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/mobipast.png" alt="mobiplast" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://dr.sc/top-10-najboljih-online-casina-u-hrvatskoj/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/doctor-sports-and-casinos-dr-sc.png" alt="Top 10 Najboljih Online Casino u Hrvatskoj u 2023" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://dispomode.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/user-53231496.webp" alt="Online Vape Shop – DispoMode" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.kiekkotorni.com/vahvat-nikotiinipussit" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/vahvat-nikotiinipussit-netista.png" alt="Vahvat Nikotiinipussit Laillisesti Suomeen - Kiekkotorni" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://onlinecasinosspelen.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/onlinecasinosspelen.png" alt="Onlinecasinosspelen.com site is dé nummer één gids, waardoor je gemakkelijk alle informatie van de top 10 online casino sites." width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.weareroli.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/pucuk138.png" alt="Pucuk138 » Daftar Situs Judi Online Slot Gacor Hari Ini" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://slotsmegacasino.com/en-au/top-10-online-casinos" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/slotsmegacasino.png" alt="Top 10 Australian Online Casinos ➤ Real Money (Aud) 2023" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://onlinecasinoudenrofus.dk/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/slotsmegacasino.png" alt="Spille Uden Om Rofus - Bedste Casinoer Uden Rofus" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://fatgambler.ca/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/fatgambler.png" alt="FatGambler - Canadian Online Casino Reviews" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://cryptoseoagency.co/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/cryptoseo-agency.png" alt="Crypto SEO Agency - Scaling the growth in the Crypto space" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://linkbuildingasia.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/linkbuilding-asia.png" alt="Link Building Asia" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.onlinecasinosnederland.org/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/onlinecasinosnederland-org.png" alt="De Beste Online Casinos in Nederland – Casino Reviews voor Nederlandse Spelers" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nettcasino.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nettcasino.png" alt="Nettcasino i Norge - Beste norske online casino på nett" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://howsociable.com/buy-instagram-followers/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/howsociable.png" alt="Best Sites To Buy Instagram Followers In 2023 | Howsociable" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://aviaorevue.com.br/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/aviaorevue.png" alt="" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.bestuscasinos.org/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/bestuscasinos.png" alt="Best Online Casinos USA | Top US Online Gambling Sites 2023" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://onlinecasino.ua/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/onlinecasinoua.png" alt="Огляд найкращих казино в Україні" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://jetxgame.org/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/jetx-jogo-223.png" alt="JetX - jogo do foguete que ganha dinheiro - tudo sobre o jogo jetX" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://sup.today/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/suptoday.png" alt="Sup! - Standups, Holidays, and Surveys for your team | Sup! Standup Bot" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoutanspelpaus.io/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoutanspelpaus.jpeg" alt="casino utan svensk licens" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinozondercruks.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/czc-net.png" alt="Casino Zonder Cruks En Nederlandse Licentie" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.bestonlinecasinos.in/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/bestonlinecasinosin.png" alt="Best Online Casinos India 2023 ▷ Top Indian Casino Sites" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://rotativka.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/rotativka.png" alt="Rotativka.com - Най-добрите онлайн казина в България" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://ua1.com.ua/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/ua1casino.png" alt="рейтинг ліцензійних онлайн казино України" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://justuk.club/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/justuk-club.png" alt="Justuk.club reviews UK non gamstop sites" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://betpokies.co.nz/real-money-casinos/mobile-pokies" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/betpokiesconz.png" alt="Mobile Pokies in NZ - Best Mobile Phone Pokies for Real Money [2023] | BetPokies.co.nz" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.casinoaustraliaonline.com/under-1-hour-withdrawal-casinos/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoaustraliaonline.png" alt="Under 1 Hour Withdrawal Casinos in Australia - 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://bitcoincasinowiz.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/bitcoincasinowiz.png" alt="Best Bitcoin Casinos in 2023 ✔️ Top Crypto Casino Sites" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://betbetter-pa.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/betbetter.png" alt="PA Online Casino - List of Best Casinos in Pennsylvania" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.newcasinosaustralia.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/newcasinosaustralia.png" alt="New Online Casinos Australia" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinozonderregistratie.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/czrnet.png" alt="Casino Zonder Registratie 2022 | CZR's Top No Account Casino's Ranglijst" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://twicsy.com/buy-instagram-likes" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/twicsy.png" alt="Buy Instagram Likes | Real, Instant Delivery & Only $1.47" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://nieuwe-casinos.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nieuwecasinos.png" alt="Nieuwe Online Casino's December 2022 | Overzicht van de top nieuwe casinos!" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://seo.casino/en/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/seo-for-online-casino.png" alt="CASINO SEO | SEO Services for gambling sites and online casinos" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://onlinecasinowiki.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/onlinecasinowiki.png" alt="オンラインカジノ - OnlineCasinoWiki.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://4rabet.com/app" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/4rabet.svg" alt="cricket betting app" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.mister-auto.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/mister-auto.png" alt="Pièces auto neuves au meilleur prix | MISTER AUTO" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://istar.tips/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/istartips.png" alt="iStarTips - Tips for Software, Apps on Android, iPhone" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://giochinet.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/giochinet.png" alt="Giochi online e non solo – A quale gioco vuoi giocare oggi?" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nodeposit.guide/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nodeposit-guide.png" alt="Best No Deposit Bonus Guide 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nzcasinoclub.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nzcasinoclub.png" alt="Discover the Best Online Casinos in New Zealand in 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://asian-bookies.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/asian-bookies.svg" alt="Best Asian Bookies" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.wisergamblers.com/de/casino-bonus-ohne-einzahlung/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/wisergamblers.png" alt="WiserGamblers | Best Online Gambling Guide" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casino-ohne-lizenz.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casino-ohne-lizenz.svg" alt="casinos ohne lizenz" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://cryptocasinos360.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/cryptocasinos360.png" alt="new crypto casinos 2023" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://utansvensklicens.casino/casino-minsta-insattning/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/utansvensklicens.png" alt="utländska casino med låg insättning" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://www.nongamstopsites.bet/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nongamstopsites.png" alt="Non Gamstop Betting Sites UK" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://refermate.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/refermate.png" alt="Coupons, Promo Codes, October 2022 — Refermate" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.scommesseseriea.eu/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/scommesseseriea.png" alt="Scommesse Serie A: dove scommettere?" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.one-beyond.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/dcsl-software.png" alt="Software Development Company | Bespoke Software | One Beyond London, UK" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://megafamous.com/buy-instagram-likes" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/megafamous.png" alt="Buy Instagram Likes - Real, Instant Likes - $1/50! - MegaFamous" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://betting-sider.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/betting-sider.png" alt="betting sider" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://topcasinoer.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/topcasinoer.png" alt="online casinoer" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://bedstespiludenomrofus.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/bedstespiludenomrofus.png" alt="casino uden ROFUS" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://comunicaformazione.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/comunicaformazione.png" alt="Corsi e Formazione Professionale" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://scommesse.commentierecensioni.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/scommessecommentierecensioni.png" alt="Migliori siti scommesse: quale il miglior sito scommesse 2022?" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www1.italianonlinecasino.net/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/italianonlinecasino.png" alt="Siti scommesse non AAMS | Bookmakers non AAMS 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://betpokies.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/betpokies.png" alt="🥇 Best Australian Online Pokies. Trusted Online Casino Reviews 2022" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://www.vedonlyontibonukset.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/vedonlyontibonukset.png" alt="Vedonlyöntibonukset 2022 | Ilmaiset vihjeet | Koutsi hoitaa" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoburst.com/casino-utan-licens/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoburst.png" alt="Casino utan svensk licens » Utan Spelpaus med BankID | 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.uudetkasinot.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/uudetkasinot.png" alt="Uudet kasinot Elokuu 2022 🥇 - Parhaat uudet nettikasinot" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.spinsify.com/uk/new-casinos/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/spinsify.png" alt="Top 25 New Casino Sites August 2022 - Spinsify.com/uk" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://thecasinowizard.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/thecasinowizard.png" alt="The Casino Wizard » Best Casinos & (No) Deposit Bonuses 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.noneedtostudy.com/take-my-online-class/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/noneedtostudy.png" alt="Take My Online Class For Me? NoNeedToStudy.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://nzcasinohex.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nzcasinohex.png" alt="Best Online Casino NZ ▷ Top New Zealand Casinos [2022]" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://coupontoaster.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/coupontoaster.png" alt="Coupontoaster: August 2022 Discount Codes, Coupons, Promo Codes & Deals" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://handycasinos24.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/handycasinos24.png" alt="Compare and test the best Online Casinos, with a strong focus on mobile Casino" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://mrcasinova.com/de/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/mrcasinova.png" alt="Make the world a better place for Online Casino comparisons" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://neuecasinos24.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/neuecasinos24.png" alt="Ausführliche Informationen an die interessierten Spieler vermitteln um die bestmögliche Auswahl zu ermöglichen" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinopilot24.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinopilot24.png" alt="Online Casino Deutschland - Beste deutsche Online Casinos 2022" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://leafletcasino.com/online-casino/real-money/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/leafletcasino.png" alt="Best Real Money Online Casino ➲ Play Online and Win Real Money" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.fast.bet/ca/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/fastbet-bet-ca.png" alt="Fastest Payout Casinos in Canada [2022]" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://vpnwelt.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/vpnwelt.png" alt="VPNwelt: VPN Neuigkeiten, Testberichte und Statistik 2022" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://realspyapps.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/realspyapps.png" alt="Real Spy Apps - Reviews, You Can Trust" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://cliquestudios.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/cliquestudios.png" alt="Clique Studios - Creative Digital Transformation" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.socialboosting.com/buy-tiktok-followers" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/socialboosting.png" alt="Buy TikTok Followers - 100% Real & Fast | Just $5.00 - SocialBoosting" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://gamblorium.com/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/gamblorium.png" alt="Gamblorium publishes news, information, and reviews about regulated online gambling operators." width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://hellsbet.com/en-au/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/hellsbet.png" alt="Rating of best betting sites in Australia" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.sure.bet/casinos-not-on-gamstop/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/surebet.png" alt="Casinos Not on GamStop » Most Trusted Non GamStop UK Casinos ⭐️" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://cryptocurrencycodes.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/cryptocurrencycodes.png" alt="Top FREE Crypto Sign Up Bonuses & Referral Codes" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoscrypto.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoscryptocom.png" alt="Best Crypto Casinos | Top Bitcoin Gambling Sites (2022)" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://residence-greece.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/residence-greece.jpg" alt="Greece Golden Visa" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://aviators.com.br" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/aviatorscombr.png" alt="Aviator aposta ᐈ Jogo de avião Aviator" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoscanada.reviews" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinocanada.png" alt="Casino en Ligne Argent Réel au Canada: Meilleurs Sites de Casino" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://playcasinoscanada.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/play-casinos-canada.png" alt="Discover The Best Reputable Online Casinos in Canada" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://popularwow.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/popularwow.png" alt="The Most Popular Stuff On The Internet" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://poprey.com/buy-instagram-views" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/poprey-com.png" alt="Buy Instagram views" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://correctcasinos.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/correctcasinos.png" alt="Correct Casinos | The Ultimate Guide to the Legit Online Casinos" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://writingmetier.com/extended-essay-writing-service/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/writingmetier.png" alt="IB extended essay writing service" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.nycjackets.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/nycjackets.png" alt="NYC Jackets" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.prointernet.in.ua" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/prointernet.png" alt="Інтернет казино онлайн – ТОП online casino України для гри в ігрові автомати" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://bestcasinos-pl.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/bestcasinos-pl.png" alt="Kasyno Online Legalne Polska ⚡️ Ranking Kasyn Grudzień 2021 !" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://exittimesharereview.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/exittimesharereview.png" alt="Timeshare exit company reviews" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://aussiebestcasinos.com/instant-withdrawal-casino/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/ausiebestcasinos.png" alt="Instant Withdrawal Casino Sites Worth Visiting in 2021" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://www.wizardslots.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/wizardslots.png" alt="Online Slots - UK Slot Games - 500 FREE Spins at Wizard Slots" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://celltrackingapps.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/celltrackingapps.png" alt="Best Phone Tracker Apps without Permission in 2021【for iOS & Android】" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://reddogcasino.com/en/games" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/red-dog.png" alt="Red Dog Online Casino" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.fortunegames.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/fortunegames.png" alt="Fortune Games® | Free Spins No Deposit Slot Games | Online Slots" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://famousblast.com/product/buyfollowers/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/famousblast.png" alt="Buy Instagram Followers - Cheap & Instant - $3.90 per 1.000" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://zamsino.com/de/casino-bonus/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/zamsino.png" alt="Erik Kings Zamsino Bonus seiten" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.casinoonlineaams.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoonlineaams.png" alt="Review of the best online casino in Italy" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://www.boosbe.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/boosebe.png" alt="Get the most out of Social Media - Boosbe" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://veepn.com/vpn-apps/vpn-for-chrome/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/veepn.png" alt="VPN for Chrome to Make Web Surfing 100% Safe" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinoexpo.se/casino-utan-registrering/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinoexpo.jpg" alt="CasinoExpo casino utan registrering" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://cryptocasinos.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/cryptocasinos.png" alt="Best Bitcoin Casinos » Find The Best Crypto Casino" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://inkedin.com/us/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/inkedin.png" alt="Inkedin - The Online Gambling News Hub" width="160">
      </a>
    </td>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <a href="https://najlepsibukmacherzy.pl/ranking-legalnych-bukmacherow/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/netpositive.png" alt="Ranking Bukmacherów Legalnych 2020. Bukmacher nr 1 to..." width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://casinosters.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/casinosters.svg" alt="The Best Online Casinos in the UK » Gambling Sites by Casinosters" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://gamblizard.com/deposit-bonuses/deposit-10-pound/" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/gamblizard.png" alt="Deposit £10 Play with 30, 40, 50, 60, 70, or 80 Pounds✔️ GambLizard" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://goread.io/buy-instagram-likes" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/goread.png" alt="Instagram likes" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://elroyalecasino.com/games/blackjack" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/elroyalcasino.png" alt="Play Online Blackjack at elroyalecasino.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://paperell.com" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/paperell.svg" alt="Website that Writes Essays for You - Paperell.com" width="160">
      </a>
    </td>
    <td align="center" valign="middle">
      <a href="https://socialsup.net" target="_blank">
        <img src="https://swiperjs.com/images/sponsors/socials-up.png" alt="Buy 100% Cheap SMM Services - Instagram, YouTube, Twitter" width="160">
      </a>
    </td>
    <td align="center" valign="middle"></td>
    <td align="center" valign="middle"></td>
    <td align="center" valign="middle"></td>
    <td align="center" valign="middle"></td>
    <td align="center" valign="middle"></td>
  </tr>
</table>
<!-- SPONSORS_TABLE_WRAP -->

## Features

- **Tree-shakeable**: Only modules you use will be imported into your app's bundle.
- **Mobile-friendly**: It is intended to be used in mobile websites, mobile web apps, and mobile native/hybrid apps.
- **Library Agnostic**: Swiper doesn't require any JavaScript libraries like jQuery, which makes Swiper much smaller and faster. It can be safely used with libraries such as jQuery, Zepto, jQuery Mobile, etc.
- **1:1 Touch movement**: By default, Swiper provides 1:1 touch movement interaction, but this ratio can be configured through Swiper settings.
- **Mutation Observer**: Swiper has an option to enable Mutation Observer, with this feature Swiper will be automatically reinitialized and recalculate all required parameters if you make dynamic changes to the DOM, or in Swiper styles itself.
- **Rich API**: Swiper comes with a very rich API. It allows creating your own pagination, navigation buttons, parallax effects and many more.
- **RTL**: Swiper is the only slider that provides 100% RTL support with correct layout.
- **Multi Row Slides Layout**: Swiper allows a multiple row slides layout, with a few slides per column.
- **Transition Effects**: Fade, Flip, 3D Cube, 3D Coverflow.
- **Two-way Control**: Swiper may be used as controller for any number of other Swipers, and even be controlled at the same time.
- **Full Navigation Control**: Swiper comes with all required built-in navigation elements, such as Pagination, Navigation arrows and Scrollbar.
- **Flexbox Layout**: Swiper uses modern flexbox layout for slides layout, which solves a lot of problems and time with size caclulations. Such layout also allows configuring the Slides grid using pure CSS.
- **Most Flexible Slides Layout Grid**: Swiper has a lot of parameters on initialization to make it as flexible as possible. You can control slides per view, per column, per group, space between slides, and many more.
- **Images Lazy Loading**: Swiper Lazy Loading delays loading of images in inactive/invisible slides until the user swipes to them. Such feature could make the page load faster and improve Swiper performance.
- **Virtual Slides**: Swiper comes with Virtual Slides feature that is great when you have a lot of slides or content-heavy/image-heavy slides so it will keep just the required amount of slides in DOM.
- **Loop mode**
- **Autoplay**
- **Keyboard control**
- **Mousewheel control**
- **Nested sliders**
- **History navigation**
- **Hash navigation**
- **Breakpoints configuration**
- **Accessibility (A11y)**
- **And many more ...**

## Community

The Swiper community can be found on [GitHub Discussions](https://github.com/nolimits4web/swiper/discussions), where you can ask questions, voice ideas, and share your projects

Our [Code of Conduct](https://github.com/nolimits4web/swiper/blob/master/CODE_OF_CONDUCT.md) applies to all Swiper community channels.

## Dist / Build

On production use files (JS and CSS) only from \`dist/\` folder, there will be the most stable versions.

### Development Build

Install all dependencies, in repo's root:

\`\`\`

$ npm install

\`\`\`

And build development version of Swiper:

\`\`\`

$ npm run build

\`\`\`

The result is available in \`dist/\` folder.

### Running demos:

All demos located in \`./playground\` folder. There you will find Core (HTML, JS), React, Vue versions.
To open demo, run:

- **Core**: \`npm run core\`
- **React**: \`npm run react\`
- **Vue**: \`npm run vue\`

### Production Build

\`\`\`

$ npm run build:prod

\`\`\`

Production version will available in \`dist/\` folder.

## Contributing

All changes should be committed to \`src/\` files only. Before you open an issue please review the [contributing](https://github.com/nolimits4web/swiper/blob/master/CONTRIBUTING.md) guideline.

## Major Roadmapped Features

- [Top Feature Requests](https://github.com/nolimits4web/swiper/issues?q=is%3Aissue+is%3Aopen+label%3A%22feature+request%22+sort%3Areactions-%2B1-desc+) (Add your own votes using the 👍 reaction)
- [Top Bugs 😱](https://github.com/nolimits4web/swiper/issues?q=is%3Aissue+is%3Aopen+-label%3A%22feature+request%22++sort%3Areactions-%2B1-desc+) (Add your own votes using the 👍 reaction)

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="CODE_CONTRIBUTORS.md"><img src="https://opencollective.com/swiper/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/swiper/contribute)]

<a href="https://opencollective.com/swiper"><img src="https://opencollective.com/swiper/individuals.svg?width=890"></a>
`
  },
  {
    id: "648652874",
    name: "swiper-website.git",
    description: "Swiper website",
    language: null,
    updatedAt: "2023-06-02",
    readmeContent: `# Swiper Website

Swiper's website to use these docs offline

https://swiperjs.com/

## Next.js

This is a [Next.js](https://nextjs.org/) project bootstrapped with [\`create-next-app\`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying \`pages/index.js\`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in \`pages/api/hello.js\`.

The \`pages/api\` directory is mapped to \`/api/*\`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
`
  },
  {
    id: "626759615",
    name: "angular-poc-localize.git",
    description: null,
    language: "TypeScript",
    updatedAt: "2023-04-13",
    readmeContent: `# AngularPocLocalize

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.5.

## Development server

Run \`ng serve\` for a dev server. Navigate to \`http://localhost:4200/\`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run \`ng generate component component-name\` to generate a new component. You can also use \`ng generate directive|pipe|service|class|guard|interface|enum|module\`.

## Build

Run \`ng build\` to build the project. The build artifacts will be stored in the \`dist/\` directory.

## Running unit tests

Run \`ng test\` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run \`ng e2e\` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use \`ng help\` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
`
  },
  {
    id: "608687750",
    name: "jober_design_renewal.git",
    description: "Created with CodeSandbox",
    language: "JavaScript",
    updatedAt: "2023-03-03",
    readmeContent: `# jober_design_renewal
Created with CodeSandbox
`
  },
  {
    id: "608690004",
    name: "jober_nlb_favorites.git",
    description: "Created with CodeSandbox",
    language: "JavaScript",
    updatedAt: "2023-03-02",
    readmeContent: `# jober_nlb_favorites
Created with CodeSandbox
`
  },
  {
    id: "577191173",
    name: "spotify-clone-frontend-ionic-react.git",
    description: null,
    language: "TypeScript",
    updatedAt: "2023-01-02",
    readmeContent: `
# Front-end for a clone of Spotify made with React and Ionic

  

>

  

## About

  

This project is a front-end for a clone of Spotify made with React and Ionic

  

## Getting Started

  

Getting up and running is as easy as 1, 2, 3.

  

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

2. Install your dependencies

  

\`\`\`

cd path/to/repo; yarn or npm install

\`\`\`

  

3. Start your app

  

\`\`\`

yarn start or npm start

\`\`\`

  

## Testing

  

Simply run \`yarn test or npm test\`.


## Environment Variables

  
| Key Name                                | Description                                |
|-----------------------------------------|--------------------------------------------|
| E2E_DB_CONNECTION-STRING                | connection string for the test database    | 
| E2E_API_USER_USERNAME                   | username for the user that will be created and used during the tests |
| E2E_API_USER_PASSWORD                   | password for the user that will be created and used during the tests |
| E2E_API_BASE-PATH                       | base path of the test api |
| REACT_APP_API_BASE                      | base path of the api |


## DotEnv

a \`.env\` file can be used to setup environment variables.
a example file \`.env.exemple\` is present at the root of the repo.

## Todo

- Code comments
- Documentation
- More e2e tests
- Register a new account
- Being able to create playlists
- Being able to actulay play tracks
- Recomendation feed
`
  },
  {
    id: "196317481",
    name: "dotnet-core-fusion-keyboard-api.git",
    description: "based on martin31821's work https://github.com/martin31821/fusion-kbd-controller",
    language: "C",
    updatedAt: "2022-11-13",
    readmeContent: `# dotnet-core-fusion-keyboard-api
based on martin31821's work https://github.com/martin31821/fusion-kbd-controller

api for the aero 15w rgb fusion french keyboard
`
  },
  {
    id: "196416316",
    name: "Aurora.git",
    description: "Unified lighting effects across multiple brands and various games.",
    language: "C#",
    updatedAt: "2019-07-11",
    readmeContent: `# Aurora - Unified Lighting Effects
![Aurora Logo](http://i.imgur.com/ZkxyAyp.png)

[Link to Aurora's webpage, includes some demos and changelogs](http://project-aurora.com/)

[![Latest Version](https://img.shields.io/github/release/antonpup/aurora.svg)](https://github.com/antonpup/Aurora/releases/latest) [![Total Downloads](https://img.shields.io/github/downloads/antonpup/aurora/total.svg)](https://github.com/antonpup/Aurora/releases/latest) [![Build status](https://ci.appveyor.com/api/projects/status/jh44k7r5ewelxiss?svg=true)](https://ci.appveyor.com/project/antonpup/aurora) ![Build status](https://img.shields.io/badge/language-C%23-178600.svg)


Project Aurora is a utility that unifies RGB lighting devices across different brands and enables them to work alongside each other, all while adding and improving RGB lighting support for various games that previous had none or little RGB lighting support. Aurora is mainly written in C#, but has C++ components to implement native support for other games.

## Download

[Latest stable release](https://github.com/antonpup/Aurora/releases/latest)

[Most recent release (potentially unstable)](https://github.com/antonpup/Aurora/releases)

[Bleeding-edge builds (decent chance they're going to have issues)](https://ci.appveyor.com/project/antonpup/aurora/build/artifacts)

## Discord Server

Having issues? Want to discuss changes or talk about possible features? Want to be involved in the development and design process of Aurora? Join our [Discord server](https://discord.gg/YAuBmg9) and get involved!

## How to Install

### AUTOMATIC

1. Download the 'Aurora-setup-vX.X.X.exe' from any of the options found under the Download section, every recent release should have this available
2. Run the executable and install it, all requirements should be installed for you.
3. Start using Aurora!

### MANUAL

1. First of all, make sure that your PC meets the requirements listed above. Also, make sure that you have [Visual C++ Redistributable Packages for Visual Studio 2017](https://support.microsoft.com/en-gb/help/2977003/the-latest-supported-visual-c-downloads) and [Microsoft .NET Framework 4.6.1](https://www.microsoft.com/en-gb/download/details.aspx?id=49981) installed.
2. Download the latest release from above
3. Extract the archive anywhere on your computer. Preferably keep it in a location you can easily access.
4. Run "Aurora.exe", from that point, Aurora should provide you with further instructions and options.


## Natively Supported Games

* Dota 2
* CS:GO
* Grand Theft Auto V
* Rocket League
* Overwatch
* Payday 2
* The Division
* League of Legends
* Hotline Miami
* The Talos Principle
* Battlefield 3
* Blacklight: Retribution
* Magic: The Gathering - Duels of the Planeswalkers 2012
* Middle-earth: Shadow of Mordor
* Serious Sam 3
* Robot Roller-Derby Disco Dodgeball
* XCOM: Enemy Unknown
* Evolve Stage 2
* Metro: Last Light
* Guild Wars 2
* Worms W.M.D
* Blade and Soul
* Borderlands 2
* Minecraft
* Euro Truck Simulator 2
* American Truck Simulator
* Rise of the Tomb Raider
* Dying Light
* Quantum Conumdrum
* Move or Die
* Battlefield 1
* Dishonored
* The Witcher 3
* Minecraft
* Killing Floor 2
* DOOM (2016)
* Factorio
* Quake Champions
* Diablo III

## Natively Supported Devices

If you don't see some of these devices in the menu, select a similar one and it will probably work. Submit an issue for proper support in the interface! Devices from supported brands generally should work even if they aren't listed here.

### Logitech
* Most Logitech Lightsync devices should work
#### Keyboards
* G410
* G512
* G513
* G810
* G910
* G PRO
#### Mice
* G203
* G403
* G502
* G900
* G903
* G703
* G PRO

### Corsair
* Most Keyboards, Mice, Headsets and mousepads should work.
#### Keyboards
* K68
* K65
* K70 LUX
* K95
* K95 Platinum
* STRAFE Non-RGB/RGB
#### Mice
* Scimitar RGB
* Dark Core RGB
* M65 RGB
* Glaive RGB
#### Other Peripherals
* ST100 Headset Stand
* MM800 Mousepad

### Razer
* Most Chroma enabled devices should work
#### Keyboards
* Huntsman
* Huntsman Elite
* BlackWidow Chroma
#### Mice
* Abyssus Essential
* Naga Hex/Trinity
* Lancehead
* Mamba & Elite
* DeathAdder Elite
* Basilisk
#### Mousepads
* Firefly
### Cooler Master
* Masterkeys Pro L, M and S RGB/White
* MK750
* CK372
* CK552
* CK551

### Roccat
#### Keyboards
* Ryos MK FX
#### Mice
* Kone Pure & SE

### SteelSeries
#### Keyboards
* Apex M800
* Apex M750
* Apex M750 TKL
#### Mice
* Rival 600
* Rival 700
* Rival 310
* Rival 300

### Wooting
* One

### Alienware
* All laptop models until AW15 R3/AW17 R4 (AW broke support for per-key RGB)
### Clevo
### AtmoOrb
### Dualshock 4 (PS4 Controller)
### Drevo
* Blademaster
### SoundBlasterX
* Vanguard K08


## Video demonstrations
Dota 2 Demo

[![Dota 2 Demo](http://img.youtube.com/vi/iqwYU-blkhk/0.jpg)](https://www.youtube.com/watch?v=iqwYU-blkhk)

Rocket League Demo

[![Rocket League Demo](http://img.youtube.com/vi/XhXQt0LU520/0.jpg)](https://www.youtube.com/watch?v=XhXQt0LU520)

Grand Theft Auto V Demo

[![Grand Theft Auto V Demo](http://img.youtube.com/vi/irBmmA_ndPY/0.jpg)](https://www.youtube.com/watch?v=irBmmA_ndPY)

Robot Roller-Derby Disco Dodgeball Demo

[![Robot Roller-Derby Disco Dodgeball Demo](http://img.youtube.com/vi/pxx3hqoPFD8/0.jpg)](https://www.youtube.com/watch?v=pxx3hqoPFD8)


## Screenshots
![Desktop Settings](https://puu.sh/tfKzm/1ce3b0cd5c.png)
![Dota 2 Settings](https://puu.sh/tfKNj/98229d2f69.png)
![CSGO Settings](https://puu.sh/tfKRK/61f3bb3757.png)
![GTA 5 Settings](https://puu.sh/tfKWL/d72e10b288.png)
![Rocket League Settings](https://puu.sh/tfL4N/30f5b9cfea.png)
![Payday 2 Settings](https://puu.sh/tfLcn/4978a48199.png)
![Euro Truck Simulator 2 / American Truck Simulator Settings](https://i.imgur.com/oaCpWd0.png)
![Skype Integration Settings](https://puu.sh/tfLfu/57b1df348a.png)


## In-depth features
General

* Display volume percentage on the keyboard
* Display CPU and Memory usage on the keyboard
* Layering system for effects
* Define custom layers with individual effects
* Key selection via freeform region
* Customizable “away from keyboard” effects
* Set global peripheral brightness on the fly without having to leave your game
* Completely turn off peripheral lights after a specific time
* Interactive keyboard effects such as: Key Fade, Key Wave, and Arrow Flow
* Preview lighting effects without having to launch the game
* Simultaneous support for different brands of RGB peripheral devices
* Support for a wide range of models from all the top brands of RGB peripherals
* Support for almost any Logitech LED and Razer Chroma supported games
* Add other programs to define custom lighting layers for daytime and nighttime themes
* Display shortcut keys with Shortcuts Assistant
* Automatic updater
* Ability to select your preferred keyboard layout and brand
* Ability to select your mouse, and it's orientation (left/right handed)
* Import/Export for profile settings
* Customizable gradient layers
* Scripting support for custom lighting effects & custom devices

Dota 2 features

* Team-based background lighting
* Respawn effect
* Killstreak effect
* Health and Mana indicators
* Ability and Item indicators
* Hero ability effects

CS:GO features

* Team-based background lighting
* Health and Ammo indicators
* Bomb effect
* Kill indicators
* Burning and Flashbang effects
* Chat/Console typing keys

Grand Theft Auto V features

* Dynamic background lighting (based on current character or race position)
* Custom police siren effects

Rocket League features

* Team-based background lighting
* Score-split for background effect
* Boost indicator
* Goal Explosions

Overwatch features

* Overwatch effects are controlled by the game itself

Payday 2 features

* Assault-based background lighting effects
* Suspicion background effect
* Player health and ammo indicators

The Division features

* The Division effects are controlled by the game itself

League of Legends features

* League of Legends reacts to player HP, when damaged, healed, or killed.

Hotline Miami features

* Hotline Miami has a slowly alternating color effect.

The Talos Principle features

* The Talos Principle changes color based on the puzzle color you are in.

Borderlands 2 features

* Health and Shield indicators

Minecraft features
* Healthbar
* XP bar
* Armor and hunger bars (not on the default profile but can easily be added)
* Flame effect when player burns
* Raindrops when world is raining
* Background based on time-of-day

Euro Truck Simulator 2 / American Truck Simulator features

* Throttle/braking indicators
* RPM meter
* Blinkers
* Beacons
* Fuel/air pressure indicators
* Ignition indicator

Quantum Conumdrum features

* Changes color based on what dimension you are in.

Move or Die features

* Move or Die effects are controlled by the game itself.

Battlefield 1 features

* Flashes red when you take damage.
* Lights up keybindings.

Dishonored features

* Health and Mana indicators.
* Potion indicators.

The Witcher 3 features

* Current active sign as background.
* Health, Toxicity, and Stamina indicators.

Minecraft features

* Health, hunger, experience, and other indicators
* Day/Night indicator
* Rain and Fire indicator


Killing Floor 2 features

* Killing Floor 2 effects are controlled by the game itself


DOOM features

* DOOM effects are controlled by the game itself


Quake Champions features

* Quake Champions effects are controlled by the game itself


Factorio features

* Factorio effects are controlled by the game itself


Diablo III features

* Diablo III effects are controlled by the game itself


## F.A.Q.
### Can this give me a ban in a video game?
Support for all included games is tested to be sure not to trigger any anti-cheats or produce any suspicious behavior. With that said, the software is to be used at your own risk. We cannot prevent game developers from adding anti-cheats or blocking ways Aurora retrieves information from the game.

### Are you going to support more devices?
Yes, we are going to support anything that has an SDK.

### I can't find an option for my Device in the settings!
Those listed are purely different layouts, if your device is made by a brand that is supported, try selecting a device that has a similar layout to yours and see if that works! If not, check if the integration is connected under 'Device Manager', if you can't get it to connect, check if there is an issue open for your device, if not, feel free to open one.

### Are you going to support more games?
Yes, we will be looking into requested games. You can suggest/request game support  [here](https://github.com/antonpup/Aurora/issues).

### Are you open to doing collaborations with other RGB projects or game companies?
Definitely! If you have a project that you think can fit Aurora, feel free to send me an e-mail.

### I would like to request support for a game, how do I do that?
You can make suggestions by posting an issue [here](https://github.com/antonpup/Aurora/issues), outlining what you would like to request, and I will look over it.

### Some keys in the program state that they are not supported. What does this mean?
It means that changes to those keys are not currently possible. When it's possible to change those keys via SDK, then their support will be added.

### Aurora is constantly crashing! Help!
You can report crashes and other issues on [Github](https://github.com/antonpup/Aurora/issues). Please include a brief explanation of how to reproduce the crash and include the most recent log file. Log files can be located in the "%appdata%/Aurora/Logs" directory, or by going to Settings -> Debug and clicking 'Show Logs Folder'.

### I have found a bug. How do I report it?
You can report bugs here, by creating a new Issue [here](https://github.com/antonpup/Aurora/issues). Before posting an issue, please try and see if there is an issue the same as yours that has already been posted, if not, then feel free to post a new one.

### I wish to expand this, fix bugs, and add my own features.
Feel free to fork this repo and make pull requests with your own code. I am open for suggestions for both features and optimization. :)

### What is the purpose of this utility?
The main goal of Aurora is to allow RGB peripheral devices to work alongside other RGB peripheral devices from other brands. Meaning, if you own a combination of Logitech, Razer, or Corsair peripheral devices, they should be able to work together.

Secondary goal of Aurora is to integrate RGB lighting into popular games. RGB lighting is a nifty feature that is often underused, and as a result gamers with RGB gear are unable to utilize the lighting effects that they paid for.


## Development Team
* [simon-wh](https://github.com/simon-wh) Lead Developer (since May 2017), Developer (July 2016 - May 2017)
* [Antonpup](https://github.com/antonpup) Owner, Lead Developer (until May 2017)

### Minor Announcement

I ([@Antonpup](https://github.com/antonpup)) will no longer be able to develop this project further due to my new future job. I have handed over the project development to [@Simon W](https://github.com/simon-wh). He has access to everything in order to push new updates and upkeep the project. I will keep this project on my Github account, as it is part of my portfolio. I hope you enjoy the work Simon will be putting into this project. Some of you will see my work again in the near future.
## Support the Project

### Contribute
If you're a developer or just a software user you can help the project by:
* [Opening an issue](https://github.com/antonpup/Aurora/issues) to report any bugs you experience (please see if an issue already exists before opening an issue)
* Trying to find where the problem lies with a particular issue (regardless of your skill level, information is always helpful)
* Fixing issues, if you spot an [issue](https://github.com/antonpup/Aurora/issues) you think you can fix, please make a fork and submit a pull request that solves the issue. Any contributions are welcome!
  * Right now we don't have a very fixed code styling due to the amount of inconsistency in the project. At some point I'm going to go through and make it all consistent, but it'll probably be CamelCase or a slight variation of it that'll be used.

### Donations
If you want to help this project rapidly grow, you can donate via PayPal to help further develop Aurora. While being a university student, Aurora does not take my monetary priority. Games and RGB hardware are not cheap, and as a result, support for not owned products will take more time to develop. The donations will be used to purchase hardware and video games with intent to add support for them with Aurora. Alternatively you can gift games directly to me via Steam.

I do not have any intent in charging money for Aurora, it will always be a free and open source project. 

| PayPal                                                       |
| ------------------------------------------------------------ |
| [![](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/SimonWhyte) |

## Credits

* [Newtonsoft.Json](https://github.com/JamesNK/Newtonsoft.Json) - Used for JSON parsing
* [Colore](https://github.com/CoraleStudios/Colore) - Used for Razer suppport
* [CUE.NET](https://github.com/DarthAffe/CUE.NET) - Used for Corsair support
* [Xceed.Wpf.Toolkit](http://wpftoolkit.codeplex.com/) - Used for Color Picker and Integer Up Down controls
* [MouseKeyHook](https://github.com/gmamaladze/globalmousekeyhook) - Used or interactive effects
* [NAudio](https://github.com/naudio/NAudio) - Used for Volume Control
* [Hardcodet.NotifyIcon.Wpf](http://www.hardcodet.net/wpf-notifyicon) - Used for tray icon and windows notificaitons
* [Infragistics.Themes.MetroDark.Wpf](http://www.infragistics.com/community/blogs/blagunas/archive/2013/05/25/free-metro-light-and-dark-themes-for-wpf-and-silverlight-microsoft-controls.aspx) - Used as a base theme
* [Elysium](https://elysium.codeplex.com/) - Used parts of this theme
* [LogiLed2Corsair](https://github.com/VRocker/LogiLed2Corsair) - Used as a resource for Wrappers
* [GSI for Payday 2](https://github.com/simon-wh/PAYDAY-2-GSI) - A GSI mod for Payday 2
* [LightFX Extender](https://github.com/Archomeda/lightfx-extender) - A LightFX wrapped by a friend of mine, used as a resource for LightFX Wrapper.
* [ColorBox](http://colorbox.codeplex.com/) - Used for gradient editor/picker. This repo contains a modified version of ColorBox, to suit Aurora's needs a bit more.
* [SharpDX](http://sharpdx.org/) - Used for Raw Input for nonblocking input reading for key binds and interactive effects


## Special thanks to these people:
### Contributions
Thanks to all the brilliant people that made contributions to this project. See everyone [here](https://github.com/antonpup/Aurora/graphs/contributors)

### Testing
* Casper
* dirty_thomas
* Dustmuffins
* eMJay
* FarmeZZ
* Firewall
* LASTBULLET_ZEROALIAS
* KensonN
* Melantrix
* Mice
* NurisH
* Podgy
* Raushen
* Steven-O-kun
* System Overlord
* Tatsuto
* ThirdEyeOpen
* Trickster79
* twitch.tv/fearsc | Faceit.com
* Warblade
`
  },
  {
    id: "196316990",
    name: "fusion-kbd-controller.git",
    description: "Controller tool for aero 15x keyboard backlight.",
    language: "C",
    updatedAt: "2019-07-11",
    readmeContent: `# fusion-kbd-controller

This project is a tiny userspace binary, allowing you to configure the RGB Fusion keyboard of
the gigabyte AERO 15X when running linux.

## Current state

It's working (at least on my AERO 15X), but far from complete.
At the moment there is no CLI or support for d-bus etc.

Root privileges are required, since the tool has to temporarily unbind the USB device from the kernel module.
This tool uses libusb to communicate with the keyboard.

## Disclaimer

It's possible to brick your keyboard when sending bogus values here.
You should be safe when using the high level \`set_mode\` and \`set_custom_mode\` functions.

## Compiling

You need libusb and (on debian/fedora however) libusb-dev.
Afterwards compile with:

\`gcc main.c $(pkg-config --libs --cflags libusb-1.0)\`
`
  }
];
