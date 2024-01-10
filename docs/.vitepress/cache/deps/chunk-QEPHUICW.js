import {
  CreateGround,
  CreateTorus,
  Mesh,
  PassPostProcess,
  Ray,
  StandardMaterial,
  TransformNode
} from "./chunk-X3GGEY53.js";
import {
  BezierCurve
} from "./chunk-SDHG362Y.js";
import {
  Camera,
  Engine,
  EventConstants,
  ImageProcessingConfiguration,
  InternalTexture,
  InternalTextureSource,
  IsWindowObjectExist,
  KeyboardEventTypes,
  Logger,
  Node,
  PointerEventTypes,
  PostProcess,
  PrecisionDate,
  RenderTargetTexture,
  Scene,
  SceneComponentConstants,
  ShaderStore,
  StringDictionary,
  Texture,
  ThinEngine,
  Tools,
  UniformBuffer,
  WebGLHardwareTexture,
  WebRequest
} from "./chunk-VAZZWHD2.js";
import {
  ArrayTools,
  Axis,
  Color3,
  Color4,
  Coordinate,
  Epsilon,
  Frustum,
  Matrix,
  Observable,
  Plane,
  Quaternion,
  RegisterClass,
  Scalar,
  SerializationHelper,
  Size,
  Space,
  TmpVectors,
  Vector2,
  Vector3,
  Viewport,
  __decorate,
  serialize,
  serializeAsMeshReference,
  serializeAsVector2,
  serializeAsVector3
} from "./chunk-ZYQT2WB4.js";

// node_modules/@babylonjs/core/Cameras/Inputs/BaseCameraMouseWheelInput.js
var BaseCameraMouseWheelInput = class {
  constructor() {
    this.wheelPrecisionX = 3;
    this.wheelPrecisionY = 3;
    this.wheelPrecisionZ = 3;
    this.onChangedObservable = new Observable();
    this._wheelDeltaX = 0;
    this._wheelDeltaY = 0;
    this._wheelDeltaZ = 0;
    this._ffMultiplier = 12;
    this._normalize = 120;
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls
   *   should call preventdefault().
   *   (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this._wheel = (pointer) => {
      if (pointer.type !== PointerEventTypes.POINTERWHEEL) {
        return;
      }
      const event = pointer.event;
      const platformScale = event.deltaMode === EventConstants.DOM_DELTA_LINE ? this._ffMultiplier : 1;
      this._wheelDeltaX += this.wheelPrecisionX * platformScale * event.deltaX / this._normalize;
      this._wheelDeltaY -= this.wheelPrecisionY * platformScale * event.deltaY / this._normalize;
      this._wheelDeltaZ += this.wheelPrecisionZ * platformScale * event.deltaZ / this._normalize;
      if (event.preventDefault) {
        if (!noPreventDefault) {
          event.preventDefault();
        }
      }
    };
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._wheel, PointerEventTypes.POINTERWHEEL);
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._observer) {
      this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
      this._observer = null;
      this._wheel = null;
    }
    if (this.onChangedObservable) {
      this.onChangedObservable.clear();
    }
  }
  /**
   * Called for each rendered frame.
   */
  checkInputs() {
    this.onChangedObservable.notifyObservers({
      wheelDeltaX: this._wheelDeltaX,
      wheelDeltaY: this._wheelDeltaY,
      wheelDeltaZ: this._wheelDeltaZ
    });
    this._wheelDeltaX = 0;
    this._wheelDeltaY = 0;
    this._wheelDeltaZ = 0;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "BaseCameraMouseWheelInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "mousewheel";
  }
};
__decorate([
  serialize()
], BaseCameraMouseWheelInput.prototype, "wheelPrecisionX", void 0);
__decorate([
  serialize()
], BaseCameraMouseWheelInput.prototype, "wheelPrecisionY", void 0);
__decorate([
  serialize()
], BaseCameraMouseWheelInput.prototype, "wheelPrecisionZ", void 0);

// node_modules/@babylonjs/core/Cameras/Inputs/BaseCameraPointersInput.js
var BaseCameraPointersInput = class {
  constructor() {
    this._currentActiveButton = -1;
    this.buttons = [0, 1, 2];
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    const engine = this.camera.getEngine();
    const element = engine.getInputElement();
    let previousPinchSquaredDistance = 0;
    let previousMultiTouchPanPosition = null;
    this._pointA = null;
    this._pointB = null;
    this._altKey = false;
    this._ctrlKey = false;
    this._metaKey = false;
    this._shiftKey = false;
    this._buttonsPressed = 0;
    this._pointerInput = (p) => {
      var _a, _b;
      const evt = p.event;
      const isTouch = evt.pointerType === "touch";
      if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
        return;
      }
      const srcElement = evt.target;
      this._altKey = evt.altKey;
      this._ctrlKey = evt.ctrlKey;
      this._metaKey = evt.metaKey;
      this._shiftKey = evt.shiftKey;
      this._buttonsPressed = evt.buttons;
      if (engine.isPointerLock) {
        const offsetX = evt.movementX;
        const offsetY = evt.movementY;
        this.onTouch(null, offsetX, offsetY);
        this._pointA = null;
        this._pointB = null;
      } else if (p.type !== PointerEventTypes.POINTERDOWN && isTouch && ((_a = this._pointA) === null || _a === void 0 ? void 0 : _a.pointerId) !== evt.pointerId && ((_b = this._pointB) === null || _b === void 0 ? void 0 : _b.pointerId) !== evt.pointerId) {
        return;
      } else if (p.type === PointerEventTypes.POINTERDOWN && (this._currentActiveButton === -1 || isTouch)) {
        try {
          srcElement === null || srcElement === void 0 ? void 0 : srcElement.setPointerCapture(evt.pointerId);
        } catch (e) {
        }
        if (this._pointA === null) {
          this._pointA = {
            x: evt.clientX,
            y: evt.clientY,
            pointerId: evt.pointerId,
            type: evt.pointerType
          };
        } else if (this._pointB === null) {
          this._pointB = {
            x: evt.clientX,
            y: evt.clientY,
            pointerId: evt.pointerId,
            type: evt.pointerType
          };
        } else {
          return;
        }
        if (this._currentActiveButton === -1 && !isTouch) {
          this._currentActiveButton = evt.button;
        }
        this.onButtonDown(evt);
        if (!noPreventDefault) {
          evt.preventDefault();
          element && element.focus();
        }
      } else if (p.type === PointerEventTypes.POINTERDOUBLETAP) {
        this.onDoubleTap(evt.pointerType);
      } else if (p.type === PointerEventTypes.POINTERUP && (this._currentActiveButton === evt.button || isTouch)) {
        try {
          srcElement === null || srcElement === void 0 ? void 0 : srcElement.releasePointerCapture(evt.pointerId);
        } catch (e) {
        }
        if (!isTouch) {
          this._pointB = null;
        }
        if (engine._badOS) {
          this._pointA = this._pointB = null;
        } else {
          if (this._pointB && this._pointA && this._pointA.pointerId == evt.pointerId) {
            this._pointA = this._pointB;
            this._pointB = null;
          } else if (this._pointA && this._pointB && this._pointB.pointerId == evt.pointerId) {
            this._pointB = null;
          } else {
            this._pointA = this._pointB = null;
          }
        }
        if (previousPinchSquaredDistance !== 0 || previousMultiTouchPanPosition) {
          this.onMultiTouch(
            this._pointA,
            this._pointB,
            previousPinchSquaredDistance,
            0,
            // pinchSquaredDistance
            previousMultiTouchPanPosition,
            null
            // multiTouchPanPosition
          );
          previousPinchSquaredDistance = 0;
          previousMultiTouchPanPosition = null;
        }
        this._currentActiveButton = -1;
        this.onButtonUp(evt);
        if (!noPreventDefault) {
          evt.preventDefault();
        }
      } else if (p.type === PointerEventTypes.POINTERMOVE) {
        if (!noPreventDefault) {
          evt.preventDefault();
        }
        if (this._pointA && this._pointB === null) {
          const offsetX = evt.clientX - this._pointA.x;
          const offsetY = evt.clientY - this._pointA.y;
          this.onTouch(this._pointA, offsetX, offsetY);
          this._pointA.x = evt.clientX;
          this._pointA.y = evt.clientY;
        } else if (this._pointA && this._pointB) {
          const ed = this._pointA.pointerId === evt.pointerId ? this._pointA : this._pointB;
          ed.x = evt.clientX;
          ed.y = evt.clientY;
          const distX = this._pointA.x - this._pointB.x;
          const distY = this._pointA.y - this._pointB.y;
          const pinchSquaredDistance = distX * distX + distY * distY;
          const multiTouchPanPosition = {
            x: (this._pointA.x + this._pointB.x) / 2,
            y: (this._pointA.y + this._pointB.y) / 2,
            pointerId: evt.pointerId,
            type: p.type
          };
          this.onMultiTouch(this._pointA, this._pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition);
          previousMultiTouchPanPosition = multiTouchPanPosition;
          previousPinchSquaredDistance = pinchSquaredDistance;
        }
      }
    };
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE | PointerEventTypes.POINTERDOUBLETAP);
    this._onLostFocus = () => {
      this._pointA = this._pointB = null;
      previousPinchSquaredDistance = 0;
      previousMultiTouchPanPosition = null;
      this.onLostFocus();
    };
    this._contextMenuBind = (evt) => this.onContextMenu(evt);
    element && element.addEventListener("contextmenu", this._contextMenuBind, false);
    const hostWindow = this.camera.getScene().getEngine().getHostWindow();
    if (hostWindow) {
      Tools.RegisterTopRootEvents(hostWindow, [{ name: "blur", handler: this._onLostFocus }]);
    }
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._onLostFocus) {
      const hostWindow = this.camera.getScene().getEngine().getHostWindow();
      if (hostWindow) {
        Tools.UnregisterTopRootEvents(hostWindow, [{ name: "blur", handler: this._onLostFocus }]);
      }
    }
    if (this._observer) {
      this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
      this._observer = null;
      if (this._contextMenuBind) {
        const inputElement = this.camera.getScene().getEngine().getInputElement();
        inputElement && inputElement.removeEventListener("contextmenu", this._contextMenuBind);
      }
      this._onLostFocus = null;
    }
    this._altKey = false;
    this._ctrlKey = false;
    this._metaKey = false;
    this._shiftKey = false;
    this._buttonsPressed = 0;
    this._currentActiveButton = -1;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "BaseCameraPointersInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "pointers";
  }
  /**
   * Called on pointer POINTERDOUBLETAP event.
   * Override this method to provide functionality on POINTERDOUBLETAP event.
   * @param type
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDoubleTap(type) {
  }
  /**
   * Called on pointer POINTERMOVE event if only a single touch is active.
   * Override this method to provide functionality.
   * @param point
   * @param offsetX
   * @param offsetY
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTouch(point, offsetX, offsetY) {
  }
  /**
   * Called on pointer POINTERMOVE event if multiple touches are active.
   * Override this method to provide functionality.
   * @param _pointA
   * @param _pointB
   * @param previousPinchSquaredDistance
   * @param pinchSquaredDistance
   * @param previousMultiTouchPanPosition
   * @param multiTouchPanPosition
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMultiTouch(_pointA, _pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) {
  }
  /**
   * Called on JS contextmenu event.
   * Override this method to provide functionality.
   * @param evt
   */
  onContextMenu(evt) {
    evt.preventDefault();
  }
  /**
   * Called each time a new POINTERDOWN event occurs. Ie, for each button
   * press.
   * Override this method to provide functionality.
   * @param _evt Defines the event to track
   */
  onButtonDown(_evt) {
  }
  /**
   * Called each time a new POINTERUP event occurs. Ie, for each button
   * release.
   * Override this method to provide functionality.
   * @param _evt Defines the event to track
   */
  onButtonUp(_evt) {
  }
  /**
   * Called when window becomes inactive.
   * Override this method to provide functionality.
   */
  onLostFocus() {
  }
};
__decorate([
  serialize()
], BaseCameraPointersInput.prototype, "buttons", void 0);

// node_modules/@babylonjs/core/Cameras/cameraInputsManager.js
var CameraInputTypes = {};
var CameraInputsManager = class {
  /**
   * Instantiate a new Camera Input Manager.
   * @param camera Defines the camera the input manager belongs to
   */
  constructor(camera) {
    this.attachedToElement = false;
    this.attached = {};
    this.camera = camera;
    this.checkInputs = () => {
    };
  }
  /**
   * Add an input method to a camera
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
   * @param input Camera input method
   */
  add(input) {
    const type = input.getSimpleName();
    if (this.attached[type]) {
      Logger.Warn("camera input of type " + type + " already exists on camera");
      return;
    }
    this.attached[type] = input;
    input.camera = this.camera;
    if (input.checkInputs) {
      this.checkInputs = this._addCheckInputs(input.checkInputs.bind(input));
    }
    if (this.attachedToElement) {
      input.attachControl(this.noPreventDefault);
    }
  }
  /**
   * Remove a specific input method from a camera
   * example: camera.inputs.remove(camera.inputs.attached.mouse);
   * @param inputToRemove camera input method
   */
  remove(inputToRemove) {
    for (const cam in this.attached) {
      const input = this.attached[cam];
      if (input === inputToRemove) {
        input.detachControl();
        input.camera = null;
        delete this.attached[cam];
        this.rebuildInputCheck();
        return;
      }
    }
  }
  /**
   * Remove a specific input type from a camera
   * example: camera.inputs.remove("ArcRotateCameraGamepadInput");
   * @param inputType the type of the input to remove
   */
  removeByType(inputType) {
    for (const cam in this.attached) {
      const input = this.attached[cam];
      if (input.getClassName() === inputType) {
        input.detachControl();
        input.camera = null;
        delete this.attached[cam];
        this.rebuildInputCheck();
      }
    }
  }
  _addCheckInputs(fn) {
    const current = this.checkInputs;
    return () => {
      current();
      fn();
    };
  }
  /**
   * Attach the input controls to the currently attached dom element to listen the events from.
   * @param input Defines the input to attach
   */
  attachInput(input) {
    if (this.attachedToElement) {
      input.attachControl(this.noPreventDefault);
    }
  }
  /**
   * Attach the current manager inputs controls to a specific dom element to listen the events from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachElement(noPreventDefault = false) {
    if (this.attachedToElement) {
      return;
    }
    noPreventDefault = Camera.ForceAttachControlToAlwaysPreventDefault ? false : noPreventDefault;
    this.attachedToElement = true;
    this.noPreventDefault = noPreventDefault;
    for (const cam in this.attached) {
      this.attached[cam].attachControl(noPreventDefault);
    }
  }
  /**
   * Detach the current manager inputs controls from a specific dom element.
   * @param disconnect Defines whether the input should be removed from the current list of attached inputs
   */
  detachElement(disconnect = false) {
    for (const cam in this.attached) {
      this.attached[cam].detachControl();
      if (disconnect) {
        this.attached[cam].camera = null;
      }
    }
    this.attachedToElement = false;
  }
  /**
   * Rebuild the dynamic inputCheck function from the current list of
   * defined inputs in the manager.
   */
  rebuildInputCheck() {
    this.checkInputs = () => {
    };
    for (const cam in this.attached) {
      const input = this.attached[cam];
      if (input.checkInputs) {
        this.checkInputs = this._addCheckInputs(input.checkInputs.bind(input));
      }
    }
  }
  /**
   * Remove all attached input methods from a camera
   */
  clear() {
    if (this.attachedToElement) {
      this.detachElement(true);
    }
    this.attached = {};
    this.attachedToElement = false;
    this.checkInputs = () => {
    };
  }
  /**
   * Serialize the current input manager attached to a camera.
   * This ensures than once parsed,
   * the input associated to the camera will be identical to the current ones
   * @param serializedCamera Defines the camera serialization JSON the input serialization should write to
   */
  serialize(serializedCamera) {
    const inputs = {};
    for (const cam in this.attached) {
      const input = this.attached[cam];
      const res = SerializationHelper.Serialize(input);
      inputs[input.getClassName()] = res;
    }
    serializedCamera.inputsmgr = inputs;
  }
  /**
   * Parses an input manager serialized JSON to restore the previous list of inputs
   * and states associated to a camera.
   * @param parsedCamera Defines the JSON to parse
   */
  parse(parsedCamera) {
    const parsedInputs = parsedCamera.inputsmgr;
    if (parsedInputs) {
      this.clear();
      for (const n in parsedInputs) {
        const construct = CameraInputTypes[n];
        if (construct) {
          const parsedinput = parsedInputs[n];
          const input = SerializationHelper.Parse(() => {
            return new construct();
          }, parsedinput, null);
          this.add(input);
        }
      }
    } else {
      for (const n in this.attached) {
        const construct = CameraInputTypes[this.attached[n].getClassName()];
        if (construct) {
          const input = SerializationHelper.Parse(() => {
            return new construct();
          }, parsedCamera, null);
          this.remove(this.attached[n]);
          this.add(input);
        }
      }
    }
  }
};

// node_modules/@babylonjs/core/Gamepads/gamepad.js
var StickValues = class {
  /**
   * Initializes the gamepad x and y control stick values
   * @param x The x component of the gamepad control stick value
   * @param y The y component of the gamepad control stick value
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
};
var Gamepad = class _Gamepad {
  /**
   * Specifies if the gamepad has been connected
   */
  get isConnected() {
    return this._isConnected;
  }
  /**
   * Initializes the gamepad
   * @param id The id of the gamepad
   * @param index The index of the gamepad
   * @param browserGamepad The browser gamepad
   * @param leftStickX The x component of the left joystick
   * @param leftStickY The y component of the left joystick
   * @param rightStickX The x component of the right joystick
   * @param rightStickY The y component of the right joystick
   */
  constructor(id, index, browserGamepad, leftStickX = 0, leftStickY = 1, rightStickX = 2, rightStickY = 3) {
    this.id = id;
    this.index = index;
    this.browserGamepad = browserGamepad;
    this._leftStick = { x: 0, y: 0 };
    this._rightStick = { x: 0, y: 0 };
    this._isConnected = true;
    this._invertLeftStickY = false;
    this.type = _Gamepad.GAMEPAD;
    this._leftStickAxisX = leftStickX;
    this._leftStickAxisY = leftStickY;
    this._rightStickAxisX = rightStickX;
    this._rightStickAxisY = rightStickY;
    if (this.browserGamepad.axes.length >= 2) {
      this._leftStick = { x: this.browserGamepad.axes[this._leftStickAxisX], y: this.browserGamepad.axes[this._leftStickAxisY] };
    }
    if (this.browserGamepad.axes.length >= 4) {
      this._rightStick = { x: this.browserGamepad.axes[this._rightStickAxisX], y: this.browserGamepad.axes[this._rightStickAxisY] };
    }
  }
  /**
   * Callback triggered when the left joystick has changed
   * @param callback
   */
  onleftstickchanged(callback) {
    this._onleftstickchanged = callback;
  }
  /**
   * Callback triggered when the right joystick has changed
   * @param callback
   */
  onrightstickchanged(callback) {
    this._onrightstickchanged = callback;
  }
  /**
   * Gets the left joystick
   */
  get leftStick() {
    return this._leftStick;
  }
  /**
   * Sets the left joystick values
   */
  set leftStick(newValues) {
    if (this._onleftstickchanged && (this._leftStick.x !== newValues.x || this._leftStick.y !== newValues.y)) {
      this._onleftstickchanged(newValues);
    }
    this._leftStick = newValues;
  }
  /**
   * Gets the right joystick
   */
  get rightStick() {
    return this._rightStick;
  }
  /**
   * Sets the right joystick value
   */
  set rightStick(newValues) {
    if (this._onrightstickchanged && (this._rightStick.x !== newValues.x || this._rightStick.y !== newValues.y)) {
      this._onrightstickchanged(newValues);
    }
    this._rightStick = newValues;
  }
  /**
   * Updates the gamepad joystick positions
   */
  update() {
    if (this._leftStick) {
      this.leftStick = { x: this.browserGamepad.axes[this._leftStickAxisX], y: this.browserGamepad.axes[this._leftStickAxisY] };
      if (this._invertLeftStickY) {
        this.leftStick.y *= -1;
      }
    }
    if (this._rightStick) {
      this.rightStick = { x: this.browserGamepad.axes[this._rightStickAxisX], y: this.browserGamepad.axes[this._rightStickAxisY] };
    }
  }
  /**
   * Disposes the gamepad
   */
  dispose() {
  }
};
Gamepad.GAMEPAD = 0;
Gamepad.GENERIC = 1;
Gamepad.XBOX = 2;
Gamepad.POSE_ENABLED = 3;
Gamepad.DUALSHOCK = 4;
var GenericPad = class extends Gamepad {
  /**
   * Callback triggered when a button has been pressed
   * @param callback Called when a button has been pressed
   */
  onbuttondown(callback) {
    this._onbuttondown = callback;
  }
  /**
   * Callback triggered when a button has been released
   * @param callback Called when a button has been released
   */
  onbuttonup(callback) {
    this._onbuttonup = callback;
  }
  /**
   * Initializes the generic gamepad
   * @param id The id of the generic gamepad
   * @param index The index of the generic gamepad
   * @param browserGamepad The browser gamepad
   */
  constructor(id, index, browserGamepad) {
    super(id, index, browserGamepad);
    this.onButtonDownObservable = new Observable();
    this.onButtonUpObservable = new Observable();
    this.type = Gamepad.GENERIC;
    this._buttons = new Array(browserGamepad.buttons.length);
  }
  _setButtonValue(newValue, currentValue, buttonIndex) {
    if (newValue !== currentValue) {
      if (newValue === 1) {
        if (this._onbuttondown) {
          this._onbuttondown(buttonIndex);
        }
        this.onButtonDownObservable.notifyObservers(buttonIndex);
      }
      if (newValue === 0) {
        if (this._onbuttonup) {
          this._onbuttonup(buttonIndex);
        }
        this.onButtonUpObservable.notifyObservers(buttonIndex);
      }
    }
    return newValue;
  }
  /**
   * Updates the generic gamepad
   */
  update() {
    super.update();
    for (let index = 0; index < this._buttons.length; index++) {
      this._buttons[index] = this._setButtonValue(this.browserGamepad.buttons[index].value, this._buttons[index], index);
    }
  }
  /**
   * Disposes the generic gamepad
   */
  dispose() {
    super.dispose();
    this.onButtonDownObservable.clear();
    this.onButtonUpObservable.clear();
  }
};

// node_modules/@babylonjs/core/Cameras/Inputs/arcRotateCameraGamepadInput.js
var ArcRotateCameraGamepadInput = class {
  constructor() {
    this.gamepadRotationSensibility = 80;
    this.gamepadMoveSensibility = 40;
    this._yAxisScale = 1;
  }
  /**
   * Gets or sets a boolean indicating that Yaxis (for right stick) should be inverted
   */
  get invertYAxis() {
    return this._yAxisScale !== 1;
  }
  set invertYAxis(value) {
    this._yAxisScale = value ? -1 : 1;
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   */
  attachControl() {
    const manager = this.camera.getScene().gamepadManager;
    this._onGamepadConnectedObserver = manager.onGamepadConnectedObservable.add((gamepad) => {
      if (gamepad.type !== Gamepad.POSE_ENABLED) {
        if (!this.gamepad || gamepad.type === Gamepad.XBOX) {
          this.gamepad = gamepad;
        }
      }
    });
    this._onGamepadDisconnectedObserver = manager.onGamepadDisconnectedObservable.add((gamepad) => {
      if (this.gamepad === gamepad) {
        this.gamepad = null;
      }
    });
    this.gamepad = manager.getGamepadByType(Gamepad.XBOX);
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    this.camera.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
    this.camera.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
    this.gamepad = null;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this.gamepad) {
      const camera = this.camera;
      const rsValues = this.gamepad.rightStick;
      if (rsValues) {
        if (rsValues.x != 0) {
          const normalizedRX = rsValues.x / this.gamepadRotationSensibility;
          if (normalizedRX != 0 && Math.abs(normalizedRX) > 5e-3) {
            camera.inertialAlphaOffset += normalizedRX;
          }
        }
        if (rsValues.y != 0) {
          const normalizedRY = rsValues.y / this.gamepadRotationSensibility * this._yAxisScale;
          if (normalizedRY != 0 && Math.abs(normalizedRY) > 5e-3) {
            camera.inertialBetaOffset += normalizedRY;
          }
        }
      }
      const lsValues = this.gamepad.leftStick;
      if (lsValues && lsValues.y != 0) {
        const normalizedLY = lsValues.y / this.gamepadMoveSensibility;
        if (normalizedLY != 0 && Math.abs(normalizedLY) > 5e-3) {
          this.camera.inertialRadiusOffset -= normalizedLY;
        }
      }
    }
  }
  /**
   * Gets the class name of the current intput.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCameraGamepadInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "gamepad";
  }
};
__decorate([
  serialize()
], ArcRotateCameraGamepadInput.prototype, "gamepadRotationSensibility", void 0);
__decorate([
  serialize()
], ArcRotateCameraGamepadInput.prototype, "gamepadMoveSensibility", void 0);
CameraInputTypes["ArcRotateCameraGamepadInput"] = ArcRotateCameraGamepadInput;

// node_modules/@babylonjs/core/Cameras/Inputs/arcRotateCameraKeyboardMoveInput.js
var ArcRotateCameraKeyboardMoveInput = class {
  constructor() {
    this.keysUp = [38];
    this.keysDown = [40];
    this.keysLeft = [37];
    this.keysRight = [39];
    this.keysReset = [220];
    this.panningSensibility = 50;
    this.zoomingSensibility = 25;
    this.useAltToZoom = true;
    this.angularSpeed = 0.01;
    this._keys = new Array();
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    if (this._onCanvasBlurObserver) {
      return;
    }
    this._scene = this.camera.getScene();
    this._engine = this._scene.getEngine();
    this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
      this._keys.length = 0;
    });
    this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
      const evt = info.event;
      if (!evt.metaKey) {
        if (info.type === KeyboardEventTypes.KEYDOWN) {
          this._ctrlPressed = evt.ctrlKey;
          this._altPressed = evt.altKey;
          if (this.keysUp.indexOf(evt.keyCode) !== -1 || this.keysDown.indexOf(evt.keyCode) !== -1 || this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1 || this.keysReset.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            if (index === -1) {
              this._keys.push(evt.keyCode);
            }
            if (evt.preventDefault) {
              if (!noPreventDefault) {
                evt.preventDefault();
              }
            }
          }
        } else {
          if (this.keysUp.indexOf(evt.keyCode) !== -1 || this.keysDown.indexOf(evt.keyCode) !== -1 || this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1 || this.keysReset.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            if (index >= 0) {
              this._keys.splice(index, 1);
            }
            if (evt.preventDefault) {
              if (!noPreventDefault) {
                evt.preventDefault();
              }
            }
          }
        }
      }
    });
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._scene) {
      if (this._onKeyboardObserver) {
        this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
      }
      if (this._onCanvasBlurObserver) {
        this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
      }
      this._onKeyboardObserver = null;
      this._onCanvasBlurObserver = null;
    }
    this._keys.length = 0;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._onKeyboardObserver) {
      const camera = this.camera;
      for (let index = 0; index < this._keys.length; index++) {
        const keyCode = this._keys[index];
        if (this.keysLeft.indexOf(keyCode) !== -1) {
          if (this._ctrlPressed && this.camera._useCtrlForPanning) {
            camera.inertialPanningX -= 1 / this.panningSensibility;
          } else {
            camera.inertialAlphaOffset -= this.angularSpeed;
          }
        } else if (this.keysUp.indexOf(keyCode) !== -1) {
          if (this._ctrlPressed && this.camera._useCtrlForPanning) {
            camera.inertialPanningY += 1 / this.panningSensibility;
          } else if (this._altPressed && this.useAltToZoom) {
            camera.inertialRadiusOffset += 1 / this.zoomingSensibility;
          } else {
            camera.inertialBetaOffset -= this.angularSpeed;
          }
        } else if (this.keysRight.indexOf(keyCode) !== -1) {
          if (this._ctrlPressed && this.camera._useCtrlForPanning) {
            camera.inertialPanningX += 1 / this.panningSensibility;
          } else {
            camera.inertialAlphaOffset += this.angularSpeed;
          }
        } else if (this.keysDown.indexOf(keyCode) !== -1) {
          if (this._ctrlPressed && this.camera._useCtrlForPanning) {
            camera.inertialPanningY -= 1 / this.panningSensibility;
          } else if (this._altPressed && this.useAltToZoom) {
            camera.inertialRadiusOffset -= 1 / this.zoomingSensibility;
          } else {
            camera.inertialBetaOffset += this.angularSpeed;
          }
        } else if (this.keysReset.indexOf(keyCode) !== -1) {
          if (camera.useInputToRestoreState) {
            camera.restoreState();
          }
        }
      }
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCameraKeyboardMoveInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "keyboard";
  }
};
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "keysUp", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "keysDown", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "keysLeft", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "keysRight", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "keysReset", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "panningSensibility", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "zoomingSensibility", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "useAltToZoom", void 0);
__decorate([
  serialize()
], ArcRotateCameraKeyboardMoveInput.prototype, "angularSpeed", void 0);
CameraInputTypes["ArcRotateCameraKeyboardMoveInput"] = ArcRotateCameraKeyboardMoveInput;

// node_modules/@babylonjs/core/Cameras/Inputs/arcRotateCameraMouseWheelInput.js
var ffMultiplier = 40;
var ArcRotateCameraMouseWheelInput = class {
  constructor() {
    this.wheelPrecision = 3;
    this.zoomToMouseLocation = false;
    this.wheelDeltaPercentage = 0;
    this.customComputeDeltaFromMouseWheel = null;
    this._viewOffset = new Vector3(0, 0, 0);
    this._globalOffset = new Vector3(0, 0, 0);
    this._inertialPanning = Vector3.Zero();
  }
  _computeDeltaFromMouseWheelLegacyEvent(mouseWheelDelta, radius) {
    let delta = 0;
    const wheelDelta = mouseWheelDelta * 0.01 * this.wheelDeltaPercentage * radius;
    if (mouseWheelDelta > 0) {
      delta = wheelDelta / (1 + this.wheelDeltaPercentage);
    } else {
      delta = wheelDelta * (1 + this.wheelDeltaPercentage);
    }
    return delta;
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this._wheel = (p) => {
      if (p.type !== PointerEventTypes.POINTERWHEEL) {
        return;
      }
      const event = p.event;
      let delta = 0;
      const platformScale = event.deltaMode === EventConstants.DOM_DELTA_LINE ? ffMultiplier : 1;
      const wheelDelta = -(event.deltaY * platformScale);
      if (this.customComputeDeltaFromMouseWheel) {
        delta = this.customComputeDeltaFromMouseWheel(wheelDelta, this, event);
      } else {
        if (this.wheelDeltaPercentage) {
          delta = this._computeDeltaFromMouseWheelLegacyEvent(wheelDelta, this.camera.radius);
          if (delta > 0) {
            let estimatedTargetRadius = this.camera.radius;
            let targetInertia = this.camera.inertialRadiusOffset + delta;
            for (let i = 0; i < 20 && Math.abs(targetInertia) > 1e-3; i++) {
              estimatedTargetRadius -= targetInertia;
              targetInertia *= this.camera.inertia;
            }
            estimatedTargetRadius = Scalar.Clamp(estimatedTargetRadius, 0, Number.MAX_VALUE);
            delta = this._computeDeltaFromMouseWheelLegacyEvent(wheelDelta, estimatedTargetRadius);
          }
        } else {
          delta = wheelDelta / (this.wheelPrecision * 40);
        }
      }
      if (delta) {
        if (this.zoomToMouseLocation) {
          if (!this._hitPlane) {
            this._updateHitPlane();
          }
          this._zoomToMouse(delta);
        } else {
          this.camera.inertialRadiusOffset += delta;
        }
      }
      if (event.preventDefault) {
        if (!noPreventDefault) {
          event.preventDefault();
        }
      }
    };
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._wheel, PointerEventTypes.POINTERWHEEL);
    if (this.zoomToMouseLocation) {
      this._inertialPanning.setAll(0);
    }
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._observer) {
      this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
      this._observer = null;
      this._wheel = null;
    }
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (!this.zoomToMouseLocation) {
      return;
    }
    const camera = this.camera;
    const motion = 0 + camera.inertialAlphaOffset + camera.inertialBetaOffset + camera.inertialRadiusOffset;
    if (motion) {
      this._updateHitPlane();
      camera.target.addInPlace(this._inertialPanning);
      this._inertialPanning.scaleInPlace(camera.inertia);
      this._zeroIfClose(this._inertialPanning);
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCameraMouseWheelInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "mousewheel";
  }
  _updateHitPlane() {
    const camera = this.camera;
    const direction = camera.target.subtract(camera.position);
    this._hitPlane = Plane.FromPositionAndNormal(camera.target, direction);
  }
  // Get position on the hit plane
  _getPosition() {
    var _a;
    const camera = this.camera;
    const scene = camera.getScene();
    const ray = scene.createPickingRay(scene.pointerX, scene.pointerY, Matrix.Identity(), camera, false);
    if (camera.targetScreenOffset.x !== 0 || camera.targetScreenOffset.y !== 0) {
      this._viewOffset.set(camera.targetScreenOffset.x, camera.targetScreenOffset.y, 0);
      camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
      this._globalOffset = Vector3.TransformNormal(this._viewOffset, camera._cameraTransformMatrix);
      ray.origin.addInPlace(this._globalOffset);
    }
    let distance = 0;
    if (this._hitPlane) {
      distance = (_a = ray.intersectsPlane(this._hitPlane)) !== null && _a !== void 0 ? _a : 0;
    }
    return ray.origin.addInPlace(ray.direction.scaleInPlace(distance));
  }
  _zoomToMouse(delta) {
    var _a, _b;
    const camera = this.camera;
    const inertiaComp = 1 - camera.inertia;
    if (camera.lowerRadiusLimit) {
      const lowerLimit = (_a = camera.lowerRadiusLimit) !== null && _a !== void 0 ? _a : 0;
      if (camera.radius - (camera.inertialRadiusOffset + delta) / inertiaComp < lowerLimit) {
        delta = (camera.radius - lowerLimit) * inertiaComp - camera.inertialRadiusOffset;
      }
    }
    if (camera.upperRadiusLimit) {
      const upperLimit = (_b = camera.upperRadiusLimit) !== null && _b !== void 0 ? _b : 0;
      if (camera.radius - (camera.inertialRadiusOffset + delta) / inertiaComp > upperLimit) {
        delta = (camera.radius - upperLimit) * inertiaComp - camera.inertialRadiusOffset;
      }
    }
    const zoomDistance = delta / inertiaComp;
    const ratio = zoomDistance / camera.radius;
    const vec = this._getPosition();
    const directionToZoomLocation = TmpVectors.Vector3[6];
    vec.subtractToRef(camera.target, directionToZoomLocation);
    directionToZoomLocation.scaleInPlace(ratio);
    directionToZoomLocation.scaleInPlace(inertiaComp);
    this._inertialPanning.addInPlace(directionToZoomLocation);
    camera.inertialRadiusOffset += delta;
  }
  // Sets x y or z of passed in vector to zero if less than Epsilon.
  _zeroIfClose(vec) {
    if (Math.abs(vec.x) < Epsilon) {
      vec.x = 0;
    }
    if (Math.abs(vec.y) < Epsilon) {
      vec.y = 0;
    }
    if (Math.abs(vec.z) < Epsilon) {
      vec.z = 0;
    }
  }
};
__decorate([
  serialize()
], ArcRotateCameraMouseWheelInput.prototype, "wheelPrecision", void 0);
__decorate([
  serialize()
], ArcRotateCameraMouseWheelInput.prototype, "zoomToMouseLocation", void 0);
__decorate([
  serialize()
], ArcRotateCameraMouseWheelInput.prototype, "wheelDeltaPercentage", void 0);
CameraInputTypes["ArcRotateCameraMouseWheelInput"] = ArcRotateCameraMouseWheelInput;

// node_modules/@babylonjs/core/Cameras/Inputs/arcRotateCameraPointersInput.js
var ArcRotateCameraPointersInput = class _ArcRotateCameraPointersInput extends BaseCameraPointersInput {
  constructor() {
    super(...arguments);
    this.buttons = [0, 1, 2];
    this.angularSensibilityX = 1e3;
    this.angularSensibilityY = 1e3;
    this.pinchPrecision = 12;
    this.pinchDeltaPercentage = 0;
    this.useNaturalPinchZoom = false;
    this.pinchZoom = true;
    this.panningSensibility = 1e3;
    this.multiTouchPanning = true;
    this.multiTouchPanAndZoom = true;
    this.pinchInwards = true;
    this._isPanClick = false;
    this._twoFingerActivityCount = 0;
    this._isPinching = false;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCameraPointersInput";
  }
  /**
   * Move camera from multi touch panning positions.
   * @param previousMultiTouchPanPosition
   * @param multiTouchPanPosition
   */
  _computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition) {
    if (this.panningSensibility !== 0 && previousMultiTouchPanPosition && multiTouchPanPosition) {
      const moveDeltaX = multiTouchPanPosition.x - previousMultiTouchPanPosition.x;
      const moveDeltaY = multiTouchPanPosition.y - previousMultiTouchPanPosition.y;
      this.camera.inertialPanningX += -moveDeltaX / this.panningSensibility;
      this.camera.inertialPanningY += moveDeltaY / this.panningSensibility;
    }
  }
  /**
   * Move camera from pinch zoom distances.
   * @param previousPinchSquaredDistance
   * @param pinchSquaredDistance
   */
  _computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance) {
    const radius = this.camera.radius || _ArcRotateCameraPointersInput.MinimumRadiusForPinch;
    if (this.useNaturalPinchZoom) {
      this.camera.radius = radius * Math.sqrt(previousPinchSquaredDistance) / Math.sqrt(pinchSquaredDistance);
    } else if (this.pinchDeltaPercentage) {
      this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) * 1e-3 * radius * this.pinchDeltaPercentage;
    } else {
      this.camera.inertialRadiusOffset += (pinchSquaredDistance - previousPinchSquaredDistance) / (this.pinchPrecision * (this.pinchInwards ? 1 : -1) * (this.angularSensibilityX + this.angularSensibilityY) / 2);
    }
  }
  /**
   * Called on pointer POINTERMOVE event if only a single touch is active.
   * @param point
   * @param offsetX
   * @param offsetY
   */
  onTouch(point, offsetX, offsetY) {
    if (this.panningSensibility !== 0 && (this._ctrlKey && this.camera._useCtrlForPanning || this._isPanClick)) {
      this.camera.inertialPanningX += -offsetX / this.panningSensibility;
      this.camera.inertialPanningY += offsetY / this.panningSensibility;
    } else {
      this.camera.inertialAlphaOffset -= offsetX / this.angularSensibilityX;
      this.camera.inertialBetaOffset -= offsetY / this.angularSensibilityY;
    }
  }
  /**
   * Called on pointer POINTERDOUBLETAP event.
   */
  onDoubleTap() {
    if (this.camera.useInputToRestoreState) {
      this.camera.restoreState();
    }
  }
  /**
   * Called on pointer POINTERMOVE event if multiple touches are active.
   * @param pointA
   * @param pointB
   * @param previousPinchSquaredDistance
   * @param pinchSquaredDistance
   * @param previousMultiTouchPanPosition
   * @param multiTouchPanPosition
   */
  onMultiTouch(pointA, pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) {
    if (previousPinchSquaredDistance === 0 && previousMultiTouchPanPosition === null) {
      return;
    }
    if (pinchSquaredDistance === 0 && multiTouchPanPosition === null) {
      return;
    }
    if (this.multiTouchPanAndZoom) {
      this._computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance);
      this._computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition);
    } else if (this.multiTouchPanning && this.pinchZoom) {
      this._twoFingerActivityCount++;
      if (this._isPinching || this._twoFingerActivityCount < 20 && Math.abs(Math.sqrt(pinchSquaredDistance) - Math.sqrt(previousPinchSquaredDistance)) > this.camera.pinchToPanMaxDistance) {
        this._computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance);
        this._isPinching = true;
      } else {
        this._computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition);
      }
    } else if (this.multiTouchPanning) {
      this._computeMultiTouchPanning(previousMultiTouchPanPosition, multiTouchPanPosition);
    } else if (this.pinchZoom) {
      this._computePinchZoom(previousPinchSquaredDistance, pinchSquaredDistance);
    }
  }
  /**
   * Called each time a new POINTERDOWN event occurs. Ie, for each button
   * press.
   * @param evt Defines the event to track
   */
  onButtonDown(evt) {
    this._isPanClick = evt.button === this.camera._panningMouseButton;
  }
  /**
   * Called each time a new POINTERUP event occurs. Ie, for each button
   * release.
   * @param _evt Defines the event to track
   */
  onButtonUp(_evt) {
    this._twoFingerActivityCount = 0;
    this._isPinching = false;
  }
  /**
   * Called when window becomes inactive.
   */
  onLostFocus() {
    this._isPanClick = false;
    this._twoFingerActivityCount = 0;
    this._isPinching = false;
  }
};
ArcRotateCameraPointersInput.MinimumRadiusForPinch = 1e-3;
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "buttons", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "angularSensibilityX", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "angularSensibilityY", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "pinchPrecision", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "pinchDeltaPercentage", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "useNaturalPinchZoom", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "pinchZoom", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "panningSensibility", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "multiTouchPanning", void 0);
__decorate([
  serialize()
], ArcRotateCameraPointersInput.prototype, "multiTouchPanAndZoom", void 0);
CameraInputTypes["ArcRotateCameraPointersInput"] = ArcRotateCameraPointersInput;

// node_modules/@babylonjs/core/Cameras/arcRotateCameraInputsManager.js
var ArcRotateCameraInputsManager = class extends CameraInputsManager {
  /**
   * Instantiates a new ArcRotateCameraInputsManager.
   * @param camera Defines the camera the inputs belong to
   */
  constructor(camera) {
    super(camera);
  }
  /**
   * Add mouse wheel input support to the input manager.
   * @returns the current input manager
   */
  addMouseWheel() {
    this.add(new ArcRotateCameraMouseWheelInput());
    return this;
  }
  /**
   * Add pointers input support to the input manager.
   * @returns the current input manager
   */
  addPointers() {
    this.add(new ArcRotateCameraPointersInput());
    return this;
  }
  /**
   * Add keyboard input support to the input manager.
   * @returns the current input manager
   */
  addKeyboard() {
    this.add(new ArcRotateCameraKeyboardMoveInput());
    return this;
  }
};

// node_modules/@babylonjs/core/Cameras/Inputs/arcRotateCameraVRDeviceOrientationInput.js
ArcRotateCameraInputsManager.prototype.addVRDeviceOrientation = function() {
  this.add(new ArcRotateCameraVRDeviceOrientationInput());
  return this;
};
var ArcRotateCameraVRDeviceOrientationInput = class {
  /**
   * Instantiate a new ArcRotateCameraVRDeviceOrientationInput.
   */
  constructor() {
    this.alphaCorrection = 1;
    this.gammaCorrection = 1;
    this._alpha = 0;
    this._gamma = 0;
    this._dirty = false;
    this._deviceOrientationHandler = (evt) => this._onOrientationEvent(evt);
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this.camera.attachControl(noPreventDefault);
    const hostWindow = this.camera.getScene().getEngine().getHostWindow();
    if (hostWindow) {
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then((response) => {
          if (response === "granted") {
            hostWindow.addEventListener("deviceorientation", this._deviceOrientationHandler);
          } else {
            Tools.Warn("Permission not granted.");
          }
        }).catch((error) => {
          Tools.Error(error);
        });
      } else {
        hostWindow.addEventListener("deviceorientation", this._deviceOrientationHandler);
      }
    }
  }
  /**
   * @internal
   */
  _onOrientationEvent(evt) {
    if (evt.alpha !== null) {
      this._alpha = (+evt.alpha | 0) * this.alphaCorrection;
    }
    if (evt.gamma !== null) {
      this._gamma = (+evt.gamma | 0) * this.gammaCorrection;
    }
    this._dirty = true;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._dirty) {
      this._dirty = false;
      if (this._gamma < 0) {
        this._gamma = 180 + this._gamma;
      }
      this.camera.alpha = -this._alpha / 180 * Math.PI % Math.PI * 2;
      this.camera.beta = this._gamma / 180 * Math.PI;
    }
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    window.removeEventListener("deviceorientation", this._deviceOrientationHandler);
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCameraVRDeviceOrientationInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "VRDeviceOrientation";
  }
};
CameraInputTypes["ArcRotateCameraVRDeviceOrientationInput"] = ArcRotateCameraVRDeviceOrientationInput;

// node_modules/@babylonjs/core/Cameras/Inputs/flyCameraKeyboardInput.js
var FlyCameraKeyboardInput = class {
  constructor() {
    this.keysForward = [87];
    this.keysBackward = [83];
    this.keysUp = [69];
    this.keysDown = [81];
    this.keysRight = [68];
    this.keysLeft = [65];
    this._keys = new Array();
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    if (this._onCanvasBlurObserver) {
      return;
    }
    this._scene = this.camera.getScene();
    this._engine = this._scene.getEngine();
    this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
      this._keys.length = 0;
    });
    this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
      const evt = info.event;
      if (info.type === KeyboardEventTypes.KEYDOWN) {
        if (this.keysForward.indexOf(evt.keyCode) !== -1 || this.keysBackward.indexOf(evt.keyCode) !== -1 || this.keysUp.indexOf(evt.keyCode) !== -1 || this.keysDown.indexOf(evt.keyCode) !== -1 || this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1) {
          const index = this._keys.indexOf(evt.keyCode);
          if (index === -1) {
            this._keys.push(evt.keyCode);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      } else {
        if (this.keysForward.indexOf(evt.keyCode) !== -1 || this.keysBackward.indexOf(evt.keyCode) !== -1 || this.keysUp.indexOf(evt.keyCode) !== -1 || this.keysDown.indexOf(evt.keyCode) !== -1 || this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1) {
          const index = this._keys.indexOf(evt.keyCode);
          if (index >= 0) {
            this._keys.splice(index, 1);
          }
          if (!noPreventDefault) {
            evt.preventDefault();
          }
        }
      }
    });
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._scene) {
      if (this._onKeyboardObserver) {
        this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
      }
      if (this._onCanvasBlurObserver) {
        this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
      }
      this._onKeyboardObserver = null;
      this._onCanvasBlurObserver = null;
    }
    this._keys.length = 0;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FlyCameraKeyboardInput";
  }
  /**
   * @internal
   */
  _onLostFocus() {
    this._keys.length = 0;
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "keyboard";
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._onKeyboardObserver) {
      const camera = this.camera;
      for (let index = 0; index < this._keys.length; index++) {
        const keyCode = this._keys[index];
        const speed = camera._computeLocalCameraSpeed();
        if (this.keysForward.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, speed);
        } else if (this.keysBackward.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, -speed);
        } else if (this.keysUp.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, speed, 0);
        } else if (this.keysDown.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, -speed, 0);
        } else if (this.keysRight.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(speed, 0, 0);
        } else if (this.keysLeft.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(-speed, 0, 0);
        }
        if (camera.getScene().useRightHandedSystem) {
          camera._localDirection.z *= -1;
        }
        camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
        Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
        camera.cameraDirection.addInPlace(camera._transformedDirection);
      }
    }
  }
};
__decorate([
  serialize()
], FlyCameraKeyboardInput.prototype, "keysForward", void 0);
__decorate([
  serialize()
], FlyCameraKeyboardInput.prototype, "keysBackward", void 0);
__decorate([
  serialize()
], FlyCameraKeyboardInput.prototype, "keysUp", void 0);
__decorate([
  serialize()
], FlyCameraKeyboardInput.prototype, "keysDown", void 0);
__decorate([
  serialize()
], FlyCameraKeyboardInput.prototype, "keysRight", void 0);
__decorate([
  serialize()
], FlyCameraKeyboardInput.prototype, "keysLeft", void 0);
CameraInputTypes["FlyCameraKeyboardInput"] = FlyCameraKeyboardInput;

// node_modules/@babylonjs/core/Cameras/Inputs/flyCameraMouseInput.js
var FlyCameraMouseInput = class {
  /**
   * Listen to mouse events to control the camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
   */
  constructor() {
    this.buttons = [0, 1, 2];
    this.buttonsYaw = [-1, 0, 1];
    this.buttonsPitch = [-1, 0, 1];
    this.buttonsRoll = [2];
    this.activeButton = -1;
    this.angularSensibility = 1e3;
    this._previousPosition = null;
  }
  /**
   * Attach the mouse control to the HTML DOM element.
   * @param noPreventDefault Defines whether events caught by the controls should call preventdefault().
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this._noPreventDefault = noPreventDefault;
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver((p) => {
      this._pointerInput(p);
    }, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
    this._rollObserver = this.camera.getScene().onBeforeRenderObservable.add(() => {
      if (this.camera.rollCorrect) {
        this.camera.restoreRoll(this.camera.rollCorrect);
      }
    });
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._observer) {
      this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
      this.camera.getScene().onBeforeRenderObservable.remove(this._rollObserver);
      this._observer = null;
      this._rollObserver = null;
      this._previousPosition = null;
      this._noPreventDefault = void 0;
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name.
   */
  getClassName() {
    return "FlyCameraMouseInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input's friendly name.
   */
  getSimpleName() {
    return "mouse";
  }
  // Track mouse movement, when the pointer is not locked.
  _pointerInput(p) {
    const e = p.event;
    const camera = this.camera;
    const engine = camera.getEngine();
    if (!this.touchEnabled && e.pointerType === "touch") {
      return;
    }
    if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(e.button) === -1) {
      return;
    }
    const srcElement = e.target;
    if (p.type === PointerEventTypes.POINTERDOWN) {
      try {
        srcElement === null || srcElement === void 0 ? void 0 : srcElement.setPointerCapture(e.pointerId);
      } catch (e2) {
      }
      this._previousPosition = {
        x: e.clientX,
        y: e.clientY
      };
      this.activeButton = e.button;
      if (!this._noPreventDefault) {
        e.preventDefault();
        this._element.focus();
      }
      if (engine.isPointerLock) {
        this._onMouseMove(p.event);
      }
    } else if (p.type === PointerEventTypes.POINTERUP) {
      try {
        srcElement === null || srcElement === void 0 ? void 0 : srcElement.releasePointerCapture(e.pointerId);
      } catch (e2) {
      }
      this.activeButton = -1;
      this._previousPosition = null;
      if (!this._noPreventDefault) {
        e.preventDefault();
      }
    } else if (p.type === PointerEventTypes.POINTERMOVE) {
      if (!this._previousPosition) {
        if (engine.isPointerLock) {
          this._onMouseMove(p.event);
        }
        return;
      }
      const offsetX = e.clientX - this._previousPosition.x;
      const offsetY = e.clientY - this._previousPosition.y;
      this._rotateCamera(offsetX, offsetY);
      this._previousPosition = {
        x: e.clientX,
        y: e.clientY
      };
      if (!this._noPreventDefault) {
        e.preventDefault();
      }
    }
  }
  // Track mouse movement, when pointer is locked.
  _onMouseMove(e) {
    const camera = this.camera;
    const engine = camera.getEngine();
    if (!engine.isPointerLock) {
      return;
    }
    const offsetX = e.movementX;
    const offsetY = e.movementY;
    this._rotateCamera(offsetX, offsetY);
    this._previousPosition = null;
    if (!this._noPreventDefault) {
      e.preventDefault();
    }
  }
  /**
   * Rotate camera by mouse offset.
   * @param offsetX
   * @param offsetY
   */
  _rotateCamera(offsetX, offsetY) {
    const camera = this.camera;
    const handednessMultiplier = camera._calculateHandednessMultiplier();
    offsetX *= handednessMultiplier;
    const x = offsetX / this.angularSensibility;
    const y = offsetY / this.angularSensibility;
    const currentRotation = Quaternion.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, camera.rotation.z);
    let rotationChange;
    if (this.buttonsPitch.some((v) => {
      return v === this.activeButton;
    })) {
      rotationChange = Quaternion.RotationAxis(Axis.X, y);
      currentRotation.multiplyInPlace(rotationChange);
    }
    if (this.buttonsYaw.some((v) => {
      return v === this.activeButton;
    })) {
      rotationChange = Quaternion.RotationAxis(Axis.Y, x);
      currentRotation.multiplyInPlace(rotationChange);
      const limit = camera.bankedTurnLimit + camera._trackRoll;
      if (camera.bankedTurn && -limit < camera.rotation.z && camera.rotation.z < limit) {
        const bankingDelta = camera.bankedTurnMultiplier * -x;
        rotationChange = Quaternion.RotationAxis(Axis.Z, bankingDelta);
        currentRotation.multiplyInPlace(rotationChange);
      }
    }
    if (this.buttonsRoll.some((v) => {
      return v === this.activeButton;
    })) {
      rotationChange = Quaternion.RotationAxis(Axis.Z, -x);
      camera._trackRoll -= x;
      currentRotation.multiplyInPlace(rotationChange);
    }
    currentRotation.toEulerAnglesToRef(camera.rotation);
  }
};
__decorate([
  serialize()
], FlyCameraMouseInput.prototype, "buttons", void 0);
__decorate([
  serialize()
], FlyCameraMouseInput.prototype, "angularSensibility", void 0);
CameraInputTypes["FlyCameraMouseInput"] = FlyCameraMouseInput;

// node_modules/@babylonjs/core/Cameras/Inputs/followCameraKeyboardMoveInput.js
var FollowCameraKeyboardMoveInput = class {
  constructor() {
    this.keysHeightOffsetIncr = [38];
    this.keysHeightOffsetDecr = [40];
    this.keysHeightOffsetModifierAlt = false;
    this.keysHeightOffsetModifierCtrl = false;
    this.keysHeightOffsetModifierShift = false;
    this.keysRotationOffsetIncr = [37];
    this.keysRotationOffsetDecr = [39];
    this.keysRotationOffsetModifierAlt = false;
    this.keysRotationOffsetModifierCtrl = false;
    this.keysRotationOffsetModifierShift = false;
    this.keysRadiusIncr = [40];
    this.keysRadiusDecr = [38];
    this.keysRadiusModifierAlt = true;
    this.keysRadiusModifierCtrl = false;
    this.keysRadiusModifierShift = false;
    this.heightSensibility = 1;
    this.rotationSensibility = 1;
    this.radiusSensibility = 1;
    this._keys = new Array();
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    if (this._onCanvasBlurObserver) {
      return;
    }
    this._scene = this.camera.getScene();
    this._engine = this._scene.getEngine();
    this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
      this._keys.length = 0;
    });
    this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
      const evt = info.event;
      if (!evt.metaKey) {
        if (info.type === KeyboardEventTypes.KEYDOWN) {
          this._ctrlPressed = evt.ctrlKey;
          this._altPressed = evt.altKey;
          this._shiftPressed = evt.shiftKey;
          if (this.keysHeightOffsetIncr.indexOf(evt.keyCode) !== -1 || this.keysHeightOffsetDecr.indexOf(evt.keyCode) !== -1 || this.keysRotationOffsetIncr.indexOf(evt.keyCode) !== -1 || this.keysRotationOffsetDecr.indexOf(evt.keyCode) !== -1 || this.keysRadiusIncr.indexOf(evt.keyCode) !== -1 || this.keysRadiusDecr.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            if (index === -1) {
              this._keys.push(evt.keyCode);
            }
            if (evt.preventDefault) {
              if (!noPreventDefault) {
                evt.preventDefault();
              }
            }
          }
        } else {
          if (this.keysHeightOffsetIncr.indexOf(evt.keyCode) !== -1 || this.keysHeightOffsetDecr.indexOf(evt.keyCode) !== -1 || this.keysRotationOffsetIncr.indexOf(evt.keyCode) !== -1 || this.keysRotationOffsetDecr.indexOf(evt.keyCode) !== -1 || this.keysRadiusIncr.indexOf(evt.keyCode) !== -1 || this.keysRadiusDecr.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            if (index >= 0) {
              this._keys.splice(index, 1);
            }
            if (evt.preventDefault) {
              if (!noPreventDefault) {
                evt.preventDefault();
              }
            }
          }
        }
      }
    });
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._scene) {
      if (this._onKeyboardObserver) {
        this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
      }
      if (this._onCanvasBlurObserver) {
        this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
      }
      this._onKeyboardObserver = null;
      this._onCanvasBlurObserver = null;
    }
    this._keys.length = 0;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._onKeyboardObserver) {
      this._keys.forEach((keyCode) => {
        if (this.keysHeightOffsetIncr.indexOf(keyCode) !== -1 && this._modifierHeightOffset()) {
          this.camera.heightOffset += this.heightSensibility;
        } else if (this.keysHeightOffsetDecr.indexOf(keyCode) !== -1 && this._modifierHeightOffset()) {
          this.camera.heightOffset -= this.heightSensibility;
        } else if (this.keysRotationOffsetIncr.indexOf(keyCode) !== -1 && this._modifierRotationOffset()) {
          this.camera.rotationOffset += this.rotationSensibility;
          this.camera.rotationOffset %= 360;
        } else if (this.keysRotationOffsetDecr.indexOf(keyCode) !== -1 && this._modifierRotationOffset()) {
          this.camera.rotationOffset -= this.rotationSensibility;
          this.camera.rotationOffset %= 360;
        } else if (this.keysRadiusIncr.indexOf(keyCode) !== -1 && this._modifierRadius()) {
          this.camera.radius += this.radiusSensibility;
        } else if (this.keysRadiusDecr.indexOf(keyCode) !== -1 && this._modifierRadius()) {
          this.camera.radius -= this.radiusSensibility;
        }
      });
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FollowCameraKeyboardMoveInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "keyboard";
  }
  /**
   * Check if the pressed modifier keys (Alt/Ctrl/Shift) match those configured to
   * allow modification of the heightOffset value.
   */
  _modifierHeightOffset() {
    return this.keysHeightOffsetModifierAlt === this._altPressed && this.keysHeightOffsetModifierCtrl === this._ctrlPressed && this.keysHeightOffsetModifierShift === this._shiftPressed;
  }
  /**
   * Check if the pressed modifier keys (Alt/Ctrl/Shift) match those configured to
   * allow modification of the rotationOffset value.
   */
  _modifierRotationOffset() {
    return this.keysRotationOffsetModifierAlt === this._altPressed && this.keysRotationOffsetModifierCtrl === this._ctrlPressed && this.keysRotationOffsetModifierShift === this._shiftPressed;
  }
  /**
   * Check if the pressed modifier keys (Alt/Ctrl/Shift) match those configured to
   * allow modification of the radius value.
   */
  _modifierRadius() {
    return this.keysRadiusModifierAlt === this._altPressed && this.keysRadiusModifierCtrl === this._ctrlPressed && this.keysRadiusModifierShift === this._shiftPressed;
  }
};
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysHeightOffsetIncr", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysHeightOffsetDecr", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysHeightOffsetModifierAlt", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysHeightOffsetModifierCtrl", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysHeightOffsetModifierShift", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRotationOffsetIncr", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRotationOffsetDecr", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRotationOffsetModifierAlt", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRotationOffsetModifierCtrl", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRotationOffsetModifierShift", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRadiusIncr", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRadiusDecr", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRadiusModifierAlt", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRadiusModifierCtrl", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "keysRadiusModifierShift", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "heightSensibility", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "rotationSensibility", void 0);
__decorate([
  serialize()
], FollowCameraKeyboardMoveInput.prototype, "radiusSensibility", void 0);
CameraInputTypes["FollowCameraKeyboardMoveInput"] = FollowCameraKeyboardMoveInput;

// node_modules/@babylonjs/core/Cameras/Inputs/followCameraMouseWheelInput.js
var FollowCameraMouseWheelInput = class {
  constructor() {
    this.axisControlRadius = true;
    this.axisControlHeight = false;
    this.axisControlRotation = false;
    this.wheelPrecision = 3;
    this.wheelDeltaPercentage = 0;
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this._wheel = (p) => {
      if (p.type !== PointerEventTypes.POINTERWHEEL) {
        return;
      }
      const event = p.event;
      let delta = 0;
      const wheelDelta = Math.max(-1, Math.min(1, event.deltaY));
      if (this.wheelDeltaPercentage) {
        console.assert(this.axisControlRadius + this.axisControlHeight + this.axisControlRotation <= 1, "wheelDeltaPercentage only usable when mouse wheel controls ONE axis. Currently enabled: axisControlRadius: " + this.axisControlRadius + ", axisControlHeightOffset: " + this.axisControlHeight + ", axisControlRotationOffset: " + this.axisControlRotation);
        if (this.axisControlRadius) {
          delta = wheelDelta * 0.01 * this.wheelDeltaPercentage * this.camera.radius;
        } else if (this.axisControlHeight) {
          delta = wheelDelta * 0.01 * this.wheelDeltaPercentage * this.camera.heightOffset;
        } else if (this.axisControlRotation) {
          delta = wheelDelta * 0.01 * this.wheelDeltaPercentage * this.camera.rotationOffset;
        }
      } else {
        delta = wheelDelta * this.wheelPrecision;
      }
      if (delta) {
        if (this.axisControlRadius) {
          this.camera.radius += delta;
        } else if (this.axisControlHeight) {
          this.camera.heightOffset -= delta;
        } else if (this.axisControlRotation) {
          this.camera.rotationOffset -= delta;
        }
      }
      if (event.preventDefault) {
        if (!noPreventDefault) {
          event.preventDefault();
        }
      }
    };
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._wheel, PointerEventTypes.POINTERWHEEL);
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._observer) {
      this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
      this._observer = null;
      this._wheel = null;
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCameraMouseWheelInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "mousewheel";
  }
};
__decorate([
  serialize()
], FollowCameraMouseWheelInput.prototype, "axisControlRadius", void 0);
__decorate([
  serialize()
], FollowCameraMouseWheelInput.prototype, "axisControlHeight", void 0);
__decorate([
  serialize()
], FollowCameraMouseWheelInput.prototype, "axisControlRotation", void 0);
__decorate([
  serialize()
], FollowCameraMouseWheelInput.prototype, "wheelPrecision", void 0);
__decorate([
  serialize()
], FollowCameraMouseWheelInput.prototype, "wheelDeltaPercentage", void 0);
CameraInputTypes["FollowCameraMouseWheelInput"] = FollowCameraMouseWheelInput;

// node_modules/@babylonjs/core/Cameras/Inputs/followCameraPointersInput.js
var FollowCameraPointersInput = class extends BaseCameraPointersInput {
  constructor() {
    super(...arguments);
    this.angularSensibilityX = 1;
    this.angularSensibilityY = 1;
    this.pinchPrecision = 1e4;
    this.pinchDeltaPercentage = 0;
    this.axisXControlRadius = false;
    this.axisXControlHeight = false;
    this.axisXControlRotation = true;
    this.axisYControlRadius = false;
    this.axisYControlHeight = true;
    this.axisYControlRotation = false;
    this.axisPinchControlRadius = true;
    this.axisPinchControlHeight = false;
    this.axisPinchControlRotation = false;
    this.warningEnable = true;
    this._warningCounter = 0;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FollowCameraPointersInput";
  }
  onTouch(pointA, offsetX, offsetY) {
    this._warning();
    if (this.axisXControlRotation) {
      this.camera.rotationOffset += offsetX / this.angularSensibilityX;
    } else if (this.axisYControlRotation) {
      this.camera.rotationOffset += offsetY / this.angularSensibilityX;
    }
    if (this.axisXControlHeight) {
      this.camera.heightOffset += offsetX / this.angularSensibilityY;
    } else if (this.axisYControlHeight) {
      this.camera.heightOffset += offsetY / this.angularSensibilityY;
    }
    if (this.axisXControlRadius) {
      this.camera.radius -= offsetX / this.angularSensibilityY;
    } else if (this.axisYControlRadius) {
      this.camera.radius -= offsetY / this.angularSensibilityY;
    }
  }
  onMultiTouch(pointA, pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) {
    if (previousPinchSquaredDistance === 0 && previousMultiTouchPanPosition === null) {
      return;
    }
    if (pinchSquaredDistance === 0 && multiTouchPanPosition === null) {
      return;
    }
    let pinchDelta = (pinchSquaredDistance - previousPinchSquaredDistance) / (this.pinchPrecision * (this.angularSensibilityX + this.angularSensibilityY) / 2);
    if (this.pinchDeltaPercentage) {
      pinchDelta *= 0.01 * this.pinchDeltaPercentage;
      if (this.axisPinchControlRotation) {
        this.camera.rotationOffset += pinchDelta * this.camera.rotationOffset;
      }
      if (this.axisPinchControlHeight) {
        this.camera.heightOffset += pinchDelta * this.camera.heightOffset;
      }
      if (this.axisPinchControlRadius) {
        this.camera.radius -= pinchDelta * this.camera.radius;
      }
    } else {
      if (this.axisPinchControlRotation) {
        this.camera.rotationOffset += pinchDelta;
      }
      if (this.axisPinchControlHeight) {
        this.camera.heightOffset += pinchDelta;
      }
      if (this.axisPinchControlRadius) {
        this.camera.radius -= pinchDelta;
      }
    }
  }
  _warning() {
    if (!this.warningEnable || this._warningCounter++ % 100 !== 0) {
      return;
    }
    const warn = "It probably only makes sense to control ONE camera property with each pointer axis. Set 'warningEnable = false' if you are sure. Currently enabled: ";
    console.assert(this.axisXControlRotation + this.axisXControlHeight + this.axisXControlRadius <= 1, warn + "axisXControlRotation: " + this.axisXControlRotation + ", axisXControlHeight: " + this.axisXControlHeight + ", axisXControlRadius: " + this.axisXControlRadius);
    console.assert(this.axisYControlRotation + this.axisYControlHeight + this.axisYControlRadius <= 1, warn + "axisYControlRotation: " + this.axisYControlRotation + ", axisYControlHeight: " + this.axisYControlHeight + ", axisYControlRadius: " + this.axisYControlRadius);
    console.assert(this.axisPinchControlRotation + this.axisPinchControlHeight + this.axisPinchControlRadius <= 1, warn + "axisPinchControlRotation: " + this.axisPinchControlRotation + ", axisPinchControlHeight: " + this.axisPinchControlHeight + ", axisPinchControlRadius: " + this.axisPinchControlRadius);
  }
};
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "angularSensibilityX", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "angularSensibilityY", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "pinchPrecision", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "pinchDeltaPercentage", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisXControlRadius", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisXControlHeight", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisXControlRotation", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisYControlRadius", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisYControlHeight", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisYControlRotation", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisPinchControlRadius", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisPinchControlHeight", void 0);
__decorate([
  serialize()
], FollowCameraPointersInput.prototype, "axisPinchControlRotation", void 0);
CameraInputTypes["FollowCameraPointersInput"] = FollowCameraPointersInput;

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraKeyboardMoveInput.js
var FreeCameraKeyboardMoveInput = class {
  constructor() {
    this.keysUp = [38];
    this.keysUpward = [33];
    this.keysDown = [40];
    this.keysDownward = [34];
    this.keysLeft = [37];
    this.keysRight = [39];
    this.rotationSpeed = 0.5;
    this.keysRotateLeft = [];
    this.keysRotateRight = [];
    this.keysRotateUp = [];
    this.keysRotateDown = [];
    this._keys = new Array();
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    if (this._onCanvasBlurObserver) {
      return;
    }
    this._scene = this.camera.getScene();
    this._engine = this._scene.getEngine();
    this._onCanvasBlurObserver = this._engine.onCanvasBlurObservable.add(() => {
      this._keys.length = 0;
    });
    this._onKeyboardObserver = this._scene.onKeyboardObservable.add((info) => {
      const evt = info.event;
      if (!evt.metaKey) {
        if (info.type === KeyboardEventTypes.KEYDOWN) {
          if (this.keysUp.indexOf(evt.keyCode) !== -1 || this.keysDown.indexOf(evt.keyCode) !== -1 || this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1 || this.keysUpward.indexOf(evt.keyCode) !== -1 || this.keysDownward.indexOf(evt.keyCode) !== -1 || this.keysRotateLeft.indexOf(evt.keyCode) !== -1 || this.keysRotateRight.indexOf(evt.keyCode) !== -1 || this.keysRotateUp.indexOf(evt.keyCode) !== -1 || this.keysRotateDown.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            if (index === -1) {
              this._keys.push(evt.keyCode);
            }
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        } else {
          if (this.keysUp.indexOf(evt.keyCode) !== -1 || this.keysDown.indexOf(evt.keyCode) !== -1 || this.keysLeft.indexOf(evt.keyCode) !== -1 || this.keysRight.indexOf(evt.keyCode) !== -1 || this.keysUpward.indexOf(evt.keyCode) !== -1 || this.keysDownward.indexOf(evt.keyCode) !== -1 || this.keysRotateLeft.indexOf(evt.keyCode) !== -1 || this.keysRotateRight.indexOf(evt.keyCode) !== -1 || this.keysRotateUp.indexOf(evt.keyCode) !== -1 || this.keysRotateDown.indexOf(evt.keyCode) !== -1) {
            const index = this._keys.indexOf(evt.keyCode);
            if (index >= 0) {
              this._keys.splice(index, 1);
            }
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        }
      }
    });
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._scene) {
      if (this._onKeyboardObserver) {
        this._scene.onKeyboardObservable.remove(this._onKeyboardObserver);
      }
      if (this._onCanvasBlurObserver) {
        this._engine.onCanvasBlurObservable.remove(this._onCanvasBlurObserver);
      }
      this._onKeyboardObserver = null;
      this._onCanvasBlurObserver = null;
    }
    this._keys.length = 0;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._onKeyboardObserver) {
      const camera = this.camera;
      for (let index = 0; index < this._keys.length; index++) {
        const keyCode = this._keys[index];
        const speed = camera._computeLocalCameraSpeed();
        if (this.keysLeft.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(-speed, 0, 0);
        } else if (this.keysUp.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, speed);
        } else if (this.keysRight.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(speed, 0, 0);
        } else if (this.keysDown.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, -speed);
        } else if (this.keysUpward.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, speed, 0);
        } else if (this.keysDownward.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, -speed, 0);
        } else if (this.keysRotateLeft.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, 0);
          camera.cameraRotation.y -= this._getLocalRotation();
        } else if (this.keysRotateRight.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, 0);
          camera.cameraRotation.y += this._getLocalRotation();
        } else if (this.keysRotateUp.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, 0);
          camera.cameraRotation.x -= this._getLocalRotation();
        } else if (this.keysRotateDown.indexOf(keyCode) !== -1) {
          camera._localDirection.copyFromFloats(0, 0, 0);
          camera.cameraRotation.x += this._getLocalRotation();
        }
        if (camera.getScene().useRightHandedSystem) {
          camera._localDirection.z *= -1;
        }
        camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
        Vector3.TransformNormalToRef(camera._localDirection, camera._cameraTransformMatrix, camera._transformedDirection);
        camera.cameraDirection.addInPlace(camera._transformedDirection);
      }
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraKeyboardMoveInput";
  }
  /** @internal */
  _onLostFocus() {
    this._keys.length = 0;
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "keyboard";
  }
  _getLocalRotation() {
    const handednessMultiplier = this.camera._calculateHandednessMultiplier();
    const rotation = this.rotationSpeed * this._engine.getDeltaTime() / 1e3 * handednessMultiplier;
    return rotation;
  }
};
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysUp", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysUpward", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysDown", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysDownward", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysLeft", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysRight", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "rotationSpeed", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysRotateLeft", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysRotateRight", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysRotateUp", void 0);
__decorate([
  serialize()
], FreeCameraKeyboardMoveInput.prototype, "keysRotateDown", void 0);
CameraInputTypes["FreeCameraKeyboardMoveInput"] = FreeCameraKeyboardMoveInput;

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraMouseInput.js
var FreeCameraMouseInput = class {
  /**
   * Manage the mouse inputs to control the movement of a free camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
   * @param touchEnabled Defines if touch is enabled or not
   */
  constructor(touchEnabled = true) {
    this.touchEnabled = touchEnabled;
    this.buttons = [0, 1, 2];
    this.angularSensibility = 2e3;
    this._previousPosition = null;
    this.onPointerMovedObservable = new Observable();
    this._allowCameraRotation = true;
    this._currentActiveButton = -1;
    this._activePointerId = -1;
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    const engine = this.camera.getEngine();
    const element = engine.getInputElement();
    if (!this._pointerInput) {
      this._pointerInput = (p) => {
        const evt = p.event;
        const isTouch = evt.pointerType === "touch";
        if (!this.touchEnabled && isTouch) {
          return;
        }
        if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
          return;
        }
        const srcElement = evt.target;
        if (p.type === PointerEventTypes.POINTERDOWN) {
          if (isTouch && this._activePointerId !== -1 || !isTouch && this._currentActiveButton !== -1) {
            return;
          }
          this._activePointerId = evt.pointerId;
          try {
            srcElement === null || srcElement === void 0 ? void 0 : srcElement.setPointerCapture(evt.pointerId);
          } catch (e) {
          }
          if (this._currentActiveButton === -1) {
            this._currentActiveButton = evt.button;
          }
          this._previousPosition = {
            x: evt.clientX,
            y: evt.clientY
          };
          if (!noPreventDefault) {
            evt.preventDefault();
            element && element.focus();
          }
          if (engine.isPointerLock && this._onMouseMove) {
            this._onMouseMove(p.event);
          }
        } else if (p.type === PointerEventTypes.POINTERUP) {
          if (isTouch && this._activePointerId !== evt.pointerId || !isTouch && this._currentActiveButton !== evt.button) {
            return;
          }
          try {
            srcElement === null || srcElement === void 0 ? void 0 : srcElement.releasePointerCapture(evt.pointerId);
          } catch (e) {
          }
          this._currentActiveButton = -1;
          this._previousPosition = null;
          if (!noPreventDefault) {
            evt.preventDefault();
          }
          this._activePointerId = -1;
        } else if (p.type === PointerEventTypes.POINTERMOVE && (this._activePointerId === evt.pointerId || !isTouch)) {
          if (engine.isPointerLock && this._onMouseMove) {
            this._onMouseMove(p.event);
          } else if (this._previousPosition) {
            const handednessMultiplier = this.camera._calculateHandednessMultiplier();
            const offsetX = (evt.clientX - this._previousPosition.x) * handednessMultiplier;
            const offsetY = evt.clientY - this._previousPosition.y;
            if (this._allowCameraRotation) {
              this.camera.cameraRotation.y += offsetX / this.angularSensibility;
              this.camera.cameraRotation.x += offsetY / this.angularSensibility;
            }
            this.onPointerMovedObservable.notifyObservers({ offsetX, offsetY });
            this._previousPosition = {
              x: evt.clientX,
              y: evt.clientY
            };
            if (!noPreventDefault) {
              evt.preventDefault();
            }
          }
        }
      };
    }
    this._onMouseMove = (evt) => {
      if (!engine.isPointerLock) {
        return;
      }
      const handednessMultiplier = this.camera._calculateHandednessMultiplier();
      const offsetX = evt.movementX * handednessMultiplier;
      this.camera.cameraRotation.y += offsetX / this.angularSensibility;
      const offsetY = evt.movementY;
      this.camera.cameraRotation.x += offsetY / this.angularSensibility;
      this._previousPosition = null;
      if (!noPreventDefault) {
        evt.preventDefault();
      }
    };
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
    if (element) {
      this._contextMenuBind = (evt) => this.onContextMenu(evt);
      element.addEventListener("contextmenu", this._contextMenuBind, false);
    }
  }
  /**
   * Called on JS contextmenu event.
   * Override this method to provide functionality.
   * @param evt
   */
  onContextMenu(evt) {
    evt.preventDefault();
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._observer) {
      this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
      if (this._contextMenuBind) {
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        element && element.removeEventListener("contextmenu", this._contextMenuBind);
      }
      if (this.onPointerMovedObservable) {
        this.onPointerMovedObservable.clear();
      }
      this._observer = null;
      this._onMouseMove = null;
      this._previousPosition = null;
    }
    this._activePointerId = -1;
    this._currentActiveButton = -1;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraMouseInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "mouse";
  }
};
__decorate([
  serialize()
], FreeCameraMouseInput.prototype, "buttons", void 0);
__decorate([
  serialize()
], FreeCameraMouseInput.prototype, "angularSensibility", void 0);
CameraInputTypes["FreeCameraMouseInput"] = FreeCameraMouseInput;

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraMouseWheelInput.js
var _CameraProperty;
(function(_CameraProperty2) {
  _CameraProperty2[_CameraProperty2["MoveRelative"] = 0] = "MoveRelative";
  _CameraProperty2[_CameraProperty2["RotateRelative"] = 1] = "RotateRelative";
  _CameraProperty2[_CameraProperty2["MoveScene"] = 2] = "MoveScene";
})(_CameraProperty || (_CameraProperty = {}));
var FreeCameraMouseWheelInput = class extends BaseCameraMouseWheelInput {
  constructor() {
    super(...arguments);
    this._moveRelative = Vector3.Zero();
    this._rotateRelative = Vector3.Zero();
    this._moveScene = Vector3.Zero();
    this._wheelXAction = _CameraProperty.MoveRelative;
    this._wheelXActionCoordinate = Coordinate.X;
    this._wheelYAction = _CameraProperty.MoveRelative;
    this._wheelYActionCoordinate = Coordinate.Z;
    this._wheelZAction = null;
    this._wheelZActionCoordinate = null;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraMouseWheelInput";
  }
  /**
   * Set which movement axis (relative to camera's orientation) the mouse
   * wheel's X axis controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelXMoveRelative(axis) {
    if (axis === null && this._wheelXAction !== _CameraProperty.MoveRelative) {
      return;
    }
    this._wheelXAction = _CameraProperty.MoveRelative;
    this._wheelXActionCoordinate = axis;
  }
  /**
   * Get the configured movement axis (relative to camera's orientation) the
   * mouse wheel's X axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelXMoveRelative() {
    if (this._wheelXAction !== _CameraProperty.MoveRelative) {
      return null;
    }
    return this._wheelXActionCoordinate;
  }
  /**
   * Set which movement axis (relative to camera's orientation) the mouse
   * wheel's Y axis controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelYMoveRelative(axis) {
    if (axis === null && this._wheelYAction !== _CameraProperty.MoveRelative) {
      return;
    }
    this._wheelYAction = _CameraProperty.MoveRelative;
    this._wheelYActionCoordinate = axis;
  }
  /**
   * Get the configured movement axis (relative to camera's orientation) the
   * mouse wheel's Y axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelYMoveRelative() {
    if (this._wheelYAction !== _CameraProperty.MoveRelative) {
      return null;
    }
    return this._wheelYActionCoordinate;
  }
  /**
   * Set which movement axis (relative to camera's orientation) the mouse
   * wheel's Z axis controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelZMoveRelative(axis) {
    if (axis === null && this._wheelZAction !== _CameraProperty.MoveRelative) {
      return;
    }
    this._wheelZAction = _CameraProperty.MoveRelative;
    this._wheelZActionCoordinate = axis;
  }
  /**
   * Get the configured movement axis (relative to camera's orientation) the
   * mouse wheel's Z axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelZMoveRelative() {
    if (this._wheelZAction !== _CameraProperty.MoveRelative) {
      return null;
    }
    return this._wheelZActionCoordinate;
  }
  /**
   * Set which rotation axis (relative to camera's orientation) the mouse
   * wheel's X axis controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelXRotateRelative(axis) {
    if (axis === null && this._wheelXAction !== _CameraProperty.RotateRelative) {
      return;
    }
    this._wheelXAction = _CameraProperty.RotateRelative;
    this._wheelXActionCoordinate = axis;
  }
  /**
   * Get the configured rotation axis (relative to camera's orientation) the
   * mouse wheel's X axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelXRotateRelative() {
    if (this._wheelXAction !== _CameraProperty.RotateRelative) {
      return null;
    }
    return this._wheelXActionCoordinate;
  }
  /**
   * Set which rotation axis (relative to camera's orientation) the mouse
   * wheel's Y axis controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelYRotateRelative(axis) {
    if (axis === null && this._wheelYAction !== _CameraProperty.RotateRelative) {
      return;
    }
    this._wheelYAction = _CameraProperty.RotateRelative;
    this._wheelYActionCoordinate = axis;
  }
  /**
   * Get the configured rotation axis (relative to camera's orientation) the
   * mouse wheel's Y axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelYRotateRelative() {
    if (this._wheelYAction !== _CameraProperty.RotateRelative) {
      return null;
    }
    return this._wheelYActionCoordinate;
  }
  /**
   * Set which rotation axis (relative to camera's orientation) the mouse
   * wheel's Z axis controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelZRotateRelative(axis) {
    if (axis === null && this._wheelZAction !== _CameraProperty.RotateRelative) {
      return;
    }
    this._wheelZAction = _CameraProperty.RotateRelative;
    this._wheelZActionCoordinate = axis;
  }
  /**
   * Get the configured rotation axis (relative to camera's orientation) the
   * mouse wheel's Z axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelZRotateRelative() {
    if (this._wheelZAction !== _CameraProperty.RotateRelative) {
      return null;
    }
    return this._wheelZActionCoordinate;
  }
  /**
   * Set which movement axis (relative to the scene) the mouse wheel's X axis
   * controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelXMoveScene(axis) {
    if (axis === null && this._wheelXAction !== _CameraProperty.MoveScene) {
      return;
    }
    this._wheelXAction = _CameraProperty.MoveScene;
    this._wheelXActionCoordinate = axis;
  }
  /**
   * Get the configured movement axis (relative to the scene) the mouse wheel's
   * X axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelXMoveScene() {
    if (this._wheelXAction !== _CameraProperty.MoveScene) {
      return null;
    }
    return this._wheelXActionCoordinate;
  }
  /**
   * Set which movement axis (relative to the scene) the mouse wheel's Y axis
   * controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelYMoveScene(axis) {
    if (axis === null && this._wheelYAction !== _CameraProperty.MoveScene) {
      return;
    }
    this._wheelYAction = _CameraProperty.MoveScene;
    this._wheelYActionCoordinate = axis;
  }
  /**
   * Get the configured movement axis (relative to the scene) the mouse wheel's
   * Y axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelYMoveScene() {
    if (this._wheelYAction !== _CameraProperty.MoveScene) {
      return null;
    }
    return this._wheelYActionCoordinate;
  }
  /**
   * Set which movement axis (relative to the scene) the mouse wheel's Z axis
   * controls.
   * @param axis The axis to be moved. Set null to clear.
   */
  set wheelZMoveScene(axis) {
    if (axis === null && this._wheelZAction !== _CameraProperty.MoveScene) {
      return;
    }
    this._wheelZAction = _CameraProperty.MoveScene;
    this._wheelZActionCoordinate = axis;
  }
  /**
   * Get the configured movement axis (relative to the scene) the mouse wheel's
   * Z axis controls.
   * @returns The configured axis or null if none.
   */
  get wheelZMoveScene() {
    if (this._wheelZAction !== _CameraProperty.MoveScene) {
      return null;
    }
    return this._wheelZActionCoordinate;
  }
  /**
   * Called for each rendered frame.
   */
  checkInputs() {
    if (this._wheelDeltaX === 0 && this._wheelDeltaY === 0 && this._wheelDeltaZ == 0) {
      return;
    }
    this._moveRelative.setAll(0);
    this._rotateRelative.setAll(0);
    this._moveScene.setAll(0);
    this._updateCamera();
    if (this.camera.getScene().useRightHandedSystem) {
      this._moveRelative.z *= -1;
    }
    const cameraTransformMatrix = Matrix.Zero();
    this.camera.getViewMatrix().invertToRef(cameraTransformMatrix);
    const transformedDirection = Vector3.Zero();
    Vector3.TransformNormalToRef(this._moveRelative, cameraTransformMatrix, transformedDirection);
    this.camera.cameraRotation.x += this._rotateRelative.x / 200;
    this.camera.cameraRotation.y += this._rotateRelative.y / 200;
    this.camera.cameraDirection.addInPlace(transformedDirection);
    this.camera.cameraDirection.addInPlace(this._moveScene);
    super.checkInputs();
  }
  /**
   * Update the camera according to any configured properties for the 3
   * mouse-wheel axis.
   */
  _updateCamera() {
    this._updateCameraProperty(this._wheelDeltaX, this._wheelXAction, this._wheelXActionCoordinate);
    this._updateCameraProperty(this._wheelDeltaY, this._wheelYAction, this._wheelYActionCoordinate);
    this._updateCameraProperty(this._wheelDeltaZ, this._wheelZAction, this._wheelZActionCoordinate);
  }
  /**
   * Update one property of the camera.
   * @param value
   * @param cameraProperty
   * @param coordinate
   */
  _updateCameraProperty(value, cameraProperty, coordinate) {
    if (value === 0) {
      return;
    }
    if (cameraProperty === null || coordinate === null) {
      return;
    }
    let action = null;
    switch (cameraProperty) {
      case _CameraProperty.MoveRelative:
        action = this._moveRelative;
        break;
      case _CameraProperty.RotateRelative:
        action = this._rotateRelative;
        break;
      case _CameraProperty.MoveScene:
        action = this._moveScene;
        break;
    }
    switch (coordinate) {
      case Coordinate.X:
        action.set(value, 0, 0);
        break;
      case Coordinate.Y:
        action.set(0, value, 0);
        break;
      case Coordinate.Z:
        action.set(0, 0, value);
        break;
    }
  }
};
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelXMoveRelative", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelYMoveRelative", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelZMoveRelative", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelXRotateRelative", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelYRotateRelative", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelZRotateRelative", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelXMoveScene", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelYMoveScene", null);
__decorate([
  serialize()
], FreeCameraMouseWheelInput.prototype, "wheelZMoveScene", null);
CameraInputTypes["FreeCameraMouseWheelInput"] = FreeCameraMouseWheelInput;

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraTouchInput.js
var FreeCameraTouchInput = class {
  /**
   * Manage the touch inputs to control the movement of a free camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
   * @param allowMouse Defines if mouse events can be treated as touch events
   */
  constructor(allowMouse = false) {
    this.allowMouse = allowMouse;
    this.touchAngularSensibility = 2e5;
    this.touchMoveSensibility = 250;
    this.singleFingerRotate = false;
    this._offsetX = null;
    this._offsetY = null;
    this._pointerPressed = new Array();
    this._isSafari = Tools.IsSafari();
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    let previousPosition = null;
    if (this._pointerInput === void 0) {
      this._onLostFocus = () => {
        this._offsetX = null;
        this._offsetY = null;
      };
      this._pointerInput = (p) => {
        const evt = p.event;
        const isMouseEvent = evt.pointerType === "mouse" || this._isSafari && typeof evt.pointerType === "undefined";
        if (!this.allowMouse && isMouseEvent) {
          return;
        }
        if (p.type === PointerEventTypes.POINTERDOWN) {
          if (!noPreventDefault) {
            evt.preventDefault();
          }
          this._pointerPressed.push(evt.pointerId);
          if (this._pointerPressed.length !== 1) {
            return;
          }
          previousPosition = {
            x: evt.clientX,
            y: evt.clientY
          };
        } else if (p.type === PointerEventTypes.POINTERUP) {
          if (!noPreventDefault) {
            evt.preventDefault();
          }
          const index = this._pointerPressed.indexOf(evt.pointerId);
          if (index === -1) {
            return;
          }
          this._pointerPressed.splice(index, 1);
          if (index != 0) {
            return;
          }
          previousPosition = null;
          this._offsetX = null;
          this._offsetY = null;
        } else if (p.type === PointerEventTypes.POINTERMOVE) {
          if (!noPreventDefault) {
            evt.preventDefault();
          }
          if (!previousPosition) {
            return;
          }
          const index = this._pointerPressed.indexOf(evt.pointerId);
          if (index != 0) {
            return;
          }
          this._offsetX = evt.clientX - previousPosition.x;
          this._offsetY = -(evt.clientY - previousPosition.y);
        }
      };
    }
    this._observer = this.camera.getScene()._inputManager._addCameraPointerObserver(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE);
    if (this._onLostFocus) {
      const engine = this.camera.getEngine();
      const element = engine.getInputElement();
      element && element.addEventListener("blur", this._onLostFocus);
    }
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    if (this._pointerInput) {
      if (this._observer) {
        this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
        this._observer = null;
      }
      if (this._onLostFocus) {
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        element && element.removeEventListener("blur", this._onLostFocus);
        this._onLostFocus = null;
      }
      this._pointerPressed.length = 0;
      this._offsetX = null;
      this._offsetY = null;
    }
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._offsetX === null || this._offsetY === null) {
      return;
    }
    if (this._offsetX === 0 && this._offsetY === 0) {
      return;
    }
    const camera = this.camera;
    const handednessMultiplier = camera._calculateHandednessMultiplier();
    camera.cameraRotation.y = handednessMultiplier * this._offsetX / this.touchAngularSensibility;
    const rotateCamera = this.singleFingerRotate && this._pointerPressed.length === 1 || !this.singleFingerRotate && this._pointerPressed.length > 1;
    if (rotateCamera) {
      camera.cameraRotation.x = -this._offsetY / this.touchAngularSensibility;
    } else {
      const speed = camera._computeLocalCameraSpeed();
      const direction = new Vector3(0, 0, this.touchMoveSensibility !== 0 ? speed * this._offsetY / this.touchMoveSensibility : 0);
      Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, camera._cameraRotationMatrix);
      camera.cameraDirection.addInPlace(Vector3.TransformCoordinates(direction, camera._cameraRotationMatrix));
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraTouchInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "touch";
  }
};
__decorate([
  serialize()
], FreeCameraTouchInput.prototype, "touchAngularSensibility", void 0);
__decorate([
  serialize()
], FreeCameraTouchInput.prototype, "touchMoveSensibility", void 0);
CameraInputTypes["FreeCameraTouchInput"] = FreeCameraTouchInput;

// node_modules/@babylonjs/core/Cameras/freeCameraInputsManager.js
var FreeCameraInputsManager = class extends CameraInputsManager {
  /**
   * Instantiates a new FreeCameraInputsManager.
   * @param camera Defines the camera the inputs belong to
   */
  constructor(camera) {
    super(camera);
    this._mouseInput = null;
    this._mouseWheelInput = null;
  }
  /**
   * Add keyboard input support to the input manager.
   * @returns the current input manager
   */
  addKeyboard() {
    this.add(new FreeCameraKeyboardMoveInput());
    return this;
  }
  /**
   * Add mouse input support to the input manager.
   * @param touchEnabled if the FreeCameraMouseInput should support touch (default: true)
   * @returns the current input manager
   */
  addMouse(touchEnabled = true) {
    if (!this._mouseInput) {
      this._mouseInput = new FreeCameraMouseInput(touchEnabled);
      this.add(this._mouseInput);
    }
    return this;
  }
  /**
   * Removes the mouse input support from the manager
   * @returns the current input manager
   */
  removeMouse() {
    if (this._mouseInput) {
      this.remove(this._mouseInput);
    }
    return this;
  }
  /**
   * Add mouse wheel input support to the input manager.
   * @returns the current input manager
   */
  addMouseWheel() {
    if (!this._mouseWheelInput) {
      this._mouseWheelInput = new FreeCameraMouseWheelInput();
      this.add(this._mouseWheelInput);
    }
    return this;
  }
  /**
   * Removes the mouse wheel input support from the manager
   * @returns the current input manager
   */
  removeMouseWheel() {
    if (this._mouseWheelInput) {
      this.remove(this._mouseWheelInput);
    }
    return this;
  }
  /**
   * Add touch input support to the input manager.
   * @returns the current input manager
   */
  addTouch() {
    this.add(new FreeCameraTouchInput());
    return this;
  }
  /**
   * Remove all attached input methods from a camera
   */
  clear() {
    super.clear();
    this._mouseInput = null;
  }
};

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraDeviceOrientationInput.js
FreeCameraInputsManager.prototype.addDeviceOrientation = function(smoothFactor) {
  if (!this._deviceOrientationInput) {
    this._deviceOrientationInput = new FreeCameraDeviceOrientationInput();
    if (smoothFactor) {
      this._deviceOrientationInput.smoothFactor = smoothFactor;
    }
    this.add(this._deviceOrientationInput);
  }
  return this;
};
var FreeCameraDeviceOrientationInput = class {
  /**
   * Can be used to detect if a device orientation sensor is available on a device
   * @param timeout amount of time in milliseconds to wait for a response from the sensor (default: infinite)
   * @returns a promise that will resolve on orientation change
   */
  static WaitForOrientationChangeAsync(timeout) {
    return new Promise((res, rej) => {
      let gotValue = false;
      const eventHandler = () => {
        window.removeEventListener("deviceorientation", eventHandler);
        gotValue = true;
        res();
      };
      if (timeout) {
        setTimeout(() => {
          if (!gotValue) {
            window.removeEventListener("deviceorientation", eventHandler);
            rej("WaitForOrientationChangeAsync timed out");
          }
        }, timeout);
      }
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then((response) => {
          if (response == "granted") {
            window.addEventListener("deviceorientation", eventHandler);
          } else {
            Tools.Warn("Permission not granted.");
          }
        }).catch((error) => {
          Tools.Error(error);
        });
      } else {
        window.addEventListener("deviceorientation", eventHandler);
      }
    });
  }
  /**
   * Instantiates a new input
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/customizingCameraInputs
   */
  constructor() {
    this._screenOrientationAngle = 0;
    this._screenQuaternion = new Quaternion();
    this._alpha = 0;
    this._beta = 0;
    this._gamma = 0;
    this.smoothFactor = 0;
    this._onDeviceOrientationChangedObservable = new Observable();
    this._orientationChanged = () => {
      this._screenOrientationAngle = window.orientation !== void 0 ? +window.orientation : window.screen.orientation && window.screen.orientation["angle"] ? window.screen.orientation.angle : 0;
      this._screenOrientationAngle = -Tools.ToRadians(this._screenOrientationAngle / 2);
      this._screenQuaternion.copyFromFloats(0, Math.sin(this._screenOrientationAngle), 0, Math.cos(this._screenOrientationAngle));
    };
    this._deviceOrientation = (evt) => {
      if (this.smoothFactor) {
        this._alpha = evt.alpha !== null ? Tools.SmoothAngleChange(this._alpha, evt.alpha, this.smoothFactor) : 0;
        this._beta = evt.beta !== null ? Tools.SmoothAngleChange(this._beta, evt.beta, this.smoothFactor) : 0;
        this._gamma = evt.gamma !== null ? Tools.SmoothAngleChange(this._gamma, evt.gamma, this.smoothFactor) : 0;
      } else {
        this._alpha = evt.alpha !== null ? evt.alpha : 0;
        this._beta = evt.beta !== null ? evt.beta : 0;
        this._gamma = evt.gamma !== null ? evt.gamma : 0;
      }
      if (evt.alpha !== null) {
        this._onDeviceOrientationChangedObservable.notifyObservers();
      }
    };
    this._constantTranform = new Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    this._orientationChanged();
  }
  /**
   * Define the camera controlled by the input.
   */
  get camera() {
    return this._camera;
  }
  set camera(camera) {
    this._camera = camera;
    if (this._camera != null && !this._camera.rotationQuaternion) {
      this._camera.rotationQuaternion = new Quaternion();
    }
    if (this._camera) {
      this._camera.onDisposeObservable.add(() => {
        this._onDeviceOrientationChangedObservable.clear();
      });
    }
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   */
  attachControl() {
    const hostWindow = this.camera.getScene().getEngine().getHostWindow();
    if (hostWindow) {
      const eventHandler = () => {
        hostWindow.addEventListener("orientationchange", this._orientationChanged);
        hostWindow.addEventListener("deviceorientation", this._deviceOrientation);
        this._orientationChanged();
      };
      if (typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission().then((response) => {
          if (response === "granted") {
            eventHandler();
          } else {
            Tools.Warn("Permission not granted.");
          }
        }).catch((error) => {
          Tools.Error(error);
        });
      } else {
        eventHandler();
      }
    }
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    window.removeEventListener("orientationchange", this._orientationChanged);
    window.removeEventListener("deviceorientation", this._deviceOrientation);
    this._alpha = 0;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (!this._alpha) {
      return;
    }
    Quaternion.RotationYawPitchRollToRef(Tools.ToRadians(this._alpha), Tools.ToRadians(this._beta), -Tools.ToRadians(this._gamma), this.camera.rotationQuaternion);
    this._camera.rotationQuaternion.multiplyInPlace(this._screenQuaternion);
    this._camera.rotationQuaternion.multiplyInPlace(this._constantTranform);
    this._camera.rotationQuaternion.z *= -1;
    this._camera.rotationQuaternion.w *= -1;
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraDeviceOrientationInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "deviceOrientation";
  }
};
CameraInputTypes["FreeCameraDeviceOrientationInput"] = FreeCameraDeviceOrientationInput;

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraGamepadInput.js
var FreeCameraGamepadInput = class {
  constructor() {
    this.gamepadAngularSensibility = 200;
    this.gamepadMoveSensibility = 40;
    this.deadzoneDelta = 0.1;
    this._yAxisScale = 1;
    this._cameraTransform = Matrix.Identity();
    this._deltaTransform = Vector3.Zero();
    this._vector3 = Vector3.Zero();
    this._vector2 = Vector2.Zero();
  }
  /**
   * Gets or sets a boolean indicating that Yaxis (for right stick) should be inverted
   */
  get invertYAxis() {
    return this._yAxisScale !== 1;
  }
  set invertYAxis(value) {
    this._yAxisScale = value ? -1 : 1;
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   */
  attachControl() {
    const manager = this.camera.getScene().gamepadManager;
    this._onGamepadConnectedObserver = manager.onGamepadConnectedObservable.add((gamepad) => {
      if (gamepad.type !== Gamepad.POSE_ENABLED) {
        if (!this.gamepad || gamepad.type === Gamepad.XBOX) {
          this.gamepad = gamepad;
        }
      }
    });
    this._onGamepadDisconnectedObserver = manager.onGamepadDisconnectedObservable.add((gamepad) => {
      if (this.gamepad === gamepad) {
        this.gamepad = null;
      }
    });
    this.gamepad = manager.getGamepadByType(Gamepad.XBOX);
    if (!this.gamepad && manager.gamepads.length) {
      this.gamepad = manager.gamepads[0];
    }
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    this.camera.getScene().gamepadManager.onGamepadConnectedObservable.remove(this._onGamepadConnectedObserver);
    this.camera.getScene().gamepadManager.onGamepadDisconnectedObservable.remove(this._onGamepadDisconnectedObserver);
    this.gamepad = null;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this.gamepad && this.gamepad.leftStick) {
      const camera = this.camera;
      const lsValues = this.gamepad.leftStick;
      if (this.gamepadMoveSensibility !== 0) {
        lsValues.x = Math.abs(lsValues.x) > this.deadzoneDelta ? lsValues.x / this.gamepadMoveSensibility : 0;
        lsValues.y = Math.abs(lsValues.y) > this.deadzoneDelta ? lsValues.y / this.gamepadMoveSensibility : 0;
      }
      let rsValues = this.gamepad.rightStick;
      if (rsValues && this.gamepadAngularSensibility !== 0) {
        rsValues.x = Math.abs(rsValues.x) > this.deadzoneDelta ? rsValues.x / this.gamepadAngularSensibility : 0;
        rsValues.y = (Math.abs(rsValues.y) > this.deadzoneDelta ? rsValues.y / this.gamepadAngularSensibility : 0) * this._yAxisScale;
      } else {
        rsValues = { x: 0, y: 0 };
      }
      if (!camera.rotationQuaternion) {
        Matrix.RotationYawPitchRollToRef(camera.rotation.y, camera.rotation.x, 0, this._cameraTransform);
      } else {
        camera.rotationQuaternion.toRotationMatrix(this._cameraTransform);
      }
      const speed = camera._computeLocalCameraSpeed() * 50;
      this._vector3.copyFromFloats(lsValues.x * speed, 0, -lsValues.y * speed);
      Vector3.TransformCoordinatesToRef(this._vector3, this._cameraTransform, this._deltaTransform);
      camera.cameraDirection.addInPlace(this._deltaTransform);
      this._vector2.copyFromFloats(rsValues.y, rsValues.x);
      camera.cameraRotation.addInPlace(this._vector2);
    }
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraGamepadInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "gamepad";
  }
};
__decorate([
  serialize()
], FreeCameraGamepadInput.prototype, "gamepadAngularSensibility", void 0);
__decorate([
  serialize()
], FreeCameraGamepadInput.prototype, "gamepadMoveSensibility", void 0);
CameraInputTypes["FreeCameraGamepadInput"] = FreeCameraGamepadInput;

// node_modules/@babylonjs/core/Misc/virtualJoystick.js
var JoystickAxis;
(function(JoystickAxis2) {
  JoystickAxis2[JoystickAxis2["X"] = 0] = "X";
  JoystickAxis2[JoystickAxis2["Y"] = 1] = "Y";
  JoystickAxis2[JoystickAxis2["Z"] = 2] = "Z";
})(JoystickAxis || (JoystickAxis = {}));
var VirtualJoystick = class _VirtualJoystick {
  static _GetDefaultOptions() {
    return {
      puckSize: 40,
      containerSize: 60,
      color: "cyan",
      puckImage: void 0,
      containerImage: void 0,
      position: void 0,
      alwaysVisible: false,
      limitToContainer: false
    };
  }
  /**
   * Creates a new virtual joystick
   * @param leftJoystick defines that the joystick is for left hand (false by default)
   * @param customizations Defines the options we want to customize the VirtualJoystick
   */
  constructor(leftJoystick, customizations) {
    this._released = false;
    const options = Object.assign(Object.assign({}, _VirtualJoystick._GetDefaultOptions()), customizations);
    if (leftJoystick) {
      this._leftJoystick = true;
    } else {
      this._leftJoystick = false;
    }
    _VirtualJoystick._GlobalJoystickIndex++;
    this._axisTargetedByLeftAndRight = JoystickAxis.X;
    this._axisTargetedByUpAndDown = JoystickAxis.Y;
    this.reverseLeftRight = false;
    this.reverseUpDown = false;
    this._touches = new StringDictionary();
    this.deltaPosition = Vector3.Zero();
    this._joystickSensibility = 25;
    this._inversedSensibility = 1 / (this._joystickSensibility / 1e3);
    this._onResize = () => {
      _VirtualJoystick._VJCanvasWidth = window.innerWidth;
      _VirtualJoystick._VJCanvasHeight = window.innerHeight;
      if (_VirtualJoystick.Canvas) {
        _VirtualJoystick.Canvas.width = _VirtualJoystick._VJCanvasWidth;
        _VirtualJoystick.Canvas.height = _VirtualJoystick._VJCanvasHeight;
      }
      _VirtualJoystick._HalfWidth = _VirtualJoystick._VJCanvasWidth / 2;
    };
    if (!_VirtualJoystick.Canvas) {
      window.addEventListener("resize", this._onResize, false);
      _VirtualJoystick.Canvas = document.createElement("canvas");
      _VirtualJoystick._VJCanvasWidth = window.innerWidth;
      _VirtualJoystick._VJCanvasHeight = window.innerHeight;
      _VirtualJoystick.Canvas.width = window.innerWidth;
      _VirtualJoystick.Canvas.height = window.innerHeight;
      _VirtualJoystick.Canvas.style.width = "100%";
      _VirtualJoystick.Canvas.style.height = "100%";
      _VirtualJoystick.Canvas.style.position = "absolute";
      _VirtualJoystick.Canvas.style.backgroundColor = "transparent";
      _VirtualJoystick.Canvas.style.top = "0px";
      _VirtualJoystick.Canvas.style.left = "0px";
      _VirtualJoystick.Canvas.style.zIndex = "5";
      _VirtualJoystick.Canvas.style.touchAction = "none";
      _VirtualJoystick.Canvas.setAttribute("touch-action", "none");
      const context = _VirtualJoystick.Canvas.getContext("2d");
      if (!context) {
        throw new Error("Unable to create canvas for virtual joystick");
      }
      _VirtualJoystick._VJCanvasContext = context;
      _VirtualJoystick._VJCanvasContext.strokeStyle = "#ffffff";
      _VirtualJoystick._VJCanvasContext.lineWidth = 2;
      document.body.appendChild(_VirtualJoystick.Canvas);
    }
    _VirtualJoystick._HalfWidth = _VirtualJoystick.Canvas.width / 2;
    this.pressed = false;
    this.limitToContainer = options.limitToContainer;
    this._joystickColor = options.color;
    this.containerSize = options.containerSize;
    this.puckSize = options.puckSize;
    if (options.position) {
      this.setPosition(options.position.x, options.position.y);
    }
    if (options.puckImage) {
      this.setPuckImage(options.puckImage);
    }
    if (options.containerImage) {
      this.setContainerImage(options.containerImage);
    }
    if (options.alwaysVisible) {
      _VirtualJoystick._AlwaysVisibleSticks++;
    }
    this.alwaysVisible = options.alwaysVisible;
    this._joystickPointerId = -1;
    this._joystickPointerPos = new Vector2(0, 0);
    this._joystickPreviousPointerPos = new Vector2(0, 0);
    this._joystickPointerStartPos = new Vector2(0, 0);
    this._deltaJoystickVector = new Vector2(0, 0);
    this._onPointerDownHandlerRef = (evt) => {
      this._onPointerDown(evt);
    };
    this._onPointerMoveHandlerRef = (evt) => {
      this._onPointerMove(evt);
    };
    this._onPointerUpHandlerRef = (evt) => {
      this._onPointerUp(evt);
    };
    _VirtualJoystick.Canvas.addEventListener("pointerdown", this._onPointerDownHandlerRef, false);
    _VirtualJoystick.Canvas.addEventListener("pointermove", this._onPointerMoveHandlerRef, false);
    _VirtualJoystick.Canvas.addEventListener("pointerup", this._onPointerUpHandlerRef, false);
    _VirtualJoystick.Canvas.addEventListener("pointerout", this._onPointerUpHandlerRef, false);
    _VirtualJoystick.Canvas.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
    }, false);
    requestAnimationFrame(() => {
      this._drawVirtualJoystick();
    });
  }
  /**
   * Defines joystick sensibility (ie. the ratio between a physical move and virtual joystick position change)
   * @param newJoystickSensibility defines the new sensibility
   */
  setJoystickSensibility(newJoystickSensibility) {
    this._joystickSensibility = newJoystickSensibility;
    this._inversedSensibility = 1 / (this._joystickSensibility / 1e3);
  }
  _onPointerDown(e) {
    let positionOnScreenCondition;
    e.preventDefault();
    if (this._leftJoystick === true) {
      positionOnScreenCondition = e.clientX < _VirtualJoystick._HalfWidth;
    } else {
      positionOnScreenCondition = e.clientX > _VirtualJoystick._HalfWidth;
    }
    if (positionOnScreenCondition && this._joystickPointerId < 0) {
      this._joystickPointerId = e.pointerId;
      if (this._joystickPosition) {
        this._joystickPointerStartPos = this._joystickPosition.clone();
        this._joystickPointerPos = this._joystickPosition.clone();
        this._joystickPreviousPointerPos = this._joystickPosition.clone();
        this._onPointerMove(e);
      } else {
        this._joystickPointerStartPos.x = e.clientX;
        this._joystickPointerStartPos.y = e.clientY;
        this._joystickPointerPos = this._joystickPointerStartPos.clone();
        this._joystickPreviousPointerPos = this._joystickPointerStartPos.clone();
      }
      this._deltaJoystickVector.x = 0;
      this._deltaJoystickVector.y = 0;
      this.pressed = true;
      this._touches.add(e.pointerId.toString(), e);
    } else {
      if (_VirtualJoystick._GlobalJoystickIndex < 2 && this._action) {
        this._action();
        this._touches.add(e.pointerId.toString(), { x: e.clientX, y: e.clientY, prevX: e.clientX, prevY: e.clientY });
      }
    }
  }
  _onPointerMove(e) {
    if (this._joystickPointerId == e.pointerId) {
      if (this.limitToContainer) {
        const vector = new Vector2(e.clientX - this._joystickPointerStartPos.x, e.clientY - this._joystickPointerStartPos.y);
        const distance = vector.length();
        if (distance > this.containerSize) {
          vector.scaleInPlace(this.containerSize / distance);
        }
        this._joystickPointerPos.x = this._joystickPointerStartPos.x + vector.x;
        this._joystickPointerPos.y = this._joystickPointerStartPos.y + vector.y;
      } else {
        this._joystickPointerPos.x = e.clientX;
        this._joystickPointerPos.y = e.clientY;
      }
      this._deltaJoystickVector = this._joystickPointerPos.clone();
      this._deltaJoystickVector = this._deltaJoystickVector.subtract(this._joystickPointerStartPos);
      if (0 < _VirtualJoystick._AlwaysVisibleSticks) {
        if (this._leftJoystick) {
          this._joystickPointerPos.x = Math.min(_VirtualJoystick._HalfWidth, this._joystickPointerPos.x);
        } else {
          this._joystickPointerPos.x = Math.max(_VirtualJoystick._HalfWidth, this._joystickPointerPos.x);
        }
      }
      const directionLeftRight = this.reverseLeftRight ? -1 : 1;
      const deltaJoystickX = directionLeftRight * this._deltaJoystickVector.x / this._inversedSensibility;
      switch (this._axisTargetedByLeftAndRight) {
        case JoystickAxis.X:
          this.deltaPosition.x = Math.min(1, Math.max(-1, deltaJoystickX));
          break;
        case JoystickAxis.Y:
          this.deltaPosition.y = Math.min(1, Math.max(-1, deltaJoystickX));
          break;
        case JoystickAxis.Z:
          this.deltaPosition.z = Math.min(1, Math.max(-1, deltaJoystickX));
          break;
      }
      const directionUpDown = this.reverseUpDown ? 1 : -1;
      const deltaJoystickY = directionUpDown * this._deltaJoystickVector.y / this._inversedSensibility;
      switch (this._axisTargetedByUpAndDown) {
        case JoystickAxis.X:
          this.deltaPosition.x = Math.min(1, Math.max(-1, deltaJoystickY));
          break;
        case JoystickAxis.Y:
          this.deltaPosition.y = Math.min(1, Math.max(-1, deltaJoystickY));
          break;
        case JoystickAxis.Z:
          this.deltaPosition.z = Math.min(1, Math.max(-1, deltaJoystickY));
          break;
      }
    } else {
      const data = this._touches.get(e.pointerId.toString());
      if (data) {
        data.x = e.clientX;
        data.y = e.clientY;
      }
    }
  }
  _onPointerUp(e) {
    if (this._joystickPointerId == e.pointerId) {
      this._clearPreviousDraw();
      this._joystickPointerId = -1;
      this.pressed = false;
    } else {
      const touch = this._touches.get(e.pointerId.toString());
      if (touch) {
        _VirtualJoystick._VJCanvasContext.clearRect(touch.prevX - 44, touch.prevY - 44, 88, 88);
      }
    }
    this._deltaJoystickVector.x = 0;
    this._deltaJoystickVector.y = 0;
    this._touches.remove(e.pointerId.toString());
  }
  /**
   * Change the color of the virtual joystick
   * @param newColor a string that must be a CSS color value (like "red") or the hexa value (like "#FF0000")
   */
  setJoystickColor(newColor) {
    this._joystickColor = newColor;
  }
  /**
   * Size of the joystick's container
   */
  set containerSize(newSize) {
    this._joystickContainerSize = newSize;
    this._clearContainerSize = ~~(this._joystickContainerSize * 2.1);
    this._clearContainerSizeOffset = ~~(this._clearContainerSize / 2);
  }
  get containerSize() {
    return this._joystickContainerSize;
  }
  /**
   * Size of the joystick's puck
   */
  set puckSize(newSize) {
    this._joystickPuckSize = newSize;
    this._clearPuckSize = ~~(this._joystickPuckSize * 2.1);
    this._clearPuckSizeOffset = ~~(this._clearPuckSize / 2);
  }
  get puckSize() {
    return this._joystickPuckSize;
  }
  /**
   * Clears the set position of the joystick
   */
  clearPosition() {
    this.alwaysVisible = false;
    this._joystickPosition = null;
  }
  /**
   * Defines whether or not the joystick container is always visible
   */
  set alwaysVisible(value) {
    if (this._alwaysVisible === value) {
      return;
    }
    if (value && this._joystickPosition) {
      _VirtualJoystick._AlwaysVisibleSticks++;
      this._alwaysVisible = true;
    } else {
      _VirtualJoystick._AlwaysVisibleSticks--;
      this._alwaysVisible = false;
    }
  }
  get alwaysVisible() {
    return this._alwaysVisible;
  }
  /**
   * Sets the constant position of the Joystick container
   * @param x X axis coordinate
   * @param y Y axis coordinate
   */
  setPosition(x, y) {
    if (this._joystickPointerStartPos) {
      this._clearPreviousDraw();
    }
    this._joystickPosition = new Vector2(x, y);
  }
  /**
   * Defines a callback to call when the joystick is touched
   * @param action defines the callback
   */
  setActionOnTouch(action) {
    this._action = action;
  }
  /**
   * Defines which axis you'd like to control for left & right
   * @param axis defines the axis to use
   */
  setAxisForLeftRight(axis) {
    switch (axis) {
      case JoystickAxis.X:
      case JoystickAxis.Y:
      case JoystickAxis.Z:
        this._axisTargetedByLeftAndRight = axis;
        break;
      default:
        this._axisTargetedByLeftAndRight = JoystickAxis.X;
        break;
    }
  }
  /**
   * Defines which axis you'd like to control for up & down
   * @param axis defines the axis to use
   */
  setAxisForUpDown(axis) {
    switch (axis) {
      case JoystickAxis.X:
      case JoystickAxis.Y:
      case JoystickAxis.Z:
        this._axisTargetedByUpAndDown = axis;
        break;
      default:
        this._axisTargetedByUpAndDown = JoystickAxis.Y;
        break;
    }
  }
  /**
   * Clears the canvas from the previous puck / container draw
   */
  _clearPreviousDraw() {
    const jp = this._joystickPosition || this._joystickPointerStartPos;
    _VirtualJoystick._VJCanvasContext.clearRect(jp.x - this._clearContainerSizeOffset, jp.y - this._clearContainerSizeOffset, this._clearContainerSize, this._clearContainerSize);
    _VirtualJoystick._VJCanvasContext.clearRect(this._joystickPreviousPointerPos.x - this._clearPuckSizeOffset - 1, this._joystickPreviousPointerPos.y - this._clearPuckSizeOffset - 1, this._clearPuckSize + 2, this._clearPuckSize + 2);
  }
  /**
   * Loads `urlPath` to be used for the container's image
   * @param urlPath defines the urlPath of an image to use
   */
  setContainerImage(urlPath) {
    const image = new Image();
    image.src = urlPath;
    image.onload = () => this._containerImage = image;
  }
  /**
   * Loads `urlPath` to be used for the puck's image
   * @param urlPath defines the urlPath of an image to use
   */
  setPuckImage(urlPath) {
    const image = new Image();
    image.src = urlPath;
    image.onload = () => this._puckImage = image;
  }
  /**
   * Draws the Virtual Joystick's container
   */
  _drawContainer() {
    const jp = this._joystickPosition || this._joystickPointerStartPos;
    this._clearPreviousDraw();
    if (this._containerImage) {
      _VirtualJoystick._VJCanvasContext.drawImage(this._containerImage, jp.x - this.containerSize, jp.y - this.containerSize, this.containerSize * 2, this.containerSize * 2);
    } else {
      _VirtualJoystick._VJCanvasContext.beginPath();
      _VirtualJoystick._VJCanvasContext.strokeStyle = this._joystickColor;
      _VirtualJoystick._VJCanvasContext.lineWidth = 2;
      _VirtualJoystick._VJCanvasContext.arc(jp.x, jp.y, this.containerSize, 0, Math.PI * 2, true);
      _VirtualJoystick._VJCanvasContext.stroke();
      _VirtualJoystick._VJCanvasContext.closePath();
      _VirtualJoystick._VJCanvasContext.beginPath();
      _VirtualJoystick._VJCanvasContext.lineWidth = 6;
      _VirtualJoystick._VJCanvasContext.strokeStyle = this._joystickColor;
      _VirtualJoystick._VJCanvasContext.arc(jp.x, jp.y, this.puckSize, 0, Math.PI * 2, true);
      _VirtualJoystick._VJCanvasContext.stroke();
      _VirtualJoystick._VJCanvasContext.closePath();
    }
  }
  /**
   * Draws the Virtual Joystick's puck
   */
  _drawPuck() {
    if (this._puckImage) {
      _VirtualJoystick._VJCanvasContext.drawImage(this._puckImage, this._joystickPointerPos.x - this.puckSize, this._joystickPointerPos.y - this.puckSize, this.puckSize * 2, this.puckSize * 2);
    } else {
      _VirtualJoystick._VJCanvasContext.beginPath();
      _VirtualJoystick._VJCanvasContext.strokeStyle = this._joystickColor;
      _VirtualJoystick._VJCanvasContext.lineWidth = 2;
      _VirtualJoystick._VJCanvasContext.arc(this._joystickPointerPos.x, this._joystickPointerPos.y, this.puckSize, 0, Math.PI * 2, true);
      _VirtualJoystick._VJCanvasContext.stroke();
      _VirtualJoystick._VJCanvasContext.closePath();
    }
  }
  _drawVirtualJoystick() {
    if (this._released) {
      return;
    }
    if (this.alwaysVisible) {
      this._drawContainer();
    }
    if (this.pressed) {
      this._touches.forEach((key, touch) => {
        if (touch.pointerId === this._joystickPointerId) {
          if (!this.alwaysVisible) {
            this._drawContainer();
          }
          this._drawPuck();
          this._joystickPreviousPointerPos = this._joystickPointerPos.clone();
        } else {
          _VirtualJoystick._VJCanvasContext.clearRect(touch.prevX - 44, touch.prevY - 44, 88, 88);
          _VirtualJoystick._VJCanvasContext.beginPath();
          _VirtualJoystick._VJCanvasContext.fillStyle = "white";
          _VirtualJoystick._VJCanvasContext.beginPath();
          _VirtualJoystick._VJCanvasContext.strokeStyle = "red";
          _VirtualJoystick._VJCanvasContext.lineWidth = 6;
          _VirtualJoystick._VJCanvasContext.arc(touch.x, touch.y, 40, 0, Math.PI * 2, true);
          _VirtualJoystick._VJCanvasContext.stroke();
          _VirtualJoystick._VJCanvasContext.closePath();
          touch.prevX = touch.x;
          touch.prevY = touch.y;
        }
      });
    }
    requestAnimationFrame(() => {
      this._drawVirtualJoystick();
    });
  }
  /**
   * Release internal HTML canvas
   */
  releaseCanvas() {
    if (_VirtualJoystick.Canvas) {
      _VirtualJoystick.Canvas.removeEventListener("pointerdown", this._onPointerDownHandlerRef);
      _VirtualJoystick.Canvas.removeEventListener("pointermove", this._onPointerMoveHandlerRef);
      _VirtualJoystick.Canvas.removeEventListener("pointerup", this._onPointerUpHandlerRef);
      _VirtualJoystick.Canvas.removeEventListener("pointerout", this._onPointerUpHandlerRef);
      window.removeEventListener("resize", this._onResize);
      document.body.removeChild(_VirtualJoystick.Canvas);
      _VirtualJoystick.Canvas = null;
    }
    this._released = true;
  }
};
VirtualJoystick._GlobalJoystickIndex = 0;
VirtualJoystick._AlwaysVisibleSticks = 0;

// node_modules/@babylonjs/core/Cameras/Inputs/freeCameraVirtualJoystickInput.js
FreeCameraInputsManager.prototype.addVirtualJoystick = function() {
  this.add(new FreeCameraVirtualJoystickInput());
  return this;
};
var FreeCameraVirtualJoystickInput = class {
  /**
   * Gets the left stick of the virtual joystick.
   * @returns The virtual Joystick
   */
  getLeftJoystick() {
    return this._leftjoystick;
  }
  /**
   * Gets the right stick of the virtual joystick.
   * @returns The virtual Joystick
   */
  getRightJoystick() {
    return this._rightjoystick;
  }
  /**
   * Update the current camera state depending on the inputs that have been used this frame.
   * This is a dynamically created lambda to avoid the performance penalty of looping for inputs in the render loop.
   */
  checkInputs() {
    if (this._leftjoystick) {
      const camera = this.camera;
      const speed = camera._computeLocalCameraSpeed() * 50;
      const cameraTransform = Matrix.RotationYawPitchRoll(camera.rotation.y, camera.rotation.x, 0);
      const deltaTransform = Vector3.TransformCoordinates(new Vector3(this._leftjoystick.deltaPosition.x * speed, this._leftjoystick.deltaPosition.y * speed, this._leftjoystick.deltaPosition.z * speed), cameraTransform);
      camera.cameraDirection = camera.cameraDirection.add(deltaTransform);
      camera.cameraRotation = camera.cameraRotation.addVector3(this._rightjoystick.deltaPosition);
      if (!this._leftjoystick.pressed) {
        this._leftjoystick.deltaPosition = this._leftjoystick.deltaPosition.scale(0.9);
      }
      if (!this._rightjoystick.pressed) {
        this._rightjoystick.deltaPosition = this._rightjoystick.deltaPosition.scale(0.9);
      }
    }
  }
  /**
   * Attach the input controls to a specific dom element to get the input from.
   */
  attachControl() {
    this._leftjoystick = new VirtualJoystick(true);
    this._leftjoystick.setAxisForUpDown(JoystickAxis.Z);
    this._leftjoystick.setAxisForLeftRight(JoystickAxis.X);
    this._leftjoystick.setJoystickSensibility(0.15);
    this._rightjoystick = new VirtualJoystick(false);
    this._rightjoystick.setAxisForUpDown(JoystickAxis.X);
    this._rightjoystick.setAxisForLeftRight(JoystickAxis.Y);
    this._rightjoystick.reverseUpDown = true;
    this._rightjoystick.setJoystickSensibility(0.05);
    this._rightjoystick.setJoystickColor("yellow");
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    this._leftjoystick.releaseCanvas();
    this._rightjoystick.releaseCanvas();
  }
  /**
   * Gets the class name of the current input.
   * @returns the class name
   */
  getClassName() {
    return "FreeCameraVirtualJoystickInput";
  }
  /**
   * Get the friendly name associated with the input class.
   * @returns the input friendly name
   */
  getSimpleName() {
    return "virtualJoystick";
  }
};
CameraInputTypes["FreeCameraVirtualJoystickInput"] = FreeCameraVirtualJoystickInput;

// node_modules/@babylonjs/core/Cameras/targetCamera.js
var TargetCamera = class _TargetCamera extends Camera {
  /**
   * Instantiates a target camera that takes a mesh or position as a target and continues to look at it while it moves.
   * This is the base of the follow, arc rotate cameras and Free camera
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras
   * @param name Defines the name of the camera in the scene
   * @param position Defines the start position of the camera in the scene
   * @param scene Defines the scene the camera belongs to
   * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
   */
  constructor(name5, position, scene, setActiveOnSceneIfNoneActive = true) {
    super(name5, position, scene, setActiveOnSceneIfNoneActive);
    this._tmpUpVector = Vector3.Zero();
    this._tmpTargetVector = Vector3.Zero();
    this.cameraDirection = new Vector3(0, 0, 0);
    this.cameraRotation = new Vector2(0, 0);
    this.ignoreParentScaling = false;
    this.updateUpVectorFromRotation = false;
    this._tmpQuaternion = new Quaternion();
    this.rotation = new Vector3(0, 0, 0);
    this.speed = 2;
    this.noRotationConstraint = false;
    this.invertRotation = false;
    this.inverseRotationSpeed = 0.2;
    this.lockedTarget = null;
    this._currentTarget = Vector3.Zero();
    this._initialFocalDistance = 1;
    this._viewMatrix = Matrix.Zero();
    this._camMatrix = Matrix.Zero();
    this._cameraTransformMatrix = Matrix.Zero();
    this._cameraRotationMatrix = Matrix.Zero();
    this._referencePoint = new Vector3(0, 0, 1);
    this._transformedReferencePoint = Vector3.Zero();
    this._deferredPositionUpdate = new Vector3();
    this._deferredRotationQuaternionUpdate = new Quaternion();
    this._deferredRotationUpdate = new Vector3();
    this._deferredUpdated = false;
    this._deferOnly = false;
    this._defaultUp = Vector3.Up();
    this._cachedRotationZ = 0;
    this._cachedQuaternionRotationZ = 0;
  }
  /**
   * Gets the position in front of the camera at a given distance.
   * @param distance The distance from the camera we want the position to be
   * @returns the position
   */
  getFrontPosition(distance) {
    this.getWorldMatrix();
    const direction = this.getTarget().subtract(this.position);
    direction.normalize();
    direction.scaleInPlace(distance);
    return this.globalPosition.add(direction);
  }
  /** @internal */
  _getLockedTargetPosition() {
    if (!this.lockedTarget) {
      return null;
    }
    if (this.lockedTarget.absolutePosition) {
      const lockedTarget = this.lockedTarget;
      const m = lockedTarget.computeWorldMatrix();
      m.getTranslationToRef(lockedTarget.absolutePosition);
    }
    return this.lockedTarget.absolutePosition || this.lockedTarget;
  }
  /**
   * Store current camera state of the camera (fov, position, rotation, etc..)
   * @returns the camera
   */
  storeState() {
    this._storedPosition = this.position.clone();
    this._storedRotation = this.rotation.clone();
    if (this.rotationQuaternion) {
      this._storedRotationQuaternion = this.rotationQuaternion.clone();
    }
    return super.storeState();
  }
  /**
   * Restored camera state. You must call storeState() first
   * @returns whether it was successful or not
   * @internal
   */
  _restoreStateValues() {
    if (!super._restoreStateValues()) {
      return false;
    }
    this.position = this._storedPosition.clone();
    this.rotation = this._storedRotation.clone();
    if (this.rotationQuaternion) {
      this.rotationQuaternion = this._storedRotationQuaternion.clone();
    }
    this.cameraDirection.copyFromFloats(0, 0, 0);
    this.cameraRotation.copyFromFloats(0, 0);
    return true;
  }
  /** @internal */
  _initCache() {
    super._initCache();
    this._cache.lockedTarget = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._cache.rotation = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._cache.rotationQuaternion = new Quaternion(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
  }
  /**
   * @internal
   */
  _updateCache(ignoreParentClass) {
    if (!ignoreParentClass) {
      super._updateCache();
    }
    const lockedTargetPosition = this._getLockedTargetPosition();
    if (!lockedTargetPosition) {
      this._cache.lockedTarget = null;
    } else {
      if (!this._cache.lockedTarget) {
        this._cache.lockedTarget = lockedTargetPosition.clone();
      } else {
        this._cache.lockedTarget.copyFrom(lockedTargetPosition);
      }
    }
    this._cache.rotation.copyFrom(this.rotation);
    if (this.rotationQuaternion) {
      this._cache.rotationQuaternion.copyFrom(this.rotationQuaternion);
    }
  }
  // Synchronized
  /** @internal */
  _isSynchronizedViewMatrix() {
    if (!super._isSynchronizedViewMatrix()) {
      return false;
    }
    const lockedTargetPosition = this._getLockedTargetPosition();
    return (this._cache.lockedTarget ? this._cache.lockedTarget.equals(lockedTargetPosition) : !lockedTargetPosition) && (this.rotationQuaternion ? this.rotationQuaternion.equals(this._cache.rotationQuaternion) : this._cache.rotation.equals(this.rotation));
  }
  // Methods
  /** @internal */
  _computeLocalCameraSpeed() {
    const engine = this.getEngine();
    return this.speed * Math.sqrt(engine.getDeltaTime() / (engine.getFps() * 100));
  }
  // Target
  /**
   * Defines the target the camera should look at.
   * @param target Defines the new target as a Vector
   */
  setTarget(target) {
    this.upVector.normalize();
    this._initialFocalDistance = target.subtract(this.position).length();
    if (this.position.z === target.z) {
      this.position.z += Epsilon;
    }
    this._referencePoint.normalize().scaleInPlace(this._initialFocalDistance);
    Matrix.LookAtLHToRef(this.position, target, this._defaultUp, this._camMatrix);
    this._camMatrix.invert();
    this.rotation.x = Math.atan(this._camMatrix.m[6] / this._camMatrix.m[10]);
    const vDir = target.subtract(this.position);
    if (vDir.x >= 0) {
      this.rotation.y = -Math.atan(vDir.z / vDir.x) + Math.PI / 2;
    } else {
      this.rotation.y = -Math.atan(vDir.z / vDir.x) - Math.PI / 2;
    }
    this.rotation.z = 0;
    if (isNaN(this.rotation.x)) {
      this.rotation.x = 0;
    }
    if (isNaN(this.rotation.y)) {
      this.rotation.y = 0;
    }
    if (isNaN(this.rotation.z)) {
      this.rotation.z = 0;
    }
    if (this.rotationQuaternion) {
      Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this.rotationQuaternion);
    }
  }
  /**
   * Defines the target point of the camera.
   * The camera looks towards it form the radius distance.
   */
  get target() {
    return this.getTarget();
  }
  set target(value) {
    this.setTarget(value);
  }
  /**
   * Return the current target position of the camera. This value is expressed in local space.
   * @returns the target position
   */
  getTarget() {
    return this._currentTarget;
  }
  /** @internal */
  _decideIfNeedsToMove() {
    return Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
  }
  /** @internal */
  _updatePosition() {
    if (this.parent) {
      this.parent.getWorldMatrix().invertToRef(TmpVectors.Matrix[0]);
      Vector3.TransformNormalToRef(this.cameraDirection, TmpVectors.Matrix[0], TmpVectors.Vector3[0]);
      this._deferredPositionUpdate.addInPlace(TmpVectors.Vector3[0]);
      if (!this._deferOnly) {
        this.position.copyFrom(this._deferredPositionUpdate);
      } else {
        this._deferredUpdated = true;
      }
      return;
    }
    this._deferredPositionUpdate.addInPlace(this.cameraDirection);
    if (!this._deferOnly) {
      this.position.copyFrom(this._deferredPositionUpdate);
    } else {
      this._deferredUpdated = true;
    }
  }
  /** @internal */
  _checkInputs() {
    const directionMultiplier = this.invertRotation ? -this.inverseRotationSpeed : 1;
    const needToMove = this._decideIfNeedsToMove();
    const needToRotate = this.cameraRotation.x || this.cameraRotation.y;
    this._deferredUpdated = false;
    this._deferredRotationUpdate.copyFrom(this.rotation);
    this._deferredPositionUpdate.copyFrom(this.position);
    if (this.rotationQuaternion) {
      this._deferredRotationQuaternionUpdate.copyFrom(this.rotationQuaternion);
    }
    if (needToMove) {
      this._updatePosition();
    }
    if (needToRotate) {
      if (this.rotationQuaternion) {
        this.rotationQuaternion.toEulerAnglesToRef(this._deferredRotationUpdate);
      }
      this._deferredRotationUpdate.x += this.cameraRotation.x * directionMultiplier;
      this._deferredRotationUpdate.y += this.cameraRotation.y * directionMultiplier;
      if (!this.noRotationConstraint) {
        const limit = 1.570796;
        if (this._deferredRotationUpdate.x > limit) {
          this._deferredRotationUpdate.x = limit;
        }
        if (this._deferredRotationUpdate.x < -limit) {
          this._deferredRotationUpdate.x = -limit;
        }
      }
      if (!this._deferOnly) {
        this.rotation.copyFrom(this._deferredRotationUpdate);
      } else {
        this._deferredUpdated = true;
      }
      if (this.rotationQuaternion) {
        const len = this._deferredRotationUpdate.lengthSquared();
        if (len) {
          Quaternion.RotationYawPitchRollToRef(this._deferredRotationUpdate.y, this._deferredRotationUpdate.x, this._deferredRotationUpdate.z, this._deferredRotationQuaternionUpdate);
          if (!this._deferOnly) {
            this.rotationQuaternion.copyFrom(this._deferredRotationQuaternionUpdate);
          } else {
            this._deferredUpdated = true;
          }
        }
      }
    }
    if (needToMove) {
      if (Math.abs(this.cameraDirection.x) < this.speed * Epsilon) {
        this.cameraDirection.x = 0;
      }
      if (Math.abs(this.cameraDirection.y) < this.speed * Epsilon) {
        this.cameraDirection.y = 0;
      }
      if (Math.abs(this.cameraDirection.z) < this.speed * Epsilon) {
        this.cameraDirection.z = 0;
      }
      this.cameraDirection.scaleInPlace(this.inertia);
    }
    if (needToRotate) {
      if (Math.abs(this.cameraRotation.x) < this.speed * Epsilon) {
        this.cameraRotation.x = 0;
      }
      if (Math.abs(this.cameraRotation.y) < this.speed * Epsilon) {
        this.cameraRotation.y = 0;
      }
      this.cameraRotation.scaleInPlace(this.inertia);
    }
    super._checkInputs();
  }
  _updateCameraRotationMatrix() {
    if (this.rotationQuaternion) {
      this.rotationQuaternion.toRotationMatrix(this._cameraRotationMatrix);
    } else {
      Matrix.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, this._cameraRotationMatrix);
    }
  }
  /**
   * Update the up vector to apply the rotation of the camera (So if you changed the camera rotation.z this will let you update the up vector as well)
   * @returns the current camera
   */
  _rotateUpVectorWithCameraRotationMatrix() {
    Vector3.TransformNormalToRef(this._defaultUp, this._cameraRotationMatrix, this.upVector);
    return this;
  }
  /** @internal */
  _getViewMatrix() {
    if (this.lockedTarget) {
      this.setTarget(this._getLockedTargetPosition());
    }
    this._updateCameraRotationMatrix();
    if (this.rotationQuaternion && this._cachedQuaternionRotationZ != this.rotationQuaternion.z) {
      this._rotateUpVectorWithCameraRotationMatrix();
      this._cachedQuaternionRotationZ = this.rotationQuaternion.z;
    } else if (this._cachedRotationZ !== this.rotation.z) {
      this._rotateUpVectorWithCameraRotationMatrix();
      this._cachedRotationZ = this.rotation.z;
    }
    Vector3.TransformCoordinatesToRef(this._referencePoint, this._cameraRotationMatrix, this._transformedReferencePoint);
    this.position.addToRef(this._transformedReferencePoint, this._currentTarget);
    if (this.updateUpVectorFromRotation) {
      if (this.rotationQuaternion) {
        Axis.Y.rotateByQuaternionToRef(this.rotationQuaternion, this.upVector);
      } else {
        Quaternion.FromEulerVectorToRef(this.rotation, this._tmpQuaternion);
        Axis.Y.rotateByQuaternionToRef(this._tmpQuaternion, this.upVector);
      }
    }
    this._computeViewMatrix(this.position, this._currentTarget, this.upVector);
    return this._viewMatrix;
  }
  _computeViewMatrix(position, target, up) {
    if (this.ignoreParentScaling) {
      if (this.parent) {
        const parentWorldMatrix = this.parent.getWorldMatrix();
        Vector3.TransformCoordinatesToRef(position, parentWorldMatrix, this._globalPosition);
        Vector3.TransformCoordinatesToRef(target, parentWorldMatrix, this._tmpTargetVector);
        Vector3.TransformNormalToRef(up, parentWorldMatrix, this._tmpUpVector);
        this._markSyncedWithParent();
      } else {
        this._globalPosition.copyFrom(position);
        this._tmpTargetVector.copyFrom(target);
        this._tmpUpVector.copyFrom(up);
      }
      if (this.getScene().useRightHandedSystem) {
        Matrix.LookAtRHToRef(this._globalPosition, this._tmpTargetVector, this._tmpUpVector, this._viewMatrix);
      } else {
        Matrix.LookAtLHToRef(this._globalPosition, this._tmpTargetVector, this._tmpUpVector, this._viewMatrix);
      }
      return;
    }
    if (this.getScene().useRightHandedSystem) {
      Matrix.LookAtRHToRef(position, target, up, this._viewMatrix);
    } else {
      Matrix.LookAtLHToRef(position, target, up, this._viewMatrix);
    }
    if (this.parent) {
      const parentWorldMatrix = this.parent.getWorldMatrix();
      this._viewMatrix.invert();
      this._viewMatrix.multiplyToRef(parentWorldMatrix, this._viewMatrix);
      this._viewMatrix.getTranslationToRef(this._globalPosition);
      this._viewMatrix.invert();
      this._markSyncedWithParent();
    } else {
      this._globalPosition.copyFrom(position);
    }
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createRigCamera(name5, cameraIndex) {
    if (this.cameraRigMode !== Camera.RIG_MODE_NONE) {
      const rigCamera = new _TargetCamera(name5, this.position.clone(), this.getScene());
      rigCamera.isRigCamera = true;
      rigCamera.rigParent = this;
      if (this.cameraRigMode === Camera.RIG_MODE_VR) {
        if (!this.rotationQuaternion) {
          this.rotationQuaternion = new Quaternion();
        }
        rigCamera._cameraRigParams = {};
        rigCamera.rotationQuaternion = new Quaternion();
      }
      rigCamera.mode = this.mode;
      rigCamera.orthoLeft = this.orthoLeft;
      rigCamera.orthoRight = this.orthoRight;
      rigCamera.orthoTop = this.orthoTop;
      rigCamera.orthoBottom = this.orthoBottom;
      return rigCamera;
    }
    return null;
  }
  /**
   * @internal
   */
  _updateRigCameras() {
    const camLeft = this._rigCameras[0];
    const camRight = this._rigCameras[1];
    this.computeWorldMatrix();
    switch (this.cameraRigMode) {
      case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
      case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
      case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
      case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
      case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED: {
        const leftSign = this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED ? 1 : -1;
        const rightSign = this.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED ? -1 : 1;
        this._getRigCamPositionAndTarget(this._cameraRigParams.stereoHalfAngle * leftSign, camLeft);
        this._getRigCamPositionAndTarget(this._cameraRigParams.stereoHalfAngle * rightSign, camRight);
        break;
      }
      case Camera.RIG_MODE_VR:
        if (camLeft.rotationQuaternion) {
          camLeft.rotationQuaternion.copyFrom(this.rotationQuaternion);
          camRight.rotationQuaternion.copyFrom(this.rotationQuaternion);
        } else {
          camLeft.rotation.copyFrom(this.rotation);
          camRight.rotation.copyFrom(this.rotation);
        }
        camLeft.position.copyFrom(this.position);
        camRight.position.copyFrom(this.position);
        break;
    }
    super._updateRigCameras();
  }
  _getRigCamPositionAndTarget(halfSpace, rigCamera) {
    const target = this.getTarget();
    target.subtractToRef(this.position, _TargetCamera._TargetFocalPoint);
    _TargetCamera._TargetFocalPoint.normalize().scaleInPlace(this._initialFocalDistance);
    const newFocalTarget = _TargetCamera._TargetFocalPoint.addInPlace(this.position);
    Matrix.TranslationToRef(-newFocalTarget.x, -newFocalTarget.y, -newFocalTarget.z, _TargetCamera._TargetTransformMatrix);
    _TargetCamera._TargetTransformMatrix.multiplyToRef(Matrix.RotationAxis(rigCamera.upVector, halfSpace), _TargetCamera._RigCamTransformMatrix);
    Matrix.TranslationToRef(newFocalTarget.x, newFocalTarget.y, newFocalTarget.z, _TargetCamera._TargetTransformMatrix);
    _TargetCamera._RigCamTransformMatrix.multiplyToRef(_TargetCamera._TargetTransformMatrix, _TargetCamera._RigCamTransformMatrix);
    Vector3.TransformCoordinatesToRef(this.position, _TargetCamera._RigCamTransformMatrix, rigCamera.position);
    rigCamera.setTarget(newFocalTarget);
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "TargetCamera";
  }
};
TargetCamera._RigCamTransformMatrix = new Matrix();
TargetCamera._TargetTransformMatrix = new Matrix();
TargetCamera._TargetFocalPoint = new Vector3();
__decorate([
  serializeAsVector3()
], TargetCamera.prototype, "rotation", void 0);
__decorate([
  serialize()
], TargetCamera.prototype, "speed", void 0);
__decorate([
  serializeAsMeshReference("lockedTargetId")
], TargetCamera.prototype, "lockedTarget", void 0);

// node_modules/@babylonjs/core/Cameras/freeCamera.js
var FreeCamera = class extends TargetCamera {
  /**
   * Gets the input sensibility for a mouse input. (default is 2000.0)
   * Higher values reduce sensitivity.
   */
  get angularSensibility() {
    const mouse = this.inputs.attached["mouse"];
    if (mouse) {
      return mouse.angularSensibility;
    }
    return 0;
  }
  /**
   * Sets the input sensibility for a mouse input. (default is 2000.0)
   * Higher values reduce sensitivity.
   */
  set angularSensibility(value) {
    const mouse = this.inputs.attached["mouse"];
    if (mouse) {
      mouse.angularSensibility = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the forward move of the camera.
   */
  get keysUp() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysUp;
    }
    return [];
  }
  set keysUp(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysUp = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the upward move of the camera.
   */
  get keysUpward() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysUpward;
    }
    return [];
  }
  set keysUpward(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysUpward = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the backward move of the camera.
   */
  get keysDown() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysDown;
    }
    return [];
  }
  set keysDown(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysDown = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the downward move of the camera.
   */
  get keysDownward() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysDownward;
    }
    return [];
  }
  set keysDownward(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysDownward = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the left strafe move of the camera.
   */
  get keysLeft() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysLeft;
    }
    return [];
  }
  set keysLeft(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysLeft = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the right strafe move of the camera.
   */
  get keysRight() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRight;
    }
    return [];
  }
  set keysRight(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRight = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the left rotation move of the camera.
   */
  get keysRotateLeft() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRotateLeft;
    }
    return [];
  }
  set keysRotateLeft(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRotateLeft = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the right rotation move of the camera.
   */
  get keysRotateRight() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRotateRight;
    }
    return [];
  }
  set keysRotateRight(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRotateRight = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the up rotation move of the camera.
   */
  get keysRotateUp() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRotateUp;
    }
    return [];
  }
  set keysRotateUp(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRotateUp = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control the down rotation move of the camera.
   */
  get keysRotateDown() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRotateDown;
    }
    return [];
  }
  set keysRotateDown(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRotateDown = value;
    }
  }
  /**
   * Instantiates a Free Camera.
   * This represents a free type of camera. It can be useful in First Person Shooter game for instance.
   * Please consider using the new UniversalCamera instead as it adds more functionality like touch to this camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
   * @param name Define the name of the camera in the scene
   * @param position Define the start position of the camera in the scene
   * @param scene Define the scene the camera belongs to
   * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
   */
  constructor(name5, position, scene, setActiveOnSceneIfNoneActive = true) {
    super(name5, position, scene, setActiveOnSceneIfNoneActive);
    this.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.ellipsoidOffset = new Vector3(0, 0, 0);
    this.checkCollisions = false;
    this.applyGravity = false;
    this._needMoveForGravity = false;
    this._oldPosition = Vector3.Zero();
    this._diffPosition = Vector3.Zero();
    this._newPosition = Vector3.Zero();
    this._collisionMask = -1;
    this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
      this._newPosition.copyFrom(newPosition);
      this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);
      if (this._diffPosition.length() > Engine.CollisionsEpsilon) {
        this.position.addToRef(this._diffPosition, this._deferredPositionUpdate);
        if (!this._deferOnly) {
          this.position.copyFrom(this._deferredPositionUpdate);
        } else {
          this._deferredUpdated = true;
        }
        if (this.onCollide && collidedMesh) {
          this.onCollide(collidedMesh);
        }
      }
    };
    this.inputs = new FreeCameraInputsManager(this);
    this.inputs.addKeyboard().addMouse();
  }
  /**
   * Attached controls to the current camera.
   * @param ignored defines an ignored parameter kept for backward compatibility.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(ignored, noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this.inputs.attachElement(noPreventDefault);
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    this.inputs.detachElement();
    this.cameraDirection = new Vector3(0, 0, 0);
    this.cameraRotation = new Vector2(0, 0);
  }
  /**
   * Define a collision mask to limit the list of object the camera can collide with
   */
  get collisionMask() {
    return this._collisionMask;
  }
  set collisionMask(mask) {
    this._collisionMask = !isNaN(mask) ? mask : -1;
  }
  /**
   * @internal
   */
  _collideWithWorld(displacement) {
    let globalPosition;
    if (this.parent) {
      globalPosition = Vector3.TransformCoordinates(this.position, this.parent.getWorldMatrix());
    } else {
      globalPosition = this.position;
    }
    globalPosition.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
    this._oldPosition.addInPlace(this.ellipsoidOffset);
    const coordinator = this.getScene().collisionCoordinator;
    if (!this._collider) {
      this._collider = coordinator.createCollider();
    }
    this._collider._radius = this.ellipsoid;
    this._collider.collisionMask = this._collisionMask;
    let actualDisplacement = displacement;
    if (this.applyGravity) {
      actualDisplacement = displacement.add(this.getScene().gravity);
    }
    coordinator.getNewPosition(this._oldPosition, actualDisplacement, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
  }
  /** @internal */
  _checkInputs() {
    if (!this._localDirection) {
      this._localDirection = Vector3.Zero();
      this._transformedDirection = Vector3.Zero();
    }
    this.inputs.checkInputs();
    super._checkInputs();
  }
  /**
   * Enable movement without a user input. This allows gravity to always be applied.
   */
  set needMoveForGravity(value) {
    this._needMoveForGravity = value;
  }
  /**
   * When true, gravity is applied whether there is user input or not.
   */
  get needMoveForGravity() {
    return this._needMoveForGravity;
  }
  /** @internal */
  _decideIfNeedsToMove() {
    return this._needMoveForGravity || Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
  }
  /** @internal */
  _updatePosition() {
    if (this.checkCollisions && this.getScene().collisionsEnabled) {
      this._collideWithWorld(this.cameraDirection);
    } else {
      super._updatePosition();
    }
  }
  /**
   * Destroy the camera and release the current resources hold by it.
   */
  dispose() {
    this.inputs.clear();
    super.dispose();
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "FreeCamera";
  }
};
__decorate([
  serializeAsVector3()
], FreeCamera.prototype, "ellipsoid", void 0);
__decorate([
  serializeAsVector3()
], FreeCamera.prototype, "ellipsoidOffset", void 0);
__decorate([
  serialize()
], FreeCamera.prototype, "checkCollisions", void 0);
__decorate([
  serialize()
], FreeCamera.prototype, "applyGravity", void 0);

// node_modules/@babylonjs/core/Cameras/touchCamera.js
Node.AddNodeConstructor("TouchCamera", (name5, scene) => {
  return () => new TouchCamera(name5, Vector3.Zero(), scene);
});
var TouchCamera = class extends FreeCamera {
  /**
   * Defines the touch sensibility for rotation.
   * The higher the faster.
   */
  get touchAngularSensibility() {
    const touch = this.inputs.attached["touch"];
    if (touch) {
      return touch.touchAngularSensibility;
    }
    return 0;
  }
  set touchAngularSensibility(value) {
    const touch = this.inputs.attached["touch"];
    if (touch) {
      touch.touchAngularSensibility = value;
    }
  }
  /**
   * Defines the touch sensibility for move.
   * The higher the faster.
   */
  get touchMoveSensibility() {
    const touch = this.inputs.attached["touch"];
    if (touch) {
      return touch.touchMoveSensibility;
    }
    return 0;
  }
  set touchMoveSensibility(value) {
    const touch = this.inputs.attached["touch"];
    if (touch) {
      touch.touchMoveSensibility = value;
    }
  }
  /**
   * Instantiates a new touch camera.
   * This represents a FPS type of camera controlled by touch.
   * This is like a universal camera minus the Gamepad controls.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
   * @param name Define the name of the camera in the scene
   * @param position Define the start position of the camera in the scene
   * @param scene Define the scene the camera belongs to
   */
  constructor(name5, position, scene) {
    super(name5, position, scene);
    this.inputs.addTouch();
    this._setupInputs();
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "TouchCamera";
  }
  /** @internal */
  _setupInputs() {
    const touch = this.inputs.attached["touch"];
    const mouse = this.inputs.attached["mouse"];
    if (mouse) {
      mouse.touchEnabled = false;
    } else {
      touch.allowMouse = true;
    }
  }
};

// node_modules/@babylonjs/core/Behaviors/Cameras/autoRotationBehavior.js
var AutoRotationBehavior = class {
  constructor() {
    this._zoomStopsAnimation = false;
    this._idleRotationSpeed = 0.05;
    this._idleRotationWaitTime = 2e3;
    this._idleRotationSpinupTime = 2e3;
    this.targetAlpha = null;
    this._isPointerDown = false;
    this._lastFrameTime = null;
    this._lastInteractionTime = -Infinity;
    this._cameraRotationSpeed = 0;
    this._lastFrameRadius = 0;
  }
  /**
   * Gets the name of the behavior.
   */
  get name() {
    return "AutoRotation";
  }
  /**
   * Sets the flag that indicates if user zooming should stop animation.
   */
  set zoomStopsAnimation(flag) {
    this._zoomStopsAnimation = flag;
  }
  /**
   * Gets the flag that indicates if user zooming should stop animation.
   */
  get zoomStopsAnimation() {
    return this._zoomStopsAnimation;
  }
  /**
   * Sets the default speed at which the camera rotates around the model.
   */
  set idleRotationSpeed(speed) {
    this._idleRotationSpeed = speed;
  }
  /**
   * Gets the default speed at which the camera rotates around the model.
   */
  get idleRotationSpeed() {
    return this._idleRotationSpeed;
  }
  /**
   * Sets the time (in milliseconds) to wait after user interaction before the camera starts rotating.
   */
  set idleRotationWaitTime(time) {
    this._idleRotationWaitTime = time;
  }
  /**
   * Gets the time (milliseconds) to wait after user interaction before the camera starts rotating.
   */
  get idleRotationWaitTime() {
    return this._idleRotationWaitTime;
  }
  /**
   * Sets the time (milliseconds) to take to spin up to the full idle rotation speed.
   */
  set idleRotationSpinupTime(time) {
    this._idleRotationSpinupTime = time;
  }
  /**
   * Gets the time (milliseconds) to take to spin up to the full idle rotation speed.
   */
  get idleRotationSpinupTime() {
    return this._idleRotationSpinupTime;
  }
  /**
   * Gets a value indicating if the camera is currently rotating because of this behavior
   */
  get rotationInProgress() {
    return Math.abs(this._cameraRotationSpeed) > 0;
  }
  /**
   * Initializes the behavior.
   */
  init() {
  }
  /**
   * Attaches the behavior to its arc rotate camera.
   * @param camera Defines the camera to attach the behavior to
   */
  attach(camera) {
    this._attachedCamera = camera;
    const scene = this._attachedCamera.getScene();
    this._onPrePointerObservableObserver = scene.onPrePointerObservable.add((pointerInfoPre) => {
      if (pointerInfoPre.type === PointerEventTypes.POINTERDOWN) {
        this._isPointerDown = true;
        return;
      }
      if (pointerInfoPre.type === PointerEventTypes.POINTERUP) {
        this._isPointerDown = false;
      }
    });
    this._onAfterCheckInputsObserver = camera.onAfterCheckInputsObservable.add(() => {
      if (this._reachTargetAlpha()) {
        return;
      }
      const now = PrecisionDate.Now;
      let dt = 0;
      if (this._lastFrameTime != null) {
        dt = now - this._lastFrameTime;
      }
      this._lastFrameTime = now;
      this._applyUserInteraction();
      const timeToRotation = now - this._lastInteractionTime - this._idleRotationWaitTime;
      const scale = Math.max(Math.min(timeToRotation / this._idleRotationSpinupTime, 1), 0);
      this._cameraRotationSpeed = this._idleRotationSpeed * scale;
      if (this._attachedCamera) {
        this._attachedCamera.alpha -= this._cameraRotationSpeed * (dt / 1e3);
      }
    });
  }
  /**
   * Detaches the behavior from its current arc rotate camera.
   */
  detach() {
    if (!this._attachedCamera) {
      return;
    }
    const scene = this._attachedCamera.getScene();
    if (this._onPrePointerObservableObserver) {
      scene.onPrePointerObservable.remove(this._onPrePointerObservableObserver);
    }
    this._attachedCamera.onAfterCheckInputsObservable.remove(this._onAfterCheckInputsObserver);
    this._attachedCamera = null;
  }
  /**
   * Force-reset the last interaction time
   * @param customTime an optional time that will be used instead of the current last interaction time. For example `Date.now()`
   */
  resetLastInteractionTime(customTime) {
    this._lastInteractionTime = customTime !== null && customTime !== void 0 ? customTime : PrecisionDate.Now;
  }
  /**
   * Returns true if camera alpha reaches the target alpha
   * @returns true if camera alpha reaches the target alpha
   */
  _reachTargetAlpha() {
    if (this._attachedCamera && this.targetAlpha) {
      return Math.abs(this._attachedCamera.alpha - this.targetAlpha) < Epsilon;
    }
    return false;
  }
  /**
   * Returns true if user is scrolling.
   * @returns true if user is scrolling.
   */
  _userIsZooming() {
    if (!this._attachedCamera) {
      return false;
    }
    return this._attachedCamera.inertialRadiusOffset !== 0;
  }
  _shouldAnimationStopForInteraction() {
    if (!this._attachedCamera) {
      return false;
    }
    let zoomHasHitLimit = false;
    if (this._lastFrameRadius === this._attachedCamera.radius && this._attachedCamera.inertialRadiusOffset !== 0) {
      zoomHasHitLimit = true;
    }
    this._lastFrameRadius = this._attachedCamera.radius;
    return this._zoomStopsAnimation ? zoomHasHitLimit : this._userIsZooming();
  }
  /**
   *  Applies any current user interaction to the camera. Takes into account maximum alpha rotation.
   */
  _applyUserInteraction() {
    if (this._userIsMoving() && !this._shouldAnimationStopForInteraction()) {
      this._lastInteractionTime = PrecisionDate.Now;
    }
  }
  // Tools
  _userIsMoving() {
    if (!this._attachedCamera) {
      return false;
    }
    return this._attachedCamera.inertialAlphaOffset !== 0 || this._attachedCamera.inertialBetaOffset !== 0 || this._attachedCamera.inertialRadiusOffset !== 0 || this._attachedCamera.inertialPanningX !== 0 || this._attachedCamera.inertialPanningY !== 0 || this._isPointerDown;
  }
};

// node_modules/@babylonjs/core/Animations/easing.js
var EasingFunction = class _EasingFunction {
  constructor() {
    this._easingMode = _EasingFunction.EASINGMODE_EASEIN;
  }
  /**
   * Sets the easing mode of the current function.
   * @param easingMode Defines the willing mode (EASINGMODE_EASEIN, EASINGMODE_EASEOUT or EASINGMODE_EASEINOUT)
   */
  setEasingMode(easingMode) {
    const n = Math.min(Math.max(easingMode, 0), 2);
    this._easingMode = n;
  }
  /**
   * Gets the current easing mode.
   * @returns the easing mode
   */
  getEasingMode() {
    return this._easingMode;
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  easeInCore(gradient) {
    throw new Error("You must implement this method");
  }
  /**
   * Given an input gradient between 0 and 1, this returns the corresponding value
   * of the easing function.
   * @param gradient Defines the value between 0 and 1 we want the easing value for
   * @returns the corresponding value on the curve defined by the easing function
   */
  ease(gradient) {
    switch (this._easingMode) {
      case _EasingFunction.EASINGMODE_EASEIN:
        return this.easeInCore(gradient);
      case _EasingFunction.EASINGMODE_EASEOUT:
        return 1 - this.easeInCore(1 - gradient);
    }
    if (gradient >= 0.5) {
      return (1 - this.easeInCore((1 - gradient) * 2)) * 0.5 + 0.5;
    }
    return this.easeInCore(gradient * 2) * 0.5;
  }
};
EasingFunction.EASINGMODE_EASEIN = 0;
EasingFunction.EASINGMODE_EASEOUT = 1;
EasingFunction.EASINGMODE_EASEINOUT = 2;
var CircleEase = class extends EasingFunction {
  /**
   * @internal
   */
  easeInCore(gradient) {
    gradient = Math.max(0, Math.min(1, gradient));
    return 1 - Math.sqrt(1 - gradient * gradient);
  }
};
var BackEase = class extends EasingFunction {
  /**
   * Instantiates a back ease easing
   * @see https://easings.net/#easeInBack
   * @param amplitude Defines the amplitude of the function
   */
  constructor(amplitude = 1) {
    super();
    this.amplitude = amplitude;
  }
  /**
   * @internal
   */
  easeInCore(gradient) {
    const num = Math.max(0, this.amplitude);
    return Math.pow(gradient, 3) - gradient * num * Math.sin(3.141592653589793 * gradient);
  }
};
var BounceEase = class extends EasingFunction {
  /**
   * Instantiates a bounce easing
   * @see https://easings.net/#easeInBounce
   * @param bounces Defines the number of bounces
   * @param bounciness Defines the amplitude of the bounce
   */
  constructor(bounces = 3, bounciness = 2) {
    super();
    this.bounces = bounces;
    this.bounciness = bounciness;
  }
  /**
   * @internal
   */
  easeInCore(gradient) {
    const y = Math.max(0, this.bounces);
    let bounciness = this.bounciness;
    if (bounciness <= 1) {
      bounciness = 1.001;
    }
    const num9 = Math.pow(bounciness, y);
    const num5 = 1 - bounciness;
    const num4 = (1 - num9) / num5 + num9 * 0.5;
    const num15 = gradient * num4;
    const num65 = Math.log(-num15 * (1 - bounciness) + 1) / Math.log(bounciness);
    const num3 = Math.floor(num65);
    const num13 = num3 + 1;
    const num8 = (1 - Math.pow(bounciness, num3)) / (num5 * num4);
    const num12 = (1 - Math.pow(bounciness, num13)) / (num5 * num4);
    const num7 = (num8 + num12) * 0.5;
    const num6 = gradient - num7;
    const num2 = num7 - num8;
    return -Math.pow(1 / bounciness, y - num3) / (num2 * num2) * (num6 - num2) * (num6 + num2);
  }
};
var CubicEase = class extends EasingFunction {
  /**
   * @internal
   */
  easeInCore(gradient) {
    return gradient * gradient * gradient;
  }
};
var ElasticEase = class extends EasingFunction {
  /**
   * Instantiates an elastic easing function
   * @see https://easings.net/#easeInElastic
   * @param oscillations Defines the number of oscillations
   * @param springiness Defines the amplitude of the oscillations
   */
  constructor(oscillations = 3, springiness = 3) {
    super();
    this.oscillations = oscillations;
    this.springiness = springiness;
  }
  /**
   * @internal
   */
  easeInCore(gradient) {
    let num2;
    const num3 = Math.max(0, this.oscillations);
    const num = Math.max(0, this.springiness);
    if (num == 0) {
      num2 = gradient;
    } else {
      num2 = (Math.exp(num * gradient) - 1) / (Math.exp(num) - 1);
    }
    return num2 * Math.sin((6.283185307179586 * num3 + 1.5707963267948966) * gradient);
  }
};
var ExponentialEase = class extends EasingFunction {
  /**
   * Instantiates an exponential easing function
   * @see https://easings.net/#easeInExpo
   * @param exponent Defines the exponent of the function
   */
  constructor(exponent = 2) {
    super();
    this.exponent = exponent;
  }
  /**
   * @internal
   */
  easeInCore(gradient) {
    if (this.exponent <= 0) {
      return gradient;
    }
    return (Math.exp(this.exponent * gradient) - 1) / (Math.exp(this.exponent) - 1);
  }
};
var PowerEase = class extends EasingFunction {
  /**
   * Instantiates an power base easing function
   * @see https://easings.net/#easeInQuad
   * @param power Defines the power of the function
   */
  constructor(power = 2) {
    super();
    this.power = power;
  }
  /**
   * @internal
   */
  easeInCore(gradient) {
    const y = Math.max(0, this.power);
    return Math.pow(gradient, y);
  }
};
var QuadraticEase = class extends EasingFunction {
  /**
   * @internal
   */
  easeInCore(gradient) {
    return gradient * gradient;
  }
};
var QuarticEase = class extends EasingFunction {
  /**
   * @internal
   */
  easeInCore(gradient) {
    return gradient * gradient * gradient * gradient;
  }
};
var QuinticEase = class extends EasingFunction {
  /**
   * @internal
   */
  easeInCore(gradient) {
    return gradient * gradient * gradient * gradient * gradient;
  }
};
var SineEase = class extends EasingFunction {
  /**
   * @internal
   */
  easeInCore(gradient) {
    return 1 - Math.sin(1.5707963267948966 * (1 - gradient));
  }
};
var BezierCurveEase = class extends EasingFunction {
  /**
   * Instantiates a bezier function
   * @see http://cubic-bezier.com/#.17,.67,.83,.67
   * @param x1 Defines the x component of the start tangent in the bezier curve
   * @param y1 Defines the y component of the start tangent in the bezier curve
   * @param x2 Defines the x component of the end tangent in the bezier curve
   * @param y2 Defines the y component of the end tangent in the bezier curve
   */
  constructor(x1 = 0, y1 = 0, x2 = 1, y2 = 1) {
    super();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  /**
   * @internal
   */
  easeInCore(gradient) {
    return BezierCurve.Interpolate(gradient, this.x1, this.y1, this.x2, this.y2);
  }
};

// node_modules/@babylonjs/core/Animations/animationKey.js
var AnimationKeyInterpolation;
(function(AnimationKeyInterpolation2) {
  AnimationKeyInterpolation2[AnimationKeyInterpolation2["NONE"] = 0] = "NONE";
  AnimationKeyInterpolation2[AnimationKeyInterpolation2["STEP"] = 1] = "STEP";
})(AnimationKeyInterpolation || (AnimationKeyInterpolation = {}));

// node_modules/@babylonjs/core/Animations/animationRange.js
var AnimationRange = class _AnimationRange {
  /**
   * Initializes the range of an animation
   * @param name The name of the animation range
   * @param from The starting frame of the animation
   * @param to The ending frame of the animation
   */
  constructor(name5, from, to) {
    this.name = name5;
    this.from = from;
    this.to = to;
  }
  /**
   * Makes a copy of the animation range
   * @returns A copy of the animation range
   */
  clone() {
    return new _AnimationRange(this.name, this.from, this.to);
  }
};

// node_modules/@babylonjs/core/Animations/animation.js
var _staticOffsetValueQuaternion = Object.freeze(new Quaternion(0, 0, 0, 0));
var _staticOffsetValueVector3 = Object.freeze(Vector3.Zero());
var _staticOffsetValueVector2 = Object.freeze(Vector2.Zero());
var _staticOffsetValueSize = Object.freeze(Size.Zero());
var _staticOffsetValueColor3 = Object.freeze(Color3.Black());
var _staticOffsetValueColor4 = Object.freeze(new Color4(0, 0, 0, 0));
var evaluateAnimationState = {
  key: 0,
  repeatCount: 0,
  loopMode: 2
};
var Animation = class _Animation {
  /**
   * @internal Internal use
   */
  static _PrepareAnimation(name5, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction) {
    let dataType = void 0;
    if (!isNaN(parseFloat(from)) && isFinite(from)) {
      dataType = _Animation.ANIMATIONTYPE_FLOAT;
    } else if (from instanceof Quaternion) {
      dataType = _Animation.ANIMATIONTYPE_QUATERNION;
    } else if (from instanceof Vector3) {
      dataType = _Animation.ANIMATIONTYPE_VECTOR3;
    } else if (from instanceof Vector2) {
      dataType = _Animation.ANIMATIONTYPE_VECTOR2;
    } else if (from instanceof Color3) {
      dataType = _Animation.ANIMATIONTYPE_COLOR3;
    } else if (from instanceof Color4) {
      dataType = _Animation.ANIMATIONTYPE_COLOR4;
    } else if (from instanceof Size) {
      dataType = _Animation.ANIMATIONTYPE_SIZE;
    }
    if (dataType == void 0) {
      return null;
    }
    const animation = new _Animation(name5, targetProperty, framePerSecond, dataType, loopMode);
    const keys = [
      { frame: 0, value: from },
      { frame: totalFrame, value: to }
    ];
    animation.setKeys(keys);
    if (easingFunction !== void 0) {
      animation.setEasingFunction(easingFunction);
    }
    return animation;
  }
  /**
   * Sets up an animation
   * @param property The property to animate
   * @param animationType The animation type to apply
   * @param framePerSecond The frames per second of the animation
   * @param easingFunction The easing function used in the animation
   * @returns The created animation
   */
  static CreateAnimation(property, animationType, framePerSecond, easingFunction) {
    const animation = new _Animation(property + "Animation", property, framePerSecond, animationType, _Animation.ANIMATIONLOOPMODE_CONSTANT);
    animation.setEasingFunction(easingFunction);
    return animation;
  }
  /**
   * Create and start an animation on a node
   * @param name defines the name of the global animation that will be run on all nodes
   * @param target defines the target where the animation will take place
   * @param targetProperty defines property to animate
   * @param framePerSecond defines the number of frame per second yo use
   * @param totalFrame defines the number of frames in total
   * @param from defines the initial value
   * @param to defines the final value
   * @param loopMode defines which loop mode you want to use (off by default)
   * @param easingFunction defines the easing function to use (linear by default)
   * @param onAnimationEnd defines the callback to call when animation end
   * @param scene defines the hosting scene
   * @returns the animatable created for this animation
   */
  static CreateAndStartAnimation(name5, target, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd, scene) {
    const animation = _Animation._PrepareAnimation(name5, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
    if (!animation) {
      return null;
    }
    if (target.getScene) {
      scene = target.getScene();
    }
    if (!scene) {
      return null;
    }
    return scene.beginDirectAnimation(target, [animation], 0, totalFrame, animation.loopMode === 1, 1, onAnimationEnd);
  }
  /**
   * Create and start an animation on a node and its descendants
   * @param name defines the name of the global animation that will be run on all nodes
   * @param node defines the root node where the animation will take place
   * @param directDescendantsOnly if true only direct descendants will be used, if false direct and also indirect (children of children, an so on in a recursive manner) descendants will be used
   * @param targetProperty defines property to animate
   * @param framePerSecond defines the number of frame per second to use
   * @param totalFrame defines the number of frames in total
   * @param from defines the initial value
   * @param to defines the final value
   * @param loopMode defines which loop mode you want to use (off by default)
   * @param easingFunction defines the easing function to use (linear by default)
   * @param onAnimationEnd defines the callback to call when an animation ends (will be called once per node)
   * @returns the list of animatables created for all nodes
   * @example https://www.babylonjs-playground.com/#MH0VLI
   */
  static CreateAndStartHierarchyAnimation(name5, node, directDescendantsOnly, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
    const animation = _Animation._PrepareAnimation(name5, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
    if (!animation) {
      return null;
    }
    const scene = node.getScene();
    return scene.beginDirectHierarchyAnimation(node, directDescendantsOnly, [animation], 0, totalFrame, animation.loopMode === 1, 1, onAnimationEnd);
  }
  /**
   * Creates a new animation, merges it with the existing animations and starts it
   * @param name Name of the animation
   * @param node Node which contains the scene that begins the animations
   * @param targetProperty Specifies which property to animate
   * @param framePerSecond The frames per second of the animation
   * @param totalFrame The total number of frames
   * @param from The frame at the beginning of the animation
   * @param to The frame at the end of the animation
   * @param loopMode Specifies the loop mode of the animation
   * @param easingFunction (Optional) The easing function of the animation, which allow custom mathematical formulas for animations
   * @param onAnimationEnd Callback to run once the animation is complete
   * @returns Nullable animation
   */
  static CreateMergeAndStartAnimation(name5, node, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction, onAnimationEnd) {
    const animation = _Animation._PrepareAnimation(name5, targetProperty, framePerSecond, totalFrame, from, to, loopMode, easingFunction);
    if (!animation) {
      return null;
    }
    node.animations.push(animation);
    return node.getScene().beginAnimation(node, 0, totalFrame, animation.loopMode === 1, 1, onAnimationEnd);
  }
  /** @internal */
  static MakeAnimationAdditive(sourceAnimation, referenceFrameOrOptions, range, cloneOriginal = false, clonedName) {
    var _a, _b;
    let options;
    if (typeof referenceFrameOrOptions === "object") {
      options = referenceFrameOrOptions;
    } else {
      options = {
        referenceFrame: referenceFrameOrOptions !== null && referenceFrameOrOptions !== void 0 ? referenceFrameOrOptions : 0,
        range,
        cloneOriginalAnimation: cloneOriginal,
        clonedAnimationName: clonedName
      };
    }
    let animation = sourceAnimation;
    if (options.cloneOriginalAnimation) {
      animation = sourceAnimation.clone();
      animation.name = options.clonedAnimationName || animation.name;
    }
    if (!animation._keys.length) {
      return animation;
    }
    const referenceFrame = options.referenceFrame && options.referenceFrame >= 0 ? options.referenceFrame : 0;
    let startIndex = 0;
    const firstKey = animation._keys[0];
    let endIndex = animation._keys.length - 1;
    const lastKey = animation._keys[endIndex];
    const valueStore = {
      referenceValue: firstKey.value,
      referencePosition: TmpVectors.Vector3[0],
      referenceQuaternion: TmpVectors.Quaternion[0],
      referenceScaling: TmpVectors.Vector3[1],
      keyPosition: TmpVectors.Vector3[2],
      keyQuaternion: TmpVectors.Quaternion[1],
      keyScaling: TmpVectors.Vector3[3]
    };
    let from = firstKey.frame;
    let to = lastKey.frame;
    if (options.range) {
      const rangeValue = animation.getRange(options.range);
      if (rangeValue) {
        from = rangeValue.from;
        to = rangeValue.to;
      }
    } else {
      from = (_a = options.fromFrame) !== null && _a !== void 0 ? _a : from;
      to = (_b = options.toFrame) !== null && _b !== void 0 ? _b : to;
    }
    if (from !== firstKey.frame) {
      startIndex = animation.createKeyForFrame(from);
    }
    if (to !== lastKey.frame) {
      endIndex = animation.createKeyForFrame(to);
    }
    if (animation._keys.length === 1) {
      const value = animation._getKeyValue(animation._keys[0]);
      valueStore.referenceValue = value.clone ? value.clone() : value;
    } else if (referenceFrame <= firstKey.frame) {
      const value = animation._getKeyValue(firstKey.value);
      valueStore.referenceValue = value.clone ? value.clone() : value;
    } else if (referenceFrame >= lastKey.frame) {
      const value = animation._getKeyValue(lastKey.value);
      valueStore.referenceValue = value.clone ? value.clone() : value;
    } else {
      evaluateAnimationState.key = 0;
      const value = animation._interpolate(referenceFrame, evaluateAnimationState);
      valueStore.referenceValue = value.clone ? value.clone() : value;
    }
    if (animation.dataType === _Animation.ANIMATIONTYPE_QUATERNION) {
      valueStore.referenceValue.normalize().conjugateInPlace();
    } else if (animation.dataType === _Animation.ANIMATIONTYPE_MATRIX) {
      valueStore.referenceValue.decompose(valueStore.referenceScaling, valueStore.referenceQuaternion, valueStore.referencePosition);
      valueStore.referenceQuaternion.normalize().conjugateInPlace();
    }
    let startFrame = Number.MAX_VALUE;
    const clippedKeys = options.clipKeys ? [] : null;
    for (let index = startIndex; index <= endIndex; index++) {
      let key = animation._keys[index];
      if (clippedKeys) {
        key = {
          frame: key.frame,
          value: key.value.clone ? key.value.clone() : key.value,
          inTangent: key.inTangent,
          outTangent: key.outTangent,
          interpolation: key.interpolation,
          lockedTangent: key.lockedTangent
        };
        if (startFrame === Number.MAX_VALUE) {
          startFrame = key.frame;
        }
        key.frame -= startFrame;
        clippedKeys.push(key);
      }
      if (index && animation.dataType !== _Animation.ANIMATIONTYPE_FLOAT && key.value === firstKey.value) {
        continue;
      }
      switch (animation.dataType) {
        case _Animation.ANIMATIONTYPE_MATRIX:
          key.value.decompose(valueStore.keyScaling, valueStore.keyQuaternion, valueStore.keyPosition);
          valueStore.keyPosition.subtractInPlace(valueStore.referencePosition);
          valueStore.keyScaling.divideInPlace(valueStore.referenceScaling);
          valueStore.referenceQuaternion.multiplyToRef(valueStore.keyQuaternion, valueStore.keyQuaternion);
          Matrix.ComposeToRef(valueStore.keyScaling, valueStore.keyQuaternion, valueStore.keyPosition, key.value);
          break;
        case _Animation.ANIMATIONTYPE_QUATERNION:
          valueStore.referenceValue.multiplyToRef(key.value, key.value);
          break;
        case _Animation.ANIMATIONTYPE_VECTOR2:
        case _Animation.ANIMATIONTYPE_VECTOR3:
        case _Animation.ANIMATIONTYPE_COLOR3:
        case _Animation.ANIMATIONTYPE_COLOR4:
          key.value.subtractToRef(valueStore.referenceValue, key.value);
          break;
        case _Animation.ANIMATIONTYPE_SIZE:
          key.value.width -= valueStore.referenceValue.width;
          key.value.height -= valueStore.referenceValue.height;
          break;
        default:
          key.value -= valueStore.referenceValue;
      }
    }
    if (clippedKeys) {
      animation.setKeys(clippedKeys, true);
    }
    return animation;
  }
  /**
   * Transition property of an host to the target Value
   * @param property The property to transition
   * @param targetValue The target Value of the property
   * @param host The object where the property to animate belongs
   * @param scene Scene used to run the animation
   * @param frameRate Framerate (in frame/s) to use
   * @param transition The transition type we want to use
   * @param duration The duration of the animation, in milliseconds
   * @param onAnimationEnd Callback trigger at the end of the animation
   * @returns Nullable animation
   */
  static TransitionTo(property, targetValue, host, scene, frameRate, transition, duration, onAnimationEnd = null) {
    if (duration <= 0) {
      host[property] = targetValue;
      if (onAnimationEnd) {
        onAnimationEnd();
      }
      return null;
    }
    const endFrame = frameRate * (duration / 1e3);
    transition.setKeys([
      {
        frame: 0,
        value: host[property].clone ? host[property].clone() : host[property]
      },
      {
        frame: endFrame,
        value: targetValue
      }
    ]);
    if (!host.animations) {
      host.animations = [];
    }
    host.animations.push(transition);
    const animation = scene.beginAnimation(host, 0, endFrame, false);
    animation.onAnimationEnd = onAnimationEnd;
    return animation;
  }
  /**
   * Return the array of runtime animations currently using this animation
   */
  get runtimeAnimations() {
    return this._runtimeAnimations;
  }
  /**
   * Specifies if any of the runtime animations are currently running
   */
  get hasRunningRuntimeAnimations() {
    for (const runtimeAnimation of this._runtimeAnimations) {
      if (!runtimeAnimation.isStopped()) {
        return true;
      }
    }
    return false;
  }
  /**
   * Initializes the animation
   * @param name Name of the animation
   * @param targetProperty Property to animate
   * @param framePerSecond The frames per second of the animation
   * @param dataType The data type of the animation
   * @param loopMode The loop mode of the animation
   * @param enableBlending Specifies if blending should be enabled
   */
  constructor(name5, targetProperty, framePerSecond, dataType, loopMode, enableBlending) {
    this.name = name5;
    this.targetProperty = targetProperty;
    this.framePerSecond = framePerSecond;
    this.dataType = dataType;
    this.loopMode = loopMode;
    this.enableBlending = enableBlending;
    this._easingFunction = null;
    this._runtimeAnimations = new Array();
    this._events = new Array();
    this.blendingSpeed = 0.01;
    this._ranges = {};
    this.targetPropertyPath = targetProperty.split(".");
    this.dataType = dataType;
    this.loopMode = loopMode === void 0 ? _Animation.ANIMATIONLOOPMODE_CYCLE : loopMode;
    this.uniqueId = _Animation._UniqueIdGenerator++;
  }
  // Methods
  /**
   * Converts the animation to a string
   * @param fullDetails support for multiple levels of logging within scene loading
   * @returns String form of the animation
   */
  toString(fullDetails) {
    let ret = "Name: " + this.name + ", property: " + this.targetProperty;
    ret += ", datatype: " + ["Float", "Vector3", "Quaternion", "Matrix", "Color3", "Vector2"][this.dataType];
    ret += ", nKeys: " + (this._keys ? this._keys.length : "none");
    ret += ", nRanges: " + (this._ranges ? Object.keys(this._ranges).length : "none");
    if (fullDetails) {
      ret += ", Ranges: {";
      let first = true;
      for (const name5 in this._ranges) {
        if (first) {
          ret += ", ";
          first = false;
        }
        ret += name5;
      }
      ret += "}";
    }
    return ret;
  }
  /**
   * Add an event to this animation
   * @param event Event to add
   */
  addEvent(event) {
    this._events.push(event);
    this._events.sort((a, b) => a.frame - b.frame);
  }
  /**
   * Remove all events found at the given frame
   * @param frame The frame to remove events from
   */
  removeEvents(frame) {
    for (let index = 0; index < this._events.length; index++) {
      if (this._events[index].frame === frame) {
        this._events.splice(index, 1);
        index--;
      }
    }
  }
  /**
   * Retrieves all the events from the animation
   * @returns Events from the animation
   */
  getEvents() {
    return this._events;
  }
  /**
   * Creates an animation range
   * @param name Name of the animation range
   * @param from Starting frame of the animation range
   * @param to Ending frame of the animation
   */
  createRange(name5, from, to) {
    if (!this._ranges[name5]) {
      this._ranges[name5] = new AnimationRange(name5, from, to);
    }
  }
  /**
   * Deletes an animation range by name
   * @param name Name of the animation range to delete
   * @param deleteFrames Specifies if the key frames for the range should also be deleted (true) or not (false)
   */
  deleteRange(name5, deleteFrames = true) {
    const range = this._ranges[name5];
    if (!range) {
      return;
    }
    if (deleteFrames) {
      const from = range.from;
      const to = range.to;
      for (let key = this._keys.length - 1; key >= 0; key--) {
        if (this._keys[key].frame >= from && this._keys[key].frame <= to) {
          this._keys.splice(key, 1);
        }
      }
    }
    this._ranges[name5] = null;
  }
  /**
   * Gets the animation range by name, or null if not defined
   * @param name Name of the animation range
   * @returns Nullable animation range
   */
  getRange(name5) {
    return this._ranges[name5];
  }
  /**
   * Gets the key frames from the animation
   * @returns The key frames of the animation
   */
  getKeys() {
    return this._keys;
  }
  /**
   * Gets the highest frame rate of the animation
   * @returns Highest frame rate of the animation
   */
  getHighestFrame() {
    let ret = 0;
    for (let key = 0, nKeys = this._keys.length; key < nKeys; key++) {
      if (ret < this._keys[key].frame) {
        ret = this._keys[key].frame;
      }
    }
    return ret;
  }
  /**
   * Gets the easing function of the animation
   * @returns Easing function of the animation
   */
  getEasingFunction() {
    return this._easingFunction;
  }
  /**
   * Sets the easing function of the animation
   * @param easingFunction A custom mathematical formula for animation
   */
  setEasingFunction(easingFunction) {
    this._easingFunction = easingFunction;
  }
  /**
   * Interpolates a scalar linearly
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated scalar value
   */
  floatInterpolateFunction(startValue, endValue, gradient) {
    return Scalar.Lerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a scalar cubically
   * @param startValue Start value of the animation curve
   * @param outTangent End tangent of the animation
   * @param endValue End value of the animation curve
   * @param inTangent Start tangent of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated scalar value
   */
  floatInterpolateFunctionWithTangents(startValue, outTangent, endValue, inTangent, gradient) {
    return Scalar.Hermite(startValue, outTangent, endValue, inTangent, gradient);
  }
  /**
   * Interpolates a quaternion using a spherical linear interpolation
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated quaternion value
   */
  quaternionInterpolateFunction(startValue, endValue, gradient) {
    return Quaternion.Slerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a quaternion cubically
   * @param startValue Start value of the animation curve
   * @param outTangent End tangent of the animation curve
   * @param endValue End value of the animation curve
   * @param inTangent Start tangent of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated quaternion value
   */
  quaternionInterpolateFunctionWithTangents(startValue, outTangent, endValue, inTangent, gradient) {
    return Quaternion.Hermite(startValue, outTangent, endValue, inTangent, gradient).normalize();
  }
  /**
   * Interpolates a Vector3 linearly
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate (value between 0 and 1)
   * @returns Interpolated scalar value
   */
  vector3InterpolateFunction(startValue, endValue, gradient) {
    return Vector3.Lerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a Vector3 cubically
   * @param startValue Start value of the animation curve
   * @param outTangent End tangent of the animation
   * @param endValue End value of the animation curve
   * @param inTangent Start tangent of the animation curve
   * @param gradient Scalar amount to interpolate (value between 0 and 1)
   * @returns InterpolatedVector3 value
   */
  vector3InterpolateFunctionWithTangents(startValue, outTangent, endValue, inTangent, gradient) {
    return Vector3.Hermite(startValue, outTangent, endValue, inTangent, gradient);
  }
  /**
   * Interpolates a Vector2 linearly
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate (value between 0 and 1)
   * @returns Interpolated Vector2 value
   */
  vector2InterpolateFunction(startValue, endValue, gradient) {
    return Vector2.Lerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a Vector2 cubically
   * @param startValue Start value of the animation curve
   * @param outTangent End tangent of the animation
   * @param endValue End value of the animation curve
   * @param inTangent Start tangent of the animation curve
   * @param gradient Scalar amount to interpolate (value between 0 and 1)
   * @returns Interpolated Vector2 value
   */
  vector2InterpolateFunctionWithTangents(startValue, outTangent, endValue, inTangent, gradient) {
    return Vector2.Hermite(startValue, outTangent, endValue, inTangent, gradient);
  }
  /**
   * Interpolates a size linearly
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated Size value
   */
  sizeInterpolateFunction(startValue, endValue, gradient) {
    return Size.Lerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a Color3 linearly
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated Color3 value
   */
  color3InterpolateFunction(startValue, endValue, gradient) {
    return Color3.Lerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a Color3 cubically
   * @param startValue Start value of the animation curve
   * @param outTangent End tangent of the animation
   * @param endValue End value of the animation curve
   * @param inTangent Start tangent of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns interpolated value
   */
  color3InterpolateFunctionWithTangents(startValue, outTangent, endValue, inTangent, gradient) {
    return Color3.Hermite(startValue, outTangent, endValue, inTangent, gradient);
  }
  /**
   * Interpolates a Color4 linearly
   * @param startValue Start value of the animation curve
   * @param endValue End value of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns Interpolated Color3 value
   */
  color4InterpolateFunction(startValue, endValue, gradient) {
    return Color4.Lerp(startValue, endValue, gradient);
  }
  /**
   * Interpolates a Color4 cubically
   * @param startValue Start value of the animation curve
   * @param outTangent End tangent of the animation
   * @param endValue End value of the animation curve
   * @param inTangent Start tangent of the animation curve
   * @param gradient Scalar amount to interpolate
   * @returns interpolated value
   */
  color4InterpolateFunctionWithTangents(startValue, outTangent, endValue, inTangent, gradient) {
    return Color4.Hermite(startValue, outTangent, endValue, inTangent, gradient);
  }
  /**
   * @internal Internal use only
   */
  _getKeyValue(value) {
    if (typeof value === "function") {
      return value();
    }
    return value;
  }
  /**
   * Evaluate the animation value at a given frame
   * @param currentFrame defines the frame where we want to evaluate the animation
   * @returns the animation value
   */
  evaluate(currentFrame) {
    evaluateAnimationState.key = 0;
    return this._interpolate(currentFrame, evaluateAnimationState);
  }
  /**
   * @internal Internal use only
   */
  _interpolate(currentFrame, state, searchClosestKeyOnly = false) {
    var _a;
    if (state.loopMode === _Animation.ANIMATIONLOOPMODE_CONSTANT && state.repeatCount > 0) {
      return state.highLimitValue.clone ? state.highLimitValue.clone() : state.highLimitValue;
    }
    const keys = this._keys;
    const keysLength = keys.length;
    let key = state.key;
    while (key >= 0 && currentFrame < keys[key].frame) {
      --key;
    }
    while (key + 1 <= keysLength - 1 && currentFrame >= keys[key + 1].frame) {
      ++key;
    }
    state.key = key;
    if (key < 0) {
      return searchClosestKeyOnly ? void 0 : this._getKeyValue(keys[0].value);
    } else if (key + 1 > keysLength - 1) {
      return searchClosestKeyOnly ? void 0 : this._getKeyValue(keys[keysLength - 1].value);
    }
    const startKey = keys[key];
    const endKey = keys[key + 1];
    if (searchClosestKeyOnly && (currentFrame === startKey.frame || currentFrame === endKey.frame)) {
      return void 0;
    }
    const startValue = this._getKeyValue(startKey.value);
    const endValue = this._getKeyValue(endKey.value);
    if (startKey.interpolation === AnimationKeyInterpolation.STEP) {
      if (endKey.frame > currentFrame) {
        return startValue;
      } else {
        return endValue;
      }
    }
    const useTangent = startKey.outTangent !== void 0 && endKey.inTangent !== void 0;
    const frameDelta = endKey.frame - startKey.frame;
    let gradient = (currentFrame - startKey.frame) / frameDelta;
    const easingFunction = startKey.easingFunction || this.getEasingFunction();
    if (easingFunction !== null) {
      gradient = easingFunction.ease(gradient);
    }
    switch (this.dataType) {
      case _Animation.ANIMATIONTYPE_FLOAT: {
        const floatValue = useTangent ? this.floatInterpolateFunctionWithTangents(startValue, startKey.outTangent * frameDelta, endValue, endKey.inTangent * frameDelta, gradient) : this.floatInterpolateFunction(startValue, endValue, gradient);
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return floatValue;
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return ((_a = state.offsetValue) !== null && _a !== void 0 ? _a : 0) * state.repeatCount + floatValue;
        }
        break;
      }
      case _Animation.ANIMATIONTYPE_QUATERNION: {
        const quatValue = useTangent ? this.quaternionInterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.quaternionInterpolateFunction(startValue, endValue, gradient);
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return quatValue;
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return quatValue.addInPlace((state.offsetValue || _staticOffsetValueQuaternion).scale(state.repeatCount));
        }
        return quatValue;
      }
      case _Animation.ANIMATIONTYPE_VECTOR3: {
        const vec3Value = useTangent ? this.vector3InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector3InterpolateFunction(startValue, endValue, gradient);
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return vec3Value;
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return vec3Value.add((state.offsetValue || _staticOffsetValueVector3).scale(state.repeatCount));
        }
        break;
      }
      case _Animation.ANIMATIONTYPE_VECTOR2: {
        const vec2Value = useTangent ? this.vector2InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.vector2InterpolateFunction(startValue, endValue, gradient);
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return vec2Value;
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return vec2Value.add((state.offsetValue || _staticOffsetValueVector2).scale(state.repeatCount));
        }
        break;
      }
      case _Animation.ANIMATIONTYPE_SIZE: {
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return this.sizeInterpolateFunction(startValue, endValue, gradient);
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return this.sizeInterpolateFunction(startValue, endValue, gradient).add((state.offsetValue || _staticOffsetValueSize).scale(state.repeatCount));
        }
        break;
      }
      case _Animation.ANIMATIONTYPE_COLOR3: {
        const color3Value = useTangent ? this.color3InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.color3InterpolateFunction(startValue, endValue, gradient);
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return color3Value;
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return color3Value.add((state.offsetValue || _staticOffsetValueColor3).scale(state.repeatCount));
        }
        break;
      }
      case _Animation.ANIMATIONTYPE_COLOR4: {
        const color4Value = useTangent ? this.color4InterpolateFunctionWithTangents(startValue, startKey.outTangent.scale(frameDelta), endValue, endKey.inTangent.scale(frameDelta), gradient) : this.color4InterpolateFunction(startValue, endValue, gradient);
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO:
            return color4Value;
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT:
            return color4Value.add((state.offsetValue || _staticOffsetValueColor4).scale(state.repeatCount));
        }
        break;
      }
      case _Animation.ANIMATIONTYPE_MATRIX: {
        switch (state.loopMode) {
          case _Animation.ANIMATIONLOOPMODE_CYCLE:
          case _Animation.ANIMATIONLOOPMODE_CONSTANT:
          case _Animation.ANIMATIONLOOPMODE_YOYO: {
            if (_Animation.AllowMatricesInterpolation) {
              return this.matrixInterpolateFunction(startValue, endValue, gradient, state.workValue);
            }
            return startValue;
          }
          case _Animation.ANIMATIONLOOPMODE_RELATIVE:
          case _Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT: {
            return startValue;
          }
        }
        break;
      }
    }
    return 0;
  }
  /**
   * Defines the function to use to interpolate matrices
   * @param startValue defines the start matrix
   * @param endValue defines the end matrix
   * @param gradient defines the gradient between both matrices
   * @param result defines an optional target matrix where to store the interpolation
   * @returns the interpolated matrix
   */
  matrixInterpolateFunction(startValue, endValue, gradient, result) {
    if (_Animation.AllowMatrixDecomposeForInterpolation) {
      if (result) {
        Matrix.DecomposeLerpToRef(startValue, endValue, gradient, result);
        return result;
      }
      return Matrix.DecomposeLerp(startValue, endValue, gradient);
    }
    if (result) {
      Matrix.LerpToRef(startValue, endValue, gradient, result);
      return result;
    }
    return Matrix.Lerp(startValue, endValue, gradient);
  }
  /**
   * Makes a copy of the animation
   * @returns Cloned animation
   */
  clone() {
    const clone = new _Animation(this.name, this.targetPropertyPath.join("."), this.framePerSecond, this.dataType, this.loopMode);
    clone.enableBlending = this.enableBlending;
    clone.blendingSpeed = this.blendingSpeed;
    if (this._keys) {
      clone.setKeys(this._keys);
    }
    if (this._ranges) {
      clone._ranges = {};
      for (const name5 in this._ranges) {
        const range = this._ranges[name5];
        if (!range) {
          continue;
        }
        clone._ranges[name5] = range.clone();
      }
    }
    return clone;
  }
  /**
   * Sets the key frames of the animation
   * @param values The animation key frames to set
   * @param dontClone Whether to clone the keys or not (default is false, so the array of keys is cloned)
   */
  setKeys(values, dontClone = false) {
    this._keys = !dontClone ? values.slice(0) : values;
  }
  /**
   * Creates a key for the frame passed as a parameter and adds it to the animation IF a key doesn't already exist for that frame
   * @param frame Frame number
   * @returns The key index if the key was added or the index of the pre existing key if the frame passed as parameter already has a corresponding key
   */
  createKeyForFrame(frame) {
    evaluateAnimationState.key = 0;
    const value = this._interpolate(frame, evaluateAnimationState, true);
    if (!value) {
      return evaluateAnimationState.key === frame ? evaluateAnimationState.key : evaluateAnimationState.key + 1;
    }
    const newKey = {
      frame,
      value: value.clone ? value.clone() : value
    };
    this._keys.splice(evaluateAnimationState.key + 1, 0, newKey);
    return evaluateAnimationState.key + 1;
  }
  /**
   * Serializes the animation to an object
   * @returns Serialized object
   */
  serialize() {
    const serializationObject = {};
    serializationObject.name = this.name;
    serializationObject.property = this.targetProperty;
    serializationObject.framePerSecond = this.framePerSecond;
    serializationObject.dataType = this.dataType;
    serializationObject.loopBehavior = this.loopMode;
    serializationObject.enableBlending = this.enableBlending;
    serializationObject.blendingSpeed = this.blendingSpeed;
    const dataType = this.dataType;
    serializationObject.keys = [];
    const keys = this.getKeys();
    for (let index = 0; index < keys.length; index++) {
      const animationKey = keys[index];
      const key = {};
      key.frame = animationKey.frame;
      switch (dataType) {
        case _Animation.ANIMATIONTYPE_FLOAT:
          key.values = [animationKey.value];
          if (animationKey.inTangent !== void 0) {
            key.values.push(animationKey.inTangent);
          }
          if (animationKey.outTangent !== void 0) {
            if (animationKey.inTangent === void 0) {
              key.values.push(void 0);
            }
            key.values.push(animationKey.outTangent);
          }
          if (animationKey.interpolation !== void 0) {
            if (animationKey.inTangent === void 0) {
              key.values.push(void 0);
            }
            if (animationKey.outTangent === void 0) {
              key.values.push(void 0);
            }
            key.values.push(animationKey.interpolation);
          }
          break;
        case _Animation.ANIMATIONTYPE_QUATERNION:
        case _Animation.ANIMATIONTYPE_MATRIX:
        case _Animation.ANIMATIONTYPE_VECTOR3:
        case _Animation.ANIMATIONTYPE_COLOR3:
        case _Animation.ANIMATIONTYPE_COLOR4:
          key.values = animationKey.value.asArray();
          if (animationKey.inTangent != void 0) {
            key.values.push(animationKey.inTangent.asArray());
          }
          if (animationKey.outTangent != void 0) {
            if (animationKey.inTangent === void 0) {
              key.values.push(void 0);
            }
            key.values.push(animationKey.outTangent.asArray());
          }
          if (animationKey.interpolation !== void 0) {
            if (animationKey.inTangent === void 0) {
              key.values.push(void 0);
            }
            if (animationKey.outTangent === void 0) {
              key.values.push(void 0);
            }
            key.values.push(animationKey.interpolation);
          }
          break;
      }
      serializationObject.keys.push(key);
    }
    serializationObject.ranges = [];
    for (const name5 in this._ranges) {
      const source = this._ranges[name5];
      if (!source) {
        continue;
      }
      const range = {};
      range.name = name5;
      range.from = source.from;
      range.to = source.to;
      serializationObject.ranges.push(range);
    }
    return serializationObject;
  }
  /**
   * @internal
   */
  static _UniversalLerp(left, right, amount) {
    const constructor = left.constructor;
    if (constructor.Lerp) {
      return constructor.Lerp(left, right, amount);
    } else if (constructor.Slerp) {
      return constructor.Slerp(left, right, amount);
    } else if (left.toFixed) {
      return left * (1 - amount) + amount * right;
    } else {
      return right;
    }
  }
  /**
   * Parses an animation object and creates an animation
   * @param parsedAnimation Parsed animation object
   * @returns Animation object
   */
  static Parse(parsedAnimation) {
    const animation = new _Animation(parsedAnimation.name, parsedAnimation.property, parsedAnimation.framePerSecond, parsedAnimation.dataType, parsedAnimation.loopBehavior);
    const dataType = parsedAnimation.dataType;
    const keys = [];
    let data;
    let index;
    if (parsedAnimation.enableBlending) {
      animation.enableBlending = parsedAnimation.enableBlending;
    }
    if (parsedAnimation.blendingSpeed) {
      animation.blendingSpeed = parsedAnimation.blendingSpeed;
    }
    for (index = 0; index < parsedAnimation.keys.length; index++) {
      const key = parsedAnimation.keys[index];
      let inTangent = void 0;
      let outTangent = void 0;
      let interpolation = void 0;
      switch (dataType) {
        case _Animation.ANIMATIONTYPE_FLOAT:
          data = key.values[0];
          if (key.values.length >= 2) {
            inTangent = key.values[1];
          }
          if (key.values.length >= 3) {
            outTangent = key.values[2];
          }
          if (key.values.length >= 4) {
            interpolation = key.values[3];
          }
          break;
        case _Animation.ANIMATIONTYPE_QUATERNION:
          data = Quaternion.FromArray(key.values);
          if (key.values.length >= 8) {
            const _inTangent = Quaternion.FromArray(key.values.slice(4, 8));
            if (!_inTangent.equals(Quaternion.Zero())) {
              inTangent = _inTangent;
            }
          }
          if (key.values.length >= 12) {
            const _outTangent = Quaternion.FromArray(key.values.slice(8, 12));
            if (!_outTangent.equals(Quaternion.Zero())) {
              outTangent = _outTangent;
            }
          }
          if (key.values.length >= 13) {
            interpolation = key.values[12];
          }
          break;
        case _Animation.ANIMATIONTYPE_MATRIX:
          data = Matrix.FromArray(key.values);
          if (key.values.length >= 17) {
            interpolation = key.values[16];
          }
          break;
        case _Animation.ANIMATIONTYPE_COLOR3:
          data = Color3.FromArray(key.values);
          if (key.values[3]) {
            inTangent = Color3.FromArray(key.values[3]);
          }
          if (key.values[4]) {
            outTangent = Color3.FromArray(key.values[4]);
          }
          if (key.values[5]) {
            interpolation = key.values[5];
          }
          break;
        case _Animation.ANIMATIONTYPE_COLOR4:
          data = Color4.FromArray(key.values);
          if (key.values[4]) {
            inTangent = Color4.FromArray(key.values[4]);
          }
          if (key.values[5]) {
            outTangent = Color4.FromArray(key.values[5]);
          }
          if (key.values[6]) {
            interpolation = Color4.FromArray(key.values[6]);
          }
          break;
        case _Animation.ANIMATIONTYPE_VECTOR3:
        default:
          data = Vector3.FromArray(key.values);
          if (key.values[3]) {
            inTangent = Vector3.FromArray(key.values[3]);
          }
          if (key.values[4]) {
            outTangent = Vector3.FromArray(key.values[4]);
          }
          if (key.values[5]) {
            interpolation = key.values[5];
          }
          break;
      }
      const keyData = {};
      keyData.frame = key.frame;
      keyData.value = data;
      if (inTangent != void 0) {
        keyData.inTangent = inTangent;
      }
      if (outTangent != void 0) {
        keyData.outTangent = outTangent;
      }
      if (interpolation != void 0) {
        keyData.interpolation = interpolation;
      }
      keys.push(keyData);
    }
    animation.setKeys(keys);
    if (parsedAnimation.ranges) {
      for (index = 0; index < parsedAnimation.ranges.length; index++) {
        data = parsedAnimation.ranges[index];
        animation.createRange(data.name, data.from, data.to);
      }
    }
    return animation;
  }
  /**
   * Appends the serialized animations from the source animations
   * @param source Source containing the animations
   * @param destination Target to store the animations
   */
  static AppendSerializedAnimations(source, destination) {
    SerializationHelper.AppendSerializedAnimations(source, destination);
  }
  /**
   * Creates a new animation or an array of animations from a snippet saved in a remote file
   * @param name defines the name of the animation to create (can be null or empty to use the one from the json data)
   * @param url defines the url to load from
   * @returns a promise that will resolve to the new animation or an array of animations
   */
  static ParseFromFileAsync(name5, url) {
    return new Promise((resolve, reject) => {
      const request = new WebRequest();
      request.addEventListener("readystatechange", () => {
        if (request.readyState == 4) {
          if (request.status == 200) {
            let serializationObject = JSON.parse(request.responseText);
            if (serializationObject.animations) {
              serializationObject = serializationObject.animations;
            }
            if (serializationObject.length) {
              const output = [];
              for (const serializedAnimation of serializationObject) {
                output.push(this.Parse(serializedAnimation));
              }
              resolve(output);
            } else {
              const output = this.Parse(serializationObject);
              if (name5) {
                output.name = name5;
              }
              resolve(output);
            }
          } else {
            reject("Unable to load the animation");
          }
        }
      });
      request.open("GET", url);
      request.send();
    });
  }
  /**
   * Creates an animation or an array of animations from a snippet saved by the Inspector
   * @param snippetId defines the snippet to load
   * @returns a promise that will resolve to the new animation or a new array of animations
   */
  static ParseFromSnippetAsync(snippetId) {
    return new Promise((resolve, reject) => {
      const request = new WebRequest();
      request.addEventListener("readystatechange", () => {
        if (request.readyState == 4) {
          if (request.status == 200) {
            const snippet = JSON.parse(JSON.parse(request.responseText).jsonPayload);
            if (snippet.animations) {
              const serializationObject = JSON.parse(snippet.animations);
              const outputs = [];
              for (const serializedAnimation of serializationObject.animations) {
                const output = this.Parse(serializedAnimation);
                output.snippetId = snippetId;
                outputs.push(output);
              }
              resolve(outputs);
            } else {
              const serializationObject = JSON.parse(snippet.animation);
              const output = this.Parse(serializationObject);
              output.snippetId = snippetId;
              resolve(output);
            }
          } else {
            reject("Unable to load the snippet " + snippetId);
          }
        }
      });
      request.open("GET", this.SnippetUrl + "/" + snippetId.replace(/#/g, "/"));
      request.send();
    });
  }
};
Animation._UniqueIdGenerator = 0;
Animation.AllowMatricesInterpolation = false;
Animation.AllowMatrixDecomposeForInterpolation = true;
Animation.SnippetUrl = `https://snippet.babylonjs.com`;
Animation.ANIMATIONTYPE_FLOAT = 0;
Animation.ANIMATIONTYPE_VECTOR3 = 1;
Animation.ANIMATIONTYPE_QUATERNION = 2;
Animation.ANIMATIONTYPE_MATRIX = 3;
Animation.ANIMATIONTYPE_COLOR3 = 4;
Animation.ANIMATIONTYPE_COLOR4 = 7;
Animation.ANIMATIONTYPE_VECTOR2 = 5;
Animation.ANIMATIONTYPE_SIZE = 6;
Animation.ANIMATIONLOOPMODE_RELATIVE = 0;
Animation.ANIMATIONLOOPMODE_CYCLE = 1;
Animation.ANIMATIONLOOPMODE_CONSTANT = 2;
Animation.ANIMATIONLOOPMODE_YOYO = 4;
Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT = 5;
Animation.CreateFromSnippetAsync = Animation.ParseFromSnippetAsync;
RegisterClass("BABYLON.Animation", Animation);
Node._AnimationRangeFactory = (name5, from, to) => new AnimationRange(name5, from, to);

// node_modules/@babylonjs/core/Behaviors/Cameras/bouncingBehavior.js
var BouncingBehavior = class _BouncingBehavior {
  constructor() {
    this.transitionDuration = 450;
    this.lowerRadiusTransitionRange = 2;
    this.upperRadiusTransitionRange = -2;
    this._autoTransitionRange = false;
    this._radiusIsAnimating = false;
    this._radiusBounceTransition = null;
    this._animatables = new Array();
  }
  /**
   * Gets the name of the behavior.
   */
  get name() {
    return "Bouncing";
  }
  /**
   * Gets a value indicating if the lowerRadiusTransitionRange and upperRadiusTransitionRange are defined automatically
   */
  get autoTransitionRange() {
    return this._autoTransitionRange;
  }
  /**
   * Sets a value indicating if the lowerRadiusTransitionRange and upperRadiusTransitionRange are defined automatically
   * Transition ranges will be set to 5% of the bounding box diagonal in world space
   */
  set autoTransitionRange(value) {
    if (this._autoTransitionRange === value) {
      return;
    }
    this._autoTransitionRange = value;
    const camera = this._attachedCamera;
    if (!camera) {
      return;
    }
    if (value) {
      this._onMeshTargetChangedObserver = camera.onMeshTargetChangedObservable.add((mesh) => {
        if (!mesh) {
          return;
        }
        mesh.computeWorldMatrix(true);
        const diagonal = mesh.getBoundingInfo().diagonalLength;
        this.lowerRadiusTransitionRange = diagonal * 0.05;
        this.upperRadiusTransitionRange = diagonal * 0.05;
      });
    } else if (this._onMeshTargetChangedObserver) {
      camera.onMeshTargetChangedObservable.remove(this._onMeshTargetChangedObserver);
    }
  }
  /**
   * Initializes the behavior.
   */
  init() {
  }
  /**
   * Attaches the behavior to its arc rotate camera.
   * @param camera Defines the camera to attach the behavior to
   */
  attach(camera) {
    this._attachedCamera = camera;
    this._onAfterCheckInputsObserver = camera.onAfterCheckInputsObservable.add(() => {
      if (!this._attachedCamera) {
        return;
      }
      if (this._isRadiusAtLimit(this._attachedCamera.lowerRadiusLimit)) {
        this._applyBoundRadiusAnimation(this.lowerRadiusTransitionRange);
      }
      if (this._isRadiusAtLimit(this._attachedCamera.upperRadiusLimit)) {
        this._applyBoundRadiusAnimation(this.upperRadiusTransitionRange);
      }
    });
  }
  /**
   * Detaches the behavior from its current arc rotate camera.
   */
  detach() {
    if (!this._attachedCamera) {
      return;
    }
    if (this._onAfterCheckInputsObserver) {
      this._attachedCamera.onAfterCheckInputsObservable.remove(this._onAfterCheckInputsObserver);
    }
    if (this._onMeshTargetChangedObserver) {
      this._attachedCamera.onMeshTargetChangedObservable.remove(this._onMeshTargetChangedObserver);
    }
    this._attachedCamera = null;
  }
  /**
   * Checks if the camera radius is at the specified limit. Takes into account animation locks.
   * @param radiusLimit The limit to check against.
   * @returns Bool to indicate if at limit.
   */
  _isRadiusAtLimit(radiusLimit) {
    if (!this._attachedCamera) {
      return false;
    }
    if (this._attachedCamera.radius === radiusLimit && !this._radiusIsAnimating) {
      return true;
    }
    return false;
  }
  /**
   * Applies an animation to the radius of the camera, extending by the radiusDelta.
   * @param radiusDelta The delta by which to animate to. Can be negative.
   */
  _applyBoundRadiusAnimation(radiusDelta) {
    if (!this._attachedCamera) {
      return;
    }
    if (!this._radiusBounceTransition) {
      _BouncingBehavior.EasingFunction.setEasingMode(_BouncingBehavior.EasingMode);
      this._radiusBounceTransition = Animation.CreateAnimation("radius", Animation.ANIMATIONTYPE_FLOAT, 60, _BouncingBehavior.EasingFunction);
    }
    this._cachedWheelPrecision = this._attachedCamera.wheelPrecision;
    this._attachedCamera.wheelPrecision = Infinity;
    this._attachedCamera.inertialRadiusOffset = 0;
    this.stopAllAnimations();
    this._radiusIsAnimating = true;
    const animatable = Animation.TransitionTo("radius", this._attachedCamera.radius + radiusDelta, this._attachedCamera, this._attachedCamera.getScene(), 60, this._radiusBounceTransition, this.transitionDuration, () => this._clearAnimationLocks());
    if (animatable) {
      this._animatables.push(animatable);
    }
  }
  /**
   * Removes all animation locks. Allows new animations to be added to any of the camera properties.
   */
  _clearAnimationLocks() {
    this._radiusIsAnimating = false;
    if (this._attachedCamera) {
      this._attachedCamera.wheelPrecision = this._cachedWheelPrecision;
    }
  }
  /**
   * Stops and removes all animations that have been applied to the camera
   */
  stopAllAnimations() {
    if (this._attachedCamera) {
      this._attachedCamera.animations = [];
    }
    while (this._animatables.length) {
      this._animatables[0].onAnimationEnd = null;
      this._animatables[0].stop();
      this._animatables.shift();
    }
  }
};
BouncingBehavior.EasingFunction = new BackEase(0.3);
BouncingBehavior.EasingMode = EasingFunction.EASINGMODE_EASEOUT;

// node_modules/@babylonjs/core/Behaviors/Cameras/framingBehavior.js
var FramingBehavior = class _FramingBehavior {
  constructor() {
    this.onTargetFramingAnimationEndObservable = new Observable();
    this._mode = _FramingBehavior.FitFrustumSidesMode;
    this._radiusScale = 1;
    this._positionScale = 0.5;
    this._defaultElevation = 0.3;
    this._elevationReturnTime = 1500;
    this._elevationReturnWaitTime = 1e3;
    this._zoomStopsAnimation = false;
    this._framingTime = 1500;
    this.autoCorrectCameraLimitsAndSensibility = true;
    this._isPointerDown = false;
    this._lastInteractionTime = -Infinity;
    this._animatables = new Array();
    this._betaIsAnimating = false;
  }
  /**
   * Gets the name of the behavior.
   */
  get name() {
    return "Framing";
  }
  /**
   * Sets the current mode used by the behavior
   */
  set mode(mode) {
    this._mode = mode;
  }
  /**
   * Gets current mode used by the behavior.
   */
  get mode() {
    return this._mode;
  }
  /**
   * Sets the scale applied to the radius (1 by default)
   */
  set radiusScale(radius) {
    this._radiusScale = radius;
  }
  /**
   * Gets the scale applied to the radius
   */
  get radiusScale() {
    return this._radiusScale;
  }
  /**
   * Sets the scale to apply on Y axis to position camera focus. 0.5 by default which means the center of the bounding box.
   */
  set positionScale(scale) {
    this._positionScale = scale;
  }
  /**
   * Gets the scale to apply on Y axis to position camera focus. 0.5 by default which means the center of the bounding box.
   */
  get positionScale() {
    return this._positionScale;
  }
  /**
   * Sets the angle above/below the horizontal plane to return to when the return to default elevation idle
   * behaviour is triggered, in radians.
   */
  set defaultElevation(elevation) {
    this._defaultElevation = elevation;
  }
  /**
   * Gets the angle above/below the horizontal plane to return to when the return to default elevation idle
   * behaviour is triggered, in radians.
   */
  get defaultElevation() {
    return this._defaultElevation;
  }
  /**
   * Sets the time (in milliseconds) taken to return to the default beta position.
   * Negative value indicates camera should not return to default.
   */
  set elevationReturnTime(speed) {
    this._elevationReturnTime = speed;
  }
  /**
   * Gets the time (in milliseconds) taken to return to the default beta position.
   * Negative value indicates camera should not return to default.
   */
  get elevationReturnTime() {
    return this._elevationReturnTime;
  }
  /**
   * Sets the delay (in milliseconds) taken before the camera returns to the default beta position.
   */
  set elevationReturnWaitTime(time) {
    this._elevationReturnWaitTime = time;
  }
  /**
   * Gets the delay (in milliseconds) taken before the camera returns to the default beta position.
   */
  get elevationReturnWaitTime() {
    return this._elevationReturnWaitTime;
  }
  /**
   * Sets the flag that indicates if user zooming should stop animation.
   */
  set zoomStopsAnimation(flag) {
    this._zoomStopsAnimation = flag;
  }
  /**
   * Gets the flag that indicates if user zooming should stop animation.
   */
  get zoomStopsAnimation() {
    return this._zoomStopsAnimation;
  }
  /**
   * Sets the transition time when framing the mesh, in milliseconds
   */
  set framingTime(time) {
    this._framingTime = time;
  }
  /**
   * Gets the transition time when framing the mesh, in milliseconds
   */
  get framingTime() {
    return this._framingTime;
  }
  /**
   * Initializes the behavior.
   */
  init() {
  }
  /**
   * Attaches the behavior to its arc rotate camera.
   * @param camera Defines the camera to attach the behavior to
   */
  attach(camera) {
    this._attachedCamera = camera;
    const scene = this._attachedCamera.getScene();
    _FramingBehavior.EasingFunction.setEasingMode(_FramingBehavior.EasingMode);
    this._onPrePointerObservableObserver = scene.onPrePointerObservable.add((pointerInfoPre) => {
      if (pointerInfoPre.type === PointerEventTypes.POINTERDOWN) {
        this._isPointerDown = true;
        return;
      }
      if (pointerInfoPre.type === PointerEventTypes.POINTERUP) {
        this._isPointerDown = false;
      }
    });
    this._onMeshTargetChangedObserver = camera.onMeshTargetChangedObservable.add((mesh) => {
      if (mesh) {
        this.zoomOnMesh(mesh, void 0, () => {
          this.onTargetFramingAnimationEndObservable.notifyObservers();
        });
      }
    });
    this._onAfterCheckInputsObserver = camera.onAfterCheckInputsObservable.add(() => {
      this._applyUserInteraction();
      this._maintainCameraAboveGround();
    });
  }
  /**
   * Detaches the behavior from its current arc rotate camera.
   */
  detach() {
    if (!this._attachedCamera) {
      return;
    }
    const scene = this._attachedCamera.getScene();
    if (this._onPrePointerObservableObserver) {
      scene.onPrePointerObservable.remove(this._onPrePointerObservableObserver);
    }
    if (this._onAfterCheckInputsObserver) {
      this._attachedCamera.onAfterCheckInputsObservable.remove(this._onAfterCheckInputsObserver);
    }
    if (this._onMeshTargetChangedObserver) {
      this._attachedCamera.onMeshTargetChangedObservable.remove(this._onMeshTargetChangedObserver);
    }
    this._attachedCamera = null;
  }
  /**
   * Targets the given mesh and updates zoom level accordingly.
   * @param mesh  The mesh to target.
   * @param focusOnOriginXZ Determines if the camera should focus on 0 in the X and Z axis instead of the mesh
   * @param onAnimationEnd Callback triggered at the end of the framing animation
   */
  zoomOnMesh(mesh, focusOnOriginXZ = false, onAnimationEnd = null) {
    mesh.computeWorldMatrix(true);
    const boundingBox = mesh.getBoundingInfo().boundingBox;
    this.zoomOnBoundingInfo(boundingBox.minimumWorld, boundingBox.maximumWorld, focusOnOriginXZ, onAnimationEnd);
  }
  /**
   * Targets the given mesh with its children and updates zoom level accordingly.
   * @param mesh  The mesh to target.
   * @param focusOnOriginXZ Determines if the camera should focus on 0 in the X and Z axis instead of the mesh
   * @param onAnimationEnd Callback triggered at the end of the framing animation
   */
  zoomOnMeshHierarchy(mesh, focusOnOriginXZ = false, onAnimationEnd = null) {
    mesh.computeWorldMatrix(true);
    const boundingBox = mesh.getHierarchyBoundingVectors(true);
    this.zoomOnBoundingInfo(boundingBox.min, boundingBox.max, focusOnOriginXZ, onAnimationEnd);
  }
  /**
   * Targets the given meshes with their children and updates zoom level accordingly.
   * @param meshes  The mesh to target.
   * @param focusOnOriginXZ Determines if the camera should focus on 0 in the X and Z axis instead of the mesh
   * @param onAnimationEnd Callback triggered at the end of the framing animation
   */
  zoomOnMeshesHierarchy(meshes, focusOnOriginXZ = false, onAnimationEnd = null) {
    const min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    const max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    for (let i = 0; i < meshes.length; i++) {
      const boundingInfo = meshes[i].getHierarchyBoundingVectors(true);
      Vector3.CheckExtends(boundingInfo.min, min, max);
      Vector3.CheckExtends(boundingInfo.max, min, max);
    }
    this.zoomOnBoundingInfo(min, max, focusOnOriginXZ, onAnimationEnd);
  }
  /**
   * Targets the bounding box info defined by its extends and updates zoom level accordingly.
   * @param minimumWorld Determines the smaller position of the bounding box extend
   * @param maximumWorld Determines the bigger position of the bounding box extend
   * @param focusOnOriginXZ Determines if the camera should focus on 0 in the X and Z axis instead of the mesh
   * @param onAnimationEnd Callback triggered at the end of the framing animation
   * @returns true if the zoom was done
   */
  zoomOnBoundingInfo(minimumWorld, maximumWorld, focusOnOriginXZ = false, onAnimationEnd = null) {
    let zoomTarget;
    if (!this._attachedCamera) {
      return false;
    }
    const bottom = minimumWorld.y;
    const top = maximumWorld.y;
    const zoomTargetY = bottom + (top - bottom) * this._positionScale;
    const radiusWorld = maximumWorld.subtract(minimumWorld).scale(0.5);
    if (focusOnOriginXZ) {
      zoomTarget = new Vector3(0, zoomTargetY, 0);
    } else {
      const centerWorld = minimumWorld.add(radiusWorld);
      zoomTarget = new Vector3(centerWorld.x, zoomTargetY, centerWorld.z);
    }
    if (!this._vectorTransition) {
      this._vectorTransition = Animation.CreateAnimation("target", Animation.ANIMATIONTYPE_VECTOR3, 60, _FramingBehavior.EasingFunction);
    }
    this._betaIsAnimating = true;
    let animatable = Animation.TransitionTo("target", zoomTarget, this._attachedCamera, this._attachedCamera.getScene(), 60, this._vectorTransition, this._framingTime);
    if (animatable) {
      this._animatables.push(animatable);
    }
    let radius = 0;
    if (this._mode === _FramingBehavior.FitFrustumSidesMode) {
      const position = this._calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld);
      if (this.autoCorrectCameraLimitsAndSensibility) {
        this._attachedCamera.lowerRadiusLimit = radiusWorld.length() + this._attachedCamera.minZ;
      }
      radius = position;
    } else if (this._mode === _FramingBehavior.IgnoreBoundsSizeMode) {
      radius = this._calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld);
      if (this.autoCorrectCameraLimitsAndSensibility && this._attachedCamera.lowerRadiusLimit === null) {
        this._attachedCamera.lowerRadiusLimit = this._attachedCamera.minZ;
      }
    }
    if (this.autoCorrectCameraLimitsAndSensibility) {
      const extend = maximumWorld.subtract(minimumWorld).length();
      this._attachedCamera.panningSensibility = 5e3 / extend;
      this._attachedCamera.wheelPrecision = 100 / radius;
    }
    if (!this._radiusTransition) {
      this._radiusTransition = Animation.CreateAnimation("radius", Animation.ANIMATIONTYPE_FLOAT, 60, _FramingBehavior.EasingFunction);
    }
    animatable = Animation.TransitionTo("radius", radius, this._attachedCamera, this._attachedCamera.getScene(), 60, this._radiusTransition, this._framingTime, () => {
      this.stopAllAnimations();
      if (onAnimationEnd) {
        onAnimationEnd();
      }
      if (this._attachedCamera && this._attachedCamera.useInputToRestoreState) {
        this._attachedCamera.storeState();
      }
    });
    if (animatable) {
      this._animatables.push(animatable);
    }
    return true;
  }
  /**
   * Calculates the lowest radius for the camera based on the bounding box of the mesh.
   * @param minimumWorld
   * @param maximumWorld
   * @returns The minimum distance from the primary mesh's center point at which the camera must be kept in order
   *		 to fully enclose the mesh in the viewing frustum.
   */
  _calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld) {
    const camera = this._attachedCamera;
    if (!camera) {
      return 0;
    }
    let distance = camera._calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld, this._radiusScale);
    if (camera.lowerRadiusLimit && this._mode === _FramingBehavior.IgnoreBoundsSizeMode) {
      distance = distance < camera.lowerRadiusLimit ? camera.lowerRadiusLimit : distance;
    }
    if (camera.upperRadiusLimit) {
      distance = distance > camera.upperRadiusLimit ? camera.upperRadiusLimit : distance;
    }
    return distance;
  }
  /**
   * Keeps the camera above the ground plane. If the user pulls the camera below the ground plane, the camera
   * is automatically returned to its default position (expected to be above ground plane).
   */
  _maintainCameraAboveGround() {
    if (this._elevationReturnTime < 0) {
      return;
    }
    const timeSinceInteraction = PrecisionDate.Now - this._lastInteractionTime;
    const defaultBeta = Math.PI * 0.5 - this._defaultElevation;
    const limitBeta = Math.PI * 0.5;
    if (this._attachedCamera && !this._betaIsAnimating && this._attachedCamera.beta > limitBeta && timeSinceInteraction >= this._elevationReturnWaitTime) {
      this._betaIsAnimating = true;
      this.stopAllAnimations();
      if (!this._betaTransition) {
        this._betaTransition = Animation.CreateAnimation("beta", Animation.ANIMATIONTYPE_FLOAT, 60, _FramingBehavior.EasingFunction);
      }
      const animatabe = Animation.TransitionTo("beta", defaultBeta, this._attachedCamera, this._attachedCamera.getScene(), 60, this._betaTransition, this._elevationReturnTime, () => {
        this._clearAnimationLocks();
        this.stopAllAnimations();
      });
      if (animatabe) {
        this._animatables.push(animatabe);
      }
    }
  }
  /**
   * Removes all animation locks. Allows new animations to be added to any of the arcCamera properties.
   */
  _clearAnimationLocks() {
    this._betaIsAnimating = false;
  }
  /**
   *  Applies any current user interaction to the camera. Takes into account maximum alpha rotation.
   */
  _applyUserInteraction() {
    if (this.isUserIsMoving) {
      this._lastInteractionTime = PrecisionDate.Now;
      this.stopAllAnimations();
      this._clearAnimationLocks();
    }
  }
  /**
   * Stops and removes all animations that have been applied to the camera
   */
  stopAllAnimations() {
    if (this._attachedCamera) {
      this._attachedCamera.animations = [];
    }
    while (this._animatables.length) {
      if (this._animatables[0]) {
        this._animatables[0].onAnimationEnd = null;
        this._animatables[0].stop();
      }
      this._animatables.shift();
    }
  }
  /**
   * Gets a value indicating if the user is moving the camera
   */
  get isUserIsMoving() {
    if (!this._attachedCamera) {
      return false;
    }
    return this._attachedCamera.inertialAlphaOffset !== 0 || this._attachedCamera.inertialBetaOffset !== 0 || this._attachedCamera.inertialRadiusOffset !== 0 || this._attachedCamera.inertialPanningX !== 0 || this._attachedCamera.inertialPanningY !== 0 || this._isPointerDown;
  }
};
FramingBehavior.EasingFunction = new ExponentialEase();
FramingBehavior.EasingMode = EasingFunction.EASINGMODE_EASEINOUT;
FramingBehavior.IgnoreBoundsSizeMode = 0;
FramingBehavior.FitFrustumSidesMode = 1;

// node_modules/@babylonjs/core/Cameras/arcRotateCamera.js
Node.AddNodeConstructor("ArcRotateCamera", (name5, scene) => {
  return () => new ArcRotateCamera(name5, 0, 0, 1, Vector3.Zero(), scene);
});
var ArcRotateCamera = class _ArcRotateCamera extends TargetCamera {
  /**
   * Defines the target point of the camera.
   * The camera looks towards it from the radius distance.
   */
  get target() {
    return this._target;
  }
  set target(value) {
    this.setTarget(value);
  }
  /**
   * Defines the target mesh of the camera.
   * The camera looks towards it from the radius distance.
   * Please note that setting a target host will disable panning.
   */
  get targetHost() {
    return this._targetHost;
  }
  set targetHost(value) {
    if (value) {
      this.setTarget(value);
    }
  }
  /**
   * Return the current target position of the camera. This value is expressed in local space.
   * @returns the target position
   */
  getTarget() {
    return this.target;
  }
  /**
   * Define the current local position of the camera in the scene
   */
  get position() {
    return this._position;
  }
  set position(newPosition) {
    this.setPosition(newPosition);
  }
  /**
   * The vector the camera should consider as up. (default is Vector3(0, 1, 0) as returned by Vector3.Up())
   * Setting this will copy the given vector to the camera's upVector, and set rotation matrices to and from Y up.
   * DO NOT set the up vector using copyFrom or copyFromFloats, as this bypasses setting the above matrices.
   */
  set upVector(vec) {
    if (!this._upToYMatrix) {
      this._yToUpMatrix = new Matrix();
      this._upToYMatrix = new Matrix();
      this._upVector = Vector3.Zero();
    }
    vec.normalize();
    this._upVector.copyFrom(vec);
    this.setMatUp();
  }
  get upVector() {
    return this._upVector;
  }
  /**
   * Sets the Y-up to camera up-vector rotation matrix, and the up-vector to Y-up rotation matrix.
   */
  setMatUp() {
    Matrix.RotationAlignToRef(Vector3.UpReadOnly, this._upVector, this._yToUpMatrix);
    Matrix.RotationAlignToRef(this._upVector, Vector3.UpReadOnly, this._upToYMatrix);
  }
  //-- begin properties for backward compatibility for inputs
  /**
   * Gets or Set the pointer angular sensibility  along the X axis or how fast is the camera rotating.
   */
  get angularSensibilityX() {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      return pointers.angularSensibilityX;
    }
    return 0;
  }
  set angularSensibilityX(value) {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      pointers.angularSensibilityX = value;
    }
  }
  /**
   * Gets or Set the pointer angular sensibility along the Y axis or how fast is the camera rotating.
   */
  get angularSensibilityY() {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      return pointers.angularSensibilityY;
    }
    return 0;
  }
  set angularSensibilityY(value) {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      pointers.angularSensibilityY = value;
    }
  }
  /**
   * Gets or Set the pointer pinch precision or how fast is the camera zooming.
   */
  get pinchPrecision() {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      return pointers.pinchPrecision;
    }
    return 0;
  }
  set pinchPrecision(value) {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      pointers.pinchPrecision = value;
    }
  }
  /**
   * Gets or Set the pointer pinch delta percentage or how fast is the camera zooming.
   * It will be used instead of pinchDeltaPrecision if different from 0.
   * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
   */
  get pinchDeltaPercentage() {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      return pointers.pinchDeltaPercentage;
    }
    return 0;
  }
  set pinchDeltaPercentage(value) {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      pointers.pinchDeltaPercentage = value;
    }
  }
  /**
   * Gets or Set the pointer use natural pinch zoom to override the pinch precision
   * and pinch delta percentage.
   * When useNaturalPinchZoom is true, multi touch zoom will zoom in such
   * that any object in the plane at the camera's target point will scale
   * perfectly with finger motion.
   */
  get useNaturalPinchZoom() {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      return pointers.useNaturalPinchZoom;
    }
    return false;
  }
  set useNaturalPinchZoom(value) {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      pointers.useNaturalPinchZoom = value;
    }
  }
  /**
   * Gets or Set the pointer panning sensibility or how fast is the camera moving.
   */
  get panningSensibility() {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      return pointers.panningSensibility;
    }
    return 0;
  }
  set panningSensibility(value) {
    const pointers = this.inputs.attached["pointers"];
    if (pointers) {
      pointers.panningSensibility = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control beta angle in a positive direction.
   */
  get keysUp() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysUp;
    }
    return [];
  }
  set keysUp(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysUp = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control beta angle in a negative direction.
   */
  get keysDown() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysDown;
    }
    return [];
  }
  set keysDown(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysDown = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control alpha angle in a negative direction.
   */
  get keysLeft() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysLeft;
    }
    return [];
  }
  set keysLeft(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysLeft = value;
    }
  }
  /**
   * Gets or Set the list of keyboard keys used to control alpha angle in a positive direction.
   */
  get keysRight() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRight;
    }
    return [];
  }
  set keysRight(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRight = value;
    }
  }
  /**
   * Gets or Set the mouse wheel precision or how fast is the camera zooming.
   */
  get wheelPrecision() {
    const mousewheel = this.inputs.attached["mousewheel"];
    if (mousewheel) {
      return mousewheel.wheelPrecision;
    }
    return 0;
  }
  set wheelPrecision(value) {
    const mousewheel = this.inputs.attached["mousewheel"];
    if (mousewheel) {
      mousewheel.wheelPrecision = value;
    }
  }
  /**
   * Gets or Set the boolean value that controls whether or not the mouse wheel
   * zooms to the location of the mouse pointer or not.  The default is false.
   */
  get zoomToMouseLocation() {
    const mousewheel = this.inputs.attached["mousewheel"];
    if (mousewheel) {
      return mousewheel.zoomToMouseLocation;
    }
    return false;
  }
  set zoomToMouseLocation(value) {
    const mousewheel = this.inputs.attached["mousewheel"];
    if (mousewheel) {
      mousewheel.zoomToMouseLocation = value;
    }
  }
  /**
   * Gets or Set the mouse wheel delta percentage or how fast is the camera zooming.
   * It will be used instead of pinchDeltaPrecision if different from 0.
   * It defines the percentage of current camera.radius to use as delta when pinch zoom is used.
   */
  get wheelDeltaPercentage() {
    const mousewheel = this.inputs.attached["mousewheel"];
    if (mousewheel) {
      return mousewheel.wheelDeltaPercentage;
    }
    return 0;
  }
  set wheelDeltaPercentage(value) {
    const mousewheel = this.inputs.attached["mousewheel"];
    if (mousewheel) {
      mousewheel.wheelDeltaPercentage = value;
    }
  }
  /**
   * Gets the bouncing behavior of the camera if it has been enabled.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
   */
  get bouncingBehavior() {
    return this._bouncingBehavior;
  }
  /**
   * Defines if the bouncing behavior of the camera is enabled on the camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#bouncing-behavior
   */
  get useBouncingBehavior() {
    return this._bouncingBehavior != null;
  }
  set useBouncingBehavior(value) {
    if (value === this.useBouncingBehavior) {
      return;
    }
    if (value) {
      this._bouncingBehavior = new BouncingBehavior();
      this.addBehavior(this._bouncingBehavior);
    } else if (this._bouncingBehavior) {
      this.removeBehavior(this._bouncingBehavior);
      this._bouncingBehavior = null;
    }
  }
  /**
   * Gets the framing behavior of the camera if it has been enabled.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
   */
  get framingBehavior() {
    return this._framingBehavior;
  }
  /**
   * Defines if the framing behavior of the camera is enabled on the camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#framing-behavior
   */
  get useFramingBehavior() {
    return this._framingBehavior != null;
  }
  set useFramingBehavior(value) {
    if (value === this.useFramingBehavior) {
      return;
    }
    if (value) {
      this._framingBehavior = new FramingBehavior();
      this.addBehavior(this._framingBehavior);
    } else if (this._framingBehavior) {
      this.removeBehavior(this._framingBehavior);
      this._framingBehavior = null;
    }
  }
  /**
   * Gets the auto rotation behavior of the camera if it has been enabled.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
   */
  get autoRotationBehavior() {
    return this._autoRotationBehavior;
  }
  /**
   * Defines if the auto rotation behavior of the camera is enabled on the camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/behaviors/cameraBehaviors#autorotation-behavior
   */
  get useAutoRotationBehavior() {
    return this._autoRotationBehavior != null;
  }
  set useAutoRotationBehavior(value) {
    if (value === this.useAutoRotationBehavior) {
      return;
    }
    if (value) {
      this._autoRotationBehavior = new AutoRotationBehavior();
      this.addBehavior(this._autoRotationBehavior);
    } else if (this._autoRotationBehavior) {
      this.removeBehavior(this._autoRotationBehavior);
      this._autoRotationBehavior = null;
    }
  }
  /**
   * Instantiates a new ArcRotateCamera in a given scene
   * @param name Defines the name of the camera
   * @param alpha Defines the camera rotation along the longitudinal axis
   * @param beta Defines the camera rotation along the latitudinal axis
   * @param radius Defines the camera distance from its target
   * @param target Defines the camera target
   * @param scene Defines the scene the camera belongs to
   * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active if not other active cameras have been defined
   */
  constructor(name5, alpha, beta, radius, target, scene, setActiveOnSceneIfNoneActive = true) {
    super(name5, Vector3.Zero(), scene, setActiveOnSceneIfNoneActive);
    this.inertialAlphaOffset = 0;
    this.inertialBetaOffset = 0;
    this.inertialRadiusOffset = 0;
    this.lowerAlphaLimit = null;
    this.upperAlphaLimit = null;
    this.lowerBetaLimit = 0.01;
    this.upperBetaLimit = Math.PI - 0.01;
    this.lowerRadiusLimit = null;
    this.upperRadiusLimit = null;
    this.inertialPanningX = 0;
    this.inertialPanningY = 0;
    this.pinchToPanMaxDistance = 20;
    this.panningDistanceLimit = null;
    this.panningOriginTarget = Vector3.Zero();
    this.panningInertia = 0.9;
    this.zoomOnFactor = 1;
    this.targetScreenOffset = Vector2.Zero();
    this.allowUpsideDown = true;
    this.useInputToRestoreState = true;
    this._viewMatrix = new Matrix();
    this.panningAxis = new Vector3(1, 1, 0);
    this._transformedDirection = new Vector3();
    this.mapPanning = false;
    this.onMeshTargetChangedObservable = new Observable();
    this.checkCollisions = false;
    this.collisionRadius = new Vector3(0.5, 0.5, 0.5);
    this._previousPosition = Vector3.Zero();
    this._collisionVelocity = Vector3.Zero();
    this._newPosition = Vector3.Zero();
    this._computationVector = Vector3.Zero();
    this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
      if (!collidedMesh) {
        this._previousPosition.copyFrom(this._position);
      } else {
        this.setPosition(newPosition);
        if (this.onCollide) {
          this.onCollide(collidedMesh);
        }
      }
      const cosa = Math.cos(this.alpha);
      const sina = Math.sin(this.alpha);
      const cosb = Math.cos(this.beta);
      let sinb = Math.sin(this.beta);
      if (sinb === 0) {
        sinb = 1e-4;
      }
      const target2 = this._getTargetPosition();
      this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
      target2.addToRef(this._computationVector, this._newPosition);
      this._position.copyFrom(this._newPosition);
      let up = this.upVector;
      if (this.allowUpsideDown && this.beta < 0) {
        up = up.clone();
        up = up.negate();
      }
      this._computeViewMatrix(this._position, target2, up);
      this._viewMatrix.addAtIndex(12, this.targetScreenOffset.x);
      this._viewMatrix.addAtIndex(13, this.targetScreenOffset.y);
      this._collisionTriggered = false;
    };
    this._target = Vector3.Zero();
    if (target) {
      this.setTarget(target);
    }
    this.alpha = alpha;
    this.beta = beta;
    this.radius = radius;
    this.getViewMatrix();
    this.inputs = new ArcRotateCameraInputsManager(this);
    this.inputs.addKeyboard().addMouseWheel().addPointers();
  }
  // Cache
  /** @internal */
  _initCache() {
    super._initCache();
    this._cache._target = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._cache.alpha = void 0;
    this._cache.beta = void 0;
    this._cache.radius = void 0;
    this._cache.targetScreenOffset = Vector2.Zero();
  }
  /**
   * @internal
   */
  _updateCache(ignoreParentClass) {
    if (!ignoreParentClass) {
      super._updateCache();
    }
    this._cache._target.copyFrom(this._getTargetPosition());
    this._cache.alpha = this.alpha;
    this._cache.beta = this.beta;
    this._cache.radius = this.radius;
    this._cache.targetScreenOffset.copyFrom(this.targetScreenOffset);
  }
  _getTargetPosition() {
    if (this._targetHost && this._targetHost.getAbsolutePosition) {
      const pos = this._targetHost.getAbsolutePosition();
      if (this._targetBoundingCenter) {
        pos.addToRef(this._targetBoundingCenter, this._target);
      } else {
        this._target.copyFrom(pos);
      }
    }
    const lockedTargetPosition = this._getLockedTargetPosition();
    if (lockedTargetPosition) {
      return lockedTargetPosition;
    }
    return this._target;
  }
  /**
   * Stores the current state of the camera (alpha, beta, radius and target)
   * @returns the camera itself
   */
  storeState() {
    this._storedAlpha = this.alpha;
    this._storedBeta = this.beta;
    this._storedRadius = this.radius;
    this._storedTarget = this._getTargetPosition().clone();
    this._storedTargetScreenOffset = this.targetScreenOffset.clone();
    return super.storeState();
  }
  /**
   * @internal
   * Restored camera state. You must call storeState() first
   */
  _restoreStateValues() {
    if (!super._restoreStateValues()) {
      return false;
    }
    this.setTarget(this._storedTarget.clone());
    this.alpha = this._storedAlpha;
    this.beta = this._storedBeta;
    this.radius = this._storedRadius;
    this.targetScreenOffset = this._storedTargetScreenOffset.clone();
    this.inertialAlphaOffset = 0;
    this.inertialBetaOffset = 0;
    this.inertialRadiusOffset = 0;
    this.inertialPanningX = 0;
    this.inertialPanningY = 0;
    return true;
  }
  // Synchronized
  /** @internal */
  _isSynchronizedViewMatrix() {
    if (!super._isSynchronizedViewMatrix()) {
      return false;
    }
    return this._cache._target.equals(this._getTargetPosition()) && this._cache.alpha === this.alpha && this._cache.beta === this.beta && this._cache.radius === this.radius && this._cache.targetScreenOffset.equals(this.targetScreenOffset);
  }
  /**
   * Attached controls to the current camera.
   * @param ignored defines an ignored parameter kept for backward compatibility.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   * @param useCtrlForPanning  Defines whether ctrl is used for panning within the controls
   * @param panningMouseButton Defines whether panning is allowed through mouse click button
   */
  attachControl(ignored, noPreventDefault, useCtrlForPanning = true, panningMouseButton = 2) {
    const args = arguments;
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(args);
    this._useCtrlForPanning = useCtrlForPanning;
    this._panningMouseButton = panningMouseButton;
    if (typeof args[0] === "boolean") {
      if (args.length > 1) {
        this._useCtrlForPanning = args[1];
      }
      if (args.length > 2) {
        this._panningMouseButton = args[2];
      }
    }
    this.inputs.attachElement(noPreventDefault);
    this._reset = () => {
      this.inertialAlphaOffset = 0;
      this.inertialBetaOffset = 0;
      this.inertialRadiusOffset = 0;
      this.inertialPanningX = 0;
      this.inertialPanningY = 0;
    };
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    this.inputs.detachElement();
    if (this._reset) {
      this._reset();
    }
  }
  /** @internal */
  _checkInputs() {
    if (this._collisionTriggered) {
      return;
    }
    this.inputs.checkInputs();
    if (this.inertialAlphaOffset !== 0 || this.inertialBetaOffset !== 0 || this.inertialRadiusOffset !== 0) {
      const directionModifier = this.invertRotation ? -1 : 1;
      const handednessMultiplier = this._calculateHandednessMultiplier();
      let inertialAlphaOffset = this.inertialAlphaOffset * handednessMultiplier;
      if (this.beta <= 0) {
        inertialAlphaOffset *= -1;
      }
      this.alpha += inertialAlphaOffset * directionModifier;
      this.beta += this.inertialBetaOffset * directionModifier;
      this.radius -= this.inertialRadiusOffset;
      this.inertialAlphaOffset *= this.inertia;
      this.inertialBetaOffset *= this.inertia;
      this.inertialRadiusOffset *= this.inertia;
      if (Math.abs(this.inertialAlphaOffset) < Epsilon) {
        this.inertialAlphaOffset = 0;
      }
      if (Math.abs(this.inertialBetaOffset) < Epsilon) {
        this.inertialBetaOffset = 0;
      }
      if (Math.abs(this.inertialRadiusOffset) < this.speed * Epsilon) {
        this.inertialRadiusOffset = 0;
      }
    }
    if (this.inertialPanningX !== 0 || this.inertialPanningY !== 0) {
      const localDirection = new Vector3(this.inertialPanningX, this.inertialPanningY, this.inertialPanningY);
      this._viewMatrix.invertToRef(this._cameraTransformMatrix);
      localDirection.multiplyInPlace(this.panningAxis);
      Vector3.TransformNormalToRef(localDirection, this._cameraTransformMatrix, this._transformedDirection);
      if (this.mapPanning) {
        const up = this.upVector;
        const right = Vector3.CrossToRef(this._transformedDirection, up, this._transformedDirection);
        Vector3.CrossToRef(up, right, this._transformedDirection);
      } else if (!this.panningAxis.y) {
        this._transformedDirection.y = 0;
      }
      if (!this._targetHost) {
        if (this.panningDistanceLimit) {
          this._transformedDirection.addInPlace(this._target);
          const distanceSquared = Vector3.DistanceSquared(this._transformedDirection, this.panningOriginTarget);
          if (distanceSquared <= this.panningDistanceLimit * this.panningDistanceLimit) {
            this._target.copyFrom(this._transformedDirection);
          }
        } else {
          this._target.addInPlace(this._transformedDirection);
        }
      }
      this.inertialPanningX *= this.panningInertia;
      this.inertialPanningY *= this.panningInertia;
      if (Math.abs(this.inertialPanningX) < this.speed * Epsilon) {
        this.inertialPanningX = 0;
      }
      if (Math.abs(this.inertialPanningY) < this.speed * Epsilon) {
        this.inertialPanningY = 0;
      }
    }
    this._checkLimits();
    super._checkInputs();
  }
  _checkLimits() {
    if (this.lowerBetaLimit === null || this.lowerBetaLimit === void 0) {
      if (this.allowUpsideDown && this.beta > Math.PI) {
        this.beta = this.beta - 2 * Math.PI;
      }
    } else {
      if (this.beta < this.lowerBetaLimit) {
        this.beta = this.lowerBetaLimit;
      }
    }
    if (this.upperBetaLimit === null || this.upperBetaLimit === void 0) {
      if (this.allowUpsideDown && this.beta < -Math.PI) {
        this.beta = this.beta + 2 * Math.PI;
      }
    } else {
      if (this.beta > this.upperBetaLimit) {
        this.beta = this.upperBetaLimit;
      }
    }
    if (this.lowerAlphaLimit !== null && this.alpha < this.lowerAlphaLimit) {
      this.alpha = this.lowerAlphaLimit;
    }
    if (this.upperAlphaLimit !== null && this.alpha > this.upperAlphaLimit) {
      this.alpha = this.upperAlphaLimit;
    }
    if (this.lowerRadiusLimit !== null && this.radius < this.lowerRadiusLimit) {
      this.radius = this.lowerRadiusLimit;
      this.inertialRadiusOffset = 0;
    }
    if (this.upperRadiusLimit !== null && this.radius > this.upperRadiusLimit) {
      this.radius = this.upperRadiusLimit;
      this.inertialRadiusOffset = 0;
    }
  }
  /**
   * Rebuilds angles (alpha, beta) and radius from the give position and target
   */
  rebuildAnglesAndRadius() {
    this._position.subtractToRef(this._getTargetPosition(), this._computationVector);
    if (this._upVector.x !== 0 || this._upVector.y !== 1 || this._upVector.z !== 0) {
      Vector3.TransformCoordinatesToRef(this._computationVector, this._upToYMatrix, this._computationVector);
    }
    this.radius = this._computationVector.length();
    if (this.radius === 0) {
      this.radius = 1e-4;
    }
    const previousAlpha = this.alpha;
    if (this._computationVector.x === 0 && this._computationVector.z === 0) {
      this.alpha = Math.PI / 2;
    } else {
      this.alpha = Math.acos(this._computationVector.x / Math.sqrt(Math.pow(this._computationVector.x, 2) + Math.pow(this._computationVector.z, 2)));
    }
    if (this._computationVector.z < 0) {
      this.alpha = 2 * Math.PI - this.alpha;
    }
    const alphaCorrectionTurns = Math.round((previousAlpha - this.alpha) / (2 * Math.PI));
    this.alpha += alphaCorrectionTurns * 2 * Math.PI;
    this.beta = Math.acos(this._computationVector.y / this.radius);
    this._checkLimits();
  }
  /**
   * Use a position to define the current camera related information like alpha, beta and radius
   * @param position Defines the position to set the camera at
   */
  setPosition(position) {
    if (this._position.equals(position)) {
      return;
    }
    this._position.copyFrom(position);
    this.rebuildAnglesAndRadius();
  }
  /**
   * Defines the target the camera should look at.
   * This will automatically adapt alpha beta and radius to fit within the new target.
   * Please note that setting a target as a mesh will disable panning.
   * @param target Defines the new target as a Vector or a mesh
   * @param toBoundingCenter In case of a mesh target, defines whether to target the mesh position or its bounding information center
   * @param allowSamePosition If false, prevents reapplying the new computed position if it is identical to the current one (optim)
   * @param cloneAlphaBetaRadius If true, replicate the current setup (alpha, beta, radius) on the new target
   */
  setTarget(target, toBoundingCenter = false, allowSamePosition = false, cloneAlphaBetaRadius = false) {
    var _a;
    cloneAlphaBetaRadius = (_a = this.overrideCloneAlphaBetaRadius) !== null && _a !== void 0 ? _a : cloneAlphaBetaRadius;
    if (target.getBoundingInfo) {
      if (toBoundingCenter) {
        this._targetBoundingCenter = target.getBoundingInfo().boundingBox.centerWorld.clone();
      } else {
        this._targetBoundingCenter = null;
      }
      target.computeWorldMatrix();
      this._targetHost = target;
      this._target = this._getTargetPosition();
      this.onMeshTargetChangedObservable.notifyObservers(this._targetHost);
    } else {
      const newTarget = target;
      const currentTarget = this._getTargetPosition();
      if (currentTarget && !allowSamePosition && currentTarget.equals(newTarget)) {
        return;
      }
      this._targetHost = null;
      this._target = newTarget;
      this._targetBoundingCenter = null;
      this.onMeshTargetChangedObservable.notifyObservers(null);
    }
    if (!cloneAlphaBetaRadius) {
      this.rebuildAnglesAndRadius();
    }
  }
  /** @internal */
  _getViewMatrix() {
    const cosa = Math.cos(this.alpha);
    const sina = Math.sin(this.alpha);
    const cosb = Math.cos(this.beta);
    let sinb = Math.sin(this.beta);
    if (sinb === 0) {
      sinb = 1e-4;
    }
    if (this.radius === 0) {
      this.radius = 1e-4;
    }
    const target = this._getTargetPosition();
    this._computationVector.copyFromFloats(this.radius * cosa * sinb, this.radius * cosb, this.radius * sina * sinb);
    if (this._upVector.x !== 0 || this._upVector.y !== 1 || this._upVector.z !== 0) {
      Vector3.TransformCoordinatesToRef(this._computationVector, this._yToUpMatrix, this._computationVector);
    }
    target.addToRef(this._computationVector, this._newPosition);
    if (this.getScene().collisionsEnabled && this.checkCollisions) {
      const coordinator = this.getScene().collisionCoordinator;
      if (!this._collider) {
        this._collider = coordinator.createCollider();
      }
      this._collider._radius = this.collisionRadius;
      this._newPosition.subtractToRef(this._position, this._collisionVelocity);
      this._collisionTriggered = true;
      coordinator.getNewPosition(this._position, this._collisionVelocity, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
    } else {
      this._position.copyFrom(this._newPosition);
      let up = this.upVector;
      if (this.allowUpsideDown && sinb < 0) {
        up = up.negate();
      }
      this._computeViewMatrix(this._position, target, up);
      this._viewMatrix.addAtIndex(12, this.targetScreenOffset.x);
      this._viewMatrix.addAtIndex(13, this.targetScreenOffset.y);
    }
    this._currentTarget = target;
    return this._viewMatrix;
  }
  /**
   * Zooms on a mesh to be at the min distance where we could see it fully in the current viewport.
   * @param meshes Defines the mesh to zoom on
   * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
   */
  zoomOn(meshes, doNotUpdateMaxZ = false) {
    meshes = meshes || this.getScene().meshes;
    const minMaxVector = Mesh.MinMax(meshes);
    let distance = this._calculateLowerRadiusFromModelBoundingSphere(minMaxVector.min, minMaxVector.max);
    distance = Math.max(Math.min(distance, this.upperRadiusLimit || Number.MAX_VALUE), this.lowerRadiusLimit || 0);
    this.radius = distance * this.zoomOnFactor;
    this.focusOn({ min: minMaxVector.min, max: minMaxVector.max, distance }, doNotUpdateMaxZ);
  }
  /**
   * Focus on a mesh or a bounding box. This adapts the target and maxRadius if necessary but does not update the current radius.
   * The target will be changed but the radius
   * @param meshesOrMinMaxVectorAndDistance Defines the mesh or bounding info to focus on
   * @param doNotUpdateMaxZ Defines whether or not maxZ should be updated whilst zooming on the mesh (this can happen if the mesh is big and the maxradius pretty small for instance)
   */
  focusOn(meshesOrMinMaxVectorAndDistance, doNotUpdateMaxZ = false) {
    let meshesOrMinMaxVector;
    let distance;
    if (meshesOrMinMaxVectorAndDistance.min === void 0) {
      const meshes = meshesOrMinMaxVectorAndDistance || this.getScene().meshes;
      meshesOrMinMaxVector = Mesh.MinMax(meshes);
      distance = Vector3.Distance(meshesOrMinMaxVector.min, meshesOrMinMaxVector.max);
    } else {
      const minMaxVectorAndDistance = meshesOrMinMaxVectorAndDistance;
      meshesOrMinMaxVector = minMaxVectorAndDistance;
      distance = minMaxVectorAndDistance.distance;
    }
    this._target = Mesh.Center(meshesOrMinMaxVector);
    if (!doNotUpdateMaxZ) {
      this.maxZ = distance * 2;
    }
  }
  /**
   * @override
   * Override Camera.createRigCamera
   */
  createRigCamera(name5, cameraIndex) {
    let alphaShift = 0;
    switch (this.cameraRigMode) {
      case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
      case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
      case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
      case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
      case Camera.RIG_MODE_VR:
        alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? 1 : -1);
        break;
      case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
        alphaShift = this._cameraRigParams.stereoHalfAngle * (cameraIndex === 0 ? -1 : 1);
        break;
    }
    const rigCam = new _ArcRotateCamera(name5, this.alpha + alphaShift, this.beta, this.radius, this._target, this.getScene());
    rigCam._cameraRigParams = {};
    rigCam.isRigCamera = true;
    rigCam.rigParent = this;
    rigCam.upVector = this.upVector;
    rigCam.mode = this.mode;
    rigCam.orthoLeft = this.orthoLeft;
    rigCam.orthoRight = this.orthoRight;
    rigCam.orthoBottom = this.orthoBottom;
    rigCam.orthoTop = this.orthoTop;
    return rigCam;
  }
  /**
   * @internal
   * @override
   * Override Camera._updateRigCameras
   */
  _updateRigCameras() {
    const camLeft = this._rigCameras[0];
    const camRight = this._rigCameras[1];
    camLeft.beta = camRight.beta = this.beta;
    switch (this.cameraRigMode) {
      case Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH:
      case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL:
      case Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER:
      case Camera.RIG_MODE_STEREOSCOPIC_INTERLACED:
      case Camera.RIG_MODE_VR:
        camLeft.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
        camRight.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
        break;
      case Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED:
        camLeft.alpha = this.alpha + this._cameraRigParams.stereoHalfAngle;
        camRight.alpha = this.alpha - this._cameraRigParams.stereoHalfAngle;
        break;
    }
    super._updateRigCameras();
  }
  /**
   * @internal
   */
  _calculateLowerRadiusFromModelBoundingSphere(minimumWorld, maximumWorld, radiusScale = 1) {
    const boxVectorGlobalDiagonal = Vector3.Distance(minimumWorld, maximumWorld);
    const engine = this.getScene().getEngine();
    const aspectRatio = engine.getAspectRatio(this);
    const frustumSlopeY = Math.tan(this.fov / 2);
    const frustumSlopeX = frustumSlopeY * aspectRatio;
    const radiusWithoutFraming = boxVectorGlobalDiagonal * 0.5;
    const radius = radiusWithoutFraming * radiusScale;
    const distanceForHorizontalFrustum = radius * Math.sqrt(1 + 1 / (frustumSlopeX * frustumSlopeX));
    const distanceForVerticalFrustum = radius * Math.sqrt(1 + 1 / (frustumSlopeY * frustumSlopeY));
    return Math.max(distanceForHorizontalFrustum, distanceForVerticalFrustum);
  }
  /**
   * Destroy the camera and release the current resources hold by it.
   */
  dispose() {
    this.inputs.clear();
    super.dispose();
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "ArcRotateCamera";
  }
};
__decorate([
  serialize()
], ArcRotateCamera.prototype, "alpha", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "beta", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "radius", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "overrideCloneAlphaBetaRadius", void 0);
__decorate([
  serializeAsVector3("target")
], ArcRotateCamera.prototype, "_target", void 0);
__decorate([
  serializeAsMeshReference("targetHost")
], ArcRotateCamera.prototype, "_targetHost", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "inertialAlphaOffset", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "inertialBetaOffset", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "inertialRadiusOffset", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "lowerAlphaLimit", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "upperAlphaLimit", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "lowerBetaLimit", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "upperBetaLimit", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "lowerRadiusLimit", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "upperRadiusLimit", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "inertialPanningX", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "inertialPanningY", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "pinchToPanMaxDistance", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "panningDistanceLimit", void 0);
__decorate([
  serializeAsVector3()
], ArcRotateCamera.prototype, "panningOriginTarget", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "panningInertia", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "zoomToMouseLocation", null);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "zoomOnFactor", void 0);
__decorate([
  serializeAsVector2()
], ArcRotateCamera.prototype, "targetScreenOffset", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "allowUpsideDown", void 0);
__decorate([
  serialize()
], ArcRotateCamera.prototype, "useInputToRestoreState", void 0);

// node_modules/@babylonjs/core/Cameras/deviceOrientationCamera.js
Node.AddNodeConstructor("DeviceOrientationCamera", (name5, scene) => {
  return () => new DeviceOrientationCamera(name5, Vector3.Zero(), scene);
});
var DeviceOrientationCamera = class extends FreeCamera {
  /**
   * Creates a new device orientation camera
   * @param name The name of the camera
   * @param position The start position camera
   * @param scene The scene the camera belongs to
   */
  constructor(name5, position, scene) {
    super(name5, position, scene);
    this._tmpDragQuaternion = new Quaternion();
    this._disablePointerInputWhenUsingDeviceOrientation = true;
    this._dragFactor = 0;
    this._quaternionCache = new Quaternion();
    this.inputs.addDeviceOrientation();
    if (this.inputs._deviceOrientationInput) {
      this.inputs._deviceOrientationInput._onDeviceOrientationChangedObservable.addOnce(() => {
        if (this._disablePointerInputWhenUsingDeviceOrientation) {
          if (this.inputs._mouseInput) {
            this.inputs._mouseInput._allowCameraRotation = false;
            this.inputs._mouseInput.onPointerMovedObservable.add((e) => {
              if (this._dragFactor != 0) {
                if (!this._initialQuaternion) {
                  this._initialQuaternion = new Quaternion();
                }
                Quaternion.FromEulerAnglesToRef(0, e.offsetX * this._dragFactor, 0, this._tmpDragQuaternion);
                this._initialQuaternion.multiplyToRef(this._tmpDragQuaternion, this._initialQuaternion);
              }
            });
          }
        }
      });
    }
  }
  /**
   * Gets or sets a boolean indicating that pointer input must be disabled on first orientation sensor update (Default: true)
   */
  get disablePointerInputWhenUsingDeviceOrientation() {
    return this._disablePointerInputWhenUsingDeviceOrientation;
  }
  set disablePointerInputWhenUsingDeviceOrientation(value) {
    this._disablePointerInputWhenUsingDeviceOrientation = value;
  }
  /**
   * Enabled turning on the y axis when the orientation sensor is active
   * @param dragFactor the factor that controls the turn speed (default: 1/300)
   */
  enableHorizontalDragging(dragFactor = 1 / 300) {
    this._dragFactor = dragFactor;
  }
  /**
   * Gets the current instance class name ("DeviceOrientationCamera").
   * This helps avoiding instanceof at run time.
   * @returns the class name
   */
  getClassName() {
    return "DeviceOrientationCamera";
  }
  /**
   * @internal
   * Checks and applies the current values of the inputs to the camera. (Internal use only)
   */
  _checkInputs() {
    super._checkInputs();
    this._quaternionCache.copyFrom(this.rotationQuaternion);
    if (this._initialQuaternion) {
      this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
    }
  }
  /**
   * Reset the camera to its default orientation on the specified axis only.
   * @param axis The axis to reset
   */
  resetToCurrentRotation(axis = Axis.Y) {
    if (!this.rotationQuaternion) {
      return;
    }
    if (!this._initialQuaternion) {
      this._initialQuaternion = new Quaternion();
    }
    this._initialQuaternion.copyFrom(this._quaternionCache || this.rotationQuaternion);
    ["x", "y", "z"].forEach((axisName) => {
      if (!axis[axisName]) {
        this._initialQuaternion[axisName] = 0;
      } else {
        this._initialQuaternion[axisName] *= -1;
      }
    });
    this._initialQuaternion.normalize();
    this._initialQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
  }
};

// node_modules/@babylonjs/core/Cameras/flyCameraInputsManager.js
var FlyCameraInputsManager = class extends CameraInputsManager {
  /**
   * Instantiates a new FlyCameraInputsManager.
   * @param camera Defines the camera the inputs belong to.
   */
  constructor(camera) {
    super(camera);
  }
  /**
   * Add keyboard input support to the input manager.
   * @returns the new FlyCameraKeyboardMoveInput().
   */
  addKeyboard() {
    this.add(new FlyCameraKeyboardInput());
    return this;
  }
  /**
   * Add mouse input support to the input manager.
   * @returns the new FlyCameraMouseInput().
   */
  addMouse() {
    this.add(new FlyCameraMouseInput());
    return this;
  }
};

// node_modules/@babylonjs/core/Cameras/flyCamera.js
var FlyCamera = class extends TargetCamera {
  /**
   * Gets the input sensibility for mouse input.
   * Higher values reduce sensitivity.
   */
  get angularSensibility() {
    const mouse = this.inputs.attached["mouse"];
    if (mouse) {
      return mouse.angularSensibility;
    }
    return 0;
  }
  /**
   * Sets the input sensibility for a mouse input.
   * Higher values reduce sensitivity.
   */
  set angularSensibility(value) {
    const mouse = this.inputs.attached["mouse"];
    if (mouse) {
      mouse.angularSensibility = value;
    }
  }
  /**
   * Get the keys for camera movement forward.
   */
  get keysForward() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysForward;
    }
    return [];
  }
  /**
   * Set the keys for camera movement forward.
   */
  set keysForward(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysForward = value;
    }
  }
  /**
   * Get the keys for camera movement backward.
   */
  get keysBackward() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysBackward;
    }
    return [];
  }
  set keysBackward(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysBackward = value;
    }
  }
  /**
   * Get the keys for camera movement up.
   */
  get keysUp() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysUp;
    }
    return [];
  }
  /**
   * Set the keys for camera movement up.
   */
  set keysUp(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysUp = value;
    }
  }
  /**
   * Get the keys for camera movement down.
   */
  get keysDown() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysDown;
    }
    return [];
  }
  /**
   * Set the keys for camera movement down.
   */
  set keysDown(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysDown = value;
    }
  }
  /**
   * Get the keys for camera movement left.
   */
  get keysLeft() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysLeft;
    }
    return [];
  }
  /**
   * Set the keys for camera movement left.
   */
  set keysLeft(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysLeft = value;
    }
  }
  /**
   * Set the keys for camera movement right.
   */
  get keysRight() {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      return keyboard.keysRight;
    }
    return [];
  }
  /**
   * Set the keys for camera movement right.
   */
  set keysRight(value) {
    const keyboard = this.inputs.attached["keyboard"];
    if (keyboard) {
      keyboard.keysRight = value;
    }
  }
  /**
   * Instantiates a FlyCamera.
   * This is a flying camera, designed for 3D movement and rotation in all directions,
   * such as in a 3D Space Shooter or a Flight Simulator.
   * @param name Define the name of the camera in the scene.
   * @param position Define the starting position of the camera in the scene.
   * @param scene Define the scene the camera belongs to.
   * @param setActiveOnSceneIfNoneActive Defines whether the camera should be marked as active, if no other camera has been defined as active.
   */
  constructor(name5, position, scene, setActiveOnSceneIfNoneActive = true) {
    super(name5, position, scene, setActiveOnSceneIfNoneActive);
    this.ellipsoid = new Vector3(1, 1, 1);
    this.ellipsoidOffset = new Vector3(0, 0, 0);
    this.checkCollisions = false;
    this.applyGravity = false;
    this.cameraDirection = Vector3.Zero();
    this._trackRoll = 0;
    this.rollCorrect = 100;
    this.bankedTurn = false;
    this.bankedTurnLimit = Math.PI / 2;
    this.bankedTurnMultiplier = 1;
    this._needMoveForGravity = false;
    this._oldPosition = Vector3.Zero();
    this._diffPosition = Vector3.Zero();
    this._newPosition = Vector3.Zero();
    this._collisionMask = -1;
    this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
      const updatePosition = (newPos) => {
        this._newPosition.copyFrom(newPos);
        this._newPosition.subtractToRef(this._oldPosition, this._diffPosition);
        if (this._diffPosition.length() > Engine.CollisionsEpsilon) {
          this.position.addInPlace(this._diffPosition);
          if (this.onCollide && collidedMesh) {
            this.onCollide(collidedMesh);
          }
        }
      };
      updatePosition(newPosition);
    };
    this.inputs = new FlyCameraInputsManager(this);
    this.inputs.addKeyboard().addMouse();
  }
  /**
   * Attached controls to the current camera.
   * @param ignored defines an ignored parameter kept for backward compatibility.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(ignored, noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this.inputs.attachElement(noPreventDefault);
  }
  /**
   * Detach a control from the HTML DOM element.
   * The camera will stop reacting to that input.
   */
  detachControl() {
    this.inputs.detachElement();
    this.cameraDirection = new Vector3(0, 0, 0);
  }
  /**
   * Get the mask that the camera ignores in collision events.
   */
  get collisionMask() {
    return this._collisionMask;
  }
  /**
   * Set the mask that the camera ignores in collision events.
   */
  set collisionMask(mask) {
    this._collisionMask = !isNaN(mask) ? mask : -1;
  }
  /**
   * @internal
   */
  _collideWithWorld(displacement) {
    let globalPosition;
    if (this.parent) {
      globalPosition = Vector3.TransformCoordinates(this.position, this.parent.getWorldMatrix());
    } else {
      globalPosition = this.position;
    }
    globalPosition.subtractFromFloatsToRef(0, this.ellipsoid.y, 0, this._oldPosition);
    this._oldPosition.addInPlace(this.ellipsoidOffset);
    const coordinator = this.getScene().collisionCoordinator;
    if (!this._collider) {
      this._collider = coordinator.createCollider();
    }
    this._collider._radius = this.ellipsoid;
    this._collider.collisionMask = this._collisionMask;
    let actualDisplacement = displacement;
    if (this.applyGravity) {
      actualDisplacement = displacement.add(this.getScene().gravity);
    }
    coordinator.getNewPosition(this._oldPosition, actualDisplacement, this._collider, 3, null, this._onCollisionPositionChange, this.uniqueId);
  }
  /** @internal */
  _checkInputs() {
    if (!this._localDirection) {
      this._localDirection = Vector3.Zero();
      this._transformedDirection = Vector3.Zero();
    }
    this.inputs.checkInputs();
    super._checkInputs();
  }
  /**
   * Enable movement without a user input. This allows gravity to always be applied.
   */
  set needMoveForGravity(value) {
    this._needMoveForGravity = value;
  }
  /**
   * When true, gravity is applied whether there is user input or not.
   */
  get needMoveForGravity() {
    return this._needMoveForGravity;
  }
  /** @internal */
  _decideIfNeedsToMove() {
    return this._needMoveForGravity || Math.abs(this.cameraDirection.x) > 0 || Math.abs(this.cameraDirection.y) > 0 || Math.abs(this.cameraDirection.z) > 0;
  }
  /** @internal */
  _updatePosition() {
    if (this.checkCollisions && this.getScene().collisionsEnabled) {
      this._collideWithWorld(this.cameraDirection);
    } else {
      super._updatePosition();
    }
  }
  /**
   * Restore the Roll to its target value at the rate specified.
   * @param rate - Higher means slower restoring.
   * @internal
   */
  restoreRoll(rate) {
    const limit = this._trackRoll;
    const z = this.rotation.z;
    const delta = limit - z;
    const minRad = 1e-3;
    if (Math.abs(delta) >= minRad) {
      this.rotation.z += delta / rate;
      if (Math.abs(limit - this.rotation.z) <= minRad) {
        this.rotation.z = limit;
      }
    }
  }
  /**
   * Destroy the camera and release the current resources held by it.
   */
  dispose() {
    this.inputs.clear();
    super.dispose();
  }
  /**
   * Get the current object class name.
   * @returns the class name.
   */
  getClassName() {
    return "FlyCamera";
  }
};
__decorate([
  serializeAsVector3()
], FlyCamera.prototype, "ellipsoid", void 0);
__decorate([
  serializeAsVector3()
], FlyCamera.prototype, "ellipsoidOffset", void 0);
__decorate([
  serialize()
], FlyCamera.prototype, "checkCollisions", void 0);
__decorate([
  serialize()
], FlyCamera.prototype, "applyGravity", void 0);

// node_modules/@babylonjs/core/Cameras/followCameraInputsManager.js
var FollowCameraInputsManager = class extends CameraInputsManager {
  /**
   * Instantiates a new FollowCameraInputsManager.
   * @param camera Defines the camera the inputs belong to
   */
  constructor(camera) {
    super(camera);
  }
  /**
   * Add keyboard input support to the input manager.
   * @returns the current input manager
   */
  addKeyboard() {
    this.add(new FollowCameraKeyboardMoveInput());
    return this;
  }
  /**
   * Add mouse wheel input support to the input manager.
   * @returns the current input manager
   */
  addMouseWheel() {
    this.add(new FollowCameraMouseWheelInput());
    return this;
  }
  /**
   * Add pointers input support to the input manager.
   * @returns the current input manager
   */
  addPointers() {
    this.add(new FollowCameraPointersInput());
    return this;
  }
  /**
   * Add orientation input support to the input manager.
   * @returns the current input manager
   */
  addVRDeviceOrientation() {
    console.warn("DeviceOrientation support not yet implemented for FollowCamera.");
    return this;
  }
};

// node_modules/@babylonjs/core/Cameras/followCamera.js
Node.AddNodeConstructor("FollowCamera", (name5, scene) => {
  return () => new FollowCamera(name5, Vector3.Zero(), scene);
});
Node.AddNodeConstructor("ArcFollowCamera", (name5, scene) => {
  return () => new ArcFollowCamera(name5, 0, 0, 1, null, scene);
});
var FollowCamera = class extends TargetCamera {
  /**
   * Instantiates the follow camera.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#followcamera
   * @param name Define the name of the camera in the scene
   * @param position Define the position of the camera
   * @param scene Define the scene the camera belong to
   * @param lockedTarget Define the target of the camera
   */
  constructor(name5, position, scene, lockedTarget = null) {
    super(name5, position, scene);
    this.radius = 12;
    this.lowerRadiusLimit = null;
    this.upperRadiusLimit = null;
    this.rotationOffset = 0;
    this.lowerRotationOffsetLimit = null;
    this.upperRotationOffsetLimit = null;
    this.heightOffset = 4;
    this.lowerHeightOffsetLimit = null;
    this.upperHeightOffsetLimit = null;
    this.cameraAcceleration = 0.05;
    this.maxCameraSpeed = 20;
    this.lockedTarget = lockedTarget;
    this.inputs = new FollowCameraInputsManager(this);
    this.inputs.addKeyboard().addMouseWheel().addPointers();
  }
  _follow(cameraTarget) {
    if (!cameraTarget) {
      return;
    }
    const rotMatrix = TmpVectors.Matrix[0];
    cameraTarget.absoluteRotationQuaternion.toRotationMatrix(rotMatrix);
    const yRotation = Math.atan2(rotMatrix.m[8], rotMatrix.m[10]);
    const radians = Tools.ToRadians(this.rotationOffset) + yRotation;
    const targetPosition = cameraTarget.getAbsolutePosition();
    const targetX = targetPosition.x + Math.sin(radians) * this.radius;
    const targetZ = targetPosition.z + Math.cos(radians) * this.radius;
    const dx = targetX - this.position.x;
    const dy = targetPosition.y + this.heightOffset - this.position.y;
    const dz = targetZ - this.position.z;
    let vx = dx * this.cameraAcceleration * 2;
    let vy = dy * this.cameraAcceleration;
    let vz = dz * this.cameraAcceleration * 2;
    if (vx > this.maxCameraSpeed || vx < -this.maxCameraSpeed) {
      vx = vx < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
    }
    if (vy > this.maxCameraSpeed || vy < -this.maxCameraSpeed) {
      vy = vy < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
    }
    if (vz > this.maxCameraSpeed || vz < -this.maxCameraSpeed) {
      vz = vz < 1 ? -this.maxCameraSpeed : this.maxCameraSpeed;
    }
    this.position = new Vector3(this.position.x + vx, this.position.y + vy, this.position.z + vz);
    this.setTarget(targetPosition);
  }
  /**
   * Attached controls to the current camera.
   * @param ignored defines an ignored parameter kept for backward compatibility.
   * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
   */
  attachControl(ignored, noPreventDefault) {
    noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
    this.inputs.attachElement(noPreventDefault);
    this._reset = () => {
    };
  }
  /**
   * Detach the current controls from the specified dom element.
   */
  detachControl() {
    this.inputs.detachElement();
    if (this._reset) {
      this._reset();
    }
  }
  /** @internal */
  _checkInputs() {
    this.inputs.checkInputs();
    this._checkLimits();
    super._checkInputs();
    if (this.lockedTarget) {
      this._follow(this.lockedTarget);
    }
  }
  _checkLimits() {
    if (this.lowerRadiusLimit !== null && this.radius < this.lowerRadiusLimit) {
      this.radius = this.lowerRadiusLimit;
    }
    if (this.upperRadiusLimit !== null && this.radius > this.upperRadiusLimit) {
      this.radius = this.upperRadiusLimit;
    }
    if (this.lowerHeightOffsetLimit !== null && this.heightOffset < this.lowerHeightOffsetLimit) {
      this.heightOffset = this.lowerHeightOffsetLimit;
    }
    if (this.upperHeightOffsetLimit !== null && this.heightOffset > this.upperHeightOffsetLimit) {
      this.heightOffset = this.upperHeightOffsetLimit;
    }
    if (this.lowerRotationOffsetLimit !== null && this.rotationOffset < this.lowerRotationOffsetLimit) {
      this.rotationOffset = this.lowerRotationOffsetLimit;
    }
    if (this.upperRotationOffsetLimit !== null && this.rotationOffset > this.upperRotationOffsetLimit) {
      this.rotationOffset = this.upperRotationOffsetLimit;
    }
  }
  /**
   * Gets the camera class name.
   * @returns the class name
   */
  getClassName() {
    return "FollowCamera";
  }
};
__decorate([
  serialize()
], FollowCamera.prototype, "radius", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "lowerRadiusLimit", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "upperRadiusLimit", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "rotationOffset", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "lowerRotationOffsetLimit", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "upperRotationOffsetLimit", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "heightOffset", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "lowerHeightOffsetLimit", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "upperHeightOffsetLimit", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "cameraAcceleration", void 0);
__decorate([
  serialize()
], FollowCamera.prototype, "maxCameraSpeed", void 0);
__decorate([
  serializeAsMeshReference("lockedTargetId")
], FollowCamera.prototype, "lockedTarget", void 0);
var ArcFollowCamera = class extends TargetCamera {
  /**
   * Instantiates a new ArcFollowCamera
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#followcamera
   * @param name Define the name of the camera
   * @param alpha Define the rotation angle of the camera around the longitudinal axis
   * @param beta Define the rotation angle of the camera around the elevation axis
   * @param radius Define the radius of the camera from its target point
   * @param target Define the target of the camera
   * @param scene Define the scene the camera belongs to
   */
  constructor(name5, alpha, beta, radius, target, scene) {
    super(name5, Vector3.Zero(), scene);
    this.alpha = alpha;
    this.beta = beta;
    this.radius = radius;
    this._cartesianCoordinates = Vector3.Zero();
    this.setMeshTarget(target);
  }
  /**
   * Sets the mesh to follow with this camera.
   * @param target the target to follow
   */
  setMeshTarget(target) {
    this._meshTarget = target;
    this._follow();
  }
  _follow() {
    if (!this._meshTarget) {
      return;
    }
    this._cartesianCoordinates.x = this.radius * Math.cos(this.alpha) * Math.cos(this.beta);
    this._cartesianCoordinates.y = this.radius * Math.sin(this.beta);
    this._cartesianCoordinates.z = this.radius * Math.sin(this.alpha) * Math.cos(this.beta);
    const targetPosition = this._meshTarget.getAbsolutePosition();
    this.position = targetPosition.add(this._cartesianCoordinates);
    this.setTarget(targetPosition);
  }
  /** @internal */
  _checkInputs() {
    super._checkInputs();
    this._follow();
  }
  /**
   * Returns the class name of the object.
   * It is mostly used internally for serialization purposes.
   */
  getClassName() {
    return "ArcFollowCamera";
  }
};

// node_modules/@babylonjs/core/Gamepads/xboxGamepad.js
var Xbox360Button;
(function(Xbox360Button2) {
  Xbox360Button2[Xbox360Button2["A"] = 0] = "A";
  Xbox360Button2[Xbox360Button2["B"] = 1] = "B";
  Xbox360Button2[Xbox360Button2["X"] = 2] = "X";
  Xbox360Button2[Xbox360Button2["Y"] = 3] = "Y";
  Xbox360Button2[Xbox360Button2["LB"] = 4] = "LB";
  Xbox360Button2[Xbox360Button2["RB"] = 5] = "RB";
  Xbox360Button2[Xbox360Button2["Back"] = 8] = "Back";
  Xbox360Button2[Xbox360Button2["Start"] = 9] = "Start";
  Xbox360Button2[Xbox360Button2["LeftStick"] = 10] = "LeftStick";
  Xbox360Button2[Xbox360Button2["RightStick"] = 11] = "RightStick";
})(Xbox360Button || (Xbox360Button = {}));
var Xbox360Dpad;
(function(Xbox360Dpad2) {
  Xbox360Dpad2[Xbox360Dpad2["Up"] = 12] = "Up";
  Xbox360Dpad2[Xbox360Dpad2["Down"] = 13] = "Down";
  Xbox360Dpad2[Xbox360Dpad2["Left"] = 14] = "Left";
  Xbox360Dpad2[Xbox360Dpad2["Right"] = 15] = "Right";
})(Xbox360Dpad || (Xbox360Dpad = {}));
var Xbox360Pad = class extends Gamepad {
  /**
   * Creates a new XBox360 gamepad object
   * @param id defines the id of this gamepad
   * @param index defines its index
   * @param gamepad defines the internal HTML gamepad object
   * @param xboxOne defines if it is a XBox One gamepad
   */
  constructor(id, index, gamepad, xboxOne = false) {
    super(id, index, gamepad, 0, 1, 2, 3);
    this._leftTrigger = 0;
    this._rightTrigger = 0;
    this.onButtonDownObservable = new Observable();
    this.onButtonUpObservable = new Observable();
    this.onPadDownObservable = new Observable();
    this.onPadUpObservable = new Observable();
    this._buttonA = 0;
    this._buttonB = 0;
    this._buttonX = 0;
    this._buttonY = 0;
    this._buttonBack = 0;
    this._buttonStart = 0;
    this._buttonLB = 0;
    this._buttonRB = 0;
    this._buttonLeftStick = 0;
    this._buttonRightStick = 0;
    this._dPadUp = 0;
    this._dPadDown = 0;
    this._dPadLeft = 0;
    this._dPadRight = 0;
    this._isXboxOnePad = false;
    this.type = Gamepad.XBOX;
    this._isXboxOnePad = xboxOne;
  }
  /**
   * Defines the callback to call when left trigger is pressed
   * @param callback defines the callback to use
   */
  onlefttriggerchanged(callback) {
    this._onlefttriggerchanged = callback;
  }
  /**
   * Defines the callback to call when right trigger is pressed
   * @param callback defines the callback to use
   */
  onrighttriggerchanged(callback) {
    this._onrighttriggerchanged = callback;
  }
  /**
   * Gets the left trigger value
   */
  get leftTrigger() {
    return this._leftTrigger;
  }
  /**
   * Sets the left trigger value
   */
  set leftTrigger(newValue) {
    if (this._onlefttriggerchanged && this._leftTrigger !== newValue) {
      this._onlefttriggerchanged(newValue);
    }
    this._leftTrigger = newValue;
  }
  /**
   * Gets the right trigger value
   */
  get rightTrigger() {
    return this._rightTrigger;
  }
  /**
   * Sets the right trigger value
   */
  set rightTrigger(newValue) {
    if (this._onrighttriggerchanged && this._rightTrigger !== newValue) {
      this._onrighttriggerchanged(newValue);
    }
    this._rightTrigger = newValue;
  }
  /**
   * Defines the callback to call when a button is pressed
   * @param callback defines the callback to use
   */
  onbuttondown(callback) {
    this._onbuttondown = callback;
  }
  /**
   * Defines the callback to call when a button is released
   * @param callback defines the callback to use
   */
  onbuttonup(callback) {
    this._onbuttonup = callback;
  }
  /**
   * Defines the callback to call when a pad is pressed
   * @param callback defines the callback to use
   */
  ondpaddown(callback) {
    this._ondpaddown = callback;
  }
  /**
   * Defines the callback to call when a pad is released
   * @param callback defines the callback to use
   */
  ondpadup(callback) {
    this._ondpadup = callback;
  }
  _setButtonValue(newValue, currentValue, buttonType) {
    if (newValue !== currentValue) {
      if (newValue === 1) {
        if (this._onbuttondown) {
          this._onbuttondown(buttonType);
        }
        this.onButtonDownObservable.notifyObservers(buttonType);
      }
      if (newValue === 0) {
        if (this._onbuttonup) {
          this._onbuttonup(buttonType);
        }
        this.onButtonUpObservable.notifyObservers(buttonType);
      }
    }
    return newValue;
  }
  _setDPadValue(newValue, currentValue, buttonType) {
    if (newValue !== currentValue) {
      if (newValue === 1) {
        if (this._ondpaddown) {
          this._ondpaddown(buttonType);
        }
        this.onPadDownObservable.notifyObservers(buttonType);
      }
      if (newValue === 0) {
        if (this._ondpadup) {
          this._ondpadup(buttonType);
        }
        this.onPadUpObservable.notifyObservers(buttonType);
      }
    }
    return newValue;
  }
  /**
   * Gets the value of the `A` button
   */
  get buttonA() {
    return this._buttonA;
  }
  /**
   * Sets the value of the `A` button
   */
  set buttonA(value) {
    this._buttonA = this._setButtonValue(value, this._buttonA, Xbox360Button.A);
  }
  /**
   * Gets the value of the `B` button
   */
  get buttonB() {
    return this._buttonB;
  }
  /**
   * Sets the value of the `B` button
   */
  set buttonB(value) {
    this._buttonB = this._setButtonValue(value, this._buttonB, Xbox360Button.B);
  }
  /**
   * Gets the value of the `X` button
   */
  get buttonX() {
    return this._buttonX;
  }
  /**
   * Sets the value of the `X` button
   */
  set buttonX(value) {
    this._buttonX = this._setButtonValue(value, this._buttonX, Xbox360Button.X);
  }
  /**
   * Gets the value of the `Y` button
   */
  get buttonY() {
    return this._buttonY;
  }
  /**
   * Sets the value of the `Y` button
   */
  set buttonY(value) {
    this._buttonY = this._setButtonValue(value, this._buttonY, Xbox360Button.Y);
  }
  /**
   * Gets the value of the `Start` button
   */
  get buttonStart() {
    return this._buttonStart;
  }
  /**
   * Sets the value of the `Start` button
   */
  set buttonStart(value) {
    this._buttonStart = this._setButtonValue(value, this._buttonStart, Xbox360Button.Start);
  }
  /**
   * Gets the value of the `Back` button
   */
  get buttonBack() {
    return this._buttonBack;
  }
  /**
   * Sets the value of the `Back` button
   */
  set buttonBack(value) {
    this._buttonBack = this._setButtonValue(value, this._buttonBack, Xbox360Button.Back);
  }
  /**
   * Gets the value of the `Left` button
   */
  get buttonLB() {
    return this._buttonLB;
  }
  /**
   * Sets the value of the `Left` button
   */
  set buttonLB(value) {
    this._buttonLB = this._setButtonValue(value, this._buttonLB, Xbox360Button.LB);
  }
  /**
   * Gets the value of the `Right` button
   */
  get buttonRB() {
    return this._buttonRB;
  }
  /**
   * Sets the value of the `Right` button
   */
  set buttonRB(value) {
    this._buttonRB = this._setButtonValue(value, this._buttonRB, Xbox360Button.RB);
  }
  /**
   * Gets the value of the Left joystick
   */
  get buttonLeftStick() {
    return this._buttonLeftStick;
  }
  /**
   * Sets the value of the Left joystick
   */
  set buttonLeftStick(value) {
    this._buttonLeftStick = this._setButtonValue(value, this._buttonLeftStick, Xbox360Button.LeftStick);
  }
  /**
   * Gets the value of the Right joystick
   */
  get buttonRightStick() {
    return this._buttonRightStick;
  }
  /**
   * Sets the value of the Right joystick
   */
  set buttonRightStick(value) {
    this._buttonRightStick = this._setButtonValue(value, this._buttonRightStick, Xbox360Button.RightStick);
  }
  /**
   * Gets the value of D-pad up
   */
  get dPadUp() {
    return this._dPadUp;
  }
  /**
   * Sets the value of D-pad up
   */
  set dPadUp(value) {
    this._dPadUp = this._setDPadValue(value, this._dPadUp, Xbox360Dpad.Up);
  }
  /**
   * Gets the value of D-pad down
   */
  get dPadDown() {
    return this._dPadDown;
  }
  /**
   * Sets the value of D-pad down
   */
  set dPadDown(value) {
    this._dPadDown = this._setDPadValue(value, this._dPadDown, Xbox360Dpad.Down);
  }
  /**
   * Gets the value of D-pad left
   */
  get dPadLeft() {
    return this._dPadLeft;
  }
  /**
   * Sets the value of D-pad left
   */
  set dPadLeft(value) {
    this._dPadLeft = this._setDPadValue(value, this._dPadLeft, Xbox360Dpad.Left);
  }
  /**
   * Gets the value of D-pad right
   */
  get dPadRight() {
    return this._dPadRight;
  }
  /**
   * Sets the value of D-pad right
   */
  set dPadRight(value) {
    this._dPadRight = this._setDPadValue(value, this._dPadRight, Xbox360Dpad.Right);
  }
  /**
   * Force the gamepad to synchronize with device values
   */
  update() {
    super.update();
    if (this._isXboxOnePad) {
      this.buttonA = this.browserGamepad.buttons[0].value;
      this.buttonB = this.browserGamepad.buttons[1].value;
      this.buttonX = this.browserGamepad.buttons[2].value;
      this.buttonY = this.browserGamepad.buttons[3].value;
      this.buttonLB = this.browserGamepad.buttons[4].value;
      this.buttonRB = this.browserGamepad.buttons[5].value;
      this.leftTrigger = this.browserGamepad.buttons[6].value;
      this.rightTrigger = this.browserGamepad.buttons[7].value;
      this.buttonBack = this.browserGamepad.buttons[8].value;
      this.buttonStart = this.browserGamepad.buttons[9].value;
      this.buttonLeftStick = this.browserGamepad.buttons[10].value;
      this.buttonRightStick = this.browserGamepad.buttons[11].value;
      this.dPadUp = this.browserGamepad.buttons[12].value;
      this.dPadDown = this.browserGamepad.buttons[13].value;
      this.dPadLeft = this.browserGamepad.buttons[14].value;
      this.dPadRight = this.browserGamepad.buttons[15].value;
    } else {
      this.buttonA = this.browserGamepad.buttons[0].value;
      this.buttonB = this.browserGamepad.buttons[1].value;
      this.buttonX = this.browserGamepad.buttons[2].value;
      this.buttonY = this.browserGamepad.buttons[3].value;
      this.buttonLB = this.browserGamepad.buttons[4].value;
      this.buttonRB = this.browserGamepad.buttons[5].value;
      this.leftTrigger = this.browserGamepad.buttons[6].value;
      this.rightTrigger = this.browserGamepad.buttons[7].value;
      this.buttonBack = this.browserGamepad.buttons[8].value;
      this.buttonStart = this.browserGamepad.buttons[9].value;
      this.buttonLeftStick = this.browserGamepad.buttons[10].value;
      this.buttonRightStick = this.browserGamepad.buttons[11].value;
      this.dPadUp = this.browserGamepad.buttons[12].value;
      this.dPadDown = this.browserGamepad.buttons[13].value;
      this.dPadLeft = this.browserGamepad.buttons[14].value;
      this.dPadRight = this.browserGamepad.buttons[15].value;
    }
  }
  /**
   * Disposes the gamepad
   */
  dispose() {
    super.dispose();
    this.onButtonDownObservable.clear();
    this.onButtonUpObservable.clear();
    this.onPadDownObservable.clear();
    this.onPadUpObservable.clear();
  }
};

// node_modules/@babylonjs/core/Gamepads/dualShockGamepad.js
var DualShockButton;
(function(DualShockButton2) {
  DualShockButton2[DualShockButton2["Cross"] = 0] = "Cross";
  DualShockButton2[DualShockButton2["Circle"] = 1] = "Circle";
  DualShockButton2[DualShockButton2["Square"] = 2] = "Square";
  DualShockButton2[DualShockButton2["Triangle"] = 3] = "Triangle";
  DualShockButton2[DualShockButton2["L1"] = 4] = "L1";
  DualShockButton2[DualShockButton2["R1"] = 5] = "R1";
  DualShockButton2[DualShockButton2["Share"] = 8] = "Share";
  DualShockButton2[DualShockButton2["Options"] = 9] = "Options";
  DualShockButton2[DualShockButton2["LeftStick"] = 10] = "LeftStick";
  DualShockButton2[DualShockButton2["RightStick"] = 11] = "RightStick";
})(DualShockButton || (DualShockButton = {}));
var DualShockDpad;
(function(DualShockDpad2) {
  DualShockDpad2[DualShockDpad2["Up"] = 12] = "Up";
  DualShockDpad2[DualShockDpad2["Down"] = 13] = "Down";
  DualShockDpad2[DualShockDpad2["Left"] = 14] = "Left";
  DualShockDpad2[DualShockDpad2["Right"] = 15] = "Right";
})(DualShockDpad || (DualShockDpad = {}));
var DualShockPad = class extends Gamepad {
  /**
   * Creates a new DualShock gamepad object
   * @param id defines the id of this gamepad
   * @param index defines its index
   * @param gamepad defines the internal HTML gamepad object
   */
  constructor(id, index, gamepad) {
    super(id.replace("STANDARD GAMEPAD", "SONY PLAYSTATION DUALSHOCK"), index, gamepad, 0, 1, 2, 3);
    this._leftTrigger = 0;
    this._rightTrigger = 0;
    this.onButtonDownObservable = new Observable();
    this.onButtonUpObservable = new Observable();
    this.onPadDownObservable = new Observable();
    this.onPadUpObservable = new Observable();
    this._buttonCross = 0;
    this._buttonCircle = 0;
    this._buttonSquare = 0;
    this._buttonTriangle = 0;
    this._buttonShare = 0;
    this._buttonOptions = 0;
    this._buttonL1 = 0;
    this._buttonR1 = 0;
    this._buttonLeftStick = 0;
    this._buttonRightStick = 0;
    this._dPadUp = 0;
    this._dPadDown = 0;
    this._dPadLeft = 0;
    this._dPadRight = 0;
    this.type = Gamepad.DUALSHOCK;
  }
  /**
   * Defines the callback to call when left trigger is pressed
   * @param callback defines the callback to use
   */
  onlefttriggerchanged(callback) {
    this._onlefttriggerchanged = callback;
  }
  /**
   * Defines the callback to call when right trigger is pressed
   * @param callback defines the callback to use
   */
  onrighttriggerchanged(callback) {
    this._onrighttriggerchanged = callback;
  }
  /**
   * Gets the left trigger value
   */
  get leftTrigger() {
    return this._leftTrigger;
  }
  /**
   * Sets the left trigger value
   */
  set leftTrigger(newValue) {
    if (this._onlefttriggerchanged && this._leftTrigger !== newValue) {
      this._onlefttriggerchanged(newValue);
    }
    this._leftTrigger = newValue;
  }
  /**
   * Gets the right trigger value
   */
  get rightTrigger() {
    return this._rightTrigger;
  }
  /**
   * Sets the right trigger value
   */
  set rightTrigger(newValue) {
    if (this._onrighttriggerchanged && this._rightTrigger !== newValue) {
      this._onrighttriggerchanged(newValue);
    }
    this._rightTrigger = newValue;
  }
  /**
   * Defines the callback to call when a button is pressed
   * @param callback defines the callback to use
   */
  onbuttondown(callback) {
    this._onbuttondown = callback;
  }
  /**
   * Defines the callback to call when a button is released
   * @param callback defines the callback to use
   */
  onbuttonup(callback) {
    this._onbuttonup = callback;
  }
  /**
   * Defines the callback to call when a pad is pressed
   * @param callback defines the callback to use
   */
  ondpaddown(callback) {
    this._ondpaddown = callback;
  }
  /**
   * Defines the callback to call when a pad is released
   * @param callback defines the callback to use
   */
  ondpadup(callback) {
    this._ondpadup = callback;
  }
  _setButtonValue(newValue, currentValue, buttonType) {
    if (newValue !== currentValue) {
      if (newValue === 1) {
        if (this._onbuttondown) {
          this._onbuttondown(buttonType);
        }
        this.onButtonDownObservable.notifyObservers(buttonType);
      }
      if (newValue === 0) {
        if (this._onbuttonup) {
          this._onbuttonup(buttonType);
        }
        this.onButtonUpObservable.notifyObservers(buttonType);
      }
    }
    return newValue;
  }
  _setDPadValue(newValue, currentValue, buttonType) {
    if (newValue !== currentValue) {
      if (newValue === 1) {
        if (this._ondpaddown) {
          this._ondpaddown(buttonType);
        }
        this.onPadDownObservable.notifyObservers(buttonType);
      }
      if (newValue === 0) {
        if (this._ondpadup) {
          this._ondpadup(buttonType);
        }
        this.onPadUpObservable.notifyObservers(buttonType);
      }
    }
    return newValue;
  }
  /**
   * Gets the value of the `Cross` button
   */
  get buttonCross() {
    return this._buttonCross;
  }
  /**
   * Sets the value of the `Cross` button
   */
  set buttonCross(value) {
    this._buttonCross = this._setButtonValue(value, this._buttonCross, DualShockButton.Cross);
  }
  /**
   * Gets the value of the `Circle` button
   */
  get buttonCircle() {
    return this._buttonCircle;
  }
  /**
   * Sets the value of the `Circle` button
   */
  set buttonCircle(value) {
    this._buttonCircle = this._setButtonValue(value, this._buttonCircle, DualShockButton.Circle);
  }
  /**
   * Gets the value of the `Square` button
   */
  get buttonSquare() {
    return this._buttonSquare;
  }
  /**
   * Sets the value of the `Square` button
   */
  set buttonSquare(value) {
    this._buttonSquare = this._setButtonValue(value, this._buttonSquare, DualShockButton.Square);
  }
  /**
   * Gets the value of the `Triangle` button
   */
  get buttonTriangle() {
    return this._buttonTriangle;
  }
  /**
   * Sets the value of the `Triangle` button
   */
  set buttonTriangle(value) {
    this._buttonTriangle = this._setButtonValue(value, this._buttonTriangle, DualShockButton.Triangle);
  }
  /**
   * Gets the value of the `Options` button
   */
  get buttonOptions() {
    return this._buttonOptions;
  }
  /**
   * Sets the value of the `Options` button
   */
  set buttonOptions(value) {
    this._buttonOptions = this._setButtonValue(value, this._buttonOptions, DualShockButton.Options);
  }
  /**
   * Gets the value of the `Share` button
   */
  get buttonShare() {
    return this._buttonShare;
  }
  /**
   * Sets the value of the `Share` button
   */
  set buttonShare(value) {
    this._buttonShare = this._setButtonValue(value, this._buttonShare, DualShockButton.Share);
  }
  /**
   * Gets the value of the `L1` button
   */
  get buttonL1() {
    return this._buttonL1;
  }
  /**
   * Sets the value of the `L1` button
   */
  set buttonL1(value) {
    this._buttonL1 = this._setButtonValue(value, this._buttonL1, DualShockButton.L1);
  }
  /**
   * Gets the value of the `R1` button
   */
  get buttonR1() {
    return this._buttonR1;
  }
  /**
   * Sets the value of the `R1` button
   */
  set buttonR1(value) {
    this._buttonR1 = this._setButtonValue(value, this._buttonR1, DualShockButton.R1);
  }
  /**
   * Gets the value of the Left joystick
   */
  get buttonLeftStick() {
    return this._buttonLeftStick;
  }
  /**
   * Sets the value of the Left joystick
   */
  set buttonLeftStick(value) {
    this._buttonLeftStick = this._setButtonValue(value, this._buttonLeftStick, DualShockButton.LeftStick);
  }
  /**
   * Gets the value of the Right joystick
   */
  get buttonRightStick() {
    return this._buttonRightStick;
  }
  /**
   * Sets the value of the Right joystick
   */
  set buttonRightStick(value) {
    this._buttonRightStick = this._setButtonValue(value, this._buttonRightStick, DualShockButton.RightStick);
  }
  /**
   * Gets the value of D-pad up
   */
  get dPadUp() {
    return this._dPadUp;
  }
  /**
   * Sets the value of D-pad up
   */
  set dPadUp(value) {
    this._dPadUp = this._setDPadValue(value, this._dPadUp, DualShockDpad.Up);
  }
  /**
   * Gets the value of D-pad down
   */
  get dPadDown() {
    return this._dPadDown;
  }
  /**
   * Sets the value of D-pad down
   */
  set dPadDown(value) {
    this._dPadDown = this._setDPadValue(value, this._dPadDown, DualShockDpad.Down);
  }
  /**
   * Gets the value of D-pad left
   */
  get dPadLeft() {
    return this._dPadLeft;
  }
  /**
   * Sets the value of D-pad left
   */
  set dPadLeft(value) {
    this._dPadLeft = this._setDPadValue(value, this._dPadLeft, DualShockDpad.Left);
  }
  /**
   * Gets the value of D-pad right
   */
  get dPadRight() {
    return this._dPadRight;
  }
  /**
   * Sets the value of D-pad right
   */
  set dPadRight(value) {
    this._dPadRight = this._setDPadValue(value, this._dPadRight, DualShockDpad.Right);
  }
  /**
   * Force the gamepad to synchronize with device values
   */
  update() {
    super.update();
    this.buttonCross = this.browserGamepad.buttons[0].value;
    this.buttonCircle = this.browserGamepad.buttons[1].value;
    this.buttonSquare = this.browserGamepad.buttons[2].value;
    this.buttonTriangle = this.browserGamepad.buttons[3].value;
    this.buttonL1 = this.browserGamepad.buttons[4].value;
    this.buttonR1 = this.browserGamepad.buttons[5].value;
    this.leftTrigger = this.browserGamepad.buttons[6].value;
    this.rightTrigger = this.browserGamepad.buttons[7].value;
    this.buttonShare = this.browserGamepad.buttons[8].value;
    this.buttonOptions = this.browserGamepad.buttons[9].value;
    this.buttonLeftStick = this.browserGamepad.buttons[10].value;
    this.buttonRightStick = this.browserGamepad.buttons[11].value;
    this.dPadUp = this.browserGamepad.buttons[12].value;
    this.dPadDown = this.browserGamepad.buttons[13].value;
    this.dPadLeft = this.browserGamepad.buttons[14].value;
    this.dPadRight = this.browserGamepad.buttons[15].value;
  }
  /**
   * Disposes the gamepad
   */
  dispose() {
    super.dispose();
    this.onButtonDownObservable.clear();
    this.onButtonUpObservable.clear();
    this.onPadDownObservable.clear();
    this.onPadUpObservable.clear();
  }
};

// node_modules/@babylonjs/core/Gamepads/gamepadManager.js
var GamepadManager = class {
  /**
   * Initializes the gamepad manager
   * @param _scene BabylonJS scene
   */
  constructor(_scene) {
    this._scene = _scene;
    this._babylonGamepads = [];
    this._oneGamepadConnected = false;
    this._isMonitoring = false;
    this.onGamepadDisconnectedObservable = new Observable();
    if (!IsWindowObjectExist()) {
      this._gamepadEventSupported = false;
    } else {
      this._gamepadEventSupported = "GamepadEvent" in window;
      this._gamepadSupport = navigator && navigator.getGamepads;
    }
    this.onGamepadConnectedObservable = new Observable((observer) => {
      for (const i in this._babylonGamepads) {
        const gamepad = this._babylonGamepads[i];
        if (gamepad && gamepad._isConnected) {
          this.onGamepadConnectedObservable.notifyObserver(observer, gamepad);
        }
      }
    });
    this._onGamepadConnectedEvent = (evt) => {
      const gamepad = evt.gamepad;
      if (gamepad.index in this._babylonGamepads) {
        if (this._babylonGamepads[gamepad.index].isConnected) {
          return;
        }
      }
      let newGamepad;
      if (this._babylonGamepads[gamepad.index]) {
        newGamepad = this._babylonGamepads[gamepad.index];
        newGamepad.browserGamepad = gamepad;
        newGamepad._isConnected = true;
      } else {
        newGamepad = this._addNewGamepad(gamepad);
      }
      this.onGamepadConnectedObservable.notifyObservers(newGamepad);
      this._startMonitoringGamepads();
    };
    this._onGamepadDisconnectedEvent = (evt) => {
      const gamepad = evt.gamepad;
      for (const i in this._babylonGamepads) {
        if (this._babylonGamepads[i].index === gamepad.index) {
          const disconnectedGamepad = this._babylonGamepads[i];
          disconnectedGamepad._isConnected = false;
          this.onGamepadDisconnectedObservable.notifyObservers(disconnectedGamepad);
          disconnectedGamepad.dispose && disconnectedGamepad.dispose();
          break;
        }
      }
    };
    if (this._gamepadSupport) {
      this._updateGamepadObjects();
      if (this._babylonGamepads.length) {
        this._startMonitoringGamepads();
      }
      if (this._gamepadEventSupported) {
        const hostWindow = this._scene ? this._scene.getEngine().getHostWindow() : window;
        if (hostWindow) {
          hostWindow.addEventListener("gamepadconnected", this._onGamepadConnectedEvent, false);
          hostWindow.addEventListener("gamepaddisconnected", this._onGamepadDisconnectedEvent, false);
        }
      } else {
        this._startMonitoringGamepads();
      }
    }
  }
  /**
   * The gamepads in the game pad manager
   */
  get gamepads() {
    return this._babylonGamepads;
  }
  /**
   * Get the gamepad controllers based on type
   * @param type The type of gamepad controller
   * @returns Nullable gamepad
   */
  getGamepadByType(type = Gamepad.XBOX) {
    for (const gamepad of this._babylonGamepads) {
      if (gamepad && gamepad.type === type) {
        return gamepad;
      }
    }
    return null;
  }
  /**
   * Disposes the gamepad manager
   */
  dispose() {
    if (this._gamepadEventSupported) {
      if (this._onGamepadConnectedEvent) {
        window.removeEventListener("gamepadconnected", this._onGamepadConnectedEvent);
      }
      if (this._onGamepadDisconnectedEvent) {
        window.removeEventListener("gamepaddisconnected", this._onGamepadDisconnectedEvent);
      }
      this._onGamepadConnectedEvent = null;
      this._onGamepadDisconnectedEvent = null;
    }
    this._babylonGamepads.forEach((gamepad) => {
      gamepad.dispose();
    });
    this.onGamepadConnectedObservable.clear();
    this.onGamepadDisconnectedObservable.clear();
    this._oneGamepadConnected = false;
    this._stopMonitoringGamepads();
    this._babylonGamepads = [];
  }
  _addNewGamepad(gamepad) {
    if (!this._oneGamepadConnected) {
      this._oneGamepadConnected = true;
    }
    let newGamepad;
    const dualShock = gamepad.id.search("054c") !== -1 && gamepad.id.search("0ce6") === -1;
    const xboxOne = gamepad.id.search("Xbox One") !== -1;
    if (xboxOne || gamepad.id.search("Xbox 360") !== -1 || gamepad.id.search("xinput") !== -1 || gamepad.id.search("045e") !== -1 && gamepad.id.search("Surface Dock") === -1) {
      newGamepad = new Xbox360Pad(gamepad.id, gamepad.index, gamepad, xboxOne);
    } else if (dualShock) {
      newGamepad = new DualShockPad(gamepad.id, gamepad.index, gamepad);
    } else {
      newGamepad = new GenericPad(gamepad.id, gamepad.index, gamepad);
    }
    this._babylonGamepads[newGamepad.index] = newGamepad;
    return newGamepad;
  }
  _startMonitoringGamepads() {
    if (!this._isMonitoring) {
      this._isMonitoring = true;
      this._checkGamepadsStatus();
    }
  }
  _stopMonitoringGamepads() {
    this._isMonitoring = false;
  }
  /** @internal */
  _checkGamepadsStatus() {
    this._updateGamepadObjects();
    for (const i in this._babylonGamepads) {
      const gamepad = this._babylonGamepads[i];
      if (!gamepad || !gamepad.isConnected) {
        continue;
      }
      try {
        gamepad.update();
      } catch (_a) {
        if (this._loggedErrors.indexOf(gamepad.index) === -1) {
          Tools.Warn(`Error updating gamepad ${gamepad.id}`);
          this._loggedErrors.push(gamepad.index);
        }
      }
    }
    if (this._isMonitoring) {
      Engine.QueueNewFrame(() => {
        this._checkGamepadsStatus();
      });
    }
  }
  // This function is called only on Chrome, which does not properly support
  // connection/disconnection events and forces you to recopy again the gamepad object
  _updateGamepadObjects() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];
      if (gamepad) {
        if (!this._babylonGamepads[gamepad.index]) {
          const newGamepad = this._addNewGamepad(gamepad);
          this.onGamepadConnectedObservable.notifyObservers(newGamepad);
        } else {
          this._babylonGamepads[i].browserGamepad = gamepad;
          if (!this._babylonGamepads[i].isConnected) {
            this._babylonGamepads[i]._isConnected = true;
            this.onGamepadConnectedObservable.notifyObservers(this._babylonGamepads[i]);
          }
        }
      }
    }
  }
};

// node_modules/@babylonjs/core/Gamepads/gamepadSceneComponent.js
Object.defineProperty(Scene.prototype, "gamepadManager", {
  get: function() {
    if (!this._gamepadManager) {
      this._gamepadManager = new GamepadManager(this);
      let component = this._getComponent(SceneComponentConstants.NAME_GAMEPAD);
      if (!component) {
        component = new GamepadSystemSceneComponent(this);
        this._addComponent(component);
      }
    }
    return this._gamepadManager;
  },
  enumerable: true,
  configurable: true
});
FreeCameraInputsManager.prototype.addGamepad = function() {
  this.add(new FreeCameraGamepadInput());
  return this;
};
ArcRotateCameraInputsManager.prototype.addGamepad = function() {
  this.add(new ArcRotateCameraGamepadInput());
  return this;
};
var GamepadSystemSceneComponent = class {
  /**
   * Creates a new instance of the component for the given scene
   * @param scene Defines the scene to register the component in
   */
  constructor(scene) {
    this.name = SceneComponentConstants.NAME_GAMEPAD;
    this.scene = scene;
  }
  /**
   * Registers the component in a given scene
   */
  register() {
    this.scene._beforeCameraUpdateStage.registerStep(SceneComponentConstants.STEP_BEFORECAMERAUPDATE_GAMEPAD, this, this._beforeCameraUpdate);
  }
  /**
   * Rebuilds the elements related to this component in case of
   * context lost for instance.
   */
  rebuild() {
  }
  /**
   * Disposes the component and the associated resources
   */
  dispose() {
    const gamepadManager = this.scene._gamepadManager;
    if (gamepadManager) {
      gamepadManager.dispose();
      this.scene._gamepadManager = null;
    }
  }
  _beforeCameraUpdate() {
    const gamepadManager = this.scene._gamepadManager;
    if (gamepadManager && gamepadManager._isMonitoring) {
      gamepadManager._checkGamepadsStatus();
    }
  }
};

// node_modules/@babylonjs/core/Cameras/universalCamera.js
Node.AddNodeConstructor("FreeCamera", (name5, scene) => {
  return () => new UniversalCamera(name5, Vector3.Zero(), scene);
});
var UniversalCamera = class extends TouchCamera {
  /**
   * Defines the gamepad rotation sensibility.
   * This is the threshold from when rotation starts to be accounted for to prevent jittering.
   */
  get gamepadAngularSensibility() {
    const gamepad = this.inputs.attached["gamepad"];
    if (gamepad) {
      return gamepad.gamepadAngularSensibility;
    }
    return 0;
  }
  set gamepadAngularSensibility(value) {
    const gamepad = this.inputs.attached["gamepad"];
    if (gamepad) {
      gamepad.gamepadAngularSensibility = value;
    }
  }
  /**
   * Defines the gamepad move sensibility.
   * This is the threshold from when moving starts to be accounted for to prevent jittering.
   */
  get gamepadMoveSensibility() {
    const gamepad = this.inputs.attached["gamepad"];
    if (gamepad) {
      return gamepad.gamepadMoveSensibility;
    }
    return 0;
  }
  set gamepadMoveSensibility(value) {
    const gamepad = this.inputs.attached["gamepad"];
    if (gamepad) {
      gamepad.gamepadMoveSensibility = value;
    }
  }
  /**
   * The Universal Camera is the one to choose for first person shooter type games, and works with all the keyboard, mouse, touch and gamepads. This replaces the earlier Free Camera,
   * which still works and will still be found in many Playgrounds.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
   * @param name Define the name of the camera in the scene
   * @param position Define the start position of the camera in the scene
   * @param scene Define the scene the camera belongs to
   */
  constructor(name5, position, scene) {
    super(name5, position, scene);
    this.inputs.addGamepad();
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "UniversalCamera";
  }
};
Camera._CreateDefaultParsedCamera = (name5, scene) => {
  return new UniversalCamera(name5, Vector3.Zero(), scene);
};

// node_modules/@babylonjs/core/Cameras/gamepadCamera.js
Node.AddNodeConstructor("GamepadCamera", (name5, scene) => {
  return () => new GamepadCamera(name5, Vector3.Zero(), scene);
});
var GamepadCamera = class extends UniversalCamera {
  /**
   * Instantiates a new Gamepad Camera
   * This represents a FPS type of camera. This is only here for back compat purpose.
   * Please use the UniversalCamera instead as both are identical.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#universal-camera
   * @param name Define the name of the camera in the scene
   * @param position Define the start position of the camera in the scene
   * @param scene Define the scene the camera belongs to
   */
  constructor(name5, position, scene) {
    super(name5, position, scene);
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "GamepadCamera";
  }
};

// node_modules/@babylonjs/core/Shaders/anaglyph.fragment.js
var name = "anaglyphPixelShader";
var shader = `varying vec2 vUV;uniform sampler2D textureSampler;uniform sampler2D leftSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 leftFrag=texture2D(leftSampler,vUV);leftFrag=vec4(1.0,leftFrag.g,leftFrag.b,1.0);vec4 rightFrag=texture2D(textureSampler,vUV);rightFrag=vec4(rightFrag.r,1.0,1.0,1.0);gl_FragColor=vec4(rightFrag.rgb*leftFrag.rgb,1.0);}`;
ShaderStore.ShadersStore[name] = shader;

// node_modules/@babylonjs/core/PostProcesses/anaglyphPostProcess.js
var AnaglyphPostProcess = class extends PostProcess {
  /**
   * Gets a string identifying the name of the class
   * @returns "AnaglyphPostProcess" string
   */
  getClassName() {
    return "AnaglyphPostProcess";
  }
  /**
   * Creates a new AnaglyphPostProcess
   * @param name defines postprocess name
   * @param options defines creation options or target ratio scale
   * @param rigCameras defines cameras using this postprocess
   * @param samplingMode defines required sampling mode (BABYLON.Texture.NEAREST_SAMPLINGMODE by default)
   * @param engine defines hosting engine
   * @param reusable defines if the postprocess will be reused multiple times per frame
   */
  constructor(name5, options, rigCameras, samplingMode, engine, reusable) {
    super(name5, "anaglyph", null, ["leftSampler"], options, rigCameras[1], samplingMode, engine, reusable);
    this._passedProcess = rigCameras[0]._rigPostProcess;
    this.onApplyObservable.add((effect) => {
      effect.setTextureFromPostProcess("leftSampler", this._passedProcess);
    });
  }
};
RegisterClass("BABYLON.AnaglyphPostProcess", AnaglyphPostProcess);

// node_modules/@babylonjs/core/Cameras/RigModes/stereoscopicAnaglyphRigMode.js
function setStereoscopicAnaglyphRigMode(camera) {
  camera._rigCameras[0]._rigPostProcess = new PassPostProcess(camera.name + "_passthru", 1, camera._rigCameras[0]);
  camera._rigCameras[1]._rigPostProcess = new AnaglyphPostProcess(camera.name + "_anaglyph", 1, camera._rigCameras);
}

// node_modules/@babylonjs/core/Cameras/Stereoscopic/anaglyphArcRotateCamera.js
Node.AddNodeConstructor("AnaglyphArcRotateCamera", (name5, scene, options) => {
  return () => new AnaglyphArcRotateCamera(name5, 0, 0, 1, Vector3.Zero(), options.interaxial_distance, scene);
});
var AnaglyphArcRotateCamera = class extends ArcRotateCamera {
  /**
   * Creates a new AnaglyphArcRotateCamera
   * @param name defines camera name
   * @param alpha defines alpha angle (in radians)
   * @param beta defines beta angle (in radians)
   * @param radius defines radius
   * @param target defines camera target
   * @param interaxialDistance defines distance between each color axis
   * @param scene defines the hosting scene
   */
  constructor(name5, alpha, beta, radius, target, interaxialDistance, scene) {
    super(name5, alpha, beta, radius, target, scene);
    this._setRigMode = () => setStereoscopicAnaglyphRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.setCameraRigMode(Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance });
  }
  /**
   * Gets camera class name
   * @returns AnaglyphArcRotateCamera
   */
  getClassName() {
    return "AnaglyphArcRotateCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/anaglyphFreeCamera.js
Node.AddNodeConstructor("AnaglyphFreeCamera", (name5, scene, options) => {
  return () => new AnaglyphFreeCamera(name5, Vector3.Zero(), options.interaxial_distance, scene);
});
var AnaglyphFreeCamera = class extends FreeCamera {
  /**
   * Creates a new AnaglyphFreeCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param interaxialDistance defines distance between each color axis
   * @param scene defines the hosting scene
   */
  constructor(name5, position, interaxialDistance, scene) {
    super(name5, position, scene);
    this._setRigMode = () => setStereoscopicAnaglyphRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.setCameraRigMode(Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance });
  }
  /**
   * Gets camera class name
   * @returns AnaglyphFreeCamera
   */
  getClassName() {
    return "AnaglyphFreeCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/anaglyphGamepadCamera.js
Node.AddNodeConstructor("AnaglyphGamepadCamera", (name5, scene, options) => {
  return () => new AnaglyphGamepadCamera(name5, Vector3.Zero(), options.interaxial_distance, scene);
});
var AnaglyphGamepadCamera = class extends GamepadCamera {
  /**
   * Creates a new AnaglyphGamepadCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param interaxialDistance defines distance between each color axis
   * @param scene defines the hosting scene
   */
  constructor(name5, position, interaxialDistance, scene) {
    super(name5, position, scene);
    this._setRigMode = () => setStereoscopicAnaglyphRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.setCameraRigMode(Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance });
  }
  /**
   * Gets camera class name
   * @returns AnaglyphGamepadCamera
   */
  getClassName() {
    return "AnaglyphGamepadCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/anaglyphUniversalCamera.js
Node.AddNodeConstructor("AnaglyphUniversalCamera", (name5, scene, options) => {
  return () => new AnaglyphUniversalCamera(name5, Vector3.Zero(), options.interaxial_distance, scene);
});
var AnaglyphUniversalCamera = class extends UniversalCamera {
  /**
   * Creates a new AnaglyphUniversalCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param interaxialDistance defines distance between each color axis
   * @param scene defines the hosting scene
   */
  constructor(name5, position, interaxialDistance, scene) {
    super(name5, position, scene);
    this._setRigMode = () => setStereoscopicAnaglyphRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.setCameraRigMode(Camera.RIG_MODE_STEREOSCOPIC_ANAGLYPH, { interaxialDistance });
  }
  /**
   * Gets camera class name
   * @returns AnaglyphUniversalCamera
   */
  getClassName() {
    return "AnaglyphUniversalCamera";
  }
};

// node_modules/@babylonjs/core/Shaders/stereoscopicInterlace.fragment.js
var name2 = "stereoscopicInterlacePixelShader";
var shader2 = `const vec3 TWO=vec3(2.0,2.0,2.0);varying vec2 vUV;uniform sampler2D camASampler;uniform sampler2D textureSampler;uniform vec2 stepSize;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{bool useCamA;bool useCamB;vec2 texCoord1;vec2 texCoord2;vec3 frag1;vec3 frag2;
#ifdef IS_STEREOSCOPIC_HORIZ
useCamB=vUV.x>0.5;useCamA=!useCamB;texCoord1=vec2(useCamB ? (vUV.x-0.5)*2.0 : vUV.x*2.0,vUV.y);texCoord2=vec2(texCoord1.x+stepSize.x,vUV.y);
#else
#ifdef IS_STEREOSCOPIC_INTERLACED
float rowNum=floor(vUV.y/stepSize.y);useCamA=mod(rowNum,2.0)==1.0;useCamB=mod(rowNum,2.0)==0.0;texCoord1=vec2(vUV.x,vUV.y);texCoord2=vec2(vUV.x,vUV.y);
#else
useCamB=vUV.y>0.5;useCamA=!useCamB;texCoord1=vec2(vUV.x,useCamB ? (vUV.y-0.5)*2.0 : vUV.y*2.0);texCoord2=vec2(vUV.x,texCoord1.y+stepSize.y);
#endif
#endif
if (useCamB){frag1=texture2D(textureSampler,texCoord1).rgb;frag2=texture2D(textureSampler,texCoord2).rgb;}else if (useCamA){frag1=texture2D(camASampler ,texCoord1).rgb;frag2=texture2D(camASampler ,texCoord2).rgb;}else {discard;}
gl_FragColor=vec4((frag1+frag2)/TWO,1.0);}
`;
ShaderStore.ShadersStore[name2] = shader2;

// node_modules/@babylonjs/core/PostProcesses/stereoscopicInterlacePostProcess.js
var StereoscopicInterlacePostProcessI = class extends PostProcess {
  /**
   * Gets a string identifying the name of the class
   * @returns "StereoscopicInterlacePostProcessI" string
   */
  getClassName() {
    return "StereoscopicInterlacePostProcessI";
  }
  /**
   * Initializes a StereoscopicInterlacePostProcessI
   * @param name The name of the effect.
   * @param rigCameras The rig cameras to be applied to the post process
   * @param isStereoscopicHoriz If the rendered results are horizontal or vertical
   * @param isStereoscopicInterlaced If the rendered results are alternate line interlaced
   * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
   * @param engine The engine which the post process will be applied. (default: current engine)
   * @param reusable If the post process can be reused on the same frame. (default: false)
   */
  constructor(name5, rigCameras, isStereoscopicHoriz, isStereoscopicInterlaced, samplingMode, engine, reusable) {
    super(name5, "stereoscopicInterlace", ["stepSize"], ["camASampler"], 1, rigCameras[1], samplingMode, engine, reusable, isStereoscopicInterlaced ? "#define IS_STEREOSCOPIC_INTERLACED 1" : isStereoscopicHoriz ? "#define IS_STEREOSCOPIC_HORIZ 1" : void 0);
    this._passedProcess = rigCameras[0]._rigPostProcess;
    this._stepSize = new Vector2(1 / this.width, 1 / this.height);
    this.onSizeChangedObservable.add(() => {
      this._stepSize = new Vector2(1 / this.width, 1 / this.height);
    });
    this.onApplyObservable.add((effect) => {
      effect.setTextureFromPostProcess("camASampler", this._passedProcess);
      effect.setFloat2("stepSize", this._stepSize.x, this._stepSize.y);
    });
  }
};
var StereoscopicInterlacePostProcess = class extends PostProcess {
  /**
   * Gets a string identifying the name of the class
   * @returns "StereoscopicInterlacePostProcess" string
   */
  getClassName() {
    return "StereoscopicInterlacePostProcess";
  }
  /**
   * Initializes a StereoscopicInterlacePostProcess
   * @param name The name of the effect.
   * @param rigCameras The rig cameras to be applied to the post process
   * @param isStereoscopicHoriz If the rendered results are horizontal or vertical
   * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
   * @param engine The engine which the post process will be applied. (default: current engine)
   * @param reusable If the post process can be reused on the same frame. (default: false)
   */
  constructor(name5, rigCameras, isStereoscopicHoriz, samplingMode, engine, reusable) {
    super(name5, "stereoscopicInterlace", ["stepSize"], ["camASampler"], 1, rigCameras[1], samplingMode, engine, reusable, isStereoscopicHoriz ? "#define IS_STEREOSCOPIC_HORIZ 1" : void 0);
    this._passedProcess = rigCameras[0]._rigPostProcess;
    this._stepSize = new Vector2(1 / this.width, 1 / this.height);
    this.onSizeChangedObservable.add(() => {
      this._stepSize = new Vector2(1 / this.width, 1 / this.height);
    });
    this.onApplyObservable.add((effect) => {
      effect.setTextureFromPostProcess("camASampler", this._passedProcess);
      effect.setFloat2("stepSize", this._stepSize.x, this._stepSize.y);
    });
  }
};

// node_modules/@babylonjs/core/Cameras/RigModes/stereoscopicRigMode.js
function setStereoscopicRigMode(camera) {
  const isStereoscopicHoriz = camera.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL || camera.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED;
  const isCrossEye = camera.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_CROSSEYED;
  const isInterlaced = camera.cameraRigMode === Camera.RIG_MODE_STEREOSCOPIC_INTERLACED;
  if (isInterlaced) {
    camera._rigCameras[0]._rigPostProcess = new PassPostProcess(camera.name + "_passthru", 1, camera._rigCameras[0]);
    camera._rigCameras[1]._rigPostProcess = new StereoscopicInterlacePostProcessI(camera.name + "_stereoInterlace", camera._rigCameras, false, true);
  } else {
    camera._rigCameras[isCrossEye ? 1 : 0].viewport = new Viewport(0, 0, isStereoscopicHoriz ? 0.5 : 1, isStereoscopicHoriz ? 1 : 0.5);
    camera._rigCameras[isCrossEye ? 0 : 1].viewport = new Viewport(isStereoscopicHoriz ? 0.5 : 0, isStereoscopicHoriz ? 0 : 0.5, isStereoscopicHoriz ? 0.5 : 1, isStereoscopicHoriz ? 1 : 0.5);
  }
}

// node_modules/@babylonjs/core/Cameras/Stereoscopic/stereoscopicArcRotateCamera.js
Node.AddNodeConstructor("StereoscopicArcRotateCamera", (name5, scene, options) => {
  return () => new StereoscopicArcRotateCamera(name5, 0, 0, 1, Vector3.Zero(), options.interaxial_distance, options.isStereoscopicSideBySide, scene);
});
var StereoscopicArcRotateCamera = class extends ArcRotateCamera {
  /**
   * Creates a new StereoscopicArcRotateCamera
   * @param name defines camera name
   * @param alpha defines alpha angle (in radians)
   * @param beta defines beta angle (in radians)
   * @param radius defines radius
   * @param target defines camera target
   * @param interaxialDistance defines distance between each color axis
   * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
   * @param scene defines the hosting scene
   */
  constructor(name5, alpha, beta, radius, target, interaxialDistance, isStereoscopicSideBySide, scene) {
    super(name5, alpha, beta, radius, target, scene);
    this._setRigMode = () => setStereoscopicRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.isStereoscopicSideBySide = isStereoscopicSideBySide;
    this.setCameraRigMode(isStereoscopicSideBySide ? Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, {
      interaxialDistance
    });
  }
  /**
   * Gets camera class name
   * @returns StereoscopicArcRotateCamera
   */
  getClassName() {
    return "StereoscopicArcRotateCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/stereoscopicFreeCamera.js
Node.AddNodeConstructor("StereoscopicFreeCamera", (name5, scene, options) => {
  return () => new StereoscopicFreeCamera(name5, Vector3.Zero(), options.interaxial_distance, options.isStereoscopicSideBySide, scene);
});
var StereoscopicFreeCamera = class extends FreeCamera {
  /**
   * Creates a new StereoscopicFreeCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param interaxialDistance defines distance between each color axis
   * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
   * @param scene defines the hosting scene
   */
  constructor(name5, position, interaxialDistance, isStereoscopicSideBySide, scene) {
    super(name5, position, scene);
    this._setRigMode = () => setStereoscopicRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.isStereoscopicSideBySide = isStereoscopicSideBySide;
    this.setCameraRigMode(isStereoscopicSideBySide ? Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, {
      interaxialDistance
    });
  }
  /**
   * Gets camera class name
   * @returns StereoscopicFreeCamera
   */
  getClassName() {
    return "StereoscopicFreeCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/stereoscopicGamepadCamera.js
Node.AddNodeConstructor("StereoscopicGamepadCamera", (name5, scene, options) => {
  return () => new StereoscopicGamepadCamera(name5, Vector3.Zero(), options.interaxial_distance, options.isStereoscopicSideBySide, scene);
});
var StereoscopicGamepadCamera = class extends GamepadCamera {
  /**
   * Creates a new StereoscopicGamepadCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param interaxialDistance defines distance between each color axis
   * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
   * @param scene defines the hosting scene
   */
  constructor(name5, position, interaxialDistance, isStereoscopicSideBySide, scene) {
    super(name5, position, scene);
    this._setRigMode = () => setStereoscopicRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.isStereoscopicSideBySide = isStereoscopicSideBySide;
    this.setCameraRigMode(isStereoscopicSideBySide ? Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, {
      interaxialDistance
    });
  }
  /**
   * Gets camera class name
   * @returns StereoscopicGamepadCamera
   */
  getClassName() {
    return "StereoscopicGamepadCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/stereoscopicUniversalCamera.js
Node.AddNodeConstructor("StereoscopicFreeCamera", (name5, scene, options) => {
  return () => new StereoscopicUniversalCamera(name5, Vector3.Zero(), options.interaxial_distance, options.isStereoscopicSideBySide, scene);
});
var StereoscopicUniversalCamera = class extends UniversalCamera {
  /**
   * Creates a new StereoscopicUniversalCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param interaxialDistance defines distance between each color axis
   * @param isStereoscopicSideBySide defines is stereoscopic is done side by side or over under
   * @param scene defines the hosting scene
   */
  constructor(name5, position, interaxialDistance, isStereoscopicSideBySide, scene) {
    super(name5, position, scene);
    this._setRigMode = () => setStereoscopicRigMode(this);
    this.interaxialDistance = interaxialDistance;
    this.isStereoscopicSideBySide = isStereoscopicSideBySide;
    this.setCameraRigMode(isStereoscopicSideBySide ? Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL : Camera.RIG_MODE_STEREOSCOPIC_OVERUNDER, {
      interaxialDistance
    });
  }
  /**
   * Gets camera class name
   * @returns StereoscopicUniversalCamera
   */
  getClassName() {
    return "StereoscopicUniversalCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/Stereoscopic/stereoscopicScreenUniversalCamera.js
var StereoscopicScreenUniversalCamera = class extends UniversalCamera {
  set distanceBetweenEyes(newValue) {
    this._distanceBetweenEyes = newValue;
  }
  /**
   * distance between the eyes
   */
  get distanceBetweenEyes() {
    return this._distanceBetweenEyes;
  }
  set distanceToProjectionPlane(newValue) {
    this._distanceToProjectionPlane = newValue;
  }
  /**
   * Distance to projection plane (should be the same units the like distance between the eyes)
   */
  get distanceToProjectionPlane() {
    return this._distanceToProjectionPlane;
  }
  /**
   * Creates a new StereoscopicScreenUniversalCamera
   * @param name defines camera name
   * @param position defines initial position
   * @param scene defines the hosting scene
   * @param distanceToProjectionPlane defines distance between each color axis. The rig cameras will receive this as their negative z position!
   * @param distanceBetweenEyes defines is stereoscopic is done side by side or over under
   */
  constructor(name5, position, scene, distanceToProjectionPlane = 1, distanceBetweenEyes = 0.065) {
    super(name5, position, scene);
    this._distanceBetweenEyes = distanceBetweenEyes;
    this._distanceToProjectionPlane = distanceToProjectionPlane;
    this.setCameraRigMode(Camera.RIG_MODE_STEREOSCOPIC_SIDEBYSIDE_PARALLEL, {
      stereoHalfAngle: 0
    });
    this._cameraRigParams.stereoHalfAngle = 0;
    this._cameraRigParams.interaxialDistance = distanceBetweenEyes;
  }
  /**
   * Gets camera class name
   * @returns StereoscopicScreenUniversalCamera
   */
  getClassName() {
    return "StereoscopicUniversalCamera";
  }
  /**
   * @internal
   */
  createRigCamera(name5) {
    const camera = new TargetCamera(name5, Vector3.Zero(), this.getScene());
    const transform = new TransformNode("tm_" + name5, this.getScene());
    camera.parent = transform;
    transform.setPivotMatrix(Matrix.Identity(), false);
    camera.isRigCamera = true;
    camera.rigParent = this;
    return camera;
  }
  /**
   * @internal
   */
  _updateRigCameras() {
    for (let cameraIndex = 0; cameraIndex < this._rigCameras.length; cameraIndex++) {
      const cam = this._rigCameras[cameraIndex];
      cam.minZ = this.minZ;
      cam.maxZ = this.maxZ;
      cam.fov = this.fov;
      cam.upVector.copyFrom(this.upVector);
      if (cam.rotationQuaternion) {
        cam.rotationQuaternion.copyFrom(this.rotationQuaternion);
      } else {
        cam.rotation.copyFrom(this.rotation);
      }
      this._updateCamera(this._rigCameras[cameraIndex], cameraIndex);
    }
  }
  _updateCamera(camera, cameraIndex) {
    const b = this.distanceBetweenEyes / 2;
    const z = b / this.distanceToProjectionPlane;
    camera.position.copyFrom(this.position);
    camera.position.addInPlaceFromFloats(cameraIndex === 0 ? -b : b, 0, -this._distanceToProjectionPlane);
    const transform = camera.parent;
    const m = transform.getPivotMatrix();
    m.setTranslationFromFloats(cameraIndex === 0 ? b : -b, 0, 0);
    m.setRowFromFloats(2, cameraIndex === 0 ? z : -z, 0, 1, 0);
    transform.setPivotMatrix(m, false);
  }
  _setRigMode() {
    this._rigCameras[0].viewport = new Viewport(0, 0, 0.5, 1);
    this._rigCameras[1].viewport = new Viewport(0.5, 0, 0.5, 1);
    for (let cameraIndex = 0; cameraIndex < this._rigCameras.length; cameraIndex++) {
      this._updateCamera(this._rigCameras[cameraIndex], cameraIndex);
    }
  }
};

// node_modules/@babylonjs/core/Cameras/virtualJoysticksCamera.js
Node.AddNodeConstructor("VirtualJoysticksCamera", (name5, scene) => {
  return () => new VirtualJoysticksCamera(name5, Vector3.Zero(), scene);
});
var VirtualJoysticksCamera = class extends FreeCamera {
  /**
   * Instantiates a VirtualJoysticksCamera. It can be useful in First Person Shooter game for instance.
   * It is identical to the Free Camera and simply adds by default a virtual joystick.
   * Virtual Joysticks are on-screen 2D graphics that are used to control the camera or other scene items.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_introduction#virtual-joysticks-camera
   * @param name Define the name of the camera in the scene
   * @param position Define the start position of the camera in the scene
   * @param scene Define the scene the camera belongs to
   */
  constructor(name5, position, scene) {
    super(name5, position, scene);
    this.inputs.addVirtualJoystick();
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "VirtualJoysticksCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/VR/vrCameraMetrics.js
var VRCameraMetrics = class _VRCameraMetrics {
  constructor() {
    this.compensateDistortion = true;
    this.multiviewEnabled = false;
  }
  /**
   * Gets the rendering aspect ratio based on the provided resolutions.
   */
  get aspectRatio() {
    return this.hResolution / (2 * this.vResolution);
  }
  /**
   * Gets the aspect ratio based on the FOV, scale factors, and real screen sizes.
   */
  get aspectRatioFov() {
    return 2 * Math.atan(this.postProcessScaleFactor * this.vScreenSize / (2 * this.eyeToScreenDistance));
  }
  /**
   * @internal
   */
  get leftHMatrix() {
    const meters = this.hScreenSize / 4 - this.lensSeparationDistance / 2;
    const h = 4 * meters / this.hScreenSize;
    return Matrix.Translation(h, 0, 0);
  }
  /**
   * @internal
   */
  get rightHMatrix() {
    const meters = this.hScreenSize / 4 - this.lensSeparationDistance / 2;
    const h = 4 * meters / this.hScreenSize;
    return Matrix.Translation(-h, 0, 0);
  }
  /**
   * @internal
   */
  get leftPreViewMatrix() {
    return Matrix.Translation(0.5 * this.interpupillaryDistance, 0, 0);
  }
  /**
   * @internal
   */
  get rightPreViewMatrix() {
    return Matrix.Translation(-0.5 * this.interpupillaryDistance, 0, 0);
  }
  /**
   * Get the default VRMetrics based on the most generic setup.
   * @returns the default vr metrics
   */
  static GetDefault() {
    const result = new _VRCameraMetrics();
    result.hResolution = 1280;
    result.vResolution = 800;
    result.hScreenSize = 0.149759993;
    result.vScreenSize = 0.0935999975;
    result.vScreenCenter = 0.0467999987;
    result.eyeToScreenDistance = 0.0410000011;
    result.lensSeparationDistance = 0.063500002;
    result.interpupillaryDistance = 0.064000003;
    result.distortionK = [1, 0.219999999, 0.239999995, 0];
    result.chromaAbCorrection = [0.995999992, -0.00400000019, 1.01400006, 0];
    result.postProcessScaleFactor = 1.714605507808412;
    result.lensCenterOffset = 0.151976421;
    return result;
  }
};

// node_modules/@babylonjs/core/Shaders/vrDistortionCorrection.fragment.js
var name3 = "vrDistortionCorrectionPixelShader";
var shader3 = `varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 LensCenter;uniform vec2 Scale;uniform vec2 ScaleIn;uniform vec4 HmdWarpParam;vec2 HmdWarp(vec2 in01) {vec2 theta=(in01-LensCenter)*ScaleIn; 
float rSq=theta.x*theta.x+theta.y*theta.y;vec2 rvector=theta*(HmdWarpParam.x+HmdWarpParam.y*rSq+HmdWarpParam.z*rSq*rSq+HmdWarpParam.w*rSq*rSq*rSq);return LensCenter+Scale*rvector;}
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec2 tc=HmdWarp(vUV);if (tc.x <0.0 || tc.x>1.0 || tc.y<0.0 || tc.y>1.0)
gl_FragColor=vec4(0.0,0.0,0.0,0.0);else{gl_FragColor=texture2D(textureSampler,tc);}}`;
ShaderStore.ShadersStore[name3] = shader3;

// node_modules/@babylonjs/core/PostProcesses/vrDistortionCorrectionPostProcess.js
var VRDistortionCorrectionPostProcess = class extends PostProcess {
  /**
   * Gets a string identifying the name of the class
   * @returns "VRDistortionCorrectionPostProcess" string
   */
  getClassName() {
    return "VRDistortionCorrectionPostProcess";
  }
  /**
   * Initializes the VRDistortionCorrectionPostProcess
   * @param name The name of the effect.
   * @param camera The camera to apply the render pass to.
   * @param isRightEye If this is for the right eye distortion
   * @param vrMetrics All the required metrics for the VR camera
   */
  constructor(name5, camera, isRightEye, vrMetrics) {
    super(name5, "vrDistortionCorrection", ["LensCenter", "Scale", "ScaleIn", "HmdWarpParam"], null, vrMetrics.postProcessScaleFactor, camera, Texture.BILINEAR_SAMPLINGMODE);
    this._isRightEye = isRightEye;
    this._distortionFactors = vrMetrics.distortionK;
    this._postProcessScaleFactor = vrMetrics.postProcessScaleFactor;
    this._lensCenterOffset = vrMetrics.lensCenterOffset;
    this.adaptScaleToCurrentViewport = true;
    this.onSizeChangedObservable.add(() => {
      this._scaleIn = new Vector2(2, 2 / this.aspectRatio);
      this._scaleFactor = new Vector2(0.5 * (1 / this._postProcessScaleFactor), 0.5 * (1 / this._postProcessScaleFactor) * this.aspectRatio);
      this._lensCenter = new Vector2(this._isRightEye ? 0.5 - this._lensCenterOffset * 0.5 : 0.5 + this._lensCenterOffset * 0.5, 0.5);
    });
    this.onApplyObservable.add((effect) => {
      effect.setFloat2("LensCenter", this._lensCenter.x, this._lensCenter.y);
      effect.setFloat2("Scale", this._scaleFactor.x, this._scaleFactor.y);
      effect.setFloat2("ScaleIn", this._scaleIn.x, this._scaleIn.y);
      effect.setFloat4("HmdWarpParam", this._distortionFactors[0], this._distortionFactors[1], this._distortionFactors[2], this._distortionFactors[3]);
    });
  }
};

// node_modules/@babylonjs/core/Shaders/vrMultiviewToSingleview.fragment.js
var name4 = "vrMultiviewToSingleviewPixelShader";
var shader4 = `precision mediump sampler2DArray;varying vec2 vUV;uniform sampler2DArray multiviewSampler;uniform int imageIndex;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(multiviewSampler,vec3(vUV,imageIndex));}`;
ShaderStore.ShadersStore[name4] = shader4;

// node_modules/@babylonjs/core/Materials/Textures/MultiviewRenderTarget.js
var MultiviewRenderTarget = class extends RenderTargetTexture {
  set samples(value) {
    this._samples = value;
  }
  get samples() {
    return this._samples;
  }
  /**
   * Creates a multiview render target
   * @param scene scene used with the render target
   * @param size the size of the render target (used for each view)
   */
  constructor(scene, size = 512) {
    super("multiview rtt", size, scene, false, true, 0, false, void 0, false, false, true, void 0, true);
    this._renderTarget = this.getScene().getEngine().createMultiviewRenderTargetTexture(this.getRenderWidth(), this.getRenderHeight());
    this._texture = this._renderTarget.texture;
    this._texture.isMultiview = true;
    this._texture.format = 5;
    this.samples = this._getEngine().getCaps().maxSamples || this.samples;
    this._texture.samples = this._samples;
  }
  /**
   * @internal
   */
  _bindFrameBuffer() {
    if (!this._renderTarget) {
      return;
    }
    this.getScene().getEngine().bindMultiviewFramebuffer(this._renderTarget);
  }
  /**
   * Gets the number of views the corresponding to the texture (eg. a MultiviewRenderTarget will have > 1)
   * @returns the view count
   */
  getViewCount() {
    return 2;
  }
};

// node_modules/@babylonjs/core/Engines/Extensions/engine.multiview.js
Engine.prototype.createMultiviewRenderTargetTexture = function(width, height, colorTexture, depthStencilTexture) {
  const gl = this._gl;
  if (!this.getCaps().multiview) {
    throw "Multiview is not supported";
  }
  const rtWrapper = this._createHardwareRenderTargetWrapper(false, false, { width, height });
  rtWrapper._framebuffer = gl.createFramebuffer();
  const internalTexture = new InternalTexture(this, InternalTextureSource.Unknown, true);
  internalTexture.width = width;
  internalTexture.height = height;
  internalTexture.isMultiview = true;
  if (!colorTexture) {
    colorTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, colorTexture);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGBA8, width, height, 2);
  }
  rtWrapper._colorTextureArray = colorTexture;
  if (!depthStencilTexture) {
    depthStencilTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, depthStencilTexture);
    gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.DEPTH24_STENCIL8, width, height, 2);
  }
  rtWrapper._depthStencilTextureArray = depthStencilTexture;
  internalTexture.isReady = true;
  rtWrapper.setTextures(internalTexture);
  rtWrapper._depthStencilTexture = internalTexture;
  return rtWrapper;
};
Engine.prototype.bindMultiviewFramebuffer = function(_multiviewTexture) {
  const multiviewTexture = _multiviewTexture;
  const gl = this._gl;
  const ext = this.getCaps().oculusMultiview || this.getCaps().multiview;
  this.bindFramebuffer(multiviewTexture, void 0, void 0, void 0, true);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, multiviewTexture._framebuffer);
  if (multiviewTexture._colorTextureArray && multiviewTexture._depthStencilTextureArray) {
    if (this.getCaps().oculusMultiview) {
      ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, multiviewTexture._colorTextureArray, 0, multiviewTexture.samples, 0, 2);
      ext.framebufferTextureMultisampleMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, multiviewTexture._depthStencilTextureArray, 0, multiviewTexture.samples, 0, 2);
    } else {
      ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, multiviewTexture._colorTextureArray, 0, 0, 2);
      ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, multiviewTexture._depthStencilTextureArray, 0, 0, 2);
    }
  } else {
    throw "Invalid multiview frame buffer";
  }
};
Engine.prototype.bindSpaceWarpFramebuffer = function(_spaceWarpTexture) {
  const spaceWarpTexture = _spaceWarpTexture;
  const gl = this._gl;
  const ext = this.getCaps().oculusMultiview || this.getCaps().multiview;
  this.bindFramebuffer(spaceWarpTexture, void 0, void 0, void 0, true);
  gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, spaceWarpTexture._framebuffer);
  if (spaceWarpTexture._colorTextureArray && spaceWarpTexture._depthStencilTextureArray) {
    ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.COLOR_ATTACHMENT0, spaceWarpTexture._colorTextureArray, 0, 0, 2);
    ext.framebufferTextureMultiviewOVR(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, spaceWarpTexture._depthStencilTextureArray, 0, 0, 2);
  } else {
    throw new Error("Invalid Space Warp framebuffer");
  }
};
Camera.prototype._useMultiviewToSingleView = false;
Camera.prototype._multiviewTexture = null;
Camera.prototype._resizeOrCreateMultiviewTexture = function(width, height) {
  if (!this._multiviewTexture) {
    this._multiviewTexture = new MultiviewRenderTarget(this.getScene(), { width, height });
  } else if (this._multiviewTexture.getRenderWidth() != width || this._multiviewTexture.getRenderHeight() != height) {
    this._multiviewTexture.dispose();
    this._multiviewTexture = new MultiviewRenderTarget(this.getScene(), { width, height });
  }
};
function createMultiviewUbo(engine, name5) {
  const ubo = new UniformBuffer(engine, void 0, true, name5);
  ubo.addUniform("viewProjection", 16);
  ubo.addUniform("viewProjectionR", 16);
  ubo.addUniform("view", 16);
  ubo.addUniform("projection", 16);
  ubo.addUniform("vEyePosition", 4);
  return ubo;
}
var currentCreateSceneUniformBuffer = Scene.prototype.createSceneUniformBuffer;
Scene.prototype._transformMatrixR = Matrix.Zero();
Scene.prototype._multiviewSceneUbo = null;
Scene.prototype._createMultiviewUbo = function() {
  this._multiviewSceneUbo = createMultiviewUbo(this.getEngine(), "scene_multiview");
};
Scene.prototype.createSceneUniformBuffer = function(name5) {
  if (this._multiviewSceneUbo) {
    return createMultiviewUbo(this.getEngine(), name5);
  }
  return currentCreateSceneUniformBuffer.bind(this)(name5);
};
Scene.prototype._updateMultiviewUbo = function(viewR, projectionR) {
  if (viewR && projectionR) {
    viewR.multiplyToRef(projectionR, this._transformMatrixR);
  }
  if (viewR && projectionR) {
    viewR.multiplyToRef(projectionR, TmpVectors.Matrix[0]);
    Frustum.GetRightPlaneToRef(TmpVectors.Matrix[0], this._frustumPlanes[3]);
  }
  if (this._multiviewSceneUbo) {
    this._multiviewSceneUbo.updateMatrix("viewProjection", this.getTransformMatrix());
    this._multiviewSceneUbo.updateMatrix("viewProjectionR", this._transformMatrixR);
    this._multiviewSceneUbo.updateMatrix("view", this._viewMatrix);
    this._multiviewSceneUbo.updateMatrix("projection", this._projectionMatrix);
  }
};
Scene.prototype._renderMultiviewToSingleView = function(camera) {
  camera._resizeOrCreateMultiviewTexture(camera._rigPostProcess && camera._rigPostProcess && camera._rigPostProcess.width > 0 ? camera._rigPostProcess.width : this.getEngine().getRenderWidth(true), camera._rigPostProcess && camera._rigPostProcess && camera._rigPostProcess.height > 0 ? camera._rigPostProcess.height : this.getEngine().getRenderHeight(true));
  if (!this._multiviewSceneUbo) {
    this._createMultiviewUbo();
  }
  camera.outputRenderTarget = camera._multiviewTexture;
  this._renderForCamera(camera);
  camera.outputRenderTarget = null;
  for (let index = 0; index < camera._rigCameras.length; index++) {
    const engine = this.getEngine();
    this._activeCamera = camera._rigCameras[index];
    engine.setViewport(this._activeCamera.viewport);
    if (this.postProcessManager) {
      this.postProcessManager._prepareFrame();
      this.postProcessManager._finalizeFrame(this._activeCamera.isIntermediate);
    }
  }
};

// node_modules/@babylonjs/core/PostProcesses/vrMultiviewToSingleviewPostProcess.js
var VRMultiviewToSingleviewPostProcess = class extends PostProcess {
  /**
   * Gets a string identifying the name of the class
   * @returns "VRMultiviewToSingleviewPostProcess" string
   */
  getClassName() {
    return "VRMultiviewToSingleviewPostProcess";
  }
  /**
   * Initializes a VRMultiviewToSingleview
   * @param name name of the post process
   * @param camera camera to be applied to
   * @param scaleFactor scaling factor to the size of the output texture
   */
  constructor(name5, camera, scaleFactor) {
    super(name5, "vrMultiviewToSingleview", ["imageIndex"], ["multiviewSampler"], scaleFactor, camera, Texture.BILINEAR_SAMPLINGMODE);
    const cam = camera !== null && camera !== void 0 ? camera : this.getCamera();
    this.onSizeChangedObservable.add(() => {
    });
    this.onApplyObservable.add((effect) => {
      if (cam._scene.activeCamera && cam._scene.activeCamera.isLeftCamera) {
        effect.setInt("imageIndex", 0);
      } else {
        effect.setInt("imageIndex", 1);
      }
      effect.setTexture("multiviewSampler", cam._multiviewTexture);
    });
  }
};

// node_modules/@babylonjs/core/Cameras/RigModes/vrRigMode.js
function setVRRigMode(camera, rigParams) {
  const metrics = rigParams.vrCameraMetrics || VRCameraMetrics.GetDefault();
  camera._rigCameras[0]._cameraRigParams.vrMetrics = metrics;
  camera._rigCameras[0].viewport = new Viewport(0, 0, 0.5, 1);
  camera._rigCameras[0]._cameraRigParams.vrWorkMatrix = new Matrix();
  camera._rigCameras[0]._cameraRigParams.vrHMatrix = metrics.leftHMatrix;
  camera._rigCameras[0]._cameraRigParams.vrPreViewMatrix = metrics.leftPreViewMatrix;
  camera._rigCameras[0].getProjectionMatrix = camera._rigCameras[0]._getVRProjectionMatrix;
  camera._rigCameras[1]._cameraRigParams.vrMetrics = metrics;
  camera._rigCameras[1].viewport = new Viewport(0.5, 0, 0.5, 1);
  camera._rigCameras[1]._cameraRigParams.vrWorkMatrix = new Matrix();
  camera._rigCameras[1]._cameraRigParams.vrHMatrix = metrics.rightHMatrix;
  camera._rigCameras[1]._cameraRigParams.vrPreViewMatrix = metrics.rightPreViewMatrix;
  camera._rigCameras[1].getProjectionMatrix = camera._rigCameras[1]._getVRProjectionMatrix;
  if (metrics.multiviewEnabled) {
    if (!camera.getScene().getEngine().getCaps().multiview) {
      Logger.Warn("Multiview is not supported, falling back to standard rendering");
      metrics.multiviewEnabled = false;
    } else {
      camera._useMultiviewToSingleView = true;
      camera._rigPostProcess = new VRMultiviewToSingleviewPostProcess("VRMultiviewToSingleview", camera, metrics.postProcessScaleFactor);
    }
  }
  if (metrics.compensateDistortion) {
    camera._rigCameras[0]._rigPostProcess = new VRDistortionCorrectionPostProcess("VR_Distort_Compensation_Left", camera._rigCameras[0], false, metrics);
    camera._rigCameras[1]._rigPostProcess = new VRDistortionCorrectionPostProcess("VR_Distort_Compensation_Right", camera._rigCameras[1], true, metrics);
  }
}

// node_modules/@babylonjs/core/Cameras/VR/vrDeviceOrientationArcRotateCamera.js
Node.AddNodeConstructor("VRDeviceOrientationArcRotateCamera", (name5, scene) => {
  return () => new VRDeviceOrientationArcRotateCamera(name5, 0, 0, 1, Vector3.Zero(), scene);
});
var VRDeviceOrientationArcRotateCamera = class extends ArcRotateCamera {
  /**
   * Creates a new VRDeviceOrientationArcRotateCamera
   * @param name defines camera name
   * @param alpha defines the camera rotation along the longitudinal axis
   * @param beta defines the camera rotation along the latitudinal axis
   * @param radius defines the camera distance from its target
   * @param target defines the camera target
   * @param scene defines the scene the camera belongs to
   * @param compensateDistortion defines if the camera needs to compensate the lens distortion
   * @param vrCameraMetrics defines the vr metrics associated to the camera
   */
  constructor(name5, alpha, beta, radius, target, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
    super(name5, alpha, beta, radius, target, scene);
    this._setRigMode = (rigParams) => setVRRigMode(this, rigParams);
    vrCameraMetrics.compensateDistortion = compensateDistortion;
    this.setCameraRigMode(Camera.RIG_MODE_VR, { vrCameraMetrics });
    this.inputs.addVRDeviceOrientation();
  }
  /**
   * Gets camera class name
   * @returns VRDeviceOrientationArcRotateCamera
   */
  getClassName() {
    return "VRDeviceOrientationArcRotateCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/VR/vrDeviceOrientationFreeCamera.js
Node.AddNodeConstructor("VRDeviceOrientationFreeCamera", (name5, scene) => {
  return () => new VRDeviceOrientationFreeCamera(name5, Vector3.Zero(), scene);
});
var VRDeviceOrientationFreeCamera = class extends DeviceOrientationCamera {
  /**
   * Creates a new VRDeviceOrientationFreeCamera
   * @param name defines camera name
   * @param position defines the start position of the camera
   * @param scene defines the scene the camera belongs to
   * @param compensateDistortion defines if the camera needs to compensate the lens distortion
   * @param vrCameraMetrics defines the vr metrics associated to the camera
   */
  constructor(name5, position, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
    super(name5, position, scene);
    this._setRigMode = (rigParams) => setVRRigMode(this, rigParams);
    vrCameraMetrics.compensateDistortion = compensateDistortion;
    this.setCameraRigMode(Camera.RIG_MODE_VR, { vrCameraMetrics });
  }
  /**
   * Gets camera class name
   * @returns VRDeviceOrientationFreeCamera
   */
  getClassName() {
    return "VRDeviceOrientationFreeCamera";
  }
};

// node_modules/@babylonjs/core/Cameras/VR/vrDeviceOrientationGamepadCamera.js
Node.AddNodeConstructor("VRDeviceOrientationGamepadCamera", (name5, scene) => {
  return () => new VRDeviceOrientationGamepadCamera(name5, Vector3.Zero(), scene);
});
var VRDeviceOrientationGamepadCamera = class extends VRDeviceOrientationFreeCamera {
  /**
   * Creates a new VRDeviceOrientationGamepadCamera
   * @param name defines camera name
   * @param position defines the start position of the camera
   * @param scene defines the scene the camera belongs to
   * @param compensateDistortion defines if the camera needs to compensate the lens distortion
   * @param vrCameraMetrics defines the vr metrics associated to the camera
   */
  constructor(name5, position, scene, compensateDistortion = true, vrCameraMetrics = VRCameraMetrics.GetDefault()) {
    super(name5, position, scene, compensateDistortion, vrCameraMetrics);
    this._setRigMode = (rigParams) => setVRRigMode(this, rigParams);
    this.inputs.addGamepad();
  }
  /**
   * Gets camera class name
   * @returns VRDeviceOrientationGamepadCamera
   */
  getClassName() {
    return "VRDeviceOrientationGamepadCamera";
  }
};

// node_modules/@babylonjs/core/Engines/Extensions/engine.dynamicTexture.js
ThinEngine.prototype.createDynamicTexture = function(width, height, generateMipMaps, samplingMode) {
  const texture = new InternalTexture(this, InternalTextureSource.Dynamic);
  texture.baseWidth = width;
  texture.baseHeight = height;
  if (generateMipMaps) {
    width = this.needPOTTextures ? ThinEngine.GetExponentOfTwo(width, this._caps.maxTextureSize) : width;
    height = this.needPOTTextures ? ThinEngine.GetExponentOfTwo(height, this._caps.maxTextureSize) : height;
  }
  texture.width = width;
  texture.height = height;
  texture.isReady = false;
  texture.generateMipMaps = generateMipMaps;
  texture.samplingMode = samplingMode;
  this.updateTextureSamplingMode(samplingMode, texture);
  this._internalTexturesCache.push(texture);
  return texture;
};
ThinEngine.prototype.updateDynamicTexture = function(texture, source, invertY, premulAlpha = false, format, forceBindTexture = false, allowGPUOptimization = false) {
  if (!texture) {
    return;
  }
  const gl = this._gl;
  const target = gl.TEXTURE_2D;
  const wasPreviouslyBound = this._bindTextureDirectly(target, texture, true, forceBindTexture);
  this._unpackFlipY(invertY === void 0 ? texture.invertY : invertY);
  if (premulAlpha) {
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
  }
  const textureType = this._getWebGLTextureType(texture.type);
  const glformat = this._getInternalFormat(format ? format : texture.format);
  const internalFormat = this._getRGBABufferInternalSizedFormat(texture.type, glformat);
  gl.texImage2D(target, 0, internalFormat, glformat, textureType, source);
  if (texture.generateMipMaps) {
    gl.generateMipmap(target);
  }
  if (!wasPreviouslyBound) {
    this._bindTextureDirectly(target, null);
  }
  if (premulAlpha) {
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
  }
  if (format) {
    texture.format = format;
  }
  texture._dynamicTextureSource = source;
  texture._premulAlpha = premulAlpha;
  texture.invertY = invertY || false;
  texture.isReady = true;
};

// node_modules/@babylonjs/core/Materials/Textures/dynamicTexture.js
var DynamicTexture = class _DynamicTexture extends Texture {
  /**
   * Creates a DynamicTexture
   * @param name defines the name of the texture
   * @param options provides 3 alternatives for width and height of texture, a canvas, object with width and height properties, number for both width and height
   * @param scene defines the scene where you want the texture
   * @param generateMipMaps defines the use of MinMaps or not (default is false)
   * @param samplingMode defines the sampling mode to use (default is Texture.TRILINEAR_SAMPLINGMODE)
   * @param format defines the texture format to use (default is Engine.TEXTUREFORMAT_RGBA)
   * @param invertY defines if the texture needs to be inverted on the y axis during loading
   */
  constructor(name5, options, scene = null, generateMipMaps = false, samplingMode = 3, format = 5, invertY) {
    super(null, scene, !generateMipMaps, invertY, samplingMode, void 0, void 0, void 0, void 0, format);
    this.name = name5;
    this.wrapU = Texture.CLAMP_ADDRESSMODE;
    this.wrapV = Texture.CLAMP_ADDRESSMODE;
    this._generateMipMaps = generateMipMaps;
    const engine = this._getEngine();
    if (!engine) {
      return;
    }
    if (options.getContext) {
      this._canvas = options;
      this._texture = engine.createDynamicTexture(options.width, options.height, generateMipMaps, samplingMode);
    } else {
      this._canvas = engine.createCanvas(1, 1);
      if (options.width || options.width === 0) {
        this._texture = engine.createDynamicTexture(options.width, options.height, generateMipMaps, samplingMode);
      } else {
        this._texture = engine.createDynamicTexture(options, options, generateMipMaps, samplingMode);
      }
    }
    const textureSize = this.getSize();
    if (this._canvas.width !== textureSize.width) {
      this._canvas.width = textureSize.width;
    }
    if (this._canvas.height !== textureSize.height) {
      this._canvas.height = textureSize.height;
    }
    this._context = this._canvas.getContext("2d");
  }
  /**
   * Get the current class name of the texture useful for serialization or dynamic coding.
   * @returns "DynamicTexture"
   */
  getClassName() {
    return "DynamicTexture";
  }
  /**
   * Gets the current state of canRescale
   */
  get canRescale() {
    return true;
  }
  _recreate(textureSize) {
    this._canvas.width = textureSize.width;
    this._canvas.height = textureSize.height;
    this.releaseInternalTexture();
    this._texture = this._getEngine().createDynamicTexture(textureSize.width, textureSize.height, this._generateMipMaps, this.samplingMode);
  }
  /**
   * Scales the texture
   * @param ratio the scale factor to apply to both width and height
   */
  scale(ratio) {
    const textureSize = this.getSize();
    textureSize.width *= ratio;
    textureSize.height *= ratio;
    this._recreate(textureSize);
  }
  /**
   * Resizes the texture
   * @param width the new width
   * @param height the new height
   */
  scaleTo(width, height) {
    const textureSize = this.getSize();
    textureSize.width = width;
    textureSize.height = height;
    this._recreate(textureSize);
  }
  /**
   * Gets the context of the canvas used by the texture
   * @returns the canvas context of the dynamic texture
   */
  getContext() {
    return this._context;
  }
  /**
   * Clears the texture
   * @param clearColor Defines the clear color to use
   */
  clear(clearColor) {
    const size = this.getSize();
    if (clearColor) {
      this._context.fillStyle = clearColor;
    }
    this._context.clearRect(0, 0, size.width, size.height);
  }
  /**
   * Updates the texture
   * @param invertY defines the direction for the Y axis (default is true - y increases downwards)
   * @param premulAlpha defines if alpha is stored as premultiplied (default is false)
   * @param allowGPUOptimization true to allow some specific GPU optimizations (subject to engine feature "allowGPUOptimizationsForGUI" being true)
   */
  update(invertY, premulAlpha = false, allowGPUOptimization = false) {
    this._getEngine().updateDynamicTexture(this._texture, this._canvas, invertY === void 0 ? true : invertY, premulAlpha, this._format || void 0, void 0, allowGPUOptimization);
  }
  /**
   * Draws text onto the texture
   * @param text defines the text to be drawn
   * @param x defines the placement of the text from the left
   * @param y defines the placement of the text from the top when invertY is true and from the bottom when false
   * @param font defines the font to be used with font-style, font-size, font-name
   * @param color defines the color used for the text
   * @param fillColor defines the color for the canvas, use null to not overwrite canvas (this bleands with the background to replace, use the clear function)
   * @param invertY defines the direction for the Y axis (default is true - y increases downwards)
   * @param update defines whether texture is immediately update (default is true)
   */
  drawText(text, x, y, font, color, fillColor, invertY, update = true) {
    const size = this.getSize();
    if (fillColor) {
      this._context.fillStyle = fillColor;
      this._context.fillRect(0, 0, size.width, size.height);
    }
    this._context.font = font;
    if (x === null || x === void 0) {
      const textSize = this._context.measureText(text);
      x = (size.width - textSize.width) / 2;
    }
    if (y === null || y === void 0) {
      const fontSize = parseInt(font.replace(/\D/g, ""));
      y = size.height / 2 + fontSize / 3.65;
    }
    this._context.fillStyle = color || "";
    this._context.fillText(text, x, y);
    if (update) {
      this.update(invertY);
    }
  }
  /**
   * Clones the texture
   * @returns the clone of the texture.
   */
  clone() {
    const scene = this.getScene();
    if (!scene) {
      return this;
    }
    const textureSize = this.getSize();
    const newTexture = new _DynamicTexture(this.name, textureSize, scene, this._generateMipMaps);
    newTexture.hasAlpha = this.hasAlpha;
    newTexture.level = this.level;
    newTexture.wrapU = this.wrapU;
    newTexture.wrapV = this.wrapV;
    return newTexture;
  }
  /**
   * Serializes the dynamic texture.  The scene should be ready before the dynamic texture is serialized
   * @returns a serialized dynamic texture object
   */
  serialize() {
    const scene = this.getScene();
    if (scene && !scene.isReady()) {
      Logger.Warn("The scene must be ready before serializing the dynamic texture");
    }
    const serializationObject = super.serialize();
    if (_DynamicTexture._IsCanvasElement(this._canvas)) {
      serializationObject.base64String = this._canvas.toDataURL();
    }
    serializationObject.invertY = this._invertY;
    serializationObject.samplingMode = this.samplingMode;
    return serializationObject;
  }
  static _IsCanvasElement(canvas) {
    return canvas.toDataURL !== void 0;
  }
  /** @internal */
  _rebuild() {
    this.update();
  }
};

// node_modules/@babylonjs/core/Animations/runtimeAnimation.js
var RuntimeAnimation = class {
  /**
   * Gets the current frame of the runtime animation
   */
  get currentFrame() {
    return this._currentFrame;
  }
  /**
   * Gets the weight of the runtime animation
   */
  get weight() {
    return this._weight;
  }
  /**
   * Gets the current value of the runtime animation
   */
  get currentValue() {
    return this._currentValue;
  }
  /**
   * Gets or sets the target path of the runtime animation
   */
  get targetPath() {
    return this._targetPath;
  }
  /**
   * Gets the actual target of the runtime animation
   */
  get target() {
    return this._currentActiveTarget;
  }
  /**
   * Gets the additive state of the runtime animation
   */
  get isAdditive() {
    return this._host && this._host.isAdditive;
  }
  /**
   * Create a new RuntimeAnimation object
   * @param target defines the target of the animation
   * @param animation defines the source animation object
   * @param scene defines the hosting scene
   * @param host defines the initiating Animatable
   */
  constructor(target, animation, scene, host) {
    this._events = new Array();
    this._currentFrame = 0;
    this._originalValue = new Array();
    this._originalBlendValue = null;
    this._offsetsCache = {};
    this._highLimitsCache = {};
    this._stopped = false;
    this._blendingFactor = 0;
    this._currentValue = null;
    this._currentActiveTarget = null;
    this._directTarget = null;
    this._targetPath = "";
    this._weight = 1;
    this._absoluteFrameOffset = 0;
    this._previousElapsedTime = 0;
    this._previousAbsoluteFrame = 0;
    this._targetIsArray = false;
    this._animation = animation;
    this._target = target;
    this._scene = scene;
    this._host = host;
    this._activeTargets = [];
    animation._runtimeAnimations.push(this);
    this._animationState = {
      key: 0,
      repeatCount: 0,
      loopMode: this._getCorrectLoopMode()
    };
    if (this._animation.dataType === Animation.ANIMATIONTYPE_MATRIX) {
      this._animationState.workValue = Matrix.Zero();
    }
    this._keys = this._animation.getKeys();
    this._minFrame = this._keys[0].frame;
    this._maxFrame = this._keys[this._keys.length - 1].frame;
    this._minValue = this._keys[0].value;
    this._maxValue = this._keys[this._keys.length - 1].value;
    if (this._minFrame !== 0) {
      const newKey = { frame: 0, value: this._minValue };
      this._keys.splice(0, 0, newKey);
    }
    if (this._target instanceof Array) {
      let index = 0;
      for (const target2 of this._target) {
        this._preparePath(target2, index);
        this._getOriginalValues(index);
        index++;
      }
      this._targetIsArray = true;
    } else {
      this._preparePath(this._target);
      this._getOriginalValues();
      this._targetIsArray = false;
      this._directTarget = this._activeTargets[0];
    }
    const events = animation.getEvents();
    if (events && events.length > 0) {
      events.forEach((e) => {
        this._events.push(e._clone());
      });
    }
    this._enableBlending = target && target.animationPropertiesOverride ? target.animationPropertiesOverride.enableBlending : this._animation.enableBlending;
  }
  _preparePath(target, targetIndex = 0) {
    const targetPropertyPath = this._animation.targetPropertyPath;
    if (targetPropertyPath.length > 1) {
      let property = target[targetPropertyPath[0]];
      for (let index = 1; index < targetPropertyPath.length - 1; index++) {
        property = property[targetPropertyPath[index]];
      }
      this._targetPath = targetPropertyPath[targetPropertyPath.length - 1];
      this._activeTargets[targetIndex] = property;
    } else {
      this._targetPath = targetPropertyPath[0];
      this._activeTargets[targetIndex] = target;
    }
  }
  /**
   * Gets the animation from the runtime animation
   */
  get animation() {
    return this._animation;
  }
  /**
   * Resets the runtime animation to the beginning
   * @param restoreOriginal defines whether to restore the target property to the original value
   */
  reset(restoreOriginal = false) {
    if (restoreOriginal) {
      if (this._target instanceof Array) {
        let index = 0;
        for (const target of this._target) {
          if (this._originalValue[index] !== void 0) {
            this._setValue(target, this._activeTargets[index], this._originalValue[index], -1, index);
          }
          index++;
        }
      } else {
        if (this._originalValue[0] !== void 0) {
          this._setValue(this._target, this._directTarget, this._originalValue[0], -1, 0);
        }
      }
    }
    this._offsetsCache = {};
    this._highLimitsCache = {};
    this._currentFrame = 0;
    this._blendingFactor = 0;
    for (let index = 0; index < this._events.length; index++) {
      this._events[index].isDone = false;
    }
  }
  /**
   * Specifies if the runtime animation is stopped
   * @returns Boolean specifying if the runtime animation is stopped
   */
  isStopped() {
    return this._stopped;
  }
  /**
   * Disposes of the runtime animation
   */
  dispose() {
    const index = this._animation.runtimeAnimations.indexOf(this);
    if (index > -1) {
      this._animation.runtimeAnimations.splice(index, 1);
    }
  }
  /**
   * Apply the interpolated value to the target
   * @param currentValue defines the value computed by the animation
   * @param weight defines the weight to apply to this value (Defaults to 1.0)
   */
  setValue(currentValue, weight) {
    if (this._targetIsArray) {
      for (let index = 0; index < this._target.length; index++) {
        const target = this._target[index];
        this._setValue(target, this._activeTargets[index], currentValue, weight, index);
      }
      return;
    }
    this._setValue(this._target, this._directTarget, currentValue, weight, 0);
  }
  _getOriginalValues(targetIndex = 0) {
    let originalValue;
    const target = this._activeTargets[targetIndex];
    if (target.getLocalMatrix && this._targetPath === "_matrix") {
      originalValue = target.getLocalMatrix();
    } else {
      originalValue = target[this._targetPath];
    }
    if (originalValue && originalValue.clone) {
      this._originalValue[targetIndex] = originalValue.clone();
    } else {
      this._originalValue[targetIndex] = originalValue;
    }
  }
  _setValue(target, destination, currentValue, weight, targetIndex) {
    this._currentActiveTarget = destination;
    this._weight = weight;
    if (this._enableBlending && this._blendingFactor <= 1) {
      if (!this._originalBlendValue) {
        const originalValue = destination[this._targetPath];
        if (originalValue.clone) {
          this._originalBlendValue = originalValue.clone();
        } else {
          this._originalBlendValue = originalValue;
        }
      }
      if (this._originalBlendValue.m) {
        if (Animation.AllowMatrixDecomposeForInterpolation) {
          if (this._currentValue) {
            Matrix.DecomposeLerpToRef(this._originalBlendValue, currentValue, this._blendingFactor, this._currentValue);
          } else {
            this._currentValue = Matrix.DecomposeLerp(this._originalBlendValue, currentValue, this._blendingFactor);
          }
        } else {
          if (this._currentValue) {
            Matrix.LerpToRef(this._originalBlendValue, currentValue, this._blendingFactor, this._currentValue);
          } else {
            this._currentValue = Matrix.Lerp(this._originalBlendValue, currentValue, this._blendingFactor);
          }
        }
      } else {
        this._currentValue = Animation._UniversalLerp(this._originalBlendValue, currentValue, this._blendingFactor);
      }
      const blendingSpeed = target && target.animationPropertiesOverride ? target.animationPropertiesOverride.blendingSpeed : this._animation.blendingSpeed;
      this._blendingFactor += blendingSpeed;
    } else {
      if (!this._currentValue) {
        if (currentValue === null || currentValue === void 0 ? void 0 : currentValue.clone) {
          this._currentValue = currentValue.clone();
        } else {
          this._currentValue = currentValue;
        }
      } else if (this._currentValue.copyFrom) {
        this._currentValue.copyFrom(currentValue);
      } else {
        this._currentValue = currentValue;
      }
    }
    if (weight !== -1) {
      this._scene._registerTargetForLateAnimationBinding(this, this._originalValue[targetIndex]);
    } else {
      if (this._animationState.loopMode === Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT) {
        if (this._currentValue.addToRef) {
          this._currentValue.addToRef(this._originalValue[targetIndex], destination[this._targetPath]);
        } else {
          destination[this._targetPath] = this._originalValue[targetIndex] + this._currentValue;
        }
      } else {
        destination[this._targetPath] = this._currentValue;
      }
    }
    if (target.markAsDirty) {
      target.markAsDirty(this._animation.targetProperty);
    }
  }
  /**
   * Gets the loop pmode of the runtime animation
   * @returns Loop Mode
   */
  _getCorrectLoopMode() {
    if (this._target && this._target.animationPropertiesOverride) {
      return this._target.animationPropertiesOverride.loopMode;
    }
    return this._animation.loopMode;
  }
  /**
   * Move the current animation to a given frame
   * @param frame defines the frame to move to
   */
  goToFrame(frame) {
    const keys = this._animation.getKeys();
    if (frame < keys[0].frame) {
      frame = keys[0].frame;
    } else if (frame > keys[keys.length - 1].frame) {
      frame = keys[keys.length - 1].frame;
    }
    const events = this._events;
    if (events.length) {
      for (let index = 0; index < events.length; index++) {
        if (!events[index].onlyOnce) {
          events[index].isDone = events[index].frame < frame;
        }
      }
    }
    this._currentFrame = frame;
    const currentValue = this._animation._interpolate(frame, this._animationState);
    this.setValue(currentValue, -1);
  }
  /**
   * @internal Internal use only
   */
  _prepareForSpeedRatioChange(newSpeedRatio) {
    const newAbsoluteFrame = this._previousElapsedTime * (this._animation.framePerSecond * newSpeedRatio) / 1e3;
    this._absoluteFrameOffset = this._previousAbsoluteFrame - newAbsoluteFrame;
  }
  /**
   * Execute the current animation
   * @param elapsedTimeSinceAnimationStart defines the elapsed time (in milliseconds) since the animation was started
   * @param from defines the lower frame of the animation range
   * @param to defines the upper frame of the animation range
   * @param loop defines if the current animation must loop
   * @param speedRatio defines the current speed ratio
   * @param weight defines the weight of the animation (default is -1 so no weight)
   * @returns a boolean indicating if the animation is running
   */
  animate(elapsedTimeSinceAnimationStart, from, to, loop, speedRatio, weight = -1) {
    const animation = this._animation;
    const targetPropertyPath = animation.targetPropertyPath;
    if (!targetPropertyPath || targetPropertyPath.length < 1) {
      this._stopped = true;
      return false;
    }
    let returnValue = true;
    if (from < this._minFrame || from > this._maxFrame) {
      from = this._minFrame;
    }
    if (to < this._minFrame || to > this._maxFrame) {
      to = this._maxFrame;
    }
    const frameRange = to - from;
    let offsetValue;
    let absoluteFrame = elapsedTimeSinceAnimationStart * (animation.framePerSecond * speedRatio) / 1e3 + this._absoluteFrameOffset;
    let highLimitValue = 0;
    if (loop && this._animationState.loopMode === Animation.ANIMATIONLOOPMODE_YOYO) {
      const position = (absoluteFrame - from) / frameRange;
      const yoyoPosition = Math.abs(Math.sin(position * Math.PI));
      absoluteFrame = yoyoPosition * frameRange + from;
    }
    this._previousElapsedTime = elapsedTimeSinceAnimationStart;
    this._previousAbsoluteFrame = absoluteFrame;
    if (!loop && to >= from && absoluteFrame >= frameRange) {
      returnValue = false;
      highLimitValue = animation._getKeyValue(this._maxValue);
    } else if (!loop && from >= to && absoluteFrame <= frameRange) {
      returnValue = false;
      highLimitValue = animation._getKeyValue(this._minValue);
    } else if (this._animationState.loopMode !== Animation.ANIMATIONLOOPMODE_CYCLE) {
      const keyOffset = to.toString() + from.toString();
      if (!this._offsetsCache[keyOffset]) {
        this._animationState.repeatCount = 0;
        this._animationState.loopMode = Animation.ANIMATIONLOOPMODE_CYCLE;
        const fromValue = animation._interpolate(from, this._animationState);
        const toValue = animation._interpolate(to, this._animationState);
        this._animationState.loopMode = this._getCorrectLoopMode();
        switch (animation.dataType) {
          case Animation.ANIMATIONTYPE_FLOAT:
            this._offsetsCache[keyOffset] = toValue - fromValue;
            break;
          case Animation.ANIMATIONTYPE_QUATERNION:
            this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
            break;
          case Animation.ANIMATIONTYPE_VECTOR3:
            this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
            break;
          case Animation.ANIMATIONTYPE_VECTOR2:
            this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
            break;
          case Animation.ANIMATIONTYPE_SIZE:
            this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
            break;
          case Animation.ANIMATIONTYPE_COLOR3:
            this._offsetsCache[keyOffset] = toValue.subtract(fromValue);
            break;
          default:
            break;
        }
        this._highLimitsCache[keyOffset] = toValue;
      }
      highLimitValue = this._highLimitsCache[keyOffset];
      offsetValue = this._offsetsCache[keyOffset];
    }
    if (offsetValue === void 0) {
      switch (animation.dataType) {
        case Animation.ANIMATIONTYPE_FLOAT:
          offsetValue = 0;
          break;
        case Animation.ANIMATIONTYPE_QUATERNION:
          offsetValue = _staticOffsetValueQuaternion;
          break;
        case Animation.ANIMATIONTYPE_VECTOR3:
          offsetValue = _staticOffsetValueVector3;
          break;
        case Animation.ANIMATIONTYPE_VECTOR2:
          offsetValue = _staticOffsetValueVector2;
          break;
        case Animation.ANIMATIONTYPE_SIZE:
          offsetValue = _staticOffsetValueSize;
          break;
        case Animation.ANIMATIONTYPE_COLOR3:
          offsetValue = _staticOffsetValueColor3;
          break;
        case Animation.ANIMATIONTYPE_COLOR4:
          offsetValue = _staticOffsetValueColor4;
          break;
      }
    }
    let currentFrame;
    if (this._host && this._host.syncRoot) {
      const syncRoot = this._host.syncRoot;
      const hostNormalizedFrame = (syncRoot.masterFrame - syncRoot.fromFrame) / (syncRoot.toFrame - syncRoot.fromFrame);
      currentFrame = from + frameRange * hostNormalizedFrame;
    } else {
      if (absoluteFrame > 0 && from > to || absoluteFrame < 0 && from < to) {
        currentFrame = returnValue && frameRange !== 0 ? to + absoluteFrame % frameRange : from;
      } else {
        currentFrame = returnValue && frameRange !== 0 ? from + absoluteFrame % frameRange : to;
      }
    }
    const events = this._events;
    if (speedRatio > 0 && this.currentFrame > currentFrame || speedRatio < 0 && this.currentFrame < currentFrame) {
      this._onLoop();
      for (let index = 0; index < events.length; index++) {
        if (!events[index].onlyOnce) {
          events[index].isDone = false;
        }
      }
      this._animationState.key = speedRatio > 0 ? 0 : animation.getKeys().length - 1;
    }
    this._currentFrame = currentFrame;
    this._animationState.repeatCount = frameRange === 0 ? 0 : absoluteFrame / frameRange >> 0;
    this._animationState.highLimitValue = highLimitValue;
    this._animationState.offsetValue = offsetValue;
    const currentValue = animation._interpolate(currentFrame, this._animationState);
    this.setValue(currentValue, weight);
    if (events.length) {
      for (let index = 0; index < events.length; index++) {
        if (frameRange > 0 && currentFrame >= events[index].frame && events[index].frame >= from || frameRange < 0 && currentFrame <= events[index].frame && events[index].frame <= from) {
          const event = events[index];
          if (!event.isDone) {
            if (event.onlyOnce) {
              events.splice(index, 1);
              index--;
            }
            event.isDone = true;
            event.action(currentFrame);
          }
        }
      }
    }
    if (!returnValue) {
      this._stopped = true;
    }
    return returnValue;
  }
};

// node_modules/@babylonjs/core/Bones/bone.js
var Bone = class _Bone extends Node {
  /** @internal */
  get _matrix() {
    this._compose();
    return this._localMatrix;
  }
  /** @internal */
  set _matrix(value) {
    if (value.updateFlag === this._localMatrix.updateFlag && !this._needToCompose) {
      return;
    }
    this._needToCompose = false;
    this._localMatrix.copyFrom(value);
    this._markAsDirtyAndDecompose();
  }
  /**
   * Create a new bone
   * @param name defines the bone name
   * @param skeleton defines the parent skeleton
   * @param parentBone defines the parent (can be null if the bone is the root)
   * @param localMatrix defines the local matrix (default: identity)
   * @param restMatrix defines the rest matrix (default: localMatrix)
   * @param bindMatrix defines the bind matrix (default: localMatrix)
   * @param index defines index of the bone in the hierarchy (default: null)
   */
  constructor(name5, skeleton, parentBone = null, localMatrix = null, restMatrix = null, bindMatrix = null, index = null) {
    var _a;
    super(name5, skeleton.getScene());
    this.name = name5;
    this.children = [];
    this.animations = [];
    this._index = null;
    this._scalingDeterminant = 1;
    this._needToDecompose = true;
    this._needToCompose = false;
    this._linkedTransformNode = null;
    this._waitingTransformNodeId = null;
    this._skeleton = skeleton;
    this._localMatrix = (_a = localMatrix === null || localMatrix === void 0 ? void 0 : localMatrix.clone()) !== null && _a !== void 0 ? _a : Matrix.Identity();
    this._restMatrix = restMatrix !== null && restMatrix !== void 0 ? restMatrix : this._localMatrix.clone();
    this._bindMatrix = bindMatrix !== null && bindMatrix !== void 0 ? bindMatrix : this._localMatrix.clone();
    this._index = index;
    this._absoluteMatrix = new Matrix();
    this._absoluteBindMatrix = new Matrix();
    this._absoluteInverseBindMatrix = new Matrix();
    this._finalMatrix = new Matrix();
    skeleton.bones.push(this);
    this.setParent(parentBone, false);
    this._updateAbsoluteBindMatrices();
  }
  /**
   * Gets the current object class name.
   * @returns the class name
   */
  getClassName() {
    return "Bone";
  }
  // Members
  /**
   * Gets the parent skeleton
   * @returns a skeleton
   */
  getSkeleton() {
    return this._skeleton;
  }
  get parent() {
    return this._parentNode;
  }
  /**
   * Gets parent bone
   * @returns a bone or null if the bone is the root of the bone hierarchy
   */
  getParent() {
    return this.parent;
  }
  /**
   * Returns an array containing the children of the bone
   * @returns an array containing the children of the bone (can be empty if the bone has no children)
   */
  getChildren() {
    return this.children;
  }
  /**
   * Gets the node index in matrix array generated for rendering
   * @returns the node index
   */
  getIndex() {
    return this._index === null ? this.getSkeleton().bones.indexOf(this) : this._index;
  }
  set parent(newParent) {
    this.setParent(newParent);
  }
  /**
   * Sets the parent bone
   * @param parent defines the parent (can be null if the bone is the root)
   * @param updateAbsoluteBindMatrices defines if the absolute bind and absolute inverse bind matrices must be updated
   */
  setParent(parent, updateAbsoluteBindMatrices = true) {
    if (this.parent === parent) {
      return;
    }
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index !== -1) {
        this.parent.children.splice(index, 1);
      }
    }
    this._parentNode = parent;
    if (this.parent) {
      this.parent.children.push(this);
    }
    if (updateAbsoluteBindMatrices) {
      this._updateAbsoluteBindMatrices();
    }
    this.markAsDirty();
  }
  /**
   * Gets the local matrix
   * @returns the local matrix
   */
  getLocalMatrix() {
    this._compose();
    return this._localMatrix;
  }
  /**
   * Gets the bind matrix
   * @returns the bind matrix
   */
  getBindMatrix() {
    return this._bindMatrix;
  }
  /**
   * Gets the bind matrix.
   * @returns the bind matrix
   * @deprecated Please use getBindMatrix instead
   */
  getBaseMatrix() {
    return this.getBindMatrix();
  }
  /**
   * Gets the rest matrix
   * @returns the rest matrix
   */
  getRestMatrix() {
    return this._restMatrix;
  }
  /**
   * Gets the rest matrix
   * @returns the rest matrix
   * @deprecated Please use getRestMatrix instead
   */
  getRestPose() {
    return this.getRestMatrix();
  }
  /**
   * Sets the rest matrix
   * @param matrix the local-space rest matrix to set for this bone
   */
  setRestMatrix(matrix) {
    this._restMatrix.copyFrom(matrix);
  }
  /**
   * Sets the rest matrix
   * @param matrix the local-space rest to set for this bone
   * @deprecated Please use setRestMatrix instead
   */
  setRestPose(matrix) {
    this.setRestMatrix(matrix);
  }
  /**
   * Gets the bind matrix
   * @returns the bind matrix
   * @deprecated Please use getBindMatrix instead
   */
  getBindPose() {
    return this.getBindMatrix();
  }
  /**
   * Sets the bind matrix
   * This will trigger a recomputation of the absolute bind and absolute inverse bind matrices for this bone and its children
   * Note that the local matrix will also be set with the matrix passed in parameter!
   * @param matrix the local-space bind matrix to set for this bone
   */
  setBindMatrix(matrix) {
    this.updateMatrix(matrix);
  }
  /**
   * Sets the bind matrix
   * @param matrix the local-space bind to set for this bone
   * @deprecated Please use setBindMatrix instead
   */
  setBindPose(matrix) {
    this.setBindMatrix(matrix);
  }
  /**
   * Gets the matrix used to store the final world transformation of the bone (ie. the matrix sent to shaders)
   */
  getFinalMatrix() {
    return this._finalMatrix;
  }
  /**
   * Gets the matrix used to store the final world transformation of the bone (ie. the matrix sent to shaders)
   * @deprecated Please use getFinalMatrix instead
   */
  getWorldMatrix() {
    return this.getFinalMatrix();
  }
  /**
   * Sets the local matrix to the rest matrix
   */
  returnToRest() {
    var _a;
    if (this._linkedTransformNode) {
      const localScaling = TmpVectors.Vector3[0];
      const localRotation = TmpVectors.Quaternion[0];
      const localPosition = TmpVectors.Vector3[1];
      this.getRestMatrix().decompose(localScaling, localRotation, localPosition);
      this._linkedTransformNode.position.copyFrom(localPosition);
      this._linkedTransformNode.rotationQuaternion = (_a = this._linkedTransformNode.rotationQuaternion) !== null && _a !== void 0 ? _a : Quaternion.Identity();
      this._linkedTransformNode.rotationQuaternion.copyFrom(localRotation);
      this._linkedTransformNode.scaling.copyFrom(localScaling);
    } else {
      this._matrix = this._restMatrix;
    }
  }
  /**
   * Gets the inverse of the bind matrix, in world space (relative to the skeleton root)
   * @returns the inverse bind matrix, in world space
   */
  getAbsoluteInverseBindMatrix() {
    return this._absoluteInverseBindMatrix;
  }
  /**
   * Gets the inverse of the bind matrix, in world space (relative to the skeleton root)
   * @returns the inverse bind matrix, in world space
   * @deprecated Please use getAbsoluteInverseBindMatrix instead
   */
  getInvertedAbsoluteTransform() {
    return this.getAbsoluteInverseBindMatrix();
  }
  /**
   * Gets the bone matrix, in world space (relative to the skeleton root)
   * @returns the bone matrix, in world space
   */
  getAbsoluteMatrix() {
    return this._absoluteMatrix;
  }
  /**
   * Gets the bone matrix, in world space (relative to the skeleton root)
   * @returns the bone matrix, in world space
   * @deprecated Please use getAbsoluteMatrix instead
   */
  getAbsoluteTransform() {
    return this._absoluteMatrix;
  }
  /**
   * Links with the given transform node.
   * The local matrix of this bone is overwritten by the transform of the node every frame.
   * @param transformNode defines the transform node to link to
   */
  linkTransformNode(transformNode) {
    if (this._linkedTransformNode) {
      this._skeleton._numBonesWithLinkedTransformNode--;
    }
    this._linkedTransformNode = transformNode;
    if (this._linkedTransformNode) {
      this._skeleton._numBonesWithLinkedTransformNode++;
    }
  }
  // Properties (matches TransformNode properties)
  /**
   * Gets the node used to drive the bone's transformation
   * @returns a transform node or null
   */
  getTransformNode() {
    return this._linkedTransformNode;
  }
  /** Gets or sets current position (in local space) */
  get position() {
    this._decompose();
    return this._localPosition;
  }
  set position(newPosition) {
    this._decompose();
    this._localPosition.copyFrom(newPosition);
    this._markAsDirtyAndCompose();
  }
  /** Gets or sets current rotation (in local space) */
  get rotation() {
    return this.getRotation();
  }
  set rotation(newRotation) {
    this.setRotation(newRotation);
  }
  /** Gets or sets current rotation quaternion (in local space) */
  get rotationQuaternion() {
    this._decompose();
    return this._localRotation;
  }
  set rotationQuaternion(newRotation) {
    this.setRotationQuaternion(newRotation);
  }
  /** Gets or sets current scaling (in local space) */
  get scaling() {
    return this.getScale();
  }
  set scaling(newScaling) {
    this.setScale(newScaling);
  }
  /**
   * Gets the animation properties override
   */
  get animationPropertiesOverride() {
    return this._skeleton.animationPropertiesOverride;
  }
  // Methods
  _decompose() {
    if (!this._needToDecompose) {
      return;
    }
    this._needToDecompose = false;
    if (!this._localScaling) {
      this._localScaling = Vector3.Zero();
      this._localRotation = Quaternion.Zero();
      this._localPosition = Vector3.Zero();
    }
    this._localMatrix.decompose(this._localScaling, this._localRotation, this._localPosition);
  }
  _compose() {
    if (!this._needToCompose) {
      return;
    }
    if (!this._localScaling) {
      this._needToCompose = false;
      return;
    }
    this._needToCompose = false;
    Matrix.ComposeToRef(this._localScaling, this._localRotation, this._localPosition, this._localMatrix);
  }
  /**
   * Update the bind (and optionally the local) matrix
   * @param bindMatrix defines the new matrix to set to the bind/local matrix, in local space
   * @param updateAbsoluteBindMatrices defines if the absolute bind and absolute inverse bind matrices must be recomputed (default: true)
   * @param updateLocalMatrix defines if the local matrix should also be updated with the matrix passed in parameter (default: true)
   */
  updateMatrix(bindMatrix, updateAbsoluteBindMatrices = true, updateLocalMatrix = true) {
    this._bindMatrix.copyFrom(bindMatrix);
    if (updateAbsoluteBindMatrices) {
      this._updateAbsoluteBindMatrices();
    }
    if (updateLocalMatrix) {
      this._matrix = bindMatrix;
    } else {
      this.markAsDirty();
    }
  }
  /**
   * @internal
   */
  _updateAbsoluteBindMatrices(bindMatrix, updateChildren = true) {
    if (!bindMatrix) {
      bindMatrix = this._bindMatrix;
    }
    if (this.parent) {
      bindMatrix.multiplyToRef(this.parent._absoluteBindMatrix, this._absoluteBindMatrix);
    } else {
      this._absoluteBindMatrix.copyFrom(bindMatrix);
    }
    this._absoluteBindMatrix.invertToRef(this._absoluteInverseBindMatrix);
    if (updateChildren) {
      for (let index = 0; index < this.children.length; index++) {
        this.children[index]._updateAbsoluteBindMatrices();
      }
    }
    this._scalingDeterminant = this._absoluteBindMatrix.determinant() < 0 ? -1 : 1;
  }
  /**
   * Flag the bone as dirty (Forcing it to update everything)
   * @returns this bone
   */
  markAsDirty() {
    this._currentRenderId++;
    this._childUpdateId++;
    this._skeleton._markAsDirty();
    return this;
  }
  /** @internal */
  _markAsDirtyAndCompose() {
    this.markAsDirty();
    this._needToCompose = true;
  }
  _markAsDirtyAndDecompose() {
    this.markAsDirty();
    this._needToDecompose = true;
  }
  _updatePosition(vec, space = Space.LOCAL, tNode, translationMode = true) {
    const lm = this.getLocalMatrix();
    if (space == Space.LOCAL) {
      if (translationMode) {
        lm.addAtIndex(12, vec.x);
        lm.addAtIndex(13, vec.y);
        lm.addAtIndex(14, vec.z);
      } else {
        lm.setTranslationFromFloats(vec.x, vec.y, vec.z);
      }
    } else {
      let wm = null;
      if (tNode) {
        wm = tNode.getWorldMatrix();
      }
      this._skeleton.computeAbsoluteMatrices();
      const tmat = _Bone._TmpMats[0];
      const tvec = _Bone._TmpVecs[0];
      if (this.parent) {
        if (tNode && wm) {
          tmat.copyFrom(this.parent.getAbsoluteMatrix());
          tmat.multiplyToRef(wm, tmat);
        } else {
          tmat.copyFrom(this.parent.getAbsoluteMatrix());
        }
      } else {
        Matrix.IdentityToRef(tmat);
      }
      if (translationMode) {
        tmat.setTranslationFromFloats(0, 0, 0);
      }
      tmat.invert();
      Vector3.TransformCoordinatesToRef(vec, tmat, tvec);
      if (translationMode) {
        lm.addAtIndex(12, tvec.x);
        lm.addAtIndex(13, tvec.y);
        lm.addAtIndex(14, tvec.z);
      } else {
        lm.setTranslationFromFloats(tvec.x, tvec.y, tvec.z);
      }
    }
    this._markAsDirtyAndDecompose();
  }
  /**
   * Translate the bone in local or world space
   * @param vec The amount to translate the bone
   * @param space The space that the translation is in (default: Space.LOCAL)
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  translate(vec, space = Space.LOCAL, tNode) {
    this._updatePosition(vec, space, tNode, true);
  }
  /**
   * Set the position of the bone in local or world space
   * @param position The position to set the bone
   * @param space The space that the position is in (default: Space.LOCAL)
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setPosition(position, space = Space.LOCAL, tNode) {
    this._updatePosition(position, space, tNode, false);
  }
  /**
   * Set the absolute position of the bone (world space)
   * @param position The position to set the bone
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setAbsolutePosition(position, tNode) {
    this.setPosition(position, Space.WORLD, tNode);
  }
  /**
   * Scale the bone on the x, y and z axes (in local space)
   * @param x The amount to scale the bone on the x axis
   * @param y The amount to scale the bone on the y axis
   * @param z The amount to scale the bone on the z axis
   * @param scaleChildren sets this to true if children of the bone should be scaled as well (false by default)
   */
  scale(x, y, z, scaleChildren = false) {
    const locMat = this.getLocalMatrix();
    const scaleMat = _Bone._TmpMats[0];
    Matrix.ScalingToRef(x, y, z, scaleMat);
    scaleMat.multiplyToRef(locMat, locMat);
    scaleMat.invert();
    for (const child of this.children) {
      const cm = child.getLocalMatrix();
      cm.multiplyToRef(scaleMat, cm);
      cm.multiplyAtIndex(12, x);
      cm.multiplyAtIndex(13, y);
      cm.multiplyAtIndex(14, z);
      child._markAsDirtyAndDecompose();
    }
    this._markAsDirtyAndDecompose();
    if (scaleChildren) {
      for (const child of this.children) {
        child.scale(x, y, z, scaleChildren);
      }
    }
  }
  /**
   * Set the bone scaling in local space
   * @param scale defines the scaling vector
   */
  setScale(scale) {
    this._decompose();
    this._localScaling.copyFrom(scale);
    this._markAsDirtyAndCompose();
  }
  /**
   * Gets the current scaling in local space
   * @returns the current scaling vector
   */
  getScale() {
    this._decompose();
    return this._localScaling;
  }
  /**
   * Gets the current scaling in local space and stores it in a target vector
   * @param result defines the target vector
   */
  getScaleToRef(result) {
    this._decompose();
    result.copyFrom(this._localScaling);
  }
  /**
   * Set the yaw, pitch, and roll of the bone in local or world space
   * @param yaw The rotation of the bone on the y axis
   * @param pitch The rotation of the bone on the x axis
   * @param roll The rotation of the bone on the z axis
   * @param space The space that the axes of rotation are in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setYawPitchRoll(yaw, pitch, roll, space = Space.LOCAL, tNode) {
    if (space === Space.LOCAL) {
      const quat = _Bone._TmpQuat;
      Quaternion.RotationYawPitchRollToRef(yaw, pitch, roll, quat);
      this.setRotationQuaternion(quat, space, tNode);
      return;
    }
    const rotMatInv = _Bone._TmpMats[0];
    if (!this._getAbsoluteInverseMatrixUnscaledToRef(rotMatInv, tNode)) {
      return;
    }
    const rotMat = _Bone._TmpMats[1];
    Matrix.RotationYawPitchRollToRef(yaw, pitch, roll, rotMat);
    rotMatInv.multiplyToRef(rotMat, rotMat);
    this._rotateWithMatrix(rotMat, space, tNode);
  }
  /**
   * Add a rotation to the bone on an axis in local or world space
   * @param axis The axis to rotate the bone on
   * @param amount The amount to rotate the bone
   * @param space The space that the axis is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  rotate(axis, amount, space = Space.LOCAL, tNode) {
    const rmat = _Bone._TmpMats[0];
    rmat.setTranslationFromFloats(0, 0, 0);
    Matrix.RotationAxisToRef(axis, amount, rmat);
    this._rotateWithMatrix(rmat, space, tNode);
  }
  /**
   * Set the rotation of the bone to a particular axis angle in local or world space
   * @param axis The axis to rotate the bone on
   * @param angle The angle that the bone should be rotated to
   * @param space The space that the axis is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setAxisAngle(axis, angle, space = Space.LOCAL, tNode) {
    if (space === Space.LOCAL) {
      const quat = _Bone._TmpQuat;
      Quaternion.RotationAxisToRef(axis, angle, quat);
      this.setRotationQuaternion(quat, space, tNode);
      return;
    }
    const rotMatInv = _Bone._TmpMats[0];
    if (!this._getAbsoluteInverseMatrixUnscaledToRef(rotMatInv, tNode)) {
      return;
    }
    const rotMat = _Bone._TmpMats[1];
    Matrix.RotationAxisToRef(axis, angle, rotMat);
    rotMatInv.multiplyToRef(rotMat, rotMat);
    this._rotateWithMatrix(rotMat, space, tNode);
  }
  /**
   * Set the euler rotation of the bone in local or world space
   * @param rotation The euler rotation that the bone should be set to
   * @param space The space that the rotation is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setRotation(rotation, space = Space.LOCAL, tNode) {
    this.setYawPitchRoll(rotation.y, rotation.x, rotation.z, space, tNode);
  }
  /**
   * Set the quaternion rotation of the bone in local or world space
   * @param quat The quaternion rotation that the bone should be set to
   * @param space The space that the rotation is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setRotationQuaternion(quat, space = Space.LOCAL, tNode) {
    if (space === Space.LOCAL) {
      this._decompose();
      this._localRotation.copyFrom(quat);
      this._markAsDirtyAndCompose();
      return;
    }
    const rotMatInv = _Bone._TmpMats[0];
    if (!this._getAbsoluteInverseMatrixUnscaledToRef(rotMatInv, tNode)) {
      return;
    }
    const rotMat = _Bone._TmpMats[1];
    Matrix.FromQuaternionToRef(quat, rotMat);
    rotMatInv.multiplyToRef(rotMat, rotMat);
    this._rotateWithMatrix(rotMat, space, tNode);
  }
  /**
   * Set the rotation matrix of the bone in local or world space
   * @param rotMat The rotation matrix that the bone should be set to
   * @param space The space that the rotation is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   */
  setRotationMatrix(rotMat, space = Space.LOCAL, tNode) {
    if (space === Space.LOCAL) {
      const quat = _Bone._TmpQuat;
      Quaternion.FromRotationMatrixToRef(rotMat, quat);
      this.setRotationQuaternion(quat, space, tNode);
      return;
    }
    const rotMatInv = _Bone._TmpMats[0];
    if (!this._getAbsoluteInverseMatrixUnscaledToRef(rotMatInv, tNode)) {
      return;
    }
    const rotMat2 = _Bone._TmpMats[1];
    rotMat2.copyFrom(rotMat);
    rotMatInv.multiplyToRef(rotMat, rotMat2);
    this._rotateWithMatrix(rotMat2, space, tNode);
  }
  _rotateWithMatrix(rmat, space = Space.LOCAL, tNode) {
    const lmat = this.getLocalMatrix();
    const lx = lmat.m[12];
    const ly = lmat.m[13];
    const lz = lmat.m[14];
    const parent = this.getParent();
    const parentScale = _Bone._TmpMats[3];
    const parentScaleInv = _Bone._TmpMats[4];
    if (parent && space == Space.WORLD) {
      if (tNode) {
        parentScale.copyFrom(tNode.getWorldMatrix());
        parent.getAbsoluteMatrix().multiplyToRef(parentScale, parentScale);
      } else {
        parentScale.copyFrom(parent.getAbsoluteMatrix());
      }
      parentScaleInv.copyFrom(parentScale);
      parentScaleInv.invert();
      lmat.multiplyToRef(parentScale, lmat);
      lmat.multiplyToRef(rmat, lmat);
      lmat.multiplyToRef(parentScaleInv, lmat);
    } else {
      if (space == Space.WORLD && tNode) {
        parentScale.copyFrom(tNode.getWorldMatrix());
        parentScaleInv.copyFrom(parentScale);
        parentScaleInv.invert();
        lmat.multiplyToRef(parentScale, lmat);
        lmat.multiplyToRef(rmat, lmat);
        lmat.multiplyToRef(parentScaleInv, lmat);
      } else {
        lmat.multiplyToRef(rmat, lmat);
      }
    }
    lmat.setTranslationFromFloats(lx, ly, lz);
    this.computeAbsoluteMatrices();
    this._markAsDirtyAndDecompose();
  }
  _getAbsoluteInverseMatrixUnscaledToRef(rotMatInv, tNode) {
    const scaleMatrix = _Bone._TmpMats[2];
    rotMatInv.copyFrom(this.getAbsoluteMatrix());
    if (tNode) {
      rotMatInv.multiplyToRef(tNode.getWorldMatrix(), rotMatInv);
      Matrix.ScalingToRef(tNode.scaling.x, tNode.scaling.y, tNode.scaling.z, scaleMatrix);
    } else {
      Matrix.IdentityToRef(scaleMatrix);
    }
    rotMatInv.invert();
    if (isNaN(rotMatInv.m[0])) {
      return false;
    }
    scaleMatrix.multiplyAtIndex(0, this._scalingDeterminant);
    rotMatInv.multiplyToRef(scaleMatrix, rotMatInv);
    return true;
  }
  /**
   * Get the position of the bone in local or world space
   * @param space The space that the returned position is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The position of the bone
   */
  getPosition(space = Space.LOCAL, tNode = null) {
    const pos = Vector3.Zero();
    this.getPositionToRef(space, tNode, pos);
    return pos;
  }
  /**
   * Copy the position of the bone to a vector3 in local or world space
   * @param space The space that the returned position is in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The vector3 to copy the position to
   */
  getPositionToRef(space = Space.LOCAL, tNode, result) {
    if (space == Space.LOCAL) {
      const lm = this.getLocalMatrix();
      result.x = lm.m[12];
      result.y = lm.m[13];
      result.z = lm.m[14];
    } else {
      let wm = null;
      if (tNode) {
        wm = tNode.getWorldMatrix();
      }
      this._skeleton.computeAbsoluteMatrices();
      let tmat = _Bone._TmpMats[0];
      if (tNode && wm) {
        tmat.copyFrom(this.getAbsoluteMatrix());
        tmat.multiplyToRef(wm, tmat);
      } else {
        tmat = this.getAbsoluteMatrix();
      }
      result.x = tmat.m[12];
      result.y = tmat.m[13];
      result.z = tmat.m[14];
    }
  }
  /**
   * Get the absolute position of the bone (world space)
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The absolute position of the bone
   */
  getAbsolutePosition(tNode = null) {
    const pos = Vector3.Zero();
    this.getPositionToRef(Space.WORLD, tNode, pos);
    return pos;
  }
  /**
   * Copy the absolute position of the bone (world space) to the result param
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The vector3 to copy the absolute position to
   */
  getAbsolutePositionToRef(tNode, result) {
    this.getPositionToRef(Space.WORLD, tNode, result);
  }
  /**
   * Compute the absolute matrices of this bone and its children
   */
  computeAbsoluteMatrices() {
    this._compose();
    if (this.parent) {
      this._localMatrix.multiplyToRef(this.parent._absoluteMatrix, this._absoluteMatrix);
    } else {
      this._absoluteMatrix.copyFrom(this._localMatrix);
      const poseMatrix = this._skeleton.getPoseMatrix();
      if (poseMatrix) {
        this._absoluteMatrix.multiplyToRef(poseMatrix, this._absoluteMatrix);
      }
    }
    const children = this.children;
    const len = children.length;
    for (let i = 0; i < len; i++) {
      children[i].computeAbsoluteMatrices();
    }
  }
  /**
   * Compute the absolute matrices of this bone and its children
   * @deprecated Please use computeAbsoluteMatrices instead
   */
  computeAbsoluteTransforms() {
    this.computeAbsoluteMatrices();
  }
  /**
   * Get the world direction from an axis that is in the local space of the bone
   * @param localAxis The local direction that is used to compute the world direction
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The world direction
   */
  getDirection(localAxis, tNode = null) {
    const result = Vector3.Zero();
    this.getDirectionToRef(localAxis, tNode, result);
    return result;
  }
  /**
   * Copy the world direction to a vector3 from an axis that is in the local space of the bone
   * @param localAxis The local direction that is used to compute the world direction
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The vector3 that the world direction will be copied to
   */
  getDirectionToRef(localAxis, tNode = null, result) {
    let wm = null;
    if (tNode) {
      wm = tNode.getWorldMatrix();
    }
    this._skeleton.computeAbsoluteMatrices();
    const mat = _Bone._TmpMats[0];
    mat.copyFrom(this.getAbsoluteMatrix());
    if (tNode && wm) {
      mat.multiplyToRef(wm, mat);
    }
    Vector3.TransformNormalToRef(localAxis, mat, result);
    result.normalize();
  }
  /**
   * Get the euler rotation of the bone in local or world space
   * @param space The space that the rotation should be in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The euler rotation
   */
  getRotation(space = Space.LOCAL, tNode = null) {
    const result = Vector3.Zero();
    this.getRotationToRef(space, tNode, result);
    return result;
  }
  /**
   * Copy the euler rotation of the bone to a vector3.  The rotation can be in either local or world space
   * @param space The space that the rotation should be in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The vector3 that the rotation should be copied to
   */
  getRotationToRef(space = Space.LOCAL, tNode = null, result) {
    const quat = _Bone._TmpQuat;
    this.getRotationQuaternionToRef(space, tNode, quat);
    quat.toEulerAnglesToRef(result);
  }
  /**
   * Get the quaternion rotation of the bone in either local or world space
   * @param space The space that the rotation should be in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The quaternion rotation
   */
  getRotationQuaternion(space = Space.LOCAL, tNode = null) {
    const result = Quaternion.Identity();
    this.getRotationQuaternionToRef(space, tNode, result);
    return result;
  }
  /**
   * Copy the quaternion rotation of the bone to a quaternion.  The rotation can be in either local or world space
   * @param space The space that the rotation should be in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The quaternion that the rotation should be copied to
   */
  getRotationQuaternionToRef(space = Space.LOCAL, tNode = null, result) {
    if (space == Space.LOCAL) {
      this._decompose();
      result.copyFrom(this._localRotation);
    } else {
      const mat = _Bone._TmpMats[0];
      const amat = this.getAbsoluteMatrix();
      if (tNode) {
        amat.multiplyToRef(tNode.getWorldMatrix(), mat);
      } else {
        mat.copyFrom(amat);
      }
      mat.multiplyAtIndex(0, this._scalingDeterminant);
      mat.multiplyAtIndex(1, this._scalingDeterminant);
      mat.multiplyAtIndex(2, this._scalingDeterminant);
      mat.decompose(void 0, result, void 0);
    }
  }
  /**
   * Get the rotation matrix of the bone in local or world space
   * @param space The space that the rotation should be in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The rotation matrix
   */
  getRotationMatrix(space = Space.LOCAL, tNode) {
    const result = Matrix.Identity();
    this.getRotationMatrixToRef(space, tNode, result);
    return result;
  }
  /**
   * Copy the rotation matrix of the bone to a matrix.  The rotation can be in either local or world space
   * @param space The space that the rotation should be in
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The quaternion that the rotation should be copied to
   */
  getRotationMatrixToRef(space = Space.LOCAL, tNode, result) {
    if (space == Space.LOCAL) {
      this.getLocalMatrix().getRotationMatrixToRef(result);
    } else {
      const mat = _Bone._TmpMats[0];
      const amat = this.getAbsoluteMatrix();
      if (tNode) {
        amat.multiplyToRef(tNode.getWorldMatrix(), mat);
      } else {
        mat.copyFrom(amat);
      }
      mat.multiplyAtIndex(0, this._scalingDeterminant);
      mat.multiplyAtIndex(1, this._scalingDeterminant);
      mat.multiplyAtIndex(2, this._scalingDeterminant);
      mat.getRotationMatrixToRef(result);
    }
  }
  /**
   * Get the world position of a point that is in the local space of the bone
   * @param position The local position
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The world position
   */
  getAbsolutePositionFromLocal(position, tNode = null) {
    const result = Vector3.Zero();
    this.getAbsolutePositionFromLocalToRef(position, tNode, result);
    return result;
  }
  /**
   * Get the world position of a point that is in the local space of the bone and copy it to the result param
   * @param position The local position
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The vector3 that the world position should be copied to
   */
  getAbsolutePositionFromLocalToRef(position, tNode = null, result) {
    let wm = null;
    if (tNode) {
      wm = tNode.getWorldMatrix();
    }
    this._skeleton.computeAbsoluteMatrices();
    const tmat = _Bone._TmpMats[0];
    tmat.copyFrom(this.getAbsoluteMatrix());
    if (tNode && wm) {
      tmat.multiplyToRef(wm, tmat);
    }
    Vector3.TransformCoordinatesToRef(position, tmat, result);
  }
  /**
   * Get the local position of a point that is in world space
   * @param position The world position
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @returns The local position
   */
  getLocalPositionFromAbsolute(position, tNode = null) {
    const result = Vector3.Zero();
    this.getLocalPositionFromAbsoluteToRef(position, tNode, result);
    return result;
  }
  /**
   * Get the local position of a point that is in world space and copy it to the result param
   * @param position The world position
   * @param tNode A TransformNode whose world matrix is to be applied to the calculated absolute matrix. In most cases, you'll want to pass the mesh associated with the skeleton from which this bone comes. Used only when space=Space.WORLD
   * @param result The vector3 that the local position should be copied to
   */
  getLocalPositionFromAbsoluteToRef(position, tNode = null, result) {
    let wm = null;
    if (tNode) {
      wm = tNode.getWorldMatrix();
    }
    this._skeleton.computeAbsoluteMatrices();
    const tmat = _Bone._TmpMats[0];
    tmat.copyFrom(this.getAbsoluteMatrix());
    if (tNode && wm) {
      tmat.multiplyToRef(wm, tmat);
    }
    tmat.invert();
    Vector3.TransformCoordinatesToRef(position, tmat, result);
  }
  /**
   * Set the current local matrix as the restMatrix for this bone.
   */
  setCurrentPoseAsRest() {
    this.setRestMatrix(this.getLocalMatrix());
  }
};
Bone._TmpVecs = ArrayTools.BuildArray(2, Vector3.Zero);
Bone._TmpQuat = Quaternion.Identity();
Bone._TmpMats = ArrayTools.BuildArray(5, Matrix.Identity);

// node_modules/@babylonjs/core/Animations/animatable.js
var Animatable = class {
  /**
   * Gets the root Animatable used to synchronize and normalize animations
   */
  get syncRoot() {
    return this._syncRoot;
  }
  /**
   * Gets the current frame of the first RuntimeAnimation
   * Used to synchronize Animatables
   */
  get masterFrame() {
    if (this._runtimeAnimations.length === 0) {
      return 0;
    }
    return this._runtimeAnimations[0].currentFrame;
  }
  /**
   * Gets or sets the animatable weight (-1.0 by default meaning not weighted)
   */
  get weight() {
    return this._weight;
  }
  set weight(value) {
    if (value === -1) {
      this._weight = -1;
      return;
    }
    this._weight = Math.min(Math.max(value, 0), 1);
  }
  /**
   * Gets or sets the speed ratio to apply to the animatable (1.0 by default)
   */
  get speedRatio() {
    return this._speedRatio;
  }
  set speedRatio(value) {
    for (let index = 0; index < this._runtimeAnimations.length; index++) {
      const animation = this._runtimeAnimations[index];
      animation._prepareForSpeedRatioChange(value);
    }
    this._speedRatio = value;
    if (this._goToFrame !== null) {
      this.goToFrame(this._goToFrame);
    }
  }
  /**
   * Gets the elapsed time since the animatable started in milliseconds
   */
  get elapsedTime() {
    return this._localDelayOffset === null ? 0 : this._scene._animationTime - this._localDelayOffset;
  }
  /**
   * Creates a new Animatable
   * @param scene defines the hosting scene
   * @param target defines the target object
   * @param fromFrame defines the starting frame number (default is 0)
   * @param toFrame defines the ending frame number (default is 100)
   * @param loopAnimation defines if the animation must loop (default is false)
   * @param speedRatio defines the factor to apply to animation speed (default is 1)
   * @param onAnimationEnd defines a callback to call when animation ends if it is not looping
   * @param animations defines a group of animation to add to the new Animatable
   * @param onAnimationLoop defines a callback to call when animation loops
   * @param isAdditive defines whether the animation should be evaluated additively
   * @param playOrder defines the order in which this animatable should be processed in the list of active animatables (default: 0)
   */
  constructor(scene, target, fromFrame = 0, toFrame = 100, loopAnimation = false, speedRatio = 1, onAnimationEnd, animations, onAnimationLoop, isAdditive = false, playOrder = 0) {
    this.target = target;
    this.fromFrame = fromFrame;
    this.toFrame = toFrame;
    this.loopAnimation = loopAnimation;
    this.onAnimationEnd = onAnimationEnd;
    this.onAnimationLoop = onAnimationLoop;
    this.isAdditive = isAdditive;
    this.playOrder = playOrder;
    this._localDelayOffset = null;
    this._pausedDelay = null;
    this._manualJumpDelay = null;
    this._runtimeAnimations = new Array();
    this._paused = false;
    this._speedRatio = 1;
    this._weight = -1;
    this._syncRoot = null;
    this._frameToSyncFromJump = null;
    this._goToFrame = null;
    this.disposeOnEnd = true;
    this.animationStarted = false;
    this.onAnimationEndObservable = new Observable();
    this.onAnimationLoopObservable = new Observable();
    this._scene = scene;
    if (animations) {
      this.appendAnimations(target, animations);
    }
    this._speedRatio = speedRatio;
    scene._activeAnimatables.push(this);
  }
  // Methods
  /**
   * Synchronize and normalize current Animatable with a source Animatable
   * This is useful when using animation weights and when animations are not of the same length
   * @param root defines the root Animatable to synchronize with (null to stop synchronizing)
   * @returns the current Animatable
   */
  syncWith(root) {
    this._syncRoot = root;
    if (root) {
      const index = this._scene._activeAnimatables.indexOf(this);
      if (index > -1) {
        this._scene._activeAnimatables.splice(index, 1);
        this._scene._activeAnimatables.push(this);
      }
    }
    return this;
  }
  /**
   * Gets the list of runtime animations
   * @returns an array of RuntimeAnimation
   */
  getAnimations() {
    return this._runtimeAnimations;
  }
  /**
   * Adds more animations to the current animatable
   * @param target defines the target of the animations
   * @param animations defines the new animations to add
   */
  appendAnimations(target, animations) {
    for (let index = 0; index < animations.length; index++) {
      const animation = animations[index];
      const newRuntimeAnimation = new RuntimeAnimation(target, animation, this._scene, this);
      newRuntimeAnimation._onLoop = () => {
        this.onAnimationLoopObservable.notifyObservers(this);
        if (this.onAnimationLoop) {
          this.onAnimationLoop();
        }
      };
      this._runtimeAnimations.push(newRuntimeAnimation);
    }
  }
  /**
   * Gets the source animation for a specific property
   * @param property defines the property to look for
   * @returns null or the source animation for the given property
   */
  getAnimationByTargetProperty(property) {
    const runtimeAnimations = this._runtimeAnimations;
    for (let index = 0; index < runtimeAnimations.length; index++) {
      if (runtimeAnimations[index].animation.targetProperty === property) {
        return runtimeAnimations[index].animation;
      }
    }
    return null;
  }
  /**
   * Gets the runtime animation for a specific property
   * @param property defines the property to look for
   * @returns null or the runtime animation for the given property
   */
  getRuntimeAnimationByTargetProperty(property) {
    const runtimeAnimations = this._runtimeAnimations;
    for (let index = 0; index < runtimeAnimations.length; index++) {
      if (runtimeAnimations[index].animation.targetProperty === property) {
        return runtimeAnimations[index];
      }
    }
    return null;
  }
  /**
   * Resets the animatable to its original state
   */
  reset() {
    const runtimeAnimations = this._runtimeAnimations;
    for (let index = 0; index < runtimeAnimations.length; index++) {
      runtimeAnimations[index].reset(true);
    }
    this._localDelayOffset = null;
    this._pausedDelay = null;
  }
  /**
   * Allows the animatable to blend with current running animations
   * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#animation-blending
   * @param blendingSpeed defines the blending speed to use
   */
  enableBlending(blendingSpeed) {
    const runtimeAnimations = this._runtimeAnimations;
    for (let index = 0; index < runtimeAnimations.length; index++) {
      runtimeAnimations[index].animation.enableBlending = true;
      runtimeAnimations[index].animation.blendingSpeed = blendingSpeed;
    }
  }
  /**
   * Disable animation blending
   * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/advanced_animations#animation-blending
   */
  disableBlending() {
    const runtimeAnimations = this._runtimeAnimations;
    for (let index = 0; index < runtimeAnimations.length; index++) {
      runtimeAnimations[index].animation.enableBlending = false;
    }
  }
  /**
   * Jump directly to a given frame
   * @param frame defines the frame to jump to
   */
  goToFrame(frame) {
    var _a;
    const runtimeAnimations = this._runtimeAnimations;
    if (runtimeAnimations[0]) {
      const fps = runtimeAnimations[0].animation.framePerSecond;
      this._frameToSyncFromJump = (_a = this._frameToSyncFromJump) !== null && _a !== void 0 ? _a : runtimeAnimations[0].currentFrame;
      const delay = this.speedRatio === 0 ? 0 : (frame - this._frameToSyncFromJump) / fps * 1e3 / this.speedRatio;
      this._manualJumpDelay = -delay;
    }
    for (let index = 0; index < runtimeAnimations.length; index++) {
      runtimeAnimations[index].goToFrame(frame);
    }
    this._goToFrame = frame;
  }
  /**
   * Returns true if the animations for this animatable are paused
   */
  get paused() {
    return this._paused;
  }
  /**
   * Pause the animation
   */
  pause() {
    if (this._paused) {
      return;
    }
    this._paused = true;
  }
  /**
   * Restart the animation
   */
  restart() {
    this._paused = false;
  }
  _raiseOnAnimationEnd() {
    if (this.onAnimationEnd) {
      this.onAnimationEnd();
    }
    this.onAnimationEndObservable.notifyObservers(this);
  }
  /**
   * Stop and delete the current animation
   * @param animationName defines a string used to only stop some of the runtime animations instead of all
   * @param targetMask a function that determines if the animation should be stopped based on its target (all animations will be stopped if both this and animationName are empty)
   * @param useGlobalSplice if true, the animatables will be removed by the caller of this function (false by default)
   */
  stop(animationName, targetMask, useGlobalSplice = false) {
    if (animationName || targetMask) {
      const idx = this._scene._activeAnimatables.indexOf(this);
      if (idx > -1) {
        const runtimeAnimations = this._runtimeAnimations;
        for (let index = runtimeAnimations.length - 1; index >= 0; index--) {
          const runtimeAnimation = runtimeAnimations[index];
          if (animationName && runtimeAnimation.animation.name != animationName) {
            continue;
          }
          if (targetMask && !targetMask(runtimeAnimation.target)) {
            continue;
          }
          runtimeAnimation.dispose();
          runtimeAnimations.splice(index, 1);
        }
        if (runtimeAnimations.length == 0) {
          if (!useGlobalSplice) {
            this._scene._activeAnimatables.splice(idx, 1);
          }
          this._raiseOnAnimationEnd();
        }
      }
    } else {
      const index = this._scene._activeAnimatables.indexOf(this);
      if (index > -1) {
        if (!useGlobalSplice) {
          this._scene._activeAnimatables.splice(index, 1);
        }
        const runtimeAnimations = this._runtimeAnimations;
        for (let index2 = 0; index2 < runtimeAnimations.length; index2++) {
          runtimeAnimations[index2].dispose();
        }
        this._runtimeAnimations.length = 0;
        this._raiseOnAnimationEnd();
      }
    }
  }
  /**
   * Wait asynchronously for the animation to end
   * @returns a promise which will be fulfilled when the animation ends
   */
  waitAsync() {
    return new Promise((resolve) => {
      this.onAnimationEndObservable.add(() => {
        resolve(this);
      }, void 0, void 0, this, true);
    });
  }
  /**
   * @internal
   */
  _animate(delay) {
    if (this._paused) {
      this.animationStarted = false;
      if (this._pausedDelay === null) {
        this._pausedDelay = delay;
      }
      return true;
    }
    if (this._localDelayOffset === null) {
      this._localDelayOffset = delay;
      this._pausedDelay = null;
    } else if (this._pausedDelay !== null) {
      this._localDelayOffset += delay - this._pausedDelay;
      this._pausedDelay = null;
    }
    if (this._manualJumpDelay !== null) {
      this._localDelayOffset += this._manualJumpDelay;
      this._manualJumpDelay = null;
      this._frameToSyncFromJump = null;
    }
    this._goToFrame = null;
    if (this._weight === 0) {
      return true;
    }
    let running = false;
    const runtimeAnimations = this._runtimeAnimations;
    let index;
    for (index = 0; index < runtimeAnimations.length; index++) {
      const animation = runtimeAnimations[index];
      const isRunning = animation.animate(delay - this._localDelayOffset, this.fromFrame, this.toFrame, this.loopAnimation, this._speedRatio, this._weight);
      running = running || isRunning;
    }
    this.animationStarted = running;
    if (!running) {
      if (this.disposeOnEnd) {
        index = this._scene._activeAnimatables.indexOf(this);
        this._scene._activeAnimatables.splice(index, 1);
        for (index = 0; index < runtimeAnimations.length; index++) {
          runtimeAnimations[index].dispose();
        }
      }
      this._raiseOnAnimationEnd();
      if (this.disposeOnEnd) {
        this.onAnimationEnd = null;
        this.onAnimationLoop = null;
        this.onAnimationLoopObservable.clear();
        this.onAnimationEndObservable.clear();
      }
    }
    return running;
  }
};
Scene.prototype._animate = function() {
  if (!this.animationsEnabled) {
    return;
  }
  const now = PrecisionDate.Now;
  if (!this._animationTimeLast) {
    if (this._pendingData.length > 0) {
      return;
    }
    this._animationTimeLast = now;
  }
  this.deltaTime = this.useConstantAnimationDeltaTime ? 16 : (now - this._animationTimeLast) * this.animationTimeScale;
  this._animationTimeLast = now;
  const animatables = this._activeAnimatables;
  if (animatables.length === 0) {
    return;
  }
  this._animationTime += this.deltaTime;
  const animationTime = this._animationTime;
  for (let index = 0; index < animatables.length; index++) {
    const animatable = animatables[index];
    if (!animatable._animate(animationTime) && animatable.disposeOnEnd) {
      index--;
    }
  }
  this._processLateAnimationBindings();
};
Scene.prototype.sortActiveAnimatables = function() {
  this._activeAnimatables.sort((a, b) => {
    return a.playOrder - b.playOrder;
  });
};
Scene.prototype.beginWeightedAnimation = function(target, from, to, weight = 1, loop, speedRatio = 1, onAnimationEnd, animatable, targetMask, onAnimationLoop, isAdditive = false) {
  const returnedAnimatable = this.beginAnimation(target, from, to, loop, speedRatio, onAnimationEnd, animatable, false, targetMask, onAnimationLoop, isAdditive);
  returnedAnimatable.weight = weight;
  return returnedAnimatable;
};
Scene.prototype.beginAnimation = function(target, from, to, loop, speedRatio = 1, onAnimationEnd, animatable, stopCurrent = true, targetMask, onAnimationLoop, isAdditive = false) {
  if (from > to && speedRatio > 0) {
    speedRatio *= -1;
  }
  if (stopCurrent) {
    this.stopAnimation(target, void 0, targetMask);
  }
  if (!animatable) {
    animatable = new Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd, void 0, onAnimationLoop, isAdditive);
  }
  const shouldRunTargetAnimations = targetMask ? targetMask(target) : true;
  if (target.animations && shouldRunTargetAnimations) {
    animatable.appendAnimations(target, target.animations);
  }
  if (target.getAnimatables) {
    const animatables = target.getAnimatables();
    for (let index = 0; index < animatables.length; index++) {
      this.beginAnimation(animatables[index], from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, onAnimationLoop);
    }
  }
  animatable.reset();
  return animatable;
};
Scene.prototype.beginHierarchyAnimation = function(target, directDescendantsOnly, from, to, loop, speedRatio = 1, onAnimationEnd, animatable, stopCurrent = true, targetMask, onAnimationLoop, isAdditive = false) {
  const children = target.getDescendants(directDescendantsOnly);
  const result = [];
  result.push(this.beginAnimation(target, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, void 0, isAdditive));
  for (const child of children) {
    result.push(this.beginAnimation(child, from, to, loop, speedRatio, onAnimationEnd, animatable, stopCurrent, targetMask, void 0, isAdditive));
  }
  return result;
};
Scene.prototype.beginDirectAnimation = function(target, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive = false) {
  if (speedRatio === void 0) {
    speedRatio = 1;
  }
  if (from > to && speedRatio > 0) {
    speedRatio *= -1;
  } else if (to > from && speedRatio < 0) {
    const temp = to;
    to = from;
    from = temp;
  }
  const animatable = new Animatable(this, target, from, to, loop, speedRatio, onAnimationEnd, animations, onAnimationLoop, isAdditive);
  return animatable;
};
Scene.prototype.beginDirectHierarchyAnimation = function(target, directDescendantsOnly, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive = false) {
  const children = target.getDescendants(directDescendantsOnly);
  const result = [];
  result.push(this.beginDirectAnimation(target, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive));
  for (const child of children) {
    result.push(this.beginDirectAnimation(child, animations, from, to, loop, speedRatio, onAnimationEnd, onAnimationLoop, isAdditive));
  }
  return result;
};
Scene.prototype.getAnimatableByTarget = function(target) {
  for (let index = 0; index < this._activeAnimatables.length; index++) {
    if (this._activeAnimatables[index].target === target) {
      return this._activeAnimatables[index];
    }
  }
  return null;
};
Scene.prototype.getAllAnimatablesByTarget = function(target) {
  const result = [];
  for (let index = 0; index < this._activeAnimatables.length; index++) {
    if (this._activeAnimatables[index].target === target) {
      result.push(this._activeAnimatables[index]);
    }
  }
  return result;
};
Scene.prototype.stopAnimation = function(target, animationName, targetMask) {
  const animatables = this.getAllAnimatablesByTarget(target);
  for (const animatable of animatables) {
    animatable.stop(animationName, targetMask);
  }
};
Scene.prototype.stopAllAnimations = function() {
  if (this._activeAnimatables) {
    for (let i = 0; i < this._activeAnimatables.length; i++) {
      this._activeAnimatables[i].stop(void 0, void 0, true);
    }
    this._activeAnimatables.length = 0;
  }
  for (const group of this.animationGroups) {
    group.stop();
  }
};
Scene.prototype._registerTargetForLateAnimationBinding = function(runtimeAnimation, originalValue) {
  const target = runtimeAnimation.target;
  this._registeredForLateAnimationBindings.pushNoDuplicate(target);
  if (!target._lateAnimationHolders) {
    target._lateAnimationHolders = {};
  }
  if (!target._lateAnimationHolders[runtimeAnimation.targetPath]) {
    target._lateAnimationHolders[runtimeAnimation.targetPath] = {
      totalWeight: 0,
      totalAdditiveWeight: 0,
      animations: [],
      additiveAnimations: [],
      originalValue
    };
  }
  if (runtimeAnimation.isAdditive) {
    target._lateAnimationHolders[runtimeAnimation.targetPath].additiveAnimations.push(runtimeAnimation);
    target._lateAnimationHolders[runtimeAnimation.targetPath].totalAdditiveWeight += runtimeAnimation.weight;
  } else {
    target._lateAnimationHolders[runtimeAnimation.targetPath].animations.push(runtimeAnimation);
    target._lateAnimationHolders[runtimeAnimation.targetPath].totalWeight += runtimeAnimation.weight;
  }
};
Scene.prototype._processLateAnimationBindingsForMatrices = function(holder) {
  if (holder.totalWeight === 0 && holder.totalAdditiveWeight === 0) {
    return holder.originalValue;
  }
  let normalizer = 1;
  const finalPosition = TmpVectors.Vector3[0];
  const finalScaling = TmpVectors.Vector3[1];
  const finalQuaternion = TmpVectors.Quaternion[0];
  let startIndex = 0;
  const originalAnimation = holder.animations[0];
  const originalValue = holder.originalValue;
  let scale = 1;
  let skipOverride = false;
  if (holder.totalWeight < 1) {
    scale = 1 - holder.totalWeight;
    originalValue.decompose(finalScaling, finalQuaternion, finalPosition);
  } else {
    startIndex = 1;
    normalizer = holder.totalWeight;
    scale = originalAnimation.weight / normalizer;
    if (scale == 1) {
      if (holder.totalAdditiveWeight) {
        skipOverride = true;
      } else {
        return originalAnimation.currentValue;
      }
    }
    originalAnimation.currentValue.decompose(finalScaling, finalQuaternion, finalPosition);
  }
  if (!skipOverride) {
    finalScaling.scaleInPlace(scale);
    finalPosition.scaleInPlace(scale);
    finalQuaternion.scaleInPlace(scale);
    for (let animIndex = startIndex; animIndex < holder.animations.length; animIndex++) {
      const runtimeAnimation = holder.animations[animIndex];
      if (runtimeAnimation.weight === 0) {
        continue;
      }
      scale = runtimeAnimation.weight / normalizer;
      const currentPosition = TmpVectors.Vector3[2];
      const currentScaling = TmpVectors.Vector3[3];
      const currentQuaternion = TmpVectors.Quaternion[1];
      runtimeAnimation.currentValue.decompose(currentScaling, currentQuaternion, currentPosition);
      currentScaling.scaleAndAddToRef(scale, finalScaling);
      currentQuaternion.scaleAndAddToRef(Quaternion.Dot(finalQuaternion, currentQuaternion) > 0 ? scale : -scale, finalQuaternion);
      currentPosition.scaleAndAddToRef(scale, finalPosition);
    }
    finalQuaternion.normalize();
  }
  for (let animIndex = 0; animIndex < holder.additiveAnimations.length; animIndex++) {
    const runtimeAnimation = holder.additiveAnimations[animIndex];
    if (runtimeAnimation.weight === 0) {
      continue;
    }
    const currentPosition = TmpVectors.Vector3[2];
    const currentScaling = TmpVectors.Vector3[3];
    const currentQuaternion = TmpVectors.Quaternion[1];
    runtimeAnimation.currentValue.decompose(currentScaling, currentQuaternion, currentPosition);
    currentScaling.multiplyToRef(finalScaling, currentScaling);
    Vector3.LerpToRef(finalScaling, currentScaling, runtimeAnimation.weight, finalScaling);
    finalQuaternion.multiplyToRef(currentQuaternion, currentQuaternion);
    Quaternion.SlerpToRef(finalQuaternion, currentQuaternion, runtimeAnimation.weight, finalQuaternion);
    currentPosition.scaleAndAddToRef(runtimeAnimation.weight, finalPosition);
  }
  const workValue = originalAnimation ? originalAnimation._animationState.workValue : TmpVectors.Matrix[0].clone();
  Matrix.ComposeToRef(finalScaling, finalQuaternion, finalPosition, workValue);
  return workValue;
};
Scene.prototype._processLateAnimationBindingsForQuaternions = function(holder, refQuaternion) {
  if (holder.totalWeight === 0 && holder.totalAdditiveWeight === 0) {
    return refQuaternion;
  }
  const originalAnimation = holder.animations[0];
  const originalValue = holder.originalValue;
  let cumulativeQuaternion = refQuaternion;
  if (holder.totalWeight === 0 && holder.totalAdditiveWeight > 0) {
    cumulativeQuaternion.copyFrom(originalValue);
  } else if (holder.animations.length === 1) {
    Quaternion.SlerpToRef(originalValue, originalAnimation.currentValue, Math.min(1, holder.totalWeight), cumulativeQuaternion);
    if (holder.totalAdditiveWeight === 0) {
      return cumulativeQuaternion;
    }
  } else if (holder.animations.length > 1) {
    let normalizer = 1;
    let quaternions;
    let weights;
    if (holder.totalWeight < 1) {
      const scale = 1 - holder.totalWeight;
      quaternions = [];
      weights = [];
      quaternions.push(originalValue);
      weights.push(scale);
    } else {
      if (holder.animations.length === 2) {
        Quaternion.SlerpToRef(holder.animations[0].currentValue, holder.animations[1].currentValue, holder.animations[1].weight / holder.totalWeight, refQuaternion);
        if (holder.totalAdditiveWeight === 0) {
          return refQuaternion;
        }
      }
      quaternions = [];
      weights = [];
      normalizer = holder.totalWeight;
    }
    for (let animIndex = 0; animIndex < holder.animations.length; animIndex++) {
      const runtimeAnimation = holder.animations[animIndex];
      quaternions.push(runtimeAnimation.currentValue);
      weights.push(runtimeAnimation.weight / normalizer);
    }
    let cumulativeAmount = 0;
    for (let index = 0; index < quaternions.length; ) {
      if (!index) {
        Quaternion.SlerpToRef(quaternions[index], quaternions[index + 1], weights[index + 1] / (weights[index] + weights[index + 1]), refQuaternion);
        cumulativeQuaternion = refQuaternion;
        cumulativeAmount = weights[index] + weights[index + 1];
        index += 2;
        continue;
      }
      cumulativeAmount += weights[index];
      Quaternion.SlerpToRef(cumulativeQuaternion, quaternions[index], weights[index] / cumulativeAmount, cumulativeQuaternion);
      index++;
    }
  }
  for (let animIndex = 0; animIndex < holder.additiveAnimations.length; animIndex++) {
    const runtimeAnimation = holder.additiveAnimations[animIndex];
    if (runtimeAnimation.weight === 0) {
      continue;
    }
    cumulativeQuaternion.multiplyToRef(runtimeAnimation.currentValue, TmpVectors.Quaternion[0]);
    Quaternion.SlerpToRef(cumulativeQuaternion, TmpVectors.Quaternion[0], runtimeAnimation.weight, cumulativeQuaternion);
  }
  return cumulativeQuaternion;
};
Scene.prototype._processLateAnimationBindings = function() {
  if (!this._registeredForLateAnimationBindings.length) {
    return;
  }
  for (let index = 0; index < this._registeredForLateAnimationBindings.length; index++) {
    const target = this._registeredForLateAnimationBindings.data[index];
    for (const path in target._lateAnimationHolders) {
      const holder = target._lateAnimationHolders[path];
      const originalAnimation = holder.animations[0];
      const originalValue = holder.originalValue;
      if (originalValue === void 0 || originalValue === null) {
        continue;
      }
      const matrixDecomposeMode = Animation.AllowMatrixDecomposeForInterpolation && originalValue.m;
      let finalValue = target[path];
      if (matrixDecomposeMode) {
        finalValue = this._processLateAnimationBindingsForMatrices(holder);
      } else {
        const quaternionMode = originalValue.w !== void 0;
        if (quaternionMode) {
          finalValue = this._processLateAnimationBindingsForQuaternions(holder, finalValue || Quaternion.Identity());
        } else {
          let startIndex = 0;
          let normalizer = 1;
          const originalAnimationIsLoopRelativeFromCurrent = originalAnimation && originalAnimation._animationState.loopMode === Animation.ANIMATIONLOOPMODE_RELATIVE_FROM_CURRENT;
          if (holder.totalWeight < 1) {
            if (originalAnimationIsLoopRelativeFromCurrent) {
              finalValue = originalValue.clone ? originalValue.clone() : originalValue;
            } else if (originalAnimation && originalValue.scale) {
              finalValue = originalValue.scale(1 - holder.totalWeight);
            } else if (originalAnimation) {
              finalValue = originalValue * (1 - holder.totalWeight);
            } else if (originalValue.clone) {
              finalValue = originalValue.clone();
            } else {
              finalValue = originalValue;
            }
          } else if (originalAnimation) {
            normalizer = holder.totalWeight;
            const scale = originalAnimation.weight / normalizer;
            if (scale !== 1) {
              if (originalAnimation.currentValue.scale) {
                finalValue = originalAnimation.currentValue.scale(scale);
              } else {
                finalValue = originalAnimation.currentValue * scale;
              }
            } else {
              finalValue = originalAnimation.currentValue;
            }
            if (originalAnimationIsLoopRelativeFromCurrent) {
              if (finalValue.addToRef) {
                finalValue.addToRef(originalValue, finalValue);
              } else {
                finalValue += originalValue;
              }
            }
            startIndex = 1;
          }
          for (let animIndex = startIndex; animIndex < holder.animations.length; animIndex++) {
            const runtimeAnimation = holder.animations[animIndex];
            const scale = runtimeAnimation.weight / normalizer;
            if (!scale) {
              continue;
            } else if (runtimeAnimation.currentValue.scaleAndAddToRef) {
              runtimeAnimation.currentValue.scaleAndAddToRef(scale, finalValue);
            } else {
              finalValue += runtimeAnimation.currentValue * scale;
            }
          }
          for (let animIndex = 0; animIndex < holder.additiveAnimations.length; animIndex++) {
            const runtimeAnimation = holder.additiveAnimations[animIndex];
            const scale = runtimeAnimation.weight;
            if (!scale) {
              continue;
            } else if (runtimeAnimation.currentValue.scaleAndAddToRef) {
              runtimeAnimation.currentValue.scaleAndAddToRef(scale, finalValue);
            } else {
              finalValue += runtimeAnimation.currentValue * scale;
            }
          }
        }
      }
      target[path] = finalValue;
    }
    target._lateAnimationHolders = {};
  }
  this._registeredForLateAnimationBindings.reset();
};
Bone.prototype.copyAnimationRange = function(source, rangeName, frameOffset, rescaleAsRequired = false, skelDimensionsRatio = null) {
  if (this.animations.length === 0) {
    this.animations.push(new Animation(this.name, "_matrix", source.animations[0].framePerSecond, Animation.ANIMATIONTYPE_MATRIX, 0));
    this.animations[0].setKeys([]);
  }
  const sourceRange = source.animations[0].getRange(rangeName);
  if (!sourceRange) {
    return false;
  }
  const from = sourceRange.from;
  const to = sourceRange.to;
  const sourceKeys = source.animations[0].getKeys();
  const sourceBoneLength = source.length;
  const sourceParent = source.getParent();
  const parent = this.getParent();
  const parentScalingReqd = rescaleAsRequired && sourceParent && sourceBoneLength && this.length && sourceBoneLength !== this.length;
  const parentRatio = parentScalingReqd && parent && sourceParent ? parent.length / sourceParent.length : 1;
  const dimensionsScalingReqd = rescaleAsRequired && !parent && skelDimensionsRatio && (skelDimensionsRatio.x !== 1 || skelDimensionsRatio.y !== 1 || skelDimensionsRatio.z !== 1);
  const destKeys = this.animations[0].getKeys();
  let orig;
  let origTranslation;
  let mat;
  for (let key = 0, nKeys = sourceKeys.length; key < nKeys; key++) {
    orig = sourceKeys[key];
    if (orig.frame >= from && orig.frame <= to) {
      if (rescaleAsRequired) {
        mat = orig.value.clone();
        if (parentScalingReqd) {
          origTranslation = mat.getTranslation();
          mat.setTranslation(origTranslation.scaleInPlace(parentRatio));
        } else if (dimensionsScalingReqd && skelDimensionsRatio) {
          origTranslation = mat.getTranslation();
          mat.setTranslation(origTranslation.multiplyInPlace(skelDimensionsRatio));
        } else {
          mat = orig.value;
        }
      } else {
        mat = orig.value;
      }
      destKeys.push({ frame: orig.frame + frameOffset, value: mat });
    }
  }
  this.animations[0].createRange(rangeName, from + frameOffset, to + frameOffset);
  return true;
};

// node_modules/@babylonjs/core/XR/webXRLayerWrapper.js
var WebXRLayerWrapper = class {
  /**
   * Check if fixed foveation is supported on this device
   */
  get isFixedFoveationSupported() {
    return this.layerType == "XRWebGLLayer" && typeof this.layer.fixedFoveation == "number";
  }
  /**
   * Get the fixed foveation currently set, as specified by the webxr specs
   * If this returns null, then fixed foveation is not supported
   */
  get fixedFoveation() {
    if (this.isFixedFoveationSupported) {
      return this.layer.fixedFoveation;
    }
    return null;
  }
  /**
   * Set the fixed foveation to the specified value, as specified by the webxr specs
   * This value will be normalized to be between 0 and 1, 1 being max foveation, 0 being no foveation
   */
  set fixedFoveation(value) {
    if (this.isFixedFoveationSupported) {
      const val = Math.max(0, Math.min(1, value || 0));
      this.layer.fixedFoveation = val;
    }
  }
  constructor(getWidth, getHeight, layer, layerType, createRenderTargetTextureProvider) {
    this.getWidth = getWidth;
    this.getHeight = getHeight;
    this.layer = layer;
    this.layerType = layerType;
    this.createRenderTargetTextureProvider = createRenderTargetTextureProvider;
  }
};

// node_modules/@babylonjs/core/XR/webXRRenderTargetTextureProvider.js
var WebXRLayerRenderTargetTextureProvider = class {
  constructor(_scene, layerWrapper) {
    this._scene = _scene;
    this.layerWrapper = layerWrapper;
    this._renderTargetTextures = new Array();
    this._engine = _scene.getEngine();
  }
  _createInternalTexture(textureSize, texture) {
    const internalTexture = new InternalTexture(this._engine, InternalTextureSource.Unknown, true);
    internalTexture.width = textureSize.width;
    internalTexture.height = textureSize.height;
    internalTexture._hardwareTexture = new WebGLHardwareTexture(texture, this._engine._gl);
    internalTexture.isReady = true;
    return internalTexture;
  }
  _createRenderTargetTexture(width, height, framebuffer, colorTexture, depthStencilTexture, multiview) {
    if (!this._engine) {
      throw new Error("Engine is disposed");
    }
    const textureSize = { width, height };
    const renderTargetTexture = multiview ? new MultiviewRenderTarget(this._scene, textureSize) : new RenderTargetTexture("XR renderTargetTexture", textureSize, this._scene);
    const renderTargetWrapper = renderTargetTexture.renderTarget;
    renderTargetWrapper._samples = renderTargetTexture.samples;
    if (framebuffer || !colorTexture) {
      renderTargetWrapper._framebuffer = framebuffer;
    }
    if (colorTexture) {
      if (multiview) {
        renderTargetWrapper._colorTextureArray = colorTexture;
      } else {
        const internalTexture = this._createInternalTexture(textureSize, colorTexture);
        renderTargetWrapper.setTexture(internalTexture, 0);
        renderTargetTexture._texture = internalTexture;
      }
    }
    if (depthStencilTexture) {
      if (multiview) {
        renderTargetWrapper._depthStencilTextureArray = depthStencilTexture;
      } else {
        renderTargetWrapper._depthStencilTexture = this._createInternalTexture(textureSize, depthStencilTexture);
      }
    }
    renderTargetTexture.disableRescaling();
    if (typeof XRWebGLBinding !== "undefined") {
      renderTargetTexture.skipInitialClear = true;
    }
    this._renderTargetTextures.push(renderTargetTexture);
    return renderTargetTexture;
  }
  _destroyRenderTargetTexture(renderTargetTexture) {
    this._renderTargetTextures.splice(this._renderTargetTextures.indexOf(renderTargetTexture), 1);
    renderTargetTexture.dispose();
  }
  getFramebufferDimensions() {
    return this._framebufferDimensions;
  }
  dispose() {
    this._renderTargetTextures.forEach((rtt) => rtt.dispose());
    this._renderTargetTextures.length = 0;
  }
};

// node_modules/@babylonjs/core/XR/webXRWebGLLayer.js
var WebXRWebGLLayerWrapper = class extends WebXRLayerWrapper {
  /**
   * @param layer is the layer to be wrapped.
   * @returns a new WebXRLayerWrapper wrapping the provided XRWebGLLayer.
   */
  constructor(layer) {
    super(() => layer.framebufferWidth, () => layer.framebufferHeight, layer, "XRWebGLLayer", (sessionManager) => new WebXRWebGLLayerRenderTargetTextureProvider(sessionManager.scene, this));
    this.layer = layer;
  }
};
var WebXRWebGLLayerRenderTargetTextureProvider = class extends WebXRLayerRenderTargetTextureProvider {
  constructor(scene, layerWrapper) {
    super(scene, layerWrapper);
    this.layerWrapper = layerWrapper;
    this._layer = layerWrapper.layer;
    this._framebufferDimensions = {
      framebufferWidth: this._layer.framebufferWidth,
      framebufferHeight: this._layer.framebufferHeight
    };
  }
  trySetViewportForView(viewport, view) {
    const xrViewport = this._layer.getViewport(view);
    if (!xrViewport) {
      return false;
    }
    const framebufferWidth = this._framebufferDimensions.framebufferWidth;
    const framebufferHeight = this._framebufferDimensions.framebufferHeight;
    viewport.x = xrViewport.x / framebufferWidth;
    viewport.y = xrViewport.y / framebufferHeight;
    viewport.width = xrViewport.width / framebufferWidth;
    viewport.height = xrViewport.height / framebufferHeight;
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRenderTargetTextureForEye(eye) {
    const layerWidth = this._layer.framebufferWidth;
    const layerHeight = this._layer.framebufferHeight;
    const framebuffer = this._layer.framebuffer;
    if (!this._rtt || layerWidth !== this._framebufferDimensions.framebufferWidth || layerHeight !== this._framebufferDimensions.framebufferHeight || framebuffer !== this._framebuffer) {
      this._rtt = this._createRenderTargetTexture(layerWidth, layerHeight, framebuffer);
      this._framebufferDimensions.framebufferWidth = layerWidth;
      this._framebufferDimensions.framebufferHeight = layerHeight;
      this._framebuffer = framebuffer;
    }
    return this._rtt;
  }
  getRenderTargetTextureForView(view) {
    return this.getRenderTargetTextureForEye(view.eye);
  }
};

// node_modules/@babylonjs/core/XR/webXRManagedOutputCanvas.js
var WebXRManagedOutputCanvasOptions = class _WebXRManagedOutputCanvasOptions {
  /**
   * Get the default values of the configuration object
   * @param engine defines the engine to use (can be null)
   * @returns default values of this configuration object
   */
  static GetDefaults(engine) {
    const defaults = new _WebXRManagedOutputCanvasOptions();
    defaults.canvasOptions = {
      antialias: true,
      depth: true,
      stencil: engine ? engine.isStencilEnable : true,
      alpha: true,
      framebufferScaleFactor: 1
    };
    defaults.newCanvasCssStyle = "position:absolute; bottom:0px;right:0px;z-index:10;width:90%;height:100%;background-color: #000000;";
    return defaults;
  }
};
var WebXRManagedOutputCanvas = class {
  /**
   * Initializes the canvas to be added/removed upon entering/exiting xr
   * @param _xrSessionManager The XR Session manager
   * @param _options optional configuration for this canvas output. defaults will be used if not provided
   */
  constructor(_xrSessionManager, _options = WebXRManagedOutputCanvasOptions.GetDefaults()) {
    this._options = _options;
    this._canvas = null;
    this._engine = null;
    this.xrLayer = null;
    this._xrLayerWrapper = null;
    this.onXRLayerInitObservable = new Observable();
    this._engine = _xrSessionManager.scene.getEngine();
    this._engine.onDisposeObservable.addOnce(() => {
      this._engine = null;
    });
    if (!_options.canvasElement) {
      const canvas = document.createElement("canvas");
      canvas.style.cssText = this._options.newCanvasCssStyle || "position:absolute; bottom:0px;right:0px;";
      this._setManagedOutputCanvas(canvas);
    } else {
      this._setManagedOutputCanvas(_options.canvasElement);
    }
    _xrSessionManager.onXRSessionInit.add(() => {
      this._addCanvas();
    });
    _xrSessionManager.onXRSessionEnded.add(() => {
      this._removeCanvas();
    });
  }
  /**
   * Disposes of the object
   */
  dispose() {
    this._removeCanvas();
    this._setManagedOutputCanvas(null);
  }
  /**
   * Initializes a XRWebGLLayer to be used as the session's baseLayer.
   * @param xrSession xr session
   * @returns a promise that will resolve once the XR Layer has been created
   */
  async initializeXRLayerAsync(xrSession) {
    const createLayer = () => {
      this.xrLayer = new XRWebGLLayer(xrSession, this.canvasContext, this._options.canvasOptions);
      this._xrLayerWrapper = new WebXRWebGLLayerWrapper(this.xrLayer);
      this.onXRLayerInitObservable.notifyObservers(this.xrLayer);
      return this.xrLayer;
    };
    if (!this.canvasContext.makeXRCompatible) {
      return Promise.resolve(createLayer());
    }
    return this.canvasContext.makeXRCompatible().then(
      // catch any error and continue. When using the emulator is throws this error for no apparent reason.
      () => {
      },
      () => {
        Tools.Warn("Error executing makeXRCompatible. This does not mean that the session will work incorrectly.");
      }
    ).then(() => {
      return createLayer();
    });
  }
  _addCanvas() {
    if (this._canvas && this._engine && this._canvas !== this._engine.getRenderingCanvas()) {
      document.body.appendChild(this._canvas);
    }
    if (this.xrLayer) {
      this._setCanvasSize(true);
    } else {
      this.onXRLayerInitObservable.addOnce(() => {
        this._setCanvasSize(true);
      });
    }
  }
  _removeCanvas() {
    if (this._canvas && this._engine && document.body.contains(this._canvas) && this._canvas !== this._engine.getRenderingCanvas()) {
      document.body.removeChild(this._canvas);
    }
    this._setCanvasSize(false);
  }
  _setCanvasSize(init = true, xrLayer = this._xrLayerWrapper) {
    if (!this._canvas || !this._engine) {
      return;
    }
    if (init) {
      if (xrLayer) {
        if (this._canvas !== this._engine.getRenderingCanvas()) {
          this._canvas.style.width = xrLayer.getWidth() + "px";
          this._canvas.style.height = xrLayer.getHeight() + "px";
        } else {
          this._engine.setSize(xrLayer.getWidth(), xrLayer.getHeight());
        }
      }
    } else {
      if (this._originalCanvasSize) {
        if (this._canvas !== this._engine.getRenderingCanvas()) {
          this._canvas.style.width = this._originalCanvasSize.width + "px";
          this._canvas.style.height = this._originalCanvasSize.height + "px";
        } else {
          this._engine.setSize(this._originalCanvasSize.width, this._originalCanvasSize.height);
        }
      }
    }
  }
  _setManagedOutputCanvas(canvas) {
    this._removeCanvas();
    if (!canvas) {
      this._canvas = null;
      this.canvasContext = null;
    } else {
      this._originalCanvasSize = {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight
      };
      this._canvas = canvas;
      this.canvasContext = this._canvas.getContext("webgl2");
      if (!this.canvasContext) {
        this.canvasContext = this._canvas.getContext("webgl");
      }
    }
  }
};

// node_modules/@babylonjs/core/XR/native/nativeXRRenderTarget.js
var NativeXRLayerWrapper = class extends WebXRLayerWrapper {
  constructor(layer) {
    super(() => layer.framebufferWidth, () => layer.framebufferHeight, layer, "XRWebGLLayer", (sessionManager) => new NativeXRLayerRenderTargetTextureProvider(sessionManager, this));
    this.layer = layer;
  }
};
var NativeXRLayerRenderTargetTextureProvider = class extends WebXRLayerRenderTargetTextureProvider {
  constructor(sessionManager, layerWrapper) {
    super(sessionManager.scene, layerWrapper);
    this.layerWrapper = layerWrapper;
    this._nativeRTTProvider = navigator.xr.getNativeRenderTargetProvider(sessionManager.session, this._createRenderTargetTexture.bind(this), this._destroyRenderTargetTexture.bind(this));
    this._nativeLayer = layerWrapper.layer;
  }
  trySetViewportForView(viewport) {
    viewport.x = 0;
    viewport.y = 0;
    viewport.width = 1;
    viewport.height = 1;
    return true;
  }
  getRenderTargetTextureForEye(eye) {
    return this._nativeRTTProvider.getRenderTargetForEye(eye);
  }
  getRenderTargetTextureForView(view) {
    return this._nativeRTTProvider.getRenderTargetForEye(view.eye);
  }
  getFramebufferDimensions() {
    return {
      framebufferWidth: this._nativeLayer.framebufferWidth,
      framebufferHeight: this._nativeLayer.framebufferHeight
    };
  }
};
var NativeXRRenderTarget = class {
  constructor(_xrSessionManager) {
    this._nativeRenderTarget = navigator.xr.getWebXRRenderTarget(_xrSessionManager.scene.getEngine());
  }
  async initializeXRLayerAsync(xrSession) {
    await this._nativeRenderTarget.initializeXRLayerAsync(xrSession);
    this.xrLayer = this._nativeRenderTarget.xrLayer;
    return this.xrLayer;
  }
  dispose() {
  }
};

// node_modules/@babylonjs/core/XR/webXRSessionManager.js
var WebXRSessionManager = class _WebXRSessionManager {
  /**
   * Constructs a WebXRSessionManager, this must be initialized within a user action before usage
   * @param scene The scene which the session should be created for
   */
  constructor(scene) {
    this.scene = scene;
    this.currentTimestamp = -1;
    this.defaultHeightCompensation = 1.7;
    this.onXRFrameObservable = new Observable();
    this.onXRReferenceSpaceChanged = new Observable();
    this.onXRSessionEnded = new Observable();
    this.onXRSessionInit = new Observable();
    this.inXRFrameLoop = false;
    this.inXRSession = false;
    this._engine = scene.getEngine();
    this._onEngineDisposedObserver = this._engine.onDisposeObservable.addOnce(() => {
      this._engine = null;
    });
    scene.onDisposeObservable.addOnce(() => {
      this.dispose();
    });
  }
  /**
   * The current reference space used in this session. This reference space can constantly change!
   * It is mainly used to offset the camera's position.
   */
  get referenceSpace() {
    return this._referenceSpace;
  }
  /**
   * Set a new reference space and triggers the observable
   */
  set referenceSpace(newReferenceSpace) {
    this._referenceSpace = newReferenceSpace;
    this.onXRReferenceSpaceChanged.notifyObservers(this._referenceSpace);
  }
  /**
   * The mode for the managed XR session
   */
  get sessionMode() {
    return this._sessionMode;
  }
  /**
   * Disposes of the session manager
   * This should be called explicitly by the dev, if required.
   */
  dispose() {
    var _a;
    if (this.inXRSession) {
      this.exitXRAsync();
    }
    this.onXRFrameObservable.clear();
    this.onXRSessionEnded.clear();
    this.onXRReferenceSpaceChanged.clear();
    this.onXRSessionInit.clear();
    (_a = this._engine) === null || _a === void 0 ? void 0 : _a.onDisposeObservable.remove(this._onEngineDisposedObserver);
    this._engine = null;
  }
  /**
   * Stops the xrSession and restores the render loop
   * @returns Promise which resolves after it exits XR
   */
  exitXRAsync() {
    if (this.session && this.inXRSession) {
      this.inXRSession = false;
      return this.session.end().catch(() => {
        Logger.Warn("Could not end XR session.");
      });
    }
    return Promise.resolve();
  }
  /**
   * Attempts to set the framebuffer-size-normalized viewport to be rendered this frame for this view.
   * In the event of a failure, the supplied viewport is not updated.
   * @param viewport the viewport to which the view will be rendered
   * @param view the view for which to set the viewport
   * @returns whether the operation was successful
   */
  trySetViewportForView(viewport, view) {
    var _a;
    return ((_a = this._baseLayerRTTProvider) === null || _a === void 0 ? void 0 : _a.trySetViewportForView(viewport, view)) || false;
  }
  /**
   * Gets the correct render target texture to be rendered this frame for this eye
   * @param eye the eye for which to get the render target
   * @returns the render target for the specified eye or null if not available
   */
  getRenderTargetTextureForEye(eye) {
    var _a;
    return ((_a = this._baseLayerRTTProvider) === null || _a === void 0 ? void 0 : _a.getRenderTargetTextureForEye(eye)) || null;
  }
  /**
   * Gets the correct render target texture to be rendered this frame for this view
   * @param view the view for which to get the render target
   * @returns the render target for the specified view or null if not available
   */
  getRenderTargetTextureForView(view) {
    var _a;
    return ((_a = this._baseLayerRTTProvider) === null || _a === void 0 ? void 0 : _a.getRenderTargetTextureForView(view)) || null;
  }
  /**
   * Creates a WebXRRenderTarget object for the XR session
   * @param options optional options to provide when creating a new render target
   * @returns a WebXR render target to which the session can render
   */
  getWebXRRenderTarget(options) {
    const engine = this.scene.getEngine();
    if (this._xrNavigator.xr.native) {
      return new NativeXRRenderTarget(this);
    } else {
      options = options || WebXRManagedOutputCanvasOptions.GetDefaults(engine);
      options.canvasElement = options.canvasElement || engine.getRenderingCanvas() || void 0;
      return new WebXRManagedOutputCanvas(this, options);
    }
  }
  /**
   * Initializes the manager
   * After initialization enterXR can be called to start an XR session
   * @returns Promise which resolves after it is initialized
   */
  initializeAsync() {
    this._xrNavigator = navigator;
    if (!this._xrNavigator.xr) {
      return Promise.reject("WebXR not available");
    }
    return Promise.resolve();
  }
  /**
   * Initializes an xr session
   * @param xrSessionMode mode to initialize
   * @param xrSessionInit defines optional and required values to pass to the session builder
   * @returns a promise which will resolve once the session has been initialized
   */
  initializeSessionAsync(xrSessionMode = "immersive-vr", xrSessionInit = {}) {
    return this._xrNavigator.xr.requestSession(xrSessionMode, xrSessionInit).then((session) => {
      this.session = session;
      this._sessionMode = xrSessionMode;
      this.onXRSessionInit.notifyObservers(session);
      this.inXRSession = true;
      this.session.addEventListener("end", () => {
        var _a;
        this.inXRSession = false;
        this.onXRSessionEnded.notifyObservers(null);
        if (this._engine) {
          this._engine.framebufferDimensionsObject = null;
          this._engine.restoreDefaultFramebuffer();
          this._engine.customAnimationFrameRequester = null;
          this._engine._renderLoop();
        }
        if (this.isNative) {
          (_a = this._baseLayerRTTProvider) === null || _a === void 0 ? void 0 : _a.dispose();
        }
        this._baseLayerRTTProvider = null;
        this._baseLayerWrapper = null;
      }, { once: true });
      return this.session;
    });
  }
  /**
   * Checks if a session would be supported for the creation options specified
   * @param sessionMode session mode to check if supported eg. immersive-vr
   * @returns A Promise that resolves to true if supported and false if not
   */
  isSessionSupportedAsync(sessionMode) {
    return _WebXRSessionManager.IsSessionSupportedAsync(sessionMode);
  }
  /**
   * Resets the reference space to the one started the session
   */
  resetReferenceSpace() {
    this.referenceSpace = this.baseReferenceSpace;
  }
  /**
   * Starts rendering to the xr layer
   */
  runXRRenderLoop() {
    var _a;
    if (!this.inXRSession || !this._engine) {
      return;
    }
    this._engine.customAnimationFrameRequester = {
      requestAnimationFrame: (callback) => this.session.requestAnimationFrame(callback),
      renderFunction: (timestamp, xrFrame) => {
        var _a2;
        if (!this.inXRSession || !this._engine) {
          return;
        }
        this.currentFrame = xrFrame;
        this.currentTimestamp = timestamp;
        if (xrFrame) {
          this.inXRFrameLoop = true;
          this._engine.framebufferDimensionsObject = ((_a2 = this._baseLayerRTTProvider) === null || _a2 === void 0 ? void 0 : _a2.getFramebufferDimensions()) || null;
          this.onXRFrameObservable.notifyObservers(xrFrame);
          this._engine._renderLoop();
          this._engine.framebufferDimensionsObject = null;
          this.inXRFrameLoop = false;
        }
      }
    };
    this._engine.framebufferDimensionsObject = ((_a = this._baseLayerRTTProvider) === null || _a === void 0 ? void 0 : _a.getFramebufferDimensions()) || null;
    if (typeof window !== "undefined" && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(this._engine._frameHandler);
    }
    this._engine._renderLoop();
  }
  /**
   * Sets the reference space on the xr session
   * @param referenceSpaceType space to set
   * @returns a promise that will resolve once the reference space has been set
   */
  setReferenceSpaceTypeAsync(referenceSpaceType = "local-floor") {
    return this.session.requestReferenceSpace(referenceSpaceType).then((referenceSpace) => {
      return referenceSpace;
    }, (rejectionReason) => {
      Logger.Error("XR.requestReferenceSpace failed for the following reason: ");
      Logger.Error(rejectionReason);
      Logger.Log('Defaulting to universally-supported "viewer" reference space type.');
      return this.session.requestReferenceSpace("viewer").then((referenceSpace) => {
        const heightCompensation = new XRRigidTransform({ x: 0, y: -this.defaultHeightCompensation, z: 0 });
        return referenceSpace.getOffsetReferenceSpace(heightCompensation);
      }, (rejectionReason2) => {
        Logger.Error(rejectionReason2);
        throw 'XR initialization failed: required "viewer" reference space type not supported.';
      });
    }).then((referenceSpace) => {
      return this.session.requestReferenceSpace("viewer").then((viewerReferenceSpace) => {
        this.viewerReferenceSpace = viewerReferenceSpace;
        return referenceSpace;
      });
    }).then((referenceSpace) => {
      this.referenceSpace = this.baseReferenceSpace = referenceSpace;
      return this.referenceSpace;
    });
  }
  /**
   * Updates the render state of the session.
   * Note that this is deprecated in favor of WebXRSessionManager.updateRenderState().
   * @param state state to set
   * @returns a promise that resolves once the render state has been updated
   * @deprecated
   */
  updateRenderStateAsync(state) {
    return Promise.resolve(this.session.updateRenderState(state));
  }
  /**
   * @internal
   */
  _setBaseLayerWrapper(baseLayerWrapper) {
    var _a, _b;
    if (this.isNative) {
      (_a = this._baseLayerRTTProvider) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    this._baseLayerWrapper = baseLayerWrapper;
    this._baseLayerRTTProvider = ((_b = this._baseLayerWrapper) === null || _b === void 0 ? void 0 : _b.createRenderTargetTextureProvider(this)) || null;
  }
  /**
   * @internal
   */
  _getBaseLayerWrapper() {
    return this._baseLayerWrapper;
  }
  /**
   * Updates the render state of the session
   * @param state state to set
   */
  updateRenderState(state) {
    if (state.baseLayer) {
      this._setBaseLayerWrapper(this.isNative ? new NativeXRLayerWrapper(state.baseLayer) : new WebXRWebGLLayerWrapper(state.baseLayer));
    }
    this.session.updateRenderState(state);
  }
  /**
   * Returns a promise that resolves with a boolean indicating if the provided session mode is supported by this browser
   * @param sessionMode defines the session to test
   * @returns a promise with boolean as final value
   */
  static IsSessionSupportedAsync(sessionMode) {
    if (!navigator.xr) {
      return Promise.resolve(false);
    }
    const functionToUse = navigator.xr.isSessionSupported || navigator.xr.supportsSession;
    if (!functionToUse) {
      return Promise.resolve(false);
    } else {
      return functionToUse.call(navigator.xr, sessionMode).then((result) => {
        const returnValue = typeof result === "undefined" ? true : result;
        return Promise.resolve(returnValue);
      }).catch((e) => {
        Logger.Warn(e);
        return Promise.resolve(false);
      });
    }
  }
  /**
   * Returns true if Babylon.js is using the BabylonNative backend, otherwise false
   */
  get isNative() {
    var _a;
    return (_a = this._xrNavigator.xr.native) !== null && _a !== void 0 ? _a : false;
  }
  /**
   * The current frame rate as reported by the device
   */
  get currentFrameRate() {
    var _a;
    return (_a = this.session) === null || _a === void 0 ? void 0 : _a.frameRate;
  }
  /**
   * A list of supported frame rates (only available in-session!
   */
  get supportedFrameRates() {
    var _a;
    return (_a = this.session) === null || _a === void 0 ? void 0 : _a.supportedFrameRates;
  }
  /**
   * Set the framerate of the session.
   * @param rate the new framerate. This value needs to be in the supportedFrameRates array
   * @returns a promise that resolves once the framerate has been set
   */
  updateTargetFrameRate(rate) {
    return this.session.updateTargetFrameRate(rate);
  }
  /**
   * Run a callback in the xr render loop
   * @param callback the callback to call when in XR Frame
   * @param ignoreIfNotInSession if no session is currently running, run it first thing on the next session
   */
  runInXRFrame(callback, ignoreIfNotInSession = true) {
    if (this.inXRFrameLoop) {
      callback();
    } else if (this.inXRSession || !ignoreIfNotInSession) {
      this.onXRFrameObservable.addOnce(callback);
    }
  }
  /**
   * Check if fixed foveation is supported on this device
   */
  get isFixedFoveationSupported() {
    var _a;
    return ((_a = this._baseLayerWrapper) === null || _a === void 0 ? void 0 : _a.isFixedFoveationSupported) || false;
  }
  /**
   * Get the fixed foveation currently set, as specified by the webxr specs
   * If this returns null, then fixed foveation is not supported
   */
  get fixedFoveation() {
    var _a;
    return ((_a = this._baseLayerWrapper) === null || _a === void 0 ? void 0 : _a.fixedFoveation) || null;
  }
  /**
   * Set the fixed foveation to the specified value, as specified by the webxr specs
   * This value will be normalized to be between 0 and 1, 1 being max foveation, 0 being no foveation
   */
  set fixedFoveation(value) {
    const val = Math.max(0, Math.min(1, value || 0));
    if (this._baseLayerWrapper) {
      this._baseLayerWrapper.fixedFoveation = val;
    }
  }
  /**
   * Get the features enabled on the current session
   * This is only available in-session!
   * @see https://www.w3.org/TR/webxr/#dom-xrsession-enabledfeatures
   */
  get enabledFeatures() {
    var _a, _b;
    return (_b = (_a = this.session) === null || _a === void 0 ? void 0 : _a.enabledFeatures) !== null && _b !== void 0 ? _b : null;
  }
};

// node_modules/@babylonjs/core/XR/webXRTypes.js
var WebXRState;
(function(WebXRState2) {
  WebXRState2[WebXRState2["ENTERING_XR"] = 0] = "ENTERING_XR";
  WebXRState2[WebXRState2["EXITING_XR"] = 1] = "EXITING_XR";
  WebXRState2[WebXRState2["IN_XR"] = 2] = "IN_XR";
  WebXRState2[WebXRState2["NOT_IN_XR"] = 3] = "NOT_IN_XR";
})(WebXRState || (WebXRState = {}));
var WebXRTrackingState;
(function(WebXRTrackingState2) {
  WebXRTrackingState2[WebXRTrackingState2["NOT_TRACKING"] = 0] = "NOT_TRACKING";
  WebXRTrackingState2[WebXRTrackingState2["TRACKING_LOST"] = 1] = "TRACKING_LOST";
  WebXRTrackingState2[WebXRTrackingState2["TRACKING"] = 2] = "TRACKING";
})(WebXRTrackingState || (WebXRTrackingState = {}));

// node_modules/@babylonjs/core/Cameras/VR/vrExperienceHelper.js
var VRExperienceHelperGazer = class _VRExperienceHelperGazer {
  constructor(scene, gazeTrackerToClone = null) {
    this.scene = scene;
    this._pointerDownOnMeshAsked = false;
    this._isActionableMesh = false;
    this._teleportationRequestInitiated = false;
    this._teleportationBackRequestInitiated = false;
    this._rotationRightAsked = false;
    this._rotationLeftAsked = false;
    this._dpadPressed = true;
    this._activePointer = false;
    this._id = _VRExperienceHelperGazer._IdCounter++;
    if (!gazeTrackerToClone) {
      this._gazeTracker = CreateTorus("gazeTracker", {
        diameter: 35e-4,
        thickness: 25e-4,
        tessellation: 20,
        updatable: false
      }, scene);
      this._gazeTracker.bakeCurrentTransformIntoVertices();
      this._gazeTracker.isPickable = false;
      this._gazeTracker.isVisible = false;
      const targetMat = new StandardMaterial("targetMat", scene);
      targetMat.specularColor = Color3.Black();
      targetMat.emissiveColor = new Color3(0.7, 0.7, 0.7);
      targetMat.backFaceCulling = false;
      this._gazeTracker.material = targetMat;
    } else {
      this._gazeTracker = gazeTrackerToClone.clone("gazeTracker");
    }
  }
  /**
   * @internal
   */
  _getForwardRay(length) {
    return new Ray(Vector3.Zero(), new Vector3(0, 0, length));
  }
  /** @internal */
  _selectionPointerDown() {
    this._pointerDownOnMeshAsked = true;
    if (this._currentHit) {
      this.scene.simulatePointerDown(this._currentHit, { pointerId: this._id });
    }
  }
  /** @internal */
  _selectionPointerUp() {
    if (this._currentHit) {
      this.scene.simulatePointerUp(this._currentHit, { pointerId: this._id });
    }
    this._pointerDownOnMeshAsked = false;
  }
  /** @internal */
  _activatePointer() {
    this._activePointer = true;
  }
  /** @internal */
  _deactivatePointer() {
    this._activePointer = false;
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updatePointerDistance(distance = 100) {
  }
  dispose() {
    this._interactionsEnabled = false;
    this._teleportationEnabled = false;
    if (this._gazeTracker) {
      this._gazeTracker.dispose();
    }
  }
};
VRExperienceHelperGazer._IdCounter = 0;
var VRExperienceHelperCameraGazer = class extends VRExperienceHelperGazer {
  constructor(_getCamera, scene) {
    super(scene);
    this._getCamera = _getCamera;
  }
  _getForwardRay(length) {
    const camera = this._getCamera();
    if (camera) {
      return camera.getForwardRay(length);
    } else {
      return new Ray(Vector3.Zero(), Vector3.Forward());
    }
  }
};
var OnAfterEnteringVRObservableEvent = class {
};
var VRExperienceHelper = class _VRExperienceHelper {
  /** Return this.onEnteringVRObservable
   * Note: This one is for backward compatibility. Please use onEnteringVRObservable directly
   */
  get onEnteringVR() {
    return this.onEnteringVRObservable;
  }
  /** Return this.onExitingVRObservable
   * Note: This one is for backward compatibility. Please use onExitingVRObservable directly
   */
  get onExitingVR() {
    return this.onExitingVRObservable;
  }
  /**
   * The mesh used to display where the user is going to teleport.
   */
  get teleportationTarget() {
    return this._teleportationTarget;
  }
  /**
   * Sets the mesh to be used to display where the user is going to teleport.
   */
  set teleportationTarget(value) {
    if (value) {
      value.name = "teleportationTarget";
      this._isDefaultTeleportationTarget = false;
      this._teleportationTarget = value;
    }
  }
  /**
   * The mesh used to display where the user is selecting, this mesh will be cloned and set as the gazeTracker for the left and right controller
   * when set bakeCurrentTransformIntoVertices will be called on the mesh.
   * See https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/bakingTransforms
   */
  get gazeTrackerMesh() {
    return this._cameraGazer._gazeTracker;
  }
  set gazeTrackerMesh(value) {
    if (value) {
      if (this._cameraGazer._gazeTracker) {
        this._cameraGazer._gazeTracker.dispose();
      }
      this._cameraGazer._gazeTracker = value;
      this._cameraGazer._gazeTracker.bakeCurrentTransformIntoVertices();
      this._cameraGazer._gazeTracker.isPickable = false;
      this._cameraGazer._gazeTracker.isVisible = false;
      this._cameraGazer._gazeTracker.name = "gazeTracker";
    }
  }
  /**
   * If the ray of the gaze should be displayed.
   */
  get displayGaze() {
    return this._displayGaze;
  }
  /**
   * Sets if the ray of the gaze should be displayed.
   */
  set displayGaze(value) {
    this._displayGaze = value;
    if (!value) {
      this._cameraGazer._gazeTracker.isVisible = false;
    }
  }
  /**
   * If the ray of the LaserPointer should be displayed.
   */
  get displayLaserPointer() {
    return this._displayLaserPointer;
  }
  /**
   * Sets if the ray of the LaserPointer should be displayed.
   */
  set displayLaserPointer(value) {
    this._displayLaserPointer = value;
  }
  /**
   * The deviceOrientationCamera used as the camera when not in VR.
   */
  get deviceOrientationCamera() {
    return this._deviceOrientationCamera;
  }
  /**
   * Based on the current WebVR support, returns the current VR camera used.
   */
  get currentVRCamera() {
    return this._scene.activeCamera;
  }
  /**
   * The deviceOrientationCamera that is used as a fallback when vr device is not connected.
   */
  get vrDeviceOrientationCamera() {
    return this._vrDeviceOrientationCamera;
  }
  /**
   * The html button that is used to trigger entering into VR.
   */
  get vrButton() {
    return this._btnVR;
  }
  get _teleportationRequestInitiated() {
    return this._cameraGazer._teleportationRequestInitiated;
  }
  /**
   * Instantiates a VRExperienceHelper.
   * Helps to quickly add VR support to an existing scene.
   * @param scene The scene the VRExperienceHelper belongs to.
   * @param webVROptions Options to modify the vr experience helper's behavior.
   */
  constructor(scene, webVROptions = {}) {
    this.webVROptions = webVROptions;
    this._fullscreenVRpresenting = false;
    this.enableGazeEvenWhenNoPointerLock = false;
    this.exitVROnDoubleTap = true;
    this.onEnteringVRObservable = new Observable();
    this.onAfterEnteringVRObservable = new Observable();
    this.onExitingVRObservable = new Observable();
    this._useCustomVRButton = false;
    this._teleportActive = false;
    this._floorMeshesCollection = [];
    this._teleportationMode = _VRExperienceHelper.TELEPORTATIONMODE_CONSTANTTIME;
    this._teleportationTime = 122;
    this._teleportationSpeed = 20;
    this._rotationAllowed = true;
    this._teleportBackwardsVector = new Vector3(0, -1, -1);
    this._isDefaultTeleportationTarget = true;
    this._teleportationFillColor = "#444444";
    this._teleportationBorderColor = "#FFFFFF";
    this._rotationAngle = 0;
    this._haloCenter = new Vector3(0, 0, 0);
    this._padSensibilityUp = 0.65;
    this._padSensibilityDown = 0.35;
    this._pickedLaserColor = new Color3(0.2, 0.2, 1);
    this._pickedGazeColor = new Color3(0, 0, 1);
    this.onNewMeshSelected = new Observable();
    this.onNewMeshPicked = new Observable();
    this.onBeforeCameraTeleport = new Observable();
    this.onAfterCameraTeleport = new Observable();
    this.onSelectedMeshUnselected = new Observable();
    this.teleportationEnabled = true;
    this._teleportationInitialized = false;
    this._interactionsEnabled = false;
    this._displayGaze = true;
    this._displayLaserPointer = true;
    this.updateGazeTrackerScale = true;
    this.updateGazeTrackerColor = true;
    this.updateControllerLaserColor = true;
    this.requestPointerLockOnFullScreen = true;
    this.xrTestDone = false;
    this._onResize = () => {
      this._moveButtonToBottomRight();
    };
    this._onFullscreenChange = () => {
      this._fullscreenVRpresenting = !!document.fullscreenElement;
      if (!this._fullscreenVRpresenting && this._inputElement) {
        this.exitVR();
        if (!this._useCustomVRButton && this._btnVR) {
          this._btnVR.style.top = this._inputElement.offsetTop + this._inputElement.offsetHeight - 70 + "px";
          this._btnVR.style.left = this._inputElement.offsetLeft + this._inputElement.offsetWidth - 100 + "px";
          this._updateButtonVisibility();
        }
      }
    };
    this._cachedAngularSensibility = { angularSensibilityX: null, angularSensibilityY: null, angularSensibility: null };
    this._beforeRender = () => {
      if (this._scene.getEngine().isPointerLock || this.enableGazeEvenWhenNoPointerLock) {
      } else {
        this._cameraGazer._gazeTracker.isVisible = false;
      }
    };
    this._onNewGamepadConnected = (gamepad) => {
      if (gamepad.type !== Gamepad.POSE_ENABLED) {
        if (gamepad.leftStick) {
          gamepad.onleftstickchanged((stickValues) => {
            if (this._teleportationInitialized && this.teleportationEnabled) {
              this._checkTeleportWithRay(stickValues, this._cameraGazer);
              this._checkTeleportBackwards(stickValues, this._cameraGazer);
            }
          });
        }
        if (gamepad.rightStick) {
          gamepad.onrightstickchanged((stickValues) => {
            if (this._teleportationInitialized) {
              this._checkRotate(stickValues, this._cameraGazer);
            }
          });
        }
        if (gamepad.type === Gamepad.XBOX) {
          gamepad.onbuttondown((buttonPressed) => {
            if (this._interactionsEnabled && buttonPressed === Xbox360Button.A) {
              this._cameraGazer._selectionPointerDown();
            }
          });
          gamepad.onbuttonup((buttonPressed) => {
            if (this._interactionsEnabled && buttonPressed === Xbox360Button.A) {
              this._cameraGazer._selectionPointerUp();
            }
          });
        }
      }
    };
    this._workingVector = Vector3.Zero();
    this._workingQuaternion = Quaternion.Identity();
    this._workingMatrix = Matrix.Identity();
    Logger.Warn("WebVR is deprecated. Please avoid using this experience helper and use the WebXR experience helper instead");
    this._scene = scene;
    this._inputElement = scene.getEngine().getInputElement();
    const vrSupported = "getVRDisplays" in navigator;
    if (!vrSupported && webVROptions.useXR === void 0) {
      webVROptions.useXR = true;
    }
    if (webVROptions.createFallbackVRDeviceOrientationFreeCamera === void 0) {
      webVROptions.createFallbackVRDeviceOrientationFreeCamera = true;
    }
    if (webVROptions.createDeviceOrientationCamera === void 0) {
      webVROptions.createDeviceOrientationCamera = true;
    }
    if (webVROptions.laserToggle === void 0) {
      webVROptions.laserToggle = true;
    }
    this._hasEnteredVR = false;
    if (this._scene.activeCamera) {
      this._position = this._scene.activeCamera.position.clone();
    } else {
      this._position = new Vector3(0, this._defaultHeight, 0);
    }
    if (webVROptions.createDeviceOrientationCamera || !this._scene.activeCamera) {
      this._deviceOrientationCamera = new DeviceOrientationCamera("deviceOrientationVRHelper", this._position.clone(), scene);
      if (this._scene.activeCamera) {
        this._deviceOrientationCamera.minZ = this._scene.activeCamera.minZ;
        this._deviceOrientationCamera.maxZ = this._scene.activeCamera.maxZ;
        if (this._scene.activeCamera instanceof TargetCamera && this._scene.activeCamera.rotation) {
          const targetCamera = this._scene.activeCamera;
          if (targetCamera.rotationQuaternion) {
            this._deviceOrientationCamera.rotationQuaternion.copyFrom(targetCamera.rotationQuaternion);
          } else {
            this._deviceOrientationCamera.rotationQuaternion.copyFrom(Quaternion.RotationYawPitchRoll(targetCamera.rotation.y, targetCamera.rotation.x, targetCamera.rotation.z));
          }
          this._deviceOrientationCamera.rotation = targetCamera.rotation.clone();
        }
      }
      this._scene.activeCamera = this._deviceOrientationCamera;
      if (this._inputElement) {
        this._scene.activeCamera.attachControl();
      }
    } else {
      this._existingCamera = this._scene.activeCamera;
    }
    if (this.webVROptions.useXR && navigator.xr) {
      WebXRSessionManager.IsSessionSupportedAsync("immersive-vr").then((supported) => {
        if (supported) {
          Logger.Log("Using WebXR. It is recommended to use the WebXRDefaultExperience directly");
          scene.createDefaultXRExperienceAsync({
            floorMeshes: webVROptions.floorMeshes || []
          }).then((xr) => {
            this.xr = xr;
            this.xrTestDone = true;
            this._cameraGazer = new VRExperienceHelperCameraGazer(() => {
              return this.xr.baseExperience.camera;
            }, scene);
            this.xr.baseExperience.onStateChangedObservable.add((state) => {
              switch (state) {
                case WebXRState.ENTERING_XR:
                  this.onEnteringVRObservable.notifyObservers(this);
                  if (!this._interactionsEnabled) {
                    this.xr.pointerSelection.detach();
                  }
                  this.xr.pointerSelection.displayLaserPointer = this._displayLaserPointer;
                  break;
                case WebXRState.EXITING_XR:
                  this.onExitingVRObservable.notifyObservers(this);
                  this._scene.getEngine().resize();
                  break;
                case WebXRState.IN_XR:
                  this._hasEnteredVR = true;
                  break;
                case WebXRState.NOT_IN_XR:
                  this._hasEnteredVR = false;
                  break;
              }
            });
          });
        } else {
          this._completeVRInit(scene, webVROptions);
        }
      });
    } else {
      this._completeVRInit(scene, webVROptions);
    }
  }
  _completeVRInit(scene, webVROptions) {
    this.xrTestDone = true;
    if (webVROptions.createFallbackVRDeviceOrientationFreeCamera) {
      this._vrDeviceOrientationCamera = new VRDeviceOrientationFreeCamera("VRDeviceOrientationVRHelper", this._position, this._scene, true, webVROptions.vrDeviceOrientationCameraMetrics);
      this._vrDeviceOrientationCamera.angularSensibility = Number.MAX_VALUE;
    }
    this._cameraGazer = new VRExperienceHelperCameraGazer(() => {
      return this.currentVRCamera;
    }, scene);
    if (!this._useCustomVRButton) {
      this._btnVR = document.createElement("BUTTON");
      this._btnVR.className = "babylonVRicon";
      this._btnVR.id = "babylonVRiconbtn";
      this._btnVR.title = "Click to switch to VR";
      const url = !window.SVGSVGElement ? "https://cdn.babylonjs.com/Assets/vrButton.png" : "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%222048%22%20height%3D%221152%22%20viewBox%3D%220%200%202048%201152%22%20version%3D%221.1%22%3E%3Cpath%20transform%3D%22rotate%28180%201024%2C576.0000000000001%29%22%20d%3D%22m1109%2C896q17%2C0%2030%2C-12t13%2C-30t-12.5%2C-30.5t-30.5%2C-12.5l-170%2C0q-18%2C0%20-30.5%2C12.5t-12.5%2C30.5t13%2C30t30%2C12l170%2C0zm-85%2C256q59%2C0%20132.5%2C-1.5t154.5%2C-5.5t164.5%2C-11.5t163%2C-20t150%2C-30t124.5%2C-41.5q23%2C-11%2042%2C-24t38%2C-30q27%2C-25%2041%2C-61.5t14%2C-72.5l0%2C-257q0%2C-123%20-47%2C-232t-128%2C-190t-190%2C-128t-232%2C-47l-81%2C0q-37%2C0%20-68.5%2C14t-60.5%2C34.5t-55.5%2C45t-53%2C45t-53%2C34.5t-55.5%2C14t-55.5%2C-14t-53%2C-34.5t-53%2C-45t-55.5%2C-45t-60.5%2C-34.5t-68.5%2C-14l-81%2C0q-123%2C0%20-232%2C47t-190%2C128t-128%2C190t-47%2C232l0%2C257q0%2C68%2038%2C115t97%2C73q54%2C24%20124.5%2C41.5t150%2C30t163%2C20t164.5%2C11.5t154.5%2C5.5t132.5%2C1.5zm939%2C-298q0%2C39%20-24.5%2C67t-58.5%2C42q-54%2C23%20-122%2C39.5t-143.5%2C28t-155.5%2C19t-157%2C11t-148.5%2C5t-129.5%2C1.5q-59%2C0%20-130%2C-1.5t-148%2C-5t-157%2C-11t-155.5%2C-19t-143.5%2C-28t-122%2C-39.5q-34%2C-14%20-58.5%2C-42t-24.5%2C-67l0%2C-257q0%2C-106%2040.5%2C-199t110%2C-162.5t162.5%2C-109.5t199%2C-40l81%2C0q27%2C0%2052%2C14t50%2C34.5t51%2C44.5t55.5%2C44.5t63.5%2C34.5t74%2C14t74%2C-14t63.5%2C-34.5t55.5%2C-44.5t51%2C-44.5t50%2C-34.5t52%2C-14l14%2C0q37%2C0%2070%2C0.5t64.5%2C4.5t63.5%2C12t68%2C23q71%2C30%20128.5%2C78.5t98.5%2C110t63.5%2C133.5t22.5%2C149l0%2C257z%22%20fill%3D%22white%22%20/%3E%3C/svg%3E%0A";
      let css = ".babylonVRicon { position: absolute; right: 20px; height: 50px; width: 80px; background-color: rgba(51,51,51,0.7); background-image: url(" + url + "); background-size: 80%; background-repeat:no-repeat; background-position: center; border: none; outline: none; transition: transform 0.125s ease-out } .babylonVRicon:hover { transform: scale(1.05) } .babylonVRicon:active {background-color: rgba(51,51,51,1) } .babylonVRicon:focus {background-color: rgba(51,51,51,1) }";
      css += ".babylonVRicon.vrdisplaypresenting { display: none; }";
      const style = document.createElement("style");
      style.appendChild(document.createTextNode(css));
      document.getElementsByTagName("head")[0].appendChild(style);
      this._moveButtonToBottomRight();
    }
    if (this._btnVR) {
      this._btnVR.addEventListener("click", () => {
        if (!this.isInVRMode) {
          this.enterVR();
        }
      });
    }
    const hostWindow = this._scene.getEngine().getHostWindow();
    if (!hostWindow) {
      return;
    }
    hostWindow.addEventListener("resize", this._onResize);
    document.addEventListener("fullscreenchange", this._onFullscreenChange, false);
    if (webVROptions.createFallbackVRDeviceOrientationFreeCamera) {
      this._displayVRButton();
    }
    this._onKeyDown = (event) => {
      if (event.keyCode === 27 && this.isInVRMode) {
        this.exitVR();
      }
    };
    document.addEventListener("keydown", this._onKeyDown);
    this._scene.onPrePointerObservable.add(() => {
      if (this._hasEnteredVR && this.exitVROnDoubleTap) {
        this.exitVR();
        if (this._fullscreenVRpresenting) {
          this._scene.getEngine().exitFullscreen();
        }
      }
    }, PointerEventTypes.POINTERDOUBLETAP, false);
    scene.onDisposeObservable.add(() => {
      this.dispose();
    });
    this._updateButtonVisibility();
    this._circleEase = new CircleEase();
    this._circleEase.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    this._teleportationEasing = this._circleEase;
    scene.onPointerObservable.add((e) => {
      if (this._interactionsEnabled) {
        if (scene.activeCamera === this.vrDeviceOrientationCamera && e.event.pointerType === "mouse") {
          if (e.type === PointerEventTypes.POINTERDOWN) {
            this._cameraGazer._selectionPointerDown();
          } else if (e.type === PointerEventTypes.POINTERUP) {
            this._cameraGazer._selectionPointerUp();
          }
        }
      }
    });
    if (this.webVROptions.floorMeshes) {
      this.enableTeleportation({ floorMeshes: this.webVROptions.floorMeshes });
    }
  }
  /**
   * Gets a value indicating if we are currently in VR mode.
   */
  get isInVRMode() {
    return this.xr && this.webVROptions.useXR && this.xr.baseExperience.state === WebXRState.IN_XR || this._fullscreenVRpresenting;
  }
  _moveButtonToBottomRight() {
    if (this._inputElement && !this._useCustomVRButton && this._btnVR) {
      const rect = this._inputElement.getBoundingClientRect();
      this._btnVR.style.top = rect.top + rect.height - 70 + "px";
      this._btnVR.style.left = rect.left + rect.width - 100 + "px";
    }
  }
  _displayVRButton() {
    if (!this._useCustomVRButton && !this._btnVRDisplayed && this._btnVR) {
      document.body.appendChild(this._btnVR);
      this._btnVRDisplayed = true;
    }
  }
  _updateButtonVisibility() {
    if (!this._btnVR || this._useCustomVRButton) {
      return;
    }
    this._btnVR.className = "babylonVRicon";
    if (this.isInVRMode) {
      this._btnVR.className += " vrdisplaypresenting";
    }
  }
  /**
   * Attempt to enter VR. If a headset is connected and ready, will request present on that.
   * Otherwise, will use the fullscreen API.
   */
  enterVR() {
    if (this.xr) {
      this.xr.baseExperience.enterXRAsync("immersive-vr", "local-floor", this.xr.renderTarget);
      return;
    }
    if (this.onEnteringVRObservable) {
      try {
        this.onEnteringVRObservable.notifyObservers(this);
      } catch (err) {
        Logger.Warn("Error in your custom logic onEnteringVR: " + err);
      }
    }
    if (this._scene.activeCamera) {
      this._position = this._scene.activeCamera.position.clone();
      if (this.vrDeviceOrientationCamera) {
        this.vrDeviceOrientationCamera.rotation = Quaternion.FromRotationMatrix(this._scene.activeCamera.getWorldMatrix().getRotationMatrix()).toEulerAngles();
        this.vrDeviceOrientationCamera.angularSensibility = 2e3;
      }
      this._existingCamera = this._scene.activeCamera;
      if (this._existingCamera.angularSensibilityX) {
        this._cachedAngularSensibility.angularSensibilityX = this._existingCamera.angularSensibilityX;
        this._existingCamera.angularSensibilityX = Number.MAX_VALUE;
      }
      if (this._existingCamera.angularSensibilityY) {
        this._cachedAngularSensibility.angularSensibilityY = this._existingCamera.angularSensibilityY;
        this._existingCamera.angularSensibilityY = Number.MAX_VALUE;
      }
      if (this._existingCamera.angularSensibility) {
        this._cachedAngularSensibility.angularSensibility = this._existingCamera.angularSensibility;
        this._existingCamera.angularSensibility = Number.MAX_VALUE;
      }
    }
    if (this._vrDeviceOrientationCamera) {
      this._vrDeviceOrientationCamera.position = this._position;
      if (this._scene.activeCamera) {
        this._vrDeviceOrientationCamera.minZ = this._scene.activeCamera.minZ;
      }
      this._scene.activeCamera = this._vrDeviceOrientationCamera;
      this._scene.getEngine().enterFullscreen(this.requestPointerLockOnFullScreen);
      this._updateButtonVisibility();
      this._vrDeviceOrientationCamera.onViewMatrixChangedObservable.addOnce(() => {
        this.onAfterEnteringVRObservable.notifyObservers({ success: true });
      });
    }
    if (this._scene.activeCamera && this._inputElement) {
      this._scene.activeCamera.attachControl();
    }
    if (this._interactionsEnabled) {
      this._scene.registerBeforeRender(this._beforeRender);
    }
    this._hasEnteredVR = true;
  }
  /**
   * Attempt to exit VR, or fullscreen.
   */
  exitVR() {
    if (this.xr) {
      this.xr.baseExperience.exitXRAsync();
      return;
    }
    if (this._hasEnteredVR) {
      if (this.onExitingVRObservable) {
        try {
          this.onExitingVRObservable.notifyObservers(this);
        } catch (err) {
          Logger.Warn("Error in your custom logic onExitingVR: " + err);
        }
      }
      if (this._scene.activeCamera) {
        this._position = this._scene.activeCamera.position.clone();
      }
      if (this.vrDeviceOrientationCamera) {
        this.vrDeviceOrientationCamera.angularSensibility = Number.MAX_VALUE;
      }
      if (this._deviceOrientationCamera) {
        this._deviceOrientationCamera.position = this._position;
        this._scene.activeCamera = this._deviceOrientationCamera;
        if (this._cachedAngularSensibility.angularSensibilityX) {
          this._deviceOrientationCamera.angularSensibilityX = this._cachedAngularSensibility.angularSensibilityX;
          this._cachedAngularSensibility.angularSensibilityX = null;
        }
        if (this._cachedAngularSensibility.angularSensibilityY) {
          this._deviceOrientationCamera.angularSensibilityY = this._cachedAngularSensibility.angularSensibilityY;
          this._cachedAngularSensibility.angularSensibilityY = null;
        }
        if (this._cachedAngularSensibility.angularSensibility) {
          this._deviceOrientationCamera.angularSensibility = this._cachedAngularSensibility.angularSensibility;
          this._cachedAngularSensibility.angularSensibility = null;
        }
      } else if (this._existingCamera) {
        this._existingCamera.position = this._position;
        this._scene.activeCamera = this._existingCamera;
        if (this._inputElement) {
          this._scene.activeCamera.attachControl();
        }
        if (this._cachedAngularSensibility.angularSensibilityX) {
          this._existingCamera.angularSensibilityX = this._cachedAngularSensibility.angularSensibilityX;
          this._cachedAngularSensibility.angularSensibilityX = null;
        }
        if (this._cachedAngularSensibility.angularSensibilityY) {
          this._existingCamera.angularSensibilityY = this._cachedAngularSensibility.angularSensibilityY;
          this._cachedAngularSensibility.angularSensibilityY = null;
        }
        if (this._cachedAngularSensibility.angularSensibility) {
          this._existingCamera.angularSensibility = this._cachedAngularSensibility.angularSensibility;
          this._cachedAngularSensibility.angularSensibility = null;
        }
      }
      this._updateButtonVisibility();
      if (this._interactionsEnabled) {
        this._scene.unregisterBeforeRender(this._beforeRender);
        this._cameraGazer._gazeTracker.isVisible = false;
      }
      this._scene.getEngine().resize();
      this._hasEnteredVR = false;
    }
  }
  /**
   * The position of the vr experience helper.
   */
  get position() {
    return this._position;
  }
  /**
   * Sets the position of the vr experience helper.
   */
  set position(value) {
    this._position = value;
    if (this._scene.activeCamera) {
      this._scene.activeCamera.position = value;
    }
  }
  /**
   * Enables controllers and user interactions such as selecting and object or clicking on an object.
   */
  enableInteractions() {
    if (!this._interactionsEnabled) {
      if (this.xr) {
        if (this.xr.baseExperience.state === WebXRState.IN_XR) {
          this.xr.pointerSelection.attach();
        }
        return;
      }
      this.raySelectionPredicate = (mesh) => {
        return mesh.isVisible && (mesh.isPickable || mesh.name === this._floorMeshName);
      };
      this.meshSelectionPredicate = () => {
        return true;
      };
      this._raySelectionPredicate = (mesh) => {
        if (this._isTeleportationFloor(mesh) || mesh.name.indexOf("gazeTracker") === -1 && mesh.name.indexOf("teleportationTarget") === -1 && mesh.name.indexOf("torusTeleportation") === -1) {
          return this.raySelectionPredicate(mesh);
        }
        return false;
      };
      this._interactionsEnabled = true;
    }
  }
  _isTeleportationFloor(mesh) {
    for (let i = 0; i < this._floorMeshesCollection.length; i++) {
      if (this._floorMeshesCollection[i].id === mesh.id) {
        return true;
      }
    }
    if (this._floorMeshName && mesh.name === this._floorMeshName) {
      return true;
    }
    return false;
  }
  /**
   * Adds a floor mesh to be used for teleportation.
   * @param floorMesh the mesh to be used for teleportation.
   */
  addFloorMesh(floorMesh) {
    if (!this._floorMeshesCollection) {
      return;
    }
    if (this._floorMeshesCollection.indexOf(floorMesh) > -1) {
      return;
    }
    this._floorMeshesCollection.push(floorMesh);
  }
  /**
   * Removes a floor mesh from being used for teleportation.
   * @param floorMesh the mesh to be removed.
   */
  removeFloorMesh(floorMesh) {
    if (!this._floorMeshesCollection) {
      return;
    }
    const meshIndex = this._floorMeshesCollection.indexOf(floorMesh);
    if (meshIndex !== -1) {
      this._floorMeshesCollection.splice(meshIndex, 1);
    }
  }
  /**
   * Enables interactions and teleportation using the VR controllers and gaze.
   * @param vrTeleportationOptions options to modify teleportation behavior.
   */
  enableTeleportation(vrTeleportationOptions = {}) {
    if (!this._teleportationInitialized) {
      this.enableInteractions();
      if (this.webVROptions.useXR && (vrTeleportationOptions.floorMeshes || vrTeleportationOptions.floorMeshName)) {
        const floorMeshes = vrTeleportationOptions.floorMeshes || [];
        if (!floorMeshes.length) {
          const floorMesh = this._scene.getMeshByName(vrTeleportationOptions.floorMeshName);
          if (floorMesh) {
            floorMeshes.push(floorMesh);
          }
        }
        if (this.xr) {
          floorMeshes.forEach((mesh) => {
            this.xr.teleportation.addFloorMesh(mesh);
          });
          if (!this.xr.teleportation.attached) {
            this.xr.teleportation.attach();
          }
          return;
        } else if (!this.xrTestDone) {
          const waitForXr = () => {
            if (this.xrTestDone) {
              this._scene.unregisterBeforeRender(waitForXr);
              if (this.xr) {
                if (!this.xr.teleportation.attached) {
                  this.xr.teleportation.attach();
                }
              } else {
                this.enableTeleportation(vrTeleportationOptions);
              }
            }
          };
          this._scene.registerBeforeRender(waitForXr);
          return;
        }
      }
      if (vrTeleportationOptions.floorMeshName) {
        this._floorMeshName = vrTeleportationOptions.floorMeshName;
      }
      if (vrTeleportationOptions.floorMeshes) {
        this._floorMeshesCollection = vrTeleportationOptions.floorMeshes;
      }
      if (vrTeleportationOptions.teleportationMode) {
        this._teleportationMode = vrTeleportationOptions.teleportationMode;
      }
      if (vrTeleportationOptions.teleportationTime && vrTeleportationOptions.teleportationTime > 0) {
        this._teleportationTime = vrTeleportationOptions.teleportationTime;
      }
      if (vrTeleportationOptions.teleportationSpeed && vrTeleportationOptions.teleportationSpeed > 0) {
        this._teleportationSpeed = vrTeleportationOptions.teleportationSpeed;
      }
      if (vrTeleportationOptions.easingFunction !== void 0) {
        this._teleportationEasing = vrTeleportationOptions.easingFunction;
      }
      const imageProcessingConfiguration = new ImageProcessingConfiguration();
      imageProcessingConfiguration.vignetteColor = new Color4(0, 0, 0, 0);
      imageProcessingConfiguration.vignetteEnabled = true;
      this._teleportationInitialized = true;
      if (this._isDefaultTeleportationTarget) {
        this._createTeleportationCircles();
      }
    }
  }
  _checkTeleportWithRay(stateObject, gazer) {
    if (this._teleportationRequestInitiated && !gazer._teleportationRequestInitiated) {
      return;
    }
    if (!gazer._teleportationRequestInitiated) {
      if (stateObject.y < -this._padSensibilityUp && gazer._dpadPressed) {
        gazer._activatePointer();
        gazer._teleportationRequestInitiated = true;
      }
    } else {
      if (Math.sqrt(stateObject.y * stateObject.y + stateObject.x * stateObject.x) < this._padSensibilityDown) {
        if (this._teleportActive) {
          this.teleportCamera(this._haloCenter);
        }
        gazer._teleportationRequestInitiated = false;
      }
    }
  }
  _checkRotate(stateObject, gazer) {
    if (gazer._teleportationRequestInitiated) {
      return;
    }
    if (!gazer._rotationLeftAsked) {
      if (stateObject.x < -this._padSensibilityUp && gazer._dpadPressed) {
        gazer._rotationLeftAsked = true;
        if (this._rotationAllowed) {
          this._rotateCamera(false);
        }
      }
    } else {
      if (stateObject.x > -this._padSensibilityDown) {
        gazer._rotationLeftAsked = false;
      }
    }
    if (!gazer._rotationRightAsked) {
      if (stateObject.x > this._padSensibilityUp && gazer._dpadPressed) {
        gazer._rotationRightAsked = true;
        if (this._rotationAllowed) {
          this._rotateCamera(true);
        }
      }
    } else {
      if (stateObject.x < this._padSensibilityDown) {
        gazer._rotationRightAsked = false;
      }
    }
  }
  _checkTeleportBackwards(stateObject, gazer) {
    if (gazer._teleportationRequestInitiated) {
      return;
    }
    if (stateObject.y > this._padSensibilityUp && gazer._dpadPressed) {
      if (!gazer._teleportationBackRequestInitiated) {
        if (!this.currentVRCamera) {
          return;
        }
        const rotation = Quaternion.FromRotationMatrix(this.currentVRCamera.getWorldMatrix().getRotationMatrix());
        const position = this.currentVRCamera.position;
        rotation.toEulerAnglesToRef(this._workingVector);
        this._workingVector.z = 0;
        this._workingVector.x = 0;
        Quaternion.RotationYawPitchRollToRef(this._workingVector.y, this._workingVector.x, this._workingVector.z, this._workingQuaternion);
        this._workingQuaternion.toRotationMatrix(this._workingMatrix);
        Vector3.TransformCoordinatesToRef(this._teleportBackwardsVector, this._workingMatrix, this._workingVector);
        const ray = new Ray(position, this._workingVector);
        const hit = this._scene.pickWithRay(ray, this._raySelectionPredicate);
        if (hit && hit.pickedPoint && hit.pickedMesh && this._isTeleportationFloor(hit.pickedMesh) && hit.distance < 5) {
          this.teleportCamera(hit.pickedPoint);
        }
        gazer._teleportationBackRequestInitiated = true;
      }
    } else {
      gazer._teleportationBackRequestInitiated = false;
    }
  }
  _createTeleportationCircles() {
    this._teleportationTarget = CreateGround("teleportationTarget", { width: 2, height: 2, subdivisions: 2 }, this._scene);
    this._teleportationTarget.isPickable = false;
    const length = 512;
    const dynamicTexture = new DynamicTexture("DynamicTexture", length, this._scene, true);
    dynamicTexture.hasAlpha = true;
    const context = dynamicTexture.getContext();
    const centerX = length / 2;
    const centerY = length / 2;
    const radius = 200;
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = this._teleportationFillColor;
    context.fill();
    context.lineWidth = 10;
    context.strokeStyle = this._teleportationBorderColor;
    context.stroke();
    context.closePath();
    dynamicTexture.update();
    const teleportationCircleMaterial = new StandardMaterial("TextPlaneMaterial", this._scene);
    teleportationCircleMaterial.diffuseTexture = dynamicTexture;
    this._teleportationTarget.material = teleportationCircleMaterial;
    const torus = CreateTorus("torusTeleportation", {
      diameter: 0.75,
      thickness: 0.1,
      tessellation: 25,
      updatable: false
    }, this._scene);
    torus.isPickable = false;
    torus.parent = this._teleportationTarget;
    const animationInnerCircle = new Animation("animationInnerCircle", "position.y", 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const keys = [];
    keys.push({
      frame: 0,
      value: 0
    });
    keys.push({
      frame: 30,
      value: 0.4
    });
    keys.push({
      frame: 60,
      value: 0
    });
    animationInnerCircle.setKeys(keys);
    const easingFunction = new SineEase();
    easingFunction.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT);
    animationInnerCircle.setEasingFunction(easingFunction);
    torus.animations = [];
    torus.animations.push(animationInnerCircle);
    this._scene.beginAnimation(torus, 0, 60, true);
    this._hideTeleportationTarget();
  }
  _hideTeleportationTarget() {
    this._teleportActive = false;
    if (this._teleportationInitialized) {
      this._teleportationTarget.isVisible = false;
      if (this._isDefaultTeleportationTarget) {
        this._teleportationTarget.getChildren()[0].isVisible = false;
      }
    }
  }
  _rotateCamera(right) {
    if (!(this.currentVRCamera instanceof FreeCamera)) {
      return;
    }
    if (right) {
      this._rotationAngle++;
    } else {
      this._rotationAngle--;
    }
    this.currentVRCamera.animations = [];
    const target = Quaternion.FromRotationMatrix(Matrix.RotationY(Math.PI / 4 * this._rotationAngle));
    const animationRotation = new Animation("animationRotation", "rotationQuaternion", 90, Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const animationRotationKeys = [];
    animationRotationKeys.push({
      frame: 0,
      value: this.currentVRCamera.rotationQuaternion
    });
    animationRotationKeys.push({
      frame: 6,
      value: target
    });
    animationRotation.setKeys(animationRotationKeys);
    animationRotation.setEasingFunction(this._circleEase);
    this.currentVRCamera.animations.push(animationRotation);
    this._postProcessMove.animations = [];
    const animationPP = new Animation("animationPP", "vignetteWeight", 90, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const vignetteWeightKeys = [];
    vignetteWeightKeys.push({
      frame: 0,
      value: 0
    });
    vignetteWeightKeys.push({
      frame: 3,
      value: 4
    });
    vignetteWeightKeys.push({
      frame: 6,
      value: 0
    });
    animationPP.setKeys(vignetteWeightKeys);
    animationPP.setEasingFunction(this._circleEase);
    this._postProcessMove.animations.push(animationPP);
    const animationPP2 = new Animation("animationPP2", "vignetteStretch", 90, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const vignetteStretchKeys = [];
    vignetteStretchKeys.push({
      frame: 0,
      value: 0
    });
    vignetteStretchKeys.push({
      frame: 3,
      value: 10
    });
    vignetteStretchKeys.push({
      frame: 6,
      value: 0
    });
    animationPP2.setKeys(vignetteStretchKeys);
    animationPP2.setEasingFunction(this._circleEase);
    this._postProcessMove.animations.push(animationPP2);
    this._postProcessMove.imageProcessingConfiguration.vignetteWeight = 0;
    this._postProcessMove.imageProcessingConfiguration.vignetteStretch = 0;
    this._postProcessMove.samples = 4;
    this._scene.beginAnimation(this.currentVRCamera, 0, 6, false, 1);
  }
  /**
   * Teleports the users feet to the desired location
   * @param location The location where the user's feet should be placed
   */
  teleportCamera(location) {
    if (!(this.currentVRCamera instanceof FreeCamera)) {
      return;
    }
    this._workingVector.copyFrom(location);
    if (this.isInVRMode) {
    } else {
      this._workingVector.y += this._defaultHeight;
    }
    this.onBeforeCameraTeleport.notifyObservers(this._workingVector);
    const FPS = 90;
    let speedRatio, lastFrame;
    if (this._teleportationMode == _VRExperienceHelper.TELEPORTATIONMODE_CONSTANTSPEED) {
      lastFrame = FPS;
      const dist = Vector3.Distance(this.currentVRCamera.position, this._workingVector);
      speedRatio = this._teleportationSpeed / dist;
    } else {
      lastFrame = Math.round(this._teleportationTime * FPS / 1e3);
      speedRatio = 1;
    }
    this.currentVRCamera.animations = [];
    const animationCameraTeleportation = new Animation("animationCameraTeleportation", "position", FPS, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const animationCameraTeleportationKeys = [
      {
        frame: 0,
        value: this.currentVRCamera.position
      },
      {
        frame: lastFrame,
        value: this._workingVector
      }
    ];
    animationCameraTeleportation.setKeys(animationCameraTeleportationKeys);
    animationCameraTeleportation.setEasingFunction(this._teleportationEasing);
    this.currentVRCamera.animations.push(animationCameraTeleportation);
    this._postProcessMove.animations = [];
    const midFrame = Math.round(lastFrame / 2);
    const animationPP = new Animation("animationPP", "vignetteWeight", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const vignetteWeightKeys = [];
    vignetteWeightKeys.push({
      frame: 0,
      value: 0
    });
    vignetteWeightKeys.push({
      frame: midFrame,
      value: 8
    });
    vignetteWeightKeys.push({
      frame: lastFrame,
      value: 0
    });
    animationPP.setKeys(vignetteWeightKeys);
    this._postProcessMove.animations.push(animationPP);
    const animationPP2 = new Animation("animationPP2", "vignetteStretch", FPS, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
    const vignetteStretchKeys = [];
    vignetteStretchKeys.push({
      frame: 0,
      value: 0
    });
    vignetteStretchKeys.push({
      frame: midFrame,
      value: 10
    });
    vignetteStretchKeys.push({
      frame: lastFrame,
      value: 0
    });
    animationPP2.setKeys(vignetteStretchKeys);
    this._postProcessMove.animations.push(animationPP2);
    this._postProcessMove.imageProcessingConfiguration.vignetteWeight = 0;
    this._postProcessMove.imageProcessingConfiguration.vignetteStretch = 0;
    this._scene.beginAnimation(this.currentVRCamera, 0, lastFrame, false, speedRatio, () => {
      this.onAfterCameraTeleport.notifyObservers(this._workingVector);
    });
    this._hideTeleportationTarget();
  }
  /**
   * Permanently set new colors for the laser pointer
   * @param color the new laser color
   * @param pickedColor the new laser color when picked mesh detected
   */
  setLaserColor(color, pickedColor = this._pickedLaserColor) {
    this._pickedLaserColor = pickedColor;
  }
  /**
   * Set lighting enabled / disabled on the laser pointer of both controllers
   * @param enabled should the lighting be enabled on the laser pointer
   */
  setLaserLightingState(_enabled = true) {
  }
  /**
   * Permanently set new colors for the gaze pointer
   * @param color the new gaze color
   * @param pickedColor the new gaze color when picked mesh detected
   */
  setGazeColor(color, pickedColor = this._pickedGazeColor) {
    this._pickedGazeColor = pickedColor;
  }
  /**
   * Sets the color of the laser ray from the vr controllers.
   * @param color new color for the ray.
   */
  changeLaserColor(_color) {
    if (!this.updateControllerLaserColor) {
      return;
    }
  }
  /**
   * Sets the color of the ray from the vr headsets gaze.
   * @param color new color for the ray.
   */
  changeGazeColor(color) {
    if (!this.updateGazeTrackerColor) {
      return;
    }
    if (!this._cameraGazer._gazeTracker.material) {
      return;
    }
    this._cameraGazer._gazeTracker.material.emissiveColor = color;
  }
  /**
   * Exits VR and disposes of the vr experience helper
   */
  dispose() {
    if (this.isInVRMode) {
      this.exitVR();
    }
    if (this._postProcessMove) {
      this._postProcessMove.dispose();
    }
    if (this._vrDeviceOrientationCamera) {
      this._vrDeviceOrientationCamera.dispose();
    }
    if (!this._useCustomVRButton && this._btnVR && this._btnVR.parentNode) {
      document.body.removeChild(this._btnVR);
    }
    if (this._deviceOrientationCamera && this._scene.activeCamera != this._deviceOrientationCamera) {
      this._deviceOrientationCamera.dispose();
    }
    if (this._cameraGazer) {
      this._cameraGazer.dispose();
    }
    if (this._teleportationTarget) {
      this._teleportationTarget.dispose();
    }
    if (this.xr) {
      this.xr.dispose();
    }
    this._floorMeshesCollection.length = 0;
    document.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("vrdisplaypresentchange", this._onVrDisplayPresentChangeBind);
    window.removeEventListener("resize", this._onResize);
    document.removeEventListener("fullscreenchange", this._onFullscreenChange);
    this._scene.gamepadManager.onGamepadConnectedObservable.removeCallback(this._onNewGamepadConnected);
    this._scene.unregisterBeforeRender(this._beforeRender);
  }
  /**
   * Gets the name of the VRExperienceHelper class
   * @returns "VRExperienceHelper"
   */
  getClassName() {
    return "VRExperienceHelper";
  }
};
VRExperienceHelper.TELEPORTATIONMODE_CONSTANTTIME = 0;
VRExperienceHelper.TELEPORTATIONMODE_CONSTANTSPEED = 1;

export {
  AnimationKeyInterpolation,
  AnimationRange,
  _staticOffsetValueQuaternion,
  _staticOffsetValueVector3,
  _staticOffsetValueVector2,
  _staticOffsetValueSize,
  _staticOffsetValueColor3,
  _staticOffsetValueColor4,
  Animation,
  RuntimeAnimation,
  Bone,
  Animatable,
  EasingFunction,
  CircleEase,
  BackEase,
  BounceEase,
  CubicEase,
  ElasticEase,
  ExponentialEase,
  PowerEase,
  QuadraticEase,
  QuarticEase,
  QuinticEase,
  SineEase,
  BezierCurveEase,
  AutoRotationBehavior,
  BouncingBehavior,
  FramingBehavior,
  BaseCameraMouseWheelInput,
  BaseCameraPointersInput,
  CameraInputTypes,
  CameraInputsManager,
  StickValues,
  Gamepad,
  GenericPad,
  ArcRotateCameraGamepadInput,
  ArcRotateCameraKeyboardMoveInput,
  ArcRotateCameraMouseWheelInput,
  ArcRotateCameraPointersInput,
  ArcRotateCameraInputsManager,
  ArcRotateCameraVRDeviceOrientationInput,
  FlyCameraKeyboardInput,
  FlyCameraMouseInput,
  FollowCameraKeyboardMoveInput,
  FollowCameraMouseWheelInput,
  FollowCameraPointersInput,
  FreeCameraKeyboardMoveInput,
  FreeCameraMouseInput,
  FreeCameraMouseWheelInput,
  FreeCameraTouchInput,
  FreeCameraInputsManager,
  FreeCameraDeviceOrientationInput,
  FreeCameraGamepadInput,
  JoystickAxis,
  VirtualJoystick,
  FreeCameraVirtualJoystickInput,
  TargetCamera,
  FreeCamera,
  TouchCamera,
  ArcRotateCamera,
  DeviceOrientationCamera,
  FlyCameraInputsManager,
  FlyCamera,
  FollowCameraInputsManager,
  FollowCamera,
  ArcFollowCamera,
  Xbox360Button,
  Xbox360Dpad,
  Xbox360Pad,
  DualShockButton,
  DualShockDpad,
  DualShockPad,
  GamepadManager,
  GamepadSystemSceneComponent,
  UniversalCamera,
  GamepadCamera,
  AnaglyphPostProcess,
  setStereoscopicAnaglyphRigMode,
  AnaglyphArcRotateCamera,
  AnaglyphFreeCamera,
  AnaglyphGamepadCamera,
  AnaglyphUniversalCamera,
  StereoscopicInterlacePostProcessI,
  StereoscopicInterlacePostProcess,
  setStereoscopicRigMode,
  StereoscopicArcRotateCamera,
  StereoscopicFreeCamera,
  StereoscopicGamepadCamera,
  StereoscopicUniversalCamera,
  StereoscopicScreenUniversalCamera,
  VirtualJoysticksCamera,
  VRCameraMetrics,
  VRDistortionCorrectionPostProcess,
  VRMultiviewToSingleviewPostProcess,
  setVRRigMode,
  VRDeviceOrientationArcRotateCamera,
  VRDeviceOrientationFreeCamera,
  VRDeviceOrientationGamepadCamera,
  DynamicTexture,
  WebXRLayerWrapper,
  WebXRLayerRenderTargetTextureProvider,
  WebXRWebGLLayerWrapper,
  WebXRManagedOutputCanvasOptions,
  WebXRManagedOutputCanvas,
  NativeXRLayerWrapper,
  NativeXRLayerRenderTargetTextureProvider,
  NativeXRRenderTarget,
  WebXRSessionManager,
  WebXRState,
  WebXRTrackingState,
  OnAfterEnteringVRObservableEvent,
  VRExperienceHelper
};
//# sourceMappingURL=chunk-QEPHUICW.js.map
