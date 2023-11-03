---
outline: deep
---

# 装饰器
装饰器是一种特殊的类型声明，他可以附加在类，方法，属性，参数上面

```bash
# 生成ts配置文件
tsc --init
# 运行测试代码
ts-node 文件名
```
使用装饰器时需要将experimentalDecorators设为true
```json
{
  "compilerOptions": {
    "experimentalDecorators": true, /* Enable experimental support for legacy experimental decorators. */
  }
}

```

## 类装饰器
他会自动把class的构造函数传入到装饰器的第一个参数 target

然后通过prototype可以自定义添加属性和方法

```ts
const decotators: ClassDecorator = (target: Function) => {
  target.prototype.sex = '男'
}

@decotators
class Man {
  public address: string = '北京'
  constructor () {
  }
}

const zhangsan:any = new Man()
console.log(zhangsan.sex) // 男
```

## 属性装饰器
他会自动把原型对象传入到装饰器的第一个参数 target

属性名传入到第二个参数 key

```ts
const decotators: PropertyDecorator = (target: Object, key: string | symbol) => {
  // target是原型对象
  // key是属性名
  console.log(target, key)
}

class Man {
  @decotators
  public sex: string
  constructor () {
    this.sex = '男'
  }
}
```

## 参数装饰器
他会自动把原型对象传入到装饰器的第一个参数 target

方法名传入到第二个参数 key

参数索引 parameterIndex

```ts
const decotators: ParameterDecorator = (target: Object, key: string | symbol | undefined, parameterIndex: number) => {
  // target是原型对象
  // key是方法名
  // parameterIndex是参数索引
  console.log(target, key, parameterIndex)
}

class Man {
  public sex: string
  constructor () {
    this.sex = '男'
  }

  getSex(name: string, @decotators age: number) {
  }
}
```

## 方法装饰器
他会自动把原型对象传入到装饰器的第一个参数 target

方法名传入到第二个参数 key

属性描述符传入到第三个参数 descriptor
```ts
const decotators: MethodDecorator = <T>(target: Object, key: string | symbol, descriptor: TypedPropertyDescriptor<T>) => {
  // target是原型对象
  // key是属性名
  // descriptor是属性描述符
  console.log(target, key, descriptor)
}

class Man {
  public sex: string
  constructor () {
    this.sex = '男'
  }

  @decotators
  getSex() {
  }
}
```