attribute vec3 position;
attribute vec3 normals;
attribute vec4 color;
uniform   vec4 ambientColor;
uniform   mat4 modelMatrix;
uniform   mat4 viewMatrix;
uniform   mat4 projectionMatrix;
uniform   mat4 invMatrix;
uniform   vec3 eyeDirection;
uniform   vec3 lightDirection;
varying   vec4 vColor;

void main(void){
    // vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
		vec3 light = normalize(lightDirection);
		vec4 mPosition = modelMatrix * vec4(position, 1.);
		vec4 mNormal = normalize(modelMatrix * vec4(normals, 0.));
    vec3 halfLE = normalize(lightDirection + eyeDirection);
    float diffuse  = clamp(dot(mNormal.xyz, light), .0, 1.0);
    float specular = pow(clamp(dot(mNormal.xyz, halfLE), .0, 1.0), 50.);
    vColor         = color * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
    gl_Position    = projectionMatrix * viewMatrix * mPosition;
}