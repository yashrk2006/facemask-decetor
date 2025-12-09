# Add project specific ProGuard rules here.
-keep class org.tensorflow.lite.** { *; }
-keep class com.google.mlkit.** { *; }
-keepclassmembers class * {
    @org.tensorflow.lite.annotations.UsedByReflection *;
}
