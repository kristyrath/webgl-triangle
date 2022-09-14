
// vertextShader + fragment shader text in glsl 
// initialize gl object from canvas
// create shader, shadersource, compile shader,
// create program, attach shader, check program for errors, use program
// create buffer of vertext shader object, bind buffer, 
// get attrib location of vertext + fragment, enable
// RENDER with use program + drawArrays
function InitDemo() {


    let vertexShaderText = [
        'precision mediump float;'
        ,
        'attribute vec2 vertPosition;',
        'attribute vec3 vertColor;', // input to vertexShader
        'varying vec3 fragColor;', // outpul to fragShader
        'void main()',
        '{',
        'fragColor = vertColor;',
        ' gl_Position = vec4(vertPosition, 0.0, 1.0);',
        '}'
    ].join('\n');

    let fragmentShaderText = [
        'precision mediump float;',
        '',
        'varying vec3 fragColor;',
        'void main()',
        '{',
        ' gl_FragColor = vec4(fragColor, 1.0);',
        '}'
    ].join('\n');


    const canvas = document.getElementById('triangle-canvas');
    const gl = canvas.getContext('webgl2');


    if (!gl) {
        throw new Error('Web gl is not supported');
    }

    gl.clearColor(0.75, 0.85, 0.8,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // SET UP SHADER
    // create shader var
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // set glsl source code
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);


    gl.compileShader(vertexShader);
    // check for compilation errors 
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        throw new Error ('vertex shader compilation failed', gl.getShaderInfoLog(vertexShader));
    }

    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        throw new Error ('fragment shader compilation failed', gl.getShaderInfoLog(fragmentShader));
    }

    // PROGRAM - entire graphics pipeline
    // create program
    // attach shaders 
    // link program + error checking
    // validate program + error checking (only in production)
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
        throw new Error('ERROR linking program!', gl.getProgramInfoLog(program));
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        throw new Error('ERROR validating program!', gl.getProgramInfoLog(program));
    }

    // X, Y             R,G,B
    let triangleVertices = 
    [
        -0.5, 0.5,       1.0, 1.0, 0.0,
        -1.0, -0.5,     0.7, 0.0, 1.0,
        0.0, -0.5,      0.1, 1.0, 0.6,
        0.5, 0.5,       1.0, 1.0, 0.0,
        0.0, -0.5,     0.7, 0.0, 1.0,
        1.0, -0.5,      0.1, 1.0, 0.6
    ];

    // chunk of mem on GPU
    let triangleVertexBufferObject = gl.createBuffer();
    // ARRAY_BUFFER - type of buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    // not binded to triangleVertextBufferObject because it will use any active buffer available last bound
    // JS - stores as 64 bit precision float but OPEN GL, expects 32 bits
    // STATIC DRAW - sends from cpu to gpu mem once
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        positionAttribLocation, // attribute location 
        2, // number of elements per attribute 
        gl.FLOAT, // type of elements,
        gl.FALSE, // data is normalize
        5 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex
        0// offset from the beginning of a single vertex to this attribute 
    );
    gl.vertexAttribPointer(
        colorAttribLocation, // attribute location 
        3, // number of elements per attribute 
        gl.FLOAT, // type of elements,
        gl.FALSE, // data is normalize
        5 * Float32Array.BYTES_PER_ELEMENT,// size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute 
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //  MAIN RENDER LOOP 
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6);  

};

// function vertexShader(vertPosition, vertColor) {
//     console.log('vertex position:', vertPosition);
//     return { 
//         fragColor: vertColor,
//         gl_Position: [vertPosition.x, vertPosition.y, 0.0, 1.0]
//     };
// };

// function fragmentShader(fragColor) {
//     return { 
//         gl_FragColor: vec4(fragColor, 1.0)
//     }
// }