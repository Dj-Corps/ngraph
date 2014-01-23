module.exports.main = function () {
  var graph = require('ngraph.graph')();

  // first initialize 3d ngraph.three renderer:
  var threeGraphics = require('ngraph.three')(graph, {
    interactive: false,
    canvas: document.getElementById('three')
  });

  // tell it we want custom UI:
  threeGraphics.createNodeUI(require('./lib/threeNode'))
               .createLinkUI(require('./lib/threeLink'));

  addLights(threeGraphics.scene); // add direction lights to 3d scene

  // now intiialize 2d ngrpah.fabric renderer in its own canvas:
  var fabricGraphics = require('ngraph.fabric')(graph, {
    layout: threeGraphics.layout, // reuse the same layout instance
    canvas: require('./lib/createFabricCanvas')('fabric')
  });

  // Tell fabric we also want custom layout:
  fabricGraphics.createNodeUI(require('./lib/fabricNode'))
                .createLinkUI(require('./lib/fabricLink'))
                .renderNode(require('./lib/renderFabricNode'))
                .renderLink(require('./lib/renderFabricLink'))
  fabricGraphics.zoom(0, 0, 0.3);

  require('./lib/animateGraph').animate(graph); // begin graph modification
  animate(); // start animation loop


  function animate() {
    requestAnimationFrame(animate);

    threeGraphics.layout.step();     // update layout
    threeGraphics.renderOneFrame();  // render 3d graph
    fabricGraphics.renderOneFrame(); // render 2d graph

    rotateCamera(); // just for fun, rotate 3d camera
  }

  function rotateCamera() {
    var camera = threeGraphics.camera;
    var scene = threeGraphics.scene;
    var timer = Date.now() * 0.0002;
    camera.position.x = Math.cos(timer) * 1500;
    camera.position.z = Math.sin(timer) * 1500;
    camera.lookAt(scene.position);
  }

  function addLights(scene) {
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, -1).normalize();
    scene.add(directionalLight);
  }
}