let memeEditor = {
  image: new Image(),
  originalWidth: 0,
  originalHeight: 0,
  canvas: null,
  ctx: null,

  init: function () {
    this.canvas = document.getElementById("meme-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.addImageInputListener();
    this.addSaveButtonListener();
    this.addTextControlListeners();
  },
  addImageInputListener: function () {
    document.getElementById("image-input").addEventListener("change", (event) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image.onload = () => {
          this.setCanvasSize();
          this.updateMeme();
        };
        this.image.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    });
  },
  setCanvasSize: function () {
    this.originalWidth = this.image.width;
    this.originalHeight = this.image.height;
    const displayWidth = Math.min(this.image.width, window.innerWidth);
    const scaleFactor = displayWidth / this.image.width;
    this.canvas.width = displayWidth;
    this.canvas.height = this.image.height * scaleFactor;
  },

  updateMeme: function (canvas = this.canvas, ctx = this.ctx, forSaving = false) {
    if (!forSaving) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    }
    this.drawText(
      canvas,
      ctx,
      "top-text",
      "top-text-color",
      "top-text-size",
      "top-font-family",
      "top-font-weight",
      "top-text-x",
      "top-text-y"
    );
    this.drawText(
      canvas,
      ctx,
      "bottom-text",
      "bottom-text-color",
      "bottom-text-size",
      "bottom-font-family",
      "bottom-font-weight",
      "bottom-text-x",
      "bottom-text-y"
    );
  },

  drawText: function (
    canvas,
    ctx,
    textId,
    colorId,
    sizeId,
    familyId,
    weightId,
    positionXId,
    positionYId
  ) {
    const text = document.getElementById(textId).value;
    const color = document.getElementById(colorId).value;
    const fontSize = parseInt(document.getElementById(sizeId).value, 10);
    const fontFamily = document.getElementById(familyId).value;
    const fontWeight = document.getElementById(weightId).value;
    const textX = canvas.width * (parseInt(document.getElementById(positionXId).value, 10) / 100);
    const textY = canvas.height * (parseInt(document.getElementById(positionYId).value, 10) / 100);

    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, textX, textY);
  },

  addSaveButtonListener: function () {
    document.getElementById("save-btn").addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = this.originalWidth;
      canvas.height = this.originalHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
      this.updateMeme(canvas, ctx, true); // true указывает на то, что это для сохранения

      const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "my-meme.png";
      link.href = image;
      link.click();
    });
  },

  addTextControlListeners: function () {
    const controls = [
      "top-text",
      "top-text-color",
      "top-text-size",
      "top-font-family",
      "top-font-weight",
      "top-text-x",
      "top-text-y",
      "bottom-text",
      "bottom-text-color",
      "bottom-text-size",
      "bottom-font-family",
      "bottom-font-weight",
      "bottom-text-x",
      "bottom-text-y",
    ];
    controls.forEach((control) => {
      document.getElementById(control).addEventListener("input", () => {
        this.updateMeme();
      });
    });
  },
};

memeEditor.init();
