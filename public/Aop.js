// 출처: https://github.com/davedx/aop
// Created by Fredrik Appelberg: http://fredrik.appelberg.me/2010/05/07/aop-js.html
// Modified to support prototypes by Dave Clayton
Aop = {
  // 주어진 이름공간에 매칭되는 모든 함수 주변(around)에 어드바이스를 적용한다.
  around: function(pointcut, advice, namespaces) {
    // 이름공간이 없으면 전역 이름공간을 찾아내는 꼼수를 쓴다.
    if (namespaces == undefined || namespaces.length == 0)
      namespaces = [ (function(){return this;}).call() ];
    // 이름공간을 전부 순회한다.
    for(var i in namespaces) {
      var ns = namespaces[i];
      for(var member in ns) {
        if(typeof ns[member] == 'function' && member.match(pointcut)) {
          (function(fn, fnName, ns) {
             // member fn 슬롯을 'advice' 함수를 호출하는 래퍼로 교체한다.
             ns[fnName] = function() {
               return advice.call(this, { fn: fn,
                                          fnName: fnName,
                                          arguments: arguments });
             };
           })(ns[member], member, ns);
        }
      }
    }
  },

  next: function(f) {
    return f.fn.apply(this, f.arguments);
  }
};

Aop.before = function(pointcut, advice, namespaces) {
  Aop.around(pointcut,
             function(f) {
               advice.apply(this, f.arguments);
               return Aop.next.call(this, f);
             },
             namespaces);
};

Aop.after = function(pointcut, advice, namespaces) {
  Aop.around(pointcut,
             function(f) {
               var ret = Aop.next.call(this, f);
               advice.apply(this, f.arguments);
               return ret;
             },
             namespaces);
};