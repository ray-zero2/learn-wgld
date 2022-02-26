attribute vec3 position;
attribute vec3 normals;
attribute vec4 color;
uniform   mat4 modelMatrix;
uniform   mat4 viewMatrix;
uniform   mat4 projectionMatrix;
varying vec3 vNormal;
varying   vec4 vColor;

void main(void){
		vec4 mPosition = modelMatrix * vec4(position, 1.);
    vColor = color;
    vNormal = normals;
    gl_Position    = projectionMatrix * viewMatrix * mPosition;
}