const compiler = require('vue-template-compiler')
const v_if = compiler.compile(`
  <div id="test">
    <p v-if="false">测试</p>
  </div>`
)
console.log(v_if.render)
/// with(this){return _c('div',{attrs:{"id":"test"}},[(false)?_c('p',[_v("测试")]):_e()])}

const v_show = compiler.compile(`
<div id="test">
  <p v-show="false">测试</p>
</div>`
)
console.log(v_show.render)
/// with(this){return _c('div',{attrs:{"id":"test"}},[_c('p',{directives:[{name:"show",rawName:"v-show",value:(false),expression:"false"}]},[_v("测试")])])}

const v_for_if = compiler.compile(`
<div id="test">
  <ul></ul>
</div>`
)
