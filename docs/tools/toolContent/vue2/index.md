---
outline: deep
---



# Vue2



## 基础
&emsp;&emsp;在3d开发中，一般会包含一个场景，一个相机，一组灯光和若干3d物体，其中物体包含几何体和材质，几何体决定了物体的形状，材质决定了物体的外观。在babylon中，场景、相机、灯光、几何体、材质都是对象，而且都是继承自Node类，所以他们都有一些共同的属性和方法，比如position、rotation、scaling、parent、getAbsolutePosition()等等。这些属性和方法都是Node类的成员，所以在babylon中，所有的对象都可以看做是一个节点，这些节点构成了一个树形结构，树的根节点就是场景，场景下面有相机、灯光、物体等等，物体下面又有子物体，子物体下面又有子物体，以此类推。这样的树形结构在babylon中被称为场景图，它是babylon的核心，所有的操作都是围绕场景图进行的。


## 官方网站
- [babylon官网](https://www.babylonjs.com/)
- [babylon playground](https://playground.babylonjs.com/)，可以实时编写运行babylon代码，并且可以导出生成的glb或babylon格式模型
- [babylon沙盒](https://sandbox.babylonjs.com/)，可以导入模型进行编辑后导出


## 安装

### CDN

babylon.js的文件能够从官网cdn直接引用，但好像国内访问有点慢，所以babylon中文网也提供了cdn支持。

```js
<script src="https://cdn.cnbabylon.com/babylon.js"></script>
<script src="https://cdn.cnbabylon.com/materialsLibrary/babylonjs.materials.min.js"></script>
<script src="https://cdn.cnbabylon.com/loaders/babylonjs.loaders.min.js"></script>
<script src="https://cdn.cnbabylon.com/postProcessesLibrary/babylonjs.postProcess.min.js"></script>
<script src="https://cdn.cnbabylon.com/proceduralTexturesLibrary/babylonjs.proceduralTextures.min.js"></script>
<script src="https://cdn.cnbabylon.com/serializers/babylonjs.serializers.min.js"></script>
<script src="https://cdn.cnbabylon.com/gui/babylon.gui.min.js"></script>
<script src="https://cdn.cnbabylon.com/inspector/babylon.inspector.bundle.js"></script>
```

### YARN

```bash
# es5
yarn add babylonjs
yarn add babylonjs-materials
yarn add babylonjs-loaders
yarn add babylonjs-post-process
yarn add babylonjs-procedural-textures
yarn add babylonjs-serializers
yarn add babylonjs-gui
yarn add babylonjs-viewer

# es6
yarn add @babylonjs/core
yarn add @babylonjs/materials
yarn add @babylonjs/loaders
yarn add @babylonjs/post-processes
yarn add @babylonjs/procedural-textures
yarn add @babylonjs/serializers
yarn add @babylonjs/gui
yarn add @babylonjs/viewer
```

## 安装其他版本的babylon

```bash
# es5
yarn add babylonjs@6.28.0

#es6
yarn add babylonjs/core@6.28.0
```

## 引入模块

```js
// es5
import * as BABYLON from 'babylonjs'; // 全部引入
import { Engine, Scene } from 'babylonjs'; // 只引入使用到的类
import * as Materials from 'babylonjs-materials';// 引入其他模块中的所有类，例如materials材质库

// es6
import * as BABYLON from '@babylonjs/core/Legacy/legacy'; // 全部引入
import { Engine, Scene } from '@babylonjs/core'; // 只引入使用到的类
import "@babylonjs/materials/legacy/legacy"; // 引入其他模块中的所有类，例如materials
```

> 区别：<br>
ES5使用import * as Materials from 'babylonjs-materials'，把所有组件挂在了Materials中.<br>
使用方法为：var skyMaterial = new Materials.SkyMaterial(.....)<br>
ES6使用import "@babylonjs/materials/legacy/legacy"，把所有组件挂在了BABYLON中.<br>
使用方法为：var skyMaterial = new BABYLON.SkyMaterial(.....)

## 注意事项
inspector和viewer模块属于独立功能的组件，平时开发可以不用引入。