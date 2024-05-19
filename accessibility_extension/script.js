(() => {
  // localStorage.getItem("fontsize") ? changeProperty(localStorage.getItem("fontsize")) : "";
  // localStorage.getItem("contrast") ? changeProperty("contrast") : "";
  // localStorage.getItem("bold") ? changeProperty("bold") : "";
  // console.log("Extension loaded");
  // console.log(localStorage.getItem("fontsize"));
  // console.log(localStorage.getItem("contrast"));
  // console.log(localStorage.getItem("bold"));
  if (window.hasRun) {
    return;
  } else {
    window.hasRun = true;
    console.log("window.has run trueeee");
    console.log(localStorage);
    console.log(localStorage.getItem("fontsize-extension-accessibility"));
    if (localStorage.getItem("fontsize-extension-accessibility")) {
      changeProperty(localStorage.getItem("fontsize-extension-accessibility"));
    }
    if (localStorage.getItem("contrast-extension-accessibility")) {
      changeProperty("contrast");
    }
    if (localStorage.getItem("bold-extension-accessibility")) {
      changeProperty("bold");
    }
  }

  const SIZES = [
    "small",
    "medium",
    "large",
    "x-large",
    "xx-large",
    "xxx-large",
  ];
  browser.runtime.onMessage.addListener((message) => {
    const keys = Object.keys(message);
    switch (true) {
      case keys.includes("fontsize"):
        if (message.fontsize === "reset") {
          resetProperty("font-size");
          break;
        }
        changeProperty(message.fontsize);
        break;
      case keys.includes("contrast"):
        if (message.contrast === "reset") {
          resetProperty("contrast");
          break;
        }
        changeProperty(message.contrast);
        break;

      case keys.includes("bold"):
        if (message.bold === "reset") {
          resetProperty("bold");
          break;
        }
        changeProperty(message.bold);
        break;
      case keys.includes("action"):
        if (message.action === "play") {
          sumup();
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
        textToSpeech(summary);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function textToSpeech(text, rate = 0.8, volume = 1, pitch = 1) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate; // Velocidad del habla
    utterance.volume = volume; // Volumen del habla
    utterance.pitch = pitch; // Tono del habla

    // Obtener una voz específica (opcional)
    let voices = window.speechSynthesis.getVoices();
    utterance.voice = voices[3]; // Selecciona la primera voz disponible

    speechSynthesis.speak(utterance);
  }
  function changeProperty(cssClass) {
    let elements = document.querySelectorAll("*");

    for (let i = 0; i < elements.length; i++) {
      //es comprova si la classe correspon als sizes, si correspon
      //vegem si ja existeix una classe de tipo size

      if (SIZES.includes(cssClass)) {
        if (SIZES.some((size) => elements[i].classList.contains(size))) {
          SIZES.forEach((size) => {
            if (elements[i].classList.contains(size)) {
              elements[i].classList.remove(size);
            }
          });
        }
      }

      elements[i].classList.add(cssClass);
    }
    if (cssClass === "contrast") {
      localStorage.setItem("contrast-extension-accessibility", cssClass);
    } else if (cssClass === "bold") {
      localStorage.setItem("bold-extension-accessibility", cssClass);
    } else if (SIZES.includes(cssClass)) {
      localStorage.setItem("fontsize-extension-accessibility", cssClass);
    }
  }

  function resetProperty(property) {
    let elements = document.querySelectorAll("*");
    for (let i = 0; i < elements.length; i++) {
      switch (property) {
        case "font-size":
          SIZES.forEach((size) => {
            if (elements[i].classList.contains(size)) {
              elements[i].classList.remove(size);
            }
          });
          break;
        case "contrast":
        case "bold":
          if (elements[i].classList.contains(property)) {
            elements[i].classList.remove(property);
          }
          break;
      }
    }
    switch (property) {
      case "font-size":
        localStorage.removeItem("fontsize-extension-accessibility");
        break;
      case "contrast":
        localStorage.removeItem("contrast-extension-accessibility");
        break;
      case "bold":
        localStorage.removeItem("bold-extension-accessibility");
        break;
    }
  }
})();
