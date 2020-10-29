function process (input) {
  input = input.replaceAll('<br>', '\\n')
  input = input.replaceAll(new RegExp('(<\\/?(\\s|\\S)*?>)', 'g'), '')
  console.log('in: ' + input)
  input = input.replaceAll('\\n', '<br>')
  return input
    .replaceAll(new RegExp('\'(\\s|\\S)*?\'', 'g'), `<a style='color: ${color('\'')}'>'data'</a>`)
    .replaceAll('function', `<a style='color: ${color('function')}'>function</a>`)
}

function color (key) {
  switch (key) {
    case 'function': return '#b44f1b'
    case '\'': return '#08632a'
    default: return '#000000'
  }
}

export {
  process
}
