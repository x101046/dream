import {
  AbstractScene,
  BoundingInfo,
  Camera,
  DrawWrapper,
  EffectFallbacks,
  LightConstants,
  Logger,
  MaterialHelper,
  Node,
  PostProcess,
  PostProcessManager,
  RenderTargetTexture,
  RenderingManager,
  SceneComponentConstants,
  ShaderStore,
  Texture,
  UniformBuffer,
  VertexBuffer,
  addClipPlaneUniforms,
  bindClipPlane,
  prepareStringDefinesForClipPlanes
} from "./chunk-VAZZWHD2.js";
import {
  Axis,
  Color3,
  Color4,
  EngineStore,
  GetClass,
  Matrix,
  Observable,
  RegisterClass,
  SerializationHelper,
  TmpColors,
  Vector2,
  Vector3,
  _WarnImport,
  __decorate,
  expandToProperty,
  serialize,
  serializeAsColor3,
  serializeAsTexture,
  serializeAsVector2,
  serializeAsVector3
} from "./chunk-ZYQT2WB4.js";

// node_modules/@babylonjs/core/Lights/light.js
var Light = class _Light extends Node {
  /**
   * Defines how far from the source the light is impacting in scene units.
   * Note: Unused in PBR material as the distance light falloff is defined following the inverse squared falloff.
   */
  get range() {
    return this._range;
  }
  /**
   * Defines how far from the source the light is impacting in scene units.
   * Note: Unused in PBR material as the distance light falloff is defined following the inverse squared falloff.
   */
  set range(value) {
    this._range = value;
    this._inverseSquaredRange = 1 / (this.range * this.range);
  }
  /**
   * Gets the photometric scale used to interpret the intensity.
   * This is only relevant with PBR Materials where the light intensity can be defined in a physical way.
   */
  get intensityMode() {
    return this._intensityMode;
  }
  /**
   * Sets the photometric scale used to interpret the intensity.
   * This is only relevant with PBR Materials where the light intensity can be defined in a physical way.
   */
  set intensityMode(value) {
    this._intensityMode = value;
    this._computePhotometricScale();
  }
  /**
   * Gets the light radius used by PBR Materials to simulate soft area lights.
   */
  get radius() {
    return this._radius;
  }
  /**
   * sets the light radius used by PBR Materials to simulate soft area lights.
   */
  set radius(value) {
    this._radius = value;
    this._computePhotometricScale();
  }
  /**
   * Gets whether or not the shadows are enabled for this light. This can help turning off/on shadow without detaching
   * the current shadow generator.
   */
  get shadowEnabled() {
    return this._shadowEnabled;
  }
  /**
   * Sets whether or not the shadows are enabled for this light. This can help turning off/on shadow without detaching
   * the current shadow generator.
   */
  set shadowEnabled(value) {
    if (this._shadowEnabled === value) {
      return;
    }
    this._shadowEnabled = value;
    this._markMeshesAsLightDirty();
  }
  /**
   * Gets the only meshes impacted by this light.
   */
  get includedOnlyMeshes() {
    return this._includedOnlyMeshes;
  }
  /**
   * Sets the only meshes impacted by this light.
   */
  set includedOnlyMeshes(value) {
    this._includedOnlyMeshes = value;
    this._hookArrayForIncludedOnly(value);
  }
  /**
   * Gets the meshes not impacted by this light.
   */
  get excludedMeshes() {
    return this._excludedMeshes;
  }
  /**
   * Sets the meshes not impacted by this light.
   */
  set excludedMeshes(value) {
    this._excludedMeshes = value;
    this._hookArrayForExcluded(value);
  }
  /**
   * Gets the layer id use to find what meshes are not impacted by the light.
   * Inactive if 0
   */
  get excludeWithLayerMask() {
    return this._excludeWithLayerMask;
  }
  /**
   * Sets the layer id use to find what meshes are not impacted by the light.
   * Inactive if 0
   */
  set excludeWithLayerMask(value) {
    this._excludeWithLayerMask = value;
    this._resyncMeshes();
  }
  /**
   * Gets the layer id use to find what meshes are impacted by the light.
   * Inactive if 0
   */
  get includeOnlyWithLayerMask() {
    return this._includeOnlyWithLayerMask;
  }
  /**
   * Sets the layer id use to find what meshes are impacted by the light.
   * Inactive if 0
   */
  set includeOnlyWithLayerMask(value) {
    this._includeOnlyWithLayerMask = value;
    this._resyncMeshes();
  }
  /**
   * Gets the lightmap mode of this light (should be one of the constants defined by Light.LIGHTMAP_x)
   */
  get lightmapMode() {
    return this._lightmapMode;
  }
  /**
   * Sets the lightmap mode of this light (should be one of the constants defined by Light.LIGHTMAP_x)
   */
  set lightmapMode(value) {
    if (this._lightmapMode === value) {
      return;
    }
    this._lightmapMode = value;
    this._markMeshesAsLightDirty();
  }
  /**
   * Creates a Light object in the scene.
   * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
   * @param name The friendly name of the light
   * @param scene The scene the light belongs too
   */
  constructor(name26, scene) {
    super(name26, scene);
    this.diffuse = new Color3(1, 1, 1);
    this.specular = new Color3(1, 1, 1);
    this.falloffType = _Light.FALLOFF_DEFAULT;
    this.intensity = 1;
    this._range = Number.MAX_VALUE;
    this._inverseSquaredRange = 0;
    this._photometricScale = 1;
    this._intensityMode = _Light.INTENSITYMODE_AUTOMATIC;
    this._radius = 1e-5;
    this.renderPriority = 0;
    this._shadowEnabled = true;
    this._excludeWithLayerMask = 0;
    this._includeOnlyWithLayerMask = 0;
    this._lightmapMode = 0;
    this._shadowGenerators = null;
    this._excludedMeshesIds = new Array();
    this._includedOnlyMeshesIds = new Array();
    this._isLight = true;
    this.getScene().addLight(this);
    this._uniformBuffer = new UniformBuffer(this.getScene().getEngine(), void 0, void 0, name26);
    this._buildUniformLayout();
    this.includedOnlyMeshes = [];
    this.excludedMeshes = [];
    this._resyncMeshes();
  }
  /**
   * Sets the passed Effect "effect" with the Light textures.
   * @param effect The effect to update
   * @param lightIndex The index of the light in the effect to update
   * @returns The light
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transferTexturesToEffect(effect, lightIndex) {
    return this;
  }
  /**
   * Binds the lights information from the scene to the effect for the given mesh.
   * @param lightIndex Light index
   * @param scene The scene where the light belongs to
   * @param effect The effect we are binding the data to
   * @param useSpecular Defines if specular is supported
   * @param receiveShadows Defines if the effect (mesh) we bind the light for receives shadows
   */
  _bindLight(lightIndex, scene, effect, useSpecular, receiveShadows = true) {
    var _a;
    const iAsString = lightIndex.toString();
    let needUpdate = false;
    this._uniformBuffer.bindToEffect(effect, "Light" + iAsString);
    if (this._renderId !== scene.getRenderId() || this._lastUseSpecular !== useSpecular || !this._uniformBuffer.useUbo) {
      this._renderId = scene.getRenderId();
      this._lastUseSpecular = useSpecular;
      const scaledIntensity = this.getScaledIntensity();
      this.transferToEffect(effect, iAsString);
      this.diffuse.scaleToRef(scaledIntensity, TmpColors.Color3[0]);
      this._uniformBuffer.updateColor4("vLightDiffuse", TmpColors.Color3[0], this.range, iAsString);
      if (useSpecular) {
        this.specular.scaleToRef(scaledIntensity, TmpColors.Color3[1]);
        this._uniformBuffer.updateColor4("vLightSpecular", TmpColors.Color3[1], this.radius, iAsString);
      }
      needUpdate = true;
    }
    this.transferTexturesToEffect(effect, iAsString);
    if (scene.shadowsEnabled && this.shadowEnabled && receiveShadows) {
      const shadowGenerator = (_a = this.getShadowGenerator(scene.activeCamera)) !== null && _a !== void 0 ? _a : this.getShadowGenerator();
      if (shadowGenerator) {
        shadowGenerator.bindShadowLight(iAsString, effect);
        needUpdate = true;
      }
    }
    if (needUpdate) {
      this._uniformBuffer.update();
    } else {
      this._uniformBuffer.bindUniformBuffer();
    }
  }
  /**
   * Returns the string "Light".
   * @returns the class name
   */
  getClassName() {
    return "Light";
  }
  /**
   * Converts the light information to a readable string for debug purpose.
   * @param fullDetails Supports for multiple levels of logging within scene loading
   * @returns the human readable light info
   */
  toString(fullDetails) {
    let ret = "Name: " + this.name;
    ret += ", type: " + ["Point", "Directional", "Spot", "Hemispheric"][this.getTypeID()];
    if (this.animations) {
      for (let i = 0; i < this.animations.length; i++) {
        ret += ", animation[0]: " + this.animations[i].toString(fullDetails);
      }
    }
    return ret;
  }
  /** @internal */
  _syncParentEnabledState() {
    super._syncParentEnabledState();
    if (!this.isDisposed()) {
      this._resyncMeshes();
    }
  }
  /**
   * Set the enabled state of this node.
   * @param value - the new enabled state
   */
  setEnabled(value) {
    super.setEnabled(value);
    this._resyncMeshes();
  }
  /**
   * Returns the Light associated shadow generator if any.
   * @param camera Camera for which the shadow generator should be retrieved (default: null). If null, retrieves the default shadow generator
   * @returns the associated shadow generator.
   */
  getShadowGenerator(camera = null) {
    var _a;
    if (this._shadowGenerators === null) {
      return null;
    }
    return (_a = this._shadowGenerators.get(camera)) !== null && _a !== void 0 ? _a : null;
  }
  /**
   * Returns all the shadow generators associated to this light
   * @returns
   */
  getShadowGenerators() {
    return this._shadowGenerators;
  }
  /**
   * Returns a Vector3, the absolute light position in the World.
   * @returns the world space position of the light
   */
  getAbsolutePosition() {
    return Vector3.Zero();
  }
  /**
   * Specifies if the light will affect the passed mesh.
   * @param mesh The mesh to test against the light
   * @returns true the mesh is affected otherwise, false.
   */
  canAffectMesh(mesh) {
    if (!mesh) {
      return true;
    }
    if (this.includedOnlyMeshes && this.includedOnlyMeshes.length > 0 && this.includedOnlyMeshes.indexOf(mesh) === -1) {
      return false;
    }
    if (this.excludedMeshes && this.excludedMeshes.length > 0 && this.excludedMeshes.indexOf(mesh) !== -1) {
      return false;
    }
    if (this.includeOnlyWithLayerMask !== 0 && (this.includeOnlyWithLayerMask & mesh.layerMask) === 0) {
      return false;
    }
    if (this.excludeWithLayerMask !== 0 && this.excludeWithLayerMask & mesh.layerMask) {
      return false;
    }
    return true;
  }
  /**
   * Releases resources associated with this node.
   * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
   * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
   */
  dispose(doNotRecurse, disposeMaterialAndTextures = false) {
    if (this._shadowGenerators) {
      const iterator = this._shadowGenerators.values();
      for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
        const shadowGenerator = key.value;
        shadowGenerator.dispose();
      }
      this._shadowGenerators = null;
    }
    this.getScene().stopAnimation(this);
    if (this._parentContainer) {
      const index = this._parentContainer.lights.indexOf(this);
      if (index > -1) {
        this._parentContainer.lights.splice(index, 1);
      }
      this._parentContainer = null;
    }
    for (const mesh of this.getScene().meshes) {
      mesh._removeLightSource(this, true);
    }
    this._uniformBuffer.dispose();
    this.getScene().removeLight(this);
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }
  /**
   * Returns the light type ID (integer).
   * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
   */
  getTypeID() {
    return 0;
  }
  /**
   * Returns the intensity scaled by the Photometric Scale according to the light type and intensity mode.
   * @returns the scaled intensity in intensity mode unit
   */
  getScaledIntensity() {
    return this._photometricScale * this.intensity;
  }
  /**
   * Returns a new Light object, named "name", from the current one.
   * @param name The name of the cloned light
   * @param newParent The parent of this light, if it has one
   * @returns the new created light
   */
  clone(name26, newParent = null) {
    const constructor = _Light.GetConstructorFromName(this.getTypeID(), name26, this.getScene());
    if (!constructor) {
      return null;
    }
    const clonedLight = SerializationHelper.Clone(constructor, this);
    if (name26) {
      clonedLight.name = name26;
    }
    if (newParent) {
      clonedLight.parent = newParent;
    }
    clonedLight.setEnabled(this.isEnabled());
    this.onClonedObservable.notifyObservers(clonedLight);
    return clonedLight;
  }
  /**
   * Serializes the current light into a Serialization object.
   * @returns the serialized object.
   */
  serialize() {
    const serializationObject = SerializationHelper.Serialize(this);
    serializationObject.uniqueId = this.uniqueId;
    serializationObject.type = this.getTypeID();
    if (this.parent) {
      this.parent._serializeAsParent(serializationObject);
    }
    if (this.excludedMeshes.length > 0) {
      serializationObject.excludedMeshesIds = [];
      this.excludedMeshes.forEach((mesh) => {
        serializationObject.excludedMeshesIds.push(mesh.id);
      });
    }
    if (this.includedOnlyMeshes.length > 0) {
      serializationObject.includedOnlyMeshesIds = [];
      this.includedOnlyMeshes.forEach((mesh) => {
        serializationObject.includedOnlyMeshesIds.push(mesh.id);
      });
    }
    SerializationHelper.AppendSerializedAnimations(this, serializationObject);
    serializationObject.ranges = this.serializeAnimationRanges();
    serializationObject.isEnabled = this.isEnabled();
    return serializationObject;
  }
  /**
   * Creates a new typed light from the passed type (integer) : point light = 0, directional light = 1, spot light = 2, hemispheric light = 3.
   * This new light is named "name" and added to the passed scene.
   * @param type Type according to the types available in Light.LIGHTTYPEID_x
   * @param name The friendly name of the light
   * @param scene The scene the new light will belong to
   * @returns the constructor function
   */
  static GetConstructorFromName(type, name26, scene) {
    const constructorFunc = Node.Construct("Light_Type_" + type, name26, scene);
    if (constructorFunc) {
      return constructorFunc;
    }
    return null;
  }
  /**
   * Parses the passed "parsedLight" and returns a new instanced Light from this parsing.
   * @param parsedLight The JSON representation of the light
   * @param scene The scene to create the parsed light in
   * @returns the created light after parsing
   */
  static Parse(parsedLight, scene) {
    const constructor = _Light.GetConstructorFromName(parsedLight.type, parsedLight.name, scene);
    if (!constructor) {
      return null;
    }
    const light = SerializationHelper.Parse(constructor, parsedLight, scene);
    if (parsedLight.excludedMeshesIds) {
      light._excludedMeshesIds = parsedLight.excludedMeshesIds;
    }
    if (parsedLight.includedOnlyMeshesIds) {
      light._includedOnlyMeshesIds = parsedLight.includedOnlyMeshesIds;
    }
    if (parsedLight.parentId !== void 0) {
      light._waitingParentId = parsedLight.parentId;
    }
    if (parsedLight.parentInstanceIndex !== void 0) {
      light._waitingParentInstanceIndex = parsedLight.parentInstanceIndex;
    }
    if (parsedLight.falloffType !== void 0) {
      light.falloffType = parsedLight.falloffType;
    }
    if (parsedLight.lightmapMode !== void 0) {
      light.lightmapMode = parsedLight.lightmapMode;
    }
    if (parsedLight.animations) {
      for (let animationIndex = 0; animationIndex < parsedLight.animations.length; animationIndex++) {
        const parsedAnimation = parsedLight.animations[animationIndex];
        const internalClass = GetClass("BABYLON.Animation");
        if (internalClass) {
          light.animations.push(internalClass.Parse(parsedAnimation));
        }
      }
      Node.ParseAnimationRanges(light, parsedLight, scene);
    }
    if (parsedLight.autoAnimate) {
      scene.beginAnimation(light, parsedLight.autoAnimateFrom, parsedLight.autoAnimateTo, parsedLight.autoAnimateLoop, parsedLight.autoAnimateSpeed || 1);
    }
    if (parsedLight.isEnabled !== void 0) {
      light.setEnabled(parsedLight.isEnabled);
    }
    return light;
  }
  _hookArrayForExcluded(array) {
    const oldPush = array.push;
    array.push = (...items) => {
      const result = oldPush.apply(array, items);
      for (const item of items) {
        item._resyncLightSource(this);
      }
      return result;
    };
    const oldSplice = array.splice;
    array.splice = (index, deleteCount) => {
      const deleted = oldSplice.apply(array, [index, deleteCount]);
      for (const item of deleted) {
        item._resyncLightSource(this);
      }
      return deleted;
    };
    for (const item of array) {
      item._resyncLightSource(this);
    }
  }
  _hookArrayForIncludedOnly(array) {
    const oldPush = array.push;
    array.push = (...items) => {
      const result = oldPush.apply(array, items);
      this._resyncMeshes();
      return result;
    };
    const oldSplice = array.splice;
    array.splice = (index, deleteCount) => {
      const deleted = oldSplice.apply(array, [index, deleteCount]);
      this._resyncMeshes();
      return deleted;
    };
    this._resyncMeshes();
  }
  _resyncMeshes() {
    for (const mesh of this.getScene().meshes) {
      mesh._resyncLightSource(this);
    }
  }
  /**
   * Forces the meshes to update their light related information in their rendering used effects
   * @internal Internal Use Only
   */
  _markMeshesAsLightDirty() {
    for (const mesh of this.getScene().meshes) {
      if (mesh.lightSources.indexOf(this) !== -1) {
        mesh._markSubMeshesAsLightDirty();
      }
    }
  }
  /**
   * Recomputes the cached photometric scale if needed.
   */
  _computePhotometricScale() {
    this._photometricScale = this._getPhotometricScale();
    this.getScene().resetCachedMaterial();
  }
  /**
   * Returns the Photometric Scale according to the light type and intensity mode.
   */
  _getPhotometricScale() {
    let photometricScale = 0;
    const lightTypeID = this.getTypeID();
    let photometricMode = this.intensityMode;
    if (photometricMode === _Light.INTENSITYMODE_AUTOMATIC) {
      if (lightTypeID === _Light.LIGHTTYPEID_DIRECTIONALLIGHT) {
        photometricMode = _Light.INTENSITYMODE_ILLUMINANCE;
      } else {
        photometricMode = _Light.INTENSITYMODE_LUMINOUSINTENSITY;
      }
    }
    switch (lightTypeID) {
      case _Light.LIGHTTYPEID_POINTLIGHT:
      case _Light.LIGHTTYPEID_SPOTLIGHT:
        switch (photometricMode) {
          case _Light.INTENSITYMODE_LUMINOUSPOWER:
            photometricScale = 1 / (4 * Math.PI);
            break;
          case _Light.INTENSITYMODE_LUMINOUSINTENSITY:
            photometricScale = 1;
            break;
          case _Light.INTENSITYMODE_LUMINANCE:
            photometricScale = this.radius * this.radius;
            break;
        }
        break;
      case _Light.LIGHTTYPEID_DIRECTIONALLIGHT:
        switch (photometricMode) {
          case _Light.INTENSITYMODE_ILLUMINANCE:
            photometricScale = 1;
            break;
          case _Light.INTENSITYMODE_LUMINANCE: {
            let apexAngleRadians = this.radius;
            apexAngleRadians = Math.max(apexAngleRadians, 1e-3);
            const solidAngle = 2 * Math.PI * (1 - Math.cos(apexAngleRadians));
            photometricScale = solidAngle;
            break;
          }
        }
        break;
      case _Light.LIGHTTYPEID_HEMISPHERICLIGHT:
        photometricScale = 1;
        break;
    }
    return photometricScale;
  }
  /**
   * Reorder the light in the scene according to their defined priority.
   * @internal Internal Use Only
   */
  _reorderLightsInScene() {
    const scene = this.getScene();
    if (this._renderPriority != 0) {
      scene.requireLightSorting = true;
    }
    this.getScene().sortLightsByPriority();
  }
};
Light.FALLOFF_DEFAULT = LightConstants.FALLOFF_DEFAULT;
Light.FALLOFF_PHYSICAL = LightConstants.FALLOFF_PHYSICAL;
Light.FALLOFF_GLTF = LightConstants.FALLOFF_GLTF;
Light.FALLOFF_STANDARD = LightConstants.FALLOFF_STANDARD;
Light.LIGHTMAP_DEFAULT = LightConstants.LIGHTMAP_DEFAULT;
Light.LIGHTMAP_SPECULAR = LightConstants.LIGHTMAP_SPECULAR;
Light.LIGHTMAP_SHADOWSONLY = LightConstants.LIGHTMAP_SHADOWSONLY;
Light.INTENSITYMODE_AUTOMATIC = LightConstants.INTENSITYMODE_AUTOMATIC;
Light.INTENSITYMODE_LUMINOUSPOWER = LightConstants.INTENSITYMODE_LUMINOUSPOWER;
Light.INTENSITYMODE_LUMINOUSINTENSITY = LightConstants.INTENSITYMODE_LUMINOUSINTENSITY;
Light.INTENSITYMODE_ILLUMINANCE = LightConstants.INTENSITYMODE_ILLUMINANCE;
Light.INTENSITYMODE_LUMINANCE = LightConstants.INTENSITYMODE_LUMINANCE;
Light.LIGHTTYPEID_POINTLIGHT = LightConstants.LIGHTTYPEID_POINTLIGHT;
Light.LIGHTTYPEID_DIRECTIONALLIGHT = LightConstants.LIGHTTYPEID_DIRECTIONALLIGHT;
Light.LIGHTTYPEID_SPOTLIGHT = LightConstants.LIGHTTYPEID_SPOTLIGHT;
Light.LIGHTTYPEID_HEMISPHERICLIGHT = LightConstants.LIGHTTYPEID_HEMISPHERICLIGHT;
__decorate([
  serializeAsColor3()
], Light.prototype, "diffuse", void 0);
__decorate([
  serializeAsColor3()
], Light.prototype, "specular", void 0);
__decorate([
  serialize()
], Light.prototype, "falloffType", void 0);
__decorate([
  serialize()
], Light.prototype, "intensity", void 0);
__decorate([
  serialize()
], Light.prototype, "range", null);
__decorate([
  serialize()
], Light.prototype, "intensityMode", null);
__decorate([
  serialize()
], Light.prototype, "radius", null);
__decorate([
  serialize()
], Light.prototype, "_renderPriority", void 0);
__decorate([
  expandToProperty("_reorderLightsInScene")
], Light.prototype, "renderPriority", void 0);
__decorate([
  serialize("shadowEnabled")
], Light.prototype, "_shadowEnabled", void 0);
__decorate([
  serialize("excludeWithLayerMask")
], Light.prototype, "_excludeWithLayerMask", void 0);
__decorate([
  serialize("includeOnlyWithLayerMask")
], Light.prototype, "_includeOnlyWithLayerMask", void 0);
__decorate([
  serialize("lightmapMode")
], Light.prototype, "_lightmapMode", void 0);

// node_modules/@babylonjs/core/Lights/shadowLight.js
var ShadowLight = class extends Light {
  constructor() {
    super(...arguments);
    this._needProjectionMatrixCompute = true;
  }
  _setPosition(value) {
    this._position = value;
  }
  /**
   * Sets the position the shadow will be casted from. Also use as the light position for both
   * point and spot lights.
   */
  get position() {
    return this._position;
  }
  /**
   * Sets the position the shadow will be casted from. Also use as the light position for both
   * point and spot lights.
   */
  set position(value) {
    this._setPosition(value);
  }
  _setDirection(value) {
    this._direction = value;
  }
  /**
   * In 2d mode (needCube being false), gets the direction used to cast the shadow.
   * Also use as the light direction on spot and directional lights.
   */
  get direction() {
    return this._direction;
  }
  /**
   * In 2d mode (needCube being false), sets the direction used to cast the shadow.
   * Also use as the light direction on spot and directional lights.
   */
  set direction(value) {
    this._setDirection(value);
  }
  /**
   * Gets the shadow projection clipping minimum z value.
   */
  get shadowMinZ() {
    return this._shadowMinZ;
  }
  /**
   * Sets the shadow projection clipping minimum z value.
   */
  set shadowMinZ(value) {
    this._shadowMinZ = value;
    this.forceProjectionMatrixCompute();
  }
  /**
   * Sets the shadow projection clipping maximum z value.
   */
  get shadowMaxZ() {
    return this._shadowMaxZ;
  }
  /**
   * Gets the shadow projection clipping maximum z value.
   */
  set shadowMaxZ(value) {
    this._shadowMaxZ = value;
    this.forceProjectionMatrixCompute();
  }
  /**
   * Computes the transformed information (transformedPosition and transformedDirection in World space) of the current light
   * @returns true if the information has been computed, false if it does not need to (no parenting)
   */
  computeTransformedInformation() {
    if (this.parent && this.parent.getWorldMatrix) {
      if (!this.transformedPosition) {
        this.transformedPosition = Vector3.Zero();
      }
      Vector3.TransformCoordinatesToRef(this.position, this.parent.getWorldMatrix(), this.transformedPosition);
      if (this.direction) {
        if (!this.transformedDirection) {
          this.transformedDirection = Vector3.Zero();
        }
        Vector3.TransformNormalToRef(this.direction, this.parent.getWorldMatrix(), this.transformedDirection);
      }
      return true;
    }
    return false;
  }
  /**
   * Return the depth scale used for the shadow map.
   * @returns the depth scale.
   */
  getDepthScale() {
    return 50;
  }
  /**
   * Get the direction to use to render the shadow map. In case of cube texture, the face index can be passed.
   * @param faceIndex The index of the face we are computed the direction to generate shadow
   * @returns The set direction in 2d mode otherwise the direction to the cubemap face if needCube() is true
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getShadowDirection(faceIndex) {
    return this.transformedDirection ? this.transformedDirection : this.direction;
  }
  /**
   * Returns the ShadowLight absolute position in the World.
   * @returns the position vector in world space
   */
  getAbsolutePosition() {
    return this.transformedPosition ? this.transformedPosition : this.position;
  }
  /**
   * Sets the ShadowLight direction toward the passed target.
   * @param target The point to target in local space
   * @returns the updated ShadowLight direction
   */
  setDirectionToTarget(target) {
    this.direction = Vector3.Normalize(target.subtract(this.position));
    return this.direction;
  }
  /**
   * Returns the light rotation in euler definition.
   * @returns the x y z rotation in local space.
   */
  getRotation() {
    this.direction.normalize();
    const xaxis = Vector3.Cross(this.direction, Axis.Y);
    const yaxis = Vector3.Cross(xaxis, this.direction);
    return Vector3.RotationFromAxis(xaxis, yaxis, this.direction);
  }
  /**
   * Returns whether or not the shadow generation require a cube texture or a 2d texture.
   * @returns true if a cube texture needs to be use
   */
  needCube() {
    return false;
  }
  /**
   * Detects if the projection matrix requires to be recomputed this frame.
   * @returns true if it requires to be recomputed otherwise, false.
   */
  needProjectionMatrixCompute() {
    return this._needProjectionMatrixCompute;
  }
  /**
   * Forces the shadow generator to recompute the projection matrix even if position and direction did not changed.
   */
  forceProjectionMatrixCompute() {
    this._needProjectionMatrixCompute = true;
  }
  /** @internal */
  _initCache() {
    super._initCache();
    this._cache.position = Vector3.Zero();
  }
  /** @internal */
  _isSynchronized() {
    if (!this._cache.position.equals(this.position)) {
      return false;
    }
    return true;
  }
  /**
   * Computes the world matrix of the node
   * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
   * @returns the world matrix
   */
  computeWorldMatrix(force) {
    if (!force && this.isSynchronized()) {
      this._currentRenderId = this.getScene().getRenderId();
      return this._worldMatrix;
    }
    this._updateCache();
    this._cache.position.copyFrom(this.position);
    if (!this._worldMatrix) {
      this._worldMatrix = Matrix.Identity();
    }
    Matrix.TranslationToRef(this.position.x, this.position.y, this.position.z, this._worldMatrix);
    if (this.parent && this.parent.getWorldMatrix) {
      this._worldMatrix.multiplyToRef(this.parent.getWorldMatrix(), this._worldMatrix);
      this._markSyncedWithParent();
    }
    this._worldMatrixDeterminantIsDirty = true;
    return this._worldMatrix;
  }
  /**
   * Gets the minZ used for shadow according to both the scene and the light.
   * @param activeCamera The camera we are returning the min for
   * @returns the depth min z
   */
  getDepthMinZ(activeCamera) {
    return this.shadowMinZ !== void 0 ? this.shadowMinZ : activeCamera.minZ;
  }
  /**
   * Gets the maxZ used for shadow according to both the scene and the light.
   * @param activeCamera The camera we are returning the max for
   * @returns the depth max z
   */
  getDepthMaxZ(activeCamera) {
    return this.shadowMaxZ !== void 0 ? this.shadowMaxZ : activeCamera.maxZ;
  }
  /**
   * Sets the shadow projection matrix in parameter to the generated projection matrix.
   * @param matrix The matrix to updated with the projection information
   * @param viewMatrix The transform matrix of the light
   * @param renderList The list of mesh to render in the map
   * @returns The current light
   */
  setShadowProjectionMatrix(matrix, viewMatrix, renderList) {
    if (this.customProjectionMatrixBuilder) {
      this.customProjectionMatrixBuilder(viewMatrix, renderList, matrix);
    } else {
      this._setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList);
    }
    return this;
  }
  /** @internal */
  _syncParentEnabledState() {
    super._syncParentEnabledState();
    if (!this.parent || !this.parent.getWorldMatrix) {
      this.transformedPosition = null;
      this.transformedDirection = null;
    }
  }
};
__decorate([
  serializeAsVector3()
], ShadowLight.prototype, "position", null);
__decorate([
  serializeAsVector3()
], ShadowLight.prototype, "direction", null);
__decorate([
  serialize()
], ShadowLight.prototype, "shadowMinZ", null);
__decorate([
  serialize()
], ShadowLight.prototype, "shadowMaxZ", null);

