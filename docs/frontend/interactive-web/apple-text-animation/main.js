const controller = new ScrollMagic.Controller();

var animateElem = [".animate", ".animate_1", ".animate_2", ".animate_3", ".animate_4"];
var triggerElem = [".trigger", ".trigger_1", ".trigger_2", ".trigger_3", ".trigger_4"];

for (let i = 0; i < animateElem.length; i++) {
  const target = animateElem[i];
  const trigger = triggerElem[i];

  addAnimationTo(target, trigger);
}

function slowMove(target, transalateY = 50) {
  const tween_move = TweenMax.fromTo(
    target,
    1,
    {
      ease: SlowMo.ease.config(0.7, 0.7, false), // SlowMo가 우리가 원하는 애니메이션의 이름입니다.
      y: transalateY, // GSAP은 CSS와는 조금 달라서 transalateY 대신 y라는 이름으로 사용됩니다.
    },
    {
      ease: SlowMo.ease.config(0.7, 0.7, false),
      y: -transalateY,
    }
  );

  return tween_move;
}

function changeOpacity(target) {
  const tween_opacity = new TimelineMax();
  tween_opacity
    .to(target, 0.3, {
      // 0.3은 애니메이션이 진행되는 길이입니다.
      ease: Linear.easeNone, // Linear 애니메이션은 값이 직선형으로 일정하게 변한다는 뜻입니다.
      opacity: 1, // Opacity가 0으로 (to) 바뀜
    })
    .to(
      target,
      0.3,
      {
        ease: Linear.easeNone,
        opacity: 0,
      },
      "+=0.4"
    ); // 여기 있는 0.4는 앞의 애니메이션 이 끝난 후 0.4만큼 기다리고 실행하라는 뜻입니다.
  // 텍스트가 페이드 인 한 뒤 일정 기간 나타나 있어야 하니까요.

  return tween_opacity;
}

function addAnimationTo(target, trigger, duration = "1500px") {
  const timeline = new TimelineMax();
  const tween_move = slowMove(target);
  const tween_opacity = changeOpacity(target);
  timeline.add(tween_move, 0).add(tween_opacity, 0);

  const scene_main = new ScrollMagic.Scene({
    triggerElement: trigger,
    duration,
  })
    .setTween(timeline)
    .addTo(controller)
    .addIndicators();
}
