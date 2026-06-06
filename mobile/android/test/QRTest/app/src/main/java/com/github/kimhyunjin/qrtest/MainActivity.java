package com.github.kimhyunjin.qrtest;

import static androidx.core.math.MathUtils.clamp;

import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.os.Bundle;
import android.Manifest;
import android.util.Size;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageProxy;
import androidx.camera.core.Preview;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.common.util.concurrent.ListenableFuture;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;

import java.nio.ByteBuffer;
import java.util.EnumSet;
import java.util.Hashtable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class MainActivity extends AppCompatActivity {

    private static final int CAMERA_REQUEST_CODE = 101;
    private PreviewView previewView;
    private ExecutorService cameraExecutor;
    private MultiFormatReader multiFormatReader;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);

        previewView = findViewById(R.id.previewView);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.CAMERA}, CAMERA_REQUEST_CODE);
        } else {
            startCamera();
        }

        // Setup ZXing MultiFormatReader
        Hashtable<DecodeHintType, Object> hints = new Hashtable<>();
        hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
        hints.put(DecodeHintType.POSSIBLE_FORMATS, EnumSet.of(BarcodeFormat.QR_CODE));
        hints.put(DecodeHintType.CHARACTER_SET, "UTF-8");

        multiFormatReader = new MultiFormatReader();
        multiFormatReader.setHints(hints);

        cameraExecutor = Executors.newFixedThreadPool(4);
    }

    private void startCamera() {
        ListenableFuture<ProcessCameraProvider> cameraProviderFuture = ProcessCameraProvider.getInstance(this);

        cameraProviderFuture.addListener(() -> {
            try {
                ProcessCameraProvider cameraProvider = cameraProviderFuture.get();
                bindPreview(cameraProvider);
            } catch (ExecutionException | InterruptedException e) {
                // Handle any errors (including cancellation) here.
                e.printStackTrace();
            }
        }, ContextCompat.getMainExecutor(this));
    }

    private void bindPreview(@NonNull ProcessCameraProvider cameraProvider) {
        Preview preview = new Preview.Builder()
                .build();

        CameraSelector cameraSelector = new CameraSelector.Builder()
                .requireLensFacing(CameraSelector.LENS_FACING_BACK)
                .build();

        ImageAnalysis imageAnalysis = new ImageAnalysis.Builder()
                .setTargetResolution(new Size(2560, 1440))
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build();

        imageAnalysis.setAnalyzer(cameraExecutor, new QRCodeAnalyzer());

        preview.setSurfaceProvider(previewView.getSurfaceProvider());

        cameraProvider.bindToLifecycle(this, cameraSelector, preview, imageAnalysis);
    }

    private class QRCodeAnalyzer implements ImageAnalysis.Analyzer {

        @Override
        public void analyze(@NonNull ImageProxy image) {
            if (image.getFormat() != ImageFormat.YUV_420_888) {
                image.close();
                return;
            }

            int imageWidth = image.getWidth();
            int imageHeight = image.getHeight();

            // Define the size of the central region
            int centralWidth = imageWidth / 2;
            int centralHeight = imageHeight / 2;

            // Calculate the starting position of the central region
            int centralX = (imageWidth - centralWidth) / 2;
            int centralY = (imageHeight - centralHeight) / 2;

            // ARGB array for the central region
            int[] argbArray = new int[centralWidth * centralHeight];

            ByteBuffer yBuffer = image.getPlanes()[0].getBuffer();
            ByteBuffer uBuffer = image.getPlanes()[1].getBuffer();
            ByteBuffer vBuffer = image.getPlanes()[2].getBuffer();

            int yRowStride = image.getPlanes()[0].getRowStride();
            int yPixelStride = image.getPlanes()[0].getPixelStride();
            int uvRowStride = image.getPlanes()[1].getRowStride();
            int uvPixelStride = image.getPlanes()[1].getPixelStride();

            int r, g, b;
            int yValue, uValue, vValue;

            for (int y = centralY; y < centralY + centralHeight; ++y) {
                for (int x = centralX; x < centralX + centralWidth; ++x) {
                    int yIndex = (y * yRowStride) + (x * yPixelStride);
                    yValue = (yBuffer.get(yIndex) & 0xff);

                    int uvx = x / 2;
                    int uvy = y / 2;
                    int uvIndex = (uvy * uvRowStride) + (uvx * uvPixelStride);

                    uValue = (uBuffer.get(uvIndex) & 0xff) - 128;
                    vValue = (vBuffer.get(uvIndex) & 0xff) - 128;

                    r = (int) (yValue + 1.370705f * vValue);
                    g = (int) (yValue - (0.698001f * vValue) - (0.337633f * uValue));
                    b = (int) (yValue + 1.732446f * uValue);
                    r = clamp(r, 0, 255);
                    g = clamp(g, 0, 255);
                    b = clamp(b, 0, 255);

                    int argbIndex = (y - centralY) * centralWidth + (x - centralX);
                    argbArray[argbIndex]
                            = (255 << 24) | (r & 255) << 16 | (g & 255) << 8 | (b & 255);
                }
            }

            RGBLuminanceSource source = new RGBLuminanceSource(centralWidth, centralHeight, argbArray);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));

            try {
                Result result = multiFormatReader.decodeWithState(bitmap);
                if (result != null) {
                    runOnUiThread(() -> Toast.makeText(MainActivity.this, "QR Code: " + result.getText(), Toast.LENGTH_SHORT).show());
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                image.close();
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_REQUEST_CODE && grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            startCamera();
        } else {
            Toast.makeText(this, "Camera permission is required.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        cameraExecutor.shutdown();
    }
}