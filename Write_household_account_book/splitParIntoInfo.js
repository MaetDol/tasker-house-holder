
let i = global('UHAB_last_notify').split('™')
var price = i[0]
var type  = i[1]
var store = i[2]
var memo  = i[3] == undefined ? store : memo