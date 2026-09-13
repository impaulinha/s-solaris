import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'

// registra os plugins uma única vez; os componentes importam gsap daqui
gsap.registerPlugin(useGSAP, ScrambleTextPlugin)

export { gsap, useGSAP }
