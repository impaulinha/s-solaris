import type { IPlanet } from '@/types/planet'

export const PLANETS: IPlanet[] = [
  {
    id: 'mercury',
    index: 1,
    name: 'Mercury',
    apiId: 'mercure',
    nasaQuery: 'Mercury planet',
    texture: '/src/assets/textures/mercury.jpg',
    color: 'planet-mercury',
    description:
      'Mercúrio é o menor planeta do Sistema Solar e o mais próximo do Sol. Sua superfície está fortemente craterada, lembrando a Lua, com temperaturas que variam de 430°C durante o dia para -180°C à noite.',
  },
  {
    id: 'venus',
    index: 2,
    name: 'Venus',
    apiId: 'venus',
    nasaQuery: 'Venus planet',
    texture: '/src/assets/textures/venus.jpg',
    color: 'planet-venus',
    description:
      'Vênus é o segundo planeta a partir do Sol e o mais quente do Sistema Solar, com temperaturas na superfície que chegam a 465°C. Sua densa atmosfera de dióxido de carbono cria um efeito estufa extremo.',
  },
  {
    id: 'earth',
    index: 3,
    name: 'Earth',
    apiId: 'terre',
    nasaQuery: 'Earth planet',
    texture: '/src/assets/textures/earth.jpg',
    color: 'planet-earth',
    description:
      'Terra é o terceiro planeta a partir do Sol e o único objeto conhecido no universo a abrigar vida. Ela se move em torno do Sol em 365.26 dias e é o planeta mais denso do Sistema Solar.',
  },
  {
    id: 'mars',
    index: 4,
    name: 'Mars',
    apiId: 'mars',
    nasaQuery: 'Mars planet surface',
    texture: '/src/assets/textures/mars.jpg',
    color: 'planet-mars',
    description:
      'Marte é o quarto planeta a partir do Sol e o segundo menor do Sistema Solar. Conhecido como o Planeta Vermelho, sua aparência avermelhada provém do óxido de ferro em sua superfície.',
  },
  {
    id: 'jupiter',
    index: 5,
    name: 'Jupiter',
    apiId: 'jupiter',
    nasaQuery: 'Jupiter planet',
    texture: '/src/assets/textures/jupiter.jpg',
    color: 'planet-jupiter',
    description:
      'Júpiter é o quinto planeta a partir do Sol e o maior do Sistema Solar. Um gigante gasoso com uma massa mais de duas vezes maior que a de todos os outros planetas juntos, sua icônica Grande Mancha Vermelha é uma tempestade com mais de 350 anos.',
  },
  {
    id: 'saturn',
    index: 6,
    name: 'Saturn',
    apiId: 'saturne',
    nasaQuery: 'Saturn planet rings',
    texture: '/src/assets/textures/saturn.jpg',
    color: 'planet-saturn',
    ringTexture: '/src/assets/textures/saturn-ring.png',
    description:
      'Saturno é o sexto planeta a partir do Sol e o segundo maior. Seu espetacular sistema de anéis, feito de gelo e rocha, estende-se até 282.000 km do planeta, mas é notavelmente fino — com apenas cerca de 10 metros de espessura.',
  },
  {
    id: 'uranus',
    index: 7,
    name: 'Uranus',
    apiId: 'uranus',
    nasaQuery: 'Uranus planet',
    texture: '/src/assets/textures/uranus.jpg',
    color: 'planet-uranus',
    description:
      'Urano é o sétimo planeta a partir do Sol. Ele gira de lado com uma inclinação axial de 98 graus, o que o torna único entre os planetas. Sua cor azul-esverdeada provém do metano em sua atmosfera.',
  },
  {
    id: 'neptune',
    index: 8,
    name: 'Neptune',
    apiId: 'neptune',
    nasaQuery: 'Neptune planet',
    texture: '/src/assets/textures/neptune.jpg',
    color: 'planet-neptune',
    description:
      'Netuno é o oitavo planeta conhecido e o mais distante do Sol. É o mais denso dos planetas gigantes, com os ventos mais fortes do Sistema Solar, que chegam a 2.100 km/h.',
  },
]

export type PlanetId = (typeof PLANETS)[number]['id']
