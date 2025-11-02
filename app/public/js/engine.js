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
        addSourceField(atr, atrLoc) {
          this._source_attribs[`${atr}`] = { name: `${atr}`, location: atrLoc };
        }
        addSourceUniform(atr, atrLoc) {
          this._source_attribs[`${atr}`] = { name: `${atr}`, location: atrLoc };
        }
        /*
         * gets field attribute location otherwise returns -1 if it does not exist, or atr name is reserved for built in
        */
        CheckFieldAttribute(shaderProgram, atr) {
          const fieldAttribLoc = Engine3D_default.inst.GL.getAttribLocation(shaderProgram, atr);
          let err = Engine3D_default.inst.GL.getError();
          if (err != 0) {
            throw new Error("invalid program. Error: " + err);
          }
          return fieldAttribLoc;
        }
        /*
         * gets uniform attribute location otherwise returns null if it does not exist, or atr name is reserved for built in
        */
        CheckUniformAttribute(shaderProgram, atr) {
          const uniformAttribLoc = Engine3D_default.inst.GL.getUniformLocation(shaderProgram, atr);
          let err = Engine3D_default.inst.GL.getError();
          if (err != 0) {
            throw new Error("invalid program. Error: " + err);
          }
          return uniformAttribLoc;
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
          let shaderName = "";
          switch (this.shader_type) {
            case WebGL2RenderingContext.VERTEX_SHADER:
              fullPath += `/vertex-shaders/${this.fileName}.vert`;
              shaderName = "vertex";
              break;
            case WebGL2RenderingContext.FRAGMENT_SHADER:
              fullPath += `/fragment-shaders/${this.fileName}.frag`;
              shaderName = "fragment";
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
              throw new Error(`[CAG] - Could Not Find File! Check if your file includes the correct shader extension and that the filename parameter input does not include the extension.`);
            }
            const source = await resp.text();
            this.loadShader(source);
            this.compileShader();
          } catch (e) {
            throw new Error(`[CAG] - Something Went Wrong With Retrieving the ${shaderName} Shader at ${fullPath} - error ${e}`);
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
      VertexShader = class extends Shader_default {
        constructor(fileName) {
          super(Engine3D_default.inst.GL.VERTEX_SHADER, fileName);
        }
        findThenAddExistingAttributes(shaderProgram) {
          let atrFieldNames = ["coordinates", "color", "uv"];
          let atrUniNames = ["model", "projection", "view"];
          atrUniNames.forEach((atrUniName) => {
            let atrUniLoc = super.CheckUniformAttribute(shaderProgram, atrUniName);
            if (atrUniLoc != null) {
              super.addSourceUniform(atrUniName, atrUniLoc);
            }
          });
          atrFieldNames.forEach((atrFieldName) => {
            let atrFieldLoc = super.CheckFieldAttribute(shaderProgram, atrFieldName);
            if (atrFieldLoc !== -1) {
              super.addSourceField(atrFieldName, atrFieldLoc);
            }
          });
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
      FragmentShader = class extends Shader_default {
        /*
         *  fileName: file name of the fragment shader
        */
        constructor(fileName) {
          super(Engine3D_default.inst.GL.FRAGMENT_SHADER, fileName);
        }
        findThenAddExistingAttributes(shaderProgram) {
          throw new Error("Method Does Not Need To Be Called Yet");
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
          this.x = vec4.X;
          this.y = vec4.Y;
          this.z = vec4.Z;
          this.w = vec4.W ?? 0;
        }
        static create(x, y, z, w) {
          return new _Vec4({ X: x, Y: y, Z: z, W: w });
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
          const normalizedVec4 = { X: this.x / magnitude, Y: this.y / magnitude, Z: this.z / magnitude, W: this.w / magnitude };
          return new _Vec4(normalizedVec4);
        }
        /**
         * Returns the vector that is this vector scaled by the given scalar(magnitude).
         **/
        scaled(scalar) {
          const scaledVec4 = {
            X: this.x * scalar,
            Y: this.y * scalar,
            Z: this.z * scalar,
            W: this.w * scalar
          };
          return new _Vec4(scaledVec4);
        }
        /**
         * Returns the dot product between this vector and other
         */
        dot(other) {
          const productVec4 = {
            X: this.x * other.x,
            Y: this.y * other.y,
            Z: this.z * other.z,
            W: this.w * other.w
          };
          return productVec4.X + productVec4.Y + productVec4.Z + productVec4.W;
        }
        /**
         * Returns the vector sum between this and other.
         */
        add(other) {
          const summedVec4 = {
            X: this.x + other.x,
            Y: this.y + other.y,
            Z: this.z + other.z,
            W: this.w + other.w
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
            X: this.y * other.z - this.z * other.y,
            Y: this.x * other.z - this.z * other.x,
            Z: this.x * other.y - this.y * other.x,
            W: 0
          };
          return new _Vec4(crossProductVec4);
        }
        /*
         * finds the normal of a triangle
        */
        static normalVertex(baseVertex, firstVertex, secondVertex) {
          const firstEdge = firstVertex.sub(baseVertex);
          const secondEdge = secondVertex.sub(baseVertex);
          return firstEdge.cross(secondEdge);
        }
        /**
         * Returns the vector values as a string.
         */
        toString() {
          return `${_Vec4}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z}, ${this.w} ]`;
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
        getColumn(colNum) {
          return new Vec4_default({
            X: this.data[0 + colNum],
            Y: this.data[4 + colNum],
            Z: this.data[8 + colNum],
            W: this.data[12 + colNum]
          });
        }
        vectorBasisX() {
          return this.getColumn(0);
        }
        vectorBasisY() {
          return this.getColumn(1);
        }
        vectorBasisZ() {
          return this.getColumn(2);
        }
        vectorBasisW() {
          return this.getColumn(3);
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
            X: this.data[0] * vec4.X + this.data[1] * vec4.Y + this.data[2] * vec4.Z + this.data[3] * vec4.W,
            // m4
            Y: this.data[4] * vec4.X + this.data[5] * vec4.Y + this.data[6] * vec4.Z + this.data[7] * vec4.W,
            // m8
            Z: this.data[8] * vec4.X + this.data[9] * vec4.Y + this.data[10] * vec4.Z + this.data[11] * vec4.W,
            // m12
            W: this.data[12] * vec4.X + this.data[13] * vec4.Y + this.data[14] * vec4.Z + this.data[15] * vec4.W
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
        static shaderPrograms = {};
        static coord_count = 3;
        static color_count = 4;
        static uv_count = 2;
        _vertexShader;
        _fragmentShader;
        _program;
        shaderFileName;
        constructor(filename) {
          this.shaderFileName = filename;
          this._program = Engine3D_default.inst.GL.createProgram();
          this._vertexShader = new VertexShader_default(this.shaderFileName);
          this._fragmentShader = new FragmentShader_default(this.shaderFileName);
        }
        // @ts-ignore
        // TODO make it so that this cant be loaded multiple times
        static async LoadShaderPrograms() {
          await _ShaderProgram.AddToShaderPrograms("default");
          await _ShaderProgram.AddToShaderPrograms("coordinates");
        }
        // @ts-ignore
        static async AddToShaderPrograms(fileName) {
          const newShaderProgram = new _ShaderProgram(fileName);
          await newShaderProgram.CompileAttachAndLink();
          _ShaderProgram.shaderPrograms[fileName] = newShaderProgram;
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
            this._vertexShader.findThenAddExistingAttributes(this._program);
            return;
          } catch (err) {
            throw new Error(err);
          }
        }
        get vertexShader() {
          return this._vertexShader;
        }
        get ShaderFileName() {
          return this.shaderFileName;
        }
        get fragmentShader() {
          return this._fragmentShader;
        }
        get program() {
          return this._program;
        }
        static get ShaderPrograms() {
          return _ShaderProgram.shaderPrograms;
        }
        static UnloadAny() {
          Engine3D_default.inst.GL.useProgram(null);
        }
        Load() {
          Engine3D_default.inst.GL.useProgram(this._program);
          this.setModelUniform_Mat4x4(new Mat4_default(1 /* Identity */));
          this.setViewUniform_Mat4x4(new Mat4_default(1 /* Identity */));
          this.setProjectionUniform_Mat4x4(new Mat4_default(1 /* Identity */));
        }
        setModelUniform_Mat4x4(mat4) {
          Engine3D_default.inst.GL.uniformMatrix4fv(this.vertexShader.source_attribs["model"].location, true, mat4.getData());
        }
        setViewUniform_Mat4x4(mat4) {
          Engine3D_default.inst.GL.uniformMatrix4fv(this.vertexShader.source_attribs["view"].location, true, mat4.getData());
        }
        setProjectionUniform_Mat4x4(mat4) {
          Engine3D_default.inst.GL.uniformMatrix4fv(this.vertexShader.source_attribs["projection"].location, true, mat4.getData());
        }
        setVertexAttributesToBuffer() {
          let interleavedLength = 0;
          interleavedLength = this._vertexShader.source_attribs["coordinates"] !== void 0 ? interleavedLength + _ShaderProgram.coord_count : interleavedLength;
          interleavedLength = this._vertexShader.source_attribs["color"] !== void 0 ? interleavedLength + _ShaderProgram.color_count : interleavedLength;
          interleavedLength = this._vertexShader.source_attribs["uv"] !== void 0 ? interleavedLength + _ShaderProgram.uv_count : interleavedLength;
          let currOffset = 0;
          if (this._vertexShader.source_attribs["coordinates"] !== void 0) {
            const cordLoc = this.vertexShader.source_attribs["coordinates"].location;
            Engine3D_default.inst.GL.vertexAttribPointer(cordLoc, _ShaderProgram.coord_count, WebGL2RenderingContext.FLOAT, false, interleavedLength * Float32Array.BYTES_PER_ELEMENT, 0);
            Engine3D_default.inst.GL.enableVertexAttribArray(cordLoc);
            currOffset += _ShaderProgram.coord_count;
          }
          if (this._vertexShader.source_attribs["color"] !== void 0) {
            const colorLoc = this.vertexShader.source_attribs["color"].location;
            Engine3D_default.inst.GL.vertexAttribPointer(colorLoc, _ShaderProgram.color_count, WebGL2RenderingContext.FLOAT, false, interleavedLength * Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D_default.inst.GL.enableVertexAttribArray(colorLoc);
            currOffset += _ShaderProgram.color_count;
          }
          if (this._vertexShader.source_attribs["uv"] !== void 0) {
            const uvLoc = this.vertexShader.source_attribs["uv"].location;
            Engine3D_default.inst.GL.vertexAttribPointer(uvLoc, _ShaderProgram.uv_count, WebGL2RenderingContext.FLOAT, false, interleavedLength * Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D_default.inst.GL.enableVertexAttribArray(uvLoc);
            currOffset += _ShaderProgram.uv_count;
          }
        }
      };
      ShaderProgram_default = ShaderProgram;
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

  // src/engine/linear-algebra/Vec3.ts
  var Vec3, Vec3_default;
  var init_Vec3 = __esm({
    "src/engine/linear-algebra/Vec3.ts"() {
      Vec3 = class _Vec3 {
        x;
        y;
        z;
        constructor(vec3 = { X: 0, Y: 0, Z: 0 }) {
          this.x = vec3.X;
          this.y = vec3.Y;
          this.z = vec3.Z;
        }
        static create(x, y, z) {
          return new _Vec3({ X: x, Y: y, Z: z });
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
        /**
         * Returns the length of this vector
         */
        get magnitude() {
          return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }
        /**
         * Returns a normalized version of this vector
         */
        normalized() {
          const magnitude = this.magnitude;
          const normalizedVec3 = { X: this.x / magnitude, Y: this.y / magnitude, Z: this.z / magnitude };
          return new _Vec3(normalizedVec3);
        }
        /**
         * Returns the vector that is this vector scaled by the given scalar(magnitude).
         **/
        scaled(scalar) {
          const scaledVec4 = {
            X: this.x * scalar,
            Y: this.y * scalar,
            Z: this.z * scalar
          };
          return new _Vec3(scaledVec4);
        }
        /**
         * Returns the dot product between this vector and other
         */
        dot(other) {
          const productVec4 = {
            X: this.x * other.x,
            Y: this.y * other.y,
            Z: this.z * other.z
          };
          return productVec4.X + productVec4.Y + productVec4.Z;
        }
        /**
         * Returns the vector sum between this and other.
         */
        add(other) {
          const summedVec4 = {
            X: this.x + other.x,
            Y: this.y + other.y,
            Z: this.z + other.z
          };
          return new _Vec3(summedVec4);
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
            X: this.y * other.z - this.z * other.y,
            Y: this.x * other.z - this.z * other.x,
            Z: this.x * other.y - this.y * other.x
          };
          return new _Vec3(crossProductVec4);
        }
        /*
         * finds the normal of a triangle
        */
        static normalVertex(baseVertex, firstVertex, secondVertex) {
          const firstEdge = firstVertex.sub(baseVertex);
          const secondEdge = secondVertex.sub(baseVertex);
          return firstEdge.cross(secondEdge);
        }
        /**
         * Returns the vector values as a string.
         */
        toString() {
          return `${_Vec3}(x,y,z,w): [ ${this.x}, ${this.y}, ${this.z} ]`;
        }
      };
      Vec3_default = Vec3;
    }
  });

  // src/engine/Transform.ts
  var Transform, Transform_default;
  var init_Transform = __esm({
    "src/engine/Transform.ts"() {
      init_Vec3();
      init_Mat4();
      Transform = class {
        positon = new Vec3_default({ X: 0, Y: 0, Z: 0 });
        scale = new Vec3_default({ X: 1, Y: 1, Z: 1 });
        rotation = new Vec3_default({ X: 0, Y: 0, Z: 0 });
        constructor() {
        }
        modelMatrix() {
          return Mat4_default.translation(this.positon.x, this.positon.y, this.positon.z).multiply(Mat4_default.rotation_xz(this.rotation.y).multiply(Mat4_default.rotation_yz(this.rotation.x).multiply(Mat4_default.rotation_xy(this.rotation.z).multiply(Mat4_default.scale(this.scale.x, this.scale.y, this.scale.z).multiply(Mat4_default.identity())))));
        }
        localDirectionZ() {
          return this.modelMatrix().vectorBasisZ().normalized();
        }
        localDirectionY() {
          return this.modelMatrix().vectorBasisY().normalized();
        }
        localDirectionX() {
          return this.modelMatrix().vectorBasisX().normalized();
        }
      };
      Transform_default = Transform;
    }
  });

  // src/engine/Texture.ts
  var Texture, Texture_default;
  var init_Texture = __esm({
    "src/engine/Texture.ts"() {
      init_Engine3D();
      Texture = class _Texture {
        static bytes_per_pixel = 4;
        //RGBA
        static textures = {};
        texture;
        static XOR_TEXTURE_DATA(width) {
          const data = new Uint8Array(width * width * _Texture.bytes_per_pixel);
          for (let row = 0; row < width; row++) {
            for (let col = 0; col < width; col++) {
              let pixLoc = (row * width + col) * 4;
              data[pixLoc] = data[pixLoc + 1] = data[pixLoc + 2] = row ^ col;
              data[pixLoc + 3] = 255;
            }
          }
          return _Texture.CreateTexture(data, width, width);
        }
        static CreateTexture(data, width, height) {
          const textNew = new _Texture();
          textNew.texture = Engine3D_default.inst.GL.createTexture();
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, textNew.texture);
          Engine3D_default.inst.GL.texImage2D(
            WebGL2RenderingContext.TEXTURE_2D,
            0,
            WebGL2RenderingContext.RGBA,
            width,
            height,
            0,
            WebGL2RenderingContext.RGBA,
            WebGL2RenderingContext.UNSIGNED_BYTE,
            data
          );
          Engine3D_default.inst.GL.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
          Engine3D_default.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR);
          Engine3D_default.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
          return textNew;
        }
        static CreateImageBitMapTexture(imageBitMap) {
          const textNew = new _Texture();
          textNew.texture = Engine3D_default.inst.GL.createTexture();
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, textNew.texture);
          Engine3D_default.inst.GL.texImage2D(
            WebGL2RenderingContext.TEXTURE_2D,
            0,
            WebGL2RenderingContext.RGBA,
            WebGL2RenderingContext.RGBA,
            WebGL2RenderingContext.UNSIGNED_BYTE,
            imageBitMap
          );
          Engine3D_default.inst.GL.generateMipmap(WebGL2RenderingContext.TEXTURE_2D);
          Engine3D_default.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MIN_FILTER, WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR);
          Engine3D_default.inst.GL.texParameteri(WebGL2RenderingContext.TEXTURE_2D, WebGL2RenderingContext.TEXTURE_MAG_FILTER, WebGL2RenderingContext.LINEAR);
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
          return textNew;
        }
        // @ts-ignore
        static async LoadTextures() {
          _Texture.textures["xor"] = _Texture.XOR_TEXTURE_DATA(256);
          _Texture.textures["texture_map"] = await _Texture.AddToTextures("texture_map.png");
          _Texture.textures["test"] = await _Texture.AddToTextures("test.gif");
          _Texture.textures["test2"] = await _Texture.AddToTextures("test2.jpg");
          _Texture.textures["metal_scale"] = await _Texture.AddToTextures("metal_scale.png");
        }
        // @ts-ignore
        static async AddToTextures(fileName) {
          const resp = await fetch(`/tex/${fileName}`, {
            method: "GET",
            headers: {
              "Content-Type": "image/*"
            }
          });
          const imageBlob = await resp.blob();
          const imageBitMap = await createImageBitmap(imageBlob);
          return this.CreateImageBitMapTexture(imageBitMap);
        }
        static get Textures() {
          return this.textures;
        }
        bindTexture() {
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.texture);
        }
        static unBindTexture() {
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
        }
      };
      Texture_default = Texture;
    }
  });

  // src/engine/SceneObject.ts
  var SceneObject, SceneObject_default;
  var init_SceneObject = __esm({
    "src/engine/SceneObject.ts"() {
      init_Transform();
      init_Texture();
      SceneObject = class {
        mesh;
        texture;
        transform = new Transform_default();
        constructor(mesh = null) {
          this.mesh = mesh;
          this.texture = Texture_default.Textures["xor"];
        }
        //abstract fixedUpdate():void;
        //abstract update():void;
        /*
        *  renders the object every frame.
        */
        render() {
          if (this.mesh !== null) {
            this.mesh.render(this.transform, this.texture);
          }
        }
        set Texture(texture) {
          this.texture = texture;
        }
      };
      SceneObject_default = SceneObject;
    }
  });

  // src/engine/InputDevices/Key.ts
  var Key, Key_default;
  var init_Key = __esm({
    "src/engine/InputDevices/Key.ts"() {
      Key = class {
        _code;
        _isPressed;
        OnKeyUp = [];
        OnKeyDown = [];
        constructor(code, isPressed = false) {
          this._code = code;
          document.addEventListener("keydown", this.keyPressed.bind(this));
          document.addEventListener("keyup", this.keyReleased.bind(this));
          this._isPressed = isPressed;
        }
        keyPressed(event) {
          const code = event.code;
          if (!this._isPressed) {
            if (this.code === code) {
              this._isPressed = true;
              this.OnKeyDown.forEach(
                (action) => {
                  action.doAction(this);
                }
              );
            }
          }
        }
        keyReleased(event) {
          const code = event.code;
          if (this._isPressed) {
            if (this.code === code) {
              this._isPressed = false;
              this.OnKeyUp.forEach(
                (action) => {
                  action.doAction(this);
                }
              );
            }
          }
        }
        /*
         * adds a listener for when the key is pressed
         * returns: whether the listener was successfully added as true otherwise false
        */
        addKeyDownListener(action) {
          const exists = this.OnKeyDown.every((exAction) => {
            exAction.name !== action.name;
          });
          if (!exists) {
            return false;
          }
          this.OnKeyDown.push(action);
          return true;
        }
        /*
         * removes a listener for when the key is pressed
         * returns: whether the listener was successfully removed as true otherwise false
        */
        removeKeyDownListener(name) {
          let isDeleted = false;
          this.OnKeyDown = this.OnKeyDown.filter((data) => {
            if (!isDeleted) {
              if (data.name !== name) {
                isDeleted = true;
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
          });
          return isDeleted;
        }
        /*
         * adds a listener for when the key is released
         * returns: whether the listener was successfully added as true otherwise false
        */
        addKeyUpListener(action) {
          const exists = this.OnKeyUp.every((exAction) => {
            exAction.name !== action.name;
          });
          if (!exists) {
            return false;
          }
          this.OnKeyUp.push(action);
          return true;
        }
        /*
         * removes a listener for when the key is released
         * returns: whether the listener was successfully removed as true otherwise false
        */
        removeKeyUpListener(name) {
          let isDeleted = false;
          this.OnKeyUp = this.OnKeyUp.filter((data) => {
            if (!isDeleted) {
              if (data.name !== name) {
                isDeleted = true;
                return false;
              } else {
                return true;
              }
            } else {
              return true;
            }
          });
          return isDeleted;
        }
        get code() {
          return this._code;
        }
        /*
         * whether the key is currently being pressed or not
        */
        get isPressing() {
          return this._isPressed;
        }
        /*
         * whether the key is down or not
        */
        get isKeyDown() {
          return this._isPressed;
        }
        ar;
        /*
         * whether the key is up or not
        */
        get isKeyUp() {
          return !this._isPressed;
        }
      };
      Key_default = Key;
    }
  });

  // src/engine/InputDevices/Keyboard.ts
  var Keyboard, Keyboard_default;
  var init_Keyboard = __esm({
    "src/engine/InputDevices/Keyboard.ts"() {
      init_Key();
      Keyboard = class _Keyboard {
        static _inst;
        static keys = {};
        constructor() {
          if (_Keyboard._inst === null) {
            new Error("Can only have one instance of Keyboard");
          }
          _Keyboard._inst = this;
          document.addEventListener("keydown", _Keyboard.addKeyOnPress);
        }
        /*
         * when a key is pressed, and it does not exist, adds it to the available keys
        */
        static addKeyOnPress(event) {
          const code = event.code;
          console.log(code);
          if (!_Keyboard.keys[code]) {
            _Keyboard.keys[code] = new Key_default(code, true);
          }
        }
        /*
         * gets a key by its code name from KeyboardEvent; (adds a key that has not been added if it does not exist)
        */
        static getKey(code) {
          if (!_Keyboard.keys[code]) {
            _Keyboard.keys[code] = new Key_default(code);
          }
          return _Keyboard.keys[code];
        }
      };
      Keyboard_default = Keyboard;
    }
  });

  // src/engine/Time.ts
  var Time, Time_default;
  var init_Time = __esm({
    "src/engine/Time.ts"() {
      Time = class _Time {
        static _inst;
        static TICK_RATE = 60;
        static MILI_SEC_PER_TICK = 1e3 / this.TICK_RATE;
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
        static get timeElapsed() {
          return window.performance.now();
        }
        static get fixedTime() {
          return _Time.MILI_SEC_PER_TICK / 1e3;
        }
      };
      Time_default = Time;
    }
  });

  // src/engine/linear-algebra/Vec2.ts
  var Vec2, Vec2_default;
  var init_Vec2 = __esm({
    "src/engine/linear-algebra/Vec2.ts"() {
      Vec2 = class _Vec2 {
        x;
        y;
        constructor(vec2) {
          this.x = vec2.X;
          this.y = vec2.Y;
        }
        static create(x, y) {
          return new _Vec2({ X: x, Y: y });
        }
        get X() {
          return this.x;
        }
        get Y() {
          return this.y;
        }
        /**
         * Returns the length of this vector
         */
        get magnitude() {
          return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        /**
         * Returns a normalized version of this vector
         */
        normalized() {
          const magnitude = this.magnitude;
          const normalizedVec4 = { X: this.x / magnitude, Y: this.y / magnitude };
          return new _Vec2(normalizedVec4);
        }
        /**
         * Returns the vector that is this vector scaled by the given scalar(magnitude).
         **/
        scaled(scalar) {
          const scaledVec4 = {
            X: this.x * scalar,
            Y: this.y * scalar
          };
          return new _Vec2(scaledVec4);
        }
        /**
         * Returns the vector sum between this and other.
         */
        add(other) {
          const summedVec4 = {
            X: this.x + other.x,
            Y: this.y + other.y
          };
          return new _Vec2(summedVec4);
        }
        /**
         * Returns the vector sub between this and other.
         */
        sub(other) {
          return this.add(other.scaled(-1));
        }
        /**
         * Returns the vector values as a string.
         */
        toString() {
          return `${_Vec2}(x,y): [ ${this.x}, ${this.y} ]`;
        }
      };
      Vec2_default = Vec2;
    }
  });

  // src/engine/Camera.ts
  var Camera, Camera_default;
  var init_Camera = __esm({
    "src/engine/Camera.ts"() {
      init_SceneObject();
      init_Mat4();
      init_Vec3();
      init_Mat4();
      init_Keyboard();
      init_Time();
      init_Vec2();
      Camera = class _Camera extends SceneObject_default {
        /*
         *  returns the perspective projection matrix defined by a frustum
        */
        static frustum(left, right, bottom, top, near, far) {
          let scale_x = 2 * near / (right - left);
          let scale_y = 2 * near / (top - bottom);
          let t_x = (right + left) / (right - left);
          let t_y = (top + bottom) / (top - bottom);
          const c2 = (far + near) / (far - near);
          const c1 = 2 * far * near / (far - near);
          return new Mat4_default([
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
        *  returns the perspective projection matrix defined by a perspective using the frustum matrix.
        */
        static perspectiveUsingFrustum(tau, aspectRatio, near, far, offset = new Vec2_default({ X: 0, Y: 0 })) {
          const top = Math.tan(Mat4_default.tau_to_radians(tau) / 2) * near;
          const bottom = -top;
          const right = top * aspectRatio;
          const left = -right;
          return _Camera.frustum(left - offset.X, right - offset.X, bottom - offset.Y, top - offset.Y, near, far);
        }
        /*
        * returns the view using the camera model matrix data
        */
        getViewInverseOfModelMatrix() {
          const scale = {
            X: this.transform.scale.x === 0 ? 0 : 1 / this.transform.scale.x,
            Y: this.transform.scale.y === 0 ? 0 : 1 / this.transform.scale.y,
            Z: this.transform.scale.z === 0 ? 0 : 1 / this.transform.scale.z
          };
          const translationMat = Mat4_default.translation(-this.transform.positon.x, -this.transform.positon.y, -this.transform.positon.z);
          const rotationMat = Mat4_default.rotation_xy(-this.transform.rotation.z).multiply(Mat4_default.rotation_yz(-this.transform.rotation.x).multiply(Mat4_default.rotation_xz(-this.transform.rotation.y)));
          const scaleMat = Mat4_default.scale(scale.X, scale.Y, scale.Z);
          return Mat4_default.identity().multiply(scaleMat.multiply(rotationMat.multiply(translationMat)));
        }
        static normalSpeed = 0.125;
        static spd = 0;
        /*
        *  controls for noclipping mainly for the editor camera
        */
        noClipControls() {
          _Camera.spd = _Camera.normalSpeed;
          if (Keyboard_default.getKey("ShiftLeft").isPressing) {
            _Camera.spd *= 2.5;
          }
          const camLocalDirectionZ = this.transform.localDirectionZ();
          const camDirection = new Vec3_default({ X: camLocalDirectionZ.X, Y: camLocalDirectionZ.Y, Z: camLocalDirectionZ.Z });
          const camLocalDirectionX = this.transform.localDirectionX();
          const camPerpDirection = new Vec3_default({ X: camLocalDirectionX.X, Y: camLocalDirectionX.Y, Z: camLocalDirectionX.Z });
          let positionChange = new Vec3_default({ X: 0, Y: 0, Z: 0 });
          if (Keyboard_default.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(_Camera.spd * Time_default.fixedTime));
          }
          if (Keyboard_default.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(_Camera.spd * Time_default.fixedTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(_Camera.spd * Time_default.fixedTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(_Camera.spd * Time_default.fixedTime));
          }
          this.transform.positon = this.transform.positon.add(positionChange);
          if (Keyboard_default.getKey("KeyC").isPressing) {
            this.transform.positon.y -= _Camera.spd * Time_default.fixedTime;
          }
          if (Keyboard_default.getKey("Space").isPressing) {
            this.transform.positon.y += _Camera.spd * Time_default.fixedTime;
          }
          if (Keyboard_default.getKey("KeyQ").isPressing) {
            this.transform.rotation.z -= _Camera.spd * Time_default.fixedTime;
          }
          if (Keyboard_default.getKey("KeyE").isPressing) {
            this.transform.rotation.z += _Camera.spd * Time_default.fixedTime;
          }
          if (Keyboard_default.getKey("ArrowUp").isPressing) {
            if (this.transform.rotation.x < 0.24) {
              this.transform.rotation.x += _Camera.spd * Time_default.fixedTime;
            } else {
              this.transform.rotation.x = 0.24;
            }
          }
          if (Keyboard_default.getKey("ArrowDown").isPressing) {
            if (this.transform.rotation.x > -0.24) {
              this.transform.rotation.x -= _Camera.spd * Time_default.fixedTime;
            } else {
              this.transform.rotation.x = -0.24;
            }
          }
          if (Keyboard_default.getKey("ArrowLeft").isPressing) {
            this.transform.rotation.y += _Camera.spd * Time_default.fixedTime;
          }
          if (Keyboard_default.getKey("ArrowRight").isPressing) {
            this.transform.rotation.y -= _Camera.spd * Time_default.fixedTime;
          }
        }
      };
      Camera_default = Camera;
    }
  });

  // src/engine/Scene.ts
  var Scene, Scene_default;
  var init_Scene = __esm({
    "src/engine/Scene.ts"() {
      init_SceneObject();
      init_Time();
      init_Vec3();
      init_Keyboard();
      init_Mesh();
      init_Texture();
      Scene = class {
        _objects = [];
        constructor() {
          Keyboard_default.getKey("KeyA").addKeyDownListener({ name: "print_key", doAction(key) {
            console.log(key.code);
          } });
          const cubeObj1 = new SceneObject_default(Mesh_default.Meshes["cubeD"]);
          cubeObj1.Texture = Texture_default.Textures["texture_map"];
          this._objects.push(cubeObj1);
          cubeObj1.transform.positon = new Vec3_default({ X: 0, Y: 0, Z: 0.4 });
          cubeObj1.transform.scale = new Vec3_default({ X: 0.15, Y: 0.15, Z: 0.15 });
          const cubeObj2 = new SceneObject_default(Mesh_default.Meshes["sphere"]);
          cubeObj2.Texture = Texture_default.Textures["metal_scale"];
          this._objects.push(cubeObj2);
          cubeObj2.transform.positon = new Vec3_default({ X: 0, Y: 0, Z: -0.4 });
          cubeObj2.transform.scale = new Vec3_default({ X: 0.15, Y: 0.15, Z: 0.15 });
          const cubeObj3 = new SceneObject_default(Mesh_default.Meshes["cubeC"]);
          this._objects.push(cubeObj3);
          cubeObj3.transform.positon = new Vec3_default({ X: 0.4, Y: 0, Z: 0 });
          cubeObj3.transform.scale = new Vec3_default({ X: 0.15, Y: 0.15, Z: 0.15 });
          const cubeObj4 = new SceneObject_default(Mesh_default.Meshes["cubeC"]);
          this._objects.push(cubeObj4);
          cubeObj4.transform.positon = new Vec3_default({ X: -0.4, Y: 0, Z: 0 });
          cubeObj4.transform.scale = new Vec3_default({ X: 0.15, Y: 0.15, Z: 0.15 });
          const cubeObj5 = new SceneObject_default(Mesh_default.Meshes["loaded"]);
          this._objects.push(cubeObj5);
          cubeObj5.transform.positon = new Vec3_default({ X: 0, Y: 5, Z: 0 });
        }
        rot_amt_xz = 0;
        rot_speed_xz = -0.125;
        fixedUpdate() {
          this.rot_amt_xz += this.rot_speed_xz * Time_default.fixedTime;
          this._objects[4].transform.rotation = new Vec3_default({ X: 0, Y: this.rot_amt_xz, Z: 0 });
        }
        get objects() {
          return this._objects;
        }
      };
      Scene_default = Scene;
    }
  });

  // src/engine/Editor.ts
  var Editor, Editor_default;
  var init_Editor = __esm({
    "src/engine/Editor.ts"() {
      init_Camera();
      init_Scene();
      Editor = class _Editor {
        static instance;
        static camera;
        static scene;
        constructor() {
          if (_Editor.instance != null) {
            throw new TypeError("There Can Only Exist One Version Of An Editor");
          }
          _Editor.camera = new Camera_default();
          _Editor.scene = new Scene_default();
          _Editor.instance = this;
        }
        static get Camera() {
          return this.camera;
        }
        static get Scene() {
          return this.scene;
        }
        static fixedUpdate() {
          this.scene.fixedUpdate();
          this.camera.noClipControls();
        }
      };
      Editor_default = Editor;
    }
  });

  // src/engine/rendering/Mesh.ts
  var Mesh, Mesh_default;
  var init_Mesh = __esm({
    "src/engine/rendering/Mesh.ts"() {
      init_Buffer();
      init_Engine3D();
      init_ShaderProgram();
      init_Mat4();
      init_Editor();
      init_Camera();
      init_Vec4();
      init_Texture();
      init_Vec3();
      init_Vec2();
      init_ShaderProgram();
      Mesh = class _Mesh {
        static meshes = {};
        verts;
        indis;
        n_verts;
        n_indis;
        windingOrder = WebGL2RenderingContext.CW;
        cullingFace = WebGL2RenderingContext.BACK;
        isFaceCulling = true;
        drawingMode = WebGL2RenderingContext.TRIANGLES;
        shaderProgram;
        /**
         * Creates a new mesh and loads it into video memory.
         */
        constructor(meshParams) {
          this.verts = Buffer_default.createAndLoadVertexBuffer(meshParams.verts, Engine3D_default.inst.GL.STATIC_DRAW);
          this.n_verts = meshParams.verts.length;
          this.indis = Buffer_default.createAndLoadElementsBuffer(meshParams.indis, Engine3D_default.inst.GL.STATIC_DRAW);
          this.n_indis = meshParams.indis.length;
          if (meshParams.windingOrder) {
            this.windingOrder = meshParams.windingOrder;
          }
          ;
          if (meshParams.drawingMode) {
            this.drawingMode = meshParams.drawingMode;
          }
          this.shaderProgram = meshParams.shaderProgram;
        }
        /**
         * Create a box mesh with the given dimensions and colors.
         */
        static box(shaderProgram, width, height, depth, windingOrder = WebGL2RenderingContext.CCW, rgba = new Vec4_default({ X: 1, Y: 1, Z: 1, W: 1 })) {
          const isColor = shaderProgram.vertexShader.source_attribs["color"] !== void 0;
          const isUV = shaderProgram.vertexShader.source_attribs["uv"] !== void 0;
          const isNormal = shaderProgram.vertexShader.source_attribs["normal"] !== void 0;
          let hwidth = width / 2;
          let hheight = height / 2;
          let hdepth = depth / 2;
          let verts = [];
          function vertexPusher(pos, color, uv, normal) {
            verts.push(pos.X, pos.Y, pos.Z);
            if (isColor && color) {
              verts.push(color.X, color.Y, color.Z, color.W);
            }
            if (isUV && uv) {
              verts.push(uv.X, uv.Y);
            }
            if (isNormal && normal) {
              verts.push(normal.X, normal.Y, normal.Z);
            }
          }
          function facePusher(br, bl, tl, tr, isNormalForward) {
            vertexPusher(br.pos, rgba, br.uv, Vec3_default.normalVertex(br.pos, bl.pos, tr.pos).normalized().scaled(isNormalForward ? 1 : -1));
            vertexPusher(bl.pos, rgba, bl.uv, Vec3_default.normalVertex(bl.pos, tl.pos, br.pos).normalized().scaled(isNormalForward ? 1 : -1));
            vertexPusher(tl.pos, rgba, tl.uv, Vec3_default.normalVertex(tl.pos, tr.pos, bl.pos).normalized().scaled(isNormalForward ? 1 : -1));
            vertexPusher(tr.pos, rgba, tr.uv, Vec3_default.normalVertex(tr.pos, br.pos, tl.pos).normalized().scaled(isNormalForward ? 1 : -1));
          }
          const frontBR = Vec3_default.create(hwidth, -hheight, -hdepth);
          const frontBL = Vec3_default.create(-hwidth, -hheight, -hdepth);
          const frontTL = Vec3_default.create(-hwidth, hheight, -hdepth);
          const frontTR = Vec3_default.create(hwidth, hheight, -hdepth);
          facePusher(
            { pos: frontBR, uv: Vec2_default.create(0.25, 0.5) },
            { pos: frontBL, uv: Vec2_default.create(0, 0.5) },
            { pos: frontTL, uv: Vec2_default.create(0, 0.25) },
            { pos: frontTR, uv: Vec2_default.create(0.25, 0.25) },
            windingOrder === WebGL2RenderingContext.CCW
          );
          const backBR = Vec3_default.create(hwidth, -hheight, hdepth);
          const backBL = Vec3_default.create(-hwidth, -hheight, hdepth);
          const backTL = Vec3_default.create(-hwidth, hheight, hdepth);
          const backTR = Vec3_default.create(hwidth, hheight, hdepth);
          facePusher(
            { pos: backBR, uv: Vec2_default.create(0.75, 0.5) },
            { pos: backBL, uv: Vec2_default.create(0.5, 0.5) },
            { pos: backTL, uv: Vec2_default.create(0.5, 0.25) },
            { pos: backTR, uv: Vec2_default.create(0.75, 0.25) },
            windingOrder === WebGL2RenderingContext.CW
          );
          const topBR = Vec3_default.create(hwidth, hheight, -hdepth);
          const topBL = Vec3_default.create(-hwidth, hheight, -hdepth);
          const topTL = Vec3_default.create(-hwidth, hheight, hdepth);
          const topTR = Vec3_default.create(hwidth, hheight, hdepth);
          facePusher(
            { pos: topBR, uv: Vec2_default.create(0.5, 0) },
            { pos: topBL, uv: Vec2_default.create(0.75, 0) },
            { pos: topTL, uv: Vec2_default.create(0.75, 0.25) },
            { pos: topTR, uv: Vec2_default.create(0.5, 0.25) },
            windingOrder === WebGL2RenderingContext.CCW
          );
          const bottomBR = Vec3_default.create(hwidth, -hheight, -hdepth);
          const bottomBL = Vec3_default.create(-hwidth, -hheight, -hdepth);
          const bottomTL = Vec3_default.create(-hwidth, -hheight, hdepth);
          const bottomTR = Vec3_default.create(hwidth, -hheight, hdepth);
          facePusher(
            { pos: bottomBR, uv: Vec2_default.create(0.75, 0.75) },
            { pos: bottomBL, uv: Vec2_default.create(0.5, 0.75) },
            { pos: bottomTL, uv: Vec2_default.create(0.5, 0.5) },
            { pos: bottomTR, uv: Vec2_default.create(0.75, 0.5) },
            windingOrder === WebGL2RenderingContext.CW
          );
          const leftBR = Vec3_default.create(-hwidth, -hheight, -hdepth);
          const leftBL = Vec3_default.create(-hwidth, -hheight, hdepth);
          const leftTL = Vec3_default.create(-hwidth, hheight, hdepth);
          const leftTR = Vec3_default.create(-hwidth, hheight, -hdepth);
          facePusher(
            { pos: leftBR, uv: Vec2_default.create(0.5, 0.5) },
            { pos: leftBL, uv: Vec2_default.create(0.25, 0.5) },
            { pos: leftTL, uv: Vec2_default.create(0.25, 0.25) },
            { pos: leftTR, uv: Vec2_default.create(0.5, 0.25) },
            windingOrder === WebGL2RenderingContext.CCW
          );
          const rightBR = Vec3_default.create(hwidth, -hheight, -hdepth);
          const rightBL = Vec3_default.create(hwidth, -hheight, hdepth);
          const rightTL = Vec3_default.create(hwidth, hheight, hdepth);
          const rightTR = Vec3_default.create(hwidth, hheight, -hdepth);
          facePusher(
            { pos: rightBR, uv: Vec2_default.create(1, 0.5) },
            { pos: rightBL, uv: Vec2_default.create(0.75, 0.5) },
            { pos: rightTL, uv: Vec2_default.create(0.75, 0.25) },
            { pos: rightTR, uv: Vec2_default.create(1, 0.25) },
            windingOrder === WebGL2RenderingContext.CW
          );
          console.log(verts);
          let indis = [];
          if (windingOrder === WebGL2RenderingContext.CW) {
            indis = [
              // clockwise winding
              0,
              1,
              2,
              2,
              3,
              0,
              // FRONT-FACE
              20,
              21,
              23,
              23,
              21,
              22,
              // RIGHT-FACE
              5,
              4,
              7,
              7,
              6,
              5,
              // BACK-FACE
              16,
              17,
              19,
              19,
              17,
              18,
              // LEFT-FACE
              8,
              9,
              11,
              11,
              9,
              10,
              // TOP-FACE
              12,
              13,
              15,
              15,
              13,
              14
              // BOTTOM-FACE
            ];
          } else {
            indis = [
              // counter-clockwise winding
              0,
              3,
              2,
              2,
              1,
              0,
              20,
              21,
              22,
              22,
              23,
              20,
              5,
              6,
              7,
              7,
              4,
              5,
              16,
              19,
              18,
              18,
              17,
              16,
              8,
              11,
              10,
              10,
              9,
              8,
              12,
              13,
              14,
              14,
              15,
              12
            ];
          }
          const mesh = new _Mesh({ shaderProgram, verts, indis, windingOrder });
          return mesh;
        }
        /**
         * Create a box mesh with the given dimensions and colors.
         */
        static sphereUV(shaderProgram, subDivisions, scale, rgba = new Vec4_default({ X: 1, Y: 1, Z: 1, W: 1 })) {
          const isColor = shaderProgram.vertexShader.source_attribs["color"] !== void 0;
          const isUV = shaderProgram.vertexShader.source_attribs["uv"] !== void 0;
          const isNormal = shaderProgram.vertexShader.source_attribs["normal"] !== void 0;
          const layers = subDivisions + 1;
          let verts = [];
          let indis = [];
          for (let layer = 0; layer < layers; layer++) {
            let y_turns = layer / subDivisions / 2;
            let y = Math.cos(y_turns * Mat4_default.tau_to_radians(1)) / 2 * scale;
            for (let subdiv = 0; subdiv <= subDivisions; subdiv++) {
              let turns = subdiv / subDivisions;
              let rads = turns * Mat4_default.tau_to_radians(1);
              let radius_scale = Math.sin(y_turns * Mat4_default.tau_to_radians(1));
              let x = Math.cos(rads) / 2 * radius_scale;
              let z = Math.sin(rads) / 2 * radius_scale;
              verts.push(x, y, z);
              if (isColor) {
                verts.push(rgba.X, rgba.Y, rgba.Z, rgba.Z);
              }
              if (isUV) {
                verts.push(subdiv / subDivisions, layer / subDivisions);
              }
              if (isNormal) {
                const normal = Vec3_default.create(x, y, z).normalized();
                verts.push(normal.X, normal.Y, normal.Z);
              }
              if (layer < layers) {
                indis.push(subdiv + layer * subDivisions, subdiv + 1 + (layer + 1) * subDivisions);
              }
            }
            if (layer < layers - 1) {
              indis.push(65535);
            }
          }
          const windingOrder = WebGL2RenderingContext.CCW;
          const drawingMode = WebGL2RenderingContext.TRIANGLE_STRIP;
          const mesh = new _Mesh({ shaderProgram, verts, indis, drawingMode, windingOrder });
          return mesh;
        }
        /**
         * Parse the given text as the body of an obj file. (Expecting counter-clockwise winding)
         */
        static from_obj_text(shaderProgram, text) {
          const lines = text.split(/\r?\n/);
          const verts = [];
          const indis = [];
          for (let line of lines) {
            let elements = line.trim().split(" ");
            switch (elements[0]) {
              case "v":
                for (let i = 1; i < elements.length; i++) {
                  const parsedFloat = parseFloat(elements[i]);
                  if (isNaN(parsedFloat)) {
                    throw new Error(`${elements[i]} .obj 'f' vertex values must be a valid floating point number`);
                  } else {
                    verts.push(parsedFloat);
                  }
                }
                break;
              case "f":
                for (let i = 1; i < elements.length; i++) {
                  const parsedInt = parseInt(elements[i]);
                  if (isNaN(parsedInt) || parsedInt < 0) {
                    throw new Error(`${elements[i]} .obj 'f' elements must be a unsigned integer`);
                  } else {
                    indis.push(parsedInt - 1);
                  }
                }
                break;
              case "#":
              default:
                break;
            }
          }
          return new _Mesh({ shaderProgram, verts, indis });
        }
        /**
         * Asynchronously load the obj file as a mesh.
         *  @deprecated Use `get_obj_from_file()` instead.
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
        // @ts-ignore
        static async get_obj_from_file(file_name, shaderProgram) {
          const resp = await fetch(`objs/${file_name}`, {
            method: "GET",
            headers: {
              "Content-Type": "text/plain"
            }
          });
          if (!resp.ok) {
            throw new Error("HTTP error when opening .obj file: ");
          }
          const objFileAsString = await resp.text();
          return _Mesh.from_obj_text(shaderProgram, objFileAsString);
        }
        /*
        *  renders the mesh every frame.
        */
        render(transform, texture) {
          this.shaderProgram.Load();
          const prevVertBuffer = Buffer_default.bindArrayBuffer(this.verts);
          const prevElemBuffer = Buffer_default.bindElementArrayBuffer(this.indis);
          texture.bindTexture();
          this.shaderProgram.setVertexAttributesToBuffer();
          if (this.isFaceCulling) {
            Engine3D_default.inst.GL.frontFace(this.windingOrder);
            Engine3D_default.inst.GL.cullFace(this.cullingFace);
            Engine3D_default.inst.GL.enable(WebGL2RenderingContext.CULL_FACE);
          } else {
            Engine3D_default.inst.GL.disable(WebGL2RenderingContext.CULL_FACE);
          }
          this.shaderProgram.setProjectionUniform_Mat4x4(Camera_default.perspectiveUsingFrustum(0.225, Engine3D_default.inst.VIEWPORT.aspectRatio, 0.025, 10));
          if (Editor_default.Camera !== void 0) {
            this.shaderProgram.setViewUniform_Mat4x4(Editor_default.Camera.getViewInverseOfModelMatrix());
          } else {
            this.shaderProgram.setViewUniform_Mat4x4(Mat4_default.identity());
          }
          this.shaderProgram.setModelUniform_Mat4x4(transform.modelMatrix());
          Engine3D_default.inst.GL.drawElements(this.drawingMode, this.n_indis, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
          Buffer_default.bindArrayBuffer(prevVertBuffer);
          Buffer_default.bindElementArrayBuffer(prevElemBuffer);
          Texture_default.unBindTexture();
          ShaderProgram_default.UnloadAny();
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
        // @ts-ignore
        static async LoadMeshes() {
          this.AddToMeshes("loaded", await _Mesh.get_obj_from_file("teapot.obj", ShaderProgram_default.ShaderPrograms["coordinates"]));
          this.meshes["cubeC"] = _Mesh.box(ShaderProgram_default.ShaderPrograms["coordinates"], 1, 1, 1);
          this.meshes["cubeD"] = _Mesh.box(ShaderProgram_default.ShaderPrograms["default"], 1, 1, 1);
          this.meshes["sphere"] = _Mesh.sphereUV(ShaderProgram_default.ShaderPrograms["default"], 100, 1);
        }
        static AddToMeshes(name, mesh) {
          this.meshes[name] = mesh;
        }
        static get Meshes() {
          return this.meshes;
        }
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
      init_Mesh();
      init_Editor();
      init_Texture();
      Renderer = class _Renderer {
        static instance;
        static updateTimeEvent = new Event("updateTimeEvent");
        // @ts-ignore
        static async Instantiate() {
          if (_Renderer.instance != null) {
            throw new Error("Can Only Create One Renderer");
          }
          _Renderer.instance = new _Renderer();
          _Renderer.instance.initializeClearPresets();
          _Renderer.instance.initializePresets();
          _Renderer.instance.clear();
          await ShaderProgram_default.LoadShaderPrograms();
          await Mesh_default.LoadMeshes();
          await Texture_default.LoadTextures();
          return _Renderer.instance;
        }
        /*
         * initializes clearing state
        */
        initializeClearPresets() {
          Engine3D_default.inst.GL.clearColor(0, 0.85, 1, 1);
          Engine3D_default.inst.GL.clearDepth(1);
        }
        /*
         * clears the screen
        */
        clear() {
          Engine3D_default.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        }
        //
        // Initializes clearing values for gl renderer
        initializePresets() {
          Engine3D_default.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST);
        }
        /*
        *  renders all the vertices in the scene
        */
        render() {
          document.dispatchEvent(_Renderer.updateTimeEvent);
          const aniFrameID = window.requestAnimationFrame(this.render.bind(this));
          this.clear();
          try {
            for (const sceneObject of Editor_default.Scene.objects) {
              sceneObject.render();
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
        _width = 0;
        _prevWidth = 0;
        _height = 0;
        _prevHeight = 0;
        isFullScreen = false;
        constructor(canvas, width = 640, height = 360) {
          canvas.addEventListener("click", () => {
            canvas.requestPointerLock();
            canvas.requestFullscreen();
          });
          document.addEventListener("fullscreenchange", (e) => {
            if (!this.isFullScreen) {
              this.isFullScreen = true;
              this.SetResolution(window.screen.availWidth, window.screen.availHeight);
            } else {
              this.isFullScreen = false;
              this.SetResolution(this._prevWidth, this._prevHeight);
            }
          });
          window.addEventListener("beforeunload", (e) => {
            e.preventDefault();
          });
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
          this._prevWidth = this._width;
          this._prevHeight = this._height;
          this.canvas.width = width;
          this.canvas.height = height;
          this._width = width;
          this._height = height;
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
      init_Keyboard();
      init_Time();
      init_Editor();
      Engine3D = class _Engine3D {
        static instance;
        gl;
        renderer;
        viewport;
        editor;
        constructor(canvas) {
          if (_Engine3D.instance !== null && _Engine3D.instance !== void 0) {
            throw new Error("Cannot Have Two instances of Engine3D");
          } else {
            _Engine3D.instance = this;
          }
          new Time_default();
          new Keyboard_default();
          this.gl = canvas.getContext("webgl2");
          this.viewport = new Viewport_default(canvas, 800, 450);
          Renderer_default.Instantiate().then((renderer) => {
            this.renderer = renderer;
            this.editor = new Editor_default();
            setInterval(this.fixedUpdate.bind(this), Time_default.MILI_SEC_PER_TICK);
            this.renderer.render();
          });
        }
        fixedUpdate() {
          Editor_default.fixedUpdate();
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
        get RENDERER() {
          return this.renderer;
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
