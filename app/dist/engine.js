"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/engine/Rendering/Shaders/Shader.ts
  var Shader, Shader_default;
  var init_Shader = __esm({
    "src/engine/Rendering/Shaders/Shader.ts"() {
      "use strict";
      init_Engine3D();
      Shader = class {
        constructor(shader_type, shader_source) {
          this._source_fields = {};
          this.shader = Engine3D_default.inst.GL.createShader(shader_type);
          this.source = shader_source;
          this.loadShader();
          this.compileShader();
        }
        loadShader() {
          Engine3D_default.inst.GL.shaderSource(this.shader, this.source);
        }
        compileShader() {
          Engine3D_default.inst.GL.compileShader(this.shader);
        }
        addSourceAttribute(shaderProgram, atr) {
          this._source_fields[`${atr}`] = { name: `${atr}`, location: () => {
            return Engine3D_default.inst.GL.getAttribLocation(shaderProgram, atr);
          } };
        }
        addSourceUniform(shaderProgram, atr) {
          this._source_fields[`${atr}`] = { name: `${atr}`, location: () => {
            return Engine3D_default.inst.GL.getUniformLocation(shaderProgram, atr);
          } };
        }
        get instance() {
          return this.shader;
        }
        get source_fields() {
          return this._source_fields;
        }
      };
      Shader_default = Shader;
    }
  });

  // src/engine/Rendering/Shaders/VertexShader.ts
  var VertexShader, VertexShader_default;
  var init_VertexShader = __esm({
    "src/engine/Rendering/Shaders/VertexShader.ts"() {
      "use strict";
      init_Shader();
      init_Engine3D();
      VertexShader = class _VertexShader extends Shader_default {
        static {
          this.tempSource = `#version 300 es
         precision mediump float;
     
         uniform mat4 modelView;
     
         in vec3 coordinates;
         in vec4 color;
         out vec4 v_color;
     
         void main( void ) 
         {
            gl_Position = modelView * vec4( coordinates, 1.0 ); // orthographic or perspective (w = 1.0 | orthographic)
            v_color = color;
         }`;
        }
        constructor(shaderProgram) {
          super(Engine3D_default.inst.GL.VERTEX_SHADER, _VertexShader.tempSource);
          super.addSourceAttribute(shaderProgram, "coordinates");
          super.addSourceAttribute(shaderProgram, "color");
          super.addSourceUniform(shaderProgram, "modelView");
        }
      };
      VertexShader_default = VertexShader;
    }
  });

  // src/engine/Rendering/Shaders/FragmentShader.ts
  var FragmentShader, FragmentShader_default;
  var init_FragmentShader = __esm({
    "src/engine/Rendering/Shaders/FragmentShader.ts"() {
      "use strict";
      init_Shader();
      init_Engine3D();
      FragmentShader = class _FragmentShader extends Shader_default {
        static {
          this.tempSource = `#version 300 es
         precision mediump float;
         
         in vec4 v_color;
         out vec4 f_color;
         
         void main( void ) 
         {
            f_color = v_color;
         }`;
        }
        constructor(shaderProgram) {
          super(Engine3D_default.inst.GL.FRAGMENT_SHADER, _FragmentShader.tempSource);
        }
      };
      FragmentShader_default = FragmentShader;
    }
  });

  // src/engine/Rendering/Shaders/ShaderProgram.ts
  var ShaderProgram, ShaderProgram_default;
  var init_ShaderProgram = __esm({
    "src/engine/Rendering/Shaders/ShaderProgram.ts"() {
      "use strict";
      init_VertexShader();
      init_FragmentShader();
      init_Engine3D();
      ShaderProgram = class {
        constructor() {
          this.program = Engine3D_default.inst.GL.createProgram();
          this._vertexShader = new VertexShader_default(this.program);
          this._fragmentShader = new FragmentShader_default(this.program);
          Engine3D_default.inst.GL.attachShader(this.program, this._vertexShader.instance);
          Engine3D_default.inst.GL.attachShader(this.program, this._fragmentShader.instance);
          Engine3D_default.inst.GL.linkProgram(this.program);
          Engine3D_default.inst.GL.useProgram(this.program);
        }
        get vertexShader() {
          return this._vertexShader;
        }
        get fragmentShader() {
          return this._fragmentShader;
        }
      };
      ShaderProgram_default = ShaderProgram;
    }
  });

  // src/engine/LinearAlgebra/Vec4.ts
  var Vec4, Vec4_default;
  var init_Vec4 = __esm({
    "src/engine/LinearAlgebra/Vec4.ts"() {
      "use strict";
      Vec4 = class _Vec4 {
        constructor(vec4) {
          this.x = vec4.x;
          this.y = vec4.y;
          this.z = vec4.z;
          this.w = vec4.w ?? 0;
        }
        get X() {
          return this.x;
        }
        get Y() {
          return this.y;
        }
        get Z() {
          return this.z;
        }
        get W() {
          return this.w;
        }
        /**
         * Returns the length of this vector
         */
        get magnitude() {
          return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }
        /**
         * Returns a normalized version of this vector
         */
        normalized() {
          const magnitude = this.magnitude;
          const normalizedVec4 = { x: this.x / magnitude, y: this.y / magnitude, z: this.z / magnitude, w: this.w / magnitude };
          return new _Vec4(normalizedVec4);
        }
        /**
         * Returns the vector that is this vector scaled by the given scalar(magnitude).
         **/
        scaled(scalar) {
          const scaledVec4 = {
            x: this.x * scalar,
            y: this.y * scalar,
            z: this.z * scalar,
            w: this.w * scalar
          };
          return new _Vec4(scaledVec4);
        }
        /**
         * Returns the dot product between this vector and other
         */
        dot(other) {
          const productVec4 = {
            x: this.x * other.x,
            y: this.y * other.y,
            z: this.z * other.z,
            w: this.w * other.w
          };
          return productVec4.x + productVec4.y + productVec4.z + productVec4.w;
        }
        /**
         * Returns the vector sum between this and other.
         */
        add(other) {
          const summedVec4 = {
            x: this.x + other.x,
            y: this.y + other.y,
            z: this.z + other.z,
            w: this.w + other.w
          };
          return new _Vec4(summedVec4);
        }
        /**
         * Returns the vector sub between this and other.
         */
        sub(other) {
          return this.add(other.scaled(-1));
        }
        /**
         * Returns the vector cross product between this and other.
         */
        cross(other) {
          const crossProductVec4 = {
            x: this.y * other.z - this.z * other.y,
            y: this.x * other.z - this.z * other.x,
            z: this.x * other.y - this.y * other.x,
            w: 0
          };
          return new _Vec4(crossProductVec4);
        }
        /**
         * Returns the vector values as a string.
         */
        toString() {
          return `${_Vec4.name}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z}, ${this.w} ]`;
        }
      };
      Vec4_default = Vec4;
    }
  });

  // src/engine/LinearAlgebra/Mat4.ts
  var Mat4, Mat4_default;
  var init_Mat4 = __esm({
    "src/engine/LinearAlgebra/Mat4.ts"() {
      "use strict";
      init_Vec4();
      Mat4 = class _Mat4 {
        constructor(data) {
          switch (data) {
            case 0 /* Zero */:
              this.data = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
              ];
              break;
            case void 0:
            case null:
            case 1 /* Identity */:
              this.data = [
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1
              ];
              break;
            case 2 /* RowMajor */:
              this.data = [
                0,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15
              ];
              break;
            case 3 /* ColumnMajor */:
              this.data = [
                0,
                4,
                8,
                12,
                1,
                5,
                9,
                13,
                2,
                6,
                10,
                14,
                3,
                7,
                11,
                15
              ];
              break;
            default:
              this.data = data;
          }
        }
        getData() {
          return this.data;
        }
        /**
         * returns the identity matrix
         */
        static identity() {
          return new _Mat4();
        }
        /**
         * Returns a rotation matrix in the XY plane, rotating by the given number of turns. (around Z(up) axis)
         * COUNTER-CLOCK WISE
         */
        static rotation_xy(turns) {
          const r = turns * (2 * Math.PI);
          const rotationXY = [
            Math.cos(r),
            -Math.sin(r),
            0,
            0,
            Math.sin(r),
            Math.cos(r),
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            0,
            1
          ];
          return new _Mat4(rotationXY);
        }
        /**
         * Returns a rotation matrix in the ZX plane, rotating by the given number of turns (around Y(forward) axis)
         * COUNTER-CLOCK WISE
         */
        static rotation_xz(turns) {
          const r = turns * (2 * Math.PI);
          const rotationXZ = [
            Math.cos(r),
            0,
            Math.sin(r),
            0,
            0,
            1,
            0,
            0,
            -Math.sin(r),
            0,
            Math.cos(r),
            0,
            0,
            0,
            0,
            1
          ];
          return new _Mat4(rotationXZ);
        }
        /**
         * returns a rotation matrix in the YZ plane, rotating by the given number of turns (around X(right) axis)
         * COUNTER-CLOCK WISE
         **/
        static rotation_yz(turns) {
          const r = turns * (2 * Math.PI);
          const rotationYZ = [
            1,
            0,
            0,
            0,
            0,
            Math.cos(r),
            -Math.sin(r),
            0,
            0,
            Math.sin(r),
            Math.cos(r),
            0,
            0,
            0,
            0,
            1
          ];
          return new _Mat4(rotationYZ);
        }
        /**
         returns a transformation matrix of a translation in x, y, z
         */
        static translation(dx, dy, dz) {
          const translationMatrix = [
            1,
            0,
            0,
            dx,
            0,
            1,
            0,
            dy,
            0,
            0,
            1,
            dz,
            0,
            0,
            0,
            1
          ];
          return new _Mat4(translationMatrix);
        }
        /**
         returns a matrix transformation that scales with the x, y, z input
         **/
        static scale(sx, sy, sz) {
          const scaledMat4X4 = [
            sx,
            0,
            0,
            0,
            0,
            sy,
            0,
            0,
            0,
            0,
            sz,
            0,
            0,
            0,
            0,
            1
          ];
          return new _Mat4(scaledMat4X4);
        }
        /**
         returns the combination of two matrix transformation  in order,
         that is encoded by 'this' and the 'input' matrix transformations.
         where the 'input' is being transformed by 'this'.
         **/
        multiply(right) {
          const multipliedMat4X4 = [
            // m0
            this.data[0] * right.data[0] + this.data[1] * right.data[4] + this.data[2] * right.data[8] + this.data[3] * right.data[12],
            // m1
            this.data[0] * right.data[1] + this.data[1] * right.data[5] + this.data[2] * right.data[9] + this.data[3] * right.data[13],
            // m2
            this.data[0] * right.data[2] + this.data[1] * right.data[6] + this.data[2] * right.data[10] + this.data[3] * right.data[14],
            // m3
            this.data[0] * right.data[3] + this.data[1] * right.data[7] + this.data[2] * right.data[11] + this.data[3] * right.data[15],
            // m4
            this.data[4] * right.data[0] + this.data[5] * right.data[4] + this.data[6] * right.data[8] + this.data[7] * right.data[12],
            // m5
            this.data[4] * right.data[1] + this.data[5] * right.data[5] + this.data[6] * right.data[9] + this.data[7] * right.data[13],
            // m6
            this.data[4] * right.data[2] + this.data[5] * right.data[6] + this.data[6] * right.data[10] + this.data[7] * right.data[14],
            // m7
            this.data[4] * right.data[3] + this.data[5] * right.data[7] + this.data[6] * right.data[11] + this.data[7] * right.data[15],
            // m8
            this.data[8] * right.data[0] + this.data[9] * right.data[4] + this.data[10] * right.data[8] + this.data[11] * right.data[12],
            // m9
            this.data[8] * right.data[1] + this.data[9] * right.data[5] + this.data[10] * right.data[9] + this.data[11] * right.data[13],
            // m10
            this.data[8] * right.data[2] + this.data[9] * right.data[6] + this.data[10] * right.data[10] + this.data[11] * right.data[14],
            // m11
            this.data[8] * right.data[3] + this.data[9] * right.data[7] + this.data[10] * right.data[11] + this.data[11] * right.data[15],
            // m12
            this.data[12] * right.data[0] + this.data[13] * right.data[4] + this.data[14] * right.data[8] + this.data[15] * right.data[12],
            // m13
            this.data[12] * right.data[1] + this.data[13] * right.data[5] + this.data[14] * right.data[9] + this.data[15] * right.data[13],
            // m14
            this.data[12] * right.data[2] + this.data[13] * right.data[6] + this.data[14] * right.data[10] + this.data[15] * right.data[14],
            // m15
            this.data[12] * right.data[3] + this.data[13] * right.data[7] + this.data[14] * right.data[11] + this.data[15] * right.data[15]
          ];
          return new _Mat4(multipliedMat4X4);
        }
        /**
            right multiply by column vector
        **/
        transform(vec4) {
          return this.transform_vec(new Vec4_default(vec4));
        }
        /**
         right multiply by column vector
         **/
        transform_vec(vec4) {
          const transformedVec4 = {
            // m0
            x: this.data[0] * vec4.X + this.data[1] * vec4.Y + this.data[2] * vec4.Z + this.data[3] * vec4.W,
            // m4
            y: this.data[4] * vec4.X + this.data[5] * vec4.Y + this.data[6] * vec4.Z + this.data[7] * vec4.W,
            // m8
            z: this.data[8] * vec4.X + this.data[9] * vec4.Y + this.data[10] * vec4.Z + this.data[11] * vec4.W,
            // m12
            w: this.data[12] * vec4.X + this.data[13] * vec4.Y + this.data[14] * vec4.Z + this.data[15] * vec4.W
          };
          return new Vec4_default(transformedVec4);
        }
        /**
         returns the entry at the row and col starting at 0 index for both col and row
         **/
        rc(row, col) {
          return this.data[row * 4 + col];
        }
        // inverting a 4x4 matrix is ugly, there are 16 determinants we 
        // need to calculate. Because it's such a pain, I looked it up:
        // https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
        // author: willnode
        inverse() {
          const A2323 = this.data[10] * this.data[15] - this.data[11] * this.data[14];
          const A1323 = this.data[9] * this.data[15] - this.data[11] * this.data[13];
          const A1223 = this.data[8] * this.data[14] - this.data[10] * this.data[13];
          const A0323 = this.data[8] * this.data[15] - this.data[11] * this.data[12];
          const A0223 = this.data[8] * this.data[14] - this.data[10] * this.data[12];
          const A0123 = this.data[8] * this.data[13] - this.data[9] * this.data[12];
          const A2313 = this.data[6] * this.data[15] - this.data[7] * this.data[14];
          const A1313 = this.data[5] * this.data[15] - this.data[7] * this.data[13];
          const A1213 = this.data[5] * this.data[14] - this.data[6] * this.data[13];
          const A2312 = this.data[6] * this.data[11] - this.data[7] * this.data[10];
          const A1312 = this.data[5] * this.data[11] - this.data[7] * this.data[9];
          const A1212 = this.data[5] * this.data[10] - this.data[6] * this.data[9];
          const A0313 = this.data[4] * this.data[15] - this.data[7] * this.data[12];
          const A0213 = this.data[4] * this.data[14] - this.data[6] * this.data[12];
          const A0312 = this.data[4] * this.data[11] - this.data[7] * this.data[8];
          const A0212 = this.data[4] * this.data[10] - this.data[6] * this.data[8];
          const A0113 = this.data[4] * this.data[13] - this.data[5] * this.data[12];
          const A0112 = this.data[4] * this.data[9] - this.data[5] * this.data[8];
          const det = this.data[0] * (this.data[5] * A2323 - this.data[6] * A1323 + this.data[7] * A1223) - this.data[1] * (this.data[4] * A2323 - this.data[6] * A0323 + this.data[7] * A0223) + this.data[2] * (this.data[4] * A1323 - this.data[5] * A0323 + this.data[7] * A0123) - this.data[3] * (this.data[4] * A1223 - this.data[5] * A0223 + this.data[6] * A0123);
          const dr = 1 / det;
          return new _Mat4([
            dr * (this.data[5] * A2323 - this.data[6] * A1323 + this.data[7] * A1223),
            dr * -(this.data[1] * A2323 - this.data[2] * A1323 + this.data[3] * A1223),
            dr * (this.data[1] * A2313 - this.data[2] * A1313 + this.data[3] * A1213),
            dr * -(this.data[1] * A2312 - this.data[2] * A1312 + this.data[3] * A1212),
            dr * -(this.data[4] * A2323 - this.data[6] * A0323 + this.data[7] * A0223),
            dr * (this.data[0] * A2323 - this.data[2] * A0323 + this.data[3] * A0223),
            dr * -(this.data[0] * A2313 - this.data[2] * A0313 + this.data[3] * A0213),
            dr * (this.data[0] * A2312 - this.data[2] * A0312 + this.data[3] * A0212),
            dr * (this.data[4] * A1323 - this.data[5] * A0323 + this.data[7] * A0123),
            dr * -(this.data[0] * A1323 - this.data[1] * A0323 + this.data[3] * A0123),
            dr * (this.data[0] * A1313 - this.data[1] * A0313 + this.data[3] * A0113),
            dr * -(this.data[0] * A1312 - this.data[1] * A0312 + this.data[3] * A0112),
            dr * -(this.data[4] * A1223 - this.data[5] * A0223 + this.data[6] * A0123),
            dr * (this.data[0] * A1223 - this.data[1] * A0223 + this.data[2] * A0123),
            dr * -(this.data[0] * A1213 - this.data[1] * A0213 + this.data[2] * A0113),
            dr * (this.data[0] * A1212 - this.data[1] * A0212 + this.data[2] * A0112)
          ]);
        }
        /*
        returns a clone of this data
         */
        clone() {
          return new _Mat4(this.data);
        }
        /**
        returns a string of the matrix in rows
         **/
        toString() {
          let pieces = ["["];
          for (let col = 0; col < 4; col++) {
            pieces.push("[");
            for (let row = 0; row < 4; row++) {
              const i = row * 4 + col;
              pieces.push(this.data[i].toString());
            }
            pieces.push("]");
          }
          pieces.push("]");
          return pieces.join(" ");
        }
      };
      Mat4_default = Mat4;
    }
  });

  // src/engine/Rendering/Shaders/Buffers.ts
  var Buffers, Buffers_default;
  var init_Buffers = __esm({
    "src/engine/Rendering/Shaders/Buffers.ts"() {
      "use strict";
      init_Engine3D();
      Buffers = class {
        constructor() {
          this.vertex_buffer = Engine3D_default.inst.GL.createBuffer();
        }
        bindVertexBuffer() {
          Engine3D_default.inst.GL.bindBuffer(Engine3D_default.inst.GL.ARRAY_BUFFER, this.vertex_buffer);
        }
        unbindVertexBuffer() {
          Engine3D_default.inst.GL.bindBuffer(Engine3D_default.inst.GL.ARRAY_BUFFER, null);
        }
      };
      Buffers_default = Buffers;
    }
  });

  // src/engine/Time.ts
  var Time, Time_default;
  var init_Time = __esm({
    "src/engine/Time.ts"() {
      "use strict";
      Time = class _Time {
        static {
          this.lastFrameUpTime = 0;
        }
        static {
          this._deltaTime = 0;
        }
        // delta time in seconds
        constructor() {
          if (_Time._inst == null) {
            new Error("Can only have one instance of Time");
          }
          _Time._inst = this;
          document.addEventListener("updateTimeEvent", _Time.update);
        }
        static update() {
          if (_Time.lastFrameUpTime !== 0) {
            _Time._deltaTime = _Time.MiliToSec(window.performance.now() - _Time.lastFrameUpTime);
          }
          _Time.lastFrameUpTime = window.performance.now();
        }
        // Convert Milliseconds into Seconds
        static MiliToSec(milliseconds) {
          return milliseconds / 1e3;
        }
        static get deltaTime() {
          return this._deltaTime;
        }
      };
      Time_default = Time;
    }
  });

  // src/engine/Rendering/Renderer.ts
  var Renderer, Renderer_default;
  var init_Renderer = __esm({
    "src/engine/Rendering/Renderer.ts"() {
      "use strict";
      init_Engine3D();
      init_ShaderProgram();
      init_Mat4();
      init_Buffers();
      init_Time();
      Renderer = class _Renderer {
        constructor() {
          this.rot_amt_xy = 0;
          this.rot_amt_xz = 0;
          this.rot_amt_yz = 0;
          this.rot_speed_xy = 0.25;
          this.rot_speed_xz = 0.5;
          this.rot_speed_yz = 0.05;
          new Time_default();
          this.buffers = new Buffers_default();
          this.shaderProgram = new ShaderProgram_default();
          this.initializeClearPresets();
          this.initializePresets();
          this.clear();
        }
        static {
          this.updateTimeEvent = new Event("updateTimeEvent");
        }
        static {
          this.ndcInterleavedLength = 3;
        }
        static {
          this.colorInterleavedLength = 4;
        }
        static {
          this.interleavedLength = _Renderer.ndcInterleavedLength + _Renderer.colorInterleavedLength;
        }
        static {
          this.bytesOfValues = 4;
        }
        //
        // Initializes clearing values for gl renderer
        initializeClearPresets() {
          Engine3D_default.inst.GL.clearColor(0, 0.85, 1, 1);
          Engine3D_default.inst.GL.clearDepth(1);
        }
        clear() {
          Engine3D_default.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        }
        //
        // Initializes clearing values for gl renderer
        initializePresets() {
          Engine3D_default.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST);
          this.setUniform_Mat4x4(Mat4_default.rotation_xz(0.125));
        }
        render() {
          document.dispatchEvent(_Renderer.updateTimeEvent);
          window.requestAnimationFrame(this.render.bind(this));
          this.clear();
          this.buffers.bindVertexBuffer();
          this.RenderNext();
          this.buffers.unbindVertexBuffer();
        }
        setUniform_Mat4x4(mat4) {
          const loc = this.shaderProgram.vertexShader.source_fields["modelView"].location();
          Engine3D_default.inst.GL.uniformMatrix4fv(loc, true, mat4.getData());
        }
        //
        // vec3 normalized device coordinates, vec4 color
        //
        RenderOnce(vert_s) {
          if (vert_s.length % _Renderer.interleavedLength !== 0) {
            throw new DOMException(`The Length Of the Vertexes are not interleaved by ${_Renderer.interleavedLength} floats`);
          }
          this.clear();
          const vertexCount = vert_s.length / _Renderer.interleavedLength;
          const cordLoc = this.shaderProgram.vertexShader.source_fields["coordinates"]?.location();
          const colorLoc = this.shaderProgram.vertexShader.source_fields["color"]?.location();
          Engine3D_default.inst.GL.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, new Float32Array(vert_s), WebGL2RenderingContext.STATIC_DRAW);
          Engine3D_default.inst.GL.vertexAttribPointer(cordLoc, 3, WebGL2RenderingContext.FLOAT, false, _Renderer.interleavedLength * _Renderer.bytesOfValues, 0);
          Engine3D_default.inst.GL.enableVertexAttribArray(cordLoc);
          Engine3D_default.inst.GL.vertexAttribPointer(colorLoc, 4, WebGL2RenderingContext.FLOAT, false, _Renderer.interleavedLength * _Renderer.bytesOfValues, _Renderer.bytesOfValues * _Renderer.ndcInterleavedLength);
          Engine3D_default.inst.GL.enableVertexAttribArray(colorLoc);
          Engine3D_default.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
          Engine3D_default.inst.GL.drawArrays(WebGL2RenderingContext.TRIANGLES, 0, vertexCount);
        }
        RenderNext() {
          const vert_s = [
            //bottom-left
            0,
            0.5,
            0,
            0,
            1,
            0,
            1,
            //left-t
            0.5,
            -0.5,
            0,
            0,
            0,
            1,
            1,
            //right-t
            -0.5,
            -0.5,
            0,
            1,
            0,
            0,
            1
            //left-b
          ];
          this.rot_amt_xy += this.rot_speed_xy * Time_default.deltaTime;
          this.rot_amt_xz += this.rot_speed_xz * Time_default.deltaTime;
          this.rot_amt_yz += this.rot_speed_yz * Time_default.deltaTime;
          const mat = Mat4_default.rotation_yz(this.rot_amt_yz).multiply(Mat4_default.rotation_xz(this.rot_amt_xz)).multiply(Mat4_default.rotation_xy(this.rot_amt_xy));
          this.setUniform_Mat4x4(mat);
          this.RenderOnce(vert_s);
        }
      };
      Renderer_default = Renderer;
    }
  });

  // src/engine/Engine3D.ts
  var Engine3D, Engine3D_default;
  var init_Engine3D = __esm({
    "src/engine/Engine3D.ts"() {
      "use strict";
      init_Renderer();
      Engine3D = class _Engine3D {
        constructor(gl) {
          if (_Engine3D.instance !== null && _Engine3D.instance !== void 0) {
            throw new Error("Cannot Have Two instances of Engine3D");
          }
          _Engine3D.instance = this;
          this.gl = gl;
          this.renderer = new Renderer_default();
          this.renderer.render();
        }
        //
        // Gets the instance of the current running engine
        //
        static get inst() {
          if (_Engine3D.instance == null) {
            throw new Error("Must Create a Instance Of Engine3D Before Using It");
          }
          return _Engine3D.instance;
        }
        //
        // Gets the Rendering Context Of The Engine
        //
        get GL() {
          return this.gl;
        }
      };
      Engine3D_default = Engine3D;
    }
  });

  // src/index.ts
  var require_index = __commonJS({
    "src/index.ts"() {
      init_Engine3D();
      init_Mat4();
      init_Vec4();
      var canvas = document.getElementById("canvas");
      var gl = canvas.getContext("webgl2");
      var engine = new Engine3D_default(gl);
    }
  });
  require_index();
})();
