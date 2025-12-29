import { Physics, RigidBody } from "@react-three/rapier"
import { Lighting } from "./elements/lighting"
import { PagodaGLTF } from "./elements/PagodaGLTF"
import { Trees } from "./elements/trees"
import { Rocks } from "./elements/rocks"
import { Bridge } from "./elements/bridge"
import { Lanterns } from "./elements/lanterns"
import { KoiPond } from "./elements/koi-pond"
import { Roof } from "./elements/roof"
import { SakuraParticles } from "./effects/sakura-particles"
import { FPSControls } from "./controls/fps-controls"
import { useThree, useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { Environment, Sky } from "@react-three/drei"
import AstreAnimation from "./AstreAnimation"

import StonePath from "./StonePath"

export default function GardenScene() {

  const { gl } = useThree();
  const [night, setNight] = useState(false);
  const [transition, setTransition] = useState(0);
  const transitionRef = useRef(0);

  useFrame((_, delta) => {
    const target = night ? 1 : 0;
    transitionRef.current += (target - transitionRef.current) * Math.min(1, delta * 0.5);
    if (Math.abs(transitionRef.current - target) < 0.01) transitionRef.current = target;
    setTransition(transitionRef.current);
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      alert('Le contexte WebGL a été perdu. Rechargez la page ou réduisez la complexité de la scène.');
    };
    canvas.addEventListener('webglcontextlost', onLost, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost, false);
    };
  }, [gl]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "n" || e.key === "N") setNight((v: boolean) => !v);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Physics gravity={[0, -9.81, 0]}>
        <AstreAnimation transition={transition} />
        <FPSControls initialPosition={[-0.1, 1.7, -38]} />
        <RigidBody type="fixed" colliders="cuboid">
          <PagodaGLTF position={[0, 0, 0]} />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <Trees />
        </RigidBody>
        <RigidBody type="fixed" colliders="cuboid">
          <Rocks />
        </RigidBody>
        <Bridge />
        <StonePath />
        <Lanterns night={transition > 0.5} />
        <KoiPond />
        <Roof />
        <SakuraParticles />
      </Physics>
    </>
  );
}
