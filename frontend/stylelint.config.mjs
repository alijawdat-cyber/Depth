/**
 * Stylelint — قواعد صارمة لاستخدام CSS vars فقط للألوان/المسافات/الزوايا/الظلال
 * مع تيسير بعض القواعد لتناسب نظام التوكنز والـmedia queries المعتمدة على CSS vars.
 */
const config = {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-declaration-strict-value"],
  rules: {
    // نرفض وحدات غير قياسية (مع السماح بـ fr وقياسات viewport الحديثة)
    "unit-allowed-list": [
      "px", "rem", "em", "%", "vh", "vw", "dvh", "dvw", "s", "ms", "deg", "fr"
    ],

    // نلزم استخدام var(--...) للخصائص الحساسة
    "scale-unlimited/declaration-strict-value": [
      [
        // ألوان وخلفيات وحدود وظلال وزوايا ومسافات
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
          "/color$/": ["inherit", "transparent", "currentColor", "/^var\\(.*\\)$/"],
          "background": ["none", "/^var\\(.*\\)$/"],
          "background-color": ["transparent", "/^var\\(.*\\)$/"],
          "/^border(-.*)?$/": ["none", "0", "/^var\\(.*\\)$/"],
          "box-shadow": ["none", "/^var\\(.*\\)$/"],
          "fill": ["none", "currentColor", "/^var\\(.*\\)$/"],
          "stroke": ["none", "currentColor", "/^var\\(.*\\)$/"],
          "border-radius": ["0", "/^var\\(.*\\)$/"],
          "margin": ["0", "auto", "/^var\\(.*\\)$/"],
          "/^margin-.*$/": ["0", "auto", "/^var\\(.*\\)$/"],
          "padding": ["0", "/^var\\(.*\\)$/"],
          "/^padding-.*$/": ["0", "/^var\\(.*\\)$/"]
        },
        disableFix: true,
      }
    ],

    // تيسير قواعد نمطية حتى لا تعيقنا
    "color-hex-length": null,
    "color-named": "never",
    "color-function-notation": null,
    "alpha-value-notation": null,
    "custom-property-empty-line-before": null,
    "comment-empty-line-before": null,
    "at-rule-empty-line-before": null,
    "media-query-no-invalid": null,
    "value-keyword-case": null,
    "import-notation": "url",
    "font-family-name-quotes": null,
    "rule-empty-line-before": null,
  },
  ignoreFiles: ["**/node_modules/**", ".next/**"],
};

export default config;