// node_modules/@babylonjs/core/Shaders/ShadersInclude/kernelBlurVaryingDeclaration.js
var name = "kernelBlurVaryingDeclaration";
var shader = `varying vec2 sampleCoord{X};`;
ShaderStore.IncludesShadersStore[name] = shader;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/packingFunctions.js
var name2 = "packingFunctions";
var shader2 = `vec4 pack(float depth)
{const vec4 bit_shift=vec4(255.0*255.0*255.0,255.0*255.0,255.0,1.0);const vec4 bit_mask=vec4(0.0,1.0/255.0,1.0/255.0,1.0/255.0);vec4 res=fract(depth*bit_shift);res-=res.xxyz*bit_mask;return res;}
float unpack(vec4 color)
{const vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);return dot(color,bit_shift);}`;
ShaderStore.IncludesShadersStore[name2] = shader2;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/kernelBlurFragment.js
var name3 = "kernelBlurFragment";
var shader3 = `#ifdef DOF
factor=sampleCoC(sampleCoord{X}); 
computedWeight=KERNEL_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCoord{X}))*computedWeight;
#else
blend+=texture2D(textureSampler,sampleCoord{X})*computedWeight;
#endif
`;
ShaderStore.IncludesShadersStore[name3] = shader3;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/kernelBlurFragment2.js
var name4 = "kernelBlurFragment2";
var shader4 = `#ifdef DOF
factor=sampleCoC(sampleCenter+delta*KERNEL_DEP_OFFSET{X});computedWeight=KERNEL_DEP_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_DEP_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X}))*computedWeight;
#else
blend+=texture2D(textureSampler,sampleCenter+delta*KERNEL_DEP_OFFSET{X})*computedWeight;
#endif
`;
ShaderStore.IncludesShadersStore[name4] = shader4;

// node_modules/@babylonjs/core/Shaders/kernelBlur.fragment.js
var name5 = "kernelBlurPixelShader";
var shader5 = `uniform sampler2D textureSampler;uniform vec2 delta;varying vec2 sampleCenter;
#ifdef DOF
uniform sampler2D circleOfConfusionSampler;float sampleCoC(in vec2 offset) {float coc=texture2D(circleOfConfusionSampler,offset).r;return coc; }
#endif
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float computedWeight=0.0;
#ifdef PACKEDFLOAT
float blend=0.;
#else
vec4 blend=vec4(0.);
#endif
#ifdef DOF
float sumOfWeights=CENTER_WEIGHT; 
float factor=0.0;
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter))*CENTER_WEIGHT;
#else
blend+=texture2D(textureSampler,sampleCenter)*CENTER_WEIGHT;
#endif
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
gl_FragColor=pack(blend);
#else
gl_FragColor=blend;
#endif
#ifdef DOF
gl_FragColor/=sumOfWeights;
#endif
}`;
ShaderStore.ShadersStore[name5] = shader5;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/kernelBlurVertex.js
var name6 = "kernelBlurVertex";
var shader6 = `sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`;
ShaderStore.IncludesShadersStore[name6] = shader6;

// node_modules/@babylonjs/core/Shaders/kernelBlur.vertex.js
var name7 = "kernelBlurVertexShader";
var shader7 = `attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`;
ShaderStore.ShadersStore[name7] = shader7;

// node_modules/@babylonjs/core/PostProcesses/blurPostProcess.js
var BlurPostProcess = class _BlurPostProcess extends PostProcess {
  /**
   * Sets the length in pixels of the blur sample region
   */
  set kernel(v) {
    if (this._idealKernel === v) {
      return;
    }
    v = Math.max(v, 1);
    this._idealKernel = v;
    this._kernel = this._nearestBestKernel(v);
    if (!this._blockCompilation) {
      this._updateParameters();
    }
  }
  /**
   * Gets the length in pixels of the blur sample region
   */
  get kernel() {
    return this._idealKernel;
  }
  /**
   * Sets whether or not the blur needs to unpack/repack floats
   */
  set packedFloat(v) {
    if (this._packedFloat === v) {
      return;
    }
    this._packedFloat = v;
    if (!this._blockCompilation) {
      this._updateParameters();
    }
  }
  /**
   * Gets whether or not the blur is unpacking/repacking floats
   */
  get packedFloat() {
    return this._packedFloat;
  }
  /**
   * Gets a string identifying the name of the class
   * @returns "BlurPostProcess" string
   */
  getClassName() {
    return "BlurPostProcess";
  }
  /**
   * Creates a new instance BlurPostProcess
   * @param name The name of the effect.
   * @param direction The direction in which to blur the image.
   * @param kernel The size of the kernel to be used when computing the blur. eg. Size of 3 will blur the center pixel by 2 pixels surrounding it.
   * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
   * @param camera The camera to apply the render pass to.
   * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
   * @param engine The engine which the post process will be applied. (default: current engine)
   * @param reusable If the post process can be reused on the same frame. (default: false)
   * @param textureType Type of textures used when performing the post process. (default: 0)
   * @param defines
   * @param _blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
   * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
   */
  constructor(name26, direction, kernel, options, camera, samplingMode = Texture.BILINEAR_SAMPLINGMODE, engine, reusable, textureType = 0, defines = "", _blockCompilation = false, textureFormat = 5) {
    super(name26, "kernelBlur", ["delta", "direction"], ["circleOfConfusionSampler"], options, camera, samplingMode, engine, reusable, null, textureType, "kernelBlur", { varyingCount: 0, depCount: 0 }, true, textureFormat);
    this._blockCompilation = _blockCompilation;
    this._packedFloat = false;
    this._staticDefines = "";
    this._staticDefines = defines;
    this.direction = direction;
    this.onApplyObservable.add((effect) => {
      if (this._outputTexture) {
        effect.setFloat2("delta", 1 / this._outputTexture.width * this.direction.x, 1 / this._outputTexture.height * this.direction.y);
      } else {
        effect.setFloat2("delta", 1 / this.width * this.direction.x, 1 / this.height * this.direction.y);
      }
    });
    this.kernel = kernel;
  }
  /**
   * Updates the effect with the current post process compile time values and recompiles the shader.
   * @param defines Define statements that should be added at the beginning of the shader. (default: null)
   * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
   * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
   * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
   * @param onCompiled Called when the shader has been compiled.
   * @param onError Called if there is an error when compiling a shader.
   */
  updateEffect(defines = null, uniforms = null, samplers = null, indexParameters, onCompiled, onError) {
    this._updateParameters(onCompiled, onError);
  }
  _updateParameters(onCompiled, onError) {
    const N = this._kernel;
    const centerIndex = (N - 1) / 2;
    let offsets = [];
    let weights = [];
    let totalWeight = 0;
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const w = this._gaussianWeight(u * 2 - 1);
      offsets[i] = i - centerIndex;
      weights[i] = w;
      totalWeight += w;
    }
    for (let i = 0; i < weights.length; i++) {
      weights[i] /= totalWeight;
    }
    const linearSamplingWeights = [];
    const linearSamplingOffsets = [];
    const linearSamplingMap = [];
    for (let i = 0; i <= centerIndex; i += 2) {
      const j = Math.min(i + 1, Math.floor(centerIndex));
      const singleCenterSample = i === j;
      if (singleCenterSample) {
        linearSamplingMap.push({ o: offsets[i], w: weights[i] });
      } else {
        const sharedCell = j === centerIndex;
        const weightLinear = weights[i] + weights[j] * (sharedCell ? 0.5 : 1);
        const offsetLinear = offsets[i] + 1 / (1 + weights[i] / weights[j]);
        if (offsetLinear === 0) {
          linearSamplingMap.push({ o: offsets[i], w: weights[i] });
          linearSamplingMap.push({ o: offsets[i + 1], w: weights[i + 1] });
        } else {
          linearSamplingMap.push({ o: offsetLinear, w: weightLinear });
          linearSamplingMap.push({ o: -offsetLinear, w: weightLinear });
        }
      }
    }
    for (let i = 0; i < linearSamplingMap.length; i++) {
      linearSamplingOffsets[i] = linearSamplingMap[i].o;
      linearSamplingWeights[i] = linearSamplingMap[i].w;
    }
    offsets = linearSamplingOffsets;
    weights = linearSamplingWeights;
    const maxVaryingRows = this.getEngine().getCaps().maxVaryingVectors;
    const freeVaryingVec2 = Math.max(maxVaryingRows, 0) - 1;
    let varyingCount = Math.min(offsets.length, freeVaryingVec2);
    let defines = "";
    defines += this._staticDefines;
    if (this._staticDefines.indexOf("DOF") != -1) {
      defines += `#define CENTER_WEIGHT ${this._glslFloat(weights[varyingCount - 1])}
`;
      varyingCount--;
    }
    for (let i = 0; i < varyingCount; i++) {
      defines += `#define KERNEL_OFFSET${i} ${this._glslFloat(offsets[i])}
`;
      defines += `#define KERNEL_WEIGHT${i} ${this._glslFloat(weights[i])}
`;
    }
    let depCount = 0;
    for (let i = freeVaryingVec2; i < offsets.length; i++) {
      defines += `#define KERNEL_DEP_OFFSET${depCount} ${this._glslFloat(offsets[i])}
`;
      defines += `#define KERNEL_DEP_WEIGHT${depCount} ${this._glslFloat(weights[i])}
`;
      depCount++;
    }
    if (this.packedFloat) {
      defines += `#define PACKEDFLOAT 1`;
    }
    this._blockCompilation = false;
    super.updateEffect(defines, null, null, {
      varyingCount,
      depCount
    }, onCompiled, onError);
  }
  /**
   * Best kernels are odd numbers that when divided by 2, their integer part is even, so 5, 9 or 13.
   * Other odd kernels optimize correctly but require proportionally more samples, even kernels are
   * possible but will produce minor visual artifacts. Since each new kernel requires a new shader we
   * want to minimize kernel changes, having gaps between physical kernels is helpful in that regard.
   * The gaps between physical kernels are compensated for in the weighting of the samples
   * @param idealKernel Ideal blur kernel.
   * @returns Nearest best kernel.
   */
  _nearestBestKernel(idealKernel) {
    const v = Math.round(idealKernel);
    for (const k of [v, v - 1, v + 1, v - 2, v + 2]) {
      if (k % 2 !== 0 && Math.floor(k / 2) % 2 === 0 && k > 0) {
        return Math.max(k, 3);
      }
    }
    return Math.max(v, 3);
  }
  /**
   * Calculates the value of a Gaussian distribution with sigma 3 at a given point.
   * @param x The point on the Gaussian distribution to sample.
   * @returns the value of the Gaussian function at x.
   */
  _gaussianWeight(x) {
    const sigma = 1 / 3;
    const denominator = Math.sqrt(2 * Math.PI) * sigma;
    const exponent = -(x * x / (2 * sigma * sigma));
    const weight = 1 / denominator * Math.exp(exponent);
    return weight;
  }
  /**
   * Generates a string that can be used as a floating point number in GLSL.
   * @param x Value to print.
   * @param decimalFigures Number of decimal places to print the number to (excluding trailing 0s).
   * @returns GLSL float string.
   */
  _glslFloat(x, decimalFigures = 8) {
    return x.toFixed(decimalFigures).replace(/0+$/, "");
  }
  /**
   * @internal
   */
  static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
    return SerializationHelper.Parse(() => {
      return new _BlurPostProcess(parsedPostProcess.name, parsedPostProcess.direction, parsedPostProcess.kernel, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, scene.getEngine(), parsedPostProcess.reusable, parsedPostProcess.textureType, void 0, false);
    }, parsedPostProcess, scene, rootUrl);
  }
};
__decorate([
  serialize("kernel")
], BlurPostProcess.prototype, "_kernel", void 0);
__decorate([
  serialize("packedFloat")
], BlurPostProcess.prototype, "_packedFloat", void 0);
__decorate([
  serializeAsVector2()
], BlurPostProcess.prototype, "direction", void 0);
RegisterClass("BABYLON.BlurPostProcess", BlurPostProcess);

