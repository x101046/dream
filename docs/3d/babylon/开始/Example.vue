<template>
  <div class="main-content">
    <canvas ref="renderCanvas" id="renderCanvas" />
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, onMounted } from "vue";

import { Engine, Scene, SceneLoader } from '@babylonjs/core';
import { MeshBuilder } from '@babylonjs/core/Meshes';
import { Vector3 } from '@babylonjs/core/Maths';
import { ArcRotateCamera } from '@babylonjs/core/Cameras';
import { HemisphericLight, PointLight } from '@babylonjs/core/Lights';

const renderCanvas = ref<HTMLCanvasElement>();

const init = async() => {
  // 关联babylon
  const engine = new Engine(unref(renderCanvas) as HTMLCanvasElement);
  // 创建场景
  const scene = new Scene(engine);

  // 创建一个相机
  const camera = new ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 5, Vector3.Zero(), scene);
  // 将相机添加到画布上
  camera.attachControl(renderCanvas.value, true);

  // 创建一个光源, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  // 设置光源强度
  light.intensity = 0.7;

  // 添加一个球体到场景中
  const sphere = MeshBuilder.CreateSphere(
    'sphere',
    { diameter: 2 },
    scene,
  );

  // 渲染每一帧
  engine.runRenderLoop(() => {
    scene.render();
  });
  // scene.debugLayer.show();
  window.addEventListener('resize', function() {
    engine.resize();
  });

};

onMounted(() => {
  init();
  window.addEventListener('resize', function() {
    console.log(123);
    
  });
});
</script>

<style lang="scss" scoped>
  .main-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    #renderCanvas {
      width: 100%;
      height: 100%;
    }
  }
</style>