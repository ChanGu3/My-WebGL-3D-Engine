import Buffer from "./shaders/Buffer";
import Engine3D from "../Engine3D";
import ShaderProgram from "./shaders/ShaderProgram";
import Time from "../Time";
import Mat4, {UniqueMatrix} from "../linear-algebra/Mat4";

class Mesh {
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
    static box( shaderProgram: ShaderProgram, width:number, height:number, depth:number ) {
        let hwidth = width / 2.0;
        let hheight = height / 2.0;
        let hdepth = depth / 2.0;

        let verts = [
            hwidth, -hheight, -hdepth,      //1.0, 0.0, 0.0, 1.0,
            -hwidth, -hheight, -hdepth,     //0.0, 1.0, 0.0, 1.0,
            -hwidth, hheight, -hdepth,      //0.0, 0.0, 1.0, 1.0,
            hwidth, hheight, -hdepth,       //1.0, 1.0, 0.0, 1.0,

            hwidth, -hheight, hdepth,       //1.0, 0.0, 1.0, 1.0,
            -hwidth, -hheight, hdepth,      //0.0, 1.0, 1.0, 1.0,
            -hwidth, hheight, hdepth,       //0.5, 0.5, 1.0, 1.0,
            hwidth, hheight, hdepth,        //1.0, 1.0, 0.5, 1.0,
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
            0, 3, 2, 2, 1, 0,
            4, 7, 3, 3, 0, 4,
            5, 6, 7, 7, 4, 5,
            1, 2, 6, 6, 5, 1,
            3, 7, 6, 6, 2, 3,
            4, 0, 1, 1, 5, 4,
        ];

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
     */
    static from_obj_file(file_name:string, shaderProgram: ShaderProgram, f ) {
        let request = new XMLHttpRequest();

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

    /*
    *  renders the mesh every frame.
    */
    public render ():void {
        this.shaderProgram.Load();
        const prevVertBuffer = Buffer.bindArrayBuffer(this.verts);
        const prevElemBuffer = Buffer.bindElementArrayBuffer(this.indis);

        this.RenderNext();

        Buffer.bindArrayBuffer(prevVertBuffer);
        Buffer.bindElementArrayBuffer(prevElemBuffer);
        ShaderProgram.UnloadAny();
    }

    public RenderOnce():void
    {
        this.shaderProgram.setVertexAttributesToBuffer();

        if (this.isFaceCulling) {
            Engine3D.inst.GL.frontFace(this.windingOrder);
            Engine3D.inst.GL.cullFace(this.cullingFace);
            Engine3D.inst.GL.enable(WebGL2RenderingContext.CULL_FACE)
        }
        else {
            Engine3D.inst.GL.disable(WebGL2RenderingContext.CULL_FACE);
        }

        Engine3D.inst.GL.drawElements(WebGL2RenderingContext.TRIANGLES, this.n_indis, WebGL2RenderingContext.UNSIGNED_SHORT, 0);
    }

    private rot_amt_xz:number = 0.0;
    private readonly rot_speed_xz:number = -0.125;
    public RenderNext() {
        this.rot_amt_xz += this.rot_speed_xz * Time.deltaTime;

        //const mat:mat4 = mat4.translation(0,-0.5,0).multiply(mat4.rotation_xz(this.rot_amt_xz).multiply(mat4.scale(0.25,0.25,0.25)));
        const mat:Mat4 = Mat4.translation(0,0,2.2).multiply(Mat4.rotation_xz(this.rot_amt_xz).multiply(Mat4.scale(1.5,1.5,1.5)))
        this.shaderProgram.setModelUniform_Mat4x4(mat);
        this.shaderProgram.setProjectionUniform_Mat4x4(Mat4.perspectiveUsingFrustum(0.25, Engine3D.inst.VIEWPORT.aspectRatio, 1, 10));


        this.RenderOnce();
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
}

export default Mesh;
