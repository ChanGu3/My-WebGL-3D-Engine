(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/engine/rendering/shaders/Shader.ts
  var Shader, Shader_default;
  var init_Shader = __esm({
    "src/engine/rendering/shaders/Shader.ts"() {
      init_Engine3D();
      Shader = class {
        shader;
        _source_attribs = {};
        shader_type;
        fileName = "";
        /*
        *    {filename - no extension just filename}
        */
        constructor(shader_type, fileName) {
          this.shader = Engine3D_default.inst.GL.createShader(shader_type);
          this.shader_type = shader_type;
          this.fileName = fileName;
        }
        loadShader(source) {
          Engine3D_default.inst.GL.shaderSource(this.shader, source);
        }
        compileShader() {
          Engine3D_default.inst.GL.compileShader(this.shader);
        }
        addSourceField(shaderProgram, atr) {
          this._source_attribs[`${atr}`] = {
            name: `${atr}`,
            location: () => {
              const fieldAttribLoc = Engine3D_default.inst.GL.getAttribLocation(shaderProgram, atr);
              if (fieldAttribLoc == -1) {
                throw new Error('either no field attribute named "' + atr + '" in program or attribute name is reserved/built-in.');
              }
              let err = Engine3D_default.inst.GL.getError();
              if (err != 0) {
                throw new Error("invalid program. Error: " + err);
              }
              return fieldAttribLoc;
            }
          };
        }
        addSourceUniform(shaderProgram, atr) {
          this._source_attribs[`${atr}`] = {
            name: `${atr}`,
            location: () => {
              const uniformAttribLoc = Engine3D_default.inst.GL.getUniformLocation(shaderProgram, atr);
              if (uniformAttribLoc == -1) {
                throw new Error('either no uniform attribute named "' + atr + '" in program or attribute name is reserved/built-in.');
              }
              let err = Engine3D_default.inst.GL.getError();
              if (err != 0) {
                throw new Error("invalid program. Error: " + err);
              }
              return uniformAttribLoc;
            }
          };
        }
        get instance() {
          return this.shader;
        }
        get source_attribs() {
          return this._source_attribs;
        }
        /*
            Gets the shader file and places it into the shaders source string in memory.
        */
        // @ts-ignore
        async getShaderFile_Load_Compile() {
          let fullPath = "";
          switch (this.shader_type) {
            case Engine3D_default.inst.GL.VERTEX_SHADER:
              fullPath += `/vertex-shaders/${this.fileName}.vert`;
              break;
            case Engine3D_default.inst.GL.FRAGMENT_SHADER:
              fullPath += `/fragment-shaders/${this.fileName}.frag`;
              break;
          }
          try {
            const resp = await fetch(fullPath, {
              method: "GET",
              mode: "cors",
              credentials: "same-origin",
              headers: {
                "Content-Type": "text/plain"
              }
            });
            if (!resp.ok) {
              throw new Error("[CAG] - Could Not Find File! Check if your file includes the correct shader extension and that the filename parameter input does not include the extension.");
            }
            const source = await resp.text();
            this.loadShader(source);
            this.compileShader();
          } catch (e) {
            throw new Error(`[CAG] - Something Went Wrong With Retrieving the Shader at ${fullPath} - error ${e}`);
          }
          return;
        }
      };
      Shader_default = Shader;
    }
  });

  // src/engine/rendering/shaders/VertexShader.ts
  var VertexShader, VertexShader_default;
  var init_VertexShader = __esm({
    "src/engine/rendering/shaders/VertexShader.ts"() {
      init_Shader();
      init_Engine3D();
      init_ShaderProgram();
      VertexShader = class extends Shader_default {
        constructor(shaderProgram, vertexShaderFieldAttributes) {
          switch (vertexShaderFieldAttributes) {
            case 1 /* COORDINATES */:
              super(Engine3D_default.inst.GL.VERTEX_SHADER, "coordinates");
              super.addSourceField(shaderProgram, "coordinates");
              super.addSourceUniform(shaderProgram, "modelView");
              super.addSourceUniform(shaderProgram, "projection");
              break;
            case 3 /* COOR_COL */:
              super(Engine3D_default.inst.GL.VERTEX_SHADER, "coord_color");
              super.addSourceField(shaderProgram, "coordinates");
              super.addSourceField(shaderProgram, "color");
              super.addSourceUniform(shaderProgram, "modelView");
              super.addSourceUniform(shaderProgram, "projection");
              break;
            default:
              throw new Error("[CAG] shaderProgram for field attributes selected is not supported");
              break;
          }
        }
      };
      VertexShader_default = VertexShader;
    }
  });

  // src/engine/rendering/shaders/FragmentShader.ts
  var FragmentShader, FragmentShader_default;
  var init_FragmentShader = __esm({
    "src/engine/rendering/shaders/FragmentShader.ts"() {
      init_Shader();
      init_Engine3D();
      init_ShaderProgram();
      FragmentShader = class extends Shader_default {
        constructor(shaderProgram, vertexShaderFieldAttributes) {
          switch (vertexShaderFieldAttributes) {
            case 1 /* COORDINATES */:
              super(Engine3D_default.inst.GL.FRAGMENT_SHADER, "coordinates-depth-shader");
              break;
            case 3 /* COOR_COL */:
              super(Engine3D_default.inst.GL.FRAGMENT_SHADER, "coord_color");
              break;
            default:
              throw new Error("shaderProgram for field attributes selected is not supported");
              break;
          }
        }
      };
      FragmentShader_default = FragmentShader;
    }
  });

  // src/engine/linear-algebra/Vec4.ts
  var Vec4, Vec4_default;
  var init_Vec4 = __esm({
    "src/engine/linear-algebra/Vec4.ts"() {
      Vec4 = class _Vec4 {
        x;
        y;
        z;
        w;
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

  // src/engine/linear-algebra/Mat4.ts
  var Mat4, Mat4_default;
  var init_Mat4 = __esm({
    "src/engine/linear-algebra/Mat4.ts"() {
      init_Vec4();
      Mat4 = class _Mat4 {
        data;
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
        static tau_to_radians(tau) {
          return tau * Math.PI * 2;
        }
        /**
         * returns the identity matrix
         */
        static identity() {
          return new _Mat4();
        }
        /**
         * Returns a rotation matrix in the XY plane, rotating by the given number of turns. (around Z axis)
         *  Left Handed System
         */
        static rotation_xy(tau) {
          const r = _Mat4.tau_to_radians(tau);
          const rotationXY = [
            Math.cos(r),
            Math.sin(r),
            0,
            0,
            -Math.sin(r),
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
         * Returns a rotation matrix in the ZX plane, rotating by the given number of turns (around Y axis)
         * Left Handed System
         */
        static rotation_xz(tau) {
          const r = _Mat4.tau_to_radians(tau);
          const rotationXZ = [
            Math.cos(r),
            0,
            -Math.sin(r),
            0,
            0,
            1,
            0,
            0,
            Math.sin(r),
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
         * returns a rotation matrix in the YZ plane, rotating by the given number of turns (around X axis)
         * Left Handed System
         **/
        static rotation_yz(tau) {
          const r = _Mat4.tau_to_radians(tau);
          const rotationYZ = [
            1,
            0,
            0,
            0,
            0,
            Math.cos(r),
            Math.sin(r),
            0,
            0,
            -Math.sin(r),
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
        /*
        *  returns the perspective projection matrix using the frustum
        */
        static frustum(left, right, bottom, top, near, far) {
          let scale_x = 2 * near / (right - left);
          let scale_y = 2 * near / (top - bottom);
          let t_x = (right + left) / (right - left);
          let t_y = (top + bottom) / (top - bottom);
          const c2 = (far + near) / (far - near);
          const c1 = 2 * far * near / (far - near);
          return new _Mat4([
            scale_x,
            0,
            t_x,
            0,
            0,
            scale_y,
            t_y,
            0,
            0,
            0,
            c2,
            -c1,
            0,
            0,
            1,
            0
          ]);
        }
        /*
        *  creates a perspective matrix using the frustum matrix.
        */
        static perspectiveUsingFrustum(tau, aspectRatio, near, far) {
          const top = Math.tan(_Mat4.tau_to_radians(tau) / 2) * near;
          const bottom = -top;
          const right = top * aspectRatio;
          const left = -right;
          return _Mat4.frustum(left, right, bottom, top, near, far);
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
          for (let row = 0; row < 4; row++) {
            pieces.push("[");
            for (let col = 0; col < 4; col++) {
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

  // src/engine/rendering/shaders/ShaderProgram.ts
  var ShaderProgram, ShaderProgram_default;
  var init_ShaderProgram = __esm({
    "src/engine/rendering/shaders/ShaderProgram.ts"() {
      init_VertexShader();
      init_FragmentShader();
      init_Engine3D();
      init_Mat4();
      ShaderProgram = class _ShaderProgram {
        static coord_count = 3;
        static color_count = 4;
        _vertexShader;
        _fragmentShader;
        _program;
        _vertexShaderFieldAttributes;
        constructor(vertexShaderFieldAttributes) {
          this._vertexShaderFieldAttributes = vertexShaderFieldAttributes;
          this._program = Engine3D_default.inst.GL.createProgram();
          this._vertexShader = new VertexShader_default(this._program, vertexShaderFieldAttributes);
          this._fragmentShader = new FragmentShader_default(this._program, vertexShaderFieldAttributes);
        }
        // @ts-ignore
        async CompileAttachAndLink() {
          try {
            await this._fragmentShader.getShaderFile_Load_Compile();
            await this._vertexShader.getShaderFile_Load_Compile();
            Engine3D_default.inst.GL.attachShader(this._program, this._vertexShader.instance);
            Engine3D_default.inst.GL.attachShader(this._program, this._fragmentShader.instance);
            Engine3D_default.inst.GL.linkProgram(this._program);
            if (!Engine3D_default.inst.GL.getProgramParameter(this._program, WebGL2RenderingContext.LINK_STATUS)) {
              let err = Engine3D_default.inst.GL.getProgramInfoLog(this._program);
              throw new Error("Link error in shader program:\n" + err);
            }
            return;
          } catch (err) {
            throw new Error(err);
          }
        }
        get vertexShader() {
          return this._vertexShader;
        }
        get vertexShaderFieldAttributes() {
          return this._vertexShaderFieldAttributes;
        }
        get fragmentShader() {
          return this._fragmentShader;
        }
        get program() {
          return this._program;
        }
        static UnloadAny() {
          Engine3D_default.inst.GL.useProgram(null);
        }
        Load() {
          Engine3D_default.inst.GL.useProgram(this._program);
          this.setModelUniform_Mat4x4(new Mat4_default(1 /* Identity */));
        }
        setModelUniform_Mat4x4(mat4) {
          const loc = this.vertexShader.source_attribs["modelView"].location();
          Engine3D_default.inst.GL.uniformMatrix4fv(loc, true, mat4.getData());
        }
        setProjectionUniform_Mat4x4(mat4) {
          const loc = this.vertexShader.source_attribs["projection"].location();
          Engine3D_default.inst.GL.uniformMatrix4fv(loc, true, mat4.getData());
        }
        setVertexAttributesToBuffer() {
          let interleavedLength = 0;
          interleavedLength = 1 /* COORDINATES */ & this._vertexShaderFieldAttributes ? interleavedLength + _ShaderProgram.coord_count : interleavedLength;
          interleavedLength = 2 /* COLOR */ & this._vertexShaderFieldAttributes ? interleavedLength + 4 : interleavedLength;
          let currOffset = 0;
          if (1 /* COORDINATES */ & this._vertexShaderFieldAttributes) {
            const cordLoc = this.vertexShader.source_attribs["coordinates"].location();
            Engine3D_default.inst.GL.vertexAttribPointer(cordLoc, _ShaderProgram.coord_count, WebGL2RenderingContext.FLOAT, false, interleavedLength * Float32Array.BYTES_PER_ELEMENT, 0);
            Engine3D_default.inst.GL.enableVertexAttribArray(cordLoc);
            currOffset += _ShaderProgram.coord_count;
          }
          if (2 /* COLOR */ & this._vertexShaderFieldAttributes) {
            const colorLoc = this.vertexShader.source_attribs["color"].location();
            Engine3D_default.inst.GL.vertexAttribPointer(colorLoc, _ShaderProgram.color_count, WebGL2RenderingContext.FLOAT, false, interleavedLength * Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D_default.inst.GL.enableVertexAttribArray(colorLoc);
            currOffset += _ShaderProgram.color_count;
          }
        }
      };
      ShaderProgram_default = ShaderProgram;
    }
  });

  // src/engine/Time.ts
  var Time, Time_default;
  var init_Time = __esm({
    "src/engine/Time.ts"() {
      Time = class _Time {
        static _inst;
        static lastFrameUpTime = 0;
        static _deltaTime = 0;
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

  // src/engine/rendering/shaders/Buffer.ts
  var Buffer2, Buffer_default;
  var init_Buffer = __esm({
    "src/engine/rendering/shaders/Buffer.ts"() {
      init_Engine3D();
      Buffer2 = class {
        /*
        *  returns buffer loaded with data using usagePattern
        */
        static createAndLoadVertexBuffer(data, usage) {
          const bindingPoint = Engine3D_default.inst.GL.ARRAY_BUFFER;
          const bindingPointCurrent = Engine3D_default.inst.GL.ARRAY_BUFFER_BINDING;
          return this.createAndLoadBuffer(new Float32Array(data), bindingPoint, bindingPointCurrent, usage);
        }
        /*
        *  returns buffer loaded with data using usagePattern
        */
        static createAndLoadElementsBuffer(data, usage) {
          const bindingPoint = Engine3D_default.inst.GL.ELEMENT_ARRAY_BUFFER;
          const bindingPointCurrent = Engine3D_default.inst.GL.ELEMENT_ARRAY_BUFFER_BINDING;
          return this.createAndLoadBuffer(new Uint16Array(data), bindingPoint, bindingPointCurrent, usage);
        }
        /*
        *   return id of buffer created and loaded with data at bindingPoint and using usage
        */
        static createAndLoadBuffer(srcData, bindingPoint, bindingPointCurrent, usage) {
          const current_array_buf = Engine3D_default.inst.GL.getParameter(bindingPointCurrent);
          const buf_id = Engine3D_default.inst.GL.createBuffer();
          Engine3D_default.inst.GL.bindBuffer(bindingPoint, buf_id);
          Engine3D_default.inst.GL.bufferData(bindingPoint, srcData, usage);
          Engine3D_default.inst.GL.bindBuffer(bindingPoint, current_array_buf);
          return buf_id;
        }
        /*
        *  binds the buffer_id to the binding point and returns the buffer bound to the bindingPointCurrent
        */
        static bindBuffer(buffer_id, bindingPoint, bindingPointCurrent) {
          const current_array_buf = Engine3D_default.inst.GL.getParameter(bindingPointCurrent);
          Engine3D_default.inst.GL.bindBuffer(bindingPoint, buffer_id);
          return current_array_buf;
        }
        /*
         *  binds the buffer_id to the ARRAY_BUFFER and returns the current bound buffer
        */
        static bindArrayBuffer(buffer_id) {
          return this.bindBuffer(buffer_id, WebGL2RenderingContext.ARRAY_BUFFER, WebGL2RenderingContext.ARRAY_BUFFER_BINDING);
        }
        /*
        *  binds the buffer_id to the ELEMENT_ARRAY_BUFFER and returns the current bound buffer
        */
        static bindElementArrayBuffer(buffer_id) {
          return this.bindBuffer(buffer_id, WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER_BINDING);
        }
        /*
        *  unbinds the chosen bindingPoint
        */
        static unbind(bindingPoint) {
          Engine3D_default.inst.GL.bindBuffer(bindingPoint, null);
        }
      };
      Buffer_default = Buffer2;
    }
  });

  // src/engine/rendering/Mesh.ts
  var Mesh, Mesh_default;
  var init_Mesh = __esm({
    "src/engine/rendering/Mesh.ts"() {
      init_Buffer();
      init_Engine3D();
      init_ShaderProgram();
      init_Time();
      init_Mat4();
      Mesh = class _Mesh {
        verts;
        indis;
        n_verts;
        n_indis;
        windingOrder;
        cullingFace = WebGL2RenderingContext.BACK;
        isFaceCulling = true;
        shaderProgram;
        /**
         * Creates a new mesh and loads it into video memory.
         */
        constructor(shaderProgram, vertices, indices, windingOrder = WebGL2RenderingContext.CW) {
          this.verts = Buffer_default.createAndLoadVertexBuffer(vertices, Engine3D_default.inst.GL.STATIC_DRAW);
          this.n_verts = vertices.length;
          this.indis = Buffer_default.createAndLoadElementsBuffer(indices, Engine3D_default.inst.GL.STATIC_DRAW);
          this.n_indis = indices.length;
          this.windingOrder = windingOrder;
          this.shaderProgram = shaderProgram;
        }
        /**
         * Create a box mesh with the given dimensions and colors.
         */
        static box(shaderProgram, width, height, depth) {
          let hwidth = width / 2;
          let hheight = height / 2;
          let hdepth = depth / 2;
          let verts = [
            hwidth,
            -hheight,
            -hdepth,
            //1.0, 0.0, 0.0, 1.0,
            -hwidth,
            -hheight,
            -hdepth,
            //0.0, 1.0, 0.0, 1.0,
            -hwidth,
            hheight,
            -hdepth,
            //0.0, 0.0, 1.0, 1.0,
            hwidth,
            hheight,
            -hdepth,
            //1.0, 1.0, 0.0, 1.0,
            hwidth,
            -hheight,
            hdepth,
            //1.0, 0.0, 1.0, 1.0,
            -hwidth,
            -hheight,
            hdepth,
            //0.0, 1.0, 1.0, 1.0,
            -hwidth,
            hheight,
            hdepth,
            //0.5, 0.5, 1.0, 1.0,
            hwidth,
            hheight,
            hdepth
            //1.0, 1.0, 0.5, 1.0,
          ];
          let indis = [
            // clockwise winding
            /*
            0, 1, 2, 2, 3, 0,
            4, 0, 3, 3, 7, 4,
            5, 4, 7, 7, 6, 5,
            1, 5, 6, 6, 2, 1,
            3, 2, 6, 6, 7, 3,
            4, 5, 1, 1, 0, 4,
            */
            // counter-clockwise winding
            0,
            3,
            2,
            2,
            1,
            0,
            4,
            7,
            3,
            3,
            0,
            4,
            5,
            6,
            7,
            7,
            4,
            5,
            1,
            2,
            6,
            6,
            5,
            1,
            3,
            7,
            6,
            6,
            2,
            3,
            4,
            0,
            1,
            1,
            5,
            4
          ];
          const mesh = new _Mesh(shaderProgram, verts, indis);
          mesh.windingOrder = WebGL2RenderingContext.CCW;
          return mesh;
        }
        /**
         * Parse the given text as the body of an obj file. (Expecting counter-clockwise winding)
         */
        static from_obj_text(shaderProgram, text) {
          const lines = text.split(/\r?\n/);
          const vertices = [];
          const indices = [];
          for (let line of lines) {
            let elements = line.trim().split(" ");
            switch (elements[0]) {
              case "v":
                for (let i = 1; i < elements.length; i++) {
                  const parsedFloat = parseFloat(elements[i]);
                  if (isNaN(parsedFloat)) {
                    throw new Error(`${elements[i]} .obj 'f' vertex values must be a valid floating point number`);
                  } else {
                    vertices.push(parsedFloat);
                  }
                }
                break;
              case "f":
                for (let i = 1; i < elements.length; i++) {
                  const parsedInt = parseInt(elements[i]);
                  if (isNaN(parsedInt) || parsedInt < 0) {
                    throw new Error(`${elements[i]} .obj 'f' elements must be a unsigned integer`);
                  } else {
                    indices.push(parsedInt - 1);
                  }
                }
                break;
              case "#":
              default:
                break;
            }
          }
          return new _Mesh(shaderProgram, vertices, indices);
        }
        /**
         * Asynchronously load the obj file as a mesh.
         */
        static from_obj_file(file_name, shaderProgram, f) {
          let request = new XMLHttpRequest();
          request.onreadystatechange = function() {
            if (request.readyState != 4) {
              return;
            }
            if (request.status != 200) {
              throw new Error("HTTP error when opening .obj file: ");
            }
            let loaded_mesh = _Mesh.from_obj_text(shaderProgram, request.responseText);
            console.log("loaded ", `objs/${file_name}`);
            f(loaded_mesh);
          };
          request.open("GET", `objs/${file_name}`);
          request.send();
        }
        /*
        *  renders the mesh every frame.
        */
        render() {
          this.shaderProgram.Load();
          const prevVertBuffer = Buffer_default.bindArrayBuffer(this.verts);
          const prevElemBuffer = Buffer_default.bindElementArrayBuffer(this.indis);
          this.RenderNext();
          Buffer_default.bindArrayBuffer(prevVertBuffer);
          Buffer_default.bindElementArrayBuffer(prevElemBuffer);
          ShaderProgram_default.UnloadAny();
        }
        RenderOnce() {
          this.shaderProgram.setVertexAttributesToBuffer();
          if (this.isFaceCulling) {
            Engine3D_default.inst.GL.frontFace(this.windingOrder);
            Engine3D_default.inst.GL.cullFace(this.cullingFace);
            Engine3D_default.inst.GL.enable(WebGL2RenderingContext.CULL_FACE);
          } else {
            Engine3D_default.inst.GL.disable(WebGL2RenderingContext.CULL_FACE);
          }
          Engine3D_default.inst.GL.drawElements(WebGL2RenderingContext.TRIANGLES, this.n_indis, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
        }
        rot_amt_xz = 0;
        rot_speed_xz = -0.125;
        RenderNext() {
          this.rot_amt_xz += this.rot_speed_xz * Time_default.deltaTime;
          const mat = Mat4_default.translation(0, 0, 2.2).multiply(Mat4_default.rotation_xz(this.rot_amt_xz).multiply(Mat4_default.scale(1.5, 1.5, 1.5)));
          this.shaderProgram.setModelUniform_Mat4x4(mat);
          this.shaderProgram.setProjectionUniform_Mat4x4(Mat4_default.perspectiveUsingFrustum(0.25, Engine3D_default.inst.VIEWPORT.aspectRatio, 1, 10));
          this.RenderOnce();
        }
        /*
        *  Enables Culling For Mesh
        */
        EnableCulling() {
          this.isFaceCulling = true;
        }
        /*
        *  Disables Culling For Mesh
        */
        DisableCulling() {
          this.isFaceCulling = false;
        }
        /*
        *  sets the face(s) that will be culled from render
        */
        SetCullingFace(cullingFace) {
          if (cullingFace !== WebGL2RenderingContext.BACK && cullingFace !== WebGL2RenderingContext.FRONT && cullingFace !== WebGL2RenderingContext.FRONT_AND_BACK) {
            throw new Error("The culling face that was set does not exist -> Culling face: " + cullingFace);
          } else {
            this.cullingFace = cullingFace;
          }
        }
        /*
        
            *  Sets the current meshes render winding order to clock wise
        
            public SetToWindingOrderCW():void {
                this.windingOrder = WebGL2RenderingContext.CW;
            }
        
        
            *  Sets the current meshes render winding order to counter clock wise
        
            public SetToWindingOrderCWW():void {
                this.windingOrder = WebGL2RenderingContext.CCW;
            }
            */
      };
      Mesh_default = Mesh;
    }
  });

  // src/engine/rendering/Renderer.ts
  var Renderer, Renderer_default;
  var init_Renderer = __esm({
    "src/engine/rendering/Renderer.ts"() {
      init_Engine3D();
      init_ShaderProgram();
      init_Time();
      init_Mesh();
      Renderer = class _Renderer {
        static updateTimeEvent = new Event("updateTimeEvent");
        meshes;
        shaderProgram;
        constructor() {
          new Time_default();
          this.shaderProgram = new ShaderProgram_default(1 /* COORDINATES */);
          this.shaderProgram.CompileAttachAndLink().then(
            () => {
              this.meshes = [];
              const mesh1 = Mesh_default.box(this.shaderProgram, 1, 1, 1);
              this.meshes.push(mesh1);
              this.initializeClearPresets();
              this.initializePresets();
              this.clear();
              this.render();
            }
          );
        }
        AddToMeshes(mesh) {
          this.meshes.push(mesh);
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
        }
        render() {
          document.dispatchEvent(_Renderer.updateTimeEvent);
          const aniFrameID = window.requestAnimationFrame(this.render.bind(this));
          this.clear();
          try {
            for (const mesh of this.meshes) {
              mesh.render();
            }
          } catch (e) {
            console.error(e);
            window.cancelAnimationFrame(aniFrameID);
          }
        }
      };
      Renderer_default = Renderer;
    }
  });

  // src/engine/rendering/Viewport.ts
  var Viewport, Viewport_default;
  var init_Viewport = __esm({
    "src/engine/rendering/Viewport.ts"() {
      init_Engine3D();
      Viewport = class {
        canvas;
        _width;
        _height;
        constructor(canvas, width = 640, height = 360) {
          this.canvas = canvas;
          this._width = width;
          this._height = height;
          this.SetResolution(this._width, this._height);
        }
        get width() {
          return this._width;
        }
        get height() {
          return this._height;
        }
        get aspectRatio() {
          return this._width / this._height;
        }
        SetResolution(width, height) {
          this.canvas.width = width;
          this.canvas.height = height;
          Engine3D_default.inst.GL.viewport(0, 0, width, height);
        }
      };
      Viewport_default = Viewport;
    }
  });

  // src/engine/Engine3D.ts
  var Engine3D, Engine3D_default;
  var init_Engine3D = __esm({
    "src/engine/Engine3D.ts"() {
      init_Renderer();
      init_Viewport();
      Engine3D = class _Engine3D {
        static instance;
        gl;
        renderer;
        viewport;
        constructor(canvas) {
          if (_Engine3D.instance !== null && _Engine3D.instance !== void 0) {
            throw new Error("Cannot Have Two instances of Engine3D");
          }
          _Engine3D.instance = this;
          this.gl = canvas.getContext("webgl2");
          this.viewport = new Viewport_default(canvas, 1280, 720);
          this.renderer = new Renderer_default();
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
        // Gets the rendering Context Of The Engine
        //
        get GL() {
          return this.gl;
        }
        get VIEWPORT() {
          return this.viewport;
        }
      };
      Engine3D_default = Engine3D;
    }
  });

  // src/index.ts
  var require_index = __commonJS({
    "src/index.ts"() {
      init_Engine3D();
      var canvas = document.getElementById("canvas");
      var engine = new Engine3D_default(canvas);
    }
  });
  require_index();
})();
