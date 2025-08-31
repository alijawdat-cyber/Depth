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
        // ألوان وخلفيات وحدود (محددة) وظلال وزوايا ومسافات
        "/color$/",
        "background",
        "background-color",
        // ملاحظة: لا نستخدم نمط شامل للـ border حتى لا يمسك border-collapse
        "border",
        "/^border-(color|width|style)$/",
        "/^border-.*-(color|width|style)$/",
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
          // نسمح بالـ transparent في background أيضًا
          "background": ["none", "transparent", "/^var\\(.*\\)$/"],
          "background-color": ["transparent", "/^var\\(.*\\)$/"],
          // للسماح مؤقتًا بقيم رقمية للحدود (حتى نضيف توكنز للـ border-width)
          "border": ["none", "0", "solid", "dashed", "dotted", "/^var\\(.*\\)$/", "/^[0-9]+px$/"],
          "/^border-(color|width|style)$/": ["none", "0", "solid", "dashed", "dotted", "/^var\\(.*\\)$/", "/^[0-9]+px$/"],
          "/^border-.*-(color|width|style)$/": ["none", "0", "solid", "dashed", "dotted", "/^var\\(.*\\)$/", "/^[0-9]+px$/"],
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
    // أسماء كلاسات Mantine (CamelCase) مستثناة من النمط
    "selector-class-pattern": [
      "^([a-z][a-z0-9-]*|mantine-[A-Za-z-]+)$",
      { "resolveNestedSelectors": true }
    ],

    // نسمح بالـ id الخاص بـ Next.js
    "selector-id-pattern": "^(?:__next|[a-z][a-z0-9-]*)$",

    // نتجاهل قيود صيغة media الحديثة/بـ vars (يعالجها PostCSS)
    "media-feature-range-notation": null,

    // تليين قواعد تنسيق مزعجة في المشروع
    "declaration-block-single-line-max-declarations": null,
    "declaration-block-no-redundant-longhand-properties": null,
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
    "declaration-empty-line-before": null,
  },
  ignoreFiles: [
    "**/node_modules/**",
    ".next/**",
    "src/stories/**/*.css",
  "src/styles__backup_*/**",
  // تجاهل الملف القديم مؤقتًا لحين الحذف النهائي
  "src/styles/04-utilities/mantine.css"
  ],
};

export default config;