// node_modules/@babylonjs/core/Shaders/ShadersInclude/bayerDitherFunctions.js
var name8 = "bayerDitherFunctions";
var shader8 = `float bayerDither2(vec2 _P) {return mod(2.0*_P.y+_P.x+1.0,4.0);}
float bayerDither4(vec2 _P) {vec2 P1=mod(_P,2.0); 
vec2 P2=floor(0.5*mod(_P,4.0)); 
return 4.0*bayerDither2(P1)+bayerDither2(P2);}
float bayerDither8(vec2 _P) {vec2 P1=mod(_P,2.0); 
vec2 P2=floor(0.5 *mod(_P,4.0)); 
vec2 P4=floor(0.25*mod(_P,8.0)); 
return 4.0*(4.0*bayerDither2(P1)+bayerDither2(P2))+bayerDither2(P4);}
`;
ShaderStore.IncludesShadersStore[name8] = shader8;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapFragmentExtraDeclaration.js
var name9 = "shadowMapFragmentExtraDeclaration";
var shader9 = `#if SM_FLOAT==0
#include<packingFunctions>
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#include<bayerDitherFunctions>
uniform float softTransparentShadowSM;
#endif
varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
uniform vec3 lightDataSM;varying vec3 vPositionWSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;
ShaderStore.IncludesShadersStore[name9] = shader9;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapFragment.js
var name10 = "shadowMapFragment";
var shader10 = `float depthSM=vDepthMetricSM;
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
#if SM_USEDISTANCE==1
depthSM=(length(vPositionWSM-lightDataSM)+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
depthSM=(-zSM+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
depthSM=(zSM+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#endif
#ifdef USE_REVERSE_DEPTHBUFFER
gl_FragDepth=clamp(1.0-depthSM,0.0,1.0);
#else
gl_FragDepth=clamp(depthSM,0.0,1.0); 
#endif
#elif SM_USEDISTANCE==1
depthSM=(length(vPositionWSM-lightDataSM)+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#if SM_ESM==1
depthSM=clamp(exp(-min(87.,biasAndScaleSM.z*depthSM)),0.,1.);
#endif
#if SM_FLOAT==1
gl_FragColor=vec4(depthSM,1.0,1.0,1.0);
#else
gl_FragColor=pack(depthSM);
#endif
return;`;
ShaderStore.IncludesShadersStore[name10] = shader10;

// node_modules/@babylonjs/core/Shaders/shadowMap.fragment.js
var name11 = "shadowMapPixelShader";
var shader11 = `#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
float alphaFromAlphaTexture=texture2D(diffuseSampler,vUV).a;
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE)
discard;
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM*alphaFromAlphaTexture) discard;
#else
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM) discard;
#endif
#endif
#include<shadowMapFragment>
}`;
ShaderStore.ShadersStore[name11] = shader11;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/sceneVertexDeclaration.js
var name12 = "sceneVertexDeclaration";
var shader12 = `uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
uniform mat4 view;uniform mat4 projection;uniform vec4 vEyePosition;
`;
ShaderStore.IncludesShadersStore[name12] = shader12;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/meshVertexDeclaration.js
var name13 = "meshVertexDeclaration";
var shader13 = `uniform mat4 world;uniform float visibility;
`;
ShaderStore.IncludesShadersStore[name13] = shader13;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapVertexDeclaration.js
var name14 = "shadowMapVertexDeclaration";
var shader14 = `#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`;
ShaderStore.IncludesShadersStore[name14] = shader14;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapUboDeclaration.js
var name15 = "shadowMapUboDeclaration";
var shader15 = `layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;
ShaderStore.IncludesShadersStore[name15] = shader15;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapVertexExtraDeclaration.js
var name16 = "shadowMapVertexExtraDeclaration";
var shader16 = `#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`;
ShaderStore.IncludesShadersStore[name16] = shader16;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapVertexNormalBias.js
var name17 = "shadowMapVertexNormalBias";
var shader17 = `#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`;
ShaderStore.IncludesShadersStore[name17] = shader17;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapVertexMetric.js
var name18 = "shadowMapVertexMetric";
var shader18 = `#if SM_USEDISTANCE==1
vPositionWSM=worldPos.xyz;
#endif
#if SM_DEPTHTEXTURE==1
#ifdef IS_NDC_HALF_ZRANGE
#define BIASFACTOR 0.5
#else
#define BIASFACTOR 1.0
#endif
#ifdef USE_REVERSE_DEPTHBUFFER
gl_Position.z-=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;
#else
gl_Position.z+=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;
#endif
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
zSM=gl_Position.z;gl_Position.z=0.0;
#elif SM_USEDISTANCE==0
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetricSM=(-gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
vDepthMetricSM=(gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name18] = shader18;

// node_modules/@babylonjs/core/Shaders/shadowMap.vertex.js
var name19 = "shadowMapVertexShader";
var shader19 = `attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`;
ShaderStore.ShadersStore[name19] = shader19;

// node_modules/@babylonjs/core/Shaders/depthBoxBlur.fragment.js
var name20 = "depthBoxBlurPixelShader";
var shader20 = `varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 colorDepth=vec4(0.0);for (int x=-OFFSET; x<=OFFSET; x++)
for (int y=-OFFSET; y<=OFFSET; y++)
colorDepth+=texture2D(textureSampler,vUV+vec2(x,y)/screenSize);gl_FragColor=(colorDepth/float((OFFSET*2+1)*(OFFSET*2+1)));}`;
ShaderStore.ShadersStore[name20] = shader20;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowMapFragmentSoftTransparentShadow.js
var name21 = "shadowMapFragmentSoftTransparentShadow";
var shader21 = `#if SM_SOFTTRANSPARENTSHADOW==1
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM*alpha) discard;
#endif
`;
ShaderStore.IncludesShadersStore[name21] = shader21;

// node_modules/@babylonjs/core/Lights/Shadows/shadowGenerator.js
var ShadowGenerator = class _ShadowGenerator {
  /**
   * Gets the bias: offset applied on the depth preventing acnea (in light direction).
   */
  get bias() {
    return this._bias;
  }
  /**
   * Sets the bias: offset applied on the depth preventing acnea (in light direction).
   */
  set bias(bias) {
    this._bias = bias;
  }
  /**
   * Gets the normalBias: offset applied on the depth preventing acnea (along side the normal direction and proportional to the light/normal angle).
   */
  get normalBias() {
    return this._normalBias;
  }
  /**
   * Sets the normalBias: offset applied on the depth preventing acnea (along side the normal direction and proportional to the light/normal angle).
   */
  set normalBias(normalBias) {
    this._normalBias = normalBias;
  }
  /**
   * Gets the blur box offset: offset applied during the blur pass.
   * Only useful if useKernelBlur = false
   */
  get blurBoxOffset() {
    return this._blurBoxOffset;
  }
  /**
   * Sets the blur box offset: offset applied during the blur pass.
   * Only useful if useKernelBlur = false
   */
  set blurBoxOffset(value) {
    if (this._blurBoxOffset === value) {
      return;
    }
    this._blurBoxOffset = value;
    this._disposeBlurPostProcesses();
  }
  /**
   * Gets the blur scale: scale of the blurred texture compared to the main shadow map.
   * 2 means half of the size.
   */
  get blurScale() {
    return this._blurScale;
  }
  /**
   * Sets the blur scale: scale of the blurred texture compared to the main shadow map.
   * 2 means half of the size.
   */
  set blurScale(value) {
    if (this._blurScale === value) {
      return;
    }
    this._blurScale = value;
    this._disposeBlurPostProcesses();
  }
  /**
   * Gets the blur kernel: kernel size of the blur pass.
   * Only useful if useKernelBlur = true
   */
  get blurKernel() {
    return this._blurKernel;
  }
  /**
   * Sets the blur kernel: kernel size of the blur pass.
   * Only useful if useKernelBlur = true
   */
  set blurKernel(value) {
    if (this._blurKernel === value) {
      return;
    }
    this._blurKernel = value;
    this._disposeBlurPostProcesses();
  }
  /**
   * Gets whether the blur pass is a kernel blur (if true) or box blur.
   * Only useful in filtered mode (useBlurExponentialShadowMap...)
   */
  get useKernelBlur() {
    return this._useKernelBlur;
  }
  /**
   * Sets whether the blur pass is a kernel blur (if true) or box blur.
   * Only useful in filtered mode (useBlurExponentialShadowMap...)
   */
  set useKernelBlur(value) {
    if (this._useKernelBlur === value) {
      return;
    }
    this._useKernelBlur = value;
    this._disposeBlurPostProcesses();
  }
  /**
   * Gets the depth scale used in ESM mode.
   */
  get depthScale() {
    return this._depthScale !== void 0 ? this._depthScale : this._light.getDepthScale();
  }
  /**
   * Sets the depth scale used in ESM mode.
   * This can override the scale stored on the light.
   */
  set depthScale(value) {
    this._depthScale = value;
  }
  _validateFilter(filter) {
    return filter;
  }
  /**
   * Gets the current mode of the shadow generator (normal, PCF, ESM...).
   * The returned value is a number equal to one of the available mode defined in ShadowMap.FILTER_x like _FILTER_NONE
   */
  get filter() {
    return this._filter;
  }
  /**
   * Sets the current mode of the shadow generator (normal, PCF, ESM...).
   * The returned value is a number equal to one of the available mode defined in ShadowMap.FILTER_x like _FILTER_NONE
   */
  set filter(value) {
    value = this._validateFilter(value);
    if (this._light.needCube()) {
      if (value === _ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP) {
        this.useExponentialShadowMap = true;
        return;
      } else if (value === _ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP) {
        this.useCloseExponentialShadowMap = true;
        return;
      } else if (value === _ShadowGenerator.FILTER_PCF || value === _ShadowGenerator.FILTER_PCSS) {
        this.usePoissonSampling = true;
        return;
      }
    }
    if (value === _ShadowGenerator.FILTER_PCF || value === _ShadowGenerator.FILTER_PCSS) {
      if (!this._scene.getEngine()._features.supportShadowSamplers) {
        this.usePoissonSampling = true;
        return;
      }
    }
    if (this._filter === value) {
      return;
    }
    this._filter = value;
    this._disposeBlurPostProcesses();
    this._applyFilterValues();
    this._light._markMeshesAsLightDirty();
  }
  /**
   * Gets if the current filter is set to Poisson Sampling.
   */
  get usePoissonSampling() {
    return this.filter === _ShadowGenerator.FILTER_POISSONSAMPLING;
  }
  /**
   * Sets the current filter to Poisson Sampling.
   */
  set usePoissonSampling(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_POISSONSAMPLING);
    if (!value && this.filter !== _ShadowGenerator.FILTER_POISSONSAMPLING) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets if the current filter is set to ESM.
   */
  get useExponentialShadowMap() {
    return this.filter === _ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP;
  }
  /**
   * Sets the current filter is to ESM.
   */
  set useExponentialShadowMap(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP);
    if (!value && this.filter !== _ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets if the current filter is set to filtered ESM.
   */
  get useBlurExponentialShadowMap() {
    return this.filter === _ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP;
  }
  /**
   * Gets if the current filter is set to filtered  ESM.
   */
  set useBlurExponentialShadowMap(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP);
    if (!value && this.filter !== _ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets if the current filter is set to "close ESM" (using the inverse of the
   * exponential to prevent steep falloff artifacts).
   */
  get useCloseExponentialShadowMap() {
    return this.filter === _ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP;
  }
  /**
   * Sets the current filter to "close ESM" (using the inverse of the
   * exponential to prevent steep falloff artifacts).
   */
  set useCloseExponentialShadowMap(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP);
    if (!value && this.filter !== _ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets if the current filter is set to filtered "close ESM" (using the inverse of the
   * exponential to prevent steep falloff artifacts).
   */
  get useBlurCloseExponentialShadowMap() {
    return this.filter === _ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP;
  }
  /**
   * Sets the current filter to filtered "close ESM" (using the inverse of the
   * exponential to prevent steep falloff artifacts).
   */
  set useBlurCloseExponentialShadowMap(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP);
    if (!value && this.filter !== _ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets if the current filter is set to "PCF" (percentage closer filtering).
   */
  get usePercentageCloserFiltering() {
    return this.filter === _ShadowGenerator.FILTER_PCF;
  }
  /**
   * Sets the current filter to "PCF" (percentage closer filtering).
   */
  set usePercentageCloserFiltering(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_PCF);
    if (!value && this.filter !== _ShadowGenerator.FILTER_PCF) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets the PCF or PCSS Quality.
   * Only valid if usePercentageCloserFiltering or usePercentageCloserFiltering is true.
   */
  get filteringQuality() {
    return this._filteringQuality;
  }
  /**
   * Sets the PCF or PCSS Quality.
   * Only valid if usePercentageCloserFiltering or usePercentageCloserFiltering is true.
   */
  set filteringQuality(filteringQuality) {
    if (this._filteringQuality === filteringQuality) {
      return;
    }
    this._filteringQuality = filteringQuality;
    this._disposeBlurPostProcesses();
    this._applyFilterValues();
    this._light._markMeshesAsLightDirty();
  }
  /**
   * Gets if the current filter is set to "PCSS" (contact hardening).
   */
  get useContactHardeningShadow() {
    return this.filter === _ShadowGenerator.FILTER_PCSS;
  }
  /**
   * Sets the current filter to "PCSS" (contact hardening).
   */
  set useContactHardeningShadow(value) {
    const filter = this._validateFilter(_ShadowGenerator.FILTER_PCSS);
    if (!value && this.filter !== _ShadowGenerator.FILTER_PCSS) {
      return;
    }
    this.filter = value ? filter : _ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets the Light Size (in shadow map uv unit) used in PCSS to determine the blocker search area and the penumbra size.
   * Using a ratio helps keeping shape stability independently of the map size.
   *
   * It does not account for the light projection as it was having too much
   * instability during the light setup or during light position changes.
   *
   * Only valid if useContactHardeningShadow is true.
   */
  get contactHardeningLightSizeUVRatio() {
    return this._contactHardeningLightSizeUVRatio;
  }
  /**
   * Sets the Light Size (in shadow map uv unit) used in PCSS to determine the blocker search area and the penumbra size.
   * Using a ratio helps keeping shape stability independently of the map size.
   *
   * It does not account for the light projection as it was having too much
   * instability during the light setup or during light position changes.
   *
   * Only valid if useContactHardeningShadow is true.
   */
  set contactHardeningLightSizeUVRatio(contactHardeningLightSizeUVRatio) {
    this._contactHardeningLightSizeUVRatio = contactHardeningLightSizeUVRatio;
  }
  /** Gets or sets the actual darkness of a shadow */
  get darkness() {
    return this._darkness;
  }
  set darkness(value) {
    this.setDarkness(value);
  }
  /**
   * Returns the darkness value (float). This can only decrease the actual darkness of a shadow.
   * 0 means strongest and 1 would means no shadow.
   * @returns the darkness.
   */
  getDarkness() {
    return this._darkness;
  }
  /**
   * Sets the darkness value (float). This can only decrease the actual darkness of a shadow.
   * @param darkness The darkness value 0 means strongest and 1 would means no shadow.
   * @returns the shadow generator allowing fluent coding.
   */
  setDarkness(darkness) {
    if (darkness >= 1) {
      this._darkness = 1;
    } else if (darkness <= 0) {
      this._darkness = 0;
    } else {
      this._darkness = darkness;
    }
    return this;
  }
  /** Gets or sets the ability to have transparent shadow  */
  get transparencyShadow() {
    return this._transparencyShadow;
  }
  set transparencyShadow(value) {
    this.setTransparencyShadow(value);
  }
  /**
   * Sets the ability to have transparent shadow (boolean).
   * @param transparent True if transparent else False
   * @returns the shadow generator allowing fluent coding
   */
  setTransparencyShadow(transparent) {
    this._transparencyShadow = transparent;
    return this;
  }
  /**
   * Gets the main RTT containing the shadow map (usually storing depth from the light point of view).
   * @returns The render target texture if present otherwise, null
   */
  getShadowMap() {
    return this._shadowMap;
  }
  /**
   * Gets the RTT used during rendering (can be a blurred version of the shadow map or the shadow map itself).
   * @returns The render target texture if the shadow map is present otherwise, null
   */
  getShadowMapForRendering() {
    if (this._shadowMap2) {
      return this._shadowMap2;
    }
    return this._shadowMap;
  }
  /**
   * Gets the class name of that object
   * @returns "ShadowGenerator"
   */
  getClassName() {
    return _ShadowGenerator.CLASSNAME;
  }
  /**
   * Helper function to add a mesh and its descendants to the list of shadow casters.
   * @param mesh Mesh to add
   * @param includeDescendants boolean indicating if the descendants should be added. Default to true
   * @returns the Shadow Generator itself
   */
  addShadowCaster(mesh, includeDescendants = true) {
    if (!this._shadowMap) {
      return this;
    }
    if (!this._shadowMap.renderList) {
      this._shadowMap.renderList = [];
    }
    if (this._shadowMap.renderList.indexOf(mesh) === -1) {
      this._shadowMap.renderList.push(mesh);
    }
    if (includeDescendants) {
      for (const childMesh of mesh.getChildMeshes()) {
        if (this._shadowMap.renderList.indexOf(childMesh) === -1) {
          this._shadowMap.renderList.push(childMesh);
        }
      }
    }
    return this;
  }
  /**
   * Helper function to remove a mesh and its descendants from the list of shadow casters
   * @param mesh Mesh to remove
   * @param includeDescendants boolean indicating if the descendants should be removed. Default to true
   * @returns the Shadow Generator itself
   */
  removeShadowCaster(mesh, includeDescendants = true) {
    if (!this._shadowMap || !this._shadowMap.renderList) {
      return this;
    }
    const index = this._shadowMap.renderList.indexOf(mesh);
    if (index !== -1) {
      this._shadowMap.renderList.splice(index, 1);
    }
    if (includeDescendants) {
      for (const child of mesh.getChildren()) {
        this.removeShadowCaster(child);
      }
    }
    return this;
  }
  /**
   * Returns the associated light object.
   * @returns the light generating the shadow
   */
  getLight() {
    return this._light;
  }
  _getCamera() {
    var _a;
    return (_a = this._camera) !== null && _a !== void 0 ? _a : this._scene.activeCamera;
  }
  /**
   * Gets or sets the size of the texture what stores the shadows
   */
  get mapSize() {
    return this._mapSize;
  }
  set mapSize(size) {
    this._mapSize = size;
    this._light._markMeshesAsLightDirty();
    this.recreateShadowMap();
  }
  /**
   * Creates a ShadowGenerator object.
   * A ShadowGenerator is the required tool to use the shadows.
   * Each light casting shadows needs to use its own ShadowGenerator.
   * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows
   * @param mapSize The size of the texture what stores the shadows. Example : 1024.
   * @param light The light object generating the shadows.
   * @param usefullFloatFirst By default the generator will try to use half float textures but if you need precision (for self shadowing for instance), you can use this option to enforce full float texture.
   * @param camera Camera associated with this shadow generator (default: null). If null, takes the scene active camera at the time we need to access it
   * @param useRedTextureType Forces the generator to use a Red instead of a RGBA type for the shadow map texture format (default: false)
   */
  constructor(mapSize, light, usefullFloatFirst, camera, useRedTextureType) {
    this.onBeforeShadowMapRenderObservable = new Observable();
    this.onAfterShadowMapRenderObservable = new Observable();
    this.onBeforeShadowMapRenderMeshObservable = new Observable();
    this.onAfterShadowMapRenderMeshObservable = new Observable();
    this._bias = 5e-5;
    this._normalBias = 0;
    this._blurBoxOffset = 1;
    this._blurScale = 2;
    this._blurKernel = 1;
    this._useKernelBlur = false;
    this._filter = _ShadowGenerator.FILTER_NONE;
    this._filteringQuality = _ShadowGenerator.QUALITY_HIGH;
    this._contactHardeningLightSizeUVRatio = 0.1;
    this._darkness = 0;
    this._transparencyShadow = false;
    this.enableSoftTransparentShadow = false;
    this.useOpacityTextureForTransparentShadow = false;
    this.frustumEdgeFalloff = 0;
    this.forceBackFacesOnly = false;
    this._lightDirection = Vector3.Zero();
    this._viewMatrix = Matrix.Zero();
    this._projectionMatrix = Matrix.Zero();
    this._transformMatrix = Matrix.Zero();
    this._cachedPosition = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._cachedDirection = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._currentFaceIndex = 0;
    this._currentFaceIndexCache = 0;
    this._defaultTextureMatrix = Matrix.Identity();
    this._mapSize = mapSize;
    this._light = light;
    this._scene = light.getScene();
    this._camera = camera !== null && camera !== void 0 ? camera : null;
    this._useRedTextureType = !!useRedTextureType;
    let shadowGenerators = light._shadowGenerators;
    if (!shadowGenerators) {
      shadowGenerators = light._shadowGenerators = /* @__PURE__ */ new Map();
    }
    shadowGenerators.set(this._camera, this);
    this.id = light.id;
    this._useUBO = this._scene.getEngine().supportsUniformBuffers;
    if (this._useUBO) {
      this._sceneUBOs = [];
      this._sceneUBOs.push(this._scene.createSceneUniformBuffer(`Scene for Shadow Generator (light "${this._light.name}")`));
    }
    _ShadowGenerator._SceneComponentInitialization(this._scene);
    const caps = this._scene.getEngine().getCaps();
    if (!usefullFloatFirst) {
      if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
        this._textureType = 2;
      } else if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
        this._textureType = 1;
      } else {
        this._textureType = 0;
      }
    } else {
      if (caps.textureFloatRender && caps.textureFloatLinearFiltering) {
        this._textureType = 1;
      } else if (caps.textureHalfFloatRender && caps.textureHalfFloatLinearFiltering) {
        this._textureType = 2;
      } else {
        this._textureType = 0;
      }
    }
    this._initializeGenerator();
    this._applyFilterValues();
  }
  _initializeGenerator() {
    this._light._markMeshesAsLightDirty();
    this._initializeShadowMap();
  }
  _createTargetRenderTexture() {
    const engine = this._scene.getEngine();
    if (engine._features.supportDepthStencilTexture) {
      this._shadowMap = new RenderTargetTexture(this._light.name + "_shadowMap", this._mapSize, this._scene, false, true, this._textureType, this._light.needCube(), void 0, false, false, void 0, this._useRedTextureType ? 6 : 5);
      this._shadowMap.createDepthStencilTexture(engine.useReverseDepthBuffer ? 516 : 513, true);
    } else {
      this._shadowMap = new RenderTargetTexture(this._light.name + "_shadowMap", this._mapSize, this._scene, false, true, this._textureType, this._light.needCube());
    }
    this._shadowMap.noPrePassRenderer = true;
  }
  _initializeShadowMap() {
    this._createTargetRenderTexture();
    if (this._shadowMap === null) {
      return;
    }
    this._shadowMap.wrapU = Texture.CLAMP_ADDRESSMODE;
    this._shadowMap.wrapV = Texture.CLAMP_ADDRESSMODE;
    this._shadowMap.anisotropicFilteringLevel = 1;
    this._shadowMap.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
    this._shadowMap.renderParticles = false;
    this._shadowMap.ignoreCameraViewport = true;
    if (this._storedUniqueId) {
      this._shadowMap.uniqueId = this._storedUniqueId;
    }
    this._shadowMap.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => this._renderForShadowMap(opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes);
    this._shadowMap.customIsReadyFunction = () => {
      return true;
    };
    const engine = this._scene.getEngine();
    this._shadowMap.onBeforeBindObservable.add(() => {
      var _a;
      this._currentSceneUBO = this._scene.getSceneUniformBuffer();
      (_a = engine._debugPushGroup) === null || _a === void 0 ? void 0 : _a.call(engine, `shadow map generation for pass id ${engine.currentRenderPassId}`, 1);
    });
    this._shadowMap.onBeforeRenderObservable.add((faceIndex) => {
      if (this._sceneUBOs) {
        this._scene.setSceneUniformBuffer(this._sceneUBOs[0]);
      }
      this._currentFaceIndex = faceIndex;
      if (this._filter === _ShadowGenerator.FILTER_PCF) {
        engine.setColorWrite(false);
      }
      this.getTransformMatrix();
      this._scene.setTransformMatrix(this._viewMatrix, this._projectionMatrix);
      if (this._useUBO) {
        this._scene.getSceneUniformBuffer().unbindEffect();
        this._scene.finalizeSceneUbo();
      }
    });
    this._shadowMap.onAfterUnbindObservable.add(() => {
      var _a, _b;
      if (this._sceneUBOs) {
        this._scene.setSceneUniformBuffer(this._currentSceneUBO);
      }
      this._scene.updateTransformMatrix();
      if (this._filter === _ShadowGenerator.FILTER_PCF) {
        engine.setColorWrite(true);
      }
      if (!this.useBlurExponentialShadowMap && !this.useBlurCloseExponentialShadowMap) {
        (_a = engine._debugPopGroup) === null || _a === void 0 ? void 0 : _a.call(engine, 1);
        return;
      }
      const shadowMap = this.getShadowMapForRendering();
      if (shadowMap) {
        this._scene.postProcessManager.directRender(this._blurPostProcesses, shadowMap.renderTarget, true);
        engine.unBindFramebuffer(shadowMap.renderTarget, true);
        (_b = engine._debugPopGroup) === null || _b === void 0 ? void 0 : _b.call(engine, 1);
      }
    });
    const clearZero = new Color4(0, 0, 0, 0);
    const clearOne = new Color4(1, 1, 1, 1);
    this._shadowMap.onClearObservable.add((engine2) => {
      if (this._filter === _ShadowGenerator.FILTER_PCF) {
        engine2.clear(clearOne, false, true, false);
      } else if (this.useExponentialShadowMap || this.useBlurExponentialShadowMap) {
        engine2.clear(clearZero, true, true, false);
      } else {
        engine2.clear(clearOne, true, true, false);
      }
    });
    this._shadowMap.onResizeObservable.add((rtt) => {
      this._storedUniqueId = this._shadowMap.uniqueId;
      this._mapSize = rtt.getRenderSize();
      this._light._markMeshesAsLightDirty();
      this.recreateShadowMap();
    });
    for (let i = RenderingManager.MIN_RENDERINGGROUPS; i < RenderingManager.MAX_RENDERINGGROUPS; i++) {
      this._shadowMap.setRenderingAutoClearDepthStencil(i, false);
    }
  }
  _initializeBlurRTTAndPostProcesses() {
    const engine = this._scene.getEngine();
    const targetSize = this._mapSize / this.blurScale;
    if (!this.useKernelBlur || this.blurScale !== 1) {
      this._shadowMap2 = new RenderTargetTexture(this._light.name + "_shadowMap2", targetSize, this._scene, false, true, this._textureType, void 0, void 0, false);
      this._shadowMap2.wrapU = Texture.CLAMP_ADDRESSMODE;
      this._shadowMap2.wrapV = Texture.CLAMP_ADDRESSMODE;
      this._shadowMap2.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
    }
    if (this.useKernelBlur) {
      this._kernelBlurXPostprocess = new BlurPostProcess(this._light.name + "KernelBlurX", new Vector2(1, 0), this.blurKernel, 1, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, this._textureType);
      this._kernelBlurXPostprocess.width = targetSize;
      this._kernelBlurXPostprocess.height = targetSize;
      this._kernelBlurXPostprocess.externalTextureSamplerBinding = true;
      this._kernelBlurXPostprocess.onApplyObservable.add((effect) => {
        effect.setTexture("textureSampler", this._shadowMap);
      });
      this._kernelBlurYPostprocess = new BlurPostProcess(this._light.name + "KernelBlurY", new Vector2(0, 1), this.blurKernel, 1, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, this._textureType);
      this._kernelBlurXPostprocess.autoClear = false;
      this._kernelBlurYPostprocess.autoClear = false;
      if (this._textureType === 0) {
        this._kernelBlurXPostprocess.packedFloat = true;
        this._kernelBlurYPostprocess.packedFloat = true;
      }
      this._blurPostProcesses = [this._kernelBlurXPostprocess, this._kernelBlurYPostprocess];
    } else {
      this._boxBlurPostprocess = new PostProcess(this._light.name + "DepthBoxBlur", "depthBoxBlur", ["screenSize", "boxOffset"], [], 1, null, Texture.BILINEAR_SAMPLINGMODE, engine, false, "#define OFFSET " + this._blurBoxOffset, this._textureType);
      this._boxBlurPostprocess.externalTextureSamplerBinding = true;
      this._boxBlurPostprocess.onApplyObservable.add((effect) => {
        effect.setFloat2("screenSize", targetSize, targetSize);
        effect.setTexture("textureSampler", this._shadowMap);
      });
      this._boxBlurPostprocess.autoClear = false;
      this._blurPostProcesses = [this._boxBlurPostprocess];
    }
  }
  _renderForShadowMap(opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) {
    let index;
    if (depthOnlySubMeshes.length) {
      for (index = 0; index < depthOnlySubMeshes.length; index++) {
        this._renderSubMeshForShadowMap(depthOnlySubMeshes.data[index]);
      }
    }
    for (index = 0; index < opaqueSubMeshes.length; index++) {
      this._renderSubMeshForShadowMap(opaqueSubMeshes.data[index]);
    }
    for (index = 0; index < alphaTestSubMeshes.length; index++) {
      this._renderSubMeshForShadowMap(alphaTestSubMeshes.data[index]);
    }
    if (this._transparencyShadow) {
      for (index = 0; index < transparentSubMeshes.length; index++) {
        this._renderSubMeshForShadowMap(transparentSubMeshes.data[index], true);
      }
    } else {
      for (index = 0; index < transparentSubMeshes.length; index++) {
        transparentSubMeshes.data[index].getEffectiveMesh()._internalAbstractMeshDataInfo._isActiveIntermediate = false;
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _bindCustomEffectForRenderSubMeshForShadowMap(subMesh, effect, mesh) {
    effect.setMatrix("viewProjection", this.getTransformMatrix());
  }
  _renderSubMeshForShadowMap(subMesh, isTransparent = false) {
    var _a, _b;
    const renderingMesh = subMesh.getRenderingMesh();
    const effectiveMesh = subMesh.getEffectiveMesh();
    const scene = this._scene;
    const engine = scene.getEngine();
    const material = subMesh.getMaterial();
    effectiveMesh._internalAbstractMeshDataInfo._isActiveIntermediate = false;
    if (!material || subMesh.verticesCount === 0 || subMesh._renderId === scene.getRenderId()) {
      return;
    }
    const detNeg = effectiveMesh._getWorldMatrixDeterminant() < 0;
    let sideOrientation = (_a = renderingMesh.overrideMaterialSideOrientation) !== null && _a !== void 0 ? _a : material.sideOrientation;
    if (detNeg) {
      sideOrientation = sideOrientation === 0 ? 1 : 0;
    }
    const reverseSideOrientation = sideOrientation === 0;
    engine.setState(material.backFaceCulling, void 0, void 0, reverseSideOrientation, material.cullBackFaces);
    const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
    if (batch.mustReturn) {
      return;
    }
    const hardwareInstancedRendering = engine.getCaps().instancedArrays && (batch.visibleInstances[subMesh._id] !== null && batch.visibleInstances[subMesh._id] !== void 0 || renderingMesh.hasThinInstances);
    if (this.customAllowRendering && !this.customAllowRendering(subMesh)) {
      return;
    }
    if (this.isReady(subMesh, hardwareInstancedRendering, isTransparent)) {
      subMesh._renderId = scene.getRenderId();
      const shadowDepthWrapper = material.shadowDepthWrapper;
      const drawWrapper = (_b = shadowDepthWrapper === null || shadowDepthWrapper === void 0 ? void 0 : shadowDepthWrapper.getEffect(subMesh, this, engine.currentRenderPassId)) !== null && _b !== void 0 ? _b : subMesh._getDrawWrapper();
      const effect = DrawWrapper.GetEffect(drawWrapper);
      engine.enableEffect(drawWrapper);
      if (!hardwareInstancedRendering) {
        renderingMesh._bind(subMesh, effect, material.fillMode);
      }
      this.getTransformMatrix();
      effect.setFloat3("biasAndScaleSM", this.bias, this.normalBias, this.depthScale);
      if (this.getLight().getTypeID() === Light.LIGHTTYPEID_DIRECTIONALLIGHT) {
        effect.setVector3("lightDataSM", this._cachedDirection);
      } else {
        effect.setVector3("lightDataSM", this._cachedPosition);
      }
      const camera = this._getCamera();
      if (camera) {
        effect.setFloat2("depthValuesSM", this.getLight().getDepthMinZ(camera), this.getLight().getDepthMinZ(camera) + this.getLight().getDepthMaxZ(camera));
      }
      if (isTransparent && this.enableSoftTransparentShadow) {
        effect.setFloat("softTransparentShadowSM", effectiveMesh.visibility * material.alpha);
      }
      if (shadowDepthWrapper) {
        subMesh._setMainDrawWrapperOverride(drawWrapper);
        if (shadowDepthWrapper.standalone) {
          shadowDepthWrapper.baseMaterial.bindForSubMesh(effectiveMesh.getWorldMatrix(), renderingMesh, subMesh);
        } else {
          material.bindForSubMesh(effectiveMesh.getWorldMatrix(), renderingMesh, subMesh);
        }
        subMesh._setMainDrawWrapperOverride(null);
      } else {
        if (this._opacityTexture) {
          effect.setTexture("diffuseSampler", this._opacityTexture);
          effect.setMatrix("diffuseMatrix", this._opacityTexture.getTextureMatrix() || this._defaultTextureMatrix);
        }
        if (renderingMesh.useBones && renderingMesh.computeBonesUsingShaders && renderingMesh.skeleton) {
          const skeleton = renderingMesh.skeleton;
          if (skeleton.isUsingTextureForMatrices) {
            const boneTexture = skeleton.getTransformMatrixTexture(renderingMesh);
            if (!boneTexture) {
              return;
            }
            effect.setTexture("boneSampler", boneTexture);
            effect.setFloat("boneTextureWidth", 4 * (skeleton.bones.length + 1));
          } else {
            effect.setMatrices("mBones", skeleton.getTransformMatrices(renderingMesh));
          }
        }
        MaterialHelper.BindMorphTargetParameters(renderingMesh, effect);
        if (renderingMesh.morphTargetManager && renderingMesh.morphTargetManager.isUsingTextureForTargets) {
          renderingMesh.morphTargetManager._bind(effect);
        }
        bindClipPlane(effect, material, scene);
      }
      if (!this._useUBO && !shadowDepthWrapper) {
        this._bindCustomEffectForRenderSubMeshForShadowMap(subMesh, effect, effectiveMesh);
      }
      MaterialHelper.BindSceneUniformBuffer(effect, this._scene.getSceneUniformBuffer());
      this._scene.getSceneUniformBuffer().bindUniformBuffer();
      const world = effectiveMesh.getWorldMatrix();
      if (hardwareInstancedRendering) {
        effectiveMesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
        effectiveMesh.transferToEffect(world);
      }
      if (this.forceBackFacesOnly) {
        engine.setState(true, 0, false, true, material.cullBackFaces);
      }
      this.onBeforeShadowMapRenderMeshObservable.notifyObservers(renderingMesh);
      this.onBeforeShadowMapRenderObservable.notifyObservers(effect);
      renderingMesh._processRendering(effectiveMesh, subMesh, effect, material.fillMode, batch, hardwareInstancedRendering, (isInstance, worldOverride) => {
        if (effectiveMesh !== renderingMesh && !isInstance) {
          renderingMesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
          renderingMesh.transferToEffect(worldOverride);
        } else {
          effectiveMesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
          effectiveMesh.transferToEffect(isInstance ? worldOverride : world);
        }
      });
      if (this.forceBackFacesOnly) {
        engine.setState(true, 0, false, false, material.cullBackFaces);
      }
      this.onAfterShadowMapRenderObservable.notifyObservers(effect);
      this.onAfterShadowMapRenderMeshObservable.notifyObservers(renderingMesh);
    } else {
      if (this._shadowMap) {
        this._shadowMap.resetRefreshCounter();
      }
    }
  }
  _applyFilterValues() {
    if (!this._shadowMap) {
      return;
    }
    if (this.filter === _ShadowGenerator.FILTER_NONE || this.filter === _ShadowGenerator.FILTER_PCSS) {
      this._shadowMap.updateSamplingMode(Texture.NEAREST_SAMPLINGMODE);
    } else {
      this._shadowMap.updateSamplingMode(Texture.BILINEAR_SAMPLINGMODE);
    }
  }
  /**
   * Forces all the attached effect to compile to enable rendering only once ready vs. lazily compiling effects.
   * @param onCompiled Callback triggered at the and of the effects compilation
   * @param options Sets of optional options forcing the compilation with different modes
   */
  forceCompilation(onCompiled, options) {
    const localOptions = Object.assign({ useInstances: false }, options);
    const shadowMap = this.getShadowMap();
    if (!shadowMap) {
      if (onCompiled) {
        onCompiled(this);
      }
      return;
    }
    const renderList = shadowMap.renderList;
    if (!renderList) {
      if (onCompiled) {
        onCompiled(this);
      }
      return;
    }
    const subMeshes = [];
    for (const mesh of renderList) {
      subMeshes.push(...mesh.subMeshes);
    }
    if (subMeshes.length === 0) {
      if (onCompiled) {
        onCompiled(this);
      }
      return;
    }
    let currentIndex = 0;
    const checkReady = () => {
      var _a, _b;
      if (!this._scene || !this._scene.getEngine()) {
        return;
      }
      while (this.isReady(subMeshes[currentIndex], localOptions.useInstances, (_b = (_a = subMeshes[currentIndex].getMaterial()) === null || _a === void 0 ? void 0 : _a.needAlphaBlendingForMesh(subMeshes[currentIndex].getMesh())) !== null && _b !== void 0 ? _b : false)) {
        currentIndex++;
        if (currentIndex >= subMeshes.length) {
          if (onCompiled) {
            onCompiled(this);
          }
          return;
        }
      }
      setTimeout(checkReady, 16);
    };
    checkReady();
  }
  /**
   * Forces all the attached effect to compile to enable rendering only once ready vs. lazily compiling effects.
   * @param options Sets of optional options forcing the compilation with different modes
   * @returns A promise that resolves when the compilation completes
   */
  forceCompilationAsync(options) {
    return new Promise((resolve) => {
      this.forceCompilation(() => {
        resolve();
      }, options);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _isReadyCustomDefines(defines, subMesh, useInstances) {
  }
  _prepareShadowDefines(subMesh, useInstances, defines, isTransparent) {
    defines.push("#define SM_LIGHTTYPE_" + this._light.getClassName().toUpperCase());
    defines.push("#define SM_FLOAT " + (this._textureType !== 0 ? "1" : "0"));
    defines.push("#define SM_ESM " + (this.useExponentialShadowMap || this.useBlurExponentialShadowMap ? "1" : "0"));
    defines.push("#define SM_DEPTHTEXTURE " + (this.usePercentageCloserFiltering || this.useContactHardeningShadow ? "1" : "0"));
    const mesh = subMesh.getMesh();
    defines.push("#define SM_NORMALBIAS " + (this.normalBias && mesh.isVerticesDataPresent(VertexBuffer.NormalKind) ? "1" : "0"));
    defines.push("#define SM_DIRECTIONINLIGHTDATA " + (this.getLight().getTypeID() === Light.LIGHTTYPEID_DIRECTIONALLIGHT ? "1" : "0"));
    defines.push("#define SM_USEDISTANCE " + (this._light.needCube() ? "1" : "0"));
    defines.push("#define SM_SOFTTRANSPARENTSHADOW " + (this.enableSoftTransparentShadow && isTransparent ? "1" : "0"));
    this._isReadyCustomDefines(defines, subMesh, useInstances);
    return defines;
  }
  /**
   * Determine whether the shadow generator is ready or not (mainly all effects and related post processes needs to be ready).
   * @param subMesh The submesh we want to render in the shadow map
   * @param useInstances Defines whether will draw in the map using instances
   * @param isTransparent Indicates that isReady is called for a transparent subMesh
   * @returns true if ready otherwise, false
   */
  isReady(subMesh, useInstances, isTransparent) {
    var _a;
    const material = subMesh.getMaterial(), shadowDepthWrapper = material === null || material === void 0 ? void 0 : material.shadowDepthWrapper;
    this._opacityTexture = null;
    if (!material) {
      return false;
    }
    const defines = [];
    this._prepareShadowDefines(subMesh, useInstances, defines, isTransparent);
    if (shadowDepthWrapper) {
      if (!shadowDepthWrapper.isReadyForSubMesh(subMesh, defines, this, useInstances, this._scene.getEngine().currentRenderPassId)) {
        return false;
      }
    } else {
      const subMeshEffect = subMesh._getDrawWrapper(void 0, true);
      let effect = subMeshEffect.effect;
      let cachedDefines = subMeshEffect.defines;
      const attribs = [VertexBuffer.PositionKind];
      const mesh = subMesh.getMesh();
      if (this.normalBias && mesh.isVerticesDataPresent(VertexBuffer.NormalKind)) {
        attribs.push(VertexBuffer.NormalKind);
        defines.push("#define NORMAL");
        if (mesh.nonUniformScaling) {
          defines.push("#define NONUNIFORMSCALING");
        }
      }
      const needAlphaTesting = material.needAlphaTesting();
      if (needAlphaTesting || material.needAlphaBlending()) {
        if (this.useOpacityTextureForTransparentShadow) {
          this._opacityTexture = material.opacityTexture;
        } else {
          this._opacityTexture = material.getAlphaTestTexture();
        }
        if (this._opacityTexture) {
          if (!this._opacityTexture.isReady()) {
            return false;
          }
          const alphaCutOff = (_a = material.alphaCutOff) !== null && _a !== void 0 ? _a : _ShadowGenerator.DEFAULT_ALPHA_CUTOFF;
          defines.push("#define ALPHATEXTURE");
          if (needAlphaTesting) {
            defines.push(`#define ALPHATESTVALUE ${alphaCutOff}${alphaCutOff % 1 === 0 ? "." : ""}`);
          }
          if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
            attribs.push(VertexBuffer.UVKind);
            defines.push("#define UV1");
          }
          if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
            if (this._opacityTexture.coordinatesIndex === 1) {
              attribs.push(VertexBuffer.UV2Kind);
              defines.push("#define UV2");
            }
          }
        }
      }
      const fallbacks = new EffectFallbacks();
      if (mesh.useBones && mesh.computeBonesUsingShaders && mesh.skeleton) {
        attribs.push(VertexBuffer.MatricesIndicesKind);
        attribs.push(VertexBuffer.MatricesWeightsKind);
        if (mesh.numBoneInfluencers > 4) {
          attribs.push(VertexBuffer.MatricesIndicesExtraKind);
          attribs.push(VertexBuffer.MatricesWeightsExtraKind);
        }
        const skeleton = mesh.skeleton;
        defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
        if (mesh.numBoneInfluencers > 0) {
          fallbacks.addCPUSkinningFallback(0, mesh);
        }
        if (skeleton.isUsingTextureForMatrices) {
          defines.push("#define BONETEXTURE");
        } else {
          defines.push("#define BonesPerMesh " + (skeleton.bones.length + 1));
        }
      } else {
        defines.push("#define NUM_BONE_INFLUENCERS 0");
      }
      const manager = mesh.morphTargetManager;
      let morphInfluencers = 0;
      if (manager) {
        if (manager.numInfluencers > 0) {
          defines.push("#define MORPHTARGETS");
          morphInfluencers = manager.numInfluencers;
          defines.push("#define NUM_MORPH_INFLUENCERS " + morphInfluencers);
          if (manager.isUsingTextureForTargets) {
            defines.push("#define MORPHTARGETS_TEXTURE");
          }
          MaterialHelper.PrepareAttributesForMorphTargetsInfluencers(attribs, mesh, morphInfluencers);
        }
      }
      prepareStringDefinesForClipPlanes(material, this._scene, defines);
      if (useInstances) {
        defines.push("#define INSTANCES");
        MaterialHelper.PushAttributesForInstances(attribs);
        if (subMesh.getRenderingMesh().hasThinInstances) {
          defines.push("#define THIN_INSTANCES");
        }
      }
      if (this.customShaderOptions) {
        if (this.customShaderOptions.defines) {
          for (const define of this.customShaderOptions.defines) {
            if (defines.indexOf(define) === -1) {
              defines.push(define);
            }
          }
        }
      }
      const join = defines.join("\n");
      if (cachedDefines !== join) {
        cachedDefines = join;
        let shaderName = "shadowMap";
        const uniforms = [
          "world",
          "mBones",
          "viewProjection",
          "diffuseMatrix",
          "lightDataSM",
          "depthValuesSM",
          "biasAndScaleSM",
          "morphTargetInfluences",
          "boneTextureWidth",
          "softTransparentShadowSM",
          "morphTargetTextureInfo",
          "morphTargetTextureIndices"
        ];
        const samplers = ["diffuseSampler", "boneSampler", "morphTargets"];
        const uniformBuffers = ["Scene", "Mesh"];
        addClipPlaneUniforms(uniforms);
        if (this.customShaderOptions) {
          shaderName = this.customShaderOptions.shaderName;
          if (this.customShaderOptions.attributes) {
            for (const attrib of this.customShaderOptions.attributes) {
              if (attribs.indexOf(attrib) === -1) {
                attribs.push(attrib);
              }
            }
          }
          if (this.customShaderOptions.uniforms) {
            for (const uniform of this.customShaderOptions.uniforms) {
              if (uniforms.indexOf(uniform) === -1) {
                uniforms.push(uniform);
              }
            }
          }
          if (this.customShaderOptions.samplers) {
            for (const sampler of this.customShaderOptions.samplers) {
              if (samplers.indexOf(sampler) === -1) {
                samplers.push(sampler);
              }
            }
          }
        }
        const engine = this._scene.getEngine();
        effect = engine.createEffect(shaderName, {
          attributes: attribs,
          uniformsNames: uniforms,
          uniformBuffersNames: uniformBuffers,
          samplers,
          defines: join,
          fallbacks,
          onCompiled: null,
          onError: null,
          indexParameters: { maxSimultaneousMorphTargets: morphInfluencers }
        }, engine);
        subMeshEffect.setEffect(effect, cachedDefines);
      }
      if (!effect.isReady()) {
        return false;
      }
    }
    if (this.useBlurExponentialShadowMap || this.useBlurCloseExponentialShadowMap) {
      if (!this._blurPostProcesses || !this._blurPostProcesses.length) {
        this._initializeBlurRTTAndPostProcesses();
      }
    }
    if (this._kernelBlurXPostprocess && !this._kernelBlurXPostprocess.isReady()) {
      return false;
    }
    if (this._kernelBlurYPostprocess && !this._kernelBlurYPostprocess.isReady()) {
      return false;
    }
    if (this._boxBlurPostprocess && !this._boxBlurPostprocess.isReady()) {
      return false;
    }
    return true;
  }
  /**
   * Prepare all the defines in a material relying on a shadow map at the specified light index.
   * @param defines Defines of the material we want to update
   * @param lightIndex Index of the light in the enabled light list of the material
   */
  prepareDefines(defines, lightIndex) {
    const scene = this._scene;
    const light = this._light;
    if (!scene.shadowsEnabled || !light.shadowEnabled) {
      return;
    }
    defines["SHADOW" + lightIndex] = true;
    if (this.useContactHardeningShadow) {
      defines["SHADOWPCSS" + lightIndex] = true;
      if (this._filteringQuality === _ShadowGenerator.QUALITY_LOW) {
        defines["SHADOWLOWQUALITY" + lightIndex] = true;
      } else if (this._filteringQuality === _ShadowGenerator.QUALITY_MEDIUM) {
        defines["SHADOWMEDIUMQUALITY" + lightIndex] = true;
      }
    } else if (this.usePercentageCloserFiltering) {
      defines["SHADOWPCF" + lightIndex] = true;
      if (this._filteringQuality === _ShadowGenerator.QUALITY_LOW) {
        defines["SHADOWLOWQUALITY" + lightIndex] = true;
      } else if (this._filteringQuality === _ShadowGenerator.QUALITY_MEDIUM) {
        defines["SHADOWMEDIUMQUALITY" + lightIndex] = true;
      }
    } else if (this.usePoissonSampling) {
      defines["SHADOWPOISSON" + lightIndex] = true;
    } else if (this.useExponentialShadowMap || this.useBlurExponentialShadowMap) {
      defines["SHADOWESM" + lightIndex] = true;
    } else if (this.useCloseExponentialShadowMap || this.useBlurCloseExponentialShadowMap) {
      defines["SHADOWCLOSEESM" + lightIndex] = true;
    }
    if (light.needCube()) {
      defines["SHADOWCUBE" + lightIndex] = true;
    }
  }
  /**
   * Binds the shadow related information inside of an effect (information like near, far, darkness...
   * defined in the generator but impacting the effect).
   * @param lightIndex Index of the light in the enabled light list of the material owning the effect
   * @param effect The effect we are binding the information for
   */
  bindShadowLight(lightIndex, effect) {
    const light = this._light;
    const scene = this._scene;
    if (!scene.shadowsEnabled || !light.shadowEnabled) {
      return;
    }
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    const shadowMap = this.getShadowMap();
    if (!shadowMap) {
      return;
    }
    if (!light.needCube()) {
      effect.setMatrix("lightMatrix" + lightIndex, this.getTransformMatrix());
    }
    if (this._filter === _ShadowGenerator.FILTER_PCF) {
      effect.setDepthStencilTexture("shadowSampler" + lightIndex, this.getShadowMapForRendering());
      light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), shadowMap.getSize().width, 1 / shadowMap.getSize().width, this.frustumEdgeFalloff, lightIndex);
    } else if (this._filter === _ShadowGenerator.FILTER_PCSS) {
      effect.setDepthStencilTexture("shadowSampler" + lightIndex, this.getShadowMapForRendering());
      effect.setTexture("depthSampler" + lightIndex, this.getShadowMapForRendering());
      light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), 1 / shadowMap.getSize().width, this._contactHardeningLightSizeUVRatio * shadowMap.getSize().width, this.frustumEdgeFalloff, lightIndex);
    } else {
      effect.setTexture("shadowSampler" + lightIndex, this.getShadowMapForRendering());
      light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), this.blurScale / shadowMap.getSize().width, this.depthScale, this.frustumEdgeFalloff, lightIndex);
    }
    light._uniformBuffer.updateFloat2("depthValues", this.getLight().getDepthMinZ(camera), this.getLight().getDepthMinZ(camera) + this.getLight().getDepthMaxZ(camera), lightIndex);
  }
  /**
   * Gets the view matrix used to render the shadow map.
   */
  get viewMatrix() {
    return this._viewMatrix;
  }
  /**
   * Gets the projection matrix used to render the shadow map.
   */
  get projectionMatrix() {
    return this._projectionMatrix;
  }
  /**
   * Gets the transformation matrix used to project the meshes into the map from the light point of view.
   * (eq to shadow projection matrix * light transform matrix)
   * @returns The transform matrix used to create the shadow map
   */
  getTransformMatrix() {
    const scene = this._scene;
    if (this._currentRenderId === scene.getRenderId() && this._currentFaceIndexCache === this._currentFaceIndex) {
      return this._transformMatrix;
    }
    this._currentRenderId = scene.getRenderId();
    this._currentFaceIndexCache = this._currentFaceIndex;
    let lightPosition = this._light.position;
    if (this._light.computeTransformedInformation()) {
      lightPosition = this._light.transformedPosition;
    }
    Vector3.NormalizeToRef(this._light.getShadowDirection(this._currentFaceIndex), this._lightDirection);
    if (Math.abs(Vector3.Dot(this._lightDirection, Vector3.Up())) === 1) {
      this._lightDirection.z = 1e-13;
    }
    if (this._light.needProjectionMatrixCompute() || !this._cachedPosition || !this._cachedDirection || !lightPosition.equals(this._cachedPosition) || !this._lightDirection.equals(this._cachedDirection)) {
      this._cachedPosition.copyFrom(lightPosition);
      this._cachedDirection.copyFrom(this._lightDirection);
      Matrix.LookAtLHToRef(lightPosition, lightPosition.add(this._lightDirection), Vector3.Up(), this._viewMatrix);
      const shadowMap = this.getShadowMap();
      if (shadowMap) {
        const renderList = shadowMap.renderList;
        if (renderList) {
          this._light.setShadowProjectionMatrix(this._projectionMatrix, this._viewMatrix, renderList);
        }
      }
      this._viewMatrix.multiplyToRef(this._projectionMatrix, this._transformMatrix);
    }
    return this._transformMatrix;
  }
  /**
   * Recreates the shadow map dependencies like RTT and post processes. This can be used during the switch between
   * Cube and 2D textures for instance.
   */
  recreateShadowMap() {
    const shadowMap = this._shadowMap;
    if (!shadowMap) {
      return;
    }
    const renderList = shadowMap.renderList;
    this._disposeRTTandPostProcesses();
    this._initializeGenerator();
    this.filter = this._filter;
    this._applyFilterValues();
    if (renderList) {
      if (!this._shadowMap.renderList) {
        this._shadowMap.renderList = [];
      }
      for (const mesh of renderList) {
        this._shadowMap.renderList.push(mesh);
      }
    } else {
      this._shadowMap.renderList = null;
    }
  }
  _disposeBlurPostProcesses() {
    if (this._shadowMap2) {
      this._shadowMap2.dispose();
      this._shadowMap2 = null;
    }
    if (this._boxBlurPostprocess) {
      this._boxBlurPostprocess.dispose();
      this._boxBlurPostprocess = null;
    }
    if (this._kernelBlurXPostprocess) {
      this._kernelBlurXPostprocess.dispose();
      this._kernelBlurXPostprocess = null;
    }
    if (this._kernelBlurYPostprocess) {
      this._kernelBlurYPostprocess.dispose();
      this._kernelBlurYPostprocess = null;
    }
    this._blurPostProcesses = [];
  }
  _disposeRTTandPostProcesses() {
    if (this._shadowMap) {
      this._shadowMap.dispose();
      this._shadowMap = null;
    }
    this._disposeBlurPostProcesses();
  }
  _disposeSceneUBOs() {
    if (this._sceneUBOs) {
      for (const ubo of this._sceneUBOs) {
        ubo.dispose();
      }
      this._sceneUBOs = [];
    }
  }
  /**
   * Disposes the ShadowGenerator.
   * Returns nothing.
   */
  dispose() {
    this._disposeRTTandPostProcesses();
    this._disposeSceneUBOs();
    if (this._light) {
      if (this._light._shadowGenerators) {
        const iterator = this._light._shadowGenerators.entries();
        for (let entry = iterator.next(); entry.done !== true; entry = iterator.next()) {
          const [camera, shadowGenerator] = entry.value;
          if (shadowGenerator === this) {
            this._light._shadowGenerators.delete(camera);
          }
        }
        if (this._light._shadowGenerators.size === 0) {
          this._light._shadowGenerators = null;
        }
      }
      this._light._markMeshesAsLightDirty();
    }
    this.onBeforeShadowMapRenderMeshObservable.clear();
    this.onBeforeShadowMapRenderObservable.clear();
    this.onAfterShadowMapRenderMeshObservable.clear();
    this.onAfterShadowMapRenderObservable.clear();
  }
  /**
   * Serializes the shadow generator setup to a json object.
   * @returns The serialized JSON object
   */
  serialize() {
    var _a;
    const serializationObject = {};
    const shadowMap = this.getShadowMap();
    if (!shadowMap) {
      return serializationObject;
    }
    serializationObject.className = this.getClassName();
    serializationObject.lightId = this._light.id;
    serializationObject.cameraId = (_a = this._camera) === null || _a === void 0 ? void 0 : _a.id;
    serializationObject.id = this.id;
    serializationObject.mapSize = shadowMap.getRenderSize();
    serializationObject.forceBackFacesOnly = this.forceBackFacesOnly;
    serializationObject.darkness = this.getDarkness();
    serializationObject.transparencyShadow = this._transparencyShadow;
    serializationObject.frustumEdgeFalloff = this.frustumEdgeFalloff;
    serializationObject.bias = this.bias;
    serializationObject.normalBias = this.normalBias;
    serializationObject.usePercentageCloserFiltering = this.usePercentageCloserFiltering;
    serializationObject.useContactHardeningShadow = this.useContactHardeningShadow;
    serializationObject.contactHardeningLightSizeUVRatio = this.contactHardeningLightSizeUVRatio;
    serializationObject.filteringQuality = this.filteringQuality;
    serializationObject.useExponentialShadowMap = this.useExponentialShadowMap;
    serializationObject.useBlurExponentialShadowMap = this.useBlurExponentialShadowMap;
    serializationObject.useCloseExponentialShadowMap = this.useBlurExponentialShadowMap;
    serializationObject.useBlurCloseExponentialShadowMap = this.useBlurExponentialShadowMap;
    serializationObject.usePoissonSampling = this.usePoissonSampling;
    serializationObject.depthScale = this.depthScale;
    serializationObject.blurBoxOffset = this.blurBoxOffset;
    serializationObject.blurKernel = this.blurKernel;
    serializationObject.blurScale = this.blurScale;
    serializationObject.useKernelBlur = this.useKernelBlur;
    serializationObject.renderList = [];
    if (shadowMap.renderList) {
      for (let meshIndex = 0; meshIndex < shadowMap.renderList.length; meshIndex++) {
        const mesh = shadowMap.renderList[meshIndex];
        serializationObject.renderList.push(mesh.id);
      }
    }
    return serializationObject;
  }
  /**
   * Parses a serialized ShadowGenerator and returns a new ShadowGenerator.
   * @param parsedShadowGenerator The JSON object to parse
   * @param scene The scene to create the shadow map for
   * @param constr A function that builds a shadow generator or undefined to create an instance of the default shadow generator
   * @returns The parsed shadow generator
   */
  static Parse(parsedShadowGenerator, scene, constr) {
    const light = scene.getLightById(parsedShadowGenerator.lightId);
    const camera = parsedShadowGenerator.cameraId !== void 0 ? scene.getCameraById(parsedShadowGenerator.cameraId) : null;
    const shadowGenerator = constr ? constr(parsedShadowGenerator.mapSize, light, camera) : new _ShadowGenerator(parsedShadowGenerator.mapSize, light, void 0, camera);
    const shadowMap = shadowGenerator.getShadowMap();
    for (let meshIndex = 0; meshIndex < parsedShadowGenerator.renderList.length; meshIndex++) {
      const meshes = scene.getMeshesById(parsedShadowGenerator.renderList[meshIndex]);
      meshes.forEach(function(mesh) {
        if (!shadowMap) {
          return;
        }
        if (!shadowMap.renderList) {
          shadowMap.renderList = [];
        }
        shadowMap.renderList.push(mesh);
      });
    }
    if (parsedShadowGenerator.id !== void 0) {
      shadowGenerator.id = parsedShadowGenerator.id;
    }
    shadowGenerator.forceBackFacesOnly = !!parsedShadowGenerator.forceBackFacesOnly;
    if (parsedShadowGenerator.darkness !== void 0) {
      shadowGenerator.setDarkness(parsedShadowGenerator.darkness);
    }
    if (parsedShadowGenerator.transparencyShadow) {
      shadowGenerator.setTransparencyShadow(true);
    }
    if (parsedShadowGenerator.frustumEdgeFalloff !== void 0) {
      shadowGenerator.frustumEdgeFalloff = parsedShadowGenerator.frustumEdgeFalloff;
    }
    if (parsedShadowGenerator.bias !== void 0) {
      shadowGenerator.bias = parsedShadowGenerator.bias;
    }
    if (parsedShadowGenerator.normalBias !== void 0) {
      shadowGenerator.normalBias = parsedShadowGenerator.normalBias;
    }
    if (parsedShadowGenerator.usePercentageCloserFiltering) {
      shadowGenerator.usePercentageCloserFiltering = true;
    } else if (parsedShadowGenerator.useContactHardeningShadow) {
      shadowGenerator.useContactHardeningShadow = true;
    } else if (parsedShadowGenerator.usePoissonSampling) {
      shadowGenerator.usePoissonSampling = true;
    } else if (parsedShadowGenerator.useExponentialShadowMap) {
      shadowGenerator.useExponentialShadowMap = true;
    } else if (parsedShadowGenerator.useBlurExponentialShadowMap) {
      shadowGenerator.useBlurExponentialShadowMap = true;
    } else if (parsedShadowGenerator.useCloseExponentialShadowMap) {
      shadowGenerator.useCloseExponentialShadowMap = true;
    } else if (parsedShadowGenerator.useBlurCloseExponentialShadowMap) {
      shadowGenerator.useBlurCloseExponentialShadowMap = true;
    } else if (parsedShadowGenerator.useVarianceShadowMap) {
      shadowGenerator.useExponentialShadowMap = true;
    } else if (parsedShadowGenerator.useBlurVarianceShadowMap) {
      shadowGenerator.useBlurExponentialShadowMap = true;
    }
    if (parsedShadowGenerator.contactHardeningLightSizeUVRatio !== void 0) {
      shadowGenerator.contactHardeningLightSizeUVRatio = parsedShadowGenerator.contactHardeningLightSizeUVRatio;
    }
    if (parsedShadowGenerator.filteringQuality !== void 0) {
      shadowGenerator.filteringQuality = parsedShadowGenerator.filteringQuality;
    }
    if (parsedShadowGenerator.depthScale) {
      shadowGenerator.depthScale = parsedShadowGenerator.depthScale;
    }
    if (parsedShadowGenerator.blurScale) {
      shadowGenerator.blurScale = parsedShadowGenerator.blurScale;
    }
    if (parsedShadowGenerator.blurBoxOffset) {
      shadowGenerator.blurBoxOffset = parsedShadowGenerator.blurBoxOffset;
    }
    if (parsedShadowGenerator.useKernelBlur) {
      shadowGenerator.useKernelBlur = parsedShadowGenerator.useKernelBlur;
    }
    if (parsedShadowGenerator.blurKernel) {
      shadowGenerator.blurKernel = parsedShadowGenerator.blurKernel;
    }
    return shadowGenerator;
  }
};
ShadowGenerator.CLASSNAME = "ShadowGenerator";
ShadowGenerator.FILTER_NONE = 0;
ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP = 1;
ShadowGenerator.FILTER_POISSONSAMPLING = 2;
ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP = 3;
ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP = 4;
ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP = 5;
ShadowGenerator.FILTER_PCF = 6;
ShadowGenerator.FILTER_PCSS = 7;
ShadowGenerator.QUALITY_HIGH = 0;
ShadowGenerator.QUALITY_MEDIUM = 1;
ShadowGenerator.QUALITY_LOW = 2;
ShadowGenerator.DEFAULT_ALPHA_CUTOFF = 0.5;
ShadowGenerator._SceneComponentInitialization = (_) => {
  throw _WarnImport("ShadowGeneratorSceneComponent");
};

