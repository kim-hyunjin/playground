---
title: "안드로이드 QR 스캔 완벽 가이드: ZXing vs Google ML Kit (전체 소스 코드)"
date: 2026-04-24
author: Gemini CLI
category: Mobile
tags: [Android, QR Code, ZXing, ML Kit, CameraX, Tutorial]
summary: "안드로이드 입문자를 위해 ZXing과 ML Kit 두 가지 방식의 전체 구현 코드를 생략 없이 상세히 제공합니다."
---

# 안드로이드 QR 스캔 완벽 가이드: ZXing vs Google ML Kit

안드로이드 앱 개발 시 QR 코드 스캔 기능을 넣는 가장 확실한 두 가지 방법인 **ZXing**과 **Google ML Kit**을 비교해 드립니다.

---

## 0. 공통 준비 (필수 설정)

### 1) 권한 설정 (AndroidManifest.xml)
카메라 권한이 없으면 앱이 바로 종료됩니다. 반드시 추가하세요.
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" android:required="true" />
```

### 2) 화면 레이아웃 (activity_main.xml)
```xml
<androidx.camera.view.PreviewView
    android:id="@+id/previewView"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

---

## 1. 전통적인 방식: ZXing (Zebra Crossing)

직접 이미지 포맷을 변환해야 해서 코드가 길지만, 구글 서비스 없이도 동작하는 장점이 있습니다.

### Step 1: 라이브러리 추가 (build.gradle)
```gradle
dependencies {
    implementation "com.google.zxing:core:3.5.3"
    implementation "androidx.camera:camera-camera2:1.3.3"
    implementation "androidx.camera:camera-lifecycle:1.3.3"
    implementation "androidx.camera:camera-view:1.3.3"
}
```

### Step 2: MainActivity 전체 코드
```java
public class MainActivity extends AppCompatActivity {
    private PreviewView previewView;
    private ExecutorService cameraExecutor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        previewView = findViewById(R.id.previewView);
        cameraExecutor = Executors.newSingleThreadExecutor();
        startCamera();
    }

    private void startCamera() {
        ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(this);
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                Preview preview = new Preview.Builder().build();
                preview.setSurfaceProvider(previewView.getSurfaceProvider());

                // 분석기 설정
                ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                    .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                    .build();
                
                // 아래 정의한 ZXingAnalyzer 클래스를 연결합니다.
                imageAnalysis.setAnalyzer(cameraExecutor, new ZXingAnalyzer());

                cameraProvider.bindToLifecycle(this, CameraSelector.DEFAULT_BACK_CAMERA, preview, imageAnalysis);
            } catch (Exception e) { e.printStackTrace(); }
        }, ContextCompat.getMainExecutor(this));
    }

    // [핵심] ZXing 분석기 클래스
    private class ZXingAnalyzer implements ImageAnalysis.Analyzer {
        private final MultiFormatReader reader = new MultiFormatReader();

        @Override
        public void analyze(@NonNull ImageProxy image) {
            // 1. 카메라의 YUV 데이터를 바이트 배열로 추출
            ByteBuffer buffer = image.getPlanes()[0].getBuffer();
            byte[] data = new byte[buffer.remaining()];
            buffer.get(data);

            // 2. ZXing용 데이터 포맷으로 변환
            PlanarYUVLuminanceSource source = new PlanarYUVLuminanceSource(
                    data, image.getWidth(), image.getHeight(),
                    0, 0, image.getWidth(), image.getHeight(), false
            );
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            try {
                // 3. QR 디코딩 시도
                Result result = reader.decode(bitmap);
                Log.d("SCAN", "QR 발견: " + result.getText());
            } catch (NotFoundException e) {
                // QR이 화면에 없을 때 발생하는 예외이므로 무시해도 됩니다.
            } finally {
                // 4. 중요: 다음 프레임을 받기 위해 이미지를 반드시 닫아줍니다!
                image.close();
            }
        }
    }
}
```

---

## 2. 현대적인 방식: Google ML Kit (추천)

구글의 인공지능을 빌려 쓰는 방식으로, 코드가 매우 간결하고 성능이 강력합니다.

### Step 1: 라이브러리 추가 (build.gradle)
```gradle
dependencies {
    implementation "com.google.mlkit:barcode-scanning:17.2.0"
    implementation "androidx.camera:camera-camera2:1.3.3"
    implementation "androidx.camera:camera-lifecycle:1.3.3"
}
```

### Step 2: MainActivity 전체 코드
```java
public class MainActivity extends AppCompatActivity {
    private PreviewView previewView;
    private ExecutorService cameraExecutor;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        previewView = findViewById(R.id.previewView);
        cameraExecutor = Executors.newSingleThreadExecutor();
        startCamera();
    }

    private void startCamera() {
        ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(this);
        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                Preview preview = new Preview.Builder().build();
                preview.setSurfaceProvider(previewView.getSurfaceProvider());

                // 1. ML Kit 스캐너 설정 (QR 전용)
                BarcodeScanner scanner = BarcodeScanning.getClient(
                    new BarcodeScannerOptions.Builder()
                        .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                        .build()
                );

                // 2. 이미지 분석기 설정
                ImageAnalysis imageAnalysis = new ImageAnalysis.Builder().build();
                imageAnalysis.setAnalyzer(cameraExecutor, imageProxy -> {
                    processImageWithMLKit(scanner, imageProxy);
                });

                cameraProvider.bindToLifecycle(this, CameraSelector.DEFAULT_BACK_CAMERA, preview, imageAnalysis);
            } catch (Exception e) { e.printStackTrace(); }
        }, ContextCompat.getMainExecutor(this));
    }

    // [핵심] ML Kit 이미지 처리 함수
    @OptIn(markerClass = ExperimentalGetImage.class)
    private void processImageWithMLKit(BarcodeScanner scanner, ImageProxy imageProxy) {
        Image mediaImage = imageProxy.getImage();
        if (mediaImage != null) {
            // CameraX 이미지를 ML Kit 이미지로 즉시 변환 (직접 변환 로직 불필요!)
            InputImage image = InputImage.fromMediaImage(mediaImage, imageProxy.getImageInfo().getRotationDegrees());

            scanner.process(image)
                .addOnSuccessListener(barcodes -> {
                    for (Barcode barcode : barcodes) {
                        Log.d("SCAN", "QR 발견: " + barcode.getRawValue());
                    }
                })
                .addOnFailureListener(e -> e.printStackTrace())
                .addOnCompleteListener(task -> imageProxy.close()); // 작업 완료 후 이미지 닫기
        }
    }
}

---
**작성자: Gemini CLI**  
*AI와 협업하여 더 나은 코드를 만드는 방법을 고민합니다.*
