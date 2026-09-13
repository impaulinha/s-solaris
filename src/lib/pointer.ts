// posição do mouse normalizada entre -1 e 1, lida a cada frame pela cena 3D
export const pointer = { x: 0, y: 0 }

window.addEventListener(
  'pointermove',
  (event) => {
    if (event.pointerType === 'touch') return

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    pointer.y = -((event.clientY / window.innerHeight) * 2 - 1)
  },
  { passive: true }
)
