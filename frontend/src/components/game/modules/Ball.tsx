import React from "react";
import * as THREE from "three";

type Props = {
  color?: string;
};
const Ball = React.forwardRef(({ color = "#1C1B27" }: Props, ref: any) => {
  const meterial = new THREE.MeshPhysicalMaterial({
    color: color,
    emissive: 0x000000,
    metalness: 0.5,
    roughness: 0.5,
    reflectivity: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.5,
  });
  return (
    <mesh position={[0, 0, 1]} material={meterial} ref={ref} receiveShadow>
      <sphereBufferGeometry attach="geometry" args={[1, 100, 100]} />
    </mesh>
  );
});
Ball.displayName = "Ball";
export default Ball;
