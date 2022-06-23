const compiler = require('vue-template-compiler')
const v_if = compiler.compile(`
<div id="test">
  <p v-if="false">测试</p>
</div>
`)
console.log('----v-if----')
console.log(v_if.render)
// with (this) {
//   return _c('div', { attrs: { "id": "test" } }, [
//     (false) ? _c('p', [_v("测试")]) : _e()
//   ])
// }

const v_show = compiler.compile(`
<div id="test">
  <p v-show="false">测试</p>
</div>
`)
console.log('----v-show----')
console.log(v_show.render)
// with (this) {
//   return _c('div', { attrs: { "id": "test" } }, [
//     _c('p', {
//       directives: [{ name: "show", rawName: "v-show", value: (false), expression: "false" }]
//     }, [_v("测试")])])
// }

const v_for_if = compiler.compile(`
<div id="test">
  <ul>
    <li v-for="ind in 5" v-if="ind === 5">
      {{ ind }}
    </li>
  </ul>
</div>
`)
console.log('----v-for----')
console.log(v_for_if.render)
// with (this) {
//   return _c('div', { attrs: { "id": "test" } }, [
//     _c('ul',
//       _l((5), function (ind) {
//         return (ind === 5) ? _c('li', [_v("\n      " + _s(ind) + "\n    ")]) : _e()
//       }), 0)
//   ])
// }

const v_html = compiler.compile(`
<div id="test">
  <p v-html="'<div>23231213{{title}}<div>'">123</p>
</div>
`)
console.log('----v-html----')
console.log(v_html.render)
// with (this) {
//   return _c('div', { attrs: { "id": "test" } }, [
//     _c('p', {
//       domProps: { "innerHTML": _s('<div>23231213{{title}}<div>') }
//     }, [_v("123")])
//   ])
// }


const v_text = compiler.compile(`
<div id="test">
  <p v-text="'<div>23231213{{title}}<div>'">123</p>
</div>
`)
console.log('----v-text----')
console.log(v_text.render)
// with (this) {
//   return _c('div', { attrs: { "id": "test" } }, [
//     _c('p', {
//       domProps: { "textContent": _s('<div>23231213{{title}}<div>') }
//     }, [_v("123")])
//   ])
// }

const v_model = compiler.compile(`
<div id="test">
  <input type="checkbox" v-model="msg" />
</div>
`)
console.log('----v-model----')
console.log(v_model.render)
// with (this) {
//   return _c('div', { attrs: { "id": "test" } }, [
//     _c('input', {
//       directives: [{ name: "model", rawName: "v-model", value: (msg), expression: "msg" }],
//       domProps: { "value": (msg) },
//       on: {
//         "input": function ($event) {
//           if ($event.target.composing) return
//           msg = $event.target.value
//         }
//       }
//     })
//   ])
// }
