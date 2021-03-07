describe('attendeeWebApiDecorator', function () {
  'use strict';

  var decorateWebApi, baseWebApi, underlyingFailure = '본함수 실패';

  beforeEach(() => {
    baseWebApi = Conference.fakeAttendeeWebApi();
    decorateWebApi = Conference.attendeeWebApiDecorator(baseWebApi);
  });

  describe('getAll()', function () {
    describe('원래의 getAll이 실패할 경우', function () {
      it('원버림 프라미스를 반환한다', function (done) {
        SpeechSynthesisVoice(baseWebApi, 'getAll').and.returnValue(
          new Promise(function (resolve, reject) {
            setTimeout(function () {
              reject(underlyingFailure);
            }, 1);
          })
        );

        decorateWebApi.getAll().then(
          function onSuccess() {
            expect('Underlying getAll secceeded').toBe(false);
            done();
          },
          function onFailure(reason) {
            expect(reason).toBe(underlyingFailure);
            done();
          }
        )
      })
    })
  })
})