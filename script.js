var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;
var text;

function init() {
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  resizeCanvas();

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // 🖕 Middle finger images (controlled count & size)
  for (var i = 0; i < 30; i++) {
    var mf = new createjs.Bitmap("middlefinger.png");

    mf.y = -100;
    mf.x = Math.random() * canvas.width;

    mf.scaleX = mf.scaleY = Math.random() * 0.2 + 0.1;
    mf.alpha = Math.random() * 0.7 + 0.3;

    container.addChild(mf);
  }

  // 📱 Responsive Text
  var fontSize = Math.max(36, Math.floor(window.innerWidth / 12));

  text = new createjs.Text(
    "For My Close One",
    "bold " + fontSize + "px Arial",
    "#ff0040"
  );

  text.textAlign = "center";
  text.textBaseline = "middle";
  text.x = canvas.width / 2;
  text.y = canvas.height / 2;
  text.shadow = new createjs.Shadow("#000", 2, 2, 10);

  stage.addChild(text);

  // Motion blur containers
  captureContainers = [];
  for (var i = 0; i < 80; i++) {
    var cc = new createjs.Container();
    cc.cache(0, 0, canvas.width, canvas.height);
    captureContainers.push(cc);
  }

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (text) {
    var fontSize = Math.max(36, Math.floor(window.innerWidth / 12));
    text.font = "bold " + fontSize + "px Arial";
    text.x = canvas.width / 2;
    text.y = canvas.height / 2;
  }

  stage.update();
}

function tick(event) {
  var w = canvas.width;
  var h = canvas.height;
  var l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);

  var cc = captureContainers[captureIndex];
  stage.addChildAt(cc, 0);
  cc.addChild(container);

  for (var i = 0; i < l; i++) {
    var mf = container.getChildAt(i);

    if (mf.y < -50) {
      mf._x = Math.random() * w;
      mf.y = h * (1 + Math.random()) + 50;

      mf.perX = (1 + Math.random() * 2) * h;
      mf.offX = Math.random() * h;
      mf.ampX = mf.perX * 0.1 * (0.15 + Math.random());

      mf.velY = -Math.random() * 1 - 0.5;
      mf._rotation = Math.random() * 40 - 20;
    }

    var angle = (mf.offX + mf.y) / mf.perX * Math.PI * 2;

    mf.y += mf.velY;
    mf.x = mf._x + Math.cos(angle) * mf.ampX;
    mf.rotation = mf._rotation + Math.sin(angle) * 30;
  }

  cc.updateCache("source-over");
  stage.update(event);
}

init();
