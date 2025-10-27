import Buffer from "./shaders/Buffer";
import Engine3D from "../Engine3D";
import ShaderProgram from "./shaders/ShaderProgram";
import Mat4, { UniqueMatrix } from "../linear-algebra/Mat4";
import Transform from "../Transform";
import Editor from "../Editor";
import Camera from "../Camera";
import Vec4 from "../linear-algebra/Vec4";
import Texture from "../Texture";

type MESHES = {
    [name:string]: Mesh;
};

class Mesh {
    private static meshes: MESHES = {};

    private verts:WebGLBuffer;
    private indis:WebGLBuffer;
    private n_verts: number;
    private n_indis: number;
    private windingOrder:number;
    private cullingFace:number = WebGL2RenderingContext.BACK;
    private isFaceCulling:boolean = true;
    private shaderProgram: ShaderProgram;

    /**
     * Creates a new mesh and loads it into video memory.
     */
    constructor( shaderProgram: ShaderProgram, vertices:number[], indices:number[], windingOrder:number = WebGL2RenderingContext.CW) {
        this.verts = Buffer.createAndLoadVertexBuffer(vertices, Engine3D.inst.GL.STATIC_DRAW);
        this.n_verts = vertices.length;
        this.indis = Buffer.createAndLoadElementsBuffer(indices, Engine3D.inst.GL.STATIC_DRAW );
        this.n_indis = indices.length;

        this.windingOrder = windingOrder;
        this.shaderProgram = shaderProgram;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     */
    static box( shaderProgram: ShaderProgram, width:number, height:number, depth:number, isMultiFace:boolean=false, isFoldingTexture:boolean = false, windingOrder:number = WebGL2RenderingContext.CCW, rgba:Vec4 = new Vec4({X:1,Y:1,Z:1,W:1})) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts:number[] = [];
        if (isMultiFace) {
            const isColor:boolean = (shaderProgram.vertexShader.source_attribs['color'] !== undefined);
            const isUV:boolean = (shaderProgram.vertexShader.source_attribs['uv'] !== undefined);
            if(isColor && isUV) {
                verts = [
                    // FRONT VERTS
                     hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.5,  // Bottom-Right
                    -hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.5,   // Bottom-Left
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.25,  // Top-Left
                     hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.25, // Top-Right

                    // BACK VERTS
                     hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.25, 0.5,  // Bottom-Right
                    -hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0, 0.5,     // Bottom-Left
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0, 0.25,    // Top-Left
                     hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.25, 0.25, // Top-Right

                    // TOP VERTS
                     hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0,     // Bottom-Right
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0,    // Bottom-Left
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.25, // Top-Left
                     hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.25,  // Top-Right

                    // BOTTOM VERTS
                     hwidth,  -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.75, // Bottom-Right
                    -hwidth,  -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.75,  // Bottom-Left
                    -hwidth,  -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.5,   // Top-Left
                     hwidth,  -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.5,  // Top-Right

                    // LEFT VERTS
                    -hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.5,   // Bottom-Right
                    -hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.25, 0.5,  // Bottom-Left
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.25, 0.25, // Top-Left
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.5, 0.25,  // Top-Right

                    // RIGHT VERTS
                    hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 1, 0.5,     // Bottom-Right
                    hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.5,  // Bottom-Left
                    hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 0.75, 0.25, // Top-Left
                    hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, 1, 0.25,    // Top-Right
                ];
            }
            else if (isColor) {
                verts = [
                    // FRONT VERTS
                     hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Right
                    -hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Left
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Left
                     hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Right

                    // BACK VERTS
                     hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Right
                    -hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Left
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Left
                     hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Right

                    // TOP VERTS
                     hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Right
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Left
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Left
                     hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Right

                    // BOTTOM VERTS
                     hwidth,  -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Right
                    -hwidth,  -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Left
                    -hwidth,  -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Left
                     hwidth,  -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Right

                    // LEFT VERTS
                    -hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Right
                    -hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Left
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Left
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Right

                    // RIGHT VERTS
                    hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Right
                    hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Bottom-Left
                    hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Left
                    hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W, // Top-Right
                ];
            }
            else if (isUV) {
                if(isFoldingTexture) {

                    verts = [
                        // FRONT VERTS
                        hwidth, -hheight, -hdepth, 0.75, 0.5, // Bottom-Right
                        -hwidth, -hheight, -hdepth, 0.5, 0.5, // Bottom-Left
                        -hwidth,  hheight, -hdepth, 0.5, 0.25, // Top-Left
                        hwidth,  hheight, -hdepth, 0.75, 0.25, // Top-Right

                        // BACK VERTS
                        hwidth, -hheight,  hdepth, 0.25, 0.5, // Bottom-Right
                        -hwidth, -hheight,  hdepth, 0, 0.5, // Bottom-Left
                        -hwidth,  hheight,  hdepth, 0, 0.25, // Top-Left
                        hwidth,  hheight,  hdepth, 0.25, 0.25, // Top-Right

                        // TOP VERTS
                        hwidth,  hheight, -hdepth, 0.5, 0, // Bottom-Right
                        -hwidth,  hheight, -hdepth, 0.75, 0, // Bottom-Left
                        -hwidth,  hheight,  hdepth, 0.75, 0.25, // Top-Left
                        hwidth,  hheight,  hdepth, 0.5, 0.25, // Top-Right

                        // BOTTOM VERTS
                        hwidth,  -hheight, -hdepth, 0.75, 0.75, // Bottom-Right
                        -hwidth,  -hheight, -hdepth, 0.5, 0.75, // Bottom-Left
                        -hwidth,  -hheight,  hdepth, 0.5, 0.5, // Top-Left
                        hwidth,  -hheight,  hdepth, 0.75, 0.5, // Top-Right

                        // LEFT VERTS
                        -hwidth, -hheight, -hdepth, 0.5, 0.5, // Bottom-Right
                        -hwidth, -hheight,  hdepth, 0.25, 0.5, // Bottom-Left
                        -hwidth,  hheight,  hdepth, 0.25, 0.25, // Top-Left
                        -hwidth,  hheight, -hdepth, 0.5, 0.25, // Top-Right

                        // RIGHT VERTS
                        hwidth, -hheight, -hdepth, 1, 0.5, // Bottom-Right
                        hwidth, -hheight,  hdepth, 0.75, 0.5, // Bottom-Left
                        hwidth,  hheight,  hdepth, 0.75, 0.25, // Top-Left
                        hwidth,  hheight, -hdepth, 1, 0.25, // Top-Right
                    ];
                } else {
                    verts = [
                        // FRONT VERTS
                        hwidth, -hheight, -hdepth, 1, 1, // Bottom-Right
                        -hwidth, -hheight, -hdepth, 0, 1, // Bottom-Left
                        -hwidth,  hheight, -hdepth, 0, 0, // Top-Left
                        hwidth,  hheight, -hdepth, 1, 0, // Top-Right

                        // BACK VERTS
                        hwidth, -hheight,  hdepth, 1, 1, // Bottom-Right
                        -hwidth, -hheight,  hdepth, 0, 1, // Bottom-Left
                        -hwidth,  hheight,  hdepth, 0, 0, // Top-Left
                        hwidth,  hheight,  hdepth, 1, 0, // Top-Right

                        // TOP VERTS
                        hwidth,  hheight, -hdepth, 1, 1, // Bottom-Right
                        -hwidth,  hheight, -hdepth, 0, 1, // Bottom-Left
                        -hwidth,  hheight,  hdepth, 0, 0, // Top-Left
                        hwidth,  hheight,  hdepth, 1, 0, // Top-Right

                        // BOTTOM VERTS
                        hwidth,  -hheight, -hdepth, 1, 1, // Bottom-Right
                        -hwidth,  -hheight, -hdepth, 0, 1, // Bottom-Left
                        -hwidth,  -hheight,  hdepth, 0, 0, // Top-Left
                        hwidth,  -hheight,  hdepth, 1, 0, // Top-Right

                        // LEFT VERTS
                        -hwidth, -hheight, -hdepth, 1, 1, // Bottom-Right
                        -hwidth, -hheight,  hdepth, 0, 1, // Bottom-Left
                        -hwidth,  hheight,  hdepth, 0, 0, // Top-Left
                        -hwidth,  hheight, -hdepth, 1, 0, // Top-Right

                        // RIGHT VERTS
                        hwidth, -hheight, -hdepth, 1, 1, // Bottom-Right
                        hwidth, -hheight,  hdepth, 0, 1, // Bottom-Left
                        hwidth,  hheight,  hdepth, 0, 0, // Top-Left
                        hwidth,  hheight, -hdepth, 1, 0, // Top-Right
                    ];
                }
            }
            else {
                verts = [
                    // FRONT VERTS
                     hwidth, -hheight, -hdepth, // Bottom-Right (0)
                    -hwidth, -hheight, -hdepth, // Bottom-Left
                    -hwidth,  hheight, -hdepth, // Top-Left
                     hwidth,  hheight, -hdepth, // Top-Right

                    // BACK VERTS
                     hwidth, -hheight,  hdepth, // Bottom-Left (4) (ALL OF THESE ARE LOOKING AT THE FRONT NOT LOOKING AT THEM FROM THEIR VIEW MEANING THIS IS THE BOTTOM RIGHT LOOKING FORWARD)
                    -hwidth, -hheight,  hdepth, // Bottom-Right
                    -hwidth,  hheight,  hdepth, // Top-Right
                     hwidth,  hheight,  hdepth, // Top-Left

                    // TOP VERTS
                     hwidth,  hheight, -hdepth, // Bottom-Right (8)
                    -hwidth,  hheight, -hdepth, // Bottom-Left
                    -hwidth,  hheight,  hdepth, // Top-Left
                     hwidth,  hheight,  hdepth, // Top-Right

                    // BOTTOM VERTS
                     hwidth,  -hheight, -hdepth, // Bottom-Right (12)
                    -hwidth,  -hheight, -hdepth, // Bottom-Left
                    -hwidth,  -hheight,  hdepth, // Top-Left
                     hwidth,  -hheight,  hdepth, // Top-Right

                    // LEFT VERTS
                    -hwidth, -hheight, -hdepth, // Bottom-Right (16)
                    -hwidth, -hheight,  hdepth, // Bottom-Left
                    -hwidth,  hheight,  hdepth, // Top-Left
                    -hwidth,  hheight, -hdepth, // Top-Right

                    // RIGHT VERTS
                    hwidth, -hheight, -hdepth, // Bottom-Right (20)
                    hwidth, -hheight,  hdepth, // Bottom-Left
                    hwidth,  hheight,  hdepth, // Top-Left
                    hwidth,  hheight, -hdepth, // Top-Right
                ];
            }
        }
        else {
            const isColor:boolean = (shaderProgram.vertexShader.source_attribs['color'] !== undefined);
            if (isColor) {
                verts = [
                     hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                    -hwidth, -hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                    -hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                     hwidth,  hheight, -hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,

                     hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                    -hwidth, -hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                    -hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                     hwidth,  hheight,  hdepth, rgba.X, rgba.Y, rgba.Z, rgba.W,
                ];
            } else {
                verts = [
                    // BACK VERTS
                     hwidth, -hheight, -hdepth, // Bottom-Right
                    -hwidth, -hheight, -hdepth, // Bottom-Left
                    -hwidth,  hheight, -hdepth, // Top-Left
                     hwidth,  hheight, -hdepth, // Top-Right

                    // FRONT VERTS
                     hwidth, -hheight,  hdepth, // Bottom-Right
                    -hwidth, -hheight,  hdepth, // Bottom-Left
                    -hwidth,  hheight,  hdepth, // Top-Left
                     hwidth,  hheight,  hdepth, // Top-Right
                ];
            }
        }

        let indis:number[] = [];
        if (isMultiFace) {
            if(windingOrder === WebGL2RenderingContext.CW) {
                indis = [
                    // clockwise winding
                    0, 1, 2, 2, 3, 0,       // FRONT-FACE
                    20, 21, 23, 23, 21, 22, // RIGHT-FACE
                    5, 4, 7, 7, 6, 5,       // BACK-FACE
                    16, 17, 19, 19, 17, 18, // LEFT-FACE
                    8, 9, 11, 11, 9, 10,    // TOP-FACE
                    12, 13, 15, 15, 13, 14, // BOTTOM-FACE
                ];
            }
            else {
                indis = [
                    // counter-clockwise winding
                    0, 3, 2, 2, 1, 0,
                    20, 21, 22, 22, 23, 20,
                    5, 6, 7, 7, 4, 5,
                    16, 19, 18, 18, 17, 16,
                    8, 11, 10, 10, 9, 8,
                    12, 13, 14, 14, 15, 12,
                ];
            }
        }
        else {
            if(windingOrder === WebGL2RenderingContext.CW) {
                indis = [
                    // clockwise winding
                    0, 1, 2, 2, 3, 0,
                    4, 0, 3, 3, 7, 4,
                    5, 4, 7, 7, 6, 5,
                    1, 5, 6, 6, 2, 1,
                    3, 2, 6, 6, 7, 3,
                    4, 5, 1, 1, 0, 4,
                ];
            }
            else {
                indis = [
                    // counter-clockwise winding
                    0, 3, 2, 2, 1, 0,
                    4, 7, 3, 3, 0, 4,
                    5, 6, 7, 7, 4, 5,
                    1, 2, 6, 6, 5, 1,
                    3, 7, 6, 6, 2, 3,
                    4, 0, 1, 1, 5, 4,
                ];
            }
        }

        const mesh:Mesh = new Mesh( shaderProgram, verts, indis );
        mesh.windingOrder = WebGL2RenderingContext.CCW;
        return mesh;
    }

