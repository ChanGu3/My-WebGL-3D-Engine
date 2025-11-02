import Buffer from "./shaders/Buffer";
import Engine3D from "../Engine3D";
import ShaderProgram from "./shaders/ShaderProgram";
import Mat4, { UniqueMatrix } from "../linear-algebra/Mat4";
import Transform from "../Transform";
import Editor from "../Editor";
import Camera from "../Camera";
import Vec4 from "../linear-algebra/Vec4";
import Texture from "../Texture";
import Vec3 from "../linear-algebra/Vec3";
import Vec2 from "../linear-algebra/Vec2";
import vec3 from "../linear-algebra/Vec3";
import shaderProgram from "./shaders/ShaderProgram";

type MESHES = {
    [name:string]: Mesh;
};

type MeshParams = {
    shaderProgram: ShaderProgram;
    verts:number[];
    indis:number[];
    drawingMode?:number;
    windingOrder?:number;
}
class Mesh {
    private static meshes: MESHES = {};

    private verts:WebGLBuffer;
    private indis:WebGLBuffer;
    private n_verts: number;
    private n_indis: number;
    private windingOrder:number = WebGL2RenderingContext.CW;
    private cullingFace:number = WebGL2RenderingContext.BACK;
    private isFaceCulling:boolean = true;
    private drawingMode:number = WebGL2RenderingContext.TRIANGLES;
    private shaderProgram: ShaderProgram;

