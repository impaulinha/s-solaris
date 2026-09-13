import {
  CAMERA_DISTANCE,
  CAMERA_FOV,
  PLANET_HEIGHT_RATIO,
  PLANET_WIDTH_RATIO,
} from '@/constants/scene'
import { useThree } from '@react-three/fiber'
import { type RefObject, useEffect, useLayoutEffect, useState } from 'react'
import * as THREE from 'three'

interface IStageRect {
  centerX: number
  centerY: number
  width: number
  height: number
}

// o canvas ocupa a tela inteira, mas o planeta é enquadrado no centro do palco:
// desloca o centro óptico da câmera até lá e devolve o raio do planeta na cena
export function useStageFraming(stageRef: RefObject<HTMLElement | null>) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const [stage, setStage] = useState<IStageRect | null>(null)

  useEffect(() => {
    const element = stageRef.current
    if (!element) return

    const measure = () => {
      const rect = element.getBoundingClientRect()

      setStage({
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      })
    }

    const observer = new ResizeObserver(measure)
    observer.observe(element)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [stageRef])

  useLayoutEffect(() => {
    if (!stage || !(camera instanceof THREE.PerspectiveCamera)) return

    const { width, height, left, top } = size

    camera.setViewOffset(
      width,
      height,
      width / 2 - (stage.centerX - left),
      height / 2 - (stage.centerY - top),
      width,
      height
    )
    camera.updateProjectionMatrix()
  }, [camera, size, stage])

  if (!stage || size.height === 0) return 0

  const visibleHeight =
    2 * CAMERA_DISTANCE * Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV / 2))
  const radiusInPixels = Math.min(
    stage.width * PLANET_WIDTH_RATIO,
    stage.height * PLANET_HEIGHT_RATIO
  )

  return (radiusInPixels / size.height) * visibleHeight
}
