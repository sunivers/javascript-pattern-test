var Conference = Conference || {};

// attendeeWebApi의 가짜 버전. 진짜와 메서드는 같지만 전체적으로 클라이언트 측 코드만 있다.
Conference.fakeAttendeeWebApi = function () {
  'use strict';

  var attendees = []; // 가짜 데이터베이스 테이블

  return {
    // 서버에 attendee를 POST 전송하는 척 한다.
    // attendee 사본(마치 서버에서 새 버전을 조회해오는 것처럼)으로 귀결되는 프라미스를 반환하고, 
    // 귀결 시점에 이 레코드에는 데이터베이스에서 할당된 PK(attendeeId)가 들어있을 것이다.
    post: function (attendee) {
      return new Promise((resolve, reject) => {
        // 5 밀리 초에 불과하지만, setTimeout은 프라미스 귀결을 다음 차례로 지연한다.
        setTimeout(() => {
          var copyOfAttendee = attendee.copy();
          copyOfAttendee.setId(attendees.length + 1);
          attendees.push(copyOfAttendee);
          resolve(copyOfAttendee);
        }, 5);
      });
    },

    // 전체 참가자에 대한 프라미스를 반환한다.
    // 이 프라미스는 반드시 귀결되지만, 필요하면 테스트 코드에서 스파이를 심을 수도 있다.
    getAll: function () {
      return new Promise((resolve, reject) => {
        // setTimeout은 실제 조건을 흉내 내기 위해 post보다 지연 시간이 짧다.
        setTimeout(() => {
          var copies = [];
          attendees.forEach(a => {
            copies.push(a.copy());
          });
          resolve(copies);
        }, 1);
      });
    }
  }
}