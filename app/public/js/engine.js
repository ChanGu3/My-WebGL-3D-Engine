(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/engine/Debug.ts
  var Debug, Debug_default;
  var init_Debug = __esm({
    "src/engine/Debug.ts"() {
      init_Engine3D();
      Debug = class {
        static LogWrapper(content, extra = null, subject = null, reasonMSG = null) {
          const line = "-".repeat(30);
          return `
        ${Engine3D_default.NAME}${!extra ? "" : `: [ ${extra} ]`}
        ${line}
        ${!subject ? "" : `    [${subject}]:`} ${content} 
        ${!reasonMSG ? "" : `    [Reason]: ${reasonMSG}`}
        ${line}
        `;
        }
        static Log(msg) {
          console.log(this.LogWrapper(msg));
        }
        static LogWarning(msg, subject = null, reasonMSG = null) {
          console.warn(this.LogWrapper(msg, "Warning", subject, reasonMSG));
        }
        static LogError(msg, subject = null, reasonMSG = null) {
          console.error(this.LogWrapper(msg, "Error", subject, reasonMSG));
        }
      };
      Debug_default = Debug;
    }
  });

  // src/engine/rendering/jobs/Lights/Light3D.ts
  var Light3D, Light3D_default;
  var init_Light3D = __esm({
    "src/engine/rendering/jobs/Lights/Light3D.ts"() {
      Light3D = class {
        color;
        constructor(color) {
          this.color = color;
        }
        get Color() {
          return this.color;
        }
      };
      Light3D_default = Light3D;
    }
  });

  // src/engine/rendering/jobs/Lights/DirectionalLight3D.ts
  var DirectionalLight3D, DirectionalLight3D_default;
  var init_DirectionalLight3D = __esm({
    "src/engine/rendering/jobs/Lights/DirectionalLight3D.ts"() {
      init_Light3D();
      DirectionalLight3D = class extends Light3D_default {
        direction;
        constructor(color, direction) {
          super(color);
          this.direction = direction;
        }
        get Direction() {
          return this.direction;
        }
      };
      DirectionalLight3D_default = DirectionalLight3D;
    }
  });

  // src/engine/rendering/jobs/Lights/PointLight3D.ts
  var PointLight3D, PointLight3D_default;
  var init_PointLight3D = __esm({
    "src/engine/rendering/jobs/Lights/PointLight3D.ts"() {
      init_Light3D();
      PointLight3D = class extends Light3D_default {
        lightCoefficient;
        position;
        constructor(color, position, lightCoefficient) {
          super(color);
          this.position = position;
          this.lightCoefficient = lightCoefficient;
        }
        get LightCoefficient() {
          return this.lightCoefficient;
        }
        get Position() {
          return this.position;
        }
      };
      PointLight3D_default = PointLight3D;
    }
  });

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
        /*
         *  fileName: file name of the vertex shader
        */
        constructor(fileName) {
          super(Engine3D_default.inst.GL.VERTEX_SHADER, fileName);
        }
        findThenAddExistingAttributes(shaderProgram) {
          let atrFieldNames = ["coordinates", "color", "uv", "normal"];
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
          let atrFieldNames = [];
          let atrUniNames = [
            "mat_ambient",
            "mat_shininess",
            "mat_diffuse",
            "mat_specular",
            "mat_alpha",
            "view_pos",
            "directional_light_dir",
            "directional_light_color",
            "directional_light_count",
            "point_light_pos",
            "point_light_color",
            "point_light_count",
            "point_light_coefficient"
          ];
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
      FragmentShader_default = FragmentShader;
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
            X: this.x === 0 ? 0 : this.x * scalar,
            Y: this.y === 0 ? 0 : this.y * scalar,
            Z: this.z === 0 ? 0 : this.z * scalar
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
         * Returns the vector sum between this and other.
         */
        mul(other) {
          const summedVec4 = {
            X: this.x * other.x,
            Y: this.y * other.y,
            Z: this.z * other.z
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

  // src/engine/linear-algebra/Vec4.ts
  var Vec4, Vec4_default;
  var init_Vec4 = __esm({
    "src/engine/linear-algebra/Vec4.ts"() {
      init_Vec3();
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
        Vec3() {
          return Vec3_default.create(this.x, this.y, this.z);
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
        static normal_count = 3;
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
            this._fragmentShader.findThenAddExistingAttributes(this._program);
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
        setViewPositionUniform_Mat4x4(vec3) {
          if (this.fragmentShader.source_attribs["view_pos"] !== void 0) {
            Engine3D_default.inst.GL.uniform3f(this.fragmentShader.source_attribs["view_pos"].location, vec3.X, vec3.Y, vec3.Z);
          }
        }
        setProjectionUniform_Mat4x4(mat4) {
          Engine3D_default.inst.GL.uniformMatrix4fv(this.vertexShader.source_attribs["projection"].location, true, mat4.getData());
        }
        setPhongLighting(mat_ambient, mat_diffuse, mat_specular, mat_shininess) {
          if (this.fragmentShader.source_attribs["mat_ambient"] != void 0) {
            Engine3D_default.inst.GL.uniform1f(this.fragmentShader.source_attribs["mat_ambient"].location, mat_ambient);
          }
          if (this.fragmentShader.source_attribs["mat_shininess"] != void 0) {
            Engine3D_default.inst.GL.uniform1f(this.fragmentShader.source_attribs["mat_shininess"].location, mat_shininess);
          }
          if (this.fragmentShader.source_attribs["mat_diffuse"] != void 0) {
            Engine3D_default.inst.GL.uniform1f(this.fragmentShader.source_attribs["mat_diffuse"].location, mat_diffuse);
          }
          if (this.fragmentShader.source_attribs["mat_specular"] != void 0) {
            Engine3D_default.inst.GL.uniform1f(this.fragmentShader.source_attribs["mat_specular"].location, mat_specular);
          }
        }
        setAlpha(mat_alpha) {
          mat_alpha = mat_alpha > 1 ? 1 : mat_alpha;
          if (this.fragmentShader.source_attribs["mat_alpha"] != void 0) {
            Engine3D_default.inst.GL.uniform1f(this.fragmentShader.source_attribs["mat_alpha"].location, mat_alpha);
          }
        }
        setDirectionalLights(directional_light_dir_list, directional_light_color_list, directionalLightsCount) {
          if (this.fragmentShader.source_attribs["directional_light_dir"] != void 0 && this.fragmentShader.source_attribs["directional_light_color"] != void 0 && this.fragmentShader.source_attribs["directional_light_count"] != void 0) {
            Engine3D_default.inst.GL.uniform3fv(this.fragmentShader.source_attribs["directional_light_dir"].location, new Float32Array(directional_light_dir_list));
            Engine3D_default.inst.GL.uniform3fv(this.fragmentShader.source_attribs["directional_light_color"].location, new Float32Array(directional_light_color_list));
            Engine3D_default.inst.GL.uniform1i(this.fragmentShader.source_attribs["directional_light_count"].location, directionalLightsCount);
          }
        }
        setPointLights(point_light_pos_list, point_light_color_list, point_light_coefficient, pointLightsCount) {
          if (this.fragmentShader.source_attribs["point_light_pos"] != void 0 && this.fragmentShader.source_attribs["point_light_color"] != void 0 && this.fragmentShader.source_attribs["point_light_count"] != void 0 && this.fragmentShader.source_attribs["point_light_coefficient"] != void 0) {
            Engine3D_default.inst.GL.uniform3fv(this.fragmentShader.source_attribs["point_light_pos"].location, new Float32Array(point_light_pos_list));
            Engine3D_default.inst.GL.uniform3fv(this.fragmentShader.source_attribs["point_light_color"].location, new Float32Array(point_light_color_list));
            Engine3D_default.inst.GL.uniform1fv(this.fragmentShader.source_attribs["point_light_coefficient"].location, new Float32Array(point_light_coefficient));
            Engine3D_default.inst.GL.uniform1i(this.fragmentShader.source_attribs["point_light_count"].location, pointLightsCount);
          }
        }
        setVertexAttributesToBuffer() {
          let interleavedLength = 0;
          interleavedLength = this._vertexShader.source_attribs["coordinates"] !== void 0 ? interleavedLength + _ShaderProgram.coord_count : interleavedLength;
          interleavedLength = this._vertexShader.source_attribs["color"] !== void 0 ? interleavedLength + _ShaderProgram.color_count : interleavedLength;
          interleavedLength = this._vertexShader.source_attribs["uv"] !== void 0 ? interleavedLength + _ShaderProgram.uv_count : interleavedLength;
          interleavedLength = this._vertexShader.source_attribs["normal"] !== void 0 ? interleavedLength + _ShaderProgram.normal_count : interleavedLength;
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
          if (this._vertexShader.source_attribs["normal"] !== void 0) {
            const normalLoc = this.vertexShader.source_attribs["normal"].location;
            Engine3D_default.inst.GL.vertexAttribPointer(normalLoc, _ShaderProgram.normal_count, WebGL2RenderingContext.FLOAT, false, interleavedLength * Float32Array.BYTES_PER_ELEMENT, Float32Array.BYTES_PER_ELEMENT * currOffset);
            Engine3D_default.inst.GL.enableVertexAttribArray(normalLoc);
            currOffset += _ShaderProgram.normal_count;
          }
        }
      };
      ShaderProgram_default = ShaderProgram;
    }
  });

  // src/engine/Scene/Transform.ts
  var Transform, Transform_default;
  var init_Transform = __esm({
    "src/engine/Scene/Transform.ts"() {
      init_Vec3();
      init_Mat4();
      Transform = class {
        position = new Vec3_default({ X: 0, Y: 0, Z: 0 });
        scale = new Vec3_default({ X: 1, Y: 1, Z: 1 });
        rotation = new Vec3_default({ X: 0, Y: 0, Z: 0 });
        // tau
        constructor() {
        }
        modelMatrix() {
          return Mat4_default.translation(this.position.X, this.position.Y, this.position.Z).multiply(Mat4_default.rotation_xz(this.rotation.Y).multiply(Mat4_default.rotation_yz(this.rotation.X).multiply(Mat4_default.rotation_xy(this.rotation.Z).multiply(Mat4_default.scale(this.scale.X, this.scale.Y, this.scale.Z).multiply(Mat4_default.identity())))));
        }
        static GetRotationMatrix(rotation) {
          return Mat4_default.rotation_xz(rotation.Y).multiply(Mat4_default.rotation_yz(rotation.X).multiply(Mat4_default.rotation_xy(rotation.Z).multiply(Mat4_default.identity())));
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

  // src/engine/Scene/SceneObject.ts
  var SceneObject, SceneObject_default;
  var init_SceneObject = __esm({
    "src/engine/Scene/SceneObject.ts"() {
      init_Debug();
      init_Transform();
      SceneObject = class _SceneObject {
        static CURRENT_ROOT_SCENE_OBJECT = null;
        static set_ROOT_SCENE_OBJECT(root) {
          if (root.Parent != null) {
            throw new Error(`${root.name} must have no parent must set parent to null to become a ROOT_SCENE_OBJECT`);
          }
          this.CURRENT_ROOT_SCENE_OBJECT = root;
        }
        static Component = class Component {
          sceneObject;
          StartBind = this.Start.bind(this);
          UpdateBind = this.Update.bind(this);
          FixedUpdateBind = this.FixedUpdate.bind(this);
          constructor(sceneObject) {
            this.sceneObject = sceneObject;
            if (this.sceneObject.root === _SceneObject.CURRENT_ROOT_SCENE_OBJECT) {
              this.addExistingOverridesToEvents();
            }
          }
          addExistingOverridesToEvents() {
            if (this.constructor.prototype["Start"] !== Component.prototype["Start"]) {
              document.addEventListener("EditorStartEvent", this.StartBind);
            }
            if (this.constructor.prototype["Update"] !== Component.prototype["Update"]) {
              document.addEventListener("SceneGraphUpdate", this.UpdateBind);
            }
            if (this.constructor.prototype["FixedUpdate"] !== Component.prototype["FixedUpdate"]) {
              document.addEventListener("SceneGraphFixedUpdate", this.FixedUpdateBind);
            }
          }
          removeExistingOverridesFromEvents() {
            if (this.constructor.prototype["Start"] !== Component.prototype["Start"]) {
              document.removeEventListener("EditorStartEvent", this.StartBind);
            }
            if (this.constructor.prototype["Update"] !== Component.prototype["Update"]) {
              document.removeEventListener("SceneGraphUpdate", this.UpdateBind);
            }
            if (this.constructor.prototype["FixedUpdate"] !== Component.prototype["FixedUpdate"]) {
              document.removeEventListener("SceneGraphFixedUpdate", this.FixedUpdateBind);
            }
          }
          get SceneObject() {
            return this.sceneObject;
          }
          get Transform() {
            return this.SceneObject.Transform;
          }
          Start() {
          }
          // TODO
          Update() {
          }
          FixedUpdate() {
          }
          OnDestroy() {
          }
          // TODO
        };
        name;
        components = /* @__PURE__ */ new Map();
        transform = new Transform_default();
        root;
        parent = null;
        // should only be null if root of the scene
        children = [];
        get Transform() {
          return this.transform;
        }
        get Root() {
          return this.root;
        }
        get Parent() {
          return this.parent;
        }
        get Name() {
          return this.name;
        }
        /*
         * use "root" as the name for a root object otherwise just use the root object creator
        */
        constructor(name) {
          this.name = name;
          if (name == "root") {
            this.root = this;
            this.parent = null;
            return;
          } else {
            if (_SceneObject.CURRENT_ROOT_SCENE_OBJECT == null) {
              throw new Error(`Must assign the ROOT_SCENE_OBJECT before creating a new scene object`);
            }
            this.root = _SceneObject.CURRENT_ROOT_SCENE_OBJECT;
            _SceneObject.CURRENT_ROOT_SCENE_OBJECT.addChild(this);
          }
        }
        get Children() {
          return this.children;
        }
        get Components() {
          if (this.components.size === 0) {
            return [];
          }
          const list = [];
          const iterator = this.components.values();
          let isDone = false;
          while (!isDone) {
            const { value, done } = iterator.next();
            if (done) {
              isDone = done;
            } else {
              list.push(value);
            }
          }
          return list;
        }
        get WorldPosition() {
          return this.WorldModelMatrix.vectorBasisW().Vec3();
        }
        get WorldModelMatrix() {
          const mat4s = [];
          let mat4 = this.transform.modelMatrix();
          let currParent = this.parent;
          while (currParent != null) {
            mat4s.push(currParent.transform.modelMatrix());
            currParent = currParent.parent;
          }
          mat4s.forEach((mat) => {
            mat4 = mat.multiply(mat4);
          });
          return mat4;
        }
        /*
         * Gets the component if it exists in components otherwise null
        */
        getComponent(classType) {
          return this.components.has(classType.name) ? this.components.get(classType.name) : null;
        }
        /*
         * Adds the component and returns the component otherwise throws critical error
         * 
         * Error Causes: adding same component twice or adding component with the same class name
        */
        addComponent(classType) {
          if (this.components.has(classType.name)) {
            if (this.components.get(classType.name) instanceof classType) {
              throw Error("Cannot Add The Same Component Twice");
            } else {
              throw Error("cannot add component with the same class name as another component");
            }
          }
          const component = new classType(this);
          this.components.set(classType.name, component);
          return component;
        }
        setParent(parent) {
          if (_SceneObject.CURRENT_ROOT_SCENE_OBJECT == this) {
            throw new Error(`cannot assign a parent to the ROOT_SCENE_OBJECT`);
          }
          parent.addChild(this);
        }
        addChild(child) {
          if (child.Parent === this) {
            Debug_default.LogWarning("...", "Scene Objects", `${this.Name} is already a parent of ${child.Name}`);
            return;
          }
          if (this.parent === child) {
            Debug_default.LogError(`${this.Name} cannot be a parent of ${child.Name}`, "Scene Objects", `${child.Name} is a parent of ${this.Name}`);
            return;
          }
          if (_SceneObject.CURRENT_ROOT_SCENE_OBJECT == child) {
            throw new Error(`cannot assign a ROOT_SCENE_OBJECT as a child`);
          }
          if (child.parent) {
            child.parent.removeChild(child);
          }
          this.children.push(child);
          child.parent = this;
        }
        /*
         *  returns child at index otherwise null with error if child at index does not exist
        */
        getChild(index) {
          if (index < 0) {
            Debug_default.LogError(`Scene Object with Name ${this.Name} attempted a get on a negative index [value: ${index}]`);
            return null;
          }
          if (this.children.length === 0) {
            Debug_default.LogError(`Scene Object With Name '${this.name}' does not have any children`);
            return null;
          }
          if (this.children.length - 1 < index) {
            Debug_default.LogError(`Scene Object With Name '${this.name}' does not have a child at index [value: ${index}]`);
            return null;
          }
          return this.children[index];
        }
        /*
         * returns index when finding child in children otherwise it returns -1 
        */
        findChildIndex(sceneObject) {
          for (let i = 0; i < this.children.length; i++) {
            if (this.children[i] == sceneObject) {
              return i;
            }
          }
          return -1;
        }
        removeChild(child) {
          child.setIndexRelativeToParent(this.children.length - 1);
          this.children.pop();
          child.parent = _SceneObject.CURRENT_ROOT_SCENE_OBJECT;
        }
        setIndexRelativeToParent(index) {
          if (!this.parent || _SceneObject.CURRENT_ROOT_SCENE_OBJECT == this) {
            throw new Error(`ROOT_SCENE_OBJECT does not contain a parent to move relatively`);
          }
          if (index < 0) {
            Debug_default.LogError(`attempted to set index to a negative index [value: ${index}]`, "Scene Objects");
            return;
          }
          if (this.parent.children.length === 1) {
            Debug_default.LogWarning(`attempted to move ${this.Name} but it is an only child of ${this.parent.Name}`, "Scene Objects");
            return;
          }
          if (this.parent.children.length <= index) {
            Debug_default.LogError(`cannot move '${this.name}' to a index higher than what exist on the current parent ${this.parent.Name} [value: ${index}]`, "Scene Objects");
            return null;
          }
          const thisIndex = this.parent.findChildIndex(this);
          if (thisIndex === index) {
            return;
          }
          if (thisIndex === -1) {
            throw new Error(`[Scene Objects] ${this.Name} does not exist in child list of ${this.parent.Name}`);
          } else if (thisIndex < index) {
            for (let i = thisIndex; i < index; i++) {
              const tempObject = this.parent.children[i];
              this.parent.children[i] = this.parent.children[i + 1];
              this.parent.children[i + 1] = tempObject;
            }
          } else {
            for (let i = index; i > thisIndex; i--) {
              const tempObject = this.parent.children[i];
              this.parent.children[i] = this.parent.children[i - 1];
              this.parent.children[i - 1] = tempObject;
            }
          }
        }
      };
      SceneObject_default = SceneObject;
    }
  });

  // src/engine/Scene/Components/Lights/Light.ts
  var Light, Light_default;
  var init_Light = __esm({
    "src/engine/Scene/Components/Lights/Light.ts"() {
      init_Vec3();
      init_SceneObject();
      Light = class extends SceneObject_default.Component {
        color = Vec3_default.create(1, 1, 1);
        isLightDisabled = false;
        get Color() {
          return this.color;
        }
        set Color(color) {
          this.color = color;
        }
        get IsLightDisabled() {
          return this.isLightDisabled;
        }
        DisableLight() {
          this.isLightDisabled = true;
        }
        EnableLight() {
          this.isLightDisabled = false;
        }
      };
      Light_default = Light;
    }
  });

  // src/engine/Scene/Components/Lights/DirectionalLight.ts
  var DirectionalLight, DirectionalLight_default;
  var init_DirectionalLight = __esm({
    "src/engine/Scene/Components/Lights/DirectionalLight.ts"() {
      init_Light();
      DirectionalLight = class extends Light_default {
      };
      DirectionalLight_default = DirectionalLight;
    }
  });

  // src/engine/Scene/Components/Lights/PointLight.ts
  var PointLight, PointLight_default;
  var init_PointLight = __esm({
    "src/engine/Scene/Components/Lights/PointLight.ts"() {
      init_Light();
      PointLight = class extends Light_default {
        light_coefficient = 1.8;
        // the less this number the greater the intensity of the distance to an object
        get Light_Coefficient() {
          return this.light_coefficient;
        }
        set Light_Coefficient(new_coefficient) {
          this.light_coefficient = new_coefficient;
        }
      };
      PointLight_default = PointLight;
    }
  });

  // src/engine/rendering/jobs/Render3D.ts
  var Render3D, Render3D_default;
  var init_Render3D = __esm({
    "src/engine/rendering/jobs/Render3D.ts"() {
      init_Renderer();
      init_ShaderProgram();
      Render3D = class {
        matrix;
        mesh;
        shaderProgram;
        material;
        constructor(shaderProgram, matrix, mesh, material) {
          this.matrix = matrix;
          this.mesh = mesh;
          this.shaderProgram = shaderProgram;
          this.material = material;
        }
        get Matrix() {
          return this.matrix;
        }
        get Material() {
          return this.material;
        }
        /*
        *  renders the object every frame.
        */
        render() {
          if (this.mesh !== null) {
            this.shaderProgram.Load();
            this.material.bind();
            this.mesh.bind();
            this.shaderProgram.setVertexAttributesToBuffer();
            this.shaderProgram.setModelUniform_Mat4x4(this.matrix);
            this.shaderProgram.setProjectionUniform_Mat4x4(Renderer_default.Camera.getPerspectiveMatrix());
            this.shaderProgram.setViewUniform_Mat4x4(Renderer_default.Camera.getViewInverseOfWorldModelMatrix());
            this.shaderProgram.setViewPositionUniform_Mat4x4(Renderer_default.Camera.SceneObject.WorldPosition);
            this.shaderProgram.setPhongLighting(this.material.Ambient, this.material.Diffuse, this.material.Specular, this.material.Shininess);
            this.shaderProgram.setAlpha(this.material.Opaque);
            if (ShaderProgram_default.ShaderPrograms["default"] == this.shaderProgram) {
              Renderer_default.ApplyLightingToRender();
            }
            this.mesh.drawMesh();
            this.mesh.unbind();
            this.material.unbind();
            ShaderProgram_default.UnloadAny();
          }
        }
      };
      Render3D_default = Render3D;
    }
  });

  // src/engine/rendering/Material.ts
  var Material, Material_default;
  var init_Material = __esm({
    "src/engine/rendering/Material.ts"() {
      init_Engine3D();
      Material = class _Material {
        static GLOBAL_AMBIENT = 0.25;
        Texture = null;
        Ambient = _Material.GLOBAL_AMBIENT;
        Diffuse = 1;
        Specular = 2;
        Shininess = 4;
        Opaque = 1;
        // 0 - fully transparent | 1 - fully opaque
        get HasTransparency() {
          return this.Opaque < 1 || (this.Texture ? !this.Texture.IsFullyOpaque : false);
        }
        /*
         * binds the material data to buffer and uniforms
        */
        bind() {
          if (this.Texture) {
            this.Texture.bind();
          }
          this.HasTransparency ? Engine3D_default.inst.GL.depthMask(false) : null;
        }
        /*
         * unbinds the material data to buffer and uniforms
        */
        unbind() {
          if (this.Texture) {
            this.Texture.unbind();
          }
          this.HasTransparency ? Engine3D_default.inst.GL.depthMask(true) : null;
        }
      };
      Material_default = Material;
    }
  });

  // src/engine/Scene/Components/Renderer3D.ts
  var Renderer3D, Renderer3D_default;
  var init_Renderer3D = __esm({
    "src/engine/Scene/Components/Renderer3D.ts"() {
      init_Mat4();
      init_Render3D();
      init_Material();
      init_Renderer();
      init_ShaderProgram();
      init_SceneObject();
      Renderer3D = class extends SceneObject_default.Component {
        mesh = null;
        shaderProgram = ShaderProgram_default.ShaderPrograms["default"];
        material = new Material_default();
        set ShaderProgram(shaderProgram) {
          this.shaderProgram = shaderProgram;
        }
        get Material() {
          return this.material;
        }
        set Material(material) {
          this.material = material;
        }
        set Mesh(mesh) {
          this.mesh = mesh;
        }
        /*
        *  renders the object every frame.
        */
        add_render_job(relativeMat4 = Mat4_default.identity()) {
          if (this.mesh) {
            Renderer_default.AddRenderJob(new Render3D_default(this.shaderProgram, relativeMat4, this.mesh, this.material));
          }
        }
      };
      Renderer3D_default = Renderer3D;
    }
  });

  // src/engine/Scene/SceneGraph.ts
  var SceneGraph, SceneGraph_default;
  var init_SceneGraph = __esm({
    "src/engine/Scene/SceneGraph.ts"() {
      init_Mat4();
      init_DirectionalLight3D();
      init_PointLight3D();
      init_Renderer();
      init_DirectionalLight();
      init_PointLight();
      init_Renderer3D();
      init_SceneObject();
      SceneGraph = class _SceneGraph {
        static Current = null;
        camera = null;
        root = new SceneObject_default("root");
        UpdateEvent = new Event("SceneGraphUpdate");
        FixedUpdateEvent = new Event("SceneGraphFixedUpdate");
        constructor() {
          SceneObject_default.set_ROOT_SCENE_OBJECT(this.root);
          if (_SceneGraph.Current != null) {
            _SceneGraph.Current.RemoveAllEvents();
          }
          _SceneGraph.Current = this;
        }
        get Camera() {
          return this.camera;
        }
        set Camera(camera) {
          this.camera = camera;
        }
        // TODO I CAN MAKE THIS DIFFERENT LATER ON FOR NOW CREATING A NEW SCENE MAKES IT CURRENT
        SetAsCurrent() {
        }
        Update() {
          document.dispatchEvent(this.UpdateEvent);
        }
        FixedUpdate() {
          document.dispatchEvent(this.FixedUpdateEvent);
        }
        generateJobs(currentSceneObject = this.root, parentMat4 = Mat4_default.identity()) {
          const relativeMat4 = parentMat4.multiply(currentSceneObject.Transform.modelMatrix());
          const renderer3D = currentSceneObject.getComponent(Renderer3D_default);
          if (renderer3D) {
            renderer3D.add_render_job(relativeMat4);
          }
          const directionLight = currentSceneObject.getComponent(DirectionalLight_default);
          if (directionLight && !directionLight.IsLightDisabled) {
            Renderer_default.light3DJobs.push(new DirectionalLight3D_default(directionLight.Color, directionLight.Transform.rotation));
          }
          const pointLight = currentSceneObject.getComponent(PointLight_default);
          if (pointLight && !pointLight.IsLightDisabled) {
            Renderer_default.light3DJobs.push(new PointLight3D_default(pointLight.Color, pointLight.SceneObject.WorldPosition, pointLight.Light_Coefficient));
          }
          currentSceneObject.Children.forEach((child) => {
            this.generateJobs(child, relativeMat4);
          });
          return;
        }
        AddAllEvents(currentSceneObject = this.root) {
          currentSceneObject.Components.forEach((component) => {
            component.addExistingOverridesToEvents();
          });
          currentSceneObject.Children.forEach((child) => {
            this.AddAllEvents(child);
          });
        }
        RemoveAllEvents(currentSceneObject = this.root) {
          currentSceneObject.Components.forEach((component) => {
            component.removeExistingOverridesFromEvents();
          });
          currentSceneObject.Children.forEach((child) => {
            this.RemoveAllEvents(child);
          });
        }
      };
      SceneGraph_default = SceneGraph;
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
        static keys = {};
        static {
          document.addEventListener("keydown", _Keyboard.addKeyOnPress);
        }
        /*
         * when a key is pressed, and it does not exist, adds it to the available keys
        */
        static addKeyOnPress(event) {
          const code = event.code;
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
        static OnDeltaUpdate = new Event("Update");
        static OnFixedUpdate = new Event("FixedUpdate");
        static TICK_RATE = 60;
        static MILI_SEC_PER_TICK = 1e3 / this.TICK_RATE;
        static FIXED_TIME = _Time.MILI_SEC_PER_TICK / 1e3;
        static lastFrameUpTime = 0;
        static deltaTime = 0;
        static {
          document.addEventListener("StartNewFrameEvent", _Time.deltaUpdate);
          setInterval(_Time.fixedUpdate.bind(_Time), _Time.MILI_SEC_PER_TICK);
        }
        static deltaUpdate() {
          if (_Time.lastFrameUpTime !== 0) {
            _Time.deltaTime = _Time.MiliToSec(window.performance.now() - _Time.lastFrameUpTime);
          }
          _Time.lastFrameUpTime = window.performance.now();
          document.dispatchEvent(_Time.OnDeltaUpdate);
        }
        static fixedUpdate() {
          document.dispatchEvent(_Time.OnFixedUpdate);
        }
        // Convert Milliseconds into Seconds
        static MiliToSec(milliseconds) {
          return milliseconds / 1e3;
        }
        static get DeltaTime() {
          return _Time.deltaTime;
        }
        static get TimeElapsed() {
          return window.performance.now();
        }
        static get FixedTime() {
          return _Time.FIXED_TIME;
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

  // src/engine/Scene/Components/Cameras/Camera.ts
  var Camera, Camera_default;
  var init_Camera = __esm({
    "src/engine/Scene/Components/Cameras/Camera.ts"() {
      init_Engine3D();
      init_Mat4();
      init_Vec2();
      init_SceneObject();
      Camera = class _Camera extends SceneObject_default.Component {
        degrees = 60;
        near = 0.025;
        far = 80;
        /*
         * gets the perspective matrix of this current camera
        */
        getPerspectiveMatrix() {
          const tau = Math.abs(this.degrees % 360 / 360);
          return _Camera.perspectiveUsingFrustum(tau, Engine3D_default.inst.VIEWPORT.aspectRatio, this.near, this.far);
        }
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
          return _Camera.getInverseOfModelMatrix(this.SceneObject.Transform);
        }
        /*
        * returns the view using the camera model matrix data
        */
        static getInverseOfModelMatrix(transform, isScaleInclude = true) {
          const scale = {
            X: isScaleInclude ? transform.scale.X === 0 ? 0 : 1 / transform.scale.X : 1,
            Y: isScaleInclude ? transform.scale.Y === 0 ? 0 : 1 / transform.scale.Y : 1,
            Z: isScaleInclude ? transform.scale.Z === 0 ? 0 : 1 / transform.scale.Z : 1
          };
          const translationMat = Mat4_default.translation(-transform.position.X, -transform.position.Y, -transform.position.Z);
          const rotationMat = Mat4_default.rotation_xy(-transform.rotation.Z).multiply(Mat4_default.rotation_yz(-transform.rotation.X).multiply(Mat4_default.rotation_xz(-transform.rotation.Y)));
          const scaleMat = Mat4_default.scale(scale.X, scale.Y, scale.Z);
          const value = Mat4_default.identity().multiply(scaleMat.multiply(rotationMat.multiply(translationMat)));
          return value;
        }
        /*
        *  returns the view using the camera model matrix data
        */
        getViewInverseOfWorldModelMatrix() {
          let mat4 = _Camera.getInverseOfModelMatrix(this.Transform);
          let currObject = this.SceneObject.Parent;
          while (currObject != null) {
            mat4 = mat4.multiply(_Camera.getInverseOfModelMatrix(currObject.Transform, false));
            currObject = currObject.Parent;
          }
          return mat4;
        }
      };
      Camera_default = Camera;
    }
  });

  // src/engine/Scene/Components/Cameras/EditorCamera.ts
  var EditorCamera, EditorCamera_default;
  var init_EditorCamera = __esm({
    "src/engine/Scene/Components/Cameras/EditorCamera.ts"() {
      init_Keyboard();
      init_Vec3();
      init_Time();
      init_Camera();
      EditorCamera = class extends Camera_default {
        normalSpeed = 4;
        spd = 0;
        get spdRot() {
          return this.normalSpeed * 0.125;
        }
        /*
        *  for no clipping
        */
        noClipControls() {
          this.spd = this.normalSpeed;
          if (Keyboard_default.getKey("ShiftLeft").isPressing) {
            this.spd /= 3;
          }
          const camLocalDirectionZ = this.SceneObject.Transform.localDirectionZ();
          const camDirection = new Vec3_default({ X: camLocalDirectionZ.X, Y: camLocalDirectionZ.Y, Z: camLocalDirectionZ.Z });
          const camLocalDirectionX = this.SceneObject.Transform.localDirectionX();
          const camPerpDirection = new Vec3_default({ X: camLocalDirectionX.X, Y: camLocalDirectionX.Y, Z: camLocalDirectionX.Z });
          let positionChange = new Vec3_default({ X: 0, Y: 0, Z: 0 });
          if (Keyboard_default.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(this.spd * Time_default.FixedTime));
          }
          if (Keyboard_default.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(this.spd * Time_default.FixedTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(this.spd * Time_default.FixedTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(this.spd * Time_default.FixedTime));
          }
          if (Keyboard_default.getKey("KeyC").isPressing) {
            positionChange = positionChange.add(Vec3_default.create(0, this.spd * Time_default.FixedTime, 0)).scaled(-1);
          }
          if (Keyboard_default.getKey("Space").isPressing) {
            positionChange = positionChange.add(Vec3_default.create(0, this.spd * Time_default.FixedTime, 0));
          }
          this.SceneObject.Transform.position = this.SceneObject.Transform.position.add(positionChange);
          let rotationChange = new Vec3_default({ X: 0, Y: 0, Z: 0 });
          if (Keyboard_default.getKey("KeyQ").isPressing) {
            rotationChange = rotationChange.add(Vec3_default.create(0, 0, this.spd * Time_default.FixedTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyE").isPressing) {
            rotationChange = rotationChange.add(Vec3_default.create(0, 0, this.spd * Time_default.FixedTime));
          }
          if (Keyboard_default.getKey("ArrowUp").isPressing) {
            if (this.SceneObject.Transform.rotation.X < 0.24) {
              rotationChange = rotationChange.add(Vec3_default.create(this.spdRot * Time_default.FixedTime, 0, 0));
            } else {
              this.SceneObject.Transform.rotation = Vec3_default.create(0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
          }
          if (Keyboard_default.getKey("ArrowDown").isPressing) {
            if (this.SceneObject.Transform.rotation.X > -0.24) {
              rotationChange = rotationChange.add(Vec3_default.create(this.spdRot * Time_default.FixedTime, 0, 0).scaled(-1));
            } else {
              this.SceneObject.Transform.rotation = Vec3_default.create(-0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
          }
          if (Keyboard_default.getKey("ArrowLeft").isPressing) {
            rotationChange = rotationChange.add(Vec3_default.create(0, this.spdRot * Time_default.FixedTime, 0));
          }
          if (Keyboard_default.getKey("ArrowRight").isPressing) {
            rotationChange = rotationChange.add(Vec3_default.create(0, this.spdRot * Time_default.FixedTime, 0).scaled(-1));
          }
          this.SceneObject.Transform.rotation = this.SceneObject.Transform.rotation.add(rotationChange);
        }
      };
      EditorCamera_default = EditorCamera;
    }
  });

  // src/engine/Editor.ts
  var Editor, Editor_default;
  var init_Editor = __esm({
    "src/engine/Editor.ts"() {
      init_Debug();
      init_Keyboard();
      init_Vec3();
      init_EditorCamera();
      init_SceneGraph();
      init_SceneObject();
      Editor = class _Editor {
        static CameraObject = new SceneObject_default("root");
        static isInPlay = false;
        static isEditorCamera = true;
        static StartEvent = new Event("EditorStartEvent");
        static UpdateBind = null;
        static FixedUpdateBind = null;
        static EditorFixedUpdateBind = _Editor.EditorFixedUpdate.bind(_Editor);
        static {
          _Editor.CameraObject.addComponent(EditorCamera_default);
          _Editor.CameraObject.Transform.position = Vec3_default.create(0, 1, -1.5);
          _Editor.CameraObject.Transform.rotation = Vec3_default.create(-0.0625, 0, 0);
          document.addEventListener("FixedUpdate", _Editor.EditorFixedUpdateBind);
          Keyboard_default.getKey("KeyO").addKeyDownListener({ name: "PlaySceneInEditor", doAction: (key) => {
            _Editor.play();
          } });
          Keyboard_default.getKey("KeyP").addKeyDownListener({ name: "StopSceneInEditor", doAction: (key) => {
            _Editor.stop();
          } });
          Keyboard_default.getKey("KeyL").addKeyDownListener({ name: "SwitchToEditorCamera", doAction: (key) => {
            Debug_default.Log(`Current Camera Toggle: ${_Editor.isEditorCamera ? "Editor" : "SceneGraph"}`);
            this.isEditorCamera = !this.isEditorCamera;
          } });
        }
        static get IsEditorCamera() {
          return _Editor.isEditorCamera;
        }
        static get Camera() {
          return this.CameraObject.getComponent(EditorCamera_default);
        }
        static LoadSceneGraph(sceneGraphConstructor) {
          SceneGraph_default.Current = new sceneGraphConstructor();
          SceneGraph_default.Current.SetAsCurrent();
          this.UpdateBind = SceneGraph_default.Current.Update.bind(SceneGraph_default.Current);
          this.FixedUpdateBind = SceneGraph_default.Current.FixedUpdate.bind(SceneGraph_default.Current);
        }
        static play() {
          if (this.isInPlay) {
            return;
          }
          this.isInPlay = true;
          if (!SceneGraph_default.Current) {
            Debug_default.LogWarning("Cant Play Scene If No Scene Graph Exists");
            return;
          }
          document.addEventListener("Update", _Editor.UpdateBind);
          document.addEventListener("FixedUpdate", _Editor.FixedUpdateBind);
          document.dispatchEvent(_Editor.StartEvent);
          if (SceneGraph_default.Current.Camera) {
            this.isEditorCamera = false;
          }
          Debug_default.Log(`Current Camera Toggle: ${_Editor.isEditorCamera ? "Editor" : "SceneGraph"}`);
        }
        static stop() {
          if (!this.isInPlay) {
            return;
          }
          this.isInPlay = false;
          if (!SceneGraph_default.Current) {
            Debug_default.LogWarning("Cant Stop Scene If No Scene Graph Exists");
            return;
          }
          document.removeEventListener("Update", _Editor.UpdateBind);
          document.removeEventListener("FixedUpdate", _Editor.FixedUpdateBind);
          this.LoadSceneGraph(SceneGraph_default.Current.constructor);
          this.isEditorCamera = true;
          Debug_default.Log(`Current Camera Toggle: ${_Editor.isEditorCamera ? "Editor" : "SceneGraph"}`);
        }
        static EditorFixedUpdate() {
          if (_Editor.isEditorCamera) {
            _Editor.Camera.noClipControls();
          }
        }
      };
      Editor_default = Editor;
    }
  });

  // src/engine/rendering/Renderer.ts
  var Renderer, Renderer_default;
  var init_Renderer = __esm({
    "src/engine/rendering/Renderer.ts"() {
      init_Engine3D();
      init_Debug();
      init_DirectionalLight3D();
      init_PointLight3D();
      init_ShaderProgram();
      init_SceneGraph();
      init_Editor();
      Renderer = class _Renderer {
        static inst;
        static StartNewFrameEvent = new Event("StartNewFrameEvent");
        static Camera = Editor_default.Camera;
        static renderTransparent3DJobs = [];
        static render3DJobs = [];
        static light3DJobs = [];
        constructor() {
          if (_Renderer.inst != null) {
            throw new Error(`cannot create more than one renderer per Engine3D ${Engine3D_default.NAME}`);
            return;
          }
          _Renderer.inst = this;
          _Renderer.initializeClearPresets();
          _Renderer.initializePresets();
          _Renderer.clear();
        }
        /*
         * initializes clearing state
        */
        static initializeClearPresets() {
          Engine3D_default.inst.GL.clearColor(0.05, 0.08, 0.15, 1);
          Engine3D_default.inst.GL.clearDepth(1);
        }
        /*
         * clears the screen
        */
        static clear() {
          Engine3D_default.inst.GL.clear(WebGL2RenderingContext.COLOR_BUFFER_BIT | WebGL2RenderingContext.DEPTH_BUFFER_BIT);
        }
        //
        // Initializes clearing values for gl renderer
        static initializePresets() {
          Engine3D_default.inst.GL.enable(WebGL2RenderingContext.DEPTH_TEST);
          Engine3D_default.inst.GL.enable(WebGL2RenderingContext.BLEND);
          Engine3D_default.inst.GL.blendFunc(WebGL2RenderingContext.SRC_ALPHA, WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA);
        }
        /*
        *  renders everything for the scene
        */
        static render() {
          document.dispatchEvent(_Renderer.StartNewFrameEvent);
          const aniFrameID = window.requestAnimationFrame(this.render.bind(this));
          _Renderer.clear();
          try {
            _Renderer.SetCamera();
            if (SceneGraph_default.Current) {
              SceneGraph_default.Current.generateJobs();
            }
            _Renderer.SetLighting();
            _Renderer.Render3DSceneGraph();
          } catch (error) {
            Debug_default.LogError("Something went wrong while rendering", _Renderer.name, error.message);
            window.cancelAnimationFrame(aniFrameID);
          } finally {
            _Renderer.ClearJobs();
          }
        }
        static GetDistanceToCamera(matrix) {
          return _Renderer.Camera.SceneObject.WorldPosition.sub(matrix.vectorBasisW().Vec3()).magnitude;
        }
        static AddRenderJob(render3D) {
          if (render3D.Material.HasTransparency) {
            _Renderer.AddTransparentRenderJob(render3D);
          } else {
            _Renderer.render3DJobs.push(render3D);
          }
        }
        static AddTransparentRenderJob(render3D) {
          const renderMag = _Renderer.GetDistanceToCamera(render3D.Matrix);
          let startIndex = 0;
          let endIndex = _Renderer.renderTransparent3DJobs.length;
          ;
          while (startIndex < endIndex) {
            const mid = startIndex + endIndex >>> 1;
            const listMag = _Renderer.GetDistanceToCamera(_Renderer.renderTransparent3DJobs[mid].Matrix);
            if (renderMag === listMag) {
              _Renderer.renderTransparent3DJobs.splice(mid + 1, 0, render3D);
              return;
            }
            if (renderMag < listMag) {
              startIndex = mid + 1;
            } else {
              endIndex = mid;
            }
          }
          _Renderer.renderTransparent3DJobs.splice(startIndex, 0, render3D);
          return;
        }
        static ClearJobs() {
          this.light3DJobs = [];
          this.render3DJobs = [];
          this.renderTransparent3DJobs = [];
        }
        static Render3DSceneGraph() {
          for (const render3D of _Renderer.render3DJobs) {
            render3D.render();
          }
          for (const render3D of _Renderer.renderTransparent3DJobs) {
            render3D.render();
          }
        }
        static directionalLightsCount = 0;
        static directional_light_dir_list = [];
        static directional_light_color_list = [];
        static pointLightsCount = 0;
        static point_light_pos_list = [];
        static point_light_color_list = [];
        static point_light_coefficient_list = [];
        static loggedCamera = false;
        static SetCamera() {
          if (!Editor_default.IsEditorCamera) {
            if (SceneGraph_default.Current && SceneGraph_default.Current.Camera) {
              _Renderer.loggedCamera = false;
              _Renderer.Camera = SceneGraph_default.Current.Camera;
            } else if (!_Renderer.loggedCamera) {
              _Renderer.loggedCamera = true;
              Debug_default.LogWarning("Attempted switching to scene graph camera but it does not exist", "Renderer", "possibly the camera in the scene graph is null");
            }
            return;
          }
          _Renderer.Camera = Editor_default.Camera;
        }
        // Lights are hardcoded to use the default program.
        static SetLighting() {
          _Renderer.directionalLightsCount = 0;
          _Renderer.directional_light_dir_list = [];
          _Renderer.directional_light_color_list = [];
          _Renderer.pointLightsCount = 0;
          _Renderer.point_light_pos_list = [];
          _Renderer.point_light_color_list = [];
          _Renderer.point_light_coefficient_list = [];
          this.light3DJobs.forEach((light) => {
            if (light instanceof DirectionalLight3D_default) {
              _Renderer.directional_light_dir_list.push(light.Direction.X, light.Direction.Y, light.Direction.Z);
              _Renderer.directional_light_color_list.push(light.Color.X, light.Color.Y, light.Color.Z);
              _Renderer.directionalLightsCount++;
            } else if (light instanceof PointLight3D_default) {
              _Renderer.point_light_pos_list.push(light.Position.X, light.Position.Y, light.Position.Z);
              _Renderer.point_light_color_list.push(light.Color.X, light.Color.Y, light.Color.Z);
              _Renderer.point_light_coefficient_list.push(light.LightCoefficient);
              _Renderer.pointLightsCount++;
            }
          });
          if (16 < _Renderer.directionalLightsCount) {
            throw new Error("can only have 16 directional lights in one scene");
          }
          if (16 < _Renderer.pointLightsCount) {
            throw new Error("can only have 16 point lights in one scene");
          }
          if (_Renderer.pointLightsCount + _Renderer.directionalLightsCount > 16) {
            Debug_default.LogWarning("Having too many lights can slow performance", "Renderer", "More than 16 lights in scene");
          }
        }
        static ApplyLightingToRender() {
          if (0 < _Renderer.directionalLightsCount) {
            ShaderProgram_default.ShaderPrograms["default"].setDirectionalLights(_Renderer.directional_light_dir_list, _Renderer.directional_light_color_list, _Renderer.directionalLightsCount);
          }
          if (0 < _Renderer.pointLightsCount) {
            ShaderProgram_default.ShaderPrograms["default"].setPointLights(_Renderer.point_light_pos_list, _Renderer.point_light_color_list, _Renderer.point_light_coefficient_list, _Renderer.pointLightsCount);
          }
        }
      };
      Renderer_default = Renderer;
    }
  });

  // src/engine/Viewport.ts
  var Viewport, Viewport_default;
  var init_Viewport = __esm({
    "src/engine/Viewport.ts"() {
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
      init_Mat4();
      init_Vec4();
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
          if (meshParams.drawingMode) {
            this.drawingMode = meshParams.drawingMode;
          }
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
            vertexPusher(br.pos, rgba, Vec2_default.create(1, 1), Vec3_default.normalVertex(br.pos, bl.pos, tr.pos).normalized().scaled(isNormalForward ? 1 : -1));
            vertexPusher(bl.pos, rgba, Vec2_default.create(0, 1), Vec3_default.normalVertex(bl.pos, tl.pos, br.pos).normalized().scaled(isNormalForward ? 1 : -1));
            vertexPusher(tl.pos, rgba, Vec2_default.create(0, 0), Vec3_default.normalVertex(tl.pos, tr.pos, bl.pos).normalized().scaled(isNormalForward ? 1 : -1));
            vertexPusher(tr.pos, rgba, Vec2_default.create(1, 0), Vec3_default.normalVertex(tr.pos, br.pos, tl.pos).normalized().scaled(isNormalForward ? 1 : -1));
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
            windingOrder === WebGL2RenderingContext.CW
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
            windingOrder === WebGL2RenderingContext.CCW
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
            windingOrder === WebGL2RenderingContext.CW
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
            windingOrder === WebGL2RenderingContext.CCW
          );
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
          const mesh = new _Mesh({ verts, indis, windingOrder });
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
          const vertCount = layers * (subDivisions + 1);
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
                const leftVert = subdiv + layer * subDivisions;
                const rightVert = subdiv + 1 + (layer + 1) * subDivisions;
                indis.push(leftVert);
                if (rightVert === vertCount) {
                  indis.push(0);
                } else {
                  indis.push(rightVert);
                }
              }
            }
            if (layer < layers - 1) {
              indis.push(65535);
            }
          }
          const windingOrder = WebGL2RenderingContext.CCW;
          const drawingMode = WebGL2RenderingContext.TRIANGLE_STRIP;
          const mesh = new _Mesh({ verts, indis, drawingMode, windingOrder });
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
          return new _Mesh({ verts, indis });
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
         * binds the mesh data to buffer
        */
        bind() {
          Buffer_default.bindArrayBuffer(this.verts);
          Buffer_default.bindElementArrayBuffer(this.indis);
        }
        /*
         * unbinds all bound mesh data
        */
        unbind() {
          Buffer_default.bindArrayBuffer(null);
          Buffer_default.bindElementArrayBuffer(null);
        }
        /*
         * Draws The Current Mesh
         * !!!MUST HAVE THE MESH DATA BOUND!!!
        */
        drawMesh() {
          if (this.isFaceCulling) {
            Engine3D_default.inst.GL.frontFace(this.windingOrder);
            Engine3D_default.inst.GL.cullFace(this.cullingFace);
            Engine3D_default.inst.GL.enable(WebGL2RenderingContext.CULL_FACE);
          } else {
            Engine3D_default.inst.GL.disable(WebGL2RenderingContext.CULL_FACE);
          }
          Engine3D_default.inst.GL.drawElements(this.drawingMode, this.n_indis, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
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
          this.meshes["sphereC"] = _Mesh.sphereUV(ShaderProgram_default.ShaderPrograms["coordinates"], 10, 1);
          this.meshes["sphere"] = _Mesh.sphereUV(ShaderProgram_default.ShaderPrograms["default"], 24, 1);
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

  // src/engine/rendering/Texture.ts
  var Texture, Texture_default;
  var init_Texture = __esm({
    "src/engine/rendering/Texture.ts"() {
      init_Engine3D();
      init_Vec4();
      Texture = class _Texture {
        static bytes_per_pixel = 4;
        //RGBA
        static textures = {};
        texture = null;
        isFullyOpaque = true;
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
        static COLOR_TEXTURE_DATA(color, width = 4) {
          const data = new Uint8Array(width * width * _Texture.bytes_per_pixel);
          for (let row = 0; row < width; row++) {
            for (let col = 0; col < width; col++) {
              let pixLoc = (row * width + col) * 4;
              data[pixLoc] = color.X * 255;
              data[pixLoc + 1] = color.Y * 255;
              data[pixLoc + 2] = color.Z * 255;
              data[pixLoc + 3] = color.W * 255;
            }
          }
          return _Texture.CreateTexture(data, width, width);
        }
        static CreateTexture(data, width, height) {
          const textNew = new _Texture();
          textNew.texture = Engine3D_default.inst.GL.createTexture();
          textNew.isFullyOpaque = true;
          for (let i = 0; i < data.length && textNew.isFullyOpaque; i++) {
            if (i % 4 === 3) {
              textNew.isFullyOpaque = data[i] === 255;
            }
          }
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
          _Texture.textures["green"] = _Texture.COLOR_TEXTURE_DATA(Vec4_default.create(0, 1, 0, 1));
          _Texture.textures["texture_map"] = await _Texture.AddToTextures("texture_map.png");
          _Texture.textures["test"] = await _Texture.AddToTextures("test.gif");
          _Texture.textures["test2"] = await _Texture.AddToTextures("test2.jpg");
          _Texture.textures["metal_scale"] = await _Texture.AddToTextures("metal_scale.png");
          _Texture.textures["bell"] = await _Texture.AddToTextures("bell.png");
          _Texture.textures["rocky-forest-ground-4096x4096"] = await _Texture.AddToTextures("rocky-forest-ground-4096x4096.png");
          _Texture.textures["2k_moon"] = await _Texture.AddToTextures("2k_moon.jpg");
          _Texture.textures["sign"] = await _Texture.AddToTextures("sign.png");
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
        bind() {
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, this.texture);
        }
        unbind() {
          Engine3D_default.inst.GL.bindTexture(WebGL2RenderingContext.TEXTURE_2D, null);
        }
        get IsFullyOpaque() {
          return this.isFullyOpaque;
        }
      };
      Texture_default = Texture;
    }
  });

  // src/mydata/components/GenerateWorld.ts
  var GenerateWorld, GenerateWorld_default;
  var init_GenerateWorld = __esm({
    "src/mydata/components/GenerateWorld.ts"() {
      init_Debug();
      init_Vec2();
      init_Vec3();
      init_Vec4();
      init_Mesh();
      init_Texture();
      init_Renderer3D();
      init_SceneObject();
      GenerateWorld = class extends SceneObject_default.Component {
        offset = 2;
        currentLength = 0;
        get FULLLENGTH() {
          return this.currentLength * 2 * this.offset + this.offset;
        }
        IsOutOfBounds(pos) {
          const checker = this.SceneObject.Transform.position.add(Vec3_default.create(this.FULLLENGTH / 2 - this.offset * 2.75, this.FULLLENGTH / 2 - this.offset * 2.75, this.FULLLENGTH / 2 - this.offset * 2.75));
          return Math.abs(pos.X) > Math.abs(checker.X) || Math.abs(pos.Z) > Math.abs(checker.Z);
        }
        Start() {
          this.Generate(10);
        }
        Generate(length = 0, startPos = Vec3_default.create(0, 0, 0)) {
          if (length < 0) {
            Debug_default.LogWarning("Must Be A Length Greater than -1 To Generate Anything");
            return;
          }
          this.currentLength = length;
          this.GenerateGround(startPos, this.FULLLENGTH);
          const negativeLength = -length;
          let currentLength = length;
          while (negativeLength <= currentLength) {
            const currentPos = Vec3_default.create(startPos.X, startPos.Y, this.offset * currentLength);
            const borderOffset = -this.offset;
            if (length === currentLength) {
              this.GenerateBorder(currentPos.add(Vec3_default.create(0, 0, borderOffset)), 5);
            } else if (negativeLength === currentLength) {
              this.GenerateBorder(currentPos.sub(Vec3_default.create(0, 0, borderOffset)), 5, Vec3_default.create(0, 0.5, 0));
            }
            const treeRemovalOffset = 2;
            const treeCenterRemoval = 2;
            if (currentLength < length - treeRemovalOffset && currentLength > negativeLength + treeRemovalOffset) {
              if (currentLength <= -treeCenterRemoval || currentLength >= treeCenterRemoval) {
                this.GenerateChunk(currentPos);
              }
            }
            for (let i = 0; i < length; i++) {
              const vecOffset = Vec3_default.create(this.offset * (i + 1), 0, 0);
              const vecSubOffset = currentPos.sub(vecOffset);
              const vecAddOffset = currentPos.add(vecOffset);
              if (currentLength < length - treeRemovalOffset && currentLength > negativeLength + treeRemovalOffset && length - treeRemovalOffset > i + 1) {
                if (i >= treeCenterRemoval - 1 || (currentLength <= -treeCenterRemoval || currentLength >= treeCenterRemoval)) {
                  this.GenerateChunk(vecSubOffset);
                  this.GenerateChunk(vecAddOffset);
                }
              }
              if (length === currentLength) {
                this.GenerateBorder(vecSubOffset.add(Vec3_default.create(0, 0, borderOffset)), 5);
                this.GenerateBorder(vecAddOffset.add(Vec3_default.create(0, 0, borderOffset)), 5);
              } else if (negativeLength === currentLength) {
                this.GenerateBorder(vecSubOffset.sub(Vec3_default.create(0, 0, borderOffset)), 5, Vec3_default.create(0, 0.5, 0));
                this.GenerateBorder(vecAddOffset.sub(Vec3_default.create(0, 0, borderOffset)), 5, Vec3_default.create(0, 0.5, 0));
              } else if (length === i + 1) {
                this.GenerateBorder(vecSubOffset.sub(Vec3_default.create(borderOffset, 0, 0)), 5, Vec3_default.create(0, 0.25, 0));
                this.GenerateBorder(vecAddOffset.add(Vec3_default.create(borderOffset, 0, 0)), 5, Vec3_default.create(0, -0.25, 0));
              }
            }
            currentLength--;
          }
        }
        GenerateChunk(pos) {
          this.GenerateTree(pos);
        }
        GenerateGround(pos, scale) {
          const testGround = new SceneObject_default(`ground-${pos}`);
          testGround.Transform.position = pos;
          testGround.Transform.scale = Vec3_default.create(1 * scale, 0.25, 1 * scale);
          const render = testGround.addComponent(Renderer3D_default);
          render.Mesh = Mesh_default.Meshes["cubeD"];
          render.Material.Specular = 1;
          render.Material.Shininess = 1;
          render.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(0.294, 0.18, 0.082, 1));
        }
        GenerateBorder(pos, scale, rot = Vec3_default.create(0, 0, 0)) {
          const borderSphere = new SceneObject_default(`treeLeafs-${pos}`);
          borderSphere.Transform.position = pos;
          borderSphere.Transform.rotation = rot;
          borderSphere.Transform.scale = Vec3_default.create(scale, scale, scale);
          const borderSphereRender = borderSphere.addComponent(Renderer3D_default);
          borderSphereRender.Mesh = Mesh_default.Meshes["sphere"];
          borderSphereRender.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(0.133, 0.545, 0.133, 1));
          const borderSphere2 = new SceneObject_default(`treeLeafs-${pos}`);
          borderSphere2.Transform.position = Vec3_default.create(0, 0.5, 1);
          borderSphere2.Transform.scale = Vec3_default.create(1.25, 1.25, 1.25);
          const borderSphere2Render = borderSphere2.addComponent(Renderer3D_default);
          borderSphere2Render.Mesh = Mesh_default.Meshes["sphere"];
          borderSphere2Render.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(0.133, 0.545, 0.133, 1));
          borderSphere2.setParent(borderSphere);
        }
        TreeHolder = null;
        GenerateTree(pos, factor = Vec2_default.create(0, 0)) {
          if (this.TreeHolder === null) {
            this.TreeHolder = new SceneObject_default("TreeHolder");
          }
          const tree = new SceneObject_default(`treetrunck-${pos}`);
          tree.Transform.position = pos.add(Vec3_default.create(0, 0.75, 0));
          tree.Transform.scale = Vec3_default.create(0.25, 1.75, 0.25);
          const treeRender = tree.addComponent(Renderer3D_default);
          treeRender.Mesh = Mesh_default.Meshes["cubeD"];
          treeRender.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(0.361, 0.251, 0.2, 1));
          this.TreeHolder.addChild(tree);
          const treeLeafs = new SceneObject_default(`treeLeafs-${pos}`);
          treeLeafs.Transform.position = Vec3_default.create(0, 0.75, 0);
          treeLeafs.Transform.scale = Vec3_default.create(1.75 * 3.5, 0.25 * 3.5, 1.75 * 3.5);
          const treeLeafsRender = treeLeafs.addComponent(Renderer3D_default);
          treeLeafsRender.Mesh = Mesh_default.Meshes["sphere"];
          treeLeafsRender.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(0, 0.392, 0, 1));
          treeLeafs.setParent(tree);
        }
      };
      GenerateWorld_default = GenerateWorld;
    }
  });

  // src/mydata/components/PlayerController.ts
  var PlayerController, PlayerController_default;
  var init_PlayerController = __esm({
    "src/mydata/components/PlayerController.ts"() {
      init_Keyboard();
      init_Vec3();
      init_SceneObject();
      init_Time();
      PlayerController = class extends SceneObject_default.Component {
        WorldGenerator = null;
        Update() {
          this.Controls();
          if (this.WorldGenerator && this.WorldGenerator.IsOutOfBounds(this.SceneObject.WorldPosition)) {
            console.log("Out of Bounds - Resetting Position");
            this.SceneObject.Transform.position = Vec3_default.create(this.WorldGenerator.SceneObject.Transform.position.X, this.SceneObject.Transform.position.Y, this.WorldGenerator.SceneObject.Transform.position.Z - 2.5);
          }
        }
        normalSpeed = 2.5;
        sensitivity = 0.475;
        /*
        *  for no clipping
        */
        Controls() {
          let spd = this.normalSpeed;
          if (Keyboard_default.getKey("ShiftLeft").isPressing) {
            spd *= 2.75;
          }
          const camDirection = this.SceneObject.Transform.localDirectionZ().Vec3().mul(Vec3_default.create(1, 0, 1)).normalized();
          const camPerpDirection = this.SceneObject.Transform.localDirectionX().Vec3().mul(Vec3_default.create(1, 0, 1)).normalized();
          let positionChange = new Vec3_default({ X: 0, Y: 0, Z: 0 });
          if (Keyboard_default.getKey("KeyW").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(spd * Time_default.DeltaTime));
          }
          if (Keyboard_default.getKey("KeyS").isPressing) {
            positionChange = positionChange.add(camDirection.scaled(spd * Time_default.DeltaTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyA").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(spd * Time_default.DeltaTime).scaled(-1));
          }
          if (Keyboard_default.getKey("KeyD").isPressing) {
            positionChange = positionChange.add(camPerpDirection.scaled(spd * Time_default.DeltaTime));
          }
          this.SceneObject.Transform.position = this.SceneObject.Transform.position.add(positionChange);
          let rotationChange = new Vec3_default({ X: 0, Y: 0, Z: 0 });
          if (Keyboard_default.getKey("ArrowUp").isPressing) {
            if (this.SceneObject.Transform.rotation.X < 0.24) {
              rotationChange = rotationChange.add(Vec3_default.create(this.sensitivity * 0.65 * Time_default.DeltaTime, 0, 0));
            } else {
              this.SceneObject.Transform.rotation = Vec3_default.create(0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
          }
          if (Keyboard_default.getKey("ArrowDown").isPressing) {
            if (this.SceneObject.Transform.rotation.X > -0.24) {
              rotationChange = rotationChange.add(Vec3_default.create(this.sensitivity * 0.65 * Time_default.DeltaTime, 0, 0).scaled(-1));
            } else {
              this.SceneObject.Transform.rotation = Vec3_default.create(-0.24, this.SceneObject.Transform.rotation.Y, this.SceneObject.Transform.rotation.Z);
            }
          }
          if (Keyboard_default.getKey("ArrowLeft").isPressing) {
            rotationChange = rotationChange.add(Vec3_default.create(0, this.sensitivity * Time_default.DeltaTime, 0));
          }
          if (Keyboard_default.getKey("ArrowRight").isPressing) {
            rotationChange = rotationChange.add(Vec3_default.create(0, this.sensitivity * Time_default.DeltaTime, 0).scaled(-1));
          }
          this.SceneObject.Transform.rotation = this.SceneObject.Transform.rotation.add(rotationChange);
        }
      };
      PlayerController_default = PlayerController;
    }
  });

  // src/mydata/components/LightOrbPrefab.ts
  var LightOrbPrefab, LightOrbPrefab_default;
  var init_LightOrbPrefab = __esm({
    "src/mydata/components/LightOrbPrefab.ts"() {
      init_Vec3();
      init_Vec4();
      init_Mesh();
      init_Texture();
      init_PointLight();
      init_Renderer3D();
      init_SceneObject();
      init_Transform();
      init_Time();
      LightOrbPrefab = class _LightOrbPrefab extends SceneObject_default.Component {
        cubeLight = null;
        sphere = null;
        FixedUpdate() {
          if (this.cubeLight) {
            this.cubeLight.Transform.rotation = Vec3_default.create(
              -(Time_default.TimeElapsed / 1e4) % 1,
              Time_default.TimeElapsed / 1e4 % 1,
              Time_default.TimeElapsed / 9e3 % 1
            );
          }
          this.RotateAroundParent(this.MaxLengthFromCenter, this.Speed);
          this.checkForParentMoveThenRotate();
        }
        Start() {
          this.CreateObject();
        }
        CreateObject() {
          this.sphere = new SceneObject_default("sphere");
          const sphere1_3DRenderer = this.sphere.addComponent(Renderer3D_default);
          sphere1_3DRenderer.Mesh = Mesh_default.Meshes["sphere"];
          sphere1_3DRenderer.Material.Ambient = 1;
          sphere1_3DRenderer.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(1, 1, 1, 0.1));
          this.sphere.setParent(this.SceneObject);
          this.cubeLight = new SceneObject_default("PointLight");
          this.cubeLight.Transform.position = Vec3_default.create(0, 0, 0);
          this.cubeLight.Transform.scale = Vec3_default.create(0.25, 0.25, 0.25);
          const light2_3DRenderer = this.cubeLight.addComponent(Renderer3D_default);
          light2_3DRenderer.Mesh = Mesh_default.Meshes["cubeD"];
          light2_3DRenderer.Material.Ambient = 1;
          light2_3DRenderer.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(1, 1, 1, 1));
          const light2_POINTLIGHT = this.cubeLight.addComponent(PointLight_default);
          light2_POINTLIGHT.Light_Coefficient = 1.8;
          this.cubeLight.setParent(this.sphere);
        }
        IsRotatingParentX = false;
        // must use X and Some Z or Y since its direction is being used for rotation
        IsRotatingParentY = false;
        IsRotatingParentZ = false;
        MaxLengthFromCenter = 1;
        Speed = 1;
        set Color(vec3) {
          if (this.cubeLight) {
            const light = this.cubeLight.getComponent(PointLight_default);
            if (light) {
              light.Color = vec3;
            }
            const renderer = this.cubeLight.getComponent(Renderer3D_default);
            if (renderer) {
              renderer.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(vec3.X, vec3.Y, vec3.Z, 0.1));
            }
          }
          if (this.sphere && this.sphere.getComponent(Renderer3D_default)) {
            const renderer = this.sphere.getComponent(Renderer3D_default);
            if (renderer) {
              renderer.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(vec3.X, vec3.Y, vec3.Z, 0.1));
            }
          }
        }
        set LightIntensity(num) {
          if (this.cubeLight) {
            const light = this.cubeLight.getComponent(PointLight_default);
            if (light) {
              light.Light_Coefficient = num;
            }
          }
        }
        offsetrot = Math.random() * 1e9;
        RotateAroundParent(maxLengthFromCenter, speed) {
          if (this.SceneObject.Parent && (this.IsRotatingParentY || this.IsRotatingParentZ)) {
            this.SceneObject.Transform.position = Transform_default.GetRotationMatrix(Vec3_default.create(
              this.IsRotatingParentX ? Math.sin((Time_default.TimeElapsed + this.offsetrot) / (12e3 / speed)) * 0.15 : 0,
              // X tilt changes over time
              0,
              this.IsRotatingParentZ ? Math.cos((Time_default.TimeElapsed + this.offsetrot) / (14e3 / speed)) % 1 * 0.1 : 0
            )).transform_vec(
              Transform_default.GetRotationMatrix(Vec3_default.create(
                0,
                this.IsRotatingParentY ? (Time_default.TimeElapsed + this.offsetrot) / (1e4 / speed) % 1 : 0,
                0
              )).transform_vec(Vec4_default.create(maxLengthFromCenter, 0, 0, 0))
            ).Vec3();
          }
        }
        toBeParent = null;
        MoveToObjectThanMakeParentThenRotate(SceneObjectToMoveTo) {
          this.IsRotatingParentY = false;
          this.toBeParent = SceneObjectToMoveTo;
        }
        checkForParentMoveThenRotate() {
          if (this.toBeParent) {
            this.SceneObject.Transform.position = this.SceneObject.Transform.position.add(this.toBeParent.WorldPosition.sub(this.SceneObject.Transform.position).normalized().normalized().scaled(Time_default.DeltaTime * 4));
            if (_LightOrbPrefab.IsWithinDistanceBetweenTwoObjects(this.SceneObject, this.toBeParent, 0.8)) {
              this.SceneObject.Transform.position = Vec3_default.create(0, 0, 0);
              this.Transform.scale = Vec3_default.create(0.1, 0.1, 0.1);
              this.MaxLengthFromCenter = 0.075 + Math.random() * 0.35;
              this.Speed = 2.5;
              this.toBeParent.addChild(this.SceneObject);
              this.IsRotatingParentZ = this.IsRotatingParentY = this.IsRotatingParentX = true;
              this.toBeParent = null;
              if (this.cubeLight) {
                this.cubeLight.getComponent(PointLight_default)?.DisableLight();
              }
            }
          }
        }
        static IsWithinDistanceBetweenTwoObjects(obj1, obj2, distance = 5) {
          return obj1.WorldPosition.sub(obj2.WorldPosition).magnitude <= distance;
        }
      };
      LightOrbPrefab_default = LightOrbPrefab;
    }
  });

  // src/mydata/components/CenterArea.ts
  var CenterArea, CenterArea_default;
  var init_CenterArea = __esm({
    "src/mydata/components/CenterArea.ts"() {
      init_Vec3();
      init_Vec4();
      init_Mesh();
      init_Texture();
      init_Renderer3D();
      init_SceneObject();
      init_Time();
      init_LightOrbPrefab();
      CenterArea = class extends SceneObject_default.Component {
        centerSphere = null;
        sphereStart = Vec3_default.create(0, 0, 0);
        Update() {
          if (this.centerSphere) {
            this.centerSphere.Transform.position = Vec3_default.create(
              this.centerSphere.Transform.position.X,
              this.sphereStart.Y + Math.abs(Math.cos(Time_default.TimeElapsed / 900 % (Math.PI * 2))),
              this.centerSphere.Transform.position.Z
            );
          }
        }
        Start() {
          this.Setup();
        }
        get CenterSphere() {
          return this.centerSphere;
        }
        Setup() {
          const centerCube = new SceneObject_default("CenterCube");
          centerCube.Transform.scale = Vec3_default.create(1, 1, 1);
          const cubeRender = centerCube.addComponent(Renderer3D_default);
          cubeRender.Material.Texture = Texture_default.COLOR_TEXTURE_DATA(Vec4_default.create(0.502, 0.502, 0.502, 1));
          cubeRender.Mesh = Mesh_default.Meshes["cubeD"];
          centerCube.setParent(this.SceneObject);
          const sign = new SceneObject_default("sign");
          sign.Transform.position = Vec3_default.create(0, 0.1, -0.38);
          sign.Transform.scale = Vec3_default.create(0.75, 0.75, 0.25);
          const signRender = sign.addComponent(Renderer3D_default);
          signRender.Mesh = Mesh_default.Meshes["cubeD"];
          signRender.Material.Texture = Texture_default.Textures["sign"];
          sign.setParent(centerCube);
          this.centerSphere = new SceneObject_default("lightorb");
          const lightorbprefab = this.centerSphere.addComponent(LightOrbPrefab_default);
          lightorbprefab.Start();
          lightorbprefab.LightIntensity = 1.4;
          this.centerSphere.Transform.position = Vec3_default.create(0, 0, 0);
          this.centerSphere.setParent(centerCube);
          this.centerSphere.getChild(0).getChild(0).Transform.scale = Vec3_default.create(0.1, 0.1, 0.1);
          this.sphereStart = this.centerSphere.Transform.position = Vec3_default.create(0, 1, 0);
        }
      };
      CenterArea_default = CenterArea;
    }
  });

  // src/mydata/components/GameManager.ts
  var GameManager, GameManager_default;
  var init_GameManager = __esm({
    "src/mydata/components/GameManager.ts"() {
      init_Keyboard();
      init_Vec3();
      init_SceneObject();
      init_LightOrbPrefab();
      GameManager = class _GameManager extends SceneObject_default.Component {
        GenerateWorld = null;
        PlayerController = null;
        CenterArea = null;
        currentLightObject = null;
        Start() {
        }
        Update() {
          this.CheckForNearbyLightOrb();
          this.AddANewCurrentLightObjectIfGone();
        }
        AddANewCurrentLightObjectIfGone() {
          if (this.currentLightObject === null && this.GenerateWorld) {
            const lightSpawns = this.GenerateWorld.TreeHolder;
            if (lightSpawns) {
              const lightSpawn = lightSpawns.getChild(Math.floor(Math.random() * (lightSpawns.Children.length - 1)));
              this.currentLightObject = new SceneObject_default("LightOrbPickup");
              this.currentLightObject.Transform.scale = Vec3_default.create(1.75 * 0.5, 0.25 * 0.5, 1.75 * 0.5);
              const lightorbC = this.currentLightObject.addComponent(LightOrbPrefab_default);
              lightorbC.Start();
              lightorbC.LightIntensity = 3.9;
              lightorbC.MaxLengthFromCenter = 2;
              const randomVec3 = Vec3_default.create(Math.random(), Math.random(), Math.random());
              lightorbC.Color = randomVec3;
              lightorbC.IsRotatingParentY = true;
              lightSpawn?.addChild(this.currentLightObject);
            }
          }
        }
        CheckForNearbyLightOrb() {
          if (this.currentLightObject && this.PlayerController && this.CenterArea && this.CenterArea.CenterSphere) {
            if (Keyboard_default.getKey("KeyE").isPressing && _GameManager.IsWithinDistanceBetweenTwoObjects(this.currentLightObject, this.PlayerController.SceneObject, 0.8)) {
              this.currentLightObject.Transform.position = this.currentLightObject.WorldPosition;
              this.currentLightObject.Transform.scale = Vec3_default.create(0.1, 0.1, 0.1);
              this.currentLightObject.setParent(this.currentLightObject.Root);
              this.currentLightObject.getComponent(LightOrbPrefab_default)?.MoveToObjectThanMakeParentThenRotate(this.CenterArea.CenterSphere);
              this.currentLightObject = null;
            }
          }
        }
        static IsWithinDistanceBetweenTwoObjects(obj1, obj2, distance = 5) {
          return obj1.WorldPosition.sub(obj2.WorldPosition).magnitude <= distance;
        }
      };
      GameManager_default = GameManager;
    }
  });

  // src/mydata/LightGameScene.ts
  var LightGameScene, LightGameScene_default;
  var init_LightGameScene = __esm({
    "src/mydata/LightGameScene.ts"() {
      init_Vec3();
      init_Mesh();
      init_Texture();
      init_Renderer3D();
      init_SceneGraph();
      init_SceneObject();
      init_PointLight();
      init_Camera();
      init_GenerateWorld();
      init_PlayerController();
      init_CenterArea();
      init_GameManager();
      LightGameScene = class extends SceneGraph_default {
        constructor() {
          super();
          const theMoon = new SceneObject_default("moon");
          theMoon.Transform.scale = Vec3_default.create(3, 3, 3);
          theMoon.Transform.position = Vec3_default.create(20, 40, 20);
          const light = theMoon.addComponent(PointLight_default);
          light.Color = Vec3_default.create(0.784, 0.839, 1);
          light.Light_Coefficient = 0.025;
          const theMoonRenderer = theMoon.addComponent(Renderer3D_default);
          theMoonRenderer.Mesh = Mesh_default.Meshes["sphere"];
          theMoonRenderer.Material.Texture = Texture_default.Textures["2k_moon"];
          const worldGenerator = new SceneObject_default("WorldGenerator");
          const gW = worldGenerator.addComponent(GenerateWorld_default);
          const centerArea = new SceneObject_default("centerArea");
          centerArea.Transform.position = Vec3_default.create(0, 0.5, 0);
          const centerAreanC = centerArea.addComponent(CenterArea_default);
          centerArea.setParent(worldGenerator);
          const player = new SceneObject_default("Player");
          player.Transform.position = Vec3_default.create(0, 0.75, -2.5);
          this.Camera = player.addComponent(Camera_default);
          const playercomponent = player.addComponent(PlayerController_default);
          playercomponent.WorldGenerator = worldGenerator.getComponent(GenerateWorld_default);
          const gameManagerObject = new SceneObject_default("GameManager");
          const gameManager = gameManagerObject.addComponent(GameManager_default);
          gameManager.GenerateWorld = gW;
          gameManager.PlayerController = playercomponent;
          gameManager.CenterArea = centerAreanC;
        }
      };
      LightGameScene_default = LightGameScene;
    }
  });

  // src/engine/Engine3D.ts
  var Engine3D, Engine3D_default;
  var init_Engine3D = __esm({
    "src/engine/Engine3D.ts"() {
      init_Renderer();
      init_Viewport();
      init_ShaderProgram();
      init_Mesh();
      init_Texture();
      init_Editor();
      init_LightGameScene();
      Engine3D = class _Engine3D {
        static NAME = "CVE Engine";
        static instance;
        gl;
        viewport = void 0;
        renderer = void 0;
        static async run(canvasID = "canvas") {
          if (_Engine3D.instance != null && _Engine3D.instance !== void 0) {
            throw new Error(`Cannot run two instances of the 3DEngine ${_Engine3D.NAME}`);
          }
          const canvas = document.getElementById(canvasID);
          _Engine3D.instance = new _Engine3D(canvas);
          _Engine3D.instance.renderer = new Renderer_default();
          _Engine3D.instance.viewport = new Viewport_default(canvas, 500, 500);
          await ShaderProgram_default.LoadShaderPrograms();
          await Mesh_default.LoadMeshes();
          await Texture_default.LoadTextures();
          Editor_default.LoadSceneGraph(LightGameScene_default);
          Renderer_default.render();
        }
        constructor(canvas) {
          this.gl = canvas.getContext("webgl2");
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
      Engine3D_default.run().then();
    }
  });
  require_index();
})();
