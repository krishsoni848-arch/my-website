var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;

function init() {
  canvas = document.getElementById("testCanvas");
  stage = new createjs.Stage(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var w = canvas.width;
  var h = canvas.height;

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  // 🔥 Middle finger images create karo
  for (var i = 0; i < 80; i++) {
    var mf = new createjs.Bitmap("middlefinger.png");

    mf.y = -100;
    mf.x = Math.random() * w;

    mf.scaleX = mf.scaleY = Math.random() * 0.4 + 0.2;
    mf.alpha = Math.random() * 0.8 + 0.2;

    container.addChild(mf);
  }

  // 🖕 Text (optional – change/remove if you want)
  var text = new createjs.Text(
    "I don't care anymore 😎",
    "bold 28px Arial",
    "#ff0040"
  );
  text.textAlign = "center";
  text.x = w / 2;
  text.y = h / 2;
  stage.addChild(text);

  for (var i = 0; i < 100; i++) {
    var captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, w, h);
    captureContainers.push(captureContainer);
  }

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);
}

function tick(event) {
  var w = canvas.width;
  var h = canvas.height;
  var l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);

  var captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 0);
  captureContainer.addChild(container);

  for (var i = 0; i < l; i++) {
    var mf = container.getChildAt(i);

    if (mf.y < -50) {
      mf._x = Math.random() * w;
      mf.y = h * (1 + Math.random()) + 50;

      mf.perX = (1 + Math.random() * 2) * h;
      mf.offX = Math.random() * h;
      mf.ampX = mf.perX * 0.1 * (0.15 + Math.random());

      mf.velY = -Math.random() * 2 - 1;
      mf._rotation = Math.random() * 40 - 20;

      mf.alpha = Math.random() * 0.8 + 0.2;
    }

    var angle = (mf.offX + mf.y) / mf.perX * Math.PI * 2;

    mf.y += mf.velY;
    mf.x = mf._x + Math.cos(angle) * mf.ampX;
    mf.rotation = mf._rotation + Math.sin(angle) * 30;
  }

  captureContainer.updateCache("source-over");
  stage.update(event);
}

init();