    /**
     * Parse the given text as the body of an obj file. (Expecting counter-clockwise winding)
     */
    static from_obj_text(shaderProgram: ShaderProgram, text:string ) {
        const lines:string[] = text.split(/\r?\n/);

        const vertices:number[] = [];
        const indices:number[] = [];

        for(let line of lines) {
            let elements: string[] = line.trim().split(' ');
            switch (elements[0]) {
                case "v": // vertex points
                    for(let i = 1; i < elements.length; i++) {
                        const parsedFloat:number = parseFloat(elements[i]);
                        if(isNaN(parsedFloat)) {
                            throw new Error(`${elements[i]} .obj 'f' vertex values must be a valid floating point number`);
                        }
                        else {
                            vertices.push(parsedFloat);
                        }
                    }
                    break;
                case "f": // element points
                    for(let i = 1; i < elements.length; i++) {
                        const parsedInt:number = parseInt(elements[i]);
                        if(isNaN(parsedInt) || parsedInt < 0) {
                            throw new Error(`${elements[i]} .obj 'f' elements must be a unsigned integer`);
                        }
                        else {
                            indices.push(parsedInt-1);
                        }
                    }
                    break;
                case "#":
                default:
                    break;
            }
        }

        return new Mesh(shaderProgram, vertices, indices);
    }