// node_modules/@babylonjs/core/Shaders/depth.fragment.js
var name22 = "depthPixelShader";
var shader22 = `#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
varying float vDepthMetric;
#ifdef PACKED
#include<packingFunctions>
#endif
#ifdef STORE_CAMERASPACE_Z
varying vec4 vViewPos;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#ifdef STORE_CAMERASPACE_Z
#ifdef PACKED
gl_FragColor=pack(vViewPos.z);
#else
gl_FragColor=vec4(vViewPos.z,0.0,0.0,1.0);
#endif
#else
#ifdef NONLINEARDEPTH
#ifdef PACKED
gl_FragColor=pack(gl_FragCoord.z);
#else
gl_FragColor=vec4(gl_FragCoord.z,0.0,0.0,0.0);
#endif
#else
#ifdef PACKED
gl_FragColor=pack(vDepthMetric);
#else
gl_FragColor=vec4(vDepthMetric,0.0,0.0,1.0);
#endif
#endif
#endif
}`;
ShaderStore.ShadersStore[name22] = shader22;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/pointCloudVertexDeclaration.js
var name23 = "pointCloudVertexDeclaration";
var shader23 = `#ifdef POINTSIZE
uniform float pointSize;
#endif
`;
ShaderStore.IncludesShadersStore[name23] = shader23;

// node_modules/@babylonjs/core/Shaders/depth.vertex.js
var name24 = "depthVertexShader";
var shader24 = `attribute vec3 position;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;uniform vec2 depthValues;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;varying vec4 vViewPos;
#endif
#include<pointCloudVertexDeclaration>
varying float vDepthMetric;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#include<clipPlaneVertex>
gl_Position=viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vViewPos=view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
#else
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
#endif
#endif
#include<pointCloudVertex>
}
`;
ShaderStore.ShadersStore[name24] = shader24;

