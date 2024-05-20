const SIZES = ["small", "medium", "large", "x-large", "xx-large", "xxx-large"];
const FONTS = ["arial", "opendyslexic", "hyperlegible"];
const STYLES = ["fontsize", "contrast", "bold", "invert", "fontfamily"];
let utterance = null;
let synth = window.speechSynthesis
/*
->FUNCTIONS THAT OPERATES WITH THE FIREFOX STORAGE (read,write,remove)
->INITIAL CALL TO READ THE LOCAL STORAGE AND ADD THE STYLES STORED TOT THE CURRENT PAGE
->FUNCTION THAT LISTENS MESSAGES FROM THE POPUP AND APPLIES THE SYLES OR REMOVE THEM
  ->AUX FUNCTIONS CALLED IN THE LISTENER GENERAL FUNCTION
*/
const readLocalStorage = async (keys) => {
  return new Promise((resolve, reject) => {
    browser.storage.sync.get(keys, function (result) {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError);
      } else {
        resolve(result);
      }
    });
  });
};



const writeLocalStorage = async (key, value) => {
  return new Promise((resolve, reject) => {
    browser.storage.sync.set({ [key]: value }, function () {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};
const removeLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    browser.storage.sync.remove(key, function () {
      if (browser.runtime.lastError) {
        reject(browser.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
};
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", afterDOMLoaded);
} else {
  afterDOMLoaded();
  appendFonts();
}
function appendFonts() {
  const fontUrlDyslexic = browser.runtime.getURL(
    "fonts/opendyslexic-regular.ttf"
  );
  const styleDyslexic = document.createElement("style");
  styleDyslexic.textContent = `
  @font-face {
    font-family: 'opendyslexic';
    src: url('${fontUrlDyslexic}');
    font-weight: normal;
    font-style: normal;
  }
`;
  document.head.appendChild(styleDyslexic);

  const fontUrlHyperlegible = browser.runtime.getURL(
    "fonts/hyperlegible-regular.ttf"
  );
  const styleHyperlegible = document.createElement("style");
  styleHyperlegible.textContent = `
  @font-face {
    font-family: 'hyperlegible';
    src: url('${fontUrlHyperlegible}');
    font-weight: normal;
    font-style: normal;
  }`;
  document.head.appendChild(styleHyperlegible);
}
async function afterDOMLoaded() {
  let styles = await readLocalStorage([
    "fontsize",
    "contrast",
    "bold",
    "invert",
    "fontfamily",
  ]);
  for (values in styles) {
    changeProperty(styles[values]);
  }
}

browser.runtime.onMessage.addListener((message) => {
  //isn't necessary make a loop for each key, cause there is only one
  const keys = Object.keys(message);
  const value = message[keys[0]];
  //if user press play, stop ... handle it different
  //summary text with AI
  if (keys[0] === "action_ai") {
    switch (value) {
      case "play":
        const text = extractText();
        sumup(text);
        utterancePlay(text);
        break;
      case "pause":
        if (utterance) {
          synth.pause();
          //functions pause and resume don't work in linux
        }

        break;
      case "resume":
        if (utterance) {
          synth.resume();
        }

        break;
      case "cancel":
        if (utterance) {
          synth.cancel();
          utterance = null;
        }
        break;
    }
    return;
  }
  //reproduce normal text
  if (keys[0] === "action") {
    switch (value) {
      case "play":
        const text = extractText();
        utterancePlay(text);
        break;
      case "pause":
        if (utterance) {
          synth.pause();
        }
        break;
      case "resume":
        if (utterance) {
          synth.resume();
        }
        break;
      case "cancel":
        if (utterance) {
          synth.cancel();
          utterance = null;
        }
        break;
    }

    return;
  }
  //reset style
  if (value === "reset") {
    resetProperty(keys[0]);
    removeLocalStorage(keys[0]);
    //window.location.reload();
    return;
  }
  //apply some style
  //in some pages like wikipedia, we need to reload the page to apply contrast.

  changeProperty(value);
  writeLocalStorage(keys[0], value);
  //window.location.reload();
});
function extractText() {
  let text = document.querySelector("body").innerText;
  return text.trim().replace(/\s+/g, " ");
}

function utterancePlay(text) {
  utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = 0.7;
  utterance.rate = 0.8;
  utterance.pitch = 1;
  const voices = synth.getVoices();
  const pageLang = document.documentElement.lang;
  const voice = voices.find((voice) => {
    const regex = new RegExp(pageLang, "i");
    return voice.lang.match(regex);
  });
  if (voice) {
    utterance.voice = voice;
    synth.speak(utterance);
  } else {
    console.log("No voice found for", pageLang);
    utterance.voice = synth.getVoices()[0];
    synth.speak(utterance);
  }
}
function sumup(text) {
  const url = "http://127.0.0.1:5000/sumup";
  let payload = {
    text: text,
  };
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  fetch(url, requestOptions)
    .then((response) => {
      if (!response.ok) {
        console.error("Error:", response.status, response.statusText);
        throw new Error("Request failed");
      }
      return response.json();
    })
    .then((data) => {
      const summary = data.summary;
      return summary;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function changeProperty(cssClass) {
  let elements = document.querySelectorAll("*");
  for (let i = 0; i < elements.length; i++) {
    if (SIZES.includes(cssClass)) {
      if (SIZES.some((size) => elements[i].classList.contains(size))) {
        SIZES.forEach((size) => {
          if (elements[i].classList.contains(size))
            elements[i].classList.remove(size);
        });
      }
    }

    if (FONTS.includes(cssClass)) {
      if (FONTS.some((font) => elements[i].classList.contains(font))) {
        FONTS.forEach((font) => {
          if (elements[i].classList.contains(font))
            elements[i].classList.remove(font);
        });
      }
    }
    elements[i].classList.add(cssClass);
  }
}

function resetProperty(property) {
  let elementsToUpdate = {
    fontsize: document.querySelectorAll(
      ".small, .medium, .large, .x-large, .xx-large, .xxx-large"
    ),
    contrast: document.querySelectorAll(".contrast"),
    bold: document.querySelectorAll(".bold"),
    invert: document.querySelectorAll(".invert"),
    fontfamily: document.querySelectorAll(
      ".arial, .opendyslexic, .hyperlegible"
    ),
  };
  const elements = elementsToUpdate[property];
  if (!elements) return;
  elements.forEach((element) => {
    if (property === "fontsize") {
      SIZES.forEach((size) => {
        if (element.classList.contains(size)) element.classList.remove(size);
      });
      return;
    }
    if (property === "fontfamily") {
      FONTS.forEach((font) => {
        if (element.classList.contains(font)) element.classList.remove(font);
      });
      return;
    }
    element.classList.remove(property);
  });
}