    /**
     * Asynchronously load the obj file as a mesh.
     *  @deprecated Use `get_obj_from_file()` instead.
     */
    static from_obj_file(file_name:string, shaderProgram: ShaderProgram, f ) {
        let request:XMLHttpRequest = new XMLHttpRequest();

        // the function that will be called when the file is being loaded
        request.onreadystatechange = function() {
            // console.log( request.readyState );

            if( request.readyState != 4 ) { return; }
            if( request.status != 200 ) {
                throw new Error( 'HTTP error when opening .obj file: ');
            }

            // now we know the file exists and is ready
            let loaded_mesh = Mesh.from_obj_text(shaderProgram, request.responseText);

            console.log( 'loaded ', `objs/${file_name}` );
            f( loaded_mesh );
        };

        request.open( 'GET', `objs/${file_name}` ); // initialize request.
        request.send();                   // execute request
    }

    // @ts-ignore
    public static async get_obj_from_file(file_name:string, shaderProgram: ShaderProgram ): Promise<Mesh> {
        const resp:Response = await fetch(`objs/${file_name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain',
            }
        });

        if(!resp.ok) {
            throw new Error( 'HTTP error when opening .obj file: ');
        }

        const objFileAsString:string  = await resp.text();

        return Mesh.from_obj_text(shaderProgram, objFileAsString);
    }

    /*
    *  renders the mesh every frame.
    */
    public render (transform: Transform, texture:Texture):void {
        this.shaderProgram.Load();
        const prevVertBuffer = Buffer.bindArrayBuffer(this.verts);
        const prevElemBuffer = Buffer.bindElementArrayBuffer(this.indis);
        texture.bindTexture();

        this.shaderProgram.setVertexAttributesToBuffer();

        if (this.isFaceCulling) {
            Engine3D.inst.GL.frontFace(this.windingOrder);
            Engine3D.inst.GL.cullFace(this.cullingFace);
            Engine3D.inst.GL.enable(WebGL2RenderingContext.CULL_FACE)
        }
        else {
            Engine3D.inst.GL.disable(WebGL2RenderingContext.CULL_FACE);
        }

        // TODO make perspective changeable in camera not here
        this.shaderProgram.setProjectionUniform_Mat4x4(Camera.perspectiveUsingFrustum(0.225, Engine3D.inst.VIEWPORT.aspectRatio, 0.025, 10));

        if(Editor.Camera !== undefined) {
            //console.log(Scene.editorCamera.transform.getInverseModelMatrix());
            this.shaderProgram.setViewUniform_Mat4x4(Editor.Camera.getViewInverseOfModelMatrix());
        } else {
            this.shaderProgram.setViewUniform_Mat4x4(Mat4.identity());
        }

        this.shaderProgram.setModelUniform_Mat4x4(transform.modelMatrix());

        Engine3D.inst.GL.drawElements(WebGL2RenderingContext.TRIANGLES, this.n_indis, WebGL2RenderingContext.UNSIGNED_SHORT, 0);

        Buffer.bindArrayBuffer(prevVertBuffer);
        Buffer.bindElementArrayBuffer(prevElemBuffer);
        Texture.unBindTexture();
        ShaderProgram.UnloadAny();
    }

    /*
    *  Enables Culling For Mesh
    */
    public EnableCulling():void {
        this.isFaceCulling = true;
    }

    /*
    *  Disables Culling For Mesh
    */
    public DisableCulling():void {
        this.isFaceCulling = false;
    }

    /*
    *  sets the face(s) that will be culled from render
    */
    public SetCullingFace(cullingFace:number) {
        if((cullingFace !== WebGL2RenderingContext.BACK) && (cullingFace !== WebGL2RenderingContext.FRONT) && (cullingFace !== WebGL2RenderingContext.FRONT_AND_BACK)) {
            throw new Error( 'The culling face that was set does not exist -> Culling face: ' + cullingFace );
        }
        else
        {
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
    public static async LoadMeshes(): Promise<void> {
        this.AddToMeshes('loaded', await Mesh.get_obj_from_file("teapot.obj", ShaderProgram.ShaderPrograms['coordinates']));
        this.meshes['cubeC'] = Mesh.box(ShaderProgram.ShaderPrograms['coordinates'], 1, 1, 1);
        this.meshes['cubeD'] = Mesh.box(ShaderProgram.ShaderPrograms['default'], 1, 1, 1, true, true);
    }

    public static AddToMeshes(name:string, mesh:Mesh) {
        this.meshes[name] = mesh;
    }

    public static get Meshes(): MESHES {
        return this.meshes;
    }

}

export default Mesh;
