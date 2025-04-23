# WatchBee
A self-hosted media tracker for movies and TV shows. Search, explore recommendations, browse categories, check out upcoming releases, and stay on top of what you're watching.

### ⚙️ Environment variables

| Name           | Notes                                                                                                                            |
|----------------|----------------------------------------------------------------------------------------------------------------------------------|
| ACCESS_TOKEN   | API token for The Movie Database                                                                                                 |
| REGION         | Default to `no`, uses a language code with ISO 3166 1 e.g `GB`                                                                   |
| LANGUAGE       | Default to `en-US`, uses a language code with ISO 639-1 e.g `en`, for more specific add country code with ISO 3166-1 e.g `en-US` |
| ORIGINAL_TITLE | Default to `false`, set to `True` to show the original titles for movies and TV shows                                            |
| INCLUDE_ADULT  | Default to `false`, set to `True` to include adult content in movies and TV shows searches                                       |

