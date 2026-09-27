import * as pc from 'playcanvas';

const appRoot = document.querySelector('#app')!;
const canvas = document.createElement('canvas');
canvas.id = 'agent-canvas';
canvas.style.width = '100vw';
canvas.style.height = '70vh';
canvas.style.display = 'block';
appRoot.appendChild(canvas);

const app = new pc.Application(canvas, {
  graphicsDeviceOptions: { antialias: true }
});
app.start();
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

const camera = new pc.Entity('Camera');
camera.addComponent('camera', { clearColor: new pc.Color(0.04, 0.04, 0.05) });
camera.setPosition(0, 1.5, 4);
app.root.addChild(camera);

const light = new pc.Entity('Light');
light.addComponent('light', { type: 'directional', intensity: 1.2 });
light.setEulerAngles(35, 25, 0);
app.root.addChild(light);

const status = document.createElement('p');
status.textContent = 'AI 3D Agent — PlayCanvas Engine conectado.';
appRoot.appendChild(status);
