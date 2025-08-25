/**
 * Stylelint — قواعد صارمة لاستخدام CSS vars فقط للألوان/المسافات/الزوايا/الظلال
 * ورفض الوحدات الغريبة.
 */
const config = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // نرفض وحدات غير قياسية
    "unit-allowed-list": [
      "px", "rem", "em", "%", "vh", "vw", "s", "ms", "deg"
    ],

    // نلزم استخدام var(--...) للخصائص الحساسة
    "scale-unlimited/declaration-strict-value": [
      [
        // ألوان وخلفيات وحدود وظلال وزوايا ومسافات
        
        // ملاحظة: regex يطابق خصائص رئيسية
        "/color$/",
        "background",
        "background-color",
        "/^border(-.*)?$/",
        "box-shadow",
        "fill",
        "stroke",
        "border-radius",
        "margin",
        "/^margin-.*$/",
        "padding",
        "/^padding-.*$/"
      ],
      {
        ignoreValues: {
          "/color$/": ["inherit", "transparent", "currentColor", "/^var\(.*\)$/"],
          "background": ["none", "/^var\(.*\)$/"],
          "background-color": ["transparent", "/^var\(.*\)$/"],
          "/^border(-.*)?$/": ["none", "0", "/^var\(.*\)$/"],
          "box-shadow": ["none", "/^var\(.*\)$/"],
          "fill": ["none", "currentColor", "/^var\(.*\)$/"],
          "stroke": ["none", "currentColor", "/^var\(.*\)$/"],
          "border-radius": ["0", "/^var\(.*\)$/"],
          "margin": ["0", "/^var\(.*\)$/"],
          "/^margin-.*$/": ["0", "/^var\(.*\)$/"],
          "padding": ["0", "/^var\(.*\)$/"],
          "/^padding-.*$/": ["0", "/^var\(.*\)$/"]
        },
        disableFix: true,
      }
    ],

    // أشياء عامة
    "color-hex-length": "short",
    "color-named": "never",
  },
  ignoreFiles: ["**/node_modules/**", ".next/**"],
};

export default config;
