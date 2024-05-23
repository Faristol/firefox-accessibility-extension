[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U0XZDPY)
<h1 align="center">
  <img src="https://github.com/Faristol/firefox-accessibility-extension/blob/main/accessibility_extension/icons/eye128.png?raw=true" alt="icon" style="width: 128px; height: 128px"><br>
  IncluVision
</h1>
<div align="center">
<img src="https://github.com/Faristol/firefox-accessibility-extension/blob/main/screenshots/screenshot_1.png?raw=true" alt="img" style=" height: 500px">
<img src="https://github.com/Faristol/firefox-accessibility-extension/blob/main/screenshots/screenshot_2.png?raw=true" alt="img" style=" height: 500px">
</div>

## Description

This extension acts as a **multipurpose accessibility extension**, these are the features it handles:

- Changes the **size** and **weight** of the text
- Add **contrast**
- **Invert colors**
- Changes the **font** (Arial, OpenDyslexic, Atkinson Hyperlegible)
- **Reproduce** the text of the page with and without summarization. The extension incorporates an **AI summarization model called BART**
- Incorpores a **adblocker** with a 97% of effectiveness

# Installation

You can download it from the firefox marketplace or run it locally:

To load the extension:

1. Download the `accessibility_extension` directory
2. Enter the URL `about:debugging#/runtime/this-firefox` in your firefox browser.
3. Click on `Load Temporary Add-on`.
4. Select the `manifest.json` file.
5. Press `Reload`.

## To run the AI summarize model:

**Prerequisites**: you need Docker installed in your system and enough space to accommodate a Docker image that weighs around 25GB

### To deploy it **locally**:

1. Download the `sumup` directory only with the `sumup_local.py` and the `Dockerfile`.
2. Open the `Dockerfile` and modify the last line to:
   `CMD ["python3","sumup_local.py"]`
3. Create a file named `url_key.json` in the `accessibility_extension` directory and add the following content:

```
{
    "API_URL":"http://127.0.0.1:5000/sumup",
    "API_KEY":"null"
}

```

Also, in the `sumup` function, remove `"x-api-key": API_KEY` from the headers. 
4. Finally, execute the following commands:

```
cd sumup
sudo docker build -t bart .
sudo docker run -it -d --name bart_container -p 5000:5000 bart

```

5. To test the local deployment, execute:

```
curl -X POST http://127.0.0.1:5000/sumup -H "Content-Type: application/json" -d '{"text":"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}'


```

### To deploy it **remotely**:

Also, if u want to run it remotely, you need to generate a secure API_KEY, and follow these steps:

1. Download the `sumup` directory only with the `sumup_vm.py` and the `Dockerfile`.
2. In the `sumup` directory, create a file called `.env`, and inside write: `API_KEY=your_api_key`
3. Create a file named `url_key.json` in the `accessibility_extension` directory and add the following content:

```
{
    "API_URL":"http://YOUR_SERVER_IP:5000/sumup",
    "API_KEY":"YOUR_API_KEY"
}

```

4. Finally execute the following commands:

```
cd sumup
sudo docker build -t bart .
sudo docker run -it -d --name bart_container --env-file .env -p 5000:5000 bart

```

5. To test the remote deployment, execute:

```
curl -X POST http://YOUR_SERVER_IP:5000/sumup -H "Content-Type: application/json" -H "x-api-key: YOUR_API_KEY" -d '{"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}'
```
## Notes

You've encountered some issues with the extension on Linux:

* When applying contrast, particularly on pages like Wikipedia, a manual refresh is necessary. Otherwise, while the background color changes to black, the text remains unaffected and doesn't switch to white.
* The pause and resume buttons aren't functional. These buttons trigger the pause() and resume() functions, both of which are related to speechSynthesis.

Additionally, it's worth noting that the extension works fine on Windows.

## Help

If need some help or find some bugs, contact : faristol.dev@gmail.com
