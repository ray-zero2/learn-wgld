precision highp float;
uniform   vec4 ambientColor;
uniform   mat4 modelMatrix;
uniform   mat4 invMatrix;
uniform   vec3 eyeDirection;
uniform   vec3 lightDirection;
varying vec3 vNormal;
varying vec4 vColor;
void main(void){
	vec3 light = normalize(lightDirection);
	vec4 mNormal = normalize(modelMatrix * vec4(vNormal, 0.));
	vec3 halfLE = normalize(lightDirection + eyeDirection);
	float diffuse  = clamp(dot(mNormal.xyz, light), .0, 1.0);
	float specular = pow(clamp(dot(mNormal.xyz, halfLE), .0, 1.0), 50.);
	vec4 finalColor = vColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
	gl_FragColor = finalColor;
}