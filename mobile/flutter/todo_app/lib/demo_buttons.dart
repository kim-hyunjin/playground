import 'package:flutter/material.dart';

// StatefulWidget은 작게 유지할 것!
// 이제 버튼을 눌러도 UIUpdatesDemo의 build 메소드는 호출되지 않는다.
class DemoButtons extends StatefulWidget {
  const DemoButtons({super.key});

  @override
  State<DemoButtons> createState() {
    return _DemoButtonsState();
  }
}

class _DemoButtonsState extends State<DemoButtons> {
  var _isUnderstood = false;

  @override
  Widget build(BuildContext context) {
    print('DemoButtons BUILD called');

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextButton(
              onPressed: () {
                // build method called after setState call everytime
                setState(() {
                  _isUnderstood = false;
                });
              },
              child: const Text('No'),
            ),
            TextButton(
              onPressed: () {
                setState(() {
                  _isUnderstood = true;
                });
              },
              child: const Text('Yes'),
            ),
          ],
        ),
        if (_isUnderstood) const AwesomeText(),
      ],
    );
  }
}

// 위에서 버튼을 눌러 이 위젯을 사라지게하고 나타나게 함
class AwesomeText extends StatelessWidget {
  const AwesomeText({super.key});

  // tree에서 사라졌다가 다시 나타날때마다 호출됨.
  // build 메소드 이전에 호출됨.
  @override
  StatelessElement createElement() {
    print('AwesomeText createElement called');
    return super.createElement();
  }

  @override
  Widget build(BuildContext context) {
    print('AwesomeText build called');
    return const Text('Awesome!');
  }
}