    /**
     * Creates a new mesh and loads it into video memory.
     */
    constructor( meshParams:MeshParams ) {
        this.verts = Buffer.createAndLoadVertexBuffer(meshParams.verts, Engine3D.inst.GL.STATIC_DRAW);
        this.n_verts = meshParams.verts.length;
        this.indis = Buffer.createAndLoadElementsBuffer(meshParams.indis, Engine3D.inst.GL.STATIC_DRAW );
        this.n_indis = meshParams.indis.length;

        if(meshParams.windingOrder) { this.windingOrder = meshParams.windingOrder };
        if(meshParams.drawingMode) { this.drawingMode = meshParams.drawingMode; }
        this.shaderProgram = meshParams.shaderProgram;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     */
    static box( shaderProgram: ShaderProgram, width:number, height:number, depth:number, windingOrder:number = WebGL2RenderingContext.CCW, rgba:Vec4 = new Vec4({X:1,Y:1,Z:1,W:1})) {
        const isColor:boolean = (shaderProgram.vertexShader.source_attribs['color'] !== undefined);
        const isUV:boolean = (shaderProgram.vertexShader.source_attribs['uv'] !== undefined);
        const isNormal:boolean = (shaderProgram.vertexShader.source_attribs['normal'] !== undefined);

        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts:number[] = [];
        function vertexPusher(pos:Vec3, color?:Vec4, uv?:Vec2, normal?:Vec3):void {
            verts.push(pos.X, pos.Y, pos.Z);
            if(isColor && color) { verts.push(color.X, color.Y, color.Z, color.W); }
            if(isUV && uv) { verts.push(uv.X, uv.Y); }
            if(isNormal && normal) { verts.push(normal.X, normal.Y, normal.Z );}
        }

        type vectorUVPair = {
            pos:Vec3,
            uv:Vec2,
        }

        function facePusher(br:vectorUVPair, bl:vectorUVPair, tl:vectorUVPair, tr:vectorUVPair, isNormalForward:boolean):void {
            vertexPusher(br.pos, rgba, br.uv, Vec3.normalVertex(br.pos, bl.pos, tr.pos).normalized().scaled((isNormalForward) ? 1 : -1));
            vertexPusher(bl.pos, rgba, bl.uv, Vec3.normalVertex(bl.pos, tl.pos, br.pos).normalized().scaled((isNormalForward) ? 1 : -1));
            vertexPusher(tl.pos, rgba, tl.uv, Vec3.normalVertex(tl.pos, tr.pos, bl.pos).normalized().scaled((isNormalForward) ? 1 : -1));
            vertexPusher(tr.pos, rgba, tr.uv, Vec3.normalVertex(tr.pos, br.pos, tl.pos).normalized().scaled((isNormalForward) ? 1 : -1));
        }

        // FRONT VERTS
        const frontBR:Vec3 = Vec3.create( hwidth, -hheight, -hdepth); // Bottom-Right (0)
        const frontBL:Vec3 = Vec3.create(-hwidth, -hheight, -hdepth); // Bottom-Left
        const frontTL:Vec3 = Vec3.create(-hwidth,  hheight, -hdepth); // Top-Left
        const frontTR:Vec3 = Vec3.create( hwidth,  hheight, -hdepth); // Top-Right
        facePusher(
            {pos:frontBR, uv:Vec2.create(0.25, 0.5)},
            {pos:frontBL, uv:Vec2.create(0, 0.5)},
            {pos:frontTL, uv:Vec2.create(0, 0.25)},
            {pos:frontTR, uv:Vec2.create(0.25, 0.25)},
            windingOrder === WebGL2RenderingContext.CCW
        );

        // BACK VERTS
        const backBR:Vec3 = Vec3.create( hwidth, -hheight,  hdepth); // Bottom-Right (4) (ALL OF THESE ARE LOOKING AT THE FRONT NOT LOOKING AT THEM FROM THEIR VIEW MEANING THIS IS THE BOTTOM RIGHT LOOKING FORWARD)
        const backBL:Vec3 = Vec3.create(-hwidth, -hheight,  hdepth); // Bottom-Left
        const backTL:Vec3 = Vec3.create(-hwidth,  hheight,  hdepth); // Top-Left
        const backTR:Vec3 = Vec3.create( hwidth,  hheight,  hdepth); // Top-Right
        facePusher(
            {pos:backBR, uv:Vec2.create(0.75, 0.5)},
            {pos:backBL, uv:Vec2.create(0.5, 0.5)},
            {pos:backTL, uv:Vec2.create(0.5, 0.25)},
            {pos:backTR, uv:Vec2.create(0.75, 0.25)},
            windingOrder === WebGL2RenderingContext.CW
        );

        // TOP VERTS
        const topBR:Vec3 = Vec3.create( hwidth,  hheight, -hdepth); // Bottom-Right (8)
        const topBL:Vec3 = Vec3.create(-hwidth,  hheight, -hdepth); // Bottom-Left
        const topTL:Vec3 = Vec3.create(-hwidth,  hheight,  hdepth); // Top-Left
        const topTR:Vec3 = Vec3.create( hwidth,  hheight,  hdepth); // Top-Right
        facePusher(
            {pos:topBR, uv:Vec2.create(0.5, 0)},
            {pos:topBL, uv:Vec2.create(0.75, 0)},
            {pos:topTL, uv:Vec2.create(0.75, 0.25)},
            {pos:topTR, uv:Vec2.create(0.5, 0.25)},
            windingOrder === WebGL2RenderingContext.CCW
        );

        // BOTTOM VERTS
        const bottomBR:Vec3 = Vec3.create( hwidth, -hheight, -hdepth); // Bottom-Right (12)
        const bottomBL:Vec3 = Vec3.create(-hwidth, -hheight, -hdepth); // Bottom-Left
        const bottomTL:Vec3 = Vec3.create(-hwidth, -hheight,  hdepth); // Top-Left
        const bottomTR:Vec3 = Vec3.create( hwidth, -hheight,  hdepth); // Top-Right
        facePusher(
            {pos:bottomBR, uv:Vec2.create(0.75, 0.75)},
            {pos:bottomBL, uv:Vec2.create(0.5, 0.75)},
            {pos:bottomTL, uv:Vec2.create(0.5, 0.5)},
            {pos:bottomTR, uv:Vec2.create(0.75, 0.5)},
            windingOrder === WebGL2RenderingContext.CW
        );

        // LEFT VERTS
        const leftBR:Vec3 = Vec3.create(-hwidth, -hheight, -hdepth); // Bottom-Right (16)
        const leftBL:Vec3 = Vec3.create(-hwidth, -hheight,  hdepth); // Bottom-Left
        const leftTL:Vec3 = Vec3.create(-hwidth,  hheight,  hdepth); // Top-Left
        const leftTR:Vec3 = Vec3.create(-hwidth,  hheight, -hdepth); // Top-Right
        facePusher(
            {pos:leftBR, uv:Vec2.create(0.5, 0.5)},
            {pos:leftBL, uv:Vec2.create(0.25, 0.5)},
            {pos:leftTL, uv:Vec2.create(0.25, 0.25)},
            {pos:leftTR, uv:Vec2.create(0.5, 0.25)},
            windingOrder === WebGL2RenderingContext.CCW
        );

        // RIGHT VERTS
        const rightBR:Vec3 = Vec3.create( hwidth, -hheight, -hdepth); // Bottom-Right (20)
        const rightBL:Vec3 = Vec3.create( hwidth, -hheight,  hdepth); // Bottom-Left
        const rightTL:Vec3 = Vec3.create( hwidth,  hheight,  hdepth); // Top-Left
        const rightTR:Vec3 = Vec3.create( hwidth,  hheight, -hdepth); // Top-Right
        facePusher(
            {pos:rightBR, uv:Vec2.create(1, 0.5)},
            {pos:rightBL, uv:Vec2.create(0.75, 0.5)},
            {pos:rightTL, uv:Vec2.create(0.75, 0.25)},
            {pos:rightTR, uv:Vec2.create(1, 0.25)},
            windingOrder === WebGL2RenderingContext.CW
        );

        console.log(verts);

        let indis:number[] = [];
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

        const mesh:Mesh = new Mesh( {shaderProgram, verts, indis, windingOrder});
        return mesh;
    }

    /**
     * Create a box mesh with the given dimensions and colors.
     */
    static sphereUV( shaderProgram: ShaderProgram, subDivisions:number, scale:number, rgba:Vec4 = new Vec4({X:1,Y:1,Z:1,W:1})):Mesh {
        const isColor:boolean = (shaderProgram.vertexShader.source_attribs['color'] !== undefined);
        const isUV:boolean = (shaderProgram.vertexShader.source_attribs['uv'] !== undefined);
        const isNormal:boolean = (shaderProgram.vertexShader.source_attribs['normal'] !== undefined);

        const layers:number = subDivisions + 1;
        let verts:number[] = [];
        let indis:number[] = [];

        for(let layer:number = 0; layer < layers; layer++) {
            let y_turns:number = (layer / subDivisions) / 2;
            let y:number = (Math.cos(y_turns * Mat4.tau_to_radians(1)) / 2) * scale;

            for (let subdiv:number = 0; subdiv <= subDivisions; subdiv++) {

                let turns: number = subdiv / subDivisions;
                let rads: number = turns * Mat4.tau_to_radians(1);

                let radius_scale: number = Math.sin(y_turns * Mat4.tau_to_radians(1));
                let x: number = (Math.cos(rads) / 2) * radius_scale;
                let z: number = (Math.sin(rads) / 2) * radius_scale;

                verts.push(x,y,z);
                if (isColor) { verts.push(rgba.X, rgba.Y, rgba.Z, rgba.Z); }
                if (isUV) { verts.push(subdiv/subDivisions, layer/subDivisions); }
                if (isNormal) {
                    const normal:Vec3 = Vec3.create(x,y,z).normalized();
                    verts.push(normal.X, normal.Y, normal.Z);
                }

                if(layer < layers) {
                    indis.push(subdiv + (layer * subDivisions), (subdiv + 1) +  ((layer+1) * (subDivisions)));
                }
            }
            if(layer < layers-1) { indis.push(65535); }
        }

        const windingOrder:number = WebGL2RenderingContext.CCW;
        const drawingMode:number = WebGL2RenderingContext.TRIANGLE_STRIP;
        const mesh:Mesh = new Mesh( {shaderProgram, verts, indis, drawingMode, windingOrder} );
        return mesh;
    }


    /**
     * Parse the given text as the body of an obj file. (Expecting counter-clockwise winding)
     */
    static from_obj_text(shaderProgram: ShaderProgram, text:string ) {
        const lines:string[] = text.split(/\r?\n/);

        const verts:number[] = [];
        const indis:number[] = [];

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
                            verts.push(parsedFloat);
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
                            indis.push(parsedInt-1);
                        }
                    }
                    break;
                case "#":
                default:
                    break;
            }
        }

        return new Mesh({shaderProgram, verts, indis});
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

        Engine3D.inst.GL.drawElements(this.drawingMode, this.n_indis, WebGL2RenderingContext.UNSIGNED_SHORT, 0);

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
        this.meshes['cubeD'] = Mesh.box(ShaderProgram.ShaderPrograms['default'], 1, 1, 1);
        this.meshes['sphere'] = Mesh.sphereUV(shaderProgram.ShaderPrograms['default'], 100, 1);
    }

    public static AddToMeshes(name:string, mesh:Mesh) {
        this.meshes[name] = mesh;
    }

    public static get Meshes(): MESHES {
        return this.meshes;
    }

}

export default Mesh;