// node_modules/@babylonjs/core/Rendering/depthRenderer.js
var DepthRenderer = class _DepthRenderer {
  /**
   * Sets a specific material to be used to render a mesh/a list of meshes by the depth renderer
   * @param mesh mesh or array of meshes
   * @param material material to use by the depth render when rendering the mesh(es). If undefined is passed, the specific material created by the depth renderer will be used.
   */
  setMaterialForRendering(mesh, material) {
    this._depthMap.setMaterialForRendering(mesh, material);
  }
  /**
   * Instantiates a depth renderer
   * @param scene The scene the renderer belongs to
   * @param type The texture type of the depth map (default: Engine.TEXTURETYPE_FLOAT)
   * @param camera The camera to be used to render the depth map (default: scene's active camera)
   * @param storeNonLinearDepth Defines whether the depth is stored linearly like in Babylon Shadows or directly like glFragCoord.z
   * @param samplingMode The sampling mode to be used with the render target (Linear, Nearest...) (default: TRILINEAR_SAMPLINGMODE)
   * @param storeCameraSpaceZ Defines whether the depth stored is the Z coordinate in camera space. If true, storeNonLinearDepth has no effect. (Default: false)
   * @param name Name of the render target (default: DepthRenderer)
   */
  constructor(scene, type = 1, camera = null, storeNonLinearDepth = false, samplingMode = Texture.TRILINEAR_SAMPLINGMODE, storeCameraSpaceZ = false, name26) {
    this.enabled = true;
    this.forceDepthWriteTransparentMeshes = false;
    this.useOnlyInActiveCamera = false;
    this.reverseCulling = false;
    this._scene = scene;
    this._storeNonLinearDepth = storeNonLinearDepth;
    this._storeCameraSpaceZ = storeCameraSpaceZ;
    this.isPacked = type === 0;
    if (this.isPacked) {
      this.clearColor = new Color4(1, 1, 1, 1);
    } else {
      this.clearColor = new Color4(storeCameraSpaceZ ? 1e8 : 1, 0, 0, 1);
    }
    _DepthRenderer._SceneComponentInitialization(this._scene);
    const engine = scene.getEngine();
    this._camera = camera;
    if (samplingMode !== Texture.NEAREST_SAMPLINGMODE) {
      if (type === 1 && !engine._caps.textureFloatLinearFiltering) {
        samplingMode = Texture.NEAREST_SAMPLINGMODE;
      }
      if (type === 2 && !engine._caps.textureHalfFloatLinearFiltering) {
        samplingMode = Texture.NEAREST_SAMPLINGMODE;
      }
    }
    const format = this.isPacked || !engine._features.supportExtendedTextureFormats ? 5 : 6;
    this._depthMap = new RenderTargetTexture(name26 !== null && name26 !== void 0 ? name26 : "DepthRenderer", { width: engine.getRenderWidth(), height: engine.getRenderHeight() }, this._scene, false, true, type, false, samplingMode, void 0, void 0, void 0, format);
    this._depthMap.wrapU = Texture.CLAMP_ADDRESSMODE;
    this._depthMap.wrapV = Texture.CLAMP_ADDRESSMODE;
    this._depthMap.refreshRate = 1;
    this._depthMap.renderParticles = false;
    this._depthMap.renderList = null;
    this._depthMap.noPrePassRenderer = true;
    this._depthMap.activeCamera = this._camera;
    this._depthMap.ignoreCameraViewport = true;
    this._depthMap.useCameraPostProcesses = false;
    this._depthMap.onClearObservable.add((engine2) => {
      engine2.clear(this.clearColor, true, true, true);
    });
    this._depthMap.onBeforeBindObservable.add(() => {
      var _a;
      (_a = engine._debugPushGroup) === null || _a === void 0 ? void 0 : _a.call(engine, "depth renderer", 1);
    });
    this._depthMap.onAfterUnbindObservable.add(() => {
      var _a;
      (_a = engine._debugPopGroup) === null || _a === void 0 ? void 0 : _a.call(engine, 1);
    });
    this._depthMap.customIsReadyFunction = (mesh, refreshRate, preWarm) => {
      if ((preWarm || refreshRate === 0) && mesh.subMeshes) {
        for (let i = 0; i < mesh.subMeshes.length; ++i) {
          const subMesh = mesh.subMeshes[i];
          const renderingMesh = subMesh.getRenderingMesh();
          const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
          const hardwareInstancedRendering = engine.getCaps().instancedArrays && (batch.visibleInstances[subMesh._id] !== null && batch.visibleInstances[subMesh._id] !== void 0 || renderingMesh.hasThinInstances);
          if (!this.isReady(subMesh, hardwareInstancedRendering)) {
            return false;
          }
        }
      }
      return true;
    };
    const renderSubMesh = (subMesh) => {
      var _a, _b;
      const renderingMesh = subMesh.getRenderingMesh();
      const effectiveMesh = subMesh.getEffectiveMesh();
      const scene2 = this._scene;
      const engine2 = scene2.getEngine();
      const material = subMesh.getMaterial();
      effectiveMesh._internalAbstractMeshDataInfo._isActiveIntermediate = false;
      if (!material || effectiveMesh.infiniteDistance || material.disableDepthWrite || subMesh.verticesCount === 0 || subMesh._renderId === scene2.getRenderId()) {
        return;
      }
      const detNeg = effectiveMesh._getWorldMatrixDeterminant() < 0;
      let sideOrientation = (_a = renderingMesh.overrideMaterialSideOrientation) !== null && _a !== void 0 ? _a : material.sideOrientation;
      if (detNeg) {
        sideOrientation = sideOrientation === 0 ? 1 : 0;
      }
      const reverseSideOrientation = sideOrientation === 0;
      engine2.setState(material.backFaceCulling, 0, false, reverseSideOrientation, this.reverseCulling ? !material.cullBackFaces : material.cullBackFaces);
      const batch = renderingMesh._getInstancesRenderList(subMesh._id, !!subMesh.getReplacementMesh());
      if (batch.mustReturn) {
        return;
      }
      const hardwareInstancedRendering = engine2.getCaps().instancedArrays && (batch.visibleInstances[subMesh._id] !== null && batch.visibleInstances[subMesh._id] !== void 0 || renderingMesh.hasThinInstances);
      const camera2 = this._camera || scene2.activeCamera;
      if (this.isReady(subMesh, hardwareInstancedRendering) && camera2) {
        subMesh._renderId = scene2.getRenderId();
        const renderingMaterial = (_b = effectiveMesh._internalAbstractMeshDataInfo._materialForRenderPass) === null || _b === void 0 ? void 0 : _b[engine2.currentRenderPassId];
        let drawWrapper = subMesh._getDrawWrapper();
        if (!drawWrapper && renderingMaterial) {
          drawWrapper = renderingMaterial._getDrawWrapper();
        }
        const cameraIsOrtho = camera2.mode === Camera.ORTHOGRAPHIC_CAMERA;
        if (!drawWrapper) {
          return;
        }
        const effect = drawWrapper.effect;
        engine2.enableEffect(drawWrapper);
        if (!hardwareInstancedRendering) {
          renderingMesh._bind(subMesh, effect, material.fillMode);
        }
        if (!renderingMaterial) {
          effect.setMatrix("viewProjection", scene2.getTransformMatrix());
          effect.setMatrix("world", effectiveMesh.getWorldMatrix());
          if (this._storeCameraSpaceZ) {
            effect.setMatrix("view", scene2.getViewMatrix());
          }
        } else {
          renderingMaterial.bindForSubMesh(effectiveMesh.getWorldMatrix(), effectiveMesh, subMesh);
        }
        let minZ, maxZ;
        if (cameraIsOrtho) {
          minZ = !engine2.useReverseDepthBuffer && engine2.isNDCHalfZRange ? 0 : 1;
          maxZ = engine2.useReverseDepthBuffer && engine2.isNDCHalfZRange ? 0 : 1;
        } else {
          minZ = engine2.useReverseDepthBuffer && engine2.isNDCHalfZRange ? camera2.minZ : engine2.isNDCHalfZRange ? 0 : camera2.minZ;
          maxZ = engine2.useReverseDepthBuffer && engine2.isNDCHalfZRange ? 0 : camera2.maxZ;
        }
        effect.setFloat2("depthValues", minZ, minZ + maxZ);
        if (!renderingMaterial) {
          if (material.needAlphaTesting()) {
            const alphaTexture = material.getAlphaTestTexture();
            if (alphaTexture) {
              effect.setTexture("diffuseSampler", alphaTexture);
              effect.setMatrix("diffuseMatrix", alphaTexture.getTextureMatrix());
            }
          }
          if (renderingMesh.useBones && renderingMesh.computeBonesUsingShaders && renderingMesh.skeleton) {
            const skeleton = renderingMesh.skeleton;
            if (skeleton.isUsingTextureForMatrices) {
              const boneTexture = skeleton.getTransformMatrixTexture(renderingMesh);
              if (!boneTexture) {
                return;
              }
              effect.setTexture("boneSampler", boneTexture);
              effect.setFloat("boneTextureWidth", 4 * (skeleton.bones.length + 1));
            } else {
              effect.setMatrices("mBones", skeleton.getTransformMatrices(renderingMesh));
            }
          }
          bindClipPlane(effect, material, scene2);
          MaterialHelper.BindMorphTargetParameters(renderingMesh, effect);
          if (renderingMesh.morphTargetManager && renderingMesh.morphTargetManager.isUsingTextureForTargets) {
            renderingMesh.morphTargetManager._bind(effect);
          }
          if (material.pointsCloud) {
            effect.setFloat("pointSize", material.pointSize);
          }
        }
        renderingMesh._processRendering(effectiveMesh, subMesh, effect, material.fillMode, batch, hardwareInstancedRendering, (isInstance, world) => effect.setMatrix("world", world));
      }
    };
    this._depthMap.customRenderFunction = (opaqueSubMeshes, alphaTestSubMeshes, transparentSubMeshes, depthOnlySubMeshes) => {
      let index;
      if (depthOnlySubMeshes.length) {
        for (index = 0; index < depthOnlySubMeshes.length; index++) {
          renderSubMesh(depthOnlySubMeshes.data[index]);
        }
      }
      for (index = 0; index < opaqueSubMeshes.length; index++) {
        renderSubMesh(opaqueSubMeshes.data[index]);
      }
      for (index = 0; index < alphaTestSubMeshes.length; index++) {
        renderSubMesh(alphaTestSubMeshes.data[index]);
      }
      if (this.forceDepthWriteTransparentMeshes) {
        for (index = 0; index < transparentSubMeshes.length; index++) {
          renderSubMesh(transparentSubMeshes.data[index]);
        }
      } else {
        for (index = 0; index < transparentSubMeshes.length; index++) {
          transparentSubMeshes.data[index].getEffectiveMesh()._internalAbstractMeshDataInfo._isActiveIntermediate = false;
        }
      }
    };
  }
  /**
   * Creates the depth rendering effect and checks if the effect is ready.
   * @param subMesh The submesh to be used to render the depth map of
   * @param useInstances If multiple world instances should be used
   * @returns if the depth renderer is ready to render the depth map
   */
  isReady(subMesh, useInstances) {
    var _a;
    const engine = this._scene.getEngine();
    const mesh = subMesh.getMesh();
    const scene = mesh.getScene();
    const renderingMaterial = (_a = mesh._internalAbstractMeshDataInfo._materialForRenderPass) === null || _a === void 0 ? void 0 : _a[engine.currentRenderPassId];
    if (renderingMaterial) {
      return renderingMaterial.isReadyForSubMesh(mesh, subMesh, useInstances);
    }
    const material = subMesh.getMaterial();
    if (!material || material.disableDepthWrite) {
      return false;
    }
    const defines = [];
    const attribs = [VertexBuffer.PositionKind];
    if (material && material.needAlphaTesting() && material.getAlphaTestTexture()) {
      defines.push("#define ALPHATEST");
      if (mesh.isVerticesDataPresent(VertexBuffer.UVKind)) {
        attribs.push(VertexBuffer.UVKind);
        defines.push("#define UV1");
      }
      if (mesh.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
        attribs.push(VertexBuffer.UV2Kind);
        defines.push("#define UV2");
      }
    }
    if (mesh.useBones && mesh.computeBonesUsingShaders) {
      attribs.push(VertexBuffer.MatricesIndicesKind);
      attribs.push(VertexBuffer.MatricesWeightsKind);
      if (mesh.numBoneInfluencers > 4) {
        attribs.push(VertexBuffer.MatricesIndicesExtraKind);
        attribs.push(VertexBuffer.MatricesWeightsExtraKind);
      }
      defines.push("#define NUM_BONE_INFLUENCERS " + mesh.numBoneInfluencers);
      defines.push("#define BonesPerMesh " + (mesh.skeleton ? mesh.skeleton.bones.length + 1 : 0));
      const skeleton = subMesh.getRenderingMesh().skeleton;
      if (skeleton === null || skeleton === void 0 ? void 0 : skeleton.isUsingTextureForMatrices) {
        defines.push("#define BONETEXTURE");
      }
    } else {
      defines.push("#define NUM_BONE_INFLUENCERS 0");
    }
    const morphTargetManager = mesh.morphTargetManager;
    let numMorphInfluencers = 0;
    if (morphTargetManager) {
      if (morphTargetManager.numInfluencers > 0) {
        numMorphInfluencers = morphTargetManager.numInfluencers;
        defines.push("#define MORPHTARGETS");
        defines.push("#define NUM_MORPH_INFLUENCERS " + numMorphInfluencers);
        if (morphTargetManager.isUsingTextureForTargets) {
          defines.push("#define MORPHTARGETS_TEXTURE");
        }
        MaterialHelper.PrepareAttributesForMorphTargetsInfluencers(attribs, mesh, numMorphInfluencers);
      }
    }
    if (material.pointsCloud) {
      defines.push("#define POINTSIZE");
    }
    if (useInstances) {
      defines.push("#define INSTANCES");
      MaterialHelper.PushAttributesForInstances(attribs);
      if (subMesh.getRenderingMesh().hasThinInstances) {
        defines.push("#define THIN_INSTANCES");
      }
    }
    if (this._storeNonLinearDepth) {
      defines.push("#define NONLINEARDEPTH");
    }
    if (this._storeCameraSpaceZ) {
      defines.push("#define STORE_CAMERASPACE_Z");
    }
    if (this.isPacked) {
      defines.push("#define PACKED");
    }
    prepareStringDefinesForClipPlanes(material, scene, defines);
    const drawWrapper = subMesh._getDrawWrapper(void 0, true);
    const cachedDefines = drawWrapper.defines;
    const join = defines.join("\n");
    if (cachedDefines !== join) {
      const uniforms = [
        "world",
        "mBones",
        "boneTextureWidth",
        "pointSize",
        "viewProjection",
        "view",
        "diffuseMatrix",
        "depthValues",
        "morphTargetInfluences",
        "morphTargetTextureInfo",
        "morphTargetTextureIndices"
      ];
      addClipPlaneUniforms(uniforms);
      drawWrapper.setEffect(engine.createEffect("depth", attribs, uniforms, ["diffuseSampler", "morphTargets", "boneSampler"], join, void 0, void 0, void 0, {
        maxSimultaneousMorphTargets: numMorphInfluencers
      }), join);
    }
    return drawWrapper.effect.isReady();
  }
  /**
   * Gets the texture which the depth map will be written to.
   * @returns The depth map texture
   */
  getDepthMap() {
    return this._depthMap;
  }
  /**
   * Disposes of the depth renderer.
   */
  dispose() {
    const keysToDelete = [];
    for (const key in this._scene._depthRenderer) {
      const depthRenderer = this._scene._depthRenderer[key];
      if (depthRenderer === this) {
        keysToDelete.push(key);
      }
    }
    if (keysToDelete.length > 0) {
      this._depthMap.dispose();
      for (const key of keysToDelete) {
        delete this._scene._depthRenderer[key];
      }
    }
  }
};
DepthRenderer._SceneComponentInitialization = (_) => {
  throw _WarnImport("DepthRendererSceneComponent");
};

// node_modules/@babylonjs/core/Shaders/minmaxRedux.fragment.js
var name25 = "minmaxReduxPixelShader";
var shader25 = `varying vec2 vUV;uniform sampler2D textureSampler;
#if defined(INITIAL)
uniform sampler2D sourceTexture;uniform vec2 texSize;void main(void)
{ivec2 coord=ivec2(vUV*(texSize-1.0));float f1=texelFetch(sourceTexture,coord,0).r;float f2=texelFetch(sourceTexture,coord+ivec2(1,0),0).r;float f3=texelFetch(sourceTexture,coord+ivec2(1,1),0).r;float f4=texelFetch(sourceTexture,coord+ivec2(0,1),0).r;float minz=min(min(min(f1,f2),f3),f4);
#ifdef DEPTH_REDUX
float maxz=max(max(max(sign(1.0-f1)*f1,sign(1.0-f2)*f2),sign(1.0-f3)*f3),sign(1.0-f4)*f4);
#else
float maxz=max(max(max(f1,f2),f3),f4);
#endif
glFragColor=vec4(minz,maxz,0.,0.);}
#elif defined(MAIN)
uniform vec2 texSize;void main(void)
{ivec2 coord=ivec2(vUV*(texSize-1.0));vec2 f1=texelFetch(textureSampler,coord,0).rg;vec2 f2=texelFetch(textureSampler,coord+ivec2(1,0),0).rg;vec2 f3=texelFetch(textureSampler,coord+ivec2(1,1),0).rg;vec2 f4=texelFetch(textureSampler,coord+ivec2(0,1),0).rg;float minz=min(min(min(f1.x,f2.x),f3.x),f4.x);float maxz=max(max(max(f1.y,f2.y),f3.y),f4.y);glFragColor=vec4(minz,maxz,0.,0.);}
#elif defined(ONEBEFORELAST)
uniform ivec2 texSize;void main(void)
{ivec2 coord=ivec2(vUV*vec2(texSize-1));vec2 f1=texelFetch(textureSampler,coord % texSize,0).rg;vec2 f2=texelFetch(textureSampler,(coord+ivec2(1,0)) % texSize,0).rg;vec2 f3=texelFetch(textureSampler,(coord+ivec2(1,1)) % texSize,0).rg;vec2 f4=texelFetch(textureSampler,(coord+ivec2(0,1)) % texSize,0).rg;float minz=min(f1.x,f2.x);float maxz=max(f1.y,f2.y);glFragColor=vec4(minz,maxz,0.,0.);}
#elif defined(LAST)
void main(void)
{glFragColor=vec4(0.);if (true) { 
discard;}}
#endif
`;
ShaderStore.ShadersStore[name25] = shader25;

// node_modules/@babylonjs/core/Misc/minMaxReducer.js
var MinMaxReducer = class {
  /**
   * Creates a min/max reducer
   * @param camera The camera to use for the post processes
   */
  constructor(camera) {
    this.onAfterReductionPerformed = new Observable();
    this._forceFullscreenViewport = true;
    this._activated = false;
    this._camera = camera;
    this._postProcessManager = new PostProcessManager(camera.getScene());
    this._onContextRestoredObserver = camera.getEngine().onContextRestoredObservable.add(() => {
      this._postProcessManager._rebuild();
    });
  }
  /**
   * Gets the texture used to read the values from.
   */
  get sourceTexture() {
    return this._sourceTexture;
  }
  /**
   * Sets the source texture to read the values from.
   * One must indicate if the texture is a depth texture or not through the depthRedux parameter
   * because in such textures '1' value must not be taken into account to compute the maximum
   * as this value is used to clear the texture.
   * Note that the computation is not activated by calling this function, you must call activate() for that!
   * @param sourceTexture The texture to read the values from. The values should be in the red channel.
   * @param depthRedux Indicates if the texture is a depth texture or not
   * @param type The type of the textures created for the reduction (defaults to TEXTURETYPE_HALF_FLOAT)
   * @param forceFullscreenViewport Forces the post processes used for the reduction to be applied without taking into account viewport (defaults to true)
   */
  setSourceTexture(sourceTexture, depthRedux, type = 2, forceFullscreenViewport = true) {
    if (sourceTexture === this._sourceTexture) {
      return;
    }
    this.dispose(false);
    this._sourceTexture = sourceTexture;
    this._reductionSteps = [];
    this._forceFullscreenViewport = forceFullscreenViewport;
    const scene = this._camera.getScene();
    const reductionInitial = new PostProcess(
      "Initial reduction phase",
      "minmaxRedux",
      // shader
      ["texSize"],
      ["sourceTexture"],
      // textures
      1,
      // options
      null,
      // camera
      1,
      // sampling
      scene.getEngine(),
      // engine
      false,
      // reusable
      "#define INITIAL" + (depthRedux ? "\n#define DEPTH_REDUX" : ""),
      // defines
      type,
      void 0,
      void 0,
      void 0,
      7
    );
    reductionInitial.autoClear = false;
    reductionInitial.forceFullscreenViewport = forceFullscreenViewport;
    let w = this._sourceTexture.getRenderWidth(), h = this._sourceTexture.getRenderHeight();
    reductionInitial.onApply = ((w2, h2) => {
      return (effect) => {
        effect.setTexture("sourceTexture", this._sourceTexture);
        effect.setFloat2("texSize", w2, h2);
      };
    })(w, h);
    this._reductionSteps.push(reductionInitial);
    let index = 1;
    while (w > 1 || h > 1) {
      w = Math.max(Math.round(w / 2), 1);
      h = Math.max(Math.round(h / 2), 1);
      const reduction = new PostProcess(
        "Reduction phase " + index,
        "minmaxRedux",
        // shader
        ["texSize"],
        null,
        { width: w, height: h },
        // options
        null,
        // camera
        1,
        // sampling
        scene.getEngine(),
        // engine
        false,
        // reusable
        "#define " + (w == 1 && h == 1 ? "LAST" : w == 1 || h == 1 ? "ONEBEFORELAST" : "MAIN"),
        // defines
        type,
        void 0,
        void 0,
        void 0,
        7
      );
      reduction.autoClear = false;
      reduction.forceFullscreenViewport = forceFullscreenViewport;
      reduction.onApply = ((w2, h2) => {
        return (effect) => {
          if (w2 == 1 || h2 == 1) {
            effect.setInt2("texSize", w2, h2);
          } else {
            effect.setFloat2("texSize", w2, h2);
          }
        };
      })(w, h);
      this._reductionSteps.push(reduction);
      index++;
      if (w == 1 && h == 1) {
        const func = (w2, h2, reduction2) => {
          const buffer = new Float32Array(4 * w2 * h2), minmax = { min: 0, max: 0 };
          return () => {
            scene.getEngine()._readTexturePixels(reduction2.inputTexture.texture, w2, h2, -1, 0, buffer, false);
            minmax.min = buffer[0];
            minmax.max = buffer[1];
            this.onAfterReductionPerformed.notifyObservers(minmax);
          };
        };
        reduction.onAfterRenderObservable.add(func(w, h, reduction));
      }
    }
  }
  /**
   * Defines the refresh rate of the computation.
   * Use 0 to compute just once, 1 to compute on every frame, 2 to compute every two frames and so on...
   */
  get refreshRate() {
    return this._sourceTexture ? this._sourceTexture.refreshRate : -1;
  }
  set refreshRate(value) {
    if (this._sourceTexture) {
      this._sourceTexture.refreshRate = value;
    }
  }
  /**
   * Gets the activation status of the reducer
   */
  get activated() {
    return this._activated;
  }
  /**
   * Activates the reduction computation.
   * When activated, the observers registered in onAfterReductionPerformed are
   * called after the computation is performed
   */
  activate() {
    if (this._onAfterUnbindObserver || !this._sourceTexture) {
      return;
    }
    this._onAfterUnbindObserver = this._sourceTexture.onAfterUnbindObservable.add(() => {
      var _a, _b;
      const engine = this._camera.getScene().getEngine();
      (_a = engine._debugPushGroup) === null || _a === void 0 ? void 0 : _a.call(engine, `min max reduction`, 1);
      this._reductionSteps[0].activate(this._camera);
      this._postProcessManager.directRender(this._reductionSteps, this._reductionSteps[0].inputTexture, this._forceFullscreenViewport);
      engine.unBindFramebuffer(this._reductionSteps[0].inputTexture, false);
      (_b = engine._debugPopGroup) === null || _b === void 0 ? void 0 : _b.call(engine, 1);
    });
    this._activated = true;
  }
  /**
   * Deactivates the reduction computation.
   */
  deactivate() {
    if (!this._onAfterUnbindObserver || !this._sourceTexture) {
      return;
    }
    this._sourceTexture.onAfterUnbindObservable.remove(this._onAfterUnbindObserver);
    this._onAfterUnbindObserver = null;
    this._activated = false;
  }
  /**
   * Disposes the min/max reducer
   * @param disposeAll true to dispose all the resources. You should always call this function with true as the parameter (or without any parameter as it is the default one). This flag is meant to be used internally.
   */
  dispose(disposeAll = true) {
    if (disposeAll) {
      this.onAfterReductionPerformed.clear();
      if (this._onContextRestoredObserver) {
        this._camera.getEngine().onContextRestoredObservable.remove(this._onContextRestoredObserver);
        this._onContextRestoredObserver = null;
      }
    }
    this.deactivate();
    if (this._reductionSteps) {
      for (let i = 0; i < this._reductionSteps.length; ++i) {
        this._reductionSteps[i].dispose();
      }
      this._reductionSteps = null;
    }
    if (this._postProcessManager && disposeAll) {
      this._postProcessManager.dispose();
    }
    this._sourceTexture = null;
  }
};

// node_modules/@babylonjs/core/Misc/depthReducer.js
var DepthReducer = class extends MinMaxReducer {
  /**
   * Gets the depth renderer used for the computation.
   * Note that the result is null if you provide your own renderer when calling setDepthRenderer.
   */
  get depthRenderer() {
    return this._depthRenderer;
  }
  /**
   * Creates a depth reducer
   * @param camera The camera used to render the depth texture
   */
  constructor(camera) {
    super(camera);
  }
  /**
   * Sets the depth renderer to use to generate the depth map
   * @param depthRenderer The depth renderer to use. If not provided, a new one will be created automatically
   * @param type The texture type of the depth map (default: TEXTURETYPE_HALF_FLOAT)
   * @param forceFullscreenViewport Forces the post processes used for the reduction to be applied without taking into account viewport (defaults to true)
   */
  setDepthRenderer(depthRenderer = null, type = 2, forceFullscreenViewport = true) {
    const scene = this._camera.getScene();
    if (this._depthRenderer) {
      delete scene._depthRenderer[this._depthRendererId];
      this._depthRenderer.dispose();
      this._depthRenderer = null;
    }
    if (depthRenderer === null) {
      if (!scene._depthRenderer) {
        scene._depthRenderer = {};
      }
      depthRenderer = this._depthRenderer = new DepthRenderer(scene, type, this._camera, false, 1);
      depthRenderer.enabled = false;
      this._depthRendererId = "minmax" + this._camera.id;
      scene._depthRenderer[this._depthRendererId] = depthRenderer;
    }
    super.setSourceTexture(depthRenderer.getDepthMap(), true, type, forceFullscreenViewport);
  }
  /**
   * @internal
   */
  setSourceTexture(sourceTexture, depthRedux, type = 2, forceFullscreenViewport = true) {
    super.setSourceTexture(sourceTexture, depthRedux, type, forceFullscreenViewport);
  }
  /**
   * Activates the reduction computation.
   * When activated, the observers registered in onAfterReductionPerformed are
   * called after the computation is performed
   */
  activate() {
    if (this._depthRenderer) {
      this._depthRenderer.enabled = true;
    }
    super.activate();
  }
  /**
   * Deactivates the reduction computation.
   */
  deactivate() {
    super.deactivate();
    if (this._depthRenderer) {
      this._depthRenderer.enabled = false;
    }
  }
  /**
   * Disposes the depth reducer
   * @param disposeAll true to dispose all the resources. You should always call this function with true as the parameter (or without any parameter as it is the default one). This flag is meant to be used internally.
   */
  dispose(disposeAll = true) {
    super.dispose(disposeAll);
    if (this._depthRenderer && disposeAll) {
      const scene = this._depthRenderer.getDepthMap().getScene();
      if (scene) {
        delete scene._depthRenderer[this._depthRendererId];
      }
      this._depthRenderer.dispose();
      this._depthRenderer = null;
    }
  }
};

