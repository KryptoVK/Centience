import { KeyboardControls as DreiKeyboardControls } from '@react-three/drei';
import { ReactNode } from 'react';

export enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
}

export function KeyboardControls({ children }: { children: ReactNode }) {
  return (
    <DreiKeyboardControls
      map={[
        { name: Controls.forward, keys: ['KeyW'] },
        { name: Controls.backward, keys: ['KeyS'] },
        { name: Controls.left, keys: ['KeyA'] },
        { name: Controls.right, keys: ['KeyD'] },
      ]}
    >
      {children}
    </DreiKeyboardControls>
  );
}