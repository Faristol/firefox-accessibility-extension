(() => {
  if (window.hasRun) {
    return;
  } else {
    window.hasRun = true;
    let originalProperties = mappingElements();
    localStorage.setItem(
      "originalProperties",
      JSON.stringify(originalProperties)
    );
  }

  browser.runtime.onMessage.addListener((message) => {
    const keys = Object.keys(message);
    switch (true) {
      case keys.includes("fontsize"):
        if (message.fontsize === "reset") {
          resetProperty("font-size");
          break;
        }
        changeProperty("font-size", message.fontsize);
        break;
      case keys.includes("contrast"):
        if (message.contrast === "reset") {
          resetProperty("color");
          resetProperty("background-color");
          break;
        }
        changeProperty("color", "white");
        changeProperty("background-color", "black");
        break;

      case keys.includes("bold"):
        if (message.bold === "reset") {
          resetProperty("font-weight");
          break;
        }
        changeProperty("font-weight", message.bold);
        break;
      case keys.includes("action"):
        if (message.action === "play") {
          let summarizedText = sumup();
        } else if (message.action === "pause") {
        } else if (message.action === "stop") {
        }
        break;
    }
  });
  function extractText() {
    let text = document.querySelector("body").innerText;
    return text.trim().replace(/\s+/g, " ");
  }
  function sumup() {
    let text = extractText();
    console.log("Text:", text);
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
          throw new Error("La solicitud falló");
        }
        return response.json();
      })
      .then((data) => {
        // Obtiene el resumen de la respuesta JSON
        const summary = data.summary;
        console.log("Resumen obtenido:", summary);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function textToSpeech() {
    let text =
      document.querySelector("body").innerText ||
      document.querySelector("body").innerContent;
    let utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  }
  function changeProperty(property, value) {
    let elements = document.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.setProperty(property, value, "important");
    }
  }

  function resetProperty(property) {
    let originalProperties = JSON.parse(
      localStorage.getItem("originalProperties")
    );
    let elements = document.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      switch (true) {
        case property === "font-size":
          if (originalProperties[i].element === elements[i].nodeName) {
            elements[i].style.setProperty(
              "font-size",
              originalProperties[i].fontsize,
              "important"
            );
          }
          break;
        case property === "color":
          if (originalProperties[i].element === elements[i].nodeName) {
            elements[i].style.setProperty(
              "color",
              originalProperties[i].color,
              "important"
            );
            break;
          }
        case property === "background-color":
          if (originalProperties[i].element === elements[i].nodeName) {
            elements[i].style.setProperty(
              "background-color",
              originalProperties[i].backgroundcolor,
              "important"
            );
          }
          break;
        case property === "font-weight":
          if (originalProperties[i].element === elements[i].nodeName) {
            elements[i].style.setProperty(
              "font-weight",
              originalProperties[i].fontweight,
              "important"
            );
          }
          break;
      }
    }
  }

  function mappingElements() {
    let elements = document.querySelectorAll("*");
    let originalProperties = [];
    for (let i = 0; i < elements.length; i++) {
      let style = window.getComputedStyle(elements[i]);
      originalProperties.push({
        element: elements[i].nodeName,
        fontsize: style.getPropertyValue("font-size"),
        fontweight: style.getPropertyValue("font-weight"),
        backgroundcolor: style.getPropertyValue("background-color"),
        color: style.getPropertyValue("color"),
      });
    }
    return originalProperties;
  }
})();
