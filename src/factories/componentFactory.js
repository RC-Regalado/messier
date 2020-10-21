export function compInst (component) {
  return {
    global: true,
    name: component.name,
    top: component.top,
    left: component.left,
    bottom: component.bottom,
    right: component.right,
    component: component.component,
    element: component.element,
    container: component.container
  }
}

export function compRef (component) {
  return {
    usageCount: 1,
    name: component.name,
    height: component.height,
    width: component.width,
    type: component.type,
    text: component.text,
    attrs: component.attrs,
    styles: component.styles,
    classes: component.classes,
    children: component.children,
    dependencies: component.dependencies || []
  }
}

const componentFactory = {
  compInst,
  compRef
}

export default componentFactory