// node_modules/@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js
var UpDir = Vector3.Up();
var ZeroVec = Vector3.Zero();
var tmpv1 = new Vector3();
var tmpv2 = new Vector3();
var tmpMatrix = new Matrix();
var CascadedShadowGenerator = class _CascadedShadowGenerator extends ShadowGenerator {
  _validateFilter(filter) {
    if (filter === ShadowGenerator.FILTER_NONE || filter === ShadowGenerator.FILTER_PCF || filter === ShadowGenerator.FILTER_PCSS) {
      return filter;
    }
    console.error('Unsupported filter "' + filter + '"!');
    return ShadowGenerator.FILTER_NONE;
  }
  /**
   * Gets or set the number of cascades used by the CSM.
   */
  get numCascades() {
    return this._numCascades;
  }
  set numCascades(value) {
    value = Math.min(Math.max(value, _CascadedShadowGenerator.MIN_CASCADES_COUNT), _CascadedShadowGenerator.MAX_CASCADES_COUNT);
    if (value === this._numCascades) {
      return;
    }
    this._numCascades = value;
    this.recreateShadowMap();
    this._recreateSceneUBOs();
  }
  /**
   * Enables or disables the shadow casters bounding info computation.
   * If your shadow casters don't move, you can disable this feature.
   * If it is enabled, the bounding box computation is done every frame.
   */
  get freezeShadowCastersBoundingInfo() {
    return this._freezeShadowCastersBoundingInfo;
  }
  set freezeShadowCastersBoundingInfo(freeze) {
    if (this._freezeShadowCastersBoundingInfoObservable && freeze) {
      this._scene.onBeforeRenderObservable.remove(this._freezeShadowCastersBoundingInfoObservable);
      this._freezeShadowCastersBoundingInfoObservable = null;
    }
    if (!this._freezeShadowCastersBoundingInfoObservable && !freeze) {
      this._freezeShadowCastersBoundingInfoObservable = this._scene.onBeforeRenderObservable.add(() => this._computeShadowCastersBoundingInfo());
    }
    this._freezeShadowCastersBoundingInfo = freeze;
    if (freeze) {
      this._computeShadowCastersBoundingInfo();
    }
  }
  _computeShadowCastersBoundingInfo() {
    this._scbiMin.copyFromFloats(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._scbiMax.copyFromFloats(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    if (this._shadowMap && this._shadowMap.renderList) {
      const renderList = this._shadowMap.renderList;
      for (let meshIndex = 0; meshIndex < renderList.length; meshIndex++) {
        const mesh = renderList[meshIndex];
        if (!mesh) {
          continue;
        }
        const boundingInfo = mesh.getBoundingInfo(), boundingBox = boundingInfo.boundingBox;
        this._scbiMin.minimizeInPlace(boundingBox.minimumWorld);
        this._scbiMax.maximizeInPlace(boundingBox.maximumWorld);
      }
      const meshes = this._scene.meshes;
      for (let meshIndex = 0; meshIndex < meshes.length; meshIndex++) {
        const mesh = meshes[meshIndex];
        if (!mesh || !mesh.isVisible || !mesh.isEnabled || !mesh.receiveShadows) {
          continue;
        }
        const boundingInfo = mesh.getBoundingInfo(), boundingBox = boundingInfo.boundingBox;
        this._scbiMin.minimizeInPlace(boundingBox.minimumWorld);
        this._scbiMax.maximizeInPlace(boundingBox.maximumWorld);
      }
    }
    this._shadowCastersBoundingInfo.reConstruct(this._scbiMin, this._scbiMax);
  }
  /**
   * Gets or sets the shadow casters bounding info.
   * If you provide your own shadow casters bounding info, first enable freezeShadowCastersBoundingInfo
   * so that the system won't overwrite the bounds you provide
   */
  get shadowCastersBoundingInfo() {
    return this._shadowCastersBoundingInfo;
  }
  set shadowCastersBoundingInfo(boundingInfo) {
    this._shadowCastersBoundingInfo = boundingInfo;
  }
  /**
   * Sets the minimal and maximal distances to use when computing the cascade breaks.
   *
   * The values of min / max are typically the depth zmin and zmax values of your scene, for a given frame.
   * If you don't know these values, simply leave them to their defaults and don't call this function.
   * @param min minimal distance for the breaks (default to 0.)
   * @param max maximal distance for the breaks (default to 1.)
   */
  setMinMaxDistance(min, max) {
    if (this._minDistance === min && this._maxDistance === max) {
      return;
    }
    if (min > max) {
      min = 0;
      max = 1;
    }
    if (min < 0) {
      min = 0;
    }
    if (max > 1) {
      max = 1;
    }
    this._minDistance = min;
    this._maxDistance = max;
    this._breaksAreDirty = true;
  }
  /** Gets the minimal distance used in the cascade break computation */
  get minDistance() {
    return this._minDistance;
  }
  /** Gets the maximal distance used in the cascade break computation */
  get maxDistance() {
    return this._maxDistance;
  }
  /**
   * Gets the class name of that object
   * @returns "CascadedShadowGenerator"
   */
  getClassName() {
    return _CascadedShadowGenerator.CLASSNAME;
  }
  /**
   * Gets a cascade minimum extents
   * @param cascadeIndex index of the cascade
   * @returns the minimum cascade extents
   */
  getCascadeMinExtents(cascadeIndex) {
    return cascadeIndex >= 0 && cascadeIndex < this._numCascades ? this._cascadeMinExtents[cascadeIndex] : null;
  }
  /**
   * Gets a cascade maximum extents
   * @param cascadeIndex index of the cascade
   * @returns the maximum cascade extents
   */
  getCascadeMaxExtents(cascadeIndex) {
    return cascadeIndex >= 0 && cascadeIndex < this._numCascades ? this._cascadeMaxExtents[cascadeIndex] : null;
  }
  /**
   * Gets the shadow max z distance. It's the limit beyond which shadows are not displayed.
   * It defaults to camera.maxZ
   */
  get shadowMaxZ() {
    if (!this._getCamera()) {
      return 0;
    }
    return this._shadowMaxZ;
  }
  /**
   * Sets the shadow max z distance.
   */
  set shadowMaxZ(value) {
    const camera = this._getCamera();
    if (!camera) {
      this._shadowMaxZ = value;
      return;
    }
    if (this._shadowMaxZ === value || value < camera.minZ || value > camera.maxZ && camera.maxZ !== 0) {
      return;
    }
    this._shadowMaxZ = value;
    this._light._markMeshesAsLightDirty();
    this._breaksAreDirty = true;
  }
  /**
   * Gets or sets the debug flag.
   * When enabled, the cascades are materialized by different colors on the screen.
   */
  get debug() {
    return this._debug;
  }
  set debug(dbg) {
    this._debug = dbg;
    this._light._markMeshesAsLightDirty();
  }
  /**
   * Gets or sets the depth clamping value.
   *
   * When enabled, it improves the shadow quality because the near z plane of the light frustum don't need to be adjusted
   * to account for the shadow casters far away.
   *
   * Note that this property is incompatible with PCSS filtering, so it won't be used in that case.
   */
  get depthClamp() {
    return this._depthClamp;
  }
  set depthClamp(value) {
    this._depthClamp = value;
  }
  /**
   * Gets or sets the percentage of blending between two cascades (value between 0. and 1.).
   * It defaults to 0.1 (10% blending).
   */
  get cascadeBlendPercentage() {
    return this._cascadeBlendPercentage;
  }
  set cascadeBlendPercentage(value) {
    this._cascadeBlendPercentage = value;
    this._light._markMeshesAsLightDirty();
  }
  /**
   * Gets or set the lambda parameter.
   * This parameter is used to split the camera frustum and create the cascades.
   * It's a value between 0. and 1.: If 0, the split is a uniform split of the frustum, if 1 it is a logarithmic split.
   * For all values in-between, it's a linear combination of the uniform and logarithm split algorithm.
   */
  get lambda() {
    return this._lambda;
  }
  set lambda(value) {
    const lambda = Math.min(Math.max(value, 0), 1);
    if (this._lambda == lambda) {
      return;
    }
    this._lambda = lambda;
    this._breaksAreDirty = true;
  }
  /**
   * Gets the view matrix corresponding to a given cascade
   * @param cascadeNum cascade to retrieve the view matrix from
   * @returns the cascade view matrix
   */
  getCascadeViewMatrix(cascadeNum) {
    return cascadeNum >= 0 && cascadeNum < this._numCascades ? this._viewMatrices[cascadeNum] : null;
  }
  /**
   * Gets the projection matrix corresponding to a given cascade
   * @param cascadeNum cascade to retrieve the projection matrix from
   * @returns the cascade projection matrix
   */
  getCascadeProjectionMatrix(cascadeNum) {
    return cascadeNum >= 0 && cascadeNum < this._numCascades ? this._projectionMatrices[cascadeNum] : null;
  }
  /**
   * Gets the transformation matrix corresponding to a given cascade
   * @param cascadeNum cascade to retrieve the transformation matrix from
   * @returns the cascade transformation matrix
   */
  getCascadeTransformMatrix(cascadeNum) {
    return cascadeNum >= 0 && cascadeNum < this._numCascades ? this._transformMatrices[cascadeNum] : null;
  }
  /**
   * Sets the depth renderer to use when autoCalcDepthBounds is enabled.
   *
   * Note that if no depth renderer is set, a new one will be automatically created internally when necessary.
   *
   * You should call this function if you already have a depth renderer enabled in your scene, to avoid
   * doing multiple depth rendering each frame. If you provide your own depth renderer, make sure it stores linear depth!
   * @param depthRenderer The depth renderer to use when autoCalcDepthBounds is enabled. If you pass null or don't call this function at all, a depth renderer will be automatically created
   */
  setDepthRenderer(depthRenderer) {
    this._depthRenderer = depthRenderer;
    if (this._depthReducer) {
      this._depthReducer.setDepthRenderer(this._depthRenderer);
    }
  }
  /**
   * Gets or sets the autoCalcDepthBounds property.
   *
   * When enabled, a depth rendering pass is first performed (with an internally created depth renderer or with the one
   * you provide by calling setDepthRenderer). Then, a min/max reducing is applied on the depth map to compute the
   * minimal and maximal depth of the map and those values are used as inputs for the setMinMaxDistance() function.
   * It can greatly enhance the shadow quality, at the expense of more GPU works.
   * When using this option, you should increase the value of the lambda parameter, and even set it to 1 for best results.
   */
  get autoCalcDepthBounds() {
    return this._autoCalcDepthBounds;
  }
  set autoCalcDepthBounds(value) {
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    this._autoCalcDepthBounds = value;
    if (!value) {
      if (this._depthReducer) {
        this._depthReducer.deactivate();
      }
      this.setMinMaxDistance(0, 1);
      return;
    }
    if (!this._depthReducer) {
      this._depthReducer = new DepthReducer(camera);
      this._depthReducer.onAfterReductionPerformed.add((minmax) => {
        let min = minmax.min, max = minmax.max;
        if (min >= max) {
          min = 0;
          max = 1;
        }
        if (min != this._minDistance || max != this._maxDistance) {
          this.setMinMaxDistance(min, max);
        }
      });
      this._depthReducer.setDepthRenderer(this._depthRenderer);
    }
    this._depthReducer.activate();
  }
  /**
   * Defines the refresh rate of the min/max computation used when autoCalcDepthBounds is set to true
   * Use 0 to compute just once, 1 to compute on every frame, 2 to compute every two frames and so on...
   * Note that if you provided your own depth renderer through a call to setDepthRenderer, you are responsible
   * for setting the refresh rate on the renderer yourself!
   */
  get autoCalcDepthBoundsRefreshRate() {
    var _a, _b, _c;
    return (_c = (_b = (_a = this._depthReducer) === null || _a === void 0 ? void 0 : _a.depthRenderer) === null || _b === void 0 ? void 0 : _b.getDepthMap().refreshRate) !== null && _c !== void 0 ? _c : -1;
  }
  set autoCalcDepthBoundsRefreshRate(value) {
    var _a;
    if ((_a = this._depthReducer) === null || _a === void 0 ? void 0 : _a.depthRenderer) {
      this._depthReducer.depthRenderer.getDepthMap().refreshRate = value;
    }
  }
  /**
   * Create the cascade breaks according to the lambda, shadowMaxZ and min/max distance properties, as well as the camera near and far planes.
   * This function is automatically called when updating lambda, shadowMaxZ and min/max distances, however you should call it yourself if
   * you change the camera near/far planes!
   */
  splitFrustum() {
    this._breaksAreDirty = true;
  }
  _splitFrustum() {
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    const near = camera.minZ, far = camera.maxZ || this._shadowMaxZ, cameraRange = far - near, minDistance = this._minDistance, maxDistance = this._shadowMaxZ < far && this._shadowMaxZ >= near ? Math.min((this._shadowMaxZ - near) / (far - near), this._maxDistance) : this._maxDistance;
    const minZ = near + minDistance * cameraRange, maxZ = near + maxDistance * cameraRange;
    const range = maxZ - minZ, ratio = maxZ / minZ;
    for (let cascadeIndex = 0; cascadeIndex < this._cascades.length; ++cascadeIndex) {
      const p = (cascadeIndex + 1) / this._numCascades, log = minZ * ratio ** p, uniform = minZ + range * p;
      const d = this._lambda * (log - uniform) + uniform;
      this._cascades[cascadeIndex].prevBreakDistance = cascadeIndex === 0 ? minDistance : this._cascades[cascadeIndex - 1].breakDistance;
      this._cascades[cascadeIndex].breakDistance = (d - near) / cameraRange;
      this._viewSpaceFrustumsZ[cascadeIndex] = d;
      this._frustumLengths[cascadeIndex] = (this._cascades[cascadeIndex].breakDistance - this._cascades[cascadeIndex].prevBreakDistance) * cameraRange;
    }
    this._breaksAreDirty = false;
  }
  _computeMatrices() {
    const scene = this._scene;
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    Vector3.NormalizeToRef(this._light.getShadowDirection(0), this._lightDirection);
    if (Math.abs(Vector3.Dot(this._lightDirection, Vector3.Up())) === 1) {
      this._lightDirection.z = 1e-13;
    }
    this._cachedDirection.copyFrom(this._lightDirection);
    const useReverseDepthBuffer = scene.getEngine().useReverseDepthBuffer;
    for (let cascadeIndex = 0; cascadeIndex < this._numCascades; ++cascadeIndex) {
      this._computeFrustumInWorldSpace(cascadeIndex);
      this._computeCascadeFrustum(cascadeIndex);
      this._cascadeMaxExtents[cascadeIndex].subtractToRef(this._cascadeMinExtents[cascadeIndex], tmpv1);
      this._frustumCenter[cascadeIndex].addToRef(this._lightDirection.scale(this._cascadeMinExtents[cascadeIndex].z), this._shadowCameraPos[cascadeIndex]);
      Matrix.LookAtLHToRef(this._shadowCameraPos[cascadeIndex], this._frustumCenter[cascadeIndex], UpDir, this._viewMatrices[cascadeIndex]);
      let minZ = 0, maxZ = tmpv1.z;
      const boundingInfo = this._shadowCastersBoundingInfo;
      boundingInfo.update(this._viewMatrices[cascadeIndex]);
      maxZ = Math.min(maxZ, boundingInfo.boundingBox.maximumWorld.z);
      if (!this._depthClamp || this.filter === ShadowGenerator.FILTER_PCSS) {
        minZ = Math.min(minZ, boundingInfo.boundingBox.minimumWorld.z);
      } else {
        minZ = Math.max(minZ, boundingInfo.boundingBox.minimumWorld.z);
      }
      Matrix.OrthoOffCenterLHToRef(this._cascadeMinExtents[cascadeIndex].x, this._cascadeMaxExtents[cascadeIndex].x, this._cascadeMinExtents[cascadeIndex].y, this._cascadeMaxExtents[cascadeIndex].y, useReverseDepthBuffer ? maxZ : minZ, useReverseDepthBuffer ? minZ : maxZ, this._projectionMatrices[cascadeIndex], scene.getEngine().isNDCHalfZRange);
      this._cascadeMinExtents[cascadeIndex].z = minZ;
      this._cascadeMaxExtents[cascadeIndex].z = maxZ;
      this._viewMatrices[cascadeIndex].multiplyToRef(this._projectionMatrices[cascadeIndex], this._transformMatrices[cascadeIndex]);
      Vector3.TransformCoordinatesToRef(ZeroVec, this._transformMatrices[cascadeIndex], tmpv1);
      tmpv1.scaleInPlace(this._mapSize / 2);
      tmpv2.copyFromFloats(Math.round(tmpv1.x), Math.round(tmpv1.y), Math.round(tmpv1.z));
      tmpv2.subtractInPlace(tmpv1).scaleInPlace(2 / this._mapSize);
      Matrix.TranslationToRef(tmpv2.x, tmpv2.y, 0, tmpMatrix);
      this._projectionMatrices[cascadeIndex].multiplyToRef(tmpMatrix, this._projectionMatrices[cascadeIndex]);
      this._viewMatrices[cascadeIndex].multiplyToRef(this._projectionMatrices[cascadeIndex], this._transformMatrices[cascadeIndex]);
      this._transformMatrices[cascadeIndex].copyToArray(this._transformMatricesAsArray, cascadeIndex * 16);
    }
  }
  // Get the 8 points of the view frustum in world space
  _computeFrustumInWorldSpace(cascadeIndex) {
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    const prevSplitDist = this._cascades[cascadeIndex].prevBreakDistance, splitDist = this._cascades[cascadeIndex].breakDistance;
    const isNDCHalfZRange = this._scene.getEngine().isNDCHalfZRange;
    camera.getViewMatrix();
    const cameraInfiniteFarPlane = camera.maxZ === 0;
    const saveCameraMaxZ = camera.maxZ;
    if (cameraInfiniteFarPlane) {
      camera.maxZ = this._shadowMaxZ;
      camera.getProjectionMatrix(true);
    }
    const invViewProj = Matrix.Invert(camera.getTransformationMatrix());
    if (cameraInfiniteFarPlane) {
      camera.maxZ = saveCameraMaxZ;
      camera.getProjectionMatrix(true);
    }
    const cornerIndexOffset = this._scene.getEngine().useReverseDepthBuffer ? 4 : 0;
    for (let cornerIndex = 0; cornerIndex < _CascadedShadowGenerator._FrustumCornersNDCSpace.length; ++cornerIndex) {
      tmpv1.copyFrom(_CascadedShadowGenerator._FrustumCornersNDCSpace[(cornerIndex + cornerIndexOffset) % _CascadedShadowGenerator._FrustumCornersNDCSpace.length]);
      if (isNDCHalfZRange && tmpv1.z === -1) {
        tmpv1.z = 0;
      }
      Vector3.TransformCoordinatesToRef(tmpv1, invViewProj, this._frustumCornersWorldSpace[cascadeIndex][cornerIndex]);
    }
    for (let cornerIndex = 0; cornerIndex < _CascadedShadowGenerator._FrustumCornersNDCSpace.length / 2; ++cornerIndex) {
      tmpv1.copyFrom(this._frustumCornersWorldSpace[cascadeIndex][cornerIndex + 4]).subtractInPlace(this._frustumCornersWorldSpace[cascadeIndex][cornerIndex]);
      tmpv2.copyFrom(tmpv1).scaleInPlace(prevSplitDist);
      tmpv1.scaleInPlace(splitDist);
      tmpv1.addInPlace(this._frustumCornersWorldSpace[cascadeIndex][cornerIndex]);
      this._frustumCornersWorldSpace[cascadeIndex][cornerIndex + 4].copyFrom(tmpv1);
      this._frustumCornersWorldSpace[cascadeIndex][cornerIndex].addInPlace(tmpv2);
    }
  }
  _computeCascadeFrustum(cascadeIndex) {
    this._cascadeMinExtents[cascadeIndex].copyFromFloats(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    this._cascadeMaxExtents[cascadeIndex].copyFromFloats(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
    this._frustumCenter[cascadeIndex].copyFromFloats(0, 0, 0);
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    for (let cornerIndex = 0; cornerIndex < this._frustumCornersWorldSpace[cascadeIndex].length; ++cornerIndex) {
      this._frustumCenter[cascadeIndex].addInPlace(this._frustumCornersWorldSpace[cascadeIndex][cornerIndex]);
    }
    this._frustumCenter[cascadeIndex].scaleInPlace(1 / this._frustumCornersWorldSpace[cascadeIndex].length);
    if (this.stabilizeCascades) {
      let sphereRadius = 0;
      for (let cornerIndex = 0; cornerIndex < this._frustumCornersWorldSpace[cascadeIndex].length; ++cornerIndex) {
        const dist = this._frustumCornersWorldSpace[cascadeIndex][cornerIndex].subtractToRef(this._frustumCenter[cascadeIndex], tmpv1).length();
        sphereRadius = Math.max(sphereRadius, dist);
      }
      sphereRadius = Math.ceil(sphereRadius * 16) / 16;
      this._cascadeMaxExtents[cascadeIndex].copyFromFloats(sphereRadius, sphereRadius, sphereRadius);
      this._cascadeMinExtents[cascadeIndex].copyFromFloats(-sphereRadius, -sphereRadius, -sphereRadius);
    } else {
      const lightCameraPos = this._frustumCenter[cascadeIndex];
      this._frustumCenter[cascadeIndex].addToRef(this._lightDirection, tmpv1);
      Matrix.LookAtLHToRef(lightCameraPos, tmpv1, UpDir, tmpMatrix);
      for (let cornerIndex = 0; cornerIndex < this._frustumCornersWorldSpace[cascadeIndex].length; ++cornerIndex) {
        Vector3.TransformCoordinatesToRef(this._frustumCornersWorldSpace[cascadeIndex][cornerIndex], tmpMatrix, tmpv1);
        this._cascadeMinExtents[cascadeIndex].minimizeInPlace(tmpv1);
        this._cascadeMaxExtents[cascadeIndex].maximizeInPlace(tmpv1);
      }
    }
  }
  _recreateSceneUBOs() {
    this._disposeSceneUBOs();
    if (this._sceneUBOs) {
      for (let i = 0; i < this._numCascades; ++i) {
        this._sceneUBOs.push(this._scene.createSceneUniformBuffer(`Scene for CSM Shadow Generator (light "${this._light.name}" cascade #${i})`));
      }
    }
  }
  /**
   *  Support test.
   */
  static get IsSupported() {
    const engine = EngineStore.LastCreatedEngine;
    if (!engine) {
      return false;
    }
    return engine._features.supportCSM;
  }
  /**
   * Creates a Cascaded Shadow Generator object.
   * A ShadowGenerator is the required tool to use the shadows.
   * Each directional light casting shadows needs to use its own ShadowGenerator.
   * Documentation : https://doc.babylonjs.com/babylon101/cascadedShadows
   * @param mapSize The size of the texture what stores the shadows. Example : 1024.
   * @param light The directional light object generating the shadows.
   * @param usefulFloatFirst By default the generator will try to use half float textures but if you need precision (for self shadowing for instance), you can use this option to enforce full float texture.
   * @param camera Camera associated with this shadow generator (default: null). If null, takes the scene active camera at the time we need to access it
   * @param useRedTextureType Forces the generator to use a Red instead of a RGBA type for the shadow map texture format (default: true)
   */
  constructor(mapSize, light, usefulFloatFirst, camera, useRedTextureType = true) {
    if (!_CascadedShadowGenerator.IsSupported) {
      Logger.Error("CascadedShadowMap is not supported by the current engine.");
      return;
    }
    super(mapSize, light, usefulFloatFirst, camera, useRedTextureType);
    this.usePercentageCloserFiltering = true;
  }
  _initializeGenerator() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    this.penumbraDarkness = (_a = this.penumbraDarkness) !== null && _a !== void 0 ? _a : 1;
    this._numCascades = (_b = this._numCascades) !== null && _b !== void 0 ? _b : _CascadedShadowGenerator.DEFAULT_CASCADES_COUNT;
    this.stabilizeCascades = (_c = this.stabilizeCascades) !== null && _c !== void 0 ? _c : false;
    this._freezeShadowCastersBoundingInfoObservable = (_d = this._freezeShadowCastersBoundingInfoObservable) !== null && _d !== void 0 ? _d : null;
    this.freezeShadowCastersBoundingInfo = (_e = this.freezeShadowCastersBoundingInfo) !== null && _e !== void 0 ? _e : false;
    this._scbiMin = (_f = this._scbiMin) !== null && _f !== void 0 ? _f : new Vector3(0, 0, 0);
    this._scbiMax = (_g = this._scbiMax) !== null && _g !== void 0 ? _g : new Vector3(0, 0, 0);
    this._shadowCastersBoundingInfo = (_h = this._shadowCastersBoundingInfo) !== null && _h !== void 0 ? _h : new BoundingInfo(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    this._breaksAreDirty = (_j = this._breaksAreDirty) !== null && _j !== void 0 ? _j : true;
    this._minDistance = (_k = this._minDistance) !== null && _k !== void 0 ? _k : 0;
    this._maxDistance = (_l = this._maxDistance) !== null && _l !== void 0 ? _l : 1;
    this._currentLayer = (_m = this._currentLayer) !== null && _m !== void 0 ? _m : 0;
    this._shadowMaxZ = (_q = (_o = this._shadowMaxZ) !== null && _o !== void 0 ? _o : (_p = this._getCamera()) === null || _p === void 0 ? void 0 : _p.maxZ) !== null && _q !== void 0 ? _q : 1e4;
    this._debug = (_r = this._debug) !== null && _r !== void 0 ? _r : false;
    this._depthClamp = (_s = this._depthClamp) !== null && _s !== void 0 ? _s : true;
    this._cascadeBlendPercentage = (_t = this._cascadeBlendPercentage) !== null && _t !== void 0 ? _t : 0.1;
    this._lambda = (_u = this._lambda) !== null && _u !== void 0 ? _u : 0.5;
    this._autoCalcDepthBounds = (_v = this._autoCalcDepthBounds) !== null && _v !== void 0 ? _v : false;
    this._recreateSceneUBOs();
    super._initializeGenerator();
  }
  _createTargetRenderTexture() {
    const engine = this._scene.getEngine();
    const size = { width: this._mapSize, height: this._mapSize, layers: this.numCascades };
    this._shadowMap = new RenderTargetTexture(this._light.name + "_CSMShadowMap", size, this._scene, false, true, this._textureType, false, void 0, false, false, void 0, this._useRedTextureType ? 6 : 5);
    this._shadowMap.createDepthStencilTexture(engine.useReverseDepthBuffer ? 516 : 513, true);
    this._shadowMap.noPrePassRenderer = true;
  }
  _initializeShadowMap() {
    super._initializeShadowMap();
    if (this._shadowMap === null) {
      return;
    }
    this._transformMatricesAsArray = new Float32Array(this._numCascades * 16);
    this._viewSpaceFrustumsZ = new Array(this._numCascades);
    this._frustumLengths = new Array(this._numCascades);
    this._lightSizeUVCorrection = new Array(this._numCascades * 2);
    this._depthCorrection = new Array(this._numCascades);
    this._cascades = [];
    this._viewMatrices = [];
    this._projectionMatrices = [];
    this._transformMatrices = [];
    this._cascadeMinExtents = [];
    this._cascadeMaxExtents = [];
    this._frustumCenter = [];
    this._shadowCameraPos = [];
    this._frustumCornersWorldSpace = [];
    for (let cascadeIndex = 0; cascadeIndex < this._numCascades; ++cascadeIndex) {
      this._cascades[cascadeIndex] = {
        prevBreakDistance: 0,
        breakDistance: 0
      };
      this._viewMatrices[cascadeIndex] = Matrix.Zero();
      this._projectionMatrices[cascadeIndex] = Matrix.Zero();
      this._transformMatrices[cascadeIndex] = Matrix.Zero();
      this._cascadeMinExtents[cascadeIndex] = new Vector3();
      this._cascadeMaxExtents[cascadeIndex] = new Vector3();
      this._frustumCenter[cascadeIndex] = new Vector3();
      this._shadowCameraPos[cascadeIndex] = new Vector3();
      this._frustumCornersWorldSpace[cascadeIndex] = new Array(_CascadedShadowGenerator._FrustumCornersNDCSpace.length);
      for (let i = 0; i < _CascadedShadowGenerator._FrustumCornersNDCSpace.length; ++i) {
        this._frustumCornersWorldSpace[cascadeIndex][i] = new Vector3();
      }
    }
    const engine = this._scene.getEngine();
    this._shadowMap.onBeforeBindObservable.clear();
    this._shadowMap.onBeforeRenderObservable.clear();
    this._shadowMap.onBeforeRenderObservable.add((layer) => {
      if (this._sceneUBOs) {
        this._scene.setSceneUniformBuffer(this._sceneUBOs[layer]);
      }
      this._currentLayer = layer;
      if (this._filter === ShadowGenerator.FILTER_PCF) {
        engine.setColorWrite(false);
      }
      this._scene.setTransformMatrix(this.getCascadeViewMatrix(layer), this.getCascadeProjectionMatrix(layer));
      if (this._useUBO) {
        this._scene.getSceneUniformBuffer().unbindEffect();
        this._scene.finalizeSceneUbo();
      }
    });
    this._shadowMap.onBeforeBindObservable.add(() => {
      var _a;
      this._currentSceneUBO = this._scene.getSceneUniformBuffer();
      (_a = engine._debugPushGroup) === null || _a === void 0 ? void 0 : _a.call(engine, `cascaded shadow map generation for pass id ${engine.currentRenderPassId}`, 1);
      if (this._breaksAreDirty) {
        this._splitFrustum();
      }
      this._computeMatrices();
    });
    this._splitFrustum();
  }
  _bindCustomEffectForRenderSubMeshForShadowMap(subMesh, effect) {
    effect.setMatrix("viewProjection", this.getCascadeTransformMatrix(this._currentLayer));
  }
  _isReadyCustomDefines(defines) {
    defines.push("#define SM_DEPTHCLAMP " + (this._depthClamp && this._filter !== ShadowGenerator.FILTER_PCSS ? "1" : "0"));
  }
  /**
   * Prepare all the defines in a material relying on a shadow map at the specified light index.
   * @param defines Defines of the material we want to update
   * @param lightIndex Index of the light in the enabled light list of the material
   */
  prepareDefines(defines, lightIndex) {
    super.prepareDefines(defines, lightIndex);
    const scene = this._scene;
    const light = this._light;
    if (!scene.shadowsEnabled || !light.shadowEnabled) {
      return;
    }
    defines["SHADOWCSM" + lightIndex] = true;
    defines["SHADOWCSMDEBUG" + lightIndex] = this.debug;
    defines["SHADOWCSMNUM_CASCADES" + lightIndex] = this.numCascades;
    defines["SHADOWCSM_RIGHTHANDED" + lightIndex] = scene.useRightHandedSystem;
    const camera = this._getCamera();
    if (camera && this._shadowMaxZ <= (camera.maxZ || this._shadowMaxZ)) {
      defines["SHADOWCSMUSESHADOWMAXZ" + lightIndex] = true;
    }
    if (this.cascadeBlendPercentage === 0) {
      defines["SHADOWCSMNOBLEND" + lightIndex] = true;
    }
  }
  /**
   * Binds the shadow related information inside of an effect (information like near, far, darkness...
   * defined in the generator but impacting the effect).
   * @param lightIndex Index of the light in the enabled light list of the material owning the effect
   * @param effect The effect we are binfing the information for
   */
  bindShadowLight(lightIndex, effect) {
    const light = this._light;
    const scene = this._scene;
    if (!scene.shadowsEnabled || !light.shadowEnabled) {
      return;
    }
    const camera = this._getCamera();
    if (!camera) {
      return;
    }
    const shadowMap = this.getShadowMap();
    if (!shadowMap) {
      return;
    }
    const width = shadowMap.getSize().width;
    effect.setMatrices("lightMatrix" + lightIndex, this._transformMatricesAsArray);
    effect.setArray("viewFrustumZ" + lightIndex, this._viewSpaceFrustumsZ);
    effect.setFloat("cascadeBlendFactor" + lightIndex, this.cascadeBlendPercentage === 0 ? 1e4 : 1 / this.cascadeBlendPercentage);
    effect.setArray("frustumLengths" + lightIndex, this._frustumLengths);
    if (this._filter === ShadowGenerator.FILTER_PCF) {
      effect.setDepthStencilTexture("shadowSampler" + lightIndex, shadowMap);
      light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), width, 1 / width, this.frustumEdgeFalloff, lightIndex);
    } else if (this._filter === ShadowGenerator.FILTER_PCSS) {
      for (let cascadeIndex = 0; cascadeIndex < this._numCascades; ++cascadeIndex) {
        this._lightSizeUVCorrection[cascadeIndex * 2 + 0] = cascadeIndex === 0 ? 1 : (this._cascadeMaxExtents[0].x - this._cascadeMinExtents[0].x) / (this._cascadeMaxExtents[cascadeIndex].x - this._cascadeMinExtents[cascadeIndex].x);
        this._lightSizeUVCorrection[cascadeIndex * 2 + 1] = cascadeIndex === 0 ? 1 : (this._cascadeMaxExtents[0].y - this._cascadeMinExtents[0].y) / (this._cascadeMaxExtents[cascadeIndex].y - this._cascadeMinExtents[cascadeIndex].y);
        this._depthCorrection[cascadeIndex] = cascadeIndex === 0 ? 1 : (this._cascadeMaxExtents[cascadeIndex].z - this._cascadeMinExtents[cascadeIndex].z) / (this._cascadeMaxExtents[0].z - this._cascadeMinExtents[0].z);
      }
      effect.setDepthStencilTexture("shadowSampler" + lightIndex, shadowMap);
      effect.setTexture("depthSampler" + lightIndex, shadowMap);
      effect.setArray2("lightSizeUVCorrection" + lightIndex, this._lightSizeUVCorrection);
      effect.setArray("depthCorrection" + lightIndex, this._depthCorrection);
      effect.setFloat("penumbraDarkness" + lightIndex, this.penumbraDarkness);
      light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), 1 / width, this._contactHardeningLightSizeUVRatio * width, this.frustumEdgeFalloff, lightIndex);
    } else {
      effect.setTexture("shadowSampler" + lightIndex, shadowMap);
      light._uniformBuffer.updateFloat4("shadowsInfo", this.getDarkness(), width, 1 / width, this.frustumEdgeFalloff, lightIndex);
    }
    light._uniformBuffer.updateFloat2("depthValues", this.getLight().getDepthMinZ(camera), this.getLight().getDepthMinZ(camera) + this.getLight().getDepthMaxZ(camera), lightIndex);
  }
  /**
   * Gets the transformation matrix of the first cascade used to project the meshes into the map from the light point of view.
   * (eq to view projection * shadow projection matrices)
   * @returns The transform matrix used to create the shadow map
   */
  getTransformMatrix() {
    return this.getCascadeTransformMatrix(0);
  }
  /**
   * Disposes the ShadowGenerator.
   * Returns nothing.
   */
  dispose() {
    super.dispose();
    if (this._freezeShadowCastersBoundingInfoObservable) {
      this._scene.onBeforeRenderObservable.remove(this._freezeShadowCastersBoundingInfoObservable);
      this._freezeShadowCastersBoundingInfoObservable = null;
    }
    if (this._depthReducer) {
      this._depthReducer.dispose();
      this._depthReducer = null;
    }
  }
  /**
   * Serializes the shadow generator setup to a json object.
   * @returns The serialized JSON object
   */
  serialize() {
    const serializationObject = super.serialize();
    const shadowMap = this.getShadowMap();
    if (!shadowMap) {
      return serializationObject;
    }
    serializationObject.numCascades = this._numCascades;
    serializationObject.debug = this._debug;
    serializationObject.stabilizeCascades = this.stabilizeCascades;
    serializationObject.lambda = this._lambda;
    serializationObject.cascadeBlendPercentage = this.cascadeBlendPercentage;
    serializationObject.depthClamp = this._depthClamp;
    serializationObject.autoCalcDepthBounds = this.autoCalcDepthBounds;
    serializationObject.shadowMaxZ = this._shadowMaxZ;
    serializationObject.penumbraDarkness = this.penumbraDarkness;
    serializationObject.freezeShadowCastersBoundingInfo = this._freezeShadowCastersBoundingInfo;
    serializationObject.minDistance = this.minDistance;
    serializationObject.maxDistance = this.maxDistance;
    serializationObject.renderList = [];
    if (shadowMap.renderList) {
      for (let meshIndex = 0; meshIndex < shadowMap.renderList.length; meshIndex++) {
        const mesh = shadowMap.renderList[meshIndex];
        serializationObject.renderList.push(mesh.id);
      }
    }
    return serializationObject;
  }
  /**
   * Parses a serialized ShadowGenerator and returns a new ShadowGenerator.
   * @param parsedShadowGenerator The JSON object to parse
   * @param scene The scene to create the shadow map for
   * @returns The parsed shadow generator
   */
  static Parse(parsedShadowGenerator, scene) {
    const shadowGenerator = ShadowGenerator.Parse(parsedShadowGenerator, scene, (mapSize, light, camera) => new _CascadedShadowGenerator(mapSize, light, void 0, camera));
    if (parsedShadowGenerator.numCascades !== void 0) {
      shadowGenerator.numCascades = parsedShadowGenerator.numCascades;
    }
    if (parsedShadowGenerator.debug !== void 0) {
      shadowGenerator.debug = parsedShadowGenerator.debug;
    }
    if (parsedShadowGenerator.stabilizeCascades !== void 0) {
      shadowGenerator.stabilizeCascades = parsedShadowGenerator.stabilizeCascades;
    }
    if (parsedShadowGenerator.lambda !== void 0) {
      shadowGenerator.lambda = parsedShadowGenerator.lambda;
    }
    if (parsedShadowGenerator.cascadeBlendPercentage !== void 0) {
      shadowGenerator.cascadeBlendPercentage = parsedShadowGenerator.cascadeBlendPercentage;
    }
    if (parsedShadowGenerator.depthClamp !== void 0) {
      shadowGenerator.depthClamp = parsedShadowGenerator.depthClamp;
    }
    if (parsedShadowGenerator.autoCalcDepthBounds !== void 0) {
      shadowGenerator.autoCalcDepthBounds = parsedShadowGenerator.autoCalcDepthBounds;
    }
    if (parsedShadowGenerator.shadowMaxZ !== void 0) {
      shadowGenerator.shadowMaxZ = parsedShadowGenerator.shadowMaxZ;
    }
    if (parsedShadowGenerator.penumbraDarkness !== void 0) {
      shadowGenerator.penumbraDarkness = parsedShadowGenerator.penumbraDarkness;
    }
    if (parsedShadowGenerator.freezeShadowCastersBoundingInfo !== void 0) {
      shadowGenerator.freezeShadowCastersBoundingInfo = parsedShadowGenerator.freezeShadowCastersBoundingInfo;
    }
    if (parsedShadowGenerator.minDistance !== void 0 && parsedShadowGenerator.maxDistance !== void 0) {
      shadowGenerator.setMinMaxDistance(parsedShadowGenerator.minDistance, parsedShadowGenerator.maxDistance);
    }
    return shadowGenerator;
  }
};
CascadedShadowGenerator._FrustumCornersNDCSpace = [
  new Vector3(-1, 1, -1),
  new Vector3(1, 1, -1),
  new Vector3(1, -1, -1),
  new Vector3(-1, -1, -1),
  new Vector3(-1, 1, 1),
  new Vector3(1, 1, 1),
  new Vector3(1, -1, 1),
  new Vector3(-1, -1, 1)
];
CascadedShadowGenerator.CLASSNAME = "CascadedShadowGenerator";
CascadedShadowGenerator.DEFAULT_CASCADES_COUNT = 4;
CascadedShadowGenerator.MIN_CASCADES_COUNT = 2;
CascadedShadowGenerator.MAX_CASCADES_COUNT = 4;
CascadedShadowGenerator._SceneComponentInitialization = (_) => {
  throw _WarnImport("ShadowGeneratorSceneComponent");
};

