/**
* Class representing the zoom lens.
* the class targets the Image and the Zoom react component.
*/
class ImageZoomer {
  constructor () {
    this._target = document.querySelector('.Image__target');
    this.element = document.querySelector('.Zoom');
    this.canvas = document.querySelector('.Zoom__canvas');
    this.context = this.canvas.getContext('2d');

    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.update = this.update.bind(this);
    this.onResize = this.onResize.bind(this);

    this.targetBCR = null;
    this.zoomed = 0;
    this.targetZoomed = 0;

    this.x = 0;
    this.y = 0;
    this.trackingTouch = false;
    this.scheduledUpdate = false;

    this.initCanvas();
    this._addEventListeners();
    this.onResize();

    requestAnimationFrame(this.update);
  }

  /**
  * initialize the canvas.
  * set the device pixel ratio, width and height.
  */
  initCanvas () {
    const width = 128;
    const height = 128;
    const dPR = window.devicePixelRatio || 1;

    this.canvas.width = width * dPR;
    this.canvas.height = height * dPR;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.context.scale(dPR, dPR);
  }

  /**
  * get the new bounding rect
  * based on the new size
  */
  onResize () {
    this.targetBCR = this._target.getBoundingClientRect();
  }

  /**
  * show the lens based on the cursor position.
  * 
  */
  onStart (evt) {
    this.targetBCR = this._target.getBoundingClientRect();

    if (evt.target !== this._target)
      return;

    this.x = evt.pageX || evt.touches[0].pageX;
    this.y = evt.pageY || evt.touches[0].pageY;

    evt.preventDefault();
    this.trackingTouch = true;

    this.targetZoomed = 1;
    requestAnimationFrame(this.update);
  }

  /**
  * update the cursor x and y coordinates
  * 
  */
  onMove (evt) {
    if (!this.trackingTouch)
      return;

    this.x = evt.pageX || evt.touches[0].pageX;
    this.y = evt.pageY || evt.touches[0].pageY;

  }

  /**
  * remove the lens.
  * 
  */
  onEnd () {
    this.trackingTouch = false;
    this.targetZoomed = 0;
  }

  /**
  * update the content shown through the lens.
  * 
  */
  update () {

    const TAU = Math.PI * 2;
    const MAX_RADIUS = 46;
    const radius = this.zoomed * MAX_RADIUS;

    const targetX = (this.x - this.targetBCR.left) / this.targetBCR.width;
    const targetY = (this.y - this.targetBCR.top) / this.targetBCR.height;
    const imageScale = 3;
    const scaledTargetWidth = this.targetBCR.width * imageScale;
    const scaledTargetHeight = this.targetBCR.height * imageScale;
    const glassyGlow = this.context.createRadialGradient(64, 64, 64, 64, 64, 0);
    glassyGlow.addColorStop(0, 'rgba(255,255,255,0.5)');
    glassyGlow.addColorStop(0.5, 'rgba(255,255,255,0)');

    // Shadow.
    this.context.shadowColor = 'rgba(0,0,0,0.4)';
    this.context.shadowBlur = 12;
    this.context.shadowOffsetY = 8;

    // Background.
    this.context.clearRect(0, 0, 128, 128);
    this.context.fillStyle = '#FFFFFF';
    this.context.beginPath();
    this.context.arc(64, 110 - radius, radius, 0, TAU);
    this.context.closePath();
    this.context.fill();

    // Zoomed image.
    this.context.save();
    this.context.beginPath();
    this.context.arc(64, 110 - (radius + 1), radius * 1.03, 0, TAU);
    this.context.clip();
    this.context.closePath();
    this.context.drawImage(this._target,
        -targetX * scaledTargetWidth + 64, -targetY * scaledTargetHeight + 64,
        scaledTargetWidth,
        scaledTargetHeight);
    this.context.restore();

    // Glassy glow.
    this.context.fillStyle = glassyGlow;
    this.context.beginPath();
    this.context.arc(64, 110 - radius, Math.max(0, radius - 2), 0, TAU);
    this.context.closePath();
    this.context.fill();

    // Position the parent element.
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

    // Update the zoom value.
    this.zoomed += (this.targetZoomed - this.zoomed) / 3;

    // Schedule another update if the zoom is fairly non-zero.
    if (this.zoomed > 0.001) {
      requestAnimationFrame(this.update);
    } else {
      this.zoomed = 0;
    }
  }

  /**
  * set the event listener.
  * 
  */
  _addEventListeners () {
    document.addEventListener('touchstart', this.onStart);
    document.addEventListener('touchmove', this.onMove);
    document.addEventListener('touchend', this.onEnd);

    document.addEventListener('mousedown', this.onStart);
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onEnd);
    window.addEventListener('resize', this.onResize);
  }
}

export default ImageZoomer;

