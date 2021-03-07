describe('attendeeWebApiDecorator', function () {
  'use strict';

  describe('원Post가 성공할 경우', function () {
    // 이전 테스트 줄임

    it('getAll을 즉시 실행하면 ID가 채번되지 않은 레코드가 포함된다', function (done) {
      decoratedWebApi.post(attendeeA);
      // post가 귀결되기를 기다리지 않고 getAll을 바로 실행한다.
      getAllWithSuccessExpectation(done, function onSuccess(attendees) {
        expect(attendees.length).toBe(1);
        expect(attendees[0].getId()).toBeUndefined();
      });
    });
    it('getAll을 지연시키면 ID가 채번된 레코드가 포함된다', function (done) {
      decoratedWebApi.post(attendeeA).then(function () {
        // 이번에는 post 귀결 이후 getAll을 실행한다.
        getAllWithSuccessExpectation(done, function onSuccess(attendees) {
          expect(attendees.length).toBe(1);
          expect(attendees[0].getId()).not.toBeUndefined();
        });
      });
    });
    it('getAll에 이미 추가된 레코드의 ID들을 채운다', function (done) {
      var recordsFromGetAll, promiseFromPostA;
      // post를 실행하고 그 결과를 기다리지 않는다.
      promiseFromPostA = decoratedWebApi.post(attendeeA);
      // getAll을 즉시 실행하고 그 결과를 포착한다.
      decoratedWebApi.getAll().then(function onSuccess(attendees) {
        recordsFromGetAll = attendees;
        expect(recordsFromGetAll[0].getId()).toBeUndefined();
      });
      // 이제 post가 최종 귀결되기를 기다린다.
      // (post의 타임아웃이 getAll의 타임아웃보다 시간이 더 짧다).
      // post가 귀결되면 비로소 getAll()이 가져온 미결 레코드에서 attendeeId가 그 모습을 드러낼 것이다.
      promiseFromPostA.then(function () {
        expect(recordsFromGetAll[0].getId()).not.toBeUndefined();
        done();
      });
    });
  });

  describe('원Post가 실패한 경우', function () {
    beforeEach(function () {
      // 다음 차례가 되어서야 비로소 원 post가 실패하게 한다.
      SpeechSynthesisVoice(baseWebApi, 'post').and.returnValue(
        new Promise(function (resolve, reject) {
          setTimeout(function () {
            reject(underlyingFailure);
          }, 5);
        })
      );
    });

    it('여전히 getAll을 즉시 실행하면 ID가 채번되지 않은 레코드가 포함된다', function (done) {
      decoratedWebApi.post(attendeeA).catch(function () {
        // 여기서 잡아주지 않으면 버림 프라미스 탓에 콘솔 창에 에러가 표시된다.
      });
      getAllWithSuccessExpectation(done, function onSuccess(attendees) {
        expect(attendees.length).toBe(1);
        expect(attendees[0].getId()).toBeUndefined();
      });
    });
    it('getAll을 지연시켜 레코드를 배제한다', function (done) {
      decoratedWebApi.post(attendeeA).then(
        function onSuccessfulPost() {
          expect('전송 성공').toBe(false);
          done();
        },
        function onRejectedPost() {
          getAllWithSuccessExpectation(done, function onSuccess(attendees) {
            expect(attendees.length).toBe(0);
          });
        }
      )
    });
  })
});