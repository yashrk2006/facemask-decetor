package com.facemask.detector

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Rect
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil
import org.tensorflow.lite.support.image.ImageProcessor
import org.tensorflow.lite.support.image.TensorImage
import org.tensorflow.lite.support.image.ops.ResizeOp
import com.google.mlkit.vision.face.Face
import java.nio.ByteBuffer
import java.nio.ByteOrder

data class MaskDetectionResult(
    val boundingBox: Rect,
    val hasMask: Boolean,
    val confidence: Float
)

class MaskDetector(private val context: Context) {
    
    private var interpreter: Interpreter? = null
    private val inputSize = 224
    private val labels = listOf("without_mask", "with_mask")

    init {
        try {
            val model = FileUtil.loadMappedFile(context, "face_mask_detection.tflite")
            val options = Interpreter.Options().apply {
                setNumThreads(4)
                setUseNNAPI(true)
            }
            interpreter = Interpreter(model, options)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun detectMask(bitmap: Bitmap, faces: List<Face>): List<MaskDetectionResult> {
        val results = mutableListOf<MaskDetectionResult>()

        for (face in faces) {
            try {
                val boundingBox = face.boundingBox
                
                // Ensure bounding box is within bitmap bounds
                val left = maxOf(0, boundingBox.left)
                val top = maxOf(0, boundingBox.top)
                val right = minOf(bitmap.width, boundingBox.right)
                val bottom = minOf(bitmap.height, boundingBox.bottom)
                
                if (right <= left || bottom <= top) continue
                
                // Crop face from bitmap
                val faceBitmap = Bitmap.createBitmap(
                    bitmap,
                    left,
                    top,
                    right - left,
                    bottom - top
                )

                // Preprocess and run inference
                val prediction = runInference(faceBitmap)
                
                results.add(
                    MaskDetectionResult(
                        boundingBox = boundingBox,
                        hasMask = prediction.second == 1,
                        confidence = prediction.first
                    )
                )
                
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        return results
    }

    private fun runInference(bitmap: Bitmap): Pair<Float, Int> {
        if (interpreter == null) {
            return Pair(0f, 0)
        }

        try {
            // Resize bitmap to input size
            val resizedBitmap = Bitmap.createScaledBitmap(bitmap, inputSize, inputSize, true)
            
            // Convert bitmap to ByteBuffer
            val inputBuffer = convertBitmapToByteBuffer(resizedBitmap)
            
            // Output array
            val output = Array(1) { FloatArray(2) }
            
            // Run inference
            interpreter?.run(inputBuffer, output)
            
            // Get prediction
            val scores = output[0]
            val maxIndex = if (scores[0] > scores[1]) 0 else 1
            val confidence = scores[maxIndex]
            
            return Pair(confidence, maxIndex)
            
        } catch (e: Exception) {
            e.printStackTrace()
            return Pair(0f, 0)
        }
    }

    private fun convertBitmapToByteBuffer(bitmap: Bitmap): ByteBuffer {
        val byteBuffer = ByteBuffer.allocateDirect(4 * inputSize * inputSize * 3)
        byteBuffer.order(ByteOrder.nativeOrder())
        
        val intValues = IntArray(inputSize * inputSize)
        bitmap.getPixels(intValues, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)
        
        var pixel = 0
        for (i in 0 until inputSize) {
            for (j in 0 until inputSize) {
                val value = intValues[pixel++]
                
                // Normalize to [0, 1]
                byteBuffer.putFloat(((value shr 16 and 0xFF) / 255.0f))
                byteBuffer.putFloat(((value shr 8 and 0xFF) / 255.0f))
                byteBuffer.putFloat(((value and 0xFF) / 255.0f))
            }
        }
        
        return byteBuffer
    }

    fun close() {
        interpreter?.close()
        interpreter = null
    }
}
