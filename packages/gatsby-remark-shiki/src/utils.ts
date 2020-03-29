// A TypeScript port of https://stackoverflow.com/questions/40117156/creating-overlapping-text-spans-in-javascript

type Range = {
  begin: number
  end: number
  text?: string
  count?: number
  tooltip?: string[]
  classes?: string
  lsp?: string
}

const splice = function(str: string, idx: number, rem: number, newString: string) {
  return str.slice(0, idx) + newString + str.slice(idx + Math.abs(rem))
}

export function createHighlightedString2(ranges: Range[], text: string) {
  const actions = [] as { text: string; index: number }[]

  ranges.forEach(r => {
    console.log('r:', r)
    if (!r.lsp) return
    if (r.classes === 'lsp') {
      actions.push({ text: '</data-lsp>', index: r.end })
      actions.push({ text: `<data-lsp lsp='${stripHTML(r.lsp || '')}'>`, index: r.begin })
    } else if (r.classes === 'err') {
      actions.push({ text: '</data-err>', index: r.end })
      actions.push({ text: `<data-err'>`, index: r.begin })
    } else if (r.classes === 'query') {
      actions.push({ text: '</data-highlight>', index: r.end })
      actions.push({ text: `<data-highlight'>`, index: r.begin })
    }
  })

  let html = (' ' + text).slice(1)

  console.log('-')
  actions
    .sort((l, r) => r.index - l.index)
    .forEach(action => {
      console.log(action.index)
      html = splice(html, action.index, 0, action.text)
    })

  console.log(html)

  return html
}

export function stripHTML(text: string) {
  var table: any = {
    '<': 'lt',
    '>': 'gt',
    '"': 'quot',
    "'": 'apos',
    '&': 'amp',
    '\r': '#10',
    '\n': '#13',
  }
  return text.toString().replace(/[<>"'\r\n&]/g, function(chr) {
    return '&' + table[chr] + ';'
  })
}