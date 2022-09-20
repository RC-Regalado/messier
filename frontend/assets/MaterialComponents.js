/*
  TODO: FIX
  Components from external libraries (ie. vuetify):
  - PARENT -> external, component, element
 */
const materialComponents = [
  // --- BUTTON --- //
  {
    displayName: 'Button',
    iconName: 'mdcButton',
    name: 'v-btn',
    type: 'v-btn',
    text: 'Button',
    element: true,
    width: 200,
    height: 40,
    attrs: {},
    styles: {
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      'background-color': '#eeeeee'
    },
    classes: {},
    dependencies: [
      {
        name: 'vuetify',
        version: '^2.2.11',
        imports: [
          ['vuetify'],
          'https://registry.npmjs.org/vuetify/-/vuetify-2.3.15.tgz'
        ]
      }
    ]
  }
  // --- FLOATING ACTION BUTTON --- //

  // --- RADIO --- //

  // --- LINEAR PROGRESS --- //

  // --- SWITCH --- //

  // --- TEXT-FIELD --- //
]

export default materialComponents