// node_modules/@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent.js
AbstractScene.AddParser(SceneComponentConstants.NAME_SHADOWGENERATOR, (parsedData, scene) => {
  if (parsedData.shadowGenerators !== void 0 && parsedData.shadowGenerators !== null) {
    for (let index = 0, cache = parsedData.shadowGenerators.length; index < cache; index++) {
      const parsedShadowGenerator = parsedData.shadowGenerators[index];
      if (parsedShadowGenerator.className === CascadedShadowGenerator.CLASSNAME) {
        CascadedShadowGenerator.Parse(parsedShadowGenerator, scene);
      } else {
        ShadowGenerator.Parse(parsedShadowGenerator, scene);
      }
    }
  }
});
var ShadowGeneratorSceneComponent = class {
  /**
   * Creates a new instance of the component for the given scene
   * @param scene Defines the scene to register the component in
   */
  constructor(scene) {
    this.name = SceneComponentConstants.NAME_SHADOWGENERATOR;
    this.scene = scene;
  }
  /**
   * Registers the component in a given scene
   */
  register() {
    this.scene._gatherRenderTargetsStage.registerStep(SceneComponentConstants.STEP_GATHERRENDERTARGETS_SHADOWGENERATOR, this, this._gatherRenderTargets);
  }
  /**
   * Rebuilds the elements related to this component in case of
   * context lost for instance.
   */
  rebuild() {
  }
  /**
   * Serializes the component data to the specified json object
   * @param serializationObject The object to serialize to
   */
  serialize(serializationObject) {
    serializationObject.shadowGenerators = [];
    const lights = this.scene.lights;
    for (const light of lights) {
      const shadowGenerators = light.getShadowGenerators();
      if (shadowGenerators) {
        const iterator = shadowGenerators.values();
        for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
          const shadowGenerator = key.value;
          serializationObject.shadowGenerators.push(shadowGenerator.serialize());
        }
      }
    }
  }
  /**
   * Adds all the elements from the container to the scene
   * @param container the container holding the elements
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addFromContainer(container) {
  }
  /**
   * Removes all the elements in the container from the scene
   * @param container contains the elements to remove
   * @param dispose if the removed element should be disposed (default: false)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeFromContainer(container, dispose) {
  }
  /**
   * Rebuilds the elements related to this component in case of
   * context lost for instance.
   */
  dispose() {
  }
  _gatherRenderTargets(renderTargets) {
    const scene = this.scene;
    if (this.scene.shadowsEnabled) {
      for (let lightIndex = 0; lightIndex < scene.lights.length; lightIndex++) {
        const light = scene.lights[lightIndex];
        const shadowGenerators = light.getShadowGenerators();
        if (light.isEnabled() && light.shadowEnabled && shadowGenerators) {
          const iterator = shadowGenerators.values();
          for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
            const shadowGenerator = key.value;
            const shadowMap = shadowGenerator.getShadowMap();
            if (scene.textures.indexOf(shadowMap) !== -1) {
              renderTargets.push(shadowMap);
            }
          }
        }
      }
    }
  }
};
ShadowGenerator._SceneComponentInitialization = (scene) => {
  let component = scene._getComponent(SceneComponentConstants.NAME_SHADOWGENERATOR);
  if (!component) {
    component = new ShadowGeneratorSceneComponent(scene);
    scene._addComponent(component);
  }
};

// node_modules/@babylonjs/core/Lights/directionalLight.js
Node.AddNodeConstructor("Light_Type_1", (name26, scene) => {
  return () => new DirectionalLight(name26, Vector3.Zero(), scene);
});
var DirectionalLight = class extends ShadowLight {
  /**
   * Fix frustum size for the shadow generation. This is disabled if the value is 0.
   */
  get shadowFrustumSize() {
    return this._shadowFrustumSize;
  }
  /**
   * Specifies a fix frustum size for the shadow generation.
   */
  set shadowFrustumSize(value) {
    this._shadowFrustumSize = value;
    this.forceProjectionMatrixCompute();
  }
  /**
   * Gets the shadow projection scale against the optimal computed one.
   * 0.1 by default which means that the projection window is increase by 10% from the optimal size.
   * This does not impact in fixed frustum size (shadowFrustumSize being set)
   */
  get shadowOrthoScale() {
    return this._shadowOrthoScale;
  }
  /**
   * Sets the shadow projection scale against the optimal computed one.
   * 0.1 by default which means that the projection window is increase by 10% from the optimal size.
   * This does not impact in fixed frustum size (shadowFrustumSize being set)
   */
  set shadowOrthoScale(value) {
    this._shadowOrthoScale = value;
    this.forceProjectionMatrixCompute();
  }
  /**
   * Gets or sets the orthoLeft property used to build the light frustum
   */
  get orthoLeft() {
    return this._orthoLeft;
  }
  set orthoLeft(left) {
    this._orthoLeft = left;
  }
  /**
   * Gets or sets the orthoRight property used to build the light frustum
   */
  get orthoRight() {
    return this._orthoRight;
  }
  set orthoRight(right) {
    this._orthoRight = right;
  }
  /**
   * Gets or sets the orthoTop property used to build the light frustum
   */
  get orthoTop() {
    return this._orthoTop;
  }
  set orthoTop(top) {
    this._orthoTop = top;
  }
  /**
   * Gets or sets the orthoBottom property used to build the light frustum
   */
  get orthoBottom() {
    return this._orthoBottom;
  }
  set orthoBottom(bottom) {
    this._orthoBottom = bottom;
  }
  /**
   * Creates a DirectionalLight object in the scene, oriented towards the passed direction (Vector3).
   * The directional light is emitted from everywhere in the given direction.
   * It can cast shadows.
   * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
   * @param name The friendly name of the light
   * @param direction The direction of the light
   * @param scene The scene the light belongs to
   */
  constructor(name26, direction, scene) {
    super(name26, scene);
    this._shadowFrustumSize = 0;
    this._shadowOrthoScale = 0.1;
    this.autoUpdateExtends = true;
    this.autoCalcShadowZBounds = false;
    this._orthoLeft = Number.MAX_VALUE;
    this._orthoRight = Number.MIN_VALUE;
    this._orthoTop = Number.MIN_VALUE;
    this._orthoBottom = Number.MAX_VALUE;
    this.position = direction.scale(-1);
    this.direction = direction;
  }
  /**
   * Returns the string "DirectionalLight".
   * @returns The class name
   */
  getClassName() {
    return "DirectionalLight";
  }
  /**
   * Returns the integer 1.
   * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
   */
  getTypeID() {
    return Light.LIGHTTYPEID_DIRECTIONALLIGHT;
  }
  /**
   * Sets the passed matrix "matrix" as projection matrix for the shadows cast by the light according to the passed view matrix.
   * Returns the DirectionalLight Shadow projection matrix.
   * @param matrix
   * @param viewMatrix
   * @param renderList
   */
  _setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList) {
    if (this.shadowFrustumSize > 0) {
      this._setDefaultFixedFrustumShadowProjectionMatrix(matrix);
    } else {
      this._setDefaultAutoExtendShadowProjectionMatrix(matrix, viewMatrix, renderList);
    }
  }
  /**
   * Sets the passed matrix "matrix" as fixed frustum projection matrix for the shadows cast by the light according to the passed view matrix.
   * Returns the DirectionalLight Shadow projection matrix.
   * @param matrix
   */
  _setDefaultFixedFrustumShadowProjectionMatrix(matrix) {
    const activeCamera = this.getScene().activeCamera;
    if (!activeCamera) {
      return;
    }
    Matrix.OrthoLHToRef(this.shadowFrustumSize, this.shadowFrustumSize, this.shadowMinZ !== void 0 ? this.shadowMinZ : activeCamera.minZ, this.shadowMaxZ !== void 0 ? this.shadowMaxZ : activeCamera.maxZ, matrix, this.getScene().getEngine().isNDCHalfZRange);
  }
  /**
   * Sets the passed matrix "matrix" as auto extend projection matrix for the shadows cast by the light according to the passed view matrix.
   * Returns the DirectionalLight Shadow projection matrix.
   * @param matrix
   * @param viewMatrix
   * @param renderList
   */
  _setDefaultAutoExtendShadowProjectionMatrix(matrix, viewMatrix, renderList) {
    const activeCamera = this.getScene().activeCamera;
    if (!activeCamera) {
      return;
    }
    if (this.autoUpdateExtends || this._orthoLeft === Number.MAX_VALUE) {
      const tempVector3 = Vector3.Zero();
      this._orthoLeft = Number.MAX_VALUE;
      this._orthoRight = -Number.MAX_VALUE;
      this._orthoTop = -Number.MAX_VALUE;
      this._orthoBottom = Number.MAX_VALUE;
      let shadowMinZ = Number.MAX_VALUE;
      let shadowMaxZ = -Number.MAX_VALUE;
      for (let meshIndex = 0; meshIndex < renderList.length; meshIndex++) {
        const mesh = renderList[meshIndex];
        if (!mesh) {
          continue;
        }
        const boundingInfo = mesh.getBoundingInfo();
        const boundingBox = boundingInfo.boundingBox;
        for (let index = 0; index < boundingBox.vectorsWorld.length; index++) {
          Vector3.TransformCoordinatesToRef(boundingBox.vectorsWorld[index], viewMatrix, tempVector3);
          if (tempVector3.x < this._orthoLeft) {
            this._orthoLeft = tempVector3.x;
          }
          if (tempVector3.y < this._orthoBottom) {
            this._orthoBottom = tempVector3.y;
          }
          if (tempVector3.x > this._orthoRight) {
            this._orthoRight = tempVector3.x;
          }
          if (tempVector3.y > this._orthoTop) {
            this._orthoTop = tempVector3.y;
          }
          if (this.autoCalcShadowZBounds) {
            if (tempVector3.z < shadowMinZ) {
              shadowMinZ = tempVector3.z;
            }
            if (tempVector3.z > shadowMaxZ) {
              shadowMaxZ = tempVector3.z;
            }
          }
        }
      }
      if (this.autoCalcShadowZBounds) {
        this._shadowMinZ = shadowMinZ;
        this._shadowMaxZ = shadowMaxZ;
      }
    }
    const xOffset = this._orthoRight - this._orthoLeft;
    const yOffset = this._orthoTop - this._orthoBottom;
    const minZ = this.shadowMinZ !== void 0 ? this.shadowMinZ : activeCamera.minZ;
    const maxZ = this.shadowMaxZ !== void 0 ? this.shadowMaxZ : activeCamera.maxZ;
    const useReverseDepthBuffer = this.getScene().getEngine().useReverseDepthBuffer;
    Matrix.OrthoOffCenterLHToRef(this._orthoLeft - xOffset * this.shadowOrthoScale, this._orthoRight + xOffset * this.shadowOrthoScale, this._orthoBottom - yOffset * this.shadowOrthoScale, this._orthoTop + yOffset * this.shadowOrthoScale, useReverseDepthBuffer ? maxZ : minZ, useReverseDepthBuffer ? minZ : maxZ, matrix, this.getScene().getEngine().isNDCHalfZRange);
  }
  _buildUniformLayout() {
    this._uniformBuffer.addUniform("vLightData", 4);
    this._uniformBuffer.addUniform("vLightDiffuse", 4);
    this._uniformBuffer.addUniform("vLightSpecular", 4);
    this._uniformBuffer.addUniform("shadowsInfo", 3);
    this._uniformBuffer.addUniform("depthValues", 2);
    this._uniformBuffer.create();
  }
  /**
   * Sets the passed Effect object with the DirectionalLight transformed position (or position if not parented) and the passed name.
   * @param effect The effect to update
   * @param lightIndex The index of the light in the effect to update
   * @returns The directional light
   */
  transferToEffect(effect, lightIndex) {
    if (this.computeTransformedInformation()) {
      this._uniformBuffer.updateFloat4("vLightData", this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z, 1, lightIndex);
      return this;
    }
    this._uniformBuffer.updateFloat4("vLightData", this.direction.x, this.direction.y, this.direction.z, 1, lightIndex);
    return this;
  }
  transferToNodeMaterialEffect(effect, lightDataUniformName) {
    if (this.computeTransformedInformation()) {
      effect.setFloat3(lightDataUniformName, this.transformedDirection.x, this.transformedDirection.y, this.transformedDirection.z);
      return this;
    }
    effect.setFloat3(lightDataUniformName, this.direction.x, this.direction.y, this.direction.z);
    return this;
  }
  /**
   * Gets the minZ used for shadow according to both the scene and the light.
   *
   * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
   * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
   * (when not using reverse depth buffer / NDC half Z range)
   * @param activeCamera The camera we are returning the min for
   * @returns the depth min z
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDepthMinZ(activeCamera) {
    const engine = this._scene.getEngine();
    return !engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : 1;
  }
  /**
   * Gets the maxZ used for shadow according to both the scene and the light.
   *
   * Values are fixed on directional lights as it relies on an ortho projection hence the need to convert being
   * -1 and 1 to 0 and 1 doing (depth + min) / (min + max) -> (depth + 1) / (1 + 1) -> (depth * 0.5) + 0.5.
   * (when not using reverse depth buffer / NDC half Z range)
   * @param activeCamera The camera we are returning the max for
   * @returns the depth max z
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDepthMaxZ(activeCamera) {
    const engine = this._scene.getEngine();
    return engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : 1;
  }
  /**
   * Prepares the list of defines specific to the light type.
   * @param defines the list of defines
   * @param lightIndex defines the index of the light for the effect
   */
  prepareLightSpecificDefines(defines, lightIndex) {
    defines["DIRLIGHT" + lightIndex] = true;
  }
};
__decorate([
  serialize()
], DirectionalLight.prototype, "shadowFrustumSize", null);
__decorate([
  serialize()
], DirectionalLight.prototype, "shadowOrthoScale", null);
__decorate([
  serialize()
], DirectionalLight.prototype, "autoUpdateExtends", void 0);
__decorate([
  serialize()
], DirectionalLight.prototype, "autoCalcShadowZBounds", void 0);
__decorate([
  serialize("orthoLeft")
], DirectionalLight.prototype, "_orthoLeft", void 0);
__decorate([
  serialize("orthoRight")
], DirectionalLight.prototype, "_orthoRight", void 0);
__decorate([
  serialize("orthoTop")
], DirectionalLight.prototype, "_orthoTop", void 0);
__decorate([
  serialize("orthoBottom")
], DirectionalLight.prototype, "_orthoBottom", void 0);

