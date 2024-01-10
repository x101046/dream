import {
  extractMinAndMax,
  extractMinAndMaxIndexed
} from "./chunk-SDHG362Y.js";
import {
  AsyncLoop,
  BoundingInfo,
  Buffer,
  Camera,
  CompatibilityOptions,
  DeepCopier,
  DrawWrapper,
  EffectFallbacks,
  Engine,
  ErrorCodes,
  ImageProcessingConfiguration,
  Logger,
  MaterialDefines,
  MaterialHelper,
  Node,
  PickingInfo,
  PostProcess,
  RuntimeError,
  Scene,
  SceneComponentConstants,
  ScenePerformancePriority,
  ShaderLanguage,
  ShaderProcessor,
  ShaderStore,
  SmartArray,
  Texture,
  Tools,
  UniformBuffer,
  VertexBuffer,
  addClipPlaneUniforms,
  bindClipPlane
} from "./chunk-VAZZWHD2.js";
import {
  ArrayTools,
  Axis,
  Color3,
  Color4,
  EngineStore,
  Epsilon,
  GetClass,
  Matrix,
  Observable,
  Plane,
  Quaternion,
  RegisterClass,
  SerializationHelper,
  Space,
  Tags,
  TmpVectors,
  Vector2,
  Vector3,
  Vector4,
  _WarnImport,
  __decorate,
  expandToProperty,
  nativeOverride,
  serialize,
  serializeAsColor3,
  serializeAsFresnelParameters,
  serializeAsQuaternion,
  serializeAsTexture,
  serializeAsVector3
} from "./chunk-ZYQT2WB4.js";

// node_modules/@babylonjs/core/Misc/coroutine.js
function inlineScheduler(coroutine, onStep, onError) {
  try {
    const step = coroutine.next();
    if (step.done) {
      onStep(step);
    } else if (!step.value) {
      onStep(step);
    } else {
      step.value.then(() => {
        step.value = void 0;
        onStep(step);
      }, onError);
    }
  } catch (error) {
    onError(error);
  }
}
function createYieldingScheduler(yieldAfterMS = 25) {
  let startTime;
  return (coroutine, onStep, onError) => {
    const currentTime = performance.now();
    if (startTime === void 0 || currentTime - startTime > yieldAfterMS) {
      startTime = currentTime;
      setTimeout(() => {
        inlineScheduler(coroutine, onStep, onError);
      }, 0);
    } else {
      inlineScheduler(coroutine, onStep, onError);
    }
  };
}
function runCoroutine(coroutine, scheduler, onSuccess, onError, abortSignal) {
  const resume = () => {
    let reschedule;
    const onStep = (stepResult) => {
      if (stepResult.done) {
        onSuccess(stepResult.value);
      } else {
        if (reschedule === void 0) {
          reschedule = true;
        } else {
          resume();
        }
      }
    };
    do {
      reschedule = void 0;
      if (!abortSignal || !abortSignal.aborted) {
        scheduler(coroutine, onStep, onError);
      } else {
        onError(new Error("Aborted"));
      }
      if (reschedule === void 0) {
        reschedule = false;
      }
    } while (reschedule);
  };
  resume();
}
function runCoroutineSync(coroutine, abortSignal) {
  let result;
  runCoroutine(coroutine, inlineScheduler, (r) => result = r, (e) => {
    throw e;
  }, abortSignal);
  return result;
}
function runCoroutineAsync(coroutine, scheduler, abortSignal) {
  return new Promise((resolve, reject) => {
    runCoroutine(coroutine, scheduler, resolve, reject, abortSignal);
  });
}
function makeSyncFunction(coroutineFactory, abortSignal) {
  return (...params) => {
    return runCoroutineSync(coroutineFactory(...params), abortSignal);
  };
}
function makeAsyncFunction(coroutineFactory, scheduler, abortSignal) {
  return (...params) => {
    return runCoroutineAsync(coroutineFactory(...params), scheduler, abortSignal);
  };
}

// node_modules/@babylonjs/core/Collisions/intersectionInfo.js
var IntersectionInfo = class {
  constructor(bu, bv, distance) {
    this.bu = bu;
    this.bv = bv;
    this.distance = distance;
    this.faceId = 0;
    this.subMeshId = 0;
  }
};

// node_modules/@babylonjs/core/Meshes/subMesh.js
var SubMesh = class _SubMesh {
  /**
   * Gets material defines used by the effect associated to the sub mesh
   */
  get materialDefines() {
    var _a;
    return this._mainDrawWrapperOverride ? this._mainDrawWrapperOverride.defines : (_a = this._getDrawWrapper()) === null || _a === void 0 ? void 0 : _a.defines;
  }
  /**
   * Sets material defines used by the effect associated to the sub mesh
   */
  set materialDefines(defines) {
    var _a;
    const drawWrapper = (_a = this._mainDrawWrapperOverride) !== null && _a !== void 0 ? _a : this._getDrawWrapper(void 0, true);
    drawWrapper.defines = defines;
  }
  /**
   * @internal
   */
  _getDrawWrapper(passId, createIfNotExisting = false) {
    passId = passId !== null && passId !== void 0 ? passId : this._engine.currentRenderPassId;
    let drawWrapper = this._drawWrappers[passId];
    if (!drawWrapper && createIfNotExisting) {
      this._drawWrappers[passId] = drawWrapper = new DrawWrapper(this._mesh.getScene().getEngine());
    }
    return drawWrapper;
  }
  /**
   * @internal
   */
  _removeDrawWrapper(passId, disposeWrapper = true) {
    var _a;
    if (disposeWrapper) {
      (_a = this._drawWrappers[passId]) === null || _a === void 0 ? void 0 : _a.dispose();
    }
    this._drawWrappers[passId] = void 0;
  }
  /**
   * Gets associated (main) effect (possibly the effect override if defined)
   */
  get effect() {
    var _a, _b;
    return this._mainDrawWrapperOverride ? this._mainDrawWrapperOverride.effect : (_b = (_a = this._getDrawWrapper()) === null || _a === void 0 ? void 0 : _a.effect) !== null && _b !== void 0 ? _b : null;
  }
  /** @internal */
  get _drawWrapper() {
    var _a;
    return (_a = this._mainDrawWrapperOverride) !== null && _a !== void 0 ? _a : this._getDrawWrapper(void 0, true);
  }
  /** @internal */
  get _drawWrapperOverride() {
    return this._mainDrawWrapperOverride;
  }
  /**
   * @internal
   */
  _setMainDrawWrapperOverride(wrapper) {
    this._mainDrawWrapperOverride = wrapper;
  }
  /**
   * Sets associated effect (effect used to render this submesh)
   * @param effect defines the effect to associate with
   * @param defines defines the set of defines used to compile this effect
   * @param materialContext material context associated to the effect
   * @param resetContext true to reset the draw context
   */
  setEffect(effect, defines = null, materialContext, resetContext = true) {
    const drawWrapper = this._drawWrapper;
    drawWrapper.setEffect(effect, defines, resetContext);
    if (materialContext !== void 0) {
      drawWrapper.materialContext = materialContext;
    }
    if (!effect) {
      drawWrapper.defines = null;
      drawWrapper.materialContext = void 0;
    }
  }
  /**
   * Resets the draw wrappers cache
   * @param passId If provided, releases only the draw wrapper corresponding to this render pass id
   */
  resetDrawCache(passId) {
    if (this._drawWrappers) {
      if (passId !== void 0) {
        this._removeDrawWrapper(passId);
        return;
      } else {
        for (const drawWrapper of this._drawWrappers) {
          drawWrapper === null || drawWrapper === void 0 ? void 0 : drawWrapper.dispose();
        }
      }
    }
    this._drawWrappers = [];
  }
  /**
   * Add a new submesh to a mesh
   * @param materialIndex defines the material index to use
   * @param verticesStart defines vertex index start
   * @param verticesCount defines vertices count
   * @param indexStart defines index start
   * @param indexCount defines indices count
   * @param mesh defines the parent mesh
   * @param renderingMesh defines an optional rendering mesh
   * @param createBoundingBox defines if bounding box should be created for this submesh
   * @returns the new submesh
   */
  static AddToMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox = true) {
    return new _SubMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox);
  }
  /**
   * Creates a new submesh
   * @param materialIndex defines the material index to use
   * @param verticesStart defines vertex index start
   * @param verticesCount defines vertices count
   * @param indexStart defines index start
   * @param indexCount defines indices count
   * @param mesh defines the parent mesh
   * @param renderingMesh defines an optional rendering mesh
   * @param createBoundingBox defines if bounding box should be created for this submesh
   * @param addToMesh defines a boolean indicating that the submesh must be added to the mesh.subMeshes array (true by default)
   */
  constructor(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh, renderingMesh, createBoundingBox = true, addToMesh = true) {
    this.materialIndex = materialIndex;
    this.verticesStart = verticesStart;
    this.verticesCount = verticesCount;
    this.indexStart = indexStart;
    this.indexCount = indexCount;
    this._mainDrawWrapperOverride = null;
    this._linesIndexCount = 0;
    this._linesIndexBuffer = null;
    this._lastColliderWorldVertices = null;
    this._lastColliderTransformMatrix = null;
    this._wasDispatched = false;
    this._renderId = 0;
    this._alphaIndex = 0;
    this._distanceToCamera = 0;
    this._currentMaterial = null;
    this._mesh = mesh;
    this._renderingMesh = renderingMesh || mesh;
    if (addToMesh) {
      mesh.subMeshes.push(this);
    }
    this._engine = this._mesh.getScene().getEngine();
    this.resetDrawCache();
    this._trianglePlanes = [];
    this._id = mesh.subMeshes.length - 1;
    if (createBoundingBox) {
      this.refreshBoundingInfo();
      mesh.computeWorldMatrix(true);
    }
  }
  /**
   * Returns true if this submesh covers the entire parent mesh
   * @ignorenaming
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get IsGlobal() {
    return this.verticesStart === 0 && this.verticesCount === this._mesh.getTotalVertices() && this.indexStart === 0 && this.indexCount === this._mesh.getTotalIndices();
  }
  /**
   * Returns the submesh BoundingInfo object
   * @returns current bounding info (or mesh's one if the submesh is global)
   */
  getBoundingInfo() {
    if (this.IsGlobal || this._mesh.hasThinInstances) {
      return this._mesh.getBoundingInfo();
    }
    return this._boundingInfo;
  }
  /**
   * Sets the submesh BoundingInfo
   * @param boundingInfo defines the new bounding info to use
   * @returns the SubMesh
   */
  setBoundingInfo(boundingInfo) {
    this._boundingInfo = boundingInfo;
    return this;
  }
  /**
   * Returns the mesh of the current submesh
   * @returns the parent mesh
   */
  getMesh() {
    return this._mesh;
  }
  /**
   * Returns the rendering mesh of the submesh
   * @returns the rendering mesh (could be different from parent mesh)
   */
  getRenderingMesh() {
    return this._renderingMesh;
  }
  /**
   * Returns the replacement mesh of the submesh
   * @returns the replacement mesh (could be different from parent mesh)
   */
  getReplacementMesh() {
    return this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh ? this._mesh : null;
  }
  /**
   * Returns the effective mesh of the submesh
   * @returns the effective mesh (could be different from parent mesh)
   */
  getEffectiveMesh() {
    const replacementMesh = this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh ? this._mesh : null;
    return replacementMesh ? replacementMesh : this._renderingMesh;
  }
  /**
   * Returns the submesh material
   * @param getDefaultMaterial Defines whether or not to get the default material if nothing has been defined.
   * @returns null or the current material
   */
  getMaterial(getDefaultMaterial = true) {
    var _a;
    const rootMaterial = (_a = this._renderingMesh.getMaterialForRenderPass(this._engine.currentRenderPassId)) !== null && _a !== void 0 ? _a : this._renderingMesh.material;
    if (!rootMaterial) {
      return getDefaultMaterial ? this._mesh.getScene().defaultMaterial : null;
    } else if (this._isMultiMaterial(rootMaterial)) {
      const effectiveMaterial = rootMaterial.getSubMaterial(this.materialIndex);
      if (this._currentMaterial !== effectiveMaterial) {
        this._currentMaterial = effectiveMaterial;
        this.resetDrawCache();
      }
      return effectiveMaterial;
    }
    return rootMaterial;
  }
  _isMultiMaterial(material) {
    return material.getSubMaterial !== void 0;
  }
  // Methods
  /**
   * Sets a new updated BoundingInfo object to the submesh
   * @param data defines an optional position array to use to determine the bounding info
   * @returns the SubMesh
   */
  refreshBoundingInfo(data = null) {
    this._lastColliderWorldVertices = null;
    if (this.IsGlobal || !this._renderingMesh || !this._renderingMesh.geometry) {
      return this;
    }
    if (!data) {
      data = this._renderingMesh.getVerticesData(VertexBuffer.PositionKind);
    }
    if (!data) {
      this._boundingInfo = this._mesh.getBoundingInfo();
      return this;
    }
    const indices = this._renderingMesh.getIndices();
    let extend;
    if (this.indexStart === 0 && this.indexCount === indices.length) {
      const boundingInfo = this._renderingMesh.getBoundingInfo();
      extend = { minimum: boundingInfo.minimum.clone(), maximum: boundingInfo.maximum.clone() };
    } else {
      extend = extractMinAndMaxIndexed(data, indices, this.indexStart, this.indexCount, this._renderingMesh.geometry.boundingBias);
    }
    if (this._boundingInfo) {
      this._boundingInfo.reConstruct(extend.minimum, extend.maximum);
    } else {
      this._boundingInfo = new BoundingInfo(extend.minimum, extend.maximum);
    }
    return this;
  }
  /**
   * @internal
   */
  _checkCollision(collider) {
    const boundingInfo = this.getBoundingInfo();
    return boundingInfo._checkCollision(collider);
  }
  /**
   * Updates the submesh BoundingInfo
   * @param world defines the world matrix to use to update the bounding info
   * @returns the submesh
   */
  updateBoundingInfo(world) {
    let boundingInfo = this.getBoundingInfo();
    if (!boundingInfo) {
      this.refreshBoundingInfo();
      boundingInfo = this.getBoundingInfo();
    }
    if (boundingInfo) {
      boundingInfo.update(world);
    }
    return this;
  }
  /**
   * True is the submesh bounding box intersects the frustum defined by the passed array of planes.
   * @param frustumPlanes defines the frustum planes
   * @returns true if the submesh is intersecting with the frustum
   */
  isInFrustum(frustumPlanes) {
    const boundingInfo = this.getBoundingInfo();
    if (!boundingInfo) {
      return false;
    }
    return boundingInfo.isInFrustum(frustumPlanes, this._mesh.cullingStrategy);
  }
  /**
   * True is the submesh bounding box is completely inside the frustum defined by the passed array of planes
   * @param frustumPlanes defines the frustum planes
   * @returns true if the submesh is inside the frustum
   */
  isCompletelyInFrustum(frustumPlanes) {
    const boundingInfo = this.getBoundingInfo();
    if (!boundingInfo) {
      return false;
    }
    return boundingInfo.isCompletelyInFrustum(frustumPlanes);
  }
  /**
   * Renders the submesh
   * @param enableAlphaMode defines if alpha needs to be used
   * @returns the submesh
   */
  render(enableAlphaMode) {
    this._renderingMesh.render(this, enableAlphaMode, this._mesh._internalAbstractMeshDataInfo._actAsRegularMesh ? this._mesh : void 0);
    return this;
  }
  /**
   * @internal
   */
  _getLinesIndexBuffer(indices, engine) {
    if (!this._linesIndexBuffer) {
      const linesIndices = [];
      for (let index = this.indexStart; index < this.indexStart + this.indexCount; index += 3) {
        linesIndices.push(indices[index], indices[index + 1], indices[index + 1], indices[index + 2], indices[index + 2], indices[index]);
      }
      this._linesIndexBuffer = engine.createIndexBuffer(linesIndices);
      this._linesIndexCount = linesIndices.length;
    }
    return this._linesIndexBuffer;
  }
  /**
   * Checks if the submesh intersects with a ray
   * @param ray defines the ray to test
   * @returns true is the passed ray intersects the submesh bounding box
   */
  canIntersects(ray) {
    const boundingInfo = this.getBoundingInfo();
    if (!boundingInfo) {
      return false;
    }
    return ray.intersectsBox(boundingInfo.boundingBox);
  }
  /**
   * Intersects current submesh with a ray
   * @param ray defines the ray to test
   * @param positions defines mesh's positions array
   * @param indices defines mesh's indices array
   * @param fastCheck defines if the first intersection will be used (and not the closest)
   * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
   * @returns intersection info or null if no intersection
   */
  intersects(ray, positions, indices, fastCheck, trianglePredicate) {
    const material = this.getMaterial();
    if (!material) {
      return null;
    }
    let step = 3;
    let checkStopper = false;
    switch (material.fillMode) {
      case 3:
      case 5:
      case 6:
      case 8:
        return null;
      case 7:
        step = 1;
        checkStopper = true;
        break;
      default:
        break;
    }
    if (material.fillMode === 4) {
      if (!indices.length) {
        return this._intersectUnIndexedLines(ray, positions, indices, this._mesh.intersectionThreshold, fastCheck);
      }
      return this._intersectLines(ray, positions, indices, this._mesh.intersectionThreshold, fastCheck);
    } else {
      if (!indices.length && this._mesh._unIndexed) {
        return this._intersectUnIndexedTriangles(ray, positions, indices, fastCheck, trianglePredicate);
      }
      return this._intersectTriangles(ray, positions, indices, step, checkStopper, fastCheck, trianglePredicate);
    }
  }
  /**
   * @internal
   */
  _intersectLines(ray, positions, indices, intersectionThreshold, fastCheck) {
    let intersectInfo = null;
    for (let index = this.indexStart; index < this.indexStart + this.indexCount; index += 2) {
      const p0 = positions[indices[index]];
      const p1 = positions[indices[index + 1]];
      const length = ray.intersectionSegment(p0, p1, intersectionThreshold);
      if (length < 0) {
        continue;
      }
      if (fastCheck || !intersectInfo || length < intersectInfo.distance) {
        intersectInfo = new IntersectionInfo(null, null, length);
        intersectInfo.faceId = index / 2;
        if (fastCheck) {
          break;
        }
      }
    }
    return intersectInfo;
  }
  /**
   * @internal
   */
  _intersectUnIndexedLines(ray, positions, indices, intersectionThreshold, fastCheck) {
    let intersectInfo = null;
    for (let index = this.verticesStart; index < this.verticesStart + this.verticesCount; index += 2) {
      const p0 = positions[index];
      const p1 = positions[index + 1];
      const length = ray.intersectionSegment(p0, p1, intersectionThreshold);
      if (length < 0) {
        continue;
      }
      if (fastCheck || !intersectInfo || length < intersectInfo.distance) {
        intersectInfo = new IntersectionInfo(null, null, length);
        intersectInfo.faceId = index / 2;
        if (fastCheck) {
          break;
        }
      }
    }
    return intersectInfo;
  }
  /**
   * @internal
   */
  _intersectTriangles(ray, positions, indices, step, checkStopper, fastCheck, trianglePredicate) {
    let intersectInfo = null;
    let faceId = -1;
    for (let index = this.indexStart; index < this.indexStart + this.indexCount - (3 - step); index += step) {
      faceId++;
      const indexA = indices[index];
      const indexB = indices[index + 1];
      const indexC = indices[index + 2];
      if (checkStopper && indexC === 4294967295) {
        index += 2;
        continue;
      }
      const p0 = positions[indexA];
      const p1 = positions[indexB];
      const p2 = positions[indexC];
      if (!p0 || !p1 || !p2) {
        continue;
      }
      if (trianglePredicate && !trianglePredicate(p0, p1, p2, ray, indexA, indexB, indexC)) {
        continue;
      }
      const currentIntersectInfo = ray.intersectsTriangle(p0, p1, p2);
      if (currentIntersectInfo) {
        if (currentIntersectInfo.distance < 0) {
          continue;
        }
        if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
          intersectInfo = currentIntersectInfo;
          intersectInfo.faceId = faceId;
          if (fastCheck) {
            break;
          }
        }
      }
    }
    return intersectInfo;
  }
  /**
   * @internal
   */
  _intersectUnIndexedTriangles(ray, positions, indices, fastCheck, trianglePredicate) {
    let intersectInfo = null;
    for (let index = this.verticesStart; index < this.verticesStart + this.verticesCount; index += 3) {
      const p0 = positions[index];
      const p1 = positions[index + 1];
      const p2 = positions[index + 2];
      if (trianglePredicate && !trianglePredicate(p0, p1, p2, ray, -1, -1, -1)) {
        continue;
      }
      const currentIntersectInfo = ray.intersectsTriangle(p0, p1, p2);
      if (currentIntersectInfo) {
        if (currentIntersectInfo.distance < 0) {
          continue;
        }
        if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
          intersectInfo = currentIntersectInfo;
          intersectInfo.faceId = index / 3;
          if (fastCheck) {
            break;
          }
        }
      }
    }
    return intersectInfo;
  }
  /** @internal */
  _rebuild() {
    if (this._linesIndexBuffer) {
      this._linesIndexBuffer = null;
    }
  }
  // Clone
  /**
   * Creates a new submesh from the passed mesh
   * @param newMesh defines the new hosting mesh
   * @param newRenderingMesh defines an optional rendering mesh
   * @returns the new submesh
   */
  clone(newMesh, newRenderingMesh) {
    const result = new _SubMesh(this.materialIndex, this.verticesStart, this.verticesCount, this.indexStart, this.indexCount, newMesh, newRenderingMesh, false);
    if (!this.IsGlobal) {
      const boundingInfo = this.getBoundingInfo();
      if (!boundingInfo) {
        return result;
      }
      result._boundingInfo = new BoundingInfo(boundingInfo.minimum, boundingInfo.maximum);
    }
    return result;
  }
  // Dispose
  /**
   * Release associated resources
   */
  dispose() {
    if (this._linesIndexBuffer) {
      this._mesh.getScene().getEngine()._releaseBuffer(this._linesIndexBuffer);
      this._linesIndexBuffer = null;
    }
    const index = this._mesh.subMeshes.indexOf(this);
    this._mesh.subMeshes.splice(index, 1);
    this.resetDrawCache();
  }
  /**
   * Gets the class name
   * @returns the string "SubMesh".
   */
  getClassName() {
    return "SubMesh";
  }
  // Statics
  /**
   * Creates a new submesh from indices data
   * @param materialIndex the index of the main mesh material
   * @param startIndex the index where to start the copy in the mesh indices array
   * @param indexCount the number of indices to copy then from the startIndex
   * @param mesh the main mesh to create the submesh from
   * @param renderingMesh the optional rendering mesh
   * @param createBoundingBox defines if bounding box should be created for this submesh
   * @returns a new submesh
   */
  static CreateFromIndices(materialIndex, startIndex, indexCount, mesh, renderingMesh, createBoundingBox = true) {
    let minVertexIndex = Number.MAX_VALUE;
    let maxVertexIndex = -Number.MAX_VALUE;
    const whatWillRender = renderingMesh || mesh;
    const indices = whatWillRender.getIndices();
    for (let index = startIndex; index < startIndex + indexCount; index++) {
      const vertexIndex = indices[index];
      if (vertexIndex < minVertexIndex) {
        minVertexIndex = vertexIndex;
      }
      if (vertexIndex > maxVertexIndex) {
        maxVertexIndex = vertexIndex;
      }
    }
    return new _SubMesh(materialIndex, minVertexIndex, maxVertexIndex - minVertexIndex + 1, startIndex, indexCount, mesh, renderingMesh, createBoundingBox);
  }
};

// node_modules/@babylonjs/core/Meshes/mesh.vertexData.js
var VertexDataMaterialInfo = class {
};
var VertexData = class _VertexData {
  /**
   * Creates a new VertexData
   */
  constructor() {
    this.uniqueId = 0;
    this.metadata = {};
    this._applyTo = makeSyncFunction(this._applyToCoroutine.bind(this));
    this.uniqueId = _VertexData._UniqueIDGenerator;
    _VertexData._UniqueIDGenerator++;
  }
  /**
   * Uses the passed data array to set the set the values for the specified kind of data
   * @param data a linear array of floating numbers
   * @param kind the type of data that is being set, eg positions, colors etc
   */
  set(data, kind) {
    if (!data.length) {
      Logger.Warn(`Setting vertex data kind '${kind}' with an empty array`);
    }
    switch (kind) {
      case VertexBuffer.PositionKind:
        this.positions = data;
        break;
      case VertexBuffer.NormalKind:
        this.normals = data;
        break;
      case VertexBuffer.TangentKind:
        this.tangents = data;
        break;
      case VertexBuffer.UVKind:
        this.uvs = data;
        break;
      case VertexBuffer.UV2Kind:
        this.uvs2 = data;
        break;
      case VertexBuffer.UV3Kind:
        this.uvs3 = data;
        break;
      case VertexBuffer.UV4Kind:
        this.uvs4 = data;
        break;
      case VertexBuffer.UV5Kind:
        this.uvs5 = data;
        break;
      case VertexBuffer.UV6Kind:
        this.uvs6 = data;
        break;
      case VertexBuffer.ColorKind:
        this.colors = data;
        break;
      case VertexBuffer.MatricesIndicesKind:
        this.matricesIndices = data;
        break;
      case VertexBuffer.MatricesWeightsKind:
        this.matricesWeights = data;
        break;
      case VertexBuffer.MatricesIndicesExtraKind:
        this.matricesIndicesExtra = data;
        break;
      case VertexBuffer.MatricesWeightsExtraKind:
        this.matricesWeightsExtra = data;
        break;
    }
  }
  /**
   * Associates the vertexData to the passed Mesh.
   * Sets it as updatable or not (default `false`)
   * @param mesh the mesh the vertexData is applied to
   * @param updatable when used and having the value true allows new data to update the vertexData
   * @returns the VertexData
   */
  applyToMesh(mesh, updatable) {
    this._applyTo(mesh, updatable, false);
    return this;
  }
  /**
   * Associates the vertexData to the passed Geometry.
   * Sets it as updatable or not (default `false`)
   * @param geometry the geometry the vertexData is applied to
   * @param updatable when used and having the value true allows new data to update the vertexData
   * @returns VertexData
   */
  applyToGeometry(geometry, updatable) {
    this._applyTo(geometry, updatable, false);
    return this;
  }
  /**
   * Updates the associated mesh
   * @param mesh the mesh to be updated
   * @returns VertexData
   */
  updateMesh(mesh) {
    this._update(mesh);
    return this;
  }
  /**
   * Updates the associated geometry
   * @param geometry the geometry to be updated
   * @returns VertexData.
   */
  updateGeometry(geometry) {
    this._update(geometry);
    return this;
  }
  /**
   * @internal
   */
  *_applyToCoroutine(meshOrGeometry, updatable = false, isAsync) {
    if (this.positions) {
      meshOrGeometry.setVerticesData(VertexBuffer.PositionKind, this.positions, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.normals) {
      meshOrGeometry.setVerticesData(VertexBuffer.NormalKind, this.normals, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.tangents) {
      meshOrGeometry.setVerticesData(VertexBuffer.TangentKind, this.tangents, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.uvs) {
      meshOrGeometry.setVerticesData(VertexBuffer.UVKind, this.uvs, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.uvs2) {
      meshOrGeometry.setVerticesData(VertexBuffer.UV2Kind, this.uvs2, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.uvs3) {
      meshOrGeometry.setVerticesData(VertexBuffer.UV3Kind, this.uvs3, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.uvs4) {
      meshOrGeometry.setVerticesData(VertexBuffer.UV4Kind, this.uvs4, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.uvs5) {
      meshOrGeometry.setVerticesData(VertexBuffer.UV5Kind, this.uvs5, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.uvs6) {
      meshOrGeometry.setVerticesData(VertexBuffer.UV6Kind, this.uvs6, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.colors) {
      meshOrGeometry.setVerticesData(VertexBuffer.ColorKind, this.colors, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.matricesIndices) {
      meshOrGeometry.setVerticesData(VertexBuffer.MatricesIndicesKind, this.matricesIndices, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.matricesWeights) {
      meshOrGeometry.setVerticesData(VertexBuffer.MatricesWeightsKind, this.matricesWeights, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.matricesIndicesExtra) {
      meshOrGeometry.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, this.matricesIndicesExtra, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.matricesWeightsExtra) {
      meshOrGeometry.setVerticesData(VertexBuffer.MatricesWeightsExtraKind, this.matricesWeightsExtra, updatable);
      if (isAsync) {
        yield;
      }
    }
    if (this.indices) {
      meshOrGeometry.setIndices(this.indices, null, updatable);
      if (isAsync) {
        yield;
      }
    } else {
      meshOrGeometry.setIndices([], null);
    }
    if (meshOrGeometry.subMeshes && this.materialInfos && this.materialInfos.length > 1) {
      const mesh = meshOrGeometry;
      mesh.subMeshes = [];
      for (const matInfo of this.materialInfos) {
        new SubMesh(matInfo.materialIndex, matInfo.verticesStart, matInfo.verticesCount, matInfo.indexStart, matInfo.indexCount, mesh);
      }
    }
    return this;
  }
  _update(meshOrGeometry, updateExtends, makeItUnique) {
    if (this.positions) {
      meshOrGeometry.updateVerticesData(VertexBuffer.PositionKind, this.positions, updateExtends, makeItUnique);
    }
    if (this.normals) {
      meshOrGeometry.updateVerticesData(VertexBuffer.NormalKind, this.normals, updateExtends, makeItUnique);
    }
    if (this.tangents) {
      meshOrGeometry.updateVerticesData(VertexBuffer.TangentKind, this.tangents, updateExtends, makeItUnique);
    }
    if (this.uvs) {
      meshOrGeometry.updateVerticesData(VertexBuffer.UVKind, this.uvs, updateExtends, makeItUnique);
    }
    if (this.uvs2) {
      meshOrGeometry.updateVerticesData(VertexBuffer.UV2Kind, this.uvs2, updateExtends, makeItUnique);
    }
    if (this.uvs3) {
      meshOrGeometry.updateVerticesData(VertexBuffer.UV3Kind, this.uvs3, updateExtends, makeItUnique);
    }
    if (this.uvs4) {
      meshOrGeometry.updateVerticesData(VertexBuffer.UV4Kind, this.uvs4, updateExtends, makeItUnique);
    }
    if (this.uvs5) {
      meshOrGeometry.updateVerticesData(VertexBuffer.UV5Kind, this.uvs5, updateExtends, makeItUnique);
    }
    if (this.uvs6) {
      meshOrGeometry.updateVerticesData(VertexBuffer.UV6Kind, this.uvs6, updateExtends, makeItUnique);
    }
    if (this.colors) {
      meshOrGeometry.updateVerticesData(VertexBuffer.ColorKind, this.colors, updateExtends, makeItUnique);
    }
    if (this.matricesIndices) {
      meshOrGeometry.updateVerticesData(VertexBuffer.MatricesIndicesKind, this.matricesIndices, updateExtends, makeItUnique);
    }
    if (this.matricesWeights) {
      meshOrGeometry.updateVerticesData(VertexBuffer.MatricesWeightsKind, this.matricesWeights, updateExtends, makeItUnique);
    }
    if (this.matricesIndicesExtra) {
      meshOrGeometry.updateVerticesData(VertexBuffer.MatricesIndicesExtraKind, this.matricesIndicesExtra, updateExtends, makeItUnique);
    }
    if (this.matricesWeightsExtra) {
      meshOrGeometry.updateVerticesData(VertexBuffer.MatricesWeightsExtraKind, this.matricesWeightsExtra, updateExtends, makeItUnique);
    }
    if (this.indices) {
      meshOrGeometry.setIndices(this.indices, null);
    }
    return this;
  }
  static _TransformVector3Coordinates(coordinates, transformation, offset = 0, length = coordinates.length) {
    const coordinate = TmpVectors.Vector3[0];
    const transformedCoordinate = TmpVectors.Vector3[1];
    for (let index = offset; index < offset + length; index += 3) {
      Vector3.FromArrayToRef(coordinates, index, coordinate);
      Vector3.TransformCoordinatesToRef(coordinate, transformation, transformedCoordinate);
      coordinates[index] = transformedCoordinate.x;
      coordinates[index + 1] = transformedCoordinate.y;
      coordinates[index + 2] = transformedCoordinate.z;
    }
  }
  static _TransformVector3Normals(normals, transformation, offset = 0, length = normals.length) {
    const normal = TmpVectors.Vector3[0];
    const transformedNormal = TmpVectors.Vector3[1];
    for (let index = offset; index < offset + length; index += 3) {
      Vector3.FromArrayToRef(normals, index, normal);
      Vector3.TransformNormalToRef(normal, transformation, transformedNormal);
      normals[index] = transformedNormal.x;
      normals[index + 1] = transformedNormal.y;
      normals[index + 2] = transformedNormal.z;
    }
  }
  static _TransformVector4Normals(normals, transformation, offset = 0, length = normals.length) {
    const normal = TmpVectors.Vector4[0];
    const transformedNormal = TmpVectors.Vector4[1];
    for (let index = offset; index < offset + length; index += 4) {
      Vector4.FromArrayToRef(normals, index, normal);
      Vector4.TransformNormalToRef(normal, transformation, transformedNormal);
      normals[index] = transformedNormal.x;
      normals[index + 1] = transformedNormal.y;
      normals[index + 2] = transformedNormal.z;
      normals[index + 3] = transformedNormal.w;
    }
  }
  static _FlipFaces(indices, offset = 0, length = indices.length) {
    for (let index = offset; index < offset + length; index += 3) {
      const tmp = indices[index + 1];
      indices[index + 1] = indices[index + 2];
      indices[index + 2] = tmp;
    }
  }
  /**
   * Transforms each position and each normal of the vertexData according to the passed Matrix
   * @param matrix the transforming matrix
   * @returns the VertexData
   */
  transform(matrix) {
    const flip = matrix.determinant() < 0;
    if (this.positions) {
      _VertexData._TransformVector3Coordinates(this.positions, matrix);
    }
    if (this.normals) {
      _VertexData._TransformVector3Normals(this.normals, matrix);
    }
    if (this.tangents) {
      _VertexData._TransformVector4Normals(this.tangents, matrix);
    }
    if (flip && this.indices) {
      _VertexData._FlipFaces(this.indices);
    }
    return this;
  }
  /**
   * Generates an array of vertex data where each vertex data only has one material info
   * @returns An array of VertexData
   */
  splitBasedOnMaterialID() {
    if (!this.materialInfos || this.materialInfos.length < 2) {
      return [this];
    }
    const result = [];
    for (const materialInfo of this.materialInfos) {
      const vertexData = new _VertexData();
      if (this.positions) {
        vertexData.positions = this.positions.slice(materialInfo.verticesStart * 3, (materialInfo.verticesCount + materialInfo.verticesStart) * 3);
      }
      if (this.normals) {
        vertexData.normals = this.normals.slice(materialInfo.verticesStart * 3, (materialInfo.verticesCount + materialInfo.verticesStart) * 3);
      }
      if (this.tangents) {
        vertexData.tangents = this.tangents.slice(materialInfo.verticesStart * 4, (materialInfo.verticesCount + materialInfo.verticesStart) * 4);
      }
      if (this.colors) {
        vertexData.colors = this.colors.slice(materialInfo.verticesStart * 4, (materialInfo.verticesCount + materialInfo.verticesStart) * 4);
      }
      if (this.uvs) {
        vertexData.uvs = this.uvs.slice(materialInfo.verticesStart * 2, (materialInfo.verticesCount + materialInfo.verticesStart) * 2);
      }
      if (this.uvs2) {
        vertexData.uvs2 = this.uvs2.slice(materialInfo.verticesStart * 2, (materialInfo.verticesCount + materialInfo.verticesStart) * 2);
      }
      if (this.uvs3) {
        vertexData.uvs3 = this.uvs3.slice(materialInfo.verticesStart * 2, (materialInfo.verticesCount + materialInfo.verticesStart) * 2);
      }
      if (this.uvs4) {
        vertexData.uvs4 = this.uvs4.slice(materialInfo.verticesStart * 2, (materialInfo.verticesCount + materialInfo.verticesStart) * 2);
      }
      if (this.uvs5) {
        vertexData.uvs5 = this.uvs5.slice(materialInfo.verticesStart * 2, (materialInfo.verticesCount + materialInfo.verticesStart) * 2);
      }
      if (this.uvs6) {
        vertexData.uvs6 = this.uvs6.slice(materialInfo.verticesStart * 2, (materialInfo.verticesCount + materialInfo.verticesStart) * 2);
      }
      if (this.matricesIndices) {
        vertexData.matricesIndices = this.matricesIndices.slice(materialInfo.verticesStart * 4, (materialInfo.verticesCount + materialInfo.verticesStart) * 4);
      }
      if (this.matricesIndicesExtra) {
        vertexData.matricesIndicesExtra = this.matricesIndicesExtra.slice(materialInfo.verticesStart * 4, (materialInfo.verticesCount + materialInfo.verticesStart) * 4);
      }
      if (this.matricesWeights) {
        vertexData.matricesWeights = this.matricesWeights.slice(materialInfo.verticesStart * 4, (materialInfo.verticesCount + materialInfo.verticesStart) * 4);
      }
      if (this.matricesWeightsExtra) {
        vertexData.matricesWeightsExtra = this.matricesWeightsExtra.slice(materialInfo.verticesStart * 4, (materialInfo.verticesCount + materialInfo.verticesStart) * 4);
      }
      if (this.indices) {
        vertexData.indices = [];
        for (let index = materialInfo.indexStart; index < materialInfo.indexStart + materialInfo.indexCount; index++) {
          vertexData.indices.push(this.indices[index] - materialInfo.verticesStart);
        }
      }
      const newMaterialInfo = new VertexDataMaterialInfo();
      newMaterialInfo.indexStart = 0;
      newMaterialInfo.indexCount = vertexData.indices ? vertexData.indices.length : 0;
      newMaterialInfo.materialIndex = materialInfo.materialIndex;
      newMaterialInfo.verticesStart = 0;
      newMaterialInfo.verticesCount = (vertexData.positions ? vertexData.positions.length : 0) / 3;
      vertexData.materialInfos = [newMaterialInfo];
      result.push(vertexData);
    }
    return result;
  }
  /**
   * Merges the passed VertexData into the current one
   * @param others the VertexData to be merged into the current one
   * @param use32BitsIndices defines a boolean indicating if indices must be store in a 32 bits array
   * @param forceCloneIndices defines a boolean indicating if indices are forced to be cloned
   * @param mergeMaterialIds defines a boolean indicating if we need to merge the material infos
   * @param enableCompletion defines a boolean indicating if the vertex data should be completed to be compatible
   * @returns the modified VertexData
   */
  merge(others, use32BitsIndices = false, forceCloneIndices = false, mergeMaterialIds = false, enableCompletion = false) {
    const vertexDatas = Array.isArray(others) ? others.map((other) => {
      return { vertexData: other };
    }) : [{ vertexData: others }];
    return runCoroutineSync(this._mergeCoroutine(void 0, vertexDatas, use32BitsIndices, false, forceCloneIndices, mergeMaterialIds, enableCompletion));
  }
  /**
   * @internal
   */
  *_mergeCoroutine(transform, vertexDatas, use32BitsIndices = false, isAsync, forceCloneIndices, mergeMaterialIds = false, enableCompletion = false) {
    var _a, _b, _c, _d;
    this._validate();
    let others = vertexDatas.map((vertexData) => vertexData.vertexData);
    let root = this;
    if (enableCompletion) {
      for (const other of others) {
        if (!other) {
          continue;
        }
        other._validate();
        if (!this.normals && other.normals) {
          this.normals = new Float32Array(this.positions.length);
        }
        if (!this.tangents && other.tangents) {
          this.tangents = new Float32Array(this.positions.length / 3 * 4);
        }
        if (!this.uvs && other.uvs) {
          this.uvs = new Float32Array(this.positions.length / 3 * 2);
        }
        if (!this.uvs2 && other.uvs2) {
          this.uvs2 = new Float32Array(this.positions.length / 3 * 2);
        }
        if (!this.uvs3 && other.uvs3) {
          this.uvs3 = new Float32Array(this.positions.length / 3 * 2);
        }
        if (!this.uvs4 && other.uvs4) {
          this.uvs4 = new Float32Array(this.positions.length / 3 * 2);
        }
        if (!this.uvs5 && other.uvs5) {
          this.uvs5 = new Float32Array(this.positions.length / 3 * 2);
        }
        if (!this.uvs6 && other.uvs6) {
          this.uvs6 = new Float32Array(this.positions.length / 3 * 2);
        }
        if (!this.colors && other.colors) {
          this.colors = new Float32Array(this.positions.length / 3 * 4);
          this.colors.fill(1);
        }
        if (!this.matricesIndices && other.matricesIndices) {
          this.matricesIndices = new Float32Array(this.positions.length / 3 * 4);
        }
        if (!this.matricesWeights && other.matricesWeights) {
          this.matricesWeights = new Float32Array(this.positions.length / 3 * 4);
        }
        if (!this.matricesIndicesExtra && other.matricesIndicesExtra) {
          this.matricesIndicesExtra = new Float32Array(this.positions.length / 3 * 4);
        }
        if (!this.matricesWeightsExtra && other.matricesWeightsExtra) {
          this.matricesWeightsExtra = new Float32Array(this.positions.length / 3 * 4);
        }
      }
    }
    for (const other of others) {
      if (!other) {
        continue;
      }
      if (!enableCompletion) {
        other._validate();
        if (!this.normals !== !other.normals || !this.tangents !== !other.tangents || !this.uvs !== !other.uvs || !this.uvs2 !== !other.uvs2 || !this.uvs3 !== !other.uvs3 || !this.uvs4 !== !other.uvs4 || !this.uvs5 !== !other.uvs5 || !this.uvs6 !== !other.uvs6 || !this.colors !== !other.colors || !this.matricesIndices !== !other.matricesIndices || !this.matricesWeights !== !other.matricesWeights || !this.matricesIndicesExtra !== !other.matricesIndicesExtra || !this.matricesWeightsExtra !== !other.matricesWeightsExtra) {
          throw new Error("Cannot merge vertex data that do not have the same set of attributes");
        }
      } else {
        if (this.normals && !other.normals) {
          other.normals = new Float32Array(other.positions.length);
        }
        if (this.tangents && !other.tangents) {
          other.tangents = new Float32Array(other.positions.length / 3 * 4);
        }
        if (this.uvs && !other.uvs) {
          other.uvs = new Float32Array(other.positions.length / 3 * 2);
        }
        if (this.uvs2 && !other.uvs2) {
          other.uvs2 = new Float32Array(other.positions.length / 3 * 2);
        }
        if (this.uvs3 && !other.uvs3) {
          other.uvs3 = new Float32Array(other.positions.length / 3 * 2);
        }
        if (this.uvs4 && !other.uvs4) {
          other.uvs4 = new Float32Array(other.positions.length / 3 * 2);
        }
        if (this.uvs5 && !other.uvs5) {
          other.uvs5 = new Float32Array(other.positions.length / 3 * 2);
        }
        if (this.uvs6 && !other.uvs6) {
          other.uvs6 = new Float32Array(other.positions.length / 3 * 2);
        }
        if (this.colors && !other.colors) {
          other.colors = new Float32Array(other.positions.length / 3 * 4);
          other.colors.fill(1);
        }
        if (this.matricesIndices && !other.matricesIndices) {
          other.matricesIndices = new Float32Array(other.positions.length / 3 * 4);
        }
        if (this.matricesWeights && !other.matricesWeights) {
          other.matricesWeights = new Float32Array(other.positions.length / 3 * 4);
        }
        if (this.matricesIndicesExtra && !other.matricesIndicesExtra) {
          other.matricesIndicesExtra = new Float32Array(other.positions.length / 3 * 4);
        }
        if (this.matricesWeightsExtra && !other.matricesWeightsExtra) {
          other.matricesWeightsExtra = new Float32Array(other.positions.length / 3 * 4);
        }
      }
    }
    if (mergeMaterialIds) {
      let materialIndex = 0;
      let indexOffset = 0;
      let vertexOffset = 0;
      const materialInfos = [];
      let currentMaterialInfo = null;
      const vertexDataList = [];
      for (const split of this.splitBasedOnMaterialID()) {
        vertexDataList.push({ vertexData: split, transform });
      }
      for (const data of vertexDatas) {
        if (!data.vertexData) {
          continue;
        }
        for (const split of data.vertexData.splitBasedOnMaterialID()) {
          vertexDataList.push({ vertexData: split, transform: data.transform });
        }
      }
      vertexDataList.sort((a, b) => {
        const matInfoA = a.vertexData.materialInfos ? a.vertexData.materialInfos[0].materialIndex : 0;
        const matInfoB = b.vertexData.materialInfos ? b.vertexData.materialInfos[0].materialIndex : 0;
        if (matInfoA > matInfoB) {
          return 1;
        }
        if (matInfoA === matInfoB) {
          return 0;
        }
        return -1;
      });
      for (const vertexDataSource of vertexDataList) {
        const vertexData = vertexDataSource.vertexData;
        if (vertexData.materialInfos) {
          materialIndex = vertexData.materialInfos[0].materialIndex;
        } else {
          materialIndex = 0;
        }
        if (currentMaterialInfo && currentMaterialInfo.materialIndex === materialIndex) {
          currentMaterialInfo.indexCount += vertexData.indices.length;
          currentMaterialInfo.verticesCount += vertexData.positions.length / 3;
        } else {
          const materialInfo = new VertexDataMaterialInfo();
          materialInfo.materialIndex = materialIndex;
          materialInfo.indexStart = indexOffset;
          materialInfo.indexCount = vertexData.indices.length;
          materialInfo.verticesStart = vertexOffset;
          materialInfo.verticesCount = vertexData.positions.length / 3;
          materialInfos.push(materialInfo);
          currentMaterialInfo = materialInfo;
        }
        indexOffset += vertexData.indices.length;
        vertexOffset += vertexData.positions.length / 3;
      }
      const first = vertexDataList.splice(0, 1)[0];
      root = first.vertexData;
      transform = first.transform;
      others = vertexDataList.map((v) => v.vertexData);
      vertexDatas = vertexDataList;
      this.materialInfos = materialInfos;
    }
    const totalIndices = others.reduce((indexSum, vertexData) => {
      var _a2, _b2;
      return indexSum + ((_b2 = (_a2 = vertexData.indices) === null || _a2 === void 0 ? void 0 : _a2.length) !== null && _b2 !== void 0 ? _b2 : 0);
    }, (_b = (_a = root.indices) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0);
    const sliceIndices = forceCloneIndices || others.some((vertexData) => vertexData.indices === root.indices);
    let indices = sliceIndices ? (_c = root.indices) === null || _c === void 0 ? void 0 : _c.slice() : root.indices;
    if (totalIndices > 0) {
      let indicesOffset = (_d = indices === null || indices === void 0 ? void 0 : indices.length) !== null && _d !== void 0 ? _d : 0;
      if (!indices) {
        indices = new Array(totalIndices);
      }
      if (indices.length !== totalIndices) {
        if (Array.isArray(indices)) {
          indices.length = totalIndices;
        } else {
          const temp = use32BitsIndices || indices instanceof Uint32Array ? new Uint32Array(totalIndices) : new Uint16Array(totalIndices);
          temp.set(indices);
          indices = temp;
        }
        if (transform && transform.determinant() < 0) {
          _VertexData._FlipFaces(indices, 0, indicesOffset);
        }
      }
      let positionsOffset = root.positions ? root.positions.length / 3 : 0;
      for (const { vertexData: other, transform: transform2 } of vertexDatas) {
        if (other.indices) {
          for (let index = 0; index < other.indices.length; index++) {
            indices[indicesOffset + index] = other.indices[index] + positionsOffset;
          }
          if (transform2 && transform2.determinant() < 0) {
            _VertexData._FlipFaces(indices, indicesOffset, other.indices.length);
          }
          positionsOffset += other.positions.length / 3;
          indicesOffset += other.indices.length;
          if (isAsync) {
            yield;
          }
        }
      }
    }
    this.indices = indices;
    this.positions = _VertexData._MergeElement(VertexBuffer.PositionKind, root.positions, transform, vertexDatas.map((other) => [other.vertexData.positions, other.transform]));
    if (isAsync) {
      yield;
    }
    if (root.normals) {
      this.normals = _VertexData._MergeElement(VertexBuffer.NormalKind, root.normals, transform, vertexDatas.map((other) => [other.vertexData.normals, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.tangents) {
      this.tangents = _VertexData._MergeElement(VertexBuffer.TangentKind, root.tangents, transform, vertexDatas.map((other) => [other.vertexData.tangents, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.uvs) {
      this.uvs = _VertexData._MergeElement(VertexBuffer.UVKind, root.uvs, transform, vertexDatas.map((other) => [other.vertexData.uvs, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.uvs2) {
      this.uvs2 = _VertexData._MergeElement(VertexBuffer.UV2Kind, root.uvs2, transform, vertexDatas.map((other) => [other.vertexData.uvs2, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.uvs3) {
      this.uvs3 = _VertexData._MergeElement(VertexBuffer.UV3Kind, root.uvs3, transform, vertexDatas.map((other) => [other.vertexData.uvs3, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.uvs4) {
      this.uvs4 = _VertexData._MergeElement(VertexBuffer.UV4Kind, root.uvs4, transform, vertexDatas.map((other) => [other.vertexData.uvs4, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.uvs5) {
      this.uvs5 = _VertexData._MergeElement(VertexBuffer.UV5Kind, root.uvs5, transform, vertexDatas.map((other) => [other.vertexData.uvs5, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.uvs6) {
      this.uvs6 = _VertexData._MergeElement(VertexBuffer.UV6Kind, root.uvs6, transform, vertexDatas.map((other) => [other.vertexData.uvs6, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.colors) {
      this.colors = _VertexData._MergeElement(VertexBuffer.ColorKind, root.colors, transform, vertexDatas.map((other) => [other.vertexData.colors, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.matricesIndices) {
      this.matricesIndices = _VertexData._MergeElement(VertexBuffer.MatricesIndicesKind, root.matricesIndices, transform, vertexDatas.map((other) => [other.vertexData.matricesIndices, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.matricesWeights) {
      this.matricesWeights = _VertexData._MergeElement(VertexBuffer.MatricesWeightsKind, root.matricesWeights, transform, vertexDatas.map((other) => [other.vertexData.matricesWeights, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.matricesIndicesExtra) {
      this.matricesIndicesExtra = _VertexData._MergeElement(VertexBuffer.MatricesIndicesExtraKind, root.matricesIndicesExtra, transform, vertexDatas.map((other) => [other.vertexData.matricesIndicesExtra, other.transform]));
      if (isAsync) {
        yield;
      }
    }
    if (root.matricesWeightsExtra) {
      this.matricesWeightsExtra = _VertexData._MergeElement(VertexBuffer.MatricesWeightsExtraKind, root.matricesWeightsExtra, transform, vertexDatas.map((other) => [other.vertexData.matricesWeightsExtra, other.transform]));
    }
    return this;
  }
  static _MergeElement(kind, source, transform, others) {
    const nonNullOthers = others.filter((other) => other[0] !== null && other[0] !== void 0);
    if (!source && nonNullOthers.length == 0) {
      return source;
    }
    if (!source) {
      return this._MergeElement(kind, nonNullOthers[0][0], nonNullOthers[0][1], nonNullOthers.slice(1));
    }
    const len = nonNullOthers.reduce((sumLen, elements) => sumLen + elements[0].length, source.length);
    const transformRange = kind === VertexBuffer.PositionKind ? _VertexData._TransformVector3Coordinates : kind === VertexBuffer.NormalKind ? _VertexData._TransformVector3Normals : kind === VertexBuffer.TangentKind ? _VertexData._TransformVector4Normals : () => {
    };
    if (source instanceof Float32Array) {
      const ret32 = new Float32Array(len);
      ret32.set(source);
      transform && transformRange(ret32, transform, 0, source.length);
      let offset = source.length;
      for (const [vertexData, transform2] of nonNullOthers) {
        ret32.set(vertexData, offset);
        transform2 && transformRange(ret32, transform2, offset, vertexData.length);
        offset += vertexData.length;
      }
      return ret32;
    } else {
      const ret = new Array(len);
      for (let i = 0; i < source.length; i++) {
        ret[i] = source[i];
      }
      transform && transformRange(ret, transform, 0, source.length);
      let offset = source.length;
      for (const [vertexData, transform2] of nonNullOthers) {
        for (let i = 0; i < vertexData.length; i++) {
          ret[offset + i] = vertexData[i];
        }
        transform2 && transformRange(ret, transform2, offset, vertexData.length);
        offset += vertexData.length;
      }
      return ret;
    }
  }
  _validate() {
    if (!this.positions) {
      throw new RuntimeError("Positions are required", ErrorCodes.MeshInvalidPositionsError);
    }
    const getElementCount = (kind, values) => {
      const stride = VertexBuffer.DeduceStride(kind);
      if (values.length % stride !== 0) {
        throw new Error("The " + kind + "s array count must be a multiple of " + stride);
      }
      return values.length / stride;
    };
    const positionsElementCount = getElementCount(VertexBuffer.PositionKind, this.positions);
    const validateElementCount = (kind, values) => {
      const elementCount = getElementCount(kind, values);
      if (elementCount !== positionsElementCount) {
        throw new Error("The " + kind + "s element count (" + elementCount + ") does not match the positions count (" + positionsElementCount + ")");
      }
    };
    if (this.normals) {
      validateElementCount(VertexBuffer.NormalKind, this.normals);
    }
    if (this.tangents) {
      validateElementCount(VertexBuffer.TangentKind, this.tangents);
    }
    if (this.uvs) {
      validateElementCount(VertexBuffer.UVKind, this.uvs);
    }
    if (this.uvs2) {
      validateElementCount(VertexBuffer.UV2Kind, this.uvs2);
    }
    if (this.uvs3) {
      validateElementCount(VertexBuffer.UV3Kind, this.uvs3);
    }
    if (this.uvs4) {
      validateElementCount(VertexBuffer.UV4Kind, this.uvs4);
    }
    if (this.uvs5) {
      validateElementCount(VertexBuffer.UV5Kind, this.uvs5);
    }
    if (this.uvs6) {
      validateElementCount(VertexBuffer.UV6Kind, this.uvs6);
    }
    if (this.colors) {
      validateElementCount(VertexBuffer.ColorKind, this.colors);
    }
    if (this.matricesIndices) {
      validateElementCount(VertexBuffer.MatricesIndicesKind, this.matricesIndices);
    }
    if (this.matricesWeights) {
      validateElementCount(VertexBuffer.MatricesWeightsKind, this.matricesWeights);
    }
    if (this.matricesIndicesExtra) {
      validateElementCount(VertexBuffer.MatricesIndicesExtraKind, this.matricesIndicesExtra);
    }
    if (this.matricesWeightsExtra) {
      validateElementCount(VertexBuffer.MatricesWeightsExtraKind, this.matricesWeightsExtra);
    }
  }
  /**
   * Clone the current vertex data
   * @returns a copy of the current data
   */
  clone() {
    const serializationObject = this.serialize();
    return _VertexData.Parse(serializationObject);
  }
  /**
   * Serializes the VertexData
   * @returns a serialized object
   */
  serialize() {
    const serializationObject = {};
    if (this.positions) {
      serializationObject.positions = Array.from(this.positions);
    }
    if (this.normals) {
      serializationObject.normals = Array.from(this.normals);
    }
    if (this.tangents) {
      serializationObject.tangents = Array.from(this.tangents);
    }
    if (this.uvs) {
      serializationObject.uvs = Array.from(this.uvs);
    }
    if (this.uvs2) {
      serializationObject.uvs2 = Array.from(this.uvs2);
    }
    if (this.uvs3) {
      serializationObject.uvs3 = Array.from(this.uvs3);
    }
    if (this.uvs4) {
      serializationObject.uvs4 = Array.from(this.uvs4);
    }
    if (this.uvs5) {
      serializationObject.uvs5 = Array.from(this.uvs5);
    }
    if (this.uvs6) {
      serializationObject.uvs6 = Array.from(this.uvs6);
    }
    if (this.colors) {
      serializationObject.colors = Array.from(this.colors);
    }
    if (this.matricesIndices) {
      serializationObject.matricesIndices = Array.from(this.matricesIndices);
      serializationObject.matricesIndices._isExpanded = true;
    }
    if (this.matricesWeights) {
      serializationObject.matricesWeights = Array.from(this.matricesWeights);
    }
    if (this.matricesIndicesExtra) {
      serializationObject.matricesIndicesExtra = Array.from(this.matricesIndicesExtra);
      serializationObject.matricesIndicesExtra._isExpanded = true;
    }
    if (this.matricesWeightsExtra) {
      serializationObject.matricesWeightsExtra = Array.from(this.matricesWeightsExtra);
    }
    serializationObject.indices = Array.from(this.indices);
    if (this.materialInfos) {
      serializationObject.materialInfos = [];
      for (const materialInfo of this.materialInfos) {
        const materialInfoSerializationObject = {
          indexStart: materialInfo.indexStart,
          indexCount: materialInfo.indexCount,
          materialIndex: materialInfo.materialIndex,
          verticesStart: materialInfo.verticesStart,
          verticesCount: materialInfo.verticesCount
        };
        serializationObject.materialInfos.push(materialInfoSerializationObject);
      }
    }
    return serializationObject;
  }
  // Statics
  /**
   * Extracts the vertexData from a mesh
   * @param mesh the mesh from which to extract the VertexData
   * @param copyWhenShared defines if the VertexData must be cloned when shared between multiple meshes, optional, default false
   * @param forceCopy indicating that the VertexData must be cloned, optional, default false
   * @returns the object VertexData associated to the passed mesh
   */
  static ExtractFromMesh(mesh, copyWhenShared, forceCopy) {
    return _VertexData._ExtractFrom(mesh, copyWhenShared, forceCopy);
  }
  /**
   * Extracts the vertexData from the geometry
   * @param geometry the geometry from which to extract the VertexData
   * @param copyWhenShared defines if the VertexData must be cloned when the geometry is shared between multiple meshes, optional, default false
   * @param forceCopy indicating that the VertexData must be cloned, optional, default false
   * @returns the object VertexData associated to the passed mesh
   */
  static ExtractFromGeometry(geometry, copyWhenShared, forceCopy) {
    return _VertexData._ExtractFrom(geometry, copyWhenShared, forceCopy);
  }
  static _ExtractFrom(meshOrGeometry, copyWhenShared, forceCopy) {
    const result = new _VertexData();
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      result.positions = meshOrGeometry.getVerticesData(VertexBuffer.PositionKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      result.normals = meshOrGeometry.getVerticesData(VertexBuffer.NormalKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.TangentKind)) {
      result.tangents = meshOrGeometry.getVerticesData(VertexBuffer.TangentKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UVKind)) {
      result.uvs = meshOrGeometry.getVerticesData(VertexBuffer.UVKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
      result.uvs2 = meshOrGeometry.getVerticesData(VertexBuffer.UV2Kind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV3Kind)) {
      result.uvs3 = meshOrGeometry.getVerticesData(VertexBuffer.UV3Kind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV4Kind)) {
      result.uvs4 = meshOrGeometry.getVerticesData(VertexBuffer.UV4Kind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV5Kind)) {
      result.uvs5 = meshOrGeometry.getVerticesData(VertexBuffer.UV5Kind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.UV6Kind)) {
      result.uvs6 = meshOrGeometry.getVerticesData(VertexBuffer.UV6Kind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.ColorKind)) {
      result.colors = meshOrGeometry.getVerticesData(VertexBuffer.ColorKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
      result.matricesIndices = meshOrGeometry.getVerticesData(VertexBuffer.MatricesIndicesKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      result.matricesWeights = meshOrGeometry.getVerticesData(VertexBuffer.MatricesWeightsKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesIndicesExtraKind)) {
      result.matricesIndicesExtra = meshOrGeometry.getVerticesData(VertexBuffer.MatricesIndicesExtraKind, copyWhenShared, forceCopy);
    }
    if (meshOrGeometry.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
      result.matricesWeightsExtra = meshOrGeometry.getVerticesData(VertexBuffer.MatricesWeightsExtraKind, copyWhenShared, forceCopy);
    }
    result.indices = meshOrGeometry.getIndices(copyWhenShared, forceCopy);
    return result;
  }
  /**
   * Creates the VertexData for a Ribbon
   * @param options an object used to set the following optional parameters for the ribbon, required but can be empty
   * * pathArray array of paths, each of which an array of successive Vector3
   * * closeArray creates a seam between the first and the last paths of the pathArray, optional, default false
   * * closePath creates a seam between the first and the last points of each path of the path array, optional, default false
   * * offset a positive integer, only used when pathArray contains a single path (offset = 10 means the point 1 is joined to the point 11), default rounded half size of the pathArray length
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * * invertUV swaps in the U and V coordinates when applying a texture, optional, default false
   * * uvs a linear array, of length 2 * number of vertices, of custom UV values, optional
   * * colors a linear array, of length 4 * number of vertices, of custom color values, optional
   * @param options.pathArray
   * @param options.closeArray
   * @param options.closePath
   * @param options.offset
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @param options.invertUV
   * @param options.uvs
   * @param options.colors
   * @returns the VertexData of the ribbon
   * @deprecated use CreateRibbonVertexData instead
   */
  static CreateRibbon(options) {
    throw _WarnImport("ribbonBuilder");
  }
  /**
   * Creates the VertexData for a box
   * @param options an object used to set the following optional parameters for the box, required but can be empty
   * * size sets the width, height and depth of the box to the value of size, optional default 1
   * * width sets the width (x direction) of the box, overwrites the width set by size, optional, default size
   * * height sets the height (y direction) of the box, overwrites the height set by size, optional, default size
   * * depth sets the depth (z direction) of the box, overwrites the depth set by size, optional, default size
   * * faceUV an array of 6 Vector4 elements used to set different images to each box side
   * * faceColors an array of 6 Color3 elements used to set different colors to each box side
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.size
   * @param options.width
   * @param options.height
   * @param options.depth
   * @param options.faceUV
   * @param options.faceColors
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the box
   * @deprecated Please use CreateBoxVertexData from the BoxBuilder file instead
   */
  static CreateBox(options) {
    throw _WarnImport("boxBuilder");
  }
  /**
   * Creates the VertexData for a tiled box
   * @param options an object used to set the following optional parameters for the box, required but can be empty
   * * faceTiles sets the pattern, tile size and number of tiles for a face
   * * faceUV an array of 6 Vector4 elements used to set different images to each box side
   * * faceColors an array of 6 Color3 elements used to set different colors to each box side
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * @param options.pattern
   * @param options.width
   * @param options.height
   * @param options.depth
   * @param options.tileSize
   * @param options.tileWidth
   * @param options.tileHeight
   * @param options.alignHorizontal
   * @param options.alignVertical
   * @param options.faceUV
   * @param options.faceColors
   * @param options.sideOrientation
   * @returns the VertexData of the box
   * @deprecated Please use CreateTiledBoxVertexData instead
   */
  static CreateTiledBox(options) {
    throw _WarnImport("tiledBoxBuilder");
  }
  /**
   * Creates the VertexData for a tiled plane
   * @param options an object used to set the following optional parameters for the box, required but can be empty
   * * pattern a limited pattern arrangement depending on the number
   * * tileSize sets the width, height and depth of the tile to the value of size, optional default 1
   * * tileWidth sets the width (x direction) of the tile, overwrites the width set by size, optional, default size
   * * tileHeight sets the height (y direction) of the tile, overwrites the height set by size, optional, default size
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.pattern
   * @param options.tileSize
   * @param options.tileWidth
   * @param options.tileHeight
   * @param options.size
   * @param options.width
   * @param options.height
   * @param options.alignHorizontal
   * @param options.alignVertical
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the tiled plane
   * @deprecated use CreateTiledPlaneVertexData instead
   */
  static CreateTiledPlane(options) {
    throw _WarnImport("tiledPlaneBuilder");
  }
  /**
   * Creates the VertexData for an ellipsoid, defaults to a sphere
   * @param options an object used to set the following optional parameters for the box, required but can be empty
   * * segments sets the number of horizontal strips optional, default 32
   * * diameter sets the axes dimensions, diameterX, diameterY and diameterZ to the value of diameter, optional default 1
   * * diameterX sets the diameterX (x direction) of the ellipsoid, overwrites the diameterX set by diameter, optional, default diameter
   * * diameterY sets the diameterY (y direction) of the ellipsoid, overwrites the diameterY set by diameter, optional, default diameter
   * * diameterZ sets the diameterZ (z direction) of the ellipsoid, overwrites the diameterZ set by diameter, optional, default diameter
   * * arc a number from 0 to 1, to create an unclosed ellipsoid based on the fraction of the circumference (latitude) given by the arc value, optional, default 1
   * * slice a number from 0 to 1, to create an unclosed ellipsoid based on the fraction of the height (latitude) given by the arc value, optional, default 1
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.segments
   * @param options.diameter
   * @param options.diameterX
   * @param options.diameterY
   * @param options.diameterZ
   * @param options.arc
   * @param options.slice
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the ellipsoid
   * @deprecated use CreateSphereVertexData instead
   */
  static CreateSphere(options) {
    throw _WarnImport("sphereBuilder");
  }
  /**
   * Creates the VertexData for a cylinder, cone or prism
   * @param options an object used to set the following optional parameters for the box, required but can be empty
   * * height sets the height (y direction) of the cylinder, optional, default 2
   * * diameterTop sets the diameter of the top of the cone, overwrites diameter,  optional, default diameter
   * * diameterBottom sets the diameter of the bottom of the cone, overwrites diameter,  optional, default diameter
   * * diameter sets the diameter of the top and bottom of the cone, optional default 1
   * * tessellation the number of prism sides, 3 for a triangular prism, optional, default 24
   * * subdivisions` the number of rings along the cylinder height, optional, default 1
   * * arc a number from 0 to 1, to create an unclosed cylinder based on the fraction of the circumference given by the arc value, optional, default 1
   * * faceColors an array of Color3 elements used to set different colors to the top, rings and bottom respectively
   * * faceUV an array of Vector4 elements used to set different images to the top, rings and bottom respectively
   * * hasRings when true makes each subdivision independently treated as a face for faceUV and faceColors, optional, default false
   * * enclose when true closes an open cylinder by adding extra flat faces between the height axis and vertical edges, think cut cake
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.height
   * @param options.diameterTop
   * @param options.diameterBottom
   * @param options.diameter
   * @param options.tessellation
   * @param options.subdivisions
   * @param options.arc
   * @param options.faceColors
   * @param options.faceUV
   * @param options.hasRings
   * @param options.enclose
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the cylinder, cone or prism
   * @deprecated please use CreateCylinderVertexData instead
   */
  static CreateCylinder(options) {
    throw _WarnImport("cylinderBuilder");
  }
  /**
   * Creates the VertexData for a torus
   * @param options an object used to set the following optional parameters for the box, required but can be empty
   * * diameter the diameter of the torus, optional default 1
   * * thickness the diameter of the tube forming the torus, optional default 0.5
   * * tessellation the number of prism sides, 3 for a triangular prism, optional, default 24
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.diameter
   * @param options.thickness
   * @param options.tessellation
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the torus
   * @deprecated use CreateTorusVertexData instead
   */
  static CreateTorus(options) {
    throw _WarnImport("torusBuilder");
  }
  /**
   * Creates the VertexData of the LineSystem
   * @param options an object used to set the following optional parameters for the LineSystem, required but can be empty
   *  - lines an array of lines, each line being an array of successive Vector3
   *  - colors an array of line colors, each of the line colors being an array of successive Color4, one per line point
   * @param options.lines
   * @param options.colors
   * @returns the VertexData of the LineSystem
   * @deprecated use CreateLineSystemVertexData instead
   */
  static CreateLineSystem(options) {
    throw _WarnImport("linesBuilder");
  }
  /**
   * Create the VertexData for a DashedLines
   * @param options an object used to set the following optional parameters for the DashedLines, required but can be empty
   *  - points an array successive Vector3
   *  - dashSize the size of the dashes relative to the dash number, optional, default 3
   *  - gapSize the size of the gap between two successive dashes relative to the dash number, optional, default 1
   *  - dashNb the intended total number of dashes, optional, default 200
   * @param options.points
   * @param options.dashSize
   * @param options.gapSize
   * @param options.dashNb
   * @returns the VertexData for the DashedLines
   * @deprecated use CreateDashedLinesVertexData instead
   */
  static CreateDashedLines(options) {
    throw _WarnImport("linesBuilder");
  }
  /**
   * Creates the VertexData for a Ground
   * @param options an object used to set the following optional parameters for the Ground, required but can be empty
   *  - width the width (x direction) of the ground, optional, default 1
   *  - height the height (z direction) of the ground, optional, default 1
   *  - subdivisions the number of subdivisions per side, optional, default 1
   * @param options.width
   * @param options.height
   * @param options.subdivisions
   * @param options.subdivisionsX
   * @param options.subdivisionsY
   * @returns the VertexData of the Ground
   * @deprecated Please use CreateGroundVertexData instead
   */
  static CreateGround(options) {
    throw _WarnImport("groundBuilder");
  }
  /**
   * Creates the VertexData for a TiledGround by subdividing the ground into tiles
   * @param options an object used to set the following optional parameters for the Ground, required but can be empty
   * * xmin the ground minimum X coordinate, optional, default -1
   * * zmin the ground minimum Z coordinate, optional, default -1
   * * xmax the ground maximum X coordinate, optional, default 1
   * * zmax the ground maximum Z coordinate, optional, default 1
   * * subdivisions a javascript object {w: positive integer, h: positive integer}, `w` and `h` are the numbers of subdivisions on the ground width and height creating 'tiles', default {w: 6, h: 6}
   * * precision a javascript object {w: positive integer, h: positive integer}, `w` and `h` are the numbers of subdivisions on the tile width and height, default {w: 2, h: 2}
   * @param options.xmin
   * @param options.zmin
   * @param options.xmax
   * @param options.zmax
   * @param options.subdivisions
   * @param options.subdivisions.w
   * @param options.subdivisions.h
   * @param options.precision
   * @param options.precision.w
   * @param options.precision.h
   * @returns the VertexData of the TiledGround
   * @deprecated use CreateTiledGroundVertexData instead
   */
  static CreateTiledGround(options) {
    throw _WarnImport("groundBuilder");
  }
  /**
   * Creates the VertexData of the Ground designed from a heightmap
   * @param options an object used to set the following parameters for the Ground, required and provided by CreateGroundFromHeightMap
   * * width the width (x direction) of the ground
   * * height the height (z direction) of the ground
   * * subdivisions the number of subdivisions per side
   * * minHeight the minimum altitude on the ground, optional, default 0
   * * maxHeight the maximum altitude on the ground, optional default 1
   * * colorFilter the filter to apply to the image pixel colors to compute the height, optional Color3, default (0.3, 0.59, 0.11)
   * * buffer the array holding the image color data
   * * bufferWidth the width of image
   * * bufferHeight the height of image
   * * alphaFilter Remove any data where the alpha channel is below this value, defaults 0 (all data visible)
   * @param options.width
   * @param options.height
   * @param options.subdivisions
   * @param options.minHeight
   * @param options.maxHeight
   * @param options.colorFilter
   * @param options.buffer
   * @param options.bufferWidth
   * @param options.bufferHeight
   * @param options.alphaFilter
   * @returns the VertexData of the Ground designed from a heightmap
   * @deprecated use CreateGroundFromHeightMapVertexData instead
   */
  static CreateGroundFromHeightMap(options) {
    throw _WarnImport("groundBuilder");
  }
  /**
   * Creates the VertexData for a Plane
   * @param options an object used to set the following optional parameters for the plane, required but can be empty
   * * size sets the width and height of the plane to the value of size, optional default 1
   * * width sets the width (x direction) of the plane, overwrites the width set by size, optional, default size
   * * height sets the height (y direction) of the plane, overwrites the height set by size, optional, default size
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.size
   * @param options.width
   * @param options.height
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the box
   * @deprecated use CreatePlaneVertexData instead
   */
  static CreatePlane(options) {
    throw _WarnImport("planeBuilder");
  }
  /**
   * Creates the VertexData of the Disc or regular Polygon
   * @param options an object used to set the following optional parameters for the disc, required but can be empty
   * * radius the radius of the disc, optional default 0.5
   * * tessellation the number of polygon sides, optional, default 64
   * * arc a number from 0 to 1, to create an unclosed polygon based on the fraction of the circumference given by the arc value, optional, default 1
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.radius
   * @param options.tessellation
   * @param options.arc
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the box
   * @deprecated use CreateDiscVertexData instead
   */
  static CreateDisc(options) {
    throw _WarnImport("discBuilder");
  }
  /**
   * Creates the VertexData for an irregular Polygon in the XoZ plane using a mesh built by polygonTriangulation.build()
   * All parameters are provided by CreatePolygon as needed
   * @param polygon a mesh built from polygonTriangulation.build()
   * @param sideOrientation takes the values Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * @param fUV an array of Vector4 elements used to set different images to the top, rings and bottom respectively
   * @param fColors an array of Color3 elements used to set different colors to the top, rings and bottom respectively
   * @param frontUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * @param backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param wrap a boolean, default false, when true and fUVs used texture is wrapped around all sides, when false texture is applied side
   * @returns the VertexData of the Polygon
   * @deprecated use CreatePolygonVertexData instead
   */
  static CreatePolygon(polygon, sideOrientation, fUV, fColors, frontUVs, backUVs, wrap) {
    throw _WarnImport("polygonBuilder");
  }
  /**
   * Creates the VertexData of the IcoSphere
   * @param options an object used to set the following optional parameters for the IcoSphere, required but can be empty
   * * radius the radius of the IcoSphere, optional default 1
   * * radiusX allows stretching in the x direction, optional, default radius
   * * radiusY allows stretching in the y direction, optional, default radius
   * * radiusZ allows stretching in the z direction, optional, default radius
   * * flat when true creates a flat shaded mesh, optional, default true
   * * subdivisions increasing the subdivisions increases the number of faces, optional, default 4
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.radius
   * @param options.radiusX
   * @param options.radiusY
   * @param options.radiusZ
   * @param options.flat
   * @param options.subdivisions
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the IcoSphere
   * @deprecated use CreateIcoSphereVertexData instead
   */
  static CreateIcoSphere(options) {
    throw _WarnImport("icoSphereBuilder");
  }
  // inspired from // http://stemkoski.github.io/Three.js/Polyhedra.html
  /**
   * Creates the VertexData for a Polyhedron
   * @param options an object used to set the following optional parameters for the polyhedron, required but can be empty
   * * type provided types are:
   *  * 0 : Tetrahedron, 1 : Octahedron, 2 : Dodecahedron, 3 : Icosahedron, 4 : Rhombicuboctahedron, 5 : Triangular Prism, 6 : Pentagonal Prism, 7 : Hexagonal Prism, 8 : Square Pyramid (J1)
   *  * 9 : Pentagonal Pyramid (J2), 10 : Triangular Dipyramid (J12), 11 : Pentagonal Dipyramid (J13), 12 : Elongated Square Dipyramid (J15), 13 : Elongated Pentagonal Dipyramid (J16), 14 : Elongated Pentagonal Cupola (J20)
   * * size the size of the IcoSphere, optional default 1
   * * sizeX allows stretching in the x direction, optional, default size
   * * sizeY allows stretching in the y direction, optional, default size
   * * sizeZ allows stretching in the z direction, optional, default size
   * * custom a number that overwrites the type to create from an extended set of polyhedron from https://www.babylonjs-playground.com/#21QRSK#15 with minimised editor
   * * faceUV an array of Vector4 elements used to set different images to the top, rings and bottom respectively
   * * faceColors an array of Color3 elements used to set different colors to the top, rings and bottom respectively
   * * flat when true creates a flat shaded mesh, optional, default true
   * * subdivisions increasing the subdivisions increases the number of faces, optional, default 4
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.type
   * @param options.size
   * @param options.sizeX
   * @param options.sizeY
   * @param options.sizeZ
   * @param options.custom
   * @param options.faceUV
   * @param options.faceColors
   * @param options.flat
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the Polyhedron
   * @deprecated use CreatePolyhedronVertexData instead
   */
  static CreatePolyhedron(options) {
    throw _WarnImport("polyhedronBuilder");
  }
  /**
   * Creates the VertexData for a Capsule, inspired from https://github.com/maximeq/three-js-capsule-geometry/blob/master/src/CapsuleBufferGeometry.js
   * @param options an object used to set the following optional parameters for the capsule, required but can be empty
   * @returns the VertexData of the Capsule
   * @deprecated Please use CreateCapsuleVertexData from the capsuleBuilder file instead
   */
  static CreateCapsule(options = {
    orientation: Vector3.Up(),
    subdivisions: 2,
    tessellation: 16,
    height: 1,
    radius: 0.25,
    capSubdivisions: 6
  }) {
    throw _WarnImport("capsuleBuilder");
  }
  // based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/TorusKnot.as?spec=svn2473&r=2473
  /**
   * Creates the VertexData for a TorusKnot
   * @param options an object used to set the following optional parameters for the TorusKnot, required but can be empty
   * * radius the radius of the torus knot, optional, default 2
   * * tube the thickness of the tube, optional, default 0.5
   * * radialSegments the number of sides on each tube segments, optional, default 32
   * * tubularSegments the number of tubes to decompose the knot into, optional, default 32
   * * p the number of windings around the z axis, optional,  default 2
   * * q the number of windings around the x axis, optional,  default 3
   * * sideOrientation optional and takes the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * frontUvs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the front side, optional, default vector4 (0, 0, 1, 1)
   * * backUVs only usable when you create a double-sided mesh, used to choose what parts of the texture image to crop and apply on the back side, optional, default vector4 (0, 0, 1, 1)
   * @param options.radius
   * @param options.tube
   * @param options.radialSegments
   * @param options.tubularSegments
   * @param options.p
   * @param options.q
   * @param options.sideOrientation
   * @param options.frontUVs
   * @param options.backUVs
   * @returns the VertexData of the Torus Knot
   * @deprecated use CreateTorusKnotVertexData instead
   */
  static CreateTorusKnot(options) {
    throw _WarnImport("torusKnotBuilder");
  }
  // Tools
  /**
   * Compute normals for given positions and indices
   * @param positions an array of vertex positions, [...., x, y, z, ......]
   * @param indices an array of indices in groups of three for each triangular facet, [...., i, j, k, ......]
   * @param normals an array of vertex normals, [...., x, y, z, ......]
   * @param options an object used to set the following optional parameters for the TorusKnot, optional
   * * facetNormals : optional array of facet normals (vector3)
   * * facetPositions : optional array of facet positions (vector3)
   * * facetPartitioning : optional partitioning array. facetPositions is required for facetPartitioning computation
   * * ratio : optional partitioning ratio / bounding box, required for facetPartitioning computation
   * * bInfo : optional bounding info, required for facetPartitioning computation
   * * bbSize : optional bounding box size data, required for facetPartitioning computation
   * * subDiv : optional partitioning data about subdivisions on  each axis (int), required for facetPartitioning computation
   * * useRightHandedSystem: optional boolean to for right handed system computation
   * * depthSort : optional boolean to enable the facet depth sort computation
   * * distanceTo : optional Vector3 to compute the facet depth from this location
   * * depthSortedFacets : optional array of depthSortedFacets to store the facet distances from the reference location
   * @param options.facetNormals
   * @param options.facetPositions
   * @param options.facetPartitioning
   * @param options.ratio
   * @param options.bInfo
   * @param options.bbSize
   * @param options.subDiv
   * @param options.useRightHandedSystem
   * @param options.depthSort
   * @param options.distanceTo
   * @param options.depthSortedFacets
   */
  static ComputeNormals(positions, indices, normals, options) {
    let index = 0;
    let p1p2x = 0;
    let p1p2y = 0;
    let p1p2z = 0;
    let p3p2x = 0;
    let p3p2y = 0;
    let p3p2z = 0;
    let faceNormalx = 0;
    let faceNormaly = 0;
    let faceNormalz = 0;
    let length = 0;
    let v1x = 0;
    let v1y = 0;
    let v1z = 0;
    let v2x = 0;
    let v2y = 0;
    let v2z = 0;
    let v3x = 0;
    let v3y = 0;
    let v3z = 0;
    let computeFacetNormals = false;
    let computeFacetPositions = false;
    let computeFacetPartitioning = false;
    let computeDepthSort = false;
    let faceNormalSign = 1;
    let ratio = 0;
    let distanceTo = null;
    if (options) {
      computeFacetNormals = options.facetNormals ? true : false;
      computeFacetPositions = options.facetPositions ? true : false;
      computeFacetPartitioning = options.facetPartitioning ? true : false;
      faceNormalSign = options.useRightHandedSystem === true ? -1 : 1;
      ratio = options.ratio || 0;
      computeDepthSort = options.depthSort ? true : false;
      distanceTo = options.distanceTo;
      if (computeDepthSort) {
        if (distanceTo === void 0) {
          distanceTo = Vector3.Zero();
        }
      }
    }
    let xSubRatio = 0;
    let ySubRatio = 0;
    let zSubRatio = 0;
    let subSq = 0;
    if (computeFacetPartitioning && options && options.bbSize) {
      xSubRatio = options.subDiv.X * ratio / options.bbSize.x;
      ySubRatio = options.subDiv.Y * ratio / options.bbSize.y;
      zSubRatio = options.subDiv.Z * ratio / options.bbSize.z;
      subSq = options.subDiv.max * options.subDiv.max;
      options.facetPartitioning.length = 0;
    }
    for (index = 0; index < positions.length; index++) {
      normals[index] = 0;
    }
    const nbFaces = indices.length / 3 | 0;
    for (index = 0; index < nbFaces; index++) {
      v1x = indices[index * 3] * 3;
      v1y = v1x + 1;
      v1z = v1x + 2;
      v2x = indices[index * 3 + 1] * 3;
      v2y = v2x + 1;
      v2z = v2x + 2;
      v3x = indices[index * 3 + 2] * 3;
      v3y = v3x + 1;
      v3z = v3x + 2;
      p1p2x = positions[v1x] - positions[v2x];
      p1p2y = positions[v1y] - positions[v2y];
      p1p2z = positions[v1z] - positions[v2z];
      p3p2x = positions[v3x] - positions[v2x];
      p3p2y = positions[v3y] - positions[v2y];
      p3p2z = positions[v3z] - positions[v2z];
      faceNormalx = faceNormalSign * (p1p2y * p3p2z - p1p2z * p3p2y);
      faceNormaly = faceNormalSign * (p1p2z * p3p2x - p1p2x * p3p2z);
      faceNormalz = faceNormalSign * (p1p2x * p3p2y - p1p2y * p3p2x);
      length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
      length = length === 0 ? 1 : length;
      faceNormalx /= length;
      faceNormaly /= length;
      faceNormalz /= length;
      if (computeFacetNormals && options) {
        options.facetNormals[index].x = faceNormalx;
        options.facetNormals[index].y = faceNormaly;
        options.facetNormals[index].z = faceNormalz;
      }
      if (computeFacetPositions && options) {
        options.facetPositions[index].x = (positions[v1x] + positions[v2x] + positions[v3x]) / 3;
        options.facetPositions[index].y = (positions[v1y] + positions[v2y] + positions[v3y]) / 3;
        options.facetPositions[index].z = (positions[v1z] + positions[v2z] + positions[v3z]) / 3;
      }
      if (computeFacetPartitioning && options) {
        const ox = Math.floor((options.facetPositions[index].x - options.bInfo.minimum.x * ratio) * xSubRatio);
        const oy = Math.floor((options.facetPositions[index].y - options.bInfo.minimum.y * ratio) * ySubRatio);
        const oz = Math.floor((options.facetPositions[index].z - options.bInfo.minimum.z * ratio) * zSubRatio);
        const b1x = Math.floor((positions[v1x] - options.bInfo.minimum.x * ratio) * xSubRatio);
        const b1y = Math.floor((positions[v1y] - options.bInfo.minimum.y * ratio) * ySubRatio);
        const b1z = Math.floor((positions[v1z] - options.bInfo.minimum.z * ratio) * zSubRatio);
        const b2x = Math.floor((positions[v2x] - options.bInfo.minimum.x * ratio) * xSubRatio);
        const b2y = Math.floor((positions[v2y] - options.bInfo.minimum.y * ratio) * ySubRatio);
        const b2z = Math.floor((positions[v2z] - options.bInfo.minimum.z * ratio) * zSubRatio);
        const b3x = Math.floor((positions[v3x] - options.bInfo.minimum.x * ratio) * xSubRatio);
        const b3y = Math.floor((positions[v3y] - options.bInfo.minimum.y * ratio) * ySubRatio);
        const b3z = Math.floor((positions[v3z] - options.bInfo.minimum.z * ratio) * zSubRatio);
        const block_idx_v1 = b1x + options.subDiv.max * b1y + subSq * b1z;
        const block_idx_v2 = b2x + options.subDiv.max * b2y + subSq * b2z;
        const block_idx_v3 = b3x + options.subDiv.max * b3y + subSq * b3z;
        const block_idx_o = ox + options.subDiv.max * oy + subSq * oz;
        options.facetPartitioning[block_idx_o] = options.facetPartitioning[block_idx_o] ? options.facetPartitioning[block_idx_o] : new Array();
        options.facetPartitioning[block_idx_v1] = options.facetPartitioning[block_idx_v1] ? options.facetPartitioning[block_idx_v1] : new Array();
        options.facetPartitioning[block_idx_v2] = options.facetPartitioning[block_idx_v2] ? options.facetPartitioning[block_idx_v2] : new Array();
        options.facetPartitioning[block_idx_v3] = options.facetPartitioning[block_idx_v3] ? options.facetPartitioning[block_idx_v3] : new Array();
        options.facetPartitioning[block_idx_v1].push(index);
        if (block_idx_v2 != block_idx_v1) {
          options.facetPartitioning[block_idx_v2].push(index);
        }
        if (!(block_idx_v3 == block_idx_v2 || block_idx_v3 == block_idx_v1)) {
          options.facetPartitioning[block_idx_v3].push(index);
        }
        if (!(block_idx_o == block_idx_v1 || block_idx_o == block_idx_v2 || block_idx_o == block_idx_v3)) {
          options.facetPartitioning[block_idx_o].push(index);
        }
      }
      if (computeDepthSort && options && options.facetPositions) {
        const dsf = options.depthSortedFacets[index];
        dsf.ind = index * 3;
        dsf.sqDistance = Vector3.DistanceSquared(options.facetPositions[index], distanceTo);
      }
      normals[v1x] += faceNormalx;
      normals[v1y] += faceNormaly;
      normals[v1z] += faceNormalz;
      normals[v2x] += faceNormalx;
      normals[v2y] += faceNormaly;
      normals[v2z] += faceNormalz;
      normals[v3x] += faceNormalx;
      normals[v3y] += faceNormaly;
      normals[v3z] += faceNormalz;
    }
    for (index = 0; index < normals.length / 3; index++) {
      faceNormalx = normals[index * 3];
      faceNormaly = normals[index * 3 + 1];
      faceNormalz = normals[index * 3 + 2];
      length = Math.sqrt(faceNormalx * faceNormalx + faceNormaly * faceNormaly + faceNormalz * faceNormalz);
      length = length === 0 ? 1 : length;
      faceNormalx /= length;
      faceNormaly /= length;
      faceNormalz /= length;
      normals[index * 3] = faceNormalx;
      normals[index * 3 + 1] = faceNormaly;
      normals[index * 3 + 2] = faceNormalz;
    }
  }
  /**
   * @internal
   */
  static _ComputeSides(sideOrientation, positions, indices, normals, uvs, frontUVs, backUVs) {
    const li = indices.length;
    const ln = normals.length;
    let i;
    let n;
    sideOrientation = sideOrientation || _VertexData.DEFAULTSIDE;
    switch (sideOrientation) {
      case _VertexData.FRONTSIDE:
        break;
      case _VertexData.BACKSIDE:
        for (i = 0; i < li; i += 3) {
          const tmp = indices[i];
          indices[i] = indices[i + 2];
          indices[i + 2] = tmp;
        }
        for (n = 0; n < ln; n++) {
          normals[n] = -normals[n];
        }
        break;
      case _VertexData.DOUBLESIDE: {
        const lp = positions.length;
        const l = lp / 3;
        for (let p = 0; p < lp; p++) {
          positions[lp + p] = positions[p];
        }
        for (i = 0; i < li; i += 3) {
          indices[i + li] = indices[i + 2] + l;
          indices[i + 1 + li] = indices[i + 1] + l;
          indices[i + 2 + li] = indices[i] + l;
        }
        for (n = 0; n < ln; n++) {
          normals[ln + n] = -normals[n];
        }
        const lu = uvs.length;
        let u = 0;
        for (u = 0; u < lu; u++) {
          uvs[u + lu] = uvs[u];
        }
        frontUVs = frontUVs ? frontUVs : new Vector4(0, 0, 1, 1);
        backUVs = backUVs ? backUVs : new Vector4(0, 0, 1, 1);
        u = 0;
        for (i = 0; i < lu / 2; i++) {
          uvs[u] = frontUVs.x + (frontUVs.z - frontUVs.x) * uvs[u];
          uvs[u + 1] = frontUVs.y + (frontUVs.w - frontUVs.y) * uvs[u + 1];
          uvs[u + lu] = backUVs.x + (backUVs.z - backUVs.x) * uvs[u + lu];
          uvs[u + lu + 1] = backUVs.y + (backUVs.w - backUVs.y) * uvs[u + lu + 1];
          u += 2;
        }
        break;
      }
    }
  }
  /**
   * Creates a VertexData from serialized data
   * @param parsedVertexData the parsed data from an imported file
   * @returns a VertexData
   */
  static Parse(parsedVertexData) {
    const vertexData = new _VertexData();
    const positions = parsedVertexData.positions;
    if (positions) {
      vertexData.set(positions, VertexBuffer.PositionKind);
    }
    const normals = parsedVertexData.normals;
    if (normals) {
      vertexData.set(normals, VertexBuffer.NormalKind);
    }
    const tangents = parsedVertexData.tangents;
    if (tangents) {
      vertexData.set(tangents, VertexBuffer.TangentKind);
    }
    const uvs = parsedVertexData.uvs;
    if (uvs) {
      vertexData.set(uvs, VertexBuffer.UVKind);
    }
    const uvs2 = parsedVertexData.uvs2;
    if (uvs2) {
      vertexData.set(uvs2, VertexBuffer.UV2Kind);
    }
    const uvs3 = parsedVertexData.uvs3;
    if (uvs3) {
      vertexData.set(uvs3, VertexBuffer.UV3Kind);
    }
    const uvs4 = parsedVertexData.uvs4;
    if (uvs4) {
      vertexData.set(uvs4, VertexBuffer.UV4Kind);
    }
    const uvs5 = parsedVertexData.uvs5;
    if (uvs5) {
      vertexData.set(uvs5, VertexBuffer.UV5Kind);
    }
    const uvs6 = parsedVertexData.uvs6;
    if (uvs6) {
      vertexData.set(uvs6, VertexBuffer.UV6Kind);
    }
    const colors = parsedVertexData.colors;
    if (colors) {
      vertexData.set(Color4.CheckColors4(colors, positions.length / 3), VertexBuffer.ColorKind);
    }
    const matricesIndices = parsedVertexData.matricesIndices;
    if (matricesIndices) {
      vertexData.set(matricesIndices, VertexBuffer.MatricesIndicesKind);
    }
    const matricesWeights = parsedVertexData.matricesWeights;
    if (matricesWeights) {
      vertexData.set(matricesWeights, VertexBuffer.MatricesWeightsKind);
    }
    const indices = parsedVertexData.indices;
    if (indices) {
      vertexData.indices = indices;
    }
    const materialInfos = parsedVertexData.materialInfos;
    if (materialInfos) {
      vertexData.materialInfos = [];
      for (const materialInfoFromJSON of materialInfos) {
        const materialInfo = new VertexDataMaterialInfo();
        materialInfo.indexCount = materialInfoFromJSON.indexCount;
        materialInfo.indexStart = materialInfoFromJSON.indexStart;
        materialInfo.verticesCount = materialInfoFromJSON.verticesCount;
        materialInfo.verticesStart = materialInfoFromJSON.verticesStart;
        materialInfo.materialIndex = materialInfoFromJSON.materialIndex;
        vertexData.materialInfos.push(materialInfo);
      }
    }
    return vertexData;
  }
  /**
   * Applies VertexData created from the imported parameters to the geometry
   * @param parsedVertexData the parsed data from an imported file
   * @param geometry the geometry to apply the VertexData to
   */
  static ImportVertexData(parsedVertexData, geometry) {
    const vertexData = _VertexData.Parse(parsedVertexData);
    geometry.setAllVerticesData(vertexData, parsedVertexData.updatable);
  }
};
VertexData.FRONTSIDE = 0;
VertexData.BACKSIDE = 1;
VertexData.DOUBLESIDE = 2;
VertexData.DEFAULTSIDE = 0;
VertexData._UniqueIDGenerator = 0;
__decorate([
  nativeOverride.filter((...[coordinates]) => !Array.isArray(coordinates))
], VertexData, "_TransformVector3Coordinates", null);
__decorate([
  nativeOverride.filter((...[normals]) => !Array.isArray(normals))
], VertexData, "_TransformVector3Normals", null);
__decorate([
  nativeOverride.filter((...[normals]) => !Array.isArray(normals))
], VertexData, "_TransformVector4Normals", null);
__decorate([
  nativeOverride.filter((...[indices]) => !Array.isArray(indices))
], VertexData, "_FlipFaces", null);

// node_modules/@babylonjs/core/Loading/sceneLoaderFlags.js
var SceneLoaderFlags = class _SceneLoaderFlags {
  /**
   * Gets or sets a boolean indicating if entire scene must be loaded even if scene contains incremental data
   */
  static get ForceFullSceneLoadingForIncremental() {
    return _SceneLoaderFlags._ForceFullSceneLoadingForIncremental;
  }
  static set ForceFullSceneLoadingForIncremental(value) {
    _SceneLoaderFlags._ForceFullSceneLoadingForIncremental = value;
  }
  /**
   * Gets or sets a boolean indicating if loading screen must be displayed while loading a scene
   */
  static get ShowLoadingScreen() {
    return _SceneLoaderFlags._ShowLoadingScreen;
  }
  static set ShowLoadingScreen(value) {
    _SceneLoaderFlags._ShowLoadingScreen = value;
  }
  /**
   * Defines the current logging level (while loading the scene)
   * @ignorenaming
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static get loggingLevel() {
    return _SceneLoaderFlags._LoggingLevel;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static set loggingLevel(value) {
    _SceneLoaderFlags._LoggingLevel = value;
  }
  /**
   * Gets or set a boolean indicating if matrix weights must be cleaned upon loading
   */
  static get CleanBoneMatrixWeights() {
    return _SceneLoaderFlags._CleanBoneMatrixWeights;
  }
  static set CleanBoneMatrixWeights(value) {
    _SceneLoaderFlags._CleanBoneMatrixWeights = value;
  }
};
SceneLoaderFlags._ForceFullSceneLoadingForIncremental = false;
SceneLoaderFlags._ShowLoadingScreen = true;
SceneLoaderFlags._CleanBoneMatrixWeights = false;
SceneLoaderFlags._LoggingLevel = 0;

// node_modules/@babylonjs/core/Meshes/geometry.js
var Geometry = class _Geometry {
  /**
   *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
   */
  get boundingBias() {
    return this._boundingBias;
  }
  /**
   *  Gets or sets the Bias Vector to apply on the bounding elements (box/sphere), the max extend is computed as v += v * bias.x + bias.y, the min is computed as v -= v * bias.x + bias.y
   */
  set boundingBias(value) {
    if (this._boundingBias) {
      this._boundingBias.copyFrom(value);
    } else {
      this._boundingBias = value.clone();
    }
    this._updateBoundingInfo(true, null);
  }
  /**
   * Static function used to attach a new empty geometry to a mesh
   * @param mesh defines the mesh to attach the geometry to
   * @returns the new Geometry
   */
  static CreateGeometryForMesh(mesh) {
    const geometry = new _Geometry(_Geometry.RandomId(), mesh.getScene());
    geometry.applyToMesh(mesh);
    return geometry;
  }
  /** Get the list of meshes using this geometry */
  get meshes() {
    return this._meshes;
  }
  /**
   * Creates a new geometry
   * @param id defines the unique ID
   * @param scene defines the hosting scene
   * @param vertexData defines the VertexData used to get geometry data
   * @param updatable defines if geometry must be updatable (false by default)
   * @param mesh defines the mesh that will be associated with the geometry
   */
  constructor(id, scene, vertexData, updatable = false, mesh = null) {
    this.delayLoadState = 0;
    this._totalVertices = 0;
    this._isDisposed = false;
    this._indexBufferIsUpdatable = false;
    this._positionsCache = [];
    this._parentContainer = null;
    this.useBoundingInfoFromGeometry = false;
    this._scene = scene || EngineStore.LastCreatedScene;
    if (!this._scene) {
      return;
    }
    this.id = id;
    this.uniqueId = this._scene.getUniqueId();
    this._engine = this._scene.getEngine();
    this._meshes = [];
    this._vertexBuffers = {};
    this._indices = [];
    this._updatable = updatable;
    if (vertexData) {
      this.setAllVerticesData(vertexData, updatable);
    } else {
      this._totalVertices = 0;
    }
    if (this._engine.getCaps().vertexArrayObject) {
      this._vertexArrayObjects = {};
    }
    if (mesh) {
      this.applyToMesh(mesh);
      mesh.computeWorldMatrix(true);
    }
  }
  /**
   * Gets the current extend of the geometry
   */
  get extend() {
    return this._extend;
  }
  /**
   * Gets the hosting scene
   * @returns the hosting Scene
   */
  getScene() {
    return this._scene;
  }
  /**
   * Gets the hosting engine
   * @returns the hosting Engine
   */
  getEngine() {
    return this._engine;
  }
  /**
   * Defines if the geometry is ready to use
   * @returns true if the geometry is ready to be used
   */
  isReady() {
    return this.delayLoadState === 1 || this.delayLoadState === 0;
  }
  /**
   * Gets a value indicating that the geometry should not be serialized
   */
  get doNotSerialize() {
    for (let index = 0; index < this._meshes.length; index++) {
      if (!this._meshes[index].doNotSerialize) {
        return false;
      }
    }
    return true;
  }
  /** @internal */
  _rebuild() {
    if (this._vertexArrayObjects) {
      this._vertexArrayObjects = {};
    }
    if (this._meshes.length !== 0 && this._indices) {
      this._indexBuffer = this._engine.createIndexBuffer(this._indices, this._updatable);
    }
    for (const key in this._vertexBuffers) {
      const vertexBuffer = this._vertexBuffers[key];
      vertexBuffer._rebuild();
    }
  }
  /**
   * Affects all geometry data in one call
   * @param vertexData defines the geometry data
   * @param updatable defines if the geometry must be flagged as updatable (false as default)
   */
  setAllVerticesData(vertexData, updatable) {
    vertexData.applyToGeometry(this, updatable);
    this._notifyUpdate();
  }
  /**
   * Set specific vertex data
   * @param kind defines the data kind (Position, normal, etc...)
   * @param data defines the vertex data to use
   * @param updatable defines if the vertex must be flagged as updatable (false as default)
   * @param stride defines the stride to use (0 by default). This value is deduced from the kind value if not specified
   */
  setVerticesData(kind, data, updatable = false, stride) {
    if (updatable && Array.isArray(data)) {
      data = new Float32Array(data);
    }
    const buffer = new VertexBuffer(this._engine, data, kind, {
      updatable,
      postponeInternalCreation: this._meshes.length === 0,
      stride,
      label: "Geometry_" + this.id + "_" + kind
    });
    this.setVerticesBuffer(buffer);
  }
  /**
   * Removes a specific vertex data
   * @param kind defines the data kind (Position, normal, etc...)
   */
  removeVerticesData(kind) {
    if (this._vertexBuffers[kind]) {
      this._vertexBuffers[kind].dispose();
      delete this._vertexBuffers[kind];
    }
    if (this._vertexArrayObjects) {
      this._disposeVertexArrayObjects();
    }
  }
  /**
   * Affect a vertex buffer to the geometry. the vertexBuffer.getKind() function is used to determine where to store the data
   * @param buffer defines the vertex buffer to use
   * @param totalVertices defines the total number of vertices for position kind (could be null)
   * @param disposeExistingBuffer disposes the existing buffer, if any (default: true)
   */
  setVerticesBuffer(buffer, totalVertices = null, disposeExistingBuffer = true) {
    const kind = buffer.getKind();
    if (this._vertexBuffers[kind] && disposeExistingBuffer) {
      this._vertexBuffers[kind].dispose();
    }
    if (buffer._buffer) {
      buffer._buffer._increaseReferences();
    }
    this._vertexBuffers[kind] = buffer;
    const meshes = this._meshes;
    const numOfMeshes = meshes.length;
    if (kind === VertexBuffer.PositionKind) {
      this._totalVertices = totalVertices !== null && totalVertices !== void 0 ? totalVertices : buffer.totalVertices;
      this._updateExtend(buffer.getFloatData());
      this._resetPointsArrayCache();
      const minimum = this._extend && this._extend.minimum || new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
      const maximum = this._extend && this._extend.maximum || new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
      for (let index = 0; index < numOfMeshes; index++) {
        const mesh = meshes[index];
        mesh.buildBoundingInfo(minimum, maximum);
        mesh._createGlobalSubMesh(mesh.isUnIndexed);
        mesh.computeWorldMatrix(true);
        mesh.synchronizeInstances();
      }
    }
    this._notifyUpdate(kind);
  }
  /**
   * Update a specific vertex buffer
   * This function will directly update the underlying DataBuffer according to the passed numeric array or Float32Array
   * It will do nothing if the buffer is not updatable
   * @param kind defines the data kind (Position, normal, etc...)
   * @param data defines the data to use
   * @param offset defines the offset in the target buffer where to store the data
   * @param useBytes set to true if the offset is in bytes
   */
  updateVerticesDataDirectly(kind, data, offset, useBytes = false) {
    const vertexBuffer = this.getVertexBuffer(kind);
    if (!vertexBuffer) {
      return;
    }
    vertexBuffer.updateDirectly(data, offset, useBytes);
    this._notifyUpdate(kind);
  }
  /**
   * Update a specific vertex buffer
   * This function will create a new buffer if the current one is not updatable
   * @param kind defines the data kind (Position, normal, etc...)
   * @param data defines the data to use
   * @param updateExtends defines if the geometry extends must be recomputed (false by default)
   */
  updateVerticesData(kind, data, updateExtends = false) {
    const vertexBuffer = this.getVertexBuffer(kind);
    if (!vertexBuffer) {
      return;
    }
    vertexBuffer.update(data);
    if (kind === VertexBuffer.PositionKind) {
      this._updateBoundingInfo(updateExtends, data);
    }
    this._notifyUpdate(kind);
  }
  _updateBoundingInfo(updateExtends, data) {
    if (updateExtends) {
      this._updateExtend(data);
    }
    this._resetPointsArrayCache();
    if (updateExtends) {
      const meshes = this._meshes;
      for (const mesh of meshes) {
        if (mesh.hasBoundingInfo) {
          mesh.getBoundingInfo().reConstruct(this._extend.minimum, this._extend.maximum);
        } else {
          mesh.buildBoundingInfo(this._extend.minimum, this._extend.maximum);
        }
        const subMeshes = mesh.subMeshes;
        for (const subMesh of subMeshes) {
          subMesh.refreshBoundingInfo();
        }
      }
    }
  }
  /**
   * @internal
   */
  _bind(effect, indexToBind, overrideVertexBuffers, overrideVertexArrayObjects) {
    if (!effect) {
      return;
    }
    if (indexToBind === void 0) {
      indexToBind = this._indexBuffer;
    }
    const vbs = this.getVertexBuffers();
    if (!vbs) {
      return;
    }
    if (indexToBind != this._indexBuffer || !this._vertexArrayObjects && !overrideVertexArrayObjects) {
      this._engine.bindBuffers(vbs, indexToBind, effect, overrideVertexBuffers);
      return;
    }
    const vaos = overrideVertexArrayObjects ? overrideVertexArrayObjects : this._vertexArrayObjects;
    if (!vaos[effect.key]) {
      vaos[effect.key] = this._engine.recordVertexArrayObject(vbs, indexToBind, effect, overrideVertexBuffers);
    }
    this._engine.bindVertexArrayObject(vaos[effect.key], indexToBind);
  }
  /**
   * Gets total number of vertices
   * @returns the total number of vertices
   */
  getTotalVertices() {
    if (!this.isReady()) {
      return 0;
    }
    return this._totalVertices;
  }
  /**
   * Gets a specific vertex data attached to this geometry. Float data is constructed if the vertex buffer data cannot be returned directly.
   * @param kind defines the data kind (Position, normal, etc...)
   * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns a float array containing vertex data
   */
  getVerticesData(kind, copyWhenShared, forceCopy) {
    const vertexBuffer = this.getVertexBuffer(kind);
    if (!vertexBuffer) {
      return null;
    }
    return vertexBuffer.getFloatData(this._totalVertices, forceCopy || copyWhenShared && this._meshes.length !== 1);
  }
  /**
   * Returns a boolean defining if the vertex data for the requested `kind` is updatable
   * @param kind defines the data kind (Position, normal, etc...)
   * @returns true if the vertex buffer with the specified kind is updatable
   */
  isVertexBufferUpdatable(kind) {
    const vb = this._vertexBuffers[kind];
    if (!vb) {
      return false;
    }
    return vb.isUpdatable();
  }
  /**
   * Gets a specific vertex buffer
   * @param kind defines the data kind (Position, normal, etc...)
   * @returns a VertexBuffer
   */
  getVertexBuffer(kind) {
    if (!this.isReady()) {
      return null;
    }
    return this._vertexBuffers[kind];
  }
  /**
   * Returns all vertex buffers
   * @returns an object holding all vertex buffers indexed by kind
   */
  getVertexBuffers() {
    if (!this.isReady()) {
      return null;
    }
    return this._vertexBuffers;
  }
  /**
   * Gets a boolean indicating if specific vertex buffer is present
   * @param kind defines the data kind (Position, normal, etc...)
   * @returns true if data is present
   */
  isVerticesDataPresent(kind) {
    if (!this._vertexBuffers) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    return this._vertexBuffers[kind] !== void 0;
  }
  /**
   * Gets a list of all attached data kinds (Position, normal, etc...)
   * @returns a list of string containing all kinds
   */
  getVerticesDataKinds() {
    const result = [];
    let kind;
    if (!this._vertexBuffers && this._delayInfo) {
      for (kind in this._delayInfo) {
        result.push(kind);
      }
    } else {
      for (kind in this._vertexBuffers) {
        result.push(kind);
      }
    }
    return result;
  }
  /**
   * Update index buffer
   * @param indices defines the indices to store in the index buffer
   * @param offset defines the offset in the target buffer where to store the data
   * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
   */
  updateIndices(indices, offset, gpuMemoryOnly = false) {
    if (!this._indexBuffer) {
      return;
    }
    if (!this._indexBufferIsUpdatable) {
      this.setIndices(indices, null, true);
    } else {
      const needToUpdateSubMeshes = indices.length !== this._indices.length;
      if (!gpuMemoryOnly) {
        this._indices = indices.slice();
      }
      this._engine.updateDynamicIndexBuffer(this._indexBuffer, indices, offset);
      if (needToUpdateSubMeshes) {
        for (const mesh of this._meshes) {
          mesh._createGlobalSubMesh(true);
        }
      }
    }
  }
  /**
   * Sets the index buffer for this geometry.
   * @param indexBuffer Defines the index buffer to use for this geometry
   * @param totalVertices Defines the total number of vertices used by the buffer
   * @param totalIndices Defines the total number of indices in the index buffer
   */
  setIndexBuffer(indexBuffer, totalVertices, totalIndices) {
    this._indices = [];
    this._indexBufferIsUpdatable = false;
    this._indexBuffer = indexBuffer;
    this._totalVertices = totalVertices;
    this._totalIndices = totalIndices;
    indexBuffer.is32Bits || (indexBuffer.is32Bits = this._totalIndices > 65535);
    for (const mesh of this._meshes) {
      mesh._createGlobalSubMesh(true);
      mesh.synchronizeInstances();
    }
    this._notifyUpdate();
  }
  /**
   * Creates a new index buffer
   * @param indices defines the indices to store in the index buffer
   * @param totalVertices defines the total number of vertices (could be null)
   * @param updatable defines if the index buffer must be flagged as updatable (false by default)
   */
  setIndices(indices, totalVertices = null, updatable = false) {
    if (this._indexBuffer) {
      this._engine._releaseBuffer(this._indexBuffer);
    }
    this._indices = indices;
    this._indexBufferIsUpdatable = updatable;
    if (this._meshes.length !== 0 && this._indices) {
      this._indexBuffer = this._engine.createIndexBuffer(this._indices, updatable);
    }
    if (totalVertices != void 0) {
      this._totalVertices = totalVertices;
    }
    for (const mesh of this._meshes) {
      mesh._createGlobalSubMesh(true);
      mesh.synchronizeInstances();
    }
    this._notifyUpdate();
  }
  /**
   * Return the total number of indices
   * @returns the total number of indices
   */
  getTotalIndices() {
    if (!this.isReady()) {
      return 0;
    }
    return this._totalIndices !== void 0 ? this._totalIndices : this._indices.length;
  }
  /**
   * Gets the index buffer array
   * @param copyWhenShared defines if the returned array must be cloned upon returning it if the current geometry is shared between multiple meshes
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns the index buffer array
   */
  getIndices(copyWhenShared, forceCopy) {
    if (!this.isReady()) {
      return null;
    }
    const orig = this._indices;
    if (!forceCopy && (!copyWhenShared || this._meshes.length === 1)) {
      return orig;
    } else {
      return orig.slice();
    }
  }
  /**
   * Gets the index buffer
   * @returns the index buffer
   */
  getIndexBuffer() {
    if (!this.isReady()) {
      return null;
    }
    return this._indexBuffer;
  }
  /**
   * @internal
   */
  _releaseVertexArrayObject(effect = null) {
    if (!effect || !this._vertexArrayObjects) {
      return;
    }
    if (this._vertexArrayObjects[effect.key]) {
      this._engine.releaseVertexArrayObject(this._vertexArrayObjects[effect.key]);
      delete this._vertexArrayObjects[effect.key];
    }
  }
  /**
   * Release the associated resources for a specific mesh
   * @param mesh defines the source mesh
   * @param shouldDispose defines if the geometry must be disposed if there is no more mesh pointing to it
   */
  releaseForMesh(mesh, shouldDispose) {
    const meshes = this._meshes;
    const index = meshes.indexOf(mesh);
    if (index === -1) {
      return;
    }
    meshes.splice(index, 1);
    if (this._vertexArrayObjects) {
      mesh._invalidateInstanceVertexArrayObject();
    }
    mesh._geometry = null;
    if (meshes.length === 0 && shouldDispose) {
      this.dispose();
    }
  }
  /**
   * Apply current geometry to a given mesh
   * @param mesh defines the mesh to apply geometry to
   */
  applyToMesh(mesh) {
    if (mesh._geometry === this) {
      return;
    }
    const previousGeometry = mesh._geometry;
    if (previousGeometry) {
      previousGeometry.releaseForMesh(mesh);
    }
    if (this._vertexArrayObjects) {
      mesh._invalidateInstanceVertexArrayObject();
    }
    const meshes = this._meshes;
    mesh._geometry = this;
    mesh._internalAbstractMeshDataInfo._positions = null;
    this._scene.pushGeometry(this);
    meshes.push(mesh);
    if (this.isReady()) {
      this._applyToMesh(mesh);
    } else if (this._boundingInfo) {
      mesh.setBoundingInfo(this._boundingInfo);
    }
  }
  _updateExtend(data = null) {
    if (this.useBoundingInfoFromGeometry && this._boundingInfo) {
      this._extend = {
        minimum: this._boundingInfo.minimum.clone(),
        maximum: this._boundingInfo.maximum.clone()
      };
    } else {
      if (!data) {
        data = this.getVerticesData(VertexBuffer.PositionKind);
        if (!data) {
          return;
        }
      }
      this._extend = extractMinAndMax(data, 0, this._totalVertices, this.boundingBias, 3);
    }
  }
  _applyToMesh(mesh) {
    const numOfMeshes = this._meshes.length;
    for (const kind in this._vertexBuffers) {
      if (numOfMeshes === 1) {
        this._vertexBuffers[kind].create();
      }
      if (kind === VertexBuffer.PositionKind) {
        if (!this._extend) {
          this._updateExtend();
        }
        mesh.buildBoundingInfo(this._extend.minimum, this._extend.maximum);
        mesh._createGlobalSubMesh(mesh.isUnIndexed);
        mesh._updateBoundingInfo();
      }
    }
    if (numOfMeshes === 1 && this._indices && this._indices.length > 0) {
      this._indexBuffer = this._engine.createIndexBuffer(this._indices, this._updatable);
    }
    mesh._syncGeometryWithMorphTargetManager();
    mesh.synchronizeInstances();
  }
  _notifyUpdate(kind) {
    if (this.onGeometryUpdated) {
      this.onGeometryUpdated(this, kind);
    }
    if (this._vertexArrayObjects) {
      this._disposeVertexArrayObjects();
    }
    for (const mesh of this._meshes) {
      mesh._markSubMeshesAsAttributesDirty();
    }
  }
  /**
   * Load the geometry if it was flagged as delay loaded
   * @param scene defines the hosting scene
   * @param onLoaded defines a callback called when the geometry is loaded
   */
  load(scene, onLoaded) {
    if (this.delayLoadState === 2) {
      return;
    }
    if (this.isReady()) {
      if (onLoaded) {
        onLoaded();
      }
      return;
    }
    this.delayLoadState = 2;
    this._queueLoad(scene, onLoaded);
  }
  _queueLoad(scene, onLoaded) {
    if (!this.delayLoadingFile) {
      return;
    }
    scene.addPendingData(this);
    scene._loadFile(this.delayLoadingFile, (data) => {
      if (!this._delayLoadingFunction) {
        return;
      }
      this._delayLoadingFunction(JSON.parse(data), this);
      this.delayLoadState = 1;
      this._delayInfo = [];
      scene.removePendingData(this);
      const meshes = this._meshes;
      const numOfMeshes = meshes.length;
      for (let index = 0; index < numOfMeshes; index++) {
        this._applyToMesh(meshes[index]);
      }
      if (onLoaded) {
        onLoaded();
      }
    }, void 0, true);
  }
  /**
   * Invert the geometry to move from a right handed system to a left handed one.
   */
  toLeftHanded() {
    const tIndices = this.getIndices(false);
    if (tIndices != null && tIndices.length > 0) {
      for (let i = 0; i < tIndices.length; i += 3) {
        const tTemp = tIndices[i + 0];
        tIndices[i + 0] = tIndices[i + 2];
        tIndices[i + 2] = tTemp;
      }
      this.setIndices(tIndices);
    }
    const tPositions = this.getVerticesData(VertexBuffer.PositionKind, false);
    if (tPositions != null && tPositions.length > 0) {
      for (let i = 0; i < tPositions.length; i += 3) {
        tPositions[i + 2] = -tPositions[i + 2];
      }
      this.setVerticesData(VertexBuffer.PositionKind, tPositions, false);
    }
    const tNormals = this.getVerticesData(VertexBuffer.NormalKind, false);
    if (tNormals != null && tNormals.length > 0) {
      for (let i = 0; i < tNormals.length; i += 3) {
        tNormals[i + 2] = -tNormals[i + 2];
      }
      this.setVerticesData(VertexBuffer.NormalKind, tNormals, false);
    }
  }
  // Cache
  /** @internal */
  _resetPointsArrayCache() {
    this._positions = null;
  }
  /** @internal */
  _generatePointsArray() {
    if (this._positions) {
      return true;
    }
    const data = this.getVerticesData(VertexBuffer.PositionKind);
    if (!data || data.length === 0) {
      return false;
    }
    for (let index = this._positionsCache.length * 3, arrayIdx = this._positionsCache.length; index < data.length; index += 3, ++arrayIdx) {
      this._positionsCache[arrayIdx] = Vector3.FromArray(data, index);
    }
    for (let index = 0, arrayIdx = 0; index < data.length; index += 3, ++arrayIdx) {
      this._positionsCache[arrayIdx].set(data[0 + index], data[1 + index], data[2 + index]);
    }
    this._positionsCache.length = data.length / 3;
    this._positions = this._positionsCache;
    return true;
  }
  /**
   * Gets a value indicating if the geometry is disposed
   * @returns true if the geometry was disposed
   */
  isDisposed() {
    return this._isDisposed;
  }
  _disposeVertexArrayObjects() {
    if (this._vertexArrayObjects) {
      for (const kind in this._vertexArrayObjects) {
        this._engine.releaseVertexArrayObject(this._vertexArrayObjects[kind]);
      }
      this._vertexArrayObjects = {};
      const meshes = this._meshes;
      const numOfMeshes = meshes.length;
      for (let index = 0; index < numOfMeshes; index++) {
        meshes[index]._invalidateInstanceVertexArrayObject();
      }
    }
  }
  /**
   * Free all associated resources
   */
  dispose() {
    const meshes = this._meshes;
    const numOfMeshes = meshes.length;
    let index;
    for (index = 0; index < numOfMeshes; index++) {
      this.releaseForMesh(meshes[index]);
    }
    this._meshes.length = 0;
    this._disposeVertexArrayObjects();
    for (const kind in this._vertexBuffers) {
      this._vertexBuffers[kind].dispose();
    }
    this._vertexBuffers = {};
    this._totalVertices = 0;
    if (this._indexBuffer) {
      this._engine._releaseBuffer(this._indexBuffer);
    }
    this._indexBuffer = null;
    this._indices = [];
    this.delayLoadState = 0;
    this.delayLoadingFile = null;
    this._delayLoadingFunction = null;
    this._delayInfo = [];
    this._boundingInfo = null;
    this._scene.removeGeometry(this);
    if (this._parentContainer) {
      const index2 = this._parentContainer.geometries.indexOf(this);
      if (index2 > -1) {
        this._parentContainer.geometries.splice(index2, 1);
      }
      this._parentContainer = null;
    }
    this._isDisposed = true;
  }
  /**
   * Clone the current geometry into a new geometry
   * @param id defines the unique ID of the new geometry
   * @returns a new geometry object
   */
  copy(id) {
    const vertexData = new VertexData();
    vertexData.indices = [];
    const indices = this.getIndices();
    if (indices) {
      for (let index = 0; index < indices.length; index++) {
        vertexData.indices.push(indices[index]);
      }
    }
    let updatable = false;
    let stopChecking = false;
    let kind;
    for (kind in this._vertexBuffers) {
      const data = this.getVerticesData(kind);
      if (data) {
        if (data instanceof Float32Array) {
          vertexData.set(new Float32Array(data), kind);
        } else {
          vertexData.set(data.slice(0), kind);
        }
        if (!stopChecking) {
          const vb = this.getVertexBuffer(kind);
          if (vb) {
            updatable = vb.isUpdatable();
            stopChecking = !updatable;
          }
        }
      }
    }
    const geometry = new _Geometry(id, this._scene, vertexData, updatable);
    geometry.delayLoadState = this.delayLoadState;
    geometry.delayLoadingFile = this.delayLoadingFile;
    geometry._delayLoadingFunction = this._delayLoadingFunction;
    for (kind in this._delayInfo) {
      geometry._delayInfo = geometry._delayInfo || [];
      geometry._delayInfo.push(kind);
    }
    geometry._boundingInfo = new BoundingInfo(this._extend.minimum, this._extend.maximum);
    return geometry;
  }
  /**
   * Serialize the current geometry info (and not the vertices data) into a JSON object
   * @returns a JSON representation of the current geometry data (without the vertices data)
   */
  serialize() {
    const serializationObject = {};
    serializationObject.id = this.id;
    serializationObject.uniqueId = this.uniqueId;
    serializationObject.updatable = this._updatable;
    if (Tags && Tags.HasTags(this)) {
      serializationObject.tags = Tags.GetTags(this);
    }
    return serializationObject;
  }
  _toNumberArray(origin) {
    if (Array.isArray(origin)) {
      return origin;
    } else {
      return Array.prototype.slice.call(origin);
    }
  }
  /**
   * Release any memory retained by the cached data on the Geometry.
   *
   * Call this function to reduce memory footprint of the mesh.
   * Vertex buffers will not store CPU data anymore (this will prevent picking, collisions or physics to work correctly)
   */
  clearCachedData() {
    this._indices = [];
    this._resetPointsArrayCache();
    for (const vbName in this._vertexBuffers) {
      if (!Object.prototype.hasOwnProperty.call(this._vertexBuffers, vbName)) {
        continue;
      }
      this._vertexBuffers[vbName]._buffer._data = null;
    }
  }
  /**
   * Serialize all vertices data into a JSON object
   * @returns a JSON representation of the current geometry data
   */
  serializeVerticeData() {
    const serializationObject = this.serialize();
    if (this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      serializationObject.positions = this._toNumberArray(this.getVerticesData(VertexBuffer.PositionKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.PositionKind)) {
        serializationObject.positions._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      serializationObject.normals = this._toNumberArray(this.getVerticesData(VertexBuffer.NormalKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.NormalKind)) {
        serializationObject.normals._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.TangentKind)) {
      serializationObject.tangents = this._toNumberArray(this.getVerticesData(VertexBuffer.TangentKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.TangentKind)) {
        serializationObject.tangents._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.UVKind)) {
      serializationObject.uvs = this._toNumberArray(this.getVerticesData(VertexBuffer.UVKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UVKind)) {
        serializationObject.uvs._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.UV2Kind)) {
      serializationObject.uvs2 = this._toNumberArray(this.getVerticesData(VertexBuffer.UV2Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV2Kind)) {
        serializationObject.uvs2._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.UV3Kind)) {
      serializationObject.uvs3 = this._toNumberArray(this.getVerticesData(VertexBuffer.UV3Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV3Kind)) {
        serializationObject.uvs3._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.UV4Kind)) {
      serializationObject.uvs4 = this._toNumberArray(this.getVerticesData(VertexBuffer.UV4Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV4Kind)) {
        serializationObject.uvs4._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.UV5Kind)) {
      serializationObject.uvs5 = this._toNumberArray(this.getVerticesData(VertexBuffer.UV5Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV5Kind)) {
        serializationObject.uvs5._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.UV6Kind)) {
      serializationObject.uvs6 = this._toNumberArray(this.getVerticesData(VertexBuffer.UV6Kind));
      if (this.isVertexBufferUpdatable(VertexBuffer.UV6Kind)) {
        serializationObject.uvs6._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.ColorKind)) {
      serializationObject.colors = this._toNumberArray(this.getVerticesData(VertexBuffer.ColorKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.ColorKind)) {
        serializationObject.colors._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
      serializationObject.matricesIndices = this._toNumberArray(this.getVerticesData(VertexBuffer.MatricesIndicesKind));
      serializationObject.matricesIndices._isExpanded = true;
      if (this.isVertexBufferUpdatable(VertexBuffer.MatricesIndicesKind)) {
        serializationObject.matricesIndices._updatable = true;
      }
    }
    if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      serializationObject.matricesWeights = this._toNumberArray(this.getVerticesData(VertexBuffer.MatricesWeightsKind));
      if (this.isVertexBufferUpdatable(VertexBuffer.MatricesWeightsKind)) {
        serializationObject.matricesWeights._updatable = true;
      }
    }
    serializationObject.indices = this._toNumberArray(this.getIndices());
    return serializationObject;
  }
  // Statics
  /**
   * Extracts a clone of a mesh geometry
   * @param mesh defines the source mesh
   * @param id defines the unique ID of the new geometry object
   * @returns the new geometry object
   */
  static ExtractFromMesh(mesh, id) {
    const geometry = mesh._geometry;
    if (!geometry) {
      return null;
    }
    return geometry.copy(id);
  }
  /**
   * You should now use Tools.RandomId(), this method is still here for legacy reasons.
   * Implementation from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#answer-2117523
   * Be aware Math.random() could cause collisions, but:
   * "All but 6 of the 128 bits of the ID are randomly generated, which means that for any two ids, there's a 1 in 2^^122 (or 5.3x10^^36) chance they'll collide"
   * @returns a string containing a new GUID
   */
  static RandomId() {
    return Tools.RandomId();
  }
  static _GetGeometryByLoadedUniqueId(uniqueId, scene) {
    for (let index = 0; index < scene.geometries.length; index++) {
      if (scene.geometries[index]._loadedUniqueId === uniqueId) {
        return scene.geometries[index];
      }
    }
    return null;
  }
  /**
   * @internal
   */
  static _ImportGeometry(parsedGeometry, mesh) {
    const scene = mesh.getScene();
    const geometryUniqueId = parsedGeometry.geometryUniqueId;
    const geometryId = parsedGeometry.geometryId;
    if (geometryUniqueId || geometryId) {
      const geometry = geometryUniqueId ? this._GetGeometryByLoadedUniqueId(geometryUniqueId, scene) : scene.getGeometryById(geometryId);
      if (geometry) {
        geometry.applyToMesh(mesh);
      }
    } else if (parsedGeometry instanceof ArrayBuffer) {
      const binaryInfo = mesh._binaryInfo;
      if (binaryInfo.positionsAttrDesc && binaryInfo.positionsAttrDesc.count > 0) {
        const positionsData = new Float32Array(parsedGeometry, binaryInfo.positionsAttrDesc.offset, binaryInfo.positionsAttrDesc.count);
        mesh.setVerticesData(VertexBuffer.PositionKind, positionsData, false);
      }
      if (binaryInfo.normalsAttrDesc && binaryInfo.normalsAttrDesc.count > 0) {
        const normalsData = new Float32Array(parsedGeometry, binaryInfo.normalsAttrDesc.offset, binaryInfo.normalsAttrDesc.count);
        mesh.setVerticesData(VertexBuffer.NormalKind, normalsData, false);
      }
      if (binaryInfo.tangetsAttrDesc && binaryInfo.tangetsAttrDesc.count > 0) {
        const tangentsData = new Float32Array(parsedGeometry, binaryInfo.tangetsAttrDesc.offset, binaryInfo.tangetsAttrDesc.count);
        mesh.setVerticesData(VertexBuffer.TangentKind, tangentsData, false);
      }
      if (binaryInfo.uvsAttrDesc && binaryInfo.uvsAttrDesc.count > 0) {
        const uvsData = new Float32Array(parsedGeometry, binaryInfo.uvsAttrDesc.offset, binaryInfo.uvsAttrDesc.count);
        if (CompatibilityOptions.UseOpenGLOrientationForUV) {
          for (let index = 1; index < uvsData.length; index += 2) {
            uvsData[index] = 1 - uvsData[index];
          }
        }
        mesh.setVerticesData(VertexBuffer.UVKind, uvsData, false);
      }
      if (binaryInfo.uvs2AttrDesc && binaryInfo.uvs2AttrDesc.count > 0) {
        const uvs2Data = new Float32Array(parsedGeometry, binaryInfo.uvs2AttrDesc.offset, binaryInfo.uvs2AttrDesc.count);
        if (CompatibilityOptions.UseOpenGLOrientationForUV) {
          for (let index = 1; index < uvs2Data.length; index += 2) {
            uvs2Data[index] = 1 - uvs2Data[index];
          }
        }
        mesh.setVerticesData(VertexBuffer.UV2Kind, uvs2Data, false);
      }
      if (binaryInfo.uvs3AttrDesc && binaryInfo.uvs3AttrDesc.count > 0) {
        const uvs3Data = new Float32Array(parsedGeometry, binaryInfo.uvs3AttrDesc.offset, binaryInfo.uvs3AttrDesc.count);
        if (CompatibilityOptions.UseOpenGLOrientationForUV) {
          for (let index = 1; index < uvs3Data.length; index += 2) {
            uvs3Data[index] = 1 - uvs3Data[index];
          }
        }
        mesh.setVerticesData(VertexBuffer.UV3Kind, uvs3Data, false);
      }
      if (binaryInfo.uvs4AttrDesc && binaryInfo.uvs4AttrDesc.count > 0) {
        const uvs4Data = new Float32Array(parsedGeometry, binaryInfo.uvs4AttrDesc.offset, binaryInfo.uvs4AttrDesc.count);
        if (CompatibilityOptions.UseOpenGLOrientationForUV) {
          for (let index = 1; index < uvs4Data.length; index += 2) {
            uvs4Data[index] = 1 - uvs4Data[index];
          }
        }
        mesh.setVerticesData(VertexBuffer.UV4Kind, uvs4Data, false);
      }
      if (binaryInfo.uvs5AttrDesc && binaryInfo.uvs5AttrDesc.count > 0) {
        const uvs5Data = new Float32Array(parsedGeometry, binaryInfo.uvs5AttrDesc.offset, binaryInfo.uvs5AttrDesc.count);
        if (CompatibilityOptions.UseOpenGLOrientationForUV) {
          for (let index = 1; index < uvs5Data.length; index += 2) {
            uvs5Data[index] = 1 - uvs5Data[index];
          }
        }
        mesh.setVerticesData(VertexBuffer.UV5Kind, uvs5Data, false);
      }
      if (binaryInfo.uvs6AttrDesc && binaryInfo.uvs6AttrDesc.count > 0) {
        const uvs6Data = new Float32Array(parsedGeometry, binaryInfo.uvs6AttrDesc.offset, binaryInfo.uvs6AttrDesc.count);
        if (CompatibilityOptions.UseOpenGLOrientationForUV) {
          for (let index = 1; index < uvs6Data.length; index += 2) {
            uvs6Data[index] = 1 - uvs6Data[index];
          }
        }
        mesh.setVerticesData(VertexBuffer.UV6Kind, uvs6Data, false);
      }
      if (binaryInfo.colorsAttrDesc && binaryInfo.colorsAttrDesc.count > 0) {
        const colorsData = new Float32Array(parsedGeometry, binaryInfo.colorsAttrDesc.offset, binaryInfo.colorsAttrDesc.count);
        mesh.setVerticesData(VertexBuffer.ColorKind, colorsData, false, binaryInfo.colorsAttrDesc.stride);
      }
      if (binaryInfo.matricesIndicesAttrDesc && binaryInfo.matricesIndicesAttrDesc.count > 0) {
        const matricesIndicesData = new Int32Array(parsedGeometry, binaryInfo.matricesIndicesAttrDesc.offset, binaryInfo.matricesIndicesAttrDesc.count);
        const floatIndices = [];
        for (let i = 0; i < matricesIndicesData.length; i++) {
          const index = matricesIndicesData[i];
          floatIndices.push(index & 255);
          floatIndices.push((index & 65280) >> 8);
          floatIndices.push((index & 16711680) >> 16);
          floatIndices.push(index >> 24 & 255);
        }
        mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, floatIndices, false);
      }
      if (binaryInfo.matricesIndicesExtraAttrDesc && binaryInfo.matricesIndicesExtraAttrDesc.count > 0) {
        const matricesIndicesData = new Int32Array(parsedGeometry, binaryInfo.matricesIndicesExtraAttrDesc.offset, binaryInfo.matricesIndicesExtraAttrDesc.count);
        const floatIndices = [];
        for (let i = 0; i < matricesIndicesData.length; i++) {
          const index = matricesIndicesData[i];
          floatIndices.push(index & 255);
          floatIndices.push((index & 65280) >> 8);
          floatIndices.push((index & 16711680) >> 16);
          floatIndices.push(index >> 24 & 255);
        }
        mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, floatIndices, false);
      }
      if (binaryInfo.matricesWeightsAttrDesc && binaryInfo.matricesWeightsAttrDesc.count > 0) {
        const matricesWeightsData = new Float32Array(parsedGeometry, binaryInfo.matricesWeightsAttrDesc.offset, binaryInfo.matricesWeightsAttrDesc.count);
        mesh.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeightsData, false);
      }
      if (binaryInfo.indicesAttrDesc && binaryInfo.indicesAttrDesc.count > 0) {
        const indicesData = new Int32Array(parsedGeometry, binaryInfo.indicesAttrDesc.offset, binaryInfo.indicesAttrDesc.count);
        mesh.setIndices(indicesData, null);
      }
      if (binaryInfo.subMeshesAttrDesc && binaryInfo.subMeshesAttrDesc.count > 0) {
        const subMeshesData = new Int32Array(parsedGeometry, binaryInfo.subMeshesAttrDesc.offset, binaryInfo.subMeshesAttrDesc.count * 5);
        mesh.subMeshes = [];
        for (let i = 0; i < binaryInfo.subMeshesAttrDesc.count; i++) {
          const materialIndex = subMeshesData[i * 5 + 0];
          const verticesStart = subMeshesData[i * 5 + 1];
          const verticesCount = subMeshesData[i * 5 + 2];
          const indexStart = subMeshesData[i * 5 + 3];
          const indexCount = subMeshesData[i * 5 + 4];
          SubMesh.AddToMesh(materialIndex, verticesStart, verticesCount, indexStart, indexCount, mesh);
        }
      }
    } else if (parsedGeometry.positions && parsedGeometry.normals && parsedGeometry.indices) {
      mesh.setVerticesData(VertexBuffer.PositionKind, parsedGeometry.positions, parsedGeometry.positions._updatable);
      mesh.setVerticesData(VertexBuffer.NormalKind, parsedGeometry.normals, parsedGeometry.normals._updatable);
      if (parsedGeometry.tangents) {
        mesh.setVerticesData(VertexBuffer.TangentKind, parsedGeometry.tangents, parsedGeometry.tangents._updatable);
      }
      if (parsedGeometry.uvs) {
        mesh.setVerticesData(VertexBuffer.UVKind, parsedGeometry.uvs, parsedGeometry.uvs._updatable);
      }
      if (parsedGeometry.uvs2) {
        mesh.setVerticesData(VertexBuffer.UV2Kind, parsedGeometry.uvs2, parsedGeometry.uvs2._updatable);
      }
      if (parsedGeometry.uvs3) {
        mesh.setVerticesData(VertexBuffer.UV3Kind, parsedGeometry.uvs3, parsedGeometry.uvs3._updatable);
      }
      if (parsedGeometry.uvs4) {
        mesh.setVerticesData(VertexBuffer.UV4Kind, parsedGeometry.uvs4, parsedGeometry.uvs4._updatable);
      }
      if (parsedGeometry.uvs5) {
        mesh.setVerticesData(VertexBuffer.UV5Kind, parsedGeometry.uvs5, parsedGeometry.uvs5._updatable);
      }
      if (parsedGeometry.uvs6) {
        mesh.setVerticesData(VertexBuffer.UV6Kind, parsedGeometry.uvs6, parsedGeometry.uvs6._updatable);
      }
      if (parsedGeometry.colors) {
        mesh.setVerticesData(VertexBuffer.ColorKind, Color4.CheckColors4(parsedGeometry.colors, parsedGeometry.positions.length / 3), parsedGeometry.colors._updatable);
      }
      if (parsedGeometry.matricesIndices) {
        if (!parsedGeometry.matricesIndices._isExpanded) {
          const floatIndices = [];
          for (let i = 0; i < parsedGeometry.matricesIndices.length; i++) {
            const matricesIndex = parsedGeometry.matricesIndices[i];
            floatIndices.push(matricesIndex & 255);
            floatIndices.push((matricesIndex & 65280) >> 8);
            floatIndices.push((matricesIndex & 16711680) >> 16);
            floatIndices.push(matricesIndex >> 24 & 255);
          }
          mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, floatIndices, parsedGeometry.matricesIndices._updatable);
        } else {
          delete parsedGeometry.matricesIndices._isExpanded;
          mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, parsedGeometry.matricesIndices, parsedGeometry.matricesIndices._updatable);
        }
      }
      if (parsedGeometry.matricesIndicesExtra) {
        if (!parsedGeometry.matricesIndicesExtra._isExpanded) {
          const floatIndices = [];
          for (let i = 0; i < parsedGeometry.matricesIndicesExtra.length; i++) {
            const matricesIndex = parsedGeometry.matricesIndicesExtra[i];
            floatIndices.push(matricesIndex & 255);
            floatIndices.push((matricesIndex & 65280) >> 8);
            floatIndices.push((matricesIndex & 16711680) >> 16);
            floatIndices.push(matricesIndex >> 24 & 255);
          }
          mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, floatIndices, parsedGeometry.matricesIndicesExtra._updatable);
        } else {
          delete parsedGeometry.matricesIndices._isExpanded;
          mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, parsedGeometry.matricesIndicesExtra, parsedGeometry.matricesIndicesExtra._updatable);
        }
      }
      if (parsedGeometry.matricesWeights) {
        _Geometry._CleanMatricesWeights(parsedGeometry, mesh);
        mesh.setVerticesData(VertexBuffer.MatricesWeightsKind, parsedGeometry.matricesWeights, parsedGeometry.matricesWeights._updatable);
      }
      if (parsedGeometry.matricesWeightsExtra) {
        mesh.setVerticesData(VertexBuffer.MatricesWeightsExtraKind, parsedGeometry.matricesWeightsExtra, parsedGeometry.matricesWeights._updatable);
      }
      mesh.setIndices(parsedGeometry.indices, null);
    }
    if (parsedGeometry.subMeshes) {
      mesh.subMeshes = [];
      for (let subIndex = 0; subIndex < parsedGeometry.subMeshes.length; subIndex++) {
        const parsedSubMesh = parsedGeometry.subMeshes[subIndex];
        SubMesh.AddToMesh(parsedSubMesh.materialIndex, parsedSubMesh.verticesStart, parsedSubMesh.verticesCount, parsedSubMesh.indexStart, parsedSubMesh.indexCount, mesh);
      }
    }
    if (mesh._shouldGenerateFlatShading) {
      mesh.convertToFlatShadedMesh();
      mesh._shouldGenerateFlatShading = false;
    }
    mesh.computeWorldMatrix(true);
    scene.onMeshImportedObservable.notifyObservers(mesh);
  }
  static _CleanMatricesWeights(parsedGeometry, mesh) {
    const epsilon = 1e-3;
    if (!SceneLoaderFlags.CleanBoneMatrixWeights) {
      return;
    }
    let noInfluenceBoneIndex = 0;
    if (parsedGeometry.skeletonId > -1) {
      const skeleton = mesh.getScene().getLastSkeletonById(parsedGeometry.skeletonId);
      if (!skeleton) {
        return;
      }
      noInfluenceBoneIndex = skeleton.bones.length;
    } else {
      return;
    }
    const matricesIndices = mesh.getVerticesData(VertexBuffer.MatricesIndicesKind);
    const matricesIndicesExtra = mesh.getVerticesData(VertexBuffer.MatricesIndicesExtraKind);
    const matricesWeights = parsedGeometry.matricesWeights;
    const matricesWeightsExtra = parsedGeometry.matricesWeightsExtra;
    const influencers = parsedGeometry.numBoneInfluencer;
    const size = matricesWeights.length;
    for (let i = 0; i < size; i += 4) {
      let weight = 0;
      let firstZeroWeight = -1;
      for (let j = 0; j < 4; j++) {
        const w = matricesWeights[i + j];
        weight += w;
        if (w < epsilon && firstZeroWeight < 0) {
          firstZeroWeight = j;
        }
      }
      if (matricesWeightsExtra) {
        for (let j = 0; j < 4; j++) {
          const w = matricesWeightsExtra[i + j];
          weight += w;
          if (w < epsilon && firstZeroWeight < 0) {
            firstZeroWeight = j + 4;
          }
        }
      }
      if (firstZeroWeight < 0 || firstZeroWeight > influencers - 1) {
        firstZeroWeight = influencers - 1;
      }
      if (weight > epsilon) {
        const mweight = 1 / weight;
        for (let j = 0; j < 4; j++) {
          matricesWeights[i + j] *= mweight;
        }
        if (matricesWeightsExtra) {
          for (let j = 0; j < 4; j++) {
            matricesWeightsExtra[i + j] *= mweight;
          }
        }
      } else {
        if (firstZeroWeight >= 4) {
          matricesWeightsExtra[i + firstZeroWeight - 4] = 1 - weight;
          matricesIndicesExtra[i + firstZeroWeight - 4] = noInfluenceBoneIndex;
        } else {
          matricesWeights[i + firstZeroWeight] = 1 - weight;
          matricesIndices[i + firstZeroWeight] = noInfluenceBoneIndex;
        }
      }
    }
    mesh.setVerticesData(VertexBuffer.MatricesIndicesKind, matricesIndices);
    if (parsedGeometry.matricesWeightsExtra) {
      mesh.setVerticesData(VertexBuffer.MatricesIndicesExtraKind, matricesIndicesExtra);
    }
  }
  /**
   * Create a new geometry from persisted data (Using .babylon file format)
   * @param parsedVertexData defines the persisted data
   * @param scene defines the hosting scene
   * @param rootUrl defines the root url to use to load assets (like delayed data)
   * @returns the new geometry object
   */
  static Parse(parsedVertexData, scene, rootUrl) {
    const geometry = new _Geometry(parsedVertexData.id, scene, void 0, parsedVertexData.updatable);
    geometry._loadedUniqueId = parsedVertexData.uniqueId;
    if (Tags) {
      Tags.AddTagsTo(geometry, parsedVertexData.tags);
    }
    if (parsedVertexData.delayLoadingFile) {
      geometry.delayLoadState = 4;
      geometry.delayLoadingFile = rootUrl + parsedVertexData.delayLoadingFile;
      geometry._boundingInfo = new BoundingInfo(Vector3.FromArray(parsedVertexData.boundingBoxMinimum), Vector3.FromArray(parsedVertexData.boundingBoxMaximum));
      geometry._delayInfo = [];
      if (parsedVertexData.hasUVs) {
        geometry._delayInfo.push(VertexBuffer.UVKind);
      }
      if (parsedVertexData.hasUVs2) {
        geometry._delayInfo.push(VertexBuffer.UV2Kind);
      }
      if (parsedVertexData.hasUVs3) {
        geometry._delayInfo.push(VertexBuffer.UV3Kind);
      }
      if (parsedVertexData.hasUVs4) {
        geometry._delayInfo.push(VertexBuffer.UV4Kind);
      }
      if (parsedVertexData.hasUVs5) {
        geometry._delayInfo.push(VertexBuffer.UV5Kind);
      }
      if (parsedVertexData.hasUVs6) {
        geometry._delayInfo.push(VertexBuffer.UV6Kind);
      }
      if (parsedVertexData.hasColors) {
        geometry._delayInfo.push(VertexBuffer.ColorKind);
      }
      if (parsedVertexData.hasMatricesIndices) {
        geometry._delayInfo.push(VertexBuffer.MatricesIndicesKind);
      }
      if (parsedVertexData.hasMatricesWeights) {
        geometry._delayInfo.push(VertexBuffer.MatricesWeightsKind);
      }
      geometry._delayLoadingFunction = VertexData.ImportVertexData;
    } else {
      VertexData.ImportVertexData(parsedVertexData, geometry);
    }
    scene.pushGeometry(geometry, true);
    return geometry;
  }
};

// node_modules/@babylonjs/core/Meshes/transformNode.js
var convertRHSToLHS = Matrix.Compose(Vector3.One(), Quaternion.FromEulerAngles(0, Math.PI, 0), Vector3.Zero());
var TransformNode = class _TransformNode extends Node {
  /**
   * Gets or sets the billboard mode. Default is 0.
   *
   * | Value | Type | Description |
   * | --- | --- | --- |
   * | 0 | BILLBOARDMODE_NONE |  |
   * | 1 | BILLBOARDMODE_X |  |
   * | 2 | BILLBOARDMODE_Y |  |
   * | 4 | BILLBOARDMODE_Z |  |
   * | 7 | BILLBOARDMODE_ALL |  |
   *
   */
  get billboardMode() {
    return this._billboardMode;
  }
  set billboardMode(value) {
    if (this._billboardMode === value) {
      return;
    }
    this._billboardMode = value;
    this._cache.useBillboardPosition = (this._billboardMode & _TransformNode.BILLBOARDMODE_USE_POSITION) !== 0;
    this._computeUseBillboardPath();
  }
  /**
   * Gets or sets a boolean indicating that parent rotation should be preserved when using billboards.
   * This could be useful for glTF objects where parent rotation helps converting from right handed to left handed
   */
  get preserveParentRotationForBillboard() {
    return this._preserveParentRotationForBillboard;
  }
  set preserveParentRotationForBillboard(value) {
    if (value === this._preserveParentRotationForBillboard) {
      return;
    }
    this._preserveParentRotationForBillboard = value;
    this._computeUseBillboardPath();
  }
  _computeUseBillboardPath() {
    this._cache.useBillboardPath = this._billboardMode !== _TransformNode.BILLBOARDMODE_NONE && !this.preserveParentRotationForBillboard;
  }
  /**
   * Gets or sets the distance of the object to max, often used by skybox
   */
  get infiniteDistance() {
    return this._infiniteDistance;
  }
  set infiniteDistance(value) {
    if (this._infiniteDistance === value) {
      return;
    }
    this._infiniteDistance = value;
  }
  constructor(name47, scene = null, isPure = true) {
    super(name47, scene);
    this._forward = new Vector3(0, 0, 1);
    this._up = new Vector3(0, 1, 0);
    this._right = new Vector3(1, 0, 0);
    this._position = Vector3.Zero();
    this._rotation = Vector3.Zero();
    this._rotationQuaternion = null;
    this._scaling = Vector3.One();
    this._transformToBoneReferal = null;
    this._isAbsoluteSynced = false;
    this._billboardMode = _TransformNode.BILLBOARDMODE_NONE;
    this._preserveParentRotationForBillboard = false;
    this.scalingDeterminant = 1;
    this._infiniteDistance = false;
    this.ignoreNonUniformScaling = false;
    this.reIntegrateRotationIntoRotationQuaternion = false;
    this._poseMatrix = null;
    this._localMatrix = Matrix.Zero();
    this._usePivotMatrix = false;
    this._absolutePosition = Vector3.Zero();
    this._absoluteScaling = Vector3.Zero();
    this._absoluteRotationQuaternion = Quaternion.Identity();
    this._pivotMatrix = Matrix.Identity();
    this._postMultiplyPivotMatrix = false;
    this._isWorldMatrixFrozen = false;
    this._indexInSceneTransformNodesArray = -1;
    this.onAfterWorldMatrixUpdateObservable = new Observable();
    this._nonUniformScaling = false;
    if (isPure) {
      this.getScene().addTransformNode(this);
    }
  }
  /**
   * Gets a string identifying the name of the class
   * @returns "TransformNode" string
   */
  getClassName() {
    return "TransformNode";
  }
  /**
   * Gets or set the node position (default is (0.0, 0.0, 0.0))
   */
  get position() {
    return this._position;
  }
  set position(newPosition) {
    this._position = newPosition;
    this._isDirty = true;
  }
  /**
   * return true if a pivot has been set
   * @returns true if a pivot matrix is used
   */
  isUsingPivotMatrix() {
    return this._usePivotMatrix;
  }
  /**
   * return true if pivot matrix must be cancelled in the world matrix. When this parameter is set to true (default), the inverse of the pivot matrix is also applied at the end to cancel the transformation effect.
   */
  isUsingPostMultiplyPivotMatrix() {
    return this._postMultiplyPivotMatrix;
  }
  /**
   * Gets or sets the rotation property : a Vector3 defining the rotation value in radians around each local axis X, Y, Z  (default is (0.0, 0.0, 0.0)).
   * If rotation quaternion is set, this Vector3 will be ignored and copy from the quaternion
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(newRotation) {
    this._rotation = newRotation;
    this._rotationQuaternion = null;
    this._isDirty = true;
  }
  /**
   * Gets or sets the scaling property : a Vector3 defining the node scaling along each local axis X, Y, Z (default is (1.0, 1.0, 1.0)).
   */
  get scaling() {
    return this._scaling;
  }
  set scaling(newScaling) {
    this._scaling = newScaling;
    this._isDirty = true;
  }
  /**
   * Gets or sets the rotation Quaternion property : this a Quaternion object defining the node rotation by using a unit quaternion (undefined by default, but can be null).
   * If set, only the rotationQuaternion is then used to compute the node rotation (ie. node.rotation will be ignored)
   */
  get rotationQuaternion() {
    return this._rotationQuaternion;
  }
  set rotationQuaternion(quaternion) {
    this._rotationQuaternion = quaternion;
    if (quaternion) {
      this._rotation.setAll(0);
    }
    this._isDirty = true;
  }
  /**
   * The forward direction of that transform in world space.
   */
  get forward() {
    Vector3.TransformNormalFromFloatsToRef(0, 0, this.getScene().useRightHandedSystem ? -1 : 1, this.getWorldMatrix(), this._forward);
    return this._forward.normalize();
  }
  /**
   * The up direction of that transform in world space.
   */
  get up() {
    Vector3.TransformNormalFromFloatsToRef(0, 1, 0, this.getWorldMatrix(), this._up);
    return this._up.normalize();
  }
  /**
   * The right direction of that transform in world space.
   */
  get right() {
    Vector3.TransformNormalFromFloatsToRef(this.getScene().useRightHandedSystem ? -1 : 1, 0, 0, this.getWorldMatrix(), this._right);
    return this._right.normalize();
  }
  /**
   * Copies the parameter passed Matrix into the mesh Pose matrix.
   * @param matrix the matrix to copy the pose from
   * @returns this TransformNode.
   */
  updatePoseMatrix(matrix) {
    if (!this._poseMatrix) {
      this._poseMatrix = matrix.clone();
      return this;
    }
    this._poseMatrix.copyFrom(matrix);
    return this;
  }
  /**
   * Returns the mesh Pose matrix.
   * @returns the pose matrix
   */
  getPoseMatrix() {
    if (!this._poseMatrix) {
      this._poseMatrix = Matrix.Identity();
    }
    return this._poseMatrix;
  }
  /** @internal */
  _isSynchronized() {
    const cache = this._cache;
    if (this._billboardMode !== cache.billboardMode || this._billboardMode !== _TransformNode.BILLBOARDMODE_NONE) {
      return false;
    }
    if (cache.pivotMatrixUpdated) {
      return false;
    }
    if (this._infiniteDistance) {
      return false;
    }
    if (this._position._isDirty) {
      return false;
    }
    if (this._scaling._isDirty) {
      return false;
    }
    if (this._rotationQuaternion && this._rotationQuaternion._isDirty || this._rotation._isDirty) {
      return false;
    }
    return true;
  }
  /** @internal */
  _initCache() {
    super._initCache();
    const cache = this._cache;
    cache.localMatrixUpdated = false;
    cache.billboardMode = -1;
    cache.infiniteDistance = false;
    cache.useBillboardPosition = false;
    cache.useBillboardPath = false;
  }
  /**
   * Returns the current mesh absolute position.
   * Returns a Vector3.
   */
  get absolutePosition() {
    return this.getAbsolutePosition();
  }
  /**
   * Returns the current mesh absolute scaling.
   * Returns a Vector3.
   */
  get absoluteScaling() {
    this._syncAbsoluteScalingAndRotation();
    return this._absoluteScaling;
  }
  /**
   * Returns the current mesh absolute rotation.
   * Returns a Quaternion.
   */
  get absoluteRotationQuaternion() {
    this._syncAbsoluteScalingAndRotation();
    return this._absoluteRotationQuaternion;
  }
  /**
   * Sets a new matrix to apply before all other transformation
   * @param matrix defines the transform matrix
   * @returns the current TransformNode
   */
  setPreTransformMatrix(matrix) {
    return this.setPivotMatrix(matrix, false);
  }
  /**
   * Sets a new pivot matrix to the current node
   * @param matrix defines the new pivot matrix to use
   * @param postMultiplyPivotMatrix defines if the pivot matrix must be cancelled in the world matrix. When this parameter is set to true (default), the inverse of the pivot matrix is also applied at the end to cancel the transformation effect
   * @returns the current TransformNode
   */
  setPivotMatrix(matrix, postMultiplyPivotMatrix = true) {
    this._pivotMatrix.copyFrom(matrix);
    this._usePivotMatrix = !this._pivotMatrix.isIdentity();
    this._cache.pivotMatrixUpdated = true;
    this._postMultiplyPivotMatrix = postMultiplyPivotMatrix;
    if (this._postMultiplyPivotMatrix) {
      if (!this._pivotMatrixInverse) {
        this._pivotMatrixInverse = Matrix.Invert(this._pivotMatrix);
      } else {
        this._pivotMatrix.invertToRef(this._pivotMatrixInverse);
      }
    }
    return this;
  }
  /**
   * Returns the mesh pivot matrix.
   * Default : Identity.
   * @returns the matrix
   */
  getPivotMatrix() {
    return this._pivotMatrix;
  }
  /**
   * Instantiate (when possible) or clone that node with its hierarchy
   * @param newParent defines the new parent to use for the instance (or clone)
   * @param options defines options to configure how copy is done
   * @param options.doNotInstantiate defines if the model must be instantiated or just cloned
   * @param onNewNodeCreated defines an option callback to call when a clone or an instance is created
   * @returns an instance (or a clone) of the current node with its hierarchy
   */
  instantiateHierarchy(newParent = null, options, onNewNodeCreated) {
    const clone = this.clone("Clone of " + (this.name || this.id), newParent || this.parent, true);
    if (clone) {
      if (onNewNodeCreated) {
        onNewNodeCreated(this, clone);
      }
    }
    for (const child of this.getChildTransformNodes(true)) {
      child.instantiateHierarchy(clone, options, onNewNodeCreated);
    }
    return clone;
  }
  /**
   * Prevents the World matrix to be computed any longer
   * @param newWorldMatrix defines an optional matrix to use as world matrix
   * @param decompose defines whether to decompose the given newWorldMatrix or directly assign
   * @returns the TransformNode.
   */
  freezeWorldMatrix(newWorldMatrix = null, decompose = false) {
    if (newWorldMatrix) {
      if (decompose) {
        this._rotation.setAll(0);
        this._rotationQuaternion = this._rotationQuaternion || Quaternion.Identity();
        newWorldMatrix.decompose(this._scaling, this._rotationQuaternion, this._position);
        this.computeWorldMatrix(true);
      } else {
        this._worldMatrix = newWorldMatrix;
        this._absolutePosition.copyFromFloats(this._worldMatrix.m[12], this._worldMatrix.m[13], this._worldMatrix.m[14]);
        this._afterComputeWorldMatrix();
      }
    } else {
      this._isWorldMatrixFrozen = false;
      this.computeWorldMatrix(true);
    }
    this._isDirty = false;
    this._isWorldMatrixFrozen = true;
    return this;
  }
  /**
   * Allows back the World matrix computation.
   * @returns the TransformNode.
   */
  unfreezeWorldMatrix() {
    this._isWorldMatrixFrozen = false;
    this.computeWorldMatrix(true);
    return this;
  }
  /**
   * True if the World matrix has been frozen.
   */
  get isWorldMatrixFrozen() {
    return this._isWorldMatrixFrozen;
  }
  /**
   * Returns the mesh absolute position in the World.
   * @returns a Vector3.
   */
  getAbsolutePosition() {
    this.computeWorldMatrix();
    return this._absolutePosition;
  }
  /**
   * Sets the mesh absolute position in the World from a Vector3 or an Array(3).
   * @param absolutePosition the absolute position to set
   * @returns the TransformNode.
   */
  setAbsolutePosition(absolutePosition) {
    if (!absolutePosition) {
      return this;
    }
    let absolutePositionX;
    let absolutePositionY;
    let absolutePositionZ;
    if (absolutePosition.x === void 0) {
      if (arguments.length < 3) {
        return this;
      }
      absolutePositionX = arguments[0];
      absolutePositionY = arguments[1];
      absolutePositionZ = arguments[2];
    } else {
      absolutePositionX = absolutePosition.x;
      absolutePositionY = absolutePosition.y;
      absolutePositionZ = absolutePosition.z;
    }
    if (this.parent) {
      const invertParentWorldMatrix = TmpVectors.Matrix[0];
      this.parent.getWorldMatrix().invertToRef(invertParentWorldMatrix);
      Vector3.TransformCoordinatesFromFloatsToRef(absolutePositionX, absolutePositionY, absolutePositionZ, invertParentWorldMatrix, this.position);
    } else {
      this.position.x = absolutePositionX;
      this.position.y = absolutePositionY;
      this.position.z = absolutePositionZ;
    }
    this._absolutePosition.copyFrom(absolutePosition);
    return this;
  }
  /**
   * Sets the mesh position in its local space.
   * @param vector3 the position to set in localspace
   * @returns the TransformNode.
   */
  setPositionWithLocalVector(vector3) {
    this.computeWorldMatrix();
    this.position = Vector3.TransformNormal(vector3, this._localMatrix);
    return this;
  }
  /**
   * Returns the mesh position in the local space from the current World matrix values.
   * @returns a new Vector3.
   */
  getPositionExpressedInLocalSpace() {
    this.computeWorldMatrix();
    const invLocalWorldMatrix = TmpVectors.Matrix[0];
    this._localMatrix.invertToRef(invLocalWorldMatrix);
    return Vector3.TransformNormal(this.position, invLocalWorldMatrix);
  }
  /**
   * Translates the mesh along the passed Vector3 in its local space.
   * @param vector3 the distance to translate in localspace
   * @returns the TransformNode.
   */
  locallyTranslate(vector3) {
    this.computeWorldMatrix(true);
    this.position = Vector3.TransformCoordinates(vector3, this._localMatrix);
    return this;
  }
  /**
   * Orients a mesh towards a target point. Mesh must be drawn facing user.
   * @param targetPoint the position (must be in same space as current mesh) to look at
   * @param yawCor optional yaw (y-axis) correction in radians
   * @param pitchCor optional pitch (x-axis) correction in radians
   * @param rollCor optional roll (z-axis) correction in radians
   * @param space the chosen space of the target
   * @returns the TransformNode.
   */
  lookAt(targetPoint, yawCor = 0, pitchCor = 0, rollCor = 0, space = Space.LOCAL) {
    const dv = _TransformNode._LookAtVectorCache;
    const pos = space === Space.LOCAL ? this.position : this.getAbsolutePosition();
    targetPoint.subtractToRef(pos, dv);
    this.setDirection(dv, yawCor, pitchCor, rollCor);
    if (space === Space.WORLD && this.parent) {
      if (this.rotationQuaternion) {
        const rotationMatrix = TmpVectors.Matrix[0];
        this.rotationQuaternion.toRotationMatrix(rotationMatrix);
        const parentRotationMatrix = TmpVectors.Matrix[1];
        this.parent.getWorldMatrix().getRotationMatrixToRef(parentRotationMatrix);
        parentRotationMatrix.invert();
        rotationMatrix.multiplyToRef(parentRotationMatrix, rotationMatrix);
        this.rotationQuaternion.fromRotationMatrix(rotationMatrix);
      } else {
        const quaternionRotation = TmpVectors.Quaternion[0];
        Quaternion.FromEulerVectorToRef(this.rotation, quaternionRotation);
        const rotationMatrix = TmpVectors.Matrix[0];
        quaternionRotation.toRotationMatrix(rotationMatrix);
        const parentRotationMatrix = TmpVectors.Matrix[1];
        this.parent.getWorldMatrix().getRotationMatrixToRef(parentRotationMatrix);
        parentRotationMatrix.invert();
        rotationMatrix.multiplyToRef(parentRotationMatrix, rotationMatrix);
        quaternionRotation.fromRotationMatrix(rotationMatrix);
        quaternionRotation.toEulerAnglesToRef(this.rotation);
      }
    }
    return this;
  }
  /**
   * Returns a new Vector3 that is the localAxis, expressed in the mesh local space, rotated like the mesh.
   * This Vector3 is expressed in the World space.
   * @param localAxis axis to rotate
   * @returns a new Vector3 that is the localAxis, expressed in the mesh local space, rotated like the mesh.
   */
  getDirection(localAxis) {
    const result = Vector3.Zero();
    this.getDirectionToRef(localAxis, result);
    return result;
  }
  /**
   * Sets the Vector3 "result" as the rotated Vector3 "localAxis" in the same rotation than the mesh.
   * localAxis is expressed in the mesh local space.
   * result is computed in the World space from the mesh World matrix.
   * @param localAxis axis to rotate
   * @param result the resulting transformnode
   * @returns this TransformNode.
   */
  getDirectionToRef(localAxis, result) {
    Vector3.TransformNormalToRef(localAxis, this.getWorldMatrix(), result);
    return this;
  }
  /**
   * Sets this transform node rotation to the given local axis.
   * @param localAxis the axis in local space
   * @param yawCor optional yaw (y-axis) correction in radians
   * @param pitchCor optional pitch (x-axis) correction in radians
   * @param rollCor optional roll (z-axis) correction in radians
   * @returns this TransformNode
   */
  setDirection(localAxis, yawCor = 0, pitchCor = 0, rollCor = 0) {
    const yaw = -Math.atan2(localAxis.z, localAxis.x) + Math.PI / 2;
    const len = Math.sqrt(localAxis.x * localAxis.x + localAxis.z * localAxis.z);
    const pitch = -Math.atan2(localAxis.y, len);
    if (this.rotationQuaternion) {
      Quaternion.RotationYawPitchRollToRef(yaw + yawCor, pitch + pitchCor, rollCor, this.rotationQuaternion);
    } else {
      this.rotation.x = pitch + pitchCor;
      this.rotation.y = yaw + yawCor;
      this.rotation.z = rollCor;
    }
    return this;
  }
  /**
   * Sets a new pivot point to the current node
   * @param point defines the new pivot point to use
   * @param space defines if the point is in world or local space (local by default)
   * @returns the current TransformNode
   */
  setPivotPoint(point, space = Space.LOCAL) {
    if (this.getScene().getRenderId() == 0) {
      this.computeWorldMatrix(true);
    }
    const wm = this.getWorldMatrix();
    if (space == Space.WORLD) {
      const tmat = TmpVectors.Matrix[0];
      wm.invertToRef(tmat);
      point = Vector3.TransformCoordinates(point, tmat);
    }
    return this.setPivotMatrix(Matrix.Translation(-point.x, -point.y, -point.z), true);
  }
  /**
   * Returns a new Vector3 set with the mesh pivot point coordinates in the local space.
   * @returns the pivot point
   */
  getPivotPoint() {
    const point = Vector3.Zero();
    this.getPivotPointToRef(point);
    return point;
  }
  /**
   * Sets the passed Vector3 "result" with the coordinates of the mesh pivot point in the local space.
   * @param result the vector3 to store the result
   * @returns this TransformNode.
   */
  getPivotPointToRef(result) {
    result.x = -this._pivotMatrix.m[12];
    result.y = -this._pivotMatrix.m[13];
    result.z = -this._pivotMatrix.m[14];
    return this;
  }
  /**
   * Returns a new Vector3 set with the mesh pivot point World coordinates.
   * @returns a new Vector3 set with the mesh pivot point World coordinates.
   */
  getAbsolutePivotPoint() {
    const point = Vector3.Zero();
    this.getAbsolutePivotPointToRef(point);
    return point;
  }
  /**
   * Sets the Vector3 "result" coordinates with the mesh pivot point World coordinates.
   * @param result vector3 to store the result
   * @returns this TransformNode.
   */
  getAbsolutePivotPointToRef(result) {
    this.getPivotPointToRef(result);
    Vector3.TransformCoordinatesToRef(result, this.getWorldMatrix(), result);
    return this;
  }
  /**
   * Flag the transform node as dirty (Forcing it to update everything)
   * @param property if set to "rotation" the objects rotationQuaternion will be set to null
   * @returns this  node
   */
  markAsDirty(property) {
    if (this._isDirty) {
      return this;
    }
    if (this._children) {
      for (const child of this._children) {
        child.markAsDirty(property);
      }
    }
    return super.markAsDirty(property);
  }
  /**
   * Defines the passed node as the parent of the current node.
   * The node will remain exactly where it is and its position / rotation will be updated accordingly.
   * Note that if the mesh has a pivot matrix / point defined it will be applied after the parent was updated.
   * In that case the node will not remain in the same space as it is, as the pivot will be applied.
   * To avoid this, you can set updatePivot to true and the pivot will be updated to identity
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/parent_pivot/parent
   * @param node the node ot set as the parent
   * @param preserveScalingSign if true, keep scaling sign of child. Otherwise, scaling sign might change.
   * @param updatePivot if true, update the pivot matrix to keep the node in the same space as before
   * @returns this TransformNode.
   */
  setParent(node, preserveScalingSign = false, updatePivot = false) {
    if (!node && !this.parent) {
      return this;
    }
    const quatRotation = TmpVectors.Quaternion[0];
    const position = TmpVectors.Vector3[0];
    const scale = TmpVectors.Vector3[1];
    const invParentMatrix = TmpVectors.Matrix[1];
    Matrix.IdentityToRef(invParentMatrix);
    const composedMatrix = TmpVectors.Matrix[0];
    this.computeWorldMatrix(true);
    let currentRotation = this.rotationQuaternion;
    if (!currentRotation) {
      currentRotation = _TransformNode._TmpRotation;
      Quaternion.RotationYawPitchRollToRef(this._rotation.y, this._rotation.x, this._rotation.z, currentRotation);
    }
    Matrix.ComposeToRef(this.scaling, currentRotation, this.position, composedMatrix);
    if (this.parent) {
      composedMatrix.multiplyToRef(this.parent.computeWorldMatrix(true), composedMatrix);
    }
    if (node) {
      node.computeWorldMatrix(true).invertToRef(invParentMatrix);
      composedMatrix.multiplyToRef(invParentMatrix, composedMatrix);
    }
    composedMatrix.decompose(scale, quatRotation, position, preserveScalingSign ? this : void 0);
    if (this.rotationQuaternion) {
      this.rotationQuaternion.copyFrom(quatRotation);
    } else {
      quatRotation.toEulerAnglesToRef(this.rotation);
    }
    this.scaling.copyFrom(scale);
    this.position.copyFrom(position);
    this.parent = node;
    if (updatePivot) {
      this.setPivotMatrix(Matrix.Identity());
    }
    return this;
  }
  /**
   * True if the scaling property of this object is non uniform eg. (1,2,1)
   */
  get nonUniformScaling() {
    return this._nonUniformScaling;
  }
  /**
   * @internal
   */
  _updateNonUniformScalingState(value) {
    if (this._nonUniformScaling === value) {
      return false;
    }
    this._nonUniformScaling = value;
    return true;
  }
  /**
   * Attach the current TransformNode to another TransformNode associated with a bone
   * @param bone Bone affecting the TransformNode
   * @param affectedTransformNode TransformNode associated with the bone
   * @returns this object
   */
  attachToBone(bone, affectedTransformNode) {
    this._currentParentWhenAttachingToBone = this.parent;
    this._transformToBoneReferal = affectedTransformNode;
    this.parent = bone;
    bone.getSkeleton().prepare(true);
    if (bone.getFinalMatrix().determinant() < 0) {
      this.scalingDeterminant *= -1;
    }
    return this;
  }
  /**
   * Detach the transform node if its associated with a bone
   * @param resetToPreviousParent Indicates if the parent that was in effect when attachToBone was called should be set back or if we should set parent to null instead (defaults to the latter)
   * @returns this object
   */
  detachFromBone(resetToPreviousParent = false) {
    if (!this.parent) {
      if (resetToPreviousParent) {
        this.parent = this._currentParentWhenAttachingToBone;
      }
      return this;
    }
    if (this.parent.getWorldMatrix().determinant() < 0) {
      this.scalingDeterminant *= -1;
    }
    this._transformToBoneReferal = null;
    if (resetToPreviousParent) {
      this.parent = this._currentParentWhenAttachingToBone;
    } else {
      this.parent = null;
    }
    return this;
  }
  /**
   * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in the given space.
   * space (default LOCAL) can be either Space.LOCAL, either Space.WORLD.
   * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
   * The passed axis is also normalized.
   * @param axis the axis to rotate around
   * @param amount the amount to rotate in radians
   * @param space Space to rotate in (Default: local)
   * @returns the TransformNode.
   */
  rotate(axis, amount, space) {
    axis.normalize();
    if (!this.rotationQuaternion) {
      this.rotationQuaternion = this.rotation.toQuaternion();
      this.rotation.setAll(0);
    }
    let rotationQuaternion;
    if (!space || space === Space.LOCAL) {
      rotationQuaternion = Quaternion.RotationAxisToRef(axis, amount, _TransformNode._RotationAxisCache);
      this.rotationQuaternion.multiplyToRef(rotationQuaternion, this.rotationQuaternion);
    } else {
      if (this.parent) {
        const parentWorldMatrix = this.parent.getWorldMatrix();
        const invertParentWorldMatrix = TmpVectors.Matrix[0];
        parentWorldMatrix.invertToRef(invertParentWorldMatrix);
        axis = Vector3.TransformNormal(axis, invertParentWorldMatrix);
        if (parentWorldMatrix.determinant() < 0) {
          amount *= -1;
        }
      }
      rotationQuaternion = Quaternion.RotationAxisToRef(axis, amount, _TransformNode._RotationAxisCache);
      rotationQuaternion.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
    }
    return this;
  }
  /**
   * Rotates the mesh around the axis vector for the passed angle (amount) expressed in radians, in world space.
   * Note that the property `rotationQuaternion` is then automatically updated and the property `rotation` is set to (0,0,0) and no longer used.
   * The passed axis is also normalized. .
   * Method is based on http://www.euclideanspace.com/maths/geometry/affine/aroundPoint/index.htm
   * @param point the point to rotate around
   * @param axis the axis to rotate around
   * @param amount the amount to rotate in radians
   * @returns the TransformNode
   */
  rotateAround(point, axis, amount) {
    axis.normalize();
    if (!this.rotationQuaternion) {
      this.rotationQuaternion = Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
      this.rotation.setAll(0);
    }
    const tmpVector = TmpVectors.Vector3[0];
    const finalScale = TmpVectors.Vector3[1];
    const finalTranslation = TmpVectors.Vector3[2];
    const finalRotation = TmpVectors.Quaternion[0];
    const translationMatrix = TmpVectors.Matrix[0];
    const translationMatrixInv = TmpVectors.Matrix[1];
    const rotationMatrix = TmpVectors.Matrix[2];
    const finalMatrix = TmpVectors.Matrix[3];
    point.subtractToRef(this.position, tmpVector);
    Matrix.TranslationToRef(tmpVector.x, tmpVector.y, tmpVector.z, translationMatrix);
    Matrix.TranslationToRef(-tmpVector.x, -tmpVector.y, -tmpVector.z, translationMatrixInv);
    Matrix.RotationAxisToRef(axis, amount, rotationMatrix);
    translationMatrixInv.multiplyToRef(rotationMatrix, finalMatrix);
    finalMatrix.multiplyToRef(translationMatrix, finalMatrix);
    finalMatrix.decompose(finalScale, finalRotation, finalTranslation);
    this.position.addInPlace(finalTranslation);
    finalRotation.multiplyToRef(this.rotationQuaternion, this.rotationQuaternion);
    return this;
  }
  /**
   * Translates the mesh along the axis vector for the passed distance in the given space.
   * space (default LOCAL) can be either Space.LOCAL, either Space.WORLD.
   * @param axis the axis to translate in
   * @param distance the distance to translate
   * @param space Space to rotate in (Default: local)
   * @returns the TransformNode.
   */
  translate(axis, distance, space) {
    const displacementVector = axis.scale(distance);
    if (!space || space === Space.LOCAL) {
      const tempV3 = this.getPositionExpressedInLocalSpace().add(displacementVector);
      this.setPositionWithLocalVector(tempV3);
    } else {
      this.setAbsolutePosition(this.getAbsolutePosition().add(displacementVector));
    }
    return this;
  }
  /**
   * Adds a rotation step to the mesh current rotation.
   * x, y, z are Euler angles expressed in radians.
   * This methods updates the current mesh rotation, either mesh.rotation, either mesh.rotationQuaternion if it's set.
   * This means this rotation is made in the mesh local space only.
   * It's useful to set a custom rotation order different from the BJS standard one YXZ.
   * Example : this rotates the mesh first around its local X axis, then around its local Z axis, finally around its local Y axis.
   * ```javascript
   * mesh.addRotation(x1, 0, 0).addRotation(0, 0, z2).addRotation(0, 0, y3);
   * ```
   * Note that `addRotation()` accumulates the passed rotation values to the current ones and computes the .rotation or .rotationQuaternion updated values.
   * Under the hood, only quaternions are used. So it's a little faster is you use .rotationQuaternion because it doesn't need to translate them back to Euler angles.
   * @param x Rotation to add
   * @param y Rotation to add
   * @param z Rotation to add
   * @returns the TransformNode.
   */
  addRotation(x, y, z) {
    let rotationQuaternion;
    if (this.rotationQuaternion) {
      rotationQuaternion = this.rotationQuaternion;
    } else {
      rotationQuaternion = TmpVectors.Quaternion[1];
      Quaternion.RotationYawPitchRollToRef(this.rotation.y, this.rotation.x, this.rotation.z, rotationQuaternion);
    }
    const accumulation = TmpVectors.Quaternion[0];
    Quaternion.RotationYawPitchRollToRef(y, x, z, accumulation);
    rotationQuaternion.multiplyInPlace(accumulation);
    if (!this.rotationQuaternion) {
      rotationQuaternion.toEulerAnglesToRef(this.rotation);
    }
    return this;
  }
  /**
   * @internal
   */
  _getEffectiveParent() {
    return this.parent;
  }
  /**
   * Returns whether the transform node world matrix computation needs the camera information to be computed.
   * This is the case when the node is a billboard or has an infinite distance for instance.
   * @returns true if the world matrix computation needs the camera information to be computed
   */
  isWorldMatrixCameraDependent() {
    return this._infiniteDistance && !this.parent || this._billboardMode !== _TransformNode.BILLBOARDMODE_NONE && !this.preserveParentRotationForBillboard;
  }
  /**
   * Computes the world matrix of the node
   * @param force defines if the cache version should be invalidated forcing the world matrix to be created from scratch
   * @param camera defines the camera used if different from the scene active camera (This is used with modes like Billboard or infinite distance)
   * @returns the world matrix
   */
  computeWorldMatrix(force = false, camera = null) {
    if (this._isWorldMatrixFrozen && !this._isDirty) {
      return this._worldMatrix;
    }
    const currentRenderId = this.getScene().getRenderId();
    if (!this._isDirty && !force && (this._currentRenderId === currentRenderId || this.isSynchronized())) {
      this._currentRenderId = currentRenderId;
      return this._worldMatrix;
    }
    camera = camera || this.getScene().activeCamera;
    this._updateCache();
    const cache = this._cache;
    cache.pivotMatrixUpdated = false;
    cache.billboardMode = this.billboardMode;
    cache.infiniteDistance = this.infiniteDistance;
    cache.parent = this._parentNode;
    this._currentRenderId = currentRenderId;
    this._childUpdateId += 1;
    this._isDirty = false;
    this._position._isDirty = false;
    this._rotation._isDirty = false;
    this._scaling._isDirty = false;
    const parent = this._getEffectiveParent();
    const scaling = _TransformNode._TmpScaling;
    let translation = this._position;
    if (this._infiniteDistance) {
      if (!this.parent && camera) {
        const cameraWorldMatrix = camera.getWorldMatrix();
        const cameraGlobalPosition = new Vector3(cameraWorldMatrix.m[12], cameraWorldMatrix.m[13], cameraWorldMatrix.m[14]);
        translation = _TransformNode._TmpTranslation;
        translation.copyFromFloats(this._position.x + cameraGlobalPosition.x, this._position.y + cameraGlobalPosition.y, this._position.z + cameraGlobalPosition.z);
      }
    }
    scaling.copyFromFloats(this._scaling.x * this.scalingDeterminant, this._scaling.y * this.scalingDeterminant, this._scaling.z * this.scalingDeterminant);
    let rotation;
    if (this._rotationQuaternion) {
      this._rotationQuaternion._isDirty = false;
      rotation = this._rotationQuaternion;
      if (this.reIntegrateRotationIntoRotationQuaternion) {
        const len = this.rotation.lengthSquared();
        if (len) {
          this._rotationQuaternion.multiplyInPlace(Quaternion.RotationYawPitchRoll(this._rotation.y, this._rotation.x, this._rotation.z));
          this._rotation.copyFromFloats(0, 0, 0);
        }
      }
    } else {
      rotation = _TransformNode._TmpRotation;
      Quaternion.RotationYawPitchRollToRef(this._rotation.y, this._rotation.x, this._rotation.z, rotation);
    }
    if (this._usePivotMatrix) {
      const scaleMatrix = TmpVectors.Matrix[1];
      Matrix.ScalingToRef(scaling.x, scaling.y, scaling.z, scaleMatrix);
      const rotationMatrix = TmpVectors.Matrix[0];
      rotation.toRotationMatrix(rotationMatrix);
      this._pivotMatrix.multiplyToRef(scaleMatrix, TmpVectors.Matrix[4]);
      TmpVectors.Matrix[4].multiplyToRef(rotationMatrix, this._localMatrix);
      if (this._postMultiplyPivotMatrix) {
        this._localMatrix.multiplyToRef(this._pivotMatrixInverse, this._localMatrix);
      }
      this._localMatrix.addTranslationFromFloats(translation.x, translation.y, translation.z);
    } else {
      Matrix.ComposeToRef(scaling, rotation, translation, this._localMatrix);
    }
    if (parent && parent.getWorldMatrix) {
      if (force) {
        parent.computeWorldMatrix(force);
      }
      if (cache.useBillboardPath) {
        if (this._transformToBoneReferal) {
          const bone = this.parent;
          bone.getSkeleton().prepare();
          bone.getFinalMatrix().multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), TmpVectors.Matrix[7]);
        } else {
          TmpVectors.Matrix[7].copyFrom(parent.getWorldMatrix());
        }
        const translation2 = TmpVectors.Vector3[5];
        const scale = TmpVectors.Vector3[6];
        const orientation = TmpVectors.Quaternion[0];
        TmpVectors.Matrix[7].decompose(scale, orientation, translation2);
        Matrix.ScalingToRef(scale.x, scale.y, scale.z, TmpVectors.Matrix[7]);
        TmpVectors.Matrix[7].setTranslation(translation2);
        if (_TransformNode.BillboardUseParentOrientation) {
          this._position.applyRotationQuaternionToRef(orientation, translation2);
          this._localMatrix.setTranslation(translation2);
        }
        this._localMatrix.multiplyToRef(TmpVectors.Matrix[7], this._worldMatrix);
      } else {
        if (this._transformToBoneReferal) {
          const bone = this.parent;
          bone.getSkeleton().prepare();
          this._localMatrix.multiplyToRef(bone.getFinalMatrix(), TmpVectors.Matrix[6]);
          TmpVectors.Matrix[6].multiplyToRef(this._transformToBoneReferal.getWorldMatrix(), this._worldMatrix);
        } else {
          this._localMatrix.multiplyToRef(parent.getWorldMatrix(), this._worldMatrix);
        }
      }
      this._markSyncedWithParent();
    } else {
      this._worldMatrix.copyFrom(this._localMatrix);
    }
    if (cache.useBillboardPath && camera && this.billboardMode && !cache.useBillboardPosition) {
      const storedTranslation = TmpVectors.Vector3[0];
      this._worldMatrix.getTranslationToRef(storedTranslation);
      TmpVectors.Matrix[1].copyFrom(camera.getViewMatrix());
      if (this._scene.useRightHandedSystem) {
        TmpVectors.Matrix[1].multiplyToRef(convertRHSToLHS, TmpVectors.Matrix[1]);
      }
      TmpVectors.Matrix[1].setTranslationFromFloats(0, 0, 0);
      TmpVectors.Matrix[1].invertToRef(TmpVectors.Matrix[0]);
      if ((this.billboardMode & _TransformNode.BILLBOARDMODE_ALL) !== _TransformNode.BILLBOARDMODE_ALL) {
        TmpVectors.Matrix[0].decompose(void 0, TmpVectors.Quaternion[0], void 0);
        const eulerAngles = TmpVectors.Vector3[1];
        TmpVectors.Quaternion[0].toEulerAnglesToRef(eulerAngles);
        if ((this.billboardMode & _TransformNode.BILLBOARDMODE_X) !== _TransformNode.BILLBOARDMODE_X) {
          eulerAngles.x = 0;
        }
        if ((this.billboardMode & _TransformNode.BILLBOARDMODE_Y) !== _TransformNode.BILLBOARDMODE_Y) {
          eulerAngles.y = 0;
        }
        if ((this.billboardMode & _TransformNode.BILLBOARDMODE_Z) !== _TransformNode.BILLBOARDMODE_Z) {
          eulerAngles.z = 0;
        }
        Matrix.RotationYawPitchRollToRef(eulerAngles.y, eulerAngles.x, eulerAngles.z, TmpVectors.Matrix[0]);
      }
      this._worldMatrix.setTranslationFromFloats(0, 0, 0);
      this._worldMatrix.multiplyToRef(TmpVectors.Matrix[0], this._worldMatrix);
      this._worldMatrix.setTranslation(TmpVectors.Vector3[0]);
    } else if (cache.useBillboardPath && camera && cache.useBillboardPosition) {
      const storedTranslation = TmpVectors.Vector3[0];
      this._worldMatrix.getTranslationToRef(storedTranslation);
      const cameraPosition = camera.globalPosition;
      this._worldMatrix.invertToRef(TmpVectors.Matrix[1]);
      const camInObjSpace = TmpVectors.Vector3[1];
      Vector3.TransformCoordinatesToRef(cameraPosition, TmpVectors.Matrix[1], camInObjSpace);
      camInObjSpace.normalize();
      const yaw = -Math.atan2(camInObjSpace.z, camInObjSpace.x) + Math.PI / 2;
      const len = Math.sqrt(camInObjSpace.x * camInObjSpace.x + camInObjSpace.z * camInObjSpace.z);
      const pitch = -Math.atan2(camInObjSpace.y, len);
      Quaternion.RotationYawPitchRollToRef(yaw, pitch, 0, TmpVectors.Quaternion[0]);
      if ((this.billboardMode & _TransformNode.BILLBOARDMODE_ALL) !== _TransformNode.BILLBOARDMODE_ALL) {
        const eulerAngles = TmpVectors.Vector3[1];
        TmpVectors.Quaternion[0].toEulerAnglesToRef(eulerAngles);
        if ((this.billboardMode & _TransformNode.BILLBOARDMODE_X) !== _TransformNode.BILLBOARDMODE_X) {
          eulerAngles.x = 0;
        }
        if ((this.billboardMode & _TransformNode.BILLBOARDMODE_Y) !== _TransformNode.BILLBOARDMODE_Y) {
          eulerAngles.y = 0;
        }
        if ((this.billboardMode & _TransformNode.BILLBOARDMODE_Z) !== _TransformNode.BILLBOARDMODE_Z) {
          eulerAngles.z = 0;
        }
        Matrix.RotationYawPitchRollToRef(eulerAngles.y, eulerAngles.x, eulerAngles.z, TmpVectors.Matrix[0]);
      } else {
        Matrix.FromQuaternionToRef(TmpVectors.Quaternion[0], TmpVectors.Matrix[0]);
      }
      this._worldMatrix.setTranslationFromFloats(0, 0, 0);
      this._worldMatrix.multiplyToRef(TmpVectors.Matrix[0], this._worldMatrix);
      this._worldMatrix.setTranslation(TmpVectors.Vector3[0]);
    }
    if (!this.ignoreNonUniformScaling) {
      if (this._scaling.isNonUniformWithinEpsilon(1e-6)) {
        this._updateNonUniformScalingState(true);
      } else if (parent && parent._nonUniformScaling) {
        this._updateNonUniformScalingState(parent._nonUniformScaling);
      } else {
        this._updateNonUniformScalingState(false);
      }
    } else {
      this._updateNonUniformScalingState(false);
    }
    this._afterComputeWorldMatrix();
    this._absolutePosition.copyFromFloats(this._worldMatrix.m[12], this._worldMatrix.m[13], this._worldMatrix.m[14]);
    this._isAbsoluteSynced = false;
    this.onAfterWorldMatrixUpdateObservable.notifyObservers(this);
    if (!this._poseMatrix) {
      this._poseMatrix = Matrix.Invert(this._worldMatrix);
    }
    this._worldMatrixDeterminantIsDirty = true;
    return this._worldMatrix;
  }
  /**
   * Resets this nodeTransform's local matrix to Matrix.Identity().
   * @param independentOfChildren indicates if all child nodeTransform's world-space transform should be preserved.
   */
  resetLocalMatrix(independentOfChildren = true) {
    this.computeWorldMatrix();
    if (independentOfChildren) {
      const children = this.getChildren();
      for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        if (child) {
          child.computeWorldMatrix();
          const bakedMatrix = TmpVectors.Matrix[0];
          child._localMatrix.multiplyToRef(this._localMatrix, bakedMatrix);
          const tmpRotationQuaternion = TmpVectors.Quaternion[0];
          bakedMatrix.decompose(child.scaling, tmpRotationQuaternion, child.position);
          if (child.rotationQuaternion) {
            child.rotationQuaternion.copyFrom(tmpRotationQuaternion);
          } else {
            tmpRotationQuaternion.toEulerAnglesToRef(child.rotation);
          }
        }
      }
    }
    this.scaling.copyFromFloats(1, 1, 1);
    this.position.copyFromFloats(0, 0, 0);
    this.rotation.copyFromFloats(0, 0, 0);
    if (this.rotationQuaternion) {
      this.rotationQuaternion = Quaternion.Identity();
    }
    this._worldMatrix = Matrix.Identity();
  }
  _afterComputeWorldMatrix() {
  }
  /**
   * If you'd like to be called back after the mesh position, rotation or scaling has been updated.
   * @param func callback function to add
   *
   * @returns the TransformNode.
   */
  registerAfterWorldMatrixUpdate(func) {
    this.onAfterWorldMatrixUpdateObservable.add(func);
    return this;
  }
  /**
   * Removes a registered callback function.
   * @param func callback function to remove
   * @returns the TransformNode.
   */
  unregisterAfterWorldMatrixUpdate(func) {
    this.onAfterWorldMatrixUpdateObservable.removeCallback(func);
    return this;
  }
  /**
   * Gets the position of the current mesh in camera space
   * @param camera defines the camera to use
   * @returns a position
   */
  getPositionInCameraSpace(camera = null) {
    if (!camera) {
      camera = this.getScene().activeCamera;
    }
    return Vector3.TransformCoordinates(this.getAbsolutePosition(), camera.getViewMatrix());
  }
  /**
   * Returns the distance from the mesh to the active camera
   * @param camera defines the camera to use
   * @returns the distance
   */
  getDistanceToCamera(camera = null) {
    if (!camera) {
      camera = this.getScene().activeCamera;
    }
    return this.getAbsolutePosition().subtract(camera.globalPosition).length();
  }
  /**
   * Clone the current transform node
   * @param name Name of the new clone
   * @param newParent New parent for the clone
   * @param doNotCloneChildren Do not clone children hierarchy
   * @returns the new transform node
   */
  clone(name47, newParent, doNotCloneChildren) {
    const result = SerializationHelper.Clone(() => new _TransformNode(name47, this.getScene()), this);
    result.name = name47;
    result.id = name47;
    if (newParent) {
      result.parent = newParent;
    }
    if (!doNotCloneChildren) {
      const directDescendants = this.getDescendants(true);
      for (let index = 0; index < directDescendants.length; index++) {
        const child = directDescendants[index];
        if (child.clone) {
          child.clone(name47 + "." + child.name, result);
        }
      }
    }
    return result;
  }
  /**
   * Serializes the objects information.
   * @param currentSerializationObject defines the object to serialize in
   * @returns the serialized object
   */
  serialize(currentSerializationObject) {
    const serializationObject = SerializationHelper.Serialize(this, currentSerializationObject);
    serializationObject.type = this.getClassName();
    serializationObject.uniqueId = this.uniqueId;
    if (this.parent) {
      this.parent._serializeAsParent(serializationObject);
    }
    serializationObject.localMatrix = this.getPivotMatrix().asArray();
    serializationObject.isEnabled = this.isEnabled();
    return serializationObject;
  }
  // Statics
  /**
   * Returns a new TransformNode object parsed from the source provided.
   * @param parsedTransformNode is the source.
   * @param scene the scene the object belongs to
   * @param rootUrl is a string, it's the root URL to prefix the `delayLoadingFile` property with
   * @returns a new TransformNode object parsed from the source provided.
   */
  static Parse(parsedTransformNode, scene, rootUrl) {
    const transformNode = SerializationHelper.Parse(() => new _TransformNode(parsedTransformNode.name, scene), parsedTransformNode, scene, rootUrl);
    if (parsedTransformNode.localMatrix) {
      transformNode.setPreTransformMatrix(Matrix.FromArray(parsedTransformNode.localMatrix));
    } else if (parsedTransformNode.pivotMatrix) {
      transformNode.setPivotMatrix(Matrix.FromArray(parsedTransformNode.pivotMatrix));
    }
    transformNode.setEnabled(parsedTransformNode.isEnabled);
    transformNode._waitingParsedUniqueId = parsedTransformNode.uniqueId;
    if (parsedTransformNode.parentId !== void 0) {
      transformNode._waitingParentId = parsedTransformNode.parentId;
    }
    if (parsedTransformNode.parentInstanceIndex !== void 0) {
      transformNode._waitingParentInstanceIndex = parsedTransformNode.parentInstanceIndex;
    }
    return transformNode;
  }
  /**
   * Get all child-transformNodes of this node
   * @param directDescendantsOnly defines if true only direct descendants of 'this' will be considered, if false direct and also indirect (children of children, an so on in a recursive manner) descendants of 'this' will be considered
   * @param predicate defines an optional predicate that will be called on every evaluated child, the predicate must return true for a given child to be part of the result, otherwise it will be ignored
   * @returns an array of TransformNode
   */
  getChildTransformNodes(directDescendantsOnly, predicate) {
    const results = [];
    this._getDescendants(results, directDescendantsOnly, (node) => {
      return (!predicate || predicate(node)) && node instanceof _TransformNode;
    });
    return results;
  }
  /**
   * Releases resources associated with this transform node.
   * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
   * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
   */
  dispose(doNotRecurse, disposeMaterialAndTextures = false) {
    this.getScene().stopAnimation(this);
    this.getScene().removeTransformNode(this);
    if (this._parentContainer) {
      const index = this._parentContainer.transformNodes.indexOf(this);
      if (index > -1) {
        this._parentContainer.transformNodes.splice(index, 1);
      }
      this._parentContainer = null;
    }
    this.onAfterWorldMatrixUpdateObservable.clear();
    if (doNotRecurse) {
      const transformNodes = this.getChildTransformNodes(true);
      for (const transformNode of transformNodes) {
        transformNode.parent = null;
        transformNode.computeWorldMatrix(true);
      }
    }
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }
  /**
   * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units)
   * @param includeDescendants Use the hierarchy's bounding box instead of the mesh's bounding box. Default is false
   * @param ignoreRotation ignore rotation when computing the scale (ie. object will be axis aligned). Default is false
   * @param predicate predicate that is passed in to getHierarchyBoundingVectors when selecting which object should be included when scaling
   * @returns the current mesh
   */
  normalizeToUnitCube(includeDescendants = true, ignoreRotation = false, predicate) {
    let storedRotation = null;
    let storedRotationQuaternion = null;
    if (ignoreRotation) {
      if (this.rotationQuaternion) {
        storedRotationQuaternion = this.rotationQuaternion.clone();
        this.rotationQuaternion.copyFromFloats(0, 0, 0, 1);
      } else if (this.rotation) {
        storedRotation = this.rotation.clone();
        this.rotation.copyFromFloats(0, 0, 0);
      }
    }
    const boundingVectors = this.getHierarchyBoundingVectors(includeDescendants, predicate);
    const sizeVec = boundingVectors.max.subtract(boundingVectors.min);
    const maxDimension = Math.max(sizeVec.x, sizeVec.y, sizeVec.z);
    if (maxDimension === 0) {
      return this;
    }
    const scale = 1 / maxDimension;
    this.scaling.scaleInPlace(scale);
    if (ignoreRotation) {
      if (this.rotationQuaternion && storedRotationQuaternion) {
        this.rotationQuaternion.copyFrom(storedRotationQuaternion);
      } else if (this.rotation && storedRotation) {
        this.rotation.copyFrom(storedRotation);
      }
    }
    return this;
  }
  _syncAbsoluteScalingAndRotation() {
    if (!this._isAbsoluteSynced) {
      this._worldMatrix.decompose(this._absoluteScaling, this._absoluteRotationQuaternion);
      this._isAbsoluteSynced = true;
    }
  }
};
TransformNode.BILLBOARDMODE_NONE = 0;
TransformNode.BILLBOARDMODE_X = 1;
TransformNode.BILLBOARDMODE_Y = 2;
TransformNode.BILLBOARDMODE_Z = 4;
TransformNode.BILLBOARDMODE_ALL = 7;
TransformNode.BILLBOARDMODE_USE_POSITION = 128;
TransformNode.BillboardUseParentOrientation = false;
TransformNode._TmpRotation = Quaternion.Zero();
TransformNode._TmpScaling = Vector3.Zero();
TransformNode._TmpTranslation = Vector3.Zero();
TransformNode._LookAtVectorCache = new Vector3(0, 0, 0);
TransformNode._RotationAxisCache = new Quaternion();
__decorate([
  serializeAsVector3("position")
], TransformNode.prototype, "_position", void 0);
__decorate([
  serializeAsVector3("rotation")
], TransformNode.prototype, "_rotation", void 0);
__decorate([
  serializeAsQuaternion("rotationQuaternion")
], TransformNode.prototype, "_rotationQuaternion", void 0);
__decorate([
  serializeAsVector3("scaling")
], TransformNode.prototype, "_scaling", void 0);
__decorate([
  serialize("billboardMode")
], TransformNode.prototype, "_billboardMode", void 0);
__decorate([
  serialize()
], TransformNode.prototype, "scalingDeterminant", void 0);
__decorate([
  serialize("infiniteDistance")
], TransformNode.prototype, "_infiniteDistance", void 0);
__decorate([
  serialize()
], TransformNode.prototype, "ignoreNonUniformScaling", void 0);
__decorate([
  serialize()
], TransformNode.prototype, "reIntegrateRotationIntoRotationQuaternion", void 0);

// node_modules/@babylonjs/core/Collisions/meshCollisionData.js
var _MeshCollisionData = class {
  constructor() {
    this._checkCollisions = false;
    this._collisionMask = -1;
    this._collisionGroup = -1;
    this._surroundingMeshes = null;
    this._collider = null;
    this._oldPositionForCollisions = new Vector3(0, 0, 0);
    this._diffPositionForCollisions = new Vector3(0, 0, 0);
    this._collisionResponse = true;
  }
};

// node_modules/@babylonjs/core/Meshes/abstractMesh.js
var _FacetDataStorage = class {
  constructor() {
    this.facetNb = 0;
    this.partitioningSubdivisions = 10;
    this.partitioningBBoxRatio = 1.01;
    this.facetDataEnabled = false;
    this.facetParameters = {};
    this.bbSize = Vector3.Zero();
    this.subDiv = {
      // actual number of subdivisions per axis for ComputeNormals()
      max: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      X: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Y: 1,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Z: 1
    };
    this.facetDepthSort = false;
    this.facetDepthSortEnabled = false;
  }
};
var _InternalAbstractMeshDataInfo = class {
  constructor() {
    this._hasVertexAlpha = false;
    this._useVertexColors = true;
    this._numBoneInfluencers = 4;
    this._applyFog = true;
    this._receiveShadows = false;
    this._facetData = new _FacetDataStorage();
    this._visibility = 1;
    this._skeleton = null;
    this._layerMask = 268435455;
    this._computeBonesUsingShaders = true;
    this._isActive = false;
    this._onlyForInstances = false;
    this._isActiveIntermediate = false;
    this._onlyForInstancesIntermediate = false;
    this._actAsRegularMesh = false;
    this._currentLOD = null;
    this._currentLODIsUpToDate = false;
    this._collisionRetryCount = 3;
    this._morphTargetManager = null;
    this._renderingGroupId = 0;
    this._bakedVertexAnimationManager = null;
    this._material = null;
    this._positions = null;
    this._pointerOverDisableMeshTesting = false;
    this._meshCollisionData = new _MeshCollisionData();
    this._enableDistantPicking = false;
    this._rawBoundingInfo = null;
  }
};
var AbstractMesh = class _AbstractMesh extends TransformNode {
  /**
   * No billboard
   */
  static get BILLBOARDMODE_NONE() {
    return TransformNode.BILLBOARDMODE_NONE;
  }
  /** Billboard on X axis */
  static get BILLBOARDMODE_X() {
    return TransformNode.BILLBOARDMODE_X;
  }
  /** Billboard on Y axis */
  static get BILLBOARDMODE_Y() {
    return TransformNode.BILLBOARDMODE_Y;
  }
  /** Billboard on Z axis */
  static get BILLBOARDMODE_Z() {
    return TransformNode.BILLBOARDMODE_Z;
  }
  /** Billboard on all axes */
  static get BILLBOARDMODE_ALL() {
    return TransformNode.BILLBOARDMODE_ALL;
  }
  /** Billboard on using position instead of orientation */
  static get BILLBOARDMODE_USE_POSITION() {
    return TransformNode.BILLBOARDMODE_USE_POSITION;
  }
  /**
   * Gets the number of facets in the mesh
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#what-is-a-mesh-facet
   */
  get facetNb() {
    return this._internalAbstractMeshDataInfo._facetData.facetNb;
  }
  /**
   * Gets or set the number (integer) of subdivisions per axis in the partitioning space
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#tweaking-the-partitioning
   */
  get partitioningSubdivisions() {
    return this._internalAbstractMeshDataInfo._facetData.partitioningSubdivisions;
  }
  set partitioningSubdivisions(nb) {
    this._internalAbstractMeshDataInfo._facetData.partitioningSubdivisions = nb;
  }
  /**
   * The ratio (float) to apply to the bounding box size to set to the partitioning space.
   * Ex : 1.01 (default) the partitioning space is 1% bigger than the bounding box
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#tweaking-the-partitioning
   */
  get partitioningBBoxRatio() {
    return this._internalAbstractMeshDataInfo._facetData.partitioningBBoxRatio;
  }
  set partitioningBBoxRatio(ratio) {
    this._internalAbstractMeshDataInfo._facetData.partitioningBBoxRatio = ratio;
  }
  /**
   * Gets or sets a boolean indicating that the facets must be depth sorted on next call to `updateFacetData()`.
   * Works only for updatable meshes.
   * Doesn't work with multi-materials
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#facet-depth-sort
   */
  get mustDepthSortFacets() {
    return this._internalAbstractMeshDataInfo._facetData.facetDepthSort;
  }
  set mustDepthSortFacets(sort) {
    this._internalAbstractMeshDataInfo._facetData.facetDepthSort = sort;
  }
  /**
   * The location (Vector3) where the facet depth sort must be computed from.
   * By default, the active camera position.
   * Used only when facet depth sort is enabled
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#facet-depth-sort
   */
  get facetDepthSortFrom() {
    return this._internalAbstractMeshDataInfo._facetData.facetDepthSortFrom;
  }
  set facetDepthSortFrom(location) {
    this._internalAbstractMeshDataInfo._facetData.facetDepthSortFrom = location;
  }
  /** number of collision detection tries. Change this value if not all collisions are detected and handled properly */
  get collisionRetryCount() {
    return this._internalAbstractMeshDataInfo._collisionRetryCount;
  }
  set collisionRetryCount(retryCount) {
    this._internalAbstractMeshDataInfo._collisionRetryCount = retryCount;
  }
  /**
   * gets a boolean indicating if facetData is enabled
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData#what-is-a-mesh-facet
   */
  get isFacetDataEnabled() {
    return this._internalAbstractMeshDataInfo._facetData.facetDataEnabled;
  }
  /**
   * Gets or sets the morph target manager
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/morphTargets
   */
  get morphTargetManager() {
    return this._internalAbstractMeshDataInfo._morphTargetManager;
  }
  set morphTargetManager(value) {
    if (this._internalAbstractMeshDataInfo._morphTargetManager === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._morphTargetManager = value;
    this._syncGeometryWithMorphTargetManager();
  }
  /**
   * Gets or sets the baked vertex animation manager
   * @see https://doc.babylonjs.com/features/featuresDeepDive/animation/baked_texture_animations
   */
  get bakedVertexAnimationManager() {
    return this._internalAbstractMeshDataInfo._bakedVertexAnimationManager;
  }
  set bakedVertexAnimationManager(value) {
    if (this._internalAbstractMeshDataInfo._bakedVertexAnimationManager === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._bakedVertexAnimationManager = value;
    this._markSubMeshesAsAttributesDirty();
  }
  /** @internal */
  _syncGeometryWithMorphTargetManager() {
  }
  /**
   * @internal
   */
  _updateNonUniformScalingState(value) {
    if (!super._updateNonUniformScalingState(value)) {
      return false;
    }
    this._markSubMeshesAsMiscDirty();
    return true;
  }
  /** @internal */
  get rawBoundingInfo() {
    return this._internalAbstractMeshDataInfo._rawBoundingInfo;
  }
  set rawBoundingInfo(boundingInfo) {
    this._internalAbstractMeshDataInfo._rawBoundingInfo = boundingInfo;
  }
  /** Set a function to call when this mesh collides with another one */
  set onCollide(callback) {
    if (this._internalAbstractMeshDataInfo._meshCollisionData._onCollideObserver) {
      this.onCollideObservable.remove(this._internalAbstractMeshDataInfo._meshCollisionData._onCollideObserver);
    }
    this._internalAbstractMeshDataInfo._meshCollisionData._onCollideObserver = this.onCollideObservable.add(callback);
  }
  /** Set a function to call when the collision's position changes */
  set onCollisionPositionChange(callback) {
    if (this._internalAbstractMeshDataInfo._meshCollisionData._onCollisionPositionChangeObserver) {
      this.onCollisionPositionChangeObservable.remove(this._internalAbstractMeshDataInfo._meshCollisionData._onCollisionPositionChangeObserver);
    }
    this._internalAbstractMeshDataInfo._meshCollisionData._onCollisionPositionChangeObserver = this.onCollisionPositionChangeObservable.add(callback);
  }
  /**
   * Gets or sets mesh visibility between 0 and 1 (default is 1)
   */
  get visibility() {
    return this._internalAbstractMeshDataInfo._visibility;
  }
  /**
   * Gets or sets mesh visibility between 0 and 1 (default is 1)
   */
  set visibility(value) {
    if (this._internalAbstractMeshDataInfo._visibility === value) {
      return;
    }
    const oldValue = this._internalAbstractMeshDataInfo._visibility;
    this._internalAbstractMeshDataInfo._visibility = value;
    if (oldValue === 1 && value !== 1 || oldValue !== 1 && value === 1) {
      this._markSubMeshesAsDirty((defines) => {
        defines.markAsMiscDirty();
        defines.markAsPrePassDirty();
      });
    }
  }
  /**
   * Gets or sets the property which disables the test that is checking that the mesh under the pointer is the same than the previous time we tested for it (default: false).
   * Set this property to true if you want thin instances picking to be reported accurately when moving over the mesh.
   * Note that setting this property to true will incur some performance penalties when dealing with pointer events for this mesh so use it sparingly.
   */
  get pointerOverDisableMeshTesting() {
    return this._internalAbstractMeshDataInfo._pointerOverDisableMeshTesting;
  }
  set pointerOverDisableMeshTesting(disable) {
    this._internalAbstractMeshDataInfo._pointerOverDisableMeshTesting = disable;
  }
  /**
   * Specifies the rendering group id for this mesh (0 by default)
   * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/transparent_rendering#rendering-groups
   */
  get renderingGroupId() {
    return this._internalAbstractMeshDataInfo._renderingGroupId;
  }
  set renderingGroupId(value) {
    this._internalAbstractMeshDataInfo._renderingGroupId = value;
  }
  /** Gets or sets current material */
  get material() {
    return this._internalAbstractMeshDataInfo._material;
  }
  set material(value) {
    if (this._internalAbstractMeshDataInfo._material === value) {
      return;
    }
    if (this._internalAbstractMeshDataInfo._material && this._internalAbstractMeshDataInfo._material.meshMap) {
      this._internalAbstractMeshDataInfo._material.meshMap[this.uniqueId] = void 0;
    }
    this._internalAbstractMeshDataInfo._material = value;
    if (value && value.meshMap) {
      value.meshMap[this.uniqueId] = this;
    }
    if (this.onMaterialChangedObservable.hasObservers()) {
      this.onMaterialChangedObservable.notifyObservers(this);
    }
    if (!this.subMeshes) {
      return;
    }
    this.resetDrawCache();
    this._unBindEffect();
  }
  /**
   * Gets the material used to render the mesh in a specific render pass
   * @param renderPassId render pass id
   * @returns material used for the render pass. If no specific material is used for this render pass, undefined is returned (meaning mesh.material is used for this pass)
   */
  getMaterialForRenderPass(renderPassId) {
    var _a;
    return (_a = this._internalAbstractMeshDataInfo._materialForRenderPass) === null || _a === void 0 ? void 0 : _a[renderPassId];
  }
  /**
   * Sets the material to be used to render the mesh in a specific render pass
   * @param renderPassId render pass id
   * @param material material to use for this render pass. If undefined is passed, no specific material will be used for this render pass but the regular material will be used instead (mesh.material)
   */
  setMaterialForRenderPass(renderPassId, material) {
    this.resetDrawCache(renderPassId);
    if (!this._internalAbstractMeshDataInfo._materialForRenderPass) {
      this._internalAbstractMeshDataInfo._materialForRenderPass = [];
    }
    this._internalAbstractMeshDataInfo._materialForRenderPass[renderPassId] = material;
  }
  /**
   * Gets or sets a boolean indicating that this mesh can receive realtime shadows
   * @see https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows
   */
  get receiveShadows() {
    return this._internalAbstractMeshDataInfo._receiveShadows;
  }
  set receiveShadows(value) {
    if (this._internalAbstractMeshDataInfo._receiveShadows === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._receiveShadows = value;
    this._markSubMeshesAsLightDirty();
  }
  /** Gets or sets a boolean indicating that this mesh contains vertex color data with alpha values */
  get hasVertexAlpha() {
    return this._internalAbstractMeshDataInfo._hasVertexAlpha;
  }
  set hasVertexAlpha(value) {
    if (this._internalAbstractMeshDataInfo._hasVertexAlpha === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._hasVertexAlpha = value;
    this._markSubMeshesAsAttributesDirty();
    this._markSubMeshesAsMiscDirty();
  }
  /** Gets or sets a boolean indicating that this mesh needs to use vertex color data to render (if this kind of vertex data is available in the geometry) */
  get useVertexColors() {
    return this._internalAbstractMeshDataInfo._useVertexColors;
  }
  set useVertexColors(value) {
    if (this._internalAbstractMeshDataInfo._useVertexColors === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._useVertexColors = value;
    this._markSubMeshesAsAttributesDirty();
  }
  /**
   * Gets or sets a boolean indicating that bone animations must be computed by the GPU (true by default)
   */
  get computeBonesUsingShaders() {
    return this._internalAbstractMeshDataInfo._computeBonesUsingShaders;
  }
  set computeBonesUsingShaders(value) {
    if (this._internalAbstractMeshDataInfo._computeBonesUsingShaders === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._computeBonesUsingShaders = value;
    this._markSubMeshesAsAttributesDirty();
  }
  /** Gets or sets the number of allowed bone influences per vertex (4 by default) */
  get numBoneInfluencers() {
    return this._internalAbstractMeshDataInfo._numBoneInfluencers;
  }
  set numBoneInfluencers(value) {
    if (this._internalAbstractMeshDataInfo._numBoneInfluencers === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._numBoneInfluencers = value;
    this._markSubMeshesAsAttributesDirty();
  }
  /** Gets or sets a boolean indicating that this mesh will allow fog to be rendered on it (true by default) */
  get applyFog() {
    return this._internalAbstractMeshDataInfo._applyFog;
  }
  set applyFog(value) {
    if (this._internalAbstractMeshDataInfo._applyFog === value) {
      return;
    }
    this._internalAbstractMeshDataInfo._applyFog = value;
    this._markSubMeshesAsMiscDirty();
  }
  /** When enabled, decompose picking matrices for better precision with large values for mesh position and scling */
  get enableDistantPicking() {
    return this._internalAbstractMeshDataInfo._enableDistantPicking;
  }
  set enableDistantPicking(value) {
    this._internalAbstractMeshDataInfo._enableDistantPicking = value;
  }
  /**
   * Gets or sets the current layer mask (default is 0x0FFFFFFF)
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/layerMasksAndMultiCam
   */
  get layerMask() {
    return this._internalAbstractMeshDataInfo._layerMask;
  }
  set layerMask(value) {
    if (value === this._internalAbstractMeshDataInfo._layerMask) {
      return;
    }
    this._internalAbstractMeshDataInfo._layerMask = value;
    this._resyncLightSources();
  }
  /**
   * Gets or sets a collision mask used to mask collisions (default is -1).
   * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
   */
  get collisionMask() {
    return this._internalAbstractMeshDataInfo._meshCollisionData._collisionMask;
  }
  set collisionMask(mask) {
    this._internalAbstractMeshDataInfo._meshCollisionData._collisionMask = !isNaN(mask) ? mask : -1;
  }
  /**
   * Gets or sets a collision response flag (default is true).
   * when collisionResponse is false, events are still triggered but colliding entity has no response
   * This helps creating trigger volume when user wants collision feedback events but not position/velocity
   * to respond to the collision.
   */
  get collisionResponse() {
    return this._internalAbstractMeshDataInfo._meshCollisionData._collisionResponse;
  }
  set collisionResponse(response) {
    this._internalAbstractMeshDataInfo._meshCollisionData._collisionResponse = response;
  }
  /**
   * Gets or sets the current collision group mask (-1 by default).
   * A collision between A and B will happen if A.collisionGroup & b.collisionMask !== 0
   */
  get collisionGroup() {
    return this._internalAbstractMeshDataInfo._meshCollisionData._collisionGroup;
  }
  set collisionGroup(mask) {
    this._internalAbstractMeshDataInfo._meshCollisionData._collisionGroup = !isNaN(mask) ? mask : -1;
  }
  /**
   * Gets or sets current surrounding meshes (null by default).
   *
   * By default collision detection is tested against every mesh in the scene.
   * It is possible to set surroundingMeshes to a defined list of meshes and then only these specified
   * meshes will be tested for the collision.
   *
   * Note: if set to an empty array no collision will happen when this mesh is moved.
   */
  get surroundingMeshes() {
    return this._internalAbstractMeshDataInfo._meshCollisionData._surroundingMeshes;
  }
  set surroundingMeshes(meshes) {
    this._internalAbstractMeshDataInfo._meshCollisionData._surroundingMeshes = meshes;
  }
  /** Gets the list of lights affecting that mesh */
  get lightSources() {
    return this._lightSources;
  }
  /** @internal */
  get _positions() {
    return null;
  }
  /**
   * Gets or sets a skeleton to apply skinning transformations
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/bonesSkeletons
   */
  set skeleton(value) {
    const skeleton = this._internalAbstractMeshDataInfo._skeleton;
    if (skeleton && skeleton.needInitialSkinMatrix) {
      skeleton._unregisterMeshWithPoseMatrix(this);
    }
    if (value && value.needInitialSkinMatrix) {
      value._registerMeshWithPoseMatrix(this);
    }
    this._internalAbstractMeshDataInfo._skeleton = value;
    if (!this._internalAbstractMeshDataInfo._skeleton) {
      this._bonesTransformMatrices = null;
    }
    this._markSubMeshesAsAttributesDirty();
  }
  get skeleton() {
    return this._internalAbstractMeshDataInfo._skeleton;
  }
  // Constructor
  /**
   * Creates a new AbstractMesh
   * @param name defines the name of the mesh
   * @param scene defines the hosting scene
   */
  constructor(name47, scene = null) {
    super(name47, scene, false);
    this._internalAbstractMeshDataInfo = new _InternalAbstractMeshDataInfo();
    this._waitingMaterialId = null;
    this.cullingStrategy = _AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
    this.onCollideObservable = new Observable();
    this.onCollisionPositionChangeObservable = new Observable();
    this.onMaterialChangedObservable = new Observable();
    this.definedFacingForward = true;
    this._occlusionQuery = null;
    this._renderingGroup = null;
    this.alphaIndex = Number.MAX_VALUE;
    this.isVisible = true;
    this.isPickable = true;
    this.isNearPickable = false;
    this.isNearGrabbable = false;
    this.showSubMeshesBoundingBox = false;
    this.isBlocker = false;
    this.enablePointerMoveEvents = false;
    this.outlineColor = Color3.Red();
    this.outlineWidth = 0.02;
    this.overlayColor = Color3.Red();
    this.overlayAlpha = 0.5;
    this.useOctreeForRenderingSelection = true;
    this.useOctreeForPicking = true;
    this.useOctreeForCollisions = true;
    this.alwaysSelectAsActiveMesh = false;
    this.doNotSyncBoundingInfo = false;
    this.actionManager = null;
    this.ellipsoid = new Vector3(0.5, 1, 0.5);
    this.ellipsoidOffset = new Vector3(0, 0, 0);
    this.edgesWidth = 1;
    this.edgesColor = new Color4(1, 0, 0, 1);
    this._edgesRenderer = null;
    this._masterMesh = null;
    this._boundingInfo = null;
    this._boundingInfoIsDirty = true;
    this._renderId = 0;
    this._intersectionsInProgress = new Array();
    this._unIndexed = false;
    this._lightSources = new Array();
    this._waitingData = {
      lods: null,
      actions: null,
      freezeWorldMatrix: null
    };
    this._bonesTransformMatrices = null;
    this._transformMatrixTexture = null;
    this.onRebuildObservable = new Observable();
    this._onCollisionPositionChange = (collisionId, newPosition, collidedMesh = null) => {
      newPosition.subtractToRef(this._internalAbstractMeshDataInfo._meshCollisionData._oldPositionForCollisions, this._internalAbstractMeshDataInfo._meshCollisionData._diffPositionForCollisions);
      if (this._internalAbstractMeshDataInfo._meshCollisionData._diffPositionForCollisions.length() > Engine.CollisionsEpsilon) {
        this.position.addInPlace(this._internalAbstractMeshDataInfo._meshCollisionData._diffPositionForCollisions);
      }
      if (collidedMesh) {
        this.onCollideObservable.notifyObservers(collidedMesh);
      }
      this.onCollisionPositionChangeObservable.notifyObservers(this.position);
    };
    scene = this.getScene();
    scene.addMesh(this);
    this._resyncLightSources();
    this._uniformBuffer = new UniformBuffer(this.getScene().getEngine(), void 0, void 0, name47, !this.getScene().getEngine().isWebGPU);
    this._buildUniformLayout();
    switch (scene.performancePriority) {
      case ScenePerformancePriority.Aggressive:
        this.doNotSyncBoundingInfo = true;
      case ScenePerformancePriority.Intermediate:
        this.alwaysSelectAsActiveMesh = true;
        this.isPickable = false;
        break;
    }
  }
  _buildUniformLayout() {
    this._uniformBuffer.addUniform("world", 16);
    this._uniformBuffer.addUniform("visibility", 1);
    this._uniformBuffer.create();
  }
  /**
   * Transfer the mesh values to its UBO.
   * @param world The world matrix associated with the mesh
   */
  transferToEffect(world) {
    const ubo = this._uniformBuffer;
    ubo.updateMatrix("world", world);
    ubo.updateFloat("visibility", this._internalAbstractMeshDataInfo._visibility);
    ubo.update();
  }
  /**
   * Gets the mesh uniform buffer.
   * @returns the uniform buffer of the mesh.
   */
  getMeshUniformBuffer() {
    return this._uniformBuffer;
  }
  /**
   * Returns the string "AbstractMesh"
   * @returns "AbstractMesh"
   */
  getClassName() {
    return "AbstractMesh";
  }
  /**
   * Gets a string representation of the current mesh
   * @param fullDetails defines a boolean indicating if full details must be included
   * @returns a string representation of the current mesh
   */
  toString(fullDetails) {
    let ret = "Name: " + this.name + ", isInstance: " + (this.getClassName() !== "InstancedMesh" ? "YES" : "NO");
    ret += ", # of submeshes: " + (this.subMeshes ? this.subMeshes.length : 0);
    const skeleton = this._internalAbstractMeshDataInfo._skeleton;
    if (skeleton) {
      ret += ", skeleton: " + skeleton.name;
    }
    if (fullDetails) {
      ret += ", billboard mode: " + ["NONE", "X", "Y", null, "Z", null, null, "ALL"][this.billboardMode];
      ret += ", freeze wrld mat: " + (this._isWorldMatrixFrozen || this._waitingData.freezeWorldMatrix ? "YES" : "NO");
    }
    return ret;
  }
  /**
   * @internal
   */
  _getEffectiveParent() {
    if (this._masterMesh && this.billboardMode !== TransformNode.BILLBOARDMODE_NONE) {
      return this._masterMesh;
    }
    return super._getEffectiveParent();
  }
  /**
   * @internal
   */
  _getActionManagerForTrigger(trigger, initialCall = true) {
    if (this.actionManager && (initialCall || this.actionManager.isRecursive)) {
      if (trigger) {
        if (this.actionManager.hasSpecificTrigger(trigger)) {
          return this.actionManager;
        }
      } else {
        return this.actionManager;
      }
    }
    if (!this.parent) {
      return null;
    }
    return this.parent._getActionManagerForTrigger(trigger, false);
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _rebuild(dispose = false) {
    this.onRebuildObservable.notifyObservers(this);
    if (this._occlusionQuery !== null) {
      this._occlusionQuery = null;
    }
    if (!this.subMeshes) {
      return;
    }
    for (const subMesh of this.subMeshes) {
      subMesh._rebuild();
    }
  }
  /** @internal */
  _resyncLightSources() {
    this._lightSources.length = 0;
    for (const light of this.getScene().lights) {
      if (!light.isEnabled()) {
        continue;
      }
      if (light.canAffectMesh(this)) {
        this._lightSources.push(light);
      }
    }
    this._markSubMeshesAsLightDirty();
  }
  /**
   * @internal
   */
  _resyncLightSource(light) {
    const isIn = light.isEnabled() && light.canAffectMesh(this);
    const index = this._lightSources.indexOf(light);
    let removed = false;
    if (index === -1) {
      if (!isIn) {
        return;
      }
      this._lightSources.push(light);
    } else {
      if (isIn) {
        return;
      }
      removed = true;
      this._lightSources.splice(index, 1);
    }
    this._markSubMeshesAsLightDirty(removed);
  }
  /** @internal */
  _unBindEffect() {
    for (const subMesh of this.subMeshes) {
      subMesh.setEffect(null);
    }
  }
  /**
   * @internal
   */
  _removeLightSource(light, dispose) {
    const index = this._lightSources.indexOf(light);
    if (index === -1) {
      return;
    }
    this._lightSources.splice(index, 1);
    this._markSubMeshesAsLightDirty(dispose);
  }
  _markSubMeshesAsDirty(func) {
    if (!this.subMeshes) {
      return;
    }
    for (const subMesh of this.subMeshes) {
      for (let i = 0; i < subMesh._drawWrappers.length; ++i) {
        const drawWrapper = subMesh._drawWrappers[i];
        if (!drawWrapper || !drawWrapper.defines || !drawWrapper.defines.markAllAsDirty) {
          continue;
        }
        func(drawWrapper.defines);
      }
    }
  }
  /**
   * @internal
   */
  _markSubMeshesAsLightDirty(dispose = false) {
    this._markSubMeshesAsDirty((defines) => defines.markAsLightDirty(dispose));
  }
  /** @internal */
  _markSubMeshesAsAttributesDirty() {
    this._markSubMeshesAsDirty((defines) => defines.markAsAttributesDirty());
  }
  /** @internal */
  _markSubMeshesAsMiscDirty() {
    this._markSubMeshesAsDirty((defines) => defines.markAsMiscDirty());
  }
  /**
   * Flag the AbstractMesh as dirty (Forcing it to update everything)
   * @param property if set to "rotation" the objects rotationQuaternion will be set to null
   * @returns this AbstractMesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markAsDirty(property) {
    this._currentRenderId = Number.MAX_VALUE;
    this._isDirty = true;
    return this;
  }
  /**
   * Resets the draw wrappers cache for all submeshes of this abstract mesh
   * @param passId If provided, releases only the draw wrapper corresponding to this render pass id
   */
  resetDrawCache(passId) {
    if (!this.subMeshes) {
      return;
    }
    for (const subMesh of this.subMeshes) {
      subMesh.resetDrawCache(passId);
    }
  }
  // Methods
  /**
   * Returns true if the mesh is blocked. Implemented by child classes
   */
  get isBlocked() {
    return false;
  }
  /**
   * Returns the mesh itself by default. Implemented by child classes
   * @param camera defines the camera to use to pick the right LOD level
   * @returns the currentAbstractMesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getLOD(camera) {
    return this;
  }
  /**
   * Returns 0 by default. Implemented by child classes
   * @returns an integer
   */
  getTotalVertices() {
    return 0;
  }
  /**
   * Returns a positive integer : the total number of indices in this mesh geometry.
   * @returns the number of indices or zero if the mesh has no geometry.
   */
  getTotalIndices() {
    return 0;
  }
  /**
   * Returns null by default. Implemented by child classes
   * @returns null
   */
  getIndices() {
    return null;
  }
  /**
   * Returns the array of the requested vertex data kind. Implemented by child classes
   * @param kind defines the vertex data kind to use
   * @returns null
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getVerticesData(kind) {
    return null;
  }
  /**
   * Sets the vertex data of the mesh geometry for the requested `kind`.
   * If the mesh has no geometry, a new Geometry object is set to the mesh and then passed this vertex data.
   * Note that a new underlying VertexBuffer object is created each call.
   * If the `kind` is the `PositionKind`, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed.
   * @param kind defines vertex data kind:
   * * VertexBuffer.PositionKind
   * * VertexBuffer.UVKind
   * * VertexBuffer.UV2Kind
   * * VertexBuffer.UV3Kind
   * * VertexBuffer.UV4Kind
   * * VertexBuffer.UV5Kind
   * * VertexBuffer.UV6Kind
   * * VertexBuffer.ColorKind
   * * VertexBuffer.MatricesIndicesKind
   * * VertexBuffer.MatricesIndicesExtraKind
   * * VertexBuffer.MatricesWeightsKind
   * * VertexBuffer.MatricesWeightsExtraKind
   * @param data defines the data source
   * @param updatable defines if the data must be flagged as updatable (or static)
   * @param stride defines the vertex stride (size of an entire vertex). Can be null and in this case will be deduced from vertex data kind
   * @returns the current mesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setVerticesData(kind, data, updatable, stride) {
    return this;
  }
  /**
   * Updates the existing vertex data of the mesh geometry for the requested `kind`.
   * If the mesh has no geometry, it is simply returned as it is.
   * @param kind defines vertex data kind:
   * * VertexBuffer.PositionKind
   * * VertexBuffer.UVKind
   * * VertexBuffer.UV2Kind
   * * VertexBuffer.UV3Kind
   * * VertexBuffer.UV4Kind
   * * VertexBuffer.UV5Kind
   * * VertexBuffer.UV6Kind
   * * VertexBuffer.ColorKind
   * * VertexBuffer.MatricesIndicesKind
   * * VertexBuffer.MatricesIndicesExtraKind
   * * VertexBuffer.MatricesWeightsKind
   * * VertexBuffer.MatricesWeightsExtraKind
   * @param data defines the data source
   * @param updateExtends If `kind` is `PositionKind` and if `updateExtends` is true, the mesh BoundingInfo is renewed, so the bounding box and sphere, and the mesh World Matrix is recomputed
   * @param makeItUnique If true, a new global geometry is created from this data and is set to the mesh
   * @returns the current mesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateVerticesData(kind, data, updateExtends, makeItUnique) {
    return this;
  }
  /**
   * Sets the mesh indices,
   * If the mesh has no geometry, a new Geometry object is created and set to the mesh.
   * @param indices Expects an array populated with integers or a typed array (Int32Array, Uint32Array, Uint16Array)
   * @param totalVertices Defines the total number of vertices
   * @returns the current mesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIndices(indices, totalVertices) {
    return this;
  }
  /**
   * Gets a boolean indicating if specific vertex data is present
   * @param kind defines the vertex data kind to use
   * @returns true is data kind is present
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isVerticesDataPresent(kind) {
    return false;
  }
  /**
   * Returns the mesh BoundingInfo object or creates a new one and returns if it was undefined.
   * Note that it returns a shallow bounding of the mesh (i.e. it does not include children).
   * However, if the mesh contains thin instances, it will be expanded to include them. If you want the "raw" bounding data instead, then use `getRawBoundingInfo()`.
   * To get the full bounding of all children, call `getHierarchyBoundingVectors` instead.
   * @returns a BoundingInfo
   */
  getBoundingInfo() {
    if (this._masterMesh) {
      return this._masterMesh.getBoundingInfo();
    }
    if (this._boundingInfoIsDirty) {
      this._boundingInfoIsDirty = false;
      this._updateBoundingInfo();
    }
    return this._boundingInfo;
  }
  /**
   * Returns the bounding info unnafected by instance data.
   * @returns the bounding info of the mesh unaffected by instance data.
   */
  getRawBoundingInfo() {
    var _a;
    return (_a = this.rawBoundingInfo) !== null && _a !== void 0 ? _a : this.getBoundingInfo();
  }
  /**
   * Overwrite the current bounding info
   * @param boundingInfo defines the new bounding info
   * @returns the current mesh
   */
  setBoundingInfo(boundingInfo) {
    this._boundingInfo = boundingInfo;
    return this;
  }
  /**
   * Returns true if there is already a bounding info
   */
  get hasBoundingInfo() {
    return this._boundingInfo !== null;
  }
  /**
   * Creates a new bounding info for the mesh
   * @param minimum min vector of the bounding box/sphere
   * @param maximum max vector of the bounding box/sphere
   * @param worldMatrix defines the new world matrix
   * @returns the new bounding info
   */
  buildBoundingInfo(minimum, maximum, worldMatrix) {
    this._boundingInfo = new BoundingInfo(minimum, maximum, worldMatrix);
    return this._boundingInfo;
  }
  /**
   * Uniformly scales the mesh to fit inside of a unit cube (1 X 1 X 1 units)
   * @param includeDescendants Use the hierarchy's bounding box instead of the mesh's bounding box. Default is false
   * @param ignoreRotation ignore rotation when computing the scale (ie. object will be axis aligned). Default is false
   * @param predicate predicate that is passed in to getHierarchyBoundingVectors when selecting which object should be included when scaling
   * @returns the current mesh
   */
  normalizeToUnitCube(includeDescendants = true, ignoreRotation = false, predicate) {
    return super.normalizeToUnitCube(includeDescendants, ignoreRotation, predicate);
  }
  /** Gets a boolean indicating if this mesh has skinning data and an attached skeleton */
  get useBones() {
    return this.skeleton && this.getScene().skeletonsEnabled && this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind) && this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind);
  }
  /** @internal */
  _preActivate() {
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _preActivateForIntermediateRendering(renderId) {
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _activate(renderId, intermediateRendering) {
    this._renderId = renderId;
    return true;
  }
  /** @internal */
  _postActivate() {
  }
  /** @internal */
  _freeze() {
  }
  /** @internal */
  _unFreeze() {
  }
  /**
   * Gets the current world matrix
   * @returns a Matrix
   */
  getWorldMatrix() {
    if (this._masterMesh && this.billboardMode === TransformNode.BILLBOARDMODE_NONE) {
      return this._masterMesh.getWorldMatrix();
    }
    return super.getWorldMatrix();
  }
  /** @internal */
  _getWorldMatrixDeterminant() {
    if (this._masterMesh) {
      return this._masterMesh._getWorldMatrixDeterminant();
    }
    return super._getWorldMatrixDeterminant();
  }
  /**
   * Gets a boolean indicating if this mesh is an instance or a regular mesh
   */
  get isAnInstance() {
    return false;
  }
  /**
   * Gets a boolean indicating if this mesh has instances
   */
  get hasInstances() {
    return false;
  }
  /**
   * Gets a boolean indicating if this mesh has thin instances
   */
  get hasThinInstances() {
    return false;
  }
  // ================================== Point of View Movement =================================
  /**
   * Perform relative position change from the point of view of behind the front of the mesh.
   * This is performed taking into account the meshes current rotation, so you do not have to care.
   * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
   * @param amountRight defines the distance on the right axis
   * @param amountUp defines the distance on the up axis
   * @param amountForward defines the distance on the forward axis
   * @returns the current mesh
   */
  movePOV(amountRight, amountUp, amountForward) {
    this.position.addInPlace(this.calcMovePOV(amountRight, amountUp, amountForward));
    return this;
  }
  /**
   * Calculate relative position change from the point of view of behind the front of the mesh.
   * This is performed taking into account the meshes current rotation, so you do not have to care.
   * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
   * @param amountRight defines the distance on the right axis
   * @param amountUp defines the distance on the up axis
   * @param amountForward defines the distance on the forward axis
   * @returns the new displacement vector
   */
  calcMovePOV(amountRight, amountUp, amountForward) {
    const rotMatrix = new Matrix();
    const rotQuaternion = this.rotationQuaternion ? this.rotationQuaternion : Quaternion.RotationYawPitchRoll(this.rotation.y, this.rotation.x, this.rotation.z);
    rotQuaternion.toRotationMatrix(rotMatrix);
    const translationDelta = Vector3.Zero();
    const defForwardMult = this.definedFacingForward ? -1 : 1;
    Vector3.TransformCoordinatesFromFloatsToRef(amountRight * defForwardMult, amountUp, amountForward * defForwardMult, rotMatrix, translationDelta);
    return translationDelta;
  }
  // ================================== Point of View Rotation =================================
  /**
   * Perform relative rotation change from the point of view of behind the front of the mesh.
   * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
   * @param flipBack defines the flip
   * @param twirlClockwise defines the twirl
   * @param tiltRight defines the tilt
   * @returns the current mesh
   */
  rotatePOV(flipBack, twirlClockwise, tiltRight) {
    this.rotation.addInPlace(this.calcRotatePOV(flipBack, twirlClockwise, tiltRight));
    return this;
  }
  /**
   * Calculate relative rotation change from the point of view of behind the front of the mesh.
   * Supports definition of mesh facing forward or backward {@link definedFacingForwardSearch | See definedFacingForwardSearch }.
   * @param flipBack defines the flip
   * @param twirlClockwise defines the twirl
   * @param tiltRight defines the tilt
   * @returns the new rotation vector
   */
  calcRotatePOV(flipBack, twirlClockwise, tiltRight) {
    const defForwardMult = this.definedFacingForward ? 1 : -1;
    return new Vector3(flipBack * defForwardMult, twirlClockwise, tiltRight * defForwardMult);
  }
  /**
   * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
   * This means the mesh underlying bounding box and sphere are recomputed.
   * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
   * @param applyMorph  defines whether to apply the morph target before computing the bounding info
   * @returns the current mesh
   */
  refreshBoundingInfo(applySkeleton = false, applyMorph = false) {
    if (this._boundingInfo && this._boundingInfo.isLocked) {
      return this;
    }
    this._refreshBoundingInfo(this._getPositionData(applySkeleton, applyMorph), null);
    return this;
  }
  /**
   * @internal
   */
  _refreshBoundingInfo(data, bias) {
    if (data) {
      const extend = extractMinAndMax(data, 0, this.getTotalVertices(), bias);
      if (this._boundingInfo) {
        this._boundingInfo.reConstruct(extend.minimum, extend.maximum);
      } else {
        this._boundingInfo = new BoundingInfo(extend.minimum, extend.maximum);
      }
    }
    if (this.subMeshes) {
      for (let index = 0; index < this.subMeshes.length; index++) {
        this.subMeshes[index].refreshBoundingInfo(data);
      }
    }
    this._updateBoundingInfo();
  }
  /**
   * Internal function to get buffer data and possibly apply morphs and normals
   * @param applySkeleton
   * @param applyMorph
   * @param data
   * @param kind the kind of data you want. Can be Normal or Position
   */
  _getData(applySkeleton = false, applyMorph = false, data, kind = VertexBuffer.PositionKind) {
    data = data !== null && data !== void 0 ? data : this.getVerticesData(kind).slice();
    if (data && applyMorph && this.morphTargetManager) {
      let faceIndexCount = 0;
      let positionIndex = 0;
      for (let vertexCount = 0; vertexCount < data.length; vertexCount++) {
        for (let targetCount = 0; targetCount < this.morphTargetManager.numTargets; targetCount++) {
          const targetMorph = this.morphTargetManager.getTarget(targetCount);
          const influence = targetMorph.influence;
          if (influence > 0) {
            let morphTargetData = null;
            switch (kind) {
              case VertexBuffer.PositionKind:
                morphTargetData = targetMorph.getPositions();
                break;
              case VertexBuffer.NormalKind:
                morphTargetData = targetMorph.getNormals();
                break;
              case VertexBuffer.TangentKind:
                morphTargetData = targetMorph.getTangents();
                break;
              case VertexBuffer.UVKind:
                morphTargetData = targetMorph.getUVs();
                break;
            }
            if (morphTargetData) {
              data[vertexCount] += (morphTargetData[vertexCount] - data[vertexCount]) * influence;
            }
          }
        }
        faceIndexCount++;
        if (kind === VertexBuffer.PositionKind) {
          if (this._positions && faceIndexCount === 3) {
            faceIndexCount = 0;
            const index = positionIndex * 3;
            this._positions[positionIndex++].copyFromFloats(data[index], data[index + 1], data[index + 2]);
          }
        }
      }
    }
    if (data && applySkeleton && this.skeleton) {
      const matricesIndicesData = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
      const matricesWeightsData = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
      if (matricesWeightsData && matricesIndicesData) {
        const needExtras = this.numBoneInfluencers > 4;
        const matricesIndicesExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind) : null;
        const matricesWeightsExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind) : null;
        const skeletonMatrices = this.skeleton.getTransformMatrices(this);
        const tempVector = TmpVectors.Vector3[0];
        const finalMatrix = TmpVectors.Matrix[0];
        const tempMatrix = TmpVectors.Matrix[1];
        let matWeightIdx = 0;
        for (let index = 0; index < data.length; index += 3, matWeightIdx += 4) {
          finalMatrix.reset();
          let inf;
          let weight;
          for (inf = 0; inf < 4; inf++) {
            weight = matricesWeightsData[matWeightIdx + inf];
            if (weight > 0) {
              Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesData[matWeightIdx + inf] * 16), weight, tempMatrix);
              finalMatrix.addToSelf(tempMatrix);
            }
          }
          if (needExtras) {
            for (inf = 0; inf < 4; inf++) {
              weight = matricesWeightsExtraData[matWeightIdx + inf];
              if (weight > 0) {
                Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesExtraData[matWeightIdx + inf] * 16), weight, tempMatrix);
                finalMatrix.addToSelf(tempMatrix);
              }
            }
          }
          if (kind === VertexBuffer.NormalKind) {
            Vector3.TransformNormalFromFloatsToRef(data[index], data[index + 1], data[index + 2], finalMatrix, tempVector);
          } else {
            Vector3.TransformCoordinatesFromFloatsToRef(data[index], data[index + 1], data[index + 2], finalMatrix, tempVector);
          }
          tempVector.toArray(data, index);
          if (kind === VertexBuffer.PositionKind && this._positions) {
            this._positions[index / 3].copyFrom(tempVector);
          }
        }
      }
    }
    return data;
  }
  /**
   * Get the normals vertex data and optionally apply skeleton and morphing.
   * @param applySkeleton defines whether to apply the skeleton
   * @param applyMorph  defines whether to apply the morph target
   * @returns the normals data
   */
  getNormalsData(applySkeleton = false, applyMorph = false) {
    return this._getData(applySkeleton, applyMorph, null, VertexBuffer.NormalKind);
  }
  /**
   * Get the position vertex data and optionally apply skeleton and morphing.
   * @param applySkeleton defines whether to apply the skeleton
   * @param applyMorph  defines whether to apply the morph target
   * @param data defines the position data to apply the skeleton and morph to
   * @returns the position data
   */
  getPositionData(applySkeleton = false, applyMorph = false, data) {
    return this._getData(applySkeleton, applyMorph, data, VertexBuffer.PositionKind);
  }
  /**
   * @internal
   */
  _getPositionData(applySkeleton, applyMorph) {
    var _a;
    let data = this.getVerticesData(VertexBuffer.PositionKind);
    if (this._internalAbstractMeshDataInfo._positions) {
      this._internalAbstractMeshDataInfo._positions = null;
    }
    if (data && (applySkeleton && this.skeleton || applyMorph && this.morphTargetManager)) {
      data = data.slice();
      this._generatePointsArray();
      if (this._positions) {
        const pos = this._positions;
        this._internalAbstractMeshDataInfo._positions = new Array(pos.length);
        for (let i = 0; i < pos.length; i++) {
          this._internalAbstractMeshDataInfo._positions[i] = ((_a = pos[i]) === null || _a === void 0 ? void 0 : _a.clone()) || new Vector3();
        }
      }
      return this.getPositionData(applySkeleton, applyMorph, data);
    }
    return data;
  }
  /** @internal */
  _updateBoundingInfo() {
    if (this._boundingInfo) {
      this._boundingInfo.update(this.worldMatrixFromCache);
    } else {
      this._boundingInfo = new BoundingInfo(Vector3.Zero(), Vector3.Zero(), this.worldMatrixFromCache);
    }
    this._updateSubMeshesBoundingInfo(this.worldMatrixFromCache);
    return this;
  }
  /**
   * @internal
   */
  _updateSubMeshesBoundingInfo(matrix) {
    if (!this.subMeshes) {
      return this;
    }
    const count = this.subMeshes.length;
    for (let subIndex = 0; subIndex < count; subIndex++) {
      const subMesh = this.subMeshes[subIndex];
      if (count > 1 || !subMesh.IsGlobal) {
        subMesh.updateBoundingInfo(matrix);
      }
    }
    return this;
  }
  /** @internal */
  _afterComputeWorldMatrix() {
    if (this.doNotSyncBoundingInfo) {
      return;
    }
    this._boundingInfoIsDirty = true;
  }
  /**
   * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
   * A mesh is in the frustum if its bounding box intersects the frustum
   * @param frustumPlanes defines the frustum to test
   * @returns true if the mesh is in the frustum planes
   */
  isInFrustum(frustumPlanes) {
    return this.getBoundingInfo().isInFrustum(frustumPlanes, this.cullingStrategy);
  }
  /**
   * Returns `true` if the mesh is completely in the frustum defined be the passed array of planes.
   * A mesh is completely in the frustum if its bounding box it completely inside the frustum.
   * @param frustumPlanes defines the frustum to test
   * @returns true if the mesh is completely in the frustum planes
   */
  isCompletelyInFrustum(frustumPlanes) {
    return this.getBoundingInfo().isCompletelyInFrustum(frustumPlanes);
  }
  /**
   * True if the mesh intersects another mesh or a SolidParticle object
   * @param mesh defines a target mesh or SolidParticle to test
   * @param precise Unless the parameter `precise` is set to `true` the intersection is computed according to Axis Aligned Bounding Boxes (AABB), else according to OBB (Oriented BBoxes)
   * @param includeDescendants Can be set to true to test if the mesh defined in parameters intersects with the current mesh or any child meshes
   * @returns true if there is an intersection
   */
  intersectsMesh(mesh, precise = false, includeDescendants) {
    const boundingInfo = this.getBoundingInfo();
    const otherBoundingInfo = mesh.getBoundingInfo();
    if (boundingInfo.intersects(otherBoundingInfo, precise)) {
      return true;
    }
    if (includeDescendants) {
      for (const child of this.getChildMeshes()) {
        if (child.intersectsMesh(mesh, precise, true)) {
          return true;
        }
      }
    }
    return false;
  }
  /**
   * Returns true if the passed point (Vector3) is inside the mesh bounding box
   * @param point defines the point to test
   * @returns true if there is an intersection
   */
  intersectsPoint(point) {
    return this.getBoundingInfo().intersectsPoint(point);
  }
  // Collisions
  /**
   * Gets or sets a boolean indicating that this mesh can be used in the collision engine
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
   */
  get checkCollisions() {
    return this._internalAbstractMeshDataInfo._meshCollisionData._checkCollisions;
  }
  set checkCollisions(collisionEnabled) {
    this._internalAbstractMeshDataInfo._meshCollisionData._checkCollisions = collisionEnabled;
  }
  /**
   * Gets Collider object used to compute collisions (not physics)
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
   */
  get collider() {
    return this._internalAbstractMeshDataInfo._meshCollisionData._collider;
  }
  /**
   * Move the mesh using collision engine
   * @see https://doc.babylonjs.com/features/featuresDeepDive/cameras/camera_collisions
   * @param displacement defines the requested displacement vector
   * @returns the current mesh
   */
  moveWithCollisions(displacement) {
    const globalPosition = this.getAbsolutePosition();
    globalPosition.addToRef(this.ellipsoidOffset, this._internalAbstractMeshDataInfo._meshCollisionData._oldPositionForCollisions);
    const coordinator = this.getScene().collisionCoordinator;
    if (!this._internalAbstractMeshDataInfo._meshCollisionData._collider) {
      this._internalAbstractMeshDataInfo._meshCollisionData._collider = coordinator.createCollider();
    }
    this._internalAbstractMeshDataInfo._meshCollisionData._collider._radius = this.ellipsoid;
    coordinator.getNewPosition(this._internalAbstractMeshDataInfo._meshCollisionData._oldPositionForCollisions, displacement, this._internalAbstractMeshDataInfo._meshCollisionData._collider, this.collisionRetryCount, this, this._onCollisionPositionChange, this.uniqueId);
    return this;
  }
  // Collisions
  /**
   * @internal
   */
  _collideForSubMesh(subMesh, transformMatrix, collider) {
    var _a;
    this._generatePointsArray();
    if (!this._positions) {
      return this;
    }
    if (!subMesh._lastColliderWorldVertices || !subMesh._lastColliderTransformMatrix.equals(transformMatrix)) {
      subMesh._lastColliderTransformMatrix = transformMatrix.clone();
      subMesh._lastColliderWorldVertices = [];
      subMesh._trianglePlanes = [];
      const start = subMesh.verticesStart;
      const end = subMesh.verticesStart + subMesh.verticesCount;
      for (let i = start; i < end; i++) {
        subMesh._lastColliderWorldVertices.push(Vector3.TransformCoordinates(this._positions[i], transformMatrix));
      }
    }
    collider._collide(subMesh._trianglePlanes, subMesh._lastColliderWorldVertices, this.getIndices(), subMesh.indexStart, subMesh.indexStart + subMesh.indexCount, subMesh.verticesStart, !!subMesh.getMaterial(), this, this._shouldConvertRHS(), ((_a = subMesh.getMaterial()) === null || _a === void 0 ? void 0 : _a.fillMode) === 7);
    return this;
  }
  /**
   * @internal
   */
  _processCollisionsForSubMeshes(collider, transformMatrix) {
    const subMeshes = this._scene.getCollidingSubMeshCandidates(this, collider);
    const len = subMeshes.length;
    for (let index = 0; index < len; index++) {
      const subMesh = subMeshes.data[index];
      if (len > 1 && !subMesh._checkCollision(collider)) {
        continue;
      }
      this._collideForSubMesh(subMesh, transformMatrix, collider);
    }
    return this;
  }
  /** @internal */
  _shouldConvertRHS() {
    return false;
  }
  /**
   * @internal
   */
  _checkCollision(collider) {
    if (!this.getBoundingInfo()._checkCollision(collider)) {
      return this;
    }
    const collisionsScalingMatrix = TmpVectors.Matrix[0];
    const collisionsTransformMatrix = TmpVectors.Matrix[1];
    Matrix.ScalingToRef(1 / collider._radius.x, 1 / collider._radius.y, 1 / collider._radius.z, collisionsScalingMatrix);
    this.worldMatrixFromCache.multiplyToRef(collisionsScalingMatrix, collisionsTransformMatrix);
    this._processCollisionsForSubMeshes(collider, collisionsTransformMatrix);
    return this;
  }
  // Picking
  /** @internal */
  _generatePointsArray() {
    return false;
  }
  /**
   * Checks if the passed Ray intersects with the mesh. A mesh triangle can be picked both from its front and back sides,
   * irrespective of orientation.
   * @param ray defines the ray to use. It should be in the mesh's LOCAL coordinate space.
   * @param fastCheck defines if fast mode (but less precise) must be used (false by default)
   * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
   * @param onlyBoundingInfo defines a boolean indicating if picking should only happen using bounding info (false by default)
   * @param worldToUse defines the world matrix to use to get the world coordinate of the intersection point
   * @param skipBoundingInfo a boolean indicating if we should skip the bounding info check
   * @returns the picking info
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/interactions/mesh_intersect
   */
  intersects(ray, fastCheck, trianglePredicate, onlyBoundingInfo = false, worldToUse, skipBoundingInfo = false) {
    const pickingInfo = new PickingInfo();
    const className = this.getClassName();
    const intersectionThreshold = className === "InstancedLinesMesh" || className === "LinesMesh" || className === "GreasedLineMesh" ? this.intersectionThreshold : 0;
    const boundingInfo = this.getBoundingInfo();
    if (!this.subMeshes) {
      return pickingInfo;
    }
    if (!skipBoundingInfo && (!ray.intersectsSphere(boundingInfo.boundingSphere, intersectionThreshold) || !ray.intersectsBox(boundingInfo.boundingBox, intersectionThreshold))) {
      return pickingInfo;
    }
    if (onlyBoundingInfo) {
      pickingInfo.hit = skipBoundingInfo ? false : true;
      pickingInfo.pickedMesh = skipBoundingInfo ? null : this;
      pickingInfo.distance = skipBoundingInfo ? 0 : Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
      pickingInfo.subMeshId = 0;
      return pickingInfo;
    }
    if (!this._generatePointsArray()) {
      return pickingInfo;
    }
    let intersectInfo = null;
    const subMeshes = this._scene.getIntersectingSubMeshCandidates(this, ray);
    const len = subMeshes.length;
    let anySubmeshSupportIntersect = false;
    for (let index = 0; index < len; index++) {
      const subMesh = subMeshes.data[index];
      const material = subMesh.getMaterial();
      if (!material) {
        continue;
      }
      if (material.fillMode == 7 || material.fillMode == 0 || material.fillMode == 1 || material.fillMode == 2 || material.fillMode == 4) {
        anySubmeshSupportIntersect = true;
        break;
      }
    }
    if (!anySubmeshSupportIntersect) {
      pickingInfo.hit = true;
      pickingInfo.pickedMesh = this;
      pickingInfo.distance = Vector3.Distance(ray.origin, boundingInfo.boundingSphere.center);
      pickingInfo.subMeshId = -1;
      return pickingInfo;
    }
    for (let index = 0; index < len; index++) {
      const subMesh = subMeshes.data[index];
      if (len > 1 && !skipBoundingInfo && !subMesh.canIntersects(ray)) {
        continue;
      }
      const currentIntersectInfo = subMesh.intersects(ray, this._positions, this.getIndices(), fastCheck, trianglePredicate);
      if (currentIntersectInfo) {
        if (fastCheck || !intersectInfo || currentIntersectInfo.distance < intersectInfo.distance) {
          intersectInfo = currentIntersectInfo;
          intersectInfo.subMeshId = index;
          if (fastCheck) {
            break;
          }
        }
      }
    }
    if (intersectInfo) {
      const world = worldToUse !== null && worldToUse !== void 0 ? worldToUse : this.getWorldMatrix();
      const worldOrigin = TmpVectors.Vector3[0];
      const direction = TmpVectors.Vector3[1];
      Vector3.TransformCoordinatesToRef(ray.origin, world, worldOrigin);
      ray.direction.scaleToRef(intersectInfo.distance, direction);
      const worldDirection = Vector3.TransformNormal(direction, world);
      const pickedPoint = worldDirection.addInPlace(worldOrigin);
      pickingInfo.hit = true;
      pickingInfo.distance = Vector3.Distance(worldOrigin, pickedPoint);
      pickingInfo.pickedPoint = pickedPoint;
      pickingInfo.pickedMesh = this;
      pickingInfo.bu = intersectInfo.bu || 0;
      pickingInfo.bv = intersectInfo.bv || 0;
      pickingInfo.subMeshFaceId = intersectInfo.faceId;
      pickingInfo.faceId = intersectInfo.faceId + subMeshes.data[intersectInfo.subMeshId].indexStart / (this.getClassName().indexOf("LinesMesh") !== -1 ? 2 : 3);
      pickingInfo.subMeshId = intersectInfo.subMeshId;
      return pickingInfo;
    }
    return pickingInfo;
  }
  /**
   * Clones the current mesh
   * @param name defines the mesh name
   * @param newParent defines the new mesh parent
   * @param doNotCloneChildren defines a boolean indicating that children must not be cloned (false by default)
   * @returns the new mesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clone(name47, newParent, doNotCloneChildren) {
    return null;
  }
  /**
   * Disposes all the submeshes of the current meshnp
   * @returns the current mesh
   */
  releaseSubMeshes() {
    if (this.subMeshes) {
      while (this.subMeshes.length) {
        this.subMeshes[0].dispose();
      }
    } else {
      this.subMeshes = [];
    }
    return this;
  }
  /**
   * Releases resources associated with this abstract mesh.
   * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
   * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
   */
  dispose(doNotRecurse, disposeMaterialAndTextures = false) {
    let index;
    const scene = this.getScene();
    if (this._scene.useMaterialMeshMap) {
      if (this._internalAbstractMeshDataInfo._material && this._internalAbstractMeshDataInfo._material.meshMap) {
        this._internalAbstractMeshDataInfo._material.meshMap[this.uniqueId] = void 0;
      }
    }
    scene.freeActiveMeshes();
    scene.freeRenderingGroups();
    if (scene.renderingManager.maintainStateBetweenFrames) {
      scene.renderingManager.restoreDispachedFlags();
    }
    if (this.actionManager !== void 0 && this.actionManager !== null) {
      if (!this._scene.meshes.some((m) => m !== this && m.actionManager === this.actionManager)) {
        this.actionManager.dispose();
      }
      this.actionManager = null;
    }
    this._internalAbstractMeshDataInfo._skeleton = null;
    if (this._transformMatrixTexture) {
      this._transformMatrixTexture.dispose();
      this._transformMatrixTexture = null;
    }
    for (index = 0; index < this._intersectionsInProgress.length; index++) {
      const other = this._intersectionsInProgress[index];
      const pos = other._intersectionsInProgress.indexOf(this);
      other._intersectionsInProgress.splice(pos, 1);
    }
    this._intersectionsInProgress.length = 0;
    const lights = scene.lights;
    lights.forEach((light) => {
      let meshIndex = light.includedOnlyMeshes.indexOf(this);
      if (meshIndex !== -1) {
        light.includedOnlyMeshes.splice(meshIndex, 1);
      }
      meshIndex = light.excludedMeshes.indexOf(this);
      if (meshIndex !== -1) {
        light.excludedMeshes.splice(meshIndex, 1);
      }
      const generators = light.getShadowGenerators();
      if (generators) {
        const iterator = generators.values();
        for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
          const generator = key.value;
          const shadowMap = generator.getShadowMap();
          if (shadowMap && shadowMap.renderList) {
            meshIndex = shadowMap.renderList.indexOf(this);
            if (meshIndex !== -1) {
              shadowMap.renderList.splice(meshIndex, 1);
            }
          }
        }
      }
    });
    if (this.getClassName() !== "InstancedMesh" || this.getClassName() !== "InstancedLinesMesh") {
      this.releaseSubMeshes();
    }
    const engine = scene.getEngine();
    if (this._occlusionQuery !== null) {
      this.isOcclusionQueryInProgress = false;
      engine.deleteQuery(this._occlusionQuery);
      this._occlusionQuery = null;
    }
    engine.wipeCaches();
    scene.removeMesh(this);
    if (this._parentContainer) {
      const index2 = this._parentContainer.meshes.indexOf(this);
      if (index2 > -1) {
        this._parentContainer.meshes.splice(index2, 1);
      }
      this._parentContainer = null;
    }
    if (disposeMaterialAndTextures) {
      if (this.material) {
        if (this.material.getClassName() === "MultiMaterial") {
          this.material.dispose(false, true, true);
        } else {
          this.material.dispose(false, true);
        }
      }
    }
    if (!doNotRecurse) {
      for (index = 0; index < scene.particleSystems.length; index++) {
        if (scene.particleSystems[index].emitter === this) {
          scene.particleSystems[index].dispose();
          index--;
        }
      }
    }
    if (this._internalAbstractMeshDataInfo._facetData.facetDataEnabled) {
      this.disableFacetData();
    }
    this._uniformBuffer.dispose();
    this.onAfterWorldMatrixUpdateObservable.clear();
    this.onCollideObservable.clear();
    this.onCollisionPositionChangeObservable.clear();
    this.onRebuildObservable.clear();
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }
  /**
   * Adds the passed mesh as a child to the current mesh
   * @param mesh defines the child mesh
   * @param preserveScalingSign if true, keep scaling sign of child. Otherwise, scaling sign might change.
   * @returns the current mesh
   */
  addChild(mesh, preserveScalingSign = false) {
    mesh.setParent(this, preserveScalingSign);
    return this;
  }
  /**
   * Removes the passed mesh from the current mesh children list
   * @param mesh defines the child mesh
   * @param preserveScalingSign if true, keep scaling sign of child. Otherwise, scaling sign might change.
   * @returns the current mesh
   */
  removeChild(mesh, preserveScalingSign = false) {
    mesh.setParent(null, preserveScalingSign);
    return this;
  }
  // Facet data
  /** @internal */
  _initFacetData() {
    const data = this._internalAbstractMeshDataInfo._facetData;
    if (!data.facetNormals) {
      data.facetNormals = [];
    }
    if (!data.facetPositions) {
      data.facetPositions = [];
    }
    if (!data.facetPartitioning) {
      data.facetPartitioning = new Array();
    }
    data.facetNb = this.getIndices().length / 3 | 0;
    data.partitioningSubdivisions = data.partitioningSubdivisions ? data.partitioningSubdivisions : 10;
    data.partitioningBBoxRatio = data.partitioningBBoxRatio ? data.partitioningBBoxRatio : 1.01;
    for (let f = 0; f < data.facetNb; f++) {
      data.facetNormals[f] = Vector3.Zero();
      data.facetPositions[f] = Vector3.Zero();
    }
    data.facetDataEnabled = true;
    return this;
  }
  /**
   * Updates the mesh facetData arrays and the internal partitioning when the mesh is morphed or updated.
   * This method can be called within the render loop.
   * You don't need to call this method by yourself in the render loop when you update/morph a mesh with the methods CreateXXX() as they automatically manage this computation
   * @returns the current mesh
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  updateFacetData() {
    const data = this._internalAbstractMeshDataInfo._facetData;
    if (!data.facetDataEnabled) {
      this._initFacetData();
    }
    const positions = this.getVerticesData(VertexBuffer.PositionKind);
    const indices = this.getIndices();
    const normals = this.getVerticesData(VertexBuffer.NormalKind);
    const bInfo = this.getBoundingInfo();
    if (data.facetDepthSort && !data.facetDepthSortEnabled) {
      data.facetDepthSortEnabled = true;
      if (indices instanceof Uint16Array) {
        data.depthSortedIndices = new Uint16Array(indices);
      } else if (indices instanceof Uint32Array) {
        data.depthSortedIndices = new Uint32Array(indices);
      } else {
        let needs32bits = false;
        for (let i = 0; i < indices.length; i++) {
          if (indices[i] > 65535) {
            needs32bits = true;
            break;
          }
        }
        if (needs32bits) {
          data.depthSortedIndices = new Uint32Array(indices);
        } else {
          data.depthSortedIndices = new Uint16Array(indices);
        }
      }
      data.facetDepthSortFunction = function(f1, f2) {
        return f2.sqDistance - f1.sqDistance;
      };
      if (!data.facetDepthSortFrom) {
        const camera = this.getScene().activeCamera;
        data.facetDepthSortFrom = camera ? camera.position : Vector3.Zero();
      }
      data.depthSortedFacets = [];
      for (let f = 0; f < data.facetNb; f++) {
        const depthSortedFacet = { ind: f * 3, sqDistance: 0 };
        data.depthSortedFacets.push(depthSortedFacet);
      }
      data.invertedMatrix = Matrix.Identity();
      data.facetDepthSortOrigin = Vector3.Zero();
    }
    data.bbSize.x = bInfo.maximum.x - bInfo.minimum.x > Epsilon ? bInfo.maximum.x - bInfo.minimum.x : Epsilon;
    data.bbSize.y = bInfo.maximum.y - bInfo.minimum.y > Epsilon ? bInfo.maximum.y - bInfo.minimum.y : Epsilon;
    data.bbSize.z = bInfo.maximum.z - bInfo.minimum.z > Epsilon ? bInfo.maximum.z - bInfo.minimum.z : Epsilon;
    let bbSizeMax = data.bbSize.x > data.bbSize.y ? data.bbSize.x : data.bbSize.y;
    bbSizeMax = bbSizeMax > data.bbSize.z ? bbSizeMax : data.bbSize.z;
    data.subDiv.max = data.partitioningSubdivisions;
    data.subDiv.X = Math.floor(data.subDiv.max * data.bbSize.x / bbSizeMax);
    data.subDiv.Y = Math.floor(data.subDiv.max * data.bbSize.y / bbSizeMax);
    data.subDiv.Z = Math.floor(data.subDiv.max * data.bbSize.z / bbSizeMax);
    data.subDiv.X = data.subDiv.X < 1 ? 1 : data.subDiv.X;
    data.subDiv.Y = data.subDiv.Y < 1 ? 1 : data.subDiv.Y;
    data.subDiv.Z = data.subDiv.Z < 1 ? 1 : data.subDiv.Z;
    data.facetParameters.facetNormals = this.getFacetLocalNormals();
    data.facetParameters.facetPositions = this.getFacetLocalPositions();
    data.facetParameters.facetPartitioning = this.getFacetLocalPartitioning();
    data.facetParameters.bInfo = bInfo;
    data.facetParameters.bbSize = data.bbSize;
    data.facetParameters.subDiv = data.subDiv;
    data.facetParameters.ratio = this.partitioningBBoxRatio;
    data.facetParameters.depthSort = data.facetDepthSort;
    if (data.facetDepthSort && data.facetDepthSortEnabled) {
      this.computeWorldMatrix(true);
      this._worldMatrix.invertToRef(data.invertedMatrix);
      Vector3.TransformCoordinatesToRef(data.facetDepthSortFrom, data.invertedMatrix, data.facetDepthSortOrigin);
      data.facetParameters.distanceTo = data.facetDepthSortOrigin;
    }
    data.facetParameters.depthSortedFacets = data.depthSortedFacets;
    if (normals) {
      VertexData.ComputeNormals(positions, indices, normals, data.facetParameters);
    }
    if (data.facetDepthSort && data.facetDepthSortEnabled) {
      data.depthSortedFacets.sort(data.facetDepthSortFunction);
      const l = data.depthSortedIndices.length / 3 | 0;
      for (let f = 0; f < l; f++) {
        const sind = data.depthSortedFacets[f].ind;
        data.depthSortedIndices[f * 3] = indices[sind];
        data.depthSortedIndices[f * 3 + 1] = indices[sind + 1];
        data.depthSortedIndices[f * 3 + 2] = indices[sind + 2];
      }
      this.updateIndices(data.depthSortedIndices, void 0, true);
    }
    return this;
  }
  /**
   * Returns the facetLocalNormals array.
   * The normals are expressed in the mesh local spac
   * @returns an array of Vector3
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetLocalNormals() {
    const facetData = this._internalAbstractMeshDataInfo._facetData;
    if (!facetData.facetNormals) {
      this.updateFacetData();
    }
    return facetData.facetNormals;
  }
  /**
   * Returns the facetLocalPositions array.
   * The facet positions are expressed in the mesh local space
   * @returns an array of Vector3
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetLocalPositions() {
    const facetData = this._internalAbstractMeshDataInfo._facetData;
    if (!facetData.facetPositions) {
      this.updateFacetData();
    }
    return facetData.facetPositions;
  }
  /**
   * Returns the facetLocalPartitioning array
   * @returns an array of array of numbers
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetLocalPartitioning() {
    const facetData = this._internalAbstractMeshDataInfo._facetData;
    if (!facetData.facetPartitioning) {
      this.updateFacetData();
    }
    return facetData.facetPartitioning;
  }
  /**
   * Returns the i-th facet position in the world system.
   * This method allocates a new Vector3 per call
   * @param i defines the facet index
   * @returns a new Vector3
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetPosition(i) {
    const pos = Vector3.Zero();
    this.getFacetPositionToRef(i, pos);
    return pos;
  }
  /**
   * Sets the reference Vector3 with the i-th facet position in the world system
   * @param i defines the facet index
   * @param ref defines the target vector
   * @returns the current mesh
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetPositionToRef(i, ref) {
    const localPos = this.getFacetLocalPositions()[i];
    const world = this.getWorldMatrix();
    Vector3.TransformCoordinatesToRef(localPos, world, ref);
    return this;
  }
  /**
   * Returns the i-th facet normal in the world system.
   * This method allocates a new Vector3 per call
   * @param i defines the facet index
   * @returns a new Vector3
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetNormal(i) {
    const norm = Vector3.Zero();
    this.getFacetNormalToRef(i, norm);
    return norm;
  }
  /**
   * Sets the reference Vector3 with the i-th facet normal in the world system
   * @param i defines the facet index
   * @param ref defines the target vector
   * @returns the current mesh
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetNormalToRef(i, ref) {
    const localNorm = this.getFacetLocalNormals()[i];
    Vector3.TransformNormalToRef(localNorm, this.getWorldMatrix(), ref);
    return this;
  }
  /**
   * Returns the facets (in an array) in the same partitioning block than the one the passed coordinates are located (expressed in the mesh local system)
   * @param x defines x coordinate
   * @param y defines y coordinate
   * @param z defines z coordinate
   * @returns the array of facet indexes
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetsAtLocalCoordinates(x, y, z) {
    const bInfo = this.getBoundingInfo();
    const data = this._internalAbstractMeshDataInfo._facetData;
    const ox = Math.floor((x - bInfo.minimum.x * data.partitioningBBoxRatio) * data.subDiv.X * data.partitioningBBoxRatio / data.bbSize.x);
    const oy = Math.floor((y - bInfo.minimum.y * data.partitioningBBoxRatio) * data.subDiv.Y * data.partitioningBBoxRatio / data.bbSize.y);
    const oz = Math.floor((z - bInfo.minimum.z * data.partitioningBBoxRatio) * data.subDiv.Z * data.partitioningBBoxRatio / data.bbSize.z);
    if (ox < 0 || ox > data.subDiv.max || oy < 0 || oy > data.subDiv.max || oz < 0 || oz > data.subDiv.max) {
      return null;
    }
    return data.facetPartitioning[ox + data.subDiv.max * oy + data.subDiv.max * data.subDiv.max * oz];
  }
  /**
   * Returns the closest mesh facet index at (x,y,z) World coordinates, null if not found
   * @param x defines x coordinate
   * @param y defines y coordinate
   * @param z defines z coordinate
   * @param projected sets as the (x,y,z) world projection on the facet
   * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
   * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
   * @returns the face index if found (or null instead)
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getClosestFacetAtCoordinates(x, y, z, projected, checkFace = false, facing = true) {
    const world = this.getWorldMatrix();
    const invMat = TmpVectors.Matrix[5];
    world.invertToRef(invMat);
    const invVect = TmpVectors.Vector3[8];
    Vector3.TransformCoordinatesFromFloatsToRef(x, y, z, invMat, invVect);
    const closest = this.getClosestFacetAtLocalCoordinates(invVect.x, invVect.y, invVect.z, projected, checkFace, facing);
    if (projected) {
      Vector3.TransformCoordinatesFromFloatsToRef(projected.x, projected.y, projected.z, world, projected);
    }
    return closest;
  }
  /**
   * Returns the closest mesh facet index at (x,y,z) local coordinates, null if not found
   * @param x defines x coordinate
   * @param y defines y coordinate
   * @param z defines z coordinate
   * @param projected sets as the (x,y,z) local projection on the facet
   * @param checkFace if true (default false), only the facet "facing" to (x,y,z) or only the ones "turning their backs", according to the parameter "facing" are returned
   * @param facing if facing and checkFace are true, only the facet "facing" to (x, y, z) are returned : positive dot (x, y, z) * facet position. If facing si false and checkFace is true, only the facet "turning their backs" to (x, y, z) are returned : negative dot (x, y, z) * facet position
   * @returns the face index if found (or null instead)
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getClosestFacetAtLocalCoordinates(x, y, z, projected, checkFace = false, facing = true) {
    let closest = null;
    let tmpx = 0;
    let tmpy = 0;
    let tmpz = 0;
    let d = 0;
    let t0 = 0;
    let projx = 0;
    let projy = 0;
    let projz = 0;
    const facetPositions = this.getFacetLocalPositions();
    const facetNormals = this.getFacetLocalNormals();
    const facetsInBlock = this.getFacetsAtLocalCoordinates(x, y, z);
    if (!facetsInBlock) {
      return null;
    }
    let shortest = Number.MAX_VALUE;
    let tmpDistance = shortest;
    let fib;
    let norm;
    let p0;
    for (let idx = 0; idx < facetsInBlock.length; idx++) {
      fib = facetsInBlock[idx];
      norm = facetNormals[fib];
      p0 = facetPositions[fib];
      d = (x - p0.x) * norm.x + (y - p0.y) * norm.y + (z - p0.z) * norm.z;
      if (!checkFace || checkFace && facing && d >= 0 || checkFace && !facing && d <= 0) {
        d = norm.x * p0.x + norm.y * p0.y + norm.z * p0.z;
        t0 = -(norm.x * x + norm.y * y + norm.z * z - d) / (norm.x * norm.x + norm.y * norm.y + norm.z * norm.z);
        projx = x + norm.x * t0;
        projy = y + norm.y * t0;
        projz = z + norm.z * t0;
        tmpx = projx - x;
        tmpy = projy - y;
        tmpz = projz - z;
        tmpDistance = tmpx * tmpx + tmpy * tmpy + tmpz * tmpz;
        if (tmpDistance < shortest) {
          shortest = tmpDistance;
          closest = fib;
          if (projected) {
            projected.x = projx;
            projected.y = projy;
            projected.z = projz;
          }
        }
      }
    }
    return closest;
  }
  /**
   * Returns the object "parameter" set with all the expected parameters for facetData computation by ComputeNormals()
   * @returns the parameters
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  getFacetDataParameters() {
    return this._internalAbstractMeshDataInfo._facetData.facetParameters;
  }
  /**
   * Disables the feature FacetData and frees the related memory
   * @returns the current mesh
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/facetData
   */
  disableFacetData() {
    const facetData = this._internalAbstractMeshDataInfo._facetData;
    if (facetData.facetDataEnabled) {
      facetData.facetDataEnabled = false;
      facetData.facetPositions = [];
      facetData.facetNormals = [];
      facetData.facetPartitioning = new Array();
      facetData.facetParameters = null;
      facetData.depthSortedIndices = new Uint32Array(0);
    }
    return this;
  }
  /**
   * Updates the AbstractMesh indices array
   * @param indices defines the data source
   * @param offset defines the offset in the index buffer where to store the new data (can be null)
   * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
   * @returns the current mesh
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateIndices(indices, offset, gpuMemoryOnly = false) {
    return this;
  }
  /**
   * Creates new normals data for the mesh
   * @param updatable defines if the normal vertex buffer must be flagged as updatable
   * @returns the current mesh
   */
  createNormals(updatable) {
    const positions = this.getVerticesData(VertexBuffer.PositionKind);
    const indices = this.getIndices();
    let normals;
    if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      normals = this.getVerticesData(VertexBuffer.NormalKind);
    } else {
      normals = [];
    }
    VertexData.ComputeNormals(positions, indices, normals, { useRightHandedSystem: this.getScene().useRightHandedSystem });
    this.setVerticesData(VertexBuffer.NormalKind, normals, updatable);
    return this;
  }
  /**
   * Align the mesh with a normal
   * @param normal defines the normal to use
   * @param upDirection can be used to redefined the up vector to use (will use the (0, 1, 0) by default)
   * @returns the current mesh
   */
  alignWithNormal(normal, upDirection) {
    if (!upDirection) {
      upDirection = Axis.Y;
    }
    const axisX = TmpVectors.Vector3[0];
    const axisZ = TmpVectors.Vector3[1];
    Vector3.CrossToRef(upDirection, normal, axisZ);
    Vector3.CrossToRef(normal, axisZ, axisX);
    if (this.rotationQuaternion) {
      Quaternion.RotationQuaternionFromAxisToRef(axisX, normal, axisZ, this.rotationQuaternion);
    } else {
      Vector3.RotationFromAxisToRef(axisX, normal, axisZ, this.rotation);
    }
    return this;
  }
  /** @internal */
  _checkOcclusionQuery() {
    return false;
  }
  /**
   * Disables the mesh edge rendering mode
   * @returns the currentAbstractMesh
   */
  disableEdgesRendering() {
    throw _WarnImport("EdgesRenderer");
  }
  /**
   * Enables the edge rendering mode on the mesh.
   * This mode makes the mesh edges visible
   * @param epsilon defines the maximal distance between two angles to detect a face
   * @param checkVerticesInsteadOfIndices indicates that we should check vertex list directly instead of faces
   * @param options options to the edge renderer
   * @returns the currentAbstractMesh
   * @see https://www.babylonjs-playground.com/#19O9TU#0
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enableEdgesRendering(epsilon, checkVerticesInsteadOfIndices, options) {
    throw _WarnImport("EdgesRenderer");
  }
  /**
   * This function returns all of the particle systems in the scene that use the mesh as an emitter.
   * @returns an array of particle systems in the scene that use the mesh as an emitter
   */
  getConnectedParticleSystems() {
    return this._scene.particleSystems.filter((particleSystem) => particleSystem.emitter === this);
  }
};
AbstractMesh.OCCLUSION_TYPE_NONE = 0;
AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC = 1;
AbstractMesh.OCCLUSION_TYPE_STRICT = 2;
AbstractMesh.OCCLUSION_ALGORITHM_TYPE_ACCURATE = 0;
AbstractMesh.OCCLUSION_ALGORITHM_TYPE_CONSERVATIVE = 1;
AbstractMesh.CULLINGSTRATEGY_STANDARD = 0;
AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY = 1;
AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION = 2;
AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY = 3;
RegisterClass("BABYLON.AbstractMesh", AbstractMesh);

// node_modules/@babylonjs/core/Materials/materialPluginEvent.js
var MaterialPluginEvent;
(function(MaterialPluginEvent2) {
  MaterialPluginEvent2[MaterialPluginEvent2["Created"] = 1] = "Created";
  MaterialPluginEvent2[MaterialPluginEvent2["Disposed"] = 2] = "Disposed";
  MaterialPluginEvent2[MaterialPluginEvent2["GetDefineNames"] = 4] = "GetDefineNames";
  MaterialPluginEvent2[MaterialPluginEvent2["PrepareUniformBuffer"] = 8] = "PrepareUniformBuffer";
  MaterialPluginEvent2[MaterialPluginEvent2["IsReadyForSubMesh"] = 16] = "IsReadyForSubMesh";
  MaterialPluginEvent2[MaterialPluginEvent2["PrepareDefines"] = 32] = "PrepareDefines";
  MaterialPluginEvent2[MaterialPluginEvent2["BindForSubMesh"] = 64] = "BindForSubMesh";
  MaterialPluginEvent2[MaterialPluginEvent2["PrepareEffect"] = 128] = "PrepareEffect";
  MaterialPluginEvent2[MaterialPluginEvent2["GetAnimatables"] = 256] = "GetAnimatables";
  MaterialPluginEvent2[MaterialPluginEvent2["GetActiveTextures"] = 512] = "GetActiveTextures";
  MaterialPluginEvent2[MaterialPluginEvent2["HasTexture"] = 1024] = "HasTexture";
  MaterialPluginEvent2[MaterialPluginEvent2["FillRenderTargetTextures"] = 2048] = "FillRenderTargetTextures";
  MaterialPluginEvent2[MaterialPluginEvent2["HasRenderTargetTextures"] = 4096] = "HasRenderTargetTextures";
  MaterialPluginEvent2[MaterialPluginEvent2["HardBindForSubMesh"] = 8192] = "HardBindForSubMesh";
})(MaterialPluginEvent || (MaterialPluginEvent = {}));

// node_modules/@babylonjs/core/Materials/materialStencilState.js
var MaterialStencilState = class {
  /**
   * Creates a material stencil state instance
   */
  constructor() {
    this.reset();
  }
  /**
   * Resets all the stencil states to default values
   */
  reset() {
    this.enabled = false;
    this.mask = 255;
    this.func = 519;
    this.funcRef = 1;
    this.funcMask = 255;
    this.opStencilFail = 7680;
    this.opDepthFail = 7680;
    this.opStencilDepthPass = 7681;
  }
  /**
   * Gets or sets the stencil function
   */
  get func() {
    return this._func;
  }
  set func(value) {
    this._func = value;
  }
  /**
   * Gets or sets the stencil function reference
   */
  get funcRef() {
    return this._funcRef;
  }
  set funcRef(value) {
    this._funcRef = value;
  }
  /**
   * Gets or sets the stencil function mask
   */
  get funcMask() {
    return this._funcMask;
  }
  set funcMask(value) {
    this._funcMask = value;
  }
  /**
   * Gets or sets the operation when the stencil test fails
   */
  get opStencilFail() {
    return this._opStencilFail;
  }
  set opStencilFail(value) {
    this._opStencilFail = value;
  }
  /**
   * Gets or sets the operation when the depth test fails
   */
  get opDepthFail() {
    return this._opDepthFail;
  }
  set opDepthFail(value) {
    this._opDepthFail = value;
  }
  /**
   * Gets or sets the operation when the stencil+depth test succeeds
   */
  get opStencilDepthPass() {
    return this._opStencilDepthPass;
  }
  set opStencilDepthPass(value) {
    this._opStencilDepthPass = value;
  }
  /**
   * Gets or sets the stencil mask
   */
  get mask() {
    return this._mask;
  }
  set mask(value) {
    this._mask = value;
  }
  /**
   * Enables or disables the stencil test
   */
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  /**
   * Get the current class name, useful for serialization or dynamic coding.
   * @returns "MaterialStencilState"
   */
  getClassName() {
    return "MaterialStencilState";
  }
  /**
   * Makes a duplicate of the current configuration into another one.
   * @param stencilState defines stencil state where to copy the info
   */
  copyTo(stencilState) {
    SerializationHelper.Clone(() => stencilState, this);
  }
  /**
   * Serializes this stencil configuration.
   * @returns - An object with the serialized config.
   */
  serialize() {
    return SerializationHelper.Serialize(this);
  }
  /**
   * Parses a stencil state configuration from a serialized object.
   * @param source - Serialized object.
   * @param scene Defines the scene we are parsing for
   * @param rootUrl Defines the rootUrl to load from
   */
  parse(source, scene, rootUrl) {
    SerializationHelper.Parse(() => this, source, scene, rootUrl);
  }
};
__decorate([
  serialize()
], MaterialStencilState.prototype, "func", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "funcRef", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "funcMask", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "opStencilFail", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "opDepthFail", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "opStencilDepthPass", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "mask", null);
__decorate([
  serialize()
], MaterialStencilState.prototype, "enabled", null);

// node_modules/@babylonjs/core/Materials/material.js
var Material = class _Material {
  /**
   * If the material can be rendered to several textures with MRT extension
   */
  get canRenderToMRT() {
    return false;
  }
  /**
   * Sets the alpha value of the material
   */
  set alpha(value) {
    if (this._alpha === value) {
      return;
    }
    const oldValue = this._alpha;
    this._alpha = value;
    if (oldValue === 1 || value === 1) {
      this.markAsDirty(_Material.MiscDirtyFlag + _Material.PrePassDirtyFlag);
    }
  }
  /**
   * Gets the alpha value of the material
   */
  get alpha() {
    return this._alpha;
  }
  /**
   * Sets the culling state (true to enable culling, false to disable)
   */
  set backFaceCulling(value) {
    if (this._backFaceCulling === value) {
      return;
    }
    this._backFaceCulling = value;
    this.markAsDirty(_Material.TextureDirtyFlag);
  }
  /**
   * Gets the culling state
   */
  get backFaceCulling() {
    return this._backFaceCulling;
  }
  /**
   * Sets the type of faces that should be culled (true for back faces, false for front faces)
   */
  set cullBackFaces(value) {
    if (this._cullBackFaces === value) {
      return;
    }
    this._cullBackFaces = value;
    this.markAsDirty(_Material.TextureDirtyFlag);
  }
  /**
   * Gets the type of faces that should be culled
   */
  get cullBackFaces() {
    return this._cullBackFaces;
  }
  /**
   * Block the dirty-mechanism for this specific material
   * When set to false after being true the material will be marked as dirty.
   */
  get blockDirtyMechanism() {
    return this._blockDirtyMechanism;
  }
  set blockDirtyMechanism(value) {
    if (this._blockDirtyMechanism === value) {
      return;
    }
    this._blockDirtyMechanism = value;
    if (!value) {
      this.markDirty();
    }
  }
  /**
   * This allows you to modify the material without marking it as dirty after every change.
   * This function should be used if you need to make more than one dirty-enabling change to the material - adding a texture, setting a new fill mode and so on.
   * The callback will pass the material as an argument, so you can make your changes to it.
   * @param callback the callback to be executed that will update the material
   */
  atomicMaterialsUpdate(callback) {
    this.blockDirtyMechanism = true;
    try {
      callback(this);
    } finally {
      this.blockDirtyMechanism = false;
    }
  }
  /**
   * Gets a boolean indicating that current material needs to register RTT
   */
  get hasRenderTargetTextures() {
    this._eventInfo.hasRenderTargetTextures = false;
    this._callbackPluginEventHasRenderTargetTextures(this._eventInfo);
    return this._eventInfo.hasRenderTargetTextures;
  }
  /**
   * Called during a dispose event
   */
  set onDispose(callback) {
    if (this._onDisposeObserver) {
      this.onDisposeObservable.remove(this._onDisposeObserver);
    }
    this._onDisposeObserver = this.onDisposeObservable.add(callback);
  }
  /**
   * An event triggered when the material is bound
   */
  get onBindObservable() {
    if (!this._onBindObservable) {
      this._onBindObservable = new Observable();
    }
    return this._onBindObservable;
  }
  /**
   * Called during a bind event
   */
  set onBind(callback) {
    if (this._onBindObserver) {
      this.onBindObservable.remove(this._onBindObserver);
    }
    this._onBindObserver = this.onBindObservable.add(callback);
  }
  /**
   * An event triggered when the material is unbound
   */
  get onUnBindObservable() {
    if (!this._onUnBindObservable) {
      this._onUnBindObservable = new Observable();
    }
    return this._onUnBindObservable;
  }
  /**
   * An event triggered when the effect is (re)created
   */
  get onEffectCreatedObservable() {
    if (!this._onEffectCreatedObservable) {
      this._onEffectCreatedObservable = new Observable();
    }
    return this._onEffectCreatedObservable;
  }
  /**
   * Sets the value of the alpha mode.
   *
   * | Value | Type | Description |
   * | --- | --- | --- |
   * | 0 | ALPHA_DISABLE |   |
   * | 1 | ALPHA_ADD |   |
   * | 2 | ALPHA_COMBINE |   |
   * | 3 | ALPHA_SUBTRACT |   |
   * | 4 | ALPHA_MULTIPLY |   |
   * | 5 | ALPHA_MAXIMIZED |   |
   * | 6 | ALPHA_ONEONE |   |
   * | 7 | ALPHA_PREMULTIPLIED |   |
   * | 8 | ALPHA_PREMULTIPLIED_PORTERDUFF |   |
   * | 9 | ALPHA_INTERPOLATE |   |
   * | 10 | ALPHA_SCREENMODE |   |
   *
   */
  set alphaMode(value) {
    if (this._alphaMode === value) {
      return;
    }
    this._alphaMode = value;
    this.markAsDirty(_Material.TextureDirtyFlag);
  }
  /**
   * Gets the value of the alpha mode
   */
  get alphaMode() {
    return this._alphaMode;
  }
  /**
   * Sets the need depth pre-pass value
   */
  set needDepthPrePass(value) {
    if (this._needDepthPrePass === value) {
      return;
    }
    this._needDepthPrePass = value;
    if (this._needDepthPrePass) {
      this.checkReadyOnEveryCall = true;
    }
  }
  /**
   * Gets the depth pre-pass value
   */
  get needDepthPrePass() {
    return this._needDepthPrePass;
  }
  /**
   * Can this material render to prepass
   */
  get isPrePassCapable() {
    return false;
  }
  /**
   * Sets the state for enabling fog
   */
  set fogEnabled(value) {
    if (this._fogEnabled === value) {
      return;
    }
    this._fogEnabled = value;
    this.markAsDirty(_Material.MiscDirtyFlag);
  }
  /**
   * Gets the value of the fog enabled state
   */
  get fogEnabled() {
    return this._fogEnabled;
  }
  get wireframe() {
    switch (this._fillMode) {
      case _Material.WireFrameFillMode:
      case _Material.LineListDrawMode:
      case _Material.LineLoopDrawMode:
      case _Material.LineStripDrawMode:
        return true;
    }
    return this._scene.forceWireframe;
  }
  /**
   * Sets the state of wireframe mode
   */
  set wireframe(value) {
    this.fillMode = value ? _Material.WireFrameFillMode : _Material.TriangleFillMode;
  }
  /**
   * Gets the value specifying if point clouds are enabled
   */
  get pointsCloud() {
    switch (this._fillMode) {
      case _Material.PointFillMode:
      case _Material.PointListDrawMode:
        return true;
    }
    return this._scene.forcePointsCloud;
  }
  /**
   * Sets the state of point cloud mode
   */
  set pointsCloud(value) {
    this.fillMode = value ? _Material.PointFillMode : _Material.TriangleFillMode;
  }
  /**
   * Gets the material fill mode
   */
  get fillMode() {
    return this._fillMode;
  }
  /**
   * Sets the material fill mode
   */
  set fillMode(value) {
    if (this._fillMode === value) {
      return;
    }
    this._fillMode = value;
    this.markAsDirty(_Material.MiscDirtyFlag);
  }
  /**
   * In case the depth buffer does not allow enough depth precision for your scene (might be the case in large scenes)
   * You can try switching to logarithmic depth.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/advanced/logarithmicDepthBuffer
   */
  get useLogarithmicDepth() {
    return this._useLogarithmicDepth;
  }
  set useLogarithmicDepth(value) {
    const fragmentDepthSupported = this.getScene().getEngine().getCaps().fragmentDepthSupported;
    if (value && !fragmentDepthSupported) {
      Logger.Warn("Logarithmic depth has been requested for a material on a device that doesn't support it.");
    }
    this._useLogarithmicDepth = value && fragmentDepthSupported;
    this._markAllSubMeshesAsMiscDirty();
  }
  /** @internal */
  _getDrawWrapper() {
    return this._drawWrapper;
  }
  /**
   * @internal
   */
  _setDrawWrapper(drawWrapper) {
    this._drawWrapper = drawWrapper;
  }
  /**
   * Creates a material instance
   * @param name defines the name of the material
   * @param scene defines the scene to reference
   * @param doNotAdd specifies if the material should be added to the scene
   */
  constructor(name47, scene, doNotAdd) {
    this.shadowDepthWrapper = null;
    this.allowShaderHotSwapping = true;
    this.metadata = null;
    this.reservedDataStore = null;
    this.checkReadyOnEveryCall = false;
    this.checkReadyOnlyOnce = false;
    this.state = "";
    this._alpha = 1;
    this._backFaceCulling = true;
    this._cullBackFaces = true;
    this._blockDirtyMechanism = false;
    this.onCompiled = null;
    this.onError = null;
    this.getRenderTargetTextures = null;
    this.doNotSerialize = false;
    this._storeEffectOnSubMeshes = false;
    this.animations = null;
    this.onDisposeObservable = new Observable();
    this._onDisposeObserver = null;
    this._onUnBindObservable = null;
    this._onBindObserver = null;
    this._alphaMode = 2;
    this._needDepthPrePass = false;
    this.disableDepthWrite = false;
    this.disableColorWrite = false;
    this.forceDepthWrite = false;
    this.depthFunction = 0;
    this.separateCullingPass = false;
    this._fogEnabled = true;
    this.pointSize = 1;
    this.zOffset = 0;
    this.zOffsetUnits = 0;
    this.stencil = new MaterialStencilState();
    this._useUBO = false;
    this._fillMode = _Material.TriangleFillMode;
    this._cachedDepthWriteState = false;
    this._cachedColorWriteState = false;
    this._cachedDepthFunctionState = 0;
    this._indexInSceneMaterialArray = -1;
    this.meshMap = null;
    this._parentContainer = null;
    this._uniformBufferLayoutBuilt = false;
    this._eventInfo = {};
    this._callbackPluginEventGeneric = () => void 0;
    this._callbackPluginEventIsReadyForSubMesh = () => void 0;
    this._callbackPluginEventPrepareDefines = () => void 0;
    this._callbackPluginEventPrepareDefinesBeforeAttributes = () => void 0;
    this._callbackPluginEventHardBindForSubMesh = () => void 0;
    this._callbackPluginEventBindForSubMesh = () => void 0;
    this._callbackPluginEventHasRenderTargetTextures = () => void 0;
    this._callbackPluginEventFillRenderTargetTextures = () => void 0;
    this._forceAlphaTest = false;
    this._transparencyMode = null;
    this.name = name47;
    const setScene = scene || EngineStore.LastCreatedScene;
    if (!setScene) {
      return;
    }
    this._scene = setScene;
    this._dirtyCallbacks = {};
    this._dirtyCallbacks[1] = this._markAllSubMeshesAsTexturesDirty.bind(this);
    this._dirtyCallbacks[2] = this._markAllSubMeshesAsLightsDirty.bind(this);
    this._dirtyCallbacks[4] = this._markAllSubMeshesAsFresnelDirty.bind(this);
    this._dirtyCallbacks[8] = this._markAllSubMeshesAsAttributesDirty.bind(this);
    this._dirtyCallbacks[16] = this._markAllSubMeshesAsMiscDirty.bind(this);
    this._dirtyCallbacks[32] = this._markAllSubMeshesAsPrePassDirty.bind(this);
    this._dirtyCallbacks[63] = this._markAllSubMeshesAsAllDirty.bind(this);
    this.id = name47 || Tools.RandomId();
    this.uniqueId = this._scene.getUniqueId();
    this._materialContext = this._scene.getEngine().createMaterialContext();
    this._drawWrapper = new DrawWrapper(this._scene.getEngine(), false);
    this._drawWrapper.materialContext = this._materialContext;
    if (this._scene.useRightHandedSystem) {
      this.sideOrientation = _Material.ClockWiseSideOrientation;
    } else {
      this.sideOrientation = _Material.CounterClockWiseSideOrientation;
    }
    this._uniformBuffer = new UniformBuffer(this._scene.getEngine(), void 0, void 0, name47);
    this._useUBO = this.getScene().getEngine().supportsUniformBuffers;
    if (!doNotAdd) {
      this._scene.addMaterial(this);
    }
    if (this._scene.useMaterialMeshMap) {
      this.meshMap = {};
    }
    _Material.OnEventObservable.notifyObservers(this, MaterialPluginEvent.Created);
  }
  /**
   * Returns a string representation of the current material
   * @param fullDetails defines a boolean indicating which levels of logging is desired
   * @returns a string with material information
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toString(fullDetails) {
    const ret = "Name: " + this.name;
    return ret;
  }
  /**
   * Gets the class name of the material
   * @returns a string with the class name of the material
   */
  getClassName() {
    return "Material";
  }
  /** @internal */
  get _isMaterial() {
    return true;
  }
  /**
   * Specifies if updates for the material been locked
   */
  get isFrozen() {
    return this.checkReadyOnlyOnce;
  }
  /**
   * Locks updates for the material
   */
  freeze() {
    this.markDirty();
    this.checkReadyOnlyOnce = true;
  }
  /**
   * Unlocks updates for the material
   */
  unfreeze() {
    this.markDirty();
    this.checkReadyOnlyOnce = false;
  }
  /**
   * Specifies if the material is ready to be used
   * @param mesh defines the mesh to check
   * @param useInstances specifies if instances should be used
   * @returns a boolean indicating if the material is ready to be used
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isReady(mesh, useInstances) {
    return true;
  }
  /**
   * Specifies that the submesh is ready to be used
   * @param mesh defines the mesh to check
   * @param subMesh defines which submesh to check
   * @param useInstances specifies that instances should be used
   * @returns a boolean indicating that the submesh is ready or not
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isReadyForSubMesh(mesh, subMesh, useInstances) {
    const defines = subMesh.materialDefines;
    if (!defines) {
      return false;
    }
    this._eventInfo.isReadyForSubMesh = true;
    this._eventInfo.defines = defines;
    this._callbackPluginEventIsReadyForSubMesh(this._eventInfo);
    return this._eventInfo.isReadyForSubMesh;
  }
  /**
   * Returns the material effect
   * @returns the effect associated with the material
   */
  getEffect() {
    return this._drawWrapper.effect;
  }
  /**
   * Returns the current scene
   * @returns a Scene
   */
  getScene() {
    return this._scene;
  }
  /**
   * Gets the current transparency mode.
   */
  get transparencyMode() {
    return this._transparencyMode;
  }
  /**
   * Sets the transparency mode of the material.
   *
   * | Value | Type                                | Description |
   * | ----- | ----------------------------------- | ----------- |
   * | 0     | OPAQUE                              |             |
   * | 1     | ALPHATEST                           |             |
   * | 2     | ALPHABLEND                          |             |
   * | 3     | ALPHATESTANDBLEND                   |             |
   *
   */
  set transparencyMode(value) {
    if (this._transparencyMode === value) {
      return;
    }
    this._transparencyMode = value;
    this._forceAlphaTest = value === _Material.MATERIAL_ALPHATESTANDBLEND;
    this._markAllSubMeshesAsTexturesAndMiscDirty();
  }
  /**
   * Returns true if alpha blending should be disabled.
   */
  get _disableAlphaBlending() {
    return this._transparencyMode === _Material.MATERIAL_OPAQUE || this._transparencyMode === _Material.MATERIAL_ALPHATEST;
  }
  /**
   * Specifies whether or not this material should be rendered in alpha blend mode.
   * @returns a boolean specifying if alpha blending is needed
   */
  needAlphaBlending() {
    if (this._disableAlphaBlending) {
      return false;
    }
    return this.alpha < 1;
  }
  /**
   * Specifies if the mesh will require alpha blending
   * @param mesh defines the mesh to check
   * @returns a boolean specifying if alpha blending is needed for the mesh
   */
  needAlphaBlendingForMesh(mesh) {
    if (mesh.visibility < 1) {
      return true;
    }
    if (this._disableAlphaBlending) {
      return false;
    }
    return mesh.hasVertexAlpha || this.needAlphaBlending();
  }
  /**
   * Specifies whether or not this material should be rendered in alpha test mode.
   * @returns a boolean specifying if an alpha test is needed.
   */
  needAlphaTesting() {
    if (this._forceAlphaTest) {
      return true;
    }
    return false;
  }
  /**
   * Specifies if material alpha testing should be turned on for the mesh
   * @param mesh defines the mesh to check
   */
  _shouldTurnAlphaTestOn(mesh) {
    return !this.needAlphaBlendingForMesh(mesh) && this.needAlphaTesting();
  }
  /**
   * Gets the texture used for the alpha test
   * @returns the texture to use for alpha testing
   */
  getAlphaTestTexture() {
    return null;
  }
  /**
   * Marks the material to indicate that it needs to be re-calculated
   * @param forceMaterialDirty - Forces the material to be marked as dirty for all components (same as this.markAsDirty(Material.AllDirtyFlag)). You should use this flag if the material is frozen and you want to force a recompilation.
   */
  markDirty(forceMaterialDirty = false) {
    const meshes = this.getScene().meshes;
    for (const mesh of meshes) {
      if (!mesh.subMeshes) {
        continue;
      }
      for (const subMesh of mesh.subMeshes) {
        if (subMesh.getMaterial() !== this) {
          continue;
        }
        if (!subMesh.effect) {
          continue;
        }
        subMesh.effect._wasPreviouslyReady = false;
        subMesh.effect._wasPreviouslyUsingInstances = null;
        subMesh.effect._forceRebindOnNextCall = forceMaterialDirty;
      }
    }
    if (forceMaterialDirty) {
      this.markAsDirty(_Material.AllDirtyFlag);
    }
  }
  /**
   * @internal
   */
  _preBind(effect, overrideOrientation = null) {
    const engine = this._scene.getEngine();
    const orientation = overrideOrientation == null ? this.sideOrientation : overrideOrientation;
    const reverse = orientation === _Material.ClockWiseSideOrientation;
    engine.enableEffect(effect ? effect : this._getDrawWrapper());
    engine.setState(this.backFaceCulling, this.zOffset, false, reverse, this._scene._mirroredCameraPosition ? !this.cullBackFaces : this.cullBackFaces, this.stencil, this.zOffsetUnits);
    return reverse;
  }
  /**
   * Binds the material to the mesh
   * @param world defines the world transformation matrix
   * @param mesh defines the mesh to bind the material to
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bind(world, mesh) {
  }
  /**
   * Initializes the uniform buffer layout for the shader.
   */
  buildUniformLayout() {
    const ubo = this._uniformBuffer;
    this._eventInfo.ubo = ubo;
    this._callbackPluginEventGeneric(MaterialPluginEvent.PrepareUniformBuffer, this._eventInfo);
    ubo.create();
    this._uniformBufferLayoutBuilt = true;
  }
  /**
   * Binds the submesh to the material
   * @param world defines the world transformation matrix
   * @param mesh defines the mesh containing the submesh
   * @param subMesh defines the submesh to bind the material to
   */
  bindForSubMesh(world, mesh, subMesh) {
    const effect = subMesh.effect;
    if (!effect) {
      return;
    }
    this._eventInfo.subMesh = subMesh;
    this._callbackPluginEventBindForSubMesh(this._eventInfo);
    effect._forceRebindOnNextCall = false;
  }
  /**
   * Binds the world matrix to the material
   * @param world defines the world transformation matrix
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bindOnlyWorldMatrix(world) {
  }
  /**
   * Binds the view matrix to the effect
   * @param effect defines the effect to bind the view matrix to
   */
  bindView(effect) {
    if (!this._useUBO) {
      effect.setMatrix("view", this.getScene().getViewMatrix());
    } else {
      this._needToBindSceneUbo = true;
    }
  }
  /**
   * Binds the view projection and projection matrices to the effect
   * @param effect defines the effect to bind the view projection and projection matrices to
   */
  bindViewProjection(effect) {
    if (!this._useUBO) {
      effect.setMatrix("viewProjection", this.getScene().getTransformMatrix());
      effect.setMatrix("projection", this.getScene().getProjectionMatrix());
    } else {
      this._needToBindSceneUbo = true;
    }
  }
  /**
   * Binds the view matrix to the effect
   * @param effect defines the effect to bind the view matrix to
   * @param variableName name of the shader variable that will hold the eye position
   */
  bindEyePosition(effect, variableName) {
    if (!this._useUBO) {
      this._scene.bindEyePosition(effect, variableName);
    } else {
      this._needToBindSceneUbo = true;
    }
  }
  /**
   * Processes to execute after binding the material to a mesh
   * @param mesh defines the rendered mesh
   * @param effect
   */
  _afterBind(mesh, effect = null) {
    this._scene._cachedMaterial = this;
    if (this._needToBindSceneUbo) {
      if (effect) {
        this._needToBindSceneUbo = false;
        MaterialHelper.BindSceneUniformBuffer(effect, this.getScene().getSceneUniformBuffer());
        this._scene.finalizeSceneUbo();
      }
    }
    if (mesh) {
      this._scene._cachedVisibility = mesh.visibility;
    } else {
      this._scene._cachedVisibility = 1;
    }
    if (this._onBindObservable && mesh) {
      this._onBindObservable.notifyObservers(mesh);
    }
    if (this.disableDepthWrite) {
      const engine = this._scene.getEngine();
      this._cachedDepthWriteState = engine.getDepthWrite();
      engine.setDepthWrite(false);
    }
    if (this.disableColorWrite) {
      const engine = this._scene.getEngine();
      this._cachedColorWriteState = engine.getColorWrite();
      engine.setColorWrite(false);
    }
    if (this.depthFunction !== 0) {
      const engine = this._scene.getEngine();
      this._cachedDepthFunctionState = engine.getDepthFunction() || 0;
      engine.setDepthFunction(this.depthFunction);
    }
  }
  /**
   * Unbinds the material from the mesh
   */
  unbind() {
    if (this._onUnBindObservable) {
      this._onUnBindObservable.notifyObservers(this);
    }
    if (this.depthFunction !== 0) {
      const engine = this._scene.getEngine();
      engine.setDepthFunction(this._cachedDepthFunctionState);
    }
    if (this.disableDepthWrite) {
      const engine = this._scene.getEngine();
      engine.setDepthWrite(this._cachedDepthWriteState);
    }
    if (this.disableColorWrite) {
      const engine = this._scene.getEngine();
      engine.setColorWrite(this._cachedColorWriteState);
    }
  }
  /**
   * Returns the animatable textures.
   * @returns - Array of animatable textures.
   */
  getAnimatables() {
    this._eventInfo.animatables = [];
    this._callbackPluginEventGeneric(MaterialPluginEvent.GetAnimatables, this._eventInfo);
    return this._eventInfo.animatables;
  }
  /**
   * Gets the active textures from the material
   * @returns an array of textures
   */
  getActiveTextures() {
    this._eventInfo.activeTextures = [];
    this._callbackPluginEventGeneric(MaterialPluginEvent.GetActiveTextures, this._eventInfo);
    return this._eventInfo.activeTextures;
  }
  /**
   * Specifies if the material uses a texture
   * @param texture defines the texture to check against the material
   * @returns a boolean specifying if the material uses the texture
   */
  hasTexture(texture) {
    this._eventInfo.hasTexture = false;
    this._eventInfo.texture = texture;
    this._callbackPluginEventGeneric(MaterialPluginEvent.HasTexture, this._eventInfo);
    return this._eventInfo.hasTexture;
  }
  /**
   * Makes a duplicate of the material, and gives it a new name
   * @param name defines the new name for the duplicated material
   * @returns the cloned material
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clone(name47) {
    return null;
  }
  _clonePlugins(targetMaterial, rootUrl) {
    const serializationObject = {};
    this._serializePlugins(serializationObject);
    _Material._parsePlugins(serializationObject, targetMaterial, this._scene, rootUrl);
    if (this.pluginManager) {
      for (const plugin of this.pluginManager._plugins) {
        const targetPlugin = targetMaterial.pluginManager.getPlugin(plugin.name);
        plugin.copyTo(targetPlugin);
      }
    }
  }
  /**
   * Gets the meshes bound to the material
   * @returns an array of meshes bound to the material
   */
  getBindedMeshes() {
    if (this.meshMap) {
      const result = [];
      for (const meshId in this.meshMap) {
        const mesh = this.meshMap[meshId];
        if (mesh) {
          result.push(mesh);
        }
      }
      return result;
    } else {
      const meshes = this._scene.meshes;
      return meshes.filter((mesh) => mesh.material === this);
    }
  }
  /**
   * Force shader compilation
   * @param mesh defines the mesh associated with this material
   * @param onCompiled defines a function to execute once the material is compiled
   * @param options defines the options to configure the compilation
   * @param onError defines a function to execute if the material fails compiling
   */
  forceCompilation(mesh, onCompiled, options, onError) {
    const localOptions = Object.assign({ clipPlane: false, useInstances: false }, options);
    const scene = this.getScene();
    const currentHotSwapingState = this.allowShaderHotSwapping;
    this.allowShaderHotSwapping = false;
    const checkReady = () => {
      if (!this._scene || !this._scene.getEngine()) {
        return;
      }
      const clipPlaneState = scene.clipPlane;
      if (localOptions.clipPlane) {
        scene.clipPlane = new Plane(0, 0, 0, 1);
      }
      if (this._storeEffectOnSubMeshes) {
        let allDone = true, lastError = null;
        if (mesh.subMeshes) {
          const tempSubMesh = new SubMesh(0, 0, 0, 0, 0, mesh, void 0, false, false);
          if (tempSubMesh.materialDefines) {
            tempSubMesh.materialDefines._renderId = -1;
          }
          if (!this.isReadyForSubMesh(mesh, tempSubMesh, localOptions.useInstances)) {
            if (tempSubMesh.effect && tempSubMesh.effect.getCompilationError() && tempSubMesh.effect.allFallbacksProcessed()) {
              lastError = tempSubMesh.effect.getCompilationError();
            } else {
              allDone = false;
              setTimeout(checkReady, 16);
            }
          }
        }
        if (allDone) {
          this.allowShaderHotSwapping = currentHotSwapingState;
          if (lastError) {
            if (onError) {
              onError(lastError);
            }
          }
          if (onCompiled) {
            onCompiled(this);
          }
        }
      } else {
        if (this.isReady()) {
          this.allowShaderHotSwapping = currentHotSwapingState;
          if (onCompiled) {
            onCompiled(this);
          }
        } else {
          setTimeout(checkReady, 16);
        }
      }
      if (localOptions.clipPlane) {
        scene.clipPlane = clipPlaneState;
      }
    };
    checkReady();
  }
  /**
   * Force shader compilation
   * @param mesh defines the mesh that will use this material
   * @param options defines additional options for compiling the shaders
   * @returns a promise that resolves when the compilation completes
   */
  forceCompilationAsync(mesh, options) {
    return new Promise((resolve, reject) => {
      this.forceCompilation(mesh, () => {
        resolve();
      }, options, (reason) => {
        reject(reason);
      });
    });
  }
  /**
   * Marks a define in the material to indicate that it needs to be re-computed
   * @param flag defines a flag used to determine which parts of the material have to be marked as dirty
   */
  markAsDirty(flag) {
    if (this.getScene().blockMaterialDirtyMechanism || this._blockDirtyMechanism) {
      return;
    }
    _Material._DirtyCallbackArray.length = 0;
    if (flag & _Material.TextureDirtyFlag) {
      _Material._DirtyCallbackArray.push(_Material._TextureDirtyCallBack);
    }
    if (flag & _Material.LightDirtyFlag) {
      _Material._DirtyCallbackArray.push(_Material._LightsDirtyCallBack);
    }
    if (flag & _Material.FresnelDirtyFlag) {
      _Material._DirtyCallbackArray.push(_Material._FresnelDirtyCallBack);
    }
    if (flag & _Material.AttributesDirtyFlag) {
      _Material._DirtyCallbackArray.push(_Material._AttributeDirtyCallBack);
    }
    if (flag & _Material.MiscDirtyFlag) {
      _Material._DirtyCallbackArray.push(_Material._MiscDirtyCallBack);
    }
    if (flag & _Material.PrePassDirtyFlag) {
      _Material._DirtyCallbackArray.push(_Material._PrePassDirtyCallBack);
    }
    if (_Material._DirtyCallbackArray.length) {
      this._markAllSubMeshesAsDirty(_Material._RunDirtyCallBacks);
    }
    this.getScene().resetCachedMaterial();
  }
  /**
   * Resets the draw wrappers cache for all submeshes that are using this material
   */
  resetDrawCache() {
    const meshes = this.getScene().meshes;
    for (const mesh of meshes) {
      if (!mesh.subMeshes) {
        continue;
      }
      for (const subMesh of mesh.subMeshes) {
        if (subMesh.getMaterial() !== this) {
          continue;
        }
        subMesh.resetDrawCache();
      }
    }
  }
  /**
   * Marks all submeshes of a material to indicate that their material defines need to be re-calculated
   * @param func defines a function which checks material defines against the submeshes
   */
  _markAllSubMeshesAsDirty(func) {
    if (this.getScene().blockMaterialDirtyMechanism || this._blockDirtyMechanism) {
      return;
    }
    const meshes = this.getScene().meshes;
    for (const mesh of meshes) {
      if (!mesh.subMeshes) {
        continue;
      }
      for (const subMesh of mesh.subMeshes) {
        if (subMesh.getMaterial(false) !== this) {
          continue;
        }
        for (const drawWrapper of subMesh._drawWrappers) {
          if (!drawWrapper || !drawWrapper.defines || !drawWrapper.defines.markAllAsDirty) {
            continue;
          }
          if (this._materialContext === drawWrapper.materialContext) {
            func(drawWrapper.defines);
          }
        }
      }
    }
  }
  /**
   * Indicates that the scene should check if the rendering now needs a prepass
   */
  _markScenePrePassDirty() {
    if (this.getScene().blockMaterialDirtyMechanism || this._blockDirtyMechanism) {
      return;
    }
    const prePassRenderer = this.getScene().enablePrePassRenderer();
    if (prePassRenderer) {
      prePassRenderer.markAsDirty();
    }
  }
  /**
   * Indicates that we need to re-calculated for all submeshes
   */
  _markAllSubMeshesAsAllDirty() {
    this._markAllSubMeshesAsDirty(_Material._AllDirtyCallBack);
  }
  /**
   * Indicates that image processing needs to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsImageProcessingDirty() {
    this._markAllSubMeshesAsDirty(_Material._ImageProcessingDirtyCallBack);
  }
  /**
   * Indicates that textures need to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsTexturesDirty() {
    this._markAllSubMeshesAsDirty(_Material._TextureDirtyCallBack);
  }
  /**
   * Indicates that fresnel needs to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsFresnelDirty() {
    this._markAllSubMeshesAsDirty(_Material._FresnelDirtyCallBack);
  }
  /**
   * Indicates that fresnel and misc need to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsFresnelAndMiscDirty() {
    this._markAllSubMeshesAsDirty(_Material._FresnelAndMiscDirtyCallBack);
  }
  /**
   * Indicates that lights need to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsLightsDirty() {
    this._markAllSubMeshesAsDirty(_Material._LightsDirtyCallBack);
  }
  /**
   * Indicates that attributes need to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsAttributesDirty() {
    this._markAllSubMeshesAsDirty(_Material._AttributeDirtyCallBack);
  }
  /**
   * Indicates that misc needs to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsMiscDirty() {
    this._markAllSubMeshesAsDirty(_Material._MiscDirtyCallBack);
  }
  /**
   * Indicates that prepass needs to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsPrePassDirty() {
    this._markAllSubMeshesAsDirty(_Material._MiscDirtyCallBack);
  }
  /**
   * Indicates that textures and misc need to be re-calculated for all submeshes
   */
  _markAllSubMeshesAsTexturesAndMiscDirty() {
    this._markAllSubMeshesAsDirty(_Material._TextureAndMiscDirtyCallBack);
  }
  _checkScenePerformancePriority() {
    if (this._scene.performancePriority !== ScenePerformancePriority.BackwardCompatible) {
      this.checkReadyOnlyOnce = true;
      const observer2 = this._scene.onScenePerformancePriorityChangedObservable.addOnce(() => {
        this.checkReadyOnlyOnce = false;
      });
      this.onDisposeObservable.add(() => {
        this._scene.onScenePerformancePriorityChangedObservable.remove(observer2);
      });
    }
  }
  /**
   * Sets the required values to the prepass renderer.
   * @param prePassRenderer defines the prepass renderer to setup.
   * @returns true if the pre pass is needed.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setPrePassRenderer(prePassRenderer) {
    return false;
  }
  /**
   * Disposes the material
   * @param forceDisposeEffect specifies if effects should be forcefully disposed
   * @param forceDisposeTextures specifies if textures should be forcefully disposed
   * @param notBoundToMesh specifies if the material that is being disposed is known to be not bound to any mesh
   */
  dispose(forceDisposeEffect, forceDisposeTextures, notBoundToMesh) {
    const scene = this.getScene();
    scene.stopAnimation(this);
    scene.freeProcessedMaterials();
    scene.removeMaterial(this);
    this._eventInfo.forceDisposeTextures = forceDisposeTextures;
    this._callbackPluginEventGeneric(MaterialPluginEvent.Disposed, this._eventInfo);
    if (this._parentContainer) {
      const index = this._parentContainer.materials.indexOf(this);
      if (index > -1) {
        this._parentContainer.materials.splice(index, 1);
      }
      this._parentContainer = null;
    }
    if (notBoundToMesh !== true) {
      if (this.meshMap) {
        for (const meshId in this.meshMap) {
          const mesh = this.meshMap[meshId];
          if (mesh) {
            mesh.material = null;
            this.releaseVertexArrayObject(mesh, forceDisposeEffect);
          }
        }
      } else {
        const meshes = scene.meshes;
        for (const mesh of meshes) {
          if (mesh.material === this && !mesh.sourceMesh) {
            mesh.material = null;
            this.releaseVertexArrayObject(mesh, forceDisposeEffect);
          }
        }
      }
    }
    this._uniformBuffer.dispose();
    if (forceDisposeEffect && this._drawWrapper.effect) {
      if (!this._storeEffectOnSubMeshes) {
        this._drawWrapper.effect.dispose();
      }
      this._drawWrapper.effect = null;
    }
    this.metadata = null;
    this.onDisposeObservable.notifyObservers(this);
    this.onDisposeObservable.clear();
    if (this._onBindObservable) {
      this._onBindObservable.clear();
    }
    if (this._onUnBindObservable) {
      this._onUnBindObservable.clear();
    }
    if (this._onEffectCreatedObservable) {
      this._onEffectCreatedObservable.clear();
    }
    if (this._eventInfo) {
      this._eventInfo = {};
    }
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  releaseVertexArrayObject(mesh, forceDisposeEffect) {
    const geometry = mesh.geometry;
    if (geometry) {
      if (this._storeEffectOnSubMeshes) {
        if (mesh.subMeshes) {
          for (const subMesh of mesh.subMeshes) {
            geometry._releaseVertexArrayObject(subMesh.effect);
            if (forceDisposeEffect && subMesh.effect) {
              subMesh.effect.dispose();
            }
          }
        }
      } else {
        geometry._releaseVertexArrayObject(this._drawWrapper.effect);
      }
    }
  }
  /**
   * Serializes this material
   * @returns the serialized material object
   */
  serialize() {
    const serializationObject = SerializationHelper.Serialize(this);
    serializationObject.stencil = this.stencil.serialize();
    serializationObject.uniqueId = this.uniqueId;
    this._serializePlugins(serializationObject);
    return serializationObject;
  }
  _serializePlugins(serializationObject) {
    serializationObject.plugins = {};
    if (this.pluginManager) {
      for (const plugin of this.pluginManager._plugins) {
        serializationObject.plugins[plugin.getClassName()] = plugin.serialize();
      }
    }
  }
  /**
   * Creates a material from parsed material data
   * @param parsedMaterial defines parsed material data
   * @param scene defines the hosting scene
   * @param rootUrl defines the root URL to use to load textures
   * @returns a new material
   */
  static Parse(parsedMaterial, scene, rootUrl) {
    if (!parsedMaterial.customType) {
      parsedMaterial.customType = "BABYLON.StandardMaterial";
    } else if (parsedMaterial.customType === "BABYLON.PBRMaterial" && parsedMaterial.overloadedAlbedo) {
      parsedMaterial.customType = "BABYLON.LegacyPBRMaterial";
      if (!BABYLON.LegacyPBRMaterial) {
        Logger.Error("Your scene is trying to load a legacy version of the PBRMaterial, please, include it from the materials library.");
        return null;
      }
    }
    const materialType = Tools.Instantiate(parsedMaterial.customType);
    const material = materialType.Parse(parsedMaterial, scene, rootUrl);
    material._loadedUniqueId = parsedMaterial.uniqueId;
    return material;
  }
  static _parsePlugins(serializationObject, material, scene, rootUrl) {
    var _a;
    if (!serializationObject.plugins) {
      return;
    }
    for (const pluginClassName in serializationObject.plugins) {
      const pluginData = serializationObject.plugins[pluginClassName];
      let plugin = (_a = material.pluginManager) === null || _a === void 0 ? void 0 : _a.getPlugin(pluginData.name);
      if (!plugin) {
        const pluginClassType = Tools.Instantiate("BABYLON." + pluginClassName);
        if (pluginClassType) {
          plugin = new pluginClassType(material);
        }
      }
      plugin === null || plugin === void 0 ? void 0 : plugin.parse(pluginData, scene, rootUrl);
    }
  }
};
Material.TriangleFillMode = 0;
Material.WireFrameFillMode = 1;
Material.PointFillMode = 2;
Material.PointListDrawMode = 3;
Material.LineListDrawMode = 4;
Material.LineLoopDrawMode = 5;
Material.LineStripDrawMode = 6;
Material.TriangleStripDrawMode = 7;
Material.TriangleFanDrawMode = 8;
Material.ClockWiseSideOrientation = 0;
Material.CounterClockWiseSideOrientation = 1;
Material.TextureDirtyFlag = 1;
Material.LightDirtyFlag = 2;
Material.FresnelDirtyFlag = 4;
Material.AttributesDirtyFlag = 8;
Material.MiscDirtyFlag = 16;
Material.PrePassDirtyFlag = 32;
Material.AllDirtyFlag = 63;
Material.MATERIAL_OPAQUE = 0;
Material.MATERIAL_ALPHATEST = 1;
Material.MATERIAL_ALPHABLEND = 2;
Material.MATERIAL_ALPHATESTANDBLEND = 3;
Material.MATERIAL_NORMALBLENDMETHOD_WHITEOUT = 0;
Material.MATERIAL_NORMALBLENDMETHOD_RNM = 1;
Material.OnEventObservable = new Observable();
Material._AllDirtyCallBack = (defines) => defines.markAllAsDirty();
Material._ImageProcessingDirtyCallBack = (defines) => defines.markAsImageProcessingDirty();
Material._TextureDirtyCallBack = (defines) => defines.markAsTexturesDirty();
Material._FresnelDirtyCallBack = (defines) => defines.markAsFresnelDirty();
Material._MiscDirtyCallBack = (defines) => defines.markAsMiscDirty();
Material._PrePassDirtyCallBack = (defines) => defines.markAsPrePassDirty();
Material._LightsDirtyCallBack = (defines) => defines.markAsLightDirty();
Material._AttributeDirtyCallBack = (defines) => defines.markAsAttributesDirty();
Material._FresnelAndMiscDirtyCallBack = (defines) => {
  Material._FresnelDirtyCallBack(defines);
  Material._MiscDirtyCallBack(defines);
};
Material._TextureAndMiscDirtyCallBack = (defines) => {
  Material._TextureDirtyCallBack(defines);
  Material._MiscDirtyCallBack(defines);
};
Material._DirtyCallbackArray = [];
Material._RunDirtyCallBacks = (defines) => {
  for (const cb of Material._DirtyCallbackArray) {
    cb(defines);
  }
};
__decorate([
  serialize()
], Material.prototype, "id", void 0);
__decorate([
  serialize()
], Material.prototype, "uniqueId", void 0);
__decorate([
  serialize()
], Material.prototype, "name", void 0);
__decorate([
  serialize()
], Material.prototype, "metadata", void 0);
__decorate([
  serialize()
], Material.prototype, "checkReadyOnEveryCall", void 0);
__decorate([
  serialize()
], Material.prototype, "checkReadyOnlyOnce", void 0);
__decorate([
  serialize()
], Material.prototype, "state", void 0);
__decorate([
  serialize("alpha")
], Material.prototype, "_alpha", void 0);
__decorate([
  serialize("backFaceCulling")
], Material.prototype, "_backFaceCulling", void 0);
__decorate([
  serialize("cullBackFaces")
], Material.prototype, "_cullBackFaces", void 0);
__decorate([
  serialize()
], Material.prototype, "sideOrientation", void 0);
__decorate([
  serialize("alphaMode")
], Material.prototype, "_alphaMode", void 0);
__decorate([
  serialize()
], Material.prototype, "_needDepthPrePass", void 0);
__decorate([
  serialize()
], Material.prototype, "disableDepthWrite", void 0);
__decorate([
  serialize()
], Material.prototype, "disableColorWrite", void 0);
__decorate([
  serialize()
], Material.prototype, "forceDepthWrite", void 0);
__decorate([
  serialize()
], Material.prototype, "depthFunction", void 0);
__decorate([
  serialize()
], Material.prototype, "separateCullingPass", void 0);
__decorate([
  serialize("fogEnabled")
], Material.prototype, "_fogEnabled", void 0);
__decorate([
  serialize()
], Material.prototype, "pointSize", void 0);
__decorate([
  serialize()
], Material.prototype, "zOffset", void 0);
__decorate([
  serialize()
], Material.prototype, "zOffsetUnits", void 0);
__decorate([
  serialize()
], Material.prototype, "pointsCloud", null);
__decorate([
  serialize()
], Material.prototype, "fillMode", null);
__decorate([
  serialize()
], Material.prototype, "useLogarithmicDepth", null);
__decorate([
  serialize()
], Material.prototype, "transparencyMode", null);

// node_modules/@babylonjs/core/Materials/multiMaterial.js
var MultiMaterial = class _MultiMaterial extends Material {
  /**
   * Gets or Sets the list of Materials used within the multi material.
   * They need to be ordered according to the submeshes order in the associated mesh
   */
  get subMaterials() {
    return this._subMaterials;
  }
  set subMaterials(value) {
    this._subMaterials = value;
    this._hookArray(value);
  }
  /**
   * Function used to align with Node.getChildren()
   * @returns the list of Materials used within the multi material
   */
  getChildren() {
    return this.subMaterials;
  }
  /**
   * Instantiates a new Multi Material
   * A multi-material is used to apply different materials to different parts of the same object without the need of
   * separate meshes. This can be use to improve performances.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/multiMaterials
   * @param name Define the name in the scene
   * @param scene Define the scene the material belongs to
   */
  constructor(name47, scene) {
    super(name47, scene, true);
    this._waitingSubMaterialsUniqueIds = [];
    this.getScene().addMultiMaterial(this);
    this.subMaterials = [];
    this._storeEffectOnSubMeshes = true;
  }
  _hookArray(array) {
    const oldPush = array.push;
    array.push = (...items) => {
      const result = oldPush.apply(array, items);
      this._markAllSubMeshesAsTexturesDirty();
      return result;
    };
    const oldSplice = array.splice;
    array.splice = (index, deleteCount) => {
      const deleted = oldSplice.apply(array, [index, deleteCount]);
      this._markAllSubMeshesAsTexturesDirty();
      return deleted;
    };
  }
  /**
   * Get one of the submaterial by its index in the submaterials array
   * @param index The index to look the sub material at
   * @returns The Material if the index has been defined
   */
  getSubMaterial(index) {
    if (index < 0 || index >= this.subMaterials.length) {
      return this.getScene().defaultMaterial;
    }
    return this.subMaterials[index];
  }
  /**
   * Get the list of active textures for the whole sub materials list.
   * @returns All the textures that will be used during the rendering
   */
  getActiveTextures() {
    return super.getActiveTextures().concat(...this.subMaterials.map((subMaterial) => {
      if (subMaterial) {
        return subMaterial.getActiveTextures();
      } else {
        return [];
      }
    }));
  }
  /**
   * Specifies if any sub-materials of this multi-material use a given texture.
   * @param texture Defines the texture to check against this multi-material's sub-materials.
   * @returns A boolean specifying if any sub-material of this multi-material uses the texture.
   */
  hasTexture(texture) {
    var _a;
    if (super.hasTexture(texture)) {
      return true;
    }
    for (let i = 0; i < this.subMaterials.length; i++) {
      if ((_a = this.subMaterials[i]) === null || _a === void 0 ? void 0 : _a.hasTexture(texture)) {
        return true;
      }
    }
    return false;
  }
  /**
   * Gets the current class name of the material e.g. "MultiMaterial"
   * Mainly use in serialization.
   * @returns the class name
   */
  getClassName() {
    return "MultiMaterial";
  }
  /**
   * Checks if the material is ready to render the requested sub mesh
   * @param mesh Define the mesh the submesh belongs to
   * @param subMesh Define the sub mesh to look readiness for
   * @param useInstances Define whether or not the material is used with instances
   * @returns true if ready, otherwise false
   */
  isReadyForSubMesh(mesh, subMesh, useInstances) {
    for (let index = 0; index < this.subMaterials.length; index++) {
      const subMaterial = this.subMaterials[index];
      if (subMaterial) {
        if (subMaterial._storeEffectOnSubMeshes) {
          if (!subMaterial.isReadyForSubMesh(mesh, subMesh, useInstances)) {
            return false;
          }
          continue;
        }
        if (!subMaterial.isReady(mesh)) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Clones the current material and its related sub materials
   * @param name Define the name of the newly cloned material
   * @param cloneChildren Define if submaterial will be cloned or shared with the parent instance
   * @returns the cloned material
   */
  clone(name47, cloneChildren) {
    const newMultiMaterial = new _MultiMaterial(name47, this.getScene());
    for (let index = 0; index < this.subMaterials.length; index++) {
      let subMaterial = null;
      const current = this.subMaterials[index];
      if (cloneChildren && current) {
        subMaterial = current.clone(name47 + "-" + current.name);
      } else {
        subMaterial = this.subMaterials[index];
      }
      newMultiMaterial.subMaterials.push(subMaterial);
    }
    return newMultiMaterial;
  }
  /**
   * Serializes the materials into a JSON representation.
   * @returns the JSON representation
   */
  serialize() {
    const serializationObject = {};
    serializationObject.name = this.name;
    serializationObject.id = this.id;
    serializationObject.uniqueId = this.uniqueId;
    if (Tags) {
      serializationObject.tags = Tags.GetTags(this);
    }
    serializationObject.materialsUniqueIds = [];
    serializationObject.materials = [];
    for (let matIndex = 0; matIndex < this.subMaterials.length; matIndex++) {
      const subMat = this.subMaterials[matIndex];
      if (subMat) {
        serializationObject.materialsUniqueIds.push(subMat.uniqueId);
        serializationObject.materials.push(subMat.id);
      } else {
        serializationObject.materialsUniqueIds.push(null);
        serializationObject.materials.push(null);
      }
    }
    return serializationObject;
  }
  /**
   * Dispose the material and release its associated resources
   * @param forceDisposeEffect Define if we want to force disposing the associated effect (if false the shader is not released and could be reuse later on)
   * @param forceDisposeTextures Define if we want to force disposing the associated textures (if false, they will not be disposed and can still be use elsewhere in the app)
   * @param forceDisposeChildren Define if we want to force disposing the associated submaterials (if false, they will not be disposed and can still be use elsewhere in the app)
   */
  dispose(forceDisposeEffect, forceDisposeTextures, forceDisposeChildren) {
    const scene = this.getScene();
    if (!scene) {
      return;
    }
    if (forceDisposeChildren) {
      for (let index2 = 0; index2 < this.subMaterials.length; index2++) {
        const subMaterial = this.subMaterials[index2];
        if (subMaterial) {
          subMaterial.dispose(forceDisposeEffect, forceDisposeTextures);
        }
      }
    }
    const index = scene.multiMaterials.indexOf(this);
    if (index >= 0) {
      scene.multiMaterials.splice(index, 1);
    }
    super.dispose(forceDisposeEffect, forceDisposeTextures);
  }
  /**
   * Creates a MultiMaterial from parsed MultiMaterial data.
   * @param parsedMultiMaterial defines parsed MultiMaterial data.
   * @param scene defines the hosting scene
   * @returns a new MultiMaterial
   */
  static ParseMultiMaterial(parsedMultiMaterial, scene) {
    const multiMaterial = new _MultiMaterial(parsedMultiMaterial.name, scene);
    multiMaterial.id = parsedMultiMaterial.id;
    multiMaterial._loadedUniqueId = parsedMultiMaterial.uniqueId;
    if (Tags) {
      Tags.AddTagsTo(multiMaterial, parsedMultiMaterial.tags);
    }
    if (parsedMultiMaterial.materialsUniqueIds) {
      multiMaterial._waitingSubMaterialsUniqueIds = parsedMultiMaterial.materialsUniqueIds;
    } else {
      parsedMultiMaterial.materials.forEach((subMatId) => multiMaterial.subMaterials.push(scene.getLastMaterialById(subMatId)));
    }
    return multiMaterial;
  }
};
RegisterClass("BABYLON.MultiMaterial", MultiMaterial);

// node_modules/@babylonjs/core/Meshes/meshLODLevel.js
var MeshLODLevel = class {
  /**
   * Creates a new LOD level
   * @param distanceOrScreenCoverage defines either the distance or the screen coverage where this level should start being displayed
   * @param mesh defines the mesh to use to render this level
   */
  constructor(distanceOrScreenCoverage, mesh) {
    this.distanceOrScreenCoverage = distanceOrScreenCoverage;
    this.mesh = mesh;
  }
};

// node_modules/@babylonjs/core/Meshes/mesh.js
var _CreationDataStorage = class {
};
var _InstanceDataStorage = class {
  constructor() {
    this.visibleInstances = {};
    this.batchCache = new _InstancesBatch();
    this.batchCacheReplacementModeInFrozenMode = new _InstancesBatch();
    this.instancesBufferSize = 32 * 16 * 4;
  }
};
var _InstancesBatch = class {
  constructor() {
    this.mustReturn = false;
    this.visibleInstances = new Array();
    this.renderSelf = [];
    this.hardwareInstancedRendering = [];
  }
};
var _ThinInstanceDataStorage = class {
  constructor() {
    this.instancesCount = 0;
    this.matrixBuffer = null;
    this.previousMatrixBuffer = null;
    this.matrixBufferSize = 32 * 16;
    this.matrixData = null;
    this.boundingVectors = [];
    this.worldMatrices = null;
  }
};
var _InternalMeshDataInfo = class {
  constructor() {
    this._areNormalsFrozen = false;
    this._source = null;
    this.meshMap = null;
    this._preActivateId = -1;
    this._LODLevels = new Array();
    this._useLODScreenCoverage = false;
    this._effectiveMaterial = null;
    this._forcedInstanceCount = 0;
    this._overrideRenderingFillMode = null;
  }
};
var Mesh = class _Mesh extends AbstractMesh {
  /**
   * Gets the default side orientation.
   * @param orientation the orientation to value to attempt to get
   * @returns the default orientation
   * @internal
   */
  static _GetDefaultSideOrientation(orientation) {
    return orientation || _Mesh.FRONTSIDE;
  }
  /**
   * Determines if the LOD levels are intended to be calculated using screen coverage (surface area ratio) instead of distance.
   */
  get useLODScreenCoverage() {
    return this._internalMeshDataInfo._useLODScreenCoverage;
  }
  set useLODScreenCoverage(value) {
    this._internalMeshDataInfo._useLODScreenCoverage = value;
    this._sortLODLevels();
  }
  get computeBonesUsingShaders() {
    return this._internalAbstractMeshDataInfo._computeBonesUsingShaders;
  }
  set computeBonesUsingShaders(value) {
    if (this._internalAbstractMeshDataInfo._computeBonesUsingShaders === value) {
      return;
    }
    if (value && this._internalMeshDataInfo._sourcePositions) {
      this.setVerticesData(VertexBuffer.PositionKind, this._internalMeshDataInfo._sourcePositions, true);
      if (this._internalMeshDataInfo._sourceNormals) {
        this.setVerticesData(VertexBuffer.NormalKind, this._internalMeshDataInfo._sourceNormals, true);
      }
      this._internalMeshDataInfo._sourcePositions = null;
      this._internalMeshDataInfo._sourceNormals = null;
    }
    this._internalAbstractMeshDataInfo._computeBonesUsingShaders = value;
    this._markSubMeshesAsAttributesDirty();
  }
  /**
   * An event triggered before rendering the mesh
   */
  get onBeforeRenderObservable() {
    if (!this._internalMeshDataInfo._onBeforeRenderObservable) {
      this._internalMeshDataInfo._onBeforeRenderObservable = new Observable();
    }
    return this._internalMeshDataInfo._onBeforeRenderObservable;
  }
  /**
   * An event triggered before binding the mesh
   */
  get onBeforeBindObservable() {
    if (!this._internalMeshDataInfo._onBeforeBindObservable) {
      this._internalMeshDataInfo._onBeforeBindObservable = new Observable();
    }
    return this._internalMeshDataInfo._onBeforeBindObservable;
  }
  /**
   * An event triggered after rendering the mesh
   */
  get onAfterRenderObservable() {
    if (!this._internalMeshDataInfo._onAfterRenderObservable) {
      this._internalMeshDataInfo._onAfterRenderObservable = new Observable();
    }
    return this._internalMeshDataInfo._onAfterRenderObservable;
  }
  /**
   * An event triggeredbetween rendering pass when using separateCullingPass = true
   */
  get onBetweenPassObservable() {
    if (!this._internalMeshDataInfo._onBetweenPassObservable) {
      this._internalMeshDataInfo._onBetweenPassObservable = new Observable();
    }
    return this._internalMeshDataInfo._onBetweenPassObservable;
  }
  /**
   * An event triggered before drawing the mesh
   */
  get onBeforeDrawObservable() {
    if (!this._internalMeshDataInfo._onBeforeDrawObservable) {
      this._internalMeshDataInfo._onBeforeDrawObservable = new Observable();
    }
    return this._internalMeshDataInfo._onBeforeDrawObservable;
  }
  /**
   * Sets a callback to call before drawing the mesh. It is recommended to use onBeforeDrawObservable instead
   */
  set onBeforeDraw(callback) {
    if (this._onBeforeDrawObserver) {
      this.onBeforeDrawObservable.remove(this._onBeforeDrawObserver);
    }
    this._onBeforeDrawObserver = this.onBeforeDrawObservable.add(callback);
  }
  get hasInstances() {
    return this.instances.length > 0;
  }
  get hasThinInstances() {
    return (this.forcedInstanceCount || this._thinInstanceDataStorage.instancesCount || 0) > 0;
  }
  /**
   * Gets or sets the forced number of instances to display.
   * If 0 (default value), the number of instances is not forced and depends on the draw type
   * (regular / instance / thin instances mesh)
   */
  get forcedInstanceCount() {
    return this._internalMeshDataInfo._forcedInstanceCount;
  }
  set forcedInstanceCount(count) {
    this._internalMeshDataInfo._forcedInstanceCount = count;
  }
  /**
   * Use this property to override the Material's fillMode value
   */
  get overrideRenderingFillMode() {
    return this._internalMeshDataInfo._overrideRenderingFillMode;
  }
  set overrideRenderingFillMode(fillMode) {
    this._internalMeshDataInfo._overrideRenderingFillMode = fillMode;
  }
  /**
   * Gets the source mesh (the one used to clone this one from)
   */
  get source() {
    return this._internalMeshDataInfo._source;
  }
  /**
   * Gets the list of clones of this mesh
   * The scene must have been constructed with useClonedMeshMap=true for this to work!
   * Note that useClonedMeshMap=true is the default setting
   */
  get cloneMeshMap() {
    return this._internalMeshDataInfo.meshMap;
  }
  /**
   * Gets or sets a boolean indicating that this mesh does not use index buffer
   */
  get isUnIndexed() {
    return this._unIndexed;
  }
  set isUnIndexed(value) {
    if (this._unIndexed !== value) {
      this._unIndexed = value;
      this._markSubMeshesAsAttributesDirty();
    }
  }
  /** Gets the array buffer used to store the instanced buffer used for instances' world matrices */
  get worldMatrixInstancedBuffer() {
    return this._instanceDataStorage.instancesData;
  }
  /** Gets the array buffer used to store the instanced buffer used for instances' previous world matrices */
  get previousWorldMatrixInstancedBuffer() {
    return this._instanceDataStorage.instancesPreviousData;
  }
  /** Gets or sets a boolean indicating that the update of the instance buffer of the world matrices is manual */
  get manualUpdateOfWorldMatrixInstancedBuffer() {
    return this._instanceDataStorage.manualUpdate;
  }
  set manualUpdateOfWorldMatrixInstancedBuffer(value) {
    this._instanceDataStorage.manualUpdate = value;
  }
  /** Gets or sets a boolean indicating that the update of the instance buffer of the world matrices is manual */
  get manualUpdateOfPreviousWorldMatrixInstancedBuffer() {
    return this._instanceDataStorage.previousManualUpdate;
  }
  set manualUpdateOfPreviousWorldMatrixInstancedBuffer(value) {
    this._instanceDataStorage.previousManualUpdate = value;
  }
  /** Gets or sets a boolean indicating that the update of the instance buffer of the world matrices must be performed in all cases (and notably even in frozen mode) */
  get forceWorldMatrixInstancedBufferUpdate() {
    return this._instanceDataStorage.forceMatrixUpdates;
  }
  set forceWorldMatrixInstancedBufferUpdate(value) {
    this._instanceDataStorage.forceMatrixUpdates = value;
  }
  /**
   * @constructor
   * @param name The value used by scene.getMeshByName() to do a lookup.
   * @param scene The scene to add this mesh to.
   * @param parent The parent of this mesh, if it has one
   * @param source An optional Mesh from which geometry is shared, cloned.
   * @param doNotCloneChildren When cloning, skip cloning child meshes of source, default False.
   *                  When false, achieved by calling a clone(), also passing False.
   *                  This will make creation of children, recursive.
   * @param clonePhysicsImpostor When cloning, include cloning mesh physics impostor, default True.
   */
  constructor(name47, scene = null, parent = null, source = null, doNotCloneChildren, clonePhysicsImpostor = true) {
    super(name47, scene);
    this._internalMeshDataInfo = new _InternalMeshDataInfo();
    this.delayLoadState = 0;
    this.instances = [];
    this._creationDataStorage = null;
    this._geometry = null;
    this._instanceDataStorage = new _InstanceDataStorage();
    this._thinInstanceDataStorage = new _ThinInstanceDataStorage();
    this._shouldGenerateFlatShading = false;
    this._originalBuilderSideOrientation = _Mesh.DEFAULTSIDE;
    this.overrideMaterialSideOrientation = null;
    this.ignoreCameraMaxZ = false;
    scene = this.getScene();
    this._onBeforeDraw = (isInstance, world, effectiveMaterial) => {
      if (isInstance && effectiveMaterial) {
        if (this._uniformBuffer) {
          this.transferToEffect(world);
        } else {
          effectiveMaterial.bindOnlyWorldMatrix(world);
        }
      }
    };
    if (source) {
      if (source._geometry) {
        source._geometry.applyToMesh(this);
      }
      DeepCopier.DeepCopy(source, this, [
        "name",
        "material",
        "skeleton",
        "instances",
        "parent",
        "uniqueId",
        "source",
        "metadata",
        "morphTargetManager",
        "hasInstances",
        "worldMatrixInstancedBuffer",
        "previousWorldMatrixInstancedBuffer",
        "hasLODLevels",
        "geometry",
        "isBlocked",
        "areNormalsFrozen",
        "facetNb",
        "isFacetDataEnabled",
        "lightSources",
        "useBones",
        "isAnInstance",
        "collider",
        "edgesRenderer",
        "forward",
        "up",
        "right",
        "absolutePosition",
        "absoluteScaling",
        "absoluteRotationQuaternion",
        "isWorldMatrixFrozen",
        "nonUniformScaling",
        "behaviors",
        "worldMatrixFromCache",
        "hasThinInstances",
        "cloneMeshMap",
        "hasBoundingInfo",
        "physicsBody",
        "physicsImpostor"
      ], ["_poseMatrix"]);
      this._internalMeshDataInfo._source = source;
      if (scene.useClonedMeshMap) {
        if (!source._internalMeshDataInfo.meshMap) {
          source._internalMeshDataInfo.meshMap = {};
        }
        source._internalMeshDataInfo.meshMap[this.uniqueId] = this;
      }
      this._originalBuilderSideOrientation = source._originalBuilderSideOrientation;
      this._creationDataStorage = source._creationDataStorage;
      if (source._ranges) {
        const ranges = source._ranges;
        for (const name48 in ranges) {
          if (!Object.prototype.hasOwnProperty.call(ranges, name48)) {
            continue;
          }
          if (!ranges[name48]) {
            continue;
          }
          this.createAnimationRange(name48, ranges[name48].from, ranges[name48].to);
        }
      }
      if (source.metadata && source.metadata.clone) {
        this.metadata = source.metadata.clone();
      } else {
        this.metadata = source.metadata;
      }
      this._internalMetadata = source._internalMetadata;
      if (Tags && Tags.HasTags(source)) {
        Tags.AddTagsTo(this, Tags.GetTags(source, true));
      }
      this.setEnabled(source.isEnabled(false));
      this.parent = source.parent;
      this.setPivotMatrix(source.getPivotMatrix());
      this.id = name47 + "." + source.id;
      this.material = source.material;
      if (!doNotCloneChildren) {
        const directDescendants = source.getDescendants(true);
        for (let index = 0; index < directDescendants.length; index++) {
          const child = directDescendants[index];
          if (child.clone) {
            child.clone(name47 + "." + child.name, this);
          }
        }
      }
      if (source.morphTargetManager) {
        this.morphTargetManager = source.morphTargetManager;
      }
      if (scene.getPhysicsEngine) {
        const physicsEngine = scene.getPhysicsEngine();
        if (clonePhysicsImpostor && physicsEngine) {
          if (physicsEngine.getPluginVersion() === 1) {
            const impostor = physicsEngine.getImpostorForPhysicsObject(source);
            if (impostor) {
              this.physicsImpostor = impostor.clone(this);
            }
          } else if (physicsEngine.getPluginVersion() === 2) {
            if (source.physicsBody) {
              source.physicsBody.clone(this);
            }
          }
        }
      }
      for (let index = 0; index < scene.particleSystems.length; index++) {
        const system = scene.particleSystems[index];
        if (system.emitter === source) {
          system.clone(system.name, this);
        }
      }
      this.skeleton = source.skeleton;
      this.refreshBoundingInfo(true, true);
      this.computeWorldMatrix(true);
    }
    if (parent !== null) {
      this.parent = parent;
    }
    this._instanceDataStorage.hardwareInstancedRendering = this.getEngine().getCaps().instancedArrays;
    this._internalMeshDataInfo._onMeshReadyObserverAdded = (observer2) => {
      observer2.unregisterOnNextCall = true;
      if (this.isReady(true)) {
        this.onMeshReadyObservable.notifyObservers(this);
      } else {
        if (!this._internalMeshDataInfo._checkReadinessObserver) {
          this._internalMeshDataInfo._checkReadinessObserver = this._scene.onBeforeRenderObservable.add(() => {
            if (this.isReady(true)) {
              this._scene.onBeforeRenderObservable.remove(this._internalMeshDataInfo._checkReadinessObserver);
              this._internalMeshDataInfo._checkReadinessObserver = null;
              this.onMeshReadyObservable.notifyObservers(this);
            }
          });
        }
      }
    };
    this.onMeshReadyObservable = new Observable(this._internalMeshDataInfo._onMeshReadyObserverAdded);
    if (source) {
      source.onClonedObservable.notifyObservers(this);
    }
  }
  instantiateHierarchy(newParent = null, options, onNewNodeCreated) {
    const instance = this.getTotalVertices() === 0 || options && options.doNotInstantiate && (options.doNotInstantiate === true || options.doNotInstantiate(this)) ? this.clone("Clone of " + (this.name || this.id), newParent || this.parent, true) : this.createInstance("instance of " + (this.name || this.id));
    instance.parent = newParent || this.parent;
    instance.position = this.position.clone();
    instance.scaling = this.scaling.clone();
    if (this.rotationQuaternion) {
      instance.rotationQuaternion = this.rotationQuaternion.clone();
    } else {
      instance.rotation = this.rotation.clone();
    }
    if (onNewNodeCreated) {
      onNewNodeCreated(this, instance);
    }
    for (const child of this.getChildTransformNodes(true)) {
      if (child.getClassName() === "InstancedMesh" && instance.getClassName() === "Mesh" && child.sourceMesh === this) {
        child.instantiateHierarchy(instance, {
          doNotInstantiate: options && options.doNotInstantiate || false,
          newSourcedMesh: instance
        }, onNewNodeCreated);
      } else {
        child.instantiateHierarchy(instance, options, onNewNodeCreated);
      }
    }
    return instance;
  }
  /**
   * Gets the class name
   * @returns the string "Mesh".
   */
  getClassName() {
    return "Mesh";
  }
  /** @internal */
  get _isMesh() {
    return true;
  }
  /**
   * Returns a description of this mesh
   * @param fullDetails define if full details about this mesh must be used
   * @returns a descriptive string representing this mesh
   */
  toString(fullDetails) {
    let ret = super.toString(fullDetails);
    ret += ", n vertices: " + this.getTotalVertices();
    ret += ", parent: " + (this._waitingParentId ? this._waitingParentId : this.parent ? this.parent.name : "NONE");
    if (this.animations) {
      for (let i = 0; i < this.animations.length; i++) {
        ret += ", animation[0]: " + this.animations[i].toString(fullDetails);
      }
    }
    if (fullDetails) {
      if (this._geometry) {
        const ib = this.getIndices();
        const vb = this.getVerticesData(VertexBuffer.PositionKind);
        if (vb && ib) {
          ret += ", flat shading: " + (vb.length / 3 === ib.length ? "YES" : "NO");
        }
      } else {
        ret += ", flat shading: UNKNOWN";
      }
    }
    return ret;
  }
  /** @internal */
  _unBindEffect() {
    super._unBindEffect();
    for (const instance of this.instances) {
      instance._unBindEffect();
    }
  }
  /**
   * Gets a boolean indicating if this mesh has LOD
   */
  get hasLODLevels() {
    return this._internalMeshDataInfo._LODLevels.length > 0;
  }
  /**
   * Gets the list of MeshLODLevel associated with the current mesh
   * @returns an array of MeshLODLevel
   */
  getLODLevels() {
    return this._internalMeshDataInfo._LODLevels;
  }
  _sortLODLevels() {
    const sortingOrderFactor = this._internalMeshDataInfo._useLODScreenCoverage ? -1 : 1;
    this._internalMeshDataInfo._LODLevels.sort((a, b) => {
      if (a.distanceOrScreenCoverage < b.distanceOrScreenCoverage) {
        return sortingOrderFactor;
      }
      if (a.distanceOrScreenCoverage > b.distanceOrScreenCoverage) {
        return -sortingOrderFactor;
      }
      return 0;
    });
  }
  /**
   * Add a mesh as LOD level triggered at the given distance.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD
   * @param distanceOrScreenCoverage Either distance from the center of the object to show this level or the screen coverage if `useScreenCoverage` is set to `true`.
   * If screen coverage, value is a fraction of the screen's total surface, between 0 and 1.
   * Example Playground for distance https://playground.babylonjs.com/#QE7KM#197
   * Example Playground for screen coverage https://playground.babylonjs.com/#QE7KM#196
   * @param mesh The mesh to be added as LOD level (can be null)
   * @returns This mesh (for chaining)
   */
  addLODLevel(distanceOrScreenCoverage, mesh) {
    if (mesh && mesh._masterMesh) {
      Logger.Warn("You cannot use a mesh as LOD level twice");
      return this;
    }
    const level = new MeshLODLevel(distanceOrScreenCoverage, mesh);
    this._internalMeshDataInfo._LODLevels.push(level);
    if (mesh) {
      mesh._masterMesh = this;
    }
    this._sortLODLevels();
    return this;
  }
  /**
   * Returns the LOD level mesh at the passed distance or null if not found.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD
   * @param distance The distance from the center of the object to show this level
   * @returns a Mesh or `null`
   */
  getLODLevelAtDistance(distance) {
    const internalDataInfo = this._internalMeshDataInfo;
    for (let index = 0; index < internalDataInfo._LODLevels.length; index++) {
      const level = internalDataInfo._LODLevels[index];
      if (level.distanceOrScreenCoverage === distance) {
        return level.mesh;
      }
    }
    return null;
  }
  /**
   * Remove a mesh from the LOD array
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD
   * @param mesh defines the mesh to be removed
   * @returns This mesh (for chaining)
   */
  removeLODLevel(mesh) {
    const internalDataInfo = this._internalMeshDataInfo;
    for (let index = 0; index < internalDataInfo._LODLevels.length; index++) {
      if (internalDataInfo._LODLevels[index].mesh === mesh) {
        internalDataInfo._LODLevels.splice(index, 1);
        if (mesh) {
          mesh._masterMesh = null;
        }
      }
    }
    this._sortLODLevels();
    return this;
  }
  /**
   * Returns the registered LOD mesh distant from the parameter `camera` position if any, else returns the current mesh.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD
   * @param camera defines the camera to use to compute distance
   * @param boundingSphere defines a custom bounding sphere to use instead of the one from this mesh
   * @returns This mesh (for chaining)
   */
  getLOD(camera, boundingSphere) {
    const internalDataInfo = this._internalMeshDataInfo;
    if (!internalDataInfo._LODLevels || internalDataInfo._LODLevels.length === 0) {
      return this;
    }
    const bSphere = boundingSphere || this.getBoundingInfo().boundingSphere;
    const distanceToCamera = camera.mode === Camera.ORTHOGRAPHIC_CAMERA ? camera.minZ : bSphere.centerWorld.subtract(camera.globalPosition).length();
    let compareValue = distanceToCamera;
    let compareSign = 1;
    if (internalDataInfo._useLODScreenCoverage) {
      const screenArea = camera.screenArea;
      let meshArea = bSphere.radiusWorld * camera.minZ / distanceToCamera;
      meshArea = meshArea * meshArea * Math.PI;
      compareValue = meshArea / screenArea;
      compareSign = -1;
    }
    if (compareSign * internalDataInfo._LODLevels[internalDataInfo._LODLevels.length - 1].distanceOrScreenCoverage > compareSign * compareValue) {
      if (this.onLODLevelSelection) {
        this.onLODLevelSelection(compareValue, this, this);
      }
      return this;
    }
    for (let index = 0; index < internalDataInfo._LODLevels.length; index++) {
      const level = internalDataInfo._LODLevels[index];
      if (compareSign * level.distanceOrScreenCoverage < compareSign * compareValue) {
        if (level.mesh) {
          if (level.mesh.delayLoadState === 4) {
            level.mesh._checkDelayState();
            return this;
          }
          if (level.mesh.delayLoadState === 2) {
            return this;
          }
          level.mesh._preActivate();
          level.mesh._updateSubMeshesBoundingInfo(this.worldMatrixFromCache);
        }
        if (this.onLODLevelSelection) {
          this.onLODLevelSelection(compareValue, this, level.mesh);
        }
        return level.mesh;
      }
    }
    if (this.onLODLevelSelection) {
      this.onLODLevelSelection(compareValue, this, this);
    }
    return this;
  }
  /**
   * Gets the mesh internal Geometry object
   */
  get geometry() {
    return this._geometry;
  }
  /**
   * Returns the total number of vertices within the mesh geometry or zero if the mesh has no geometry.
   * @returns the total number of vertices
   */
  getTotalVertices() {
    if (this._geometry === null || this._geometry === void 0) {
      return 0;
    }
    return this._geometry.getTotalVertices();
  }
  /**
   * Returns the content of an associated vertex buffer
   * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param copyWhenShared defines a boolean indicating that if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one
   * @param forceCopy defines a boolean forcing the copy of the buffer no matter what the value of copyWhenShared is
   * @param bypassInstanceData defines a boolean indicating that the function should not take into account the instance data (applies only if the mesh has instances). Default: false
   * @returns a FloatArray or null if the mesh has no geometry or no vertex buffer for this kind.
   */
  getVerticesData(kind, copyWhenShared, forceCopy, bypassInstanceData) {
    var _a, _b;
    if (!this._geometry) {
      return null;
    }
    let data = bypassInstanceData ? void 0 : (_b = (_a = this._userInstancedBuffersStorage) === null || _a === void 0 ? void 0 : _a.vertexBuffers[kind]) === null || _b === void 0 ? void 0 : _b.getFloatData(
      this.instances.length + 1,
      // +1 because the master mesh is not included in the instances array
      forceCopy || copyWhenShared && this._geometry.meshes.length !== 1
    );
    if (!data) {
      data = this._geometry.getVerticesData(kind, copyWhenShared, forceCopy);
    }
    return data;
  }
  /**
   * Returns the mesh VertexBuffer object from the requested `kind`
   * @param kind defines which buffer to read from (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.NormalKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param bypassInstanceData defines a boolean indicating that the function should not take into account the instance data (applies only if the mesh has instances). Default: false
   * @returns a FloatArray or null if the mesh has no vertex buffer for this kind.
   */
  getVertexBuffer(kind, bypassInstanceData) {
    var _a, _b;
    if (!this._geometry) {
      return null;
    }
    return (_b = bypassInstanceData ? void 0 : (_a = this._userInstancedBuffersStorage) === null || _a === void 0 ? void 0 : _a.vertexBuffers[kind]) !== null && _b !== void 0 ? _b : this._geometry.getVertexBuffer(kind);
  }
  /**
   * Tests if a specific vertex buffer is associated with this mesh
   * @param kind defines which buffer to check (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.NormalKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param bypassInstanceData defines a boolean indicating that the function should not take into account the instance data (applies only if the mesh has instances). Default: false
   * @returns a boolean
   */
  isVerticesDataPresent(kind, bypassInstanceData) {
    var _a;
    if (!this._geometry) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    return !bypassInstanceData && ((_a = this._userInstancedBuffersStorage) === null || _a === void 0 ? void 0 : _a.vertexBuffers[kind]) !== void 0 || this._geometry.isVerticesDataPresent(kind);
  }
  /**
   * Returns a boolean defining if the vertex data for the requested `kind` is updatable.
   * @param kind defines which buffer to check (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param bypassInstanceData defines a boolean indicating that the function should not take into account the instance data (applies only if the mesh has instances). Default: false
   * @returns a boolean
   */
  isVertexBufferUpdatable(kind, bypassInstanceData) {
    var _a;
    if (!this._geometry) {
      if (this._delayInfo) {
        return this._delayInfo.indexOf(kind) !== -1;
      }
      return false;
    }
    if (!bypassInstanceData) {
      const buffer = (_a = this._userInstancedBuffersStorage) === null || _a === void 0 ? void 0 : _a.vertexBuffers[kind];
      if (buffer) {
        return buffer.isUpdatable();
      }
    }
    return this._geometry.isVertexBufferUpdatable(kind);
  }
  /**
   * Returns a string which contains the list of existing `kinds` of Vertex Data associated with this mesh.
   * @param bypassInstanceData defines a boolean indicating that the function should not take into account the instance data (applies only if the mesh has instances). Default: false
   * @returns an array of strings
   */
  getVerticesDataKinds(bypassInstanceData) {
    if (!this._geometry) {
      const result = [];
      if (this._delayInfo) {
        this._delayInfo.forEach(function(kind) {
          result.push(kind);
        });
      }
      return result;
    }
    const kinds = this._geometry.getVerticesDataKinds();
    if (!bypassInstanceData && this._userInstancedBuffersStorage) {
      for (const kind in this._userInstancedBuffersStorage.vertexBuffers) {
        if (kinds.indexOf(kind) === -1) {
          kinds.push(kind);
        }
      }
    }
    return kinds;
  }
  /**
   * Returns a positive integer : the total number of indices in this mesh geometry.
   * @returns the numner of indices or zero if the mesh has no geometry.
   */
  getTotalIndices() {
    if (!this._geometry) {
      return 0;
    }
    return this._geometry.getTotalIndices();
  }
  /**
   * Returns an array of integers or a typed array (Int32Array, Uint32Array, Uint16Array) populated with the mesh indices.
   * @param copyWhenShared If true (default false) and and if the mesh geometry is shared among some other meshes, the returned array is a copy of the internal one.
   * @param forceCopy defines a boolean indicating that the returned array must be cloned upon returning it
   * @returns the indices array or an empty array if the mesh has no geometry
   */
  getIndices(copyWhenShared, forceCopy) {
    if (!this._geometry) {
      return [];
    }
    return this._geometry.getIndices(copyWhenShared, forceCopy);
  }
  get isBlocked() {
    return this._masterMesh !== null && this._masterMesh !== void 0;
  }
  /**
   * Determine if the current mesh is ready to be rendered
   * @param completeCheck defines if a complete check (including materials and lights) has to be done (false by default)
   * @param forceInstanceSupport will check if the mesh will be ready when used with instances (false by default)
   * @returns true if all associated assets are ready (material, textures, shaders)
   */
  isReady(completeCheck = false, forceInstanceSupport = false) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (this.delayLoadState === 2) {
      return false;
    }
    if (!super.isReady(completeCheck)) {
      return false;
    }
    if (!this.subMeshes || this.subMeshes.length === 0) {
      return true;
    }
    if (!completeCheck) {
      return true;
    }
    const engine = this.getEngine();
    const scene = this.getScene();
    const hardwareInstancedRendering = forceInstanceSupport || engine.getCaps().instancedArrays && (this.instances.length > 0 || this.hasThinInstances);
    this.computeWorldMatrix();
    const mat = this.material || scene.defaultMaterial;
    if (mat) {
      if (mat._storeEffectOnSubMeshes) {
        for (const subMesh of this.subMeshes) {
          const effectiveMaterial = subMesh.getMaterial();
          if (effectiveMaterial) {
            if (effectiveMaterial._storeEffectOnSubMeshes) {
              if (!effectiveMaterial.isReadyForSubMesh(this, subMesh, hardwareInstancedRendering)) {
                return false;
              }
            } else {
              if (!effectiveMaterial.isReady(this, hardwareInstancedRendering)) {
                return false;
              }
            }
          }
        }
      } else {
        if (!mat.isReady(this, hardwareInstancedRendering)) {
          return false;
        }
      }
    }
    const currentRenderPassId = engine.currentRenderPassId;
    for (const light of this.lightSources) {
      const generators = light.getShadowGenerators();
      if (!generators) {
        continue;
      }
      const iterator = generators.values();
      for (let key = iterator.next(); key.done !== true; key = iterator.next()) {
        const generator = key.value;
        if (generator && (!((_a = generator.getShadowMap()) === null || _a === void 0 ? void 0 : _a.renderList) || ((_b = generator.getShadowMap()) === null || _b === void 0 ? void 0 : _b.renderList) && ((_d = (_c = generator.getShadowMap()) === null || _c === void 0 ? void 0 : _c.renderList) === null || _d === void 0 ? void 0 : _d.indexOf(this)) !== -1)) {
          const shadowMap = generator.getShadowMap();
          const renderPassIds = (_e = shadowMap.renderPassIds) !== null && _e !== void 0 ? _e : [engine.currentRenderPassId];
          for (let p = 0; p < renderPassIds.length; ++p) {
            engine.currentRenderPassId = renderPassIds[p];
            for (const subMesh of this.subMeshes) {
              if (!generator.isReady(subMesh, hardwareInstancedRendering, (_g = (_f = subMesh.getMaterial()) === null || _f === void 0 ? void 0 : _f.needAlphaBlendingForMesh(this)) !== null && _g !== void 0 ? _g : false)) {
                engine.currentRenderPassId = currentRenderPassId;
                return false;
              }
            }
          }
          engine.currentRenderPassId = currentRenderPassId;
        }
      }
    }
    for (const lod of this._internalMeshDataInfo._LODLevels) {
      if (lod.mesh && !lod.mesh.isReady(hardwareInstancedRendering)) {
        return false;
      }
    }
    return true;
  }
  /**
   * Gets a boolean indicating if the normals aren't to be recomputed on next mesh `positions` array update. This property is pertinent only for updatable parametric shapes.
   */
  get areNormalsFrozen() {
    return this._internalMeshDataInfo._areNormalsFrozen;
  }
  /**
   * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It prevents the mesh normals from being recomputed on next `positions` array update.
   * @returns the current mesh
   */
  freezeNormals() {
    this._internalMeshDataInfo._areNormalsFrozen = true;
    return this;
  }
  /**
   * This function affects parametric shapes on vertex position update only : ribbons, tubes, etc. It has no effect at all on other shapes. It reactivates the mesh normals computation if it was previously frozen
   * @returns the current mesh
   */
  unfreezeNormals() {
    this._internalMeshDataInfo._areNormalsFrozen = false;
    return this;
  }
  /**
   * Sets a value overriding the instance count. Only applicable when custom instanced InterleavedVertexBuffer are used rather than InstancedMeshs
   */
  set overridenInstanceCount(count) {
    this._instanceDataStorage.overridenInstanceCount = count;
  }
  // Methods
  /** @internal */
  _preActivate() {
    const internalDataInfo = this._internalMeshDataInfo;
    const sceneRenderId = this.getScene().getRenderId();
    if (internalDataInfo._preActivateId === sceneRenderId) {
      return this;
    }
    internalDataInfo._preActivateId = sceneRenderId;
    this._instanceDataStorage.visibleInstances = null;
    return this;
  }
  /**
   * @internal
   */
  _preActivateForIntermediateRendering(renderId) {
    if (this._instanceDataStorage.visibleInstances) {
      this._instanceDataStorage.visibleInstances.intermediateDefaultRenderId = renderId;
    }
    return this;
  }
  /**
   * @internal
   */
  _registerInstanceForRenderId(instance, renderId) {
    if (!this._instanceDataStorage.visibleInstances) {
      this._instanceDataStorage.visibleInstances = {
        defaultRenderId: renderId,
        selfDefaultRenderId: this._renderId
      };
    }
    if (!this._instanceDataStorage.visibleInstances[renderId]) {
      if (this._instanceDataStorage.previousRenderId !== void 0 && this._instanceDataStorage.isFrozen) {
        this._instanceDataStorage.visibleInstances[this._instanceDataStorage.previousRenderId] = null;
      }
      this._instanceDataStorage.previousRenderId = renderId;
      this._instanceDataStorage.visibleInstances[renderId] = new Array();
    }
    this._instanceDataStorage.visibleInstances[renderId].push(instance);
    return this;
  }
  _afterComputeWorldMatrix() {
    super._afterComputeWorldMatrix();
    if (!this.hasThinInstances) {
      return;
    }
    if (!this.doNotSyncBoundingInfo) {
      this.thinInstanceRefreshBoundingInfo(false);
    }
  }
  /** @internal */
  _postActivate() {
    if (this.edgesShareWithInstances && this.edgesRenderer && this.edgesRenderer.isEnabled && this._renderingGroup) {
      this._renderingGroup._edgesRenderers.pushNoDuplicate(this.edgesRenderer);
      this.edgesRenderer.customInstances.push(this.getWorldMatrix());
    }
  }
  /**
   * This method recomputes and sets a new BoundingInfo to the mesh unless it is locked.
   * This means the mesh underlying bounding box and sphere are recomputed.
   * @param applySkeleton defines whether to apply the skeleton before computing the bounding info
   * @param applyMorph  defines whether to apply the morph target before computing the bounding info
   * @returns the current mesh
   */
  refreshBoundingInfo(applySkeleton = false, applyMorph = false) {
    if (this.hasBoundingInfo && this.getBoundingInfo().isLocked) {
      return this;
    }
    const bias = this.geometry ? this.geometry.boundingBias : null;
    this._refreshBoundingInfo(this._getPositionData(applySkeleton, applyMorph), bias);
    return this;
  }
  /**
   * @internal
   */
  _createGlobalSubMesh(force) {
    const totalVertices = this.getTotalVertices();
    if (!totalVertices || !this.getIndices()) {
      return null;
    }
    if (this.subMeshes && this.subMeshes.length > 0) {
      const ib = this.getIndices();
      if (!ib) {
        return null;
      }
      const totalIndices = ib.length;
      let needToRecreate = false;
      if (force) {
        needToRecreate = true;
      } else {
        for (const submesh of this.subMeshes) {
          if (submesh.indexStart + submesh.indexCount > totalIndices) {
            needToRecreate = true;
            break;
          }
          if (submesh.verticesStart + submesh.verticesCount > totalVertices) {
            needToRecreate = true;
            break;
          }
        }
      }
      if (!needToRecreate) {
        return this.subMeshes[0];
      }
    }
    this.releaseSubMeshes();
    return new SubMesh(0, 0, totalVertices, 0, this.getTotalIndices(), this);
  }
  /**
   * This function will subdivide the mesh into multiple submeshes
   * @param count defines the expected number of submeshes
   */
  subdivide(count) {
    if (count < 1) {
      return;
    }
    const totalIndices = this.getTotalIndices();
    let subdivisionSize = totalIndices / count | 0;
    let offset = 0;
    while (subdivisionSize % 3 !== 0) {
      subdivisionSize++;
    }
    this.releaseSubMeshes();
    for (let index = 0; index < count; index++) {
      if (offset >= totalIndices) {
        break;
      }
      SubMesh.CreateFromIndices(0, offset, index === count - 1 ? totalIndices - offset : subdivisionSize, this, void 0, false);
      offset += subdivisionSize;
    }
    this.refreshBoundingInfo();
    this.synchronizeInstances();
  }
  /**
   * Copy a FloatArray into a specific associated vertex buffer
   * @param kind defines which buffer to write to (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param data defines the data source
   * @param updatable defines if the updated vertex buffer must be flagged as updatable
   * @param stride defines the data stride size (can be null)
   * @returns the current mesh
   */
  setVerticesData(kind, data, updatable = false, stride) {
    if (!this._geometry) {
      const vertexData = new VertexData();
      vertexData.set(data, kind);
      const scene = this.getScene();
      new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this);
    } else {
      this._geometry.setVerticesData(kind, data, updatable, stride);
    }
    return this;
  }
  /**
   * Delete a vertex buffer associated with this mesh
   * @param kind defines which buffer to delete (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   */
  removeVerticesData(kind) {
    if (!this._geometry) {
      return;
    }
    this._geometry.removeVerticesData(kind);
  }
  /**
   * Flags an associated vertex buffer as updatable
   * @param kind defines which buffer to use (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param updatable defines if the updated vertex buffer must be flagged as updatable
   */
  markVerticesDataAsUpdatable(kind, updatable = true) {
    const vb = this.getVertexBuffer(kind);
    if (!vb || vb.isUpdatable() === updatable) {
      return;
    }
    this.setVerticesData(kind, this.getVerticesData(kind), updatable);
  }
  /**
   * Sets the mesh global Vertex Buffer
   * @param buffer defines the buffer to use
   * @param disposeExistingBuffer disposes the existing buffer, if any (default: true)
   * @returns the current mesh
   */
  setVerticesBuffer(buffer, disposeExistingBuffer = true) {
    if (!this._geometry) {
      this._geometry = Geometry.CreateGeometryForMesh(this);
    }
    this._geometry.setVerticesBuffer(buffer, null, disposeExistingBuffer);
    return this;
  }
  /**
   * Update a specific associated vertex buffer
   * @param kind defines which buffer to write to (positions, indices, normals, etc). Possible `kind` values :
   * - VertexBuffer.PositionKind
   * - VertexBuffer.UVKind
   * - VertexBuffer.UV2Kind
   * - VertexBuffer.UV3Kind
   * - VertexBuffer.UV4Kind
   * - VertexBuffer.UV5Kind
   * - VertexBuffer.UV6Kind
   * - VertexBuffer.ColorKind
   * - VertexBuffer.MatricesIndicesKind
   * - VertexBuffer.MatricesIndicesExtraKind
   * - VertexBuffer.MatricesWeightsKind
   * - VertexBuffer.MatricesWeightsExtraKind
   * @param data defines the data source
   * @param updateExtends defines if extends info of the mesh must be updated (can be null). This is mostly useful for "position" kind
   * @param makeItUnique defines if the geometry associated with the mesh must be cloned to make the change only for this mesh (and not all meshes associated with the same geometry)
   * @returns the current mesh
   */
  updateVerticesData(kind, data, updateExtends, makeItUnique) {
    if (!this._geometry) {
      return this;
    }
    if (!makeItUnique) {
      this._geometry.updateVerticesData(kind, data, updateExtends);
    } else {
      this.makeGeometryUnique();
      this.updateVerticesData(kind, data, updateExtends, false);
    }
    return this;
  }
  /**
   * This method updates the vertex positions of an updatable mesh according to the `positionFunction` returned values.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/dynamicMeshMorph#other-shapes-updatemeshpositions
   * @param positionFunction is a simple JS function what is passed the mesh `positions` array. It doesn't need to return anything
   * @param computeNormals is a boolean (default true) to enable/disable the mesh normal recomputation after the vertex position update
   * @returns the current mesh
   */
  updateMeshPositions(positionFunction, computeNormals = true) {
    const positions = this.getVerticesData(VertexBuffer.PositionKind);
    if (!positions) {
      return this;
    }
    positionFunction(positions);
    this.updateVerticesData(VertexBuffer.PositionKind, positions, false, false);
    if (computeNormals) {
      const indices = this.getIndices();
      const normals = this.getVerticesData(VertexBuffer.NormalKind);
      if (!normals) {
        return this;
      }
      VertexData.ComputeNormals(positions, indices, normals);
      this.updateVerticesData(VertexBuffer.NormalKind, normals, false, false);
    }
    return this;
  }
  /**
   * Creates a un-shared specific occurence of the geometry for the mesh.
   * @returns the current mesh
   */
  makeGeometryUnique() {
    if (!this._geometry) {
      return this;
    }
    if (this._geometry.meshes.length === 1) {
      return this;
    }
    const oldGeometry = this._geometry;
    const geometry = this._geometry.copy(Geometry.RandomId());
    oldGeometry.releaseForMesh(this, true);
    geometry.applyToMesh(this);
    return this;
  }
  /**
   * Sets the index buffer of this mesh.
   * @param indexBuffer Defines the index buffer to use for this mesh
   * @param totalVertices Defines the total number of vertices used by the buffer
   * @param totalIndices Defines the total number of indices in the index buffer
   */
  setIndexBuffer(indexBuffer, totalVertices, totalIndices) {
    let geometry = this._geometry;
    if (!geometry) {
      geometry = new Geometry(Geometry.RandomId(), this.getScene(), void 0, void 0, this);
    }
    geometry.setIndexBuffer(indexBuffer, totalVertices, totalIndices);
  }
  /**
   * Set the index buffer of this mesh
   * @param indices defines the source data
   * @param totalVertices defines the total number of vertices referenced by this index data (can be null)
   * @param updatable defines if the updated index buffer must be flagged as updatable (default is false)
   * @returns the current mesh
   */
  setIndices(indices, totalVertices = null, updatable = false) {
    if (!this._geometry) {
      const vertexData = new VertexData();
      vertexData.indices = indices;
      const scene = this.getScene();
      new Geometry(Geometry.RandomId(), scene, vertexData, updatable, this);
    } else {
      this._geometry.setIndices(indices, totalVertices, updatable);
    }
    return this;
  }
  /**
   * Update the current index buffer
   * @param indices defines the source data
   * @param offset defines the offset in the index buffer where to store the new data (can be null)
   * @param gpuMemoryOnly defines a boolean indicating that only the GPU memory must be updated leaving the CPU version of the indices unchanged (false by default)
   * @returns the current mesh
   */
  updateIndices(indices, offset, gpuMemoryOnly = false) {
    if (!this._geometry) {
      return this;
    }
    this._geometry.updateIndices(indices, offset, gpuMemoryOnly);
    return this;
  }
  /**
   * Invert the geometry to move from a right handed system to a left handed one.
   * @returns the current mesh
   */
  toLeftHanded() {
    if (!this._geometry) {
      return this;
    }
    this._geometry.toLeftHanded();
    return this;
  }
  /**
   * @internal
   */
  _bind(subMesh, effect, fillMode, allowInstancedRendering = true) {
    if (!this._geometry) {
      return this;
    }
    const engine = this.getScene().getEngine();
    if (this.morphTargetManager && this.morphTargetManager.isUsingTextureForTargets) {
      this.morphTargetManager._bind(effect);
    }
    let indexToBind;
    if (this._unIndexed) {
      indexToBind = null;
    } else {
      switch (this._getRenderingFillMode(fillMode)) {
        case Material.PointFillMode:
          indexToBind = null;
          break;
        case Material.WireFrameFillMode:
          indexToBind = subMesh._getLinesIndexBuffer(this.getIndices(), engine);
          break;
        default:
        case Material.TriangleFillMode:
          indexToBind = this._geometry.getIndexBuffer();
          break;
      }
    }
    if (!allowInstancedRendering || !this._userInstancedBuffersStorage || this.hasThinInstances) {
      this._geometry._bind(effect, indexToBind);
    } else {
      this._geometry._bind(effect, indexToBind, this._userInstancedBuffersStorage.vertexBuffers, this._userInstancedBuffersStorage.vertexArrayObjects);
    }
    return this;
  }
  /**
   * @internal
   */
  _draw(subMesh, fillMode, instancesCount) {
    if (!this._geometry || !this._geometry.getVertexBuffers() || !this._unIndexed && !this._geometry.getIndexBuffer()) {
      return this;
    }
    if (this._internalMeshDataInfo._onBeforeDrawObservable) {
      this._internalMeshDataInfo._onBeforeDrawObservable.notifyObservers(this);
    }
    const scene = this.getScene();
    const engine = scene.getEngine();
    if (this._unIndexed || fillMode == Material.PointFillMode) {
      engine.drawArraysType(fillMode, subMesh.verticesStart, subMesh.verticesCount, this.forcedInstanceCount || instancesCount);
    } else if (fillMode == Material.WireFrameFillMode) {
      engine.drawElementsType(fillMode, 0, subMesh._linesIndexCount, this.forcedInstanceCount || instancesCount);
    } else {
      engine.drawElementsType(fillMode, subMesh.indexStart, subMesh.indexCount, this.forcedInstanceCount || instancesCount);
    }
    return this;
  }
  /**
   * Registers for this mesh a javascript function called just before the rendering process
   * @param func defines the function to call before rendering this mesh
   * @returns the current mesh
   */
  registerBeforeRender(func) {
    this.onBeforeRenderObservable.add(func);
    return this;
  }
  /**
   * Disposes a previously registered javascript function called before the rendering
   * @param func defines the function to remove
   * @returns the current mesh
   */
  unregisterBeforeRender(func) {
    this.onBeforeRenderObservable.removeCallback(func);
    return this;
  }
  /**
   * Registers for this mesh a javascript function called just after the rendering is complete
   * @param func defines the function to call after rendering this mesh
   * @returns the current mesh
   */
  registerAfterRender(func) {
    this.onAfterRenderObservable.add(func);
    return this;
  }
  /**
   * Disposes a previously registered javascript function called after the rendering.
   * @param func defines the function to remove
   * @returns the current mesh
   */
  unregisterAfterRender(func) {
    this.onAfterRenderObservable.removeCallback(func);
    return this;
  }
  /**
   * @internal
   */
  _getInstancesRenderList(subMeshId, isReplacementMode = false) {
    if (this._instanceDataStorage.isFrozen) {
      if (isReplacementMode) {
        this._instanceDataStorage.batchCacheReplacementModeInFrozenMode.hardwareInstancedRendering[subMeshId] = false;
        this._instanceDataStorage.batchCacheReplacementModeInFrozenMode.renderSelf[subMeshId] = true;
        return this._instanceDataStorage.batchCacheReplacementModeInFrozenMode;
      }
      if (this._instanceDataStorage.previousBatch) {
        return this._instanceDataStorage.previousBatch;
      }
    }
    const scene = this.getScene();
    const isInIntermediateRendering = scene._isInIntermediateRendering();
    const onlyForInstances = isInIntermediateRendering ? this._internalAbstractMeshDataInfo._onlyForInstancesIntermediate : this._internalAbstractMeshDataInfo._onlyForInstances;
    const batchCache = this._instanceDataStorage.batchCache;
    batchCache.mustReturn = false;
    batchCache.renderSelf[subMeshId] = isReplacementMode || !onlyForInstances && this.isEnabled() && this.isVisible;
    batchCache.visibleInstances[subMeshId] = null;
    if (this._instanceDataStorage.visibleInstances && !isReplacementMode) {
      const visibleInstances = this._instanceDataStorage.visibleInstances;
      const currentRenderId = scene.getRenderId();
      const defaultRenderId = isInIntermediateRendering ? visibleInstances.intermediateDefaultRenderId : visibleInstances.defaultRenderId;
      batchCache.visibleInstances[subMeshId] = visibleInstances[currentRenderId];
      if (!batchCache.visibleInstances[subMeshId] && defaultRenderId) {
        batchCache.visibleInstances[subMeshId] = visibleInstances[defaultRenderId];
      }
    }
    batchCache.hardwareInstancedRendering[subMeshId] = !isReplacementMode && this._instanceDataStorage.hardwareInstancedRendering && batchCache.visibleInstances[subMeshId] !== null && batchCache.visibleInstances[subMeshId] !== void 0;
    this._instanceDataStorage.previousBatch = batchCache;
    return batchCache;
  }
  /**
   * @internal
   */
  _renderWithInstances(subMesh, fillMode, batch, effect, engine) {
    var _a;
    const visibleInstances = batch.visibleInstances[subMesh._id];
    const visibleInstanceCount = visibleInstances ? visibleInstances.length : 0;
    const instanceStorage = this._instanceDataStorage;
    const currentInstancesBufferSize = instanceStorage.instancesBufferSize;
    let instancesBuffer = instanceStorage.instancesBuffer;
    let instancesPreviousBuffer = instanceStorage.instancesPreviousBuffer;
    const matricesCount = visibleInstanceCount + 1;
    const bufferSize = matricesCount * 16 * 4;
    while (instanceStorage.instancesBufferSize < bufferSize) {
      instanceStorage.instancesBufferSize *= 2;
    }
    if (!instanceStorage.instancesData || currentInstancesBufferSize != instanceStorage.instancesBufferSize) {
      instanceStorage.instancesData = new Float32Array(instanceStorage.instancesBufferSize / 4);
    }
    if (this._scene.needsPreviousWorldMatrices && !instanceStorage.instancesPreviousData || currentInstancesBufferSize != instanceStorage.instancesBufferSize) {
      instanceStorage.instancesPreviousData = new Float32Array(instanceStorage.instancesBufferSize / 4);
    }
    let offset = 0;
    let instancesCount = 0;
    const renderSelf = batch.renderSelf[subMesh._id];
    const needUpdateBuffer = !instancesBuffer || currentInstancesBufferSize !== instanceStorage.instancesBufferSize || this._scene.needsPreviousWorldMatrices && !instanceStorage.instancesPreviousBuffer;
    if (!this._instanceDataStorage.manualUpdate && (!instanceStorage.isFrozen || needUpdateBuffer)) {
      const world = this.getWorldMatrix();
      if (renderSelf) {
        if (this._scene.needsPreviousWorldMatrices) {
          if (!instanceStorage.masterMeshPreviousWorldMatrix) {
            instanceStorage.masterMeshPreviousWorldMatrix = world.clone();
            instanceStorage.masterMeshPreviousWorldMatrix.copyToArray(instanceStorage.instancesPreviousData, offset);
          } else {
            instanceStorage.masterMeshPreviousWorldMatrix.copyToArray(instanceStorage.instancesPreviousData, offset);
            instanceStorage.masterMeshPreviousWorldMatrix.copyFrom(world);
          }
        }
        world.copyToArray(instanceStorage.instancesData, offset);
        offset += 16;
        instancesCount++;
      }
      if (visibleInstances) {
        if (_Mesh.INSTANCEDMESH_SORT_TRANSPARENT && this._scene.activeCamera && ((_a = subMesh.getMaterial()) === null || _a === void 0 ? void 0 : _a.needAlphaBlendingForMesh(subMesh.getRenderingMesh()))) {
          const cameraPosition = this._scene.activeCamera.globalPosition;
          for (let instanceIndex = 0; instanceIndex < visibleInstances.length; instanceIndex++) {
            const instanceMesh = visibleInstances[instanceIndex];
            instanceMesh._distanceToCamera = Vector3.Distance(instanceMesh.getBoundingInfo().boundingSphere.centerWorld, cameraPosition);
          }
          visibleInstances.sort((m1, m2) => {
            return m1._distanceToCamera > m2._distanceToCamera ? -1 : m1._distanceToCamera < m2._distanceToCamera ? 1 : 0;
          });
        }
        for (let instanceIndex = 0; instanceIndex < visibleInstances.length; instanceIndex++) {
          const instance = visibleInstances[instanceIndex];
          const matrix = instance.getWorldMatrix();
          matrix.copyToArray(instanceStorage.instancesData, offset);
          if (this._scene.needsPreviousWorldMatrices) {
            if (!instance._previousWorldMatrix) {
              instance._previousWorldMatrix = matrix.clone();
              instance._previousWorldMatrix.copyToArray(instanceStorage.instancesPreviousData, offset);
            } else {
              instance._previousWorldMatrix.copyToArray(instanceStorage.instancesPreviousData, offset);
              instance._previousWorldMatrix.copyFrom(matrix);
            }
          }
          offset += 16;
          instancesCount++;
        }
      }
    } else {
      instancesCount = (renderSelf ? 1 : 0) + visibleInstanceCount;
    }
    if (needUpdateBuffer) {
      if (instancesBuffer) {
        instancesBuffer.dispose();
      }
      if (instancesPreviousBuffer) {
        instancesPreviousBuffer.dispose();
      }
      instancesBuffer = new Buffer(engine, instanceStorage.instancesData, true, 16, false, true);
      instanceStorage.instancesBuffer = instancesBuffer;
      if (!this._userInstancedBuffersStorage) {
        this._userInstancedBuffersStorage = {
          data: {},
          vertexBuffers: {},
          strides: {},
          sizes: {},
          vertexArrayObjects: this.getEngine().getCaps().vertexArrayObject ? {} : void 0
        };
      }
      this._userInstancedBuffersStorage.vertexBuffers["world0"] = instancesBuffer.createVertexBuffer("world0", 0, 4);
      this._userInstancedBuffersStorage.vertexBuffers["world1"] = instancesBuffer.createVertexBuffer("world1", 4, 4);
      this._userInstancedBuffersStorage.vertexBuffers["world2"] = instancesBuffer.createVertexBuffer("world2", 8, 4);
      this._userInstancedBuffersStorage.vertexBuffers["world3"] = instancesBuffer.createVertexBuffer("world3", 12, 4);
      if (this._scene.needsPreviousWorldMatrices) {
        instancesPreviousBuffer = new Buffer(engine, instanceStorage.instancesPreviousData, true, 16, false, true);
        instanceStorage.instancesPreviousBuffer = instancesPreviousBuffer;
        this._userInstancedBuffersStorage.vertexBuffers["previousWorld0"] = instancesPreviousBuffer.createVertexBuffer("previousWorld0", 0, 4);
        this._userInstancedBuffersStorage.vertexBuffers["previousWorld1"] = instancesPreviousBuffer.createVertexBuffer("previousWorld1", 4, 4);
        this._userInstancedBuffersStorage.vertexBuffers["previousWorld2"] = instancesPreviousBuffer.createVertexBuffer("previousWorld2", 8, 4);
        this._userInstancedBuffersStorage.vertexBuffers["previousWorld3"] = instancesPreviousBuffer.createVertexBuffer("previousWorld3", 12, 4);
      }
      this._invalidateInstanceVertexArrayObject();
    } else {
      if (!this._instanceDataStorage.isFrozen || this._instanceDataStorage.forceMatrixUpdates) {
        instancesBuffer.updateDirectly(instanceStorage.instancesData, 0, instancesCount);
        if (this._scene.needsPreviousWorldMatrices && (!this._instanceDataStorage.manualUpdate || this._instanceDataStorage.previousManualUpdate)) {
          instancesPreviousBuffer.updateDirectly(instanceStorage.instancesPreviousData, 0, instancesCount);
        }
      }
    }
    this._processInstancedBuffers(visibleInstances, renderSelf);
    this.getScene()._activeIndices.addCount(subMesh.indexCount * instancesCount, false);
    if (engine._currentDrawContext) {
      engine._currentDrawContext.useInstancing = true;
    }
    this._bind(subMesh, effect, fillMode);
    this._draw(subMesh, fillMode, instancesCount);
    if (this._scene.needsPreviousWorldMatrices && !needUpdateBuffer && this._instanceDataStorage.manualUpdate && (!this._instanceDataStorage.isFrozen || this._instanceDataStorage.forceMatrixUpdates) && !this._instanceDataStorage.previousManualUpdate) {
      instancesPreviousBuffer.updateDirectly(instanceStorage.instancesData, 0, instancesCount);
    }
    engine.unbindInstanceAttributes();
    return this;
  }
  /**
   * @internal
   */
  _renderWithThinInstances(subMesh, fillMode, effect, engine) {
    var _a, _b;
    const instancesCount = (_b = (_a = this._thinInstanceDataStorage) === null || _a === void 0 ? void 0 : _a.instancesCount) !== null && _b !== void 0 ? _b : 0;
    this.getScene()._activeIndices.addCount(subMesh.indexCount * instancesCount, false);
    if (engine._currentDrawContext) {
      engine._currentDrawContext.useInstancing = true;
    }
    this._bind(subMesh, effect, fillMode);
    this._draw(subMesh, fillMode, instancesCount);
    if (this._scene.needsPreviousWorldMatrices && !this._thinInstanceDataStorage.previousMatrixData && this._thinInstanceDataStorage.matrixData) {
      if (!this._thinInstanceDataStorage.previousMatrixBuffer) {
        this._thinInstanceDataStorage.previousMatrixBuffer = this._thinInstanceCreateMatrixBuffer("previousWorld", this._thinInstanceDataStorage.matrixData, false);
      } else {
        this._thinInstanceDataStorage.previousMatrixBuffer.updateDirectly(this._thinInstanceDataStorage.matrixData, 0, instancesCount);
      }
    }
    engine.unbindInstanceAttributes();
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _processInstancedBuffers(visibleInstances, renderSelf) {
  }
  /**
   * @internal
   */
  _processRendering(renderingMesh, subMesh, effect, fillMode, batch, hardwareInstancedRendering, onBeforeDraw, effectiveMaterial) {
    const scene = this.getScene();
    const engine = scene.getEngine();
    fillMode = this._getRenderingFillMode(fillMode);
    if (hardwareInstancedRendering && subMesh.getRenderingMesh().hasThinInstances) {
      this._renderWithThinInstances(subMesh, fillMode, effect, engine);
      return this;
    }
    if (hardwareInstancedRendering) {
      this._renderWithInstances(subMesh, fillMode, batch, effect, engine);
    } else {
      if (engine._currentDrawContext) {
        engine._currentDrawContext.useInstancing = false;
      }
      let instanceCount = 0;
      if (batch.renderSelf[subMesh._id]) {
        if (onBeforeDraw) {
          onBeforeDraw(false, renderingMesh.getWorldMatrix(), effectiveMaterial);
        }
        instanceCount++;
        this._draw(subMesh, fillMode, this._instanceDataStorage.overridenInstanceCount);
      }
      const visibleInstancesForSubMesh = batch.visibleInstances[subMesh._id];
      if (visibleInstancesForSubMesh) {
        const visibleInstanceCount = visibleInstancesForSubMesh.length;
        instanceCount += visibleInstanceCount;
        for (let instanceIndex = 0; instanceIndex < visibleInstanceCount; instanceIndex++) {
          const instance = visibleInstancesForSubMesh[instanceIndex];
          const world = instance.getWorldMatrix();
          if (onBeforeDraw) {
            onBeforeDraw(true, world, effectiveMaterial);
          }
          this._draw(subMesh, fillMode);
        }
      }
      scene._activeIndices.addCount(subMesh.indexCount * instanceCount, false);
    }
    return this;
  }
  /**
   * @internal
   */
  _rebuild(dispose = false) {
    if (this._instanceDataStorage.instancesBuffer) {
      if (dispose) {
        this._instanceDataStorage.instancesBuffer.dispose();
      }
      this._instanceDataStorage.instancesBuffer = null;
    }
    if (this._userInstancedBuffersStorage) {
      for (const kind in this._userInstancedBuffersStorage.vertexBuffers) {
        const buffer = this._userInstancedBuffersStorage.vertexBuffers[kind];
        if (buffer) {
          if (dispose) {
            buffer.dispose();
          }
          this._userInstancedBuffersStorage.vertexBuffers[kind] = null;
        }
      }
      if (this._userInstancedBuffersStorage.vertexArrayObjects) {
        this._userInstancedBuffersStorage.vertexArrayObjects = {};
      }
    }
    this._internalMeshDataInfo._effectiveMaterial = null;
    super._rebuild(dispose);
  }
  /** @internal */
  _freeze() {
    if (!this.subMeshes) {
      return;
    }
    for (let index = 0; index < this.subMeshes.length; index++) {
      this._getInstancesRenderList(index);
    }
    this._internalMeshDataInfo._effectiveMaterial = null;
    this._instanceDataStorage.isFrozen = true;
  }
  /** @internal */
  _unFreeze() {
    this._instanceDataStorage.isFrozen = false;
    this._instanceDataStorage.previousBatch = null;
  }
  /**
   * Triggers the draw call for the mesh (or a submesh), for a specific render pass id
   * @param renderPassId defines the render pass id to use to draw the mesh / submesh. If not provided, use the current renderPassId of the engine.
   * @param enableAlphaMode defines if alpha mode can be changed (default: false)
   * @param effectiveMeshReplacement defines an optional mesh used to provide info for the rendering (default: undefined)
   * @param subMesh defines the subMesh to render. If not provided, draw all mesh submeshes (default: undefined)
   * @param checkFrustumCulling defines if frustum culling must be checked (default: true). If you know the mesh is in the frustum (or if you don't care!), you can pass false to optimize.
   * @returns the current mesh
   */
  renderWithRenderPassId(renderPassId, enableAlphaMode, effectiveMeshReplacement, subMesh, checkFrustumCulling = true) {
    const engine = this._scene.getEngine();
    const currentRenderPassId = engine.currentRenderPassId;
    if (renderPassId !== void 0) {
      engine.currentRenderPassId = renderPassId;
    }
    if (subMesh) {
      if (!checkFrustumCulling || checkFrustumCulling && subMesh.isInFrustum(this._scene._frustumPlanes)) {
        this.render(subMesh, !!enableAlphaMode, effectiveMeshReplacement);
      }
    } else {
      for (let s = 0; s < this.subMeshes.length; s++) {
        const subMesh2 = this.subMeshes[s];
        if (!checkFrustumCulling || checkFrustumCulling && subMesh2.isInFrustum(this._scene._frustumPlanes)) {
          this.render(subMesh2, !!enableAlphaMode, effectiveMeshReplacement);
        }
      }
    }
    if (renderPassId !== void 0) {
      engine.currentRenderPassId = currentRenderPassId;
    }
    return this;
  }
  /**
   * Triggers the draw call for the mesh. Usually, you don't need to call this method by your own because the mesh rendering is handled by the scene rendering manager
   * @param subMesh defines the subMesh to render
   * @param enableAlphaMode defines if alpha mode can be changed
   * @param effectiveMeshReplacement defines an optional mesh used to provide info for the rendering
   * @returns the current mesh
   */
  render(subMesh, enableAlphaMode, effectiveMeshReplacement) {
    var _a, _b, _c, _d, _e;
    const scene = this.getScene();
    if (this._internalAbstractMeshDataInfo._isActiveIntermediate) {
      this._internalAbstractMeshDataInfo._isActiveIntermediate = false;
    } else {
      this._internalAbstractMeshDataInfo._isActive = false;
    }
    const numActiveCameras = (_b = (_a = scene.activeCameras) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    const canCheckOcclusionQuery = numActiveCameras > 1 && scene.activeCamera === scene.activeCameras[0] || numActiveCameras <= 1;
    if (canCheckOcclusionQuery && this._checkOcclusionQuery() && !this._occlusionDataStorage.forceRenderingWhenOccluded) {
      return this;
    }
    const batch = this._getInstancesRenderList(subMesh._id, !!effectiveMeshReplacement);
    if (batch.mustReturn) {
      return this;
    }
    if (!this._geometry || !this._geometry.getVertexBuffers() || !this._unIndexed && !this._geometry.getIndexBuffer()) {
      return this;
    }
    const engine = scene.getEngine();
    let oldCameraMaxZ = 0;
    let oldCamera = null;
    if (this.ignoreCameraMaxZ && scene.activeCamera && !scene._isInIntermediateRendering()) {
      oldCameraMaxZ = scene.activeCamera.maxZ;
      oldCamera = scene.activeCamera;
      scene.activeCamera.maxZ = 0;
      scene.updateTransformMatrix(true);
    }
    if (this._internalMeshDataInfo._onBeforeRenderObservable) {
      this._internalMeshDataInfo._onBeforeRenderObservable.notifyObservers(this);
    }
    const renderingMesh = subMesh.getRenderingMesh();
    const hardwareInstancedRendering = batch.hardwareInstancedRendering[subMesh._id] || renderingMesh.hasThinInstances || !!this._userInstancedBuffersStorage && !subMesh.getMesh()._internalAbstractMeshDataInfo._actAsRegularMesh;
    const instanceDataStorage = this._instanceDataStorage;
    const material = subMesh.getMaterial();
    if (!material) {
      if (oldCamera) {
        oldCamera.maxZ = oldCameraMaxZ;
        scene.updateTransformMatrix(true);
      }
      return this;
    }
    if (!instanceDataStorage.isFrozen || !this._internalMeshDataInfo._effectiveMaterial || this._internalMeshDataInfo._effectiveMaterial !== material) {
      if (material._storeEffectOnSubMeshes) {
        if (!material.isReadyForSubMesh(this, subMesh, hardwareInstancedRendering)) {
          if (oldCamera) {
            oldCamera.maxZ = oldCameraMaxZ;
            scene.updateTransformMatrix(true);
          }
          return this;
        }
      } else if (!material.isReady(this, hardwareInstancedRendering)) {
        if (oldCamera) {
          oldCamera.maxZ = oldCameraMaxZ;
          scene.updateTransformMatrix(true);
        }
        return this;
      }
      this._internalMeshDataInfo._effectiveMaterial = material;
    } else if (material._storeEffectOnSubMeshes && !((_c = subMesh.effect) === null || _c === void 0 ? void 0 : _c._wasPreviouslyReady) || !material._storeEffectOnSubMeshes && !((_d = material.getEffect()) === null || _d === void 0 ? void 0 : _d._wasPreviouslyReady)) {
      if (oldCamera) {
        oldCamera.maxZ = oldCameraMaxZ;
        scene.updateTransformMatrix(true);
      }
      return this;
    }
    if (enableAlphaMode) {
      engine.setAlphaMode(this._internalMeshDataInfo._effectiveMaterial.alphaMode);
    }
    let drawWrapper;
    if (this._internalMeshDataInfo._effectiveMaterial._storeEffectOnSubMeshes) {
      drawWrapper = subMesh._drawWrapper;
    } else {
      drawWrapper = this._internalMeshDataInfo._effectiveMaterial._getDrawWrapper();
    }
    const effect = (_e = drawWrapper === null || drawWrapper === void 0 ? void 0 : drawWrapper.effect) !== null && _e !== void 0 ? _e : null;
    for (const step of scene._beforeRenderingMeshStage) {
      step.action(this, subMesh, batch, effect);
    }
    if (!drawWrapper || !effect) {
      if (oldCamera) {
        oldCamera.maxZ = oldCameraMaxZ;
        scene.updateTransformMatrix(true);
      }
      return this;
    }
    const effectiveMesh = effectiveMeshReplacement || this;
    let sideOrientation;
    if (!instanceDataStorage.isFrozen && (this._internalMeshDataInfo._effectiveMaterial.backFaceCulling || this.overrideMaterialSideOrientation !== null || this._internalMeshDataInfo._effectiveMaterial.twoSidedLighting)) {
      const mainDeterminant = effectiveMesh._getWorldMatrixDeterminant();
      sideOrientation = this.overrideMaterialSideOrientation;
      if (sideOrientation == null) {
        sideOrientation = this._internalMeshDataInfo._effectiveMaterial.sideOrientation;
      }
      if (mainDeterminant < 0) {
        sideOrientation = sideOrientation === Material.ClockWiseSideOrientation ? Material.CounterClockWiseSideOrientation : Material.ClockWiseSideOrientation;
      }
      instanceDataStorage.sideOrientation = sideOrientation;
    } else {
      sideOrientation = instanceDataStorage.sideOrientation;
    }
    const reverse = this._internalMeshDataInfo._effectiveMaterial._preBind(drawWrapper, sideOrientation);
    if (this._internalMeshDataInfo._effectiveMaterial.forceDepthWrite) {
      engine.setDepthWrite(true);
    }
    const effectiveMaterial = this._internalMeshDataInfo._effectiveMaterial;
    const fillMode = effectiveMaterial.fillMode;
    if (this._internalMeshDataInfo._onBeforeBindObservable) {
      this._internalMeshDataInfo._onBeforeBindObservable.notifyObservers(this);
    }
    if (!hardwareInstancedRendering) {
      this._bind(subMesh, effect, fillMode, false);
    }
    const world = effectiveMesh.getWorldMatrix();
    if (effectiveMaterial._storeEffectOnSubMeshes) {
      effectiveMaterial.bindForSubMesh(world, this, subMesh);
    } else {
      effectiveMaterial.bind(world, this);
    }
    if (!effectiveMaterial.backFaceCulling && effectiveMaterial.separateCullingPass) {
      engine.setState(true, effectiveMaterial.zOffset, false, !reverse, effectiveMaterial.cullBackFaces, effectiveMaterial.stencil, effectiveMaterial.zOffsetUnits);
      this._processRendering(this, subMesh, effect, fillMode, batch, hardwareInstancedRendering, this._onBeforeDraw, this._internalMeshDataInfo._effectiveMaterial);
      engine.setState(true, effectiveMaterial.zOffset, false, reverse, effectiveMaterial.cullBackFaces, effectiveMaterial.stencil, effectiveMaterial.zOffsetUnits);
      if (this._internalMeshDataInfo._onBetweenPassObservable) {
        this._internalMeshDataInfo._onBetweenPassObservable.notifyObservers(subMesh);
      }
    }
    this._processRendering(this, subMesh, effect, fillMode, batch, hardwareInstancedRendering, this._onBeforeDraw, this._internalMeshDataInfo._effectiveMaterial);
    this._internalMeshDataInfo._effectiveMaterial.unbind();
    for (const step of scene._afterRenderingMeshStage) {
      step.action(this, subMesh, batch, effect);
    }
    if (this._internalMeshDataInfo._onAfterRenderObservable) {
      this._internalMeshDataInfo._onAfterRenderObservable.notifyObservers(this);
    }
    if (oldCamera) {
      oldCamera.maxZ = oldCameraMaxZ;
      scene.updateTransformMatrix(true);
    }
    if (scene.performancePriority === ScenePerformancePriority.Aggressive && !instanceDataStorage.isFrozen) {
      this._freeze();
    }
    return this;
  }
  /**
   *   Renormalize the mesh and patch it up if there are no weights
   *   Similar to normalization by adding the weights compute the reciprocal and multiply all elements, this wil ensure that everything adds to 1.
   *   However in the case of zero weights then we set just a single influence to 1.
   *   We check in the function for extra's present and if so we use the normalizeSkinWeightsWithExtras rather than the FourWeights version.
   */
  cleanMatrixWeights() {
    if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      if (this.isVerticesDataPresent(VertexBuffer.MatricesWeightsExtraKind)) {
        this._normalizeSkinWeightsAndExtra();
      } else {
        this._normalizeSkinFourWeights();
      }
    }
  }
  // faster 4 weight version.
  _normalizeSkinFourWeights() {
    const matricesWeights = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
    const numWeights = matricesWeights.length;
    for (let a = 0; a < numWeights; a += 4) {
      const t = matricesWeights[a] + matricesWeights[a + 1] + matricesWeights[a + 2] + matricesWeights[a + 3];
      if (t === 0) {
        matricesWeights[a] = 1;
      } else {
        const recip = 1 / t;
        matricesWeights[a] *= recip;
        matricesWeights[a + 1] *= recip;
        matricesWeights[a + 2] *= recip;
        matricesWeights[a + 3] *= recip;
      }
    }
    this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeights);
  }
  // handle special case of extra verts.  (in theory gltf can handle 12 influences)
  _normalizeSkinWeightsAndExtra() {
    const matricesWeightsExtra = this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind);
    const matricesWeights = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
    const numWeights = matricesWeights.length;
    for (let a = 0; a < numWeights; a += 4) {
      let t = matricesWeights[a] + matricesWeights[a + 1] + matricesWeights[a + 2] + matricesWeights[a + 3];
      t += matricesWeightsExtra[a] + matricesWeightsExtra[a + 1] + matricesWeightsExtra[a + 2] + matricesWeightsExtra[a + 3];
      if (t === 0) {
        matricesWeights[a] = 1;
      } else {
        const recip = 1 / t;
        matricesWeights[a] *= recip;
        matricesWeights[a + 1] *= recip;
        matricesWeights[a + 2] *= recip;
        matricesWeights[a + 3] *= recip;
        matricesWeightsExtra[a] *= recip;
        matricesWeightsExtra[a + 1] *= recip;
        matricesWeightsExtra[a + 2] *= recip;
        matricesWeightsExtra[a + 3] *= recip;
      }
    }
    this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeights);
    this.setVerticesData(VertexBuffer.MatricesWeightsKind, matricesWeightsExtra);
  }
  /**
   * ValidateSkinning is used to determine that a mesh has valid skinning data along with skin metrics, if missing weights,
   * or not normalized it is returned as invalid mesh the string can be used for console logs, or on screen messages to let
   * the user know there was an issue with importing the mesh
   * @returns a validation object with skinned, valid and report string
   */
  validateSkinning() {
    const matricesWeightsExtra = this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind);
    const matricesWeights = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
    if (matricesWeights === null || this.skeleton == null) {
      return { skinned: false, valid: true, report: "not skinned" };
    }
    const numWeights = matricesWeights.length;
    let numberNotSorted = 0;
    let missingWeights = 0;
    let maxUsedWeights = 0;
    let numberNotNormalized = 0;
    const numInfluences = matricesWeightsExtra === null ? 4 : 8;
    const usedWeightCounts = [];
    for (let a = 0; a <= numInfluences; a++) {
      usedWeightCounts[a] = 0;
    }
    const toleranceEpsilon = 1e-3;
    for (let a = 0; a < numWeights; a += 4) {
      let lastWeight = matricesWeights[a];
      let t = lastWeight;
      let usedWeights = t === 0 ? 0 : 1;
      for (let b = 1; b < numInfluences; b++) {
        const d = b < 4 ? matricesWeights[a + b] : matricesWeightsExtra[a + b - 4];
        if (d > lastWeight) {
          numberNotSorted++;
        }
        if (d !== 0) {
          usedWeights++;
        }
        t += d;
        lastWeight = d;
      }
      usedWeightCounts[usedWeights]++;
      if (usedWeights > maxUsedWeights) {
        maxUsedWeights = usedWeights;
      }
      if (t === 0) {
        missingWeights++;
      } else {
        const recip = 1 / t;
        let tolerance = 0;
        for (let b = 0; b < numInfluences; b++) {
          if (b < 4) {
            tolerance += Math.abs(matricesWeights[a + b] - matricesWeights[a + b] * recip);
          } else {
            tolerance += Math.abs(matricesWeightsExtra[a + b - 4] - matricesWeightsExtra[a + b - 4] * recip);
          }
        }
        if (tolerance > toleranceEpsilon) {
          numberNotNormalized++;
        }
      }
    }
    const numBones = this.skeleton.bones.length;
    const matricesIndices = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
    const matricesIndicesExtra = this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind);
    let numBadBoneIndices = 0;
    for (let a = 0; a < numWeights; a += 4) {
      for (let b = 0; b < numInfluences; b++) {
        const index = b < 4 ? matricesIndices[a + b] : matricesIndicesExtra[a + b - 4];
        if (index >= numBones || index < 0) {
          numBadBoneIndices++;
        }
      }
    }
    const output = "Number of Weights = " + numWeights / 4 + "\nMaximum influences = " + maxUsedWeights + "\nMissing Weights = " + missingWeights + "\nNot Sorted = " + numberNotSorted + "\nNot Normalized = " + numberNotNormalized + "\nWeightCounts = [" + usedWeightCounts + "]\nNumber of bones = " + numBones + "\nBad Bone Indices = " + numBadBoneIndices;
    return { skinned: true, valid: missingWeights === 0 && numberNotNormalized === 0 && numBadBoneIndices === 0, report: output };
  }
  /** @internal */
  _checkDelayState() {
    const scene = this.getScene();
    if (this._geometry) {
      this._geometry.load(scene);
    } else if (this.delayLoadState === 4) {
      this.delayLoadState = 2;
      this._queueLoad(scene);
    }
    return this;
  }
  _queueLoad(scene) {
    scene.addPendingData(this);
    const getBinaryData = this.delayLoadingFile.indexOf(".babylonbinarymeshdata") !== -1;
    Tools.LoadFile(this.delayLoadingFile, (data) => {
      if (data instanceof ArrayBuffer) {
        this._delayLoadingFunction(data, this);
      } else {
        this._delayLoadingFunction(JSON.parse(data), this);
      }
      this.instances.forEach((instance) => {
        instance.refreshBoundingInfo();
        instance._syncSubMeshes();
      });
      this.delayLoadState = 1;
      scene.removePendingData(this);
    }, () => {
    }, scene.offlineProvider, getBinaryData);
    return this;
  }
  /**
   * Returns `true` if the mesh is within the frustum defined by the passed array of planes.
   * A mesh is in the frustum if its bounding box intersects the frustum
   * @param frustumPlanes defines the frustum to test
   * @returns true if the mesh is in the frustum planes
   */
  isInFrustum(frustumPlanes) {
    if (this.delayLoadState === 2) {
      return false;
    }
    if (!super.isInFrustum(frustumPlanes)) {
      return false;
    }
    this._checkDelayState();
    return true;
  }
  /**
   * Sets the mesh material by the material or multiMaterial `id` property
   * @param id is a string identifying the material or the multiMaterial
   * @returns the current mesh
   */
  setMaterialById(id) {
    const materials = this.getScene().materials;
    let index;
    for (index = materials.length - 1; index > -1; index--) {
      if (materials[index].id === id) {
        this.material = materials[index];
        return this;
      }
    }
    const multiMaterials = this.getScene().multiMaterials;
    for (index = multiMaterials.length - 1; index > -1; index--) {
      if (multiMaterials[index].id === id) {
        this.material = multiMaterials[index];
        return this;
      }
    }
    return this;
  }
  /**
   * Returns as a new array populated with the mesh material and/or skeleton, if any.
   * @returns an array of IAnimatable
   */
  getAnimatables() {
    const results = [];
    if (this.material) {
      results.push(this.material);
    }
    if (this.skeleton) {
      results.push(this.skeleton);
    }
    return results;
  }
  /**
   * Modifies the mesh geometry according to the passed transformation matrix.
   * This method returns nothing, but it really modifies the mesh even if it's originally not set as updatable.
   * The mesh normals are modified using the same transformation.
   * Note that, under the hood, this method sets a new VertexBuffer each call.
   * @param transform defines the transform matrix to use
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/bakingTransforms
   * @returns the current mesh
   */
  bakeTransformIntoVertices(transform) {
    if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      return this;
    }
    const submeshes = this.subMeshes.splice(0);
    this._resetPointsArrayCache();
    let data = this.getVerticesData(VertexBuffer.PositionKind);
    const temp = Vector3.Zero();
    let index;
    for (index = 0; index < data.length; index += 3) {
      Vector3.TransformCoordinatesFromFloatsToRef(data[index], data[index + 1], data[index + 2], transform, temp).toArray(data, index);
    }
    this.setVerticesData(VertexBuffer.PositionKind, data, this.getVertexBuffer(VertexBuffer.PositionKind).isUpdatable());
    if (this.isVerticesDataPresent(VertexBuffer.NormalKind)) {
      data = this.getVerticesData(VertexBuffer.NormalKind);
      for (index = 0; index < data.length; index += 3) {
        Vector3.TransformNormalFromFloatsToRef(data[index], data[index + 1], data[index + 2], transform, temp).normalize().toArray(data, index);
      }
      this.setVerticesData(VertexBuffer.NormalKind, data, this.getVertexBuffer(VertexBuffer.NormalKind).isUpdatable());
    }
    if (transform.determinant() < 0) {
      this.flipFaces();
    }
    this.releaseSubMeshes();
    this.subMeshes = submeshes;
    return this;
  }
  /**
   * Modifies the mesh geometry according to its own current World Matrix.
   * The mesh World Matrix is then reset.
   * This method returns nothing but really modifies the mesh even if it's originally not set as updatable.
   * Note that, under the hood, this method sets a new VertexBuffer each call.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/bakingTransforms
   * @param bakeIndependentlyOfChildren indicates whether to preserve all child nodes' World Matrix during baking
   * @returns the current mesh
   */
  bakeCurrentTransformIntoVertices(bakeIndependentlyOfChildren = true) {
    this.bakeTransformIntoVertices(this.computeWorldMatrix(true));
    this.resetLocalMatrix(bakeIndependentlyOfChildren);
    return this;
  }
  // Cache
  /** @internal */
  get _positions() {
    if (this._internalAbstractMeshDataInfo._positions) {
      return this._internalAbstractMeshDataInfo._positions;
    }
    if (this._geometry) {
      return this._geometry._positions;
    }
    return null;
  }
  /** @internal */
  _resetPointsArrayCache() {
    if (this._geometry) {
      this._geometry._resetPointsArrayCache();
    }
    return this;
  }
  /** @internal */
  _generatePointsArray() {
    if (this._geometry) {
      return this._geometry._generatePointsArray();
    }
    return false;
  }
  /**
   * Returns a new Mesh object generated from the current mesh properties.
   * This method must not get confused with createInstance()
   * @param name is a string, the name given to the new mesh
   * @param newParent can be any Node object (default `null`)
   * @param doNotCloneChildren allows/denies the recursive cloning of the original mesh children if any (default `false`)
   * @param clonePhysicsImpostor allows/denies the cloning in the same time of the original mesh `body` used by the physics engine, if any (default `true`)
   * @returns a new mesh
   */
  clone(name47 = "", newParent = null, doNotCloneChildren, clonePhysicsImpostor = true) {
    return new _Mesh(name47, this.getScene(), newParent, this, doNotCloneChildren, clonePhysicsImpostor);
  }
  /**
   * Releases resources associated with this mesh.
   * @param doNotRecurse Set to true to not recurse into each children (recurse into each children by default)
   * @param disposeMaterialAndTextures Set to true to also dispose referenced materials and textures (false by default)
   */
  dispose(doNotRecurse, disposeMaterialAndTextures = false) {
    this.morphTargetManager = null;
    if (this._geometry) {
      this._geometry.releaseForMesh(this, true);
    }
    const internalDataInfo = this._internalMeshDataInfo;
    if (internalDataInfo._onBeforeDrawObservable) {
      internalDataInfo._onBeforeDrawObservable.clear();
    }
    if (internalDataInfo._onBeforeBindObservable) {
      internalDataInfo._onBeforeBindObservable.clear();
    }
    if (internalDataInfo._onBeforeRenderObservable) {
      internalDataInfo._onBeforeRenderObservable.clear();
    }
    if (internalDataInfo._onAfterRenderObservable) {
      internalDataInfo._onAfterRenderObservable.clear();
    }
    if (internalDataInfo._onBetweenPassObservable) {
      internalDataInfo._onBetweenPassObservable.clear();
    }
    if (this._scene.useClonedMeshMap) {
      if (internalDataInfo.meshMap) {
        for (const uniqueId in internalDataInfo.meshMap) {
          const mesh = internalDataInfo.meshMap[uniqueId];
          if (mesh) {
            mesh._internalMeshDataInfo._source = null;
            internalDataInfo.meshMap[uniqueId] = void 0;
          }
        }
      }
      if (internalDataInfo._source && internalDataInfo._source._internalMeshDataInfo.meshMap) {
        internalDataInfo._source._internalMeshDataInfo.meshMap[this.uniqueId] = void 0;
      }
    } else {
      const meshes = this.getScene().meshes;
      for (const abstractMesh of meshes) {
        const mesh = abstractMesh;
        if (mesh._internalMeshDataInfo && mesh._internalMeshDataInfo._source && mesh._internalMeshDataInfo._source === this) {
          mesh._internalMeshDataInfo._source = null;
        }
      }
    }
    internalDataInfo._source = null;
    this._instanceDataStorage.visibleInstances = {};
    this._disposeInstanceSpecificData();
    this._disposeThinInstanceSpecificData();
    if (this._internalMeshDataInfo._checkReadinessObserver) {
      this._scene.onBeforeRenderObservable.remove(this._internalMeshDataInfo._checkReadinessObserver);
    }
    super.dispose(doNotRecurse, disposeMaterialAndTextures);
  }
  /** @internal */
  _disposeInstanceSpecificData() {
  }
  /** @internal */
  _disposeThinInstanceSpecificData() {
  }
  /** @internal */
  _invalidateInstanceVertexArrayObject() {
  }
  /**
   * Modifies the mesh geometry according to a displacement map.
   * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
   * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
   * @param url is a string, the URL from the image file is to be downloaded.
   * @param minHeight is the lower limit of the displacement.
   * @param maxHeight is the upper limit of the displacement.
   * @param onSuccess is an optional Javascript function to be called just after the mesh is modified. It is passed the modified mesh and must return nothing.
   * @param uvOffset is an optional vector2 used to offset UV.
   * @param uvScale is an optional vector2 used to scale UV.
   * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
   * @returns the Mesh.
   */
  applyDisplacementMap(url, minHeight, maxHeight, onSuccess, uvOffset, uvScale, forceUpdate = false) {
    const scene = this.getScene();
    const onload = (img) => {
      const heightMapWidth = img.width;
      const heightMapHeight = img.height;
      const canvas = this.getEngine().createCanvas(heightMapWidth, heightMapHeight);
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      const buffer = context.getImageData(0, 0, heightMapWidth, heightMapHeight).data;
      this.applyDisplacementMapFromBuffer(buffer, heightMapWidth, heightMapHeight, minHeight, maxHeight, uvOffset, uvScale, forceUpdate);
      if (onSuccess) {
        onSuccess(this);
      }
    };
    Tools.LoadImage(url, onload, () => {
    }, scene.offlineProvider);
    return this;
  }
  /**
   * Modifies the mesh geometry according to a displacementMap buffer.
   * A displacement map is a colored image. Each pixel color value (actually a gradient computed from red, green, blue values) will give the displacement to apply to each mesh vertex.
   * The mesh must be set as updatable. Its internal geometry is directly modified, no new buffer are allocated.
   * @param buffer is a `Uint8Array` buffer containing series of `Uint8` lower than 255, the red, green, blue and alpha values of each successive pixel.
   * @param heightMapWidth is the width of the buffer image.
   * @param heightMapHeight is the height of the buffer image.
   * @param minHeight is the lower limit of the displacement.
   * @param maxHeight is the upper limit of the displacement.
   * @param uvOffset is an optional vector2 used to offset UV.
   * @param uvScale is an optional vector2 used to scale UV.
   * @param forceUpdate defines whether or not to force an update of the generated buffers. This is useful to apply on a deserialized model for instance.
   * @returns the Mesh.
   */
  applyDisplacementMapFromBuffer(buffer, heightMapWidth, heightMapHeight, minHeight, maxHeight, uvOffset, uvScale, forceUpdate = false) {
    if (!this.isVerticesDataPresent(VertexBuffer.PositionKind) || !this.isVerticesDataPresent(VertexBuffer.NormalKind) || !this.isVerticesDataPresent(VertexBuffer.UVKind)) {
      Logger.Warn("Cannot call applyDisplacementMap: Given mesh is not complete. Position, Normal or UV are missing");
      return this;
    }
    const positions = this.getVerticesData(VertexBuffer.PositionKind, true, true);
    const normals = this.getVerticesData(VertexBuffer.NormalKind);
    const uvs = this.getVerticesData(VertexBuffer.UVKind);
    let position = Vector3.Zero();
    const normal = Vector3.Zero();
    const uv = Vector2.Zero();
    uvOffset = uvOffset || Vector2.Zero();
    uvScale = uvScale || new Vector2(1, 1);
    for (let index = 0; index < positions.length; index += 3) {
      Vector3.FromArrayToRef(positions, index, position);
      Vector3.FromArrayToRef(normals, index, normal);
      Vector2.FromArrayToRef(uvs, index / 3 * 2, uv);
      const u = Math.abs(uv.x * uvScale.x + uvOffset.x % 1) * (heightMapWidth - 1) % heightMapWidth | 0;
      const v = Math.abs(uv.y * uvScale.y + uvOffset.y % 1) * (heightMapHeight - 1) % heightMapHeight | 0;
      const pos = (u + v * heightMapWidth) * 4;
      const r = buffer[pos] / 255;
      const g = buffer[pos + 1] / 255;
      const b = buffer[pos + 2] / 255;
      const gradient = r * 0.3 + g * 0.59 + b * 0.11;
      normal.normalize();
      normal.scaleInPlace(minHeight + (maxHeight - minHeight) * gradient);
      position = position.add(normal);
      position.toArray(positions, index);
    }
    VertexData.ComputeNormals(positions, this.getIndices(), normals);
    if (forceUpdate) {
      this.setVerticesData(VertexBuffer.PositionKind, positions);
      this.setVerticesData(VertexBuffer.NormalKind, normals);
      this.setVerticesData(VertexBuffer.UVKind, uvs);
    } else {
      this.updateVerticesData(VertexBuffer.PositionKind, positions);
      this.updateVerticesData(VertexBuffer.NormalKind, normals);
    }
    return this;
  }
  _getFlattenedNormals(indices, positions) {
    const normals = new Float32Array(indices.length * 3);
    let normalsCount = 0;
    const flipNormalGeneration = this.overrideMaterialSideOrientation === (this._scene.useRightHandedSystem ? 1 : 0);
    for (let index = 0; index < indices.length; index += 3) {
      const p1 = Vector3.FromArray(positions, indices[index] * 3);
      const p2 = Vector3.FromArray(positions, indices[index + 1] * 3);
      const p3 = Vector3.FromArray(positions, indices[index + 2] * 3);
      const p1p2 = p1.subtract(p2);
      const p3p2 = p3.subtract(p2);
      const normal = Vector3.Normalize(Vector3.Cross(p1p2, p3p2));
      if (flipNormalGeneration) {
        normal.scaleInPlace(-1);
      }
      for (let localIndex = 0; localIndex < 3; localIndex++) {
        normals[normalsCount++] = normal.x;
        normals[normalsCount++] = normal.y;
        normals[normalsCount++] = normal.z;
      }
    }
    return normals;
  }
  _convertToUnIndexedMesh(flattenNormals = false) {
    const kinds = this.getVerticesDataKinds();
    const indices = this.getIndices();
    const data = {};
    const separateVertices = (data2, stride) => {
      const newData = new Float32Array(indices.length * stride);
      let count = 0;
      for (let index = 0; index < indices.length; index++) {
        for (let offset = 0; offset < stride; offset++) {
          newData[count++] = data2[indices[index] * stride + offset];
        }
      }
      return newData;
    };
    const previousSubmeshes = this.geometry ? this.subMeshes.slice(0) : [];
    for (const kind of kinds) {
      data[kind] = this.getVerticesData(kind);
    }
    for (const kind of kinds) {
      const vertexBuffer = this.getVertexBuffer(kind);
      const stride = vertexBuffer.getStrideSize();
      if (flattenNormals && kind === VertexBuffer.NormalKind) {
        const normals = this._getFlattenedNormals(indices, data[VertexBuffer.PositionKind]);
        this.setVerticesData(VertexBuffer.NormalKind, normals, vertexBuffer.isUpdatable(), stride);
      } else {
        this.setVerticesData(kind, separateVertices(data[kind], stride), vertexBuffer.isUpdatable(), stride);
      }
    }
    if (this.morphTargetManager) {
      for (let targetIndex = 0; targetIndex < this.morphTargetManager.numTargets; targetIndex++) {
        const target = this.morphTargetManager.getTarget(targetIndex);
        const positions = target.getPositions();
        target.setPositions(separateVertices(positions, 3));
        const normals = target.getNormals();
        if (normals) {
          target.setNormals(flattenNormals ? this._getFlattenedNormals(indices, positions) : separateVertices(normals, 3));
        }
        const tangents = target.getTangents();
        if (tangents) {
          target.setTangents(separateVertices(tangents, 3));
        }
        const uvs = target.getUVs();
        if (uvs) {
          target.setUVs(separateVertices(uvs, 2));
        }
      }
      this.morphTargetManager.synchronize();
    }
    for (let index = 0; index < indices.length; index++) {
      indices[index] = index;
    }
    this.setIndices(indices);
    this._unIndexed = true;
    this.releaseSubMeshes();
    for (const previousOne of previousSubmeshes) {
      SubMesh.AddToMesh(previousOne.materialIndex, previousOne.indexStart, previousOne.indexCount, previousOne.indexStart, previousOne.indexCount, this);
    }
    this.synchronizeInstances();
    return this;
  }
  /**
   * Modify the mesh to get a flat shading rendering.
   * This means each mesh facet will then have its own normals. Usually new vertices are added in the mesh geometry to get this result.
   * Warning : the mesh is really modified even if not set originally as updatable and, under the hood, a new VertexBuffer is allocated.
   * @returns current mesh
   */
  convertToFlatShadedMesh() {
    return this._convertToUnIndexedMesh(true);
  }
  /**
   * This method removes all the mesh indices and add new vertices (duplication) in order to unfold facets into buffers.
   * In other words, more vertices, no more indices and a single bigger VBO.
   * The mesh is really modified even if not set originally as updatable. Under the hood, a new VertexBuffer is allocated.
   * @returns current mesh
   */
  convertToUnIndexedMesh() {
    return this._convertToUnIndexedMesh();
  }
  /**
   * Inverses facet orientations.
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   * @param flipNormals will also inverts the normals
   * @returns current mesh
   */
  flipFaces(flipNormals = false) {
    const vertex_data = VertexData.ExtractFromMesh(this);
    let i;
    if (flipNormals && this.isVerticesDataPresent(VertexBuffer.NormalKind) && vertex_data.normals) {
      for (i = 0; i < vertex_data.normals.length; i++) {
        vertex_data.normals[i] *= -1;
      }
    }
    if (vertex_data.indices) {
      let temp;
      for (i = 0; i < vertex_data.indices.length; i += 3) {
        temp = vertex_data.indices[i + 1];
        vertex_data.indices[i + 1] = vertex_data.indices[i + 2];
        vertex_data.indices[i + 2] = temp;
      }
    }
    vertex_data.applyToMesh(this, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    return this;
  }
  /**
   * Increase the number of facets and hence vertices in a mesh
   * Vertex normals are interpolated from existing vertex normals
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   * @param numberPerEdge the number of new vertices to add to each edge of a facet, optional default 1
   */
  increaseVertices(numberPerEdge = 1) {
    const vertex_data = VertexData.ExtractFromMesh(this);
    const currentIndices = vertex_data.indices && !Array.isArray(vertex_data.indices) && Array.from ? Array.from(vertex_data.indices) : vertex_data.indices;
    const positions = vertex_data.positions && !Array.isArray(vertex_data.positions) && Array.from ? Array.from(vertex_data.positions) : vertex_data.positions;
    const uvs = vertex_data.uvs && !Array.isArray(vertex_data.uvs) && Array.from ? Array.from(vertex_data.uvs) : vertex_data.uvs;
    const normals = vertex_data.normals && !Array.isArray(vertex_data.normals) && Array.from ? Array.from(vertex_data.normals) : vertex_data.normals;
    if (!currentIndices || !positions) {
      Logger.Warn("Couldn't increase number of vertices : VertexData must contain at least indices and positions");
    } else {
      vertex_data.indices = currentIndices;
      vertex_data.positions = positions;
      if (uvs) {
        vertex_data.uvs = uvs;
      }
      if (normals) {
        vertex_data.normals = normals;
      }
      const segments = numberPerEdge + 1;
      const tempIndices = new Array();
      for (let i = 0; i < segments + 1; i++) {
        tempIndices[i] = new Array();
      }
      let a;
      let b;
      const deltaPosition = new Vector3(0, 0, 0);
      const deltaNormal = new Vector3(0, 0, 0);
      const deltaUV = new Vector2(0, 0);
      const indices = new Array();
      const vertexIndex = new Array();
      const side = new Array();
      let len;
      let positionPtr = positions.length;
      let uvPtr;
      if (uvs) {
        uvPtr = uvs.length;
      }
      let normalsPtr;
      if (normals) {
        normalsPtr = normals.length;
      }
      for (let i = 0; i < currentIndices.length; i += 3) {
        vertexIndex[0] = currentIndices[i];
        vertexIndex[1] = currentIndices[i + 1];
        vertexIndex[2] = currentIndices[i + 2];
        for (let j = 0; j < 3; j++) {
          a = vertexIndex[j];
          b = vertexIndex[(j + 1) % 3];
          if (side[a] === void 0 && side[b] === void 0) {
            side[a] = new Array();
            side[b] = new Array();
          } else {
            if (side[a] === void 0) {
              side[a] = new Array();
            }
            if (side[b] === void 0) {
              side[b] = new Array();
            }
          }
          if (side[a][b] === void 0 && side[b][a] === void 0) {
            side[a][b] = [];
            deltaPosition.x = (positions[3 * b] - positions[3 * a]) / segments;
            deltaPosition.y = (positions[3 * b + 1] - positions[3 * a + 1]) / segments;
            deltaPosition.z = (positions[3 * b + 2] - positions[3 * a + 2]) / segments;
            if (normals) {
              deltaNormal.x = (normals[3 * b] - normals[3 * a]) / segments;
              deltaNormal.y = (normals[3 * b + 1] - normals[3 * a + 1]) / segments;
              deltaNormal.z = (normals[3 * b + 2] - normals[3 * a + 2]) / segments;
            }
            if (uvs) {
              deltaUV.x = (uvs[2 * b] - uvs[2 * a]) / segments;
              deltaUV.y = (uvs[2 * b + 1] - uvs[2 * a + 1]) / segments;
            }
            side[a][b].push(a);
            for (let k = 1; k < segments; k++) {
              side[a][b].push(positions.length / 3);
              positions[positionPtr++] = positions[3 * a] + k * deltaPosition.x;
              positions[positionPtr++] = positions[3 * a + 1] + k * deltaPosition.y;
              positions[positionPtr++] = positions[3 * a + 2] + k * deltaPosition.z;
              if (normals) {
                normals[normalsPtr++] = normals[3 * a] + k * deltaNormal.x;
                normals[normalsPtr++] = normals[3 * a + 1] + k * deltaNormal.y;
                normals[normalsPtr++] = normals[3 * a + 2] + k * deltaNormal.z;
              }
              if (uvs) {
                uvs[uvPtr++] = uvs[2 * a] + k * deltaUV.x;
                uvs[uvPtr++] = uvs[2 * a + 1] + k * deltaUV.y;
              }
            }
            side[a][b].push(b);
            side[b][a] = new Array();
            len = side[a][b].length;
            for (let idx = 0; idx < len; idx++) {
              side[b][a][idx] = side[a][b][len - 1 - idx];
            }
          }
        }
        tempIndices[0][0] = currentIndices[i];
        tempIndices[1][0] = side[currentIndices[i]][currentIndices[i + 1]][1];
        tempIndices[1][1] = side[currentIndices[i]][currentIndices[i + 2]][1];
        for (let k = 2; k < segments; k++) {
          tempIndices[k][0] = side[currentIndices[i]][currentIndices[i + 1]][k];
          tempIndices[k][k] = side[currentIndices[i]][currentIndices[i + 2]][k];
          deltaPosition.x = (positions[3 * tempIndices[k][k]] - positions[3 * tempIndices[k][0]]) / k;
          deltaPosition.y = (positions[3 * tempIndices[k][k] + 1] - positions[3 * tempIndices[k][0] + 1]) / k;
          deltaPosition.z = (positions[3 * tempIndices[k][k] + 2] - positions[3 * tempIndices[k][0] + 2]) / k;
          if (normals) {
            deltaNormal.x = (normals[3 * tempIndices[k][k]] - normals[3 * tempIndices[k][0]]) / k;
            deltaNormal.y = (normals[3 * tempIndices[k][k] + 1] - normals[3 * tempIndices[k][0] + 1]) / k;
            deltaNormal.z = (normals[3 * tempIndices[k][k] + 2] - normals[3 * tempIndices[k][0] + 2]) / k;
          }
          if (uvs) {
            deltaUV.x = (uvs[2 * tempIndices[k][k]] - uvs[2 * tempIndices[k][0]]) / k;
            deltaUV.y = (uvs[2 * tempIndices[k][k] + 1] - uvs[2 * tempIndices[k][0] + 1]) / k;
          }
          for (let j = 1; j < k; j++) {
            tempIndices[k][j] = positions.length / 3;
            positions[positionPtr++] = positions[3 * tempIndices[k][0]] + j * deltaPosition.x;
            positions[positionPtr++] = positions[3 * tempIndices[k][0] + 1] + j * deltaPosition.y;
            positions[positionPtr++] = positions[3 * tempIndices[k][0] + 2] + j * deltaPosition.z;
            if (normals) {
              normals[normalsPtr++] = normals[3 * tempIndices[k][0]] + j * deltaNormal.x;
              normals[normalsPtr++] = normals[3 * tempIndices[k][0] + 1] + j * deltaNormal.y;
              normals[normalsPtr++] = normals[3 * tempIndices[k][0] + 2] + j * deltaNormal.z;
            }
            if (uvs) {
              uvs[uvPtr++] = uvs[2 * tempIndices[k][0]] + j * deltaUV.x;
              uvs[uvPtr++] = uvs[2 * tempIndices[k][0] + 1] + j * deltaUV.y;
            }
          }
        }
        tempIndices[segments] = side[currentIndices[i + 1]][currentIndices[i + 2]];
        indices.push(tempIndices[0][0], tempIndices[1][0], tempIndices[1][1]);
        for (let k = 1; k < segments; k++) {
          let j;
          for (j = 0; j < k; j++) {
            indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
            indices.push(tempIndices[k][j], tempIndices[k + 1][j + 1], tempIndices[k][j + 1]);
          }
          indices.push(tempIndices[k][j], tempIndices[k + 1][j], tempIndices[k + 1][j + 1]);
        }
      }
      vertex_data.indices = indices;
      vertex_data.applyToMesh(this, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    }
  }
  /**
   * Force adjacent facets to share vertices and remove any facets that have all vertices in a line
   * This will undo any application of covertToFlatShadedMesh
   * Warning : the mesh is really modified even if not set originally as updatable. A new VertexBuffer is created under the hood each call.
   */
  forceSharedVertices() {
    const vertex_data = VertexData.ExtractFromMesh(this);
    const currentUVs = vertex_data.uvs;
    const currentIndices = vertex_data.indices;
    const currentPositions = vertex_data.positions;
    const currentColors = vertex_data.colors;
    const currentMatrixIndices = vertex_data.matricesIndices;
    const currentMatrixWeights = vertex_data.matricesWeights;
    const currentMatrixIndicesExtra = vertex_data.matricesIndicesExtra;
    const currentMatrixWeightsExtra = vertex_data.matricesWeightsExtra;
    if (currentIndices === void 0 || currentPositions === void 0 || currentIndices === null || currentPositions === null) {
      Logger.Warn("VertexData contains empty entries");
    } else {
      const positions = new Array();
      const indices = new Array();
      const uvs = new Array();
      const colors = new Array();
      const matrixIndices = new Array();
      const matrixWeights = new Array();
      const matrixIndicesExtra = new Array();
      const matrixWeightsExtra = new Array();
      let pstring = new Array();
      let indexPtr = 0;
      const uniquePositions = {};
      let ptr;
      let facet;
      for (let i = 0; i < currentIndices.length; i += 3) {
        facet = [currentIndices[i], currentIndices[i + 1], currentIndices[i + 2]];
        pstring = [];
        for (let j = 0; j < 3; j++) {
          pstring[j] = "";
          for (let k = 0; k < 3; k++) {
            if (Math.abs(currentPositions[3 * facet[j] + k]) < 1e-8) {
              currentPositions[3 * facet[j] + k] = 0;
            }
            pstring[j] += currentPositions[3 * facet[j] + k] + "|";
          }
        }
        if (!(pstring[0] == pstring[1] || pstring[0] == pstring[2] || pstring[1] == pstring[2])) {
          for (let j = 0; j < 3; j++) {
            ptr = uniquePositions[pstring[j]];
            if (ptr === void 0) {
              uniquePositions[pstring[j]] = indexPtr;
              ptr = indexPtr++;
              for (let k = 0; k < 3; k++) {
                positions.push(currentPositions[3 * facet[j] + k]);
              }
              if (currentColors !== null && currentColors !== void 0) {
                for (let k = 0; k < 4; k++) {
                  colors.push(currentColors[4 * facet[j] + k]);
                }
              }
              if (currentUVs !== null && currentUVs !== void 0) {
                for (let k = 0; k < 2; k++) {
                  uvs.push(currentUVs[2 * facet[j] + k]);
                }
              }
              if (currentMatrixIndices !== null && currentMatrixIndices !== void 0) {
                for (let k = 0; k < 4; k++) {
                  matrixIndices.push(currentMatrixIndices[4 * facet[j] + k]);
                }
              }
              if (currentMatrixWeights !== null && currentMatrixWeights !== void 0) {
                for (let k = 0; k < 4; k++) {
                  matrixWeights.push(currentMatrixWeights[4 * facet[j] + k]);
                }
              }
              if (currentMatrixIndicesExtra !== null && currentMatrixIndicesExtra !== void 0) {
                for (let k = 0; k < 4; k++) {
                  matrixIndicesExtra.push(currentMatrixIndicesExtra[4 * facet[j] + k]);
                }
              }
              if (currentMatrixWeightsExtra !== null && currentMatrixWeightsExtra !== void 0) {
                for (let k = 0; k < 4; k++) {
                  matrixWeightsExtra.push(currentMatrixWeightsExtra[4 * facet[j] + k]);
                }
              }
            }
            indices.push(ptr);
          }
        }
      }
      const normals = new Array();
      VertexData.ComputeNormals(positions, indices, normals);
      vertex_data.positions = positions;
      vertex_data.indices = indices;
      vertex_data.normals = normals;
      if (currentUVs !== null && currentUVs !== void 0) {
        vertex_data.uvs = uvs;
      }
      if (currentColors !== null && currentColors !== void 0) {
        vertex_data.colors = colors;
      }
      if (currentMatrixIndices !== null && currentMatrixIndices !== void 0) {
        vertex_data.matricesIndices = matrixIndices;
      }
      if (currentMatrixWeights !== null && currentMatrixWeights !== void 0) {
        vertex_data.matricesWeights = matrixWeights;
      }
      if (currentMatrixIndicesExtra !== null && currentMatrixIndicesExtra !== void 0) {
        vertex_data.matricesIndicesExtra = matrixIndicesExtra;
      }
      if (currentMatrixWeights !== null && currentMatrixWeights !== void 0) {
        vertex_data.matricesWeightsExtra = matrixWeightsExtra;
      }
      vertex_data.applyToMesh(this, this.isVertexBufferUpdatable(VertexBuffer.PositionKind));
    }
  }
  // Instances
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  static _instancedMeshFactory(name47, mesh) {
    throw _WarnImport("InstancedMesh");
  }
  /**
   * @internal
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static _PhysicsImpostorParser(scene, physicObject, jsonObject) {
    throw _WarnImport("PhysicsImpostor");
  }
  /**
   * Creates a new InstancedMesh object from the mesh model.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances
   * @param name defines the name of the new instance
   * @returns a new InstancedMesh
   */
  createInstance(name47) {
    return _Mesh._instancedMeshFactory(name47, this);
  }
  /**
   * Synchronises all the mesh instance submeshes to the current mesh submeshes, if any.
   * After this call, all the mesh instances have the same submeshes than the current mesh.
   * @returns the current mesh
   */
  synchronizeInstances() {
    for (let instanceIndex = 0; instanceIndex < this.instances.length; instanceIndex++) {
      const instance = this.instances[instanceIndex];
      instance._syncSubMeshes();
    }
    return this;
  }
  /**
   * Optimization of the mesh's indices, in case a mesh has duplicated vertices.
   * The function will only reorder the indices and will not remove unused vertices to avoid problems with submeshes.
   * This should be used together with the simplification to avoid disappearing triangles.
   * @param successCallback an optional success callback to be called after the optimization finished.
   * @returns the current mesh
   */
  optimizeIndices(successCallback) {
    const indices = this.getIndices();
    const positions = this.getVerticesData(VertexBuffer.PositionKind);
    if (!positions || !indices) {
      return this;
    }
    const vectorPositions = [];
    for (let pos = 0; pos < positions.length; pos = pos + 3) {
      vectorPositions.push(Vector3.FromArray(positions, pos));
    }
    const dupes = [];
    AsyncLoop.SyncAsyncForLoop(vectorPositions.length, 40, (iteration) => {
      const realPos = vectorPositions.length - 1 - iteration;
      const testedPosition = vectorPositions[realPos];
      for (let j = 0; j < realPos; ++j) {
        const againstPosition = vectorPositions[j];
        if (testedPosition.equals(againstPosition)) {
          dupes[realPos] = j;
          break;
        }
      }
    }, () => {
      for (let i = 0; i < indices.length; ++i) {
        indices[i] = dupes[indices[i]] || indices[i];
      }
      const originalSubMeshes = this.subMeshes.slice(0);
      this.setIndices(indices);
      this.subMeshes = originalSubMeshes;
      if (successCallback) {
        successCallback(this);
      }
    });
    return this;
  }
  /**
   * Serialize current mesh
   * @param serializationObject defines the object which will receive the serialization data
   */
  serialize(serializationObject = {}) {
    serializationObject.name = this.name;
    serializationObject.id = this.id;
    serializationObject.uniqueId = this.uniqueId;
    serializationObject.type = this.getClassName();
    if (Tags && Tags.HasTags(this)) {
      serializationObject.tags = Tags.GetTags(this);
    }
    serializationObject.position = this.position.asArray();
    if (this.rotationQuaternion) {
      serializationObject.rotationQuaternion = this.rotationQuaternion.asArray();
    } else if (this.rotation) {
      serializationObject.rotation = this.rotation.asArray();
    }
    serializationObject.scaling = this.scaling.asArray();
    if (this._postMultiplyPivotMatrix) {
      serializationObject.pivotMatrix = this.getPivotMatrix().asArray();
    } else {
      serializationObject.localMatrix = this.getPivotMatrix().asArray();
    }
    serializationObject.isEnabled = this.isEnabled(false);
    serializationObject.isVisible = this.isVisible;
    serializationObject.infiniteDistance = this.infiniteDistance;
    serializationObject.pickable = this.isPickable;
    serializationObject.receiveShadows = this.receiveShadows;
    serializationObject.billboardMode = this.billboardMode;
    serializationObject.visibility = this.visibility;
    serializationObject.checkCollisions = this.checkCollisions;
    serializationObject.isBlocker = this.isBlocker;
    serializationObject.overrideMaterialSideOrientation = this.overrideMaterialSideOrientation;
    if (this.parent) {
      this.parent._serializeAsParent(serializationObject);
    }
    serializationObject.isUnIndexed = this.isUnIndexed;
    const geometry = this._geometry;
    if (geometry && this.subMeshes) {
      serializationObject.geometryUniqueId = geometry.uniqueId;
      serializationObject.geometryId = geometry.id;
      serializationObject.subMeshes = [];
      for (let subIndex = 0; subIndex < this.subMeshes.length; subIndex++) {
        const subMesh = this.subMeshes[subIndex];
        serializationObject.subMeshes.push({
          materialIndex: subMesh.materialIndex,
          verticesStart: subMesh.verticesStart,
          verticesCount: subMesh.verticesCount,
          indexStart: subMesh.indexStart,
          indexCount: subMesh.indexCount
        });
      }
    }
    if (this.material) {
      if (!this.material.doNotSerialize) {
        serializationObject.materialUniqueId = this.material.uniqueId;
        serializationObject.materialId = this.material.id;
      }
    } else {
      this.material = null;
      serializationObject.materialUniqueId = this._scene.defaultMaterial.uniqueId;
      serializationObject.materialId = this._scene.defaultMaterial.id;
    }
    if (this.morphTargetManager) {
      serializationObject.morphTargetManagerId = this.morphTargetManager.uniqueId;
    }
    if (this.skeleton) {
      serializationObject.skeletonId = this.skeleton.id;
      serializationObject.numBoneInfluencers = this.numBoneInfluencers;
    }
    if (this.getScene()._getComponent(SceneComponentConstants.NAME_PHYSICSENGINE)) {
      const impostor = this.getPhysicsImpostor();
      if (impostor) {
        serializationObject.physicsMass = impostor.getParam("mass");
        serializationObject.physicsFriction = impostor.getParam("friction");
        serializationObject.physicsRestitution = impostor.getParam("mass");
        serializationObject.physicsImpostor = impostor.type;
      }
    }
    if (this.metadata) {
      serializationObject.metadata = this.metadata;
    }
    serializationObject.instances = [];
    for (let index = 0; index < this.instances.length; index++) {
      const instance = this.instances[index];
      if (instance.doNotSerialize) {
        continue;
      }
      const serializationInstance = {
        name: instance.name,
        id: instance.id,
        isEnabled: instance.isEnabled(false),
        isVisible: instance.isVisible,
        isPickable: instance.isPickable,
        checkCollisions: instance.checkCollisions,
        position: instance.position.asArray(),
        scaling: instance.scaling.asArray()
      };
      if (instance.parent) {
        instance.parent._serializeAsParent(serializationInstance);
      }
      if (instance.rotationQuaternion) {
        serializationInstance.rotationQuaternion = instance.rotationQuaternion.asArray();
      } else if (instance.rotation) {
        serializationInstance.rotation = instance.rotation.asArray();
      }
      if (this.getScene()._getComponent(SceneComponentConstants.NAME_PHYSICSENGINE)) {
        const impostor = instance.getPhysicsImpostor();
        if (impostor) {
          serializationInstance.physicsMass = impostor.getParam("mass");
          serializationInstance.physicsFriction = impostor.getParam("friction");
          serializationInstance.physicsRestitution = impostor.getParam("mass");
          serializationInstance.physicsImpostor = impostor.type;
        }
      }
      if (instance.metadata) {
        serializationInstance.metadata = instance.metadata;
      }
      if (instance.actionManager) {
        serializationInstance.actions = instance.actionManager.serialize(instance.name);
      }
      serializationObject.instances.push(serializationInstance);
      SerializationHelper.AppendSerializedAnimations(instance, serializationInstance);
      serializationInstance.ranges = instance.serializeAnimationRanges();
    }
    if (this._thinInstanceDataStorage.instancesCount && this._thinInstanceDataStorage.matrixData) {
      serializationObject.thinInstances = {
        instancesCount: this._thinInstanceDataStorage.instancesCount,
        matrixData: Array.from(this._thinInstanceDataStorage.matrixData),
        matrixBufferSize: this._thinInstanceDataStorage.matrixBufferSize,
        enablePicking: this.thinInstanceEnablePicking
      };
      if (this._userThinInstanceBuffersStorage) {
        const userThinInstance = {
          data: {},
          sizes: {},
          strides: {}
        };
        for (const kind in this._userThinInstanceBuffersStorage.data) {
          userThinInstance.data[kind] = Array.from(this._userThinInstanceBuffersStorage.data[kind]);
          userThinInstance.sizes[kind] = this._userThinInstanceBuffersStorage.sizes[kind];
          userThinInstance.strides[kind] = this._userThinInstanceBuffersStorage.strides[kind];
        }
        serializationObject.thinInstances.userThinInstance = userThinInstance;
      }
    }
    SerializationHelper.AppendSerializedAnimations(this, serializationObject);
    serializationObject.ranges = this.serializeAnimationRanges();
    serializationObject.layerMask = this.layerMask;
    serializationObject.alphaIndex = this.alphaIndex;
    serializationObject.hasVertexAlpha = this.hasVertexAlpha;
    serializationObject.overlayAlpha = this.overlayAlpha;
    serializationObject.overlayColor = this.overlayColor.asArray();
    serializationObject.renderOverlay = this.renderOverlay;
    serializationObject.applyFog = this.applyFog;
    if (this.actionManager) {
      serializationObject.actions = this.actionManager.serialize(this.name);
    }
    return serializationObject;
  }
  /** @internal */
  _syncGeometryWithMorphTargetManager() {
    if (!this.geometry) {
      return;
    }
    this._markSubMeshesAsAttributesDirty();
    const morphTargetManager = this._internalAbstractMeshDataInfo._morphTargetManager;
    if (morphTargetManager && morphTargetManager.vertexCount) {
      if (morphTargetManager.vertexCount !== this.getTotalVertices()) {
        Logger.Error("Mesh is incompatible with morph targets. Targets and mesh must all have the same vertices count.");
        this.morphTargetManager = null;
        return;
      }
      if (morphTargetManager.isUsingTextureForTargets) {
        return;
      }
      for (let index = 0; index < morphTargetManager.numInfluencers; index++) {
        const morphTarget = morphTargetManager.getActiveTarget(index);
        const positions = morphTarget.getPositions();
        if (!positions) {
          Logger.Error("Invalid morph target. Target must have positions.");
          return;
        }
        this.geometry.setVerticesData(VertexBuffer.PositionKind + index, positions, false, 3);
        const normals = morphTarget.getNormals();
        if (normals) {
          this.geometry.setVerticesData(VertexBuffer.NormalKind + index, normals, false, 3);
        }
        const tangents = morphTarget.getTangents();
        if (tangents) {
          this.geometry.setVerticesData(VertexBuffer.TangentKind + index, tangents, false, 3);
        }
        const uvs = morphTarget.getUVs();
        if (uvs) {
          this.geometry.setVerticesData(VertexBuffer.UVKind + "_" + index, uvs, false, 2);
        }
      }
    } else {
      let index = 0;
      while (this.geometry.isVerticesDataPresent(VertexBuffer.PositionKind + index)) {
        this.geometry.removeVerticesData(VertexBuffer.PositionKind + index);
        if (this.geometry.isVerticesDataPresent(VertexBuffer.NormalKind + index)) {
          this.geometry.removeVerticesData(VertexBuffer.NormalKind + index);
        }
        if (this.geometry.isVerticesDataPresent(VertexBuffer.TangentKind + index)) {
          this.geometry.removeVerticesData(VertexBuffer.TangentKind + index);
        }
        if (this.geometry.isVerticesDataPresent(VertexBuffer.UVKind + index)) {
          this.geometry.removeVerticesData(VertexBuffer.UVKind + "_" + index);
        }
        index++;
      }
    }
  }
  /**
   * Returns a new Mesh object parsed from the source provided.
   * @param parsedMesh is the source
   * @param scene defines the hosting scene
   * @param rootUrl is the root URL to prefix the `delayLoadingFile` property with
   * @returns a new Mesh
   */
  static Parse(parsedMesh, scene, rootUrl) {
    let mesh;
    if (parsedMesh.type && parsedMesh.type === "LinesMesh") {
      mesh = _Mesh._LinesMeshParser(parsedMesh, scene);
    } else if (parsedMesh.type && parsedMesh.type === "GroundMesh") {
      mesh = _Mesh._GroundMeshParser(parsedMesh, scene);
    } else if (parsedMesh.type && parsedMesh.type === "GoldbergMesh") {
      mesh = _Mesh._GoldbergMeshParser(parsedMesh, scene);
    } else if (parsedMesh.type && parsedMesh.type === "GreasedLineMesh") {
      mesh = _Mesh._GreasedLineMeshParser(parsedMesh, scene);
    } else if (parsedMesh.type && parsedMesh.type === "TrailMesh") {
      mesh = _Mesh._TrailMeshParser(parsedMesh, scene);
    } else {
      mesh = new _Mesh(parsedMesh.name, scene);
    }
    mesh.id = parsedMesh.id;
    mesh._waitingParsedUniqueId = parsedMesh.uniqueId;
    if (Tags) {
      Tags.AddTagsTo(mesh, parsedMesh.tags);
    }
    mesh.position = Vector3.FromArray(parsedMesh.position);
    if (parsedMesh.metadata !== void 0) {
      mesh.metadata = parsedMesh.metadata;
    }
    if (parsedMesh.rotationQuaternion) {
      mesh.rotationQuaternion = Quaternion.FromArray(parsedMesh.rotationQuaternion);
    } else if (parsedMesh.rotation) {
      mesh.rotation = Vector3.FromArray(parsedMesh.rotation);
    }
    mesh.scaling = Vector3.FromArray(parsedMesh.scaling);
    if (parsedMesh.localMatrix) {
      mesh.setPreTransformMatrix(Matrix.FromArray(parsedMesh.localMatrix));
    } else if (parsedMesh.pivotMatrix) {
      mesh.setPivotMatrix(Matrix.FromArray(parsedMesh.pivotMatrix));
    }
    mesh.setEnabled(parsedMesh.isEnabled);
    mesh.isVisible = parsedMesh.isVisible;
    mesh.infiniteDistance = parsedMesh.infiniteDistance;
    mesh.showBoundingBox = parsedMesh.showBoundingBox;
    mesh.showSubMeshesBoundingBox = parsedMesh.showSubMeshesBoundingBox;
    if (parsedMesh.applyFog !== void 0) {
      mesh.applyFog = parsedMesh.applyFog;
    }
    if (parsedMesh.pickable !== void 0) {
      mesh.isPickable = parsedMesh.pickable;
    }
    if (parsedMesh.alphaIndex !== void 0) {
      mesh.alphaIndex = parsedMesh.alphaIndex;
    }
    mesh.receiveShadows = parsedMesh.receiveShadows;
    if (parsedMesh.billboardMode !== void 0) {
      mesh.billboardMode = parsedMesh.billboardMode;
    }
    if (parsedMesh.visibility !== void 0) {
      mesh.visibility = parsedMesh.visibility;
    }
    mesh.checkCollisions = parsedMesh.checkCollisions;
    if (parsedMesh.overrideMaterialSideOrientation !== void 0) {
      mesh.overrideMaterialSideOrientation = parsedMesh.overrideMaterialSideOrientation;
    }
    if (parsedMesh.isBlocker !== void 0) {
      mesh.isBlocker = parsedMesh.isBlocker;
    }
    mesh._shouldGenerateFlatShading = parsedMesh.useFlatShading;
    if (parsedMesh.freezeWorldMatrix) {
      mesh._waitingData.freezeWorldMatrix = parsedMesh.freezeWorldMatrix;
    }
    if (parsedMesh.parentId !== void 0) {
      mesh._waitingParentId = parsedMesh.parentId;
    }
    if (parsedMesh.parentInstanceIndex !== void 0) {
      mesh._waitingParentInstanceIndex = parsedMesh.parentInstanceIndex;
    }
    if (parsedMesh.actions !== void 0) {
      mesh._waitingData.actions = parsedMesh.actions;
    }
    if (parsedMesh.overlayAlpha !== void 0) {
      mesh.overlayAlpha = parsedMesh.overlayAlpha;
    }
    if (parsedMesh.overlayColor !== void 0) {
      mesh.overlayColor = Color3.FromArray(parsedMesh.overlayColor);
    }
    if (parsedMesh.renderOverlay !== void 0) {
      mesh.renderOverlay = parsedMesh.renderOverlay;
    }
    mesh.isUnIndexed = !!parsedMesh.isUnIndexed;
    mesh.hasVertexAlpha = parsedMesh.hasVertexAlpha;
    if (parsedMesh.delayLoadingFile) {
      mesh.delayLoadState = 4;
      mesh.delayLoadingFile = rootUrl + parsedMesh.delayLoadingFile;
      mesh.buildBoundingInfo(Vector3.FromArray(parsedMesh.boundingBoxMinimum), Vector3.FromArray(parsedMesh.boundingBoxMaximum));
      if (parsedMesh._binaryInfo) {
        mesh._binaryInfo = parsedMesh._binaryInfo;
      }
      mesh._delayInfo = [];
      if (parsedMesh.hasUVs) {
        mesh._delayInfo.push(VertexBuffer.UVKind);
      }
      if (parsedMesh.hasUVs2) {
        mesh._delayInfo.push(VertexBuffer.UV2Kind);
      }
      if (parsedMesh.hasUVs3) {
        mesh._delayInfo.push(VertexBuffer.UV3Kind);
      }
      if (parsedMesh.hasUVs4) {
        mesh._delayInfo.push(VertexBuffer.UV4Kind);
      }
      if (parsedMesh.hasUVs5) {
        mesh._delayInfo.push(VertexBuffer.UV5Kind);
      }
      if (parsedMesh.hasUVs6) {
        mesh._delayInfo.push(VertexBuffer.UV6Kind);
      }
      if (parsedMesh.hasColors) {
        mesh._delayInfo.push(VertexBuffer.ColorKind);
      }
      if (parsedMesh.hasMatricesIndices) {
        mesh._delayInfo.push(VertexBuffer.MatricesIndicesKind);
      }
      if (parsedMesh.hasMatricesWeights) {
        mesh._delayInfo.push(VertexBuffer.MatricesWeightsKind);
      }
      mesh._delayLoadingFunction = Geometry._ImportGeometry;
      if (SceneLoaderFlags.ForceFullSceneLoadingForIncremental) {
        mesh._checkDelayState();
      }
    } else {
      Geometry._ImportGeometry(parsedMesh, mesh);
    }
    if (parsedMesh.materialUniqueId) {
      mesh._waitingMaterialId = parsedMesh.materialUniqueId;
    } else if (parsedMesh.materialId) {
      mesh._waitingMaterialId = parsedMesh.materialId;
    }
    if (parsedMesh.morphTargetManagerId > -1) {
      mesh.morphTargetManager = scene.getMorphTargetManagerById(parsedMesh.morphTargetManagerId);
    }
    if (parsedMesh.skeletonId !== void 0 && parsedMesh.skeletonId !== null) {
      mesh.skeleton = scene.getLastSkeletonById(parsedMesh.skeletonId);
      if (parsedMesh.numBoneInfluencers) {
        mesh.numBoneInfluencers = parsedMesh.numBoneInfluencers;
      }
    }
    if (parsedMesh.animations) {
      for (let animationIndex = 0; animationIndex < parsedMesh.animations.length; animationIndex++) {
        const parsedAnimation = parsedMesh.animations[animationIndex];
        const internalClass = GetClass("BABYLON.Animation");
        if (internalClass) {
          mesh.animations.push(internalClass.Parse(parsedAnimation));
        }
      }
      Node.ParseAnimationRanges(mesh, parsedMesh, scene);
    }
    if (parsedMesh.autoAnimate) {
      scene.beginAnimation(mesh, parsedMesh.autoAnimateFrom, parsedMesh.autoAnimateTo, parsedMesh.autoAnimateLoop, parsedMesh.autoAnimateSpeed || 1);
    }
    if (parsedMesh.layerMask && !isNaN(parsedMesh.layerMask)) {
      mesh.layerMask = Math.abs(parseInt(parsedMesh.layerMask));
    } else {
      mesh.layerMask = 268435455;
    }
    if (parsedMesh.physicsImpostor) {
      _Mesh._PhysicsImpostorParser(scene, mesh, parsedMesh);
    }
    if (parsedMesh.lodMeshIds) {
      mesh._waitingData.lods = {
        ids: parsedMesh.lodMeshIds,
        distances: parsedMesh.lodDistances ? parsedMesh.lodDistances : null,
        coverages: parsedMesh.lodCoverages ? parsedMesh.lodCoverages : null
      };
    }
    if (parsedMesh.instances) {
      for (let index = 0; index < parsedMesh.instances.length; index++) {
        const parsedInstance = parsedMesh.instances[index];
        const instance = mesh.createInstance(parsedInstance.name);
        if (parsedInstance.id) {
          instance.id = parsedInstance.id;
        }
        if (Tags) {
          if (parsedInstance.tags) {
            Tags.AddTagsTo(instance, parsedInstance.tags);
          } else {
            Tags.AddTagsTo(instance, parsedMesh.tags);
          }
        }
        instance.position = Vector3.FromArray(parsedInstance.position);
        if (parsedInstance.metadata !== void 0) {
          instance.metadata = parsedInstance.metadata;
        }
        if (parsedInstance.parentId !== void 0) {
          instance._waitingParentId = parsedInstance.parentId;
        }
        if (parsedInstance.parentInstanceIndex !== void 0) {
          instance._waitingParentInstanceIndex = parsedInstance.parentInstanceIndex;
        }
        if (parsedInstance.isEnabled !== void 0 && parsedInstance.isEnabled !== null) {
          instance.setEnabled(parsedInstance.isEnabled);
        }
        if (parsedInstance.isVisible !== void 0 && parsedInstance.isVisible !== null) {
          instance.isVisible = parsedInstance.isVisible;
        }
        if (parsedInstance.isPickable !== void 0 && parsedInstance.isPickable !== null) {
          instance.isPickable = parsedInstance.isPickable;
        }
        if (parsedInstance.rotationQuaternion) {
          instance.rotationQuaternion = Quaternion.FromArray(parsedInstance.rotationQuaternion);
        } else if (parsedInstance.rotation) {
          instance.rotation = Vector3.FromArray(parsedInstance.rotation);
        }
        instance.scaling = Vector3.FromArray(parsedInstance.scaling);
        if (parsedInstance.checkCollisions != void 0 && parsedInstance.checkCollisions != null) {
          instance.checkCollisions = parsedInstance.checkCollisions;
        }
        if (parsedInstance.pickable != void 0 && parsedInstance.pickable != null) {
          instance.isPickable = parsedInstance.pickable;
        }
        if (parsedInstance.showBoundingBox != void 0 && parsedInstance.showBoundingBox != null) {
          instance.showBoundingBox = parsedInstance.showBoundingBox;
        }
        if (parsedInstance.showSubMeshesBoundingBox != void 0 && parsedInstance.showSubMeshesBoundingBox != null) {
          instance.showSubMeshesBoundingBox = parsedInstance.showSubMeshesBoundingBox;
        }
        if (parsedInstance.alphaIndex != void 0 && parsedInstance.showSubMeshesBoundingBox != null) {
          instance.alphaIndex = parsedInstance.alphaIndex;
        }
        if (parsedInstance.physicsImpostor) {
          _Mesh._PhysicsImpostorParser(scene, instance, parsedInstance);
        }
        if (parsedInstance.actions !== void 0) {
          instance._waitingData.actions = parsedInstance.actions;
        }
        if (parsedInstance.animations) {
          for (let animationIndex = 0; animationIndex < parsedInstance.animations.length; animationIndex++) {
            const parsedAnimation = parsedInstance.animations[animationIndex];
            const internalClass = GetClass("BABYLON.Animation");
            if (internalClass) {
              instance.animations.push(internalClass.Parse(parsedAnimation));
            }
          }
          Node.ParseAnimationRanges(instance, parsedInstance, scene);
          if (parsedInstance.autoAnimate) {
            scene.beginAnimation(instance, parsedInstance.autoAnimateFrom, parsedInstance.autoAnimateTo, parsedInstance.autoAnimateLoop, parsedInstance.autoAnimateSpeed || 1);
          }
        }
      }
    }
    if (parsedMesh.thinInstances) {
      const thinInstances = parsedMesh.thinInstances;
      mesh.thinInstanceEnablePicking = !!thinInstances.enablePicking;
      if (thinInstances.matrixData) {
        mesh.thinInstanceSetBuffer("matrix", new Float32Array(thinInstances.matrixData), 16, false);
        mesh._thinInstanceDataStorage.matrixBufferSize = thinInstances.matrixBufferSize;
        mesh._thinInstanceDataStorage.instancesCount = thinInstances.instancesCount;
      } else {
        mesh._thinInstanceDataStorage.matrixBufferSize = thinInstances.matrixBufferSize;
      }
      if (parsedMesh.thinInstances.userThinInstance) {
        const userThinInstance = parsedMesh.thinInstances.userThinInstance;
        for (const kind in userThinInstance.data) {
          mesh.thinInstanceSetBuffer(kind, new Float32Array(userThinInstance.data[kind]), userThinInstance.strides[kind], false);
          mesh._userThinInstanceBuffersStorage.sizes[kind] = userThinInstance.sizes[kind];
        }
      }
    }
    return mesh;
  }
  // Skeletons
  /**
   * Prepare internal position array for software CPU skinning
   * @returns original positions used for CPU skinning. Useful for integrating Morphing with skeletons in same mesh
   */
  setPositionsForCPUSkinning() {
    const internalDataInfo = this._internalMeshDataInfo;
    if (!internalDataInfo._sourcePositions) {
      const source = this.getVerticesData(VertexBuffer.PositionKind);
      if (!source) {
        return internalDataInfo._sourcePositions;
      }
      internalDataInfo._sourcePositions = new Float32Array(source);
      if (!this.isVertexBufferUpdatable(VertexBuffer.PositionKind)) {
        this.setVerticesData(VertexBuffer.PositionKind, source, true);
      }
    }
    return internalDataInfo._sourcePositions;
  }
  /**
   * Prepare internal normal array for software CPU skinning
   * @returns original normals used for CPU skinning. Useful for integrating Morphing with skeletons in same mesh.
   */
  setNormalsForCPUSkinning() {
    const internalDataInfo = this._internalMeshDataInfo;
    if (!internalDataInfo._sourceNormals) {
      const source = this.getVerticesData(VertexBuffer.NormalKind);
      if (!source) {
        return internalDataInfo._sourceNormals;
      }
      internalDataInfo._sourceNormals = new Float32Array(source);
      if (!this.isVertexBufferUpdatable(VertexBuffer.NormalKind)) {
        this.setVerticesData(VertexBuffer.NormalKind, source, true);
      }
    }
    return internalDataInfo._sourceNormals;
  }
  /**
   * Updates the vertex buffer by applying transformation from the bones
   * @param skeleton defines the skeleton to apply to current mesh
   * @returns the current mesh
   */
  applySkeleton(skeleton) {
    if (!this.geometry) {
      return this;
    }
    if (this.geometry._softwareSkinningFrameId == this.getScene().getFrameId()) {
      return this;
    }
    this.geometry._softwareSkinningFrameId = this.getScene().getFrameId();
    if (!this.isVerticesDataPresent(VertexBuffer.PositionKind)) {
      return this;
    }
    if (!this.isVerticesDataPresent(VertexBuffer.MatricesIndicesKind)) {
      return this;
    }
    if (!this.isVerticesDataPresent(VertexBuffer.MatricesWeightsKind)) {
      return this;
    }
    const hasNormals = this.isVerticesDataPresent(VertexBuffer.NormalKind);
    const internalDataInfo = this._internalMeshDataInfo;
    if (!internalDataInfo._sourcePositions) {
      const submeshes = this.subMeshes.slice();
      this.setPositionsForCPUSkinning();
      this.subMeshes = submeshes;
    }
    if (hasNormals && !internalDataInfo._sourceNormals) {
      this.setNormalsForCPUSkinning();
    }
    let positionsData = this.getVerticesData(VertexBuffer.PositionKind);
    if (!positionsData) {
      return this;
    }
    if (!(positionsData instanceof Float32Array)) {
      positionsData = new Float32Array(positionsData);
    }
    let normalsData = this.getVerticesData(VertexBuffer.NormalKind);
    if (hasNormals) {
      if (!normalsData) {
        return this;
      }
      if (!(normalsData instanceof Float32Array)) {
        normalsData = new Float32Array(normalsData);
      }
    }
    const matricesIndicesData = this.getVerticesData(VertexBuffer.MatricesIndicesKind);
    const matricesWeightsData = this.getVerticesData(VertexBuffer.MatricesWeightsKind);
    if (!matricesWeightsData || !matricesIndicesData) {
      return this;
    }
    const needExtras = this.numBoneInfluencers > 4;
    const matricesIndicesExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesIndicesExtraKind) : null;
    const matricesWeightsExtraData = needExtras ? this.getVerticesData(VertexBuffer.MatricesWeightsExtraKind) : null;
    const skeletonMatrices = skeleton.getTransformMatrices(this);
    const tempVector3 = Vector3.Zero();
    const finalMatrix = new Matrix();
    const tempMatrix = new Matrix();
    let matWeightIdx = 0;
    let inf;
    for (let index = 0; index < positionsData.length; index += 3, matWeightIdx += 4) {
      let weight;
      for (inf = 0; inf < 4; inf++) {
        weight = matricesWeightsData[matWeightIdx + inf];
        if (weight > 0) {
          Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesData[matWeightIdx + inf] * 16), weight, tempMatrix);
          finalMatrix.addToSelf(tempMatrix);
        }
      }
      if (needExtras) {
        for (inf = 0; inf < 4; inf++) {
          weight = matricesWeightsExtraData[matWeightIdx + inf];
          if (weight > 0) {
            Matrix.FromFloat32ArrayToRefScaled(skeletonMatrices, Math.floor(matricesIndicesExtraData[matWeightIdx + inf] * 16), weight, tempMatrix);
            finalMatrix.addToSelf(tempMatrix);
          }
        }
      }
      Vector3.TransformCoordinatesFromFloatsToRef(internalDataInfo._sourcePositions[index], internalDataInfo._sourcePositions[index + 1], internalDataInfo._sourcePositions[index + 2], finalMatrix, tempVector3);
      tempVector3.toArray(positionsData, index);
      if (hasNormals) {
        Vector3.TransformNormalFromFloatsToRef(internalDataInfo._sourceNormals[index], internalDataInfo._sourceNormals[index + 1], internalDataInfo._sourceNormals[index + 2], finalMatrix, tempVector3);
        tempVector3.toArray(normalsData, index);
      }
      finalMatrix.reset();
    }
    this.updateVerticesData(VertexBuffer.PositionKind, positionsData);
    if (hasNormals) {
      this.updateVerticesData(VertexBuffer.NormalKind, normalsData);
    }
    return this;
  }
  // Tools
  /**
   * Returns an object containing a min and max Vector3 which are the minimum and maximum vectors of each mesh bounding box from the passed array, in the world coordinates
   * @param meshes defines the list of meshes to scan
   * @returns an object `{min:` Vector3`, max:` Vector3`}`
   */
  static MinMax(meshes) {
    let minVector = null;
    let maxVector = null;
    meshes.forEach(function(mesh) {
      const boundingInfo = mesh.getBoundingInfo();
      const boundingBox = boundingInfo.boundingBox;
      if (!minVector || !maxVector) {
        minVector = boundingBox.minimumWorld;
        maxVector = boundingBox.maximumWorld;
      } else {
        minVector.minimizeInPlace(boundingBox.minimumWorld);
        maxVector.maximizeInPlace(boundingBox.maximumWorld);
      }
    });
    if (!minVector || !maxVector) {
      return {
        min: Vector3.Zero(),
        max: Vector3.Zero()
      };
    }
    return {
      min: minVector,
      max: maxVector
    };
  }
  /**
   * Returns the center of the `{min:` Vector3`, max:` Vector3`}` or the center of MinMax vector3 computed from a mesh array
   * @param meshesOrMinMaxVector could be an array of meshes or a `{min:` Vector3`, max:` Vector3`}` object
   * @returns a vector3
   */
  static Center(meshesOrMinMaxVector) {
    const minMaxVector = meshesOrMinMaxVector instanceof Array ? _Mesh.MinMax(meshesOrMinMaxVector) : meshesOrMinMaxVector;
    return Vector3.Center(minMaxVector.min, minMaxVector.max);
  }
  /**
   * Merge the array of meshes into a single mesh for performance reasons.
   * @param meshes array of meshes with the vertices to merge. Entries cannot be empty meshes.
   * @param disposeSource when true (default), dispose of the vertices from the source meshes.
   * @param allow32BitsIndices when the sum of the vertices > 64k, this must be set to true.
   * @param meshSubclass (optional) can be set to a Mesh where the merged vertices will be inserted.
   * @param subdivideWithSubMeshes when true (false default), subdivide mesh into subMeshes.
   * @param multiMultiMaterials when true (false default), subdivide mesh into subMeshes with multiple materials, ignores subdivideWithSubMeshes.
   * @returns a new mesh
   */
  static MergeMeshes(meshes, disposeSource = true, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials) {
    return runCoroutineSync(_Mesh._MergeMeshesCoroutine(meshes, disposeSource, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials, false));
  }
  /**
   * Merge the array of meshes into a single mesh for performance reasons.
   * @param meshes array of meshes with the vertices to merge. Entries cannot be empty meshes.
   * @param disposeSource when true (default), dispose of the vertices from the source meshes.
   * @param allow32BitsIndices when the sum of the vertices > 64k, this must be set to true.
   * @param meshSubclass (optional) can be set to a Mesh where the merged vertices will be inserted.
   * @param subdivideWithSubMeshes when true (false default), subdivide mesh into subMeshes.
   * @param multiMultiMaterials when true (false default), subdivide mesh into subMeshes with multiple materials, ignores subdivideWithSubMeshes.
   * @returns a new mesh
   */
  static MergeMeshesAsync(meshes, disposeSource = true, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials) {
    return runCoroutineAsync(_Mesh._MergeMeshesCoroutine(meshes, disposeSource, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials, true), createYieldingScheduler());
  }
  static *_MergeMeshesCoroutine(meshes, disposeSource = true, allow32BitsIndices, meshSubclass, subdivideWithSubMeshes, multiMultiMaterials, isAsync) {
    meshes = meshes.filter(Boolean);
    if (meshes.length === 0) {
      return null;
    }
    let index;
    if (!allow32BitsIndices) {
      let totalVertices = 0;
      for (index = 0; index < meshes.length; index++) {
        totalVertices += meshes[index].getTotalVertices();
        if (totalVertices >= 65536) {
          Logger.Warn("Cannot merge meshes because resulting mesh will have more than 65536 vertices. Please use allow32BitsIndices = true to use 32 bits indices");
          return null;
        }
      }
    }
    if (multiMultiMaterials) {
      subdivideWithSubMeshes = false;
    }
    const materialArray = new Array();
    const materialIndexArray = new Array();
    const indiceArray = new Array();
    const currentOverrideMaterialSideOrientation = meshes[0].overrideMaterialSideOrientation;
    for (index = 0; index < meshes.length; index++) {
      const mesh = meshes[index];
      if (mesh.isAnInstance) {
        Logger.Warn("Cannot merge instance meshes.");
        return null;
      }
      if (currentOverrideMaterialSideOrientation !== mesh.overrideMaterialSideOrientation) {
        Logger.Warn("Cannot merge meshes with different overrideMaterialSideOrientation values.");
        return null;
      }
      if (subdivideWithSubMeshes) {
        indiceArray.push(mesh.getTotalIndices());
      }
      if (multiMultiMaterials) {
        if (mesh.material) {
          const material = mesh.material;
          if (material instanceof MultiMaterial) {
            for (let matIndex = 0; matIndex < material.subMaterials.length; matIndex++) {
              if (materialArray.indexOf(material.subMaterials[matIndex]) < 0) {
                materialArray.push(material.subMaterials[matIndex]);
              }
            }
            for (let subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
              materialIndexArray.push(materialArray.indexOf(material.subMaterials[mesh.subMeshes[subIndex].materialIndex]));
              indiceArray.push(mesh.subMeshes[subIndex].indexCount);
            }
          } else {
            if (materialArray.indexOf(material) < 0) {
              materialArray.push(material);
            }
            for (let subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
              materialIndexArray.push(materialArray.indexOf(material));
              indiceArray.push(mesh.subMeshes[subIndex].indexCount);
            }
          }
        } else {
          for (let subIndex = 0; subIndex < mesh.subMeshes.length; subIndex++) {
            materialIndexArray.push(0);
            indiceArray.push(mesh.subMeshes[subIndex].indexCount);
          }
        }
      }
    }
    const source = meshes[0];
    const getVertexDataFromMesh = (mesh) => {
      const wm = mesh.computeWorldMatrix(true);
      const vertexData2 = VertexData.ExtractFromMesh(mesh, false, false);
      return { vertexData: vertexData2, transform: wm };
    };
    const { vertexData: sourceVertexData, transform: sourceTransform } = getVertexDataFromMesh(source);
    if (isAsync) {
      yield;
    }
    const meshVertexDatas = new Array(meshes.length - 1);
    for (let i = 1; i < meshes.length; i++) {
      meshVertexDatas[i - 1] = getVertexDataFromMesh(meshes[i]);
      if (isAsync) {
        yield;
      }
    }
    const mergeCoroutine = sourceVertexData._mergeCoroutine(sourceTransform, meshVertexDatas, allow32BitsIndices, isAsync, !disposeSource);
    let mergeCoroutineStep = mergeCoroutine.next();
    while (!mergeCoroutineStep.done) {
      if (isAsync) {
        yield;
      }
      mergeCoroutineStep = mergeCoroutine.next();
    }
    const vertexData = mergeCoroutineStep.value;
    if (!meshSubclass) {
      meshSubclass = new _Mesh(source.name + "_merged", source.getScene());
    }
    const applyToCoroutine = vertexData._applyToCoroutine(meshSubclass, void 0, isAsync);
    let applyToCoroutineStep = applyToCoroutine.next();
    while (!applyToCoroutineStep.done) {
      if (isAsync) {
        yield;
      }
      applyToCoroutineStep = applyToCoroutine.next();
    }
    meshSubclass.checkCollisions = source.checkCollisions;
    meshSubclass.overrideMaterialSideOrientation = source.overrideMaterialSideOrientation;
    if (disposeSource) {
      for (index = 0; index < meshes.length; index++) {
        meshes[index].dispose();
      }
    }
    if (subdivideWithSubMeshes || multiMultiMaterials) {
      meshSubclass.releaseSubMeshes();
      index = 0;
      let offset = 0;
      while (index < indiceArray.length) {
        SubMesh.CreateFromIndices(0, offset, indiceArray[index], meshSubclass, void 0, false);
        offset += indiceArray[index];
        index++;
      }
      for (const subMesh of meshSubclass.subMeshes) {
        subMesh.refreshBoundingInfo();
      }
      meshSubclass.computeWorldMatrix(true);
    }
    if (multiMultiMaterials) {
      const newMultiMaterial = new MultiMaterial(source.name + "_merged", source.getScene());
      newMultiMaterial.subMaterials = materialArray;
      for (let subIndex = 0; subIndex < meshSubclass.subMeshes.length; subIndex++) {
        meshSubclass.subMeshes[subIndex].materialIndex = materialIndexArray[subIndex];
      }
      meshSubclass.material = newMultiMaterial;
    } else {
      meshSubclass.material = source.material;
    }
    return meshSubclass;
  }
  /**
   * @internal
   */
  addInstance(instance) {
    instance._indexInSourceMeshInstanceArray = this.instances.length;
    this.instances.push(instance);
  }
  /**
   * @internal
   */
  removeInstance(instance) {
    const index = instance._indexInSourceMeshInstanceArray;
    if (index != -1) {
      if (index !== this.instances.length - 1) {
        const last = this.instances[this.instances.length - 1];
        this.instances[index] = last;
        last._indexInSourceMeshInstanceArray = index;
      }
      instance._indexInSourceMeshInstanceArray = -1;
      this.instances.pop();
    }
  }
  /** @internal */
  _shouldConvertRHS() {
    return this.overrideMaterialSideOrientation === Material.CounterClockWiseSideOrientation;
  }
  /** @internal */
  _getRenderingFillMode(fillMode) {
    var _a;
    const scene = this.getScene();
    if (scene.forcePointsCloud)
      return Material.PointFillMode;
    if (scene.forceWireframe)
      return Material.WireFrameFillMode;
    return (_a = this.overrideRenderingFillMode) !== null && _a !== void 0 ? _a : fillMode;
  }
  // deprecated methods
  /**
   * Sets the mesh material by the material or multiMaterial `id` property
   * @param id is a string identifying the material or the multiMaterial
   * @returns the current mesh
   * @deprecated Please use MeshBuilder instead Please use setMaterialById instead
   */
  setMaterialByID(id) {
    return this.setMaterialById(id);
  }
  /**
   * Creates a ribbon mesh.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param
   * @param name defines the name of the mesh to create
   * @param pathArray is a required array of paths, what are each an array of successive Vector3. The pathArray parameter depicts the ribbon geometry.
   * @param closeArray creates a seam between the first and the last paths of the path array (default is false)
   * @param closePath creates a seam between the first and the last points of each path of the path array
   * @param offset is taken in account only if the `pathArray` is containing a single path
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @param instance defines an instance of an existing Ribbon object to be updated with the passed `pathArray` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#ribbon)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateRibbon(name47, pathArray, closeArray, closePath, offset, scene, updatable, sideOrientation, instance) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a plane polygonal mesh.  By default, this is a disc.
   * @param name defines the name of the mesh to create
   * @param radius sets the radius size (float) of the polygon (default 0.5)
   * @param tessellation sets the number of polygon sides (positive integer, default 64). So a tessellation valued to 3 will build a triangle, to 4 a square, etc
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateDisc(name47, radius, tessellation, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a box mesh.
   * @param name defines the name of the mesh to create
   * @param size sets the size (float) of each box side (default 1)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateBox(name47, size, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a sphere mesh.
   * @param name defines the name of the mesh to create
   * @param segments sets the sphere number of horizontal stripes (positive integer, default 32)
   * @param diameter sets the diameter size (float) of the sphere (default 1)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateSphere(name47, segments, diameter, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a hemisphere mesh.
   * @param name defines the name of the mesh to create
   * @param segments sets the sphere number of horizontal stripes (positive integer, default 32)
   * @param diameter sets the diameter size (float) of the sphere (default 1)
   * @param scene defines the hosting scene
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateHemisphere(name47, segments, diameter, scene) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a cylinder or a cone mesh.
   * @param name defines the name of the mesh to create
   * @param height sets the height size (float) of the cylinder/cone (float, default 2)
   * @param diameterTop set the top cap diameter (floats, default 1)
   * @param diameterBottom set the bottom cap diameter (floats, default 1). This value can't be zero
   * @param tessellation sets the number of cylinder sides (positive integer, default 24). Set it to 3 to get a prism for instance
   * @param subdivisions sets the number of rings along the cylinder height (positive integer, default 1)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateCylinder(name47, height, diameterTop, diameterBottom, tessellation, subdivisions, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  // Torus  (Code from SharpDX.org)
  /**
   * Creates a torus mesh.
   * @param name defines the name of the mesh to create
   * @param diameter sets the diameter size (float) of the torus (default 1)
   * @param thickness sets the diameter size of the tube of the torus (float, default 0.5)
   * @param tessellation sets the number of torus sides (positive integer, default 16)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateTorus(name47, diameter, thickness, tessellation, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a torus knot mesh.
   * @param name defines the name of the mesh to create
   * @param radius sets the global radius size (float) of the torus knot (default 2)
   * @param tube sets the diameter size of the tube of the torus (float, default 0.5)
   * @param radialSegments sets the number of sides on each tube segments (positive integer, default 32)
   * @param tubularSegments sets the number of tubes to decompose the knot into (positive integer, default 32)
   * @param p the number of windings on X axis (positive integers, default 2)
   * @param q the number of windings on Y axis (positive integers, default 3)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateTorusKnot(name47, radius, tube, radialSegments, tubularSegments, p, q, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a line mesh..
   * @param name defines the name of the mesh to create
   * @param points is an array successive Vector3
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param instance is an instance of an existing LineMesh object to be updated with the passed `points` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#lines-and-dashedlines).
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateLines(name47, points, scene, updatable, instance) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a dashed line mesh.
   * @param name defines the name of the mesh to create
   * @param points is an array successive Vector3
   * @param dashSize is the size of the dashes relatively the dash number (positive float, default 3)
   * @param gapSize is the size of the gap between two successive dashes relatively the dash number (positive float, default 1)
   * @param dashNb is the intended total number of dashes (positive integer, default 200)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param instance is an instance of an existing LineMesh object to be updated with the passed `points` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#lines-and-dashedlines)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateDashedLines(name47, points, dashSize, gapSize, dashNb, scene, updatable, instance) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a polygon mesh.Please consider using the same method from the MeshBuilder class instead
   * The polygon's shape will depend on the input parameters and is constructed parallel to a ground mesh.
   * The parameter `shape` is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors.
   * You can set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created.
   * Remember you can only change the shape positions, not their number when updating a polygon.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param#non-regular-polygon
   * @param name defines the name of the mesh to create
   * @param shape is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors
   * @param scene defines the hosting scene
   * @param holes is a required array of arrays of successive Vector3 used to defines holes in the polygon
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @param earcutInjection can be used to inject your own earcut reference
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreatePolygon(name47, shape, scene, holes, updatable, sideOrientation, earcutInjection) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates an extruded polygon mesh, with depth in the Y direction..
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param#extruded-non-regular-polygon
   * @param name defines the name of the mesh to create
   * @param shape is a required array of successive Vector3 representing the corners of the polygon in th XoZ plane, that is y = 0 for all vectors
   * @param depth defines the height of extrusion
   * @param scene defines the hosting scene
   * @param holes is a required array of arrays of successive Vector3 used to defines holes in the polygon
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @param earcutInjection can be used to inject your own earcut reference
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static ExtrudePolygon(name47, shape, depth, scene, holes, updatable, sideOrientation, earcutInjection) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates an extruded shape mesh.
   * The extrusion is a parametric shape. It has no predefined shape. Its final shape will depend on the input parameters.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param#extruded-shapes
   * @param name defines the name of the mesh to create
   * @param shape is a required array of successive Vector3. This array depicts the shape to be extruded in its local space : the shape must be designed in the xOy plane and will be extruded along the Z axis
   * @param path is a required array of successive Vector3. This is the axis curve the shape is extruded along
   * @param scale is the value to scale the shape
   * @param rotation is the angle value to rotate the shape each step (each path point), from the former step (so rotation added each step) along the curve
   * @param cap sets the way the extruded shape is capped. Possible values : Mesh.NO_CAP (default), Mesh.CAP_START, Mesh.CAP_END, Mesh.CAP_ALL
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @param instance is an instance of an existing ExtrudedShape object to be updated with the passed `shape`, `path`, `scale` or `rotation` parameters (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#extruded-shape)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static ExtrudeShape(name47, shape, path, scale, rotation, cap, scene, updatable, sideOrientation, instance) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates an custom extruded shape mesh.
   * The custom extrusion is a parametric shape.
   * It has no predefined shape. Its final shape will depend on the input parameters.
   *
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param#extruded-shapes
   * @param name defines the name of the mesh to create
   * @param shape is a required array of successive Vector3. This array depicts the shape to be extruded in its local space : the shape must be designed in the xOy plane and will be extruded along the Z axis
   * @param path is a required array of successive Vector3. This is the axis curve the shape is extruded along
   * @param scaleFunction is a custom Javascript function called on each path point
   * @param rotationFunction is a custom Javascript function called on each path point
   * @param ribbonCloseArray forces the extrusion underlying ribbon to close all the paths in its `pathArray`
   * @param ribbonClosePath forces the extrusion underlying ribbon to close its `pathArray`
   * @param cap sets the way the extruded shape is capped. Possible values : Mesh.NO_CAP (default), Mesh.CAP_START, Mesh.CAP_END, Mesh.CAP_ALL
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @param instance is an instance of an existing ExtrudedShape object to be updated with the passed `shape`, `path`, `scale` or `rotation` parameters (https://doc.babylonjs.com/features/featuresDeepDive/mesh/dynamicMeshMorph#extruded-shape)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static ExtrudeShapeCustom(name47, shape, path, scaleFunction, rotationFunction, ribbonCloseArray, ribbonClosePath, cap, scene, updatable, sideOrientation, instance) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates lathe mesh.
   * The lathe is a shape with a symmetry axis : a 2D model shape is rotated around this axis to design the lathe.
   * @param name defines the name of the mesh to create
   * @param shape is a required array of successive Vector3. This array depicts the shape to be rotated in its local space : the shape must be designed in the xOy plane and will be rotated around the Y axis. It's usually a 2D shape, so the Vector3 z coordinates are often set to zero
   * @param radius is the radius value of the lathe
   * @param tessellation is the side number of the lathe.
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateLathe(name47, shape, radius, tessellation, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a plane mesh.
   * @param name defines the name of the mesh to create
   * @param size sets the size (float) of both sides of the plane at once (default 1)
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreatePlane(name47, size, scene, updatable, sideOrientation) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a ground mesh.
   * @param name defines the name of the mesh to create
   * @param width set the width of the ground
   * @param height set the height of the ground
   * @param subdivisions sets the number of subdivisions per side
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateGround(name47, width, height, subdivisions, scene, updatable) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a tiled ground mesh.
   * @param name defines the name of the mesh to create
   * @param xmin set the ground minimum X coordinate
   * @param zmin set the ground minimum Y coordinate
   * @param xmax set the ground maximum X coordinate
   * @param zmax set the ground maximum Z coordinate
   * @param subdivisions is an object `{w: positive integer, h: positive integer}` (default `{w: 6, h: 6}`). `w` and `h` are the numbers of subdivisions on the ground width and height. Each subdivision is called a tile
   * @param precision is an object `{w: positive integer, h: positive integer}` (default `{w: 2, h: 2}`). `w` and `h` are the numbers of subdivisions on the ground width and height of each tile
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateTiledGround(name47, xmin, zmin, xmax, zmax, subdivisions, precision, scene, updatable) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a ground mesh from a height map.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/height_map
   * @param name defines the name of the mesh to create
   * @param url sets the URL of the height map image resource
   * @param width set the ground width size
   * @param height set the ground height size
   * @param subdivisions sets the number of subdivision per side
   * @param minHeight is the minimum altitude on the ground
   * @param maxHeight is the maximum altitude on the ground
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param onReady  is a callback function that will be called  once the mesh is built (the height map download can last some time)
   * @param alphaFilter will filter any data where the alpha channel is below this value, defaults 0 (all data visible)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateGroundFromHeightMap(name47, url, width, height, subdivisions, minHeight, maxHeight, scene, updatable, onReady, alphaFilter) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a tube mesh.
   * The tube is a parametric shape.
   * It has no predefined shape. Its final shape will depend on the input parameters.
   *
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/param
   * @param name defines the name of the mesh to create
   * @param path is a required array of successive Vector3. It is the curve used as the axis of the tube
   * @param radius sets the tube radius size
   * @param tessellation is the number of sides on the tubular surface
   * @param radiusFunction is a custom function. If it is not null, it overrides the parameter `radius`. This function is called on each point of the tube path and is passed the index `i` of the i-th point and the distance of this point from the first point of the path
   * @param cap sets the way the extruded shape is capped. Possible values : Mesh.NO_CAP (default), Mesh.CAP_START, Mesh.CAP_END, Mesh.CAP_ALL
   * @param scene defines the hosting scene
   * @param updatable defines if the mesh must be flagged as updatable
   * @param sideOrientation defines the mesh side orientation (https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation)
   * @param instance is an instance of an existing Tube object to be updated with the passed `pathArray` parameter (https://doc.babylonjs.com/how_to/How_to_dynamically_morph_a_mesh#tube)
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateTube(name47, path, radius, tessellation, radiusFunction, cap, scene, updatable, sideOrientation, instance) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a polyhedron mesh.
   *.
   * * The parameter `type` (positive integer, max 14, default 0) sets the polyhedron type to build among the 15 embedded types. Please refer to the type sheet in the tutorial to choose the wanted type
   * * The parameter `size` (positive float, default 1) sets the polygon size
   * * You can overwrite the `size` on each dimension bu using the parameters `sizeX`, `sizeY` or `sizeZ` (positive floats, default to `size` value)
   * * You can build other polyhedron types than the 15 embbeded ones by setting the parameter `custom` (`polyhedronObject`, default null). If you set the parameter `custom`, this overwrittes the parameter `type`
   * * A `polyhedronObject` is a formatted javascript object. You'll find a full file with pre-set polyhedra here : https://github.com/BabylonJS/Extensions/tree/master/Polyhedron
   * * You can set the color and the UV of each side of the polyhedron with the parameters `faceColors` (Color4, default `(1, 1, 1, 1)`) and faceUV (Vector4, default `(0, 0, 1, 1)`)
   * * To understand how to set `faceUV` or `faceColors`, please read this by considering the right number of faces of your polyhedron, instead of only 6 for the box : https://doc.babylonjs.com/features/featuresDeepDive/materials/using/texturePerBoxFace
   * * The parameter `flat` (boolean, default true). If set to false, it gives the polyhedron a single global face, so less vertices and shared normals. In this case, `faceColors` and `faceUV` are ignored
   * * You can also set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation
   * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
   * @param name defines the name of the mesh to create
   * @param options defines the options used to create the mesh
   * @param scene defines the hosting scene
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreatePolyhedron(name47, options, scene) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a sphere based upon an icosahedron with 20 triangular faces which can be subdivided
   * * The parameter `radius` sets the radius size (float) of the icosphere (default 1)
   * * You can set some different icosphere dimensions, for instance to build an ellipsoid, by using the parameters `radiusX`, `radiusY` and `radiusZ` (all by default have the same value than `radius`)
   * * The parameter `subdivisions` sets the number of subdivisions (positive integer, default 4). The more subdivisions, the more faces on the icosphere whatever its size
   * * The parameter `flat` (boolean, default true) gives each side its own normals. Set it to false to get a smooth continuous light reflection on the surface
   * * You can also set the mesh side orientation with the values : Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE
   * * If you create a double-sided mesh, you can choose what parts of the texture image to crop and stick respectively on the front and the back sides with the parameters `frontUVs` and `backUVs` (Vector4). Detail here : https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set#side-orientation
   * * The mesh can be set to updatable with the boolean parameter `updatable` (default false) if its internal geometry is supposed to change once created
   * @see https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/polyhedra#icosphere
   * @param name defines the name of the mesh
   * @param options defines the options used to create the mesh
   * @param scene defines the hosting scene
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateIcoSphere(name47, options, scene) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Creates a decal mesh.
   *.
   * A decal is a mesh usually applied as a model onto the surface of another mesh
   * @param name  defines the name of the mesh
   * @param sourceMesh defines the mesh receiving the decal
   * @param position sets the position of the decal in world coordinates
   * @param normal sets the normal of the mesh where the decal is applied onto in world coordinates
   * @param size sets the decal scaling
   * @param angle sets the angle to rotate the decal
   * @returns a new Mesh
   * @deprecated Please use MeshBuilder instead
   */
  static CreateDecal(name47, sourceMesh, position, normal, size, angle) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /** Creates a Capsule Mesh
   * @param name defines the name of the mesh.
   * @param options the constructors options used to shape the mesh.
   * @param scene defines the scene the mesh is scoped to.
   * @returns the capsule mesh
   * @see https://doc.babylonjs.com/how_to/capsule_shape
   * @deprecated Please use MeshBuilder instead
   */
  static CreateCapsule(name47, options, scene) {
    throw new Error("Import MeshBuilder to populate this function");
  }
  /**
   * Extends a mesh to a Goldberg mesh
   * Warning  the mesh to convert MUST be an import of a perviously exported Goldberg mesh
   * @param mesh the mesh to convert
   * @returns the extended mesh
   * @deprecated Please use ExtendMeshToGoldberg instead
   */
  static ExtendToGoldberg(mesh) {
    throw new Error("Import MeshBuilder to populate this function");
  }
};
Mesh.FRONTSIDE = VertexData.FRONTSIDE;
Mesh.BACKSIDE = VertexData.BACKSIDE;
Mesh.DOUBLESIDE = VertexData.DOUBLESIDE;
Mesh.DEFAULTSIDE = VertexData.DEFAULTSIDE;
Mesh.NO_CAP = 0;
Mesh.CAP_START = 1;
Mesh.CAP_END = 2;
Mesh.CAP_ALL = 3;
Mesh.NO_FLIP = 0;
Mesh.FLIP_TILE = 1;
Mesh.ROTATE_TILE = 2;
Mesh.FLIP_ROW = 3;
Mesh.ROTATE_ROW = 4;
Mesh.FLIP_N_ROTATE_TILE = 5;
Mesh.FLIP_N_ROTATE_ROW = 6;
Mesh.CENTER = 0;
Mesh.LEFT = 1;
Mesh.RIGHT = 2;
Mesh.TOP = 3;
Mesh.BOTTOM = 4;
Mesh.INSTANCEDMESH_SORT_TRANSPARENT = false;
Mesh._GroundMeshParser = (parsedMesh, scene) => {
  throw _WarnImport("GroundMesh");
};
Mesh._GoldbergMeshParser = (parsedMesh, scene) => {
  throw _WarnImport("GoldbergMesh");
};
Mesh._LinesMeshParser = (parsedMesh, scene) => {
  throw _WarnImport("LinesMesh");
};
Mesh._GreasedLineMeshParser = (parsedMesh, scene) => {
  throw _WarnImport("GreasedLineMesh");
};
Mesh._GreasedLineRibbonMeshParser = (parsedMesh, scene) => {
  throw _WarnImport("GreasedLineRibbonMesh");
};
Mesh._TrailMeshParser = (parsedMesh, scene) => {
  throw _WarnImport("TrailMesh");
};
RegisterClass("BABYLON.Mesh", Mesh);

// node_modules/@babylonjs/core/Culling/ray.js
var Ray = class _Ray {
  /**
   * Creates a new ray
   * @param origin origin point
   * @param direction direction
   * @param length length of the ray
   */
  constructor(origin, direction, length = Number.MAX_VALUE) {
    this.origin = origin;
    this.direction = direction;
    this.length = length;
  }
  // Methods
  /**
   * Clone the current ray
   * @returns a new ray
   */
  clone() {
    return new _Ray(this.origin.clone(), this.direction.clone(), this.length);
  }
  /**
   * Checks if the ray intersects a box
   * This does not account for the ray length by design to improve perfs.
   * @param minimum bound of the box
   * @param maximum bound of the box
   * @param intersectionTreshold extra extend to be added to the box in all direction
   * @returns if the box was hit
   */
  intersectsBoxMinMax(minimum, maximum, intersectionTreshold = 0) {
    const newMinimum = _Ray._TmpVector3[0].copyFromFloats(minimum.x - intersectionTreshold, minimum.y - intersectionTreshold, minimum.z - intersectionTreshold);
    const newMaximum = _Ray._TmpVector3[1].copyFromFloats(maximum.x + intersectionTreshold, maximum.y + intersectionTreshold, maximum.z + intersectionTreshold);
    let d = 0;
    let maxValue = Number.MAX_VALUE;
    let inv;
    let min;
    let max;
    let temp;
    if (Math.abs(this.direction.x) < 1e-7) {
      if (this.origin.x < newMinimum.x || this.origin.x > newMaximum.x) {
        return false;
      }
    } else {
      inv = 1 / this.direction.x;
      min = (newMinimum.x - this.origin.x) * inv;
      max = (newMaximum.x - this.origin.x) * inv;
      if (max === -Infinity) {
        max = Infinity;
      }
      if (min > max) {
        temp = min;
        min = max;
        max = temp;
      }
      d = Math.max(min, d);
      maxValue = Math.min(max, maxValue);
      if (d > maxValue) {
        return false;
      }
    }
    if (Math.abs(this.direction.y) < 1e-7) {
      if (this.origin.y < newMinimum.y || this.origin.y > newMaximum.y) {
        return false;
      }
    } else {
      inv = 1 / this.direction.y;
      min = (newMinimum.y - this.origin.y) * inv;
      max = (newMaximum.y - this.origin.y) * inv;
      if (max === -Infinity) {
        max = Infinity;
      }
      if (min > max) {
        temp = min;
        min = max;
        max = temp;
      }
      d = Math.max(min, d);
      maxValue = Math.min(max, maxValue);
      if (d > maxValue) {
        return false;
      }
    }
    if (Math.abs(this.direction.z) < 1e-7) {
      if (this.origin.z < newMinimum.z || this.origin.z > newMaximum.z) {
        return false;
      }
    } else {
      inv = 1 / this.direction.z;
      min = (newMinimum.z - this.origin.z) * inv;
      max = (newMaximum.z - this.origin.z) * inv;
      if (max === -Infinity) {
        max = Infinity;
      }
      if (min > max) {
        temp = min;
        min = max;
        max = temp;
      }
      d = Math.max(min, d);
      maxValue = Math.min(max, maxValue);
      if (d > maxValue) {
        return false;
      }
    }
    return true;
  }
  /**
   * Checks if the ray intersects a box
   * This does not account for the ray lenght by design to improve perfs.
   * @param box the bounding box to check
   * @param intersectionTreshold extra extend to be added to the BoundingBox in all direction
   * @returns if the box was hit
   */
  intersectsBox(box, intersectionTreshold = 0) {
    return this.intersectsBoxMinMax(box.minimum, box.maximum, intersectionTreshold);
  }
  /**
   * If the ray hits a sphere
   * @param sphere the bounding sphere to check
   * @param intersectionTreshold extra extend to be added to the BoundingSphere in all direction
   * @returns true if it hits the sphere
   */
  intersectsSphere(sphere, intersectionTreshold = 0) {
    const x = sphere.center.x - this.origin.x;
    const y = sphere.center.y - this.origin.y;
    const z = sphere.center.z - this.origin.z;
    const pyth = x * x + y * y + z * z;
    const radius = sphere.radius + intersectionTreshold;
    const rr = radius * radius;
    if (pyth <= rr) {
      return true;
    }
    const dot = x * this.direction.x + y * this.direction.y + z * this.direction.z;
    if (dot < 0) {
      return false;
    }
    const temp = pyth - dot * dot;
    return temp <= rr;
  }
  /**
   * If the ray hits a triange
   * @param vertex0 triangle vertex
   * @param vertex1 triangle vertex
   * @param vertex2 triangle vertex
   * @returns intersection information if hit
   */
  intersectsTriangle(vertex0, vertex1, vertex2) {
    const edge1 = _Ray._TmpVector3[0];
    const edge2 = _Ray._TmpVector3[1];
    const pvec = _Ray._TmpVector3[2];
    const tvec = _Ray._TmpVector3[3];
    const qvec = _Ray._TmpVector3[4];
    vertex1.subtractToRef(vertex0, edge1);
    vertex2.subtractToRef(vertex0, edge2);
    Vector3.CrossToRef(this.direction, edge2, pvec);
    const det = Vector3.Dot(edge1, pvec);
    if (det === 0) {
      return null;
    }
    const invdet = 1 / det;
    this.origin.subtractToRef(vertex0, tvec);
    const bv = Vector3.Dot(tvec, pvec) * invdet;
    if (bv < 0 || bv > 1) {
      return null;
    }
    Vector3.CrossToRef(tvec, edge1, qvec);
    const bw = Vector3.Dot(this.direction, qvec) * invdet;
    if (bw < 0 || bv + bw > 1) {
      return null;
    }
    const distance = Vector3.Dot(edge2, qvec) * invdet;
    if (distance > this.length) {
      return null;
    }
    return new IntersectionInfo(1 - bv - bw, bv, distance);
  }
  /**
   * Checks if ray intersects a plane
   * @param plane the plane to check
   * @returns the distance away it was hit
   */
  intersectsPlane(plane) {
    let distance;
    const result1 = Vector3.Dot(plane.normal, this.direction);
    if (Math.abs(result1) < 999999997475243e-21) {
      return null;
    } else {
      const result2 = Vector3.Dot(plane.normal, this.origin);
      distance = (-plane.d - result2) / result1;
      if (distance < 0) {
        if (distance < -999999997475243e-21) {
          return null;
        } else {
          return 0;
        }
      }
      return distance;
    }
  }
  /**
   * Calculate the intercept of a ray on a given axis
   * @param axis to check 'x' | 'y' | 'z'
   * @param offset from axis interception (i.e. an offset of 1y is intercepted above ground)
   * @returns a vector containing the coordinates where 'axis' is equal to zero (else offset), or null if there is no intercept.
   */
  intersectsAxis(axis, offset = 0) {
    switch (axis) {
      case "y": {
        const t = (this.origin.y - offset) / this.direction.y;
        if (t > 0) {
          return null;
        }
        return new Vector3(this.origin.x + this.direction.x * -t, offset, this.origin.z + this.direction.z * -t);
      }
      case "x": {
        const t = (this.origin.x - offset) / this.direction.x;
        if (t > 0) {
          return null;
        }
        return new Vector3(offset, this.origin.y + this.direction.y * -t, this.origin.z + this.direction.z * -t);
      }
      case "z": {
        const t = (this.origin.z - offset) / this.direction.z;
        if (t > 0) {
          return null;
        }
        return new Vector3(this.origin.x + this.direction.x * -t, this.origin.y + this.direction.y * -t, offset);
      }
      default:
        return null;
    }
  }
  /**
   * Checks if ray intersects a mesh. The ray is defined in WORLD space. A mesh triangle can be picked both from its front and back sides,
   * irrespective of orientation.
   * @param mesh the mesh to check
   * @param fastCheck defines if the first intersection will be used (and not the closest)
   * @param trianglePredicate defines an optional predicate used to select faces when a mesh intersection is detected
   * @param onlyBoundingInfo defines a boolean indicating if picking should only happen using bounding info (false by default)
   * @param worldToUse defines the world matrix to use to get the world coordinate of the intersection point
   * @param skipBoundingInfo a boolean indicating if we should skip the bounding info check
   * @returns picking info of the intersection
   */
  intersectsMesh(mesh, fastCheck, trianglePredicate, onlyBoundingInfo = false, worldToUse, skipBoundingInfo = false) {
    const tm = TmpVectors.Matrix[0];
    mesh.getWorldMatrix().invertToRef(tm);
    if (this._tmpRay) {
      _Ray.TransformToRef(this, tm, this._tmpRay);
    } else {
      this._tmpRay = _Ray.Transform(this, tm);
    }
    return mesh.intersects(this._tmpRay, fastCheck, trianglePredicate, onlyBoundingInfo, worldToUse, skipBoundingInfo);
  }
  /**
   * Checks if ray intersects a mesh
   * @param meshes the meshes to check
   * @param fastCheck defines if the first intersection will be used (and not the closest)
   * @param results array to store result in
   * @returns Array of picking infos
   */
  intersectsMeshes(meshes, fastCheck, results) {
    if (results) {
      results.length = 0;
    } else {
      results = [];
    }
    for (let i = 0; i < meshes.length; i++) {
      const pickInfo = this.intersectsMesh(meshes[i], fastCheck);
      if (pickInfo.hit) {
        results.push(pickInfo);
      }
    }
    results.sort(this._comparePickingInfo);
    return results;
  }
  _comparePickingInfo(pickingInfoA, pickingInfoB) {
    if (pickingInfoA.distance < pickingInfoB.distance) {
      return -1;
    } else if (pickingInfoA.distance > pickingInfoB.distance) {
      return 1;
    } else {
      return 0;
    }
  }
  /**
   * Intersection test between the ray and a given segment within a given tolerance (threshold)
   * @param sega the first point of the segment to test the intersection against
   * @param segb the second point of the segment to test the intersection against
   * @param threshold the tolerance margin, if the ray doesn't intersect the segment but is close to the given threshold, the intersection is successful
   * @returns the distance from the ray origin to the intersection point if there's intersection, or -1 if there's no intersection
   */
  intersectionSegment(sega, segb, threshold) {
    const o = this.origin;
    const u = TmpVectors.Vector3[0];
    const rsegb = TmpVectors.Vector3[1];
    const v = TmpVectors.Vector3[2];
    const w = TmpVectors.Vector3[3];
    segb.subtractToRef(sega, u);
    this.direction.scaleToRef(_Ray._Rayl, v);
    o.addToRef(v, rsegb);
    sega.subtractToRef(o, w);
    const a = Vector3.Dot(u, u);
    const b = Vector3.Dot(u, v);
    const c = Vector3.Dot(v, v);
    const d = Vector3.Dot(u, w);
    const e = Vector3.Dot(v, w);
    const D = a * c - b * b;
    let sN, sD = D;
    let tN, tD = D;
    if (D < _Ray._Smallnum) {
      sN = 0;
      sD = 1;
      tN = e;
      tD = c;
    } else {
      sN = b * e - c * d;
      tN = a * e - b * d;
      if (sN < 0) {
        sN = 0;
        tN = e;
        tD = c;
      } else if (sN > sD) {
        sN = sD;
        tN = e + b;
        tD = c;
      }
    }
    if (tN < 0) {
      tN = 0;
      if (-d < 0) {
        sN = 0;
      } else if (-d > a) {
        sN = sD;
      } else {
        sN = -d;
        sD = a;
      }
    } else if (tN > tD) {
      tN = tD;
      if (-d + b < 0) {
        sN = 0;
      } else if (-d + b > a) {
        sN = sD;
      } else {
        sN = -d + b;
        sD = a;
      }
    }
    const sc = Math.abs(sN) < _Ray._Smallnum ? 0 : sN / sD;
    const tc = Math.abs(tN) < _Ray._Smallnum ? 0 : tN / tD;
    const qtc = TmpVectors.Vector3[4];
    v.scaleToRef(tc, qtc);
    const qsc = TmpVectors.Vector3[5];
    u.scaleToRef(sc, qsc);
    qsc.addInPlace(w);
    const dP = TmpVectors.Vector3[6];
    qsc.subtractToRef(qtc, dP);
    const isIntersected = tc > 0 && tc <= this.length && dP.lengthSquared() < threshold * threshold;
    if (isIntersected) {
      return qsc.length();
    }
    return -1;
  }
  /**
   * Update the ray from viewport position
   * @param x position
   * @param y y position
   * @param viewportWidth viewport width
   * @param viewportHeight viewport height
   * @param world world matrix
   * @param view view matrix
   * @param projection projection matrix
   * @param enableDistantPicking defines if picking should handle large values for mesh position/scaling (false by default)
   * @returns this ray updated
   */
  update(x, y, viewportWidth, viewportHeight, world, view, projection, enableDistantPicking = false) {
    if (enableDistantPicking) {
      if (!_Ray._RayDistant) {
        _Ray._RayDistant = _Ray.Zero();
      }
      _Ray._RayDistant.unprojectRayToRef(x, y, viewportWidth, viewportHeight, Matrix.IdentityReadOnly, view, projection);
      const tm = TmpVectors.Matrix[0];
      world.invertToRef(tm);
      _Ray.TransformToRef(_Ray._RayDistant, tm, this);
    } else {
      this.unprojectRayToRef(x, y, viewportWidth, viewportHeight, world, view, projection);
    }
    return this;
  }
  // Statics
  /**
   * Creates a ray with origin and direction of 0,0,0
   * @returns the new ray
   */
  static Zero() {
    return new _Ray(Vector3.Zero(), Vector3.Zero());
  }
  /**
   * Creates a new ray from screen space and viewport
   * @param x position
   * @param y y position
   * @param viewportWidth viewport width
   * @param viewportHeight viewport height
   * @param world world matrix
   * @param view view matrix
   * @param projection projection matrix
   * @returns new ray
   */
  static CreateNew(x, y, viewportWidth, viewportHeight, world, view, projection) {
    const result = _Ray.Zero();
    return result.update(x, y, viewportWidth, viewportHeight, world, view, projection);
  }
  /**
   * Function will create a new transformed ray starting from origin and ending at the end point. Ray's length will be set, and ray will be
   * transformed to the given world matrix.
   * @param origin The origin point
   * @param end The end point
   * @param world a matrix to transform the ray to. Default is the identity matrix.
   * @returns the new ray
   */
  static CreateNewFromTo(origin, end, world = Matrix.IdentityReadOnly) {
    const direction = end.subtract(origin);
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
    direction.normalize();
    return _Ray.Transform(new _Ray(origin, direction, length), world);
  }
  /**
   * Transforms a ray by a matrix
   * @param ray ray to transform
   * @param matrix matrix to apply
   * @returns the resulting new ray
   */
  static Transform(ray, matrix) {
    const result = new _Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 0));
    _Ray.TransformToRef(ray, matrix, result);
    return result;
  }
  /**
   * Transforms a ray by a matrix
   * @param ray ray to transform
   * @param matrix matrix to apply
   * @param result ray to store result in
   */
  static TransformToRef(ray, matrix, result) {
    Vector3.TransformCoordinatesToRef(ray.origin, matrix, result.origin);
    Vector3.TransformNormalToRef(ray.direction, matrix, result.direction);
    result.length = ray.length;
    const dir = result.direction;
    const len = dir.length();
    if (!(len === 0 || len === 1)) {
      const num = 1 / len;
      dir.x *= num;
      dir.y *= num;
      dir.z *= num;
      result.length *= len;
    }
  }
  /**
   * Unproject a ray from screen space to object space
   * @param sourceX defines the screen space x coordinate to use
   * @param sourceY defines the screen space y coordinate to use
   * @param viewportWidth defines the current width of the viewport
   * @param viewportHeight defines the current height of the viewport
   * @param world defines the world matrix to use (can be set to Identity to go to world space)
   * @param view defines the view matrix to use
   * @param projection defines the projection matrix to use
   */
  unprojectRayToRef(sourceX, sourceY, viewportWidth, viewportHeight, world, view, projection) {
    const matrix = TmpVectors.Matrix[0];
    world.multiplyToRef(view, matrix);
    matrix.multiplyToRef(projection, matrix);
    matrix.invert();
    const engine = EngineStore.LastCreatedEngine;
    const nearScreenSource = TmpVectors.Vector3[0];
    nearScreenSource.x = sourceX / viewportWidth * 2 - 1;
    nearScreenSource.y = -(sourceY / viewportHeight * 2 - 1);
    nearScreenSource.z = (engine === null || engine === void 0 ? void 0 : engine.useReverseDepthBuffer) ? 1 : (engine === null || engine === void 0 ? void 0 : engine.isNDCHalfZRange) ? 0 : -1;
    const farScreenSource = TmpVectors.Vector3[1].copyFromFloats(nearScreenSource.x, nearScreenSource.y, 1 - 1e-8);
    const nearVec3 = TmpVectors.Vector3[2];
    const farVec3 = TmpVectors.Vector3[3];
    Vector3._UnprojectFromInvertedMatrixToRef(nearScreenSource, matrix, nearVec3);
    Vector3._UnprojectFromInvertedMatrixToRef(farScreenSource, matrix, farVec3);
    this.origin.copyFrom(nearVec3);
    farVec3.subtractToRef(nearVec3, this.direction);
    this.direction.normalize();
  }
};
Ray._TmpVector3 = ArrayTools.BuildArray(6, Vector3.Zero);
Ray._RayDistant = Ray.Zero();
Ray._Smallnum = 1e-8;
Ray._Rayl = 1e9;
Scene.prototype.createPickingRay = function(x, y, world, camera, cameraViewSpace = false) {
  const result = Ray.Zero();
  this.createPickingRayToRef(x, y, world, result, camera, cameraViewSpace);
  return result;
};
Scene.prototype.createPickingRayToRef = function(x, y, world, result, camera, cameraViewSpace = false, enableDistantPicking = false) {
  const engine = this.getEngine();
  if (!camera && !(camera = this.activeCamera)) {
    return this;
  }
  const cameraViewport = camera.viewport;
  const renderHeight = engine.getRenderHeight();
  const { x: vx, y: vy, width, height } = cameraViewport.toGlobal(engine.getRenderWidth(), renderHeight);
  const levelInv = 1 / engine.getHardwareScalingLevel();
  x = x * levelInv - vx;
  y = y * levelInv - (renderHeight - vy - height);
  result.update(x, y, width, height, world ? world : Matrix.IdentityReadOnly, cameraViewSpace ? Matrix.IdentityReadOnly : camera.getViewMatrix(), camera.getProjectionMatrix(), enableDistantPicking);
  return this;
};
Scene.prototype.createPickingRayInCameraSpace = function(x, y, camera) {
  const result = Ray.Zero();
  this.createPickingRayInCameraSpaceToRef(x, y, result, camera);
  return result;
};
Scene.prototype.createPickingRayInCameraSpaceToRef = function(x, y, result, camera) {
  if (!PickingInfo) {
    return this;
  }
  const engine = this.getEngine();
  if (!camera && !(camera = this.activeCamera)) {
    throw new Error("Active camera not set");
  }
  const cameraViewport = camera.viewport;
  const renderHeight = engine.getRenderHeight();
  const { x: vx, y: vy, width, height } = cameraViewport.toGlobal(engine.getRenderWidth(), renderHeight);
  const identity = Matrix.Identity();
  const levelInv = 1 / engine.getHardwareScalingLevel();
  x = x * levelInv - vx;
  y = y * levelInv - (renderHeight - vy - height);
  result.update(x, y, width, height, identity, identity, camera.getProjectionMatrix());
  return this;
};
Scene.prototype._internalPickForMesh = function(pickingInfo, rayFunction, mesh, world, fastCheck, onlyBoundingInfo, trianglePredicate, skipBoundingInfo) {
  const ray = rayFunction(world, mesh.enableDistantPicking);
  const result = mesh.intersects(ray, fastCheck, trianglePredicate, onlyBoundingInfo, world, skipBoundingInfo);
  if (!result || !result.hit) {
    return null;
  }
  if (!fastCheck && pickingInfo != null && result.distance >= pickingInfo.distance) {
    return null;
  }
  return result;
};
Scene.prototype._internalPick = function(rayFunction, predicate, fastCheck, onlyBoundingInfo, trianglePredicate) {
  let pickingInfo = null;
  const computeWorldMatrixForCamera = !!(this.activeCameras && this.activeCameras.length > 1 && this.cameraToUseForPointers !== this.activeCamera);
  const currentCamera = this.cameraToUseForPointers || this.activeCamera;
  for (let meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
    const mesh = this.meshes[meshIndex];
    if (predicate) {
      if (!predicate(mesh)) {
        continue;
      }
    } else if (!mesh.isEnabled() || !mesh.isVisible || !mesh.isPickable) {
      continue;
    }
    const forceCompute = computeWorldMatrixForCamera && mesh.isWorldMatrixCameraDependent();
    const world = mesh.computeWorldMatrix(forceCompute, currentCamera);
    if (mesh.hasThinInstances && mesh.thinInstanceEnablePicking) {
      const result = this._internalPickForMesh(pickingInfo, rayFunction, mesh, world, true, true, trianglePredicate);
      if (result) {
        if (onlyBoundingInfo) {
          return result;
        }
        const tmpMatrix = TmpVectors.Matrix[1];
        const thinMatrices = mesh.thinInstanceGetWorldMatrices();
        for (let index = 0; index < thinMatrices.length; index++) {
          const thinMatrix = thinMatrices[index];
          thinMatrix.multiplyToRef(world, tmpMatrix);
          const result2 = this._internalPickForMesh(pickingInfo, rayFunction, mesh, tmpMatrix, fastCheck, onlyBoundingInfo, trianglePredicate, true);
          if (result2) {
            pickingInfo = result2;
            pickingInfo.thinInstanceIndex = index;
            if (fastCheck) {
              return pickingInfo;
            }
          }
        }
      }
    } else {
      const result = this._internalPickForMesh(pickingInfo, rayFunction, mesh, world, fastCheck, onlyBoundingInfo, trianglePredicate);
      if (result) {
        pickingInfo = result;
        if (fastCheck) {
          return pickingInfo;
        }
      }
    }
  }
  return pickingInfo || new PickingInfo();
};
Scene.prototype._internalMultiPick = function(rayFunction, predicate, trianglePredicate) {
  if (!PickingInfo) {
    return null;
  }
  const pickingInfos = [];
  const computeWorldMatrixForCamera = !!(this.activeCameras && this.activeCameras.length > 1 && this.cameraToUseForPointers !== this.activeCamera);
  const currentCamera = this.cameraToUseForPointers || this.activeCamera;
  for (let meshIndex = 0; meshIndex < this.meshes.length; meshIndex++) {
    const mesh = this.meshes[meshIndex];
    if (predicate) {
      if (!predicate(mesh)) {
        continue;
      }
    } else if (!mesh.isEnabled() || !mesh.isVisible || !mesh.isPickable) {
      continue;
    }
    const forceCompute = computeWorldMatrixForCamera && mesh.isWorldMatrixCameraDependent();
    const world = mesh.computeWorldMatrix(forceCompute, currentCamera);
    if (mesh.hasThinInstances && mesh.thinInstanceEnablePicking) {
      const result = this._internalPickForMesh(null, rayFunction, mesh, world, true, true, trianglePredicate);
      if (result) {
        const tmpMatrix = TmpVectors.Matrix[1];
        const thinMatrices = mesh.thinInstanceGetWorldMatrices();
        for (let index = 0; index < thinMatrices.length; index++) {
          const thinMatrix = thinMatrices[index];
          thinMatrix.multiplyToRef(world, tmpMatrix);
          const result2 = this._internalPickForMesh(null, rayFunction, mesh, tmpMatrix, false, false, trianglePredicate, true);
          if (result2) {
            result2.thinInstanceIndex = index;
            pickingInfos.push(result2);
          }
        }
      }
    } else {
      const result = this._internalPickForMesh(null, rayFunction, mesh, world, false, false, trianglePredicate);
      if (result) {
        pickingInfos.push(result);
      }
    }
  }
  return pickingInfos;
};
Scene.prototype.pickWithBoundingInfo = function(x, y, predicate, fastCheck, camera) {
  if (!PickingInfo) {
    return null;
  }
  const result = this._internalPick((world) => {
    if (!this._tempPickingRay) {
      this._tempPickingRay = Ray.Zero();
    }
    this.createPickingRayToRef(x, y, world, this._tempPickingRay, camera || null);
    return this._tempPickingRay;
  }, predicate, fastCheck, true);
  if (result) {
    result.ray = this.createPickingRay(x, y, Matrix.Identity(), camera || null);
  }
  return result;
};
Object.defineProperty(Scene.prototype, "_pickingAvailable", {
  get: () => true,
  enumerable: false,
  configurable: false
});
Scene.prototype.pick = function(x, y, predicate, fastCheck, camera, trianglePredicate, _enableDistantPicking = false) {
  const result = this._internalPick((world, enableDistantPicking) => {
    if (!this._tempPickingRay) {
      this._tempPickingRay = Ray.Zero();
    }
    this.createPickingRayToRef(x, y, world, this._tempPickingRay, camera || null, false, enableDistantPicking);
    return this._tempPickingRay;
  }, predicate, fastCheck, false, trianglePredicate);
  if (result) {
    result.ray = this.createPickingRay(x, y, Matrix.Identity(), camera || null);
  }
  return result;
};
Scene.prototype.pickWithRay = function(ray, predicate, fastCheck, trianglePredicate) {
  const result = this._internalPick((world) => {
    if (!this._pickWithRayInverseMatrix) {
      this._pickWithRayInverseMatrix = Matrix.Identity();
    }
    world.invertToRef(this._pickWithRayInverseMatrix);
    if (!this._cachedRayForTransform) {
      this._cachedRayForTransform = Ray.Zero();
    }
    Ray.TransformToRef(ray, this._pickWithRayInverseMatrix, this._cachedRayForTransform);
    return this._cachedRayForTransform;
  }, predicate, fastCheck, false, trianglePredicate);
  if (result) {
    result.ray = ray;
  }
  return result;
};
Scene.prototype.multiPick = function(x, y, predicate, camera, trianglePredicate) {
  return this._internalMultiPick((world) => this.createPickingRay(x, y, world, camera || null), predicate, trianglePredicate);
};
Scene.prototype.multiPickWithRay = function(ray, predicate, trianglePredicate) {
  return this._internalMultiPick((world) => {
    if (!this._pickWithRayInverseMatrix) {
      this._pickWithRayInverseMatrix = Matrix.Identity();
    }
    world.invertToRef(this._pickWithRayInverseMatrix);
    if (!this._cachedRayForTransform) {
      this._cachedRayForTransform = Ray.Zero();
    }
    Ray.TransformToRef(ray, this._pickWithRayInverseMatrix, this._cachedRayForTransform);
    return this._cachedRayForTransform;
  }, predicate, trianglePredicate);
};
Camera.prototype.getForwardRay = function(length = 100, transform, origin) {
  return this.getForwardRayToRef(new Ray(Vector3.Zero(), Vector3.Zero(), length), length, transform, origin);
};
Camera.prototype.getForwardRayToRef = function(refRay, length = 100, transform, origin) {
  if (!transform) {
    transform = this.getWorldMatrix();
  }
  refRay.length = length;
  if (origin) {
    refRay.origin.copyFrom(origin);
  } else {
    refRay.origin.copyFrom(this.position);
  }
  const forward = TmpVectors.Vector3[2];
  forward.set(0, 0, this._scene.useRightHandedSystem ? -1 : 1);
  const worldForward = TmpVectors.Vector3[3];
  Vector3.TransformNormalToRef(forward, transform, worldForward);
  Vector3.NormalizeToRef(worldForward, refRay.direction);
  return refRay;
};

// node_modules/@babylonjs/core/Materials/pushMaterial.js
var PushMaterial = class extends Material {
  constructor(name47, scene, storeEffectOnSubMeshes = true) {
    super(name47, scene);
    this._normalMatrix = new Matrix();
    this._storeEffectOnSubMeshes = storeEffectOnSubMeshes;
  }
  getEffect() {
    return this._storeEffectOnSubMeshes ? this._activeEffect : super.getEffect();
  }
  isReady(mesh, useInstances) {
    if (!mesh) {
      return false;
    }
    if (!this._storeEffectOnSubMeshes) {
      return true;
    }
    if (!mesh.subMeshes || mesh.subMeshes.length === 0) {
      return true;
    }
    return this.isReadyForSubMesh(mesh, mesh.subMeshes[0], useInstances);
  }
  _isReadyForSubMesh(subMesh) {
    const defines = subMesh.materialDefines;
    if (!this.checkReadyOnEveryCall && subMesh.effect && defines) {
      if (defines._renderId === this.getScene().getRenderId()) {
        return true;
      }
    }
    return false;
  }
  /**
   * Binds the given world matrix to the active effect
   *
   * @param world the matrix to bind
   */
  bindOnlyWorldMatrix(world) {
    this._activeEffect.setMatrix("world", world);
  }
  /**
   * Binds the given normal matrix to the active effect
   *
   * @param normalMatrix the matrix to bind
   */
  bindOnlyNormalMatrix(normalMatrix) {
    this._activeEffect.setMatrix("normalMatrix", normalMatrix);
  }
  bind(world, mesh) {
    if (!mesh) {
      return;
    }
    this.bindForSubMesh(world, mesh, mesh.subMeshes[0]);
  }
  _afterBind(mesh, effect = null) {
    super._afterBind(mesh, effect);
    this.getScene()._cachedEffect = effect;
    if (effect) {
      effect._forceRebindOnNextCall = false;
    }
  }
  _mustRebind(scene, effect, visibility = 1) {
    return scene.isCachedMaterialInvalid(this, effect, visibility);
  }
  dispose(forceDisposeEffect, forceDisposeTextures, notBoundToMesh) {
    this._activeEffect = void 0;
    super.dispose(forceDisposeEffect, forceDisposeTextures, notBoundToMesh);
  }
};

// node_modules/@babylonjs/core/Shaders/passCube.fragment.js
var name = "passCubePixelShader";
var shader = `varying vec2 vUV;uniform samplerCube textureSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{vec2 uv=vUV*2.0-1.0;
#ifdef POSITIVEX
gl_FragColor=textureCube(textureSampler,vec3(1.001,uv.y,uv.x));
#endif
#ifdef NEGATIVEX
gl_FragColor=textureCube(textureSampler,vec3(-1.001,uv.y,uv.x));
#endif
#ifdef POSITIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,1.001,uv.x));
#endif
#ifdef NEGATIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,-1.001,uv.x));
#endif
#ifdef POSITIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,1.001));
#endif
#ifdef NEGATIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,-1.001));
#endif
}`;
ShaderStore.ShadersStore[name] = shader;

// node_modules/@babylonjs/core/PostProcesses/passPostProcess.js
var PassPostProcess = class _PassPostProcess extends PostProcess {
  /**
   * Gets a string identifying the name of the class
   * @returns "PassPostProcess" string
   */
  getClassName() {
    return "PassPostProcess";
  }
  /**
   * Creates the PassPostProcess
   * @param name The name of the effect.
   * @param options The required width/height ratio to downsize to before computing the render pass.
   * @param camera The camera to apply the render pass to.
   * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
   * @param engine The engine which the post process will be applied. (default: current engine)
   * @param reusable If the post process can be reused on the same frame. (default: false)
   * @param textureType The type of texture to be used when performing the post processing.
   * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
   */
  constructor(name47, options, camera = null, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
    super(name47, "pass", null, null, options, camera, samplingMode, engine, reusable, void 0, textureType, void 0, null, blockCompilation);
  }
  /**
   * @internal
   */
  static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
    return SerializationHelper.Parse(() => {
      return new _PassPostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, parsedPostProcess._engine, parsedPostProcess.reusable);
    }, parsedPostProcess, scene, rootUrl);
  }
};
RegisterClass("BABYLON.PassPostProcess", PassPostProcess);
var PassCubePostProcess = class _PassCubePostProcess extends PostProcess {
  /**
   * Gets or sets the cube face to display.
   *  * 0 is +X
   *  * 1 is -X
   *  * 2 is +Y
   *  * 3 is -Y
   *  * 4 is +Z
   *  * 5 is -Z
   */
  get face() {
    return this._face;
  }
  set face(value) {
    if (value < 0 || value > 5) {
      return;
    }
    this._face = value;
    switch (this._face) {
      case 0:
        this.updateEffect("#define POSITIVEX");
        break;
      case 1:
        this.updateEffect("#define NEGATIVEX");
        break;
      case 2:
        this.updateEffect("#define POSITIVEY");
        break;
      case 3:
        this.updateEffect("#define NEGATIVEY");
        break;
      case 4:
        this.updateEffect("#define POSITIVEZ");
        break;
      case 5:
        this.updateEffect("#define NEGATIVEZ");
        break;
    }
  }
  /**
   * Gets a string identifying the name of the class
   * @returns "PassCubePostProcess" string
   */
  getClassName() {
    return "PassCubePostProcess";
  }
  /**
   * Creates the PassCubePostProcess
   * @param name The name of the effect.
   * @param options The required width/height ratio to downsize to before computing the render pass.
   * @param camera The camera to apply the render pass to.
   * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
   * @param engine The engine which the post process will be applied. (default: current engine)
   * @param reusable If the post process can be reused on the same frame. (default: false)
   * @param textureType The type of texture to be used when performing the post processing.
   * @param blockCompilation If compilation of the shader should not be done in the constructor. The updateEffect method can be used to compile the shader at a later time. (default: false)
   */
  constructor(name47, options, camera = null, samplingMode, engine, reusable, textureType = 0, blockCompilation = false) {
    super(name47, "passCube", null, null, options, camera, samplingMode, engine, reusable, "#define POSITIVEX", textureType, void 0, null, blockCompilation);
    this._face = 0;
  }
  /**
   * @internal
   */
  static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
    return SerializationHelper.Parse(() => {
      return new _PassCubePostProcess(parsedPostProcess.name, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, parsedPostProcess._engine, parsedPostProcess.reusable);
    }, parsedPostProcess, scene, rootUrl);
  }
};
Engine._RescalePostProcessFactory = (engine) => {
  return new PassPostProcess("rescale", 1, null, 2, engine, false, 0);
};

// node_modules/@babylonjs/core/Materials/materialFlags.js
var MaterialFlags = class {
  /**
   * Are diffuse textures enabled in the application.
   */
  static get DiffuseTextureEnabled() {
    return this._DiffuseTextureEnabled;
  }
  static set DiffuseTextureEnabled(value) {
    if (this._DiffuseTextureEnabled === value) {
      return;
    }
    this._DiffuseTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are detail textures enabled in the application.
   */
  static get DetailTextureEnabled() {
    return this._DetailTextureEnabled;
  }
  static set DetailTextureEnabled(value) {
    if (this._DetailTextureEnabled === value) {
      return;
    }
    this._DetailTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are decal maps enabled in the application.
   */
  static get DecalMapEnabled() {
    return this._DecalMapEnabled;
  }
  static set DecalMapEnabled(value) {
    if (this._DecalMapEnabled === value) {
      return;
    }
    this._DecalMapEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are ambient textures enabled in the application.
   */
  static get AmbientTextureEnabled() {
    return this._AmbientTextureEnabled;
  }
  static set AmbientTextureEnabled(value) {
    if (this._AmbientTextureEnabled === value) {
      return;
    }
    this._AmbientTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are opacity textures enabled in the application.
   */
  static get OpacityTextureEnabled() {
    return this._OpacityTextureEnabled;
  }
  static set OpacityTextureEnabled(value) {
    if (this._OpacityTextureEnabled === value) {
      return;
    }
    this._OpacityTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are reflection textures enabled in the application.
   */
  static get ReflectionTextureEnabled() {
    return this._ReflectionTextureEnabled;
  }
  static set ReflectionTextureEnabled(value) {
    if (this._ReflectionTextureEnabled === value) {
      return;
    }
    this._ReflectionTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are emissive textures enabled in the application.
   */
  static get EmissiveTextureEnabled() {
    return this._EmissiveTextureEnabled;
  }
  static set EmissiveTextureEnabled(value) {
    if (this._EmissiveTextureEnabled === value) {
      return;
    }
    this._EmissiveTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are specular textures enabled in the application.
   */
  static get SpecularTextureEnabled() {
    return this._SpecularTextureEnabled;
  }
  static set SpecularTextureEnabled(value) {
    if (this._SpecularTextureEnabled === value) {
      return;
    }
    this._SpecularTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are bump textures enabled in the application.
   */
  static get BumpTextureEnabled() {
    return this._BumpTextureEnabled;
  }
  static set BumpTextureEnabled(value) {
    if (this._BumpTextureEnabled === value) {
      return;
    }
    this._BumpTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are lightmap textures enabled in the application.
   */
  static get LightmapTextureEnabled() {
    return this._LightmapTextureEnabled;
  }
  static set LightmapTextureEnabled(value) {
    if (this._LightmapTextureEnabled === value) {
      return;
    }
    this._LightmapTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are refraction textures enabled in the application.
   */
  static get RefractionTextureEnabled() {
    return this._RefractionTextureEnabled;
  }
  static set RefractionTextureEnabled(value) {
    if (this._RefractionTextureEnabled === value) {
      return;
    }
    this._RefractionTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are color grading textures enabled in the application.
   */
  static get ColorGradingTextureEnabled() {
    return this._ColorGradingTextureEnabled;
  }
  static set ColorGradingTextureEnabled(value) {
    if (this._ColorGradingTextureEnabled === value) {
      return;
    }
    this._ColorGradingTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are fresnels enabled in the application.
   */
  static get FresnelEnabled() {
    return this._FresnelEnabled;
  }
  static set FresnelEnabled(value) {
    if (this._FresnelEnabled === value) {
      return;
    }
    this._FresnelEnabled = value;
    Engine.MarkAllMaterialsAsDirty(4);
  }
  /**
   * Are clear coat textures enabled in the application.
   */
  static get ClearCoatTextureEnabled() {
    return this._ClearCoatTextureEnabled;
  }
  static set ClearCoatTextureEnabled(value) {
    if (this._ClearCoatTextureEnabled === value) {
      return;
    }
    this._ClearCoatTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are clear coat bump textures enabled in the application.
   */
  static get ClearCoatBumpTextureEnabled() {
    return this._ClearCoatBumpTextureEnabled;
  }
  static set ClearCoatBumpTextureEnabled(value) {
    if (this._ClearCoatBumpTextureEnabled === value) {
      return;
    }
    this._ClearCoatBumpTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are clear coat tint textures enabled in the application.
   */
  static get ClearCoatTintTextureEnabled() {
    return this._ClearCoatTintTextureEnabled;
  }
  static set ClearCoatTintTextureEnabled(value) {
    if (this._ClearCoatTintTextureEnabled === value) {
      return;
    }
    this._ClearCoatTintTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are sheen textures enabled in the application.
   */
  static get SheenTextureEnabled() {
    return this._SheenTextureEnabled;
  }
  static set SheenTextureEnabled(value) {
    if (this._SheenTextureEnabled === value) {
      return;
    }
    this._SheenTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are anisotropic textures enabled in the application.
   */
  static get AnisotropicTextureEnabled() {
    return this._AnisotropicTextureEnabled;
  }
  static set AnisotropicTextureEnabled(value) {
    if (this._AnisotropicTextureEnabled === value) {
      return;
    }
    this._AnisotropicTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are thickness textures enabled in the application.
   */
  static get ThicknessTextureEnabled() {
    return this._ThicknessTextureEnabled;
  }
  static set ThicknessTextureEnabled(value) {
    if (this._ThicknessTextureEnabled === value) {
      return;
    }
    this._ThicknessTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are refraction intensity textures enabled in the application.
   */
  static get RefractionIntensityTextureEnabled() {
    return this._ThicknessTextureEnabled;
  }
  static set RefractionIntensityTextureEnabled(value) {
    if (this._RefractionIntensityTextureEnabled === value) {
      return;
    }
    this._RefractionIntensityTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are translucency intensity textures enabled in the application.
   */
  static get TranslucencyIntensityTextureEnabled() {
    return this._ThicknessTextureEnabled;
  }
  static set TranslucencyIntensityTextureEnabled(value) {
    if (this._TranslucencyIntensityTextureEnabled === value) {
      return;
    }
    this._TranslucencyIntensityTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
  /**
   * Are translucency intensity textures enabled in the application.
   */
  static get IridescenceTextureEnabled() {
    return this._IridescenceTextureEnabled;
  }
  static set IridescenceTextureEnabled(value) {
    if (this._IridescenceTextureEnabled === value) {
      return;
    }
    this._IridescenceTextureEnabled = value;
    Engine.MarkAllMaterialsAsDirty(1);
  }
};
MaterialFlags._DiffuseTextureEnabled = true;
MaterialFlags._DetailTextureEnabled = true;
MaterialFlags._DecalMapEnabled = true;
MaterialFlags._AmbientTextureEnabled = true;
MaterialFlags._OpacityTextureEnabled = true;
MaterialFlags._ReflectionTextureEnabled = true;
MaterialFlags._EmissiveTextureEnabled = true;
MaterialFlags._SpecularTextureEnabled = true;
MaterialFlags._BumpTextureEnabled = true;
MaterialFlags._LightmapTextureEnabled = true;
MaterialFlags._RefractionTextureEnabled = true;
MaterialFlags._ColorGradingTextureEnabled = true;
MaterialFlags._FresnelEnabled = true;
MaterialFlags._ClearCoatTextureEnabled = true;
MaterialFlags._ClearCoatBumpTextureEnabled = true;
MaterialFlags._ClearCoatTintTextureEnabled = true;
MaterialFlags._SheenTextureEnabled = true;
MaterialFlags._AnisotropicTextureEnabled = true;
MaterialFlags._ThicknessTextureEnabled = true;
MaterialFlags._RefractionIntensityTextureEnabled = true;
MaterialFlags._TranslucencyIntensityTextureEnabled = true;
MaterialFlags._IridescenceTextureEnabled = true;

// node_modules/@babylonjs/core/Materials/materialPluginManager.js
var rxOption = new RegExp("^([gimus]+)!");
var MaterialPluginManager = class _MaterialPluginManager {
  /**
   * Creates a new instance of the plugin manager
   * @param material material that this manager will manage the plugins for
   */
  constructor(material) {
    this._plugins = [];
    this._activePlugins = [];
    this._activePluginsForExtraEvents = [];
    this._material = material;
    this._scene = material.getScene();
    this._engine = this._scene.getEngine();
  }
  /**
   * @internal
   */
  _addPlugin(plugin) {
    for (let i = 0; i < this._plugins.length; ++i) {
      if (this._plugins[i].name === plugin.name) {
        return false;
      }
    }
    if (this._material._uniformBufferLayoutBuilt) {
      throw `The plugin "${plugin.name}" can't be added to the material "${this._material.name}" because this material has already been used for rendering! Please add plugins to materials before any rendering with this material occurs.`;
    }
    const pluginClassName = plugin.getClassName();
    if (!_MaterialPluginManager._MaterialPluginClassToMainDefine[pluginClassName]) {
      _MaterialPluginManager._MaterialPluginClassToMainDefine[pluginClassName] = "MATERIALPLUGIN_" + ++_MaterialPluginManager._MaterialPluginCounter;
    }
    this._material._callbackPluginEventGeneric = (id, info) => this._handlePluginEvent(id, info);
    this._plugins.push(plugin);
    this._plugins.sort((a, b) => a.priority - b.priority);
    this._codeInjectionPoints = {};
    const defineNamesFromPlugins = {};
    defineNamesFromPlugins[_MaterialPluginManager._MaterialPluginClassToMainDefine[pluginClassName]] = {
      type: "boolean",
      default: true
    };
    for (const plugin2 of this._plugins) {
      plugin2.collectDefines(defineNamesFromPlugins);
      this._collectPointNames("vertex", plugin2.getCustomCode("vertex"));
      this._collectPointNames("fragment", plugin2.getCustomCode("fragment"));
    }
    this._defineNamesFromPlugins = defineNamesFromPlugins;
    return true;
  }
  /**
   * @internal
   */
  _activatePlugin(plugin) {
    if (this._activePlugins.indexOf(plugin) === -1) {
      this._activePlugins.push(plugin);
      this._activePlugins.sort((a, b) => a.priority - b.priority);
      this._material._callbackPluginEventIsReadyForSubMesh = this._handlePluginEventIsReadyForSubMesh.bind(this);
      this._material._callbackPluginEventPrepareDefinesBeforeAttributes = this._handlePluginEventPrepareDefinesBeforeAttributes.bind(this);
      this._material._callbackPluginEventPrepareDefines = this._handlePluginEventPrepareDefines.bind(this);
      this._material._callbackPluginEventBindForSubMesh = this._handlePluginEventBindForSubMesh.bind(this);
      if (plugin.registerForExtraEvents) {
        this._activePluginsForExtraEvents.push(plugin);
        this._activePluginsForExtraEvents.sort((a, b) => a.priority - b.priority);
        this._material._callbackPluginEventHasRenderTargetTextures = this._handlePluginEventHasRenderTargetTextures.bind(this);
        this._material._callbackPluginEventFillRenderTargetTextures = this._handlePluginEventFillRenderTargetTextures.bind(this);
        this._material._callbackPluginEventHardBindForSubMesh = this._handlePluginEventHardBindForSubMesh.bind(this);
      }
    }
  }
  /**
   * Gets a plugin from the list of plugins managed by this manager
   * @param name name of the plugin
   * @returns the plugin if found, else null
   */
  getPlugin(name47) {
    for (let i = 0; i < this._plugins.length; ++i) {
      if (this._plugins[i].name === name47) {
        return this._plugins[i];
      }
    }
    return null;
  }
  _handlePluginEventIsReadyForSubMesh(eventData) {
    let isReady = true;
    for (const plugin of this._activePlugins) {
      isReady = isReady && plugin.isReadyForSubMesh(eventData.defines, this._scene, this._engine, eventData.subMesh);
    }
    eventData.isReadyForSubMesh = isReady;
  }
  _handlePluginEventPrepareDefinesBeforeAttributes(eventData) {
    for (const plugin of this._activePlugins) {
      plugin.prepareDefinesBeforeAttributes(eventData.defines, this._scene, eventData.mesh);
    }
  }
  _handlePluginEventPrepareDefines(eventData) {
    for (const plugin of this._activePlugins) {
      plugin.prepareDefines(eventData.defines, this._scene, eventData.mesh);
    }
  }
  _handlePluginEventHardBindForSubMesh(eventData) {
    for (const plugin of this._activePluginsForExtraEvents) {
      plugin.hardBindForSubMesh(this._material._uniformBuffer, this._scene, this._engine, eventData.subMesh);
    }
  }
  _handlePluginEventBindForSubMesh(eventData) {
    for (const plugin of this._activePlugins) {
      plugin.bindForSubMesh(this._material._uniformBuffer, this._scene, this._engine, eventData.subMesh);
    }
  }
  _handlePluginEventHasRenderTargetTextures(eventData) {
    let hasRenderTargetTextures = false;
    for (const plugin of this._activePluginsForExtraEvents) {
      hasRenderTargetTextures = plugin.hasRenderTargetTextures();
      if (hasRenderTargetTextures) {
        break;
      }
    }
    eventData.hasRenderTargetTextures = hasRenderTargetTextures;
  }
  _handlePluginEventFillRenderTargetTextures(eventData) {
    for (const plugin of this._activePluginsForExtraEvents) {
      plugin.fillRenderTargetTextures(eventData.renderTargets);
    }
  }
  _handlePluginEvent(id, info) {
    var _a;
    switch (id) {
      case MaterialPluginEvent.GetActiveTextures: {
        const eventData = info;
        for (const plugin of this._activePlugins) {
          plugin.getActiveTextures(eventData.activeTextures);
        }
        break;
      }
      case MaterialPluginEvent.GetAnimatables: {
        const eventData = info;
        for (const plugin of this._activePlugins) {
          plugin.getAnimatables(eventData.animatables);
        }
        break;
      }
      case MaterialPluginEvent.HasTexture: {
        const eventData = info;
        let hasTexture = false;
        for (const plugin of this._activePlugins) {
          hasTexture = plugin.hasTexture(eventData.texture);
          if (hasTexture) {
            break;
          }
        }
        eventData.hasTexture = hasTexture;
        break;
      }
      case MaterialPluginEvent.Disposed: {
        const eventData = info;
        for (const plugin of this._plugins) {
          plugin.dispose(eventData.forceDisposeTextures);
        }
        break;
      }
      case MaterialPluginEvent.GetDefineNames: {
        const eventData = info;
        eventData.defineNames = this._defineNamesFromPlugins;
        break;
      }
      case MaterialPluginEvent.PrepareEffect: {
        const eventData = info;
        for (const plugin of this._activePlugins) {
          eventData.fallbackRank = plugin.addFallbacks(eventData.defines, eventData.fallbacks, eventData.fallbackRank);
          plugin.getAttributes(eventData.attributes, this._scene, eventData.mesh);
        }
        if (this._uniformList.length > 0) {
          eventData.uniforms.push(...this._uniformList);
        }
        if (this._samplerList.length > 0) {
          eventData.samplers.push(...this._samplerList);
        }
        if (this._uboList.length > 0) {
          eventData.uniformBuffersNames.push(...this._uboList);
        }
        eventData.customCode = this._injectCustomCode(eventData, eventData.customCode);
        break;
      }
      case MaterialPluginEvent.PrepareUniformBuffer: {
        const eventData = info;
        this._uboDeclaration = "";
        this._vertexDeclaration = "";
        this._fragmentDeclaration = "";
        this._uniformList = [];
        this._samplerList = [];
        this._uboList = [];
        for (const plugin of this._plugins) {
          const uniforms = plugin.getUniforms();
          if (uniforms) {
            if (uniforms.ubo) {
              for (const uniform of uniforms.ubo) {
                if (uniform.size && uniform.type) {
                  const arraySize = (_a = uniform.arraySize) !== null && _a !== void 0 ? _a : 0;
                  eventData.ubo.addUniform(uniform.name, uniform.size, arraySize);
                  this._uboDeclaration += `${uniform.type} ${uniform.name}${arraySize > 0 ? `[${arraySize}]` : ""};
`;
                }
                this._uniformList.push(uniform.name);
              }
            }
            if (uniforms.vertex) {
              this._vertexDeclaration += uniforms.vertex + "\n";
            }
            if (uniforms.fragment) {
              this._fragmentDeclaration += uniforms.fragment + "\n";
            }
          }
          plugin.getSamplers(this._samplerList);
          plugin.getUniformBuffersNames(this._uboList);
        }
        break;
      }
    }
  }
  _collectPointNames(shaderType, customCode) {
    if (!customCode) {
      return;
    }
    for (const pointName in customCode) {
      if (!this._codeInjectionPoints[shaderType]) {
        this._codeInjectionPoints[shaderType] = {};
      }
      this._codeInjectionPoints[shaderType][pointName] = true;
    }
  }
  _injectCustomCode(eventData, existingCallback) {
    return (shaderType, code) => {
      var _a, _b;
      if (existingCallback) {
        code = existingCallback(shaderType, code);
      }
      if (this._uboDeclaration) {
        code = code.replace("#define ADDITIONAL_UBO_DECLARATION", this._uboDeclaration);
      }
      if (this._vertexDeclaration) {
        code = code.replace("#define ADDITIONAL_VERTEX_DECLARATION", this._vertexDeclaration);
      }
      if (this._fragmentDeclaration) {
        code = code.replace("#define ADDITIONAL_FRAGMENT_DECLARATION", this._fragmentDeclaration);
      }
      const points = (_a = this._codeInjectionPoints) === null || _a === void 0 ? void 0 : _a[shaderType];
      if (!points) {
        return code;
      }
      let processorOptions = null;
      for (let pointName in points) {
        let injectedCode = "";
        for (const plugin of this._activePlugins) {
          let customCode = (_b = plugin.getCustomCode(shaderType)) === null || _b === void 0 ? void 0 : _b[pointName];
          if (!customCode) {
            continue;
          }
          if (plugin.resolveIncludes) {
            if (processorOptions === null) {
              const shaderLanguage = ShaderLanguage.GLSL;
              processorOptions = {
                defines: [],
                indexParameters: eventData.indexParameters,
                isFragment: false,
                shouldUseHighPrecisionShader: this._engine._shouldUseHighPrecisionShader,
                processor: void 0,
                supportsUniformBuffers: this._engine.supportsUniformBuffers,
                shadersRepository: ShaderStore.GetShadersRepository(shaderLanguage),
                includesShadersStore: ShaderStore.GetIncludesShadersStore(shaderLanguage),
                version: void 0,
                platformName: this._engine.shaderPlatformName,
                processingContext: void 0,
                isNDCHalfZRange: this._engine.isNDCHalfZRange,
                useReverseDepthBuffer: this._engine.useReverseDepthBuffer,
                processCodeAfterIncludes: void 0
                // not used by _ProcessIncludes
              };
            }
            processorOptions.isFragment = shaderType === "fragment";
            ShaderProcessor._ProcessIncludes(customCode, processorOptions, (code2) => customCode = code2);
          }
          injectedCode += customCode + "\n";
        }
        if (injectedCode.length > 0) {
          if (pointName.charAt(0) === "!") {
            pointName = pointName.substring(1);
            let regexFlags = "g";
            if (pointName.charAt(0) === "!") {
              regexFlags = "";
              pointName = pointName.substring(1);
            } else {
              const matchOption = rxOption.exec(pointName);
              if (matchOption && matchOption.length >= 2) {
                regexFlags = matchOption[1];
                pointName = pointName.substring(regexFlags.length + 1);
              }
            }
            if (regexFlags.indexOf("g") < 0) {
              regexFlags += "g";
            }
            const sourceCode = code;
            const rx = new RegExp(pointName, regexFlags);
            let match = rx.exec(sourceCode);
            while (match !== null) {
              let newCode = injectedCode;
              for (let i = 0; i < match.length; ++i) {
                newCode = newCode.replace("$" + i, match[i]);
              }
              code = code.replace(match[0], newCode);
              match = rx.exec(sourceCode);
            }
          } else {
            const fullPointName = "#define " + pointName;
            code = code.replace(fullPointName, "\n" + injectedCode + "\n" + fullPointName);
          }
        }
      }
      return code;
    };
  }
};
MaterialPluginManager._MaterialPluginClassToMainDefine = {};
MaterialPluginManager._MaterialPluginCounter = 0;
(() => {
  EngineStore.OnEnginesDisposedObservable.add(() => {
    UnregisterAllMaterialPlugins();
  });
})();
var plugins = [];
var inited = false;
var observer = null;
function RegisterMaterialPlugin(pluginName, factory) {
  if (!inited) {
    observer = Material.OnEventObservable.add((material) => {
      for (const [, factory2] of plugins) {
        factory2(material);
      }
    }, MaterialPluginEvent.Created);
    inited = true;
  }
  const existing = plugins.filter(([name47, _factory]) => name47 === pluginName);
  if (existing.length > 0) {
    existing[0][1] = factory;
  } else {
    plugins.push([pluginName, factory]);
  }
}
function UnregisterMaterialPlugin(pluginName) {
  for (let i = 0; i < plugins.length; ++i) {
    if (plugins[i][0] === pluginName) {
      plugins.splice(i, 1);
      if (plugins.length === 0) {
        UnregisterAllMaterialPlugins();
      }
      return true;
    }
  }
  return false;
}
function UnregisterAllMaterialPlugins() {
  plugins.length = 0;
  inited = false;
  Material.OnEventObservable.remove(observer);
  observer = null;
}

// node_modules/@babylonjs/core/Materials/materialPluginBase.js
var MaterialPluginBase = class {
  _enable(enable) {
    if (enable) {
      this._pluginManager._activatePlugin(this);
    }
  }
  /**
   * Creates a new material plugin
   * @param material parent material of the plugin
   * @param name name of the plugin
   * @param priority priority of the plugin
   * @param defines list of defines used by the plugin. The value of the property is the default value for this property
   * @param addToPluginList true to add the plugin to the list of plugins managed by the material plugin manager of the material (default: true)
   * @param enable true to enable the plugin (it is handy if the plugin does not handle properties to switch its current activation)
   * @param resolveIncludes Indicates that any #include directive in the plugin code must be replaced by the corresponding code (default: false)
   */
  constructor(material, name47, priority, defines, addToPluginList = true, enable = false, resolveIncludes = false) {
    this.priority = 500;
    this.resolveIncludes = false;
    this.registerForExtraEvents = false;
    this._material = material;
    this.name = name47;
    this.priority = priority;
    this.resolveIncludes = resolveIncludes;
    if (!material.pluginManager) {
      material.pluginManager = new MaterialPluginManager(material);
      material.onDisposeObservable.add(() => {
        material.pluginManager = void 0;
      });
    }
    this._pluginDefineNames = defines;
    this._pluginManager = material.pluginManager;
    if (addToPluginList) {
      this._pluginManager._addPlugin(this);
    }
    if (enable) {
      this._enable(true);
    }
    this.markAllDefinesAsDirty = material._dirtyCallbacks[63];
  }
  /**
   * Gets the current class name useful for serialization or dynamic coding.
   * @returns The class name.
   */
  getClassName() {
    return "MaterialPluginBase";
  }
  /**
   * Specifies that the submesh is ready to be used.
   * @param defines the list of "defines" to update.
   * @param scene defines the scene the material belongs to.
   * @param engine the engine this scene belongs to.
   * @param subMesh the submesh to check for readiness
   * @returns - boolean indicating that the submesh is ready or not.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isReadyForSubMesh(defines, scene, engine, subMesh) {
    return true;
  }
  /**
   * Binds the material data (this function is called even if mustRebind() returns false)
   * @param uniformBuffer defines the Uniform buffer to fill in.
   * @param scene defines the scene the material belongs to.
   * @param engine defines the engine the material belongs to.
   * @param subMesh the submesh to bind data for
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hardBindForSubMesh(uniformBuffer, scene, engine, subMesh) {
  }
  /**
   * Binds the material data.
   * @param uniformBuffer defines the Uniform buffer to fill in.
   * @param scene defines the scene the material belongs to.
   * @param engine the engine this scene belongs to.
   * @param subMesh the submesh to bind data for
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bindForSubMesh(uniformBuffer, scene, engine, subMesh) {
  }
  /**
   * Disposes the resources of the material.
   * @param forceDisposeTextures - Forces the disposal of all textures.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispose(forceDisposeTextures) {
  }
  /**
   * Returns a list of custom shader code fragments to customize the shader.
   * @param shaderType "vertex" or "fragment"
   * @returns null if no code to be added, or a list of pointName =\> code.
   * Note that `pointName` can also be a regular expression if it starts with a `!`.
   * In that case, the string found by the regular expression (if any) will be
   * replaced by the code provided.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCustomCode(shaderType) {
    return null;
  }
  /**
   * Collects all defines.
   * @param defines The object to append to.
   */
  collectDefines(defines) {
    if (!this._pluginDefineNames) {
      return;
    }
    for (const key of Object.keys(this._pluginDefineNames)) {
      if (key[0] === "_") {
        continue;
      }
      const type = typeof this._pluginDefineNames[key];
      defines[key] = {
        type: type === "number" ? "number" : type === "string" ? "string" : type === "boolean" ? "boolean" : "object",
        default: this._pluginDefineNames[key]
      };
    }
  }
  /**
   * Sets the defines for the next rendering. Called before MaterialHelper.PrepareDefinesForAttributes is called.
   * @param defines the list of "defines" to update.
   * @param scene defines the scene to the material belongs to.
   * @param mesh the mesh being rendered
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepareDefinesBeforeAttributes(defines, scene, mesh) {
  }
  /**
   * Sets the defines for the next rendering
   * @param defines the list of "defines" to update.
   * @param scene defines the scene to the material belongs to.
   * @param mesh the mesh being rendered
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  prepareDefines(defines, scene, mesh) {
  }
  /**
   * Checks to see if a texture is used in the material.
   * @param texture - Base texture to use.
   * @returns - Boolean specifying if a texture is used in the material.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasTexture(texture) {
    return false;
  }
  /**
   * Gets a boolean indicating that current material needs to register RTT
   * @returns true if this uses a render target otherwise false.
   */
  hasRenderTargetTextures() {
    return false;
  }
  /**
   * Fills the list of render target textures.
   * @param renderTargets the list of render targets to update
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fillRenderTargetTextures(renderTargets) {
  }
  /**
   * Returns an array of the actively used textures.
   * @param activeTextures Array of BaseTextures
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getActiveTextures(activeTextures) {
  }
  /**
   * Returns the animatable textures.
   * @param animatables Array of animatable textures.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAnimatables(animatables) {
  }
  /**
   * Add fallbacks to the effect fallbacks list.
   * @param defines defines the Base texture to use.
   * @param fallbacks defines the current fallback list.
   * @param currentRank defines the current fallback rank.
   * @returns the new fallback rank.
   */
  addFallbacks(defines, fallbacks, currentRank) {
    return currentRank;
  }
  /**
   * Gets the samplers used by the plugin.
   * @param samplers list that the sampler names should be added to.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getSamplers(samplers) {
  }
  /**
   * Gets the attributes used by the plugin.
   * @param attributes list that the attribute names should be added to.
   * @param scene the scene that the material belongs to.
   * @param mesh the mesh being rendered.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getAttributes(attributes, scene, mesh) {
  }
  /**
   * Gets the uniform buffers names added by the plugin.
   * @param ubos list that the ubo names should be added to.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUniformBuffersNames(ubos) {
  }
  /**
   * Gets the description of the uniforms to add to the ubo (if engine supports ubos) or to inject directly in the vertex/fragment shaders (if engine does not support ubos)
   * @returns the description of the uniforms
   */
  getUniforms() {
    return {};
  }
  /**
   * Makes a duplicate of the current configuration into another one.
   * @param plugin define the config where to copy the info
   */
  copyTo(plugin) {
    SerializationHelper.Clone(() => plugin, this);
  }
  /**
   * Serializes this plugin configuration.
   * @returns - An object with the serialized config.
   */
  serialize() {
    return SerializationHelper.Serialize(this);
  }
  /**
   * Parses a plugin configuration from a serialized object.
   * @param source - Serialized object.
   * @param scene Defines the scene we are parsing for
   * @param rootUrl Defines the rootUrl to load from
   */
  parse(source, scene, rootUrl) {
    SerializationHelper.Parse(() => this, source, scene, rootUrl);
  }
};
__decorate([
  serialize()
], MaterialPluginBase.prototype, "name", void 0);
__decorate([
  serialize()
], MaterialPluginBase.prototype, "priority", void 0);
__decorate([
  serialize()
], MaterialPluginBase.prototype, "resolveIncludes", void 0);
__decorate([
  serialize()
], MaterialPluginBase.prototype, "registerForExtraEvents", void 0);

// node_modules/@babylonjs/core/Materials/material.detailMapConfiguration.js
var MaterialDetailMapDefines = class extends MaterialDefines {
  constructor() {
    super(...arguments);
    this.DETAIL = false;
    this.DETAILDIRECTUV = 0;
    this.DETAIL_NORMALBLENDMETHOD = 0;
  }
};
var DetailMapConfiguration = class extends MaterialPluginBase {
  /** @internal */
  _markAllSubMeshesAsTexturesDirty() {
    this._enable(this._isEnabled);
    this._internalMarkAllSubMeshesAsTexturesDirty();
  }
  constructor(material, addToPluginList = true) {
    super(material, "DetailMap", 140, new MaterialDetailMapDefines(), addToPluginList);
    this._texture = null;
    this.diffuseBlendLevel = 1;
    this.roughnessBlendLevel = 1;
    this.bumpLevel = 1;
    this._normalBlendMethod = Material.MATERIAL_NORMALBLENDMETHOD_WHITEOUT;
    this._isEnabled = false;
    this.isEnabled = false;
    this._internalMarkAllSubMeshesAsTexturesDirty = material._dirtyCallbacks[1];
  }
  isReadyForSubMesh(defines, scene, engine) {
    if (!this._isEnabled) {
      return true;
    }
    if (defines._areTexturesDirty && scene.texturesEnabled) {
      if (engine.getCaps().standardDerivatives && this._texture && MaterialFlags.DetailTextureEnabled) {
        if (!this._texture.isReady()) {
          return false;
        }
      }
    }
    return true;
  }
  prepareDefines(defines, scene) {
    if (this._isEnabled) {
      defines.DETAIL_NORMALBLENDMETHOD = this._normalBlendMethod;
      const engine = scene.getEngine();
      if (defines._areTexturesDirty) {
        if (engine.getCaps().standardDerivatives && this._texture && MaterialFlags.DetailTextureEnabled && this._isEnabled) {
          MaterialHelper.PrepareDefinesForMergedUV(this._texture, defines, "DETAIL");
          defines.DETAIL_NORMALBLENDMETHOD = this._normalBlendMethod;
        } else {
          defines.DETAIL = false;
        }
      }
    } else {
      defines.DETAIL = false;
    }
  }
  bindForSubMesh(uniformBuffer, scene) {
    if (!this._isEnabled) {
      return;
    }
    const isFrozen = this._material.isFrozen;
    if (!uniformBuffer.useUbo || !isFrozen || !uniformBuffer.isSync) {
      if (this._texture && MaterialFlags.DetailTextureEnabled) {
        uniformBuffer.updateFloat4("vDetailInfos", this._texture.coordinatesIndex, this.diffuseBlendLevel, this.bumpLevel, this.roughnessBlendLevel);
        MaterialHelper.BindTextureMatrix(this._texture, uniformBuffer, "detail");
      }
    }
    if (scene.texturesEnabled) {
      if (this._texture && MaterialFlags.DetailTextureEnabled) {
        uniformBuffer.setTexture("detailSampler", this._texture);
      }
    }
  }
  hasTexture(texture) {
    if (this._texture === texture) {
      return true;
    }
    return false;
  }
  getActiveTextures(activeTextures) {
    if (this._texture) {
      activeTextures.push(this._texture);
    }
  }
  getAnimatables(animatables) {
    if (this._texture && this._texture.animations && this._texture.animations.length > 0) {
      animatables.push(this._texture);
    }
  }
  dispose(forceDisposeTextures) {
    var _a;
    if (forceDisposeTextures) {
      (_a = this._texture) === null || _a === void 0 ? void 0 : _a.dispose();
    }
  }
  getClassName() {
    return "DetailMapConfiguration";
  }
  getSamplers(samplers) {
    samplers.push("detailSampler");
  }
  getUniforms() {
    return {
      ubo: [
        { name: "vDetailInfos", size: 4, type: "vec4" },
        { name: "detailMatrix", size: 16, type: "mat4" }
      ]
    };
  }
};
__decorate([
  serializeAsTexture("detailTexture"),
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], DetailMapConfiguration.prototype, "texture", void 0);
__decorate([
  serialize()
], DetailMapConfiguration.prototype, "diffuseBlendLevel", void 0);
__decorate([
  serialize()
], DetailMapConfiguration.prototype, "roughnessBlendLevel", void 0);
__decorate([
  serialize()
], DetailMapConfiguration.prototype, "bumpLevel", void 0);
__decorate([
  serialize(),
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], DetailMapConfiguration.prototype, "normalBlendMethod", void 0);
__decorate([
  serialize(),
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], DetailMapConfiguration.prototype, "isEnabled", void 0);

// node_modules/@babylonjs/core/Materials/prePassConfiguration.js
var PrePassConfiguration = class {
  constructor() {
    this.previousWorldMatrices = {};
    this.previousBones = {};
  }
  /**
   * Add the required uniforms to the current list.
   * @param uniforms defines the current uniform list.
   */
  static AddUniforms(uniforms) {
    uniforms.push("previousWorld", "previousViewProjection", "mPreviousBones");
  }
  /**
   * Add the required samplers to the current list.
   * @param samplers defines the current sampler list.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static AddSamplers(samplers) {
  }
  /**
   * Binds the material data.
   * @param effect defines the effect to update
   * @param scene defines the scene the material belongs to.
   * @param mesh The mesh
   * @param world World matrix of this mesh
   * @param isFrozen Is the material frozen
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  bindForSubMesh(effect, scene, mesh, world, isFrozen) {
    if (scene.prePassRenderer && scene.prePassRenderer.enabled && scene.prePassRenderer.currentRTisSceneRT) {
      if (scene.prePassRenderer.getIndex(2) !== -1) {
        if (!this.previousWorldMatrices[mesh.uniqueId]) {
          this.previousWorldMatrices[mesh.uniqueId] = world.clone();
        }
        if (!this.previousViewProjection) {
          this.previousViewProjection = scene.getTransformMatrix().clone();
          this.currentViewProjection = scene.getTransformMatrix().clone();
        }
        const engine = scene.getEngine();
        if (this.currentViewProjection.updateFlag !== scene.getTransformMatrix().updateFlag) {
          this._lastUpdateFrameId = engine.frameId;
          this.previousViewProjection.copyFrom(this.currentViewProjection);
          this.currentViewProjection.copyFrom(scene.getTransformMatrix());
        } else if (this._lastUpdateFrameId !== engine.frameId) {
          this._lastUpdateFrameId = engine.frameId;
          this.previousViewProjection.copyFrom(this.currentViewProjection);
        }
        effect.setMatrix("previousWorld", this.previousWorldMatrices[mesh.uniqueId]);
        effect.setMatrix("previousViewProjection", this.previousViewProjection);
        this.previousWorldMatrices[mesh.uniqueId] = world.clone();
      }
    }
  }
};

// node_modules/@babylonjs/core/Shaders/ShadersInclude/decalFragmentDeclaration.js
var name2 = "decalFragmentDeclaration";
var shader2 = `#ifdef DECAL
uniform vec4 vDecalInfos;
#endif
`;
ShaderStore.IncludesShadersStore[name2] = shader2;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/defaultFragmentDeclaration.js
var name3 = "defaultFragmentDeclaration";
var shader3 = `uniform vec4 vEyePosition;uniform vec4 vDiffuseColor;
#ifdef SPECULARTERM
uniform vec4 vSpecularColor;
#endif
uniform vec3 vEmissiveColor;uniform vec3 vAmbientColor;uniform float visibility;
#ifdef DIFFUSE
uniform vec2 vDiffuseInfos;
#endif
#ifdef AMBIENT
uniform vec2 vAmbientInfos;
#endif
#ifdef OPACITY 
uniform vec2 vOpacityInfos;
#endif
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;
#endif
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;
#endif
#ifdef BUMP
uniform vec3 vBumpInfos;uniform vec2 vTangentSpaceParams;
#endif
#ifdef ALPHATEST
uniform float alphaCutOff;
#endif
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION) || defined(PREPASS)
uniform mat4 view;
#endif
#ifdef REFRACTION
uniform vec4 vRefractionInfos;
#ifndef REFRACTIONMAP_3D
uniform mat4 refractionMatrix;
#endif
#ifdef REFRACTIONFRESNEL
uniform vec4 refractionLeftColor;uniform vec4 refractionRightColor;
#endif
#if defined(USE_LOCAL_REFRACTIONMAP_CUBIC) && defined(REFRACTIONMAP_3D)
uniform vec3 vRefractionPosition;uniform vec3 vRefractionSize; 
#endif
#endif
#if defined(SPECULAR) && defined(SPECULARTERM)
uniform vec2 vSpecularInfos;
#endif
#ifdef DIFFUSEFRESNEL
uniform vec4 diffuseLeftColor;uniform vec4 diffuseRightColor;
#endif
#ifdef OPACITYFRESNEL
uniform vec4 opacityParts;
#endif
#ifdef EMISSIVEFRESNEL
uniform vec4 emissiveLeftColor;uniform vec4 emissiveRightColor;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
#if defined(REFLECTIONMAP_PLANAR) || defined(REFLECTIONMAP_CUBIC) || defined(REFLECTIONMAP_PROJECTION) || defined(REFLECTIONMAP_EQUIRECTANGULAR) || defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_SKYBOX)
uniform mat4 reflectionMatrix;
#endif
#ifndef REFLECTIONMAP_SKYBOX
#if defined(USE_LOCAL_REFLECTIONMAP_CUBIC) && defined(REFLECTIONMAP_CUBIC)
uniform vec3 vReflectionPosition;uniform vec3 vReflectionSize; 
#endif
#endif
#ifdef REFLECTIONFRESNEL
uniform vec4 reflectionLeftColor;uniform vec4 reflectionRightColor;
#endif
#endif
#ifdef DETAIL
uniform vec4 vDetailInfos;
#endif
#include<decalFragmentDeclaration>
#define ADDITIONAL_FRAGMENT_DECLARATION
`;
ShaderStore.IncludesShadersStore[name3] = shader3;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/defaultUboDeclaration.js
var name4 = "defaultUboDeclaration";
var shader4 = `layout(std140,column_major) uniform;uniform Material
{vec4 diffuseLeftColor;vec4 diffuseRightColor;vec4 opacityParts;vec4 reflectionLeftColor;vec4 reflectionRightColor;vec4 refractionLeftColor;vec4 refractionRightColor;vec4 emissiveLeftColor;vec4 emissiveRightColor;vec2 vDiffuseInfos;vec2 vAmbientInfos;vec2 vOpacityInfos;vec2 vReflectionInfos;vec3 vReflectionPosition;vec3 vReflectionSize;vec2 vEmissiveInfos;vec2 vLightmapInfos;vec2 vSpecularInfos;vec3 vBumpInfos;mat4 diffuseMatrix;mat4 ambientMatrix;mat4 opacityMatrix;mat4 reflectionMatrix;mat4 emissiveMatrix;mat4 lightmapMatrix;mat4 specularMatrix;mat4 bumpMatrix;vec2 vTangentSpaceParams;float pointSize;float alphaCutOff;mat4 refractionMatrix;vec4 vRefractionInfos;vec3 vRefractionPosition;vec3 vRefractionSize;vec4 vSpecularColor;vec3 vEmissiveColor;vec4 vDiffuseColor;vec3 vAmbientColor;
#define ADDITIONAL_UBO_DECLARATION
};
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`;
ShaderStore.IncludesShadersStore[name4] = shader4;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/prePassDeclaration.js
var name5 = "prePassDeclaration";
var shader5 = `#ifdef PREPASS
#extension GL_EXT_draw_buffers : require
layout(location=0) out highp vec4 glFragData[{X}];highp vec4 gl_FragColor;
#ifdef PREPASS_DEPTH
varying highp vec3 vViewPos;
#endif
#ifdef PREPASS_VELOCITY
varying highp vec4 vCurrentPosition;varying highp vec4 vPreviousPosition;
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name5] = shader5;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/oitDeclaration.js
var name6 = "oitDeclaration";
var shader6 = `#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#extension GL_EXT_draw_buffers : require
layout(location=0) out vec2 depth; 
layout(location=1) out vec4 frontColor;layout(location=2) out vec4 backColor;
#define MAX_DEPTH 99999.0
highp vec4 gl_FragColor;uniform sampler2D oitDepthSampler;uniform sampler2D oitFrontColorSampler;
#endif
`;
ShaderStore.IncludesShadersStore[name6] = shader6;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/mainUVVaryingDeclaration.js
var name7 = "mainUVVaryingDeclaration";
var shader7 = `#ifdef MAINUV{X}
varying vec2 vMainUV{X};
#endif
`;
ShaderStore.IncludesShadersStore[name7] = shader7;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/lightFragmentDeclaration.js
var name8 = "lightFragmentDeclaration";
var shader8 = `#ifdef LIGHT{X}
uniform vec4 vLightData{X};uniform vec4 vLightDiffuse{X};
#ifdef SPECULARTERM
uniform vec4 vLightSpecular{X};
#else
vec4 vLightSpecular{X}=vec4(0.);
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];uniform float viewFrustumZ{X}[SHADOWCSMNUM_CASCADES{X}];uniform float frustumLengths{X}[SHADOWCSMNUM_CASCADES{X}];uniform float cascadeBlendFactor{X};varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};
#if defined(SHADOWPCSS{X})
uniform highp sampler2DArrayShadow shadowSampler{X};uniform highp sampler2DArray depthSampler{X};uniform vec2 lightSizeUVCorrection{X}[SHADOWCSMNUM_CASCADES{X}];uniform float depthCorrection{X}[SHADOWCSMNUM_CASCADES{X}];uniform float penumbraDarkness{X};
#elif defined(SHADOWPCF{X})
uniform highp sampler2DArrayShadow shadowSampler{X};
#else
uniform highp sampler2DArray shadowSampler{X};
#endif
#ifdef SHADOWCSMDEBUG{X}
const vec3 vCascadeColorsMultiplier{X}[8]=vec3[8]
(
vec3 ( 1.5,0.0,0.0 ),
vec3 ( 0.0,1.5,0.0 ),
vec3 ( 0.0,0.0,5.5 ),
vec3 ( 1.5,0.0,5.5 ),
vec3 ( 1.5,1.5,0.0 ),
vec3 ( 1.0,1.0,1.0 ),
vec3 ( 0.0,1.0,5.5 ),
vec3 ( 0.5,3.5,0.75 )
);vec3 shadowDebug{X};
#endif
#ifdef SHADOWCSMUSESHADOWMAXZ{X}
int index{X}=-1;
#else
int index{X}=SHADOWCSMNUM_CASCADES{X}-1;
#endif
float diff{X}=0.;
#elif defined(SHADOWCUBE{X})
uniform samplerCube shadowSampler{X};
#else
varying vec4 vPositionFromLight{X};varying float vDepthMetric{X};
#if defined(SHADOWPCSS{X})
uniform highp sampler2DShadow shadowSampler{X};uniform highp sampler2D depthSampler{X};
#elif defined(SHADOWPCF{X})
uniform highp sampler2DShadow shadowSampler{X};
#else
uniform sampler2D shadowSampler{X};
#endif
uniform mat4 lightMatrix{X};
#endif
uniform vec4 shadowsInfo{X};uniform vec2 depthValues{X};
#endif
#ifdef SPOTLIGHT{X}
uniform vec4 vLightDirection{X};uniform vec4 vLightFalloff{X};
#elif defined(POINTLIGHT{X})
uniform vec4 vLightFalloff{X};
#elif defined(HEMILIGHT{X})
uniform vec3 vLightGround{X};
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
uniform mat4 textureProjectionMatrix{X};uniform sampler2D projectionLightSampler{X};
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name8] = shader8;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/lightUboDeclaration.js
var name9 = "lightUboDeclaration";
var shader9 = `#ifdef LIGHT{X}
uniform Light{X}
{vec4 vLightData;vec4 vLightDiffuse;vec4 vLightSpecular;
#ifdef SPOTLIGHT{X}
vec4 vLightDirection;vec4 vLightFalloff;
#elif defined(POINTLIGHT{X})
vec4 vLightFalloff;
#elif defined(HEMILIGHT{X})
vec3 vLightGround;
#endif
vec4 shadowsInfo;vec2 depthValues;} light{X};
#ifdef PROJECTEDLIGHTTEXTURE{X}
uniform mat4 textureProjectionMatrix{X};uniform sampler2D projectionLightSampler{X};
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];uniform float viewFrustumZ{X}[SHADOWCSMNUM_CASCADES{X}];uniform float frustumLengths{X}[SHADOWCSMNUM_CASCADES{X}];uniform float cascadeBlendFactor{X};varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};
#if defined(SHADOWPCSS{X})
uniform highp sampler2DArrayShadow shadowSampler{X};uniform highp sampler2DArray depthSampler{X};uniform vec2 lightSizeUVCorrection{X}[SHADOWCSMNUM_CASCADES{X}];uniform float depthCorrection{X}[SHADOWCSMNUM_CASCADES{X}];uniform float penumbraDarkness{X};
#elif defined(SHADOWPCF{X})
uniform highp sampler2DArrayShadow shadowSampler{X};
#else
uniform highp sampler2DArray shadowSampler{X};
#endif
#ifdef SHADOWCSMDEBUG{X}
const vec3 vCascadeColorsMultiplier{X}[8]=vec3[8]
(
vec3 ( 1.5,0.0,0.0 ),
vec3 ( 0.0,1.5,0.0 ),
vec3 ( 0.0,0.0,5.5 ),
vec3 ( 1.5,0.0,5.5 ),
vec3 ( 1.5,1.5,0.0 ),
vec3 ( 1.0,1.0,1.0 ),
vec3 ( 0.0,1.0,5.5 ),
vec3 ( 0.5,3.5,0.75 )
);vec3 shadowDebug{X};
#endif
#ifdef SHADOWCSMUSESHADOWMAXZ{X}
int index{X}=-1;
#else
int index{X}=SHADOWCSMNUM_CASCADES{X}-1;
#endif
float diff{X}=0.;
#elif defined(SHADOWCUBE{X})
uniform samplerCube shadowSampler{X}; 
#else
varying vec4 vPositionFromLight{X};varying float vDepthMetric{X};
#if defined(SHADOWPCSS{X})
uniform highp sampler2DShadow shadowSampler{X};uniform highp sampler2D depthSampler{X};
#elif defined(SHADOWPCF{X})
uniform highp sampler2DShadow shadowSampler{X};
#else
uniform sampler2D shadowSampler{X};
#endif
uniform mat4 lightMatrix{X};
#endif
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name9] = shader9;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/lightsFragmentFunctions.js
var name10 = "lightsFragmentFunctions";
var shader10 = `struct lightingInfo
{vec3 diffuse;
#ifdef SPECULARTERM
vec3 specular;
#endif
#ifdef NDOTL
float ndl;
#endif
};lightingInfo computeLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {lightingInfo result;vec3 lightVectorW;float attenuation=1.0;if (lightData.w==0.)
{vec3 direction=lightData.xyz-vPositionW;attenuation=max(0.,1.0-length(direction)/range);lightVectorW=normalize(direction);}
else
{lightVectorW=normalize(-lightData.xyz);}
float ndl=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
vec3 angleW=normalize(viewDirectionW+lightVectorW);float specComp=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
lightingInfo computeSpotLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec4 lightDirection,vec3 diffuseColor,vec3 specularColor,float range,float glossiness) {lightingInfo result;vec3 direction=lightData.xyz-vPositionW;vec3 lightVectorW=normalize(direction);float attenuation=max(0.,1.0-length(direction)/range);float cosAngle=max(0.,dot(lightDirection.xyz,-lightVectorW));if (cosAngle>=lightDirection.w)
{cosAngle=max(0.,pow(cosAngle,lightData.w));attenuation*=cosAngle;float ndl=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
vec3 angleW=normalize(viewDirectionW+lightVectorW);float specComp=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
result.diffuse=vec3(0.);
#ifdef SPECULARTERM
result.specular=vec3(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
lightingInfo computeHemisphericLighting(vec3 viewDirectionW,vec3 vNormal,vec4 lightData,vec3 diffuseColor,vec3 specularColor,vec3 groundColor,float glossiness) {lightingInfo result;float ndl=dot(vNormal,lightData.xyz)*0.5+0.5;
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=mix(groundColor,diffuseColor,ndl);
#ifdef SPECULARTERM
vec3 angleW=normalize(viewDirectionW+lightData.xyz);float specComp=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor;
#endif
return result;}
#define inline
vec3 computeProjectionTextureDiffuseLighting(sampler2D projectionLightSampler,mat4 textureProjectionMatrix){vec4 strq=textureProjectionMatrix*vec4(vPositionW,1.0);strq/=strq.w;vec3 textureColor=texture2D(projectionLightSampler,strq.xy).rgb;return textureColor;}`;
ShaderStore.IncludesShadersStore[name10] = shader10;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowsFragmentFunctions.js
var name11 = "shadowsFragmentFunctions";
var shader11 = `#ifdef SHADOWS
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define TEXTUREFUNC(s,c,l) texture2DLodEXT(s,c,l)
#else
#define TEXTUREFUNC(s,c,b) texture2D(s,c,b)
#endif
#ifndef SHADOWFLOAT
float unpack(vec4 color)
{const vec4 bit_shift=vec4(1.0/(255.0*255.0*255.0),1.0/(255.0*255.0),1.0/255.0,1.0);return dot(color,bit_shift);}
#endif
float computeFallOff(float value,vec2 clipSpace,float frustumEdgeFalloff)
{float mask=smoothstep(1.0-frustumEdgeFalloff,1.00000012,clamp(dot(clipSpace,clipSpace),0.,1.));return mix(value,1.0,mask);}
#define inline
float computeShadowCube(vec3 worldPos,vec3 lightPosition,samplerCube shadowSampler,float darkness,vec2 depthValues)
{vec3 directionToLight=worldPos-lightPosition;float depth=length(directionToLight);depth=(depth+depthValues.x)/(depthValues.y);depth=clamp(depth,0.,1.0);directionToLight=normalize(directionToLight);directionToLight.y=-directionToLight.y;
#ifndef SHADOWFLOAT
float shadow=unpack(textureCube(shadowSampler,directionToLight));
#else
float shadow=textureCube(shadowSampler,directionToLight).x;
#endif
return depth>shadow ? darkness : 1.0;}
#define inline
float computeShadowWithPoissonSamplingCube(vec3 worldPos,vec3 lightPosition,samplerCube shadowSampler,float mapSize,float darkness,vec2 depthValues)
{vec3 directionToLight=worldPos-lightPosition;float depth=length(directionToLight);depth=(depth+depthValues.x)/(depthValues.y);depth=clamp(depth,0.,1.0);directionToLight=normalize(directionToLight);directionToLight.y=-directionToLight.y;float visibility=1.;vec3 poissonDisk[4];poissonDisk[0]=vec3(-1.0,1.0,-1.0);poissonDisk[1]=vec3(1.0,-1.0,-1.0);poissonDisk[2]=vec3(-1.0,-1.0,-1.0);poissonDisk[3]=vec3(1.0,-1.0,1.0);
#ifndef SHADOWFLOAT
if (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[0]*mapSize))<depth) visibility-=0.25;if (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[1]*mapSize))<depth) visibility-=0.25;if (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[2]*mapSize))<depth) visibility-=0.25;if (unpack(textureCube(shadowSampler,directionToLight+poissonDisk[3]*mapSize))<depth) visibility-=0.25;
#else
if (textureCube(shadowSampler,directionToLight+poissonDisk[0]*mapSize).x<depth) visibility-=0.25;if (textureCube(shadowSampler,directionToLight+poissonDisk[1]*mapSize).x<depth) visibility-=0.25;if (textureCube(shadowSampler,directionToLight+poissonDisk[2]*mapSize).x<depth) visibility-=0.25;if (textureCube(shadowSampler,directionToLight+poissonDisk[3]*mapSize).x<depth) visibility-=0.25;
#endif
return min(1.0,visibility+darkness);}
#define inline
float computeShadowWithESMCube(vec3 worldPos,vec3 lightPosition,samplerCube shadowSampler,float darkness,float depthScale,vec2 depthValues)
{vec3 directionToLight=worldPos-lightPosition;float depth=length(directionToLight);depth=(depth+depthValues.x)/(depthValues.y);float shadowPixelDepth=clamp(depth,0.,1.0);directionToLight=normalize(directionToLight);directionToLight.y=-directionToLight.y;
#ifndef SHADOWFLOAT
float shadowMapSample=unpack(textureCube(shadowSampler,directionToLight));
#else
float shadowMapSample=textureCube(shadowSampler,directionToLight).x;
#endif
float esm=1.0-clamp(exp(min(87.,depthScale*shadowPixelDepth))*shadowMapSample,0.,1.-darkness);return esm;}
#define inline
float computeShadowWithCloseESMCube(vec3 worldPos,vec3 lightPosition,samplerCube shadowSampler,float darkness,float depthScale,vec2 depthValues)
{vec3 directionToLight=worldPos-lightPosition;float depth=length(directionToLight);depth=(depth+depthValues.x)/(depthValues.y);float shadowPixelDepth=clamp(depth,0.,1.0);directionToLight=normalize(directionToLight);directionToLight.y=-directionToLight.y;
#ifndef SHADOWFLOAT
float shadowMapSample=unpack(textureCube(shadowSampler,directionToLight));
#else
float shadowMapSample=textureCube(shadowSampler,directionToLight).x;
#endif
float esm=clamp(exp(min(87.,-depthScale*(shadowPixelDepth-shadowMapSample))),darkness,1.);return esm;}
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define inline
float computeShadowCSM(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray shadowSampler,float darkness,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec2 uv=0.5*clipSpace.xy+vec2(0.5);vec3 uvLayer=vec3(uv.x,uv.y,layer);float shadowPixelDepth=clamp(depthMetric,0.,1.0);
#ifndef SHADOWFLOAT
float shadow=unpack(texture2D(shadowSampler,uvLayer));
#else
float shadow=texture2D(shadowSampler,uvLayer).x;
#endif
return shadowPixelDepth>shadow ? computeFallOff(darkness,clipSpace.xy,frustumEdgeFalloff) : 1.;}
#endif
#define inline
float computeShadow(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float darkness,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec2 uv=0.5*clipSpace.xy+vec2(0.5);if (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)
{return 1.0;}
else
{float shadowPixelDepth=clamp(depthMetric,0.,1.0);
#ifndef SHADOWFLOAT
float shadow=unpack(TEXTUREFUNC(shadowSampler,uv,0.));
#else
float shadow=TEXTUREFUNC(shadowSampler,uv,0.).x;
#endif
return shadowPixelDepth>shadow ? computeFallOff(darkness,clipSpace.xy,frustumEdgeFalloff) : 1.;}}
#define inline
float computeShadowWithPoissonSampling(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float mapSize,float darkness,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec2 uv=0.5*clipSpace.xy+vec2(0.5);if (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)
{return 1.0;}
else
{float shadowPixelDepth=clamp(depthMetric,0.,1.0);float visibility=1.;vec2 poissonDisk[4];poissonDisk[0]=vec2(-0.94201624,-0.39906216);poissonDisk[1]=vec2(0.94558609,-0.76890725);poissonDisk[2]=vec2(-0.094184101,-0.92938870);poissonDisk[3]=vec2(0.34495938,0.29387760);
#ifndef SHADOWFLOAT
if (unpack(TEXTUREFUNC(shadowSampler,uv+poissonDisk[0]*mapSize,0.))<shadowPixelDepth) visibility-=0.25;if (unpack(TEXTUREFUNC(shadowSampler,uv+poissonDisk[1]*mapSize,0.))<shadowPixelDepth) visibility-=0.25;if (unpack(TEXTUREFUNC(shadowSampler,uv+poissonDisk[2]*mapSize,0.))<shadowPixelDepth) visibility-=0.25;if (unpack(TEXTUREFUNC(shadowSampler,uv+poissonDisk[3]*mapSize,0.))<shadowPixelDepth) visibility-=0.25;
#else
if (TEXTUREFUNC(shadowSampler,uv+poissonDisk[0]*mapSize,0.).x<shadowPixelDepth) visibility-=0.25;if (TEXTUREFUNC(shadowSampler,uv+poissonDisk[1]*mapSize,0.).x<shadowPixelDepth) visibility-=0.25;if (TEXTUREFUNC(shadowSampler,uv+poissonDisk[2]*mapSize,0.).x<shadowPixelDepth) visibility-=0.25;if (TEXTUREFUNC(shadowSampler,uv+poissonDisk[3]*mapSize,0.).x<shadowPixelDepth) visibility-=0.25;
#endif
return computeFallOff(min(1.0,visibility+darkness),clipSpace.xy,frustumEdgeFalloff);}}
#define inline
float computeShadowWithESM(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float darkness,float depthScale,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec2 uv=0.5*clipSpace.xy+vec2(0.5);if (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)
{return 1.0;}
else
{float shadowPixelDepth=clamp(depthMetric,0.,1.0);
#ifndef SHADOWFLOAT
float shadowMapSample=unpack(TEXTUREFUNC(shadowSampler,uv,0.));
#else
float shadowMapSample=TEXTUREFUNC(shadowSampler,uv,0.).x;
#endif
float esm=1.0-clamp(exp(min(87.,depthScale*shadowPixelDepth))*shadowMapSample,0.,1.-darkness);return computeFallOff(esm,clipSpace.xy,frustumEdgeFalloff);}}
#define inline
float computeShadowWithCloseESM(vec4 vPositionFromLight,float depthMetric,sampler2D shadowSampler,float darkness,float depthScale,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec2 uv=0.5*clipSpace.xy+vec2(0.5);if (uv.x<0. || uv.x>1.0 || uv.y<0. || uv.y>1.0)
{return 1.0;}
else
{float shadowPixelDepth=clamp(depthMetric,0.,1.0); 
#ifndef SHADOWFLOAT
float shadowMapSample=unpack(TEXTUREFUNC(shadowSampler,uv,0.));
#else
float shadowMapSample=TEXTUREFUNC(shadowSampler,uv,0.).x;
#endif
float esm=clamp(exp(min(87.,-depthScale*(shadowPixelDepth-shadowMapSample))),darkness,1.);return computeFallOff(esm,clipSpace.xy,frustumEdgeFalloff);}}
#ifdef IS_NDC_HALF_ZRANGE
#define ZINCLIP clipSpace.z
#else
#define ZINCLIP uvDepth.z
#endif
#if defined(WEBGL2) || defined(WEBGPU) || defined(NATIVE)
#define GREATEST_LESS_THAN_ONE 0.99999994
/* disable_uniformity_analysis */
#define inline
float computeShadowWithCSMPCF1(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArrayShadow shadowSampler,float darkness,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=clamp(ZINCLIP,0.,GREATEST_LESS_THAN_ONE);vec4 uvDepthLayer=vec4(uvDepth.x,uvDepth.y,layer,uvDepth.z);float shadow=texture2D(shadowSampler,uvDepthLayer);shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}
#define inline
float computeShadowWithCSMPCF3(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArrayShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=clamp(ZINCLIP,0.,GREATEST_LESS_THAN_ONE);vec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x; 
uv+=0.5; 
vec2 st=fract(uv); 
vec2 base_uv=floor(uv)-0.5; 
base_uv*=shadowMapSizeAndInverse.y; 
vec2 uvw0=3.-2.*st;vec2 uvw1=1.+2.*st;vec2 u=vec2((2.-st.x)/uvw0.x-1.,st.x/uvw1.x+1.)*shadowMapSizeAndInverse.y;vec2 v=vec2((2.-st.y)/uvw0.y-1.,st.y/uvw1.y+1.)*shadowMapSizeAndInverse.y;float shadow=0.;shadow+=uvw0.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[0]),layer,uvDepth.z));shadow+=uvw1.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[0]),layer,uvDepth.z));shadow+=uvw0.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[1]),layer,uvDepth.z));shadow+=uvw1.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[1]),layer,uvDepth.z));shadow=shadow/16.;shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}
#define inline
float computeShadowWithCSMPCF5(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArrayShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=clamp(ZINCLIP,0.,GREATEST_LESS_THAN_ONE);vec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x; 
uv+=0.5; 
vec2 st=fract(uv); 
vec2 base_uv=floor(uv)-0.5; 
base_uv*=shadowMapSizeAndInverse.y; 
vec2 uvw0=4.-3.*st;vec2 uvw1=vec2(7.);vec2 uvw2=1.+3.*st;vec3 u=vec3((3.-2.*st.x)/uvw0.x-2.,(3.+st.x)/uvw1.x,st.x/uvw2.x+2.)*shadowMapSizeAndInverse.y;vec3 v=vec3((3.-2.*st.y)/uvw0.y-2.,(3.+st.y)/uvw1.y,st.y/uvw2.y+2.)*shadowMapSizeAndInverse.y;float shadow=0.;shadow+=uvw0.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[0]),layer,uvDepth.z));shadow+=uvw1.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[0]),layer,uvDepth.z));shadow+=uvw2.x*uvw0.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[2],v[0]),layer,uvDepth.z));shadow+=uvw0.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[1]),layer,uvDepth.z));shadow+=uvw1.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[1]),layer,uvDepth.z));shadow+=uvw2.x*uvw1.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[2],v[1]),layer,uvDepth.z));shadow+=uvw0.x*uvw2.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[0],v[2]),layer,uvDepth.z));shadow+=uvw1.x*uvw2.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[1],v[2]),layer,uvDepth.z));shadow+=uvw2.x*uvw2.y*texture2D(shadowSampler,vec4(base_uv.xy+vec2(u[2],v[2]),layer,uvDepth.z));shadow=shadow/144.;shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}
#define inline
float computeShadowWithPCF1(vec4 vPositionFromLight,float depthMetric,highp sampler2DShadow shadowSampler,float darkness,float frustumEdgeFalloff)
{if (depthMetric>1.0 || depthMetric<0.0) {return 1.0;}
else
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=ZINCLIP;float shadow=TEXTUREFUNC(shadowSampler,uvDepth,0.);shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}}
#define inline
float computeShadowWithPCF3(vec4 vPositionFromLight,float depthMetric,highp sampler2DShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)
{if (depthMetric>1.0 || depthMetric<0.0) {return 1.0;}
else
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=ZINCLIP;vec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x; 
uv+=0.5; 
vec2 st=fract(uv); 
vec2 base_uv=floor(uv)-0.5; 
base_uv*=shadowMapSizeAndInverse.y; 
vec2 uvw0=3.-2.*st;vec2 uvw1=1.+2.*st;vec2 u=vec2((2.-st.x)/uvw0.x-1.,st.x/uvw1.x+1.)*shadowMapSizeAndInverse.y;vec2 v=vec2((2.-st.y)/uvw0.y-1.,st.y/uvw1.y+1.)*shadowMapSizeAndInverse.y;float shadow=0.;shadow+=uvw0.x*uvw0.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[0]),uvDepth.z),0.);shadow+=uvw1.x*uvw0.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[0]),uvDepth.z),0.);shadow+=uvw0.x*uvw1.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[1]),uvDepth.z),0.);shadow+=uvw1.x*uvw1.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[1]),uvDepth.z),0.);shadow=shadow/16.;shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}}
#define inline
float computeShadowWithPCF5(vec4 vPositionFromLight,float depthMetric,highp sampler2DShadow shadowSampler,vec2 shadowMapSizeAndInverse,float darkness,float frustumEdgeFalloff)
{if (depthMetric>1.0 || depthMetric<0.0) {return 1.0;}
else
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=ZINCLIP;vec2 uv=uvDepth.xy*shadowMapSizeAndInverse.x; 
uv+=0.5; 
vec2 st=fract(uv); 
vec2 base_uv=floor(uv)-0.5; 
base_uv*=shadowMapSizeAndInverse.y; 
vec2 uvw0=4.-3.*st;vec2 uvw1=vec2(7.);vec2 uvw2=1.+3.*st;vec3 u=vec3((3.-2.*st.x)/uvw0.x-2.,(3.+st.x)/uvw1.x,st.x/uvw2.x+2.)*shadowMapSizeAndInverse.y;vec3 v=vec3((3.-2.*st.y)/uvw0.y-2.,(3.+st.y)/uvw1.y,st.y/uvw2.y+2.)*shadowMapSizeAndInverse.y;float shadow=0.;shadow+=uvw0.x*uvw0.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[0]),uvDepth.z),0.);shadow+=uvw1.x*uvw0.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[0]),uvDepth.z),0.);shadow+=uvw2.x*uvw0.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[2],v[0]),uvDepth.z),0.);shadow+=uvw0.x*uvw1.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[1]),uvDepth.z),0.);shadow+=uvw1.x*uvw1.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[1]),uvDepth.z),0.);shadow+=uvw2.x*uvw1.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[2],v[1]),uvDepth.z),0.);shadow+=uvw0.x*uvw2.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[0],v[2]),uvDepth.z),0.);shadow+=uvw1.x*uvw2.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[1],v[2]),uvDepth.z),0.);shadow+=uvw2.x*uvw2.y*TEXTUREFUNC(shadowSampler,vec3(base_uv.xy+vec2(u[2],v[2]),uvDepth.z),0.);shadow=shadow/144.;shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}}
const vec3 PoissonSamplers32[64]=vec3[64](
vec3(0.06407013,0.05409927,0.),
vec3(0.7366577,0.5789394,0.),
vec3(-0.6270542,-0.5320278,0.),
vec3(-0.4096107,0.8411095,0.),
vec3(0.6849564,-0.4990818,0.),
vec3(-0.874181,-0.04579735,0.),
vec3(0.9989998,0.0009880066,0.),
vec3(-0.004920578,-0.9151649,0.),
vec3(0.1805763,0.9747483,0.),
vec3(-0.2138451,0.2635818,0.),
vec3(0.109845,0.3884785,0.),
vec3(0.06876755,-0.3581074,0.),
vec3(0.374073,-0.7661266,0.),
vec3(0.3079132,-0.1216763,0.),
vec3(-0.3794335,-0.8271583,0.),
vec3(-0.203878,-0.07715034,0.),
vec3(0.5912697,0.1469799,0.),
vec3(-0.88069,0.3031784,0.),
vec3(0.5040108,0.8283722,0.),
vec3(-0.5844124,0.5494877,0.),
vec3(0.6017799,-0.1726654,0.),
vec3(-0.5554981,0.1559997,0.),
vec3(-0.3016369,-0.3900928,0.),
vec3(-0.5550632,-0.1723762,0.),
vec3(0.925029,0.2995041,0.),
vec3(-0.2473137,0.5538505,0.),
vec3(0.9183037,-0.2862392,0.),
vec3(0.2469421,0.6718712,0.),
vec3(0.3916397,-0.4328209,0.),
vec3(-0.03576927,-0.6220032,0.),
vec3(-0.04661255,0.7995201,0.),
vec3(0.4402924,0.3640312,0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.),
vec3(0.)
);const vec3 PoissonSamplers64[64]=vec3[64](
vec3(-0.613392,0.617481,0.),
vec3(0.170019,-0.040254,0.),
vec3(-0.299417,0.791925,0.),
vec3(0.645680,0.493210,0.),
vec3(-0.651784,0.717887,0.),
vec3(0.421003,0.027070,0.),
vec3(-0.817194,-0.271096,0.),
vec3(-0.705374,-0.668203,0.),
vec3(0.977050,-0.108615,0.),
vec3(0.063326,0.142369,0.),
vec3(0.203528,0.214331,0.),
vec3(-0.667531,0.326090,0.),
vec3(-0.098422,-0.295755,0.),
vec3(-0.885922,0.215369,0.),
vec3(0.566637,0.605213,0.),
vec3(0.039766,-0.396100,0.),
vec3(0.751946,0.453352,0.),
vec3(0.078707,-0.715323,0.),
vec3(-0.075838,-0.529344,0.),
vec3(0.724479,-0.580798,0.),
vec3(0.222999,-0.215125,0.),
vec3(-0.467574,-0.405438,0.),
vec3(-0.248268,-0.814753,0.),
vec3(0.354411,-0.887570,0.),
vec3(0.175817,0.382366,0.),
vec3(0.487472,-0.063082,0.),
vec3(-0.084078,0.898312,0.),
vec3(0.488876,-0.783441,0.),
vec3(0.470016,0.217933,0.),
vec3(-0.696890,-0.549791,0.),
vec3(-0.149693,0.605762,0.),
vec3(0.034211,0.979980,0.),
vec3(0.503098,-0.308878,0.),
vec3(-0.016205,-0.872921,0.),
vec3(0.385784,-0.393902,0.),
vec3(-0.146886,-0.859249,0.),
vec3(0.643361,0.164098,0.),
vec3(0.634388,-0.049471,0.),
vec3(-0.688894,0.007843,0.),
vec3(0.464034,-0.188818,0.),
vec3(-0.440840,0.137486,0.),
vec3(0.364483,0.511704,0.),
vec3(0.034028,0.325968,0.),
vec3(0.099094,-0.308023,0.),
vec3(0.693960,-0.366253,0.),
vec3(0.678884,-0.204688,0.),
vec3(0.001801,0.780328,0.),
vec3(0.145177,-0.898984,0.),
vec3(0.062655,-0.611866,0.),
vec3(0.315226,-0.604297,0.),
vec3(-0.780145,0.486251,0.),
vec3(-0.371868,0.882138,0.),
vec3(0.200476,0.494430,0.),
vec3(-0.494552,-0.711051,0.),
vec3(0.612476,0.705252,0.),
vec3(-0.578845,-0.768792,0.),
vec3(-0.772454,-0.090976,0.),
vec3(0.504440,0.372295,0.),
vec3(0.155736,0.065157,0.),
vec3(0.391522,0.849605,0.),
vec3(-0.620106,-0.328104,0.),
vec3(0.789239,-0.419965,0.),
vec3(-0.545396,0.538133,0.),
vec3(-0.178564,-0.596057,0.)
);
#define inline
float computeShadowWithCSMPCSS(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,int searchTapCount,int pcfTapCount,vec3[64] poissonSamplers,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=clamp(ZINCLIP,0.,GREATEST_LESS_THAN_ONE);vec4 uvDepthLayer=vec4(uvDepth.x,uvDepth.y,layer,uvDepth.z);float blockerDepth=0.0;float sumBlockerDepth=0.0;float numBlocker=0.0;for (int i=0; i<searchTapCount; i ++) {blockerDepth=texture2D(depthSampler,vec3(uvDepth.xy+(lightSizeUV*lightSizeUVCorrection*shadowMapSizeInverse*PoissonSamplers32[i].xy),layer)).r;if (blockerDepth<depthMetric) {sumBlockerDepth+=blockerDepth;numBlocker++;}}
float avgBlockerDepth=sumBlockerDepth/numBlocker;float AAOffset=shadowMapSizeInverse*10.;float penumbraRatio=((depthMetric-avgBlockerDepth)*depthCorrection+AAOffset);vec4 filterRadius=vec4(penumbraRatio*lightSizeUV*lightSizeUVCorrection*shadowMapSizeInverse,0.,0.);float random=getRand(vPositionFromLight.xy);float rotationAngle=random*3.1415926;vec2 rotationVector=vec2(cos(rotationAngle),sin(rotationAngle));float shadow=0.;for (int i=0; i<pcfTapCount; i++) {vec4 offset=vec4(poissonSamplers[i],0.);offset=vec4(offset.x*rotationVector.x-offset.y*rotationVector.y,offset.y*rotationVector.x+offset.x*rotationVector.y,0.,0.);shadow+=texture2D(shadowSampler,uvDepthLayer+offset*filterRadius);}
shadow/=float(pcfTapCount);shadow=mix(shadow,1.,min((depthMetric-avgBlockerDepth)*depthCorrection*penumbraDarkness,1.));shadow=mix(darkness,1.,shadow);if (numBlocker<1.0) {return 1.0;}
else
{return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}}
#define inline
float computeShadowWithPCSS(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,highp sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,int searchTapCount,int pcfTapCount,vec3[64] poissonSamplers)
{if (depthMetric>1.0 || depthMetric<0.0) {return 1.0;}
else
{vec3 clipSpace=vPositionFromLight.xyz/vPositionFromLight.w;vec3 uvDepth=vec3(0.5*clipSpace.xyz+vec3(0.5));uvDepth.z=ZINCLIP;float blockerDepth=0.0;float sumBlockerDepth=0.0;float numBlocker=0.0;for (int i=0; i<searchTapCount; i ++) {blockerDepth=TEXTUREFUNC(depthSampler,uvDepth.xy+(lightSizeUV*shadowMapSizeInverse*PoissonSamplers32[i].xy),0.).r;if (blockerDepth<depthMetric) {sumBlockerDepth+=blockerDepth;numBlocker++;}}
if (numBlocker<1.0) {return 1.0;}
else
{float avgBlockerDepth=sumBlockerDepth/numBlocker;float AAOffset=shadowMapSizeInverse*10.;float penumbraRatio=((depthMetric-avgBlockerDepth)+AAOffset);float filterRadius=penumbraRatio*lightSizeUV*shadowMapSizeInverse;float random=getRand(vPositionFromLight.xy);float rotationAngle=random*3.1415926;vec2 rotationVector=vec2(cos(rotationAngle),sin(rotationAngle));float shadow=0.;for (int i=0; i<pcfTapCount; i++) {vec3 offset=poissonSamplers[i];offset=vec3(offset.x*rotationVector.x-offset.y*rotationVector.y,offset.y*rotationVector.x+offset.x*rotationVector.y,0.);shadow+=TEXTUREFUNC(shadowSampler,uvDepth+offset*filterRadius,0.);}
shadow/=float(pcfTapCount);shadow=mix(shadow,1.,depthMetric-avgBlockerDepth);shadow=mix(darkness,1.,shadow);return computeFallOff(shadow,clipSpace.xy,frustumEdgeFalloff);}}}
#define inline
float computeShadowWithPCSS16(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,highp sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff)
{return computeShadowWithPCSS(vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,16,PoissonSamplers32);}
#define inline
float computeShadowWithPCSS32(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,highp sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff)
{return computeShadowWithPCSS(vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,32,PoissonSamplers32);}
#define inline
float computeShadowWithPCSS64(vec4 vPositionFromLight,float depthMetric,sampler2D depthSampler,highp sampler2DShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff)
{return computeShadowWithPCSS(vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,32,64,PoissonSamplers64);}
#define inline
float computeShadowWithCSMPCSS16(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)
{return computeShadowWithCSMPCSS(layer,vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,16,PoissonSamplers32,lightSizeUVCorrection,depthCorrection,penumbraDarkness);}
#define inline
float computeShadowWithCSMPCSS32(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)
{return computeShadowWithCSMPCSS(layer,vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,16,32,PoissonSamplers32,lightSizeUVCorrection,depthCorrection,penumbraDarkness);}
#define inline
float computeShadowWithCSMPCSS64(float layer,vec4 vPositionFromLight,float depthMetric,highp sampler2DArray depthSampler,highp sampler2DArrayShadow shadowSampler,float shadowMapSizeInverse,float lightSizeUV,float darkness,float frustumEdgeFalloff,vec2 lightSizeUVCorrection,float depthCorrection,float penumbraDarkness)
{return computeShadowWithCSMPCSS(layer,vPositionFromLight,depthMetric,depthSampler,shadowSampler,shadowMapSizeInverse,lightSizeUV,darkness,frustumEdgeFalloff,32,64,PoissonSamplers64,lightSizeUVCorrection,depthCorrection,penumbraDarkness);}
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name11] = shader11;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/samplerFragmentDeclaration.js
var name12 = "samplerFragmentDeclaration";
var shader12 = `#ifdef _DEFINENAME_
#if _DEFINENAME_DIRECTUV==1
#define v_VARYINGNAME_UV vMainUV1
#elif _DEFINENAME_DIRECTUV==2
#define v_VARYINGNAME_UV vMainUV2
#elif _DEFINENAME_DIRECTUV==3
#define v_VARYINGNAME_UV vMainUV3
#elif _DEFINENAME_DIRECTUV==4
#define v_VARYINGNAME_UV vMainUV4
#elif _DEFINENAME_DIRECTUV==5
#define v_VARYINGNAME_UV vMainUV5
#elif _DEFINENAME_DIRECTUV==6
#define v_VARYINGNAME_UV vMainUV6
#else
varying vec2 v_VARYINGNAME_UV;
#endif
uniform sampler2D _SAMPLERNAME_Sampler;
#endif
`;
ShaderStore.IncludesShadersStore[name12] = shader12;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fresnelFunction.js
var name13 = "fresnelFunction";
var shader13 = `#ifdef FRESNEL
float computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power)
{float fresnelTerm=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`;
ShaderStore.IncludesShadersStore[name13] = shader13;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/reflectionFunction.js
var name14 = "reflectionFunction";
var shader14 = `vec3 computeFixedEquirectangularCoords(vec4 worldPos,vec3 worldNormal,vec3 direction)
{float lon=atan(direction.z,direction.x);float lat=acos(direction.y);vec2 sphereCoords=vec2(lon,lat)*RECIPROCAL_PI2*2.0;float s=sphereCoords.x*0.5+0.5;float t=sphereCoords.y;return vec3(s,t,0); }
vec3 computeMirroredFixedEquirectangularCoords(vec4 worldPos,vec3 worldNormal,vec3 direction)
{float lon=atan(direction.z,direction.x);float lat=acos(direction.y);vec2 sphereCoords=vec2(lon,lat)*RECIPROCAL_PI2*2.0;float s=sphereCoords.x*0.5+0.5;float t=sphereCoords.y;return vec3(1.0-s,t,0); }
vec3 computeEquirectangularCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix)
{vec3 cameraToVertex=normalize(worldPos.xyz-eyePosition);vec3 r=normalize(reflect(cameraToVertex,worldNormal));r=vec3(reflectionMatrix*vec4(r,0));float lon=atan(r.z,r.x);float lat=acos(r.y);vec2 sphereCoords=vec2(lon,lat)*RECIPROCAL_PI2*2.0;float s=sphereCoords.x*0.5+0.5;float t=sphereCoords.y;return vec3(s,t,0);}
vec3 computeSphericalCoords(vec4 worldPos,vec3 worldNormal,mat4 view,mat4 reflectionMatrix)
{vec3 viewDir=normalize(vec3(view*worldPos));vec3 viewNormal=normalize(vec3(view*vec4(worldNormal,0.0)));vec3 r=reflect(viewDir,viewNormal);r=vec3(reflectionMatrix*vec4(r,0));r.z=r.z-1.0;float m=2.0*length(r);return vec3(r.x/m+0.5,1.0-r.y/m-0.5,0);}
vec3 computePlanarCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix)
{vec3 viewDir=worldPos.xyz-eyePosition;vec3 coords=normalize(reflect(viewDir,worldNormal));return vec3(reflectionMatrix*vec4(coords,1));}
vec3 computeCubicCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix)
{vec3 viewDir=normalize(worldPos.xyz-eyePosition);vec3 coords=reflect(viewDir,worldNormal);coords=vec3(reflectionMatrix*vec4(coords,0));
#ifdef INVERTCUBICMAP
coords.y*=-1.0;
#endif
return coords;}
vec3 computeCubicLocalCoords(vec4 worldPos,vec3 worldNormal,vec3 eyePosition,mat4 reflectionMatrix,vec3 reflectionSize,vec3 reflectionPosition)
{vec3 viewDir=normalize(worldPos.xyz-eyePosition);vec3 coords=reflect(viewDir,worldNormal);coords=parallaxCorrectNormal(worldPos.xyz,coords,reflectionSize,reflectionPosition);coords=vec3(reflectionMatrix*vec4(coords,0));
#ifdef INVERTCUBICMAP
coords.y*=-1.0;
#endif
return coords;}
vec3 computeProjectionCoords(vec4 worldPos,mat4 view,mat4 reflectionMatrix)
{return vec3(reflectionMatrix*(view*worldPos));}
vec3 computeSkyBoxCoords(vec3 positionW,mat4 reflectionMatrix)
{return vec3(reflectionMatrix*vec4(positionW,1.));}
#ifdef REFLECTION
vec3 computeReflectionCoords(vec4 worldPos,vec3 worldNormal)
{
#ifdef REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED
vec3 direction=normalize(vDirectionW);return computeMirroredFixedEquirectangularCoords(worldPos,worldNormal,direction);
#endif
#ifdef REFLECTIONMAP_EQUIRECTANGULAR_FIXED
vec3 direction=normalize(vDirectionW);return computeFixedEquirectangularCoords(worldPos,worldNormal,direction);
#endif
#ifdef REFLECTIONMAP_EQUIRECTANGULAR
return computeEquirectangularCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix);
#endif
#ifdef REFLECTIONMAP_SPHERICAL
return computeSphericalCoords(worldPos,worldNormal,view,reflectionMatrix);
#endif
#ifdef REFLECTIONMAP_PLANAR
return computePlanarCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix);
#endif
#ifdef REFLECTIONMAP_CUBIC
#ifdef USE_LOCAL_REFLECTIONMAP_CUBIC
return computeCubicLocalCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix,vReflectionSize,vReflectionPosition);
#else
return computeCubicCoords(worldPos,worldNormal,vEyePosition.xyz,reflectionMatrix);
#endif
#endif
#ifdef REFLECTIONMAP_PROJECTION
return computeProjectionCoords(worldPos,view,reflectionMatrix);
#endif
#ifdef REFLECTIONMAP_SKYBOX
return computeSkyBoxCoords(vPositionUVW,reflectionMatrix);
#endif
#ifdef REFLECTIONMAP_EXPLICIT
return vec3(0,0,0);
#endif
}
#endif
`;
ShaderStore.IncludesShadersStore[name14] = shader14;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/imageProcessingDeclaration.js
var name15 = "imageProcessingDeclaration";
var shader15 = `#ifdef EXPOSURE
uniform float exposureLinear;
#endif
#ifdef CONTRAST
uniform float contrast;
#endif
#if defined(VIGNETTE) || defined(DITHER)
uniform vec2 vInverseScreenSize;
#endif
#ifdef VIGNETTE
uniform vec4 vignetteSettings1;uniform vec4 vignetteSettings2;
#endif
#ifdef COLORCURVES
uniform vec4 vCameraColorCurveNegative;uniform vec4 vCameraColorCurveNeutral;uniform vec4 vCameraColorCurvePositive;
#endif
#ifdef COLORGRADING
#ifdef COLORGRADING3D
uniform highp sampler3D txColorTransform;
#else
uniform sampler2D txColorTransform;
#endif
uniform vec4 colorTransformSettings;
#endif
#ifdef DITHER
uniform float ditherIntensity;
#endif
`;
ShaderStore.IncludesShadersStore[name15] = shader15;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/imageProcessingFunctions.js
var name16 = "imageProcessingFunctions";
var shader16 = `#if defined(COLORGRADING) && !defined(COLORGRADING3D)
/** 
* Polyfill for SAMPLE_TEXTURE_3D,which is unsupported in WebGL.
* sampler3dSetting.x=textureOffset (0.5/textureSize).
* sampler3dSetting.y=textureSize.
*/
#define inline
vec3 sampleTexture3D(sampler2D colorTransform,vec3 color,vec2 sampler3dSetting)
{float sliceSize=2.0*sampler3dSetting.x; 
#ifdef SAMPLER3DGREENDEPTH
float sliceContinuous=(color.g-sampler3dSetting.x)*sampler3dSetting.y;
#else
float sliceContinuous=(color.b-sampler3dSetting.x)*sampler3dSetting.y;
#endif
float sliceInteger=floor(sliceContinuous);float sliceFraction=sliceContinuous-sliceInteger;
#ifdef SAMPLER3DGREENDEPTH
vec2 sliceUV=color.rb;
#else
vec2 sliceUV=color.rg;
#endif
sliceUV.x*=sliceSize;sliceUV.x+=sliceInteger*sliceSize;sliceUV=saturate(sliceUV);vec4 slice0Color=texture2D(colorTransform,sliceUV);sliceUV.x+=sliceSize;sliceUV=saturate(sliceUV);vec4 slice1Color=texture2D(colorTransform,sliceUV);vec3 result=mix(slice0Color.rgb,slice1Color.rgb,sliceFraction);
#ifdef SAMPLER3DBGRMAP
color.rgb=result.rgb;
#else
color.rgb=result.bgr;
#endif
return color;}
#endif
#ifdef TONEMAPPING_ACES
const mat3 ACESInputMat=mat3(
vec3(0.59719,0.07600,0.02840),
vec3(0.35458,0.90834,0.13383),
vec3(0.04823,0.01566,0.83777)
);const mat3 ACESOutputMat=mat3(
vec3( 1.60475,-0.10208,-0.00327),
vec3(-0.53108, 1.10813,-0.07276),
vec3(-0.07367,-0.00605, 1.07602)
);vec3 RRTAndODTFit(vec3 v)
{vec3 a=v*(v+0.0245786)-0.000090537;vec3 b=v*(0.983729*v+0.4329510)+0.238081;return a/b;}
vec3 ACESFitted(vec3 color)
{color=ACESInputMat*color;color=RRTAndODTFit(color);color=ACESOutputMat*color;color=saturate(color);return color;}
#endif
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_DEFINITIONS
vec4 applyImageProcessing(vec4 result) {
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_UPDATERESULT_ATSTART
#ifdef EXPOSURE
result.rgb*=exposureLinear;
#endif
#ifdef VIGNETTE
vec2 viewportXY=gl_FragCoord.xy*vInverseScreenSize;viewportXY=viewportXY*2.0-1.0;vec3 vignetteXY1=vec3(viewportXY*vignetteSettings1.xy+vignetteSettings1.zw,1.0);float vignetteTerm=dot(vignetteXY1,vignetteXY1);float vignette=pow(vignetteTerm,vignetteSettings2.w);vec3 vignetteColor=vignetteSettings2.rgb;
#ifdef VIGNETTEBLENDMODEMULTIPLY
vec3 vignetteColorMultiplier=mix(vignetteColor,vec3(1,1,1),vignette);result.rgb*=vignetteColorMultiplier;
#endif
#ifdef VIGNETTEBLENDMODEOPAQUE
result.rgb=mix(vignetteColor,result.rgb,vignette);
#endif
#endif
#ifdef TONEMAPPING
#ifdef TONEMAPPING_ACES
result.rgb=ACESFitted(result.rgb);
#else
const float tonemappingCalibration=1.590579;result.rgb=1.0-exp2(-tonemappingCalibration*result.rgb);
#endif
#endif
result.rgb=toGammaSpace(result.rgb);result.rgb=saturate(result.rgb);
#ifdef CONTRAST
vec3 resultHighContrast=result.rgb*result.rgb*(3.0-2.0*result.rgb);if (contrast<1.0) {result.rgb=mix(vec3(0.5,0.5,0.5),result.rgb,contrast);} else {result.rgb=mix(result.rgb,resultHighContrast,contrast-1.0);}
#endif
#ifdef COLORGRADING
vec3 colorTransformInput=result.rgb*colorTransformSettings.xxx+colorTransformSettings.yyy;
#ifdef COLORGRADING3D
vec3 colorTransformOutput=texture(txColorTransform,colorTransformInput).rgb;
#else
vec3 colorTransformOutput=sampleTexture3D(txColorTransform,colorTransformInput,colorTransformSettings.yz).rgb;
#endif
result.rgb=mix(result.rgb,colorTransformOutput,colorTransformSettings.www);
#endif
#ifdef COLORCURVES
float luma=getLuminance(result.rgb);vec2 curveMix=clamp(vec2(luma*3.0-1.5,luma*-3.0+1.5),vec2(0.0),vec2(1.0));vec4 colorCurve=vCameraColorCurveNeutral+curveMix.x*vCameraColorCurvePositive-curveMix.y*vCameraColorCurveNegative;result.rgb*=colorCurve.rgb;result.rgb=mix(vec3(luma),result.rgb,colorCurve.a);
#endif
#ifdef DITHER
float rand=getRand(gl_FragCoord.xy*vInverseScreenSize);float dither=mix(-ditherIntensity,ditherIntensity,rand);result.rgb=saturate(result.rgb+vec3(dither));
#endif
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_UPDATERESULT_ATEND
return result;}`;
ShaderStore.IncludesShadersStore[name16] = shader16;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/bumpFragmentMainFunctions.js
var name17 = "bumpFragmentMainFunctions";
var shader17 = `#if defined(BUMP) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;
#endif
#ifdef OBJECTSPACE_NORMALMAP
uniform mat4 normalMatrix;
#if defined(WEBGL2) || defined(WEBGPU)
mat4 toNormalMatrix(mat4 wMatrix)
{mat4 ret=inverse(wMatrix);ret=transpose(ret);ret[0][3]=0.;ret[1][3]=0.;ret[2][3]=0.;ret[3]=vec4(0.,0.,0.,1.);return ret;}
#else
mat4 toNormalMatrix(mat4 m)
{float
a00=m[0][0],a01=m[0][1],a02=m[0][2],a03=m[0][3],
a10=m[1][0],a11=m[1][1],a12=m[1][2],a13=m[1][3],
a20=m[2][0],a21=m[2][1],a22=m[2][2],a23=m[2][3],
a30=m[3][0],a31=m[3][1],a32=m[3][2],a33=m[3][3],
b00=a00*a11-a01*a10,
b01=a00*a12-a02*a10,
b02=a00*a13-a03*a10,
b03=a01*a12-a02*a11,
b04=a01*a13-a03*a11,
b05=a02*a13-a03*a12,
b06=a20*a31-a21*a30,
b07=a20*a32-a22*a30,
b08=a20*a33-a23*a30,
b09=a21*a32-a22*a31,
b10=a21*a33-a23*a31,
b11=a22*a33-a23*a32,
det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;mat4 mi=mat4(
a11*b11-a12*b10+a13*b09,
a02*b10-a01*b11-a03*b09,
a31*b05-a32*b04+a33*b03,
a22*b04-a21*b05-a23*b03,
a12*b08-a10*b11-a13*b07,
a00*b11-a02*b08+a03*b07,
a32*b02-a30*b05-a33*b01,
a20*b05-a22*b02+a23*b01,
a10*b10-a11*b08+a13*b06,
a01*b08-a00*b10-a03*b06,
a30*b04-a31*b02+a33*b00,
a21*b02-a20*b04-a23*b00,
a11*b07-a10*b09-a12*b06,
a00*b09-a01*b07+a02*b06,
a31*b01-a30*b03-a32*b00,
a20*b03-a21*b01+a22*b00)/det;return mat4(mi[0][0],mi[1][0],mi[2][0],mi[3][0],
mi[0][1],mi[1][1],mi[2][1],mi[3][1],
mi[0][2],mi[1][2],mi[2][2],mi[3][2],
mi[0][3],mi[1][3],mi[2][3],mi[3][3]);}
#endif
#endif
vec3 perturbNormalBase(mat3 cotangentFrame,vec3 normal,float scale)
{
#ifdef NORMALXYSCALE
normal=normalize(normal*vec3(scale,scale,1.0));
#endif
return normalize(cotangentFrame*normal);}
vec3 perturbNormal(mat3 cotangentFrame,vec3 textureSample,float scale)
{return perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);}
mat3 cotangent_frame(vec3 normal,vec3 p,vec2 uv,vec2 tangentSpaceParams)
{vec3 dp1=dFdx(p);vec3 dp2=dFdy(p);vec2 duv1=dFdx(uv);vec2 duv2=dFdy(uv);vec3 dp2perp=cross(dp2,normal);vec3 dp1perp=cross(normal,dp1);vec3 tangent=dp2perp*duv1.x+dp1perp*duv2.x;vec3 bitangent=dp2perp*duv1.y+dp1perp*duv2.y;tangent*=tangentSpaceParams.x;bitangent*=tangentSpaceParams.y;float det=max(dot(tangent,tangent),dot(bitangent,bitangent));float invmax=det==0.0 ? 0.0 : inversesqrt(det);return mat3(tangent*invmax,bitangent*invmax,normal);}
#endif
`;
ShaderStore.IncludesShadersStore[name17] = shader17;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/bumpFragmentFunctions.js
var name18 = "bumpFragmentFunctions";
var shader18 = `#if defined(BUMP)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_SAMPLERNAME_,bump)
#endif
#if defined(DETAIL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_SAMPLERNAME_,detail)
#endif
#if defined(BUMP) && defined(PARALLAX)
const float minSamples=4.;const float maxSamples=15.;const int iMaxSamples=15;vec2 parallaxOcclusion(vec3 vViewDirCoT,vec3 vNormalCoT,vec2 texCoord,float parallaxScale) {float parallaxLimit=length(vViewDirCoT.xy)/vViewDirCoT.z;parallaxLimit*=parallaxScale;vec2 vOffsetDir=normalize(vViewDirCoT.xy);vec2 vMaxOffset=vOffsetDir*parallaxLimit;float numSamples=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));float stepSize=1.0/numSamples;float currRayHeight=1.0;vec2 vCurrOffset=vec2(0,0);vec2 vLastOffset=vec2(0,0);float lastSampledHeight=1.0;float currSampledHeight=1.0;bool keepWorking=true;for (int i=0; i<iMaxSamples; i++)
{currSampledHeight=texture2D(bumpSampler,texCoord+vCurrOffset).w;if (!keepWorking)
{}
else if (currSampledHeight>currRayHeight)
{float delta1=currSampledHeight-currRayHeight;float delta2=(currRayHeight+stepSize)-lastSampledHeight;float ratio=delta1/(delta1+delta2);vCurrOffset=(ratio)* vLastOffset+(1.0-ratio)*vCurrOffset;keepWorking=false;}
else
{currRayHeight-=stepSize;vLastOffset=vCurrOffset;
#ifdef PARALLAX_RHS
vCurrOffset-=stepSize*vMaxOffset;
#else
vCurrOffset+=stepSize*vMaxOffset;
#endif
lastSampledHeight=currSampledHeight;}}
return vCurrOffset;}
vec2 parallaxOffset(vec3 viewDir,float heightScale)
{float height=texture2D(bumpSampler,vBumpUV).w;vec2 texCoordOffset=heightScale*viewDir.xy*height;
#ifdef PARALLAX_RHS
return texCoordOffset;
#else
return -texCoordOffset;
#endif
}
#endif
`;
ShaderStore.IncludesShadersStore[name18] = shader18;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthDeclaration.js
var name19 = "logDepthDeclaration";
var shader19 = `#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;varying float vFragmentDepth;
#endif
`;
ShaderStore.IncludesShadersStore[name19] = shader19;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fogFragmentDeclaration.js
var name20 = "fogFragmentDeclaration";
var shader20 = `#ifdef FOG
#define FOGMODE_NONE 0.
#define FOGMODE_EXP 1.
#define FOGMODE_EXP2 2.
#define FOGMODE_LINEAR 3.
#define E 2.71828
uniform vec4 vFogInfos;uniform vec3 vFogColor;varying vec3 vFogDistance;float CalcFogFactor()
{float fogCoeff=1.0;float fogStart=vFogInfos.y;float fogEnd=vFogInfos.z;float fogDensity=vFogInfos.w;float fogDistance=length(vFogDistance);if (FOGMODE_LINEAR==vFogInfos.x)
{fogCoeff=(fogEnd-fogDistance)/(fogEnd-fogStart);}
else if (FOGMODE_EXP==vFogInfos.x)
{fogCoeff=1.0/pow(E,fogDistance*fogDensity);}
else if (FOGMODE_EXP2==vFogInfos.x)
{fogCoeff=1.0/pow(E,fogDistance*fogDistance*fogDensity*fogDensity);}
return clamp(fogCoeff,0.0,1.0);}
#endif
`;
ShaderStore.IncludesShadersStore[name20] = shader20;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/bumpFragment.js
var name21 = "bumpFragment";
var shader21 = `vec2 uvOffset=vec2(0.0,0.0);
#if defined(BUMP) || defined(PARALLAX) || defined(DETAIL)
#ifdef NORMALXYSCALE
float normalScale=1.0;
#elif defined(BUMP)
float normalScale=vBumpInfos.y;
#else
float normalScale=1.0;
#endif
#if defined(TANGENT) && defined(NORMAL)
mat3 TBN=vTBN;
#elif defined(BUMP)
vec2 TBNUV=gl_FrontFacing ? vBumpUV : -vBumpUV;mat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,TBNUV,vTangentSpaceParams);
#else
vec2 TBNUV=gl_FrontFacing ? vDetailUV : -vDetailUV;mat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,TBNUV,vec2(1.,1.));
#endif
#elif defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
mat3 TBN=vTBN;
#else
vec2 TBNUV=gl_FrontFacing ? vMainUV1 : -vMainUV1;mat3 TBN=cotangent_frame(normalW,vPositionW,TBNUV,vec2(1.,1.));
#endif
#endif
#ifdef PARALLAX
mat3 invTBN=transposeMat3(TBN);
#ifdef PARALLAXOCCLUSION
uvOffset=parallaxOcclusion(invTBN*-viewDirectionW,invTBN*normalW,vBumpUV,vBumpInfos.z);
#else
uvOffset=parallaxOffset(invTBN*viewDirectionW,vBumpInfos.z);
#endif
#endif
#ifdef DETAIL
vec4 detailColor=texture2D(detailSampler,vDetailUV+uvOffset);vec2 detailNormalRG=detailColor.wy*2.0-1.0;float detailNormalB=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));vec3 detailNormal=vec3(detailNormalRG,detailNormalB);
#endif
#ifdef BUMP
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(texture2D(bumpSampler,vBumpUV).xyz *2.0-1.0);normalW=normalize(mat3(normalMatrix)*normalW);
#elif !defined(DETAIL)
normalW=perturbNormal(TBN,texture2D(bumpSampler,vBumpUV+uvOffset).xyz,vBumpInfos.y);
#else
vec3 bumpNormal=texture2D(bumpSampler,vBumpUV+uvOffset).xyz*2.0-1.0;
#if DETAIL_NORMALBLENDMETHOD==0 
detailNormal.xy*=vDetailInfos.z;vec3 blendedNormal=normalize(vec3(bumpNormal.xy+detailNormal.xy,bumpNormal.z*detailNormal.z));
#elif DETAIL_NORMALBLENDMETHOD==1 
detailNormal.xy*=vDetailInfos.z;bumpNormal+=vec3(0.0,0.0,1.0);detailNormal*=vec3(-1.0,-1.0,1.0);vec3 blendedNormal=bumpNormal*dot(bumpNormal,detailNormal)/bumpNormal.z-detailNormal;
#endif
normalW=perturbNormalBase(TBN,blendedNormal,vBumpInfos.y);
#endif
#elif defined(DETAIL)
detailNormal.xy*=vDetailInfos.z;normalW=perturbNormalBase(TBN,detailNormal,vDetailInfos.z);
#endif
`;
ShaderStore.IncludesShadersStore[name21] = shader21;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/decalFragment.js
var name22 = "decalFragment";
var shader22 = `#ifdef DECAL
#ifdef GAMMADECAL
decalColor.rgb=toLinearSpace(decalColor.rgb);
#endif
#ifdef DECAL_SMOOTHALPHA
decalColor.a*=decalColor.a;
#endif
surfaceAlbedo.rgb=mix(surfaceAlbedo.rgb,decalColor.rgb,decalColor.a);
#endif
`;
ShaderStore.IncludesShadersStore[name22] = shader22;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/depthPrePass.js
var name23 = "depthPrePass";
var shader23 = `#ifdef DEPTHPREPASS
gl_FragColor=vec4(0.,0.,0.,1.0);return;
#endif
`;
ShaderStore.IncludesShadersStore[name23] = shader23;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/lightFragment.js
var name24 = "lightFragment";
var shader24 = `#ifdef LIGHT{X}
#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})
#else
#ifdef PBR
#ifdef SPOTLIGHT{X}
preInfo=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);
#elif defined(POINTLIGHT{X})
preInfo=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);
#elif defined(HEMILIGHT{X})
preInfo=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);
#elif defined(DIRLIGHT{X})
preInfo=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);
#endif
preInfo.NdotV=NdotV;
#ifdef SPOTLIGHT{X}
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo.attenuation=computeDistanceLightFalloff_GLTF(preInfo.lightDistanceSquared,light{X}.vLightFalloff.y);preInfo.attenuation*=computeDirectionalLightFalloff_GLTF(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo.attenuation=computeDistanceLightFalloff_Physical(preInfo.lightDistanceSquared);preInfo.attenuation*=computeDirectionalLightFalloff_Physical(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w);
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo.attenuation=computeDistanceLightFalloff_Standard(preInfo.lightOffset,light{X}.vLightFalloff.x);preInfo.attenuation*=computeDirectionalLightFalloff_Standard(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w,light{X}.vLightData.w);
#else
preInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);preInfo.attenuation*=computeDirectionalLightFalloff(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w,light{X}.vLightData.w,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#elif defined(POINTLIGHT{X})
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo.attenuation=computeDistanceLightFalloff_GLTF(preInfo.lightDistanceSquared,light{X}.vLightFalloff.y);
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo.attenuation=computeDistanceLightFalloff_Physical(preInfo.lightDistanceSquared);
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo.attenuation=computeDistanceLightFalloff_Standard(preInfo.lightOffset,light{X}.vLightFalloff.x);
#else
preInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#endif
#else
preInfo.attenuation=1.0;
#endif
#ifdef HEMILIGHT{X}
preInfo.roughness=roughness;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(roughness,light{X}.vLightSpecular.a,preInfo.lightDistance);
#endif
#ifdef IRIDESCENCE
preInfo.iridescenceIntensity=iridescenceIntensity;
#endif
#ifdef HEMILIGHT{X}
info.diffuse=computeHemisphericDiffuseLighting(preInfo,light{X}.vLightDiffuse.rgb,light{X}.vLightGround);
#elif defined(SS_TRANSLUCENCY)
info.diffuse=computeDiffuseAndTransmittedLighting(preInfo,light{X}.vLightDiffuse.rgb,subSurfaceOut.transmittance);
#else
info.diffuse=computeDiffuseLighting(preInfo,light{X}.vLightDiffuse.rgb);
#endif
#ifdef SPECULARTERM
#ifdef ANISOTROPIC
info.specular=computeAnisotropicSpecularLighting(preInfo,viewDirectionW,normalW,anisotropicOut.anisotropicTangent,anisotropicOut.anisotropicBitangent,anisotropicOut.anisotropy,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,AARoughnessFactors.x,light{X}.vLightDiffuse.rgb);
#else
info.specular=computeSpecularLighting(preInfo,normalW,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,AARoughnessFactors.x,light{X}.vLightDiffuse.rgb);
#endif
#endif
#ifdef SHEEN
#ifdef SHEEN_LINKWITHALBEDO
preInfo.roughness=sheenOut.sheenIntensity;
#else
#ifdef HEMILIGHT{X}
preInfo.roughness=sheenOut.sheenRoughness;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(sheenOut.sheenRoughness,light{X}.vLightSpecular.a,preInfo.lightDistance);
#endif
#endif
info.sheen=computeSheenLighting(preInfo,normalW,sheenOut.sheenColor,specularEnvironmentR90,AARoughnessFactors.x,light{X}.vLightDiffuse.rgb);
#endif
#ifdef CLEARCOAT
#ifdef HEMILIGHT{X}
preInfo.roughness=clearcoatOut.clearCoatRoughness;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(clearcoatOut.clearCoatRoughness,light{X}.vLightSpecular.a,preInfo.lightDistance);
#endif
info.clearCoat=computeClearCoatLighting(preInfo,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatAARoughnessFactors.x,clearcoatOut.clearCoatIntensity,light{X}.vLightDiffuse.rgb);
#ifdef CLEARCOAT_TINT
absorption=computeClearCoatLightingAbsorption(clearcoatOut.clearCoatNdotVRefract,preInfo.L,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatColor,clearcoatOut.clearCoatThickness,clearcoatOut.clearCoatIntensity);info.diffuse*=absorption;
#ifdef SPECULARTERM
info.specular*=absorption;
#endif
#endif
info.diffuse*=info.clearCoat.w;
#ifdef SPECULARTERM
info.specular*=info.clearCoat.w;
#endif
#ifdef SHEEN
info.sheen*=info.clearCoat.w;
#endif
#endif
#else
#ifdef SPOTLIGHT{X}
info=computeSpotLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDirection,light{X}.vLightDiffuse.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightDiffuse.a,glossiness);
#elif defined(HEMILIGHT{X})
info=computeHemisphericLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDiffuse.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightGround,glossiness);
#elif defined(POINTLIGHT{X}) || defined(DIRLIGHT{X})
info=computeLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDiffuse.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightDiffuse.a,glossiness);
#endif
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
info.diffuse*=computeProjectionTextureDiffuseLighting(projectionLightSampler{X},textureProjectionMatrix{X});
#endif
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
for (int i=0; i<SHADOWCSMNUM_CASCADES{X}; i++) 
{
#ifdef SHADOWCSM_RIGHTHANDED{X}
diff{X}=viewFrustumZ{X}[i]+vPositionFromCamera{X}.z;
#else
diff{X}=viewFrustumZ{X}[i]-vPositionFromCamera{X}.z;
#endif
if (diff{X}>=0.) {index{X}=i;break;}}
#ifdef SHADOWCSMUSESHADOWMAXZ{X}
if (index{X}>=0)
#endif
{
#if defined(SHADOWPCF{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithCSMPCF1(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithCSMPCF3(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
shadow=computeShadowWithCSMPCF5(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCSS{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithCSMPCSS16(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithCSMPCSS32(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});
#else
shadow=computeShadowWithCSMPCSS64(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});
#endif
#else
shadow=computeShadowCSM(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#ifdef SHADOWCSMDEBUG{X}
shadowDebug{X}=vec3(shadow)*vCascadeColorsMultiplier{X}[index{X}];
#endif
#ifndef SHADOWCSMNOBLEND{X}
float frustumLength=frustumLengths{X}[index{X}];float diffRatio=clamp(diff{X}/frustumLength,0.,1.)*cascadeBlendFactor{X};if (index{X}<(SHADOWCSMNUM_CASCADES{X}-1) && diffRatio<1.)
{index{X}+=1;float nextShadow=0.;
#if defined(SHADOWPCF{X})
#if defined(SHADOWLOWQUALITY{X})
nextShadow=computeShadowWithCSMPCF1(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
nextShadow=computeShadowWithCSMPCF3(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
nextShadow=computeShadowWithCSMPCF5(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCSS{X})
#if defined(SHADOWLOWQUALITY{X})
nextShadow=computeShadowWithCSMPCSS16(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});
#elif defined(SHADOWMEDIUMQUALITY{X})
nextShadow=computeShadowWithCSMPCSS32(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});
#else
nextShadow=computeShadowWithCSMPCSS64(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,lightSizeUVCorrection{X}[index{X}],depthCorrection{X}[index{X}],penumbraDarkness{X});
#endif
#else
nextShadow=computeShadowCSM(float(index{X}),vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
shadow=mix(nextShadow,shadow,diffRatio);
#ifdef SHADOWCSMDEBUG{X}
shadowDebug{X}=mix(vec3(nextShadow)*vCascadeColorsMultiplier{X}[index{X}],shadowDebug{X},diffRatio);
#endif
}
#endif
}
#elif defined(SHADOWCLOSEESM{X})
#if defined(SHADOWCUBE{X})
shadow=computeShadowWithCloseESMCube(vPositionW,light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.depthValues);
#else
shadow=computeShadowWithCloseESM(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWESM{X})
#if defined(SHADOWCUBE{X})
shadow=computeShadowWithESMCube(vPositionW,light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.depthValues);
#else
shadow=computeShadowWithESM(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPOISSON{X})
#if defined(SHADOWCUBE{X})
shadow=computeShadowWithPoissonSamplingCube(vPositionW,light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.x,light{X}.depthValues);
#else
shadow=computeShadowWithPoissonSampling(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCF{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithPCF1(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithPCF3(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
shadow=computeShadowWithPCF5(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCSS{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithPCSS16(vPositionFromLight{X},vDepthMetric{X},depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithPCSS32(vPositionFromLight{X},vDepthMetric{X},depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
shadow=computeShadowWithPCSS64(vPositionFromLight{X},vDepthMetric{X},depthSampler{X},shadowSampler{X},light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#else
#if defined(SHADOWCUBE{X})
shadow=computeShadowCube(vPositionW,light{X}.vLightData.xyz,shadowSampler{X},light{X}.shadowsInfo.x,light{X}.depthValues);
#else
shadow=computeShadow(vPositionFromLight{X},vDepthMetric{X},shadowSampler{X},light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#endif
#ifdef SHADOWONLY
#ifndef SHADOWINUSE
#define SHADOWINUSE
#endif
globalShadow+=shadow;shadowLightCount+=1.0;
#endif
#else
shadow=1.;
#endif
aggShadow+=shadow;numLights+=1.0;
#ifndef SHADOWONLY
#ifdef CUSTOMUSERLIGHTING
diffuseBase+=computeCustomDiffuseLighting(info,diffuseBase,shadow);
#ifdef SPECULARTERM
specularBase+=computeCustomSpecularLighting(info,specularBase,shadow);
#endif
#elif defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X})
diffuseBase+=lightmapColor.rgb*shadow;
#ifdef SPECULARTERM
#ifndef LIGHTMAPNOSPECULAR{X}
specularBase+=info.specular*shadow*lightmapColor.rgb;
#endif
#endif
#ifdef CLEARCOAT
#ifndef LIGHTMAPNOSPECULAR{X}
clearCoatBase+=info.clearCoat.rgb*shadow*lightmapColor.rgb;
#endif
#endif
#ifdef SHEEN
#ifndef LIGHTMAPNOSPECULAR{X}
sheenBase+=info.sheen.rgb*shadow;
#endif
#endif
#else
#ifdef SHADOWCSMDEBUG{X}
diffuseBase+=info.diffuse*shadowDebug{X};
#else 
diffuseBase+=info.diffuse*shadow;
#endif
#ifdef SPECULARTERM
specularBase+=info.specular*shadow;
#endif
#ifdef CLEARCOAT
clearCoatBase+=info.clearCoat.rgb*shadow;
#endif
#ifdef SHEEN
sheenBase+=info.sheen.rgb*shadow;
#endif
#endif
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name24] = shader24;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthFragment.js
var name25 = "logDepthFragment";
var shader25 = `#ifdef LOGARITHMICDEPTH
gl_FragDepthEXT=log2(vFragmentDepth)*logarithmicDepthConstant*0.5;
#endif
`;
ShaderStore.IncludesShadersStore[name25] = shader25;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fogFragment.js
var name26 = "fogFragment";
var shader26 = `#ifdef FOG
float fog=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color.rgb=mix(vFogColor,color.rgb,fog);
#endif
`;
ShaderStore.IncludesShadersStore[name26] = shader26;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/oitFragment.js
var name27 = "oitFragment";
var shader27 = `#ifdef ORDER_INDEPENDENT_TRANSPARENCY
float fragDepth=gl_FragCoord.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
uint halfFloat=packHalf2x16(vec2(fragDepth));vec2 full=unpackHalf2x16(halfFloat);fragDepth=full.x;
#endif
ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec2 lastDepth=texelFetch(oitDepthSampler,fragCoord,0).rg;vec4 lastFrontColor=texelFetch(oitFrontColorSampler,fragCoord,0);depth.rg=vec2(-MAX_DEPTH);frontColor=lastFrontColor;backColor=vec4(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
float furthestDepth=-lastDepth.x;float nearestDepth=lastDepth.y;
#else
float nearestDepth=-lastDepth.x;float furthestDepth=lastDepth.y;
#endif
float alphaMultiplier=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
depth.rg=vec2(-fragDepth,fragDepth);return;}
#endif
`;
ShaderStore.IncludesShadersStore[name27] = shader27;

// node_modules/@babylonjs/core/Shaders/default.fragment.js
var name28 = "defaultPixelShader";
var shader28 = `#include<__decl__defaultFragment>
#if defined(BUMP) || !defined(NORMAL)
#extension GL_OES_standard_derivatives : enable
#endif
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#define CUSTOM_FRAGMENT_BEGIN
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#include<mainUVVaryingDeclaration>[1..7]
#include<helperFunctions>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<samplerFragmentDeclaration>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse,_SAMPLERNAME_,diffuse)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_SAMPLERNAME_,ambient)
#include<samplerFragmentDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_SAMPLERNAME_,opacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_SAMPLERNAME_,emissive)
#include<samplerFragmentDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_SAMPLERNAME_,lightmap)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#ifdef REFRACTION
#ifdef REFRACTIONMAP_3D
uniform samplerCube refractionCubeSampler;
#else
uniform sampler2D refraction2DSampler;
#endif
#endif
#if defined(SPECULARTERM)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular,_SAMPLERNAME_,specular)
#endif
#include<fresnelFunction>
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
uniform samplerCube reflectionCubeSampler;
#else
uniform sampler2D reflection2DSampler;
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#endif
#include<reflectionFunction>
#endif
#include<imageProcessingDeclaration>
#include<imageProcessingFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);vec4 baseColor=vec4(1.,1.,1.,1.);vec3 diffuseColor=vDiffuseColor.rgb;float alpha=vDiffuseColor.a;
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=normalize(-cross(dFdx(vPositionW),dFdy(vPositionW)));
#endif
#include<bumpFragment>
#ifdef TWOSIDEDLIGHTING
normalW=gl_FrontFacing ? normalW : -normalW;
#endif
#ifdef DIFFUSE
baseColor=texture2D(diffuseSampler,vDiffuseUV+uvOffset);
#if defined(ALPHATEST) && !defined(ALPHATEST_AFTERALLALPHACOMPUTATIONS)
if (baseColor.a<alphaCutOff)
discard;
#endif
#ifdef ALPHAFROMDIFFUSE
alpha*=baseColor.a;
#endif
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
baseColor.rgb*=vDiffuseInfos.y;
#endif
#if defined(DECAL) && !defined(DECAL_AFTER_DETAIL)
vec4 decalColor=texture2D(decalSampler,vDecalUV+uvOffset);
#include<decalFragment>(surfaceAlbedo,baseColor,GAMMADECAL,_GAMMADECAL_NOTUSED_)
#endif
#include<depthPrePass>
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor.rgb*=vColor.rgb;
#endif
#ifdef DETAIL
baseColor.rgb=baseColor.rgb*2.0*mix(0.5,detailColor.r,vDetailInfos.y);
#endif
#if defined(DECAL) && defined(DECAL_AFTER_DETAIL)
vec4 decalColor=texture2D(decalSampler,vDecalUV+uvOffset);
#include<decalFragment>(surfaceAlbedo,baseColor,GAMMADECAL,_GAMMADECAL_NOTUSED_)
#endif
#define CUSTOM_FRAGMENT_UPDATE_DIFFUSE
vec3 baseAmbientColor=vec3(1.,1.,1.);
#ifdef AMBIENT
baseAmbientColor=texture2D(ambientSampler,vAmbientUV+uvOffset).rgb*vAmbientInfos.y;
#endif
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
#ifdef SPECULARTERM
float glossiness=vSpecularColor.a;vec3 specularColor=vSpecularColor.rgb;
#ifdef SPECULAR
vec4 specularMapColor=texture2D(specularSampler,vSpecularUV+uvOffset);specularColor=specularMapColor.rgb;
#ifdef GLOSSINESS
glossiness=glossiness*specularMapColor.a;
#endif
#endif
#else
float glossiness=0.;
#endif
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;
#ifdef SPECULARTERM
vec3 specularBase=vec3(0.,0.,0.);
#endif
float shadow=1.;float aggShadow=0.;float numLights=0.;
#ifdef LIGHTMAP
vec4 lightmapColor=texture2D(lightmapSampler,vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor.rgb=fromRGBD(lightmapColor);
#endif
lightmapColor.rgb*=vLightmapInfos.y;
#endif
#include<lightFragment>[0..maxSimultaneousLights]
aggShadow=aggShadow/numLights;vec4 refractionColor=vec4(0.,0.,0.,1.);
#ifdef REFRACTION
vec3 refractionVector=normalize(refract(-viewDirectionW,normalW,vRefractionInfos.y));
#ifdef REFRACTIONMAP_3D
#ifdef USE_LOCAL_REFRACTIONMAP_CUBIC
refractionVector=parallaxCorrectNormal(vPositionW,refractionVector,vRefractionSize,vRefractionPosition);
#endif
refractionVector.y=refractionVector.y*vRefractionInfos.w;vec4 refractionLookup=textureCube(refractionCubeSampler,refractionVector);if (dot(refractionVector,viewDirectionW)<1.0) {refractionColor=refractionLookup;}
#else
vec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*vRefractionInfos.z,1.0)));vec2 refractionCoords=vRefractionUVW.xy/vRefractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;refractionColor=texture2D(refraction2DSampler,refractionCoords);
#endif
#ifdef RGBDREFRACTION
refractionColor.rgb=fromRGBD(refractionColor);
#endif
#ifdef IS_REFRACTION_LINEAR
refractionColor.rgb=toGammaSpace(refractionColor.rgb);
#endif
refractionColor.rgb*=vRefractionInfos.x;
#endif
vec4 reflectionColor=vec4(0.,0.,0.,1.);
#ifdef REFLECTION
vec3 vReflectionUVW=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
vReflectionUVW.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
#ifdef ROUGHNESS
float bias=vReflectionInfos.y;
#ifdef SPECULARTERM
#ifdef SPECULAR
#ifdef GLOSSINESS
bias*=(1.0-specularMapColor.a);
#endif
#endif
#endif
reflectionColor=textureCube(reflectionCubeSampler,vReflectionUVW,bias);
#else
reflectionColor=textureCube(reflectionCubeSampler,vReflectionUVW);
#endif
#else
vec2 coords=vReflectionUVW.xy;
#ifdef REFLECTIONMAP_PROJECTION
coords/=vReflectionUVW.z;
#endif
coords.y=1.0-coords.y;reflectionColor=texture2D(reflection2DSampler,coords);
#endif
#ifdef RGBDREFLECTION
reflectionColor.rgb=fromRGBD(reflectionColor);
#endif
#ifdef IS_REFLECTION_LINEAR
reflectionColor.rgb=toGammaSpace(reflectionColor.rgb);
#endif
reflectionColor.rgb*=vReflectionInfos.x;
#ifdef REFLECTIONFRESNEL
float reflectionFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,reflectionRightColor.a,reflectionLeftColor.a);
#ifdef REFLECTIONFRESNELFROMSPECULAR
#ifdef SPECULARTERM
reflectionColor.rgb*=specularColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*reflectionRightColor.rgb;
#else
reflectionColor.rgb*=reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*reflectionRightColor.rgb;
#endif
#else
reflectionColor.rgb*=reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*reflectionRightColor.rgb;
#endif
#endif
#endif
#ifdef REFRACTIONFRESNEL
float refractionFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,refractionRightColor.a,refractionLeftColor.a);refractionColor.rgb*=refractionLeftColor.rgb*(1.0-refractionFresnelTerm)+refractionFresnelTerm*refractionRightColor.rgb;
#endif
#ifdef OPACITY
vec4 opacityMap=texture2D(opacitySampler,vOpacityUV+uvOffset);
#ifdef OPACITYRGB
opacityMap.rgb=opacityMap.rgb*vec3(0.3,0.59,0.11);alpha*=(opacityMap.x+opacityMap.y+opacityMap.z)* vOpacityInfos.y;
#else
alpha*=opacityMap.a*vOpacityInfos.y;
#endif
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=vColor.a;
#endif
#ifdef OPACITYFRESNEL
float opacityFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,opacityParts.z,opacityParts.w);alpha+=opacityParts.x*(1.0-opacityFresnelTerm)+opacityFresnelTerm*opacityParts.y;
#endif
#ifdef ALPHATEST
#ifdef ALPHATEST_AFTERALLALPHACOMPUTATIONS
if (alpha<alphaCutOff)
discard;
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
vec3 emissiveColor=vEmissiveColor;
#ifdef EMISSIVE
emissiveColor+=texture2D(emissiveSampler,vEmissiveUV+uvOffset).rgb*vEmissiveInfos.y;
#endif
#ifdef EMISSIVEFRESNEL
float emissiveFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,emissiveRightColor.a,emissiveLeftColor.a);emissiveColor*=emissiveLeftColor.rgb*(1.0-emissiveFresnelTerm)+emissiveFresnelTerm*emissiveRightColor.rgb;
#endif
#ifdef DIFFUSEFRESNEL
float diffuseFresnelTerm=computeFresnelTerm(viewDirectionW,normalW,diffuseRightColor.a,diffuseLeftColor.a);diffuseBase*=diffuseLeftColor.rgb*(1.0-diffuseFresnelTerm)+diffuseFresnelTerm*diffuseRightColor.rgb;
#endif
#ifdef EMISSIVEASILLUMINATION
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor+vAmbientColor,0.0,1.0)*baseColor.rgb;
#else
#ifdef LINKEMISSIVEWITHDIFFUSE
vec3 finalDiffuse=clamp((diffuseBase+emissiveColor)*diffuseColor+vAmbientColor,0.0,1.0)*baseColor.rgb;
#else
vec3 finalDiffuse=clamp(diffuseBase*diffuseColor+emissiveColor+vAmbientColor,0.0,1.0)*baseColor.rgb;
#endif
#endif
#ifdef SPECULARTERM
vec3 finalSpecular=specularBase*specularColor;
#ifdef SPECULAROVERALPHA
alpha=clamp(alpha+dot(finalSpecular,vec3(0.3,0.59,0.11)),0.,1.);
#endif
#else
vec3 finalSpecular=vec3(0.0);
#endif
#ifdef REFLECTIONOVERALPHA
alpha=clamp(alpha+dot(reflectionColor.rgb,vec3(0.3,0.59,0.11)),0.,1.);
#endif
#ifdef EMISSIVEASILLUMINATION
vec4 color=vec4(clamp(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+emissiveColor+refractionColor.rgb,0.0,1.0),alpha);
#else
vec4 color=vec4(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+refractionColor.rgb,alpha);
#endif
#ifdef LIGHTMAP
#ifndef LIGHTMAPEXCLUDED
#ifdef USELIGHTMAPASSHADOWMAP
color.rgb*=lightmapColor.rgb;
#else
color.rgb+=lightmapColor.rgb;
#endif
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_FOG
color.rgb=max(color.rgb,0.);
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
color.rgb=toLinearSpace(color.rgb);
#else
#ifdef IMAGEPROCESSING
color.rgb=toLinearSpace(color.rgb);color=applyImageProcessing(color);
#endif
#endif
color.a*=visibility;
#ifdef PREMULTIPLYALPHA
color.rgb*=color.a;
#endif
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
float writeGeometryInfo=color.a>0.4 ? 1.0 : 0.0;gl_FragData[0]=color; 
#ifdef PREPASS_POSITION
gl_FragData[PREPASS_POSITION_INDEX]=vec4(vPositionW,writeGeometryInfo);
#endif
#ifdef PREPASS_VELOCITY
vec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;vec2 b=(vPreviousPosition.xy/vPreviousPosition.w)*0.5+0.5;vec2 velocity=abs(a-b);velocity=vec2(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;gl_FragData[PREPASS_VELOCITY_INDEX]=vec4(velocity,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_IRRADIANCE
gl_FragData[PREPASS_IRRADIANCE_INDEX]=vec4(0.0,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_DEPTH
gl_FragData[PREPASS_DEPTH_INDEX]=vec4(vViewPos.z,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_NORMAL
#ifdef PREPASS_NORMAL_WORLDSPACE
gl_FragData[PREPASS_NORMAL_INDEX]=vec4(normalW,writeGeometryInfo); 
#else
gl_FragData[PREPASS_NORMAL_INDEX]=vec4(normalize((view*vec4(normalW,0.0)).rgb),writeGeometryInfo); 
#endif
#endif
#ifdef PREPASS_ALBEDO_SQRT
gl_FragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4(0.0,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_REFLECTIVITY
#if defined(SPECULARTERM)
#if defined(SPECULAR)
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(toLinearSpace(specularMapColor))*writeGeometryInfo; 
#else
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(toLinearSpace(specularColor),1.0)*writeGeometryInfo;
#endif
#else
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(0.0,0.0,0.0,1.0)*writeGeometryInfo;
#endif
#endif
#endif
#if !defined(PREPASS) || defined(WEBGL2)
gl_FragColor=color;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {frontColor.rgb+=color.rgb*color.a*alphaMultiplier;frontColor.a=1.0-alphaMultiplier*(1.0-color.a);} else {backColor+=color;}
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`;
ShaderStore.ShadersStore[name28] = shader28;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/decalVertexDeclaration.js
var name29 = "decalVertexDeclaration";
var shader29 = `#ifdef DECAL
uniform vec4 vDecalInfos;uniform mat4 decalMatrix;
#endif
`;
ShaderStore.IncludesShadersStore[name29] = shader29;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/defaultVertexDeclaration.js
var name30 = "defaultVertexDeclaration";
var shader30 = `uniform mat4 viewProjection;uniform mat4 view;
#ifdef DIFFUSE
uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
#ifdef AMBIENT
uniform mat4 ambientMatrix;uniform vec2 vAmbientInfos;
#endif
#ifdef OPACITY
uniform mat4 opacityMatrix;uniform vec2 vOpacityInfos;
#endif
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;uniform mat4 emissiveMatrix;
#endif
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;uniform mat4 lightmapMatrix;
#endif
#if defined(SPECULAR) && defined(SPECULARTERM)
uniform vec2 vSpecularInfos;uniform mat4 specularMatrix;
#endif
#ifdef BUMP
uniform vec3 vBumpInfos;uniform mat4 bumpMatrix;
#endif
#ifdef REFLECTION
uniform mat4 reflectionMatrix;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
#ifdef DETAIL
uniform vec4 vDetailInfos;uniform mat4 detailMatrix;
#endif
#include<decalVertexDeclaration>
#define ADDITIONAL_VERTEX_DECLARATION
`;
ShaderStore.IncludesShadersStore[name30] = shader30;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/uvAttributeDeclaration.js
var name31 = "uvAttributeDeclaration";
var shader31 = `#ifdef UV{X}
attribute vec2 uv{X};
#endif
`;
ShaderStore.IncludesShadersStore[name31] = shader31;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/prePassVertexDeclaration.js
var name32 = "prePassVertexDeclaration";
var shader32 = `#ifdef PREPASS
#ifdef PREPASS_DEPTH
varying vec3 vViewPos;
#endif
#ifdef PREPASS_VELOCITY
uniform mat4 previousViewProjection;varying vec4 vCurrentPosition;varying vec4 vPreviousPosition;
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name32] = shader32;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/samplerVertexDeclaration.js
var name33 = "samplerVertexDeclaration";
var shader33 = `#if defined(_DEFINENAME_) && _DEFINENAME_DIRECTUV==0
varying vec2 v_VARYINGNAME_UV;
#endif
`;
ShaderStore.IncludesShadersStore[name33] = shader33;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/bumpVertexDeclaration.js
var name34 = "bumpVertexDeclaration";
var shader34 = `#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name34] = shader34;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fogVertexDeclaration.js
var name35 = "fogVertexDeclaration";
var shader35 = `#ifdef FOG
varying vec3 vFogDistance;
#endif
`;
ShaderStore.IncludesShadersStore[name35] = shader35;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/lightVxFragmentDeclaration.js
var name36 = "lightVxFragmentDeclaration";
var shader36 = `#ifdef LIGHT{X}
uniform vec4 vLightData{X};uniform vec4 vLightDiffuse{X};
#ifdef SPECULARTERM
uniform vec4 vLightSpecular{X};
#else
vec4 vLightSpecular{X}=vec4(0.);
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};
#elif defined(SHADOWCUBE{X})
#else
varying vec4 vPositionFromLight{X};varying float vDepthMetric{X};uniform mat4 lightMatrix{X};
#endif
uniform vec4 shadowsInfo{X};uniform vec2 depthValues{X};
#endif
#ifdef SPOTLIGHT{X}
uniform vec4 vLightDirection{X};uniform vec4 vLightFalloff{X};
#elif defined(POINTLIGHT{X})
uniform vec4 vLightFalloff{X};
#elif defined(HEMILIGHT{X})
uniform vec3 vLightGround{X};
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name36] = shader36;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/lightVxUboDeclaration.js
var name37 = "lightVxUboDeclaration";
var shader37 = `#ifdef LIGHT{X}
uniform Light{X}
{vec4 vLightData;vec4 vLightDiffuse;vec4 vLightSpecular;
#ifdef SPOTLIGHT{X}
vec4 vLightDirection;vec4 vLightFalloff;
#elif defined(POINTLIGHT{X})
vec4 vLightFalloff;
#elif defined(HEMILIGHT{X})
vec3 vLightGround;
#endif
vec4 shadowsInfo;vec2 depthValues;} light{X};
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform mat4 lightMatrix{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromLight{X}[SHADOWCSMNUM_CASCADES{X}];varying float vDepthMetric{X}[SHADOWCSMNUM_CASCADES{X}];varying vec4 vPositionFromCamera{X};
#elif defined(SHADOWCUBE{X})
#else
varying vec4 vPositionFromLight{X};varying float vDepthMetric{X};uniform mat4 lightMatrix{X};
#endif
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name37] = shader37;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/prePassVertex.js
var name38 = "prePassVertex";
var shader38 = `#ifdef PREPASS_DEPTH
vViewPos=(view*worldPos).rgb;
#endif
#if defined(PREPASS_VELOCITY) && defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*worldPos;
#if NUM_BONE_INFLUENCERS>0
mat4 previousInfluence;previousInfluence=mPreviousBones[int(matricesIndices[0])]*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
previousInfluence+=mPreviousBones[int(matricesIndices[1])]*matricesWeights[1];
#endif 
#if NUM_BONE_INFLUENCERS>2
previousInfluence+=mPreviousBones[int(matricesIndices[2])]*matricesWeights[2];
#endif 
#if NUM_BONE_INFLUENCERS>3
previousInfluence+=mPreviousBones[int(matricesIndices[3])]*matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];
#endif 
#if NUM_BONE_INFLUENCERS>5
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];
#endif 
#if NUM_BONE_INFLUENCERS>6
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];
#endif 
#if NUM_BONE_INFLUENCERS>7
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];
#endif
vPreviousPosition=previousViewProjection*finalPreviousWorld*previousInfluence*vec4(positionUpdated,1.0);
#else
vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name38] = shader38;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/uvVariableDeclaration.js
var name39 = "uvVariableDeclaration";
var shader39 = `#if !defined(UV{X}) && defined(MAINUV{X})
vec2 uv{X}=vec2(0.,0.);
#endif
#ifdef MAINUV{X}
vMainUV{X}=uv{X};
#endif
`;
ShaderStore.IncludesShadersStore[name39] = shader39;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/samplerVertexImplementation.js
var name40 = "samplerVertexImplementation";
var shader40 = `#if defined(_DEFINENAME_) && _DEFINENAME_DIRECTUV==0
if (v_INFONAME_==0.)
{v_VARYINGNAME_UV=vec2(_MATRIXNAME_Matrix*vec4(uvUpdated,1.0,0.0));}
#ifdef UV2
else if (v_INFONAME_==1.)
{v_VARYINGNAME_UV=vec2(_MATRIXNAME_Matrix*vec4(uv2,1.0,0.0));}
#endif
#ifdef UV3
else if (v_INFONAME_==2.)
{v_VARYINGNAME_UV=vec2(_MATRIXNAME_Matrix*vec4(uv3,1.0,0.0));}
#endif
#ifdef UV4
else if (v_INFONAME_==3.)
{v_VARYINGNAME_UV=vec2(_MATRIXNAME_Matrix*vec4(uv4,1.0,0.0));}
#endif
#ifdef UV5
else if (v_INFONAME_==4.)
{v_VARYINGNAME_UV=vec2(_MATRIXNAME_Matrix*vec4(uv5,1.0,0.0));}
#endif
#ifdef UV6
else if (v_INFONAME_==5.)
{v_VARYINGNAME_UV=vec2(_MATRIXNAME_Matrix*vec4(uv6,1.0,0.0));}
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name40] = shader40;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/bumpVertex.js
var name41 = "bumpVertex";
var shader41 = `#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
vec3 tbnNormal=normalize(normalUpdated);vec3 tbnTangent=normalize(tangentUpdated.xyz);vec3 tbnBitangent=cross(tbnNormal,tbnTangent)*tangentUpdated.w;vTBN=mat3(finalWorld)*mat3(tbnTangent,tbnBitangent,tbnNormal);
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name41] = shader41;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/fogVertex.js
var name42 = "fogVertex";
var shader42 = `#ifdef FOG
vFogDistance=(view*worldPos).xyz;
#endif
`;
ShaderStore.IncludesShadersStore[name42] = shader42;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/shadowsVertex.js
var name43 = "shadowsVertex";
var shader43 = `#ifdef SHADOWS
#if defined(SHADOWCSM{X})
vPositionFromCamera{X}=view*worldPos;for (int i=0; i<SHADOWCSMNUM_CASCADES{X}; i++) {vPositionFromLight{X}[i]=lightMatrix{X}[i]*worldPos;
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric{X}[i]=(-vPositionFromLight{X}[i].z+light{X}.depthValues.x)/light{X}.depthValues.y;
#else
vDepthMetric{X}[i]=(vPositionFromLight{X}[i].z+light{X}.depthValues.x)/light{X}.depthValues.y;
#endif
}
#elif defined(SHADOW{X}) && !defined(SHADOWCUBE{X})
vPositionFromLight{X}=lightMatrix{X}*worldPos;
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric{X}=(-vPositionFromLight{X}.z+light{X}.depthValues.x)/light{X}.depthValues.y;
#else
vDepthMetric{X}=(vPositionFromLight{X}.z+light{X}.depthValues.x)/light{X}.depthValues.y;
#endif
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name43] = shader43;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/vertexColorMixing.js
var name44 = "vertexColorMixing";
var shader44 = `#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
vColor=vec4(1.0);
#ifdef VERTEXCOLOR
#ifdef VERTEXALPHA
vColor*=color;
#else
vColor.rgb*=color.rgb;
#endif
#endif
#ifdef INSTANCESCOLOR
vColor*=instanceColor;
#endif
#endif
`;
ShaderStore.IncludesShadersStore[name44] = shader44;

// node_modules/@babylonjs/core/Shaders/ShadersInclude/logDepthVertex.js
var name45 = "logDepthVertex";
var shader45 = `#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;gl_Position.z=log2(max(0.000001,vFragmentDepth))*logarithmicDepthConstant;
#endif
`;
ShaderStore.IncludesShadersStore[name45] = shader45;

// node_modules/@babylonjs/core/Shaders/default.vertex.js
var name46 = "defaultVertexShader";
var shader46 = `#include<__decl__defaultVertex>
#define CUSTOM_VERTEX_BEGIN
attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef TANGENT
attribute vec4 tangent;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#include<uvAttributeDeclaration>[2..7]
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<helperFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<mainUVVaryingDeclaration>[1..7]
#include<samplerVertexDeclaration>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient)
#include<samplerVertexDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive)
#include<samplerVertexDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap)
#if defined(SPECULARTERM)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular)
#endif
#include<samplerVertexDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#include<bumpVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vec3 vPositionUVW;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vec3 vDirectionW;
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
vec3 positionUpdated=position;
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#ifdef TANGENT
vec4 tangentUpdated=tangent;
#endif
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && defined(PREPASS_VELOCITY) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normalWorld=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vNormalW=normalUpdated/vec3(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vNormalW=normalize(normalWorld*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vNormalW=normalize(normalWorld*normalUpdated);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
vPositionW=vec3(worldPos);
#include<prePassVertex>
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vDirectionW=normalize(vec3(finalWorld*vec4(positionUpdated,0.0)));
#endif
#ifndef UV1
vec2 uvUpdated=vec2(0.,0.);
#endif
#ifdef MAINUV1
vMainUV1=uvUpdated;
#endif
#include<uvVariableDeclaration>[2..7]
#include<samplerVertexImplementation>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse,_MATRIXNAME_,diffuse,_INFONAME_,DiffuseInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_MATRIXNAME_,ambient,_INFONAME_,AmbientInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_MATRIXNAME_,opacity,_INFONAME_,OpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_MATRIXNAME_,emissive,_INFONAME_,EmissiveInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_MATRIXNAME_,lightmap,_INFONAME_,LightmapInfos.x)
#if defined(SPECULARTERM)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular,_MATRIXNAME_,specular,_INFONAME_,SpecularInfos.x)
#endif
#include<samplerVertexImplementation>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_MATRIXNAME_,bump,_INFONAME_,BumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include<bumpVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<pointCloudVertex>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`;
ShaderStore.ShadersStore[name46] = shader46;

// node_modules/@babylonjs/core/Materials/standardMaterial.js
var onCreatedEffectParameters = { effect: null, subMesh: null };
var StandardMaterialDefines = class extends MaterialDefines {
  /**
   * Initializes the Standard Material defines.
   * @param externalProperties The external properties
   */
  constructor(externalProperties) {
    super(externalProperties);
    this.MAINUV1 = false;
    this.MAINUV2 = false;
    this.MAINUV3 = false;
    this.MAINUV4 = false;
    this.MAINUV5 = false;
    this.MAINUV6 = false;
    this.DIFFUSE = false;
    this.DIFFUSEDIRECTUV = 0;
    this.BAKED_VERTEX_ANIMATION_TEXTURE = false;
    this.AMBIENT = false;
    this.AMBIENTDIRECTUV = 0;
    this.OPACITY = false;
    this.OPACITYDIRECTUV = 0;
    this.OPACITYRGB = false;
    this.REFLECTION = false;
    this.EMISSIVE = false;
    this.EMISSIVEDIRECTUV = 0;
    this.SPECULAR = false;
    this.SPECULARDIRECTUV = 0;
    this.BUMP = false;
    this.BUMPDIRECTUV = 0;
    this.PARALLAX = false;
    this.PARALLAX_RHS = false;
    this.PARALLAXOCCLUSION = false;
    this.SPECULAROVERALPHA = false;
    this.CLIPPLANE = false;
    this.CLIPPLANE2 = false;
    this.CLIPPLANE3 = false;
    this.CLIPPLANE4 = false;
    this.CLIPPLANE5 = false;
    this.CLIPPLANE6 = false;
    this.ALPHATEST = false;
    this.DEPTHPREPASS = false;
    this.ALPHAFROMDIFFUSE = false;
    this.POINTSIZE = false;
    this.FOG = false;
    this.SPECULARTERM = false;
    this.DIFFUSEFRESNEL = false;
    this.OPACITYFRESNEL = false;
    this.REFLECTIONFRESNEL = false;
    this.REFRACTIONFRESNEL = false;
    this.EMISSIVEFRESNEL = false;
    this.FRESNEL = false;
    this.NORMAL = false;
    this.TANGENT = false;
    this.UV1 = false;
    this.UV2 = false;
    this.UV3 = false;
    this.UV4 = false;
    this.UV5 = false;
    this.UV6 = false;
    this.VERTEXCOLOR = false;
    this.VERTEXALPHA = false;
    this.NUM_BONE_INFLUENCERS = 0;
    this.BonesPerMesh = 0;
    this.BONETEXTURE = false;
    this.BONES_VELOCITY_ENABLED = false;
    this.INSTANCES = false;
    this.THIN_INSTANCES = false;
    this.INSTANCESCOLOR = false;
    this.GLOSSINESS = false;
    this.ROUGHNESS = false;
    this.EMISSIVEASILLUMINATION = false;
    this.LINKEMISSIVEWITHDIFFUSE = false;
    this.REFLECTIONFRESNELFROMSPECULAR = false;
    this.LIGHTMAP = false;
    this.LIGHTMAPDIRECTUV = 0;
    this.OBJECTSPACE_NORMALMAP = false;
    this.USELIGHTMAPASSHADOWMAP = false;
    this.REFLECTIONMAP_3D = false;
    this.REFLECTIONMAP_SPHERICAL = false;
    this.REFLECTIONMAP_PLANAR = false;
    this.REFLECTIONMAP_CUBIC = false;
    this.USE_LOCAL_REFLECTIONMAP_CUBIC = false;
    this.USE_LOCAL_REFRACTIONMAP_CUBIC = false;
    this.REFLECTIONMAP_PROJECTION = false;
    this.REFLECTIONMAP_SKYBOX = false;
    this.REFLECTIONMAP_EXPLICIT = false;
    this.REFLECTIONMAP_EQUIRECTANGULAR = false;
    this.REFLECTIONMAP_EQUIRECTANGULAR_FIXED = false;
    this.REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED = false;
    this.REFLECTIONMAP_OPPOSITEZ = false;
    this.INVERTCUBICMAP = false;
    this.LOGARITHMICDEPTH = false;
    this.REFRACTION = false;
    this.REFRACTIONMAP_3D = false;
    this.REFLECTIONOVERALPHA = false;
    this.TWOSIDEDLIGHTING = false;
    this.SHADOWFLOAT = false;
    this.MORPHTARGETS = false;
    this.MORPHTARGETS_NORMAL = false;
    this.MORPHTARGETS_TANGENT = false;
    this.MORPHTARGETS_UV = false;
    this.NUM_MORPH_INFLUENCERS = 0;
    this.MORPHTARGETS_TEXTURE = false;
    this.NONUNIFORMSCALING = false;
    this.PREMULTIPLYALPHA = false;
    this.ALPHATEST_AFTERALLALPHACOMPUTATIONS = false;
    this.ALPHABLEND = true;
    this.PREPASS = false;
    this.PREPASS_IRRADIANCE = false;
    this.PREPASS_IRRADIANCE_INDEX = -1;
    this.PREPASS_ALBEDO_SQRT = false;
    this.PREPASS_ALBEDO_SQRT_INDEX = -1;
    this.PREPASS_DEPTH = false;
    this.PREPASS_DEPTH_INDEX = -1;
    this.PREPASS_NORMAL = false;
    this.PREPASS_NORMAL_INDEX = -1;
    this.PREPASS_NORMAL_WORLDSPACE = false;
    this.PREPASS_POSITION = false;
    this.PREPASS_POSITION_INDEX = -1;
    this.PREPASS_VELOCITY = false;
    this.PREPASS_VELOCITY_INDEX = -1;
    this.PREPASS_REFLECTIVITY = false;
    this.PREPASS_REFLECTIVITY_INDEX = -1;
    this.SCENE_MRT_COUNT = 0;
    this.RGBDLIGHTMAP = false;
    this.RGBDREFLECTION = false;
    this.RGBDREFRACTION = false;
    this.IMAGEPROCESSING = false;
    this.VIGNETTE = false;
    this.VIGNETTEBLENDMODEMULTIPLY = false;
    this.VIGNETTEBLENDMODEOPAQUE = false;
    this.TONEMAPPING = false;
    this.TONEMAPPING_ACES = false;
    this.CONTRAST = false;
    this.COLORCURVES = false;
    this.COLORGRADING = false;
    this.COLORGRADING3D = false;
    this.SAMPLER3DGREENDEPTH = false;
    this.SAMPLER3DBGRMAP = false;
    this.DITHER = false;
    this.IMAGEPROCESSINGPOSTPROCESS = false;
    this.SKIPFINALCOLORCLAMP = false;
    this.MULTIVIEW = false;
    this.ORDER_INDEPENDENT_TRANSPARENCY = false;
    this.ORDER_INDEPENDENT_TRANSPARENCY_16BITS = false;
    this.CAMERA_ORTHOGRAPHIC = false;
    this.CAMERA_PERSPECTIVE = false;
    this.IS_REFLECTION_LINEAR = false;
    this.IS_REFRACTION_LINEAR = false;
    this.EXPOSURE = false;
    this.DECAL_AFTER_DETAIL = false;
    this.rebuild();
  }
  setReflectionMode(modeToEnable) {
    const modes = [
      "REFLECTIONMAP_CUBIC",
      "REFLECTIONMAP_EXPLICIT",
      "REFLECTIONMAP_PLANAR",
      "REFLECTIONMAP_PROJECTION",
      "REFLECTIONMAP_PROJECTION",
      "REFLECTIONMAP_SKYBOX",
      "REFLECTIONMAP_SPHERICAL",
      "REFLECTIONMAP_EQUIRECTANGULAR",
      "REFLECTIONMAP_EQUIRECTANGULAR_FIXED",
      "REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED"
    ];
    for (const mode of modes) {
      this[mode] = mode === modeToEnable;
    }
  }
};
var StandardMaterial = class _StandardMaterial extends PushMaterial {
  /**
   * Gets the image processing configuration used either in this material.
   */
  get imageProcessingConfiguration() {
    return this._imageProcessingConfiguration;
  }
  /**
   * Sets the Default image processing configuration used either in the this material.
   *
   * If sets to null, the scene one is in use.
   */
  set imageProcessingConfiguration(value) {
    this._attachImageProcessingConfiguration(value);
    this._markAllSubMeshesAsTexturesDirty();
  }
  /**
   * Attaches a new image processing configuration to the Standard Material.
   * @param configuration
   */
  _attachImageProcessingConfiguration(configuration) {
    if (configuration === this._imageProcessingConfiguration) {
      return;
    }
    if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
      this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
    }
    if (!configuration) {
      this._imageProcessingConfiguration = this.getScene().imageProcessingConfiguration;
    } else {
      this._imageProcessingConfiguration = configuration;
    }
    if (this._imageProcessingConfiguration) {
      this._imageProcessingObserver = this._imageProcessingConfiguration.onUpdateParameters.add(() => {
        this._markAllSubMeshesAsImageProcessingDirty();
      });
    }
  }
  /**
   * Can this material render to prepass
   */
  get isPrePassCapable() {
    return !this.disableDepthWrite;
  }
  /**
   * Gets whether the color curves effect is enabled.
   */
  get cameraColorCurvesEnabled() {
    return this.imageProcessingConfiguration.colorCurvesEnabled;
  }
  /**
   * Sets whether the color curves effect is enabled.
   */
  set cameraColorCurvesEnabled(value) {
    this.imageProcessingConfiguration.colorCurvesEnabled = value;
  }
  /**
   * Gets whether the color grading effect is enabled.
   */
  get cameraColorGradingEnabled() {
    return this.imageProcessingConfiguration.colorGradingEnabled;
  }
  /**
   * Gets whether the color grading effect is enabled.
   */
  set cameraColorGradingEnabled(value) {
    this.imageProcessingConfiguration.colorGradingEnabled = value;
  }
  /**
   * Gets whether tonemapping is enabled or not.
   */
  get cameraToneMappingEnabled() {
    return this._imageProcessingConfiguration.toneMappingEnabled;
  }
  /**
   * Sets whether tonemapping is enabled or not
   */
  set cameraToneMappingEnabled(value) {
    this._imageProcessingConfiguration.toneMappingEnabled = value;
  }
  /**
   * The camera exposure used on this material.
   * This property is here and not in the camera to allow controlling exposure without full screen post process.
   * This corresponds to a photographic exposure.
   */
  get cameraExposure() {
    return this._imageProcessingConfiguration.exposure;
  }
  /**
   * The camera exposure used on this material.
   * This property is here and not in the camera to allow controlling exposure without full screen post process.
   * This corresponds to a photographic exposure.
   */
  set cameraExposure(value) {
    this._imageProcessingConfiguration.exposure = value;
  }
  /**
   * Gets The camera contrast used on this material.
   */
  get cameraContrast() {
    return this._imageProcessingConfiguration.contrast;
  }
  /**
   * Sets The camera contrast used on this material.
   */
  set cameraContrast(value) {
    this._imageProcessingConfiguration.contrast = value;
  }
  /**
   * Gets the Color Grading 2D Lookup Texture.
   */
  get cameraColorGradingTexture() {
    return this._imageProcessingConfiguration.colorGradingTexture;
  }
  /**
   * Sets the Color Grading 2D Lookup Texture.
   */
  set cameraColorGradingTexture(value) {
    this._imageProcessingConfiguration.colorGradingTexture = value;
  }
  /**
   * The color grading curves provide additional color adjustmnent that is applied after any color grading transform (3D LUT).
   * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
   * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
   * corresponding to low luminance, medium luminance, and high luminance areas respectively.
   */
  get cameraColorCurves() {
    return this._imageProcessingConfiguration.colorCurves;
  }
  /**
   * The color grading curves provide additional color adjustment that is applied after any color grading transform (3D LUT).
   * They allow basic adjustment of saturation and small exposure adjustments, along with color filter tinting to provide white balance adjustment or more stylistic effects.
   * These are similar to controls found in many professional imaging or colorist software. The global controls are applied to the entire image. For advanced tuning, extra controls are provided to adjust the shadow, midtone and highlight areas of the image;
   * corresponding to low luminance, medium luminance, and high luminance areas respectively.
   */
  set cameraColorCurves(value) {
    this._imageProcessingConfiguration.colorCurves = value;
  }
  /**
   * Can this material render to several textures at once
   */
  get canRenderToMRT() {
    return true;
  }
  /**
   * Instantiates a new standard material.
   * This is the default material used in Babylon. It is the best trade off between quality
   * and performances.
   * @see https://doc.babylonjs.com/features/featuresDeepDive/materials/using/materials_introduction
   * @param name Define the name of the material in the scene
   * @param scene Define the scene the material belong to
   */
  constructor(name47, scene) {
    super(name47, scene);
    this._diffuseTexture = null;
    this._ambientTexture = null;
    this._opacityTexture = null;
    this._reflectionTexture = null;
    this._emissiveTexture = null;
    this._specularTexture = null;
    this._bumpTexture = null;
    this._lightmapTexture = null;
    this._refractionTexture = null;
    this.ambientColor = new Color3(0, 0, 0);
    this.diffuseColor = new Color3(1, 1, 1);
    this.specularColor = new Color3(1, 1, 1);
    this.emissiveColor = new Color3(0, 0, 0);
    this.specularPower = 64;
    this._useAlphaFromDiffuseTexture = false;
    this._useEmissiveAsIllumination = false;
    this._linkEmissiveWithDiffuse = false;
    this._useSpecularOverAlpha = false;
    this._useReflectionOverAlpha = false;
    this._disableLighting = false;
    this._useObjectSpaceNormalMap = false;
    this._useParallax = false;
    this._useParallaxOcclusion = false;
    this.parallaxScaleBias = 0.05;
    this._roughness = 0;
    this.indexOfRefraction = 0.98;
    this.invertRefractionY = true;
    this.alphaCutOff = 0.4;
    this._useLightmapAsShadowmap = false;
    this._useReflectionFresnelFromSpecular = false;
    this._useGlossinessFromSpecularMapAlpha = false;
    this._maxSimultaneousLights = 4;
    this._invertNormalMapX = false;
    this._invertNormalMapY = false;
    this._twoSidedLighting = false;
    this._applyDecalMapAfterDetailMap = false;
    this._renderTargets = new SmartArray(16);
    this._worldViewProjectionMatrix = Matrix.Zero();
    this._globalAmbientColor = new Color3(0, 0, 0);
    this._cacheHasRenderTargetTextures = false;
    this.detailMap = new DetailMapConfiguration(this);
    this._attachImageProcessingConfiguration(null);
    this.prePassConfiguration = new PrePassConfiguration();
    this.getRenderTargetTextures = () => {
      this._renderTargets.reset();
      if (_StandardMaterial.ReflectionTextureEnabled && this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
        this._renderTargets.push(this._reflectionTexture);
      }
      if (_StandardMaterial.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
        this._renderTargets.push(this._refractionTexture);
      }
      this._eventInfo.renderTargets = this._renderTargets;
      this._callbackPluginEventFillRenderTargetTextures(this._eventInfo);
      return this._renderTargets;
    };
  }
  /**
   * Gets a boolean indicating that current material needs to register RTT
   */
  get hasRenderTargetTextures() {
    if (_StandardMaterial.ReflectionTextureEnabled && this._reflectionTexture && this._reflectionTexture.isRenderTarget) {
      return true;
    }
    if (_StandardMaterial.RefractionTextureEnabled && this._refractionTexture && this._refractionTexture.isRenderTarget) {
      return true;
    }
    return this._cacheHasRenderTargetTextures;
  }
  /**
   * Gets the current class name of the material e.g. "StandardMaterial"
   * Mainly use in serialization.
   * @returns the class name
   */
  getClassName() {
    return "StandardMaterial";
  }
  /**
   * Specifies if the material will require alpha blending
   * @returns a boolean specifying if alpha blending is needed
   */
  needAlphaBlending() {
    if (this._disableAlphaBlending) {
      return false;
    }
    return this.alpha < 1 || this._opacityTexture != null || this._shouldUseAlphaFromDiffuseTexture() || this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled;
  }
  /**
   * Specifies if this material should be rendered in alpha test mode
   * @returns a boolean specifying if an alpha test is needed.
   */
  needAlphaTesting() {
    if (this._forceAlphaTest) {
      return true;
    }
    return this._hasAlphaChannel() && (this._transparencyMode == null || this._transparencyMode === Material.MATERIAL_ALPHATEST);
  }
  /**
   * Specifies whether or not the alpha value of the diffuse texture should be used for alpha blending.
   */
  _shouldUseAlphaFromDiffuseTexture() {
    return this._diffuseTexture != null && this._diffuseTexture.hasAlpha && this._useAlphaFromDiffuseTexture && this._transparencyMode !== Material.MATERIAL_OPAQUE;
  }
  /**
   * Specifies whether or not there is a usable alpha channel for transparency.
   */
  _hasAlphaChannel() {
    return this._diffuseTexture != null && this._diffuseTexture.hasAlpha || this._opacityTexture != null;
  }
  /**
   * Get the texture used for alpha test purpose.
   * @returns the diffuse texture in case of the standard material.
   */
  getAlphaTestTexture() {
    return this._diffuseTexture;
  }
  /**
   * Get if the submesh is ready to be used and all its information available.
   * Child classes can use it to update shaders
   * @param mesh defines the mesh to check
   * @param subMesh defines which submesh to check
   * @param useInstances specifies that instances should be used
   * @returns a boolean indicating that the submesh is ready or not
   */
  isReadyForSubMesh(mesh, subMesh, useInstances = false) {
    if (!this._uniformBufferLayoutBuilt) {
      this.buildUniformLayout();
    }
    if (subMesh.effect && this.isFrozen) {
      if (subMesh.effect._wasPreviouslyReady && subMesh.effect._wasPreviouslyUsingInstances === useInstances) {
        return true;
      }
    }
    if (!subMesh.materialDefines) {
      this._callbackPluginEventGeneric(MaterialPluginEvent.GetDefineNames, this._eventInfo);
      subMesh.materialDefines = new StandardMaterialDefines(this._eventInfo.defineNames);
    }
    const scene = this.getScene();
    const defines = subMesh.materialDefines;
    if (this._isReadyForSubMesh(subMesh)) {
      return true;
    }
    const engine = scene.getEngine();
    defines._needNormals = MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, true, this._maxSimultaneousLights, this._disableLighting);
    MaterialHelper.PrepareDefinesForMultiview(scene, defines);
    const oit = this.needAlphaBlendingForMesh(mesh) && this.getScene().useOrderIndependentTransparency;
    MaterialHelper.PrepareDefinesForPrePass(scene, defines, this.canRenderToMRT && !oit);
    MaterialHelper.PrepareDefinesForOIT(scene, defines, oit);
    if (defines._areTexturesDirty) {
      this._eventInfo.hasRenderTargetTextures = false;
      this._callbackPluginEventHasRenderTargetTextures(this._eventInfo);
      this._cacheHasRenderTargetTextures = this._eventInfo.hasRenderTargetTextures;
      defines._needUVs = false;
      for (let i = 1; i <= 6; ++i) {
        defines["MAINUV" + i] = false;
      }
      if (scene.texturesEnabled) {
        defines.DIFFUSEDIRECTUV = 0;
        defines.BUMPDIRECTUV = 0;
        defines.AMBIENTDIRECTUV = 0;
        defines.OPACITYDIRECTUV = 0;
        defines.EMISSIVEDIRECTUV = 0;
        defines.SPECULARDIRECTUV = 0;
        defines.LIGHTMAPDIRECTUV = 0;
        if (this._diffuseTexture && _StandardMaterial.DiffuseTextureEnabled) {
          if (!this._diffuseTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._diffuseTexture, defines, "DIFFUSE");
          }
        } else {
          defines.DIFFUSE = false;
        }
        if (this._ambientTexture && _StandardMaterial.AmbientTextureEnabled) {
          if (!this._ambientTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._ambientTexture, defines, "AMBIENT");
          }
        } else {
          defines.AMBIENT = false;
        }
        if (this._opacityTexture && _StandardMaterial.OpacityTextureEnabled) {
          if (!this._opacityTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._opacityTexture, defines, "OPACITY");
            defines.OPACITYRGB = this._opacityTexture.getAlphaFromRGB;
          }
        } else {
          defines.OPACITY = false;
        }
        if (this._reflectionTexture && _StandardMaterial.ReflectionTextureEnabled) {
          if (!this._reflectionTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            defines._needNormals = true;
            defines.REFLECTION = true;
            defines.ROUGHNESS = this._roughness > 0;
            defines.REFLECTIONOVERALPHA = this._useReflectionOverAlpha;
            defines.INVERTCUBICMAP = this._reflectionTexture.coordinatesMode === Texture.INVCUBIC_MODE;
            defines.REFLECTIONMAP_3D = this._reflectionTexture.isCube;
            defines.REFLECTIONMAP_OPPOSITEZ = defines.REFLECTIONMAP_3D && this.getScene().useRightHandedSystem ? !this._reflectionTexture.invertZ : this._reflectionTexture.invertZ;
            defines.RGBDREFLECTION = this._reflectionTexture.isRGBD;
            switch (this._reflectionTexture.coordinatesMode) {
              case Texture.EXPLICIT_MODE:
                defines.setReflectionMode("REFLECTIONMAP_EXPLICIT");
                break;
              case Texture.PLANAR_MODE:
                defines.setReflectionMode("REFLECTIONMAP_PLANAR");
                break;
              case Texture.PROJECTION_MODE:
                defines.setReflectionMode("REFLECTIONMAP_PROJECTION");
                break;
              case Texture.SKYBOX_MODE:
                defines.setReflectionMode("REFLECTIONMAP_SKYBOX");
                break;
              case Texture.SPHERICAL_MODE:
                defines.setReflectionMode("REFLECTIONMAP_SPHERICAL");
                break;
              case Texture.EQUIRECTANGULAR_MODE:
                defines.setReflectionMode("REFLECTIONMAP_EQUIRECTANGULAR");
                break;
              case Texture.FIXED_EQUIRECTANGULAR_MODE:
                defines.setReflectionMode("REFLECTIONMAP_EQUIRECTANGULAR_FIXED");
                break;
              case Texture.FIXED_EQUIRECTANGULAR_MIRRORED_MODE:
                defines.setReflectionMode("REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED");
                break;
              case Texture.CUBIC_MODE:
              case Texture.INVCUBIC_MODE:
              default:
                defines.setReflectionMode("REFLECTIONMAP_CUBIC");
                break;
            }
            defines.USE_LOCAL_REFLECTIONMAP_CUBIC = this._reflectionTexture.boundingBoxSize ? true : false;
          }
        } else {
          defines.REFLECTION = false;
          defines.REFLECTIONMAP_OPPOSITEZ = false;
        }
        if (this._emissiveTexture && _StandardMaterial.EmissiveTextureEnabled) {
          if (!this._emissiveTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._emissiveTexture, defines, "EMISSIVE");
          }
        } else {
          defines.EMISSIVE = false;
        }
        if (this._lightmapTexture && _StandardMaterial.LightmapTextureEnabled) {
          if (!this._lightmapTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._lightmapTexture, defines, "LIGHTMAP");
            defines.USELIGHTMAPASSHADOWMAP = this._useLightmapAsShadowmap;
            defines.RGBDLIGHTMAP = this._lightmapTexture.isRGBD;
          }
        } else {
          defines.LIGHTMAP = false;
        }
        if (this._specularTexture && _StandardMaterial.SpecularTextureEnabled) {
          if (!this._specularTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._specularTexture, defines, "SPECULAR");
            defines.GLOSSINESS = this._useGlossinessFromSpecularMapAlpha;
          }
        } else {
          defines.SPECULAR = false;
        }
        if (scene.getEngine().getCaps().standardDerivatives && this._bumpTexture && _StandardMaterial.BumpTextureEnabled) {
          if (!this._bumpTexture.isReady()) {
            return false;
          } else {
            MaterialHelper.PrepareDefinesForMergedUV(this._bumpTexture, defines, "BUMP");
            defines.PARALLAX = this._useParallax;
            defines.PARALLAX_RHS = scene.useRightHandedSystem;
            defines.PARALLAXOCCLUSION = this._useParallaxOcclusion;
          }
          defines.OBJECTSPACE_NORMALMAP = this._useObjectSpaceNormalMap;
        } else {
          defines.BUMP = false;
          defines.PARALLAX = false;
          defines.PARALLAX_RHS = false;
          defines.PARALLAXOCCLUSION = false;
        }
        if (this._refractionTexture && _StandardMaterial.RefractionTextureEnabled) {
          if (!this._refractionTexture.isReadyOrNotBlocking()) {
            return false;
          } else {
            defines._needUVs = true;
            defines.REFRACTION = true;
            defines.REFRACTIONMAP_3D = this._refractionTexture.isCube;
            defines.RGBDREFRACTION = this._refractionTexture.isRGBD;
            defines.USE_LOCAL_REFRACTIONMAP_CUBIC = this._refractionTexture.boundingBoxSize ? true : false;
          }
        } else {
          defines.REFRACTION = false;
        }
        defines.TWOSIDEDLIGHTING = !this._backFaceCulling && this._twoSidedLighting;
      } else {
        defines.DIFFUSE = false;
        defines.AMBIENT = false;
        defines.OPACITY = false;
        defines.REFLECTION = false;
        defines.EMISSIVE = false;
        defines.LIGHTMAP = false;
        defines.BUMP = false;
        defines.REFRACTION = false;
      }
      defines.ALPHAFROMDIFFUSE = this._shouldUseAlphaFromDiffuseTexture();
      defines.EMISSIVEASILLUMINATION = this._useEmissiveAsIllumination;
      defines.LINKEMISSIVEWITHDIFFUSE = this._linkEmissiveWithDiffuse;
      defines.SPECULAROVERALPHA = this._useSpecularOverAlpha;
      defines.PREMULTIPLYALPHA = this.alphaMode === 7 || this.alphaMode === 8;
      defines.ALPHATEST_AFTERALLALPHACOMPUTATIONS = this.transparencyMode !== null;
      defines.ALPHABLEND = this.transparencyMode === null || this.needAlphaBlendingForMesh(mesh);
    }
    this._eventInfo.isReadyForSubMesh = true;
    this._eventInfo.defines = defines;
    this._eventInfo.subMesh = subMesh;
    this._callbackPluginEventIsReadyForSubMesh(this._eventInfo);
    if (!this._eventInfo.isReadyForSubMesh) {
      return false;
    }
    if (defines._areImageProcessingDirty && this._imageProcessingConfiguration) {
      if (!this._imageProcessingConfiguration.isReady()) {
        return false;
      }
      this._imageProcessingConfiguration.prepareDefines(defines);
      defines.IS_REFLECTION_LINEAR = this.reflectionTexture != null && !this.reflectionTexture.gammaSpace;
      defines.IS_REFRACTION_LINEAR = this.refractionTexture != null && !this.refractionTexture.gammaSpace;
    }
    if (defines._areFresnelDirty) {
      if (_StandardMaterial.FresnelEnabled) {
        if (this._diffuseFresnelParameters || this._opacityFresnelParameters || this._emissiveFresnelParameters || this._refractionFresnelParameters || this._reflectionFresnelParameters) {
          defines.DIFFUSEFRESNEL = this._diffuseFresnelParameters && this._diffuseFresnelParameters.isEnabled;
          defines.OPACITYFRESNEL = this._opacityFresnelParameters && this._opacityFresnelParameters.isEnabled;
          defines.REFLECTIONFRESNEL = this._reflectionFresnelParameters && this._reflectionFresnelParameters.isEnabled;
          defines.REFLECTIONFRESNELFROMSPECULAR = this._useReflectionFresnelFromSpecular;
          defines.REFRACTIONFRESNEL = this._refractionFresnelParameters && this._refractionFresnelParameters.isEnabled;
          defines.EMISSIVEFRESNEL = this._emissiveFresnelParameters && this._emissiveFresnelParameters.isEnabled;
          defines._needNormals = true;
          defines.FRESNEL = true;
        }
      } else {
        defines.FRESNEL = false;
      }
    }
    MaterialHelper.PrepareDefinesForMisc(mesh, scene, this._useLogarithmicDepth, this.pointsCloud, this.fogEnabled, this._shouldTurnAlphaTestOn(mesh) || this._forceAlphaTest, defines, this._applyDecalMapAfterDetailMap);
    MaterialHelper.PrepareDefinesForFrameBoundValues(scene, engine, this, defines, useInstances, null, subMesh.getRenderingMesh().hasThinInstances);
    this._eventInfo.defines = defines;
    this._eventInfo.mesh = mesh;
    this._callbackPluginEventPrepareDefinesBeforeAttributes(this._eventInfo);
    MaterialHelper.PrepareDefinesForAttributes(mesh, defines, true, true, true);
    this._callbackPluginEventPrepareDefines(this._eventInfo);
    let forceWasNotReadyPreviously = false;
    if (defines.isDirty) {
      const lightDisposed = defines._areLightsDisposed;
      defines.markAsProcessed();
      const fallbacks = new EffectFallbacks();
      if (defines.REFLECTION) {
        fallbacks.addFallback(0, "REFLECTION");
      }
      if (defines.SPECULAR) {
        fallbacks.addFallback(0, "SPECULAR");
      }
      if (defines.BUMP) {
        fallbacks.addFallback(0, "BUMP");
      }
      if (defines.PARALLAX) {
        fallbacks.addFallback(1, "PARALLAX");
      }
      if (defines.PARALLAX_RHS) {
        fallbacks.addFallback(1, "PARALLAX_RHS");
      }
      if (defines.PARALLAXOCCLUSION) {
        fallbacks.addFallback(0, "PARALLAXOCCLUSION");
      }
      if (defines.SPECULAROVERALPHA) {
        fallbacks.addFallback(0, "SPECULAROVERALPHA");
      }
      if (defines.FOG) {
        fallbacks.addFallback(1, "FOG");
      }
      if (defines.POINTSIZE) {
        fallbacks.addFallback(0, "POINTSIZE");
      }
      if (defines.LOGARITHMICDEPTH) {
        fallbacks.addFallback(0, "LOGARITHMICDEPTH");
      }
      MaterialHelper.HandleFallbacksForShadows(defines, fallbacks, this._maxSimultaneousLights);
      if (defines.SPECULARTERM) {
        fallbacks.addFallback(0, "SPECULARTERM");
      }
      if (defines.DIFFUSEFRESNEL) {
        fallbacks.addFallback(1, "DIFFUSEFRESNEL");
      }
      if (defines.OPACITYFRESNEL) {
        fallbacks.addFallback(2, "OPACITYFRESNEL");
      }
      if (defines.REFLECTIONFRESNEL) {
        fallbacks.addFallback(3, "REFLECTIONFRESNEL");
      }
      if (defines.EMISSIVEFRESNEL) {
        fallbacks.addFallback(4, "EMISSIVEFRESNEL");
      }
      if (defines.FRESNEL) {
        fallbacks.addFallback(4, "FRESNEL");
      }
      if (defines.MULTIVIEW) {
        fallbacks.addFallback(0, "MULTIVIEW");
      }
      const attribs = [VertexBuffer.PositionKind];
      if (defines.NORMAL) {
        attribs.push(VertexBuffer.NormalKind);
      }
      if (defines.TANGENT) {
        attribs.push(VertexBuffer.TangentKind);
      }
      for (let i = 1; i <= 6; ++i) {
        if (defines["UV" + i]) {
          attribs.push(`uv${i === 1 ? "" : i}`);
        }
      }
      if (defines.VERTEXCOLOR) {
        attribs.push(VertexBuffer.ColorKind);
      }
      MaterialHelper.PrepareAttributesForBones(attribs, mesh, defines, fallbacks);
      MaterialHelper.PrepareAttributesForInstances(attribs, defines);
      MaterialHelper.PrepareAttributesForMorphTargets(attribs, mesh, defines);
      MaterialHelper.PrepareAttributesForBakedVertexAnimation(attribs, mesh, defines);
      let shaderName = "default";
      const uniforms = [
        "world",
        "view",
        "viewProjection",
        "vEyePosition",
        "vLightsType",
        "vAmbientColor",
        "vDiffuseColor",
        "vSpecularColor",
        "vEmissiveColor",
        "visibility",
        "vFogInfos",
        "vFogColor",
        "pointSize",
        "vDiffuseInfos",
        "vAmbientInfos",
        "vOpacityInfos",
        "vReflectionInfos",
        "vEmissiveInfos",
        "vSpecularInfos",
        "vBumpInfos",
        "vLightmapInfos",
        "vRefractionInfos",
        "mBones",
        "diffuseMatrix",
        "ambientMatrix",
        "opacityMatrix",
        "reflectionMatrix",
        "emissiveMatrix",
        "specularMatrix",
        "bumpMatrix",
        "normalMatrix",
        "lightmapMatrix",
        "refractionMatrix",
        "diffuseLeftColor",
        "diffuseRightColor",
        "opacityParts",
        "reflectionLeftColor",
        "reflectionRightColor",
        "emissiveLeftColor",
        "emissiveRightColor",
        "refractionLeftColor",
        "refractionRightColor",
        "vReflectionPosition",
        "vReflectionSize",
        "vRefractionPosition",
        "vRefractionSize",
        "logarithmicDepthConstant",
        "vTangentSpaceParams",
        "alphaCutOff",
        "boneTextureWidth",
        "morphTargetTextureInfo",
        "morphTargetTextureIndices"
      ];
      const samplers = [
        "diffuseSampler",
        "ambientSampler",
        "opacitySampler",
        "reflectionCubeSampler",
        "reflection2DSampler",
        "emissiveSampler",
        "specularSampler",
        "bumpSampler",
        "lightmapSampler",
        "refractionCubeSampler",
        "refraction2DSampler",
        "boneSampler",
        "morphTargets",
        "oitDepthSampler",
        "oitFrontColorSampler"
      ];
      const uniformBuffers = ["Material", "Scene", "Mesh"];
      const indexParameters = { maxSimultaneousLights: this._maxSimultaneousLights, maxSimultaneousMorphTargets: defines.NUM_MORPH_INFLUENCERS };
      this._eventInfo.fallbacks = fallbacks;
      this._eventInfo.fallbackRank = 0;
      this._eventInfo.defines = defines;
      this._eventInfo.uniforms = uniforms;
      this._eventInfo.attributes = attribs;
      this._eventInfo.samplers = samplers;
      this._eventInfo.uniformBuffersNames = uniformBuffers;
      this._eventInfo.customCode = void 0;
      this._eventInfo.mesh = mesh;
      this._eventInfo.indexParameters = indexParameters;
      this._callbackPluginEventGeneric(MaterialPluginEvent.PrepareEffect, this._eventInfo);
      PrePassConfiguration.AddUniforms(uniforms);
      PrePassConfiguration.AddSamplers(samplers);
      if (ImageProcessingConfiguration) {
        ImageProcessingConfiguration.PrepareUniforms(uniforms, defines);
        ImageProcessingConfiguration.PrepareSamplers(samplers, defines);
      }
      MaterialHelper.PrepareUniformsAndSamplersList({
        uniformsNames: uniforms,
        uniformBuffersNames: uniformBuffers,
        samplers,
        defines,
        maxSimultaneousLights: this._maxSimultaneousLights
      });
      addClipPlaneUniforms(uniforms);
      const csnrOptions = {};
      if (this.customShaderNameResolve) {
        shaderName = this.customShaderNameResolve(shaderName, uniforms, uniformBuffers, samplers, defines, attribs, csnrOptions);
      }
      const join = defines.toString();
      const previousEffect = subMesh.effect;
      let effect = scene.getEngine().createEffect(shaderName, {
        attributes: attribs,
        uniformsNames: uniforms,
        uniformBuffersNames: uniformBuffers,
        samplers,
        defines: join,
        fallbacks,
        onCompiled: this.onCompiled,
        onError: this.onError,
        indexParameters,
        processFinalCode: csnrOptions.processFinalCode,
        processCodeAfterIncludes: this._eventInfo.customCode,
        multiTarget: defines.PREPASS
      }, engine);
      this._eventInfo.customCode = void 0;
      if (effect) {
        if (this._onEffectCreatedObservable) {
          onCreatedEffectParameters.effect = effect;
          onCreatedEffectParameters.subMesh = subMesh;
          this._onEffectCreatedObservable.notifyObservers(onCreatedEffectParameters);
        }
        if (this.allowShaderHotSwapping && previousEffect && !effect.isReady()) {
          effect = previousEffect;
          defines.markAsUnprocessed();
          forceWasNotReadyPreviously = this.isFrozen;
          if (lightDisposed) {
            defines._areLightsDisposed = true;
            return false;
          }
        } else {
          scene.resetCachedMaterial();
          subMesh.setEffect(effect, defines, this._materialContext);
        }
      }
    }
    if (!subMesh.effect || !subMesh.effect.isReady()) {
      return false;
    }
    defines._renderId = scene.getRenderId();
    subMesh.effect._wasPreviouslyReady = forceWasNotReadyPreviously ? false : true;
    subMesh.effect._wasPreviouslyUsingInstances = useInstances;
    this._checkScenePerformancePriority();
    return true;
  }
  /**
   * Builds the material UBO layouts.
   * Used internally during the effect preparation.
   */
  buildUniformLayout() {
    const ubo = this._uniformBuffer;
    ubo.addUniform("diffuseLeftColor", 4);
    ubo.addUniform("diffuseRightColor", 4);
    ubo.addUniform("opacityParts", 4);
    ubo.addUniform("reflectionLeftColor", 4);
    ubo.addUniform("reflectionRightColor", 4);
    ubo.addUniform("refractionLeftColor", 4);
    ubo.addUniform("refractionRightColor", 4);
    ubo.addUniform("emissiveLeftColor", 4);
    ubo.addUniform("emissiveRightColor", 4);
    ubo.addUniform("vDiffuseInfos", 2);
    ubo.addUniform("vAmbientInfos", 2);
    ubo.addUniform("vOpacityInfos", 2);
    ubo.addUniform("vReflectionInfos", 2);
    ubo.addUniform("vReflectionPosition", 3);
    ubo.addUniform("vReflectionSize", 3);
    ubo.addUniform("vEmissiveInfos", 2);
    ubo.addUniform("vLightmapInfos", 2);
    ubo.addUniform("vSpecularInfos", 2);
    ubo.addUniform("vBumpInfos", 3);
    ubo.addUniform("diffuseMatrix", 16);
    ubo.addUniform("ambientMatrix", 16);
    ubo.addUniform("opacityMatrix", 16);
    ubo.addUniform("reflectionMatrix", 16);
    ubo.addUniform("emissiveMatrix", 16);
    ubo.addUniform("lightmapMatrix", 16);
    ubo.addUniform("specularMatrix", 16);
    ubo.addUniform("bumpMatrix", 16);
    ubo.addUniform("vTangentSpaceParams", 2);
    ubo.addUniform("pointSize", 1);
    ubo.addUniform("alphaCutOff", 1);
    ubo.addUniform("refractionMatrix", 16);
    ubo.addUniform("vRefractionInfos", 4);
    ubo.addUniform("vRefractionPosition", 3);
    ubo.addUniform("vRefractionSize", 3);
    ubo.addUniform("vSpecularColor", 4);
    ubo.addUniform("vEmissiveColor", 3);
    ubo.addUniform("vDiffuseColor", 4);
    ubo.addUniform("vAmbientColor", 3);
    super.buildUniformLayout();
  }
  /**
   * Binds the submesh to this material by preparing the effect and shader to draw
   * @param world defines the world transformation matrix
   * @param mesh defines the mesh containing the submesh
   * @param subMesh defines the submesh to bind the material to
   */
  bindForSubMesh(world, mesh, subMesh) {
    var _a;
    const scene = this.getScene();
    const defines = subMesh.materialDefines;
    if (!defines) {
      return;
    }
    const effect = subMesh.effect;
    if (!effect) {
      return;
    }
    this._activeEffect = effect;
    mesh.getMeshUniformBuffer().bindToEffect(effect, "Mesh");
    mesh.transferToEffect(world);
    this._uniformBuffer.bindToEffect(effect, "Material");
    this.prePassConfiguration.bindForSubMesh(this._activeEffect, scene, mesh, world, this.isFrozen);
    this._eventInfo.subMesh = subMesh;
    this._callbackPluginEventHardBindForSubMesh(this._eventInfo);
    if (defines.OBJECTSPACE_NORMALMAP) {
      world.toNormalMatrix(this._normalMatrix);
      this.bindOnlyNormalMatrix(this._normalMatrix);
    }
    const mustRebind = effect._forceRebindOnNextCall || this._mustRebind(scene, effect, mesh.visibility);
    MaterialHelper.BindBonesParameters(mesh, effect);
    const ubo = this._uniformBuffer;
    if (mustRebind) {
      this.bindViewProjection(effect);
      if (!ubo.useUbo || !this.isFrozen || !ubo.isSync || effect._forceRebindOnNextCall) {
        if (_StandardMaterial.FresnelEnabled && defines.FRESNEL) {
          if (this.diffuseFresnelParameters && this.diffuseFresnelParameters.isEnabled) {
            ubo.updateColor4("diffuseLeftColor", this.diffuseFresnelParameters.leftColor, this.diffuseFresnelParameters.power);
            ubo.updateColor4("diffuseRightColor", this.diffuseFresnelParameters.rightColor, this.diffuseFresnelParameters.bias);
          }
          if (this.opacityFresnelParameters && this.opacityFresnelParameters.isEnabled) {
            ubo.updateColor4("opacityParts", new Color3(this.opacityFresnelParameters.leftColor.toLuminance(), this.opacityFresnelParameters.rightColor.toLuminance(), this.opacityFresnelParameters.bias), this.opacityFresnelParameters.power);
          }
          if (this.reflectionFresnelParameters && this.reflectionFresnelParameters.isEnabled) {
            ubo.updateColor4("reflectionLeftColor", this.reflectionFresnelParameters.leftColor, this.reflectionFresnelParameters.power);
            ubo.updateColor4("reflectionRightColor", this.reflectionFresnelParameters.rightColor, this.reflectionFresnelParameters.bias);
          }
          if (this.refractionFresnelParameters && this.refractionFresnelParameters.isEnabled) {
            ubo.updateColor4("refractionLeftColor", this.refractionFresnelParameters.leftColor, this.refractionFresnelParameters.power);
            ubo.updateColor4("refractionRightColor", this.refractionFresnelParameters.rightColor, this.refractionFresnelParameters.bias);
          }
          if (this.emissiveFresnelParameters && this.emissiveFresnelParameters.isEnabled) {
            ubo.updateColor4("emissiveLeftColor", this.emissiveFresnelParameters.leftColor, this.emissiveFresnelParameters.power);
            ubo.updateColor4("emissiveRightColor", this.emissiveFresnelParameters.rightColor, this.emissiveFresnelParameters.bias);
          }
        }
        if (scene.texturesEnabled) {
          if (this._diffuseTexture && _StandardMaterial.DiffuseTextureEnabled) {
            ubo.updateFloat2("vDiffuseInfos", this._diffuseTexture.coordinatesIndex, this._diffuseTexture.level);
            MaterialHelper.BindTextureMatrix(this._diffuseTexture, ubo, "diffuse");
          }
          if (this._ambientTexture && _StandardMaterial.AmbientTextureEnabled) {
            ubo.updateFloat2("vAmbientInfos", this._ambientTexture.coordinatesIndex, this._ambientTexture.level);
            MaterialHelper.BindTextureMatrix(this._ambientTexture, ubo, "ambient");
          }
          if (this._opacityTexture && _StandardMaterial.OpacityTextureEnabled) {
            ubo.updateFloat2("vOpacityInfos", this._opacityTexture.coordinatesIndex, this._opacityTexture.level);
            MaterialHelper.BindTextureMatrix(this._opacityTexture, ubo, "opacity");
          }
          if (this._hasAlphaChannel()) {
            ubo.updateFloat("alphaCutOff", this.alphaCutOff);
          }
          if (this._reflectionTexture && _StandardMaterial.ReflectionTextureEnabled) {
            ubo.updateFloat2("vReflectionInfos", this._reflectionTexture.level, this.roughness);
            ubo.updateMatrix("reflectionMatrix", this._reflectionTexture.getReflectionTextureMatrix());
            if (this._reflectionTexture.boundingBoxSize) {
              const cubeTexture = this._reflectionTexture;
              ubo.updateVector3("vReflectionPosition", cubeTexture.boundingBoxPosition);
              ubo.updateVector3("vReflectionSize", cubeTexture.boundingBoxSize);
            }
          }
          if (this._emissiveTexture && _StandardMaterial.EmissiveTextureEnabled) {
            ubo.updateFloat2("vEmissiveInfos", this._emissiveTexture.coordinatesIndex, this._emissiveTexture.level);
            MaterialHelper.BindTextureMatrix(this._emissiveTexture, ubo, "emissive");
          }
          if (this._lightmapTexture && _StandardMaterial.LightmapTextureEnabled) {
            ubo.updateFloat2("vLightmapInfos", this._lightmapTexture.coordinatesIndex, this._lightmapTexture.level);
            MaterialHelper.BindTextureMatrix(this._lightmapTexture, ubo, "lightmap");
          }
          if (this._specularTexture && _StandardMaterial.SpecularTextureEnabled) {
            ubo.updateFloat2("vSpecularInfos", this._specularTexture.coordinatesIndex, this._specularTexture.level);
            MaterialHelper.BindTextureMatrix(this._specularTexture, ubo, "specular");
          }
          if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && _StandardMaterial.BumpTextureEnabled) {
            ubo.updateFloat3("vBumpInfos", this._bumpTexture.coordinatesIndex, 1 / this._bumpTexture.level, this.parallaxScaleBias);
            MaterialHelper.BindTextureMatrix(this._bumpTexture, ubo, "bump");
            if (scene._mirroredCameraPosition) {
              ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? 1 : -1, this._invertNormalMapY ? 1 : -1);
            } else {
              ubo.updateFloat2("vTangentSpaceParams", this._invertNormalMapX ? -1 : 1, this._invertNormalMapY ? -1 : 1);
            }
          }
          if (this._refractionTexture && _StandardMaterial.RefractionTextureEnabled) {
            let depth = 1;
            if (!this._refractionTexture.isCube) {
              ubo.updateMatrix("refractionMatrix", this._refractionTexture.getReflectionTextureMatrix());
              if (this._refractionTexture.depth) {
                depth = this._refractionTexture.depth;
              }
            }
            ubo.updateFloat4("vRefractionInfos", this._refractionTexture.level, this.indexOfRefraction, depth, this.invertRefractionY ? -1 : 1);
            if (this._refractionTexture.boundingBoxSize) {
              const cubeTexture = this._refractionTexture;
              ubo.updateVector3("vRefractionPosition", cubeTexture.boundingBoxPosition);
              ubo.updateVector3("vRefractionSize", cubeTexture.boundingBoxSize);
            }
          }
        }
        if (this.pointsCloud) {
          ubo.updateFloat("pointSize", this.pointSize);
        }
        if (defines.SPECULARTERM) {
          ubo.updateColor4("vSpecularColor", this.specularColor, this.specularPower);
        }
        ubo.updateColor3("vEmissiveColor", _StandardMaterial.EmissiveTextureEnabled ? this.emissiveColor : Color3.BlackReadOnly);
        ubo.updateColor4("vDiffuseColor", this.diffuseColor, this.alpha);
        scene.ambientColor.multiplyToRef(this.ambientColor, this._globalAmbientColor);
        ubo.updateColor3("vAmbientColor", this._globalAmbientColor);
      }
      if (scene.texturesEnabled) {
        if (this._diffuseTexture && _StandardMaterial.DiffuseTextureEnabled) {
          effect.setTexture("diffuseSampler", this._diffuseTexture);
        }
        if (this._ambientTexture && _StandardMaterial.AmbientTextureEnabled) {
          effect.setTexture("ambientSampler", this._ambientTexture);
        }
        if (this._opacityTexture && _StandardMaterial.OpacityTextureEnabled) {
          effect.setTexture("opacitySampler", this._opacityTexture);
        }
        if (this._reflectionTexture && _StandardMaterial.ReflectionTextureEnabled) {
          if (this._reflectionTexture.isCube) {
            effect.setTexture("reflectionCubeSampler", this._reflectionTexture);
          } else {
            effect.setTexture("reflection2DSampler", this._reflectionTexture);
          }
        }
        if (this._emissiveTexture && _StandardMaterial.EmissiveTextureEnabled) {
          effect.setTexture("emissiveSampler", this._emissiveTexture);
        }
        if (this._lightmapTexture && _StandardMaterial.LightmapTextureEnabled) {
          effect.setTexture("lightmapSampler", this._lightmapTexture);
        }
        if (this._specularTexture && _StandardMaterial.SpecularTextureEnabled) {
          effect.setTexture("specularSampler", this._specularTexture);
        }
        if (this._bumpTexture && scene.getEngine().getCaps().standardDerivatives && _StandardMaterial.BumpTextureEnabled) {
          effect.setTexture("bumpSampler", this._bumpTexture);
        }
        if (this._refractionTexture && _StandardMaterial.RefractionTextureEnabled) {
          if (this._refractionTexture.isCube) {
            effect.setTexture("refractionCubeSampler", this._refractionTexture);
          } else {
            effect.setTexture("refraction2DSampler", this._refractionTexture);
          }
        }
      }
      if (this.getScene().useOrderIndependentTransparency && this.needAlphaBlendingForMesh(mesh)) {
        this.getScene().depthPeelingRenderer.bind(effect);
      }
      this._eventInfo.subMesh = subMesh;
      this._callbackPluginEventBindForSubMesh(this._eventInfo);
      bindClipPlane(effect, this, scene);
      this.bindEyePosition(effect);
    } else if (scene.getEngine()._features.needToAlwaysBindUniformBuffers) {
      this._needToBindSceneUbo = true;
    }
    if (mustRebind || !this.isFrozen) {
      if (scene.lightsEnabled && !this._disableLighting) {
        MaterialHelper.BindLights(scene, mesh, effect, defines, this._maxSimultaneousLights);
      }
      if (scene.fogEnabled && mesh.applyFog && scene.fogMode !== Scene.FOGMODE_NONE || this._reflectionTexture || this._refractionTexture || mesh.receiveShadows || defines.PREPASS) {
        this.bindView(effect);
      }
      MaterialHelper.BindFogParameters(scene, mesh, effect);
      if (defines.NUM_MORPH_INFLUENCERS) {
        MaterialHelper.BindMorphTargetParameters(mesh, effect);
      }
      if (defines.BAKED_VERTEX_ANIMATION_TEXTURE) {
        (_a = mesh.bakedVertexAnimationManager) === null || _a === void 0 ? void 0 : _a.bind(effect, defines.INSTANCES);
      }
      if (this.useLogarithmicDepth) {
        MaterialHelper.BindLogDepth(defines, effect, scene);
      }
      if (this._imageProcessingConfiguration && !this._imageProcessingConfiguration.applyByPostProcess) {
        this._imageProcessingConfiguration.bind(this._activeEffect);
      }
    }
    this._afterBind(mesh, this._activeEffect);
    ubo.update();
  }
  /**
   * Get the list of animatables in the material.
   * @returns the list of animatables object used in the material
   */
  getAnimatables() {
    const results = super.getAnimatables();
    if (this._diffuseTexture && this._diffuseTexture.animations && this._diffuseTexture.animations.length > 0) {
      results.push(this._diffuseTexture);
    }
    if (this._ambientTexture && this._ambientTexture.animations && this._ambientTexture.animations.length > 0) {
      results.push(this._ambientTexture);
    }
    if (this._opacityTexture && this._opacityTexture.animations && this._opacityTexture.animations.length > 0) {
      results.push(this._opacityTexture);
    }
    if (this._reflectionTexture && this._reflectionTexture.animations && this._reflectionTexture.animations.length > 0) {
      results.push(this._reflectionTexture);
    }
    if (this._emissiveTexture && this._emissiveTexture.animations && this._emissiveTexture.animations.length > 0) {
      results.push(this._emissiveTexture);
    }
    if (this._specularTexture && this._specularTexture.animations && this._specularTexture.animations.length > 0) {
      results.push(this._specularTexture);
    }
    if (this._bumpTexture && this._bumpTexture.animations && this._bumpTexture.animations.length > 0) {
      results.push(this._bumpTexture);
    }
    if (this._lightmapTexture && this._lightmapTexture.animations && this._lightmapTexture.animations.length > 0) {
      results.push(this._lightmapTexture);
    }
    if (this._refractionTexture && this._refractionTexture.animations && this._refractionTexture.animations.length > 0) {
      results.push(this._refractionTexture);
    }
    return results;
  }
  /**
   * Gets the active textures from the material
   * @returns an array of textures
   */
  getActiveTextures() {
    const activeTextures = super.getActiveTextures();
    if (this._diffuseTexture) {
      activeTextures.push(this._diffuseTexture);
    }
    if (this._ambientTexture) {
      activeTextures.push(this._ambientTexture);
    }
    if (this._opacityTexture) {
      activeTextures.push(this._opacityTexture);
    }
    if (this._reflectionTexture) {
      activeTextures.push(this._reflectionTexture);
    }
    if (this._emissiveTexture) {
      activeTextures.push(this._emissiveTexture);
    }
    if (this._specularTexture) {
      activeTextures.push(this._specularTexture);
    }
    if (this._bumpTexture) {
      activeTextures.push(this._bumpTexture);
    }
    if (this._lightmapTexture) {
      activeTextures.push(this._lightmapTexture);
    }
    if (this._refractionTexture) {
      activeTextures.push(this._refractionTexture);
    }
    return activeTextures;
  }
  /**
   * Specifies if the material uses a texture
   * @param texture defines the texture to check against the material
   * @returns a boolean specifying if the material uses the texture
   */
  hasTexture(texture) {
    if (super.hasTexture(texture)) {
      return true;
    }
    if (this._diffuseTexture === texture) {
      return true;
    }
    if (this._ambientTexture === texture) {
      return true;
    }
    if (this._opacityTexture === texture) {
      return true;
    }
    if (this._reflectionTexture === texture) {
      return true;
    }
    if (this._emissiveTexture === texture) {
      return true;
    }
    if (this._specularTexture === texture) {
      return true;
    }
    if (this._bumpTexture === texture) {
      return true;
    }
    if (this._lightmapTexture === texture) {
      return true;
    }
    if (this._refractionTexture === texture) {
      return true;
    }
    return false;
  }
  /**
   * Disposes the material
   * @param forceDisposeEffect specifies if effects should be forcefully disposed
   * @param forceDisposeTextures specifies if textures should be forcefully disposed
   */
  dispose(forceDisposeEffect, forceDisposeTextures) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (forceDisposeTextures) {
      (_a = this._diffuseTexture) === null || _a === void 0 ? void 0 : _a.dispose();
      (_b = this._ambientTexture) === null || _b === void 0 ? void 0 : _b.dispose();
      (_c = this._opacityTexture) === null || _c === void 0 ? void 0 : _c.dispose();
      (_d = this._reflectionTexture) === null || _d === void 0 ? void 0 : _d.dispose();
      (_e = this._emissiveTexture) === null || _e === void 0 ? void 0 : _e.dispose();
      (_f = this._specularTexture) === null || _f === void 0 ? void 0 : _f.dispose();
      (_g = this._bumpTexture) === null || _g === void 0 ? void 0 : _g.dispose();
      (_h = this._lightmapTexture) === null || _h === void 0 ? void 0 : _h.dispose();
      (_j = this._refractionTexture) === null || _j === void 0 ? void 0 : _j.dispose();
    }
    if (this._imageProcessingConfiguration && this._imageProcessingObserver) {
      this._imageProcessingConfiguration.onUpdateParameters.remove(this._imageProcessingObserver);
    }
    super.dispose(forceDisposeEffect, forceDisposeTextures);
  }
  /**
   * Makes a duplicate of the material, and gives it a new name
   * @param name defines the new name for the duplicated material
   * @param cloneTexturesOnlyOnce - if a texture is used in more than one channel (e.g diffuse and opacity), only clone it once and reuse it on the other channels. Default false.
   * @param rootUrl defines the root URL to use to load textures
   * @returns the cloned material
   */
  clone(name47, cloneTexturesOnlyOnce = true, rootUrl = "") {
    const result = SerializationHelper.Clone(() => new _StandardMaterial(name47, this.getScene()), this, { cloneTexturesOnlyOnce });
    result.name = name47;
    result.id = name47;
    this.stencil.copyTo(result.stencil);
    this._clonePlugins(result, rootUrl);
    return result;
  }
  /**
   * Creates a standard material from parsed material data
   * @param source defines the JSON representation of the material
   * @param scene defines the hosting scene
   * @param rootUrl defines the root URL to use to load textures and relative dependencies
   * @returns a new standard material
   */
  static Parse(source, scene, rootUrl) {
    const material = SerializationHelper.Parse(() => new _StandardMaterial(source.name, scene), source, scene, rootUrl);
    if (source.stencil) {
      material.stencil.parse(source.stencil, scene, rootUrl);
    }
    Material._parsePlugins(source, material, scene, rootUrl);
    return material;
  }
  // Flags used to enable or disable a type of texture for all Standard Materials
  /**
   * Are diffuse textures enabled in the application.
   */
  static get DiffuseTextureEnabled() {
    return MaterialFlags.DiffuseTextureEnabled;
  }
  static set DiffuseTextureEnabled(value) {
    MaterialFlags.DiffuseTextureEnabled = value;
  }
  /**
   * Are detail textures enabled in the application.
   */
  static get DetailTextureEnabled() {
    return MaterialFlags.DetailTextureEnabled;
  }
  static set DetailTextureEnabled(value) {
    MaterialFlags.DetailTextureEnabled = value;
  }
  /**
   * Are ambient textures enabled in the application.
   */
  static get AmbientTextureEnabled() {
    return MaterialFlags.AmbientTextureEnabled;
  }
  static set AmbientTextureEnabled(value) {
    MaterialFlags.AmbientTextureEnabled = value;
  }
  /**
   * Are opacity textures enabled in the application.
   */
  static get OpacityTextureEnabled() {
    return MaterialFlags.OpacityTextureEnabled;
  }
  static set OpacityTextureEnabled(value) {
    MaterialFlags.OpacityTextureEnabled = value;
  }
  /**
   * Are reflection textures enabled in the application.
   */
  static get ReflectionTextureEnabled() {
    return MaterialFlags.ReflectionTextureEnabled;
  }
  static set ReflectionTextureEnabled(value) {
    MaterialFlags.ReflectionTextureEnabled = value;
  }
  /**
   * Are emissive textures enabled in the application.
   */
  static get EmissiveTextureEnabled() {
    return MaterialFlags.EmissiveTextureEnabled;
  }
  static set EmissiveTextureEnabled(value) {
    MaterialFlags.EmissiveTextureEnabled = value;
  }
  /**
   * Are specular textures enabled in the application.
   */
  static get SpecularTextureEnabled() {
    return MaterialFlags.SpecularTextureEnabled;
  }
  static set SpecularTextureEnabled(value) {
    MaterialFlags.SpecularTextureEnabled = value;
  }
  /**
   * Are bump textures enabled in the application.
   */
  static get BumpTextureEnabled() {
    return MaterialFlags.BumpTextureEnabled;
  }
  static set BumpTextureEnabled(value) {
    MaterialFlags.BumpTextureEnabled = value;
  }
  /**
   * Are lightmap textures enabled in the application.
   */
  static get LightmapTextureEnabled() {
    return MaterialFlags.LightmapTextureEnabled;
  }
  static set LightmapTextureEnabled(value) {
    MaterialFlags.LightmapTextureEnabled = value;
  }
  /**
   * Are refraction textures enabled in the application.
   */
  static get RefractionTextureEnabled() {
    return MaterialFlags.RefractionTextureEnabled;
  }
  static set RefractionTextureEnabled(value) {
    MaterialFlags.RefractionTextureEnabled = value;
  }
  /**
   * Are color grading textures enabled in the application.
   */
  static get ColorGradingTextureEnabled() {
    return MaterialFlags.ColorGradingTextureEnabled;
  }
  static set ColorGradingTextureEnabled(value) {
    MaterialFlags.ColorGradingTextureEnabled = value;
  }
  /**
   * Are fresnels enabled in the application.
   */
  static get FresnelEnabled() {
    return MaterialFlags.FresnelEnabled;
  }
  static set FresnelEnabled(value) {
    MaterialFlags.FresnelEnabled = value;
  }
};
__decorate([
  serializeAsTexture("diffuseTexture")
], StandardMaterial.prototype, "_diffuseTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
], StandardMaterial.prototype, "diffuseTexture", void 0);
__decorate([
  serializeAsTexture("ambientTexture")
], StandardMaterial.prototype, "_ambientTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "ambientTexture", void 0);
__decorate([
  serializeAsTexture("opacityTexture")
], StandardMaterial.prototype, "_opacityTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
], StandardMaterial.prototype, "opacityTexture", void 0);
__decorate([
  serializeAsTexture("reflectionTexture")
], StandardMaterial.prototype, "_reflectionTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "reflectionTexture", void 0);
__decorate([
  serializeAsTexture("emissiveTexture")
], StandardMaterial.prototype, "_emissiveTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "emissiveTexture", void 0);
__decorate([
  serializeAsTexture("specularTexture")
], StandardMaterial.prototype, "_specularTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "specularTexture", void 0);
__decorate([
  serializeAsTexture("bumpTexture")
], StandardMaterial.prototype, "_bumpTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "bumpTexture", void 0);
__decorate([
  serializeAsTexture("lightmapTexture")
], StandardMaterial.prototype, "_lightmapTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "lightmapTexture", void 0);
__decorate([
  serializeAsTexture("refractionTexture")
], StandardMaterial.prototype, "_refractionTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "refractionTexture", void 0);
__decorate([
  serializeAsColor3("ambient")
], StandardMaterial.prototype, "ambientColor", void 0);
__decorate([
  serializeAsColor3("diffuse")
], StandardMaterial.prototype, "diffuseColor", void 0);
__decorate([
  serializeAsColor3("specular")
], StandardMaterial.prototype, "specularColor", void 0);
__decorate([
  serializeAsColor3("emissive")
], StandardMaterial.prototype, "emissiveColor", void 0);
__decorate([
  serialize()
], StandardMaterial.prototype, "specularPower", void 0);
__decorate([
  serialize("useAlphaFromDiffuseTexture")
], StandardMaterial.prototype, "_useAlphaFromDiffuseTexture", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesAndMiscDirty")
], StandardMaterial.prototype, "useAlphaFromDiffuseTexture", void 0);
__decorate([
  serialize("useEmissiveAsIllumination")
], StandardMaterial.prototype, "_useEmissiveAsIllumination", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useEmissiveAsIllumination", void 0);
__decorate([
  serialize("linkEmissiveWithDiffuse")
], StandardMaterial.prototype, "_linkEmissiveWithDiffuse", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "linkEmissiveWithDiffuse", void 0);
__decorate([
  serialize("useSpecularOverAlpha")
], StandardMaterial.prototype, "_useSpecularOverAlpha", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useSpecularOverAlpha", void 0);
__decorate([
  serialize("useReflectionOverAlpha")
], StandardMaterial.prototype, "_useReflectionOverAlpha", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useReflectionOverAlpha", void 0);
__decorate([
  serialize("disableLighting")
], StandardMaterial.prototype, "_disableLighting", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsLightsDirty")
], StandardMaterial.prototype, "disableLighting", void 0);
__decorate([
  serialize("useObjectSpaceNormalMap")
], StandardMaterial.prototype, "_useObjectSpaceNormalMap", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useObjectSpaceNormalMap", void 0);
__decorate([
  serialize("useParallax")
], StandardMaterial.prototype, "_useParallax", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useParallax", void 0);
__decorate([
  serialize("useParallaxOcclusion")
], StandardMaterial.prototype, "_useParallaxOcclusion", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useParallaxOcclusion", void 0);
__decorate([
  serialize()
], StandardMaterial.prototype, "parallaxScaleBias", void 0);
__decorate([
  serialize("roughness")
], StandardMaterial.prototype, "_roughness", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "roughness", void 0);
__decorate([
  serialize()
], StandardMaterial.prototype, "indexOfRefraction", void 0);
__decorate([
  serialize()
], StandardMaterial.prototype, "invertRefractionY", void 0);
__decorate([
  serialize()
], StandardMaterial.prototype, "alphaCutOff", void 0);
__decorate([
  serialize("useLightmapAsShadowmap")
], StandardMaterial.prototype, "_useLightmapAsShadowmap", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useLightmapAsShadowmap", void 0);
__decorate([
  serializeAsFresnelParameters("diffuseFresnelParameters")
], StandardMaterial.prototype, "_diffuseFresnelParameters", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsFresnelDirty")
], StandardMaterial.prototype, "diffuseFresnelParameters", void 0);
__decorate([
  serializeAsFresnelParameters("opacityFresnelParameters")
], StandardMaterial.prototype, "_opacityFresnelParameters", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsFresnelAndMiscDirty")
], StandardMaterial.prototype, "opacityFresnelParameters", void 0);
__decorate([
  serializeAsFresnelParameters("reflectionFresnelParameters")
], StandardMaterial.prototype, "_reflectionFresnelParameters", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsFresnelDirty")
], StandardMaterial.prototype, "reflectionFresnelParameters", void 0);
__decorate([
  serializeAsFresnelParameters("refractionFresnelParameters")
], StandardMaterial.prototype, "_refractionFresnelParameters", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsFresnelDirty")
], StandardMaterial.prototype, "refractionFresnelParameters", void 0);
__decorate([
  serializeAsFresnelParameters("emissiveFresnelParameters")
], StandardMaterial.prototype, "_emissiveFresnelParameters", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsFresnelDirty")
], StandardMaterial.prototype, "emissiveFresnelParameters", void 0);
__decorate([
  serialize("useReflectionFresnelFromSpecular")
], StandardMaterial.prototype, "_useReflectionFresnelFromSpecular", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsFresnelDirty")
], StandardMaterial.prototype, "useReflectionFresnelFromSpecular", void 0);
__decorate([
  serialize("useGlossinessFromSpecularMapAlpha")
], StandardMaterial.prototype, "_useGlossinessFromSpecularMapAlpha", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "useGlossinessFromSpecularMapAlpha", void 0);
__decorate([
  serialize("maxSimultaneousLights")
], StandardMaterial.prototype, "_maxSimultaneousLights", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsLightsDirty")
], StandardMaterial.prototype, "maxSimultaneousLights", void 0);
__decorate([
  serialize("invertNormalMapX")
], StandardMaterial.prototype, "_invertNormalMapX", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "invertNormalMapX", void 0);
__decorate([
  serialize("invertNormalMapY")
], StandardMaterial.prototype, "_invertNormalMapY", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "invertNormalMapY", void 0);
__decorate([
  serialize("twoSidedLighting")
], StandardMaterial.prototype, "_twoSidedLighting", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsTexturesDirty")
], StandardMaterial.prototype, "twoSidedLighting", void 0);
__decorate([
  serialize("applyDecalMapAfterDetailMap")
], StandardMaterial.prototype, "_applyDecalMapAfterDetailMap", void 0);
__decorate([
  expandToProperty("_markAllSubMeshesAsMiscDirty")
], StandardMaterial.prototype, "applyDecalMapAfterDetailMap", void 0);
RegisterClass("BABYLON.StandardMaterial", StandardMaterial);
Scene.DefaultMaterialFactory = (scene) => {
  return new StandardMaterial("default material", scene);
};

// node_modules/@babylonjs/core/Meshes/groundMesh.js
Mesh._GroundMeshParser = (parsedMesh, scene) => {
  return GroundMesh.Parse(parsedMesh, scene);
};
var GroundMesh = class _GroundMesh extends Mesh {
  constructor(name47, scene) {
    super(name47, scene);
    this.generateOctree = false;
  }
  /**
   * "GroundMesh"
   * @returns "GroundMesh"
   */
  getClassName() {
    return "GroundMesh";
  }
  /**
   * The minimum of x and y subdivisions
   */
  get subdivisions() {
    return Math.min(this._subdivisionsX, this._subdivisionsY);
  }
  /**
   * X subdivisions
   */
  get subdivisionsX() {
    return this._subdivisionsX;
  }
  /**
   * Y subdivisions
   */
  get subdivisionsY() {
    return this._subdivisionsY;
  }
  /**
   * This function will divide the mesh into submeshes and update an octree to help to select the right submeshes
   * for rendering, picking and collision computations. Please note that you must have a decent number of submeshes
   * to get performance improvements when using an octree.
   * @param chunksCount the number of submeshes the mesh will be divided into
   * @param octreeBlocksSize the maximum size of the octree blocks (Default: 32)
   */
  optimize(chunksCount, octreeBlocksSize = 32) {
    this._subdivisionsX = chunksCount;
    this._subdivisionsY = chunksCount;
    this.subdivide(chunksCount);
    const thisAsAny = this;
    if (thisAsAny.createOrUpdateSubmeshesOctree) {
      thisAsAny.createOrUpdateSubmeshesOctree(octreeBlocksSize);
    }
  }
  /**
   * Returns a height (y) value in the World system :
   * the ground altitude at the coordinates (x, z) expressed in the World system.
   * @param x x coordinate
   * @param z z coordinate
   * @returns the ground y position if (x, z) are outside the ground surface.
   */
  getHeightAtCoordinates(x, z) {
    const world = this.getWorldMatrix();
    const invMat = TmpVectors.Matrix[5];
    world.invertToRef(invMat);
    const tmpVect = TmpVectors.Vector3[8];
    Vector3.TransformCoordinatesFromFloatsToRef(x, 0, z, invMat, tmpVect);
    x = tmpVect.x;
    z = tmpVect.z;
    if (x < this._minX || x >= this._maxX || z <= this._minZ || z > this._maxZ) {
      return this.position.y;
    }
    if (!this._heightQuads || this._heightQuads.length == 0) {
      this._initHeightQuads();
      this._computeHeightQuads();
    }
    const facet = this._getFacetAt(x, z);
    const y = -(facet.x * x + facet.z * z + facet.w) / facet.y;
    Vector3.TransformCoordinatesFromFloatsToRef(0, y, 0, world, tmpVect);
    return tmpVect.y;
  }
  /**
   * Returns a normalized vector (Vector3) orthogonal to the ground
   * at the ground coordinates (x, z) expressed in the World system.
   * @param x x coordinate
   * @param z z coordinate
   * @returns Vector3(0.0, 1.0, 0.0) if (x, z) are outside the ground surface.
   */
  getNormalAtCoordinates(x, z) {
    const normal = new Vector3(0, 1, 0);
    this.getNormalAtCoordinatesToRef(x, z, normal);
    return normal;
  }
  /**
   * Updates the Vector3 passed a reference with a normalized vector orthogonal to the ground
   * at the ground coordinates (x, z) expressed in the World system.
   * Doesn't update the reference Vector3 if (x, z) are outside the ground surface.
   * @param x x coordinate
   * @param z z coordinate
   * @param ref vector to store the result
   * @returns the GroundMesh.
   */
  getNormalAtCoordinatesToRef(x, z, ref) {
    const world = this.getWorldMatrix();
    const tmpMat = TmpVectors.Matrix[5];
    world.invertToRef(tmpMat);
    const tmpVect = TmpVectors.Vector3[8];
    Vector3.TransformCoordinatesFromFloatsToRef(x, 0, z, tmpMat, tmpVect);
    x = tmpVect.x;
    z = tmpVect.z;
    if (x < this._minX || x > this._maxX || z < this._minZ || z > this._maxZ) {
      return this;
    }
    if (!this._heightQuads || this._heightQuads.length == 0) {
      this._initHeightQuads();
      this._computeHeightQuads();
    }
    const facet = this._getFacetAt(x, z);
    Vector3.TransformNormalFromFloatsToRef(facet.x, facet.y, facet.z, world, ref);
    return this;
  }
  /**
   * Force the heights to be recomputed for getHeightAtCoordinates() or getNormalAtCoordinates()
   * if the ground has been updated.
   * This can be used in the render loop.
   * @returns the GroundMesh.
   */
  updateCoordinateHeights() {
    if (!this._heightQuads || this._heightQuads.length == 0) {
      this._initHeightQuads();
    }
    this._computeHeightQuads();
    return this;
  }
  // Returns the element "facet" from the heightQuads array relative to (x, z) local coordinates
  _getFacetAt(x, z) {
    const col = Math.floor((x + this._maxX) * this._subdivisionsX / this._width);
    const row = Math.floor(-(z + this._maxZ) * this._subdivisionsY / this._height + this._subdivisionsY);
    const quad = this._heightQuads[row * this._subdivisionsX + col];
    let facet;
    if (z < quad.slope.x * x + quad.slope.y) {
      facet = quad.facet1;
    } else {
      facet = quad.facet2;
    }
    return facet;
  }
  //  Creates and populates the heightMap array with "facet" elements :
  // a quad is two triangular facets separated by a slope, so a "facet" element is 1 slope + 2 facets
  // slope : Vector2(c, h) = 2D diagonal line equation setting apart two triangular facets in a quad : z = cx + h
  // facet1 : Vector4(a, b, c, d) = first facet 3D plane equation : ax + by + cz + d = 0
  // facet2 :  Vector4(a, b, c, d) = second facet 3D plane equation : ax + by + cz + d = 0
  // Returns the GroundMesh.
  _initHeightQuads() {
    const subdivisionsX = this._subdivisionsX;
    const subdivisionsY = this._subdivisionsY;
    this._heightQuads = new Array();
    for (let row = 0; row < subdivisionsY; row++) {
      for (let col = 0; col < subdivisionsX; col++) {
        const quad = { slope: Vector2.Zero(), facet1: new Vector4(0, 0, 0, 0), facet2: new Vector4(0, 0, 0, 0) };
        this._heightQuads[row * subdivisionsX + col] = quad;
      }
    }
    return this;
  }
  // Compute each quad element values and update the heightMap array :
  // slope : Vector2(c, h) = 2D diagonal line equation setting apart two triangular facets in a quad : z = cx + h
  // facet1 : Vector4(a, b, c, d) = first facet 3D plane equation : ax + by + cz + d = 0
  // facet2 :  Vector4(a, b, c, d) = second facet 3D plane equation : ax + by + cz + d = 0
  // Returns the GroundMesh.
  _computeHeightQuads() {
    const positions = this.getVerticesData(VertexBuffer.PositionKind);
    if (!positions) {
      return this;
    }
    const v1 = TmpVectors.Vector3[3];
    const v2 = TmpVectors.Vector3[2];
    const v3 = TmpVectors.Vector3[1];
    const v4 = TmpVectors.Vector3[0];
    const v1v2 = TmpVectors.Vector3[4];
    const v1v3 = TmpVectors.Vector3[5];
    const v1v4 = TmpVectors.Vector3[6];
    const norm1 = TmpVectors.Vector3[7];
    const norm2 = TmpVectors.Vector3[8];
    let i = 0;
    let j = 0;
    let k = 0;
    let cd = 0;
    let h = 0;
    let d1 = 0;
    let d2 = 0;
    const subdivisionsX = this._subdivisionsX;
    const subdivisionsY = this._subdivisionsY;
    for (let row = 0; row < subdivisionsY; row++) {
      for (let col = 0; col < subdivisionsX; col++) {
        i = col * 3;
        j = row * (subdivisionsX + 1) * 3;
        k = (row + 1) * (subdivisionsX + 1) * 3;
        v1.x = positions[j + i];
        v1.y = positions[j + i + 1];
        v1.z = positions[j + i + 2];
        v2.x = positions[j + i + 3];
        v2.y = positions[j + i + 4];
        v2.z = positions[j + i + 5];
        v3.x = positions[k + i];
        v3.y = positions[k + i + 1];
        v3.z = positions[k + i + 2];
        v4.x = positions[k + i + 3];
        v4.y = positions[k + i + 4];
        v4.z = positions[k + i + 5];
        cd = (v4.z - v1.z) / (v4.x - v1.x);
        h = v1.z - cd * v1.x;
        v2.subtractToRef(v1, v1v2);
        v3.subtractToRef(v1, v1v3);
        v4.subtractToRef(v1, v1v4);
        Vector3.CrossToRef(v1v4, v1v3, norm1);
        Vector3.CrossToRef(v1v2, v1v4, norm2);
        norm1.normalize();
        norm2.normalize();
        d1 = -(norm1.x * v1.x + norm1.y * v1.y + norm1.z * v1.z);
        d2 = -(norm2.x * v2.x + norm2.y * v2.y + norm2.z * v2.z);
        const quad = this._heightQuads[row * subdivisionsX + col];
        quad.slope.copyFromFloats(cd, h);
        quad.facet1.copyFromFloats(norm1.x, norm1.y, norm1.z, d1);
        quad.facet2.copyFromFloats(norm2.x, norm2.y, norm2.z, d2);
      }
    }
    return this;
  }
  /**
   * Serializes this ground mesh
   * @param serializationObject object to write serialization to
   */
  serialize(serializationObject) {
    super.serialize(serializationObject);
    serializationObject.subdivisionsX = this._subdivisionsX;
    serializationObject.subdivisionsY = this._subdivisionsY;
    serializationObject.minX = this._minX;
    serializationObject.maxX = this._maxX;
    serializationObject.minZ = this._minZ;
    serializationObject.maxZ = this._maxZ;
    serializationObject.width = this._width;
    serializationObject.height = this._height;
  }
  /**
   * Parses a serialized ground mesh
   * @param parsedMesh the serialized mesh
   * @param scene the scene to create the ground mesh in
   * @returns the created ground mesh
   */
  static Parse(parsedMesh, scene) {
    const result = new _GroundMesh(parsedMesh.name, scene);
    result._subdivisionsX = parsedMesh.subdivisionsX || 1;
    result._subdivisionsY = parsedMesh.subdivisionsY || 1;
    result._minX = parsedMesh.minX;
    result._maxX = parsedMesh.maxX;
    result._minZ = parsedMesh.minZ;
    result._maxZ = parsedMesh.maxZ;
    result._width = parsedMesh.width;
    result._height = parsedMesh.height;
    return result;
  }
};

// node_modules/@babylonjs/core/Meshes/Builders/groundBuilder.js
function CreateGroundVertexData(options) {
  const indices = [];
  const positions = [];
  const normals = [];
  const uvs = [];
  let row, col;
  const width = options.width || 1;
  const height = options.height || 1;
  const subdivisionsX = (options.subdivisionsX || options.subdivisions || 1) | 0;
  const subdivisionsY = (options.subdivisionsY || options.subdivisions || 1) | 0;
  for (row = 0; row <= subdivisionsY; row++) {
    for (col = 0; col <= subdivisionsX; col++) {
      const position = new Vector3(col * width / subdivisionsX - width / 2, 0, (subdivisionsY - row) * height / subdivisionsY - height / 2);
      const normal = new Vector3(0, 1, 0);
      positions.push(position.x, position.y, position.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(col / subdivisionsX, CompatibilityOptions.UseOpenGLOrientationForUV ? row / subdivisionsY : 1 - row / subdivisionsY);
    }
  }
  for (row = 0; row < subdivisionsY; row++) {
    for (col = 0; col < subdivisionsX; col++) {
      indices.push(col + 1 + (row + 1) * (subdivisionsX + 1));
      indices.push(col + 1 + row * (subdivisionsX + 1));
      indices.push(col + row * (subdivisionsX + 1));
      indices.push(col + (row + 1) * (subdivisionsX + 1));
      indices.push(col + 1 + (row + 1) * (subdivisionsX + 1));
      indices.push(col + row * (subdivisionsX + 1));
    }
  }
  const vertexData = new VertexData();
  vertexData.indices = indices;
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.uvs = uvs;
  return vertexData;
}
function CreateTiledGroundVertexData(options) {
  const xmin = options.xmin !== void 0 && options.xmin !== null ? options.xmin : -1;
  const zmin = options.zmin !== void 0 && options.zmin !== null ? options.zmin : -1;
  const xmax = options.xmax !== void 0 && options.xmax !== null ? options.xmax : 1;
  const zmax = options.zmax !== void 0 && options.zmax !== null ? options.zmax : 1;
  const subdivisions = options.subdivisions || { w: 1, h: 1 };
  const precision = options.precision || { w: 1, h: 1 };
  const indices = [];
  const positions = [];
  const normals = [];
  const uvs = [];
  let row, col, tileRow, tileCol;
  subdivisions.h = subdivisions.h < 1 ? 1 : subdivisions.h;
  subdivisions.w = subdivisions.w < 1 ? 1 : subdivisions.w;
  precision.w = precision.w < 1 ? 1 : precision.w;
  precision.h = precision.h < 1 ? 1 : precision.h;
  const tileSize = {
    w: (xmax - xmin) / subdivisions.w,
    h: (zmax - zmin) / subdivisions.h
  };
  function applyTile(xTileMin, zTileMin, xTileMax, zTileMax) {
    const base = positions.length / 3;
    const rowLength = precision.w + 1;
    for (row = 0; row < precision.h; row++) {
      for (col = 0; col < precision.w; col++) {
        const square = [base + col + row * rowLength, base + (col + 1) + row * rowLength, base + (col + 1) + (row + 1) * rowLength, base + col + (row + 1) * rowLength];
        indices.push(square[1]);
        indices.push(square[2]);
        indices.push(square[3]);
        indices.push(square[0]);
        indices.push(square[1]);
        indices.push(square[3]);
      }
    }
    const position = Vector3.Zero();
    const normal = new Vector3(0, 1, 0);
    for (row = 0; row <= precision.h; row++) {
      position.z = row * (zTileMax - zTileMin) / precision.h + zTileMin;
      for (col = 0; col <= precision.w; col++) {
        position.x = col * (xTileMax - xTileMin) / precision.w + xTileMin;
        position.y = 0;
        positions.push(position.x, position.y, position.z);
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(col / precision.w, row / precision.h);
      }
    }
  }
  for (tileRow = 0; tileRow < subdivisions.h; tileRow++) {
    for (tileCol = 0; tileCol < subdivisions.w; tileCol++) {
      applyTile(xmin + tileCol * tileSize.w, zmin + tileRow * tileSize.h, xmin + (tileCol + 1) * tileSize.w, zmin + (tileRow + 1) * tileSize.h);
    }
  }
  const vertexData = new VertexData();
  vertexData.indices = indices;
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.uvs = uvs;
  return vertexData;
}
function CreateGroundFromHeightMapVertexData(options) {
  const indices = [];
  const positions = [];
  const normals = [];
  const uvs = [];
  let row, col;
  const filter = options.colorFilter || new Color3(0.3, 0.59, 0.11);
  const alphaFilter = options.alphaFilter || 0;
  let invert = false;
  if (options.minHeight > options.maxHeight) {
    invert = true;
    const temp = options.maxHeight;
    options.maxHeight = options.minHeight;
    options.minHeight = temp;
  }
  for (row = 0; row <= options.subdivisions; row++) {
    for (col = 0; col <= options.subdivisions; col++) {
      const position = new Vector3(col * options.width / options.subdivisions - options.width / 2, 0, (options.subdivisions - row) * options.height / options.subdivisions - options.height / 2);
      const heightMapX = (position.x + options.width / 2) / options.width * (options.bufferWidth - 1) | 0;
      const heightMapY = (1 - (position.z + options.height / 2) / options.height) * (options.bufferHeight - 1) | 0;
      const pos = (heightMapX + heightMapY * options.bufferWidth) * 4;
      let r = options.buffer[pos] / 255;
      let g = options.buffer[pos + 1] / 255;
      let b = options.buffer[pos + 2] / 255;
      const a = options.buffer[pos + 3] / 255;
      if (invert) {
        r = 1 - r;
        g = 1 - g;
        b = 1 - b;
      }
      const gradient = r * filter.r + g * filter.g + b * filter.b;
      if (a >= alphaFilter) {
        position.y = options.minHeight + (options.maxHeight - options.minHeight) * gradient;
      } else {
        position.y = options.minHeight - Epsilon;
      }
      positions.push(position.x, position.y, position.z);
      normals.push(0, 0, 0);
      uvs.push(col / options.subdivisions, 1 - row / options.subdivisions);
    }
  }
  for (row = 0; row < options.subdivisions; row++) {
    for (col = 0; col < options.subdivisions; col++) {
      const idx1 = col + 1 + (row + 1) * (options.subdivisions + 1);
      const idx2 = col + 1 + row * (options.subdivisions + 1);
      const idx3 = col + row * (options.subdivisions + 1);
      const idx4 = col + (row + 1) * (options.subdivisions + 1);
      const isVisibleIdx1 = positions[idx1 * 3 + 1] >= options.minHeight;
      const isVisibleIdx2 = positions[idx2 * 3 + 1] >= options.minHeight;
      const isVisibleIdx3 = positions[idx3 * 3 + 1] >= options.minHeight;
      if (isVisibleIdx1 && isVisibleIdx2 && isVisibleIdx3) {
        indices.push(idx1);
        indices.push(idx2);
        indices.push(idx3);
      }
      const isVisibleIdx4 = positions[idx4 * 3 + 1] >= options.minHeight;
      if (isVisibleIdx4 && isVisibleIdx1 && isVisibleIdx3) {
        indices.push(idx4);
        indices.push(idx1);
        indices.push(idx3);
      }
    }
  }
  VertexData.ComputeNormals(positions, indices, normals);
  const vertexData = new VertexData();
  vertexData.indices = indices;
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.uvs = uvs;
  return vertexData;
}
function CreateGround(name47, options = {}, scene) {
  const ground = new GroundMesh(name47, scene);
  ground._setReady(false);
  ground._subdivisionsX = options.subdivisionsX || options.subdivisions || 1;
  ground._subdivisionsY = options.subdivisionsY || options.subdivisions || 1;
  ground._width = options.width || 1;
  ground._height = options.height || 1;
  ground._maxX = ground._width / 2;
  ground._maxZ = ground._height / 2;
  ground._minX = -ground._maxX;
  ground._minZ = -ground._maxZ;
  const vertexData = CreateGroundVertexData(options);
  vertexData.applyToMesh(ground, options.updatable);
  ground._setReady(true);
  return ground;
}
function CreateTiledGround(name47, options, scene = null) {
  const tiledGround = new Mesh(name47, scene);
  const vertexData = CreateTiledGroundVertexData(options);
  vertexData.applyToMesh(tiledGround, options.updatable);
  return tiledGround;
}
function CreateGroundFromHeightMap(name47, url, options = {}, scene = null) {
  const width = options.width || 10;
  const height = options.height || 10;
  const subdivisions = options.subdivisions || 1 | 0;
  const minHeight = options.minHeight || 0;
  const maxHeight = options.maxHeight || 1;
  const filter = options.colorFilter || new Color3(0.3, 0.59, 0.11);
  const alphaFilter = options.alphaFilter || 0;
  const updatable = options.updatable;
  const onReady = options.onReady;
  scene = scene || EngineStore.LastCreatedScene;
  const ground = new GroundMesh(name47, scene);
  ground._subdivisionsX = subdivisions;
  ground._subdivisionsY = subdivisions;
  ground._width = width;
  ground._height = height;
  ground._maxX = ground._width / 2;
  ground._maxZ = ground._height / 2;
  ground._minX = -ground._maxX;
  ground._minZ = -ground._maxZ;
  ground._setReady(false);
  const onload = (img) => {
    const bufferWidth = img.width;
    const bufferHeight = img.height;
    if (scene.isDisposed) {
      return;
    }
    const buffer = scene === null || scene === void 0 ? void 0 : scene.getEngine().resizeImageBitmap(img, bufferWidth, bufferHeight);
    const vertexData = CreateGroundFromHeightMapVertexData({
      width,
      height,
      subdivisions,
      minHeight,
      maxHeight,
      colorFilter: filter,
      buffer,
      bufferWidth,
      bufferHeight,
      alphaFilter
    });
    vertexData.applyToMesh(ground, updatable);
    if (onReady) {
      onReady(ground);
    }
    ground._setReady(true);
  };
  Tools.LoadImage(url, onload, () => {
  }, scene.offlineProvider);
  return ground;
}
var GroundBuilder = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CreateGround,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CreateGroundFromHeightMap,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CreateTiledGround
};
VertexData.CreateGround = CreateGroundVertexData;
VertexData.CreateTiledGround = CreateTiledGroundVertexData;
VertexData.CreateGroundFromHeightMap = CreateGroundFromHeightMapVertexData;
Mesh.CreateGround = (name47, width, height, subdivisions, scene, updatable) => {
  const options = {
    width,
    height,
    subdivisions,
    updatable
  };
  return CreateGround(name47, options, scene);
};
Mesh.CreateTiledGround = (name47, xmin, zmin, xmax, zmax, subdivisions, precision, scene, updatable) => {
  const options = {
    xmin,
    zmin,
    xmax,
    zmax,
    subdivisions,
    precision,
    updatable
  };
  return CreateTiledGround(name47, options, scene);
};
Mesh.CreateGroundFromHeightMap = (name47, url, width, height, subdivisions, minHeight, maxHeight, scene, updatable, onReady, alphaFilter) => {
  const options = {
    width,
    height,
    subdivisions,
    minHeight,
    maxHeight,
    updatable,
    onReady,
    alphaFilter
  };
  return CreateGroundFromHeightMap(name47, url, options, scene);
};

// node_modules/@babylonjs/core/Meshes/Builders/torusBuilder.js
function CreateTorusVertexData(options) {
  const indices = [];
  const positions = [];
  const normals = [];
  const uvs = [];
  const diameter = options.diameter || 1;
  const thickness = options.thickness || 0.5;
  const tessellation = (options.tessellation || 16) | 0;
  const sideOrientation = options.sideOrientation === 0 ? 0 : options.sideOrientation || VertexData.DEFAULTSIDE;
  const stride = tessellation + 1;
  for (let i = 0; i <= tessellation; i++) {
    const u = i / tessellation;
    const outerAngle = i * Math.PI * 2 / tessellation - Math.PI / 2;
    const transform = Matrix.Translation(diameter / 2, 0, 0).multiply(Matrix.RotationY(outerAngle));
    for (let j = 0; j <= tessellation; j++) {
      const v = 1 - j / tessellation;
      const innerAngle = j * Math.PI * 2 / tessellation + Math.PI;
      const dx = Math.cos(innerAngle);
      const dy = Math.sin(innerAngle);
      let normal = new Vector3(dx, dy, 0);
      let position = normal.scale(thickness / 2);
      const textureCoordinate = new Vector2(u, v);
      position = Vector3.TransformCoordinates(position, transform);
      normal = Vector3.TransformNormal(normal, transform);
      positions.push(position.x, position.y, position.z);
      normals.push(normal.x, normal.y, normal.z);
      uvs.push(textureCoordinate.x, CompatibilityOptions.UseOpenGLOrientationForUV ? 1 - textureCoordinate.y : textureCoordinate.y);
      const nextI = (i + 1) % stride;
      const nextJ = (j + 1) % stride;
      indices.push(i * stride + j);
      indices.push(i * stride + nextJ);
      indices.push(nextI * stride + j);
      indices.push(i * stride + nextJ);
      indices.push(nextI * stride + nextJ);
      indices.push(nextI * stride + j);
    }
  }
  VertexData._ComputeSides(sideOrientation, positions, indices, normals, uvs, options.frontUVs, options.backUVs);
  const vertexData = new VertexData();
  vertexData.indices = indices;
  vertexData.positions = positions;
  vertexData.normals = normals;
  vertexData.uvs = uvs;
  return vertexData;
}
function CreateTorus(name47, options = {}, scene) {
  const torus = new Mesh(name47, scene);
  options.sideOrientation = Mesh._GetDefaultSideOrientation(options.sideOrientation);
  torus._originalBuilderSideOrientation = options.sideOrientation;
  const vertexData = CreateTorusVertexData(options);
  vertexData.applyToMesh(torus, options.updatable);
  return torus;
}
var TorusBuilder = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  CreateTorus
};
VertexData.CreateTorus = CreateTorusVertexData;
Mesh.CreateTorus = (name47, diameter, thickness, tessellation, scene, updatable, sideOrientation) => {
  const options = {
    diameter,
    thickness,
    tessellation,
    sideOrientation,
    updatable
  };
  return CreateTorus(name47, options, scene);
};

export {
  inlineScheduler,
  createYieldingScheduler,
  runCoroutine,
  runCoroutineSync,
  runCoroutineAsync,
  makeSyncFunction,
  makeAsyncFunction,
  IntersectionInfo,
  SubMesh,
  VertexDataMaterialInfo,
  VertexData,
  SceneLoaderFlags,
  Geometry,
  TransformNode,
  _MeshCollisionData,
  AbstractMesh,
  MaterialPluginEvent,
  Material,
  MultiMaterial,
  MeshLODLevel,
  _CreationDataStorage,
  _InstancesBatch,
  Mesh,
  Ray,
  PushMaterial,
  PassPostProcess,
  PassCubePostProcess,
  PrePassConfiguration,
  MaterialFlags,
  MaterialPluginManager,
  RegisterMaterialPlugin,
  UnregisterMaterialPlugin,
  UnregisterAllMaterialPlugins,
  MaterialPluginBase,
  MaterialDetailMapDefines,
  DetailMapConfiguration,
  StandardMaterialDefines,
  StandardMaterial,
  GroundMesh,
  CreateGroundVertexData,
  CreateTiledGroundVertexData,
  CreateGroundFromHeightMapVertexData,
  CreateGround,
  CreateTiledGround,
  CreateGroundFromHeightMap,
  GroundBuilder,
  CreateTorusVertexData,
  CreateTorus,
  TorusBuilder
};
//# sourceMappingURL=chunk-X3GGEY53.js.map
