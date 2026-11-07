// keyboard.js — 按下物理按键时高亮底部键盘区对应键帽
;(() => {
  const root = document.documentElement
  const section = document.getElementById('keyboard_section')
  const keys = new Map(
    [...section.querySelectorAll('kbd')].map((k) => [k.dataset.key.toLowerCase(), k])
  )

  // 统一小写，与 data-key / actions 的键名保持一致（ArrowUp → arrowup）
  const nameOf = (e) => e.key.toLowerCase()

  const zoom = (delta) => {
    const size = parseFloat(getComputedStyle(root).fontSize)
    root.style.fontSize = `${Math.min(24, Math.max(12, size + delta))}px`
  }

  const toggleTheme = () => {
    const dark = root.getAttribute('data-theme') !== 'dark'
    if (dark) root.dataset.theme = 'dark'
    else root.removeAttribute('data-theme')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }

  // 顶部导航：切换 radio 并平滑滚动到对应区块
  const navInputs = [...document.querySelectorAll('#nav_form input[type="radio"]')]
  const goToSection = (i) => navInputs[i]?.click()
  document.getElementById('nav_form')?.addEventListener('change', (e) => {
    document.querySelector(e.target.value)?.scrollIntoView({ behavior: 'smooth' })
  })

  const actions = {
    1: () => goToSection(0),
    2: () => goToSection(1),
    3: () => goToSection(2),
    arrowup: () => scrollBy(0, -120),
    w: () => scrollBy(0, -120),
    arrowdown: () => scrollBy(0, 120),
    s: () => scrollBy(0, 120),
    arrowleft: () => scrollBy(-120, 0),
    a: () => scrollBy(-120, 0),
    arrowright: () => scrollBy(120, 0),
    d: () => scrollBy(120, 0),
    '+': () => zoom(1),
    '-': () => zoom(-1),
    m: toggleTheme,
    h: () => section.classList.toggle('hidden'),
  }

  const press = (name, down) => keys.get(name)?.classList.toggle('active_key', down)

  // 只在真正的文本输入场景下放行（radio/checkbox 等仍参与快捷键）
  const isTextField = (el) =>
    el?.matches?.(
      'textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], input:not([type="radio"], [type="checkbox"], [type="button"], [type="submit"], [type="reset"], [type="range"], [type="color"], [type="file"])'
    )

  addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || isTextField(e.target)) return
    const name = nameOf(e)
    press(name, true)
    const act = actions[name]
    if (act) {
      e.preventDefault()
      act()
    }
  })

  addEventListener('keyup', (e) => press(nameOf(e), false))

  // 窗口失焦时清除所有高亮，避免“卡住”
  addEventListener('blur', () => keys.forEach((k) => k.classList.remove('active_key')))

  // 点击键帽：闪一下并执行相同动作
  keys.forEach((key, name) =>
    key.addEventListener('click', () => {
      key.classList.add('active_key')
      setTimeout(() => key.classList.remove('active_key'), 120)
      actions[name]?.()
    })
  )
})()