// node_modules/@babylonjs/core/Lights/hemisphericLight.js
Node.AddNodeConstructor("Light_Type_3", (name26, scene) => {
  return () => new HemisphericLight(name26, Vector3.Zero(), scene);
});
var HemisphericLight = class extends Light {
  /**
   * Creates a HemisphericLight object in the scene according to the passed direction (Vector3).
   * The HemisphericLight simulates the ambient environment light, so the passed direction is the light reflection direction, not the incoming direction.
   * The HemisphericLight can't cast shadows.
   * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
   * @param name The friendly name of the light
   * @param direction The direction of the light reflection
   * @param scene The scene the light belongs to
   */
  constructor(name26, direction, scene) {
    super(name26, scene);
    this.groundColor = new Color3(0, 0, 0);
    this.direction = direction || Vector3.Up();
  }
  _buildUniformLayout() {
    this._uniformBuffer.addUniform("vLightData", 4);
    this._uniformBuffer.addUniform("vLightDiffuse", 4);
    this._uniformBuffer.addUniform("vLightSpecular", 4);
    this._uniformBuffer.addUniform("vLightGround", 3);
    this._uniformBuffer.addUniform("shadowsInfo", 3);
    this._uniformBuffer.addUniform("depthValues", 2);
    this._uniformBuffer.create();
  }
  /**
   * Returns the string "HemisphericLight".
   * @returns The class name
   */
  getClassName() {
    return "HemisphericLight";
  }
  /**
   * Sets the HemisphericLight direction towards the passed target (Vector3).
   * Returns the updated direction.
   * @param target The target the direction should point to
   * @returns The computed direction
   */
  setDirectionToTarget(target) {
    this.direction = Vector3.Normalize(target.subtract(Vector3.Zero()));
    return this.direction;
  }
  /**
   * Returns the shadow generator associated to the light.
   * @returns Always null for hemispheric lights because it does not support shadows.
   */
  getShadowGenerator() {
    return null;
  }
  /**
   * Sets the passed Effect object with the HemisphericLight normalized direction and color and the passed name (string).
   * @param _effect The effect to update
   * @param lightIndex The index of the light in the effect to update
   * @returns The hemispheric light
   */
  transferToEffect(_effect, lightIndex) {
    const normalizeDirection = Vector3.Normalize(this.direction);
    this._uniformBuffer.updateFloat4("vLightData", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, 0, lightIndex);
    this._uniformBuffer.updateColor3("vLightGround", this.groundColor.scale(this.intensity), lightIndex);
    return this;
  }
  transferToNodeMaterialEffect(effect, lightDataUniformName) {
    const normalizeDirection = Vector3.Normalize(this.direction);
    effect.setFloat3(lightDataUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z);
    return this;
  }
  /**
   * Computes the world matrix of the node
   * @returns the world matrix
   */
  computeWorldMatrix() {
    if (!this._worldMatrix) {
      this._worldMatrix = Matrix.Identity();
    }
    return this._worldMatrix;
  }
  /**
   * Returns the integer 3.
   * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
   */
  getTypeID() {
    return Light.LIGHTTYPEID_HEMISPHERICLIGHT;
  }
  /**
   * Prepares the list of defines specific to the light type.
   * @param defines the list of defines
   * @param lightIndex defines the index of the light for the effect
   */
  prepareLightSpecificDefines(defines, lightIndex) {
    defines["HEMILIGHT" + lightIndex] = true;
  }
};
__decorate([
  serializeAsColor3()
], HemisphericLight.prototype, "groundColor", void 0);
__decorate([
  serializeAsVector3()
], HemisphericLight.prototype, "direction", void 0);

// node_modules/@babylonjs/core/Lights/pointLight.js
Node.AddNodeConstructor("Light_Type_0", (name26, scene) => {
  return () => new PointLight(name26, Vector3.Zero(), scene);
});
var PointLight = class extends ShadowLight {
  /**
   * Getter: In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
   * This specifies what angle the shadow will use to be created.
   *
   * It default to 90 degrees to work nicely with the cube texture generation for point lights shadow maps.
   */
  get shadowAngle() {
    return this._shadowAngle;
  }
  /**
   * Setter: In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
   * This specifies what angle the shadow will use to be created.
   *
   * It default to 90 degrees to work nicely with the cube texture generation for point lights shadow maps.
   */
  set shadowAngle(value) {
    this._shadowAngle = value;
    this.forceProjectionMatrixCompute();
  }
  /**
   * Gets the direction if it has been set.
   * In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
   */
  get direction() {
    return this._direction;
  }
  /**
   * In case of direction provided, the shadow will not use a cube texture but simulate a spot shadow as a fallback
   */
  set direction(value) {
    const previousNeedCube = this.needCube();
    this._direction = value;
    if (this.needCube() !== previousNeedCube && this._shadowGenerators) {
      const iterator = this._shadowGenerators.values();
      for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
        const shadowGenerator = key.value;
        shadowGenerator.recreateShadowMap();
      }
    }
  }
  /**
   * Creates a PointLight object from the passed name and position (Vector3) and adds it in the scene.
   * A PointLight emits the light in every direction.
   * It can cast shadows.
   * If the scene camera is already defined and you want to set your PointLight at the camera position, just set it :
   * ```javascript
   * var pointLight = new PointLight("pl", camera.position, scene);
   * ```
   * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
   * @param name The light friendly name
   * @param position The position of the point light in the scene
   * @param scene The scene the lights belongs to
   */
  constructor(name26, position, scene) {
    super(name26, scene);
    this._shadowAngle = Math.PI / 2;
    this.position = position;
  }
  /**
   * Returns the string "PointLight"
   * @returns the class name
   */
  getClassName() {
    return "PointLight";
  }
  /**
   * Returns the integer 0.
   * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
   */
  getTypeID() {
    return Light.LIGHTTYPEID_POINTLIGHT;
  }
  /**
   * Specifies whether or not the shadowmap should be a cube texture.
   * @returns true if the shadowmap needs to be a cube texture.
   */
  needCube() {
    return !this.direction;
  }
  /**
   * Returns a new Vector3 aligned with the PointLight cube system according to the passed cube face index (integer).
   * @param faceIndex The index of the face we are computed the direction to generate shadow
   * @returns The set direction in 2d mode otherwise the direction to the cubemap face if needCube() is true
   */
  getShadowDirection(faceIndex) {
    if (this.direction) {
      return super.getShadowDirection(faceIndex);
    } else {
      switch (faceIndex) {
        case 0:
          return new Vector3(1, 0, 0);
        case 1:
          return new Vector3(-1, 0, 0);
        case 2:
          return new Vector3(0, -1, 0);
        case 3:
          return new Vector3(0, 1, 0);
        case 4:
          return new Vector3(0, 0, 1);
        case 5:
          return new Vector3(0, 0, -1);
      }
    }
    return Vector3.Zero();
  }
  /**
   * Sets the passed matrix "matrix" as a left-handed perspective projection matrix with the following settings :
   * - fov = PI / 2
   * - aspect ratio : 1.0
   * - z-near and far equal to the active camera minZ and maxZ.
   * Returns the PointLight.
   * @param matrix
   * @param viewMatrix
   * @param renderList
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList) {
    const activeCamera = this.getScene().activeCamera;
    if (!activeCamera) {
      return;
    }
    const minZ = this.shadowMinZ !== void 0 ? this.shadowMinZ : activeCamera.minZ;
    const maxZ = this.shadowMaxZ !== void 0 ? this.shadowMaxZ : activeCamera.maxZ;
    const useReverseDepthBuffer = this.getScene().getEngine().useReverseDepthBuffer;
    Matrix.PerspectiveFovLHToRef(this.shadowAngle, 1, useReverseDepthBuffer ? maxZ : minZ, useReverseDepthBuffer ? minZ : maxZ, matrix, true, this._scene.getEngine().isNDCHalfZRange, void 0, useReverseDepthBuffer);
  }
  _buildUniformLayout() {
    this._uniformBuffer.addUniform("vLightData", 4);
    this._uniformBuffer.addUniform("vLightDiffuse", 4);
    this._uniformBuffer.addUniform("vLightSpecular", 4);
    this._uniformBuffer.addUniform("vLightFalloff", 4);
    this._uniformBuffer.addUniform("shadowsInfo", 3);
    this._uniformBuffer.addUniform("depthValues", 2);
    this._uniformBuffer.create();
  }
  /**
   * Sets the passed Effect "effect" with the PointLight transformed position (or position, if none) and passed name (string).
   * @param effect The effect to update
   * @param lightIndex The index of the light in the effect to update
   * @returns The point light
   */
  transferToEffect(effect, lightIndex) {
    if (this.computeTransformedInformation()) {
      this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z, 0, lightIndex);
    } else {
      this._uniformBuffer.updateFloat4("vLightData", this.position.x, this.position.y, this.position.z, 0, lightIndex);
    }
    this._uniformBuffer.updateFloat4("vLightFalloff", this.range, this._inverseSquaredRange, 0, 0, lightIndex);
    return this;
  }
  transferToNodeMaterialEffect(effect, lightDataUniformName) {
    if (this.computeTransformedInformation()) {
      effect.setFloat3(lightDataUniformName, this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z);
    } else {
      effect.setFloat3(lightDataUniformName, this.position.x, this.position.y, this.position.z);
    }
    return this;
  }
  /**
   * Prepares the list of defines specific to the light type.
   * @param defines the list of defines
   * @param lightIndex defines the index of the light for the effect
   */
  prepareLightSpecificDefines(defines, lightIndex) {
    defines["POINTLIGHT" + lightIndex] = true;
  }
};
__decorate([
  serialize()
], PointLight.prototype, "shadowAngle", null);

// node_modules/@babylonjs/core/Lights/spotLight.js
Node.AddNodeConstructor("Light_Type_2", (name26, scene) => {
  return () => new SpotLight(name26, Vector3.Zero(), Vector3.Zero(), 0, 0, scene);
});
var SpotLight = class _SpotLight extends ShadowLight {
  /**
   * Gets the cone angle of the spot light in Radians.
   */
  get angle() {
    return this._angle;
  }
  /**
   * Sets the cone angle of the spot light in Radians.
   */
  set angle(value) {
    this._angle = value;
    this._cosHalfAngle = Math.cos(value * 0.5);
    this._projectionTextureProjectionLightDirty = true;
    this.forceProjectionMatrixCompute();
    this._computeAngleValues();
  }
  /**
   * Only used in gltf falloff mode, this defines the angle where
   * the directional falloff will start before cutting at angle which could be seen
   * as outer angle.
   */
  get innerAngle() {
    return this._innerAngle;
  }
  /**
   * Only used in gltf falloff mode, this defines the angle where
   * the directional falloff will start before cutting at angle which could be seen
   * as outer angle.
   */
  set innerAngle(value) {
    this._innerAngle = value;
    this._computeAngleValues();
  }
  /**
   * Allows scaling the angle of the light for shadow generation only.
   */
  get shadowAngleScale() {
    return this._shadowAngleScale;
  }
  /**
   * Allows scaling the angle of the light for shadow generation only.
   */
  set shadowAngleScale(value) {
    this._shadowAngleScale = value;
    this.forceProjectionMatrixCompute();
  }
  /**
   * Allows reading the projection texture
   */
  get projectionTextureMatrix() {
    return this._projectionTextureMatrix;
  }
  /**
   * Gets the near clip of the Spotlight for texture projection.
   */
  get projectionTextureLightNear() {
    return this._projectionTextureLightNear;
  }
  /**
   * Sets the near clip of the Spotlight for texture projection.
   */
  set projectionTextureLightNear(value) {
    this._projectionTextureLightNear = value;
    this._projectionTextureProjectionLightDirty = true;
  }
  /**
   * Gets the far clip of the Spotlight for texture projection.
   */
  get projectionTextureLightFar() {
    return this._projectionTextureLightFar;
  }
  /**
   * Sets the far clip of the Spotlight for texture projection.
   */
  set projectionTextureLightFar(value) {
    this._projectionTextureLightFar = value;
    this._projectionTextureProjectionLightDirty = true;
  }
  /**
   * Gets the Up vector of the Spotlight for texture projection.
   */
  get projectionTextureUpDirection() {
    return this._projectionTextureUpDirection;
  }
  /**
   * Sets the Up vector of the Spotlight for texture projection.
   */
  set projectionTextureUpDirection(value) {
    this._projectionTextureUpDirection = value;
    this._projectionTextureProjectionLightDirty = true;
  }
  /**
   * Gets the projection texture of the light.
   */
  get projectionTexture() {
    return this._projectionTexture;
  }
  /**
   * Sets the projection texture of the light.
   */
  set projectionTexture(value) {
    if (this._projectionTexture === value) {
      return;
    }
    this._projectionTexture = value;
    this._projectionTextureDirty = true;
    if (this._projectionTexture && !this._projectionTexture.isReady()) {
      if (_SpotLight._IsProceduralTexture(this._projectionTexture)) {
        this._projectionTexture.getEffect().executeWhenCompiled(() => {
          this._markMeshesAsLightDirty();
        });
      } else if (_SpotLight._IsTexture(this._projectionTexture)) {
        this._projectionTexture.onLoadObservable.addOnce(() => {
          this._markMeshesAsLightDirty();
        });
      }
    }
  }
  static _IsProceduralTexture(texture) {
    return texture.onGeneratedObservable !== void 0;
  }
  static _IsTexture(texture) {
    return texture.onLoadObservable !== void 0;
  }
  /**
   * Gets or sets the light projection matrix as used by the projection texture
   */
  get projectionTextureProjectionLightMatrix() {
    return this._projectionTextureProjectionLightMatrix;
  }
  set projectionTextureProjectionLightMatrix(projection) {
    this._projectionTextureProjectionLightMatrix = projection;
    this._projectionTextureProjectionLightDirty = false;
    this._projectionTextureDirty = true;
  }
  /**
   * Creates a SpotLight object in the scene. A spot light is a simply light oriented cone.
   * It can cast shadows.
   * Documentation : https://doc.babylonjs.com/features/featuresDeepDive/lights/lights_introduction
   * @param name The light friendly name
   * @param position The position of the spot light in the scene
   * @param direction The direction of the light in the scene
   * @param angle The cone angle of the light in Radians
   * @param exponent The light decay speed with the distance from the emission spot
   * @param scene The scene the lights belongs to
   */
  constructor(name26, position, direction, angle, exponent, scene) {
    super(name26, scene);
    this._innerAngle = 0;
    this._projectionTextureMatrix = Matrix.Zero();
    this._projectionTextureLightNear = 1e-6;
    this._projectionTextureLightFar = 1e3;
    this._projectionTextureUpDirection = Vector3.Up();
    this._projectionTextureViewLightDirty = true;
    this._projectionTextureProjectionLightDirty = true;
    this._projectionTextureDirty = true;
    this._projectionTextureViewTargetVector = Vector3.Zero();
    this._projectionTextureViewLightMatrix = Matrix.Zero();
    this._projectionTextureProjectionLightMatrix = Matrix.Zero();
    this._projectionTextureScalingMatrix = Matrix.FromValues(0.5, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5, 1);
    this.position = position;
    this.direction = direction;
    this.angle = angle;
    this.exponent = exponent;
  }
  /**
   * Returns the string "SpotLight".
   * @returns the class name
   */
  getClassName() {
    return "SpotLight";
  }
  /**
   * Returns the integer 2.
   * @returns The light Type id as a constant defines in Light.LIGHTTYPEID_x
   */
  getTypeID() {
    return Light.LIGHTTYPEID_SPOTLIGHT;
  }
  /**
   * Overrides the direction setter to recompute the projection texture view light Matrix.
   * @param value
   */
  _setDirection(value) {
    super._setDirection(value);
    this._projectionTextureViewLightDirty = true;
  }
  /**
   * Overrides the position setter to recompute the projection texture view light Matrix.
   * @param value
   */
  _setPosition(value) {
    super._setPosition(value);
    this._projectionTextureViewLightDirty = true;
  }
  /**
   * Sets the passed matrix "matrix" as perspective projection matrix for the shadows and the passed view matrix with the fov equal to the SpotLight angle and and aspect ratio of 1.0.
   * Returns the SpotLight.
   * @param matrix
   * @param viewMatrix
   * @param renderList
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _setDefaultShadowProjectionMatrix(matrix, viewMatrix, renderList) {
    const activeCamera = this.getScene().activeCamera;
    if (!activeCamera) {
      return;
    }
    this._shadowAngleScale = this._shadowAngleScale || 1;
    const angle = this._shadowAngleScale * this._angle;
    const minZ = this.shadowMinZ !== void 0 ? this.shadowMinZ : activeCamera.minZ;
    const maxZ = this.shadowMaxZ !== void 0 ? this.shadowMaxZ : activeCamera.maxZ;
    const useReverseDepthBuffer = this.getScene().getEngine().useReverseDepthBuffer;
    Matrix.PerspectiveFovLHToRef(angle, 1, useReverseDepthBuffer ? maxZ : minZ, useReverseDepthBuffer ? minZ : maxZ, matrix, true, this._scene.getEngine().isNDCHalfZRange, void 0, useReverseDepthBuffer);
  }
  _computeProjectionTextureViewLightMatrix() {
    this._projectionTextureViewLightDirty = false;
    this._projectionTextureDirty = true;
    this.getAbsolutePosition().addToRef(this.direction, this._projectionTextureViewTargetVector);
    Matrix.LookAtLHToRef(this.getAbsolutePosition(), this._projectionTextureViewTargetVector, this._projectionTextureUpDirection, this._projectionTextureViewLightMatrix);
  }
  _computeProjectionTextureProjectionLightMatrix() {
    this._projectionTextureProjectionLightDirty = false;
    this._projectionTextureDirty = true;
    const lightFar = this.projectionTextureLightFar;
    const lightNear = this.projectionTextureLightNear;
    const P = lightFar / (lightFar - lightNear);
    const Q = -P * lightNear;
    const S = 1 / Math.tan(this._angle / 2);
    const A = 1;
    Matrix.FromValuesToRef(S / A, 0, 0, 0, 0, S, 0, 0, 0, 0, P, 1, 0, 0, Q, 0, this._projectionTextureProjectionLightMatrix);
  }
  /**
   * Main function for light texture projection matrix computing.
   */
  _computeProjectionTextureMatrix() {
    this._projectionTextureDirty = false;
    this._projectionTextureViewLightMatrix.multiplyToRef(this._projectionTextureProjectionLightMatrix, this._projectionTextureMatrix);
    if (this._projectionTexture instanceof Texture) {
      const u = this._projectionTexture.uScale / 2;
      const v = this._projectionTexture.vScale / 2;
      Matrix.FromValuesToRef(u, 0, 0, 0, 0, v, 0, 0, 0, 0, 0.5, 0, 0.5, 0.5, 0.5, 1, this._projectionTextureScalingMatrix);
    }
    this._projectionTextureMatrix.multiplyToRef(this._projectionTextureScalingMatrix, this._projectionTextureMatrix);
  }
  _buildUniformLayout() {
    this._uniformBuffer.addUniform("vLightData", 4);
    this._uniformBuffer.addUniform("vLightDiffuse", 4);
    this._uniformBuffer.addUniform("vLightSpecular", 4);
    this._uniformBuffer.addUniform("vLightDirection", 3);
    this._uniformBuffer.addUniform("vLightFalloff", 4);
    this._uniformBuffer.addUniform("shadowsInfo", 3);
    this._uniformBuffer.addUniform("depthValues", 2);
    this._uniformBuffer.create();
  }
  _computeAngleValues() {
    this._lightAngleScale = 1 / Math.max(1e-3, Math.cos(this._innerAngle * 0.5) - this._cosHalfAngle);
    this._lightAngleOffset = -this._cosHalfAngle * this._lightAngleScale;
  }
  /**
   * Sets the passed Effect "effect" with the Light textures.
   * @param effect The effect to update
   * @param lightIndex The index of the light in the effect to update
   * @returns The light
   */
  transferTexturesToEffect(effect, lightIndex) {
    if (this.projectionTexture && this.projectionTexture.isReady()) {
      if (this._projectionTextureViewLightDirty) {
        this._computeProjectionTextureViewLightMatrix();
      }
      if (this._projectionTextureProjectionLightDirty) {
        this._computeProjectionTextureProjectionLightMatrix();
      }
      if (this._projectionTextureDirty) {
        this._computeProjectionTextureMatrix();
      }
      effect.setMatrix("textureProjectionMatrix" + lightIndex, this._projectionTextureMatrix);
      effect.setTexture("projectionLightSampler" + lightIndex, this.projectionTexture);
    }
    return this;
  }
  /**
   * Sets the passed Effect object with the SpotLight transformed position (or position if not parented) and normalized direction.
   * @param effect The effect to update
   * @param lightIndex The index of the light in the effect to update
   * @returns The spot light
   */
  transferToEffect(effect, lightIndex) {
    let normalizeDirection;
    if (this.computeTransformedInformation()) {
      this._uniformBuffer.updateFloat4("vLightData", this.transformedPosition.x, this.transformedPosition.y, this.transformedPosition.z, this.exponent, lightIndex);
      normalizeDirection = Vector3.Normalize(this.transformedDirection);
    } else {
      this._uniformBuffer.updateFloat4("vLightData", this.position.x, this.position.y, this.position.z, this.exponent, lightIndex);
      normalizeDirection = Vector3.Normalize(this.direction);
    }
    this._uniformBuffer.updateFloat4("vLightDirection", normalizeDirection.x, normalizeDirection.y, normalizeDirection.z, this._cosHalfAngle, lightIndex);
    this._uniformBuffer.updateFloat4("vLightFalloff", this.range, this._inverseSquaredRange, this._lightAngleScale, this._lightAngleOffset, lightIndex);
    return this;
  }
  transferToNodeMaterialEffect(effect, lightDataUniformName) {
    let normalizeDirection;
    if (this.computeTransformedInformation()) {
      normalizeDirection = Vector3.Normalize(this.transformedDirection);
    } else {
      normalizeDirection = Vector3.Normalize(this.direction);
    }
    if (this.getScene().useRightHandedSystem) {
      effect.setFloat3(lightDataUniformName, -normalizeDirection.x, -normalizeDirection.y, -normalizeDirection.z);
    } else {
      effect.setFloat3(lightDataUniformName, normalizeDirection.x, normalizeDirection.y, normalizeDirection.z);
    }
    return this;
  }
  /**
   * Disposes the light and the associated resources.
   */
  dispose() {
    super.dispose();
    if (this._projectionTexture) {
      this._projectionTexture.dispose();
    }
  }
  /**
   * Gets the minZ used for shadow according to both the scene and the light.
   * @param activeCamera The camera we are returning the min for
   * @returns the depth min z
   */
  getDepthMinZ(activeCamera) {
    const engine = this._scene.getEngine();
    const minZ = this.shadowMinZ !== void 0 ? this.shadowMinZ : activeCamera.minZ;
    return engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? minZ : this._scene.getEngine().isNDCHalfZRange ? 0 : minZ;
  }
  /**
   * Gets the maxZ used for shadow according to both the scene and the light.
   * @param activeCamera The camera we are returning the max for
   * @returns the depth max z
   */
  getDepthMaxZ(activeCamera) {
    const engine = this._scene.getEngine();
    const maxZ = this.shadowMaxZ !== void 0 ? this.shadowMaxZ : activeCamera.maxZ;
    return engine.useReverseDepthBuffer && engine.isNDCHalfZRange ? 0 : maxZ;
  }
  /**
   * Prepares the list of defines specific to the light type.
   * @param defines the list of defines
   * @param lightIndex defines the index of the light for the effect
   */
  prepareLightSpecificDefines(defines, lightIndex) {
    defines["SPOTLIGHT" + lightIndex] = true;
    defines["PROJECTEDLIGHTTEXTURE" + lightIndex] = this.projectionTexture && this.projectionTexture.isReady() ? true : false;
  }
};
__decorate([
  serialize()
], SpotLight.prototype, "angle", null);
__decorate([
  serialize()
], SpotLight.prototype, "innerAngle", null);
__decorate([
  serialize()
], SpotLight.prototype, "shadowAngleScale", null);
__decorate([
  serialize()
], SpotLight.prototype, "exponent", void 0);
__decorate([
  serialize()
], SpotLight.prototype, "projectionTextureLightNear", null);
__decorate([
  serialize()
], SpotLight.prototype, "projectionTextureLightFar", null);
__decorate([
  serialize()
], SpotLight.prototype, "projectionTextureUpDirection", null);
__decorate([
  serializeAsTexture("projectedLightTexture")
], SpotLight.prototype, "_projectionTexture", void 0);

export {
  Light,
  HemisphericLight,
  ShadowLight,
  DirectionalLight,
  SpotLight,
  BlurPostProcess,
  ShadowGenerator,
  DepthRenderer,
  MinMaxReducer,
  DepthReducer,
  CascadedShadowGenerator,
  ShadowGeneratorSceneComponent,
  PointLight
};
//# sourceMappingURL=chunk-KLZSSUNK.js.map
