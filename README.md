
# Accessibility extension for firefox

## Description

This extension acts as a **multipurpose accessibility extension**, these are the features it handles:


* Changes the **size** and **weight** of the text
* Add **contrast**
* **Invert colors**
* Changes the **font** (Arial, OpenDyslexic, Atkinson Hyperlegible)
* **Reproduce** the text of the page with and without summarization. The extension incorporates an **AI summarization model called BART**
* Incorpores a **adblocker** with a 96% of effectiveness
# Installation
## You can download it from the firefox marketplace.

## To run it locally: 

To load the extension:
1. Enter the URL `about:debugging#/runtime/this-firefox` in your firefox browser.
2. Click on "Load Temporary Add-on".
3. Select the `manifest.json` file.
4. Press "Refresh".

## To run the AI summarize model (bart):

**Prerequisites**: you need Docker installer in your system and enough space to accommodate a Docker image that weighs around 25GB

Download the **sumup** directory and execute the following commands:
```
cd sumup
sudo docker build -t bart
docker run -it -d --name bart_container -p 5000:5000 bart

```
Once you have done this, your model will run automatically.


## Help

If need some help or find some bugs, contact : faristol.dev@gmail.com

