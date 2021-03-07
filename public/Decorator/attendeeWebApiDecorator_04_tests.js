describe('attendeeWebApiDecorator', function () {
  'use strict';

  var decorateWebApi,
    attendeeA,
    attendeeB;
  
  // decorateWebApi.getAll()을 실행하면 프라미스가 귀결되어 반환될 것이다.
  // done   - 비동기 처리 시 널리 쓰이는 재스민 done() 함수다.
  // expectation - 반환된 attendees에 관한 기대식을 적용할 함수
  function getAllWithSuccessExpectation(done, expectation) {
    decoratedWebApi.getAll().then(
      function onSuccess(attendees) {
        expectation(attendees);
        done();
      },
      function onFailure() {
        expectation('getAll 실패').toBe(false);
        done();
      }
    );
  }
  /** 이전 테스트 줄임 **/
  
  describe('getAll()', function () {
    describe('원getAll이 성공할 경우', function () {
      
      /** 이전 테스트 줄임 **/
    
      it('처리된 전체 레코드 + 미결 상태인 전체 레코드를 반환한다', function (done) {
        decorateWebApi.post(attendeeA).then(function () {
          decorateWebApi.post(attendeeB); // 놔둔다.
          getAllWithSuccessExpectation(done, function onSuceess(attendees) {
            expect(attendees.length).toBe(2);
            expect(attendees[0].getId()).not.toBeUndefined();
            expect(attendees[1].getId()).toBeUndefined();
          });
        });
      });
    });
  });
});