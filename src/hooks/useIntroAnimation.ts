import { gsap, useGSAP } from '@/lib/gsap'

// revela navbar, roleta, HUD e rodapé em sequência quando o preloader termina
export function useIntroAnimation(isReady: boolean) {
  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-intro]')

      if (!isReady) {
        gsap.set(targets, { autoAlpha: 0, y: 24 })
        return
      }

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        duration: 1.4,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.7,
      })
    },
    { dependencies: [isReady] }
  )
}
